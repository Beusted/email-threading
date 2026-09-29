import type { ThreadModel } from "@/lib/thread";
import { MessageRow } from "./MessageRow";
import styles from "./TimelineView.module.css";

interface Props {
  model: ThreadModel;
  onPick: (idx: number) => void;
  onToggle: (idx: number) => void;
  onGoParent: (parentIdx: number) => void;
  onShowEarly: () => void;
}

export function TimelineView({ model, onPick, onToggle, onGoParent, onShowEarly }: Props) {
  return (
    <div className={styles.wrap} style={{ maxWidth: model.tlMax }}>
      <div className={styles.spine} />
      {model.msgs.map((m) => (
        <MessageRow
          key={m.idx}
          m={m}
          accent={model.accent}
          onPick={onPick}
          onToggle={onToggle}
          onGoParent={onGoParent}
          onShowEarly={onShowEarly}
        />
      ))}
    </div>
  );
}
