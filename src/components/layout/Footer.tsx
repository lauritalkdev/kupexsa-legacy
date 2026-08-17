import {
  KUPEXSA_SLOGAN,
  SCHOOL_NAME,
} from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h3 className="text-lg font-semibold">
          {SCHOOL_NAME}
        </h3>

        <p className="mt-2 text-sm text-blue-100">
          KUPEXSA — {KUPEXSA_SLOGAN}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <a
            href="https://www.instagram.com/kupexsaglobal?igsh=ejJ3amwyeHozZHJi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-100 transition hover:text-yellow-400"
            aria-label="KUPEXSA Global on Instagram"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
              />
              <circle cx="12" cy="12" r="4" />
              <circle
                cx="17.5"
                cy="6.5"
                r="1"
                fill="currentColor"
                stroke="none"
              />
            </svg>

            Instagram
          </a>

          <a
            href="https://facebook.com/groups/315263564856"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-100 transition hover:text-yellow-400"
            aria-label="KUPEXSA Global on Facebook"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M13.5 21v-8h2.8l.4-3h-3.2V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4Z" />
            </svg>

            Facebook
          </a>
        </div>

        <p className="mt-6 text-sm text-blue-200">
          © {new Date().getFullYear()} KUPEXSA Connect. All rights
          reserved.
        </p>

        <p className="mt-3 text-sm text-blue-200">
          Powered by{" "}
          <a
            href="https://www.luminix.space"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-yellow-400 hover:underline"
          >
            Luminix
          </a>
        </p>
      </div>
    </footer>
  );
}