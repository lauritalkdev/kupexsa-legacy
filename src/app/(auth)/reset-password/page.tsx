"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setSuccess(false);

    if (!password) {
      setMessage("Please enter your new password.");
      return;
    }

    if (password.length < 8) {
      setMessage("Your new password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setSuccess(true);
      setMessage(
        "Your password has been updated successfully. Redirecting you to login..."
      );

      await supabase.auth.signOut();

      setTimeout(() => {
        router.replace("/login");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error("Password update error:", error);

      setMessage(
        "Something went wrong while updating your password. Please try again."
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
          Create New Password
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          Enter a new password for your KUPEXSA member account.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              New Password <span className="text-red-600">*</span>
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter your new password"
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirm New Password <span className="text-red-600">*</span>
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-12 outline-none transition focus:border-[#071A3D] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((current) => !current)
                }
                disabled={loading}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-500 transition hover:text-[#071A3D] disabled:cursor-not-allowed"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
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
            {loading ? "Updating Password..." : "Update Password"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Return to{" "}
            <Link
              href="/login"
              className="font-semibold text-[#071A3D] hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
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