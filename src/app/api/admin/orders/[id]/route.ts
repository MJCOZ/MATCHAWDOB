export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  return session?.user && (role === "ADMIN" || role === "SUPER_ADMIN");
}

// تحديث حالة الطلب
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  try {
    const { status, trackingNumber, carrier } = await req.json();

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status, updatedAt: new Date() },
    });

    // تحديث معلومات الشحن إذا تم تقديم رقم التتبع
    if (trackingNumber) {
      await prisma.shipping.updateMany({
        where: { orderId: params.id },
        data: {
          trackingNumber,
          carrier: carrier || undefined,
          status: status === "SHIPPED" ? "SHIPPED" : status === "DELIVERED" ? "DELIVERED" : undefined,
          shippedAt: status === "SHIPPED" ? new Date() : undefined,
          deliveredAt: status === "DELIVERED" ? new Date() : undefined,
        },
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "حدث خطأ في التحديث" }, { status: 500 });
  }
}
