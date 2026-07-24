"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterForm() {
  const supabase = createClient();

  const currentYear = new Date().getFullYear();

  const entryYears = useMemo(
    () =>
      Array.from(
        { length: currentYear - 1963 + 1 },
        (_, index) => currentYear - index
      ),
    [currentYear]
  );

  const graduationYears = useMemo(
    () =>
      Array.from(
        { length: currentYear - 1963 + 1 },
        (_, index) => currentYear - index
      ),
    [currentYear]
  );

  const [fullName, setFullName] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [entryYear, setEntryYear] = useState("");
  const [graduationYear, setGraduationYear] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  function validateForm() {
    const cleanedFullName = fullName.trim();
    const cleanedEmail = email.trim().toLowerCase();
    const cleanedWhatsapp = whatsapp.trim();

    if (!cleanedFullName) {
      return "Please enter your full name.";
    }

    if (!cleanedEmail) {
      return "Please enter your email address.";
    }

    if (!cleanedWhatsapp) {
      return "Please enter your WhatsApp number.";
    }

    if (!entryYear) {
      return "Please select your PHS entry year.";
    }

    if (!graduationYear) {
      return "Please select your graduation year.";
    }

    if (Number(graduationYear) < Number(entryYear)) {
      return "Graduation year cannot be earlier than entry year.";
    }

    if (password.length < 8) {
      return "Your password must contain at least 8 characters.";
    }

    if (password !== confirmPassword) {
      return "The passwords do not match.";
    }

    if (!acceptedTerms) {
      return "You must confirm that your information is accurate and accept the terms.";
    }

    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setIsError(false);

    const validationError = validateForm();

    if (validationError) {
      setMessage(validationError);
      setIsError(true);
      return;
    }

    setLoading(true);

    try {
      const cleanedFullName = fullName.trim();
      const cleanedPreferredName = preferredName.trim();
      const cleanedEmail = email.trim().toLowerCase();
      const cleanedWhatsapp = whatsapp.trim();

      const { error } = await supabase.auth.signUp({
        email: cleanedEmail,
        password,
        options: {
          data: {
            full_name: cleanedFullName,
            preferred_name: cleanedPreferredName || null,
            whatsapp: cleanedWhatsapp,
            entry_year: Number(entryYear),
            graduation_year: Number(graduationYear),

          },
        },
      });

      if (error) {
        setMessage(error.message);
        setIsError(true);
        return;
      }

      setRegistrationComplete(true);
    } catch (error) {
      console.error("Registration error:", error);

      setMessage(
        "Something went wrong while creating your account. Please try again."
      );
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  if (registrationComplete) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="h-7 w-7"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m5 12 4 4L19 6"
            />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-[#071A3D]">
          Registration Submitted
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-700">
          Registration successful. Your account has been submitted and is
          awaiting KUPEXSA approval.
        </p>

        <p className="mt-2 text-sm text-gray-600">
          You will be able to access your member account after it has been
          approved.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[#071A3D] px-5 py-3 font-semibold text-white transition hover:bg-[#0b285c]"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[#071A3D]">
            Personal Information
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Enter your basic contact information.
          </p>
        </div>

        <div>
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Full Name <span className="text-red-600">*</span>
          </label>

          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#071A3D] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            required
          />
        </div>

        <div>
          <label
            htmlFor="preferredName"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Preferred Name or Nickname
          </label>

          <input
            id="preferredName"
            name="preferredName"
            type="text"
            autoComplete="nickname"
            placeholder="Optional"
            value={preferredName}
            onChange={(e) => setPreferredName(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#071A3D] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
          />
        </div>

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
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#071A3D] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            required
          />
        </div>

        <div>
          <label
            htmlFor="whatsapp"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            WhatsApp Number <span className="text-red-600">*</span>
          </label>

          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            autoComplete="tel"
            placeholder="Example: +237 6XX XXX XXX"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#071A3D] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            required
          />
        </div>
      </section>

      <section className="space-y-4 border-t border-gray-200 pt-6">
        <div>
          <h2 className="text-base font-semibold text-[#071A3D]">
            PHS Information
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Provide information that will help KUPEXSA verify your membership.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="entryYear"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Entry Year <span className="text-red-600">*</span>
            </label>

            <select
              id="entryYear"
              name="entryYear"
              value={entryYear}
              onChange={(e) => setEntryYear(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#071A3D] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              required
            >
              <option value="">Select year</option>

              {entryYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="graduationYear"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Graduation Year <span className="text-red-600">*</span>
            </label>

            <select
              id="graduationYear"
              name="graduationYear"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#071A3D] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              required
            >
              <option value="">Select year</option>

              {graduationYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

      </section>

      <section className="space-y-4 border-t border-gray-200 pt-6">
        <div>
          <h2 className="text-base font-semibold text-[#071A3D]">
            Account Security
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Create a secure password for your account.
          </p>
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
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              minLength={8}
              className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-12 outline-none transition focus:border-[#071A3D] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-500 hover:text-[#071A3D]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <p className="mt-1 text-xs text-gray-500">
            Use at least 8 characters.
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Confirm Password <span className="text-red-600">*</span>
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Enter your password again"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              minLength={8}
              className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-12 outline-none transition focus:border-[#071A3D] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword((current) => !current)
              }
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-500 hover:text-[#071A3D]"
              aria-label={
                showConfirmPassword
                  ? "Hide confirmed password"
                  : "Show confirmed password"
              }
            >
              {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {confirmPassword && (
            <p
              className={`mt-1 text-xs ${
                passwordsMatch ? "text-green-700" : "text-red-600"
              }`}
            >
              {passwordsMatch
                ? "Passwords match."
                : "Passwords do not match."}
            </p>
          )}
        </div>
      </section>

      <div className="border-t border-gray-200 pt-6">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            id="acceptedTerms"
            name="acceptedTerms"
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            disabled={loading}
            className="mt-1 h-4 w-4 rounded border-gray-300 accent-[#071A3D]"
            required
          />

          <span className="text-sm leading-6 text-gray-600">
            I certify that the information provided is accurate and I agree to
            the KUPEXSA Terms of Use and Privacy Policy.
          </span>
        </label>
      </div>

      {message && (
        <p
          role="alert"
          aria-live="polite"
          className={`rounded-lg p-3 text-center text-sm ${
            isError
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-green-200 bg-green-50 text-green-700"
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
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#071A3D] hover:underline"
        >
          Log In
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