import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
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
      .select("id, role:roles(name)")
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
          message: "Only Super Admins can access this list.",
        },
        { status: 403 }
      );
    }

    const { data: members, error } = await supabase
      .from("profiles")
      .select("id, member_id, full_name, email, status")
      .not("email", "is", null)
      .order("full_name", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      members: members || [],
    });
  } catch (error) {
    console.error("Announcement members error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Member list could not be loaded.",
      },
      { status: 500 }
    );
  }
}