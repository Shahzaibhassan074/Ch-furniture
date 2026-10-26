import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

const ALLOWED_FORMATS = "jpg,jpeg,png,webp,avif,mp4";
const MAX_BYTES = 104857600; // 100 MB

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign: Record<string, string | number> = {
    allowed_formats: ALLOWED_FORMATS,
    folder: "ch-furniture",
    max_bytes: MAX_BYTES,
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return NextResponse.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    folder: "ch-furniture",
    allowedFormats: ALLOWED_FORMATS,
    maxBytes: MAX_BYTES,
  });
}
