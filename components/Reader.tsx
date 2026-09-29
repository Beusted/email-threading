import type { ThreadModel } from "@/lib/thread";
import type { DecoratedItem } from "@/lib/thread";
import { CloseIcon, FileIcon, ForwardIcon, LinkIcon, ReplyIcon } from "./icons";
import styles from "./Reader.module.css";

interface Props {
  model: ThreadModel;
  onClose: () => void;
  onGoParent: (parentIdx: number) => void;
  onPickChild: (idx: number) => void;
}

function TileIcon({ item }: { item: DecoratedItem }) {
  if (item.isFile) return <FileIcon size={18} />;
  if (item.isLink) return <LinkIcon size={18} />;
  return null;
}

export function Reader({ model, onClose, onGoParent, onPickChild }: Props) {
  const sel = model.reader;
  return (
    <section className={`scroll ${styles.section}`} aria-label="Message">
      <div className={styles.topbar}>
        <span className={styles.msgPos}>Message {model.selPos}</span>
        <span className={styles.chainLabel}>{model.chainLabel}</span>
        <button type="button" className={`ghost ${styles.close}`} onClick={onClose} aria-label="Close message">
          <CloseIcon size={20} />
        </button>
      </div>

      <div className={styles.senderRow}>
        <div className={styles.avatar} style={{ background: sel.avBg, color: sel.avFg }}>
          {sel.initials}
        </div>
        <div className={styles.senderCol}>
          <div className={styles.senderLine}>
            <span className={styles.fullName}>{sel.fullName}</span>
            <span className={styles.email}>{sel.email}</span>
          </div>
          <span className={styles.to}>to {sel.to}</span>
        </div>
        <span className={styles.full}>{sel.full}</span>
      </div>

      {sel.hasParent && (
        <div className={styles.parentWrap}>
          <button
            type="button"
            className={`reply ${styles.parentBtn}`}
            onClick={() => sel.parentIdx !== null && onGoParent(sel.parentIdx)}
          >
            <ReplyIcon size={15} />
            <span>Replying to</span>
            <span style={{ fontWeight: 600 }}>{sel.parentLabel}</span>
          </button>
        </div>
      )}

      {sel.isAsk && <div className={styles.askBox}>{sel.askLabel}</div>}

      <div className={styles.body}>{sel.body}</div>

      {sel.hasItems && (
        <div className={styles.attachments}>
          <div className={styles.attachmentsLabel}>{sel.itemsLabel}</div>
          <div className={styles.grid}>
            {sel.items.map((it, i) => (
              <div key={i} className={`tile ${styles.tile}`}>
                <div className={styles.tileIcon}>
                  <TileIcon item={it} />
                </div>
                <div className={styles.tileText}>
                  <span className={styles.tileName} style={{ color: it.color }}>
                    {it.name}
                  </span>
                  <span className={styles.tileMeta}>{it.meta}</span>
                  {it.hasNote && <span className={styles.tileMeta}>{it.note}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sel.hasChildren && (
        <div className={styles.replies}>
          <span className={styles.repliesLabel}>Replies to this</span>
          {sel.children.map((c) => (
            <button key={c.idx} type="button" className={`reply ${styles.replyChip}`} onClick={() => onPickChild(c.idx)}>
              <span style={{ fontWeight: 600 }}>{c.name}</span>
              <span style={{ color: "var(--muted)" }}>{c.when}</span>
            </button>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <button type="button" className={styles.replyBtn}>
          <ReplyIcon size={18} />
          Reply
        </button>
        <button type="button" className={`ghost ${styles.secondary}`}>
          Reply all
        </button>
        <button type="button" className={`ghost ${styles.secondary}`}>
          <ForwardIcon size={18} />
          Forward
        </button>
      </div>
    </section>
  );
}
