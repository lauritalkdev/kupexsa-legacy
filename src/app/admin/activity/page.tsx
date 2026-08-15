import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type Relation<T> = T | T[] | null;

type ActivityLogRow = {
  id: string;
  action: string;
  details: string | null;
  created_at: string;
  admin: Relation<{
    full_name: string | null;
    member_id: string | null;
  }>;
  target_member: Relation<{
    full_name: string | null;
    member_id: string | null;
  }>;
};

function first<T>(value: Relation<T>): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

function formatAction(action: string) {
  switch (action) {
    case "member_approved":
      return "Member Approved";
    case "member_suspended":
      return "Member Suspended";
    case "member_reactivated":
      return "Member Reactivated";
    case "chapter_admin_assigned":
      return "Chapter Admin Assigned";
    case "chapter_admin_removed":
      return "Chapter Admin Removed";
    default:
      return action
        .replace(/_/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
  }
}

function actionClass(action: string) {
  switch (action) {
    case "member_approved":
      return "border-green-200 bg-green-50 text-green-700";
    case "member_suspended":
      return "border-red-200 bg-red-50 text-red-700";
    case "member_reactivated":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "chapter_admin_assigned":
      return "border-yellow-200 bg-yellow-50 text-yellow-800";
    case "chapter_admin_removed":
      return "border-gray-200 bg-gray-100 text-gray-700";
    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminActivityPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: adminProfile, error: adminProfileError } = await supabase
    .from("profiles")
    .select(`id, role:roles(name)`)
    .eq("id", user.id)
    .single();

  const adminRole = adminProfile
    ? first(adminProfile.role as Relation<{ name: string }>)
    : null;

  if (
    adminProfileError ||
    !adminProfile ||
    adminRole?.name !== "Super Admin"
  ) {
    return (
      <main className="min-h-[65vh] bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-2xl rounded-3xl border border-yellow-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-blue-950">
            Super Admin access required
          </h1>

          <p className="mt-4 leading-7 text-gray-600">
            This page is reserved for KUPEXSA Super Administrators.
          </p>

          <Link
            href="/dashboard"
            className="mt-7 inline-flex rounded-lg bg-blue-950 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Return to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const { data, error } = await supabase
    .from("admin_activity_logs")
    .select(
      `
        id,
        action,
        details,
        created_at,
        admin:profiles!admin_activity_logs_admin_id_fkey (
          full_name,
          member_id
        ),
        target_member:profiles!admin_activity_logs_target_member_id_fkey (
          full_name,
          member_id
        )
      `
    )
    .order("created_at", { ascending: false });

  const logs = (data ?? []) as ActivityLogRow[];

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-blue-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-400">
            Super Admin
          </p>

          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            Admin Activity Log
          </h1>

          <p className="mt-5 max-w-3xl leading-7 text-blue-100">
            Review important administrative actions performed across KUPEXSA
            Connect.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-700">
              Activity History
            </p>

            <h2 className="mt-3 text-3xl font-bold text-blue-950">
              Recorded Admin Actions
            </h2>

            <p className="mt-3 text-gray-600">
              {logs.length} {logs.length === 1 ? "activity" : "activities"} recorded.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin/members"
              className="font-semibold text-blue-900 transition hover:text-yellow-700"
            >
              Member Management
            </Link>

            <Link
              href="/admin/chapters"
              className="font-semibold text-blue-900 transition hover:text-yellow-700"
            >
              Chapter Lists
            </Link>

            <Link
              href="/dashboard"
              className="font-semibold text-blue-900 transition hover:text-yellow-700"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
            <h3 className="font-bold">Activity logs could not be loaded</h3>
            <p className="mt-2 text-sm">{error.message}</p>
          </div>
        )}

        {!error && logs.length === 0 && (
          <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-blue-950">
              No activity recorded yet
            </h3>

            <p className="mt-3 text-gray-600">
              New Super Admin actions will appear here automatically.
            </p>
          </div>
        )}

        {!error && logs.length > 0 && (
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-blue-950 text-left text-sm text-white">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Date / Time</th>
                    <th className="px-5 py-4 font-semibold">Super Admin</th>
                    <th className="px-5 py-4 font-semibold">Target Member</th>
                    <th className="px-5 py-4 font-semibold">Action</th>
                    <th className="px-5 py-4 font-semibold">Details</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {logs.map((log) => {
                    const admin = first(log.admin);
                    const targetMember = first(log.target_member);

                    return (
                      <tr key={log.id} className="bg-white align-top">
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                          {formatDateTime(log.created_at)}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900">
                            {admin?.full_name ?? "Super Admin"}
                          </p>

                          {admin?.member_id && (
                            <p className="mt-1 text-xs text-gray-500">
                              {admin.member_id}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900">
                            {targetMember?.full_name ?? "Member unavailable"}
                          </p>

                          {targetMember?.member_id && (
                            <p className="mt-1 text-xs text-gray-500">
                              {targetMember.member_id}
                            </p>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${actionClass(
                              log.action
                            )}`}
                          >
                            {formatAction(log.action)}
                          </span>
                        </td>

                        <td className="min-w-64 px-5 py-4 text-sm leading-6 text-gray-600">
                          {log.details ?? "No additional details"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}