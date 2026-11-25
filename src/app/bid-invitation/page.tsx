
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Bid Invitation CP-8 | KUPEXSA",
  description:
    "Official KUPEXSA invitation to bid for the repairs and equipment upgrades of the Food and Nutrition Laboratory at Presbyterian High School Kumba.",
  alternates: {
    canonical: "https://www.kupexsa.org/bid-invitation",
  },
  openGraph: {
    title: "KUPEXSA Bid Invitation — Project CP-8",
    description:
      "Food and Nutrition Laboratory Repairs and Equipment Upgrades. Bid submission deadline: 28 November 2026.",
    url: "https://www.kupexsa.org/bid-invitation",
    siteName: "KUPEXSA",
    type: "website",
    images: [
      {
        url: "https://www.kupexsa.org/bid-invitation/cp-8-bid-invitation.jpg",
        alt: "Official KUPEXSA Project CP-8 Bid Invitation",
      },
    ],
  },
};

const scopeOfWork = [
  "Site installation and preliminary works.",
  "Masonry works including internals, veranda and soak-away arrangements.",
  "Repair of roof framework including roofing and treated ceiling.",
  "Repair of electrical installations.",
  "Restoration of flooring and tiling extending to the veranda.",
  "Plumbing works.",
  "Metal and joinery works.",
  "Painting of internal and external walls.",
  "Furnishings and cooking appliances.",
];

const bidderRequirements = [
  "Submit bids using the prescribed Bill of Quantities (PDF only). Handwritten submissions will not be accepted.",
  "Provide a verifiable list of at least two similar projects completed within the past two years, with photographs and references.",
  "Submit a Methods Statement explaining how the work will be executed safely and effectively, including the sequence of execution and quality control practices.",
  "Submit bank guarantees to ensure the job will not run into financial issues.",
];

const keyDates = [
  {
    activity: "Bid submission opens",
    date: "21 November 2026",
  },
  {
    activity: "Deadline for receiving bids",
    date: "28 November 2026",
    important: true,
  },
  {
    activity: "All bids transmitted to Project Officer",
    date: "28 November 2026",
  },
  {
    activity: "Contract winner announced",
    date: "5 December 2026",
  },
  {
    activity: "Project commencement",
    date: "Dependent on availability of funds",
  },
  {
    activity: "Expected project execution duration",
    date: "2 months",
  },
];

const contacts = [
  {
    name: "Mr Dickson Mandi",
    role: "Project Coordinator",
    country: "Cameroon",
    phone: "+237 673 106 662",
    whatsapp: "237673106662",
  },
  {
    name: "Mr Njume Neville",
    role: "Project Coordinator",
    country: "Cameroon",
    phone: "+237 679 385 677",
    whatsapp: "237679385677",
  },
  {
    name: "Mr Felix Malleh Sakani",
    role: "Project Sponsor — KUPEXSA UK",
    country: "United Kingdom",
    phone: "+44 7584 355193",
    whatsapp: "447584355193",
  },
  {
    name: "Dr Leo Njampa",
    role: "Project Sponsor",
    country: "United Kingdom",
    phone: "+44 7846 815935",
    whatsapp: "447846815935",
  },
];

type Contact = (typeof contacts)[number];

function getWhatsAppLink(contact: Contact) {
  const message =
    `Hello ${contact.name},\n\n` +
    "I came across the official KUPEXSA Bid Invitation " +
    "for Project CP-8 on www.kupexsa.org, concerning " +
    "the Food and Nutrition Laboratory Repairs and " +
    "Equipment Upgrades at Presbyterian High School Kumba.\n\n" +
    "I would like further information regarding the " +
    "bidding process and project requirements.\n\n" +
    "Kindly advise me on how to proceed.\n\n" +
    "Thank you.";

  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

function WhatsAppIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12.04 2a9.84 9.84 0 0 0-8.5 14.8L2 22l5.36-1.4A9.96 9.96 0 1 0 12.04 2Zm0 18.13a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.18.83.85-3.1-.2-.32a8.1 8.1 0 1 1 6.96 3.9Zm4.45-6.05c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.73-.65-1.22-1.45-1.36-1.69-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.31-.74-1.8-.2-.47-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.09 3.62.57.25 1.02.4 1.37.51.58.18 1.11.15 1.53.09.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

function ContactCard({ contact }: { contact: Contact }) {
  return (
    <article className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
        {contact.role}
      </p>

      <h3 className="mt-3 text-xl font-bold text-blue-950">
        {contact.name}
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        {contact.country}
      </p>

      <a
        href={getWhatsAppLink(contact)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block text-lg font-semibold text-blue-900 hover:underline"
      >
        {contact.phone}
      </a>

      <a
        href={getWhatsAppLink(contact)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex items-center justify-center gap-3 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
        aria-label={`Contact ${contact.name} on WhatsApp`}
      >
        <WhatsAppIcon />
        Contact on WhatsApp
      </a>
    </article>
  );
}

export default function BidInvitationPage() {
  const hasBillOfQuantities = fs.existsSync(
    path.join(
      process.cwd(),
      "public",
      "bid-invitation",
      "cp-8-bill-of-quantities.pdf"
    )
  );

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-blue-950 text-white">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <Link
            href="/"
            className="text-sm font-medium text-blue-200 hover:text-white"
          >
            ← Back to KUPEXSA Home
          </Link>

          <div className="mt-8">
            <span className="inline-block rounded-full bg-yellow-400 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-950">
              Public Bid Invitation
            </span>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
              Presbyterian High School Kumba
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Food & Nutrition Laboratory
            </h1>

            <h2 className="mt-4 text-xl font-semibold text-yellow-300 sm:text-3xl">
              Repairs / Equipment Upgrades
            </h2>

            <p className="mt-5 text-lg font-semibold text-blue-100">
              Project No. CP-8
            </p>

            <p className="mt-5 max-w-3xl leading-8 text-blue-100">
              The Presbyterian High School Kumba
              Ex-Students Association invites qualified
              contractors to submit bids for the restoration
              and upgrading of the Food and Nutrition Laboratory.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#bid-requirements"
                className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-blue-950 transition hover:bg-yellow-300"
              >
                View Bid Requirements
              </a>

              <a
                href="#contacts"
                className="rounded-xl border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-blue-950"
              >
                Contact Project Team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* DEADLINE */}
      <section className="bg-yellow-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-center text-blue-950 sm:flex-row sm:text-left">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest">
              Bid Submission Deadline
            </p>

            <p className="mt-1 text-2xl font-bold">
              Saturday, 28 November 2026
            </p>
          </div>

          <a
            href="#contacts"
            className="rounded-lg bg-blue-950 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800"
          >
            Make an Enquiry
          </a>
        </div>
      </section>

      {/* PROJECT OVERVIEW AND FLYER */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Project No. CP-8
            </p>

            <h2 className="mt-3 text-3xl font-bold text-blue-950">
              Project Overview
            </h2>

            <p className="mt-6 leading-8 text-gray-700">
              The selected contractor shall restore and
              upgrade the existing Food and Nutrition
              Laboratory, which has deteriorated due to
              partial roof damage resulting in extensive
              deterioration of the internal infrastructure
              and cooking and storage appliances.
            </p>

            <p className="mt-5 leading-8 text-gray-700">
              The purpose of this project is to restore
              the structural integrity of the building,
              replace and upgrade the damaged cooking
              appliances, and create a conducive environment
              for knowledge transfer as intended by the
              school authorities.
            </p>

            <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <h3 className="text-lg font-bold text-blue-950">
                Who Can Apply?
              </h3>

              <p className="mt-3 leading-7 text-gray-700">
                Bidding is open to the public. Priority
                will be given to businesses owned by
                registered and dues-paying Kupexsans
                with relevant building construction
                experience and financial capability.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
              <p className="text-sm font-semibold text-gray-500">
                Expected Project Duration
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-950">
                2 Months
              </p>

              <p className="mt-2 text-sm text-gray-600">
                Commencement depends on the availability
                of funds.
              </p>
            </div>
          </div>

          <figure className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <a
              href="/bid-invitation/cp-8-bid-invitation.jpg"
              target="_blank"
              rel="noopener noreferrer"
              title="Open full bid invitation flyer"
            >
              <Image
                src="/bid-invitation/cp-8-bid-invitation.jpg"
                alt="Official KUPEXSA Project CP-8 Bid Invitation Flyer"
                width={1024}
                height={1496}
                priority
                unoptimized
                className="h-auto w-full rounded-xl object-contain"
              />
            </a>

            <figcaption className="mt-4 text-center text-sm text-gray-600">
              Official KUPEXSA Bid Invitation Flyer
            </figcaption>

            <p className="mt-3 text-center text-sm font-medium text-blue-800">
              Corrected bid submission deadline:
              28 November 2026.
            </p>

            <a
              href="/bid-invitation/cp-8-bid-invitation.jpg"
              download="KUPEXSA-CP-8-Bid-Invitation.jpg"
              className="mt-5 block rounded-xl bg-blue-950 px-5 py-3 text-center font-semibold text-white hover:bg-blue-800"
            >
              Download Official Flyer
            </a>
          </figure>
        </div>
      </section>

      {/* SCOPE OF WORK */}
      <section className="border-y border-gray-200 bg-white py-14">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
            Project Specifications
          </p>

          <h2 className="mt-3 text-3xl font-bold text-blue-950">
            Scope of Work
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-gray-600">
            As reflected in the Bill of Quantities,
            the scope of work shall include the following:
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {scopeOfWork.map((item, index) => (
              <article
                key={item}
                className="flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-950 text-sm font-bold text-white">
                  {index + 1}
                </span>

                <p className="leading-7 text-gray-700">
                  {item}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-7 rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-5">
            <p className="font-semibold text-blue-950">
              Important Note
            </p>

            <p className="mt-2 text-gray-700">
              All supplies must be approved by the Project Team.
            </p>
          </div>
        </div>
      </section>

      {/* KEY DATES */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <h2 className="text-3xl font-bold text-blue-950">
          Key Dates & Project Timeline
        </h2>

        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="grid grid-cols-2 gap-4 bg-blue-950 px-5 py-4 text-sm font-bold text-white sm:px-7">
            <span>Activity</span>
            <span>Date / Duration</span>
          </div>

          {keyDates.map((item, index) => (
            <div
              key={item.activity}
              className={`grid grid-cols-2 gap-4 border-b border-gray-100 px-5 py-5 text-sm last:border-b-0 sm:px-7 sm:text-base ${
                item.important
                  ? "bg-yellow-50 font-bold text-blue-950"
                  : index % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50"
              }`}
            >
              <span>{item.activity}</span>
              <span>{item.date}</span>
            </div>
          ))}
        </div>
      </section>

      {/* BIDDER REQUIREMENTS */}
      <section
        id="bid-requirements"
        className="scroll-mt-24 border-y border-gray-200 bg-white py-14"
      >
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-blue-950">
            Bidder Requirements
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            Interested contractors must satisfy the
            following submission requirements.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {bidderRequirements.map((item, index) => (
              <article
                key={item}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-6"
              >
                <span className="text-sm font-bold uppercase tracking-widest text-blue-700">
                  Requirement {index + 1}
                </span>

                <p className="mt-4 leading-7 text-gray-700">
                  {item}
                </p>
              </article>
            ))}
          </div>

          {/* BILL OF QUANTITIES */}
          <div className="mt-9 rounded-2xl bg-blue-950 p-7 text-white sm:p-9">
            <h3 className="text-2xl font-bold">
              Bill of Quantities
            </h3>

            <p className="mt-4 max-w-3xl leading-7 text-blue-100">
              All prospective bidders are required to
              use the prescribed Bill of Quantities
              when preparing their submissions.
            </p>

            {hasBillOfQuantities ? (
              <a
                href="/bid-invitation/cp-8-bill-of-quantities.pdf"
                download
                className="mt-6 inline-block rounded-xl bg-yellow-400 px-6 py-3 font-bold text-blue-950 hover:bg-yellow-300"
              >
                Download Bill of Quantities (PDF)
              </a>
            ) : (
              <a
                href="#contacts"
                className="mt-6 inline-block rounded-xl bg-yellow-400 px-6 py-3 font-bold text-blue-950 hover:bg-yellow-300"
              >
                Contact Project Team for the BOQ
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ELIGIBILITY AND PAYMENT TERMS */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <h2 className="text-3xl font-bold text-blue-950">
          Eligibility & Payment Terms
        </h2>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
            <h3 className="text-xl font-bold text-blue-950">
              Eligibility
            </h3>

            <p className="mt-4 leading-7 text-gray-700">
              Bidding is open to the public, with priority
              given to businesses owned by registered
              and dues-paying Kupexsans who possess
              relevant building construction experience
              and financial capability.
            </p>

            <p className="mt-5 leading-7 text-gray-700">
              Contractors must comply with all standard
              health and safety rules and government
              regulations.
            </p>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
            <h3 className="text-xl font-bold text-blue-950">
              Payment Schedule
            </h3>

            <div className="mt-6 flex h-5 overflow-hidden rounded-full">
              <div className="w-[30%] bg-blue-950" />
              <div className="w-[30%] bg-blue-500" />
              <div className="w-[40%] bg-yellow-400" />
            </div>

            <div className="mt-6 space-y-5">
              <div className="flex items-start gap-4">
                <span className="min-w-16 text-2xl font-bold text-blue-950">
                  30%
                </span>
                <p className="pt-1 leading-7 text-gray-700">
                  Upon contract award.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <span className="min-w-16 text-2xl font-bold text-blue-600">
                  30%
                </span>
                <p className="pt-1 leading-7 text-gray-700">
                  At 60% project completion.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <span className="min-w-16 text-2xl font-bold text-yellow-700">
                  40%
                </span>
                <p className="pt-1 leading-7 text-gray-700">
                  Upon satisfactory completion and
                  handover to the Project Team and
                  PHS Authorities.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* WHATSAPP CONTACTS */}
      <section
        id="contacts"
        className="scroll-mt-24 border-t border-blue-100 bg-blue-50 py-14"
      >
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
            Project CP-8
          </p>

          <h2 className="mt-3 text-3xl font-bold text-blue-950 sm:text-4xl">
            Contacts for Enquiries & Site Visits
          </h2>

          <p className="mt-5 max-w-3xl leading-7 text-gray-600">
            For further information about the bidding
            process, project requirements or site visits,
            contact any of the representatives below.
            Selecting a WhatsApp button opens a conversation
            with a prepared enquiry message.
          </p>

          <h3 className="mt-10 text-xl font-bold text-blue-950">
            Project Coordinators — Cameroon
          </h3>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {contacts
              .filter((contact) => contact.country === "Cameroon")
              .map((contact) => (
                <ContactCard
                  key={contact.whatsapp}
                  contact={contact}
                />
              ))}
          </div>

          <h3 className="mt-10 text-xl font-bold text-blue-950">
            Project Sponsors — United Kingdom
          </h3>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {contacts
              .filter(
                (contact) =>
                  contact.country === "United Kingdom"
              )
              .map((contact) => (
                <ContactCard
                  key={contact.whatsapp}
                  contact={contact}
                />
              ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="bg-blue-950 px-6 py-14 text-center text-white">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-300">
          Presbyterian High School Kumba
        </p>

        <h2 className="mt-4 text-3xl font-bold">
          KUPEXSA — Proud to Belong
        </h2>

        <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100">
          Working together to preserve our heritage
          and improve the learning environment for
          present and future generations.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-xl bg-yellow-400 px-7 py-3 font-bold text-blue-950 hover:bg-yellow-300"
        >
          Return to KUPEXSA Home
        </Link>
      </section>
    </main>
  );
}
