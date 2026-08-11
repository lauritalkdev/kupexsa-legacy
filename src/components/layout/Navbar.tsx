"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

const navigationLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Directory",
    href: "/directory",
  },
  {
    name: "Events",
    href: "/events",
  },
  {
    name: "Projects",
    href: "/projects",
  },
];

type RoleRelation =
  | {
      name: string;
    }
  | {
      name: string;
    }[]
  | null;

function getRoleName(role: RoleRelation) {
  if (Array.isArray(role)) {
    return role[0]?.name ?? null;
  }

  return role?.name ?? null;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function loadSessionAndRole() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user ?? null;

      setLoggedIn(Boolean(user));

      if (!user) {
        setIsSuperAdmin(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select(
          `
            role:roles (
              name
            )
          `
        )
        .eq("id", user.id)
        .single();

      if (error || !profile) {
        setIsSuperAdmin(false);
        return;
      }

      setIsSuperAdmin(
        getRoleName(profile.role as RoleRelation) === "Super Admin"
      );
    }

    loadSessionAndRole();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;

      setLoggedIn(Boolean(user));

      if (!user) {
        setIsSuperAdmin(false);
        return;
      }

      setTimeout(() => {
        loadSessionAndRole();
      }, 0);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    setLoggedIn(false);
    setIsSuperAdmin(false);
    setMobileMenuOpen(false);

    router.push("/");
    router.refresh();
  }

  function isActiveLink(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="mx-auto max-w-7xl px-6 lg:px-8"
      >
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-950 text-sm font-black text-yellow-400">
              KC
            </div>

            <div className="min-w-0">
              <p className="truncate text-lg font-black leading-tight text-blue-950">
                KUPEXSA Connect
              </p>

              <p className="hidden text-xs font-semibold text-gray-500 sm:block">
                Kupexsan:- Proud to Belong
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {navigationLinks.map((link) => {
              const active = isActiveLink(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-blue-950 text-white"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-950"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="ml-3 flex items-center gap-3 border-l border-gray-200 pl-4">
              {loggedIn ? (
                <>
                  {isSuperAdmin && (
                    <Link
                      href="/admin/members"
                      className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                        pathname.startsWith("/admin")
                          ? "bg-yellow-500 text-blue-950"
                          : "border border-yellow-500 text-yellow-700 hover:bg-yellow-500 hover:text-blue-950"
                      }`}
                    >
                      Super Admin
                    </Link>
                  )}

                  <Link
                    href="/dashboard"
                    className="rounded-lg border border-blue-950 px-4 py-2.5 text-sm font-bold text-blue-950 transition hover:bg-blue-950 hover:text-white"
                  >
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg bg-yellow-500 px-4 py-2.5 text-sm font-bold text-blue-950 transition hover:bg-yellow-400"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg px-4 py-2.5 text-sm font-bold text-blue-950 transition hover:bg-blue-50"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="rounded-lg bg-yellow-500 px-4 py-2.5 text-sm font-bold text-blue-950 transition hover:bg-yellow-400"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 text-blue-950 transition hover:border-blue-950 hover:bg-blue-50 lg:hidden"
          >
            <span className="sr-only">
              {mobileMenuOpen ? "Close menu" : "Open menu"}
            </span>

            {mobileMenuOpen ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 pb-6 pt-4 lg:hidden">
            <div className="flex flex-col gap-2">
              {navigationLinks.map((link) => {
                const active = isActiveLink(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-xl px-4 py-3 text-base font-semibold transition ${
                      active
                        ? "bg-blue-950 text-white"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-950"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="my-2 border-t border-gray-200" />

              {loggedIn ? (
                <>
                  {isSuperAdmin && (
                    <Link
                      href="/admin/members"
                      className={`rounded-xl px-4 py-3 text-base font-bold transition ${
                        pathname.startsWith("/admin")
                          ? "bg-yellow-500 text-blue-950"
                          : "border border-yellow-500 text-yellow-700 hover:bg-yellow-500 hover:text-blue-950"
                      }`}
                    >
                      Super Admin
                    </Link>
                  )}

                  <Link
                    href="/dashboard"
                    className={`rounded-xl px-4 py-3 text-base font-bold transition ${
                      pathname.startsWith("/dashboard")
                        ? "bg-blue-950 text-white"
                        : "border border-blue-950 text-blue-950 hover:bg-blue-950 hover:text-white"
                    }`}
                  >
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-xl bg-yellow-500 px-4 py-3 text-left text-base font-bold text-blue-950 transition hover:bg-yellow-400"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-xl border border-blue-950 px-4 py-3 text-center text-base font-bold text-blue-950 transition hover:bg-blue-950 hover:text-white"
                  >
                    Member Login
                  </Link>

                  <Link
                    href="/register"
                    className="rounded-xl bg-yellow-500 px-4 py-3 text-center text-base font-bold text-blue-950 transition hover:bg-yellow-400"
                  >
                    Join KUPEXSA Connect
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}