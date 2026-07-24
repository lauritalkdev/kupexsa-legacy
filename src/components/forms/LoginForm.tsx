"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    const cleanedEmail = email.trim().toLowerCase();

    if (!cleanedEmail) {
      setMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setMessage("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanedEmail,
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("invalid login credentials")) {
          setMessage("The email address or password is incorrect.");
        } else {
          setMessage(error.message);
        }

        return;
      }

      /*
       * Supabase already persists the browser session securely.
       * We retain this field now so the interface is complete and can later
       * support a custom persistence preference if required.
       */
      void rememberMe;

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        "Something went wrong while signing you in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Email Address <span className="text-red-600">*</span>
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#071A3D] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
          required
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Password <span className="text-red-600">*</span>
        </label>

        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-12 outline-none transition focus:border-[#071A3D] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            disabled={loading}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-500 transition hover:text-[#071A3D] disabled:cursor-not-allowed"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            disabled={loading}
            className="h-4 w-4 rounded border-gray-300 accent-[#071A3D]"
          />

          Remember me
        </label>

        <Link
          href="/forgot-password"
          className="text-sm font-semibold text-[#071A3D] hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      {message && (
        <p
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700"
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#071A3D] py-3.5 font-semibold text-white transition hover:bg-[#0b285c] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing In..." : "Log In"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#071A3D] hover:underline"
        >
          Register
        </Link>
      </p>
    </form>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m3 3 18 18M10.6 10.6A2 2 0 0 0 13.4 13.4M9.9 5.2A10.9 10.9 0 0 1 12 5c6 0 9.5 7 9.5 7a16 16 0 0 1-2.1 3.1M6.2 6.2C3.8 7.8 2.5 12 2.5 12s3.5 7 9.5 7a10 10 0 0 0 3.1-.5"
      />
    </svg>
  );
}