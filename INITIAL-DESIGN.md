# Gmail Threading Redesign — Design Exercise

_UX Engineer Intern · Alation_

> A note on ownership: this document is a first-pass articulation of my thinking. Every
> prioritization call and tradeoff below is one I'd defend in the demo, but they're
> decisions to interrogate, not gospel — that's the point of the exercise.

---

## 1. Understand the users and their goals

Gmail threading isn't one experience — it's the same UI stretched across very different
workloads. The useful move is to segment by *how heavy the threads are* and *what the
person is trying to extract*, not by demographic.

### Who actually hits threading pain

| User type | Context | What a "thread" looks like for them |
|---|---|---|
| **High-volume knowledge worker** (PM, manager, exec, lead) | Triaging 100+ emails/day, much of it long-running threads | 15–40 messages, 5–10 participants, decisions + action items buried in prose |
| **Cross-functional collaborator** | Pulled into threads late, many reply-all branches | Forked sub-discussions, forwards, "+ Adding Jane" mid-thread |
| **External-facing roles** (sales, support, recruiting, client services) | Long-lived client threads, need full context before replying | Quoted-text pile-up, attachments scattered across replies |
| **Mobile reader** | Catching up between meetings, on a phone | The same long thread, but scrolling is punishing |
| **Casual/personal user** | A few short threads | 2–4 messages — threading basically works for them |

That last row matters for scoping: **casual users are not who's in pain.** Any redesign
that adds chrome for them makes their experience *worse*. Whatever we build has to stay
invisible until a thread is actually complex.

### Jobs-to-be-done (what they're really doing)

1. **Catch up / orient** — "This thread has 22 replies and I've been added. What's the
   current state, what did I miss, what do I owe anyone?"
2. **Find** — "Where's the message with the final budget number / the signed PDF / the
   line where Legal said yes?"
3. **Track decisions & action items** — "Who agreed to what? What's assigned to me?"
4. **Respond correctly** — "Reply to the *right* point without dropping the three
   sub-questions Priya asked in the middle."
5. **Understand the cast** — "Who's actually active here vs. cc'd and silent?"

These are ordered by how often they cause real friction, based on the structural
weaknesses below (not on assumption — each maps to a concrete Gmail behavior).

---

## 2. Identify the key problems

Gmail's model: messages sharing a subject + `References`/`In-Reply-To` headers collapse
into one linear stack, newest at the bottom, older messages collapsed to one-line stubs,
quoted text hidden behind the "**···**" trim toggle.

That model breaks the JTBD above in specific, traceable ways:

| Gap | Mechanism | Which goal it kills |
|---|---|---|
| **No orientation layer** | To catch up you must expand and read N messages in order. There's no summary of state, decisions, or "what changed since you last read." | Catch up (1), Track decisions (3) |
| **Linear scroll doesn't scale** | A 30-message thread is a 30-deep collapsed stack. Finding message #12 means expanding stubs and scanning timestamps. No in-thread map. | Find (2) |
| **Quoted-text duplication** | Every reply re-quotes the entire prior message. The same paragraph appears 10×; the trim toggle hides context you sometimes need and shows noise you don't. | Catch up (1), Find (2) |
| **Decisions/actions live in prose** | "Sounds good, let's ship Tuesday" is a decision, but it's an unstructured sentence in message 14. Nothing extracts or pins it. | Track decisions (3) |
| **Can't reply to a specific point** | One reply box at the bottom. Multi-question messages get partial answers; sub-questions silently dropped. | Respond correctly (4) |
| **Participants are flat** | cc'd-but-silent looks the same as actively-driving. No signal of who matters. | Understand the cast (5) |
| **Mobile amplifies all of the above** | Same linear stack, less screen, more scroll. | All |

The through-line: **Gmail optimizes for reading one message at a time, but the actual
job on a long thread is understanding the thread as a whole.**

---

## 3. Prioritize

Scoring each problem on **frequency × pain × feasibility in a frontend prototype**:

| Problem | Frequency | Pain | Feasible to prototype | Verdict |
|---|---|---|---|---|
| Orientation / catch-up | Daily, every heavy user | High | Yes | **P1 — main** |
| Decision/action tracking | Frequent | High | Yes | **P2 — main** |
| Navigation / find-in-thread | Daily | High | Yes | **P3 — main** |
| Attachment scatter | Frequent | Medium | Yes | **Also solved (small)** |
| Quoted-text pile-up | Every reply | Medium | Yes | **Also solved (medium)** |
| Reply to a specific point | Frequent | Medium | Yes | Stretch |
| Branching / tree visualization | Rare in email | High complexity | No | **Cut** |
| Reply-all noise / participants | Frequent | Medium | Partial | Cut (surface lightly only) |

### The three I'm solving

**P1 — Orientation: "What happened and what do I owe?"**
Highest frequency, highest pain. The single most common reason people dread a long thread:
added late to 20 replies with no summary of state.

**P2 — Decisions & actions: "Who agreed to what, and what's mine?"**
Decisions and commitments are real signal buried in prose — "let's ship Tuesday" is a
decision, but it's an unstructured sentence in message 14. Nothing today extracts or pins
it. Delivered *inside* the P1 Digest (same surface), but it's a distinct problem worth
naming: catch-up tells you the state, decisions/actions tell you the obligations.

**P3 — Navigation: "Take me to the message that matters."**
The partner to P1/P2. Once oriented, the next move is *go to the source*. A summary you
can't drill into isn't trustworthy; navigation makes the summary honest.

### Two smaller problems solved along the way

These aren't headline picks, but they fall out of the same components and remove real
daily friction, so we handle them:

- **Attachment scatter** (small) — files are spread across replies; you can't tell which
  is the right one. The Digest lists every attachment in the thread in one place.
- **Quoted-text pile-up** (medium) — every reply re-quotes the full prior message, so the
  same paragraph appears 10×. Message cards collapse quoted text behind a "context" chip
  by default.

### What I'm deliberately NOT solving, and why

- **Branching/tree view** — Email is *mostly* linear. Real forks are rare, the data model
  fights you, and a tree UI imposes cognitive load on the 95% case to serve the 5%. Wrong
  trade.
- **Reply-all noise / spam** — Real, but it's a *routing/notification* problem, not a
  *threading-comprehension* problem. Different surface, different project.
- **Casual users** — Not in pain. Design must degrade to "just Gmail" for short threads.

Scope discipline is the point of prioritization: two problems, done coherently, beats six
half-fixes.

---

## 4. Design the solution

**One-line concept:** keep Gmail's familiar message list, but add an **orientation layer**
on top and a **navigator** on the side — both of which *disappear on simple threads*.

### The system (three repeating components)

1. **Thread Digest** (solves P1) — a collapsible panel pinned at the top of a complex
   thread:
   - **TL;DR** — 1–2 sentences of current state.
   - **Decisions** — pinned, each linking to the source message.
   - **Open action items** — owner + task, "mine" highlighted.
   - **Since you last read** — count + jump to first unread.
   - **Participants** — active vs. cc'd, with message counts.
   - **Attachments** — every file in the thread, in one place.

2. **Navigator rail** (solves P2) — a vertical mini-map of the thread:
   - One row per message: avatar, sender, timestamp, unread dot, attachment/★ icons.
   - **Filters**: Unread · Mentions me · Has attachment · by participant.
   - Click → scroll to message. This is the "honesty link" for the digest.

3. **Message card** — cleaner than Gmail's stub:
   - Quoted text collapsed by default behind a "context" chip (dedup the pile-up).
   - Clear sender/time hierarchy, unread accent, inline attachments.
   - Stretch: **quote-reply** — select text → reply to that specific point.

Every decision/action in the Digest is a **link into a message card** via the Navigator's
scroll behavior — so the three components are one system, not three widgets.

### Goal → gap → design decision (the throughline the brief asks for)

| User goal | Gap in Gmail | Design decision |
|---|---|---|
| Catch up | No state summary; must read N msgs | Digest: TL;DR + "since you last read" |
| Track decisions | Buried in prose | Digest: pinned Decisions, each links to source |
| Know what I owe | Nothing extracts actions | Digest: Action items, "mine" highlighted |
| Find a message | Linear collapsed stack | Navigator rail + filters + click-to-scroll |
| Find an attachment | Scattered across replies | Digest: all attachments in one list |
| Read without noise | Quoted-text duplication | Message card: quotes collapsed by default |
| Respond correctly | One reply box | Quote-reply to a selected point (stretch) |

### Alternatives considered, and the tradeoffs

- **Full thread tree / forum view.** Rejected. Faithful to branching, but punishes the
  linear common case and fights Gmail's data model. *Trade: we lose branch fidelity, gain
  simplicity for 95% of threads.*
- **Chat/Slack-style collapse.** Rejected. Loses email's formality, attachments, and
  quoting, and doesn't actually solve catch-up — it just re-skins the scroll.
- **AI-summary-only (replace the messages).** Rejected. Summaries can be wrong; if users
  can't verify, they won't trust it. *Trade: the Digest **augments**, never replaces —
  and every claim links to its source message so trust is one click away.*
- **Always-on Digest + Navigator.** Rejected. Adds chrome to short threads. *Trade: both
  are conditional — hidden below a complexity threshold (e.g. < 4 messages or 1
  participant), so casual users just see Gmail.*

### Systematic design & states (attention to detail)

- **Consistent tokens**: one participant chip, one action-item row, one message card,
  reused everywhere. The unread accent color is the same in the Navigator dot, the card
  border, and the "since you last read" divider — one signal, three surfaces.
- **Responsive**: Navigator collapses to a drawer on mobile; Digest stays (catch-up
  matters *most* on mobile).
- **Edge cases handled**:
  - Short thread (< 4 msgs) → no Digest, no Navigator. It's just Gmail.
  - Single participant / no unread → hide the empty sections, don't render empty shells.
  - No action items / no decisions → collapse those Digest rows rather than showing "None."
  - Huge participant count → Digest shows top-active + "N others."
  - Loading / summary-pending → skeleton state on the Digest, messages readable meanwhile.
  - No attachments → hide the attachments list entirely.

---

## 5. Prototype (build)

Plan: a React (Vite) or single-file HTML/CSS/JS app rendering one realistic long thread
(~20 messages, 6 participants, a couple of forwards, 3 attachments, some unread) with:

- Thread Digest panel (TL;DR, Decisions→link, Action items, Since-you-last-read, Attachments)
- Navigator rail with working filters + click-to-scroll
- Message cards with collapsible quoted text
- The conditional-chrome behavior on a second, short thread to show it degrading to "just Gmail"

The current repo contents are unrelated (a satellite-globe frontend) — the prototype
should be built fresh in a clean directory. **Not built yet — see the note at the end.**

---

## 6. Demo (5–7 min walkthrough script)

1. **(0:00–0:45) Frame the problem.** Open a real 20-reply thread in stock Gmail. "This
   is the moment everyone hates — added late, 20 replies, what do I do?"
2. **(0:45–1:30) Users & goals.** The heavy-thread users; the five JTBD; emphasize
   catch-up and find as the daily ones.
3. **(1:30–2:15) Prioritization.** Why catch-up + navigation, why *not* tree view / spam /
   casual users. Show the scoring logic.
4. **(2:15–4:30) The build.** Walk the Digest → click a decision → Navigator scrolls to the
   source message (the "honesty link"). Filter Navigator to "mentions me." Collapse quoted
   text. Show the "since you last read" jump.
5. **(4:30–5:30) System & details.** Same unread accent across three surfaces; responsive
   drawer; then open the *short* thread to show the chrome disappear — "casual users just
   get Gmail."
6. **(5:30–6:30) Tradeoffs & what's next.** Augment-not-replace, the branching cut,
   quote-reply as the next thing to build.

---

### Status

Steps 1–4 and the demo script (6): written above.
Step 5 (working prototype): **not yet built.** Say the word and I'll build the React
prototype described in §5.
