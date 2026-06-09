import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { createMoyasarPayment } from "@/lib/payments/moyasar";
import { createTapCharge } from "@/lib/payments/tap";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "يجب تسجيل الدخول أولاً" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();

    const {
      addressId, shippingFullName, shippingPhone, shippingCity, shippingDistrict, shippingStreet,
      useNewAddress, shippingMethod, paymentMethod, notes, couponCode,
      items, subtotal, discount, shippingCost, tax, total,
    } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "السلة فارغة" }, { status: 400 });
    }

    // التحقق من المنتجات والمخزون
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product || !product.isActive) {
        return NextResponse.json({ error: `المنتج غير متاح` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `المخزون غير كافٍ لـ ${product.nameAr}` }, { status: 400 });
      }
    }

    // جلب بيانات العنوان
    let shippingAddress: any = {};
    if (addressId && !useNewAddress) {
      const addr = await prisma.address.findFirst({ where: { id: addressId, userId } });
      if (addr) {
        shippingAddress = {
          shippingFullName: addr.fullName,
          shippingPhone: addr.phone,
          shippingCity: addr.city,
          shippingDistrict: addr.district,
          shippingStreet: addr.street,
        };
      }
    } else {
      shippingAddress = { shippingFullName, shippingPhone, shippingCity, shippingDistrict, shippingStreet };
    }

    // إنشاء الطلب
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId,
          addressId: addressId || undefined,
          status: "PENDING",
          paymentStatus: paymentMethod === "cod" ? "PENDING" : "PENDING",
          paymentMethod,
          shippingMethod,
          subtotal,
          shippingCost,
          discount,
          tax,
          total,
          notes,
          couponCode,
          couponDiscount: discount || undefined,
          ...shippingAddress,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              productName: item.productName || "",
              quantity: item.quantity,
              price: item.price,
              total: item.price * item.quantity,
            })),
          },
        },
        include: { items: { include: { product: true } } },
      });

      // تحديث المخزون وأسماء المنتجات
      for (const item of newOrder.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
        await tx.orderItem.update({
          where: { id: item.id },
          data: { productName: item.product.nameAr, productImage: item.product.mainImage },
        });
      }

      // تحديث عداد استخدام الكوبون
      if (couponCode) {
        await tx.coupon.updateMany({
          where: { code: couponCode },
          data: { usageCount: { increment: 1 } },
        });
      }

      return newOrder;
    });

    // إنشاء سجل الشحن
    await prisma.shipping.create({
      data: { orderId: order.id, carrier: shippingMethod, status: "PENDING", cost: shippingCost },
    });

    // معالجة الدفع
    if (paymentMethod === "cod") {
      return NextResponse.json({ orderId: order.id, orderNumber: order.orderNumber });
    }

    const callbackUrl = `${process.env.NEXTAUTH_URL}/api/payments/callback?orderId=${order.id}`;

    try {
      if (paymentMethod.startsWith("moyasar")) {
        const amountInHalala = Math.round(total * 100);
        const sourceType = paymentMethod === "moyasar_applepay" ? "applepay"
          : paymentMethod === "moyasar_mada" ? "creditcard" : "creditcard";

        const payment = await createMoyasarPayment({
          amount: amountInHalala,
          currency: "SAR",
          description: `طلب رقم ${order.orderNumber}`,
          callbackUrl,
          metadata: { orderId: order.id, orderNumber: order.orderNumber },
          source: { type: sourceType },
        });

        await prisma.payment.create({
          data: {
            orderId: order.id,
            amount: total,
            currency: "SAR",
            method: paymentMethod,
            gateway: "moyasar",
            status: "PENDING",
            transactionId: payment.id,
            gatewayResponse: payment,
          },
        });

        return NextResponse.json({ orderId: order.id, paymentUrl: payment.source?.transaction_url });
      }

      if (paymentMethod === "tap") {
        const nameParts = (shippingAddress.shippingFullName || session.user.name || "").split(" ");
        const charge = await createTapCharge({
          amount: total,
          currency: "SAR",
          orderId: order.id,
          customer: {
            firstName: nameParts[0],
            lastName: nameParts.slice(1).join(" "),
            email: session.user.email || undefined,
            phone: shippingAddress.shippingPhone,
          },
          redirect: { url: callbackUrl },
        });

        await prisma.payment.create({
          data: {
            orderId: order.id,
            amount: total,
            currency: "SAR",
            method: "tap",
            gateway: "tap",
            status: "PENDING",
            transactionId: charge.id,
            gatewayResponse: charge,
          },
        });

        return NextResponse.json({ orderId: order.id, paymentUrl: charge.transaction?.url });
      }
    } catch (paymentError: any) {
      console.error("Payment error:", paymentError);
      // إرجاع رقم الطلب حتى لو فشل الدفع - العميل يعيد المحاولة
      return NextResponse.json({ orderId: order.id, orderNumber: order.orderNumber, paymentError: "فشل في الاتصال ببوابة الدفع" });
    }

    return NextResponse.json({ orderId: order.id, orderNumber: order.orderNumber });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "حدث خطأ في إنشاء الطلب" }, { status: 500 });
  }
}

// جلب طلبات المستخدم
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          items: { select: { productName: true, quantity: true, total: true, productImage: true } },
          shipping: { select: { trackingNumber: true, status: true } },
        },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return NextResponse.json({ data: orders, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
