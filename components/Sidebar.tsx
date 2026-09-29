import { INBOX } from "@/lib/inbox";
import { ClockIcon, ComposeIcon, FileIcon, InboxIcon, SendIcon, StarIcon } from "./icons";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const unread = INBOX.filter((t) => t.unread).length;

  return (
    <nav aria-label="Mailboxes" className={styles.nav}>
      <button type="button" className={styles.compose}>
        <ComposeIcon size={20} />
        <span>Compose</span>
      </button>

      <button type="button" className={styles.active}>
        <InboxIcon size={18} />
        <span style={{ flexGrow: 1 }}>Inbox</span>
        <span>{unread}</span>
      </button>

      <button type="button" className={`nav ${styles.item}`}>
        <StarIcon size={18} />
        <span style={{ flexGrow: 1 }}>Starred</span>
      </button>

      <button type="button" className={`nav ${styles.item}`}>
        <ClockIcon size={18} />
        <span style={{ flexGrow: 1 }}>Snoozed</span>
      </button>

      <button type="button" className={`nav ${styles.item}`}>
        <SendIcon size={18} />
        <span style={{ flexGrow: 1 }}>Sent</span>
      </button>

      <button type="button" className={`nav ${styles.item}`}>
        <FileIcon size={18} />
        <span style={{ flexGrow: 1 }}>Drafts</span>
        <span style={{ color: "var(--muted)" }}>2</span>
      </button>

      <div className={styles.section}>Labels</div>

      <button type="button" className={`nav ${styles.item}`}>
        <span className={styles.dot} style={{ background: "var(--sparkle)" }} />
        <span>Offsite</span>
      </button>

      <button type="button" className={`nav ${styles.item}`}>
        <span className={styles.dot} style={{ background: "var(--label-green)" }} />
        <span>Launch</span>
      </button>
    </nav>
  );
}
