export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// نقطة مؤقتة لإنشاء/تحديث حساب مدير محدد — تُستخدم مرة واحدة ثم تُحذف فوراً
const SETUP_SECRET = "fc2c6a4b36111d0dbaf53c0f2b12318e5fd0fd52955e4e0a";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("secret") !== SETUP_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const email = "mjcoz.bk@gmail.com";
  const hashedPassword = await bcrypt.hash("21436578Mm", 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, role: "SUPER_ADMIN" },
    create: {
      name: "مدير MatchaWdob",
      email,
      password: hashedPassword,
      role: "SUPER_ADMIN",
      phone: "+966500000000",
    },
  });

  return NextResponse.json({ success: true, email: admin.email, role: admin.role });
}
