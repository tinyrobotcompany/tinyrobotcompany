import type { ReactNode } from "react";
import { introCallLink } from "../data/site";

/** A link to book the free intro call: the booking page when configured, otherwise an email. */
export function IntroCallLink({ className, children }: { className?: string; children: ReactNode }) {
  const link = introCallLink();
  return link.external ? (
    <a className={className} href={link.href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <a className={className} href={link.href}>
      {children}
    </a>
  );
}
