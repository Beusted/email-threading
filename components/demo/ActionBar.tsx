import type { Dispatch } from "react";
import { BellIcon, CheckIcon, ClockIcon, ForwardIcon, MoreIcon, PinIcon } from "@/components/icons";
import { person } from "@/lib/demo/selectors";
import { reminderFor, type Action } from "@/lib/demo/store";
import type { Ask, Message, Reminder } from "@/lib/demo/types";
import { Popover } from "./Popover";
import styles from "./ActionBar.module.css";

interface Props {
  message: Message;
  ask?: Ask;
  reminder?: Reminder;
  pinned: boolean;
  done: boolean;
  dispatch: Dispatch<Action>;
}

export function ActionBar({ message, ask, reminder, pinned, done, dispatch }: Props) {
  const hasDue = !!ask?.dueDate;
  const isDone = done || ask?.status === "done";

  const remindMenu = (close: () => void) => (
    <>
      <button
        className="menuitem"
        role="menuitem"
        onClick={() => {
          dispatch({ type: "SET_REMINDER", kind: "later-today", messageId: message.id });
          close();
        }}
      >
        <span className="row">
          <span className="title">Later today</span>
          <span className="when">{reminderFor("later-today", message.id).label}</span>
        </span>
      </button>
      <button
        className="menuitem"
        role="menuitem"
        onClick={() => {
          dispatch({ type: "SET_REMINDER", kind: "tomorrow", messageId: message.id });
          close();
        }}
      >
        <span className="row">
          <span className="title">Tomorrow morning</span>
          <span className="when">{reminderFor("tomorrow", message.id).label}</span>
        </span>
      </button>
      {hasDue && (
        <button
          className="menuitem"
          role="menuitem"
          data-on={reminder?.label === reminderFor("before-due", message.id, ask?.dueDate).label}
          onClick={() => {
            dispatch({ type: "SET_REMINDER", kind: "before-due", messageId: message.id, due: ask?.dueDate });
            close();
          }}
        >
          <span className="row">
            <span className="title">Before it&apos;s due</span>
            <span className="when">{reminderFor("before-due", message.id, ask?.dueDate).label}</span>
          </span>
          <span className="sub">{person(message.from).first} wants an answer soon</span>
        </button>
      )}
      <button
        className="menuitem"
        role="menuitem"
        onClick={() => {
          dispatch({ type: "SET_REMINDER", kind: "pick", messageId: message.id });
          close();
        }}
      >
        <span className="title">Pick a date and time…</span>
      </button>
      {reminder && (
        <>
          <div className="menusep" />
          <button
            className="menuitem"
            role="menuitem"
            onClick={() => {
              dispatch({ type: "CLEAR_REMINDER", messageId: message.id });
              close();
            }}
          >
            <span className="title">Clear reminder</span>
          </button>
        </>
      )}
    </>
  );

  return (
    <div className={styles.bar}>
      {reminder ? (
        <Popover
          ariaLabel="Change reminder"
          triggerClassName={styles.reminderChip}
          button={
            <>
              <ClockIcon size={15} />
              Reminder · {reminder.label}
            </>
          }
        >
          {remindMenu}
        </Popover>
      ) : (
        <Popover ariaLabel="Remind me" triggerClassName={`${styles.btn} ${styles.remind}`} button={<><ClockIcon size={16} />Remind me</>}>
          {remindMenu}
        </Popover>
      )}

      <button
        type="button"
        className={`${styles.btn} ${pinned ? styles.on : ""}`}
        aria-pressed={pinned}
        onClick={() => dispatch(pinned ? { type: "UNPIN" } : { type: "PIN", id: message.id })}
      >
        <PinIcon size={16} />
        {pinned ? "Pinned" : "Pin"}
      </button>

      <button
        type="button"
        className={`${styles.btn} ${isDone ? styles.on : ""}`}
        onClick={() => (ask ? dispatch({ type: "MARK_ASK_DONE", askId: ask.id }) : dispatch({ type: "MARK_DONE", id: message.id }))}
      >
        <CheckIcon size={16} />
        {isDone ? "Done" : "Mark done"}
      </button>

      <button type="button" className={styles.btn} onClick={() => dispatch({ type: "FORWARD", what: "Message" })}>
        <ForwardIcon size={16} />
        Forward
      </button>

      <Popover ariaLabel="More actions" align="right" triggerClassName={`${styles.btn} ${styles.iconOnly}`} button={<MoreIcon size={18} />}>
        {(close) => (
          <>
            <button
              className="menuitem"
              role="menuitem"
              onClick={() => {
                if (!reminder) dispatch({ type: "SET_REMINDER", kind: hasDue ? "before-due" : "later-today", messageId: message.id, due: ask?.dueDate });
                dispatch({ type: "FIRE_REMINDER", messageId: message.id });
                close();
              }}
            >
              <span className="row">
                <span className="title">
                  <BellIcon size={14} style={{ marginRight: 6, verticalAlign: "-2px" }} />
                  Simulate reminder
                </span>
                <span className="when">dev</span>
              </span>
              <span className="sub">Fires the reminder banner now</span>
            </button>
            <button className="menuitem" role="menuitem" onClick={() => { dispatch({ type: "TOAST", message: "Link copied" }); close(); }}>
              <span className="title">Copy link to message</span>
            </button>
          </>
        )}
      </Popover>
    </div>
  );
}
