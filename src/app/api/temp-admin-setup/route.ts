export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// نقطة مؤقتة لحذف حساب المدير القديم — تُستخدم مرة واحدة ثم تُحذف فوراً
const SETUP_SECRET = "9e6d8c28a8b53758db621a8355894616ee46bd56c7b74d00";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("secret") !== SETUP_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const email = "admin@matchwdob.sa";
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ success: true, message: "already gone" });
  }

  await prisma.user.delete({ where: { email } });

  return NextResponse.json({ success: true, deleted: email });
}
