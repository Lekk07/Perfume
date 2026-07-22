import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { apiError, apiOk } from "@/lib/api-response";
import { getCurrentSession } from "@/lib/auth-server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || session.role !== "ADMIN") return apiError("Forbidden.", 403);

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return apiError("Cloudinary isn't configured on the server yet.", 500);
  }

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");
  if (!file || !(file instanceof File)) return apiError("No file provided.", 422);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(base64, {
    folder: "maison-voile/products",
  });

  return apiOk({ url: result.secure_url, publicId: result.public_id });
}
