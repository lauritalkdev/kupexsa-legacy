"use client";

import Link from "next/link";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setSuccess(false);

    const cleanedEmail = email.trim().toLowerCase();

    if (!cleanedEmail) {
      setMessage("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const origin = window.location.origin;

      const { error } = await supabase.auth.resetPasswordForEmail(
        cleanedEmail,
        {
          redirectTo: `${origin}/auth/callback?next=/reset-password`,
        }
      );

      if (error) {
        setMessage(error.message);
        return;
      }

      setSuccess(true);
      setMessage(
        "If an account exists with this email address, a password reset link has been sent. Please check your inbox and spam folder."
      );
    } catch (error) {
      console.error("Password reset request error:", error);

      setMessage(
        "Something went wrong while requesting your password reset. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <Link
          href="/"
          className="inline-block text-sm font-semibold text-[#071A3D] hover:underline"
        >
          KUPEXSA Connect
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-[#071A3D]">
          Reset Password
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          Enter the email address linked to your KUPEXSA account.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
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

          {message && (
            <p
              role="alert"
              aria-live="polite"
              className={`rounded-lg border p-3 text-center text-sm ${
                success
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#071A3D] py-3.5 font-semibold text-white transition hover:bg-[#0b285c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending Reset Link..." : "Send Reset Link"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#071A3D] hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}