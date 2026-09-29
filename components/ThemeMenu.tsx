"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "./icons";
import styles from "./ThemeMenu.module.css";

type Choice = "light" | "dark" | "auto";

const STORAGE_KEY = "theme";

const options: { key: Choice; label: string; Icon: typeof SunIcon }[] = [
  { key: "light", label: "Light", Icon: SunIcon },
  { key: "dark", label: "Dark", Icon: MoonIcon },
  { key: "auto", label: "Auto", Icon: MonitorIcon },
];

function systemPrefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

/** Map a stored choice to the concrete palette applied via data-theme. */
function resolve(choice: Choice): "light" | "dark" {
  if (choice === "auto") return systemPrefersDark() ? "dark" : "light";
  return choice;
}

function readChoice(): Choice {
  if (typeof window === "undefined") return "auto";
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "auto";
}

function apply(choice: Choice) {
  document.documentElement.setAttribute("data-theme", resolve(choice));
}

/* The stored choice is client-only external state (localStorage). Expose it as
 * an external store so components can read it via useSyncExternalStore — the
 * server snapshot is the SSR-safe default, avoiding a hydration mismatch, and
 * the real value is adopted before paint. `storage` events cover other tabs;
 * notifyThemeChange() covers same-tab writes. */
const themeListeners = new Set<() => void>();

function subscribeTheme(onChange: () => void): () => void {
  themeListeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    themeListeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function notifyThemeChange() {
  themeListeners.forEach((l) => l());
}

const SERVER_CHOICE: Choice = "auto";

export function ThemeMenu() {
  // Read the stored choice via an external store: the server snapshot is the
  // SSR-safe default so the first (hydration) render matches the server markup,
  // then React adopts the real localStorage value before paint — no hydration
  // mismatch on this button's icon/aria-label, no visible flash.
  const choice = useSyncExternalStore(subscribeTheme, readChoice, () => SERVER_CHOICE);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Keep data-theme in sync with the resolved choice before paint. Also covers
  // React's dev Strict Mode remount clearing the attribute the inline script set.
  useLayoutEffect(() => {
    apply(choice);
  }, [choice]);

  // While on "auto", follow live OS theme changes.
  useEffect(() => {
    if (choice !== "auto" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("auto");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [choice]);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const select = useCallback((next: Choice) => {
    localStorage.setItem(STORAGE_KEY, next);
    apply(next);
    notifyThemeChange();
    setOpen(false);
  }, []);

  const activeIndex = options.findIndex((o) => o.key === choice);
  const Current = options[activeIndex].Icon;
  // The glass highlight slides to the hovered row, falling back to the active one.
  const glassIndex = hover ?? activeIndex;

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={`ghost ${styles.trigger}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Theme: ${options[activeIndex].label}`}
        onClick={() => setOpen((v) => !v)}
      >
        <Current size={20} />
      </button>

      <div
        className={styles.menu}
        role="menu"
        data-open={open}
        aria-hidden={!open}
        onMouseLeave={() => setHover(null)}
      >
        <span
          className={styles.glass}
          aria-hidden="true"
          style={{ transform: `translateY(${glassIndex * 100}%)` }}
        />
        {options.map((o, i) => (
          <button
            key={o.key}
            type="button"
            role="menuitemradio"
            aria-checked={o.key === choice}
            className={styles.item}
            tabIndex={open ? 0 : -1}
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onClick={() => select(o.key)}
          >
            <o.Icon size={18} />
            <span>{o.label}</span>
            {o.key === choice && <span className={styles.check} aria-hidden="true" />}
          </button>
        ))}
      </div>
    </div>
  );
}
