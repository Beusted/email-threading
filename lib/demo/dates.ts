/**
 * Deterministic date helpers for the demo.
 *
 * The prototype is frozen in time: "now" is Saturday, Sep 26 2026, and every
 * label is precomputed from a fixed table rather than the real clock, so the
 * UI matches the mockups exactly and never drifts. Weekdays follow the real
 * 2026 calendar (Sep 24 = Thursday), matching the screenshots.
 */

export interface Stamp {
  /** Calendar month (9 = September, 10 = October) 2026. */
  month: number;
  /** Day of month. */
  day: number;
  /** Clock time, e.g. "1:05 PM". Omitted for date-only stamps (due dates). */
  time?: string;
}

/** Sortable integer for a stamp — orders correctly across the Sep/Oct boundary. */
export function dateNum(s: Stamp): number {
  return s.month * 100 + s.day;
}

/** "Now" for the whole demo: Saturday, September 26 2026. */
export const NOW: Stamp = { month: 9, day: 26 };

/** When the user last opened the thread: Tuesday, September 22. */
export const LAST_VISITED: Stamp = { month: 9, day: 22 };

/** Weekday for each date the demo references (real 2026 calendar). */
const WEEKDAY: Record<string, string> = {
  "9-15": "Tue",
  "9-16": "Wed",
  "9-20": "Sun",
  "9-22": "Tue",
  "9-24": "Thu",
  "9-25": "Fri",
  "9-26": "Sat",
  "9-27": "Sun",
  "9-30": "Wed",
  "10-1": "Thu",
};

const MONTH_ABBR: Record<number, string> = { 9: "Sep", 10: "Oct" };

function key(s: Stamp): string {
  return `${s.month}-${s.day}`;
}

export function weekday(s: Stamp): string {
  return WEEKDAY[key(s)] ?? "";
}

/** "Sep 24" */
export function fmtShort(s: Stamp): string {
  return `${MONTH_ABBR[s.month]} ${s.day}`;
}

/** "Thu, Sep 24" */
export function fmtDay(s: Stamp): string {
  const wd = weekday(s);
  return wd ? `${wd}, ${fmtShort(s)}` : fmtShort(s);
}

/** "Thu, Sep 24, 1:05 PM" (falls back to the date if no time). */
export function fmtFull(s: Stamp): string {
  return s.time ? `${fmtDay(s)}, ${s.time}` : fmtDay(s);
}

/** True when `s` is the calendar day after NOW (drives the "Due tomorrow" tag). */
export function isTomorrow(s: Stamp): boolean {
  return dateNum(s) === dateNum(NOW) + 1;
}

/** True when `s` is strictly before NOW. */
export function isPast(s: Stamp): boolean {
  return dateNum(s) < dateNum(NOW);
}
