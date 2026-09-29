import { ASKS, BRANCHES, MERGE_CANDIDATE, MESSAGES } from "./data";
import { dateNum, NOW, type Stamp } from "./dates";
import type { Ask, Branch, Reminder, Thread } from "./types";

export type View = "summary" | "timeline" | "branches";

export interface FilesPanel {
  open: boolean;
  tab: "files" | "links";
}

export interface Toast {
  message: string;
  /** Action offered in the toast, if any. */
  undo?: "split";
}

export interface AskAnswer {
  question: string;
  answer: string;
  sources: { messageId: string; label: string; sentence: string }[];
}

export interface DemoState {
  view: View;
  selectedId: string | null;
  /** True when the current selection came from the auto-open-ask rule. */
  autoAsk: boolean;
  seen: Record<string, boolean>;
  asks: Record<string, Ask>;
  /** Reminders keyed by messageId (one per message). */
  reminders: Record<string, Reminder>;
  /** The single pinned message, if any. */
  pinnedId: string | null;
  /** Messages the user has marked done. */
  done: Record<string, boolean>;
  branches: Record<string, Branch>;
  /** Branch currently split out to another thread (shows a placeholder). */
  movedBranchId: string | null;
  splitThread: Thread | null;
  /** Merge candidate folded into this thread. */
  merged: boolean;
  mergeDismissed: boolean;
  filesPanel: FilesPanel;
  askAnswer: AskAnswer | null;
  toast: Toast | null;
  /** Message id to briefly flash after a jump. */
  flashId: string | null;
  /** A sentence to flash inside the reader (ask-about-thread source jump). */
  flashSentence: string | null;
  /** Dev-only: a reminder being "fired" for the banner. */
  firedReminder: Reminder | null;
}

/* ------------------------------------------------------------------ *
 * Reminder presets — all relative to the frozen NOW (Sat Sep 26).     *
 * ------------------------------------------------------------------ */

export type ReminderKind = "later-today" | "tomorrow" | "before-due" | "pick";

function dayBefore(s: Stamp): Stamp {
  if (s.day > 1) return { month: s.month, day: s.day - 1 };
  // Only Oct 1 → Sep 30 occurs in this dataset.
  return { month: 9, day: 30 };
}

/** Weekday label for a stamp (mirrors dates.ts table for reminder tags). */
const WEEKDAY: Record<string, string> = {
  "9-26": "Sat", "9-27": "Sun", "9-30": "Wed", "10-1": "Thu",
};
function wd(s: Stamp): string {
  return WEEKDAY[`${s.month}-${s.day}`] ?? "";
}

export function reminderFor(kind: ReminderKind, messageId: string, due?: Stamp): Reminder {
  switch (kind) {
    case "later-today": {
      const at = { ...NOW, time: "6 PM" };
      return { messageId, at, label: `${wd(at)} 6 PM` };
    }
    case "tomorrow": {
      const at: Stamp = { month: 9, day: 27, time: "9 AM" };
      return { messageId, at, label: `${wd(at)} 9 AM` };
    }
    case "before-due": {
      const at = { ...dayBefore(due ?? { month: 9, day: 30 }), time: "2 PM" };
      return { messageId, at, label: `${wd(at)} 2 PM` };
    }
    case "pick":
    default: {
      const at: Stamp = { month: 9, day: 30, time: "2 PM" };
      return { messageId, at, label: `${wd(at)} 2 PM` };
    }
  }
}

/* ------------------------------------------------------------------ *
 * Actions.                                                            *
 * ------------------------------------------------------------------ */

export type Action =
  | { type: "SELECT"; id: string }
  | { type: "SET_VIEW"; view: View }
  | { type: "JUMP_TO"; id: string; flash?: boolean; sentence?: string }
  | { type: "CLEAR_FLASH" }
  | { type: "TOAST"; message: string }
  | { type: "FORWARD"; what: string }
  | { type: "MARK_ASK_DONE"; askId: string }
  | { type: "DISMISS_ASK"; askId: string }
  | { type: "REPLY"; messageId: string }
  | { type: "SET_REMINDER"; kind: ReminderKind; messageId: string; due?: Stamp }
  | { type: "CLEAR_REMINDER"; messageId: string }
  | { type: "FIRE_REMINDER"; messageId: string }
  | { type: "DISMISS_FIRED" }
  | { type: "PIN"; id: string }
  | { type: "UNPIN" }
  | { type: "MARK_DONE"; id: string }
  | { type: "MUTE_BRANCH"; branchId: string }
  | { type: "UNMUTE_BRANCH"; branchId: string }
  | { type: "SPLIT_BRANCH"; branchId: string; name: string }
  | { type: "UNDO_SPLIT" }
  | { type: "MERGE" }
  | { type: "KEEP_SEPARATE" }
  | { type: "OPEN_FILES"; tab?: "files" | "links" }
  | { type: "CLOSE_FILES" }
  | { type: "ASK_QUESTION"; answer: AskAnswer | null }
  | { type: "CLEAR_ANSWER" }
  | { type: "DISMISS_TOAST" };

/* ------------------------------------------------------------------ *
 * Initial state + the open-on-mount selection rule.                   *
 * ------------------------------------------------------------------ */

/**
 * Opens on the first open ask with the nearest due date; falling back to
 * the first new message, then the latest message.
 */
export function initialSelection(): { id: string; auto: boolean } {
  const openDue = ASKS.filter((a) => a.status === "open" && a.dueDate).sort(
    (a, b) => dateNum(a.dueDate!) - dateNum(b.dueDate!),
  );
  if (openDue.length) return { id: openDue[0].messageId, auto: true };
  const firstNew = MESSAGES.find((m) => m.isNew);
  if (firstNew) return { id: firstNew.id, auto: false };
  return { id: MESSAGES[MESSAGES.length - 1].id, auto: false };
}

export function initialState(): DemoState {
  const asks: Record<string, Ask> = {};
  ASKS.forEach((a) => (asks[a.id] = { ...a }));
  const branches: Record<string, Branch> = {};
  Object.values(BRANCHES).forEach((b) => (branches[b.id] = { ...b }));
  const seen: Record<string, boolean> = {};
  MESSAGES.forEach((m) => (seen[m.id] = !m.isNew));

  const sel = initialSelection();
  seen[sel.id] = true;

  return {
    view: "summary",
    selectedId: sel.id,
    autoAsk: sel.auto,
    seen,
    asks,
    reminders: {},
    pinnedId: null,
    done: {},
    branches,
    movedBranchId: null,
    splitThread: null,
    merged: false,
    mergeDismissed: false,
    filesPanel: { open: false, tab: "files" },
    askAnswer: null,
    toast: null,
    flashId: null,
    flashSentence: null,
    firedReminder: null,
  };
}

/* ------------------------------------------------------------------ *
 * Reducer.                                                            *
 * ------------------------------------------------------------------ */

function askByMessage(state: DemoState, messageId: string): Ask | undefined {
  return Object.values(state.asks).find((a) => a.messageId === messageId);
}

export function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case "SELECT":
      return { ...state, selectedId: action.id, autoAsk: false, seen: { ...state.seen, [action.id]: true } };

    case "SET_VIEW":
      return { ...state, view: action.view };

    case "JUMP_TO":
      return {
        ...state,
        selectedId: action.id,
        autoAsk: false,
        seen: { ...state.seen, [action.id]: true },
        flashId: action.flash === false ? null : action.id,
        flashSentence: action.sentence ?? null,
      };

    case "CLEAR_FLASH":
      return state.flashId === null && state.flashSentence === null
        ? state
        : { ...state, flashId: null, flashSentence: null };

    case "TOAST":
      return { ...state, toast: { message: action.message } };

    case "FORWARD":
      return { ...state, toast: { message: `${action.what} forwarded` } };

    case "MARK_ASK_DONE": {
      const ask = state.asks[action.askId];
      if (!ask) return state;
      const reminders = { ...state.reminders };
      delete reminders[ask.messageId];
      return { ...state, asks: { ...state.asks, [action.askId]: { ...ask, status: "done" } }, reminders };
    }

    case "DISMISS_ASK": {
      const ask = state.asks[action.askId];
      if (!ask) return state;
      const reminders = { ...state.reminders };
      delete reminders[ask.messageId];
      return { ...state, asks: { ...state.asks, [action.askId]: { ...ask, status: "dismissed" } }, reminders };
    }

    case "REPLY": {
      // Replying answers the ask and clears its reminder.
      const ask = askByMessage(state, action.messageId);
      const reminders = { ...state.reminders };
      delete reminders[action.messageId];
      if (!ask) return { ...state, reminders };
      return { ...state, asks: { ...state.asks, [ask.id]: { ...ask, status: "done" } }, reminders };
    }

    case "SET_REMINDER": {
      const r = reminderFor(action.kind, action.messageId, action.due);
      return { ...state, reminders: { ...state.reminders, [action.messageId]: r } };
    }

    case "CLEAR_REMINDER": {
      const reminders = { ...state.reminders };
      delete reminders[action.messageId];
      return { ...state, reminders };
    }

    case "FIRE_REMINDER": {
      const r = state.reminders[action.messageId];
      return r ? { ...state, firedReminder: r } : state;
    }

    case "DISMISS_FIRED":
      return { ...state, firedReminder: null };

    case "PIN":
      return { ...state, pinnedId: action.id };

    case "UNPIN":
      return { ...state, pinnedId: null };

    case "MARK_DONE":
      return { ...state, done: { ...state.done, [action.id]: !state.done[action.id] } };

    case "MUTE_BRANCH":
      return { ...state, branches: { ...state.branches, [action.branchId]: { ...state.branches[action.branchId], muted: true } } };

    case "UNMUTE_BRANCH":
      return { ...state, branches: { ...state.branches, [action.branchId]: { ...state.branches[action.branchId], muted: false } } };

    case "SPLIT_BRANCH": {
      const branch = state.branches[action.branchId];
      if (!branch) return state;
      const splitThread: Thread = {
        id: `split-${action.branchId}`,
        subject: action.name,
        splitFrom: "Team offsite: venue and agenda",
      };
      return {
        ...state,
        movedBranchId: action.branchId,
        splitThread,
        toast: { message: `${branch.label} moved to a new thread`, undo: "split" },
      };
    }

    case "UNDO_SPLIT":
      return { ...state, movedBranchId: null, splitThread: null, toast: null };

    case "MERGE":
      return { ...state, merged: true, mergeDismissed: true, toast: { message: `"${MERGE_CANDIDATE.subject}" merged into this thread` } };

    case "KEEP_SEPARATE":
      return { ...state, mergeDismissed: true };

    case "OPEN_FILES":
      return { ...state, filesPanel: { open: true, tab: action.tab ?? state.filesPanel.tab } };

    case "CLOSE_FILES":
      return { ...state, filesPanel: { ...state.filesPanel, open: false } };

    case "ASK_QUESTION":
      return { ...state, askAnswer: action.answer };

    case "CLEAR_ANSWER":
      return { ...state, askAnswer: null };

    case "DISMISS_TOAST":
      return { ...state, toast: null };

    default:
      return state;
  }
}
