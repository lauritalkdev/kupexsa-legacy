import { NextResponse } from "next/server";

import { sendEmail } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type AnnouncementRequest = {
  subject?: string;
  message?: string;
  sendToAll?: boolean;
  selectedEmails?: string[];
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: "You must be logged in." },
        { status: 401 }
      );
    }

    const { data: adminProfile, error: adminProfileError } = await supabase
      .from("profiles")
      .select("id, full_name, role:roles(name)")
      .eq("id", user.id)
      .single();

    type RoleRelation = {
  name: string | null;
};

const roleRelation = adminProfile?.role as
  | RoleRelation
  | RoleRelation[]
  | null
  | undefined;

const roleName = Array.isArray(roleRelation)
  ? roleRelation[0]?.name ?? null
  : roleRelation?.name ?? null;

    if (
      adminProfileError ||
      !adminProfile ||
      roleName !== "Super Admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Only Super Admins can send announcements.",
        },
        { status: 403 }
      );
    }

    const body = (await request.json()) as AnnouncementRequest;

    const subject = body.subject?.trim() || "";
    const message = body.message?.trim() || "";
    const sendToAll = Boolean(body.sendToAll);

    if (!subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject and message are required.",
        },
        { status: 400 }
      );
    }

    let recipients: string[] = [];

    if (sendToAll) {
      const { data: members, error: membersError } = await supabase
        .from("profiles")
        .select("email")
        .not("email", "is", null);

      if (membersError) {
        throw membersError;
      }

      recipients = (members || [])
        .map((member) => member.email?.trim().toLowerCase())
        .filter((email): email is string => Boolean(email));
    } else {
      recipients = (body.selectedEmails || [])
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);
    }

    recipients = [...new Set(recipients)];

    if (recipients.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid recipients were selected.",
        },
        { status: 400 }
      );
    }

    const html = `
      <div style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
        <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
          <div style="background:#071A3D;border-radius:18px 18px 0 0;padding:28px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:28px;">
              KUPEXSA Connect
            </h1>
            <p style="margin:8px 0 0;color:#D4AF37;font-size:14px;font-weight:700;">
              Official Announcement
            </p>
          </div>

          <div style="background:#ffffff;padding:32px;border-radius:0 0 18px 18px;">
            <h2 style="margin:0 0 20px;color:#071A3D;font-size:24px;">
              ${escapeHtml(subject)}
            </h2>

            <div style="font-size:16px;line-height:1.8;color:#333333;white-space:pre-line;">
              ${escapeHtml(message)}
            </div>

            <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;" />

            <p style="margin:0;color:#071A3D;font-size:14px;font-weight:700;">
              KUPEXSA Administration
            </p>

            <p style="margin:6px 0 0;color:#777777;font-size:13px;">
              Kupexsan: Proud to Belong
            </p>

            <p style="margin:8px 0 0;color:#777777;font-size:13px;">
              www.kupexsa.org · info@kupexsa.org
            </p>
          </div>
        </div>
      </div>
    `;

    const text = `${subject}

${message}

KUPEXSA Administration
Kupexsan: Proud to Belong
www.kupexsa.org
info@kupexsa.org`;

    let sentCount = 0;
    const failedEmails: string[] = [];

    for (const recipient of recipients) {
      try {
        await sendEmail({
          to: recipient,
          subject,
          html,
          text,
        });

        sentCount += 1;
      } catch (error) {
        console.error(
          `Announcement email failed for ${recipient}:`,
          error
        );

        failedEmails.push(recipient);
      }
    }

   const { error: logError } = await supabase
  .from("email_logs")
  .insert({
    sender_admin_id: user.id,
    email_type: "announcement",
    subject,
    recipient_count: recipients.length,
    sent_count: sentCount,
    failed_count: failedEmails.length,
    recipient_mode: sendToAll ? "all" : "selected",
  });

if (logError) {
  console.error("Email log could not be recorded:", logError);
}

return NextResponse.json({
  success: failedEmails.length === 0,
  message:
    failedEmails.length === 0
      ? `Announcement sent successfully to ${sentCount} recipient(s).`
      : `Announcement sent to ${sentCount} recipient(s), but ${failedEmails.length} failed.`,
  sentCount,
  failedCount: failedEmails.length,
  failedEmails,
});
  } catch (error) {
    console.error("Announcement send error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "The announcement could not be sent.",
      },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}