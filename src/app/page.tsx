import Link from "next/link";

import {
  SCHOOL_NAME,
  SCHOOL_MOTTO,
  KUPEXSA_SLOGAN,
  FOUNDATION_YEAR,
} from "@/lib/constants";

export default function Home() {
  return (
    <div>
      <section className="bg-blue-950 text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center">
          <h1 className="text-5xl font-bold">
            Connecting Kupexsans Worldwide
          </h1>

          <div className="mt-6 space-y-2 text-blue-100">
  <p className="text-xl font-semibold">
    Basel Mission College (BMC)
  </p>

  <p className="text-lg">
    ↓
  </p>

  <p className="text-xl font-semibold">
    Presbyterian Secondary School (PSS)
  </p>

  <p className="text-lg">
    ↓
  </p>

  <p className="text-2xl font-bold text-white">
    Presbyterian High School (PHS), Kumba
  </p>
</div>

          <p className="mt-4 text-lg text-yellow-400">
  {SCHOOL_MOTTO}
</p>

<p className="mt-6 inline-flex rounded-full border border-yellow-400/40 bg-yellow-400/10 px-5 py-2 text-sm font-semibold tracking-wide text-yellow-300">
  {KUPEXSA_SLOGAN}
</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-blue-950 transition hover:bg-yellow-400"
            >
              Join KUPEXSA Connect
            </Link>

            <Link
              href="/login"
              className="rounded-lg border border-white px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-blue-950"
            >
              Member Login
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-bold text-blue-950">
          Our Legacy
        </h2>

        <p className="mt-4 max-w-3xl text-gray-600">
          Established in {FOUNDATION_YEAR}, Presbyterian High School Kumba has
          produced generations of Kupexsans united by service, knowledge and
          integrity.
        </p>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-3xl font-bold text-blue-900">
              1963
            </h3>

            <p>Years of Excellence</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-3xl font-bold text-blue-900">
              Global
            </h3>

            <p>Kupexsans Worldwide</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-3xl font-bold text-blue-900">
              Proud
            </h3>

            <p>To Belong</p>
          </div>
        </div>
      </section>
    </div>
  );
}