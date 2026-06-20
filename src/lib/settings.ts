import { prisma } from "@/lib/prisma";
import { DEFAULT_CURRENCY_SYMBOL } from "@/lib/utils";

// رمز العملة الحالي من إعدادات المتجر — يُستخدم في الصفحات والمكونات الخادمية (Server Components)
export async function getCurrencySymbol(): Promise<string> {
  const setting = await prisma.setting.findUnique({ where: { key: "currency_symbol" } });
  return setting?.value || DEFAULT_CURRENCY_SYMBOL;
}
