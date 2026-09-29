import type { Dispatch } from "react";
import { MergeIcon, SplitIcon } from "@/components/icons";
import { CONTINUATION, MERGE_CANDIDATE } from "@/lib/demo/data";
import { fmtShort } from "@/lib/demo/dates";
import { branchChips, branchMessageIds, branchRows, person } from "@/lib/demo/selectors";
import type { Action, DemoState } from "@/lib/demo/store";
import { Popover } from "./Popover";
import styles from "./BranchPanel.module.css";

interface Props {
  state: DemoState;
  dispatch: Dispatch<Action>;
  onSplit: (branchId: string) => void;
}

const INDENT = 26;

export function BranchPanel({ state, dispatch, onSplit }: Props) {
  const chips = branchChips(state);
  const rows = branchRows();
  const cand = MERGE_CANDIDATE;

  // Which branches are collapsed as a single row (muted or moved out).
  const collapsed = new Set<string>();
  Object.values(state.branches).forEach((b) => {
    if (b.muted) collapsed.add(b.id);
  });
  if (state.movedBranchId) collapsed.add(state.movedBranchId);

  const rendered = new Set<string>();

  return (
    <div className={styles.wrap}>
      {!state.mergeDismissed && (
        <div className={styles.mergeBanner}>
          <MergeIcon size={18} style={{ color: "var(--sparkle)", flexShrink: 0, marginTop: 2 }} />
          <div className={styles.mergeBody}>
            <div className={styles.mergeTitle}>&ldquo;{cand.subject}&rdquo; looks like part of this thread</div>
            <p className={styles.mergeText}>
              {person(cand.from).name}, {fmtShort(cand.sentAt)}. The subject was changed, but it replies to Dana&apos;s
              budget email here. Merging adds it under Budget cap.
            </p>
            <div className={styles.mergeActions}>
              <button type="button" className={styles.mergePrimary} onClick={() => dispatch({ type: "MERGE" })}>
                Merge into this thread
              </button>
              <button type="button" className={styles.mergeGhost} onClick={() => dispatch({ type: "KEEP_SEPARATE" })}>
                Keep separate
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.legend}>
        <span className={styles.legendTitle}>Branches</span>
        <span className={styles.legendSub}>Grouped by who replied to whom</span>
        <div className={styles.chips}>
          {chips.map((c) => (
            <span key={c.id} className={styles.chip} data-muted={c.muted}>
              <span className={styles.chipDot} style={{ background: c.color }} />
              <span className={styles.chipLabel}>{c.label}</span>
              <span className={styles.chipCount}>{c.count}</span>
            </span>
          ))}
        </div>
      </div>

      <div className={styles.tree}>
        {rows.map((r) => {
          const bid = r.branchId;
          // Collapsed branch: render one summary row at the branch root, skip the rest.
          if (bid && collapsed.has(bid)) {
            if (rendered.has(bid)) return null;
            rendered.add(bid);
            const count = branchMessageIds(bid).length;
            const moved = state.movedBranchId === bid;
            return (
              <div key={r.message.id} className={styles.collapsedRow} style={{ marginLeft: r.depth * INDENT }}>
                <span className={styles.connector} style={{ background: r.color }} />
                {moved ? (
                  <button type="button" className={styles.movedRow} onClick={() => dispatch({ type: "UNDO_SPLIT" })}>
                    <SplitIcon size={15} />
                    <span>
                      {count} messages moved to <strong>{state.splitThread?.subject}</strong>
                    </span>
                    <span className={styles.openLink}>Undo</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className={styles.mutedRow}
                    onClick={() => dispatch({ type: "UNMUTE_BRANCH", branchId: bid })}
                  >
                    muted · {count} messages
                    <span className={styles.openLink}>Expand</span>
                  </button>
                )}
              </div>
            );
          }

          const selected = state.selectedId === r.message.id;
          return (
            <div key={r.message.id} className={styles.rowWrap} style={{ marginLeft: r.depth * INDENT }}>
              {r.depth > 0 && <span className={styles.connector} style={{ background: r.color }} />}
              <button
                type="button"
                id={`demo-msg-${r.message.id}`}
                className={`card ${styles.node} ${selected ? styles.nodeOn : ""} ${state.flashId === r.message.id ? "flash" : ""}`}
                onClick={() => dispatch({ type: "SELECT", id: r.message.id })}
              >
                <span className={styles.avatar} style={{ background: r.sender.bg, color: r.sender.fg }}>
                  {r.sender.initials}
                </span>
                <div className={styles.nodeBody}>
                  <div className={styles.nodeHead}>
                    <span className={styles.nodeName}>{r.sender.first}</span>
                    <span className={styles.nodeTopic}>{r.message.topic}</span>
                  </div>
                  <span className={styles.nodeLine}>{r.message.summary ?? r.message.body.split("\n")[0]}</span>
                </div>
                {r.message.isNew && <span className={styles.newDot} aria-hidden />}
                <span className={styles.nodeWhen}>{fmtShort(r.message.sentAt)}</span>
              </button>

              {r.isBranchRoot && bid && (
                <Popover
                  ariaLabel={`Branch actions for ${r.message.topic}`}
                  align="right"
                  triggerClassName={`ghost ${styles.menuBtn}`}
                  button={<span aria-hidden>···</span>}
                >
                  {(close) => (
                    <>
                      <div className={styles.menuHead}>{chips.find((c) => c.id === bid)?.label} branch</div>
                      <button className="menuitem" role="menuitem" onClick={() => { onSplit(bid); close(); }}>
                        <span className="title">Move to new thread…</span>
                        <span className="sub">Splits these messages off, with links both ways</span>
                      </button>
                      <button className="menuitem" role="menuitem" onClick={() => { dispatch({ type: "FORWARD", what: "Branch" }); close(); }}>
                        <span className="title">Forward this branch</span>
                      </button>
                      <button className="menuitem" role="menuitem" onClick={() => { dispatch({ type: "SET_REMINDER", kind: "tomorrow", messageId: r.message.id }); close(); }}>
                        <span className="title">Remind me about this branch</span>
                      </button>
                      <button className="menuitem" role="menuitem" onClick={() => { dispatch({ type: "MUTE_BRANCH", branchId: bid }); close(); }}>
                        <span className="title">Mute this branch</span>
                        <span className="sub">Direct asks to you still come through</span>
                      </button>
                    </>
                  )}
                </Popover>
              )}
            </div>
          );
        })}

        {state.merged && (
          <div className={styles.rowWrap} style={{ marginLeft: INDENT }}>
            <span className={styles.connector} style={{ background: "#1F7A5C" }} />
            <div className={`card ${styles.node} ${styles.mergedNode}`}>
              <span className={styles.avatar} style={{ background: person(cand.from).bg, color: person(cand.from).fg }}>
                {person(cand.from).initials}
              </span>
              <div className={styles.nodeBody}>
                <div className={styles.nodeHead}>
                  <span className={styles.nodeName}>{person(cand.from).first}</span>
                  <span className={styles.nodeTopic}>{cand.subject}</span>
                  <span className={styles.mergedTag}>merged</span>
                </div>
                <span className={styles.nodeLine}>{cand.snippet}</span>
              </div>
              <span className={styles.nodeWhen}>{fmtShort(cand.sentAt)}</span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.continuation}>
        <div className={styles.contTitle}>
          {CONTINUATION.subject} <span className={styles.partBadge}>Part {CONTINUATION.part}</span>
        </div>
        <div className={styles.contFrom}>Continued from {CONTINUATION.fromLabel}</div>
        <p className={styles.contNote}>When a thread hits 100 messages it continues here, so search never shows duplicates.</p>
      </div>

      <p className={styles.note}>Splits and merges only change your inbox. Others still see the thread their usual way.</p>
    </div>
  );
}
