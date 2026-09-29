"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SplitModal.module.css";

interface Props {
  branchLabel: string;
  defaultName: string;
  count: number;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

export function SplitModal({ branchLabel, defaultName, count, onConfirm, onCancel }: Props) {
  const [name, setName] = useState(defaultName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className={styles.scrim} onMouseDown={onCancel}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Move branch to a new thread" onMouseDown={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Move to a new thread</h2>
        <p className={styles.sub}>
          Moves the {count} messages in the <strong>{branchLabel}</strong> branch into their own thread. Both threads link to each other.
        </p>
        <label className={styles.label} htmlFor="split-name">
          New thread name
        </label>
        <input
          id="split-name"
          ref={inputRef}
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && name.trim() && onConfirm(name.trim())}
        />
        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className={styles.confirm} disabled={!name.trim()} onClick={() => onConfirm(name.trim())}>
            Move messages
          </button>
        </div>
      </div>
    </div>
  );
}
