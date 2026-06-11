export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const setting = await prisma.setting.findUnique({ where: { key: "customizer_data" } });
  if (!setting) return NextResponse.json({});
  try {
    return NextResponse.json(JSON.parse(setting.value));
  } catch {
    return NextResponse.json({});
  }
}
