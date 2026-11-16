import { afterEach, describe, expect, it, vi } from "vitest";
import { getWork } from "../data/works";
import { latestVersion, latestVersions } from "./github";

const voxa = getWork("voxa")!;

const respond = (status: number, body: unknown) =>
  // A fresh Response per call: a body can only be read once.
  vi.fn().mockImplementation(async () => new Response(JSON.stringify(body), { status }));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("latestVersion", () => {
  it("returns the latest release tag", async () => {
    const fetchMock = respond(200, { tag_name: "v9.9.9" });
    vi.stubGlobal("fetch", fetchMock);

    await expect(latestVersion(voxa)).resolves.toBe("v9.9.9");
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.github.com/repos/simonholmes001/voxa/releases/latest");
  });

  it("falls back when the repo has no releases", async () => {
    vi.stubGlobal("fetch", respond(404, { message: "Not Found" }));
    await expect(latestVersion(voxa)).resolves.toBe(voxa.fallbackVersion);
  });

  it("falls back when rate-limited", async () => {
    vi.stubGlobal("fetch", respond(403, { message: "API rate limit exceeded" }));
    await expect(latestVersion(voxa)).resolves.toBe(voxa.fallbackVersion);
  });

  it("falls back on network errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));
    await expect(latestVersion(voxa)).resolves.toBe(voxa.fallbackVersion);
  });

  it("falls back on an empty tag", async () => {
    vi.stubGlobal("fetch", respond(200, { tag_name: "  " }));
    await expect(latestVersion(voxa)).resolves.toBe(voxa.fallbackVersion);
  });

  it("authenticates when GITHUB_TOKEN is set", async () => {
    vi.stubEnv("GITHUB_TOKEN", "test-token");
    const fetchMock = respond(200, { tag_name: "v1.0.0" });
    vi.stubGlobal("fetch", fetchMock);

    await latestVersion(voxa);
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer test-token");
  });

  it("sends no auth header without a token", async () => {
    vi.stubEnv("GITHUB_TOKEN", "");
    const fetchMock = respond(200, { tag_name: "v1.0.0" });
    vi.stubGlobal("fetch", fetchMock);

    await latestVersion(voxa);
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });
});

describe("latestVersions", () => {
  it("maps every work to a version", async () => {
    vi.stubGlobal("fetch", respond(200, { tag_name: "v1.2.3" }));
    const tempo = getWork("tempo")!;
    await expect(latestVersions([voxa, tempo])).resolves.toEqual({ voxa: "v1.2.3", tempo: "v1.2.3" });
  });
});
