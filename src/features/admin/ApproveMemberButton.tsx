"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type MemberStatus = "pending" | "verified" | "suspended" | "inactive";
type ActionType = "approve" | "suspend" | "reactivate" | "assign_chapter_admin" | "remove_chapter_admin";

type Props = {
  memberId: string;
  memberName: string;
  status: MemberStatus;
  roleName: string | null;
  hasChapter: boolean;
  isCurrentUser?: boolean;
};

export default function ApproveMemberButton({
  memberId,
  memberName,
  status,
  roleName,
  hasChapter,
  isCurrentUser = false,
}: Props) {
  const router = useRouter();
  const [action, setAction] = useState<ActionType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const configs = {
    approve: {
      title: "Approve Member?",
      message: `Approve ${memberName} as a verified KUPEXSA member?`,
      label: "Yes, Approve Member",
      rpc: "approve_member",
    },
    suspend: {
      title: "Suspend Member?",
      message: `Suspend ${memberName}'s KUPEXSA membership?`,
      label: "Yes, Suspend Member",
      rpc: "suspend_member",
    },
    reactivate: {
      title: "Reactivate Member?",
      message: `Reactivate ${memberName}'s KUPEXSA membership?`,
      label: "Yes, Reactivate Member",
      rpc: "reactivate_member",
    },
    assign_chapter_admin: {
      title: "Assign Chapter Admin?",
      message: `Assign ${memberName} as a Chapter Admin?`,
      label: "Yes, Assign Chapter Admin",
      rpc: "assign_chapter_admin",
    },
    remove_chapter_admin: {
      title: "Remove Chapter Admin?",
      message: `Remove ${memberName}'s Chapter Admin role and return the account to Member?`,
      label: "Yes, Remove Chapter Admin",
      rpc: "remove_chapter_admin",
    },
  } as const;

  async function confirmAction() {
    if (!action) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc(configs[action].rpc, {
      target_member_id: memberId,
    });

    if (rpcError) {
      setError(rpcError.message);
      setLoading(false);
      setAction(null);
      return;
    }

    setLoading(false);
    setAction(null);
    router.refresh();
  }

  const canApprove = status === "pending";
  const canSuspend = !isCurrentUser && (status === "pending" || status === "verified");
  const canReactivate = status === "suspended";
  const canAssign = status === "verified" && roleName === "Member" && hasChapter;
  const canRemove = roleName === "Chapter Admin";

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {canApprove && (
          <button type="button" onClick={() => setAction("approve")} className="rounded-lg bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-600">
            Approve Member
          </button>
        )}

        {canSuspend && (
          <button type="button" onClick={() => setAction("suspend")} className="rounded-lg bg-red-700 px-5 py-3 text-sm font-bold text-white hover:bg-red-600">
            Suspend
          </button>
        )}

        {canReactivate && (
          <button type="button" onClick={() => setAction("reactivate")} className="rounded-lg bg-blue-800 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">
            Reactivate
          </button>
        )}

        {canAssign && (
          <button type="button" onClick={() => setAction("assign_chapter_admin")} className="rounded-lg border border-blue-950 px-5 py-3 text-sm font-bold text-blue-950 hover:bg-blue-950 hover:text-white">
            Assign Chapter Admin
          </button>
        )}

        {canRemove && (
          <button type="button" onClick={() => setAction("remove_chapter_admin")} className="rounded-lg border border-gray-400 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-100">
            Remove Chapter Admin
          </button>
        )}
      </div>

      {isCurrentUser && (
        <p className="mt-3 text-xs text-gray-500">Your own Super Admin account cannot be suspended here.</p>
      )}

      {status === "verified" && roleName === "Member" && !hasChapter && (
        <p className="mt-3 text-xs text-gray-500">Assign a chapter before making this member a Chapter Admin.</p>
      )}

      {error && <p className="mt-3 text-sm font-medium text-red-700">{error}</p>}

      {action && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <h2 className="text-2xl font-bold text-blue-950">{configs[action].title}</h2>
            <p className="mt-4 leading-7 text-gray-600">{configs[action].message}</p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setAction(null)} disabled={loading} className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700">
                Cancel
              </button>
              <button type="button" onClick={confirmAction} disabled={loading} className="rounded-xl bg-blue-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-60">
                {loading ? "Processing..." : configs[action].label}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}