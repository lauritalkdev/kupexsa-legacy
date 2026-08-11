import Link from "next/link";

import { getDirectoryMembers } from "@/features/members/get-directory-members";

type DirectoryPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

function normalize(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function memberInitials(fullName: string) {
  return (
    fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name[0]?.toUpperCase())
      .join("") || "KPX"
  );
}


function memberStatusLabel(status: string) {
  switch (status) {
    case "verified":
      return "Verified";
    case "suspended":
      return "Suspended";
    case "inactive":
      return "Inactive";
    default:
      return "Pending Approval";
  }
}

function memberStatusClasses(status: string) {
  switch (status) {
    case "verified":
      return "border-green-200 bg-green-50 text-green-700";
    case "suspended":
      return "border-red-200 bg-red-50 text-red-700";
    case "inactive":
      return "border-gray-200 bg-gray-100 text-gray-600";
    default:
      return "border-yellow-200 bg-yellow-50 text-yellow-800";
  }
}

export default async function DirectoryPage({
  searchParams,
}: DirectoryPageProps) {
  const params = await searchParams;
  const directory = await getDirectoryMembers();

  const query = normalize(params.q);
  const hasActiveSearch = Boolean(query);

  const filteredMembers = directory.members.filter((member) => {
    const searchableValues = [
      member.fullName,
      member.preferredName,
      member.memberId,
      member.phone,
      member.whatsapp,
      member.occupation?.name,
      member.entryYear?.toString(),
      member.graduationYear?.toString(),
      member.badge?.displayName,
      member.badge?.badgeYear?.toString(),
      member.chapter?.name,
      member.country?.name,
      member.company,
    ];

    return (
      !query ||
      searchableValues.some((value) => normalize(value).includes(query))
    );
  });

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-blue-950 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-yellow-400 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-blue-400 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 text-center lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
            KUPEXSA Member Network
          </p>

          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
            Find and Reconnect with Kupexsans Worldwide
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Search registered members by name, preferred name, KUPEXSA member ID,
            phone, WhatsApp, occupation, school years, badge, chapter or country.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#member-directory"
              className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-blue-950 transition hover:bg-yellow-400"
            >
              Explore Directory
            </a>

            {!directory.isLoggedIn && (
              <Link
                href="/register"
                className="rounded-lg border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-blue-950"
              >
                Join KUPEXSA Connect
              </Link>
            )}

            {directory.isLoggedIn && (
              <Link
                href="/dashboard"
                className="rounded-lg border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-blue-950"
              >
                Return to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Search area */}
      <section
        id="member-directory"
        className="scroll-mt-24 mx-auto max-w-7xl px-6 py-20"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
            Member Directory
          </p>

          <h2 className="mt-4 text-3xl font-bold text-blue-950 sm:text-4xl">
            Search the KUPEXSA Community
          </h2>

          <p className="mt-5 leading-7 text-gray-600">
            The live directory is available to every logged-in KUPEXSA member.
            Contact details can help locate a member but are not displayed on
            directory cards.
          </p>
        </div>

        {!directory.isLoggedIn && (
          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-blue-100 bg-blue-50 p-8 text-center">
            <h3 className="text-2xl font-bold text-blue-950">
              Member login required
            </h3>

            <p className="mt-4 leading-7 text-gray-600">
              Sign in with your KUPEXSA account to access the protected member
              directory.
            </p>

            <Link
              href="/login"
              className="mt-7 inline-flex rounded-lg bg-blue-950 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              Member Login
            </Link>
          </div>
        )}

        {directory.canAccessDirectory && (
          <>
            <form
              action="/directory#member-results"
              method="get"
              className="mt-12 rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm sm:p-8"
            >
              <div>
                <label
                  htmlFor="directory-search"
                  className="mb-2 block text-sm font-semibold text-blue-950"
                >
                  Universal Search
                </label>

                <input
                  id="directory-search"
                  name="q"
                  type="search"
                  defaultValue={params.q ?? ""}
                  placeholder="Name, nickname, KPX number, phone, WhatsApp, occupation, badge or year"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  Search with any detail you know. Phone and WhatsApp numbers
                  can locate a member but are not displayed in the results.
                </p>
              </div>

              <div className="mt-7 flex flex-wrap gap-4">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-950 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
                >
                  Search Members
                </button>

                {hasActiveSearch && (
                  <Link
                    href="/directory#member-results"
                    className="rounded-lg border border-blue-950 px-6 py-3 font-semibold text-blue-950 transition hover:bg-blue-950 hover:text-white"
                  >
                    Clear Search
                  </Link>
                )}
              </div>
            </form>

            {directory.error && (
              <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
                <h3 className="font-bold">Directory could not be loaded</h3>
                <p className="mt-2 text-sm leading-6">{directory.error}</p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Live members */}
      {directory.canAccessDirectory && !directory.error && (
        <section id="member-results" className="scroll-mt-24 bg-gray-50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
                  Directory Members
                </p>

                <h2 className="mt-4 text-3xl font-bold text-blue-950 sm:text-4xl">
                  Kupexsans Across Generations
                </h2>

                <p className="mt-5 leading-7 text-gray-600">
                  Showing {filteredMembers.length} registered{" "}
                  {filteredMembers.length === 1 ? "member" : "members"}
                  {hasActiveSearch ? " matching your search." : "."}
                </p>
              </div>

              {hasActiveSearch && (
                <Link
                  href="/directory#member-results"
                  className="font-semibold text-blue-900 transition hover:text-yellow-700"
                >
                  View all registered members →
                </Link>
              )}
            </div>

            {filteredMembers.length === 0 ? (
              <div className="mt-12 rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl">
                  🔎
                </div>

                <h3 className="mt-5 text-2xl font-bold text-blue-950">
                  No matching members found
                </h3>

                <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-600">
                  Try a different name, KUPEXSA number, phone fragment, occupation, badge or year.
                </p>

                <Link
                  href="/directory#member-results"
                  className="mt-7 inline-flex rounded-lg bg-blue-950 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
                >
                  Clear Search
                </Link>
              </div>
            ) : (
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredMembers.map((member) => (
                  <article
                    key={member.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex min-h-52 items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 p-7">
                      {member.profilePhoto ? (
                        <img
                          src={member.profilePhoto}
                          alt={member.fullName}
                          className="h-32 w-32 rounded-full border-4 border-yellow-400 object-cover shadow-xl"
                        />
                      ) : (
                        <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-yellow-400/50 bg-white/10 text-3xl font-bold text-yellow-300">
                          {memberInitials(member.fullName)}
                        </div>
                      )}
                    </div>

                    <div className="p-7">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-yellow-700">
                          {member.memberId}
                        </p>

                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${memberStatusClasses(
                            member.status
                          )}`}
                        >
                          {memberStatusLabel(member.status)}
                        </span>
                      </div>

                      <h3 className="mt-2 text-2xl font-bold text-blue-950">
                        {member.fullName}
                      </h3>

                      {member.preferredName && (
                        <p className="mt-1 text-sm text-gray-500">
                          Known as {member.preferredName}
                        </p>
                      )}

                      <p className="mt-3 font-medium text-gray-700">
                        {member.occupation?.name ?? "Occupation not provided"}
                      </p>

                      {member.company && (
                        <p className="mt-1 text-sm text-gray-500">
                          {member.company}
                        </p>
                      )}

                      <div className="mt-5 space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-semibold text-blue-950">
                            Entry:
                          </span>{" "}
                          {member.entryYear ?? "Not provided"}
                        </p>

                        <p>
                          <span className="font-semibold text-blue-950">
                            Graduation:
                          </span>{" "}
                          {member.graduationYear ?? "Not provided"}
                        </p>

                        <p>
                          <span className="font-semibold text-blue-950">
                            Badge:
                          </span>{" "}
                          {member.badge?.displayName ?? "Not assigned"}
                        </p>

                        <p>
                          <span className="font-semibold text-blue-950">
                            Chapter:
                          </span>{" "}
                          {member.chapter?.name ?? "Not assigned"}
                        </p>

                        <p>
                          <span className="font-semibold text-blue-950">
                            Country:
                          </span>{" "}
                          {member.country?.name ?? "Not provided"}
                        </p>
                      </div>

                      <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-center text-sm font-semibold text-blue-900">
                        Public profile page coming next
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Privacy */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 rounded-3xl border border-blue-100 bg-blue-50 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-700">
              Member Privacy
            </p>

            <h2 className="mt-4 text-3xl font-bold text-blue-950">
              Built for trusted alumni connections
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-gray-600">
              Phone and WhatsApp numbers may be used to locate a member, but
              they are not displayed on directory cards. Public-profile contact
              visibility will be controlled through member privacy settings.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-7 shadow-sm">
            <h3 className="text-xl font-bold text-blue-950">
              Directory access
            </h3>

            <p className="mt-4 leading-7 text-gray-600">
              The live KUPEXSA Member Directory is available to all logged-in
              KUPEXSA members, including accounts awaiting approval.
            </p>

            {!directory.isLoggedIn && (
              <Link
                href="/login"
                className="mt-6 inline-flex rounded-lg bg-blue-950 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
              >
                Member Login
              </Link>
            )}

            {directory.canAccessDirectory && (
              <span className="mt-6 inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
                Directory access active
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl rounded-3xl bg-blue-950 px-6 py-14 text-center text-white sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
            Proud to Belong
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold sm:text-4xl">
            Continue building the KUPEXSA global community
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100">
            Keep your member profile accurate so classmates and fellow
            Kupexsans can identify and reconnect with you.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {directory.isLoggedIn ? (
              <>
                <Link
                  href="/dashboard/profile"
                  className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-blue-950 transition hover:bg-yellow-400"
                >
                  Update My Profile
                </Link>

                <Link
                  href="/dashboard"
                  className="rounded-lg border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-blue-950"
                >
                  Open Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-blue-950 transition hover:bg-yellow-400"
                >
                  Create Account
                </Link>

                <Link
                  href="/login"
                  className="rounded-lg border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-blue-950"
                >
                  Member Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}