"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getThread } from "@/lib/data";
import { buildModel, initialState } from "@/lib/thread";
import { DEFAULT_ACCENT } from "@/lib/tokens";
import type { ThreadState } from "@/lib/types";
import { BranchView } from "./BranchView";
import { Header } from "./Header";
import { Reader } from "./Reader";
import { Sidebar } from "./Sidebar";
import { SummaryView } from "./SummaryView";
import { ThreadHeader } from "./ThreadHeader";
import { TimelineView } from "./TimelineView";
import { Toolbar } from "./Toolbar";
import styles from "./ThreadTimeline.module.css";

interface Props {
  /** Which inbox conversation to open. */
  threadId: string;
  /** Accent color; matches the mockup's `accent` prop. */
  accent?: string;
  /** Open the first new message on mount, like the mockup's `openFirstNew`. */
  openFirstNew?: boolean;
  /** Return to the inbox list. Wired to the toolbar's back button. */
  onBack?: () => void;
}

export function ThreadTimeline({ threadId, accent = DEFAULT_ACCENT, openFirstNew = false, onBack }: Props) {
  const thread = getThread(threadId);
  const [state, setState] = useState<ThreadState>(() =>
    thread ? initialState(openFirstNew, thread) : { sel: -1, seen: {}, open: {}, early: false, view: "timeline" },
  );
  const [pendingScroll, setPendingScroll] = useState<number | null>(null);

  const model = useMemo(() => (thread ? buildModel(state, accent, thread) : null), [state, accent, thread]);

  // Ported from pick()'s setTimeout + scrollIntoView. Waits out the panel
  // width transition (220ms) before scrolling the target into view.
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (pendingScroll === null) return;
    scrollTimer.current = setTimeout(() => {
      const el = document.getElementById(`msg-${pendingScroll}`) ?? document.getElementById(`node-${pendingScroll}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      setPendingScroll(null);
    }, 260);
    return () => {
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [pendingScroll]);

  function pick(i: number, scroll = false) {
    const earlyEnd = thread?.earlyEnd ?? 0;
    setState((s) => ({ ...s, sel: i, seen: { ...s.seen, [i]: true }, early: s.early || i < earlyEnd }));
    if (scroll) setPendingScroll(i);
  }

  function toggle(i: number) {
    setState((s) => ({ ...s, open: { ...s.open, [i]: !s.open[i] } }));
  }

  function showEarly() {
    setState((s) => ({ ...s, early: true }));
  }

  function setView(view: ThreadState["view"]) {
    setState((s) => ({ ...s, view }));
  }

  function close() {
    setState((s) => ({ ...s, sel: -1 }));
  }

  function jumpNew() {
    if (model?.unseen.length) pick(model.unseen[0], true);
  }

  function markAll() {
    if (!thread) return;
    const all: Record<number, boolean> = {};
    thread.msgs.forEach((_, i) => {
      all[i] = true;
    });
    setState((s) => ({ ...s, seen: all }));
  }

  if (!model) return null;

  return (
    <div className={styles.frame}>
      <Header />

      <div className={styles.bodyRow}>
        <Sidebar />

        <main className={styles.main}>
          <Toolbar onBack={onBack} />
          <ThreadHeader model={model} view={state.view} onSetView={setView} onJumpNew={jumpNew} onMarkAll={markAll} />

          <div className={styles.contentRow}>
            <div
              className={`scroll ${styles.leftPanel}`}
              style={{ width: model.tlWidth, borderRight: model.tlBorder }}
            >
              {model.isTimeline ? (
                <TimelineView
                  model={model}
                  onPick={(i) => pick(i)}
                  onToggle={toggle}
                  onGoParent={(p) => pick(p, true)}
                  onShowEarly={showEarly}
                />
              ) : model.isBranches ? (
                <BranchView model={model} onPick={(i) => pick(i)} />
              ) : (
                <SummaryView model={model} onPick={(i) => pick(i)} />
              )}
            </div>

            {model.showReader && (
              <Reader
                model={model}
                onClose={close}
                onGoParent={(p) => pick(p, true)}
                onPickChild={(i) => pick(i, true)}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
