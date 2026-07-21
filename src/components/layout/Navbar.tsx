import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold text-blue-900"
        >
          {APP_NAME}
        </Link>

        <div className="flex gap-6 text-sm font-medium">
          <Link href="/about">
            About
          </Link>

          <Link href="/directory">
            Directory
          </Link>

          <Link href="/events">
            Events
          </Link>

          <Link href="/login">
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}