import type { Dispatch } from "react";
import { FileIcon, LinkIcon, ReplyIcon } from "@/components/icons";
import { MESSAGES } from "@/lib/demo/data";
import { fmtFull, fmtShort } from "@/lib/demo/dates";
import {
  attachmentById,
  attachmentsFor,
  linksFor,
  parentOf,
  person,
  recipientNames,
  splitHighlight,
} from "@/lib/demo/selectors";
import type { Action } from "@/lib/demo/store";
import type { Ask, Message, Reminder } from "@/lib/demo/types";
import { ActionBar } from "./ActionBar";
import styles from "./MessageReader.module.css";

interface Props {
  message: Message;
  ask?: Ask;
  reminder?: Reminder;
  pinned: boolean;
  done: boolean;
  flashSentence?: string | null;
  dispatch: Dispatch<Action>;
}

export function MessageReader({ message, ask, reminder, pinned, done, flashSentence, dispatch }: Props) {
  const p = person(message.from);
  const parent = parentOf(message.id);
  const files = attachmentsFor(message.id);
  const links = linksFor(message.id);
  const mentions = (message.mentionIds ?? []).map(attachmentById).filter(Boolean);
  const idx = MESSAGES.findIndex((m) => m.id === message.id);
  const nextNew = MESSAGES.slice(idx + 1).find((m) => m.isNew);
  const askOpen = ask?.status === "open";

  const flashSent = flashSentence && message.body.includes(flashSentence) ? flashSentence : null;
  const target = flashSent ?? (askOpen ? ask?.highlight : undefined);
  const base = splitHighlight(message.body, target);
  const hl = base ? { ...base, flash: !!flashSent } : null;

  return (
    <section className={`scroll ${styles.section}`} aria-label="Message">
      <div className={styles.top}>
        <span className={styles.pos}>
          Message {idx + 1} of {MESSAGES.length}
        </span>
        <div className={styles.nav}>
          <button
            type="button"
            className={`ghost ${styles.navBtn}`}
            disabled={idx === 0}
            onClick={() => dispatch({ type: "SELECT", id: MESSAGES[idx - 1].id })}
          >
            Previous
          </button>
          <button
            type="button"
            className={`ghost ${styles.navBtn}`}
            disabled={!nextNew}
            onClick={() => nextNew && dispatch({ type: "SELECT", id: nextNew.id })}
          >
            Next new
          </button>
        </div>
      </div>

      <div className={styles.senderRow}>
        <span className={styles.avatar} style={{ background: p.bg, color: p.fg }}>
          {p.initials}
        </span>
        <div className={styles.senderCol}>
          <div className={styles.nameLine}>
            <span className={styles.name}>{p.name}</span>
            {askOpen && <span className={styles.asksTag}>Asks you</span>}
          </div>
          <div className={styles.to}>
            to {recipientNames(message.to)}
            {message.cc.length > 0 && <>, cc {recipientNames(message.cc)}</>}
          </div>
          {parent && (
            <button
              type="button"
              className={`reply ${styles.replyingTo}`}
              onClick={() => dispatch({ type: "JUMP_TO", id: parent.id })}
            >
              <ReplyIcon size={14} />
              Replying to <span className={styles.replyingStrong}>{parent.topic} ({person(parent.from).first}, {fmtShort(parent.sentAt)})</span>
            </button>
          )}
        </div>
        <span className={styles.when}>{fmtFull(message.sentAt)}</span>
      </div>

      <ActionBar message={message} ask={ask} reminder={reminder} pinned={pinned} done={done} dispatch={dispatch} />

      <div className={styles.body}>
        {hl ? (
          <>
            {hl.before}
            <mark className={`${styles.mark} ${hl.flash ? "flash" : ""}`}>{hl.match}</mark>
            {hl.after}
          </>
        ) : (
          message.body
        )}
      </div>

      {mentions.length > 0 && (
        <div className={styles.files}>
          <div className={styles.filesLabel}>Mentioned file</div>
          {mentions.map(
            (a) =>
              a && (
                <button key={a.id} type="button" className={`tile ${styles.tile}`} onClick={() => dispatch({ type: "JUMP_TO", id: a.messageId })}>
                  <FileIcon size={18} />
                  <span className={styles.tileText}>
                    <span className={styles.tileName}>{a.name}</span>
                    <span className={styles.tileMeta}>
                      From {person(MESSAGES.find((m) => m.id === a.messageId)!.from).first}, {fmtShort(MESSAGES.find((m) => m.id === a.messageId)!.sentAt)}, latest version
                    </span>
                  </span>
                </button>
              ),
          )}
        </div>
      )}

      {(files.length > 0 || links.length > 0) && (
        <div className={styles.files}>
          <div className={styles.grid}>
            {files.map((a) => (
              <div key={a.id} className={`tile ${styles.tile}`}>
                <FileIcon size={18} />
                <span className={styles.tileText}>
                  <span className={styles.tileName}>{a.name}</span>
                  <span className={styles.tileMeta}>{a.meta}</span>
                </span>
              </div>
            ))}
            {links.map((l) => (
              <div key={l.id} className={`tile ${styles.tile}`}>
                <LinkIcon size={18} />
                <span className={styles.tileText}>
                  <span className={styles.tileName}>{l.name}</span>
                  <span className={styles.tileMeta}>{l.meta}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={() => dispatch({ type: "REPLY", messageId: message.id })}>
          <ReplyIcon size={17} />
          Reply
        </button>
        <button type="button" className={`ghost ${styles.secondary}`} onClick={() => dispatch({ type: "REPLY", messageId: message.id })}>
          Reply all
        </button>
      </div>
      {(askOpen || reminder) && (
        <p className={styles.replyNote}>Replying marks this ask done and cancels its reminder.</p>
      )}
    </section>
  );
}
