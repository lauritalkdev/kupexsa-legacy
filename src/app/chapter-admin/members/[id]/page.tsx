import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type MemberStatus = "pending" | "verified" | "suspended" | "inactive";

type ChapterMemberProfile = {
  id: string;
  member_id: string | null;
  full_name: string | null;
  preferred_name: string | null;
  gender: "male" | "female" | "prefer_not_to_say" | null;
  date_of_birth: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  entry_year: number | null;
  graduation_year: number | null;
  badge_year: number | null;
  badge_name: string | null;
  chapter_id: string | null;
  chapter_name: string | null;
  country_name: string | null;
  occupation_name: string | null;
  custom_occupation: string | null;
  company: string | null;
  marital_status:
    | "single"
    | "married"
    | "divorced"
    | "widowed"
    | "prefer_not_to_say"
    | null;
  biography: string | null;
  profile_photo: string | null;
  status: MemberStatus;
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatLabel(value: string | null | undefined) {
  if (!value) return "Not provided";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
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

export default async function ChapterMemberProfilePage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase.rpc(
    "get_chapter_admin_member_profile",
    {
      target_member_id: id,
    }
  );

  const member = (data?.[0] ?? null) as ChapterMemberProfile | null;

  if (error || !member) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-16">
        <section className="mx-auto max-w-3xl rounded-3xl border border-yellow-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-700">
            Chapter Member Profile
          </p>

          <h1 className="mt-4 text-3xl font-bold text-blue-950">
            Member profile unavailable
          </h1>

          <p className="mt-4 leading-7 text-gray-600">
            This member could not be loaded. The profile may not belong to your
            assigned chapter, or you may no longer have Chapter Admin access.
          </p>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error.message}
            </p>
          )}

          <Link
            href="/chapter-admin"
            className="mt-7 inline-flex rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Return to Chapter Admin
          </Link>
        </section>
      </main>
    );
  }

  const status = statusDetails(member.status);
  const occupation =
    member.custom_occupation?.trim() ||
    member.occupation_name ||
    "Not provided";

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-blue-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <Link
            href="/chapter-admin"
            className="inline-flex text-sm font-semibold text-blue-200 transition hover:text-yellow-300"
          >
            ← Back to Chapter Admin
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
            Read-Only Member Profile
          </p>

          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            {member.full_name ?? "KUPEXSA Member"}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {member.member_id && (
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100">
                {member.member_id}
              </span>
            )}

            <span
              className={`rounded-full border px-4 py-2 text-sm font-bold ${status.className}`}
            >
              {status.label}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <aside className="space-y-6">
            <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="flex min-h-72 items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 p-8">
                {member.profile_photo ? (
                  <div className="h-44 w-44 overflow-hidden rounded-full border-4 border-yellow-400 shadow-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.profile_photo}
                      alt={`${member.full_name ?? "KUPEXSA Member"} profile`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-44 w-44 items-center justify-center rounded-full border-4 border-yellow-400/50 bg-white/10 text-4xl font-bold text-yellow-300">
                    {(member.full_name ?? "KPX")
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((name) => name[0]?.toUpperCase())
                      .join("")}
                  </div>
                )}
              </div>

              <div className="p-7">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-yellow-700">
                  {member.chapter_name ?? "Assigned Chapter"}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-blue-950">
                  {member.full_name ?? "KUPEXSA Member"}
                </h2>

                {member.preferred_name && (
                  <p className="mt-2 text-sm text-gray-500">
                    Known as {member.preferred_name}
                  </p>
                )}

                <p className="mt-5 text-sm leading-6 text-gray-600">
                  This profile is read-only. Chapter Administrators cannot edit
                  member information from this page.
                </p>
              </div>
            </section>
          </aside>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-700">
                Member Information
              </p>

              <h2 className="mt-3 text-3xl font-bold text-blue-950">
                Profile Details
              </h2>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-gray-500">Full Name</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {member.full_name ?? "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Preferred Name
                </p>
                <p className="mt-1 font-semibold text-gray-900">
                  {member.preferred_name ?? "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">Gender</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {formatLabel(member.gender)}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Date of Birth
                </p>
                <p className="mt-1 font-semibold text-gray-900">
                  {member.date_of_birth ?? "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">Phone</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {member.phone ?? "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">WhatsApp</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {member.whatsapp ?? "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">Email</p>
                <p className="mt-1 break-words font-semibold text-gray-900">
                  {member.email ?? "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">Country</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {member.country_name ?? "Not provided"}
                </p>
              </div>
            </div>

            <div className="my-9 border-t border-gray-200" />

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-700">
                School Information
              </p>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Entry Year
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {member.entry_year ?? "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Graduation Year
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {member.graduation_year ?? "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Badge / Class
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {member.badge_year
                      ? `Class of ${member.badge_year}`
                      : member.badge_name ?? "Class of........"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">Chapter</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {member.chapter_name ?? "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            <div className="my-9 border-t border-gray-200" />

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-700">
                Professional and Personal
              </p>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Occupation
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {occupation}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Company / Organisation
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {member.company ?? "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Marital Status
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {formatLabel(member.marital_status)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Membership Status
                  </p>
                  <span
                    className={`mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-bold ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-500">
                  Short Biography
                </p>
                <p className="mt-2 whitespace-pre-line leading-7 text-gray-700">
                  {member.biography ?? "Not provided"}
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}