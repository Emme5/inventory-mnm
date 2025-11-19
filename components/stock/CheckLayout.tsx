"use client";

import { CheckCircle, CircleX } from "lucide-react";
import { Item } from "@/types/type";

type CheckStockProps = {
  items: Item[];
  counts: Record<string, number>;
  checked: Record<string, boolean>;
  onOpenDrawer: (item: Item) => void; // callback เปิด/ปิด accordion
};

export default function CheckLayout({
  items,
  counts,
  checked,
  onOpenDrawer,
}: CheckStockProps) {

return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">ชื่อสินค้า</th>
            <th className="border px-3 py-2">สต็อกในระบบ</th>
            <th className="border px-3 py-2">ผลต่าง</th>
            <th className="border px-3 py-2">สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const actual = counts[item.id] ?? 0;
            const diff = actual - item.quantity;
            const isChecked = checked[item.id] ?? false;

            return (
              <tr key={item.id}>
                <td className="border px-3 py-2">{item.name}</td>
                <td className="border px-3 py-2 text-center">{item.quantity}</td>
                <td className="border px-3 py-2 text-center">
                  {isChecked ? (
                    diff > 0 ? (
                      <span className="text-green-600">+{diff}</span>
                    ) : diff < 0 ? (
                      <span className="text-red-600">{diff}</span>
                    ) : (
                      <span className="text-gray-600">0</span>
                    )
                  ) : (
                    "-"
                  )}
                </td>
                <td className="border px-3 py-2 text-center">
                  <button
                    onClick={() => !isChecked && onOpenDrawer(item)}
                    className="flex items-center gap-1 text-sm"
                  >
                    {isChecked ? (
                      <>
                        <CheckCircle className="text-green-600" size={20} />
                        <span>เช็คแล้ว</span>
                      </>
                    ) : (
                      <>
                        <CircleX className="text-red-600" size={20} />
                        <span>คลิกเพื่อเช็ค</span>
                      </>
                    )}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
