"use client";

import { Button } from "../ui/button";
import { ApiMovement } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import StockControl from "./StockControl";

export default function StockOverview() {
  const [search, setSearch] = useState("");
  const [movementPage, setMovementPage] = useState(1);

  const movementPerPage = 20;

  const { data: movements = [] } = useQuery<ApiMovement[]>({
    queryKey: ["movements"],
    queryFn: async () => {
      const res = await fetch("/api/movements");
      if (!res.ok) throw new Error("Failed to fetch movements");
      return res.json();
    },
    refetchInterval: 5000,
  });

  const filteredMovements = movements.filter(
    (m) =>
      m.item.name.toLowerCase().includes(search.toLowerCase()) ||
      m.item.code.toLowerCase().includes(search.toLowerCase())
  );

  const totalMovementPages = Math.ceil(
    filteredMovements.length / movementPerPage
  );
  const paginatedMovements = filteredMovements.slice(
    (movementPage - 1) * movementPerPage,
    movementPage * movementPerPage
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-8 order-1">
        <StockControl />
      </div>

      <div className="space-y-8 order-2">
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

        <section>
          <h2 className="text-lg font-semibold mb-2">ประวัติ In-Out</h2>

          <input
            type="text"
            placeholder="ค้นหา..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setMovementPage(1);
            }}
            className="mb-4 px-3 py-2 border rounded w-full"
          />

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
                <th className="border px-3 py-2">วันที่ – เวลา</th>
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

                    <div className="text-gray-500 text-xs mt-1">
                      {m.note && m.note.trim() !== "" ? m.note : "-"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <Button
          onClick={() => {
            window.location.href = "/dashboard/stock/check";
          }}
          className="px-4 py-2 bg-fuchsia-500 text-white rounded hover:bg-fuchsia-600"
        >
          ปรับปรุงสต็อก (Adjust)
        </Button>
      </div>
    </div>
  );
}
