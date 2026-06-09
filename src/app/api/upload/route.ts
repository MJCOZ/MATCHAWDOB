import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// رفع الصور - للتطوير المحلي يحفظ في public/uploads
// للإنتاج: استبدل بـ Cloudinary أو AWS S3

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session?.user || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "لا يوجد ملف" }, { status: 400 });

    // التحقق من نوع الملف
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "نوع الملف غير مدعوم" }, { status: 400 });
    }

    // التحقق من الحجم (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "حجم الملف يتجاوز 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // إنشاء مجلد رفع الصور
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // اسم ملف فريد
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);

    const url = `/uploads/${filename}`;

    // ملاحظة: في الإنتاج، استخدم Cloudinary:
    // const cloudinary = require('cloudinary').v2;
    // cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, ... });
    // const result = await cloudinary.uploader.upload(filepath);
    // const url = result.secure_url;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "فشل رفع الصورة" }, { status: 500 });
  }
}
