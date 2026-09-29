import type {
  Ask,
  Attachment,
  Branch,
  Decision,
  Link,
  Message,
  Person,
  PersonId,
  Thread,
} from "./types";

/* ------------------------------------------------------------------ *
 * People. Sam Rivera (Facilities) is added to the thread on Sep 22.   *
 * ------------------------------------------------------------------ */

export const PEOPLE: Record<PersonId, Person> = {
  priya: { name: "Priya Shah", first: "Priya", email: "priya@northwind.co", initials: "PS", bg: "#ECE6F7", fg: "#553A99" },
  marcus: { name: "Marcus Lee", first: "Marcus", email: "marcus@northwind.co", initials: "ML", bg: "#E1EFE7", fg: "#1F5E43" },
  dana: { name: "Dana Okafor", first: "Dana", email: "dana@northwind.co", initials: "DO", bg: "#FBE8DA", fg: "#8C4115" },
  sam: { name: "Sam Rivera", first: "Sam", email: "sam@northwind.co", initials: "SR", bg: "#E7EEF0", fg: "#2C5A6B" },
  me: { name: "Brian Ngo (you)", first: "You", email: "brian@northwind.co", initials: "BN", bg: "#E2EAFA", fg: "#274C99" },
};

export const MAIN_THREAD_ID = "offsite";

export const THREADS: Record<string, Thread> = {
  offsite: {
    id: "offsite",
    subject: "Team offsite: venue and agenda",
    label: { text: "Offsite", color: "#7A5AC8" },
  },
};

/* ------------------------------------------------------------------ *
 * Branches (from reply structure). Venue vote = purple, Budget = green.*
 * Each branch is rooted at a depth-1 reply; the thread root (m1) is    *
 * not itself a branch head.                                            *
 * ------------------------------------------------------------------ */

export const BRANCHES: Record<string, Branch> = {
  venue: { id: "venue", label: "Venue vote", color: "#7A5AC8", rootMessageId: "m2", muted: false },
  budget: { id: "budget", label: "Budget cap", color: "#1F7A5C", rootMessageId: "m4", muted: false },
};

/* ------------------------------------------------------------------ *
 * Messages. One thread, nine messages, threaded by inReplyTo.         *
 * ------------------------------------------------------------------ */

export const MESSAGES: Message[] = [
  {
    id: "m1", threadId: "offsite", from: "priya", to: ["marcus", "dana", "me"], cc: [],
    sentAt: { month: 9, day: 15, time: "9:12 AM" }, inReplyTo: null,
    subject: "Team offsite: venue and agenda", topic: "Offsite kickoff", branchId: "venue", isNew: false,
    askId: "ask-vote",
    summary: "Kicks off planning, vote on three venues by Friday.",
    body: "Hi all,\n\nIt's that time again. I'd like to lock in our fall offsite for the second half of October: two days, whole team.\n\nI've shortlisted three venues in the attached PDF: Sonoma Barn, Half Moon Lodge, and the Presidio space we used last year. Each has tradeoffs on price and travel time.\n\nPlease vote using the form below by Friday so I can put down a deposit.\n\nThanks,\nPriya",
  },
  {
    id: "m2", threadId: "offsite", from: "marcus", to: ["priya", "dana", "me"], cc: [],
    sentAt: { month: 9, day: 15, time: "10:40 AM" }, inReplyTo: "m1",
    subject: "Team offsite: venue and agenda", topic: "Venue vote", branchId: "venue", isNew: false,
    summary: "Votes Sonoma; Oct 16 clashes with sales kickoff.",
    body: "Sonoma Barn gets my vote. The Presidio was fine, but we've outgrown it.\n\nOne thing: Oct 16 is sales kickoff, so half my team is out that week. Can we look at the 21st or later?\n\nMarcus",
  },
  {
    id: "m3", threadId: "offsite", from: "me", to: ["priya", "marcus", "dana"], cc: [],
    sentAt: { month: 9, day: 15, time: "11:02 AM" }, inReplyTo: "m2",
    subject: "Team offsite: venue and agenda", topic: "+1 for Sonoma", branchId: "venue", isNew: false,
    summary: "+1 for Sonoma Barn; out on the 16th too.",
    body: "+1 for Sonoma Barn. I'm out on the 16th as well.",
  },
  {
    id: "m4", threadId: "offsite", from: "dana", to: ["priya", "marcus", "me"], cc: [],
    sentAt: { month: 9, day: 16, time: "4:25 PM" }, inReplyTo: "m1",
    subject: "Team offsite: venue and agenda", topic: "Budget cap", branchId: "budget", isNew: false,
    summary: "Budget capped at $18k; catering about $2.4k over.",
    body: "Hi team,\n\nFinance approved an $18k cap for the offsite, all in. I've put a first pass at the budget in the attached sheet.\n\nThe catering quote from Sonoma is the problem: it puts us about $2.4k over. I'll ask whether they can do a lighter lunch on day two.\n\nFloor plan attached too, in case it helps with the agenda.\n\nDana",
  },
  {
    id: "m5", threadId: "offsite", from: "priya", to: ["marcus", "dana", "sam", "me"], cc: [],
    sentAt: { month: 9, day: 22, time: "8:47 AM" }, inReplyTo: "m3",
    subject: "Team offsite: venue and agenda", topic: "Venue decided", branchId: "venue", isNew: false,
    event: "Priya added Sam Rivera (Facilities) to the thread",
    summary: "Decision: Sonoma Barn, Oct 21 to 22. Draft agenda attached.",
    body: "Morning all,\n\nThe votes are in: Sonoma Barn it is, Tuesday Oct 21 to Wednesday Oct 22. The deposit is paid.\n\nAdding Sam from Facilities, who'll handle transport and room setup.\n\nI've attached a draft agenda. Each session needs an owner, so reply here with what you'd like to take and I'll fill in the rest.\n\nPriya",
  },
  {
    id: "m6", threadId: "offsite", from: "marcus", to: ["priya", "dana", "sam", "me"], cc: [],
    sentAt: { month: 9, day: 22, time: "9:30 AM" }, inReplyTo: "m5",
    subject: "Team offsite: venue and agenda", topic: "Session owners", branchId: "venue", isNew: false,
    summary: "Takes Day 1 kickoff and the team retro.",
    body: "I can take the Day 1 kickoff and the team retro.",
  },
  {
    id: "m7", threadId: "offsite", from: "dana", to: ["priya", "marcus", "sam", "me"], cc: [],
    sentAt: { month: 9, day: 24, time: "10:14 AM" }, inReplyTo: "m4",
    subject: "Team offsite: venue and agenda", topic: "Catering update", branchId: "budget", isNew: false,
    askId: "ask-headcount",
    summary: "Catering renegotiated, now under budget. Needs headcount by Sep 27.",
    body: "Quick update: I renegotiated catering and the new quote is attached. We're now under budget. I still need final headcount and dietary needs by Sep 27.\n\nSonoma agreed to a lighter lunch on day two, which brings catering to $15.9k total, under the cap.\n\nPlease fill in the form linked below, even if you have no restrictions.\n\nDana",
  },
  {
    id: "m8", threadId: "offsite", from: "priya", to: ["me"], cc: ["marcus", "dana", "sam"],
    sentAt: { month: 9, day: 24, time: "1:05 PM" }, inReplyTo: "m5",
    subject: "Team offsite: venue and agenda", topic: "Workshop ask", branchId: "venue", isNew: true,
    askId: "ask-workshop", mentionIds: ["att-agenda"],
    summary: "Asks you to run the Day 2 design workshop.",
    body: "Hi Brian,\n\nNow that the agenda is taking shape, there's one open slot I'd love your help with. Would you be up for running the Day 2 design workshop? Could you let me know by Thursday so I can finalize the schedule?\n\nIt's a 90-minute block after lunch. The outline is in agenda-draft.docx from my last email, and you'd have full say over the format.\n\nThanks,\nPriya",
  },
  {
    id: "m9", threadId: "offsite", from: "marcus", to: ["priya", "dana", "sam", "me"], cc: [],
    sentAt: { month: 9, day: 24, time: "2:38 PM" }, inReplyTo: "m5",
    subject: "Team offsite: venue and agenda", topic: "Shuttle", branchId: "venue", isNew: true,
    summary: "Shuttle booked for both days.",
    body: "Quick logistics note: I've booked a shuttle from the office, leaving at 8 AM sharp on the 21st and returning around 6 PM on the 22nd.\n\nParking at the barn is limited, so please take the shuttle unless you really need your car.\n\nMarcus",
  },
];

/* ------------------------------------------------------------------ *
 * Asks directed at "you".                                             *
 * ------------------------------------------------------------------ */

export const ASKS: Ask[] = [
  {
    id: "ask-vote", messageId: "m1", text: "Vote on a venue",
    highlight: "Please vote using the form below by Friday so I can put down a deposit.",
    status: "done",
  },
  {
    id: "ask-headcount", messageId: "m7", text: "Send headcount and dietary needs",
    dueDate: { month: 9, day: 27 },
    highlight: "I still need final headcount and dietary needs by Sep 27.",
    status: "open",
  },
  {
    id: "ask-workshop", messageId: "m8", text: "Run the Day 2 design workshop?",
    dueDate: { month: 10, day: 1 },
    highlight: "Would you be up for running the Day 2 design workshop? Could you let me know by Thursday so I can finalize the schedule?",
    status: "open",
  },
];

/* ------------------------------------------------------------------ *
 * Decisions extracted from the thread. Venue is the pinned default.   *
 * ------------------------------------------------------------------ */

export const DECISIONS: Decision[] = [
  { id: "dec-venue", label: "Venue", text: "Sonoma Barn, Oct 21 to 22", messageId: "m5" },
  { id: "dec-budget", label: "Budget", text: "Capped at $18k; catering now under", messageId: "m7" },
  { id: "dec-transport", label: "Transport", text: "Shuttle booked", messageId: "m9" },
  { id: "dec-owners", label: "Owners", text: "Marcus: Day 1 kickoff and retro", messageId: "m6" },
];

export const PINNED_DECISION_ID = "dec-venue";

/* ------------------------------------------------------------------ *
 * Attachments (6 files) and links (5 links).                          *
 * catering-quote.pdf v1 (Sep 16) is superseded by v2 (Sep 24).        *
 * ------------------------------------------------------------------ */

export const ATTACHMENTS: Attachment[] = [
  { id: "att-venue", name: "venue-options.pdf", meta: "PDF, 2.4 MB", messageId: "m1" },
  { id: "att-budget", name: "budget-v2.xlsx", meta: "Sheet, 48 KB", messageId: "m4" },
  { id: "att-catering-v1", name: "catering-quote.pdf", meta: "PDF, 310 KB", messageId: "m4", version: "old", supersededBy: "att-catering-v2" },
  { id: "att-floorplan", name: "sonoma-floorplan.png", meta: "Image, 1.1 MB", messageId: "m4" },
  { id: "att-agenda", name: "agenda-draft.docx", meta: "Doc, 86 KB", messageId: "m5" },
  { id: "att-catering-v2", name: "catering-quote.pdf", meta: "PDF, 295 KB", messageId: "m7", version: "latest" },
];

export const LINKS: Link[] = [
  { id: "lnk-vote", name: "Venue vote form", meta: "forms.northwind.co", messageId: "m1" },
  { id: "lnk-sonoma", name: "Sonoma Barn", meta: "sonomabarn.com", messageId: "m5" },
  { id: "lnk-dietary", name: "Dietary needs form", meta: "forms.northwind.co", messageId: "m7" },
  { id: "lnk-agenda", name: "Agenda (live doc)", meta: "docs.northwind.co", messageId: "m8" },
  { id: "lnk-slack", name: "#offsite-2026", meta: "Slack channel", messageId: "m8" },
];

/* ------------------------------------------------------------------ *
 * "Since you last looked" recap line (state changed since Sep 22).    *
 * ------------------------------------------------------------------ */

export const SINCE_RECAP =
  "Catering came in under budget, Marcus booked a shuttle, and Priya asked you to run a workshop.";

/* ------------------------------------------------------------------ *
 * A separate thread whose subject was edited — the merge suggestion.  *
 * It really replies to Dana's budget email, so merging lands it under *
 * the Budget cap branch.                                              *
 * ------------------------------------------------------------------ */

export interface MergeCandidate {
  threadId: string;
  subject: string;
  from: PersonId;
  sentAt: { month: number; day: number };
  snippet: string;
  /** Branch it joins on merge. */
  targetBranchId: string;
}

export const MERGE_CANDIDATE: MergeCandidate = {
  threadId: "catering-headcount",
  subject: "Offsite catering headcount",
  from: "dana",
  sentAt: { month: 9, day: 20 },
  snippet: "Splitting this out so it's easier to track — how many are we catering for?",
  targetBranchId: "budget",
};

/* ------------------------------------------------------------------ *
 * Continuation example: a thread that hit the 100-message cap and was *
 * continued as Part 2.                                                *
 * ------------------------------------------------------------------ */

export const CONTINUATION = {
  subject: "Q4 vendor review",
  part: 2,
  fromLabel: "Part 1, messages 1 to 100",
};
