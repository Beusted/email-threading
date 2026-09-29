import { ArchiveIcon, BackIcon, TrashIcon } from "./icons";
import styles from "./Toolbar.module.css";

interface Props {
  onBack?: () => void;
}

export function Toolbar({ onBack }: Props) {
  return (
    <div className={styles.bar}>
      <button type="button" className={`ghost ${styles.btn}`} aria-label="Back to inbox" onClick={onBack}>
        <BackIcon size={20} />
      </button>
      <button type="button" className={`ghost ${styles.btn}`} aria-label="Archive">
        <ArchiveIcon size={20} />
      </button>
      <button type="button" className={`ghost ${styles.btn}`} aria-label="Delete">
        <TrashIcon size={20} />
      </button>
      <span className={styles.count}>3 of 128</span>
    </div>
  );
}
