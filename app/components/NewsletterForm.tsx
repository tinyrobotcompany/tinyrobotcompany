"use client";

import { useState, type FormEvent } from "react";
import styles from "./signupForm.module.css";
import { RightArrow } from "./Icons";
import { EMAIL } from "../data/site";
import {
  emptyNewsletter,
  newsletterBody,
  newsletterEndpoint,
  validateNewsletter,
  type NewsletterErrors,
  type NewsletterValues,
} from "../lib/newsletter";

type Status = "idle" | "sending" | "sent" | "error";

/** Weekly Brief sign-up. Posts to MailerLite, which emails a confirmation link (double opt-in). */
export function NewsletterForm({ idPrefix = "nl" }: { idPrefix?: string }) {
  const [values, setValues] = useState<NewsletterValues>(emptyNewsletter);
  const [errors, setErrors] = useState<NewsletterErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const set = <K extends keyof NewsletterValues>(key: K, value: NewsletterValues[K]) =>
    setValues({ ...values, [key]: value });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if ((form.elements.namedItem("botcheck") as HTMLInputElement | null)?.checked) return; // bots tick hidden boxes
    const found = validateNewsletter(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("sending");
    try {
      const res = await fetch(newsletterEndpoint(), { method: "POST", body: newsletterBody(values) });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean };
      setStatus(res.ok && data.success !== false ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className={styles.done} role="status">
        <p className={styles.doneTitle}>Almost there. Check your inbox.</p>
        <p>
          I&rsquo;ve sent a confirmation link to {values.email.trim()}. Click it and the Weekly Brief starts
          arriving on Mondays.
        </p>
      </div>
    );
  }

  const err = (k: keyof NewsletterErrors) => `${idPrefix}-err-${k}`;

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.label}>First name <span className={styles.optional}>optional</span></span>
          <input type="text" name="name" autoComplete="given-name" value={values.name} onChange={(e) => set("name", e.target.value)} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? err("email") : undefined}
          />
          {errors.email && <span id={err("email")} className={styles.error}>{errors.email}</span>}
        </label>
      </div>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <input type="checkbox" name="botcheck" className={styles.honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <label className={styles.consent}>
        <input
          type="checkbox"
          name="consent"
          checked={values.consent}
          onChange={(e) => set("consent", e.target.checked)}
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? err("consent") : undefined}
        />
        <span>
          Send me the Weekly Brief by email. One email a week, unsubscribe any time with one click. See the{" "}
          <a href="/privacy/">privacy policy</a>.
        </span>
      </label>
      {errors.consent && <p id={err("consent")} className={styles.error}>{errors.consent}</p>}

      <div className={styles.submitRow}>
        <button type="submit" className={styles.submit} disabled={status === "sending"}>
          {status === "sending" ? "Subscribing…" : "Subscribe"} <RightArrow />
        </button>
        <span className={styles.hint} role="status" aria-live="polite">
          {status === "error"
            ? `Something went wrong. Please try again, or email ${EMAIL}.`
            : "Free. One email every Monday."}
        </span>
      </div>
    </form>
  );
}
