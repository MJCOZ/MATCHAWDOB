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

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(coupons);
}

export async function POST(req: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { code, descriptionAr, type, value, minOrderAmount, usageLimit, expiresAt } = body;

  if (!code || !descriptionAr || !type || value === undefined) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }

  const existing = await prisma.coupon.findUnique({ where: { code } });
  if (existing) return NextResponse.json({ error: "الكود موجود مسبقاً" }, { status: 400 });

  const coupon = await prisma.coupon.create({
    data: {
      code: code.toUpperCase(),
      descriptionAr,
      type,
      value,
      minOrderAmount: minOrderAmount || 0,
      usageLimit: usageLimit || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: true,
    },
  });

  return NextResponse.json(coupon, { status: 201 });
}
