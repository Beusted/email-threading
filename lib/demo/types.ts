import type { Stamp } from "./dates";

export type PersonId = "priya" | "marcus" | "dana" | "sam" | "me";

export interface Person {
  name: string;
  first: string;
  email: string;
  initials: string;
  bg: string;
  fg: string;
}

export type AskStatus = "open" | "done" | "dismissed";

export interface Ask {
  id: string;
  messageId: string;
  /** Short label for the Needs-you list, e.g. "Run the Day 2 design workshop?" */
  text: string;
  dueDate?: Stamp;
  /** Verbatim sentence from the message body to highlight in the reader. */
  highlight: string;
  status: AskStatus;
}

export interface Decision {
  id: string;
  /** Row label, e.g. "Venue". */
  label: string;
  /** Decision value, e.g. "Sonoma Barn, Oct 21 to 22". */
  text: string;
  /** Source message the decision was made in. */
  messageId: string;
}

export type AttachmentVersion = "old" | "latest";

export interface Attachment {
  id: string;
  name: string;
  /** Sub-label, e.g. "PDF, 295 KB". */
  meta: string;
  messageId: string;
  version?: AttachmentVersion;
  /** Attachment id that supersedes this one (old → latest). */
  supersededBy?: string;
}

export interface Link {
  id: string;
  name: string;
  meta: string;
  messageId: string;
}

export interface Message {
  id: string;
  threadId: string;
  from: PersonId;
  to: PersonId[];
  cc: PersonId[];
  sentAt: Stamp;
  /** Message id this replies to, or null for the thread root. */
  inReplyTo: string | null;
  subject: string;
  /** Short per-message label used in the branch tree, e.g. "Venue vote". */
  topic: string;
  body: string;
  /** One-line AI summary; null when a summary "failed" to generate. */
  summary: string | null;
  /** Branch this message belongs to (see BRANCHES). */
  branchId: string;
  /** New since LAST_VISITED — drives blue dots and the "N new" chip. */
  isNew: boolean;
  /** Ask directed at "you", if any. */
  askId?: string;
  /** Attachment ids referenced (but not re-attached) by this message. */
  mentionIds?: string[];
  /** Thread event surfaced above the message, e.g. someone added to the thread. */
  event?: string;
  /** Summary generation failed — show the body start instead. */
  failed?: boolean;
}

export interface Reminder {
  messageId: string;
  /** When the reminder fires. */
  at: Stamp;
  /** Precomputed tag label, e.g. "Wed 2 PM". */
  label: string;
}

export interface Branch {
  id: string;
  label: string;
  color: string;
  rootMessageId: string;
  muted: boolean;
}

export interface Thread {
  id: string;
  subject: string;
  label?: { text: string; color: string };
  /** Set when this thread was split off another. */
  splitFrom?: string;
  /** Continuation metadata, e.g. Q4 vendor review Part 2. */
  continuation?: { part: number; fromLabel: string };
}
