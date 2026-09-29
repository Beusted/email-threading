import type { Dispatch } from "react";
import { CloseIcon, SparkleIcon } from "@/components/icons";
import type { Action, AskAnswer } from "@/lib/demo/store";
import styles from "./AskPanel.module.css";

interface Props {
  answer: AskAnswer;
  dispatch: Dispatch<Action>;
  onClose: () => void;
}

export function AskPanel({ answer, dispatch, onClose }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.question}>
        <SparkleIcon size={15} style={{ color: "var(--sparkle)" }} />
        {answer.question}
        <button type="button" className={`ghost ${styles.close}`} aria-label="Dismiss answer" onClick={onClose}>
          <CloseIcon size={16} />
        </button>
      </div>

      <div className={styles.answer}>{answer.answer}</div>

      <div className={styles.sources}>
        {answer.sources.map((s) => (
          <button
            key={s.messageId + s.label}
            type="button"
            className={styles.source}
            onClick={() => dispatch({ type: "JUMP_TO", id: s.messageId, sentence: s.sentence })}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className={styles.hint}>Clicking a source opens that message, line highlighted.</p>
    </div>
  );
}
