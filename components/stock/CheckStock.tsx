"use client";

import { CheckCircle, CircleX } from "lucide-react";
import { Item } from "@/types/type";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

type CheckStockProps = {
  items: Item[];
  counts: Record<string, number>;
  notes: Record<string, string>;
  checked: Record<string, boolean>;
  onCountChange: (id: string, value: string) => void;
  onNoteChange: (id: string, value: string) => void;
  onSave: (id: string) => void;
};

export default function CheckStock({
  items,
  counts,
  notes,
  checked,
  onCountChange,
  onNoteChange,
  onSave,
}: CheckStockProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">ปรับปรุงสต็อกสินค้า</h2>

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
                    {isChecked ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : (
                      <CircleX className="text-red-600" size={20} />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Accordion สำหรับรายการที่ยังไม่เช็ค */}
      <Accordion type="single" collapsible className="w-full">
        {items.map((item) => {
          const actual = counts[item.id] ?? 0;
          const diff = actual - item.quantity;
          const note = notes[item.id] ?? "";
          const isChecked = checked[item.id] ?? false;

          if (isChecked) return null;

          return (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>
                <div className="flex justify-between w-full text-sm">
                  <span>{item.name}</span>
                  <span className="text-gray-500">ตรวจเช็คสินค้า</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 p-3 text-sm">
                  <div>
                    <strong>Barcode:</strong> {item.barcode}
                  </div>
                  <div>
                    <strong>จำนวนที่นับจริง:</strong>
                    <input
                      type="number"
                      value={actual}
                      onChange={(e) => onCountChange(item.id, e.target.value)}
                      className="ml-2 w-24 border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <strong>ผลต่าง:</strong>{" "}
                    {diff > 0 ? (
                      <span className="text-green-600">+{diff}</span>
                    ) : diff < 0 ? (
                      <span className="text-red-600">{diff}</span>
                    ) : (
                      <span className="text-gray-600">0</span>
                    )}
                  </div>
                  <div>
                    <strong>หมายเหตุ:</strong>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => onNoteChange(item.id, e.target.value)}
                      placeholder="เหตุผล..."
                      className="ml-2 w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => onSave(item.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      บันทึก
                    </button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
