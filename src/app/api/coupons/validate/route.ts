export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "كوبون الخصم مطلوب" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

    if (!coupon) {
      return NextResponse.json({ error: "كوبون الخصم غير موجود" }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "هذا الكوبون غير نشط" }, { status: 400 });
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json({ error: "انتهت صلاحية هذا الكوبون" }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "تجاوز هذا الكوبون الحد الأقصى للاستخدام" }, { status: 400 });
    }

    if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
      return NextResponse.json({
        error: `الحد الأدنى للطلب ${coupon.minOrderAmount} ريال لاستخدام هذا الكوبون`
      }, { status: 400 });
    }

    return NextResponse.json({
      code: coupon.code,
      type: coupon.type,
      value: Number(coupon.value),
      description: coupon.descriptionAr,
    });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
