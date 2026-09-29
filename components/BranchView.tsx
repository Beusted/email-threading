import type { ThreadModel } from "@/lib/thread";
import { PaperclipIcon } from "./icons";
import styles from "./BranchView.module.css";

interface Props {
  model: ThreadModel;
  onPick: (idx: number) => void;
}

export function BranchView({ model, onPick }: Props) {
  return (
    <div className={styles.wrap} style={{ maxWidth: model.treeMax }}>
      <div className={styles.legend}>
        <span className={styles.legendTitle}>Branch view</span>
        <span>Grouped by who replied to whom, not by time.</span>
        {model.branches.map((b, i) => (
          <span key={i} className={styles.legendChip}>
            <span className={styles.legendDot} style={{ background: b.color }} />
            <span style={{ fontWeight: 600 }}>{b.label}</span>
            <span style={{ color: "var(--muted)" }}>{b.count}</span>
          </span>
        ))}
      </div>

      <div className={styles.canvas} style={{ height: model.treeHeight }}>
        {model.edges.map((e, i) => (
          <div
            key={i}
            className={styles.edge}
            style={{ left: e.left, top: e.top, width: e.width, height: e.height, borderColor: e.color, opacity: e.opacity }}
          />
        ))}

        {model.nodes.map((n) => (
          <button
            key={n.idx}
            id={`node-${n.idx}`}
            type="button"
            className={`card ${styles.node}`}
            onClick={() => onPick(n.idx)}
            aria-label={n.aria}
            style={{ left: n.left, top: n.top, width: n.width, border: `1px solid ${n.border}`, boxShadow: n.ring, background: n.bg, opacity: n.opacity }}
          >
            <div className={styles.avatar} style={{ background: n.avBg, color: n.avFg }}>
              {n.initials}
            </div>
            <div className={styles.body}>
              <div className={styles.headline}>
                <span className={styles.name} style={{ fontWeight: n.nameWeight }}>
                  {n.name}
                </span>
                <span className={styles.branchDot} style={{ background: n.branchColor }} />
                <span className={styles.topic}>{n.topic}</span>
                {n.isAsk && <span className={styles.askBadge}>Asks you</span>}
              </div>
              <span className={styles.line}>{n.line}</span>
            </div>
            {n.hasItems && (
              <span className={styles.items}>
                <PaperclipIcon size={14} />
                {n.itemCount}
              </span>
            )}
            <span className={styles.when}>{n.when}</span>
            {n.unseen && <span className={styles.unseen} style={{ background: model.accent }} />}
          </button>
        ))}
      </div>
    </div>
  );
}
