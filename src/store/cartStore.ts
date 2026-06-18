// ================================================
// إدارة حالة سلة التسوق باستخدام Zustand
// ================================================
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getEffectivePrice } from "@/lib/utils";

export interface CartProduct {
  id: string;
  nameAr: string;
  price: number;
  salePrice?: number | null;
  mainImage?: string | null;
  stock: number;
  slug: string;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  coupon: { code: string; discount: number; type: string } | null;
  isOpen: boolean;

  // الإجراءات
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number, type: string) => void;
  removeCoupon: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // المحسوبات
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getShipping: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      isOpen: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.product.id === product.id);

          if (existingItem) {
            const newQty = Math.min(existingItem.quantity + quantity, product.stock);
            return {
              items: state.items.map((item) =>
                item.product.id === product.id ? { ...item, quantity: newQty } : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity: Math.min(quantity, product.stock) }],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.min(quantity, item.product.stock) }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [], coupon: null }),

      applyCoupon: (code, discount, type) => {
        set({ coupon: { code, discount, type } });
      },

      removeCoupon: () => set({ coupon: null }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const price = getEffectivePrice(item.product.price, item.product.salePrice);
          return total + price * item.quantity;
        }, 0);
      },

      getDiscount: () => {
        const { coupon } = get();
        if (!coupon) return 0;

        const subtotal = get().getSubtotal();
        if (coupon.type === "PERCENTAGE") {
          return (subtotal * coupon.discount) / 100;
        } else if (coupon.type === "FIXED") {
          return Math.min(coupon.discount, subtotal);
        }
        return 0;
      },

      getShipping: () => {
        const { coupon } = get();
        if (coupon?.type === "FREE_SHIPPING") return 0;
        const subtotal = get().getSubtotal();
        // شحن مجاني للطلبات فوق 200 ريال
        return subtotal >= 200 ? 0 : 30;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const shipping = get().getShipping();
        // ضريبة القيمة المضافة 15%
        const afterDiscount = subtotal - discount;
        const tax = afterDiscount * 0.15;
        return afterDiscount + tax + shipping;
      },
    }),
    {
      name: "saudi-store-cart",
      // لا نحفظ حالة فتح/إغلاق السلة
      partialize: (state) => ({ items: state.items, coupon: state.coupon }),
    }
  )
);
