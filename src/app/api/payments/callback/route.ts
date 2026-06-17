export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMoyasarPayment } from "@/lib/payments/moyasar";
import { getTapCharge } from "@/lib/payments/tap";

// معالجة استجابة بوابة الدفع بعد إتمام العملية
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  const paymentId = searchParams.get("id") || searchParams.get("tap_id");
  const status = searchParams.get("status");

  if (!orderId) {
    return NextResponse.redirect(new URL("/orders", req.url));
  }

  try {
    const session = await getServerSession(authOptions);
    const order = await prisma.order.findUnique({ where: { id: orderId }, select: { userId: true } });

    if (!order || (session?.user && (session.user as any).id !== order.userId)) {
      return NextResponse.redirect(new URL("/orders", req.url));
    }

    const payment = await prisma.payment.findUnique({ where: { orderId } });

    if (!payment) {
      return NextResponse.redirect(new URL(`/orders/${orderId}?error=1`, req.url));
    }

    let isSuccess = false;

    // التحقق من Moyasar
    if (payment.gateway === "moyasar" && paymentId) {
      const moyasarPayment = await getMoyasarPayment(paymentId);
      isSuccess = moyasarPayment.status === "paid";

      await prisma.payment.update({
        where: { orderId },
        data: {
          status: isSuccess ? "PAID" : "FAILED",
          transactionId: paymentId,
          gatewayResponse: moyasarPayment,
          paidAt: isSuccess ? new Date() : undefined,
        },
      });
    }

    // التحقق من Tap
    if (payment.gateway === "tap" && paymentId) {
      const tapCharge = await getTapCharge(paymentId);
      isSuccess = tapCharge.status === "CAPTURED";

      await prisma.payment.update({
        where: { orderId },
        data: {
          status: isSuccess ? "PAID" : "FAILED",
          transactionId: paymentId,
          gatewayResponse: tapCharge,
          paidAt: isSuccess ? new Date() : undefined,
        },
      });
    }

    // تحديث حالة الطلب
    if (isSuccess) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "CONFIRMED",
          paymentStatus: "PAID",
        },
      });
    }

    const redirectUrl = isSuccess
      ? `/orders/${orderId}?success=1`
      : `/orders/${orderId}?payment_failed=1`;

    return NextResponse.redirect(new URL(redirectUrl, req.url));
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.redirect(new URL(`/orders/${orderId}?error=1`, req.url));
  }
}
