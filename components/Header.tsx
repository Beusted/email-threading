import { MailIcon, SearchIcon } from "./icons";
import { ThemeMenu } from "./ThemeMenu";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <MailIcon size={24} />
        <span>AlationMail</span>
      </div>
      <label htmlFor="q" className={styles.search}>
        <SearchIcon size={20} />
        <input id="q" type="search" placeholder="Search AlationMail" className={styles.input} />
      </label>
      <div className={styles.actions}>
        <ThemeMenu />
        <div className={styles.avatar}>BN</div>
      </div>
    </header>
  );
}
