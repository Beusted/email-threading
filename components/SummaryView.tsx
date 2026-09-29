"use client";

import { useMemo, useState } from "react";
import type { ThreadModel } from "@/lib/thread";
import { color } from "@/lib/tokens";
import { CloseIcon, InfoIcon, SearchIcon, SparkleIcon } from "./icons";
import styles from "./SummaryView.module.css";

interface Props {
  model: ThreadModel;
  onPick: (idx: number) => void;
}

export function SummaryView({ model, onPick }: Props) {
  const { accent } = model;
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const shown = useMemo(() => {
    if (!q) return model.msgs;
    return model.msgs.filter((m) => {
      const line = m.summary ?? m.body.split("\n")[0];
      return (
        m.name.toLowerCase().includes(q) ||
        line.toLowerCase().includes(q) ||
        m.body.toLowerCase().includes(q)
      );
    });
  }, [q, model.msgs]);

  return (
    <div className={styles.wrap} style={{ maxWidth: model.tlMax }}>
      <div className={styles.legend}>
        <span className={styles.legendTitle}>
          <SparkleIcon size={15} style={{ color: "var(--sparkle)" }} />
          AI summaries
        </span>
        <span>One line per message. Click to open the source email.</span>
      </div>

      <label className={styles.search}>
        <SearchIcon size={18} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search summaries"
          className={styles.searchInput}
          aria-label="Search summaries"
        />
        {query && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            <CloseIcon size={16} />
          </button>
        )}
      </label>

      {shown.length === 0 ? (
        <p className={styles.empty}>No summaries match “{query.trim()}”.</p>
      ) : (
        <div className={styles.list}>
          {shown.map((m) => {
          const selected = model.showReader && m.idx === model.selIdx;
          // Fallback preview matches the branch node's: summary or first body line.
          const line = m.summary ?? m.body.split("\n")[0];
          return (
            <button
              key={m.idx}
              id={`summary-${m.idx}`}
              type="button"
              className={`card ${styles.row}`}
              onClick={() => onPick(m.idx)}
              aria-label={m.aria}
              style={{
                border: `1px solid ${selected ? accent : color.borderSoft}`,
                boxShadow: selected ? `0 0 0 2px ${accent}` : "none",
                background: selected ? color.unreadBg : color.card,
              }}
            >
              <span className={styles.bullet} style={{ background: m.hasSummary ? accent : color.dotIdle }} />
              <div className={styles.avatar} style={{ background: m.avBg, color: m.avFg }}>
                {m.initials}
              </div>
              <div className={styles.body}>
                <div className={styles.headline}>
                  <span className={styles.name} style={{ fontWeight: m.nameWeight }}>
                    {m.name}
                  </span>
                  {m.isAsk && <span className={styles.askBadge}>Asks you</span>}
                  <span className={styles.when}>{m.time}</span>
                </div>
                <div className={styles.line}>
                  {m.hasSummary && <SparkleIcon size={14} style={{ color: "var(--sparkle)", flexShrink: 0 }} />}
                  <span className={styles.lineText}>{line}</span>
                </div>
                {m.failed && (
                  <div className={styles.note}>
                    <InfoIcon size={13} />
                    <span>Summary unavailable. Showing the start of the email.</span>
                  </div>
                )}
              </div>
            </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
