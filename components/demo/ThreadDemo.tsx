"use client";

import { useEffect, useReducer, useState } from "react";
import { ClockIcon, CloseIcon } from "@/components/icons";
import { BRANCHES, MESSAGES } from "@/lib/demo/data";
import { fmtShort } from "@/lib/demo/dates";
import { matchQuestion } from "@/lib/demo/qa";
import { askByMessage, branchMessageIds, headerVM, person } from "@/lib/demo/selectors";
import { initialState, reducer } from "@/lib/demo/store";
import { AskPanel } from "./AskPanel";
import { BranchPanel } from "./BranchPanel";
import { DemoHeader } from "./DemoHeader";
import { FilesPanel } from "./FilesPanel";
import { MessageReader } from "./MessageReader";
import { SplitModal } from "./SplitModal";
import { SummaryPanel } from "./SummaryPanel";
import { TimelineDemo } from "./TimelineDemo";
import styles from "./ThreadDemo.module.css";

export function ThreadDemo() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [splitBranchId, setSplitBranchId] = useState<string | null>(null);
  const header = headerVM();

  // Scroll a freshly-jumped element into view, then clear the flash flag.
  useEffect(() => {
    if (!state.flashId && !state.flashSentence) return;
    const el = state.flashId && document.getElementById(`demo-msg-${state.flashId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    const t = setTimeout(() => dispatch({ type: "CLEAR_FLASH" }), 1700);
    return () => clearTimeout(t);
  }, [state.flashId, state.flashSentence]);

  // Toasts and the simulated reminder banner auto-dismiss.
  useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(() => dispatch({ type: "DISMISS_TOAST" }), 5000);
    return () => clearTimeout(t);
  }, [state.toast]);
  useEffect(() => {
    if (!state.firedReminder) return;
    const t = setTimeout(() => dispatch({ type: "DISMISS_FIRED" }), 6000);
    return () => clearTimeout(t);
  }, [state.firedReminder]);

  const selected = state.selectedId ? MESSAGES.find((m) => m.id === state.selectedId) : null;
  const selectedAsk = selected ? state.asks[askByMessage(selected.id)?.id ?? ""] : undefined;
  const pinnedMsg = state.pinnedId ? MESSAGES.find((m) => m.id === state.pinnedId) : null;
  const pinnedLabel = pinnedMsg ? `${person(pinnedMsg.from).first}, ${fmtShort(pinnedMsg.sentAt)}` : null;

  const onAsk = (q: string) => {
    const answer =
      matchQuestion(q) ??
      { question: q, answer: "I don't have that in this thread yet. Try one of the suggested questions.", sources: [] };
    dispatch({ type: "ASK_QUESTION", answer });
  };

  const fired = state.firedReminder;
  const firedMsg = fired ? MESSAGES.find((m) => m.id === fired.messageId) : null;
  const firedAsk = firedMsg ? askByMessage(firedMsg.id) : undefined;

  return (
    <div className={styles.frame}>
      <DemoHeader
        header={header}
        view={state.view}
        pinnedMessage={pinnedLabel}
        dispatch={dispatch}
        onOpenFiles={() => dispatch({ type: "OPEN_FILES" })}
        onOpenDecision={(id) => dispatch({ type: "JUMP_TO", id })}
        onAsk={onAsk}
      />

      {fired && firedMsg && (
        <div className={styles.reminderBanner} role="status">
          <span className={styles.reminderIcon}>
            <ClockIcon size={18} />
          </span>
          <div className={styles.reminderBody}>
            <div className={styles.reminderTitle}>Reminder: reply to {person(firedMsg.from).first}</div>
            <div className={styles.reminderText}>{firedAsk?.text ?? firedMsg.summary}</div>
          </div>
          <button type="button" className={`ghost ${styles.reminderClose}`} aria-label="Dismiss reminder" onClick={() => dispatch({ type: "DISMISS_FIRED" })}>
            <CloseIcon size={16} />
          </button>
        </div>
      )}

      <div className={styles.content}>
        <div className={`scroll ${styles.left}`}>
          {state.askAnswer && (
            <AskPanel answer={state.askAnswer} dispatch={dispatch} onClose={() => dispatch({ type: "CLEAR_ANSWER" })} />
          )}
          {state.view === "summary" && <SummaryPanel state={state} dispatch={dispatch} />}
          {state.view === "timeline" && <TimelineDemo state={state} dispatch={dispatch} />}
          {state.view === "branches" && <BranchPanel state={state} dispatch={dispatch} onSplit={setSplitBranchId} />}
        </div>

        {selected && (
          <MessageReader
            message={selected}
            ask={selectedAsk}
            reminder={state.reminders[selected.id]}
            pinned={state.pinnedId === selected.id}
            done={!!state.done[selected.id]}
            flashSentence={state.flashSentence}
            dispatch={dispatch}
          />
        )}
      </div>

      {state.filesPanel.open && <FilesPanel state={state} dispatch={dispatch} />}

      {splitBranchId && (
        <SplitModal
          branchLabel={BRANCHES[splitBranchId].label}
          defaultName={splitBranchId === "budget" ? "Offsite budget" : `Offsite ${BRANCHES[splitBranchId].label}`}
          count={branchMessageIds(splitBranchId).length}
          onCancel={() => setSplitBranchId(null)}
          onConfirm={(name) => {
            dispatch({ type: "SPLIT_BRANCH", branchId: splitBranchId, name });
            setSplitBranchId(null);
          }}
        />
      )}

      {state.toast && (
        <div className={styles.toast} role="status">
          <span>{state.toast.message}</span>
          {state.toast.undo === "split" && (
            <button type="button" className={styles.toastBtn} onClick={() => dispatch({ type: "UNDO_SPLIT" })}>
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
