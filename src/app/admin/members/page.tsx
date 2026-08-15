import Link from "next/link";
import { redirect } from "next/navigation";
import ApproveMemberButton from "@/features/admin/ApproveMemberButton";
import { createClient } from "@/lib/supabase/server";

type Relation<T> = T | T[] | null;
type MemberStatus = "pending" | "verified" | "suspended" | "inactive";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

function first<T>(value: Relation<T>): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

function normalize(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function statusClass(status: MemberStatus) {
  if (status === "verified") return "border-green-200 bg-green-50 text-green-700";
  if (status === "suspended") return "border-red-200 bg-red-50 text-red-700";
  if (status === "inactive") return "border-gray-200 bg-gray-100 text-gray-600";
  return "border-yellow-200 bg-yellow-50 text-yellow-800";
}

function statusLabel(status: MemberStatus) {
  if (status === "verified") return "Verified";
  if (status === "suspended") return "Suspended";
  if (status === "inactive") return "Inactive";
  return "Pending Approval";
}

export default async function AdminMembersPage({ searchParams }: Props) {
  const supabase = await createClient();
  const params = await searchParams;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(`id, full_name, role:roles(name)`)
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return <main className="min-h-[65vh] bg-gray-50 px-6 py-20"><div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm"><h1 className="text-3xl font-bold text-blue-950">Admin access unavailable</h1><p className="mt-4 text-gray-600">We could not confirm your KUPEXSA administrator profile.</p><Link href="/dashboard" className="mt-7 inline-flex rounded-lg bg-blue-950 px-6 py-3 font-semibold text-white">Return to Dashboard</Link></div></main>;
  }

  const role = first(profile.role as Relation<{ name: string }>);
  if (role?.name !== "Super Admin") {
    return <main className="min-h-[65vh] bg-gray-50 px-6 py-20"><div className="mx-auto max-w-2xl rounded-3xl border border-yellow-200 bg-white p-8 text-center shadow-sm"><h1 className="text-3xl font-bold text-blue-950">Super Admin access required</h1><p className="mt-4 text-gray-600">This page is reserved for KUPEXSA Super Administrators.</p><Link href="/dashboard" className="mt-7 inline-flex rounded-lg bg-blue-950 px-6 py-3 font-semibold text-white">Return to Dashboard</Link></div></main>;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(`id, member_id, full_name, preferred_name, email, phone, whatsapp, entry_year, graduation_year, status, chapter_id, badge:badges(display_name,badge_year), chapter:chapters(name), role:roles(name)`)
    .order("full_name", { ascending: true });

  const members = data ?? [];
  const query = normalize(params.q);

  const filteredMembers = members.filter((member) => {
    if (!query) return true;
    const badge = first(member.badge as Relation<{ display_name: string; badge_year: number }>);
    const chapter = first(member.chapter as Relation<{ name: string }>);
    const memberRole = first(member.role as Relation<{ name: string }>);

    return [
      member.member_id,
      member.full_name,
      member.preferred_name,
      member.email,
      member.phone,
      member.whatsapp,
      member.entry_year?.toString(),
      member.graduation_year?.toString(),
      badge?.display_name,
      badge?.badge_year?.toString(),
      chapter?.name,
      memberRole?.name,
      member.status,
    ].some((value) => normalize(value).includes(query));
  });

  const pendingCount = members.filter((m) => m.status === "pending").length;
  const verifiedCount = members.filter((m) => m.status === "verified").length;
  const suspendedCount = members.filter((m) => m.status === "suspended").length;
  const chapterAdminCount = members.filter((m) => first(m.role as Relation<{ name: string }>)?.name === "Chapter Admin").length;

  return (
    <main className="bg-gray-50">
      <section className="bg-blue-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-400">Super Admin</p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Member Management</h1>
          <p className="mt-5 max-w-3xl text-blue-100">Search members, approve registrations, manage membership status and assign Chapter Admin responsibilities.</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/admin/chapters"
              className="rounded-xl bg-yellow-500 px-5 py-3 text-sm font-bold text-blue-950 transition hover:bg-yellow-400"
            >
              Chapter Member Lists
            </Link>

            <Link
              href="/admin/activity"
              className="rounded-xl border border-white/60 px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-blue-950"
            >
              Admin Activity Log
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Pending</p><p className="mt-2 text-3xl font-bold text-yellow-700">{pendingCount}</p></div>
          <div className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Verified</p><p className="mt-2 text-3xl font-bold text-green-700">{verifiedCount}</p></div>
          <div className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Suspended</p><p className="mt-2 text-3xl font-bold text-red-700">{suspendedCount}</p></div>
          <div className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Chapter Admins</p><p className="mt-2 text-3xl font-bold text-blue-950">{chapterAdminCount}</p></div>
        </div>

        <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-700">All Members</p>
              <h2 className="mt-3 text-3xl font-bold text-blue-950">Search and Manage Members</h2>
              <p className="mt-3 text-gray-600">{filteredMembers.length} of {members.length} registered members shown.</p>
            </div>
            <Link href="/dashboard" className="font-semibold text-blue-900">← Return to Dashboard</Link>
          </div>

          <form action="/admin/members" method="get" className="mt-7 flex flex-col gap-3 sm:flex-row">
            <input type="search" name="q" defaultValue={params.q ?? ""} placeholder="Name, KPX number, phone, badge, chapter, status..." className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3" />
            <button type="submit" className="rounded-xl bg-blue-950 px-6 py-3 font-bold text-white">Search</button>
            {query && <Link href="/admin/members" className="rounded-xl border border-blue-950 px-6 py-3 text-center font-bold text-blue-950">Clear</Link>}
          </form>
        </div>

        {error && <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">{error.message}</div>}

        {!error && (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {filteredMembers.map((member) => {
              const badge = first(member.badge as Relation<{ display_name: string; badge_year: number }>);
              const chapter = first(member.chapter as Relation<{ name: string }>);
              const memberRole = first(member.role as Relation<{ name: string }>);
              const status = member.status as MemberStatus;
              const memberName = member.full_name ?? "KUPEXSA Member";

              return (
                <article key={member.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-bold text-yellow-700">{member.member_id ?? "Member ID pending"}</p>
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusClass(status)}`}>{statusLabel(status)}</span>
                    {memberRole?.name && memberRole.name !== "Member" && <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">{memberRole.name}</span>}
                  </div>

                  <h3 className="mt-3 text-2xl font-bold text-blue-950">{memberName}</h3>

                  <div className="mt-6 grid gap-4 rounded-2xl bg-gray-50 p-5 sm:grid-cols-2">
                    <p><strong>Email:</strong> {member.email ?? "Not provided"}</p>
                    <p><strong>Phone:</strong> {member.phone ?? member.whatsapp ?? "Not provided"}</p>
                    <p><strong>Class:</strong> {badge?.badge_year ? `Class of ${badge.badge_year}` : "Class of........"}</p>
                    <p><strong>Chapter:</strong> {chapter?.name ?? "Not assigned"}</p>
                    <p><strong>Entry Year:</strong> {member.entry_year ?? "Not provided"}</p>
                    <p><strong>Graduation Year:</strong> {member.graduation_year ?? "Not provided"}</p>
                  </div>

                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <ApproveMemberButton
                      memberId={member.id}
                      memberName={memberName}
                      status={status}
                      roleName={memberRole?.name ?? null}
                      hasChapter={Boolean(member.chapter_id)}
                      isCurrentUser={member.id === user.id}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}