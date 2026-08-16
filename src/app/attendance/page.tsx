"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

type RoleRelation =
  | { name: string }
  | { name: string }[]
  | null;

type ActiveAttendanceSession = {
  id: string;
  title: string;
  start_date: string;
  created_by: string | null;
  created_by_name: string | null;
  attendance_radius_meters: number | null;
};

type AttendanceHistorySession = ActiveAttendanceSession & {
  end_date: string | null;
  attendance_closed: boolean;
  attendance_closed_at: string | null;
  total_present: number | string;
};

type AttendanceRecord = {
  attendance_id: string;
  member_id: string;
  kupexsa_member_id: string | null;
  full_name: string | null;
  badge_year: number | null;
  phone: string | null;
  whatsapp: string | null;
  chapter_name: string | null;
  attendance_status: "checked_in" | "checked_out" | "absent";
  check_in_time: string;
  distance_from_event_meters: number | null;
};

const AUTHORIZED_ADMIN_ROLES = [
  "Super Admin",
  "Executive Admin",
  "Chapter Admin",
];

function getRoleName(role: RoleRelation) {
  if (Array.isArray(role)) {
    return role[0]?.name ?? null;
  }

  return role?.name ?? null;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

async function getCurrentPosition(): Promise<GeolocationPosition> {
  if (!navigator.geolocation) {
    throw new Error(
      "Location services are not supported by this browser or device."
    );
  }

  const readings: GeolocationPosition[] = [];
  let lastError: GeolocationPositionError | null = null;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 12000,
            maximumAge: 0,
          });
        }
      );

      readings.push(position);

      if (position.coords.accuracy <= 25) {
        break;
      }

      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
    } catch (error) {
      lastError = error as GeolocationPositionError;

      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
    }
  }

  if (readings.length === 0) {
    throw lastError ?? new Error("Location could not be determined.");
  }

  return readings.reduce((best, current) =>
    current.coords.accuracy < best.coords.accuracy ? current : best
  );
}

function locationErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    const geoError = error as GeolocationPositionError;

    if (geoError.code === 1) {
      return `Location permission denied. Please allow Location for this website and try again. Browser message: ${
        geoError.message || "Permission denied"
      }`;
    }

    if (geoError.code === 2) {
      return `Location unavailable. Your device/browser could not obtain GPS coordinates. Turn on device Location/GPS, ensure this website has Location permission, then try again. Browser message: ${
        geoError.message || "Position unavailable"
      }`;
    }

    if (geoError.code === 3) {
      return `Location request timed out. Keep Location/GPS enabled and try again, preferably with Wi-Fi or mobile data active. Browser message: ${
        geoError.message || "Timeout"
      }`;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Location could not be determined. Please check your device Location/GPS and browser permissions.";
}

export default function AttendancePage() {
  const [loadingPage, setLoadingPage] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [roleName, setRoleName] = useState<string | null>(null);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [sessions, setSessions] = useState<ActiveAttendanceSession[]>([]);
  const [history, setHistory] = useState<AttendanceHistorySession[]>([]);
  const [selectedSession, setSelectedSession] = useState<AttendanceHistorySession | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [starting, setStarting] = useState(false);
  const [closingId, setClosingId] = useState<string | null>(null);
  const [checkingInId, setCheckingInId] = useState<string | null>(null);
  const [checkedInEventIds, setCheckedInEventIds] = useState<Set<string>>(
    new Set()
  );
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  const isAuthorizedAdmin =
    roleName !== null && AUTHORIZED_ADMIN_ROLES.includes(roleName);

  const loadAdminHistory = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_attendance_sessions_history");

    if (error) {
      setMessage(error.message);
      setMessageType("error");
      return;
    }

    setHistory((data ?? []) as AttendanceHistorySession[]);
  }, []);

  async function loadSessionRecords(session: AttendanceHistorySession) {
    setSelectedSession(session);
    setLoadingRecords(true);

    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_attendance_session_records", {
      target_event_id: session.id,
    });

    if (error) {
      setMessage(error.message);
      setMessageType("error");
      setRecords([]);
    } else {
      setRecords((data ?? []) as AttendanceRecord[]);
    }

    setLoadingRecords(false);
  }

  function downloadAttendancePdf() {
    if (!selectedSession) return;

    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(18);
    doc.text(selectedSession.title, 14, 16);
    doc.setFontSize(10);
    doc.text(`Attendance List - ${formatDateTime(selectedSession.start_date)}`, 14, 23);
    doc.text(`Total Present: ${records.length}`, 14, 29);

    autoTable(doc, {
      startY: 35,
      head: [["Full Name", "Class", "Phone / WhatsApp", "Chapter", "Check-in Time"]],
      body: records.map((record) => [
        record.full_name ?? "Not provided",
        record.badge_year ? `Class of ${record.badge_year}` : "Not provided",
        record.whatsapp ?? record.phone ?? "Not provided",
        record.chapter_name ?? "Not provided",
        formatDateTime(record.check_in_time),
      ]),
      styles: { fontSize: 9 },
      headStyles: { fontStyle: "bold" },
    });

    const safeTitle = selectedSession.title
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();

    doc.save(`${safeTitle || "kupexsa-attendance"}-attendance.pdf`);
  }

  const loadAttendancePage = useCallback(async () => {
    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoggedIn(false);
      setRoleName(null);
      setSessions([]);
      setLoadingPage(false);
      return;
    }

    setLoggedIn(true);

    const [profileResult, sessionsResult, ownAttendanceResult] = await Promise.all([
      supabase
        .from("profiles")
        .select(
          `
            role:roles (
              name
            )
          `
        )
        .eq("id", user.id)
        .single(),
      supabase.rpc("get_active_attendance_sessions"),
      supabase
        .from("attendance")
        .select("event_id")
        .eq("member_id", user.id),
    ]);

    if (!profileResult.error && profileResult.data) {
      const loadedRoleName = getRoleName(profileResult.data.role as RoleRelation);
      setRoleName(loadedRoleName);

      if (loadedRoleName && AUTHORIZED_ADMIN_ROLES.includes(loadedRoleName)) {
        const { data: historyData, error: historyError } = await supabase.rpc(
          "get_attendance_sessions_history"
        );

        if (!historyError) {
          setHistory((historyData ?? []) as AttendanceHistorySession[]);
        }
      }
    } else {
      setRoleName(null);
    }

    if (!sessionsResult.error) {
      setSessions(
        (sessionsResult.data ?? []) as ActiveAttendanceSession[]
      );
    }

    if (!ownAttendanceResult.error) {
      setCheckedInEventIds(
        new Set(
          (ownAttendanceResult.data ?? []).map(
            (record: { event_id: string }) => record.event_id
          )
        )
      );
    }

    setLoadingPage(false);
  }, []);

 useEffect(() => {
  const timer = setTimeout(() => {
    loadAttendancePage();
  }, 0);

  return () => clearTimeout(timer);
}, [loadAttendancePage]);

  async function handleStartAttendance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = meetingTitle.trim();

    if (!title) {
      setMessage("Please enter the meeting title.");
      setMessageType("error");
      return;
    }

    setStarting(true);
    setMessage("");
    setMessageType("");

    try {
      const position = await getCurrentPosition();
      const supabase = createClient();

      const { error } = await supabase.rpc("start_attendance_session", {
        meeting_title: title,
        admin_latitude: position.coords.latitude,
        admin_longitude: position.coords.longitude,
      });

   if (error) {
  setMessage(`Attendance could not be started: ${error.message}`);
  setMessageType("error");
  return;
}

      setMeetingTitle("");
      setMessage(
        "Attendance has started successfully. Members within 110 metres can mark themselves present."
      );
      setMessageType("success");

      await loadAttendancePage();
      await loadAdminHistory();
    } catch (error) {
      setMessage(locationErrorMessage(error));
      setMessageType("error");
    } finally {
      setStarting(false);
    }
  }

  async function handleMarkPresent(session: ActiveAttendanceSession) {
    setCheckingInId(session.id);
    setMessage("");
    setMessageType("");

    try {
      const position = await getCurrentPosition();
      const supabase = createClient();

      const { data, error } = await supabase.rpc("check_in_attendance", {
        target_event_id: session.id,
        member_latitude: position.coords.latitude,
        member_longitude: position.coords.longitude,
        member_accuracy_meters: position.coords.accuracy,
      });

      if (error) {
        throw error;
      }

      const distance =
        typeof data === "number" && Number.isFinite(data)
          ? ` You were approximately ${data.toFixed(1)} metres from the meeting point.`
          : "";

      setMessage(`You have been marked Present for "${session.title}".${distance}`);
      setMessageType("success");

      setCheckedInEventIds((current) => {
        const next = new Set(current);
        next.add(session.id);
        return next;
      });
} catch (error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    const message = String(
      (error as { message?: unknown }).message ?? ""
    );

    if (
      message.includes("permitted attendance area") ||
      message.includes("already marked attendance") ||
      message.includes("unavailable or already closed")
    ) {
      setMessage(message);
      setMessageType("error");
    } else {
      setMessage(locationErrorMessage(error));
      setMessageType("error");
    }
  } else {
    setMessage(locationErrorMessage(error));
    setMessageType("error");
  }
} finally {
  setCheckingInId(null);
}
  }

  async function handleCloseAttendance(session: ActiveAttendanceSession) {
    const confirmed = window.confirm(
      `Close attendance for "${session.title}"? Members will no longer be able to mark themselves present.`
    );

    if (!confirmed) {
      return;
    }

    setClosingId(session.id);
    setMessage("");
    setMessageType("");

    const supabase = createClient();

    const { error } = await supabase.rpc("close_attendance_session", {
      target_event_id: session.id,
    });

    if (error) {
      setMessage(error.message);
      setMessageType("error");
      setClosingId(null);
      return;
    }

    setMessage(`Attendance for "${session.title}" has been closed.`);
    setMessageType("success");
    setClosingId(null);

    await loadAttendancePage();
    await loadAdminHistory();

    if (selectedSession?.id === session.id) {
      await loadSessionRecords({
        ...selectedSession,
        attendance_closed: true,
        attendance_closed_at: new Date().toISOString(),
      });
    }
  }

  if (loadingPage) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="font-semibold text-blue-950">
            Loading attendance...
          </p>
        </div>
      </main>
    );
  }

  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-2xl rounded-3xl border border-yellow-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-blue-950">
            Member login required
          </h1>

          <p className="mt-4 leading-7 text-gray-600">
            Log in to KUPEXSA Connect to access meeting attendance.
          </p>

          <Link
            href="/login"
            className="mt-7 inline-flex rounded-xl bg-blue-950 px-6 py-3 font-bold text-white transition hover:bg-blue-800"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-blue-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-400">
            KUPEXSA Attendance
          </p>

          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            Meeting Attendance
          </h1>

          <p className="mt-5 max-w-3xl leading-7 text-blue-100">
            Start and manage location-verified attendance sessions for KUPEXSA
            meetings.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {message && (
          <div
            className={`mb-8 rounded-2xl border p-5 text-sm font-medium ${
              messageType === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        {isAuthorizedAdmin ? (
          <>
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-700">
                Admin Controls
              </p>

              <h2 className="mt-3 text-3xl font-bold text-blue-950">
                Start Attendance
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-gray-600">
                Enter the meeting title. When you start attendance, your
                current GPS location becomes the meeting point and the system
                automatically uses a 110-metre attendance radius.
              </p>

              <form
                onSubmit={handleStartAttendance}
                className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto]"
              >
                <div>
                  <label
                    htmlFor="meeting-title"
                    className="mb-2 block text-sm font-semibold text-blue-950"
                  >
                    Meeting Title
                  </label>

                  <input
                    id="meeting-title"
                    type="text"
                    value={meetingTitle}
                    onChange={(event) => setMeetingTitle(event.target.value)}
                    placeholder="e.g. Buea Chapter Meeting"
                    disabled={starting}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={starting}
                  className="self-end rounded-xl bg-yellow-500 px-7 py-3 font-bold text-blue-950 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {starting ? "Getting Location..." : "Start Attendance"}
                </button>
              </form>

              <p className="mt-4 text-sm leading-6 text-gray-500">
                Your browser will request location permission when you start
                attendance. The meeting date and start time are recorded
                automatically.
              </p>
            </section>

            <section className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-700">
                    Active Sessions
                  </p>

                  <h2 className="mt-3 text-3xl font-bold text-blue-950">
                    Attendance in Progress
                  </h2>

                  <p className="mt-3 text-gray-600">
                    {sessions.length} active{" "}
                    {sessions.length === 1 ? "session" : "sessions"}.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={loadAttendancePage}
                  className="rounded-xl border border-blue-950 px-5 py-3 text-sm font-bold text-blue-950 transition hover:bg-blue-950 hover:text-white"
                >
                  Refresh
                </button>
              </div>

              {sessions.length === 0 ? (
                <div className="mt-8 rounded-2xl bg-gray-50 p-8 text-center">
                  <h3 className="text-xl font-bold text-blue-950">
                    No active attendance session
                  </h3>

                  <p className="mt-3 text-gray-600">
                    Start attendance above when a meeting begins.
                  </p>
                </div>
              ) : (
                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                  {sessions.map((session) => (
                    <article
                      key={session.id}
                      className="rounded-2xl border border-blue-100 bg-blue-50 p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                          ACTIVE
                        </span>

                        <span className="text-sm font-semibold text-gray-500">
                          {session.attendance_radius_meters ?? 110} m radius
                        </span>
                      </div>

                      <h3 className="mt-4 text-2xl font-bold text-blue-950">
                        {session.title}
                      </h3>

                      <div className="mt-5 space-y-2 text-sm text-gray-600">
                        <p>
                          <strong>Started:</strong>{" "}
                          {formatDateTime(session.start_date)}
                        </p>

                        <p>
                          <strong>Initiated by:</strong>{" "}
                          {session.created_by_name ?? "KUPEXSA Admin"}
                        </p>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
  {checkedInEventIds.has(session.id) ? (
    <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-3 text-sm font-bold text-green-700">
      ✓ Present — attendance recorded
    </div>
  ) : (
    <button
      type="button"
      onClick={() => handleMarkPresent(session)}
      disabled={checkingInId === session.id}
      className="rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {checkingInId === session.id
        ? "Checking Location..."
        : "Mark Myself Present"}
    </button>
  )}

  <button
    type="button"
    onClick={() => handleCloseAttendance(session)}
    disabled={closingId === session.id}
    className="rounded-xl bg-red-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {closingId === session.id
      ? "Closing..."
      : "Close Attendance"}
  </button>
</div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-700">
                    Attendance Records
                  </p>
                  <h2 className="mt-3 text-3xl font-bold text-blue-950">
                    Meeting History
                  </h2>
                  <p className="mt-3 text-gray-600">
                    Open any meeting to view the live or completed attendance list and download it as PDF.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadAdminHistory}
                  className="rounded-xl border border-blue-950 px-5 py-3 text-sm font-bold text-blue-950 transition hover:bg-blue-950 hover:text-white"
                >
                  Refresh History
                </button>
              </div>

              {history.length === 0 ? (
                <p className="mt-8 rounded-2xl bg-gray-50 p-6 text-gray-600">
                  No attendance meeting has been recorded yet.
                </p>
              ) : (
                <div className="mt-8 grid gap-4 lg:grid-cols-2">
                  {history.map((session) => (
                    <button
                      key={session.id}
                      type="button"
                      onClick={() => loadSessionRecords(session)}
                      className="rounded-2xl border border-gray-200 p-5 text-left transition hover:border-blue-300 hover:bg-blue-50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                          session.attendance_closed
                            ? "bg-gray-100 text-gray-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {session.attendance_closed ? "CLOSED" : "ACTIVE"}
                        </span>
                        <span className="font-bold text-yellow-700">
                          {Number(session.total_present)} present
                        </span>
                      </div>
                      <h3 className="mt-4 text-xl font-bold text-blue-950">{session.title}</h3>
                      <p className="mt-2 text-sm text-gray-600">{formatDateTime(session.start_date)}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        Initiated by {session.created_by_name ?? "KUPEXSA Admin"}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {selectedSession && (
                <div className="mt-10 border-t border-gray-200 pt-8">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-700">
                        Attendance List
                      </p>
                      <h3 className="mt-2 text-2xl font-bold text-blue-950">
                        {selectedSession.title}
                      </h3>
                      <p className="mt-2 text-gray-600">{records.length} members present.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => loadSessionRecords(selectedSession)}
                        disabled={loadingRecords}
                        className="rounded-xl border border-blue-950 px-5 py-3 text-sm font-bold text-blue-950"
                      >
                        {loadingRecords ? "Refreshing..." : "Refresh List"}
                      </button>
                      <button
                        type="button"
                        onClick={downloadAttendancePdf}
                        disabled={loadingRecords || records.length === 0}
                        className="rounded-xl bg-blue-950 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-blue-950 text-left text-white">
                        <tr>
                          <th className="px-4 py-3">Full Name</th>
                          <th className="px-4 py-3">Class</th>
                          <th className="px-4 py-3">Phone / WhatsApp</th>
                          <th className="px-4 py-3">Chapter</th>
                          <th className="px-4 py-3">Check-in</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {records.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                              {loadingRecords ? "Loading attendance..." : "No member has marked Present yet."}
                            </td>
                          </tr>
                        ) : (
                          records.map((record) => (
                            <tr key={record.attendance_id}>
                              <td className="px-4 py-3 font-semibold text-blue-950">
                                {record.full_name ?? "Not provided"}
                              </td>
                              <td className="px-4 py-3">
                                {record.badge_year ? `Class of ${record.badge_year}` : "Not provided"}
                              </td>
                              <td className="px-4 py-3">
                                {record.whatsapp ?? record.phone ?? "Not provided"}
                              </td>
                              <td className="px-4 py-3">{record.chapter_name ?? "Not provided"}</td>
                              <td className="px-4 py-3">{formatDateTime(record.check_in_time)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </>
        ) : (
          <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-700">
              Active Meetings
            </p>

            <h2 className="mt-3 text-3xl font-bold text-blue-950">
              Mark Your Attendance
            </h2>

            <p className="mt-3 max-w-3xl leading-7 text-gray-600">
              If you are physically at the meeting location, tap Present. Your
              device will request location access and KUPEXSA will verify that
              you are within the permitted attendance radius.
            </p>

            {sessions.length === 0 ? (
              <div className="mt-8 rounded-2xl bg-gray-50 p-8 text-center">
                <h3 className="text-xl font-bold text-blue-950">
                  No active attendance session
                </h3>
                <p className="mt-3 text-gray-600">
                  The Present button will appear here when an Admin starts
                  attendance for a meeting.
                </p>
              </div>
            ) : (
              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                {sessions.map((session) => {
                  const alreadyPresent = checkedInEventIds.has(session.id);

                  return (
                    <article
                      key={session.id}
                      className="rounded-2xl border border-blue-100 bg-blue-50 p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                          ACTIVE
                        </span>
                        <span className="text-sm font-semibold text-gray-500">
                          {session.attendance_radius_meters ?? 110} m radius
                        </span>
                      </div>

                      <h3 className="mt-4 text-2xl font-bold text-blue-950">
                        {session.title}
                      </h3>

                      <div className="mt-5 space-y-2 text-sm text-gray-600">
                        <p>
                          <strong>Started:</strong>{" "}
                          {formatDateTime(session.start_date)}
                        </p>
                        <p>
                          <strong>Initiated by:</strong>{" "}
                          {session.created_by_name ?? "KUPEXSA Admin"}
                        </p>
                      </div>

                      {alreadyPresent ? (
                        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-5 py-3 text-sm font-bold text-green-700">
                          ✓ Present — attendance recorded
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleMarkPresent(session)}
                          disabled={checkingInId === session.id}
                          className="mt-6 rounded-xl bg-green-700 px-7 py-3 text-sm font-bold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {checkingInId === session.id
                            ? "Checking Location..."
                            : "Present"}
                        </button>
                      )}

                      <p className="mt-4 text-xs leading-5 text-gray-500">
                        Location permission is required. Attendance is accepted
                        only when the backend verifies that you are within the
                        permitted meeting radius.
                      </p>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        <div className="mt-10">
          <Link
            href="/dashboard"
            className="inline-flex rounded-xl border border-blue-950 px-5 py-3 font-bold text-blue-950 transition hover:bg-blue-950 hover:text-white"
          >
            Return to Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}