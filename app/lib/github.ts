import type { Work } from "../data/works";

/** Refresh release tags at most every 6 hours. */
const REVALIDATE_SECONDS = 60 * 60 * 6;

/**
 * Latest published release tag for a work's repo, e.g. "v0.20.13".
 * Falls back to the version recorded in works.ts if GitHub is
 * unreachable, rate-limited, or the repo has no releases — the page
 * must never fail to build over a version label.
 */
export async function latestVersion(work: Work): Promise<string> {
  const { owner, name } = work.repo;
  const headers: HeadersInit = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${name}/releases/latest`, {
      headers,
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return work.fallbackVersion;
    const { tag_name } = (await res.json()) as { tag_name?: string };
    return tag_name?.trim() || work.fallbackVersion;
  } catch {
    return work.fallbackVersion;
  }
}

export async function latestVersions(works: Work[]): Promise<Record<string, string>> {
  const entries = await Promise.all(works.map(async (w) => [w.slug, await latestVersion(w)] as const));
  return Object.fromEntries(entries);
}
