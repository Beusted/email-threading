import type { Message, Person, PersonId, Thread } from "./types";

export const PEOPLE: Record<PersonId, Person> = {
  priya: { name: "Priya Shah", first: "Priya", email: "priya@northwind.co", initials: "PS", bg: "#ECE6F7", fg: "#553A99" },
  marcus: { name: "Marcus Lee", first: "Marcus", email: "marcus@northwind.co", initials: "ML", bg: "#E1EFE7", fg: "#1F5E43" },
  dana: { name: "Dana Okafor", first: "Dana", email: "dana@northwind.co", initials: "DO", bg: "#FBE8DA", fg: "#8C4115" },
  sam: { name: "Sam Rivera", first: "Sam", email: "sam@northwind.co", initials: "SR", bg: "#E7EEF0", fg: "#2C5A6B" },
  jules: { name: "Jules Tran", first: "Jules", email: "jules@northwind.co", initials: "JT", bg: "#FCE7EF", fg: "#9B2C5A" },
  me: { name: "You", first: "You", email: "brian@northwind.co", initials: "BN", bg: "#E2EAFA", fg: "#274C99" },
};

const OFFSITE_MSGS: Message[] = [
  {
    from: "priya", replyTo: null, topic: "Offsite kickoff", day: 15, time: "9:12 AM", full: "Mon, Sep 15, 9:12 AM", to: "Marcus Lee, Dana Okafor, you",
    summary: "Kicks off planning for a 2-day October offsite. Vote on one of three venues by Friday.",
    body: "Hi all,\n\nIt's that time again. I'd like to lock in our fall offsite for the second half of October: two days, whole team.\n\nI've shortlisted three venues in the attached PDF: Sonoma Barn, Half Moon Lodge, and the Presidio space we used last year. Each has tradeoffs on price and travel time.\n\nPlease vote using the form below by Friday so I can put down a deposit.\n\nThanks,\nPriya",
    items: [{ kind: "file", name: "venue-options.pdf", meta: "PDF, 2.4 MB" }, { kind: "link", name: "Venue vote form", meta: "forms.northwind.co" }],
  },
  {
    from: "marcus", replyTo: 0, topic: "Venue vote", day: 15, time: "10:40 AM", full: "Mon, Sep 15, 10:40 AM", to: "Priya Shah, Dana Okafor, you",
    summary: "Votes for Sonoma Barn. Warns that Oct 16 clashes with sales kickoff.",
    body: "Sonoma Barn gets my vote. The Presidio was fine, but we've outgrown it.\n\nOne thing: Oct 16 is sales kickoff, so half my team is out that week. Can we look at the 21st or later?\n\nMarcus",
    items: [],
  },
  {
    from: "me", replyTo: 1, topic: "+1 for Sonoma", day: 15, time: "11:02 AM", full: "Mon, Sep 15, 11:02 AM", to: "Priya Shah, Marcus Lee, Dana Okafor",
    summary: null, body: "+1 for Sonoma Barn. I'm out on the 16th as well.", items: [],
  },
  {
    from: "dana", replyTo: 0, topic: "Budget cap", day: 16, time: "4:25 PM", full: "Tue, Sep 16, 4:25 PM", to: "Priya Shah, Marcus Lee, you",
    summary: "Budget is capped at $18k. The current catering quote runs about $2.4k over.",
    body: "Hi team,\n\nFinance approved an $18k cap for the offsite, all in. I've put a first pass at the budget in the attached sheet.\n\nThe catering quote from Sonoma is the problem: it puts us about $2.4k over. I'll ask whether they can do a lighter lunch on day two.\n\nFloor plan attached too, in case it helps with the agenda.\n\nDana",
    items: [
      { kind: "file", name: "budget-v2.xlsx", meta: "Sheet, 48 KB" },
      { kind: "file", name: "catering-quote.pdf", meta: "PDF, 310 KB", version: "old", note: "Replaced by catering-quote-v2.pdf on Sep 24" },
      { kind: "file", name: "sonoma-floorplan.png", meta: "Image, 1.1 MB" },
    ],
  },
  {
    from: "priya", replyTo: 1, topic: "Venue decided", day: 22, time: "8:47 AM", full: "Mon, Sep 22, 8:47 AM", to: "Marcus Lee, Dana Okafor, Sam Rivera, you",
    event: "Priya added Sam Rivera (Facilities) to the thread",
    summary: "Decision: Sonoma Barn, Oct 21 to 22. Draft agenda attached; every session needs an owner.",
    body: "Morning all,\n\nThe votes are in: Sonoma Barn it is, Tuesday Oct 21 to Wednesday Oct 22. The deposit is paid.\n\nAdding Sam from Facilities, who'll handle transport and room setup.\n\nI've attached a draft agenda. Each session needs an owner, so reply here with what you'd like to take and I'll fill in the rest.\n\nPriya",
    items: [{ kind: "file", name: "agenda-draft.docx", meta: "Doc, 86 KB" }, { kind: "link", name: "Sonoma Barn", meta: "sonomabarn.com" }],
  },
  {
    from: "marcus", replyTo: 4, topic: "Session owners", day: 22, time: "9:30 AM", full: "Mon, Sep 22, 9:30 AM", to: "Priya Shah, Dana Okafor, Sam Rivera, you",
    summary: null, body: "I can take the Day 1 kickoff and the team retro.", items: [],
  },
  {
    from: "dana", replyTo: 3, topic: "Catering update", day: 24, time: "10:14 AM", full: "Wed, Sep 24, 10:14 AM", to: "Priya Shah, Marcus Lee, Sam Rivera, you",
    summary: "Catering renegotiated and now under budget. Needs headcount and dietary needs by Sep 27.",
    body: "Good news on the budget: Sonoma agreed to a lighter lunch on day two, which brings catering to $15.9k total, under the cap.\n\nThey need a final headcount and any dietary restrictions by Saturday, Sep 27. Please fill in the form linked below, even if you have no restrictions.\n\nUpdated quote attached.\n\nDana",
    items: [
      { kind: "file", name: "catering-quote-v2.pdf", meta: "PDF, 295 KB", version: "latest", note: "Replaces catering-quote.pdf from Sep 16" },
      { kind: "link", name: "Dietary needs form", meta: "forms.northwind.co" },
    ],
  },
  {
    from: "priya", replyTo: 4, topic: "Workshop ask", day: 24, time: "1:05 PM", full: "Wed, Sep 24, 1:05 PM", to: "you", ask: true,
    summary: "Asks you to run the Day 2 design workshop. Wants an answer by Thursday.",
    body: "Hi Brian,\n\nWould you be up for running the design workshop on Day 2? It's a 90-minute slot after lunch, and you'd have full say on the format.\n\nCould you let me know by Thursday? If it's too much alongside your launch work, no worries, I'll ask someone else.\n\nThe live agenda and our Slack channel are linked below.\n\nPriya",
    items: [{ kind: "link", name: "Agenda (live doc)", meta: "docs.northwind.co" }, { kind: "link", name: "#offsite-2026", meta: "Slack channel" }],
  },
  {
    from: "marcus", replyTo: 4, topic: "Shuttle", day: 24, time: "2:38 PM", full: "Wed, Sep 24, 2:38 PM", to: "Priya Shah, Dana Okafor, Sam Rivera, you",
    failed: true, summary: null,
    body: "Quick logistics note: I've booked a shuttle from the office, leaving at 8 AM sharp on the 21st and returning around 6 PM on the 22nd.\n\nParking at the barn is limited, so please take the shuttle unless you really need your car.\n\nMarcus",
    items: [],
  },
];

/* ------------------------------------------------------------------ *
 * Additional inbox conversations. Smaller than the offsite thread but  *
 * fully openable — each drives the same timeline view.                 *
 * ------------------------------------------------------------------ */

const BUDGET_MSGS: Message[] = [
  {
    from: "dana", replyTo: null, topic: "Q3 reconciliation", day: 22, time: "9:40 AM", full: "Mon, Sep 22, 9:40 AM", to: "you, Marcus Lee",
    summary: "Q3 numbers are locked. One line item still needs your sign-off before Friday.",
    body: "Hi Brian,\n\nI've closed out the Q3 numbers and everything ties except one line: the contractor spend under the launch budget.\n\nThe workbook is attached. Could you take a look at row 14 and confirm it's coded to the right cost center? I'd like to file by Friday.\n\nDana",
    items: [{ kind: "file", name: "q3-reconciliation.xlsx", meta: "Sheet, 62 KB" }],
  },
  {
    from: "marcus", replyTo: 0, topic: "Row 14", day: 22, time: "11:05 AM", full: "Mon, Sep 22, 11:05 AM", to: "Dana Okafor, you",
    summary: null,
    body: "That contractor was on the launch project, not ops. Should sit under Launch, not G&A.",
    items: [],
  },
  {
    from: "dana", replyTo: 1, topic: "Re: Row 14", day: 22, time: "11:22 AM", full: "Mon, Sep 22, 11:22 AM", to: "Marcus Lee, you",
    summary: null,
    body: "Thanks Marcus, that matches the SOW. I'll recode it to Launch.",
    items: [],
  },
  {
    from: "dana", replyTo: 0, topic: "Sign-off needed", day: 24, time: "11:20 AM", full: "Today, Sep 24, 11:20 AM", to: "you", ask: true,
    summary: "Everything is recoded. Needs your sign-off on the final workbook before Friday.",
    body: "Hi Brian,\n\nRow 14 is recoded to Launch and the workbook balances. This is the last thing before I file.\n\nCould you reply with your sign-off by Friday? The final version is attached.\n\nDana",
    items: [{ kind: "file", name: "q3-reconciliation-final.xlsx", meta: "Sheet, 63 KB", version: "latest", note: "Replaces q3-reconciliation.xlsx from Sep 22" }],
  },
];

const SHUTTLE_MSGS: Message[] = [
  {
    from: "sam", replyTo: null, topic: "Pickup points", day: 20, time: "8:40 AM", full: "Sat, Sep 20, 8:40 AM", to: "you, Marcus Lee, Dana Okafor",
    summary: "Two shuttle stops confirmed: HQ lobby at 8:00 and Caltrain at 8:20.",
    body: "Morning all,\n\nShuttle stops are confirmed for the offsite: HQ lobby at 8:00 and Caltrain at 8:20. The bus seats 24, so we're covered.\n\nReply if you need a third stop and I'll see what the driver can do.\n\nSam",
    items: [],
  },
  {
    from: "me", replyTo: 0, topic: "Third stop?", day: 20, time: "9:02 AM", full: "Sat, Sep 20, 9:02 AM", to: "Sam Rivera, Marcus Lee, Dana Okafor",
    summary: null,
    body: "Any chance of a stop near the Mission? A couple of folks are coming from that side.",
    items: [],
  },
  {
    from: "sam", replyTo: 1, topic: "Re: Third stop", day: 20, time: "9:05 AM", full: "Sat, Sep 20, 9:05 AM", to: "you, Marcus Lee, Dana Okafor",
    summary: "Added a 16th & Mission stop at 8:10. Final route is set.",
    body: "Done — added 16th & Mission at 8:10, between the two existing stops. That's the final route.\n\nSam",
    items: [{ kind: "link", name: "Shuttle route", meta: "maps.northwind.co" }],
  },
];

const CHECKLIST_MSGS: Message[] = [
  {
    from: "marcus", replyTo: null, topic: "Checklist v4", day: 18, time: "3:10 PM", full: "Thu, Sep 18, 3:10 PM", to: "you, Priya Shah, Dana Okafor",
    summary: "Launch checklist v4. Copy freeze moved to Monday; three blockers flagged in red.",
    body: "Hi team,\n\nv4 of the launch checklist is attached. Two changes since v3:\n\n- Copy freeze moves to Monday to give marketing the weekend.\n- Three items are flagged red as blockers: legal review, the pricing page, and the status dashboard.\n\nOwners, please check your rows.\n\nMarcus",
    items: [{ kind: "file", name: "launch-checklist-v4.docx", meta: "Doc, 94 KB" }],
  },
  {
    from: "dana", replyTo: 0, topic: "Legal review", day: 18, time: "3:48 PM", full: "Thu, Sep 18, 3:48 PM", to: "Marcus Lee, you, Priya Shah",
    summary: null,
    body: "Legal review is on me. Counsel has it and promised comments by Friday, so that blocker should clear.",
    items: [],
  },
  {
    from: "me", replyTo: 0, topic: "Pricing page", day: 18, time: "4:15 PM", full: "Thu, Sep 18, 4:15 PM", to: "Marcus Lee, Priya Shah, Dana Okafor",
    summary: null,
    body: "Who owns the pricing page blocker? I can take it if it's unassigned.",
    items: [],
  },
  {
    from: "marcus", replyTo: 2, topic: "Re: Pricing page", day: 18, time: "4:20 PM", full: "Thu, Sep 18, 4:20 PM", to: "you, Priya Shah, Dana Okafor",
    summary: null,
    body: "All yours — thanks. It just needs the final numbers dropped in and a design pass.",
    items: [],
  },
  {
    from: "marcus", replyTo: 0, topic: "Freeze reminder", day: 19, time: "9:00 AM", full: "Fri, Sep 19, 9:00 AM", to: "you, Priya Shah, Dana Okafor",
    summary: "Reminder: copy freeze is Monday 9 AM. Two blockers still open.",
    body: "Reminder that copy freeze is Monday at 9 AM. Legal and pricing are still open; the dashboard cleared last night. Let's close the last two today.\n\nMarcus",
    items: [],
  },
];

const OFFER_MSGS: Message[] = [
  {
    from: "jules", replyTo: null, topic: "Offer draft", day: 17, time: "2:30 PM", full: "Wed, Sep 17, 2:30 PM", to: "you",
    summary: "Draft offer letter attached. Legal has signed off; wants your comments.",
    body: "Hi Brian,\n\nThe draft offer letter for the design hire is attached. Legal has already signed off on the terms, so this is really about the framing and the start date.\n\nHave a read when you get a chance.\n\nJules",
    items: [{ kind: "file", name: "offer-draft.pdf", meta: "PDF, 180 KB" }],
  },
  {
    from: "jules", replyTo: 0, topic: "Comments by EOD?", day: 24, time: "10:10 AM", full: "Today, Sep 24, 10:10 AM", to: "you", ask: true,
    summary: "Following up: needs your comments on the offer by end of day to send tomorrow.",
    body: "Hi Brian,\n\nSorry to chase — could you get me your comments on the offer by EOD? I'd like to send it out tomorrow morning while the candidate is still warm.\n\nIf it looks good as-is, just a thumbs up works.\n\nJules",
    items: [],
  },
];

const ONEONONE_MSGS: Message[] = [
  {
    from: "me", replyTo: null, topic: "1:1 notes", day: 17, time: "5:40 PM", full: "Wed, Sep 17, 5:40 PM", to: "Priya Shah",
    summary: null,
    body: "Notes from today's 1:1:\n\n- Roadmap: revisit the search rework, likely Q4.\n- I'll pick up the pricing page for launch.\n- Offsite: happy to run a session if useful.\n\nBrian",
    items: [],
  },
  {
    from: "priya", replyTo: 0, topic: "Re: 1:1 notes", day: 17, time: "6:05 PM", full: "Wed, Sep 17, 6:05 PM", to: "you",
    summary: "Thanks for the writeup. Wants to revisit the roadmap item next week.",
    body: "Thanks for the writeup, this is great.\n\nLet's revisit the roadmap item next week once the launch dust settles — I don't want to commit the search rework until we see how the quarter lands.\n\nPriya",
    items: [],
  },
];

const EXPENSES_MSGS: Message[] = [
  {
    from: "dana", replyTo: null, topic: "Expense reminder", day: 16, time: "8:00 AM", full: "Tue, Sep 16, 8:00 AM", to: "you",
    summary: "Auto-reminder: two August receipts are still unmatched.",
    body: "This is an automated reminder from Finance.\n\nYou have 2 receipts still unmatched for August. Please upload or match them in the expense tool by the end of the month to avoid a hold on the next reimbursement run.\n\n— Northwind Finance",
    items: [{ kind: "link", name: "Expense tool", meta: "expenses.northwind.co" }],
  },
];

/** Every openable conversation, keyed by its inbox row id. */
export const THREADS: Record<string, Thread> = {
  offsite: { id: "offsite", subject: "Team offsite: venue and agenda", label: { text: "Offsite", color: "#7A5AC8" }, msgs: OFFSITE_MSGS, newFrom: 6, earlyEnd: 3, defaultOpen: [3] },
  "budget-q3": { id: "budget-q3", subject: "Q3 budget reconciliation", label: { text: "Launch", color: "#2F8A62" }, msgs: BUDGET_MSGS, newFrom: 3, earlyEnd: 0 },
  shuttle: { id: "shuttle", subject: "Shuttle pickup points confirmed", msgs: SHUTTLE_MSGS, newFrom: SHUTTLE_MSGS.length, earlyEnd: 0 },
  "launch-checklist": { id: "launch-checklist", subject: "Launch checklist v4", label: { text: "Launch", color: "#2F8A62" }, msgs: CHECKLIST_MSGS, newFrom: CHECKLIST_MSGS.length, earlyEnd: 0 },
  "offer-letter": { id: "offer-letter", subject: "Offer letter — please review", msgs: OFFER_MSGS, newFrom: 1, earlyEnd: 0 },
  "one-on-one": { id: "one-on-one", subject: "Re: 1:1 notes", msgs: ONEONONE_MSGS, newFrom: ONEONONE_MSGS.length, earlyEnd: 0 },
  expenses: { id: "expenses", subject: "Expense report reminder", msgs: EXPENSES_MSGS, newFrom: EXPENSES_MSGS.length, earlyEnd: 0 },
};

/** Resolve an inbox row id to its thread, if it has one. */
export function getThread(id: string): Thread | undefined {
  return THREADS[id];
}
