"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = { memberId: string; memberName: string };

export default function ApproveMemberButton({ memberId, memberName }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function approve() {
    if (!window.confirm(`Approve ${memberName} as a verified KUPEXSA member?`)) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.rpc("approve_member", {
      target_member_id: memberId,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={approve}
        disabled={loading}
        className="rounded-lg bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Approving..." : "Approve Member"}
      </button>
      {error && <p className="mt-3 text-sm font-medium text-red-700">{error}</p>}
    </div>
  );
}