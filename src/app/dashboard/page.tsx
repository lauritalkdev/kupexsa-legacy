import Link from "next/link";
import { redirect } from "next/navigation";

import HeritageImage from "@/components/ui/HeritageImage";
import { SCHOOL_MOTTO } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

type MemberStatus = "pending" | "verified" | "suspended" | "inactive";

type ChapterRelation = {
  name: string | null;
};

type BadgeRelation = {
  badge_year: number | null;
};

type MemberProfile = {
  id: string;
  member_id: string | null;
  full_name: string | null;
  preferred_name: string | null;
  gender: string | null;
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
  marital_status: string | null;
  biography: string | null;
  profile_photo: string | null;
  status: MemberStatus;
  chapters: ChapterRelation | ChapterRelation[] | null;
  badges: BadgeRelation | BadgeRelation[] | null;
};

function getChapterName(chapters: MemberProfile["chapters"]) {
  if (Array.isArray(chapters)) {
    return chapters[0]?.name ?? null;
  }

  return chapters?.name ?? null;
}

function getBadgeYear(badges: MemberProfile["badges"]) {
  if (Array.isArray(badges)) {
    return badges[0]?.badge_year ?? null;
  }

  return badges?.badge_year ?? null;
}

function getStatusDetails(status: MemberStatus) {
  switch (status) {
    case "verified":
      return {
        label: "Verified Member",
        badgeClass: "bg-green-400/15 text-green-300",
        noticeClass: "border-green-200 bg-green-50",
        noticeTitle: "Your KUPEXSA membership is verified",
        noticeText:
          "Your membership has been approved. Complete any remaining profile details to get the most from KUPEXSA Connect.",
      };
    case "suspended":
      return {
        label: "Suspended",
        badgeClass: "bg-red-400/15 text-red-300",
        noticeClass: "border-red-200 bg-red-50",
        noticeTitle: "Your KUPEXSA account is currently suspended",
        noticeText:
          "Some member services may be unavailable. Please contact the KUPEXSA administration for assistance.",
      };
    case "inactive":
      return {
        label: "Inactive",
        badgeClass: "bg-gray-400/15 text-gray-200",
        noticeClass: "border-gray-300 bg-gray-100",
        noticeTitle: "Your KUPEXSA account is inactive",
        noticeText:
          "Review your profile and contact the KUPEXSA administration if you need your membership reactivated.",
      };
    default:
      return {
        label: "Pending Approval",
        badgeClass: "bg-yellow-400/15 text-yellow-300",
        noticeClass: "border-yellow-200 bg-yellow-50",
        noticeTitle: "Your account is awaiting KUPEXSA approval",
        noticeText:
          "You can explore the dashboard while your membership information is being reviewed.",
      };
  }
}

function calculateProfileCompletion(profile: MemberProfile) {
  const fields = [
    profile.full_name,
    profile.preferred_name,
    profile.gender,
    profile.date_of_birth,
    profile.phone,
    profile.whatsapp,
    profile.email,
    profile.entry_year,
    profile.graduation_year,
    profile.badge_id,
    profile.country_id,
    profile.chapter_id,
    profile.occupation_id,
    profile.company,
    profile.marital_status,
    profile.biography,
    profile.profile_photo,
  ];

  const completedFields = fields.filter((field) => {
    if (typeof field === "string") {
      return field.trim().length > 0;
    }

    return field !== null && field !== undefined;
  }).length;

  return Math.round((completedFields / fields.length) * 100);
}

const quickActions = [
  {
    title: "My Profile",
    description: "Review and update your KUPEXSA member information.",
    href: "/dashboard/profile",
    icon: "👤",
  },
  {
    title: "Member Directory",
    description: "Find and reconnect with Kupexsans worldwide.",
    href: "/directory",
    icon: "👥",
  },
  {
    title: "Events",
    description: "Discover upcoming meetings, reunions and celebrations.",
    href: "/events",
    icon: "📅",
  },
  {
    title: "Announcements",
    description: "Read official updates from KUPEXSA leadership.",
    href: "#announcements",
    icon: "📢",
  },
  {
    title: "Gallery",
    description: "Explore memorable moments from the KUPEXSA community.",
    href: "#community-gallery",
    icon: "📷",
  },
  {
    title: "Account Settings",
    description: "Manage your account, privacy and communication preferences.",
    href: "/dashboard/settings",
    icon: "⚙️",
  },
];

const announcements = [
  {
    category: "Executive Update",
    title: "Official KUPEXSA announcements will appear here",
    description:
      "Members will receive important information, association notices and leadership updates through this section.",
  },
  {
    category: "Upcoming Event",
    title: "Event reminders and registration updates",
    description:
      "Confirmed event dates, venues and participation details will be published for members.",
  },
  {
    category: "Chapter News",
    title: "Updates from KUPEXSA chapters worldwide",
    description:
      "Local and international chapters will be able to share meetings, activities and community news.",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profileData, error: profileError } = await supabase
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
        company,
        marital_status,
        biography,
        profile_photo,
        status,
        chapters(name),
        badges(badge_year)
      `
    )
    .eq("id", user.id)
    .maybeSingle();

  const fallbackProfile: MemberProfile = {
    id: user.id,
    member_id: null,
    full_name:
      typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : null,
    preferred_name:
      typeof user.user_metadata?.preferred_name === "string"
        ? user.user_metadata.preferred_name
        : null,
    gender: null,
    date_of_birth: null,
    phone: null,
    whatsapp:
      typeof user.user_metadata?.whatsapp === "string"
        ? user.user_metadata.whatsapp
        : null,
    email: user.email ?? null,
    entry_year:
      typeof user.user_metadata?.entry_year === "number"
        ? user.user_metadata.entry_year
        : null,
    graduation_year:
      typeof user.user_metadata?.graduation_year === "number"
        ? user.user_metadata.graduation_year
        : null,
    badge_id: null,
    country_id: null,
    chapter_id: null,
    occupation_id: null,
    company: null,
    marital_status: null,
    biography: null,
    profile_photo: null,
    status: "pending",
    chapters: null,
    badges: null,
  };

  const profile = (profileData as MemberProfile | null) ?? fallbackProfile;
  const chapterName = getChapterName(profile.chapters);
  const badgeYear = getBadgeYear(profile.badges);
  const statusDetails = getStatusDetails(profile.status);
  const profileCompletion = calculateProfileCompletion(profile);

  const displayName =
    profile.preferred_name?.trim() ||
    profile.full_name?.trim().split(/\s+/)[0] ||
    "Kupexsan";

  const memberName = profile.full_name?.trim() || "KUPEXSA Member";
  const classDisplay = badgeYear ? `Class of ${badgeYear}` : "Class of........";

  const [verifiedMembersResult, countriesResult, chaptersResult, eventsResult] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("status", "verified"),
      supabase.from("countries").select("id", { count: "exact", head: true }),
      supabase
        .from("chapters")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
      supabase.from("events").select("id", { count: "exact", head: true }),
    ]);

  const statistics = [
    {
      label: "Verified Members",
      value:
        verifiedMembersResult.error || verifiedMembersResult.count === null
          ? "—"
          : verifiedMembersResult.count.toLocaleString(),
    },
    {
      label: "Countries",
      value:
        countriesResult.error || countriesResult.count === null
          ? "—"
          : countriesResult.count.toLocaleString(),
    },
    {
      label: "Active Chapters",
      value:
        chaptersResult.error || chaptersResult.count === null
          ? "—"
          : chaptersResult.count.toLocaleString(),
    },
    {
      label: "Events Held",
      value:
        eventsResult.error || eventsResult.count === null
          ? "—"
          : eventsResult.count.toLocaleString(),
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Welcome hero */}
      <section className="relative overflow-hidden bg-blue-950 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-yellow-400 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-blue-400 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
              Member Dashboard
            </p>

            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
              Welcome back, {displayName}.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">
              Your digital home for KUPEXSA connections, events, announcements,
              member services and our shared school heritage.
            </p>

            <p className="mt-6 font-semibold text-yellow-300">
              Kupexsan:- Proud to Belong
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/dashboard/profile"
                className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-blue-950 transition hover:bg-yellow-400"
              >
                {profileCompletion === 100 ? "Review My Profile" : "Complete My Profile"}
              </Link>

              <Link
                href="/directory"
                className="rounded-lg border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-blue-950"
              >
                Open Directory
              </Link>
            </div>
          </div>

          {/* Digital membership card */}
          <div className="relative overflow-hidden rounded-3xl border border-yellow-400/30 bg-gradient-to-br from-blue-900 via-blue-950 to-black p-7 shadow-2xl sm:p-8">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full border border-yellow-400/20" />
            <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full border border-blue-400/20" />

            <div className="relative">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
                    KUPEXSA Connect
                  </p>

                  <p className="mt-2 text-xs uppercase tracking-widest text-blue-200">
                    Digital Membership Card
                  </p>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-yellow-400/50 bg-yellow-400/10 text-sm font-bold text-yellow-300">
                  {profile.profile_photo ? (
                    // A standard img element supports Supabase/public image URLs without
                    // requiring every possible host to be added to next.config.ts.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.profile_photo}
                      alt={`${memberName} profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    "KPX"
                  )}
                </div>
              </div>

              <div className="mt-12">
                <p className="text-sm text-blue-200">
                  Member Name
                </p>

                <h2 className="mt-1 text-2xl font-bold text-white">
                  {memberName}
                </h2>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-blue-300">
                    Member ID
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {profile.member_id ?? "Pending Assignment"}
                  </p>
                </div>

                <div>
                  <p className="text-blue-300">
                    Account Status
                  </p>

                  <span
                    className={`mt-1 inline-flex rounded-full px-3 py-1 font-semibold ${statusDetails.badgeClass}`}
                  >
                    {statusDetails.label}
                  </span>
                </div>

                <div>
                  <p className="text-blue-300">
                    Class
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {classDisplay}
                  </p>
                </div>

                <div>
                  <p className="text-blue-300">
                    Chapter
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {chapterName ?? "Not assigned"}
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-white/15 pt-5">
                <p className="text-xs uppercase tracking-[0.18em] text-blue-300">
                  Servizium • Scientia • Integritas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Account notice and profile completion */}
      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div
            className={`flex flex-col gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between ${statusDetails.noticeClass}`}
          >
            <div>
              <h2 className="font-bold text-blue-950">
                {statusDetails.noticeTitle}
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                {statusDetails.noticeText}
              </p>

              {profileError && (
                <p className="mt-2 text-sm font-medium text-red-700">
                  Your account is available, but the full profile record could
                  not be loaded. Open your profile to review your details.
                </p>
              )}
            </div>

            <Link
              href="/dashboard/profile"
              className="inline-flex shrink-0 justify-center rounded-lg bg-blue-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Review Profile
            </Link>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-yellow-700">
                  Profile Completion
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Complete your details to improve your member profile.
                </p>
              </div>

              <p className="text-3xl font-bold text-blue-950">
                {profileCompletion}%
              </p>
            </div>

            <div
              className="mt-5 h-3 overflow-hidden rounded-full bg-blue-100"
              role="progressbar"
              aria-label="Profile completion"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={profileCompletion}
            >
              <div
                className="h-full rounded-full bg-yellow-500 transition-all"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>

            <Link
              href="/dashboard/profile"
              className="mt-5 inline-flex text-sm font-semibold text-blue-800 hover:text-yellow-700"
            >
              {profileCompletion === 100
                ? "Review completed profile →"
                : "Complete missing details →"}
            </Link>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
            Quick Access
          </p>

          <h2 className="mt-4 text-3xl font-bold text-blue-950">
            Everything you need in one place
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            Access your profile, directory, events and important community
            information directly from your dashboard.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                {action.icon}
              </span>

              <h3 className="mt-5 text-xl font-bold text-blue-950">
                {action.title}
              </h3>

              <p className="mt-2 leading-7 text-gray-600">
                {action.description}
              </p>

              <p className="mt-5 text-sm font-semibold text-blue-800 transition group-hover:text-yellow-700">
                Open section →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* About and featured event */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2">
          {/* About KUPEXSA */}
          <article className="overflow-hidden rounded-3xl border border-blue-100 bg-blue-50">
            <HeritageImage
              src="/images/dashboard/dashboard-heritage.png"
              alt="The shared heritage of BMC, PSS and PHS Kupexsans"
              label="Dashboard Heritage Photograph"
              className="aspect-[16/9]"
            />

            <div className="p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-700">
                Our Heritage
              </p>

              <h2 className="mt-4 text-3xl font-bold text-blue-950">
                One School. Many Generations. One KUPEXSA.
              </h2>

              <p className="mt-5 leading-8 text-gray-600">
                From Basel Mission College through Presbyterian Secondary
                School to Presbyterian High School, our shared identity
                continues across generations.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 font-bold text-blue-950">
                <span className="rounded-lg bg-white px-4 py-2 shadow-sm">
                  BMC
                </span>

                <span className="text-yellow-600">→</span>

                <span className="rounded-lg bg-white px-4 py-2 shadow-sm">
                  PSS
                </span>

                <span className="text-yellow-600">→</span>

                <span className="rounded-lg bg-blue-950 px-4 py-2 text-white shadow-sm">
                  PHS
                </span>
              </div>

              <Link
                href="/about"
                className="mt-7 inline-flex font-semibold text-blue-800 hover:text-yellow-700"
              >
                Explore our full story →
              </Link>
            </div>
          </article>

          {/* Featured event */}
          <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <HeritageImage
              src="/images/dashboard/dashboard-featured-event.png"
              alt="KUPEXSA 2027 Jubilee celebration"
              label="Dashboard Featured Event Photograph"
              className="aspect-[16/9]"
            />

            <div className="p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-700">
                Featured Event
              </p>

              <h2 className="mt-4 text-3xl font-bold text-blue-950">
                2027 Jubilee Celebration
              </h2>

              <div className="mt-5 space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-semibold text-blue-950">
                    Date:
                  </span>{" "}
                  To be announced
                </p>

                <p>
                  <span className="font-semibold text-blue-950">
                    Location:
                  </span>{" "}
                  Kumba, Cameroon
                </p>
              </div>

              <p className="mt-5 leading-8 text-gray-600">
                A landmark gathering celebrating KUPEXSA history, friendship
                and the legacy shared by Kupexsans around the world.
              </p>

              <Link
                href="/events"
                className="mt-7 inline-flex rounded-lg bg-blue-950 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
              >
                View Event Details
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* Community statistics */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
            Our Community
          </p>

          <h2 className="mt-4 text-3xl font-bold text-blue-950">
            KUPEXSA in numbers
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            These figures are loaded from the current KUPEXSA database. A dash
            appears where a module has not yet been activated or made visible.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statistics.map((statistic) => (
            <article
              key={statistic.label}
              className="rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-sm"
            >
              <p className="text-4xl font-bold text-blue-950">
                {statistic.value}
              </p>

              <p className="mt-3 font-medium text-gray-600">
                {statistic.label}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Directory search */}
      <section className="bg-blue-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-400">
              Member Directory
            </p>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Find a fellow Kupexsan
            </h2>

            <p className="mt-5 leading-7 text-blue-100">
              Search by name, class year, chapter or country and reconnect with
              members of the KUPEXSA community.
            </p>
          </div>

          <form
            action="/directory"
            method="GET"
            className="mx-auto mt-10 max-w-5xl rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label
                  htmlFor="dashboard-member-name"
                  className="mb-2 block text-sm font-semibold text-blue-950"
                >
                  Member Name
                </label>

                <input
                  id="dashboard-member-name"
                  name="name"
                  type="text"
                  placeholder="Search by name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="dashboard-class-year"
                  className="mb-2 block text-sm font-semibold text-blue-950"
                >
                  Class Year
                </label>

                <input
                  id="dashboard-class-year"
                  name="classYear"
                  type="text"
                  placeholder="Example: 2010"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="dashboard-chapter"
                  className="mb-2 block text-sm font-semibold text-blue-950"
                >
                  Chapter
                </label>

                <input
                  id="dashboard-chapter"
                  name="chapter"
                  type="text"
                  placeholder="Example: Buea"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <button
                type="submit"
                className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-blue-950 transition hover:bg-yellow-400"
              >
                Search Members
              </button>

              <Link
                href="/directory"
                className="rounded-lg border border-blue-950 px-6 py-3 font-semibold text-blue-950 transition hover:bg-blue-950 hover:text-white"
              >
                Open Full Directory
              </Link>
            </div>
          </form>
        </div>
      </section>

      {/* Community gallery */}
      <section
        id="community-gallery"
        className="scroll-mt-24 mx-auto max-w-7xl px-6 py-16"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
            Community Gallery
          </p>

          <h2 className="mt-4 text-3xl font-bold text-blue-950">
            Moments from the KUPEXSA family
          </h2>

          <p className="mt-5 leading-7 text-gray-600">
            Photographs from reunions, chapter activities, official meetings
            and memorable alumni celebrations.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <HeritageImage
            src="/images/dashboard/dashboard-gallery-1.png"
            alt="Kupexsans gathered at an alumni event"
            label="Dashboard Community Photograph One"
            className="aspect-[16/10] rounded-2xl shadow-md"
          />

          <HeritageImage
            src="/images/dashboard/dashboard-gallery-2.png"
            alt="KUPEXSA members during a community gathering"
            label="Dashboard Community Photograph Two"
            className="aspect-[16/10] rounded-2xl shadow-md"
          />

          <HeritageImage
            src="/images/dashboard/dashboard-gallery-3.png"
            alt="Kupexsans celebrating their shared heritage"
            label="Dashboard Community Photograph Three"
            className="aspect-[16/10] rounded-2xl shadow-md"
          />

          <HeritageImage
            src="/images/dashboard/dashboard-gallery-4.png"
            alt="KUPEXSA chapter members during an official activity"
            label="Dashboard Community Photograph Four"
            className="aspect-[16/10] rounded-2xl shadow-md"
          />
        </div>
      </section>

      {/* Announcements */}
      <section
        id="announcements"
        className="scroll-mt-24 bg-gray-100 py-16"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
              Latest Updates
            </p>

            <h2 className="mt-4 text-3xl font-bold text-blue-950">
              KUPEXSA announcements
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Official notices and community updates will be published here for
              members.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {announcements.map((announcement) => (
              <article
                key={announcement.title}
                className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm"
              >
                <p className="text-sm font-bold uppercase tracking-widest text-yellow-700">
                  {announcement.category}
                </p>

                <h3 className="mt-4 text-xl font-bold text-blue-950">
                  {announcement.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  {announcement.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Motto */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border border-blue-100 bg-white px-6 py-14 text-center shadow-sm sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-600">
            Our Guiding Values
          </p>

          <blockquote className="mx-auto mt-5 max-w-3xl text-3xl font-bold text-blue-950 sm:text-4xl">
            “{SCHOOL_MOTTO}”
          </blockquote>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <span className="rounded-full bg-blue-50 px-5 py-2 font-semibold text-blue-950">
              Service
            </span>

            <span className="rounded-full bg-yellow-100 px-5 py-2 font-semibold text-yellow-800">
              Knowledge
            </span>

            <span className="rounded-full bg-blue-50 px-5 py-2 font-semibold text-blue-950">
              Integrity
            </span>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-7xl rounded-3xl bg-blue-950 px-6 py-14 text-center text-white sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
            Proud to Belong
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold sm:text-4xl">
            Continue building the KUPEXSA legacy
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100">
            Complete your profile, reconnect with fellow Kupexsans and remain
            active in the community that unites us.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard/profile"
              className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-blue-950 transition hover:bg-yellow-400"
            >
              {profileCompletion === 100 ? "Review My Profile" : "Complete My Profile"}
            </Link>

            <Link
              href="/directory"
              className="rounded-lg border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-blue-950"
            >
              Explore Directory
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}