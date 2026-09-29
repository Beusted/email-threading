"use client";

import { useState } from "react";
import { InboxList } from "@/components/InboxList";
import { ThreadTimeline } from "@/components/ThreadTimeline";

export default function Home() {
  // The inbox list shows all conversations; opening one swaps to its timeline.
  // No routing — a single client-side "which thread is open" id keeps it simple.
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--field)",
      }}
    >
      {openId ? (
        <ThreadTimeline threadId={openId} openFirstNew onBack={() => setOpenId(null)} />
      ) : (
        <InboxList onOpen={setOpenId} />
      )}
    </main>
  );
}
