"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Item, Movement } from "@/types/type";
import { useQuery } from "@tanstack/react-query";

export function StockOverview() {
  const { data: items = [], isLoading } = useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: async () => {
      const res = await fetch("/api/items");
      if (!res.ok) throw new Error("Failed to fetch items");
      return res.json();
    },
  });

  const [movements] = useState<Movement[]>([
    {
      id: 1,
      item: "สินค้า A",
      type: "in",
      quantity: 20,
      date: "2025-11-05 09:00",
    },
    {
      id: 2,
      item: "สินค้า B",
      type: "out",
      quantity: 5,
      date: "2025-11-05 10:15",
    },
  ]);

  if (isLoading) {
  return <div>กำลังโหลดข้อมูล...</div>
}

  return (
    <div className="space-y-8">
      {/* ตารางสต็อกสินค้า */}
      <section>
        <h2 className="text-lg font-semibold mb-2">ตารางสต็อกสินค้า</h2>
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">ชื่อสินค้า</th>
              <th className="border px-3 py-2">จำนวนคงเหลือ</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="border px-3 py-2">{item.id}</td>
                <td className="border px-3 py-2">{item.name}</td>
                <td className="border px-3 py-2">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* จำนวนการเคลื่อนไหวล่าสุด */}
      <section>
        <h2 className="text-lg font-semibold mb-2">
          การเคลื่อนไหวล่าสุด (วันนี้)
        </h2>
        <div className="flex gap-4">
          <div className="flex-1 bg-green-100 text-green-700 p-4 rounded">
            In:{" "}
            {movements
              .filter((m) => m.type === "in")
              .reduce((sum, m) => sum + m.quantity, 0)}
          </div>
          <div className="flex-1 bg-red-100 text-red-700 p-4 rounded">
            Out:{" "}
            {movements
              .filter((m) => m.type === "out")
              .reduce((sum, m) => sum + m.quantity, 0)}
          </div>
        </div>
      </section>

      {/* ประวัติการเคลื่อนไหว */}
      <section>
        <h2 className="text-lg font-semibold mb-2">ประวัติการเคลื่อนไหว</h2>
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">สินค้า</th>
              <th className="border px-3 py-2">ประเภท</th>
              <th className="border px-3 py-2">จำนวน</th>
              <th className="border px-3 py-2">วันที่</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id}>
                <td className="border px-3 py-2">{m.item}</td>
                <td
                  className={`border px-3 py-2 ${
                    m.type === "in" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {m.type === "in" ? "เข้า" : "ออก"}
                </td>
                <td className="border px-3 py-2">{m.quantity}</td>
                <td className="border px-3 py-2">{m.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ปุ่มปรับปรุงสต็อก */}
      <section>
        <Button
          onClick={() => {
            window.location.href = "/dashboard/stock/check";
          }}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          ปรับปรุงสต็อก (Adjust)
        </Button>
      </section>
    </div>
  );
}
