"use client";

interface Props {
  currentSort?: string;
  currentParams: Record<string, string>;
}

export function ProductSortSelect({ currentSort, currentParams }: Props) {
  return (
    <select
      className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#261B6D] bg-white"
      defaultValue={currentSort || "default"}
      onChange={(e) => {
        const url = new URL(window.location.href);
        url.searchParams.set("sort", e.target.value);
        window.location.href = url.toString();
      }}
    >
      <option value="default">الأكثر تميزاً</option>
      <option value="newest">الأحدث</option>
      <option value="price_asc">السعر: من الأقل</option>
      <option value="price_desc">السعر: من الأعلى</option>
    </select>
  );
}
