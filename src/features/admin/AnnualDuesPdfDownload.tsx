
"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { createClient } from "@/lib/supabase/client";

type Relation<T> = T | T[] | null;

type MemberRow = {
  id: string;
  member_id: string | null;
  full_name: string | null;
  custom_chapter: string | null;
  chapter: Relation<{ name: string }>;
  badge: Relation<{ badge_year: number | null }>;
};

type DuesRow = {
  member_id: string;
  year: number;
};

function first<T>(value: Relation<T>): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

function safeFileName(value: string) {
  return value.replace(/[<>:"/\\|?*]/g, "").trim();
}

export default function AnnualDuesPdfDownload() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadAllData() {
    const supabase = createClient();
    const pageSize = 500;

    const members: MemberRow[] = [];
    const dues: DuesRow[] = [];

    // Fetch every member, not just Supabase's first page.
    for (let offset = 0; ; offset += pageSize) {
      const { data, error: queryError } = await supabase
        .from("profiles")
        .select(`
          id,
          member_id,
          full_name,
          custom_chapter,
          chapter:chapters(name),
          badge:badges(badge_year)
        `)
        .order("id", { ascending: true })
        .range(offset, offset + pageSize - 1);

      if (queryError) throw new Error(queryError.message);

      const batch = (data ?? []) as MemberRow[];
      members.push(...batch);

      if (batch.length < pageSize) break;
    }

    // Fetch every recorded annual dues payment.
    for (let offset = 0; ; offset += pageSize) {
      const { data, error: queryError } = await supabase
        .from("annual_dues")
        .select("member_id, year")
        .order("id", { ascending: true })
        .range(offset, offset + pageSize - 1);

      if (queryError) throw new Error(queryError.message);

      const batch = (data ?? []) as DuesRow[];
      dues.push(...batch);

      if (batch.length < pageSize) break;
    }

    return {
      members: members.sort((a, b) =>
        (a.full_name ?? "").localeCompare(b.full_name ?? "")
      ),
      dues,
    };
  }

  function memberDetails(member: MemberRow) {
    return {
      name: member.full_name ?? "KUPEXSA Member",
      kpxId: member.member_id ?? "Not assigned",
      chapter:
        first(member.chapter)?.name ??
        member.custom_chapter ??
        "Not assigned",
      className: first(member.badge)?.badge_year
        ? `Class of ${first(member.badge)?.badge_year}`
        : "Not assigned",
    };
  }

  async function downloadReport(
    reportType: "yearly" | "comprehensive"
  ) {
    if (generating) return;

    try {
      setGenerating(true);
      setError(null);

      if (
        reportType === "yearly" &&
        (!Number.isInteger(year) || year < 1900 || year > 2100)
      ) {
        throw new Error("Select a valid year between 1900 and 2100.");
      }

      const { members, dues } = await loadAllData();

      const paidYearsByMember = new Map<string, number[]>();

      for (const record of dues) {
        const years = paidYearsByMember.get(record.member_id) ?? [];
        years.push(record.year);
        paidYearsByMember.set(record.member_id, years);
      }

      const isYearly = reportType === "yearly";

      const reportMembers = isYearly
        ? members.filter((member) =>
            paidYearsByMember.get(member.id)?.includes(year)
          )
        : members;

      const title = isYearly
        ? `KUPEXSA Annual Global Dues - ${year}`
        : "KUPEXSA Comprehensive Annual Global Dues";

      const doc = new jsPDF({
        orientation: isYearly ? "portrait" : "landscape",
        unit: "mm",
        format: "a4",
      });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(title, 14, 18);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      doc.text(
        isYearly
          ? `Members recorded as paid: ${reportMembers.length}`
          : `Total registered members: ${reportMembers.length}`,
        14,
        25
      );

      const generatedDate = new Date().toLocaleDateString("en-GB");

      doc.text(`Generated: ${generatedDate}`, 14, 31);

      const head = isYearly
        ? [["#", "Full Name", "KPX ID", "Class", "Chapter"]]
        : [[
            "#",
            "Full Name",
            "KPX ID",
            "Class",
            "Chapter",
            "Payment Years",
          ]];

      const body = reportMembers.map((member, index) => {
        const details = memberDetails(member);

        const base = [
          String(index + 1),
          details.name,
          details.kpxId,
          details.className,
          details.chapter,
        ];

        if (isYearly) return base;

        const years = [
          ...new Set(paidYearsByMember.get(member.id) ?? []),
        ].sort((a, b) => b - a);

        return [
          ...base,
          years.length ? years.join(", ") : "No dues recorded",
        ];
      });

      autoTable(doc, {
        startY: 37,
        head,
        body,
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 8,
          cellPadding: 2.5,
          overflow: "linebreak",
          valign: "middle",
        },
        headStyles: {
          fontStyle: "bold",
        },
        columnStyles: isYearly
          ? {
              0: { cellWidth: 10, halign: "center" },
              1: { cellWidth: 52 },
              2: { cellWidth: 32 },
              3: { cellWidth: 32 },
              4: { cellWidth: 56 },
            }
          : {
              0: { cellWidth: 10, halign: "center" },
              1: { cellWidth: 60 },
              2: { cellWidth: 35 },
              3: { cellWidth: 35 },
              4: { cellWidth: 60 },
              5: { cellWidth: 69 },
            },
        margin: {
          top: 15,
          right: 14,
          bottom: 15,
          left: 14,
        },
      });

      doc.save(`${safeFileName(title)}.pdf`);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to generate the PDF report."
      );
    } finally {
      setGenerating(false);
    }
  }

  return (
    <section className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-blue-950">
        Annual Global Dues Reports
      </h2>

      <p className="mt-2 text-sm text-gray-600">
        Download yearly payment records or a comprehensive
        report covering all registered members.
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <div>
          <label
            htmlFor="dues-report-year"
            className="mb-2 block text-sm font-semibold text-blue-950"
          >
            Report Year
          </label>

          <input
            id="dues-report-year"
            type="number"
            min={1900}
            max={2100}
            value={year}
            onChange={(event) =>
              setYear(Number(event.target.value))
            }
            className="w-32 rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        <button
          type="button"
          disabled={generating}
          onClick={() => downloadReport("yearly")}
          className="rounded-xl bg-yellow-500 px-5 py-3 font-bold text-blue-950 hover:bg-yellow-400 disabled:opacity-50"
        >
          {generating ? "Preparing PDF..." : "Download Yearly PDF"}
        </button>

        <button
          type="button"
          disabled={generating}
          onClick={() => downloadReport("comprehensive")}
          className="rounded-xl bg-blue-950 px-5 py-3 font-bold text-white hover:bg-blue-800 disabled:opacity-50"
        >
          Download Comprehensive PDF
        </button>
      </div>

      {error && (
        <p className="mt-4 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </section>
  );
}
