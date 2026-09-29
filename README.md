# Gmail Threading Exercise

The **Alation UX Engineer Intern design exercise**, done by **Brian Ngo**.

A redesign of Gmail's email threading experience, built as a working prototype in
Next.js + React. Long, messy threads collapse into a triage-first timeline: a
"needs you" view, branch/fork awareness, and per-message actions — so catching up
on a 20-reply thread doesn't mean scrolling a linear stack of quoted text.

See [`INITIAL-DESIGN.md`](./INITIAL-DESIGN.md) for the design writeup (users,
problems, tradeoffs) that motivated the build.

## Run it on your computer

**Prerequisites:** [Node.js](https://nodejs.org) 20+ and npm.

```bash
# from this directory (email-threading/)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the inbox opens; click a
conversation to see the redesigned thread timeline.

- `/` — inbox → thread timeline prototype
- `/thread-demo` — standalone thread redesign demo

## Other commands

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Stack

Next.js 16 (App Router) · React 19 · TypeScript. No database — sample thread data
lives in `lib/`.
