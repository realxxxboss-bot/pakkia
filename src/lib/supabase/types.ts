/* ------------------------------------------------------------------
   Shared Supabase row/enum types (mirrors supabase/migrations/0001).
   Hand-written (no generated types yet); keep in sync with the schema.
------------------------------------------------------------------ */

export type Role = "super_admin" | "tenant_admin" | "power_user" | "pitch_holder";
export type UserStatus = "pending" | "active" | "suspended";

/** public.profiles — one row per auth user. */
export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  status: UserStatus;
  tenant_id: string | null;
  requested_campsite_name: string | null;
  created_at: string;
  updated_at: string;
};

/** public.notifications — realtime, one owner per row. */
export type NotificationRow = {
  id: string;
  user_id: string;
  tenant_id: string | null;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
};
