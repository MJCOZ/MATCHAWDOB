// ================================================
// مخططات التحقق من البيانات باستخدام Zod
// ================================================
import { z } from "zod";

// التسجيل
export const registerSchema = z.object({
  name: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z
    .string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير")
    .regex(/[0-9]/, "يجب أن تحتوي على رقم"),
  phone: z.string().regex(/^(\+966|0)?[5][0-9]{8}$/, "رقم الجوال غير صحيح").optional(),
});

// تسجيل الدخول
export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

// المنتج
export const productSchema = z.object({
  nameAr: z.string().min(3, "اسم المنتج مطلوب"),
  nameEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  price: z.number().min(0.01, "السعر يجب أن يكون أكبر من صفر"),
  salePrice: z.number().optional().nullable(),
  stock: z.number().int().min(0, "المخزون لا يمكن أن يكون سالباً"),
  categoryId: z.string().min(1, "التصنيف مطلوب"),
  sku: z.string().optional(),
  weight: z.number().optional().nullable(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  isNew: z.boolean().optional(),
});

// التصنيف
export const categorySchema = z.object({
  nameAr: z.string().min(2, "اسم التصنيف مطلوب"),
  nameEn: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

// العنوان
export const addressSchema = z.object({
  fullName: z.string().min(3, "الاسم الكامل مطلوب"),
  phone: z.string().regex(/^(\+966|0)?[5][0-9]{8}$/, "رقم الجوال غير صحيح"),
  city: z.string().min(2, "المدينة مطلوبة"),
  district: z.string().min(2, "الحي مطلوب"),
  street: z.string().min(3, "الشارع مطلوب"),
  buildingNo: z.string().optional(),
  postalCode: z.string().optional(),
  isDefault: z.boolean().optional(),
});

// الطلب
export const orderSchema = z.object({
  addressId: z.string().optional(),
  shippingMethod: z.string().min(1, "طريقة الشحن مطلوبة"),
  paymentMethod: z.string().min(1, "طريقة الدفع مطلوبة"),
  notes: z.string().optional(),
  couponCode: z.string().optional(),
  // بيانات التوصيل المباشرة (إذا لم يختر عنواناً محفوظاً)
  shippingFullName: z.string().optional(),
  shippingPhone: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingDistrict: z.string().optional(),
  shippingStreet: z.string().optional(),
});

// الكوبون
export const couponSchema = z.object({
  code: z.string().min(3, "رمز الكوبون مطلوب").toUpperCase(),
  descriptionAr: z.string().optional(),
  type: z.enum(["PERCENTAGE", "FIXED", "FREE_SHIPPING"]),
  value: z.number().min(0),
  minOrderAmount: z.number().optional().nullable(),
  maxDiscount: z.number().optional().nullable(),
  usageLimit: z.number().int().optional().nullable(),
  userLimit: z.number().int().optional().nullable(),
  isActive: z.boolean().optional(),
  expiresAt: z.string().optional().nullable(),
});

// تحديث حالة الطلب
export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]),
  trackingNumber: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type CouponInput = z.infer<typeof couponSchema>;
