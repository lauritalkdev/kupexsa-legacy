import Link from "next/link";

import HeritageImage from "@/components/ui/HeritageImage";

const upcomingEvents = [
  {
    category: "Flagship Event",
    title: "2027 Jubilee Celebration",
    date: "Date to be announced",
    location: "Kumba, Cameroon",
    description:
      "A landmark gathering bringing together generations of Kupexsans to celebrate our shared history, achievements and enduring school legacy.",
  },
  {
    category: "Association Meeting",
    title: "KUPEXSA Annual General Meeting",
    date: "Date to be announced",
    location: "Venue to be announced",
    description:
      "An official gathering for association updates, community discussions and decisions concerning the future of KUPEXSA.",
  },
  {
    category: "Chapter Event",
    title: "KUPEXSA Chapter Reunion",
    date: "Date to be announced",
    location: "Chapter venue",
    description:
      "A chance for members within local and international chapters to reconnect, strengthen relationships and celebrate together.",
  },
];

export default function EventsPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-blue-950 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-yellow-400 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-blue-400 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
              KUPEXSA Events
            </p>

            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
              Bringing Kupexsans Together
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">
              From reunions and official meetings to jubilee celebrations and
              community projects, every event strengthens the connection
              between generations of Kupexsans.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#upcoming-events"
                className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-blue-950 transition hover:bg-yellow-400"
              >
                View Upcoming Events
              </a>

              <a
                href="#event-moments"
                className="rounded-lg border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-blue-950"
              >
                Event Moments
              </a>
            </div>
          </div>

          <HeritageImage
            src="/images/events/events-hero.png"
            alt="Kupexsans gathered during an official alumni event"
            label="KUPEXSA Events Hero Photograph"
            className="aspect-[4/3] rounded-3xl border border-white/15 shadow-2xl"
            priority
          />
        </div>
      </section>

      {/* Featured event */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
            Featured Event
          </p>

          <h2 className="mt-4 text-3xl font-bold text-blue-950 sm:text-4xl">
            Looking Ahead to 2027
          </h2>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-blue-100 bg-gray-50 shadow-sm">
          <div className="grid lg:grid-cols-2">
            <HeritageImage
              src="/images/events/jubilee-2027.png"
              alt="KUPEXSA 2027 Jubilee celebration"
              label="2027 Jubilee Event Photograph"
              className="min-h-[320px] lg:min-h-[440px]"
            />

            <div className="flex flex-col justify-center p-8 sm:p-12">
              <span className="w-fit rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800">
                2027 Jubilee Celebration
              </span>

              <h2 className="mt-6 text-3xl font-bold text-blue-950">
                Celebrating Our Heritage and Shared Identity
              </h2>

              <div className="mt-6 space-y-3 text-gray-600">
                <p>
                  <span className="font-semibold text-blue-950">Date:</span>{" "}
                  To be announced
                </p>

                <p>
                  <span className="font-semibold text-blue-950">Venue:</span>{" "}
                  Kumba, Cameroon
                </p>
              </div>

              <p className="mt-6 leading-8 text-gray-600">
                The 2027 Jubilee will bring together Kupexsans from different
                generations, chapters and countries for a memorable celebration
                of friendship, service, knowledge and integrity.
              </p>

              <div className="mt-8">
                <Link
                  href="/register"
                  className="inline-flex rounded-lg bg-blue-950 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
                >
                  Join KUPEXSA Connect
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section
        id="upcoming-events"
        className="scroll-mt-24 bg-gray-50 py-20"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
              Upcoming
            </p>

            <h2 className="mt-4 text-3xl font-bold text-blue-950 sm:text-4xl">
              Events to Look Forward To
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              Confirmed dates and additional event information will be
              published as they become available.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <article
                key={event.title}
                className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm"
              >
                <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
                  {event.category}
                </p>

                <h3 className="mt-4 text-2xl font-bold text-blue-950">
                  {event.title}
                </h3>

                <div className="mt-5 space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold text-blue-950">Date:</span>{" "}
                    {event.date}
                  </p>

                  <p>
                    <span className="font-semibold text-blue-950">
                      Location:
                    </span>{" "}
                    {event.location}
                  </p>
                </div>

                <p className="mt-5 leading-7 text-gray-600">
                  {event.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Event moments */}
      <section
        id="event-moments"
        className="scroll-mt-24 mx-auto max-w-7xl px-6 py-20"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
            Shared Moments
          </p>

          <h2 className="mt-4 text-3xl font-bold text-blue-950 sm:text-4xl">
            Memories That Keep Us Connected
          </h2>

          <p className="mt-5 leading-7 text-gray-600">
            A growing collection of reunions, meetings, celebrations and
            activities from the KUPEXSA community.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <HeritageImage
            src="/images/events/event-moment-1.png"
            alt="Kupexsans gathered during an alumni celebration"
            label="KUPEXSA Event Moment One"
            className="aspect-[16/10] rounded-2xl shadow-lg"
          />

          <HeritageImage
            src="/images/events/event-moment-2.png"
            alt="KUPEXSA members participating in an official gathering"
            label="KUPEXSA Event Moment Two"
            className="aspect-[16/10] rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* Event submission */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl rounded-3xl bg-blue-950 px-6 py-14 text-center text-white sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
            Chapter Activities
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold sm:text-4xl">
            Planning a KUPEXSA meeting or reunion?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100">
            Chapter events and official alumni activities can be submitted for
            publication so that Kupexsans everywhere can stay informed.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-blue-950 transition hover:bg-yellow-400"
            >
              Member Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-blue-950"
            >
              Join KUPEXSA Connect
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}