import type { ReactNode } from "react";
import { introCallLink, type IntroCall } from "../data/site";

/** A link to book the free intro call: the booking page when configured, otherwise an email. */
export function IntroCallLink({
  className,
  children,
  link = introCallLink(),
}: {
  className?: string;
  children: ReactNode;
  /** Defaults to the plain intro call; pass a pre-filled link (e.g. from serviceCta). */
  link?: IntroCall;
}) {
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
