import { NextResponse } from "next/server";

import { sendEmail } from "@/lib/email";
import { buildRegistrationEmail } from "@/lib/registrationEmail";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in to request this email.",
        },
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, email, status")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Member profile could not be found.",
        },
        { status: 404 }
      );
    }

    if (profile.status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          message: "Registration email is only available for pending accounts.",
        },
        { status: 400 }
      );
    }

    const registrationEmail = buildRegistrationEmail({
      fullName: profile.full_name || "KUPEXSA Member",
      email: profile.email,
    });

    await sendEmail({
      to: profile.email,
      subject: registrationEmail.subject,
      html: registrationEmail.html,
      text: registrationEmail.text,
    });

    return NextResponse.json({
      success: true,
      message: "Registration email sent successfully.",
    });
  } catch (error) {
    console.error("Registration email failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Registration email could not be sent.",
      },
      { status: 500 }
    );
  }
}