export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { createMoyasarPayment } from "@/lib/payments/moyasar";
import { createTapCharge } from "@/lib/payments/tap";

// تطابق منطق حساب الشحن والضريبة في src/store/cartStore.ts — مصدر الحقيقة الوحيد للسعر هو الخادم
const FREE_SHIPPING_THRESHOLD = 200;
const DEFAULT_SHIPPING_COST = 30;
const VAT_RATE = 0.15;

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
      items,
    } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "السلة فارغة" }, { status: 400 });
    }

    // نحسب الأسعار والمخزون من قاعدة البيانات فقط، ولا نثق بأي قيمة سعر يرسلها العميل
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i: any) => i.productId) } },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const resolvedItems: { productId: string; quantity: number; price: number }[] = [];
    for (const item of items) {
      const product = productMap.get(item.productId);
      const quantity = Number(item.quantity);
      if (!product || !product.isActive) {
        return NextResponse.json({ error: "المنتج غير متاح" }, { status: 400 });
      }
      if (!Number.isInteger(quantity) || quantity < 1) {
        return NextResponse.json({ error: "كمية غير صالحة" }, { status: 400 });
      }
      if (product.stock < quantity) {
        return NextResponse.json({ error: `المخزون غير كافٍ لـ ${product.nameAr}` }, { status: 400 });
      }
      const price = Number(product.salePrice ?? product.price);
      subtotal += price * quantity;
      resolvedItems.push({ productId: product.id, quantity, price });
    }

    // التحقق من الكوبون وحساب الخصم من بيانات الكوبون الفعلية في قاعدة البيانات فقط
    let discount = 0;
    let isFreeShipping = false;
    let validCouponCode: string | null = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: String(couponCode).toUpperCase() } });
      const now = new Date();
      const couponUsable =
        !!coupon &&
        coupon.isActive &&
        (!coupon.expiresAt || coupon.expiresAt > now) &&
        (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit) &&
        (!coupon.minOrderAmount || subtotal >= Number(coupon.minOrderAmount));

      if (!couponUsable || !coupon) {
        return NextResponse.json({ error: "كوبون الخصم غير صالح" }, { status: 400 });
      }

      if (coupon.userLimit) {
        const usedByUser = await prisma.order.count({
          where: { userId, couponCode: coupon.code, status: { not: "CANCELLED" } },
        });
        if (usedByUser >= coupon.userLimit) {
          return NextResponse.json({ error: "لقد استخدمت هذا الكوبون من قبل" }, { status: 400 });
        }
      }

      validCouponCode = coupon.code;
      if (coupon.type === "PERCENTAGE") {
        discount = (subtotal * Number(coupon.value)) / 100;
      } else if (coupon.type === "FIXED") {
        discount = Math.min(Number(coupon.value), subtotal);
      } else if (coupon.type === "FREE_SHIPPING") {
        isFreeShipping = true;
      }
      if (coupon.maxDiscount) {
        discount = Math.min(discount, Number(coupon.maxDiscount));
      }
    }

    const shippingCost = isFreeShipping ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_COST;
    const afterDiscount = subtotal - discount;
    const tax = afterDiscount * VAT_RATE;
    const total = afterDiscount + tax + shippingCost;

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
    let order;
    try {
      order = await prisma.$transaction(async (tx) => {
        // خصم المخزون بشكل ذرّي (تحقّق وتحديث في استعلام واحد) لمنع البيع الزائد عند الطلبات المتزامنة
        for (const item of resolvedItems) {
          const result = await tx.product.updateMany({
            where: { id: item.productId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
          if (result.count === 0) {
            throw new Error(`STOCK:${item.productId}`);
          }
        }

        const newOrder = await tx.order.create({
          data: {
            orderNumber: generateOrderNumber(),
            userId,
            addressId: addressId || undefined,
            status: "PENDING",
            paymentStatus: "PENDING",
            paymentMethod,
            shippingMethod,
            subtotal,
            shippingCost,
            discount,
            tax,
            total,
            notes,
            couponCode: validCouponCode || undefined,
            couponDiscount: discount || undefined,
            ...shippingAddress,
            items: {
              create: resolvedItems.map((item) => {
                const product = productMap.get(item.productId)!;
                return {
                  productId: item.productId,
                  productName: product.nameAr,
                  productImage: product.mainImage,
                  quantity: item.quantity,
                  price: item.price,
                  total: item.price * item.quantity,
                };
              }),
            },
          },
          include: { items: { include: { product: true } } },
        });

        // تحديث عداد استخدام الكوبون
        if (validCouponCode) {
          await tx.coupon.updateMany({
            where: { code: validCouponCode },
            data: { usageCount: { increment: 1 } },
          });
        }

        return newOrder;
      });
    } catch (e: any) {
      if (typeof e?.message === "string" && e.message.startsWith("STOCK:")) {
        const productId = e.message.split(":")[1];
        const product = productMap.get(productId);
        return NextResponse.json(
          { error: `المخزون غير كافٍ لـ ${product?.nameAr || "أحد المنتجات"}` },
          { status: 400 }
        );
      }
      throw e;
    }

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
