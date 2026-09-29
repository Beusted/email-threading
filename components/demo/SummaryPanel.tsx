import type { Dispatch } from "react";
import { CheckIcon, SparkleIcon } from "@/components/icons";
import { SINCE_RECAP } from "@/lib/demo/data";
import { fmtDay, LAST_VISITED } from "@/lib/demo/dates";
import { allMessages, decided, needsYou } from "@/lib/demo/selectors";
import type { Action, DemoState } from "@/lib/demo/store";
import styles from "./SummaryPanel.module.css";

interface Props {
  state: DemoState;
  dispatch: Dispatch<Action>;
}

export function SummaryPanel({ state, dispatch }: Props) {
  const { open, done } = needsYou(state);
  const rows = allMessages(state);
  const decisions = decided();

  return (
    <div className={styles.wrap}>
      {/* Since you last looked */}
      <section className={styles.since}>
        <SparkleIcon size={16} style={{ color: "var(--sparkle)", flexShrink: 0, marginTop: 2 }} />
        <div>
          <div className={styles.sinceHead}>Since you last looked, {fmtDay(LAST_VISITED)}</div>
          <div className={styles.sinceBody}>{SINCE_RECAP}</div>
        </div>
      </section>

      {/* Needs you */}
      <section className={styles.block}>
        <div className={styles.blockHead}>
          <h2 className={styles.h2}>Needs you</h2>
          <span className={styles.sub}>
            {open.length} open{open.length ? ", sorted by due date" : ""}
          </span>
        </div>

        {open.length === 0 && done.length === 0 && (
          <p className={styles.empty}>Nothing needs you in this thread.</p>
        )}

        {open.map((it) => {
          const selected = state.selectedId === it.message.id;
          return (
            <div key={it.ask.id} className={`${styles.ask} ${selected ? styles.askOn : ""}`}>
              <div className={styles.askTop}>
                <span className={`${styles.tag} ${it.tag === "due-tomorrow" ? styles.tagDue : styles.tagAsks}`}>
                  {it.tag === "due-tomorrow" ? "Due tomorrow" : "Asks you"}
                </span>
                <span className={styles.askMeta}>{it.meta}</span>
                {it.reminderLabel && (
                  <span className={styles.reminderChip}>Reminder · {it.reminderLabel}</span>
                )}
              </div>
              <button type="button" className={styles.askText} onClick={() => dispatch({ type: "SELECT", id: it.message.id })}>
                {it.ask.text}
              </button>
              <div className={styles.askActions}>
                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={() => {
                    dispatch({ type: "SELECT", id: it.message.id });
                    dispatch({ type: "REPLY", messageId: it.message.id });
                  }}
                >
                  Reply
                </button>
                <button type="button" className={styles.btnGhost} onClick={() => dispatch({ type: "SELECT", id: it.message.id })}>
                  Remind me
                </button>
                <button type="button" className={styles.btnGhost} onClick={() => dispatch({ type: "MARK_ASK_DONE", askId: it.ask.id })}>
                  Mark done
                </button>
                <button type="button" className={styles.btnPlain} onClick={() => dispatch({ type: "DISMISS_ASK", askId: it.ask.id })}>
                  Not for me
                </button>
              </div>
            </div>
          );
        })}

        {done.map((it) => (
          <div key={it.ask.id} className={styles.doneRow}>
            <span className={styles.doneCheck}>
              <CheckIcon size={14} />
            </span>
            <span className={styles.doneText}>{it.ask.text}</span>
            <span className={styles.doneNote}>{it.note}</span>
          </div>
        ))}
      </section>

      {/* Decided so far */}
      <section className={styles.block}>
        <h2 className={styles.h2}>Decided so far</h2>
        {decisions.length === 0 ? (
          <p className={styles.empty}>No decisions yet.</p>
        ) : (
          <div className={styles.decided}>
            {decisions.map((d) => (
              <div key={d.decision.id} className={styles.decRow}>
                <span className={styles.decLabel}>{d.decision.label}</span>
                <span className={styles.decText}>{d.decision.text}</span>
                <button
                  type="button"
                  className={styles.decSource}
                  onClick={() => dispatch({ type: "JUMP_TO", id: d.decision.messageId })}
                >
                  {d.source}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* All messages */}
      <section className={styles.block}>
        <div className={styles.blockHead}>
          <h2 className={styles.h2}>All messages</h2>
          <span className={styles.sub}>Blue dot = new since you last looked</span>
        </div>
        <div className={styles.allList}>
          {rows.map((r) => (
            <button
              key={r.message.id}
              type="button"
              className={`${styles.allRow} ${state.selectedId === r.message.id ? styles.allOn : ""}`}
              onClick={() => dispatch({ type: "SELECT", id: r.message.id })}
            >
              <span className={styles.allDot} data-on={r.isNew} aria-hidden />
              <span className={styles.allName} style={{ fontWeight: r.isNew ? 700 : 500 }}>
                {r.sender.first}
              </span>
              <span className={styles.allLine} style={{ fontWeight: r.isNew ? 600 : 400 }}>
                {r.line}
              </span>
              <span className={styles.allWhen}>{r.when}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
