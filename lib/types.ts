export type PersonId = "priya" | "marcus" | "dana" | "sam" | "jules" | "me";

export interface Person {
  name: string;
  first: string;
  email: string;
  initials: string;
  bg: string;
  fg: string;
}

export type ItemKind = "file" | "link";
export type ItemVersion = "old" | "latest";

export interface Item {
  kind: ItemKind;
  name: string;
  meta: string;
  version?: ItemVersion;
  note?: string;
}

export interface Message {
  from: PersonId;
  replyTo: number | null;
  topic: string;
  day: number;
  time: string;
  full: string;
  to: string;
  summary: string | null;
  body: string;
  items: Item[];
  ask?: boolean;
  event?: string;
  failed?: boolean;
}

export type View = "timeline" | "branches" | "summaries";

export interface ThreadState {
  sel: number;
  seen: Record<number, boolean>;
  open: Record<number, boolean>;
  early: boolean;
  view: View;
}

/** One conversation's data. The thread view is built from this alone. */
export interface Thread {
  id: string;
  /** Conversation subject, shown as the thread-view heading. */
  subject: string;
  /** Optional colored label chip, matching the inbox row. */
  label?: { text: string; color: string };
  msgs: Message[];
  /** Index of the first unread message; equals msgs.length when fully read. */
  newFrom: number;
  /** Messages before this index collapse under an "earlier messages" fold. */
  earlyEnd: number;
  /** Message indices whose items section starts expanded. */
  defaultOpen?: number[];
}
