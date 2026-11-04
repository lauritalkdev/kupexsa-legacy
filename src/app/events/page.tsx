
import Link from "next/link";
import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Visit = {
  slug: string;
  title: string;
  location: string;
  description: string;
  highlight?: string;
};

const visits: Visit[] = [
  {
    slug: "tombel",
    title: "Visit to Tombel Chapter",
    location: "Tombel",
    description:
      "A photographic record of the Global EXCO delegation's engagement with the Tombel Chapter, reflecting the unity and shared heritage of Kupexsans.",
  },
  {
    slug: "buea",
    title: "Visit to Buea Chapter",
    location: "Buea",
    description:
      "Moments from the Global EXCO's visit to the Buea Chapter, preserving memories of alumni fellowship and association engagement.",
  },
  {
    slug: "tiko",
    title: "Visit to Tiko Chapter",
    location: "Tiko",
    description:
      "The Global EXCO's engagement with the Tiko Chapter forms part of its continuing visits to chapters and classes. Photographs will be added when available.",
  },
  {
    slug: "bamenda",
    title: "Visit to Bamenda Chapter",
    location: "Bamenda",
    description:
      "A visual record of the Global EXCO's visit to the Bamenda Chapter, documenting the connections that unite members across communities.",
  },
  {
    slug: "yaounde",
    title: "Visit to Yaounde Chapter",
    location: "Yaounde",
    description:
      "Highlights from the Global EXCO's visit to the Yaounde Chapter, celebrating alumni fellowship and the association's shared identity.",
  },
  {
    slug: "class-74",
    title: "Visit to Class of 1974",
    location: "Class of 1974",
    description:
      "A special milestone in KUPEXSA's history. The Class of 1974 became the first class to invite the Global Executive Committee to its meeting.",
    highlight: "First Class to Invite the Global EXCO",
  },
];

const PHOTO_ROOT = path.join(
  process.cwd(),
  "src",
  "event-photos"
);

async function getVisitPhotos(slug: string) {
  try {
    const files = await fs.readdir(
      path.join(PHOTO_ROOT, slug)
    );

    const pattern = new RegExp(
      `^${slug}-([1-9][0-9]*)\\.png$`
    );

    return files
      .filter((file) => pattern.test(file))
      .sort((a, b) => {
        const aNumber = Number(
          a.match(/-(\d+)\.png$/)?.[1] ?? 0
        );
        const bNumber = Number(
          b.match(/-(\d+)\.png$/)?.[1] ?? 0
        );

        return aNumber - bNumber;
      });
  } catch {
    return [];
  }
}

function EventPhoto({
  folder,
  filename,
  alt,
  caption,
}: {
  folder: string;
  filename: string;
  alt: string;
  caption: string;
}) {
  const src = `/events/photo/${folder}/${filename}`;

  return (
    <figure className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        title="View photograph"
        className="block bg-gray-100"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="max-h-[650px] w-full object-contain"
        />
      </a>

      <figcaption className="px-5 py-4 text-sm leading-6 text-gray-600">
        {caption}
      </figcaption>
    </figure>
  );
}

function MemberAccessNotice() {
  return (
    <div
      id="member-access"
      className="scroll-mt-24 rounded-3xl border border-blue-100 bg-blue-50 px-6 py-12 text-center"
    >
      <div className="text-4xl">🔒</div>

      <h3 className="mt-4 text-2xl font-bold text-blue-950">
        Discover More as a KUPEXSA Member
      </h3>

      <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
        Our event photographs and documentary collections
        are reserved for logged-in KUPEXSA members.
        Sign in or create your account to explore these
        memorable activities.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/login"
          className="rounded-xl bg-blue-950 px-7 py-3 font-bold text-white hover:bg-blue-800"
        >
          Log In
        </Link>

        <Link
          href="/register"
          className="rounded-xl bg-yellow-500 px-7 py-3 font-bold text-blue-950 hover:bg-yellow-400"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}

function FundraisingGala({
  authenticated,
}: {
  authenticated: boolean;
}) {
  return (
    <article className="mt-10 overflow-hidden rounded-3xl border border-yellow-200 bg-white shadow-lg">
      <div className="bg-blue-950 px-7 py-9 text-white sm:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-400">
          Featured Upcoming Event
        </p>

        <h3 className="mt-4 text-3xl font-bold sm:text-4xl">
          KUPEXSA UK Fundraising Gala
        </h3>

        <p className="mt-4 text-xl font-semibold text-yellow-300">
          Standing Together for PHS Kumba
        </p>

        <div className="mt-6 space-y-2 text-blue-100">
          <p>
            <strong className="text-white">Date:</strong>{" "}
            Saturday, 7 November 2026
          </p>

          <p>
            <strong className="text-white">Venue:</strong>{" "}
            White Diamond, 141–143 Foleshill Road,
            Coventry, CV1 4LF, United Kingdom
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-yellow-700">
            Ahead of the Gala
          </p>

          <h4 className="mt-3 text-2xl font-bold text-blue-950">
            Global President Mme Ekiti in the UK
          </h4>

          <p className="mt-5 leading-8 text-gray-700">
            KUPEXSA Global President Mme Ekiti is already
            in the United Kingdom ahead of the forthcoming
            fundraising gala. Her presence marks an important
            moment as Kupexsans prepare to come together
            under the theme, Standing Together for PHS Kumba.
          </p>

          <p className="mt-4 leading-8 text-gray-600">
            This featured collection captures moments
            surrounding her presence in the UK alongside
            the official announcement of the fundraising gala.
          </p>
        </div>

        {authenticated ? (
          <div className="mt-9">
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((number) => (
                <EventPhoto
                  key={number}
                  folder="fundraising-gala"
                  filename={`gala-${number}.png`}
                  alt={`Mme Ekiti in the UK, photograph ${number}`}
                  caption={`Global President Mme Ekiti in the UK — Photograph ${number}`}
                />
              ))}
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <div className="mb-6">
                <p className="text-sm font-bold uppercase tracking-widest text-yellow-700">
                  Official Event Announcement
                </p>

                <h4 className="mt-3 text-2xl font-bold text-blue-950">
                  The Fundraising Gala Flyer
                </h4>
              </div>

              <div className="mx-auto max-w-4xl">
                <EventPhoto
                  folder="fundraising-gala"
                  filename="gala-flyer.png"
                  alt="Official KUPEXSA UK Fundraising Gala flyer"
                  caption="Official KUPEXSA UK Fundraising Gala announcement — 7 November 2026, Coventry."
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl bg-blue-50 p-6 text-center">
            <p className="font-semibold text-blue-950">
              Four event images available to KUPEXSA members
            </p>

            <p className="mt-2 text-sm text-gray-600">
              Log in to view Mme Ekiti&apos;s photographs
              and the official fundraising gala flyer.
            </p>

            <Link
              href="/login"
              className="mt-5 inline-block rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white"
            >
              Log In to View
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}

function VisitDocumentary({
  visit,
  photos,
  index,
}: {
  visit: Visit;
  photos: string[];
  index: number;
}) {
  return (
    <article
      id={`visit-${visit.slug}`}
      className="scroll-mt-24 border-b border-gray-200 py-14 last:border-b-0"
    >
      <p className="text-sm font-bold uppercase tracking-widest text-yellow-700">
        Global EXCO Documentary {String(index + 1).padStart(2, "0")}
      </p>

      <h3 className="mt-3 text-3xl font-bold text-blue-950">
        {visit.title}
      </h3>

      <p className="mt-3 font-medium text-gray-500">
        {visit.location}
      </p>

      {visit.highlight && (
        <p className="mt-4 inline-block rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-800">
          {visit.highlight}
        </p>
      )}

      <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-700">
        {visit.description}
      </p>

      {photos.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-8 text-center">
          <p className="font-semibold text-blue-950">
            Photographs coming soon
          </p>
        </div>
      ) : (
        <div className="mt-9 space-y-9">
          <EventPhoto
            folder={visit.slug}
            filename={photos[0]}
            alt={`${visit.title}, opening photograph`}
            caption={`${visit.title} — Opening photograph`}
          />

          {photos.length > 1 && (
            <>
              <div className="max-w-3xl border-l-4 border-yellow-500 py-2 pl-6">
                <h4 className="text-xl font-bold text-blue-950">
                  Moments from the Gathering
                </h4>

                <p className="mt-3 leading-7 text-gray-600">
                  These additional photographs continue
                  the visual story of the Global EXCO visit,
                  preserving moments from the gathering.
                </p>
              </div>

              <div className="grid gap-7 md:grid-cols-2">
                {photos.slice(1).map((filename, index) => (
                  <EventPhoto
                    key={filename}
                    folder={visit.slug}
                    filename={filename}
                    alt={`${visit.title}, photograph ${index + 2}`}
                    caption={`${visit.title} — Photograph ${index + 2} of ${photos.length}`}
                  />
                ))}
              </div>
            </>
          )}

          <p className="border-t border-gray-100 pt-5 text-sm italic text-gray-500">
            KUPEXSA Global EXCO Visit Archive — {visit.location}
          </p>
        </div>
      )}
    </article>
  );
}

export default async function EventsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const authenticated = Boolean(user);

  const documentaries = authenticated
    ? await Promise.all(
        visits.map(async (visit) => ({
          visit,
          photos: await getVisitPhotos(visit.slug),
        }))
      )
    : [];

  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-blue-950 text-white">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
            KUPEXSA Events & Activities
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
            Our Gatherings. Our Memories. Our Heritage.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Discover chapter visits, class gatherings,
            fundraising activities and celebrations that
            strengthen the connections between generations
            of Kupexsans.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#upcoming-events"
              className="rounded-xl bg-yellow-500 px-6 py-3 font-bold text-blue-950 hover:bg-yellow-400"
            >
              Upcoming Events
            </a>

            <a
              href="#global-exco-visits"
              className="rounded-xl border border-white/60 px-6 py-3 font-semibold text-white hover:bg-white hover:text-blue-950"
            >
              Explore EXCO Visits
            </a>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section
        id="upcoming-events"
        className="scroll-mt-24 bg-gray-50 py-16"
      >
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-yellow-700">
            Upcoming KUPEXSA Events
          </p>

          <h2 className="mt-3 text-3xl font-bold text-blue-950 sm:text-4xl">
            Events to Look Forward To
          </h2>

          <FundraisingGala authenticated={authenticated} />

          <article className="mt-8 rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-700">
              Flagship Celebration
            </p>

            <h3 className="mt-4 text-2xl font-bold text-blue-950">
              2027 Jubilee Celebration
            </h3>

            <p className="mt-3 font-semibold text-gray-600">
              Date to be announced — Kumba, Cameroon
            </p>

            <p className="mt-5 max-w-3xl leading-8 text-gray-600">
              A landmark celebration bringing together
              generations of Kupexsans to honour our
              shared history, friendships and enduring
              school legacy.
            </p>
          </article>
        </div>
      </section>

      {/* EXCO VISITS */}
      <section
        id="global-exco-visits"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16"
      >
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-widest text-yellow-700">
            KUPEXSA Historical Records
          </p>

          <h2 className="mt-4 text-3xl font-bold text-blue-950 sm:text-4xl">
            Global EXCO Chapter & Class Visits
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            The KUPEXSA Global Executive Committee has
            been visiting chapters and classes during
            their meetings. These documented activities
            form part of our association&apos;s evolving history.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visits.map((visit) => (
            <a
              key={visit.slug}
              href={
                authenticated
                  ? `#visit-${visit.slug}`
                  : "#member-access"
              }
              className="rounded-2xl border border-gray-200 bg-gray-50 p-6 transition hover:border-yellow-400 hover:shadow-md"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-yellow-700">
                Global EXCO Visit
              </p>

              <h3 className="mt-3 text-xl font-bold text-blue-950">
                {visit.title}
              </h3>

              {visit.highlight && (
                <p className="mt-3 text-sm font-semibold text-yellow-800">
                  {visit.highlight}
                </p>
              )}

              <p className="mt-4 text-sm text-gray-500">
                {authenticated
                  ? "Explore documentary"
                  : "Members-only documentary"}
              </p>
            </a>
          ))}
        </div>

        {authenticated ? (
          <div className="mt-10">
            <div className="rounded-2xl bg-blue-50 p-6">
              <p className="font-semibold text-blue-950">
                Welcome to the KUPEXSA Event Archive
              </p>

              <p className="mt-2 leading-7 text-gray-600">
                Explore the photographic documentaries
                below. Select a photograph to open
                a larger version.
              </p>
            </div>

            {documentaries.map(({ visit, photos }, index) => (
              <VisitDocumentary
                key={visit.slug}
                visit={visit}
                photos={photos}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <MemberAccessNotice />
          </div>
        )}
      </section>

      {/* FOOTER */}
      <section className="bg-blue-950 px-6 py-14 text-center text-white">
        <h2 className="text-3xl font-bold">
          KUPEXSA — Proud to Belong
        </h2>

        <p className="mx-auto mt-4 max-w-2xl leading-7 text-blue-100">
          Every gathering adds another chapter to our story.
          Together, we preserve the memories that connect us.
        </p>

        <Link
          href={authenticated ? "/dashboard" : "/register"}
          className="mt-8 inline-block rounded-xl bg-yellow-500 px-7 py-3 font-bold text-blue-950 hover:bg-yellow-400"
        >
          {authenticated
            ? "Return to Dashboard"
            : "Join KUPEXSA Connect"}
        </Link>
      </section>
    </main>
  );
}
