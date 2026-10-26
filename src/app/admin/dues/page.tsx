
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AnnualDuesManager from "@/features/admin/AnnualDuesManager";
import AnnualDuesPdfDownload from "@/features/admin/AnnualDuesPdfDownload";

type Relation<T> = T | T[] | null;

type Member = {
  id: string;
  member_id: string;
  full_name: string;
  custom_chapter: string | null;
  chapter: Relation<{ name: string }>;
  badge: Relation<{ badge_year: number }>;
};

function first<T>(value: Relation<T>): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

export default async function AnnualDuesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role:roles(name)")
    .eq("id", user.id)
    .single();

  const role = first(
    profile?.role as Relation<{ name: string }>
  );

  if (profileError || role?.name !== "Super Admin") {
    redirect("/dashboard");
  }

  const { data: membersData, error: membersError } =
    await supabase
      .from("profiles")
      .select(`
        id,
        member_id,
        full_name,
        custom_chapter,
        chapter:chapters(name),
        badge:badges(badge_year)
      `)
      .order("full_name", { ascending: true });

  const { data: duesData, error: duesError } =
    await supabase
      .from("annual_dues")
      .select("id, member_id, year")
      .order("year", { ascending: false });

  if (membersError || duesError) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-bold text-blue-950">
          Annual Global Dues
        </h1>
        <p className="mt-5 text-red-700">
          {membersError?.message ??
            duesError?.message ??
            "Unable to load dues records."}
        </p>
      </main>
    );
  }

  const members = ((membersData ?? []) as Member[]).map(
    (member) => ({
      id: member.id,
      memberId: member.member_id,
      name: member.full_name,
      chapter:
        first(member.chapter)?.name ??
        member.custom_chapter ??
        "Not assigned",
      classYear: first(member.badge)?.badge_year ?? null,
    })
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-blue-950 px-6 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
            Super Admin
          </p>
          <h1 className="mt-3 text-4xl font-bold">
            Annual Global Dues
          </h1>
          <p className="mt-4 text-blue-100">
            Record and manage members&apos; annual global dues,
            including previous years.
          </p>
          <Link
            href="/admin/members"
            className="mt-6 inline-block font-semibold text-yellow-300 hover:text-yellow-200"
          >
            ← Member Management
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
  <AnnualDuesPdfDownload />

  <AnnualDuesManager
          members={members}
          initialDues={duesData ?? []}
          currentAdminId={user.id}
        />
      </section>
    </main>
  );
}
