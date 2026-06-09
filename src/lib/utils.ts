import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// تنسيق العملة السعودية
export function formatPrice(price: number | string): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

// توليد رقم طلب فريد
export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `ORD-${year}${month}${day}-${random}`;
}

// توليد slug من النص العربي أو الإنجليزي
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]/g, "-")
    .replace(/[^\w\-]/g, "")
    .replace(/\-\-+/g, "-");
}

// حساب نسبة الخصم
export function calculateDiscountPercent(original: number, sale: number): number {
  if (!original || original <= sale) return 0;
  return Math.round(((original - sale) / original) * 100);
}

// تنسيق التاريخ بالعربية
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

// ترجمة حالة الطلب
export function translateOrderStatus(status: string): string {
  const statuses: Record<string, string> = {
    PENDING: "بانتظار التأكيد",
    CONFIRMED: "تم التأكيد",
    PROCESSING: "جاري التجهيز",
    SHIPPED: "تم الشحن",
    DELIVERED: "تم التوصيل",
    CANCELLED: "ملغى",
    REFUNDED: "مسترد",
  };
  return statuses[status] || status;
}

// ترجمة حالة الدفع
export function translatePaymentStatus(status: string): string {
  const statuses: Record<string, string> = {
    PENDING: "بانتظار الدفع",
    PAID: "مدفوع",
    FAILED: "فشل الدفع",
    REFUNDED: "مسترد",
    CANCELLED: "ملغى",
  };
  return statuses[status] || status;
}
