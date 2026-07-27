import Link from "next/link";

import HeritageImage from "@/components/ui/HeritageImage";
import {
  FOUNDATION_YEAR,
  SCHOOL_MOTTO,
} from "@/lib/constants";

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-blue-950 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-yellow-400 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-blue-400 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
              Our Heritage
            </p>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              One School.
              <br />
              Many Generations.
              <br />
              One KUPEXSA.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">
              From Basel Mission College to Presbyterian Secondary School and
              Presbyterian High School, our shared identity continues through
              generations of Kupexsans around the world.
            </p>

            <p className="mt-6 font-semibold text-yellow-300">
              Kupexsan:- Proud to Belong
            </p>
          </div>

          <HeritageImage
            src="/images/about/about-hero.png"
            alt="Historical view of the school and generations of Kupexsans"
            label="About Page Hero Image"
            className="aspect-[4/3] rounded-3xl border border-white/15 shadow-2xl"
            priority
          />
        </div>
      </section>

      {/* School journey */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
            Since {FOUNDATION_YEAR}
          </p>

          <h2 className="mt-4 text-3xl font-bold text-blue-950 sm:text-4xl">
            Three Names. One Enduring Legacy.
          </h2>

          <p className="mt-5 leading-7 text-gray-600">
            The institution has evolved through three important identities,
            while preserving the values, discipline and community that unite
            every generation of its former students.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <article className="overflow-hidden rounded-2xl border border-blue-100 bg-blue-50">
            <HeritageImage
              src="/images/about/about-bmc.png"
              alt="Historical photograph representing Basel Mission College"
              label="Basel Mission College Photograph"
              className="aspect-[4/3]"
            />

            <div className="p-7">
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
                First Era
              </p>

              <h3 className="mt-3 text-2xl font-bold text-blue-950">
                Basel Mission College
              </h3>

              <p className="mt-1 font-semibold text-blue-700">
                BMC
              </p>

              <p className="mt-4 leading-7 text-gray-600">
                The beginning of a tradition that would shape generations
                through learning, character and service.
              </p>
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
            <HeritageImage
              src="/images/about/about-pss.png"
              alt="Historical photograph representing Presbyterian Secondary School"
              label="Presbyterian Secondary School Photograph"
              className="aspect-[4/3]"
            />

            <div className="p-7">
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
                Second Era
              </p>

              <h3 className="mt-3 text-2xl font-bold text-blue-950">
                Presbyterian Secondary School
              </h3>

              <p className="mt-1 font-semibold text-blue-700">
                PSS
              </p>

              <p className="mt-4 leading-7 text-gray-600">
                A continuing chapter in the growth of the institution and its
                commitment to education and responsible citizenship.
              </p>
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl border border-yellow-300 bg-blue-950 text-white shadow-sm">
            <HeritageImage
              src="/images/about/about-phs.png"
              alt="Present-day photograph of Presbyterian High School Kumba"
              label="Presbyterian High School Photograph"
              className="aspect-[4/3]"
            />

            <div className="p-7">
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
                Present Era
              </p>

              <h3 className="mt-3 text-2xl font-bold">
                Presbyterian High School
              </h3>

              <p className="mt-1 font-semibold text-yellow-300">
                PHS, Kumba
              </p>

              <p className="mt-4 leading-7 text-blue-100">
                The name carried today by the institution whose legacy continues
                through its students and global alumni community.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Our story */}
      <section className="bg-gray-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <HeritageImage
            src="/images/about/about-school-history.png"
            alt="Archival photograph representing the history of the school"
            label="Historical School Photograph"
            className="aspect-[4/3] rounded-3xl shadow-xl"
          />

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
              Our Story
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight text-blue-950 sm:text-4xl">
              A heritage carried by every Kupexsan
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              The story of the school is more than a history of changing
              names. It is the story of students, educators, friendships,
              discipline and shared experiences that have continued across
              generations.
            </p>

            <p className="mt-5 leading-8 text-gray-600">
              KUPEXSA preserves this connection by bringing former students
              together, supporting meaningful relationships and protecting
              the history that shaped who we are.
            </p>

            <blockquote className="mt-8 border-l-4 border-yellow-500 pl-6">
              <p className="text-xl font-semibold italic text-blue-950">
                “{SCHOOL_MOTTO}”
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Service, Knowledge and Integrity
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Campus and legacy */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
            <HeritageImage
              src="/images/about/about-campus.png"
              alt="View of the Presbyterian High School Kumba campus"
              label="PHS Kumba Campus Photograph"
              className="aspect-[16/10]"
            />

            <div className="p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
                Our School
              </p>

              <h2 className="mt-3 text-2xl font-bold text-blue-950">
                A place that shaped generations
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                The school grounds represent years of learning, discipline,
                friendship and memories shared by generations of Kupexsans.
              </p>
            </div>
          </article>

          <article className="overflow-hidden rounded-3xl border border-blue-100 bg-blue-950 text-white shadow-sm">
            <HeritageImage
              src="/images/about/about-legacy.png"
              alt="Generations of Kupexsans representing the continuing school legacy"
              label="KUPEXSA Legacy Photograph"
              className="aspect-[16/10]"
            />

            <div className="p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-400">
                Our Legacy
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                A connection that continues beyond graduation
              </h2>

              <p className="mt-4 leading-7 text-blue-100">
                KUPEXSA keeps generations connected through shared identity,
                service, friendship and commitment to the future of the school.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
              The Spirit of PHS
            </p>

            <h2 className="mt-4 text-3xl font-bold text-blue-950 sm:text-4xl">
              Values that continue beyond the school gates
            </h2>

            <div className="mt-10 space-y-7">
              <div className="flex gap-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-950 font-bold text-yellow-400">
                  S
                </span>

                <div>
                  <h3 className="text-xl font-bold text-blue-950">
                    Servizium
                  </h3>

                  <p className="mt-1 leading-7 text-gray-600">
                    Serving our communities with responsibility and purpose.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-950 font-bold text-yellow-400">
                  S
                </span>

                <div>
                  <h3 className="text-xl font-bold text-blue-950">
                    Scientia
                  </h3>

                  <p className="mt-1 leading-7 text-gray-600">
                    Pursuing knowledge, excellence and lifelong learning.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-950 font-bold text-yellow-400">
                  I
                </span>

                <div>
                  <h3 className="text-xl font-bold text-blue-950">
                    Integritas
                  </h3>

                  <p className="mt-1 leading-7 text-gray-600">
                    Living with honesty, dignity and strength of character.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <HeritageImage
            src="/images/about/about-motto.png"
            alt="Students and alumni representing service, knowledge and integrity"
            label="School Motto Photograph"
            className="aspect-[4/3] rounded-3xl shadow-xl"
          />
        </div>
      </section>

      {/* Global community */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <HeritageImage
            src="/images/about/about-community.png"
            alt="A gathering of Kupexsans representing different generations"
            label="Kupexsans Community Photograph"
            className="aspect-[4/3] rounded-3xl shadow-xl"
          />

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
              Our Community
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight text-blue-950 sm:text-4xl">
              Kupexsans connected across generations and borders
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              KUPEXSA brings together former students from different years,
              professions, chapters and locations around the world.
            </p>

            <p className="mt-5 leading-8 text-gray-600">
              Through KUPEXSA Connect, members can strengthen relationships,
              preserve shared memories and contribute to the growth of the
              alumni community.
            </p>
          </div>
        </div>
      </section>

      {/* Alumni connection */}
      <section className="bg-blue-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
              Alumni Connection
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight text-blue-950 sm:text-4xl">
              Building meaningful relationships within KUPEXSA
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              KUPEXSA Connect creates a central place for former students to
              find one another, reconnect and remain involved in alumni
              activities.
            </p>

            <p className="mt-5 leading-8 text-gray-600">
              It strengthens the bond between generations while creating new
              opportunities for collaboration, mentorship and service.
            </p>
          </div>

          <HeritageImage
            src="/images/about/about-alumni.png"
            alt="Kupexsans networking and building professional connections"
            label="Alumni Networking Photograph"
            className="aspect-[4/3] rounded-3xl shadow-xl"
          />
        </div>
      </section>

      {/* Closing */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-blue-950 text-white">
          <div className="grid items-center lg:grid-cols-2">
            <HeritageImage
              src="/images/about/about-closing.png"
              alt="Kupexsans celebrating their shared heritage and community"
              label="KUPEXSA Closing Photograph"
              className="min-h-[320px] lg:h-full"
            />

            <div className="px-6 py-14 text-center sm:px-12 lg:text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
                KUPEXSA Connect
              </p>

              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                Different generations. One community. Proud to belong.
              </h2>

              <p className="mt-5 leading-7 text-blue-100">
                Connect with fellow Kupexsans, preserve our shared history and
                participate in the future of our alumni community.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
                <Link
                  href="/register"
                  className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-blue-950 transition hover:bg-yellow-400"
                >
                  Join KUPEXSA Connect
                </Link>

                <Link
                  href="/login"
                  className="rounded-lg border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-blue-950"
                >
                  Member Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}