"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Member = {
  id: string;
  member_id: string | null;
  full_name: string | null;
  email: string | null;
  status: string | null;
};

type RecipientMode = "all" | "selected";

export default function AdminAnnouncementsPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipientMode, setRecipientMode] =
    useState<RecipientMode>("all");

  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const [sending, setSending] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resultError, setResultError] = useState(false);

  useEffect(() => {
    async function loadMembers() {
      try {
        setLoadingMembers(true);
        setLoadError("");

        const response = await fetch(
          "/api/admin/announcements/members",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Member list could not be loaded."
          );
        }

        setMembers(data.members ?? []);
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : "Member list could not be loaded."
        );
      } finally {
        setLoadingMembers(false);
      }
    }

    void loadMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return members;
    }

    return members.filter((member) => {
      return [
        member.full_name,
        member.member_id,
        member.email,
        member.status,
      ].some((value) =>
        (value ?? "").toLowerCase().includes(query)
      );
    });
  }, [members, search]);

  function toggleMember(email: string) {
    setSelectedEmails((current) => {
      if (current.includes(email)) {
        return current.filter((item) => item !== email);
      }

      return [...current, email];
    });
  }

  function selectVisibleMembers() {
    const visibleEmails = filteredMembers
      .map((member) => member.email)
      .filter((email): email is string => Boolean(email));

    setSelectedEmails((current) => [
      ...new Set([...current, ...visibleEmails]),
    ]);
  }

  function clearSelection() {
    setSelectedEmails([]);
  }

  async function handleSend() {
    setResultMessage("");
    setResultError(false);

    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    if (!cleanSubject) {
      setResultError(true);
      setResultMessage("Please enter an announcement subject.");
      return;
    }

    if (!cleanMessage) {
      setResultError(true);
      setResultMessage("Please enter your announcement message.");
      return;
    }

    if (
      recipientMode === "selected" &&
      selectedEmails.length === 0
    ) {
      setResultError(true);
      setResultMessage(
        "Please select at least one member to receive this announcement."
      );
      return;
    }

    const recipientDescription =
      recipientMode === "all"
        ? "all registered KUPEXSA members with an email address"
        : `${selectedEmails.length} selected ${
            selectedEmails.length === 1 ? "member" : "members"
          }`;

    const confirmed = window.confirm(
      `Send "${cleanSubject}" to ${recipientDescription}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setSending(true);

      const response = await fetch(
        "/api/admin/announcements/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: cleanSubject,
            message: cleanMessage,
            sendToAll: recipientMode === "all",
            selectedEmails:
              recipientMode === "selected"
                ? selectedEmails
                : [],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Announcement could not be sent."
        );
      }

      setResultError(!data.success);
      setResultMessage(
        data.message || "Announcement sending completed."
      );

      if (data.success) {
        setSubject("");
        setMessage("");
        setSelectedEmails([]);
      }
    } catch (error) {
      setResultError(true);
      setResultMessage(
        error instanceof Error
          ? error.message
          : "Announcement could not be sent."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-blue-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-400">
            Super Admin
          </p>

          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            Email Announcements
          </h1>

          <p className="mt-5 max-w-3xl leading-7 text-blue-100">
            Send official KUPEXSA announcements to all registered
            members or choose specific members from the global
            membership database.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/admin/members"
              className="rounded-xl bg-yellow-500 px-5 py-3 text-sm font-bold text-blue-950 transition hover:bg-yellow-400"
            >
              Member Management
            </Link>

            <Link
              href="/admin/chapters"
              className="rounded-xl border border-white/60 px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-blue-950"
            >
              Chapter Member Lists
            </Link>

            <Link
              href="/admin/activity"
              className="rounded-xl border border-white/60 px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-blue-950"
            >
              Admin Activity Log
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-700">
              Compose
            </p>

            <h2 className="mt-3 text-3xl font-bold text-blue-950">
              New Announcement
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              The announcement will be sent as an official KUPEXSA
              email from info@kupexsa.org.
            </p>

            <div className="mt-8">
              <label
                htmlFor="announcement-subject"
                className="block text-sm font-bold text-gray-800"
              >
                Subject
              </label>

              <input
                id="announcement-subject"
                type="text"
                value={subject}
                onChange={(event) =>
                  setSubject(event.target.value)
                }
                maxLength={150}
                placeholder="Example: KUPEXSA General Assembly Notice"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-950"
              />

              <p className="mt-2 text-right text-xs text-gray-500">
                {subject.length}/150
              </p>
            </div>

            <div className="mt-6">
              <label
                htmlFor="announcement-message"
                className="block text-sm font-bold text-gray-800"
              >
                Message
              </label>

              <textarea
                id="announcement-message"
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                rows={12}
                placeholder="Write the KUPEXSA announcement here..."
                className="mt-2 w-full resize-y rounded-xl border border-gray-300 px-4 py-3 leading-7 outline-none transition focus:border-blue-950"
              />
            </div>

            <div className="mt-8">
              <p className="text-sm font-bold text-gray-800">
                Recipients
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setRecipientMode("all")}
                  className={`rounded-2xl border p-5 text-left transition ${
                    recipientMode === "all"
                      ? "border-blue-950 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <span className="block font-bold text-blue-950">
                    All Members
                  </span>

                  <span className="mt-1 block text-sm leading-6 text-gray-600">
                    Send to every registered member who has an email
                    address.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setRecipientMode("selected")
                  }
                  className={`rounded-2xl border p-5 text-left transition ${
                    recipientMode === "selected"
                      ? "border-blue-950 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <span className="block font-bold text-blue-950">
                    Selected Members
                  </span>

                  <span className="mt-1 block text-sm leading-6 text-gray-600">
                    Choose exactly which members should receive the
                    announcement.
                  </span>
                </button>
              </div>
            </div>

            {resultMessage && (
              <div
                className={`mt-7 rounded-2xl border p-4 text-sm font-semibold ${
                  resultError
                    ? "border-red-200 bg-red-50 text-red-800"
                    : "border-green-200 bg-green-50 text-green-800"
                }`}
              >
                {resultMessage}
              </div>
            )}

            <button
              type="button"
              onClick={handleSend}
              disabled={sending || loadingMembers}
              className="mt-8 w-full rounded-xl bg-blue-950 px-6 py-4 font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending
                ? "Sending Announcement..."
                : recipientMode === "all"
                  ? "Send to All Members"
                  : `Send to Selected Members${
                      selectedEmails.length
                        ? ` (${selectedEmails.length})`
                        : ""
                    }`}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-gray-500">
              You will be asked to confirm before any announcement is
              sent.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-700">
              Membership
            </p>

            <h2 className="mt-3 text-2xl font-bold text-blue-950">
              Select Recipients
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              {recipientMode === "all"
                ? "All registered members with valid email addresses will receive this announcement."
                : `${selectedEmails.length} ${
                    selectedEmails.length === 1
                      ? "member selected"
                      : "members selected"
                  }.`}
            </p>

            {loadingMembers && (
              <div className="mt-8 rounded-2xl bg-gray-50 p-6 text-center text-gray-600">
                Loading KUPEXSA members...
              </div>
            )}

            {loadError && (
              <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
                {loadError}
              </div>
            )}

            {!loadingMembers && !loadError && (
              <>
                <div className="mt-7 rounded-2xl bg-blue-50 p-5">
                  <p className="text-sm text-gray-600">
                    Members with email addresses
                  </p>

                  <p className="mt-1 text-3xl font-bold text-blue-950">
                    {members.length}
                  </p>
                </div>

                {recipientMode === "selected" && (
                  <>
                    <input
                      type="search"
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      placeholder="Search name, KPX number or email..."
                      className="mt-6 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-950"
                    />

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={selectVisibleMembers}
                        className="rounded-lg bg-blue-950 px-4 py-2 text-sm font-bold text-white"
                      >
                        Select Visible
                      </button>

                      <button
                        type="button"
                        onClick={clearSelection}
                        disabled={selectedEmails.length === 0}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 disabled:opacity-50"
                      >
                        Clear Selection
                      </button>
                    </div>

                    <div className="mt-5 max-h-[560px] space-y-3 overflow-y-auto pr-1">
                      {filteredMembers.length === 0 ? (
                        <div className="rounded-2xl bg-gray-50 p-6 text-center text-sm text-gray-600">
                          No members match your search.
                        </div>
                      ) : (
                        filteredMembers.map((member) => {
                          if (!member.email) {
                            return null;
                          }

                          const selected =
                            selectedEmails.includes(member.email);

                          return (
                            <label
                              key={member.id}
                              className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                                selected
                                  ? "border-blue-950 bg-blue-50"
                                  : "border-gray-200 hover:border-blue-300"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() =>
                                  toggleMember(member.email!)
                                }
                                className="mt-1 h-4 w-4"
                              />

                              <span className="min-w-0">
                                <span className="block font-bold text-gray-900">
                                  {member.full_name ??
                                    "KUPEXSA Member"}
                                </span>

                                <span className="mt-1 block break-all text-sm text-gray-600">
                                  {member.email}
                                </span>

                                <span className="mt-1 block text-xs text-gray-500">
                                  {member.member_id ??
                                    "Member ID pending"}
                                  {member.status
                                    ? ` · ${member.status}`
                                    : ""}
                                </span>
                              </span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}