"use client";

import { useId, useState, type ReactNode } from "react";
import { BackIcon } from "./Icons";
import styles from "./Collapse.module.css";

type CollapseProps = {
  title: string;
  children: ReactNode;
};

/**
 * Block with a title button that opens or closes its content (open at first).
 * Closed content is inert: it can't be focused and screen readers skip it.
 */
export default function Collapse({ title, children }: CollapseProps) {
  const [open, setOpen] = useState(true);
  const id = useId();

  return (
    <div>
      <h2 className={styles.title}>
        <button
          type="button"
          className={styles.button}
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen(!open)}
        >
          {title}
          <BackIcon />
        </button>
      </h2>
      <div id={id} className={`${styles.content} ${open ? "" : styles.closed}`} inert={!open}>
        <div className={styles.inner}>
          <div className={styles.body}>{children}</div>
        </div>
      </div>
    </div>
  );
}
