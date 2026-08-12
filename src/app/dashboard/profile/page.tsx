import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/features/members/ProfileForm";

type ProfileRow = {
  id: string;
  member_id: string;
  full_name: string;
  preferred_name: string | null;
  gender: "male" | "female" | "prefer_not_to_say" | null;
  date_of_birth: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  entry_year: number | null;
  graduation_year: number | null;
  badge_id: string | null;
  country_id: string | null;
  chapter_id: string | null;
  occupation_id: string | null;
  custom_chapter: string | null;
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
  status: "pending" | "verified" | "suspended" | "inactive";
};

type BadgeOption = {
  id: string;
  display_name: string;
  badge_year: number;
  entry_year: number | null;
  graduation_year: number | null;
};

type CountryOption = {
  id: string;
  name: string;
  code: string | null;
};

type ChapterOption = {
  id: string;
  name: string;
  country_id: string | null;
  city: string | null;
  region: string | null;
  is_active: boolean;
};

type OccupationOption = {
  id: string;
  name: string;
};

export default async function MemberProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    profileResult,
    badgesResult,
    countriesResult,
    chaptersResult,
    occupationsResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        `
          id,
          member_id,
          full_name,
          preferred_name,
          gender,
          date_of_birth,
          phone,
          whatsapp,
          email,
          entry_year,
          graduation_year,
          badge_id,
          country_id,
          chapter_id,
          occupation_id,
          custom_chapter,
          custom_occupation,
          company,
          marital_status,
          biography,
          profile_photo,
          status
        `
      )
      .eq("id", user.id)
      .single(),
    supabase
      .from("badges")
      .select("id, display_name, badge_year, entry_year, graduation_year")
      .order("badge_year", { ascending: false }),
    supabase
      .from("countries")
      .select("id, name, code")
      .order("name", { ascending: true }),
    supabase
      .from("chapters")
      .select("id, name, country_id, city, region, is_active")
      .eq("is_active", true)
      .order("name", { ascending: true }),
    supabase
      .from("occupations")
      .select("id, name")
      .order("name", { ascending: true }),
  ]);

  if (profileResult.error || !profileResult.data) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-16">
        <section className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-600">
            Profile unavailable
          </p>

          <h1 className="mt-4 text-3xl font-bold text-blue-950">
            We could not load your member profile.
          </h1>

          <p className="mt-4 leading-7 text-gray-600">
            Please refresh the page. If the problem continues, contact the
            KUPEXSA administrator.
          </p>

          <Link
            href="/dashboard"
            className="mt-7 inline-flex rounded-lg bg-blue-950 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Return to Dashboard
          </Link>
        </section>
      </main>
    );
  }

  const lookupErrors = [
    badgesResult.error,
    countriesResult.error,
    chaptersResult.error,
    occupationsResult.error,
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-blue-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <Link
            href="/dashboard"
            className="inline-flex text-sm font-semibold text-blue-200 transition hover:text-yellow-300"
          >
            ← Back to Dashboard
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
            Member Profile
          </p>

          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            Complete your KUPEXSA profile
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100">
            Keep your information accurate so fellow Kupexsans can identify
            and connect with you through the member directory.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {lookupErrors.length > 0 && (
          <div className="mb-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-sm leading-6 text-yellow-900">
            Your profile loaded, but one or more selection lists could not be
            retrieved. You can still update the fields currently available.
          </div>
        )}

        <ProfileForm
          profile={profileResult.data as ProfileRow}
          badges={(badgesResult.data ?? []) as BadgeOption[]}
          countries={(countriesResult.data ?? []) as CountryOption[]}
          chapters={(chaptersResult.data ?? []) as ChapterOption[]}
          occupations={(occupationsResult.data ?? []) as OccupationOption[]}
        />
      </section>
    </main>
  );
}