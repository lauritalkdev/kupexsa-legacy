"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { APP_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setLoggedIn(!!session);
    }

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
  const supabase = createClient();

  await supabase.auth.signOut();

  router.push("/");
  router.refresh();
}

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold text-blue-900"
        >
          {APP_NAME}
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/about"
            className="transition hover:text-blue-700"
          >
            About
          </Link>

          <Link
            href="/directory"
            className="transition hover:text-blue-700"
          >
            Directory
          </Link>

          <Link
            href="/events"
            className="transition hover:text-blue-700"
          >
            Events
          </Link>

          {!loggedIn ? (
            <>
              <Link
                href="/login"
                className="transition hover:text-blue-700"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-blue-950 px-4 py-2 font-semibold text-white transition hover:bg-blue-800"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="transition hover:text-blue-700"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                 className="rounded-lg bg-blue-950 px-4 py-2 font-semibold text-white transition hover:bg-blue-800"
               >
                Logout
            </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}