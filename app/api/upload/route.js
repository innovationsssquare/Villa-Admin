// app/api/upload/route.js
import cloudinary from "@/lib/cloudinary"

export const dynamic = "force-dynamic"

export async function POST(req) {
  try {
    const { file } = await req.json() // base64 string

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    const result = await cloudinary.uploader.upload(file, {
      folder: "xyz", // optional
    })

    return Response.json({ success: true, url: result.secure_url })
  } catch (err) {
    console.error("Cloudinary upload error:", err)
    return Response.json({ error: "Upload failed" }, { status: 500 })
  }
}
