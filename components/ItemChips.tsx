import type { MessageVM } from "@/lib/thread";
import type { DecoratedItem } from "@/lib/thread";
import { ChevronDownIcon, FileIcon, LinkIcon, PaperclipIcon } from "./icons";
import styles from "./ItemChips.module.css";

function ItemIcon({ item, size }: { item: DecoratedItem; size: number }) {
  if (item.isFile) return <FileIcon size={size} />;
  if (item.isLink) return <LinkIcon size={size} />;
  return null;
}

interface Props {
  m: MessageVM;
  onToggle: (idx: number) => void;
}

export function ItemChips({ m, onToggle }: Props) {
  return (
    <div className={styles.rail} style={{ paddingTop: m.filesTop }}>
      {m.oneItem && m.first && (
        <span className={`chip ${styles.single}`} title={m.first.title}>
          <ItemIcon item={m.first} size={15} />
          <span className={styles.name}>{m.first.name}</span>
        </span>
      )}

      {m.manyItems && (
        <>
          <button
            type="button"
            className={`chip ${styles.toggle}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(m.idx);
            }}
            aria-expanded={m.isOpen}
          >
            <PaperclipIcon size={15} />
            <span style={{ whiteSpace: "nowrap" }}>{m.itemsLabel}</span>
            <ChevronDownIcon
              size={15}
              style={{ transform: m.isOpen ? "rotate(180deg)" : "none", transition: "transform 160ms ease" }}
            />
          </button>

          {m.isOpen &&
            m.items.map((it, i) => (
              <span key={i} className={`chip ${styles.expanded}`} title={it.title} style={{ color: it.color }}>
                <ItemIcon item={it} size={14} />
                <span className={styles.name}>{it.name}</span>
                {it.isOld && <span className={styles.old}>Old</span>}
                {it.isLatest && <span className={styles.latest}>Latest</span>}
              </span>
            ))}
        </>
      )}
    </div>
  );
}
