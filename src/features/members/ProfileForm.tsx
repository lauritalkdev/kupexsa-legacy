"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type Gender = "male" | "female" | "prefer_not_to_say";
type MaritalStatus =
  | "single"
  | "married"
  | "divorced"
  | "widowed"
  | "prefer_not_to_say";

type Profile = {
  id: string;
  member_id: string;
  full_name: string;
  preferred_name: string | null;
  gender: Gender | null;
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
  company: string | null;
  marital_status: MaritalStatus | null;
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

interface ProfileFormProps {
  profile: Profile;
  badges: BadgeOption[];
  countries: CountryOption[];
  chapters: ChapterOption[];
  occupations: OccupationOption[];
}

function optionalValue(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function optionalNumber(value: string) {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function statusLabel(status: Profile["status"]) {
  switch (status) {
    case "verified":
      return "Verified Member";
    case "suspended":
      return "Suspended";
    case "inactive":
      return "Inactive";
    default:
      return "Pending Approval";
  }
}

export default function ProfileForm({
  profile,
  badges,
  countries,
  chapters,
  occupations,
}: ProfileFormProps) {
  const router = useRouter();

  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [preferredName, setPreferredName] = useState(
    profile.preferred_name ?? ""
  );
  const [gender, setGender] = useState<Gender | "">(profile.gender ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(
    profile.date_of_birth ?? ""
  );
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp ?? "");
  const [entryYear, setEntryYear] = useState(
    profile.entry_year?.toString() ?? ""
  );
  const [graduationYear, setGraduationYear] = useState(
    profile.graduation_year?.toString() ?? ""
  );
  const [badgeId, setBadgeId] = useState(profile.badge_id ?? "");
  const [countryId, setCountryId] = useState(profile.country_id ?? "");
  const [chapterId, setChapterId] = useState(profile.chapter_id ?? "");
  const [occupationId, setOccupationId] = useState(
    profile.occupation_id ?? ""
  );
  const [company, setCompany] = useState(profile.company ?? "");
  const [maritalStatus, setMaritalStatus] = useState<
    MaritalStatus | ""
  >(profile.marital_status ?? "");
  const [biography, setBiography] = useState(profile.biography ?? "");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  const filteredChapters = useMemo(() => {
    if (!countryId) {
      return chapters;
    }

    return chapters.filter(
      (chapter) =>
        !chapter.country_id || chapter.country_id === countryId
    );
  }, [chapters, countryId]);

  const profileFields = [
    fullName,
    preferredName,
    gender,
    dateOfBirth,
    phone,
    whatsapp,
    entryYear,
    graduationYear,
    badgeId,
    countryId,
    chapterId,
    occupationId,
    company,
    maritalStatus,
    biography,
  ];

  const completedFields = profileFields.filter((value) =>
    String(value).trim()
  ).length;

  const completion = Math.round(
    (completedFields / profileFields.length) * 100
  );

  function handleCountryChange(value: string) {
    setCountryId(value);

    if (!value) {
      return;
    }

    const currentChapter = chapters.find(
      (chapter) => chapter.id === chapterId
    );

    if (
      currentChapter?.country_id &&
      currentChapter.country_id !== value
    ) {
      setChapterId("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    const normalizedFullName = fullName.trim();
    const parsedEntryYear = optionalNumber(entryYear);
    const parsedGraduationYear = optionalNumber(graduationYear);

    if (normalizedFullName.length < 2) {
      setMessage("Please enter your full name.");
      setMessageType("error");
      return;
    }

    if (
      parsedEntryYear &&
      parsedGraduationYear &&
      parsedGraduationYear < parsedEntryYear
    ) {
      setMessage(
        "Graduation year cannot be earlier than entry year."
      );
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: normalizedFullName,
          preferred_name: optionalValue(preferredName),
          gender: gender || null,
          date_of_birth: dateOfBirth || null,
          phone: optionalValue(phone),
          whatsapp: optionalValue(whatsapp),
          entry_year: parsedEntryYear,
          graduation_year: parsedGraduationYear,
          badge_id: badgeId || null,
          country_id: countryId || null,
          chapter_id: chapterId || null,
          occupation_id: occupationId || null,
          company: optionalValue(company),
          marital_status: maritalStatus || null,
          biography: optionalValue(biography),
        })
        .eq("id", profile.id);

      if (error) {
        throw error;
      }

      await supabase.auth.updateUser({
        data: {
          full_name: normalizedFullName,
          preferred_name: optionalValue(preferredName),
        },
      });

      setMessage("Your KUPEXSA profile has been updated successfully.");
      setMessageType("success");
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Your profile could not be updated.";

      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
      <aside className="space-y-6">
        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="flex min-h-64 items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 p-8">
            {profile.profile_photo ? (
              <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-yellow-400 shadow-xl">
                <Image
                  src={profile.profile_photo}
                  alt={profile.full_name}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-yellow-400/50 bg-white/10 text-4xl font-bold text-yellow-300">
                {profile.full_name
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((name) => name[0]?.toUpperCase())
                  .join("") || "KPX"}
              </div>
            )}
          </div>

          <div className="p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-yellow-700">
              {profile.member_id}
            </p>

            <h2 className="mt-2 text-2xl font-bold text-blue-950">
              {profile.full_name}
            </h2>

            <span className="mt-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-950">
              {statusLabel(profile.status)}
            </span>

            <p className="mt-5 text-sm leading-6 text-gray-600">
              Profile-photo upload will be connected after the KUPEXSA
              Supabase Storage setup is inspected and secured.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-bold text-blue-950">
              Profile Completion
            </h2>

            <span className="text-lg font-bold text-yellow-700">
              {completion}%
            </span>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-950 transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>

          <p className="mt-4 text-sm leading-6 text-gray-600">
            Complete the remaining fields to make your profile easier for
            fellow Kupexsans to identify.
          </p>
        </section>
      </aside>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
            Personal Information
          </p>

          <h2 className="mt-3 text-3xl font-bold text-blue-950">
            Your member details
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            Fields marked with an asterisk are required.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              htmlFor="full-name"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Full Name *
            </label>

            <input
              id="full-name"
              name="full_name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              autoComplete="name"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="preferred-name"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Preferred Name
            </label>

            <input
              id="preferred-name"
              name="preferred_name"
              value={preferredName}
              onChange={(event) => setPreferredName(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={profile.email ?? ""}
              readOnly
              className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
            />

            <p className="mt-2 text-xs text-gray-500">
              Email changes will be handled under Account Settings.
            </p>
          </div>

          <div>
            <label
              htmlFor="gender"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Gender
            </label>

            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={(event) =>
                setGender(event.target.value as Gender | "")
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="prefer_not_to_say">
                Prefer not to say
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="date-of-birth"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Date of Birth
            </label>

            <input
              id="date-of-birth"
              name="date_of_birth"
              type="date"
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Phone Number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              autoComplete="tel"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="whatsapp"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              WhatsApp Number
            </label>

            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="my-10 border-t border-gray-200" />

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
            School Information
          </p>

          <h2 className="mt-3 text-2xl font-bold text-blue-950">
            Your PHS journey
          </h2>
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="entry-year"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Entry Year
            </label>

            <input
              id="entry-year"
              name="entry_year"
              type="number"
              min="1963"
              max="2100"
              value={entryYear}
              onChange={(event) => setEntryYear(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="graduation-year"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Graduation Year
            </label>

            <input
              id="graduation-year"
              name="graduation_year"
              type="number"
              min="1963"
              max="2100"
              value={graduationYear}
              onChange={(event) =>
                setGraduationYear(event.target.value)
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="badge"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Badge / Class
            </label>

            <select
              id="badge"
              name="badge_id"
              value={badgeId}
              onChange={(event) => setBadgeId(event.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select badge or class</option>

              {badges.map((badge) => (
                <option key={badge.id} value={badge.id}>
                  {badge.display_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="my-10 border-t border-gray-200" />

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
            Location and Chapter
          </p>

          <h2 className="mt-3 text-2xl font-bold text-blue-950">
            Where you are connected
          </h2>
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="country"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Country
            </label>

            <select
              id="country"
              name="country_id"
              value={countryId}
              onChange={(event) =>
                handleCountryChange(event.target.value)
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select country</option>

              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="chapter"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              KUPEXSA Chapter
            </label>

            <select
              id="chapter"
              name="chapter_id"
              value={chapterId}
              onChange={(event) => setChapterId(event.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select chapter</option>

              {filteredChapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.name}
                  {chapter.city ? ` — ${chapter.city}` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="my-10 border-t border-gray-200" />

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
            Professional and Personal
          </p>

          <h2 className="mt-3 text-2xl font-bold text-blue-950">
            Tell the community about yourself
          </h2>
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="occupation"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Occupation
            </label>

            <select
              id="occupation"
              name="occupation_id"
              value={occupationId}
              onChange={(event) =>
                setOccupationId(event.target.value)
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select occupation</option>

              {occupations.map((occupation) => (
                <option key={occupation.id} value={occupation.id}>
                  {occupation.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="company"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Company / Organisation
            </label>

            <input
              id="company"
              name="company"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="marital-status"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Marital Status
            </label>

            <select
              id="marital-status"
              name="marital_status"
              value={maritalStatus}
              onChange={(event) =>
                setMaritalStatus(
                  event.target.value as MaritalStatus | ""
                )
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select marital status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
              <option value="prefer_not_to_say">
                Prefer not to say
              </option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="biography"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Short Biography
            </label>

            <textarea
              id="biography"
              name="biography"
              value={biography}
              onChange={(event) => setBiography(event.target.value)}
              rows={6}
              maxLength={1000}
              placeholder="Share a short introduction, your interests, achievements or how fellow Kupexsans can connect with you."
              className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-2 text-right text-xs text-gray-500">
              {biography.length}/1000
            </p>
          </div>
        </div>

        {message && (
          <div
            role="status"
            className={`mt-8 rounded-xl border px-5 py-4 text-sm font-medium ${
              messageType === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4 border-t border-gray-200 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Your member ID and account status are managed by KUPEXSA.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-950 px-7 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving Profile..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}