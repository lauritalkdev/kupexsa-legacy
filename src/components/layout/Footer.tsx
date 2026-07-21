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

        <p className="mt-6 text-sm text-blue-200">
  © {new Date().getFullYear()} KUPEXSA Connect.
  All rights reserved.
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