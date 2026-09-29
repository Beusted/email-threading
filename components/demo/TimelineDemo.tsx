import type { Dispatch } from "react";
import { UserPlusIcon } from "@/components/icons";
import { fmtShort } from "@/lib/demo/dates";
import { timelineGroups } from "@/lib/demo/selectors";
import type { Action, DemoState } from "@/lib/demo/store";
import styles from "./TimelineDemo.module.css";

interface Props {
  state: DemoState;
  dispatch: Dispatch<Action>;
}

export function TimelineDemo({ state, dispatch }: Props) {
  const groups = timelineGroups(state);
  return (
    <div className={styles.wrap}>
      {groups.map((g) => (
        <div key={g.dateLabel} className={styles.group}>
          <div className={styles.dateRow}>
            <span className={styles.dateTick} />
            <span className={styles.dateLabel}>{g.dateLabel}</span>
          </div>
          {g.rows.map((r) => (
            <div key={r.message.id}>
              {r.event && (
                <div className={styles.event}>
                  <UserPlusIcon size={15} />
                  <span>{r.event}</span>
                </div>
              )}
              <button
                type="button"
                id={`demo-msg-${r.message.id}`}
                className={`card ${styles.row} ${state.selectedId === r.message.id ? styles.rowOn : ""} ${state.flashId === r.message.id ? "flash" : ""}`}
                onClick={() => dispatch({ type: "SELECT", id: r.message.id })}
              >
                <span className={styles.dot} data-on={r.isNew} aria-hidden />
                <span className={styles.avatar} style={{ background: r.sender.bg, color: r.sender.fg }}>
                  {r.sender.initials}
                </span>
                <div className={styles.rowBody}>
                  <div className={styles.rowHead}>
                    <span className={styles.rowName} style={{ fontWeight: r.seen ? 500 : 700 }}>
                      {r.sender.name}
                    </span>
                    <span className={styles.rowTopic}>{r.message.topic}</span>
                    <span className={styles.rowWhen}>{fmtShort(r.message.sentAt)}, {r.message.sentAt.time}</span>
                  </div>
                  <span className={styles.rowLine}>{r.message.summary ?? r.message.body.split("\n")[0]}</span>
                </div>
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
