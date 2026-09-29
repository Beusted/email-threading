import {
  ASKS,
  ATTACHMENTS,
  BRANCHES,
  DECISIONS,
  LINKS,
  MESSAGES,
  PEOPLE,
  PINNED_DECISION_ID,
} from "./data";
import { dateNum, fmtDay, fmtShort, isTomorrow, LAST_VISITED } from "./dates";
import type { DemoState } from "./store";
import type { Ask, Attachment, Decision, Link, Message, Person, PersonId } from "./types";

/* ------------------------------------------------------------------ *
 * Small lookups.                                                      *
 * ------------------------------------------------------------------ */

export function person(id: PersonId): Person {
  return PEOPLE[id];
}

export function messageById(id: string): Message | undefined {
  return MESSAGES.find((m) => m.id === id);
}

export function askByMessage(id: string): Ask | undefined {
  return ASKS.find((a) => a.messageId === id);
}

export function attachmentsFor(messageId: string): Attachment[] {
  return ATTACHMENTS.filter((a) => a.messageId === messageId);
}

export function linksFor(messageId: string): Link[] {
  return LINKS.filter((l) => l.messageId === messageId);
}

export function attachmentById(id: string): Attachment | undefined {
  return ATTACHMENTS.find((a) => a.id === id);
}

export function recipientNames(ids: PersonId[]): string {
  return ids.map((id) => (id === "me" ? "you" : PEOPLE[id].name)).join(", ");
}

export function parentOf(id: string): Message | undefined {
  const m = messageById(id);
  return m?.inReplyTo ? messageById(m.inReplyTo) : undefined;
}

export function childrenOf(id: string): Message[] {
  return MESSAGES.filter((m) => m.inReplyTo === id);
}

/** All ancestor ids of a message, nearest first. */
export function ancestors(id: string): string[] {
  const out: string[] = [];
  let p = messageById(id)?.inReplyTo ?? null;
  while (p) {
    out.push(p);
    p = messageById(p)?.inReplyTo ?? null;
  }
  return out;
}

function firstLine(body: string): string {
  return body.split("\n")[0];
}

/* ------------------------------------------------------------------ *
 * Header.                                                             *
 * ------------------------------------------------------------------ */

export interface HeaderVM {
  subject: string;
  label: { text: string; color: string };
  messageCount: number;
  newCount: number;
  fileCount: number;
  linkCount: number;
  pinnedDecision: Decision;
  since: string;
}

export function headerVM(): HeaderVM {
  const msgs = MESSAGES;
  return {
    subject: "Team offsite: venue and agenda",
    label: { text: "Offsite", color: "#7A5AC8" },
    messageCount: msgs.length,
    newCount: msgs.filter((m) => m.isNew).length,
    fileCount: ATTACHMENTS.length,
    linkCount: LINKS.length,
    pinnedDecision: DECISIONS.find((d) => d.id === PINNED_DECISION_ID)!,
    since: `Since you last looked, ${fmtDay(LAST_VISITED)}`,
  };
}

/* ------------------------------------------------------------------ *
 * Fix #1 — "Needs you".                                               *
 * ------------------------------------------------------------------ */

export type AskTag = "due-tomorrow" | "asks-you";

export interface NeedsYouItem {
  ask: Ask;
  message: Message;
  sender: Person;
  tag: AskTag;
  /** Sub-label under the task, e.g. "Sun Sep 27, from Dana, Sep 24". */
  meta: string;
  reminderLabel?: string;
}

export interface DoneAskItem {
  ask: Ask;
  note: string;
}

export interface NeedsYou {
  open: NeedsYouItem[];
  done: DoneAskItem[];
}

/** First "you" reply at or below an ask's message, if any (for the done note). */
function replyToAsk(askMessageId: string): Message | undefined {
  return MESSAGES.find((m) => m.from === "me" && ancestors(m.id).includes(askMessageId));
}

export function needsYou(state: DemoState): NeedsYou {
  const open: NeedsYouItem[] = [];
  const done: DoneAskItem[] = [];

  Object.values(state.asks).forEach((ask) => {
    const message = messageById(ask.messageId)!;
    const sender = PEOPLE[message.from];
    if (ask.status === "open") {
      const tag: AskTag = ask.dueDate && isTomorrow(ask.dueDate) ? "due-tomorrow" : "asks-you";
      const from = `from ${sender.first}, ${fmtShort(message.sentAt)}`;
      const meta = ask.dueDate
        ? tag === "due-tomorrow"
          ? `${fmtDay(ask.dueDate)}, ${from}`
          : `Due ${fmtDay(ask.dueDate)}, ${from}`
        : from;
      open.push({ ask, message, sender, tag, meta, reminderLabel: state.reminders[ask.messageId]?.label });
    } else if (ask.status === "done") {
      const reply = replyToAsk(ask.messageId);
      done.push({ ask, note: reply ? `Done, you replied ${fmtShort(reply.sentAt)}` : "Done" });
    }
    // dismissed asks disappear from the list
  });

  open.sort((a, b) => {
    const da = a.ask.dueDate ? dateNum(a.ask.dueDate) : Infinity;
    const db = b.ask.dueDate ? dateNum(b.ask.dueDate) : Infinity;
    return da - db;
  });

  return { open, done };
}

/* ------------------------------------------------------------------ *
 * Fix #1 — "Decided so far".                                          *
 * ------------------------------------------------------------------ */

export interface DecidedRow {
  decision: Decision;
  source: string;
}

export function decided(): DecidedRow[] {
  return DECISIONS.map((decision) => {
    const m = messageById(decision.messageId)!;
    return { decision, source: `${PEOPLE[m.from].first}, ${fmtShort(m.sentAt)}` };
  });
}

/* ------------------------------------------------------------------ *
 * Fix #1 — "All messages".                                            *
 * ------------------------------------------------------------------ */

export interface AllMessageRow {
  message: Message;
  sender: Person;
  line: string;
  when: string;
  isNew: boolean;
  seen: boolean;
}

export function allMessages(state: DemoState): AllMessageRow[] {
  return MESSAGES.map((message) => ({
    message,
    sender: PEOPLE[message.from],
    line: message.summary ?? firstLine(message.body),
    when: fmtShort(message.sentAt),
    isNew: message.isNew,
    seen: !!state.seen[message.id],
  }));
}

/* ------------------------------------------------------------------ *
 * Fix #2 — branch tree (indented rows).                               *
 * ------------------------------------------------------------------ */

export interface BranchRow {
  message: Message;
  sender: Person;
  depth: number;
  /** Connector color for this row's branch (neutral for the root). */
  color: string;
  branchId: string | null;
  isBranchRoot: boolean;
}

export interface BranchChip {
  id: string;
  label: string;
  color: string;
  count: number;
  muted: boolean;
}

interface TreeNode {
  id: string;
  depth: number;
  branchHead: string | null;
}

function treeOrder(): TreeNode[] {
  const out: TreeNode[] = [];
  function walk(id: string, depth: number, branchHead: string | null) {
    out.push({ id, depth, branchHead });
    childrenOf(id).forEach((c) => walk(c.id, depth + 1, depth === 0 ? c.id : branchHead));
  }
  MESSAGES.filter((m) => m.inReplyTo === null).forEach((r) => walk(r.id, 0, null));
  return out;
}

/** Branch head message id → branch definition. */
function branchByHead(headId: string) {
  return Object.values(BRANCHES).find((b) => b.rootMessageId === headId);
}

export function branchRows(): BranchRow[] {
  return treeOrder().map((n) => {
    const message = messageById(n.id)!;
    const branch = n.branchHead ? branchByHead(n.branchHead) : undefined;
    const isBranchRoot = !!branchByHead(n.id);
    return {
      message,
      sender: PEOPLE[message.from],
      depth: n.depth,
      color: branch?.color ?? "#b8b3a9",
      branchId: branch?.id ?? null,
      isBranchRoot,
    };
  });
}

export function branchChips(state: DemoState): BranchChip[] {
  const order = treeOrder();
  return Object.values(BRANCHES).map((b) => {
    const count = order.filter((n) => n.branchHead === b.rootMessageId).length;
    return { id: b.id, label: b.label, color: b.color, count, muted: state.branches[b.id]?.muted ?? false };
  });
}

/** Message ids belonging to a branch subtree (for split/mute). */
export function branchMessageIds(branchId: string): string[] {
  const head = BRANCHES[branchId]?.rootMessageId;
  if (!head) return [];
  return treeOrder().filter((n) => n.branchHead === head).map((n) => n.id);
}

/* ------------------------------------------------------------------ *
 * Fix #2 — Timeline grouped by date.                                  *
 * ------------------------------------------------------------------ */

export interface TimelineGroup {
  dateLabel: string;
  rows: { message: Message; sender: Person; event?: string; isNew: boolean; seen: boolean }[];
}

export function timelineGroups(state: DemoState): TimelineGroup[] {
  const groups: TimelineGroup[] = [];
  MESSAGES.forEach((message) => {
    const label = fmtDay(message.sentAt);
    let group = groups[groups.length - 1];
    if (!group || group.dateLabel !== label) {
      group = { dateLabel: label, rows: [] };
      groups.push(group);
    }
    group.rows.push({
      message,
      sender: PEOPLE[message.from],
      event: message.event,
      isNew: message.isNew,
      seen: !!state.seen[message.id],
    });
  });
  return groups;
}

/* ------------------------------------------------------------------ *
 * Fix #3 — Files panel (latest first, old nested).                    *
 * ------------------------------------------------------------------ */

export interface FileRow {
  attachment: Attachment;
  message: Message;
  when: string;
  old?: { attachment: Attachment; label: string };
}

export interface LinkRow {
  link: Link;
  message: Message;
  when: string;
}

export function fileRows(): FileRow[] {
  const latest = ATTACHMENTS.filter((a) => a.version !== "old");
  const rows: FileRow[] = latest.map((attachment) => {
    const message = messageById(attachment.messageId)!;
    const oldAtt = ATTACHMENTS.find((a) => a.supersededBy === attachment.id);
    const row: FileRow = {
      attachment,
      message,
      when: `${PEOPLE[message.from].first}, ${fmtShort(message.sentAt)}`,
    };
    if (oldAtt) {
      const oldMsg = messageById(oldAtt.messageId)!;
      row.old = { attachment: oldAtt, label: `${fmtShort(oldMsg.sentAt)} version` };
    }
    return row;
  });
  return rows.sort((a, b) => dateNum(b.message.sentAt) - dateNum(a.message.sentAt));
}

export function linkRows(): LinkRow[] {
  return LINKS.map((link) => {
    const message = messageById(link.messageId)!;
    return { link, message, when: `${PEOPLE[message.from].first}, ${fmtShort(message.sentAt)}` };
  });
}

/* ------------------------------------------------------------------ *
 * Highlight helper: split a body around an ask's highlight sentence.  *
 * ------------------------------------------------------------------ */

export interface HighlightSplit {
  before: string;
  match: string;
  after: string;
}

export function splitHighlight(body: string, sentence: string | undefined): HighlightSplit | null {
  if (!sentence) return null;
  const i = body.indexOf(sentence);
  if (i < 0) return null;
  return { before: body.slice(0, i), match: sentence, after: body.slice(i + sentence.length) };
}
