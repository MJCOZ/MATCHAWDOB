export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  return session && (role === "ADMIN" || role === "SUPER_ADMIN");
}

export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const settings = await prisma.setting.findMany({ orderBy: { group: "asc" } });
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    await Promise.all(
      Object.entries(body).map(([key, value]) =>
        prisma.setting.upsert({
          where:  { key },
          update: { value: String(value) },
          create: { key, value: String(value), group: "general" },
        })
      )
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "فشل الحفظ" }, { status: 500 });
  }
}
