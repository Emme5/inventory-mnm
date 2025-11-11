"use client";

import { useEffect, useState } from "react";
import {
  RiBox3Line,
  RiBarChart2Line,
  RiCheckLine,
  RiScanLine,
} from "@remixicon/react";
import type { Stats } from "@/types/type";
import { Skeleton } from "../ui/skeleton";

export function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm"
          >
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const items = [
    {
      label: "สินค้าทั้งหมด",
      value: stats.totalCreated,
      icon: RiBox3Line,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "จำนวนรายการ",
      value: stats.totalItems,
      icon: RiBarChart2Line,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "คงเหลือ",
      value: stats.remaining,
      icon: RiCheckLine,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "สแกนออก",
      value: stats.scanOut,
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
