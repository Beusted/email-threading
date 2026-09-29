/**
 * Design tokens lifted from the source mockup (Main.dc.html).
 *
 * Each surface color resolves to a CSS custom property defined in
 * app/globals.css (light on :root, warm-dark under [data-theme="dark"]).
 * Referencing the variables — rather than raw hex — means inline styles
 * built from these tokens track the active theme automatically.
 */

export const color = {
  paper: "var(--paper)",
  ink: "var(--ink)",
  ink2: "var(--ink2)",
  ink3: "var(--ink3)",
  ink4: "var(--ink4)",
  ink5: "var(--ink5)",
  card: "var(--card)",
  line: "var(--line)",
  border: "var(--border)",
  borderSoft: "var(--border-soft)",
  borderStrong: "var(--border-strong)",
  muted: "var(--muted)",
  muted2: "var(--muted2)",
  sub: "var(--sub)",
  field: "var(--field)",
  chipBg: "var(--chip-bg)",
  chipTile: "var(--chip-tile)",
  navActiveBg: "var(--nav-active-bg)",
  navActiveFg: "var(--nav-active-fg)",

  // accent-tinted "unread" surfaces
  unreadBg: "var(--unread-bg)",
  unreadBorder: "var(--unread-border)",
  chainBorder: "var(--chain-border)",

  // timeline spine + dots
  spine: "var(--spine)",
  dotIdle: "var(--dot-idle)",

  // header badge colors
  labelChipBg: "var(--label-chip-bg)",
  labelChipFg: "var(--label-chip-fg)",
  newChipBg: "var(--new-chip-bg)",
  newChipFg: "var(--new-chip-fg)",
  askBg: "var(--ask-bg)",
  askFg: "var(--ask-fg)",
  askFg2: "var(--ask-fg2)",
  askBodyFg: "var(--ask-body-fg)",
  oldBadgeBg: "var(--old-badge-bg)",
  oldBadgeFg: "var(--old-badge-fg)",
  latestBadgeBg: "var(--latest-badge-bg)",
  latestBadgeFg: "var(--latest-badge-fg)",

  sparkle: "var(--sparkle)",
} as const;

export const DEFAULT_ACCENT = "var(--accent)";

export const accentOptions = ["#2B59C3", "#1F7A5C", "#B4531F"] as const;

/** Branch (tree) view layout constants. */
export const BRANCH_COLORS = ["#7A5AC8", "#1F7A5C", "#B4531F", "#2B6CB0"];
export const ROW = 72;
export const INDENT = 40;
