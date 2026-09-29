import type { MessageVM } from "@/lib/thread";
import { InfoIcon, PaperclipIcon, ReplyIcon, SparkleIcon, UserPlusIcon } from "./icons";
import { ItemChips } from "./ItemChips";
import styles from "./MessageRow.module.css";

interface Props {
  m: MessageVM;
  accent: string;
  onPick: (idx: number) => void;
  onToggle: (idx: number) => void;
  onGoParent: (parentIdx: number) => void;
  onShowEarly: () => void;
}

export function MessageRow({ m, accent, onPick, onToggle, onGoParent, onShowEarly }: Props) {
  return (
    <div>
      {m.collapsedHead && (
        <div className={styles.collapsedRow}>
          <div className={styles.collapsedRail}>
            <span className={styles.earlyBadge}>
              <PaperclipIcon size={14} />
              {m.earlyItems}
            </span>
          </div>
          <div className={styles.collapsedDotCol}>
            <div className={styles.collapsedDot} />
          </div>
          <button type="button" className={`card ${styles.collapsedCard}`} onClick={onShowEarly}>
            <span style={{ fontWeight: 600 }}>{m.earlyLabel}</span>
            <span style={{ color: "var(--muted2)" }}>{m.earlyDateLabel} · all read</span>
            <span style={{ marginLeft: "auto", fontWeight: 600, color: accent }}>Show</span>
          </button>
        </div>
      )}

      {m.visible && (
        <div>
          {m.showDate && (
            <div className={styles.dateRow}>
              <div className={styles.dateTick} />
              <span className={styles.dateLabel}>{m.dateLabel}</span>
              <span className={styles.gapLabel}>{m.gapLabel}</span>
            </div>
          )}

          {m.showNew && (
            <div className={styles.newRow} style={{ color: accent }}>
              <div className={styles.newTick} style={{ background: accent }} />
              <span>New since you last opened</span>
              <span style={{ fontWeight: 500, color: "var(--muted2)" }}>
                {m.dateLabel} {m.gapLabel}
              </span>
              <div className={styles.newLine} style={{ background: accent }} />
            </div>
          )}

          {m.hasEvent && (
            <div className={styles.eventRow} style={{ opacity: m.opacity }}>
              <div className={styles.eventTick} />
              <UserPlusIcon size={16} />
              <span>{m.event}</span>
            </div>
          )}

          <div id={`msg-${m.idx}`} className={styles.row} style={{ opacity: m.opacity }}>
            <ItemChips m={m} onToggle={onToggle} />

            <div className={styles.dotCol} style={{ paddingTop: m.dotTop }}>
              <div className={styles.dot} style={{ background: m.dotBg, border: `2px solid ${m.dotBorder}` }} />
            </div>

            <div
              className={`card ${styles.card}`}
              style={{ background: m.cardBg, border: `1px solid ${m.cardBorder}`, boxShadow: m.ring }}
            >
              {m.hasChip && (
                <button
                  type="button"
                  className={`reply ${styles.parentChip}`}
                  onClick={() => m.parentIdx !== null && onGoParent(m.parentIdx)}
                  aria-label={m.chipAria}
                >
                  <ReplyIcon size={14} />
                  <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{m.chipName}</span>
                  <span className={styles.chipTopic}>{m.chipTopic}</span>
                </button>
              )}

              <button
                type="button"
                className={styles.pickBtn}
                onClick={() => onPick(m.idx)}
                aria-label={m.aria}
                style={{ paddingTop: m.btnPadTop }}
              >
                <div className={styles.headline}>
                  <div className={styles.avatar} style={{ background: m.avBg, color: m.avFg }}>
                    {m.initials}
                  </div>
                  <span className={styles.name} style={{ fontWeight: m.nameWeight }}>
                    {m.name}
                  </span>
                  {m.isAsk && <span className={styles.askBadge}>Asks you</span>}
                  <span className={styles.time}>{m.time}</span>
                </div>

                {m.hasSummary && (
                  <div className={styles.summary}>
                    <SparkleIcon size={15} style={{ color: "var(--sparkle)", marginTop: 3 }} />
                    <span>{m.summary}</span>
                  </div>
                )}

                {m.failed && (
                  <div className={styles.failedWrap}>
                    <div className={`clamp2 ${styles.failedBody}`}>{m.body}</div>
                    <div className={styles.failedNote}>
                      <InfoIcon size={14} />
                      <span>Summary unavailable. Showing the start of the email.</span>
                    </div>
                  </div>
                )}

                {m.plain && <div className={styles.plainBody}>{m.body}</div>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
