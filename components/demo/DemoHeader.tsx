"use client";

import { useState, type Dispatch } from "react";
import Link from "next/link";
import { ArchiveIcon, BackIcon, PaperclipIcon, PinIcon, SparkleIcon, TrashIcon } from "@/components/icons";
import { QUESTIONS } from "@/lib/demo/qa";
import type { HeaderVM } from "@/lib/demo/selectors";
import type { Action, View } from "@/lib/demo/store";
import styles from "./DemoHeader.module.css";

interface Props {
  header: HeaderVM;
  view: View;
  pinnedMessage: string | null;
  dispatch: Dispatch<Action>;
  onOpenFiles: () => void;
  onOpenDecision: (messageId: string) => void;
  onAsk: (q: string) => void;
}

const VIEWS: { id: View; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "timeline", label: "Timeline" },
  { id: "branches", label: "Branches" },
];

export function DemoHeader({ header, view, pinnedMessage, dispatch, onOpenFiles, onOpenDecision, onAsk }: Props) {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);

  const submit = (value: string) => {
    if (!value.trim()) return;
    onAsk(value.trim());
    setQ("");
    setFocused(false);
  };

  return (
    <header className={styles.wrap}>
      <div className={styles.toolbar}>
        <div className={styles.toolLeft}>
          <Link href="/" className={`ghost ${styles.iconBtn}`} aria-label="Back to inbox">
            <BackIcon size={20} />
          </Link>
          <button type="button" className={`ghost ${styles.iconBtn}`} aria-label="Archive">
            <ArchiveIcon size={20} />
          </button>
          <button type="button" className={`ghost ${styles.iconBtn}`} aria-label="Delete">
            <TrashIcon size={20} />
          </button>
        </div>

        <div className={styles.askWrap}>
          <label className={styles.ask}>
            <SparkleIcon size={16} style={{ color: "var(--sparkle)" }} />
            <input
              className={styles.askInput}
              placeholder="Ask about this thread"
              aria-label="Ask about this thread"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 120)}
              onKeyDown={(e) => e.key === "Enter" && submit(q)}
            />
          </label>
          {focused && (
            <div className={styles.suggest}>
              <div className={styles.suggestHead}>Try asking</div>
              {QUESTIONS.map((item) => (
                <button key={item.q} type="button" className={styles.suggestItem} onMouseDown={() => submit(item.q)}>
                  {item.q}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.headRow}>
        <div className={styles.titleCol}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{header.subject}</h1>
            <span className={styles.labelChip}>{header.label.text}</span>
          </div>

          <div className={styles.chipRow}>
            <span className={styles.chip}>{header.messageCount} messages</span>
            {header.newCount > 0 && (
              <span className={styles.newChip}>
                <span className={styles.newDot} />
                {header.newCount} new
              </span>
            )}
            <button type="button" className={`chip ${styles.chip} ${styles.chipBtn}`} onClick={onOpenFiles}>
              <PaperclipIcon size={14} />
              {header.fileCount} files, {header.linkCount} links
            </button>
            <button
              type="button"
              className={styles.pinnedChip}
              onClick={() => onOpenDecision(header.pinnedDecision.messageId)}
            >
              <PinIcon size={14} />
              <span className={styles.pinnedLabel}>Pinned</span>
              <span className={styles.pinnedText}>Decision: {header.pinnedDecision.text}</span>
            </button>
            {pinnedMessage && (
              <span className={styles.pinnedMsg}>
                <PinIcon size={13} />
                Pinned message · {pinnedMessage}
              </span>
            )}
          </div>
        </div>

        <div className={styles.switcher} role="tablist" aria-label="Thread view">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={view === v.id}
              className={`${styles.switchBtn} ${view === v.id ? styles.switchOn : ""}`}
              onClick={() => dispatch({ type: "SET_VIEW", view: v.id })}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
