import {
  Badge,
  DataTable,
  PageHeader,
  type Column,
} from "@/components/dashboard/primitives";
import {
  ChevronDownIcon,
  MoreIcon,
  SearchIcon,
} from "@/components/dashboard/icons";
import {
  platformUsers,
  statusTone,
  type PlatformUser,
  type UserRole,
} from "../data";

const ROLE_TONE: Record<UserRole, "neutral" | "primary" | "amber"> = {
  Administrator: "primary",
  "Power user": "neutral",
  "Pitch holder": "neutral",
};

const columns: Column<PlatformUser>[] = [
  {
    key: "name",
    header: "Name",
    className: "font-semibold text-ink",
    render: (r) => r.name,
  },
  {
    key: "email",
    header: "Email",
    className: "text-muted text-[13px]",
    render: (r) => r.email,
  },
  { key: "campsite", header: "Campsite", render: (r) => r.campsite },
  {
    key: "role",
    header: "Role",
    render: (r) => <Badge tone={ROLE_TONE[r.role]}>{r.role}</Badge>,
  },
  {
    key: "status",
    header: "Status",
    render: (r) => (
      <Badge tone={statusTone(r.status)} dot>
        {r.status}
      </Badge>
    ),
  },
  {
    key: "action",
    header: "",
    align: "right",
    render: () => (
      <button
        type="button"
        aria-label="User actions"
        className="grid h-8 w-8 place-items-center rounded-[9px] text-muted transition-colors duration-150 hover:bg-subtle hover:text-primary"
      >
        <MoreIcon size={16} />
      </button>
    ),
  },
];

function FilterPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-[10px] bg-surface px-3.5 py-2.5 text-[13.5px] font-medium text-secondary ring-1 ring-border">
      {children}
      <ChevronDownIcon size={15} className="text-muted" />
    </span>
  );
}

export default function SuperAdminUsers() {
  return (
    <>
      <PageHeader
        title="Users"
        subtitle="Every user across every campsite — for support and lookups. Search by name, email or campsite."
      />

      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <label className="flex min-w-[200px] flex-1 items-center gap-2.5 rounded-[10px] bg-surface px-3.5 py-2.5 ring-1 ring-border focus-within:ring-2 focus-within:ring-primary/40 sm:max-w-[340px]">
          <SearchIcon size={16} className="flex-none text-muted" />
          <input
            type="search"
            placeholder="Search across all campsites…"
            className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-muted"
          />
        </label>
        <FilterPill>Campsite: All</FilterPill>
        <FilterPill>Role: All</FilterPill>
      </div>

      <DataTable
        columns={columns}
        rows={platformUsers}
        getRowKey={(r) => r.id}
        caption="Users across all campsites"
      />
    </>
  );
}
