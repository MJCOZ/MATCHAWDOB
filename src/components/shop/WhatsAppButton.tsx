"use client";
import { useState } from "react";
import { X, MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966500000000";

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-end gap-3">
      {/* نافذة المحادثة */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-[#eeedf8] w-72 overflow-hidden animate-fadeInUp">
          {/* رأس */}
          <div className="bg-[#261B6D] text-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#B2DE81]/20 rounded-full flex items-center justify-center border border-[#B2DE81]/30">
              <svg viewBox="0 0 24 24" fill="#B2DE81" className="w-6 h-6">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm">MatchaWoob ✦</p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-[#B2DE81] rounded-full animate-pulse"></div>
                <p className="text-xs text-[#B2DE81]/80">متاح الآن</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="mr-auto text-[#B2DE81]/60 hover:text-[#B2DE81]">
              <X size={18} />
            </button>
          </div>
          {/* رسالة */}
          <div className="p-4">
            <div className="bg-[#eeedf8] rounded-2xl rounded-tr-none p-3 mb-4">
              <p className="text-sm text-[#261B6D]">
                🍵 أهلاً بك في عالم MatchaWoob!<br />
                كيف يمكننا مساعدتك اليوم؟ ✦
              </p>
              <p className="text-xs text-gray-400 mt-1">الآن</p>
            </div>
            <a
              href={`https://wa.me/${whatsapp}?text=مرحباً MatchaWoob، أريد الاستفسار عن`}
              target="_blank"
              className="bg-[#261B6D] hover:bg-[#352a8a] text-white text-sm font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle size={18} className="text-[#B2DE81]" />
              ابدأ المحادثة
            </a>
          </div>
        </div>
      )}

      {/* زر واتساب */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#261B6D] hover:bg-[#352a8a] text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-[#B2DE81]/30"
        aria-label="تواصل معنا"
      >
        {isOpen ? (
          <X size={24} className="text-[#B2DE81]" />
        ) : (
          <svg viewBox="0 0 24 24" fill="#B2DE81" className="w-7 h-7">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        )}
      </button>
    </div>
  );
}
