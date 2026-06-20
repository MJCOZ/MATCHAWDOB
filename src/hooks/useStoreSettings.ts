"use client";
import { useEffect, useState } from "react";

export interface StoreSettings {
  store_logo?: string;
  store_tagline?: string;
  store_name?: string;
  store_name_ar?: string;
  store_phone?: string;
  store_email?: string;
  store_address?: string;
  currency_symbol?: string;
}

// ذاكرة مؤقتة مشتركة على مستوى الوحدة لتفادي إعادة الجلب في كل مكون يستخدم الإعدادات
let cache: StoreSettings | null = null;
const listeners = new Set<(s: StoreSettings) => void>();

function fetchSettings() {
  fetch("/api/store-settings")
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (d) {
        cache = d;
        listeners.forEach((l) => l(d));
      }
    })
    .catch(() => {});
}

if (typeof window !== "undefined") {
  // إعادة الجلب فور حفظ الإعدادات من لوحة التحكم لتفادي ظهور بيانات قديمة من الذاكرة المؤقتة
  window.addEventListener("brand-updated", () => {
    cache = null;
    fetchSettings();
  });
}

export function useStoreSettings(): StoreSettings {
  const [settings, setSettings] = useState<StoreSettings>(cache || {});

  useEffect(() => {
    if (!cache) fetchSettings();
    listeners.add(setSettings);
    return () => { listeners.delete(setSettings); };
  }, []);

  return settings;
}
