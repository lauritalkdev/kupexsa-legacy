import Link from "next/link";
import { redirect } from "next/navigation";

import ChapterPdfDownloadButton from "@/features/admin/ChapterPdfDownloadButton";
import { createClient } from "@/lib/supabase/server";

type MemberStatus = "pending" | "verified" | "suspended" | "inactive";

type ChapterAdminPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

type ChapterMember = {
  id: string;
  member_id: string | null;
  full_name: string | null;
  preferred_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  entry_year: number | null;
  graduation_year: number | null;
  badge_year: number | null;
  chapter_id: string;
  chapter_name: string | null;
  status: MemberStatus;
};

function normalize(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function statusDetails(status: MemberStatus) {
  switch (status) {
    case "verified":
      return {
        label: "Verified",
        className: "border-green-200 bg-green-50 text-green-700",
      };
    case "suspended":
      return {
        label: "Suspended",
        className: "border-red-200 bg-red-50 text-red-700",
      };
    case "inactive":
      return {
        label: "Inactive",
        className: "border-gray-200 bg-gray-100 text-gray-600",
      };
    default:
      return {
        label: "Pending",
        className: "border-yellow-200 bg-yellow-50 text-yellow-800",
      };
  }
}

export default async function ChapterAdminPage({
  searchParams,
}: ChapterAdminPageProps) {
  const supabase = await createClient();
  const params = await searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(`id, full_name, role:roles(name), chapter:chapters(name)`)
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return (
      <main className="min-h-[65vh] bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-blue-950">
            Chapter Admin access unavailable
          </h1>
          <p className="mt-4 text-gray-600">
            We could not confirm your KUPEXSA Chapter Admin profile.
          </p>
          <Link
            href="/dashboard"
            className="mt-7 inline-flex rounded-lg bg-blue-950 px-6 py-3 font-semibold text-white"
          >
            Return to Dashboard
          </Link>
        </div>
      </main>
    );
  }

 type NamedRelation = {
  name: string | null;
};

type RelationValue<T> = T | T[] | null;

const roleRelation = profile.role as RelationValue<NamedRelation>;
const chapterRelation = profile.chapter as RelationValue<NamedRelation>;

const roleName = Array.isArray(roleRelation)
  ? roleRelation[0]?.name ?? null
  : roleRelation?.name ?? null;

const assignedChapterName = Array.isArray(chapterRelation)
  ? chapterRelation[0]?.name ?? null
  : chapterRelation?.name ?? null;

  if (roleName !== "Chapter Admin") {
    return (
      <main className="min-h-[65vh] bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-2xl rounded-3xl border border-yellow-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-blue-950">
            Chapter Admin access required
          </h1>
          <p className="mt-4 text-gray-600">
            This page is reserved for KUPEXSA Chapter Administrators.
          </p>
          <Link
            href="/dashboard"
            className="mt-7 inline-flex rounded-lg bg-blue-950 px-6 py-3 font-semibold text-white"
          >
            Return to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const { data, error } = await supabase.rpc("get_chapter_admin_members");
  const members = (data ?? []) as ChapterMember[];

  const chapterName =
    members[0]?.chapter_name ?? assignedChapterName ?? "Assigned Chapter";

  const totalMembers = members.length;
  const verifiedMembers = members.filter((m) => m.status === "verified").length;
  const pendingMembers = members.filter((m) => m.status === "pending").length;
  const suspendedMembers = members.filter((m) => m.status === "suspended").length;

  const classCounts = members.reduce<Record<string, number>>((acc, member) => {
    const label = member.badge_year
      ? `Class of ${member.badge_year}`
      : "Class not provided";

    acc[label] = (acc[label] ?? 0) + 1;
    return acc;
  }, {});

  const classStatistics = Object.entries(classCounts).sort(([a], [b]) => {
    const aYear = Number(a.replace("Class of ", ""));
    const bYear = Number(b.replace("Class of ", ""));

    if (Number.isFinite(aYear) && Number.isFinite(bYear)) {
      return bYear - aYear;
    }

    if (Number.isFinite(aYear)) return -1;
    if (Number.isFinite(bYear)) return 1;
    return a.localeCompare(b);
  });

  const query = normalize(params.q);

  const filteredMembers = members.filter((member) => {
    if (!query) return true;

    return [
      member.member_id,
      member.full_name,
      member.preferred_name,
      member.phone,
      member.whatsapp,
      member.email,
      member.entry_year?.toString(),
      member.graduation_year?.toString(),
      member.badge_year?.toString(),
      member.status,
    ].some((value) => normalize(value).includes(query));
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-blue-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-400">
            Chapter Admin
          </p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            {chapterName}
          </h1>
          <p className="mt-5 max-w-3xl text-blue-100">
            Welcome, {profile.full_name ?? "Chapter Administrator"}. This page
            shows the current overview for your assigned chapter.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
            {error.message}
          </div>
        )}

        {!error && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Total Members</p>
                <p className="mt-2 text-3xl font-bold text-blue-950">{totalMembers}</p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Verified</p>
                <p className="mt-2 text-3xl font-bold text-green-700">{verifiedMembers}</p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Pending</p>
                <p className="mt-2 text-3xl font-bold text-yellow-700">{pendingMembers}</p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Suspended</p>
                <p className="mt-2 text-3xl font-bold text-red-700">{suspendedMembers}</p>
              </div>
            </div>

            <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-700">
                Badge Statistics
              </p>

              <h2 className="mt-3 text-3xl font-bold text-blue-950">
                Members by Class
              </h2>

              {classStatistics.length === 0 ? (
                <p className="mt-6 text-gray-600">
                  No badge information is available yet.
                </p>
              ) : (
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {classStatistics.map(([className, count]) => (
                    <div
                      key={className}
                      className="rounded-2xl border border-blue-100 bg-blue-50 p-5"
                    >
                      <p className="font-bold text-blue-950">{className}</p>
                      <p className="mt-2 text-2xl font-bold text-yellow-700">{count}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        {count === 1 ? "member" : "members"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-700">
                    Chapter Members
                  </p>

                  <h2 className="mt-3 text-3xl font-bold text-blue-950">
                    Search and View Members
                  </h2>

                  <p className="mt-3 text-gray-600">
                    {filteredMembers.length} of {members.length} chapter members shown.
                  </p>
                </div>

                <ChapterPdfDownloadButton
                  chapterName={chapterName}
                  members={filteredMembers.map((member, index) => ({
                    number: index + 1,
                    fullName: member.full_name ?? "KUPEXSA Member",
                    className: member.badge_year
                      ? `Class of ${member.badge_year}`
                      : "Class of........",
                    contact:
                      member.phone ??
                      member.whatsapp ??
                      "Not provided",
                    status: statusDetails(member.status).label,
                  }))}
                />
              </div>

              <form
                action="/chapter-admin"
                method="get"
                className="mt-7 flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="search"
                  name="q"
                  defaultValue={params.q ?? ""}
                  placeholder="Name, KPX number, phone, WhatsApp, badge year, status..."
                  className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="submit"
                  className="rounded-xl bg-blue-950 px-6 py-3 font-bold text-white transition hover:bg-blue-800"
                >
                  Search
                </button>

                {query && (
                  <Link
                    href="/chapter-admin"
                    className="rounded-xl border border-blue-950 px-6 py-3 text-center font-bold text-blue-950 transition hover:bg-blue-950 hover:text-white"
                  >
                    Clear
                  </Link>
                )}
              </form>
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              {filteredMembers.length === 0 ? (
                <div className="p-10 text-center">
                  <h3 className="text-xl font-bold text-blue-950">
                    No members found
                  </h3>
                  <p className="mt-3 text-gray-600">
                    Try another name, member ID, phone number, badge year or status.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-blue-950 text-left text-sm text-white">
                      <tr>
                        <th className="px-5 py-4 font-semibold">#</th>
                        <th className="px-5 py-4 font-semibold">Full Name</th>
                        <th className="px-5 py-4 font-semibold">Class</th>
                        <th className="px-5 py-4 font-semibold">
                          Phone / WhatsApp
                        </th>
                        <th className="px-5 py-4 font-semibold">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {filteredMembers.map((member, index) => {
                        const status = statusDetails(member.status);

                        return (
                          <tr key={member.id} className="bg-white">
                            <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-blue-950">
                              {index + 1}
                            </td>

                           <td className="px-5 py-4 font-semibold">
  <Link
    href={`/chapter-admin/members/${member.id}`}
    className="text-blue-950 transition hover:text-yellow-700 hover:underline"
  >
    {member.full_name ?? "KUPEXSA Member"}
  </Link>
</td>

                            <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                              {member.badge_year
                                ? `Class of ${member.badge_year}`
                                : "Class of........"}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                              {member.phone ??
                                member.whatsapp ??
                                "Not provided"}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4">
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${status.className}`}
                              >
                                {status.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-10">
              <Link
                href="/dashboard"
                className="inline-flex rounded-xl border border-blue-950 px-5 py-3 font-bold text-blue-950 transition hover:bg-blue-950 hover:text-white"
              >
                Return to Dashboard
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}