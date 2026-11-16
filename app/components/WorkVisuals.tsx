import Image from "next/image";
import type { Work } from "../data/works";
import styles from "./workVisuals.module.css";

/** Three-node "input → brain → output" strip. */
export function FlowStrip({ flow, className }: { flow: Work["flow"]; className?: string }) {
  return (
    <div className={`${styles.flow} ${className ?? ""}`} aria-hidden="true">
      {flow.map((node, i) => (
        <div key={node.label} className={styles.flowCell}>
          {i > 0 && <span className={styles.flowArrow}>→</span>}
          <div className={styles.flowNode}>
            {node.label}
            <small>{node.sub}</small>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Row of character renders on a light "render plate". */
export function CharacterPlate({
  characters,
  showNames = false,
  priority = false,
}: {
  characters: { src: string; name: string }[];
  showNames?: boolean;
  priority?: boolean;
}) {
  return (
    <div className={styles.plate}>
      {characters.map((c) => (
        <figure key={c.name} className={styles.character}>
          <Image
            src={c.src}
            alt={showNames ? "" : `${c.name}, a Pico Pie character`}
            width={200}
            height={270}
            unoptimized
            priority={priority}
          />
          {showNames && <figcaption>{c.name}</figcaption>}
        </figure>
      ))}
    </div>
  );
}

export function AppIcon({ src, name, size = 40 }: { src: string; name: string; size?: number }) {
  return (
    <Image
      className={styles.appIcon}
      src={src}
      alt={`${name} app icon`}
      width={size}
      height={size}
      unoptimized
      style={{ borderRadius: size * 0.225 }}
    />
  );
}
