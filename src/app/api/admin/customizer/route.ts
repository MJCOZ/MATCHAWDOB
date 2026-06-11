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

  const setting = await prisma.setting.findUnique({ where: { key: "customizer_data" } });
  if (!setting) return NextResponse.json(null);
  try {
    return NextResponse.json(JSON.parse(setting.value));
  } catch {
    return NextResponse.json(null);
  }
}

export async function PUT(req: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await prisma.setting.upsert({
    where: { key: "customizer_data" },
    update: { value: JSON.stringify(body) },
    create: { key: "customizer_data", value: JSON.stringify(body), group: "customizer" },
  });
  return NextResponse.json({ success: true });
}
