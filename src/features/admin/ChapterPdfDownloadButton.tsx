"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

type PdfMember = {
  number: number;
  fullName: string;
  className: string;
  contact: string;
  status: string;
};

type Props = {
  chapterName: string;
  members: PdfMember[];
};

function safeFileName(value: string) {
  return value.trim().replace(/[<>:"/\\|?*]/g, "").replace(/\s+/g, " ");
}

export default function ChapterPdfDownloadButton({
  chapterName,
  members,
}: Props) {
  const [generating, setGenerating] = useState(false);

  function downloadPdf() {
    try {
      setGenerating(true);

      const title = `${chapterName} Members`;
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(title, 14, 18);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Total Members: ${members.length}`, 14, 25);

      autoTable(doc, {
        startY: 31,
        head: [["#", "Full Name", "Class", "Phone / WhatsApp", "Status"]],
        body: members.map((member) => [
          member.number.toString(),
          member.fullName,
          member.className,
          member.contact,
          member.status,
        ]),
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 2.5,
          overflow: "linebreak",
          valign: "middle",
        },
        headStyles: {
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 10, halign: "center" },
          1: { cellWidth: 53 },
          2: { cellWidth: 34 },
          3: { cellWidth: 49 },
          4: { cellWidth: 30 },
        },
        margin: {
          top: 15,
          right: 14,
          bottom: 15,
          left: 14,
        },
      });

      doc.save(`${safeFileName(title)}.pdf`);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <button
      type="button"
      onClick={downloadPdf}
      disabled={generating || members.length === 0}
      className="inline-flex items-center justify-center rounded-xl bg-yellow-500 px-5 py-3 text-sm font-bold text-blue-950 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {generating ? "Preparing PDF..." : "Download PDF"}
    </button>
  );
}