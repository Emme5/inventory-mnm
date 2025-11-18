"use client";

import { Button } from "../ui/button";
import { Item, ApiMovement } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function StockOverview() {
  const [search, setSearch] = useState("");
  const [stockPage, setStockPage] = useState(1);
  const [movementPage, setMovementPage] = useState(1);

  const stockPerPage = 10;
  const movementPerPage = 20;

    const { data: items = [], isLoading: isItemsLoading } = useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: async () => {
      const res = await fetch("/api/items");
      if (!res.ok) throw new Error("Failed to fetch items");
      return res.json();
    },
  });

  const { data: movements = [] } = useQuery<ApiMovement[]>({
    queryKey: ["movements"],
    queryFn: async () => {
      const res = await fetch("/api/movements");
      if (!res.ok) throw new Error("Failed to fetch movements");
      return res.json();
    },
    refetchInterval: 5000,
  });

  // กรองข้อมูลตาม search
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase())
  );

  const filteredMovements = movements.filter(
    (m) =>
      m.item.name.toLowerCase().includes(search.toLowerCase()) ||
      m.item.code.toLowerCase().includes(search.toLowerCase())
  );

  // pagination สำหรับ stock
  const totalStockPages = Math.ceil(filteredItems.length / stockPerPage);
  const paginatedItems = filteredItems.slice(
    (stockPage - 1) * stockPerPage,
    stockPage * stockPerPage
  );

  // pagination สำหรับ movements
  const totalMovementPages = Math.ceil(
    filteredMovements.length / movementPerPage
  );
  const paginatedMovements = filteredMovements.slice(
    (movementPage - 1) * movementPerPage,
    movementPage * movementPerPage
  );


  if (isItemsLoading) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="space-y-8">
      {/* ตารางสต็อกสินค้า */}
      <section>
        <h2 className="text-lg font-semibold mb-2">ตารางสต็อกสินค้า</h2>

        <input
          type="text"
          placeholder="ค้นหา..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setStockPage(1);
            setMovementPage(1);
          }}
          className="mb-4 px-3 py-2 border rounded w-full"
        />

        {/* Pagination */}
        <div className="flex justify-between items-center pb-3">
          <button
            disabled={stockPage === 1}
            onClick={() => setStockPage(stockPage - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ก่อนหน้า
          </button>
          <span>
            หน้า {stockPage} / {totalStockPages}
          </span>
          <button
            disabled={stockPage === totalStockPages}
            onClick={() => setStockPage(stockPage + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ถัดไป
          </button>
        </div>

        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">ชื่อสินค้า</th>
              <th className="border px-3 py-2">จำนวนคงเหลือ</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item) => (
              <tr key={item.id}>
                <td className="border px-3 py-2">{item.code}</td>
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
            In :{" "}
            {movements
              .filter(
                (m) =>
                  m.type === "in" &&
                  new Date(m.createdAt).toDateString() ===
                    new Date().toDateString()
              )
              .reduce((sum, m) => sum + m.quantity, 0)}{" "}
            ชิ้น
          </div>
          <div className="flex-1 bg-red-100 text-red-700 p-4 rounded">
            Out :{" "}
            {movements
              .filter(
                (m) =>
                  m.type === "out" &&
                  new Date(m.createdAt).toDateString() ===
                    new Date().toDateString()
              )
              .reduce((sum, m) => sum + m.quantity, 0)}{" "}
            ชิ้น
          </div>
        </div>
      </section>

      {/* ประวัติการเคลื่อนไหว */}
      <section>
        <h2 className="text-lg font-semibold mb-2">ประวัติการเคลื่อนไหว</h2>

        <div className="flex justify-between items-center pb-3">
          <button
            disabled={movementPage === 1}
            onClick={() => setMovementPage(movementPage - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ก่อนหน้า
          </button>
          <span>
            หน้า {movementPage} / {totalMovementPages}
          </span>
          <button
            disabled={movementPage === totalMovementPages}
            onClick={() => setMovementPage(movementPage + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ถัดไป
          </button>
        </div>

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
            {paginatedMovements.map((m) => (
              <tr key={m.id}>
                <td className="border px-3 py-2">{m.item.name}</td>
                <td
                  className={`border px-3 py-2 ${
                    m.type === "in" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {m.type === "in" ? "เข้า" : "ออก"}
                </td>
                <td className="border px-3 py-2">{m.quantity}</td>
                <td className="border px-3 py-2">
                  {new Date(m.createdAt).toLocaleString("th-TH", {
                    timeZone: "Asia/Bangkok",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
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
