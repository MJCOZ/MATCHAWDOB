// ================================================
// تكامل بوابة دفع Moyasar
// الأكثر شيوعاً في المملكة العربية السعودية
// وثائق: https://moyasar.com/docs
// ================================================

const MOYASAR_API_URL = "https://api.moyasar.com/v1";

interface MoyasarPaymentParams {
  amount: number;        // المبلغ بالهللة (ريال × 100)
  currency: string;      // SAR
  description: string;
  callbackUrl: string;   // رابط الإعادة بعد الدفع
  metadata?: Record<string, string>;
  source: {
    type: "creditcard" | "applepay" | "stcpay";
    name?: string;
    number?: string;
    cvc?: string;
    month?: string;
    year?: string;
    token?: string;
  };
}

// إنشاء عملية دفع جديدة
export async function createMoyasarPayment(params: MoyasarPaymentParams) {
  const secretKey = process.env.MOYASAR_SECRET_KEY;
  if (!secretKey) throw new Error("MOYASAR_SECRET_KEY غير موجود في .env");

  const response = await fetch(`${MOYASAR_API_URL}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // التوثيق عبر Basic Auth باستخدام المفتاح السري
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
    },
    body: JSON.stringify({
      amount: params.amount,
      currency: params.currency,
      description: params.description,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
      source: params.source,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Moyasar Error: ${JSON.stringify(error)}`);
  }

  return response.json();
}

// التحقق من حالة الدفع
export async function getMoyasarPayment(paymentId: string) {
  const secretKey = process.env.MOYASAR_SECRET_KEY;
  if (!secretKey) throw new Error("MOYASAR_SECRET_KEY غير موجود في .env");

  const response = await fetch(`${MOYASAR_API_URL}/payments/${paymentId}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
    },
  });

  return response.json();
}

// استرداد مبلغ
export async function refundMoyasarPayment(paymentId: string, amount: number) {
  const secretKey = process.env.MOYASAR_SECRET_KEY;
  if (!secretKey) throw new Error("MOYASAR_SECRET_KEY غير موجود في .env");

  const response = await fetch(`${MOYASAR_API_URL}/payments/${paymentId}/refund`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
    },
    body: JSON.stringify({ amount_cents: amount }),
  });

  return response.json();
}

// التحقق من صحة الـ webhook
export function verifyMoyasarWebhook(payload: string, signature: string): boolean {
  const crypto = require("crypto");
  const secretKey = process.env.MOYASAR_SECRET_KEY || "";
  const hash = crypto.createHmac("sha256", secretKey).update(payload).digest("hex");
  return hash === signature;
}
