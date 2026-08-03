import Link from "next/link";

import HeritageImage from "@/components/ui/HeritageImage";

const values = [
  {
    letter: "C",
    title: "Compassion",
    description:
      "We respond with empathy and kindness to the needs of vulnerable students.",
  },
  {
    letter: "A",
    title: "Affection",
    description:
      "We serve with genuine love, care and concern for every beneficiary.",
  },
  {
    letter: "R",
    title: "Reassurance",
    description:
      "We restore confidence by assuring vulnerable students and their families that they are not alone and that their educational aspirations matter.",
  },
  {
    letter: "E",
    title: "Empowerment",
    description:
      "We provide support and opportunities that enable students to become confident, independent and responsible citizens.",
  },
];

const beneficiaries = [
  "Vulnerable children of Kupexsans.",
  "Relatives of Kupexsans experiencing financial hardship.",
  "Successful candidates who pass the PHS admission process but cannot afford tuition and boarding.",
  "Other deserving children in need of financial assistance, as approved by the Committee.",
];

export default function KCarePage() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-blue-950 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-yellow-400 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-blue-400 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <Link
              href="/projects"
              className="text-sm font-semibold text-blue-200 transition hover:text-yellow-300"
            >
              ← Back to Projects
            </Link>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
              KUPEXSA Compassionate Arm
            </p>

            <h1 className="mt-5 text-5xl font-black leading-tight sm:text-6xl">
              K-Care
            </h1>

            <p className="mt-4 text-2xl font-bold text-yellow-300">
              From vulnerability to empowerment
            </p>

            <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">
              K-Care is KUPEXSA&apos;s social-impact and educational-support
              initiative, created to ensure that deserving students are not
              denied quality education because of financial hardship.
            </p>

            <a
              href="#sponsorship"
              className="mt-8 inline-flex rounded-xl bg-yellow-500 px-7 py-3.5 font-bold text-blue-950 transition hover:bg-yellow-400"
            >
              View Sponsorship Options
            </a>
          </div>

          <HeritageImage
            src="/images/projects/k-care-hero.png"
            alt="KUPEXSA members supporting students through K-Care"
            label="K-Care Hero Photograph"
            className="aspect-[4/3] rounded-3xl border border-white/15 shadow-2xl"
            priority
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <HeritageImage
            src="/images/projects/k-care-introduction.png"
            alt="KUPEXSA members and students participating in an educational support activity"
            label="K-Care Introduction Photograph"
            className="aspect-[4/3] rounded-3xl shadow-xl"
          />

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
              Introduction
            </p>

            <h2 className="mt-4 text-3xl font-bold text-blue-950 sm:text-4xl">
              Compassion in action
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              The KUPEXSA Compassionate Arm is the social-impact and educational
              support initiative of the Kumba Presbyterian Ex-Students
              Association. It reflects a shared commitment to ensure that no
              deserving child loses access to quality education because of
              financial hardship.
            </p>

            <p className="mt-5 leading-8 text-gray-600">
              Through K-Care, Kupexsans identify, sponsor and support bright but
              vulnerable students, giving them the opportunity to pursue their
              education with dignity and hope. By investing in the next
              generation, KUPEXSA preserves its heritage of service while
              strengthening families and communities.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-20 lg:grid-cols-2">
          <article className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
              Our Mission
            </p>

            <h2 className="mt-4 text-3xl font-bold text-blue-950">
              Mobilising KUPEXSA&apos;s collective strength
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              To mobilise the compassion, generosity and collective strength of
              Kupexsans to identify, sponsor and support academically promising
              but financially disadvantaged students, enabling them to access
              quality education and realise their full potential.
            </p>
          </article>

          <article className="rounded-3xl border border-yellow-200 bg-blue-950 p-8 text-white shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-400">
              Our Vision
            </p>

            <h2 className="mt-4 text-3xl font-bold">
              Education, empowerment and independence
            </h2>

            <p className="mt-5 leading-8 text-blue-100">
              A future where every deserving student, regardless of financial
              circumstances, has access to quality education and the
              opportunity to progress from vulnerability to empowerment and
              independence.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
            Our Core Values
          </p>

          <h2 className="mt-4 text-4xl font-bold text-blue-950">
            CARE
          </h2>

          <p className="mt-5 leading-7 text-gray-600">
            These values guide how K-Care serves, supports and empowers
            vulnerable students through education.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {values.map((value) => (
            <article
              key={value.letter}
              className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-950 text-2xl font-black text-yellow-400">
                {value.letter}
              </div>

              <h3 className="mt-5 text-xl font-bold text-blue-950">
                {value.title}
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-blue-950 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-400">
              How We Make a Difference
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              Identifying deserving students for Form One
            </h2>

            <p className="mt-6 leading-8 text-blue-100">
              K-Care identifies deserving students for admission into Form One
              at Presbyterian High School, Kumba.
            </p>

            <ul className="mt-8 space-y-4">
              {beneficiaries.map((beneficiary) => (
                <li key={beneficiary} className="flex gap-3 text-blue-100">
                  <span className="mt-1 text-yellow-400">●</span>
                  <span>{beneficiary}</span>
                </li>
              ))}
            </ul>
          </div>

          <HeritageImage
            src="/images/projects/k-care-beneficiaries.png"
            alt="K-Care beneficiary receiving educational support"
            label="K-Care Beneficiary Photograph"
            className="aspect-[4/3] rounded-3xl border border-white/15 shadow-2xl"
          />
        </div>
      </section>

      <section id="sponsorship" className="scroll-mt-24 mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
            Sponsorship Opportunities
          </p>

          <h2 className="mt-4 text-4xl font-bold text-blue-950">
            Every contribution can change a life
          </h2>

          <p className="mt-5 leading-7 text-gray-600">
            Sponsors may adopt a child by covering the full amount or
            contribute towards a portion of a student&apos;s educational costs.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <article className="rounded-3xl border-2 border-blue-950 bg-white p-8 shadow-sm">
            <span className="rounded-full bg-blue-950 px-4 py-2 text-sm font-bold text-yellow-400">
              Full Scholarship
            </span>

            <h3 className="mt-6 text-3xl font-bold text-blue-950">
              500,000 FCFA
            </h3>

            <p className="mt-2 text-gray-500">
              Per student, per academic year
            </p>

            <div className="mt-7 space-y-4">
              <div className="flex justify-between gap-6 border-b border-gray-200 pb-4">
                <span className="font-semibold text-gray-700">
                  Tuition and board
                </span>
                <span className="font-bold text-blue-950">350,000 FCFA</span>
              </div>

              <div className="flex justify-between gap-6">
                <span className="font-semibold text-gray-700">
                  Books and uniforms
                </span>
                <span className="font-bold text-blue-950">150,000 FCFA</span>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border-2 border-yellow-400 bg-yellow-50 p-8 shadow-sm">
            <span className="rounded-full bg-yellow-500 px-4 py-2 text-sm font-bold text-blue-950">
              Partial Scholarship
            </span>

            <h3 className="mt-6 text-3xl font-bold text-blue-950">
              350,000 FCFA
            </h3>

            <p className="mt-2 text-gray-600">
              Tuition and board only
            </p>

            <p className="mt-7 leading-8 text-gray-600">
              Under this option, parents or guardians provide books, uniforms
              and other school requirements.
            </p>
          </article>
        </div>

        <div className="mt-8 rounded-3xl bg-gray-50 p-8">
          <h3 className="text-2xl font-bold text-blue-950">
            Parents&apos; and guardians&apos; contribution
          </h3>

          <p className="mt-4 leading-8 text-gray-600">
            Parents or guardians remain responsible for school prospectuses,
            personal effects, toiletries and any other items not covered by the
            scholarship.
          </p>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <HeritageImage
            src="/images/projects/k-care-management.png"
            alt="K-Care management team overseeing the programme"
            label="K-Care Management Photograph"
            className="aspect-[4/3] rounded-3xl shadow-xl"
          />

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
              Management
            </p>

            <h2 className="mt-4 text-4xl font-bold text-blue-950">
              Leadership, transparency and accountability
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              K-Care is led by a dedicated seven-member Management Team
              comprising the KUPEXSA President and six appointed members. The
              team oversees implementation and ensures that every contribution
              is managed with integrity, transparency and compassion.
            </p>

            <div className="mt-8 space-y-5">
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h3 className="font-bold text-blue-950">
                  Dedicated K-Care bank account
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  All K-Care funds are managed through a separate account used
                  exclusively for programme operations.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h3 className="font-bold text-blue-950">
                  Regular accountability reports
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  The Management Team provides regular reporting on admissions,
                  beneficiary progress and financial stewardship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl rounded-3xl bg-blue-950 px-6 py-14 text-center text-white sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
            Join K-Care
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold sm:text-4xl">
            Together, we educate. Together, we empower.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100">
            Kupexsans and partners can support K-Care as sponsors, volunteers,
            mentors or institutional partners. Official contribution and
            contact details will be published through KUPEXSA channels.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-yellow-500 px-7 py-3 font-semibold text-blue-950 transition hover:bg-yellow-400"
            >
              Join KUPEXSA Connect
            </Link>

            <Link
              href="/projects"
              className="rounded-xl border border-white/60 px-7 py-3 font-semibold text-white transition hover:bg-white hover:text-blue-950"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}