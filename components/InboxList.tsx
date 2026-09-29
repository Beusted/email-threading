"use client";

import { INBOX, type InboxThread } from "@/lib/inbox";
import { Header } from "./Header";
import { PaperclipIcon, StarIcon } from "./icons";
import { Sidebar } from "./Sidebar";
import styles from "./InboxList.module.css";

interface Props {
  /** Opens a thread by id; only rows with `opens` are wired to fire it. */
  onOpen: (id: string) => void;
}

export function InboxList({ onOpen }: Props) {
  const unread = INBOX.filter((t) => t.unread).length;

  return (
    <div className={styles.frame}>
      <Header />

      <div className={styles.bodyRow}>
        <Sidebar />

        <main className={styles.main}>
          <div className={styles.head}>
            <h1 className={styles.title}>Inbox</h1>
            <span className={styles.count}>{unread} unread</span>
          </div>

          <div className={`scroll ${styles.list}`}>
            {INBOX.map((t) => (
              <Row key={t.id} t={t} onOpen={onOpen} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function Row({ t, onOpen }: { t: InboxThread; onOpen: (id: string) => void }) {
  const clickable = Boolean(t.opens);
  return (
    <button
      type="button"
      className={`${styles.row} ${t.unread ? styles.unread : ""} ${clickable ? styles.clickable : ""}`}
      onClick={clickable ? () => onOpen(t.id) : undefined}
      aria-label={`${t.senderName}: ${t.subject}`}
    >
      <span className={styles.dotCol}>{t.unread && <span className={styles.unreadDot} />}</span>

      <span className={styles.starCol}>
        <StarIcon size={18} style={{ color: t.starred ? "var(--star)" : "var(--star-idle)" }} />
      </span>

      <span className={styles.avatar} style={{ background: t.bg, color: t.fg }}>
        {t.initials}
      </span>

      <span className={styles.body}>
        <span className={styles.topLine}>
          <span className={styles.sender}>{t.senderName}</span>
          {t.count && <span className={styles.countPill}>{t.count}</span>}
          {t.isAsk && <span className={styles.askBadge}>Asks you</span>}
        </span>
        <span className={styles.subjectLine}>
          <span className={styles.subject}>{t.subject}</span>
          <span className={styles.snippet}>— {t.snippet}</span>
        </span>
      </span>

      <span className={styles.meta}>
        {t.label && (
          <span className={styles.labelChip}>
            <span className={styles.labelDot} style={{ background: t.label.color }} />
            {t.label.text}
          </span>
        )}
        {t.hasAttach && <PaperclipIcon size={15} style={{ color: "var(--muted2)" }} />}
        <span className={styles.time}>{t.time}</span>
      </span>
    </button>
  );
}
