import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import ChapterPdfDownloadButton from "@/features/admin/ChapterPdfDownloadButton";

type Relation<T> = T | T[] | null;
type MemberStatus = "pending" | "verified" | "suspended" | "inactive";

type ChapterPageProps = {
  searchParams: Promise<{
    chapter?: string;
  }>;
};

type ChapterRow = {
  id: string;
  name: string;
};

type ChapterMember = {
  id: string;
  full_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  status: MemberStatus;
  chapter_id: string | null;
  custom_chapter: string | null;
  badge: Relation<{
    badge_year: number | null;
  }>;
  chapter: Relation<{
    id: string;
    name: string;
  }>;
};

function first<T>(value: Relation<T>): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
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

function normalizeChapterName(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

export default async function AdminChaptersPage({
  searchParams,
}: ChapterPageProps) {
  const supabase = await createClient();
  const params = await searchParams;

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

  const [chaptersResult, membersResult] = await Promise.all([
    supabase
      .from("chapters")
      .select("id, name")
      .eq("is_active", true)
      .order("name", { ascending: true }),

    supabase
      .from("profiles")
      .select(
        `
          id,
          full_name,
          phone,
          whatsapp,
          status,
          chapter_id,
          custom_chapter,
          badge:badges (
            badge_year
          ),
          chapter:chapters (
            id,
            name
          )
        `
      )
      .order("full_name", { ascending: true }),
  ]);

  const chapters = (chaptersResult.data ?? []) as ChapterRow[];
  const members = (membersResult.data ?? []) as ChapterMember[];

  const customChapterNames = Array.from(
    new Set(
      members
        .map((member) => member.custom_chapter?.trim())
        .filter((value): value is string => Boolean(value))
    )
  ).sort((a, b) => a.localeCompare(b));

  const selectedChapter = params.chapter ?? "";

  let selectedChapterLabel = "";
  let filteredMembers: ChapterMember[] = [];

  if (selectedChapter.startsWith("db:")) {
    const chapterId = selectedChapter.slice(3);
    selectedChapterLabel =
      chapters.find((chapter) => chapter.id === chapterId)?.name ?? "";

    filteredMembers = members.filter(
      (member) => member.chapter_id === chapterId
    );
  } else if (selectedChapter.startsWith("custom:")) {
    const customName = decodeURIComponent(selectedChapter.slice(7));
    selectedChapterLabel = customName;

    filteredMembers = members.filter(
      (member) =>
        normalizeChapterName(member.custom_chapter) ===
        normalizeChapterName(customName)
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-blue-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-400">
            Super Admin
          </p>

          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            Chapter Member Lists
          </h1>

          <p className="mt-5 max-w-3xl leading-7 text-blue-100">
            Select a KUPEXSA chapter to view its registered members in a clean,
            numbered list.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-700">
                Chapter Selection
              </p>

              <h2 className="mt-3 text-3xl font-bold text-blue-950">
                Choose a Chapter
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-gray-600">
                The list includes both official chapters and custom chapters
                entered by members.
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
                href="/dashboard"
                className="font-semibold text-blue-900 transition hover:text-yellow-700"
              >
                Dashboard
              </Link>
            </div>
          </div>

          <form
            action="/admin/chapters"
            method="get"
            className="mt-8 flex flex-col gap-4 sm:flex-row"
          >
            <select
              name="chapter"
              defaultValue={selectedChapter}
              className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select chapter</option>

              {chapters.map((chapter) => (
                <option key={chapter.id} value={`db:${chapter.id}`}>
                  {chapter.name}
                </option>
              ))}

              {customChapterNames.length > 0 && (
                <optgroup label="Other Chapters">
                  {customChapterNames.map((chapterName) => (
                    <option
                      key={chapterName}
                      value={`custom:${encodeURIComponent(chapterName)}`}
                    >
                      {chapterName}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>

            <button
              type="submit"
              className="rounded-xl bg-blue-950 px-6 py-3 font-bold text-white transition hover:bg-blue-800"
            >
              View Members
            </button>
          </form>
        </div>

        {!selectedChapter && (
          <div className="mt-8 rounded-3xl border border-blue-100 bg-blue-50 p-8 text-center">
            <h3 className="text-2xl font-bold text-blue-950">
              Select a chapter to begin
            </h3>

            <p className="mt-3 text-gray-600">
              Its member list will appear here.
            </p>
          </div>
        )}

        {selectedChapter && (
          <div className="mt-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-6 sm:px-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-700">
                Selected Chapter
              </p>

              <h2 className="mt-2 text-3xl font-bold text-blue-950">
                {selectedChapterLabel || "Chapter"} Members
              </h2>

              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-gray-600">
                  {filteredMembers.length}{" "}
                  {filteredMembers.length === 1 ? "member" : "members"} found.
                </p>

                {filteredMembers.length > 0 && (
                  <ChapterPdfDownloadButton
                    chapterName={selectedChapterLabel || "Chapter"}
                    members={filteredMembers.map((member, index) => {
                      const badge = first(member.badge);

                      return {
                        number: index + 1,
                        fullName: member.full_name ?? "KUPEXSA Member",
                        className: badge?.badge_year
                          ? `Class of ${badge.badge_year}`
                          : "Class of........",
                        contact:
                          member.phone ??
                          member.whatsapp ??
                          "Not provided",
                        status: statusDetails(member.status).label,
                      };
                    })}
                  />
                )}
              </div>
            </div>

            {filteredMembers.length === 0 ? (
              <div className="p-10 text-center">
                <h3 className="text-xl font-bold text-blue-950">
                  No members found
                </h3>

                <p className="mt-3 text-gray-600">
                  There are currently no registered members assigned to this
                  chapter.
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
                      const badge = first(member.badge);
                      const status = statusDetails(member.status);

                      return (
                        <tr key={member.id} className="bg-white">
                          <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-blue-950">
                            {index + 1}
                          </td>

                          <td className="px-5 py-4 font-semibold text-gray-900">
                            {member.full_name ?? "KUPEXSA Member"}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                            {badge?.badge_year
                              ? `Class of ${badge.badge_year}`
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
        )}
      </section>
    </main>
  );
}