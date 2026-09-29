import type { ThreadModel } from "@/lib/thread";
import type { ThreadState } from "@/lib/types";
import { PaperclipIcon } from "./icons";
import styles from "./ThreadHeader.module.css";

interface Props {
  model: ThreadModel;
  view: ThreadState["view"];
  onSetView: (view: ThreadState["view"]) => void;
  onJumpNew: () => void;
  onMarkAll: () => void;
}

const VIEWS: { id: ThreadState["view"]; label: string }[] = [
  { id: "summaries", label: "Summary" },
  { id: "timeline", label: "Timeline" },
  { id: "branches", label: "Branches" },
];

export function ThreadHeader({ model, view, onSetView, onJumpNew, onMarkAll }: Props) {
  const { accent } = model;
  return (
    <div className={styles.wrap}>
      <div className={styles.titleCol}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{model.title}</h1>
          {model.hasLabel && <span className={styles.labelChip}>{model.labelText}</span>}
        </div>
        <div className={styles.chipRow}>
          <span className={styles.chip}>{model.msgCountLabel}</span>
          {model.hasNew && (
            <span className={styles.newChip}>
              <span className={styles.newDot} style={{ background: accent }} />
              {model.newLabel}
            </span>
          )}
          {model.itemsSummary && (
            <span className={styles.chip}>
              <PaperclipIcon size={14} />
              {model.itemsSummary}
            </span>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.switcher} role="tablist" aria-label="Thread view">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={view === v.id}
              className={`${styles.switchBtn} ${view === v.id ? styles.switchOn : ""}`}
              onClick={() => onSetView(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
        {model.hasNew && (
          <button type="button" className={styles.jumpBtn} onClick={onJumpNew} style={{ background: accent }}>
            Jump to new
          </button>
        )}
        <button type="button" className={`ghost ${styles.markBtn}`} onClick={onMarkAll}>
          Mark all read
        </button>
      </div>
    </div>
  );
}
