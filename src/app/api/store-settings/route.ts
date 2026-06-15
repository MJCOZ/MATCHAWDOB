export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // بيانات المخصص (البنر، الألوان، الإحصائيات...)
  const customizer = await prisma.setting.findUnique({ where: { key: "customizer_data" } });
  let data: Record<string, any> = {};
  if (customizer) {
    try { data = JSON.parse(customizer.value); } catch { data = {}; }
  }

  // إعدادات الهوية (الشعار / النص أسفله / الاسم) من جدول الإعدادات
  const brandKeys = ["store_logo", "store_tagline", "store_name", "store_name_ar"];
  const brand = await prisma.setting.findMany({ where: { key: { in: brandKeys } } });
  for (const s of brand) {
    if (s.value) data[s.key] = s.value;
  }

  return NextResponse.json(data);
}
