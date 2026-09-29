import { PEOPLE } from "./data";
import { BRANCH_COLORS, INDENT, ROW, color } from "./tokens";
import type { Item, Message, Thread, ThreadState } from "./types";

/* ------------------------------------------------------------------ *
 * Pure helpers (ported from the mockup's support functions).          *
 * ------------------------------------------------------------------ */

export function dayLabel(d: number): string {
  if (d === 24) return "Today, Sep 24";
  if (d === 23) return "Yesterday";
  return "Sep " + d;
}

export function itemsLabel(items: Item[]): string {
  const files = items.filter((x) => x.kind === "file").length;
  const links = items.length - files;
  const parts: string[] = [];
  if (files) parts.push(files + (files > 1 ? " files" : " file"));
  if (links) parts.push(links + (links > 1 ? " links" : " link"));
  return parts.join(", ");
}

export interface DecoratedItem {
  name: string;
  meta: string;
  note: string;
  hasNote: boolean;
  title: string;
  isFile: boolean;
  isLink: boolean;
  isOld: boolean;
  isLatest: boolean;
  color: string;
}

export function decorate(items: Item[]): DecoratedItem[] {
  return items.map((x) => ({
    name: x.name,
    meta: x.meta,
    note: x.note || "",
    hasNote: !!x.note,
    title: x.meta + (x.note ? ". " + x.note : ""),
    isFile: x.kind === "file",
    isLink: x.kind === "link",
    isOld: x.version === "old",
    isLatest: x.version === "latest",
    color: x.version === "old" ? "#7C776D" : "#34312C",
  }));
}

function childrenOf(msgs: Message[], i: number): number[] {
  const r: number[] = [];
  msgs.forEach((m, j) => {
    if (m.replyTo === i) r.push(j);
  });
  return r;
}

interface TreeEntry {
  i: number;
  d: number;
  branch: number | null;
}

function treeOrder(msgs: Message[]): TreeEntry[] {
  const out: TreeEntry[] = [];
  function go(i: number, d: number, branch: number | null) {
    out.push({ i, d, branch });
    childrenOf(msgs, i).forEach((c) => go(c, d + 1, d === 0 ? c : branch));
  }
  msgs.forEach((m, i) => {
    if (m.replyTo === null) go(i, 0, null);
  });
  return out;
}

function ancestors(msgs: Message[], i: number): number[] {
  const r: number[] = [];
  let p = msgs[i].replyTo;
  while (p !== null && p !== undefined) {
    r.push(p);
    p = msgs[p].replyTo;
  }
  return r;
}

/* ------------------------------------------------------------------ *
 * View-model types.                                                   *
 * ------------------------------------------------------------------ */

export interface MessageVM {
  idx: number;
  visible: boolean;
  collapsedHead: boolean;
  earlyLabel: string;
  earlyDateLabel: string;
  earlyItems: string;
  name: string;
  initials: string;
  avBg: string;
  avFg: string;
  time: string;
  summary: string | null;
  body: string;
  isAsk: boolean;
  hasEvent: boolean;
  event: string;
  showDate: boolean;
  showNew: boolean;
  dateLabel: string;
  gapLabel: string;
  hasChip: boolean;
  chipName: string;
  chipTopic: string;
  chipAria: string;
  parentIdx: number | null;
  btnPadTop: string;
  dotTop: string;
  filesTop: string;
  opacity: string;
  dotBg: string;
  dotBorder: string;
  cardBg: string;
  cardBorder: string;
  ring: string;
  nameWeight: number;
  hasSummary: boolean;
  failed: boolean;
  plain: boolean;
  oneItem: boolean;
  manyItems: boolean;
  first?: DecoratedItem;
  items: DecoratedItem[];
  itemsLabel: string;
  isOpen: boolean;
  aria: string;
}

export interface NodeVM {
  idx: number;
  left: string;
  top: string;
  width: string;
  name: string;
  initials: string;
  avBg: string;
  avFg: string;
  topic: string;
  isAsk: boolean;
  line: string;
  branchColor: string;
  hasItems: boolean;
  itemCount: string;
  when: string;
  unseen: boolean;
  nameWeight: number;
  bg: string;
  border: string;
  ring: string;
  opacity: string;
  aria: string;
}

export interface EdgeVM {
  left: string;
  top: string;
  width: string;
  height: string;
  color: string;
  opacity: string;
}

export interface BranchVM {
  color: string;
  label: string;
  count: string;
}

export interface ReaderChild {
  idx: number;
  name: string;
  when: string;
}

export interface ReaderVM {
  fullName: string;
  email: string;
  initials: string;
  avBg: string;
  avFg: string;
  to: string;
  full: string;
  body: string;
  isAsk: boolean;
  hasParent: boolean;
  parentLabel: string;
  parentIdx: number | null;
  hasChildren: boolean;
  children: ReaderChild[];
  hasItems: boolean;
  items: DecoratedItem[];
  itemsLabel: string;
  /** Banner shown for an "asks you" message, e.g. "Dana is waiting on your answer." */
  askLabel: string;
}

export interface ThreadModel {
  accent: string;
  /** Conversation subject, for the thread-view heading. */
  title: string;
  hasLabel: boolean;
  labelText: string;
  /** e.g. "4 messages". */
  msgCountLabel: string;
  /** Aggregated attachments across the thread, e.g. "6 files, 5 links"; "" when none. */
  itemsSummary: string;
  isTimeline: boolean;
  isBranches: boolean;
  isSummaries: boolean;
  msgs: MessageVM[];
  nodes: NodeVM[];
  edges: EdgeVM[];
  branches: BranchVM[];
  treeHeight: string;
  treeMax: string;
  viewBtnLabel: string;
  viewBtnBg: string;
  viewBtnBorder: string;
  branchPressed: boolean;
  showReader: boolean;
  tlWidth: string;
  tlMax: string;
  tlBorder: string;
  hasNew: boolean;
  newLabel: string;
  chainLabel: string;
  reader: ReaderVM;
  selPos: string;
  unseen: number[];
  selIdx: number;
}

/* ------------------------------------------------------------------ *
 * The port of renderVals(): state + accent -> a pure view-model.      *
 * ------------------------------------------------------------------ */

export function buildModel(state: ThreadState, accent: string, thread: Thread): ThreadModel {
  const A = accent;
  const s = state;
  const MSGS = thread.msgs;
  const NEW_FROM = thread.newFrom;
  const EARLY_END = thread.earlyEnd;
  const hasSel = s.sel >= 0;

  const chain: Record<number, boolean> = {};
  if (hasSel) {
    chain[s.sel] = true;
    ancestors(MSGS, s.sel).forEach((a) => {
      chain[a] = true;
    });
    MSGS.forEach((m, j) => {
      if (ancestors(MSGS, j).indexOf(s.sel) >= 0) chain[j] = true;
    });
  }

  let earlyItems: Item[] = [];
  for (let k = 0; k < EARLY_END; k++) earlyItems = earlyItems.concat(MSGS[k].items);

  const msgs: MessageVM[] = MSGS.map((m, i) => {
    const p = PEOPLE[m.from];
    const prev: Message | undefined = MSGS[i - 1];
    const seen = !!s.seen[i];
    const selected = s.sel === i;
    const isNew = i === NEW_FROM;
    const gap = prev ? m.day - prev.day : 0;
    const open = !!s.open[i];
    const items = decorate(m.items);
    const hasChip = m.replyTo !== null && m.replyTo !== i - 1;
    const parent = m.replyTo !== null ? MSGS[m.replyTo] : null;
    const pp = parent ? PEOPLE[parent.from] : null;
    return {
      idx: i,
      visible: s.early || i >= EARLY_END,
      collapsedHead: EARLY_END > 0 && !s.early && i === 0,
      earlyLabel: EARLY_END + " earlier messages",
      earlyDateLabel: dayLabel(MSGS[0].day),
      earlyItems: itemsLabel(earlyItems),
      name: p.name,
      initials: p.initials,
      avBg: p.bg,
      avFg: p.fg,
      time: m.time,
      summary: m.summary,
      body: m.body,
      isAsk: !!m.ask,
      hasEvent: !!m.event,
      event: m.event || "",
      showDate: !isNew && (!prev || prev.day !== m.day),
      showNew: isNew,
      dateLabel: dayLabel(m.day),
      gapLabel: gap > 1 ? "· " + gap + " days later" : "",
      hasChip,
      chipName: pp ? pp.first : "",
      chipTopic: parent ? parent.topic + ", " + dayLabel(parent.day).replace("Today, ", "") : "",
      chipAria: parent && pp ? "Go to the message this replies to: " + pp.name + ", " + parent.topic : "",
      parentIdx: m.replyTo,
      btnPadTop: hasChip ? "8px" : "12px",
      dotTop: hasChip ? "50px" : "20px",
      filesTop: hasChip ? "41px" : "11px",
      opacity: "1",
      dotBg: seen ? color.card : A,
      dotBorder: seen ? color.dotIdle : A,
      cardBg: selected ? color.unreadBg : color.card,
      cardBorder: selected ? A : seen ? color.borderSoft : color.unreadBorder,
      ring: selected ? "0 0 0 2px " + A : "none",
      nameWeight: seen ? 500 : 700,
      hasSummary: !!m.summary,
      failed: !!m.failed,
      plain: !m.summary && !m.failed,
      oneItem: items.length === 1,
      manyItems: items.length > 1,
      first: items[0],
      items,
      itemsLabel: itemsLabel(m.items),
      isOpen: open,
      aria: (seen ? "" : "Unread. ") + "Open message from " + p.name + ", " + dayLabel(m.day) + ", " + m.time,
    };
  });

  const si = hasSel ? s.sel : 0;
  const sm = MSGS[si];
  const sp = PEOPLE[sm.from];
  const par = sm.replyTo !== null ? MSGS[sm.replyTo] : null;

  const children: ReaderChild[] = [];
  MSGS.forEach((m, j) => {
    if (m.replyTo === si) {
      children.push({
        idx: j,
        name: PEOPLE[m.from].first,
        when: dayLabel(m.day).replace("Today, ", "") + ", " + m.time,
      });
    }
  });

  const unseen: number[] = [];
  MSGS.forEach((m, i) => {
    if (!s.seen[i]) unseen.push(i);
  });
  const chainCount = Object.keys(chain).length;

  /* Branch (tree) view geometry. */
  const order = treeOrder(MSGS);
  const pos: Record<number, number> = {};
  const depth: Record<number, number> = {};
  const branchColor: Record<number, string> = {};
  const branchCount: Record<number, number> = {};
  const branchHeads: number[] = [];
  order.forEach((o, r) => {
    pos[o.i] = r;
    depth[o.i] = o.d;
    if (o.d === 1) {
      branchColor[o.i] = BRANCH_COLORS[branchHeads.length % BRANCH_COLORS.length];
      branchHeads.push(o.i);
    }
    if (o.branch !== null) branchCount[o.branch] = (branchCount[o.branch] || 0) + 1;
  });
  const dimmed = (i: number) => hasSel && !chain[i];

  const nodes: NodeVM[] = order.map((o) => {
    const m = MSGS[o.i];
    const p = PEOPLE[m.from];
    const seen = !!s.seen[o.i];
    const selected = s.sel === o.i;
    const ind = o.d * INDENT;
    return {
      idx: o.i,
      left: ind + "px",
      top: pos[o.i] * ROW + "px",
      width: "calc(100% - " + ind + "px)",
      name: p.first,
      initials: p.initials,
      avBg: p.bg,
      avFg: p.fg,
      topic: m.topic,
      isAsk: !!m.ask,
      line: m.summary || m.body.split("\n")[0],
      branchColor: o.branch !== null ? branchColor[o.branch] : color.dotIdle,
      hasItems: m.items.length > 0,
      itemCount: String(m.items.length),
      when: dayLabel(m.day).replace("Today, ", "") + ", " + m.time,
      unseen: !seen,
      nameWeight: seen ? 500 : 700,
      bg: selected ? color.unreadBg : color.card,
      border: selected ? A : hasSel && chain[o.i] ? color.chainBorder : seen ? color.borderSoft : color.unreadBorder,
      ring: selected ? "0 0 0 2px " + A : "none",
      opacity: dimmed(o.i) ? "0.38" : "1",
      aria: (seen ? "" : "Unread. ") + "Open message from " + p.name + ": " + m.topic,
    };
  });

  const edges: EdgeVM[] = order
    .filter((o) => MSGS[o.i].replyTo !== null)
    .map((o) => {
      const parIdx = MSGS[o.i].replyTo as number;
      const x = depth[parIdx] * INDENT + 25;
      const y = pos[parIdx] * ROW + 60;
      return {
        left: x + "px",
        top: y + "px",
        width: o.d * INDENT - x + "px",
        height: pos[o.i] * ROW + 30 - y + "px",
        color: (o.branch !== null && branchColor[o.branch]) || color.dotIdle,
        opacity: dimmed(o.i) || dimmed(parIdx) ? "0.3" : "1",
      };
    });

  const branches: BranchVM[] = branchHeads.map((h) => {
    const n = branchCount[h] || 1;
    return { color: branchColor[h], label: MSGS[h].topic, count: n + (n > 1 ? " messages" : " message") };
  });

  const isBranches = s.view === "branches";
  const isSummaries = s.view === "summaries";

  const allItems = MSGS.reduce<Item[]>((acc, m) => acc.concat(m.items), []);

  return {
    accent: A,
    title: thread.subject,
    hasLabel: !!thread.label,
    labelText: thread.label?.text ?? "",
    msgCountLabel: MSGS.length + (MSGS.length === 1 ? " message" : " messages"),
    itemsSummary: itemsLabel(allItems),
    isTimeline: !isBranches && !isSummaries,
    isBranches,
    isSummaries,
    msgs,
    nodes,
    edges,
    branches,
    treeHeight: order.length * ROW - 12 + "px",
    treeMax: hasSel ? "none" : "860px",
    viewBtnLabel: isBranches ? "Back to timeline" : "Show branches",
    viewBtnBg: isBranches ? color.paper : color.card,
    viewBtnBorder: isBranches ? color.borderStrong : color.border,
    branchPressed: isBranches,
    showReader: hasSel,
    tlWidth: hasSel ? "580px" : "100%",
    tlMax: hasSel ? "none" : "1000px",
    tlBorder: hasSel ? "1px solid " + color.line : "0",
    hasNew: unseen.length > 0,
    newLabel: unseen.length + " new",
    chainLabel: isBranches && chainCount < MSGS.length ? "Highlighting " + chainCount + " messages in this conversation" : "",
    reader: {
      fullName: sm.from === "me" ? "Brian Ngo (you)" : sp.name,
      email: sp.email,
      initials: sp.initials,
      avBg: sp.bg,
      avFg: sp.fg,
      to: sm.to,
      full: sm.full,
      body: sm.body,
      isAsk: !!sm.ask,
      hasParent: !!par,
      parentLabel: par ? PEOPLE[par.from].first + " · " + par.topic + ", " + dayLabel(par.day).replace("Today, ", "") : "",
      parentIdx: sm.replyTo,
      hasChildren: children.length > 0,
      children,
      hasItems: sm.items.length > 0,
      items: decorate(sm.items),
      itemsLabel: itemsLabel(sm.items),
      askLabel: sp.first + " is waiting on your answer.",
    },
    selPos: si + 1 + " of " + MSGS.length,
    unseen,
    selIdx: si,
  };
}

/** Initial state, ported from the Component constructor. */
export function initialState(openFirstNew: boolean, thread: Thread): ThreadState {
  const seen: Record<number, boolean> = {};
  for (let i = 0; i < thread.newFrom; i++) seen[i] = true;
  // Only open the first new message if there actually is one.
  const hasNew = thread.newFrom < thread.msgs.length;
  const startSel = openFirstNew && hasNew ? thread.newFrom : -1;
  if (startSel >= 0) seen[startSel] = true;
  const open: Record<number, boolean> = {};
  (thread.defaultOpen ?? []).forEach((i) => {
    open[i] = true;
  });
  return { sel: startSel, seen, open, early: false, view: "timeline" };
}
