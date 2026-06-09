// ================================================
// أنواع TypeScript المشتركة للمشروع
// ================================================

export interface ProductType {
  id: string;
  nameAr: string;
  nameEn?: string | null;
  slug: string;
  descriptionAr?: string | null;
  price: number;
  salePrice?: number | null;
  stock: number;
  mainImage?: string | null;
  images: string[];
  isFeatured: boolean;
  isNew: boolean;
  isActive: boolean;
  tags: string[];
  category: {
    id: string;
    nameAr: string;
    slug: string;
  };
  _count?: { reviews: number };
}

export interface CategoryType {
  id: string;
  nameAr: string;
  nameEn?: string | null;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive: boolean;
  _count?: { products: number };
  children?: CategoryType[];
}

export interface OrderType {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod?: string | null;
  shippingMethod?: string | null;
  subtotal: number;
  shippingCost: number;
  discount: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItemType[];
  user: { name?: string | null; email: string };
  shipping?: {
    trackingNumber?: string | null;
    status: string;
    carrier: string;
  } | null;
}

export interface OrderItemType {
  id: string;
  productName: string;
  productImage?: string | null;
  quantity: number;
  price: number;
  total: number;
  product?: { slug: string; nameAr: string };
}

export interface UserType {
  id: string;
  name?: string | null;
  email: string;
  phone?: string | null;
  role: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";
  createdAt: string;
  _count?: { orders: number };
}

export interface AddressType {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  street: string;
  buildingNo?: string | null;
  postalCode?: string | null;
  isDefault: boolean;
}

export interface CouponType {
  id: string;
  code: string;
  descriptionAr?: string | null;
  type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  value: number;
  minOrderAmount?: number | null;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usageCount: number;
  isActive: boolean;
  expiresAt?: string | null;
}

// للصفحات المقسمة
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// إعدادات المتجر
export interface StoreSettings {
  storeName: string;
  storePhone: string;
  storeEmail: string;
  storeAddress: string;
  currency: string;
  vatRate: number;
  freeShippingThreshold: number;
  defaultShippingCost: number;
}
