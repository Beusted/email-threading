import type { AskAnswer } from "./store";

/** Canned questions the "Ask about this thread" box recognises. */
export const QUESTIONS: { q: string; answer: AskAnswer }[] = [
  {
    q: "Which catering quote is current?",
    answer: {
      question: "Which catering quote is current?",
      answer:
        "The revised quote Dana sent on Sep 24. It's now under the $18k budget. The Sep 16 quote, about $2.4k over, is out of date.",
      sources: [
        {
          messageId: "m7",
          label: "Dana, Sep 24",
          sentence: "I renegotiated catering and the new quote is attached. We're now under budget.",
        },
        {
          messageId: "m4",
          label: "Dana, Sep 16",
          sentence: "The catering quote from Sonoma is the problem: it puts us about $2.4k over.",
        },
      ],
    },
  },
  {
    q: "What time does the shuttle leave?",
    answer: {
      question: "What time does the shuttle leave?",
      answer: "8 AM sharp on the 21st from the office, returning around 6 PM on the 22nd.",
      sources: [
        {
          messageId: "m9",
          label: "Marcus, Sep 24",
          sentence: "I've booked a shuttle from the office, leaving at 8 AM sharp on the 21st and returning around 6 PM on the 22nd.",
        },
      ],
    },
  },
  {
    q: "Who owns which session?",
    answer: {
      question: "Who owns which session?",
      answer:
        "Marcus has Day 1 kickoff and the team retro. The Day 2 design workshop is still open — Priya asked you to run it.",
      sources: [
        { messageId: "m6", label: "Marcus, Sep 22", sentence: "I can take the Day 1 kickoff and the team retro." },
        { messageId: "m8", label: "Priya, Sep 24", sentence: "Would you be up for running the Day 2 design workshop?" },
      ],
    },
  },
];

const KEYWORDS: { keys: string[]; index: number }[] = [
  { keys: ["catering", "quote"], index: 0 },
  { keys: ["shuttle", "leave", "time"], index: 1 },
  { keys: ["owns", "session", "owner", "workshop"], index: 2 },
];

/** Loose match: a question matches if it shares a keyword with a canned entry. */
export function matchQuestion(text: string): AskAnswer | null {
  const t = text.toLowerCase();
  for (const q of QUESTIONS) {
    if (t.includes(q.q.toLowerCase())) return q.answer;
  }
  let best = -1;
  let bestScore = 0;
  KEYWORDS.forEach(({ keys, index }) => {
    const score = keys.filter((k) => t.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      best = index;
    }
  });
  return best >= 0 && bestScore > 0 ? QUESTIONS[best].answer : null;
}
