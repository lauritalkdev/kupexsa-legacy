
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Member = {
  id: string;
  memberId: string;
  name: string;
  chapter: string;
  classYear: number | null;
};

type DuesRecord = {
  id: string;
  member_id: string;
  year: number;
};

type Props = {
  members: Member[];
  initialDues: DuesRecord[];
  currentAdminId: string;
};

export default function AnnualDuesManager({
  members,
  initialDues,
  currentAdminId,
}: Props) {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const [search, setSearch] = useState("");
  const [selectedMemberId, setSelectedMemberId] =
    useState<string | null>(null);
  const [selectedYears, setSelectedYears] =
    useState<number[]>([]);
  const [yearInput, setYearInput] = useState(
    String(currentYear)
  );
  const [dues, setDues] = useState(initialDues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return members.slice(0, 30);

    return members
      .filter((member) =>
        [
          member.name,
          member.memberId,
          member.chapter,
          member.classYear?.toString(),
        ].some((value) =>
          (value ?? "").toLowerCase().includes(query)
        )
      )
      .slice(0, 50);
  }, [members, search]);

  const selectedMember = members.find(
    (member) => member.id === selectedMemberId
  );

  const memberDues = dues
    .filter((record) => record.member_id === selectedMemberId)
    .sort((a, b) => b.year - a.year);

  const paidYears = new Set(
    memberDues.map((record) => record.year)
  );

  function chooseMember(memberId: string) {
    setSelectedMemberId(memberId);
    setSelectedYears([]);
    setError(null);
    setSuccess(null);
  }

  function toggleYear(year: number) {
    if (paidYears.has(year)) return;

    setSelectedYears((previous) =>
      previous.includes(year)
        ? previous.filter((value) => value !== year)
        : [...previous, year].sort((a, b) => b - a)
    );
  }

  function addYear() {
    const year = Number(yearInput);

    if (
      !Number.isInteger(year) ||
      year < 1900 ||
      year > 2100
    ) {
      setError("Enter a valid year between 1900 and 2100.");
      return;
    }

    if (paidYears.has(year)) {
      setError(`${year} is already recorded as paid.`);
      return;
    }

    setSelectedYears((previous) =>
      previous.includes(year)
        ? previous
        : [...previous, year].sort((a, b) => b - a)
    );

    setError(null);
  }

  async function recordDues() {
    if (!selectedMemberId || selectedYears.length === 0) {
      return;
    }

    const yearsToRecord = selectedYears.filter(
      (year) => !paidYears.has(year)
    );

    if (yearsToRecord.length === 0) return;

    const confirmed = window.confirm(
      `Record ${yearsToRecord.join(", ")} as paid for ${selectedMember?.name}?`
    );

    if (!confirmed) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const supabase = createClient();

    const { data, error: insertError } = await supabase
      .from("annual_dues")
      .insert(
        yearsToRecord.map((year) => ({
          member_id: selectedMemberId,
          year,
          recorded_by: currentAdminId,
        }))
      )
      .select("id, member_id, year");

    if (insertError) {
      setError(insertError.message);
    } else {
      setDues((previous) => [...previous, ...(data ?? [])]);
      setSelectedYears([]);
      setSuccess(
        `Successfully recorded ${yearsToRecord.join(", ")} for ${selectedMember?.name}.`
      );
      router.refresh();
    }

    setLoading(false);
  }

  async function removeDues(record: DuesRecord) {
    const confirmed = window.confirm(
      `Remove the ${record.year} payment record for ${selectedMember?.name}? Only proceed if this was recorded incorrectly.`
    );

    if (!confirmed) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const supabase = createClient();

    const { data, error: deleteError } = await supabase
      .from("annual_dues")
      .delete()
      .eq("id", record.id)
      .select("id");

    if (deleteError) {
      setError(deleteError.message);
    } else if (!data?.length) {
      setError("The payment record was not removed.");
    } else {
      setDues((previous) =>
        previous.filter((item) => item.id !== record.id)
      );
      setSuccess(
        `${record.year} payment record removed.`
      );
      router.refresh();
    }

    setLoading(false);
  }

  const recentYears = Array.from(
    { length: 8 },
    (_, index) => currentYear - index
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-blue-950">
          Find a Member
        </h2>

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, KPX ID, chapter or class..."
          className="mt-5 w-full rounded-xl border border-gray-300 px-4 py-3"
        />

        <p className="mt-3 text-sm text-gray-500">
          {filteredMembers.length} members displayed
        </p>

        <div className="mt-5 max-h-[600px] space-y-3 overflow-y-auto">
          {filteredMembers.map((member) => {
            const active = member.id === selectedMemberId;
            const memberPaidYears = dues
              .filter((record) => record.member_id === member.id)
              .map((record) => record.year);

            return (
              <button
                key={member.id}
                type="button"
                onClick={() => chooseMember(member.id)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  active
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <p className="font-bold text-blue-950">
                  {member.name}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {member.memberId} • {member.chapter}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {member.classYear
                    ? `Class of ${member.classYear}`
                    : "Class not assigned"}
                  {" • "}
                  {memberPaidYears.length
                    ? `Paid: ${memberPaidYears.sort((a, b) => b - a).join(", ")}`
                    : "No dues recorded"}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        {!selectedMember ? (
          <div className="py-20 text-center text-gray-500">
            Select a member to manage annual global dues.
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-blue-950">
              {selectedMember.name}
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              {selectedMember.memberId} • {selectedMember.chapter}
            </p>

            <div className="mt-6 rounded-2xl bg-blue-950 p-5 text-white">
              <p className="text-sm text-blue-200">
                Current Year — {currentYear}
              </p>
              <p className="mt-2 text-xl font-bold">
                {paidYears.has(currentYear)
                  ? "Paid"
                  : "Not Yet Registered"}
              </p>
              <p className="mt-2 text-sm text-blue-200">
                {memberDues.length} year(s) recorded
              </p>
            </div>

            <h3 className="mt-8 font-bold text-blue-950">
              Record Payment Years
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Select one or several years. Previously recorded
              years cannot be selected again.
            </p>

            <div className="mt-5 grid grid-cols-4 gap-3">
              {recentYears.map((year) => {
                const paid = paidYears.has(year);
                const selected = selectedYears.includes(year);

                return (
                  <button
                    key={year}
                    type="button"
                    disabled={paid || loading}
                    onClick={() => toggleYear(year)}
                    className={`rounded-xl border px-2 py-3 text-sm font-bold ${
                      paid
                        ? "border-green-200 bg-green-50 text-green-700"
                        : selected
                          ? "border-yellow-500 bg-yellow-100 text-blue-950"
                          : "border-gray-300 text-gray-700"
                    } disabled:cursor-not-allowed`}
                  >
                    {year}
                    {paid ? " ✓" : selected ? " ✓" : ""}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <input
                type="number"
                min={1900}
                max={2100}
                value={yearInput}
                onChange={(event) => setYearInput(event.target.value)}
                className="w-36 rounded-xl border border-gray-300 px-4 py-3"
                aria-label="Additional payment year"
              />

              <button
                type="button"
                onClick={addYear}
                disabled={loading}
                className="rounded-xl border border-blue-950 px-5 py-3 font-bold text-blue-950"
              >
                Add Year
              </button>
            </div>

            {selectedYears.length > 0 && (
              <p className="mt-4 text-sm font-medium text-blue-900">
                Selected: {selectedYears.join(", ")}
              </p>
            )}

            <button
              type="button"
              disabled={loading || selectedYears.length === 0}
              onClick={recordDues}
              className="mt-6 w-full rounded-xl bg-blue-950 px-6 py-4 font-bold text-white disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : `Record ${selectedYears.length} Payment Year(s)`}
            </button>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            {success && (
              <p className="mt-4 text-sm font-medium text-green-700">
                {success}
              </p>
            )}

            <div className="mt-10 border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold text-blue-950">
                Recorded Payment History
              </h3>

              {memberDues.length === 0 ? (
                <p className="mt-4 text-gray-500">
                  No annual global dues recorded yet.
                </p>
              ) : (
                <div className="mt-5 space-y-3">
                  {memberDues.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-4"
                    >
                      <span className="font-bold text-green-700">
                        {record.year} — Paid
                      </span>

                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => removeDues(record)}
                        className="text-sm font-semibold text-red-700 hover:underline disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
