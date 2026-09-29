import { THREADS } from "./data";

/** A conversation as it appears in the inbox list (one row). */
export interface InboxThread {
  id: string;
  subject: string;
  senderName: string;
  initials: string;
  /** Avatar background / foreground, matching the PEOPLE palette style. */
  bg: string;
  fg: string;
  /** Preview line under the subject. */
  snippet: string;
  /** Right-aligned relative time, e.g. "1:05 PM" or "Yesterday". */
  time: string;
  /** Message count; omitted for single-message rows. */
  count?: number;
  unread?: boolean;
  starred?: boolean;
  hasAttach?: boolean;
  isAsk?: boolean;
  label?: { text: string; color: string };
  /** Whether the row opens the thread view. Derived from THREADS. */
  opens?: boolean;
}

/**
 * Presentation for each inbox row. Conversation state — message count, unread,
 * and whether the row opens — is derived from THREADS below so the list and the
 * thread view never drift apart.
 */
const ROWS: Omit<InboxThread, "count" | "unread" | "opens">[] = [
  {
    id: "offsite",
    subject: "Team offsite: venue and agenda",
    senderName: "Priya Shah",
    initials: "PS",
    bg: "#ECE6F7",
    fg: "#553A99",
    snippet: "Would you be up for running the design workshop on Day 2? Let me know by Thursday.",
    time: "1:05 PM",
    hasAttach: true,
    isAsk: true,
    label: { text: "Offsite", color: "#7A5AC8" },
  },
  {
    id: "budget-q3",
    subject: "Q3 budget reconciliation",
    senderName: "Dana Okafor",
    initials: "DO",
    bg: "#FBE8DA",
    fg: "#8C4115",
    snippet: "Numbers are locked. One line item needs your sign-off before Friday.",
    time: "11:20 AM",
    hasAttach: true,
    isAsk: true,
    label: { text: "Launch", color: "#2F8A62" },
  },
  {
    id: "shuttle",
    subject: "Shuttle pickup points confirmed",
    senderName: "Sam Rivera",
    initials: "SR",
    bg: "#E7EEF0",
    fg: "#2C5A6B",
    snippet: "Two stops: HQ lobby at 8:00 and Caltrain at 8:20. Reply if you need a third.",
    time: "9:05 AM",
  },
  {
    id: "launch-checklist",
    subject: "Launch checklist v4",
    senderName: "Marcus Lee",
    initials: "ML",
    bg: "#E1EFE7",
    fg: "#1F5E43",
    snippet: "Moved the copy freeze to Monday. Flagged three blockers in red.",
    time: "Yesterday",
    hasAttach: true,
    label: { text: "Launch", color: "#2F8A62" },
  },
  {
    id: "offer-letter",
    subject: "Offer letter — please review",
    senderName: "Jules Tran",
    initials: "JT",
    bg: "#FCE7EF",
    fg: "#9B2C5A",
    snippet: "Draft attached. Legal has signed off; needs your comments by EOD.",
    time: "Wed",
    hasAttach: true,
    isAsk: true,
  },
  {
    id: "one-on-one",
    subject: "Re: 1:1 notes",
    senderName: "Priya Shah",
    initials: "PS",
    bg: "#ECE6F7",
    fg: "#553A99",
    snippet: "Thanks for the writeup. Let's revisit the roadmap item next week.",
    time: "Wed",
    starred: true,
  },
  {
    id: "expenses",
    subject: "Expense report reminder",
    senderName: "Dana Okafor",
    initials: "DO",
    bg: "#FBE8DA",
    fg: "#8C4115",
    snippet: "Auto-reminder: 2 receipts still unmatched for August.",
    time: "Tue",
  },
];

export const INBOX: InboxThread[] = ROWS.map((row) => {
  const thread = THREADS[row.id];
  if (!thread) return row;
  return {
    ...row,
    // Count pill only reads well for multi-message conversations.
    count: thread.msgs.length > 1 ? thread.msgs.length : undefined,
    unread: thread.newFrom < thread.msgs.length,
    opens: true,
  };
});
