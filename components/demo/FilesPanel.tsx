import type { Dispatch } from "react";
import { CloseIcon, FileIcon, LinkIcon } from "@/components/icons";
import { ATTACHMENTS, LINKS } from "@/lib/demo/data";
import { fileRows, linkRows } from "@/lib/demo/selectors";
import type { Action, DemoState } from "@/lib/demo/store";
import styles from "./FilesPanel.module.css";

interface Props {
  state: DemoState;
  dispatch: Dispatch<Action>;
}

export function FilesPanel({ state, dispatch }: Props) {
  const files = fileRows();
  const links = linkRows();
  const tab = state.filesPanel.tab;

  const jump = (messageId: string) => dispatch({ type: "JUMP_TO", id: messageId });

  return (
    <div className={styles.scrim} onMouseDown={() => dispatch({ type: "CLOSE_FILES" })}>
      <aside className={styles.panel} onMouseDown={(e) => e.stopPropagation()} aria-label="Files in this thread">
        <div className={styles.head}>
          <h2 className={styles.title}>Files in this thread</h2>
          <button type="button" className={`ghost ${styles.close}`} aria-label="Close files panel" onClick={() => dispatch({ type: "CLOSE_FILES" })}>
            <CloseIcon size={18} />
          </button>
        </div>

        <div className={styles.tabs} role="tablist">
          <button type="button" role="tab" aria-selected={tab === "files"} className={`${styles.tab} ${tab === "files" ? styles.tabOn : ""}`} onClick={() => dispatch({ type: "OPEN_FILES", tab: "files" })}>
            Files {ATTACHMENTS.length}
          </button>
          <button type="button" role="tab" aria-selected={tab === "links"} className={`${styles.tab} ${tab === "links" ? styles.tabOn : ""}`} onClick={() => dispatch({ type: "OPEN_FILES", tab: "links" })}>
            Links {LINKS.length}
          </button>
        </div>

        <div className={`scroll ${styles.list}`}>
          {tab === "files"
            ? files.map((f) => (
                <div key={f.attachment.id} className={styles.item}>
                  <button type="button" className={styles.itemMain} onClick={() => jump(f.message.id)}>
                    <FileIcon size={18} />
                    <span className={styles.itemText}>
                      <span className={styles.itemName}>
                        {f.attachment.name}
                        {f.old && <span className={styles.latestBadge}>Latest</span>}
                      </span>
                      <span className={styles.itemMeta}>{f.when} · {f.attachment.meta}</span>
                    </span>
                  </button>
                  {f.old && (
                    <button type="button" className={styles.oldRow} onClick={() => jump(f.old!.attachment.messageId)}>
                      <span className={styles.oldBadge}>Old</span>
                      <span className={styles.oldText}>{f.old.label}</span>
                    </button>
                  )}
                </div>
              ))
            : links.map((l) => (
                <button key={l.link.id} type="button" className={styles.itemMain} onClick={() => jump(l.message.id)}>
                  <LinkIcon size={18} />
                  <span className={styles.itemText}>
                    <span className={styles.itemName}>{l.link.name}</span>
                    <span className={styles.itemMeta}>{l.when} · {l.link.meta}</span>
                  </span>
                </button>
              ))}
        </div>
      </aside>
    </div>
  );
}
