/* Shared portal system (PORTAL_SPEC Part A) — one import surface for the
   app shell + component library used by all four portals. */

export { AppShell } from "./AppShell";
export { ContentHeader } from "./ContentHeader";
export { SplitButton, UnderlineLink } from "./buttons";
export { StatusMark, StatusSquare, TwoFactorMark, type StatusVariant } from "./StatusMark";
export {
  InstrumentRow,
  useCountUp,
  type InstrumentCell,
} from "./InstrumentRow";
export {
  Ledger,
  EntityCell,
  LedgerCount,
  LedgerPagination,
  LedgerFrame,
  LedgerLink,
  type LedgerColumn,
  type SortDir,
} from "./Ledger";
export {
  FilterBar,
  FilterSelect,
  AppliedTag,
  FilterSearch,
  type FilterOption,
} from "./FilterBar";
export { Drawer } from "./Drawer";
export { ConfirmModal } from "./ConfirmModal";
export { Menu, MenuItem, MenuMeta, MenuRule, RowMenuButton } from "./Menu";
export { NotificationsPanel } from "./NotificationsPanel";
export { UserMenu } from "./UserMenu";
export { LineChartMini, BarChartMini, type ChartDatum } from "./Charts";
export {
  HeatCell,
  HeatLegend,
  heatTier,
  SegmentedBar,
  type Segment,
} from "./HeatCell";
export { ToastProvider, useToast } from "./Toast";
export { ActivityFeed } from "./ActivityFeed";
export {
  Field,
  UnderlineInput,
  UnderlineSelect,
  RuledRadioGroup,
  SquareToggle,
  ToggleRow,
  type RuledOption,
} from "./fields";
export { AuditProvider, useAudit, type AuditEvent, type AuditTone } from "./audit-store";
export type { NavItem, PortalUser, PortalNotification } from "./types";
