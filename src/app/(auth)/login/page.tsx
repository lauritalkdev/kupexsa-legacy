import Link from "next/link";

import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="inline-block text-sm font-semibold text-[#071A3D] hover:underline"
          >
            KUPEXSA Connect
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-[#071A3D]">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Log in to access your KUPEXSA member account.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}