"use client";

import { useEffect, useState } from "react";
import {
  RiBox3Line,
  RiBarChart2Line,
  RiCheckLine,
  RiScanLine,
} from "@remixicon/react";

export function DashboardStats() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  const items = [
    {
      label: "สินค้าทั้งหมด",
      value: 1200,
      icon: RiBox3Line,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "จำนวนรายการ",
      value: 340,
      icon: RiBarChart2Line,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "คงเหลือ",
      value: 980,
      icon: RiCheckLine,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "สแกนออก",
      value: 220,
      icon: RiScanLine,
      color: "text-red-600 bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm"
          >
            <div className={`p-3 rounded-full ${item.color}`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-xl font-semibold">{item.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
