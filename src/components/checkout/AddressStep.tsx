"use client";
import { useState } from "react";
import { MapPin, Plus } from "lucide-react";

interface AddressStepProps {
  addresses: any[];
  orderData: any;
  setOrderData: (data: any) => void;
  onNext: () => void;
}

const SAUDI_CITIES = [
  "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام",
  "الخبر", "الظهران", "تبوك", "بريدة", "خميس مشيط", "أبها",
  "الهفوف", "الطائف", "نجران", "جيزان", "ينبع", "حائل",
];

export function AddressStep({ addresses, orderData, setOrderData, onNext }: AddressStepProps) {
  const [showNewForm, setShowNewForm] = useState(orderData.useNewAddress);

  const isValid = orderData.useNewAddress
    ? orderData.shippingFullName && orderData.shippingPhone && orderData.shippingCity && orderData.shippingDistrict && orderData.shippingStreet
    : orderData.addressId;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MapPin size={22} className="text-orange-500" />
        عنوان التوصيل
      </h2>

      {/* العناوين المحفوظة */}
      {addresses.length > 0 && (
        <div className="space-y-3 mb-6">
          {addresses.map((addr) => (
            <label key={addr.id} className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
              orderData.addressId === addr.id && !showNewForm ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-gray-300"
            }`}>
              <input
                type="radio"
                name="address"
                value={addr.id}
                checked={orderData.addressId === addr.id && !showNewForm}
                onChange={() => {
                  setOrderData({ ...orderData, addressId: addr.id, useNewAddress: false });
                  setShowNewForm(false);
                }}
                className="mt-1 accent-orange-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">{addr.fullName}</p>
                  {addr.isDefault && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">الافتراضي</span>}
                </div>
                <p className="text-sm text-gray-600 mt-0.5">
                  {addr.district}، {addr.city}
                </p>
                <p className="text-sm text-gray-500">{addr.street}</p>
                <p className="text-sm text-gray-600">{addr.phone}</p>
              </div>
            </label>
          ))}

          {/* زر عنوان جديد */}
          <button
            onClick={() => {
              setShowNewForm(true);
              setOrderData({ ...orderData, useNewAddress: true, addressId: "" });
            }}
            className={`flex items-center gap-3 p-4 border-2 border-dashed rounded-xl w-full transition-colors ${
              showNewForm ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-300 text-gray-500 hover:border-gray-400"
            }`}
          >
            <Plus size={20} />
            <span className="text-sm font-medium">إضافة عنوان جديد</span>
          </button>
        </div>
      )}

      {/* نموذج عنوان جديد */}
      {(showNewForm || addresses.length === 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">الاسم الكامل *</label>
            <input
              type="text"
              className="input-field"
              placeholder="محمد عبدالله"
              value={orderData.shippingFullName}
              onChange={(e) => setOrderData({ ...orderData, shippingFullName: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">رقم الجوال *</label>
            <input
              type="tel"
              className="input-field"
              placeholder="05xxxxxxxx"
              value={orderData.shippingPhone}
              onChange={(e) => setOrderData({ ...orderData, shippingPhone: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">المدينة *</label>
            <select
              className="input-field"
              value={orderData.shippingCity}
              onChange={(e) => setOrderData({ ...orderData, shippingCity: e.target.value })}
            >
              <option value="">اختر المدينة</option>
              {SAUDI_CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">الحي *</label>
            <input
              type="text"
              className="input-field"
              placeholder="حي النزهة"
              value={orderData.shippingDistrict}
              onChange={(e) => setOrderData({ ...orderData, shippingDistrict: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-700 block mb-1.5">الشارع ورقم المبنى *</label>
            <input
              type="text"
              className="input-field"
              placeholder="شارع الملك فهد، بناية رقم 12"
              value={orderData.shippingStreet}
              onChange={(e) => setOrderData({ ...orderData, shippingStreet: e.target.value })}
            />
          </div>
        </div>
      )}

      <button
        onClick={onNext}
        disabled={!isValid}
        className="btn-primary w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        متابعة ← اختيار الشحن
      </button>
    </div>
  );
}
