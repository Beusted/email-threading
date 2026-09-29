"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./Popover.module.css";

interface Props {
  /** Trigger button contents. */
  button: ReactNode;
  /** Menu contents; receives a `close` callback. */
  children: (close: () => void) => ReactNode;
  triggerClassName?: string;
  ariaLabel: string;
  align?: "left" | "right";
}

export function Popover({ button, children, triggerClassName, ariaLabel, align = "left" }: Props) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={styles.root} ref={root}>
      <button
        type="button"
        className={triggerClassName}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
      >
        {button}
      </button>
      {open && (
        <div className={`${styles.menu} ${align === "right" ? styles.right : ""}`} role="menu">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}
