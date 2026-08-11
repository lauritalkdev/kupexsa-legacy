import Link from "next/link";
import { redirect } from "next/navigation";
import ApproveMemberButton from "@/features/admin/ApproveMemberButton";
import { createClient } from "@/lib/supabase/server";

type Relation<T> = T | T[] | null;
function first<T>(value: Relation<T>): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

export default async function AdminMembersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(`id, full_name, role:roles(name)`)
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return (
      <main className="min-h-[65vh] bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-blue-950">Admin access unavailable</h1>
          <p className="mt-4 text-gray-600">We could not confirm your KUPEXSA administrator profile.</p>
          <Link href="/dashboard" className="mt-7 inline-flex rounded-lg bg-blue-950 px-6 py-3 font-semibold text-white">
            Return to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const role = first(profile.role as Relation<{ name: string }>);
  if (role?.name !== "Super Admin") {
    return (
      <main className="min-h-[65vh] bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-2xl rounded-3xl border border-yellow-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-blue-950">Super Admin access required</h1>
          <p className="mt-4 text-gray-600">This page is reserved for KUPEXSA Super Administrators.</p>
          <Link href="/dashboard" className="mt-7 inline-flex rounded-lg bg-blue-950 px-6 py-3 font-semibold text-white">
            Return to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const { data: members, error } = await supabase
    .from("profiles")
    .select(`id, member_id, full_name, preferred_name, email, phone, entry_year, graduation_year, status, badge:badges(display_name, badge_year)`)
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (
    <main className="bg-gray-50">
      <section className="bg-blue-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-400">Super Admin</p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Member Approvals</h1>
          <p className="mt-5 max-w-3xl text-blue-100">Review KUPEXSA members awaiting approval and verify their membership.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-700">Pending Members</p>
            <h2 className="mt-3 text-3xl font-bold text-blue-950">Awaiting Approval</h2>
            <p className="mt-3 text-gray-600">{members?.length ?? 0} pending member(s).</p>
          </div>
          <Link href="/dashboard" className="font-semibold text-blue-900">← Return to Dashboard</Link>
        </div>

        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">{error.message}</div>}

        {!error && (members?.length ?? 0) === 0 && (
          <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-blue-950">No pending approvals</h3>
            <p className="mt-3 text-gray-600">Every currently registered member has already been processed.</p>
          </div>
        )}

        {!error && members && members.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-2">
            {members.map((member) => {
              const badge = first(member.badge as Relation<{ display_name: string; badge_year: number }>);
              return (
                <article key={member.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-bold text-yellow-700">{member.member_id}</p>
                    <span className="rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-800">
                      Pending Approval
                    </span>
                  </div>
                  <h3 className="mt-3 text-2xl font-bold text-blue-950">{member.full_name}</h3>
                  {member.preferred_name && <p className="mt-1 text-sm text-gray-500">Known as {member.preferred_name}</p>}

                  <div className="mt-6 grid gap-4 rounded-2xl bg-gray-50 p-5 sm:grid-cols-2">
                    <p><strong>Email:</strong> {member.email ?? "Not provided"}</p>
                    <p><strong>Phone:</strong> {member.phone ?? "Not provided"}</p>
                    <p><strong>Entry Year:</strong> {member.entry_year ?? "Not provided"}</p>
                    <p><strong>Graduation Year:</strong> {member.graduation_year ?? "Not provided"}</p>
                    <p className="sm:col-span-2"><strong>Badge / Class:</strong> {badge ? `${badge.display_name} (${badge.badge_year})` : "Not assigned"}</p>
                  </div>

                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <ApproveMemberButton memberId={member.id} memberName={member.full_name} />
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