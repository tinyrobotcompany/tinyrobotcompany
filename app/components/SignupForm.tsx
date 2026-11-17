"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import styles from "./signupForm.module.css";
import { RightArrow } from "./Icons";
import { EMAIL } from "../data/site";
import {
  emptySignup,
  hasBeta,
  hasDevice,
  INTERESTS,
  productsFromQuery,
  signupMailto,
  signupPayload,
  validateSignup,
  type Interest,
  type SignupErrors,
  type SignupProduct,
  type SignupValues,
} from "../lib/signup";

type Status = "idle" | "sending" | "sent" | "error";

const noSubscribe = () => () => {};

/**
 * Waitlist + beta sign-up. Posts to the form backend when an access key is
 * configured; until then it opens the visitor's email app, pre-filled.
 */
export function SignupForm({
  products,
  endpoint,
  accessKey,
}: {
  products: SignupProduct[];
  endpoint: string;
  accessKey: string | null;
}) {
  // "?for=pico-pie" pre-selects a product. Read without an effect; the server renders none selected.
  const search = useSyncExternalStore(noSubscribe, () => window.location.search, () => "");
  const [values, setValues] = useState<SignupValues>(emptySignup);
  const [touchedProducts, setTouchedProducts] = useState(false);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const current: SignupValues = touchedProducts ? values : { ...values, products: productsFromQuery(search, products) };
  const set = <K extends keyof SignupValues>(key: K, value: SignupValues[K]) => setValues({ ...current, [key]: value });

  const toggle = (slug: string) => {
    setTouchedProducts(true);
    const products = current.products.includes(slug)
      ? current.products.filter((s) => s !== slug)
      : [...current.products, slug];
    setValues({ ...current, products });
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if ((form.elements.namedItem("botcheck") as HTMLInputElement | null)?.checked) return; // bots tick hidden boxes
    const found = validateSignup(current);
    setErrors(found);
    if (Object.keys(found).length) return;

    if (!accessKey) {
      window.location.href = signupMailto(current, products);
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(signupPayload(current, products, accessKey)),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean };
      setStatus(res.ok && data.success !== false ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className={styles.done} role="status">
        <p className={styles.doneTitle}>You&rsquo;re on the list.</p>
        <p>
          I&rsquo;ll email {current.email.trim()} when there&rsquo;s news.
          {hasBeta(current, products) && " Beta invitations arrive from Apple’s TestFlight."}
        </p>
      </div>
    );
  }

  const groups: { list: SignupProduct["list"]; title: string }[] = [
    { list: "beta", title: "App betas" },
    { list: "waitlist", title: "Device waitlists" },
  ];

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <fieldset className={styles.fieldset} aria-describedby={errors.products ? "err-products" : undefined}>
        <legend className={styles.legend}>What would you like to join?</legend>
        {groups.map((g) => (
          <div key={g.list} className={styles.group}>
            <div className={styles.groupTitle}>{g.title}</div>
            <div className={styles.options}>
              {products.filter((p) => p.list === g.list).map((p) => (
                <label key={p.slug} className={styles.option}>
                  <input
                    type="checkbox"
                    name="products"
                    value={p.slug}
                    checked={current.products.includes(p.slug)}
                    onChange={() => toggle(p.slug)}
                  />
                  <span className={styles.optionText}>
                    <span className={styles.optionName}>{p.name}</span>
                    <span className={styles.optionNote}>{p.note}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
        {errors.products && <p id="err-products" className={styles.error}>{errors.products}</p>}
      </fieldset>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.label}>Name <span className={styles.optional}>optional</span></span>
          <input type="text" name="name" autoComplete="name" value={current.name} onChange={(e) => set("name", e.target.value)} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={current.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "err-email" : undefined}
          />
          {errors.email && <span id="err-email" className={styles.error}>{errors.email}</span>}
        </label>
      </div>

      {hasBeta(current, products) && (
        <label className={styles.field}>
          <span className={styles.label}>
            Apple ID email for TestFlight <span className={styles.optional}>only if different</span>
          </span>
          <input
            type="email"
            name="appleId"
            value={current.appleId}
            onChange={(e) => set("appleId", e.target.value)}
            aria-invalid={!!errors.appleId}
            aria-describedby={errors.appleId ? "err-apple" : undefined}
          />
          {errors.appleId && <span id="err-apple" className={styles.error}>{errors.appleId}</span>}
        </label>
      )}

      {hasDevice(current, products) && (
        <fieldset className={styles.fieldset}>
          <legend className={styles.label}>For the devices, I&rsquo;d like to <span className={styles.optional}>optional</span></legend>
          <div className={styles.chips}>
            {(Object.keys(INTERESTS) as Interest[]).map((k) => (
              <label key={k} className={styles.chip}>
                <input type="radio" name="interest" value={k} checked={current.interest === k} onChange={() => set("interest", k)} />
                <span>{INTERESTS[k]}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <label className={styles.field}>
        <span className={styles.label}>Anything else? <span className={styles.optional}>optional</span></span>
        <textarea name="message" rows={3} value={current.message} onChange={(e) => set("message", e.target.value)} />
      </label>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <input type="checkbox" name="botcheck" className={styles.honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <label className={styles.consent}>
        <input
          type="checkbox"
          name="consent"
          checked={current.consent}
          onChange={(e) => set("consent", e.target.checked)}
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? "err-consent" : undefined}
        />
        <span>
          Email me about the products I picked. No newsletter, no sharing; unsubscribe any time. See the{" "}
          <a href="/privacy/">privacy policy</a>.
        </span>
      </label>
      {errors.consent && <p id="err-consent" className={styles.error}>{errors.consent}</p>}

      <div className={styles.submitRow}>
        <button type="submit" className={styles.submit} disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Join"} <RightArrow />
        </button>
        <span className={styles.hint} role="status" aria-live="polite">
          {status === "error"
            ? `Something went wrong. Please try again, or email ${EMAIL}.`
            : accessKey
              ? "One email when there’s news. That’s it."
              : "Opens your email app with everything filled in."}
        </span>
      </div>
    </form>
  );
}
