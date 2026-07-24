import Link from "next/link";

import {
  SCHOOL_NAME,
  SCHOOL_MOTTO,
  KUPEXSA_SLOGAN,
  FOUNDATION_YEAR,
} from "@/lib/constants";

const heritageEras = [
  {
    year: "1963",
    abbreviation: "BMC",
    name: "Basel Mission College",
    description:
      "The institution opened in Fiango, Kumba, beginning a proud tradition of learning, discipline and Christian education.",
  },
  {
    year: "The Transition",
    abbreviation: "PSS",
    name: "Presbyterian Secondary School",
    description:
      "A new chapter strengthened the Presbyterian identity and continued the school's commitment to academic and moral excellence.",
  },
  {
    year: "Our Heritage Today",
    abbreviation: "PHS",
    name: "Presbyterian High School, Kumba",
    description:
      "Now located along Mbonge Road, PHS Kumba continues to shape generations through service, knowledge and integrity.",
  },
];

const memberBenefits = [
  {
    number: "01",
    title: "Reconnect with Classmates",
    description:
      "Find old classmates, schoolmates and Kupexsans from different generations around the world.",
  },
  {
    number: "02",
    title: "Join Your Chapter",
    description:
      "Connect with KUPEXSA chapters in Cameroon and across the international alumni community.",
  },
  {
    number: "03",
    title: "Attend Alumni Events",
    description:
      "Stay informed about reunions, chapter meetings, celebrations and the upcoming jubilee.",
  },
  {
    number: "04",
    title: "Build Meaningful Networks",
    description:
      "Discover Kupexsans working across professions, businesses, organisations and communities.",
  },
  {
    number: "05",
    title: "Preserve Our Heritage",
    description:
      "Help document the people, memories, traditions and achievements that define PHS Kumba.",
  },
  {
    number: "06",
    title: "Support the Community",
    description:
      "Participate in initiatives that strengthen the school, its students and the wider KUPEXSA family.",
  },
];

const highlights = [
  {
    label: "Our History",
    title: "From Fiango to Mbonge Road",
    description:
      "Explore the journey from Basel Mission College through Presbyterian Secondary School to Presbyterian High School, Kumba.",
    href: "/about",
    linkText: "Discover our history",
  },
  {
    label: "Our Community",
    title: "Kupexsans Across Generations",
    description:
      "Meet alumni from different classes, professions, chapters and countries through the KUPEXSA member directory.",
    href: "/directory",
    linkText: "Explore the directory",
  },
  {
    label: "Our Gatherings",
    title: "Celebrating Together",
    description:
      "Follow upcoming reunions, chapter activities, annual meetings and the historic 2027 jubilee celebration.",
    href: "/events",
    linkText: "View upcoming events",
  },
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-white">
      {/* Hero */}
      <section className="relative isolate bg-blue-950 text-white">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.22),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(30,64,175,0.55),transparent_38%)]" />

        <div className="absolute inset-0 -z-10 opacity-[0.08]">
          <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-yellow-400/30 bg-white/5 px-4 py-2 text-sm font-semibold text-yellow-300 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              Founded in {FOUNDATION_YEAR}
            </div>

            <p className="mt-8 text-sm font-bold uppercase tracking-[0.28em] text-blue-200">
              The digital home of Kupexsans
            </p>

            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              One School.
              <span className="block text-yellow-400">Many Generations.</span>
              One KUPEXSA.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-blue-100 sm:text-xl">
              Connecting former students of {SCHOOL_NAME} across classes,
              chapters, professions and countries while preserving the legacy
              that continues to unite us.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-yellow-500 px-7 py-3.5 font-bold text-blue-950 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-yellow-400"
              >
                Join KUPEXSA Connect
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/5 px-7 py-3.5 font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-blue-950"
              >
                Member Login
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/15 pt-7 text-sm text-blue-100">
              <div>
                <p className="font-bold text-white">Servizium</p>
                <p>Service</p>
              </div>

              <div>
                <p className="font-bold text-white">Scientia</p>
                <p>Knowledge</p>
              </div>

              <div>
                <p className="font-bold text-white">Integritas</p>
                <p>Integrity</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full border border-yellow-400/30" />
            <div className="absolute -bottom-8 -right-8 h-44 w-44 rounded-full bg-yellow-400/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="rounded-[1.5rem] border border-yellow-400/20 bg-blue-900/80 p-7 sm:p-9">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-300">
                  Our Heritage
                </p>

                <div className="mt-8 space-y-5">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-200">
                      Established as
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      Basel Mission College
                    </h2>
                    <p className="mt-1 font-semibold text-yellow-300">BMC</p>
                  </div>

                  <div className="flex justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-yellow-400/40 bg-yellow-400/10 text-yellow-300">
                      ↓
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-200">
                      Later became
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      Presbyterian Secondary School
                    </h2>
                    <p className="mt-1 font-semibold text-yellow-300">PSS</p>
                  </div>

                  <div className="flex justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-yellow-400/40 bg-yellow-400/10 text-yellow-300">
                      ↓
                    </div>
                  </div>

                  <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-yellow-300">
                      Known today as
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      Presbyterian High School
                    </h2>
                    <p className="mt-1 font-semibold text-white">PHS Kumba</p>
                  </div>
                </div>

                <div className="mt-7 rounded-2xl bg-white px-5 py-4 text-center text-blue-950">
                  <p className="text-sm font-black uppercase tracking-[0.18em]">
                    {KUPEXSA_SLOGAN}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div className="relative min-h-[470px] overflow-hidden rounded-[2rem] bg-blue-950 p-8 text-white shadow-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.25),transparent_35%)]" />

            <div className="relative flex h-full min-h-[406px] flex-col justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-300">
                  Since {FOUNDATION_YEAR}
                </p>

                <p className="mt-5 text-7xl font-black text-white/10 sm:text-8xl">
                  PHS
                </p>
              </div>

              <div>
                <p className="max-w-md text-3xl font-black leading-tight sm:text-4xl">
                  A proud legacy built through generations.
                </p>

                <p className="mt-5 max-w-md leading-7 text-blue-100">
                  From the early days in Fiango to the present campus along
                  Mbonge Road, the PHS story continues through every Kupexsan.
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-600">
              Our shared identity
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-blue-950 sm:text-5xl">
              More than an alumni association.
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              KUPEXSA brings together former students of Presbyterian High
              School, Kumba, creating a community where memories are preserved,
              friendships are renewed and new opportunities are built.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              KUPEXSA Connect gives that community a professional digital home,
              making it easier for Kupexsans to find one another, join chapters,
              attend events and contribute to the future of the school.
            </p>

            <div className="mt-8 border-l-4 border-yellow-500 pl-6">
              <p className="text-2xl font-black italic text-blue-950">
                “{SCHOOL_MOTTO}”
              </p>

              <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Service • Knowledge • Integrity
              </p>
            </div>

            <Link
              href="/about"
              className="mt-9 inline-flex items-center gap-2 font-bold text-blue-900 transition hover:text-yellow-600"
            >
              Read the complete KUPEXSA story
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Heritage Timeline */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-600">
              Our historical journey
            </p>

            <h2 className="mt-4 text-4xl font-black text-blue-950 sm:text-5xl">
              Three names. One enduring legacy.
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              The name evolved through the years, but the commitment to
              excellence, character and community remained unchanged.
            </p>
          </div>

          <div className="relative mt-16 grid gap-7 lg:grid-cols-3">
            <div className="absolute left-[16.66%] right-[16.66%] top-12 hidden h-px bg-yellow-500/50 lg:block" />

            {heritageEras.map((era, index) => (
              <article
                key={era.abbreviation}
                className="relative rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-8 border-gray-50 bg-blue-950 text-2xl font-black text-yellow-400">
                  {era.abbreviation}
                </div>

                <p className="mt-7 text-sm font-black uppercase tracking-widest text-yellow-600">
                  {era.year}
                </p>

                <h3 className="mt-3 text-2xl font-black text-blue-950">
                  {era.name}
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  {era.description}
                </p>

                <p className="mt-6 text-sm font-bold text-blue-900">
                  Chapter {String(index + 1).padStart(2, "0")}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Community Statement */}
      <section className="bg-blue-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-300">
              Kupexsan identity
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              Proud of where we came from.
              <span className="block text-yellow-400">
                Connected wherever we go.
              </span>
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <p className="text-4xl font-black text-yellow-400">
                {FOUNDATION_YEAR}
              </p>
              <p className="mt-2 font-semibold text-blue-100">
                Foundation of our legacy
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <p className="text-4xl font-black text-yellow-400">Global</p>
              <p className="mt-2 font-semibold text-blue-100">
                Alumni community
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <p className="text-4xl font-black text-yellow-400">One</p>
              <p className="mt-2 font-semibold text-blue-100">
                KUPEXSA family
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-600">
                Explore KUPEXSA Connect
              </p>

              <h2 className="mt-4 max-w-3xl text-4xl font-black text-blue-950 sm:text-5xl">
                Discover the people, history and moments that unite us.
              </h2>
            </div>

            <Link
              href="/register"
              className="font-bold text-blue-900 transition hover:text-yellow-600"
            >
              Become a registered member →
            </Link>
          </div>

          <div className="mt-14 grid gap-7 lg:grid-cols-3">
            {highlights.map((item, index) => (
              <article
                key={item.title}
                className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden bg-blue-950 p-7 text-white">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.28),transparent_36%)]" />

                  <div className="relative flex h-full flex-col justify-between">
                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-yellow-300">
                      {item.label}
                    </p>

                    <p className="text-8xl font-black text-white/10">
                      0{index + 1}
                    </p>
                  </div>
                </div>

                <div className="p-7">
                  <h3 className="text-2xl font-black text-blue-950">
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-7 text-gray-600">
                    {item.description}
                  </p>

                  <Link
                    href={item.href}
                    className="mt-7 inline-flex items-center gap-2 font-bold text-blue-900 transition group-hover:text-yellow-600"
                  >
                    {item.linkText}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-600">
              Why join the platform?
            </p>

            <h2 className="mt-4 text-4xl font-black text-blue-950 sm:text-5xl">
              Your connection to the KUPEXSA family.
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              KUPEXSA Connect is designed to bring alumni engagement,
              communication and heritage into one secure community platform.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {memberBenefits.map((benefit) => (
              <article
                key={benefit.number}
                className="rounded-3xl border border-gray-200 bg-white p-7 transition hover:border-yellow-400 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-950 text-sm font-black text-yellow-400">
                  {benefit.number}
                </div>

                <h3 className="mt-6 text-xl font-black text-blue-950">
                  {benefit.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Event */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-blue-950 text-white shadow-2xl">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-[360px] bg-blue-900 p-9">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.32),transparent_38%)]" />

                <div className="relative flex h-full flex-col justify-between">
                  <div className="inline-flex w-fit rounded-full border border-yellow-400/40 bg-yellow-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">
                    Featured Event
                  </div>

                  <div>
                    <p className="text-8xl font-black text-white/10">2027</p>
                    <p className="mt-2 text-lg font-bold text-yellow-300">
                      A historic gathering
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-9 sm:p-12">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-300">
                  KUPEXSA Jubilee Celebration
                </p>

                <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
                  Generations will come together again.
                </h2>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
                  The 2027 jubilee will celebrate the history, achievements and
                  enduring spirit of the PHS Kumba community. KUPEXSA Connect
                  will help members receive updates and remain connected as the
                  celebration approaches.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/events"
                    className="inline-flex items-center justify-center rounded-xl bg-yellow-500 px-6 py-3 font-bold text-blue-950 transition hover:bg-yellow-400"
                  >
                    View Event Information
                  </Link>

                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3 font-bold text-white transition hover:bg-white hover:text-blue-950"
                  >
                    Join the Community
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-yellow-500 px-7 py-16 text-center text-blue-950 sm:px-12">
            <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full border-[32px] border-blue-950/5" />
            <div className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full border-[38px] border-blue-950/5" />

            <div className="relative mx-auto max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.25em]">
                Kupexsan:- Proud to Belong
              </p>

              <h2 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
                Your school years may be behind you, but your KUPEXSA journey
                continues.
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-950/80">
                Register today and become part of a growing digital community
                connecting Kupexsans across generations and around the world.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-950 px-7 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-blue-900"
                >
                  Create Your Member Account
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-blue-950 px-7 py-3.5 font-bold text-blue-950 transition hover:bg-blue-950 hover:text-white"
                >
                  Learn More About KUPEXSA
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}