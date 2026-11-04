
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PHOTO_ROOT = path.join(
  process.cwd(),
  "src",
  "event-photos"
);

const VISITS = new Set([
  "tombel",
  "buea",
  "tiko",
  "bamenda",
  "yaounde",
  "class-74",
]);

function isAllowedPhoto(chapter: string, filename: string) {
  if (chapter === "fundraising-gala") {
    return [
      "gala-1.png",
      "gala-2.png",
      "gala-3.png",
      "gala-flyer.png",
    ].includes(filename);
  }

  if (!VISITS.has(chapter)) return false;

  return new RegExp(
    `^${chapter}-[1-9][0-9]*\\.png$`
  ).test(filename);
}

export async function GET(
  _request: NextRequest,
  context: {
    params: Promise<{
      chapter: string;
      filename: string;
    }>;
  }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return new NextResponse(
        "Please log in to view KUPEXSA event photographs.",
        {
          status: 401,
          headers: {
            "Cache-Control": "private, no-store",
          },
        }
      );
    }

    const { chapter, filename } = await context.params;

    if (!isAllowedPhoto(chapter, filename)) {
      return new NextResponse("Photograph not found.", {
        status: 404,
      });
    }

    const filePath = path.join(
      PHOTO_ROOT,
      chapter,
      filename
    );

    let photo: Buffer;

    try {
      photo = await fs.readFile(filePath);
    } catch (error) {
      if (
        (error as NodeJS.ErrnoException).code === "ENOENT"
      ) {
        return new NextResponse(
          "Photograph not available.",
          { status: 404 }
        );
      }

      throw error;
    }

    return new NextResponse(
      new Uint8Array(photo),
      {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "private, no-store",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  } catch (error) {
    console.error("KUPEXSA photo error:", error);

    return new NextResponse(
      "Unable to load photograph.",
      {
        status: 500,
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  }
}
