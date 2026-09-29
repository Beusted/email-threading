import type { CSSProperties, ReactNode } from "react";

interface IconProps {
  size?: number;
  style?: CSSProperties;
  children: ReactNode;
}

function Icon({ size = 18, style, children }: IconProps) {
  return (
    <svg className="ic" viewBox="0 0 24 24" width={size} height={size} style={style}>
      {children}
    </svg>
  );
}

type Props = Omit<IconProps, "children">;

export const MailIcon = (p: Props) => (
  <Icon {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </Icon>
);

export const SearchIcon = (p: Props) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-4-4" />
  </Icon>
);

export const ComposeIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M4 20h4L19 9l-4-4L4 16z" />
  </Icon>
);

export const InboxIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M4 13h4l2 3h4l2-3h4" />
    <path d="M5.5 5h13L21 13v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5z" />
  </Icon>
);

export const StarIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9l-5.3 2.7 1-5.8-4.2-4.1 5.9-.9z" />
  </Icon>
);

export const ClockIcon = (p: Props) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
);

export const SendIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M21 3L10 14" />
    <path d="M21 3l-7 18-4-7-7-4z" />
  </Icon>
);

export const FileIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
  </Icon>
);

export const PaperclipIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M21 11.5l-8.5 8.5a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4L15.5 8" />
  </Icon>
);

export const SparkleIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M12 3l1.8 4.9L19 9.7l-5.2 1.8L12 16.4l-1.8-4.9L5 9.7l5.2-1.8z" />
    <path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z" />
  </Icon>
);

export const BranchIcon = (p: Props) => (
  <Icon {...p}>
    <circle cx="6" cy="5" r="2" />
    <circle cx="6" cy="19" r="2" />
    <circle cx="18" cy="7" r="2" />
    <path d="M6 7v10" />
    <path d="M18 9c0 5-7 4-11.5 8.5" />
  </Icon>
);

export const LinkIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </Icon>
);

export const ReplyIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M9 14L4 9l5-5" />
    <path d="M4 9h10a6 6 0 0 1 6 6v4" />
  </Icon>
);

export const ChevronDownIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M6 9l6 6 6-6" />
  </Icon>
);

export const BackIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Icon>
);

export const ArchiveIcon = (p: Props) => (
  <Icon {...p}>
    <rect x="3" y="4" width="18" height="5" rx="1" />
    <path d="M5 9v10h14V9M10 13h4" />
  </Icon>
);

export const TrashIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
  </Icon>
);

export const InfoIcon = (p: Props) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5M12 16.5v.01" />
  </Icon>
);

export const CloseIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);

export const UserPlusIcon = (p: Props) => (
  <Icon {...p}>
    <circle cx="9" cy="8" r="4" />
    <path d="M2 21a7 7 0 0 1 14 0" />
    <path d="M19 8v6M16 11h6" />
  </Icon>
);

export const ForwardIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M15 14l5-5-5-5" />
    <path d="M20 9H10a6 6 0 0 0-6 6v4" />
  </Icon>
);

export const SunIcon = (p: Props) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Icon>
);

export const MoonIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5z" />
  </Icon>
);

export const MonitorIcon = (p: Props) => (
  <Icon {...p}>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8M12 16v4" />
  </Icon>
);

export const PinIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M9 4h6l-1 6 3 3H7l3-3-1-6z" />
    <path d="M12 16v4" />
  </Icon>
);

export const MoreIcon = (p: Props) => (
  <Icon {...p}>
    <circle cx="5" cy="12" r="1.4" />
    <circle cx="12" cy="12" r="1.4" />
    <circle cx="19" cy="12" r="1.4" />
  </Icon>
);

export const CheckIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M5 12l4.5 4.5L19 7" />
  </Icon>
);

export const BellIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M6 10a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </Icon>
);

export const SplitIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M6 3v6a3 3 0 0 0 3 3h9" />
    <path d="M15 8l3-3-3-3" />
    <path d="M6 12v9" />
  </Icon>
);

export const MergeIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M6 21V9a3 3 0 0 1 3-3h9" />
    <path d="M15 3l3 3-3 3" />
  </Icon>
);
