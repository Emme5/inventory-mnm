"use client";

import { CheckCircle, CircleX, Eye } from "lucide-react";
import { Item } from "@/types/type";
import { CheckedEntry } from "@/types/type";

type CheckLayoutProps = {
  items: Item[];
  details: Record<string, CheckedEntry>;
  checked: Record<string, boolean>;
  onOpenDrawer: (item: Item) => void;
  onOpenDetail: (item: Item) => void;
};

const reasonLabels: Record<
  "cycle_count" | "received" | "damaged" | "lost" | "return",
  string
> = {
  cycle_count: "ตรวจนับประจำรอบ (Cycle Count)",
  received: "รับสินค้าเข้า (Received)",
  damaged: "สินค้าชำรุด/เสียหาย (Damaged)",
  lost: "สินค้าสูญหาย (Lost)",
  return: "รับคืน (Return)",
};

export default function CheckLayout({
  items,
  details,
  checked,
  onOpenDrawer,
  onOpenDetail,
}: CheckLayoutProps) {
  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-semibold pb-4">ปรับปรุงสต็อกสินค้า</h2>
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-6">ชื่อสินค้า</th>
            <th className="border px-3 py-6">สต็อกในระบบ</th>
            <th className="border px-3 py-6">ผลต่าง</th>
            <th className="border px-3 py-6">สถานะ</th>
            <th className="border px-3 py-6">เหตุผล</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const detail = details[item.id];
            const actual = detail?.actualCount ?? 0;
            const diff = actual - item.quantity;
            const isChecked = checked[item.id] ?? false;

            return (
              <tr key={item.id}>
                <td className="border px-3 py-6">{item.name}</td>
                <td className="border px-3 py-6 text-center">
                  {item.quantity}
                </td>
                <td className="border px-3 py-6 text-center">
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
                  {isChecked ? (
                    <div className="flex items-center justify-center gap-4">
                      <CheckCircle className="text-green-500" size={20} />
                      <button
                        onClick={() => onOpenDetail(item)}
                        className="flex items-center gap-1 text-sm px-2 py-1 bg-gray-500 text-white rounded"
                      >
                        <Eye className="text-white" size={18} />
                        <span>ดูรายละเอียด</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onOpenDrawer(item)}
                      className="flex items-center gap-1 text-sm"
                    >
                      <CircleX className="text-red-600" size={20} />
                      <span>คลิกเพื่อเช็ค</span>
                    </button>
                  )}
                </td>
                <td className="border px-3 py-6 text-center">
                  {detail?.reason ? reasonLabels[detail.reason] : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
