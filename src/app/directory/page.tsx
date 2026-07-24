import Link from "next/link";

const sampleMembers = [
  {
    name: "Sample Kupexsan",
    memberId: "KPX000001",
    profession: "Software Engineer",
    chapter: "Buea Chapter",
    country: "Cameroon",
    classYear: "Class of 2010",
  },
  {
    name: "Sample Kupexsan",
    memberId: "KPX000002",
    profession: "Medical Doctor",
    chapter: "Douala Chapter",
    country: "Cameroon",
    classYear: "Class of 2002",
  },
  {
    name: "Sample Kupexsan",
    memberId: "KPX000003",
    profession: "Business Consultant",
    chapter: "UK Chapter",
    country: "United Kingdom",
    classYear: "Class of 1998",
  },
];

const chapters = [
  "Buea",
  "Kumba",
  "Douala",
  "Yaoundé",
  "United Kingdom",
  "United States",
];

export default function DirectoryPage() {
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

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
            Search the growing KUPEXSA community by name, class year, chapter,
            country or profession.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#member-directory"
              className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-blue-950 transition hover:bg-yellow-400"
            >
              Explore Directory
            </a>

            <Link
              href="/register"
              className="rounded-lg border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-blue-950"
            >
              Join KUPEXSA Connect
            </Link>
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
            The full search system will become active when member profiles are
            connected to the directory database.
          </p>
        </div>

        <div className="mt-12 rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm sm:p-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label
                htmlFor="member-name"
                className="mb-2 block text-sm font-semibold text-blue-950"
              >
                Name
              </label>

              <input
                id="member-name"
                type="text"
                placeholder="Search by name"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="class-year"
                className="mb-2 block text-sm font-semibold text-blue-950"
              >
                Class Year
              </label>

              <input
                id="class-year"
                type="text"
                placeholder="Example: 2010"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="chapter"
                className="mb-2 block text-sm font-semibold text-blue-950"
              >
                Chapter
              </label>

              <select
                id="chapter"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                defaultValue=""
              >
                <option value="" disabled>
                  Select chapter
                </option>

                {chapters.map((chapter) => (
                  <option key={chapter} value={chapter}>
                    {chapter}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="profession"
                className="mb-2 block text-sm font-semibold text-blue-950"
              >
                Profession
              </label>

              <input
                id="profession"
                type="text"
                placeholder="Example: Teacher"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <button
            type="button"
            className="mt-6 rounded-lg bg-blue-950 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Search Members
          </button>
        </div>
      </section>

      {/* Sample members */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
              Community Preview
            </p>

            <h2 className="mt-4 text-3xl font-bold text-blue-950 sm:text-4xl">
              Kupexsans Across Generations
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              These sample cards show how approved member profiles will appear
              in the directory.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sampleMembers.map((member) => (
              <article
                key={member.memberId}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex min-h-48 items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-yellow-400/50 bg-white/10 text-3xl font-bold text-yellow-300">
                    KPX
                  </div>
                </div>

                <div className="p-7">
                  <p className="text-sm font-semibold text-yellow-700">
                    {member.memberId}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-blue-950">
                    {member.name}
                  </h3>

                  <p className="mt-2 font-medium text-gray-700">
                    {member.profession}
                  </p>

                  <div className="mt-5 space-y-2 text-sm text-gray-600">
                    <p>{member.classYear}</p>
                    <p>{member.chapter}</p>
                    <p>{member.country}</p>
                  </div>

                  <button
                    type="button"
                    className="mt-6 w-full rounded-lg border border-blue-950 px-5 py-3 font-semibold text-blue-950 transition hover:bg-blue-950 hover:text-white"
                  >
                    View Profile
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

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
              Members will control which personal details are visible. Sensitive
              information such as email addresses and WhatsApp numbers should
              only appear when a member chooses to make them available.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-7 shadow-sm">
            <h3 className="text-xl font-bold text-blue-950">
              Directory access
            </h3>

            <p className="mt-4 leading-7 text-gray-600">
              The full KUPEXSA Member Directory will eventually be reserved for
              approved and logged-in members.
            </p>

            <Link
              href="/login"
              className="mt-6 inline-flex rounded-lg bg-blue-950 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              Member Login
            </Link>
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
            Become part of the KUPEXSA global community
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100">
            Create your account, complete your member profile and reconnect with
            Kupexsans from your generation and beyond.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
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
          </div>
        </div>
      </section>
    </main>
  );
}