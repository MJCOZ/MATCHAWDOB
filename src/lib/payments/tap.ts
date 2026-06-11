// ================================================
// تكامل بوابة دفع Tap Payments
// وثائق: https://developers.tap.company
// ================================================

const TAP_API_URL = "https://api.tap.company/v2";

interface TapChargeParams {
  amount: number;
  currency: string;       // SAR
  description?: string;
  orderId: string;
  customer: {
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  redirect: {
    url: string;          // رابط الإعادة بعد الدفع
  };
  source?: {
    id: string;           // "src_all" لجميع طرق الدفع
  };
}

// إنشاء عملية شحن (Charge)
export async function createTapCharge(params: TapChargeParams) {
  const secretKey = process.env.TAP_SECRET_KEY;
  if (!secretKey) throw new Error("TAP_SECRET_KEY غير موجود في .env");

  const response = await fetch(`${TAP_API_URL}/charges`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    },
    body: JSON.stringify({
      amount: params.amount,
      currency: params.currency,
      description: params.description || `طلب رقم ${params.orderId}`,
      order: { id: params.orderId },
      customer: {
        first_name: params.customer.firstName,
        last_name: params.customer.lastName,
        email: params.customer.email,
        phone: {
          country_code: "966",
          number: params.customer.phone,
        },
      },
      source: params.source || { id: "src_all" }, // يعرض جميع طرق الدفع
      redirect: { url: params.redirect.url },
      post: { url: params.redirect.url }, // webhook
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Tap Error: ${JSON.stringify(error)}`);
  }

  return response.json();
}

// استرداد حالة الـ Charge
export async function getTapCharge(chargeId: string) {
  const secretKey = process.env.TAP_SECRET_KEY;
  if (!secretKey) throw new Error("TAP_SECRET_KEY غير موجود في .env");

  const response = await fetch(`${TAP_API_URL}/charges/${chargeId}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Tap Error: ${JSON.stringify(error)}`);
  }
  return response.json();
}

// استرداد مبلغ
export async function createTapRefund(chargeId: string, amount: number) {
  const secretKey = process.env.TAP_SECRET_KEY;
  if (!secretKey) throw new Error("TAP_SECRET_KEY غير موجود في .env");

  const response = await fetch(`${TAP_API_URL}/refunds`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    },
    body: JSON.stringify({
      charge_id: chargeId,
      amount,
      currency: "SAR",
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Tap Refund Error: ${JSON.stringify(error)}`);
  }
  return response.json();
}
