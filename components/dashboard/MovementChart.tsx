"use client";

import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

type Movement = {
  id: string;
  type: "in" | "out";
  quantity: number;
  createdAt: string;
};

export default function MovementChart() {
  const { data: movements = [], isLoading } = useQuery<Movement[]>({
    queryKey: ["movements"],
    queryFn: async () => {
      const res = await fetch("/api/movements");
      if (!res.ok) throw new Error("Failed to fetch movements");
      return res.json();
    },
    refetchInterval: 10000,
  });

  const weeklyData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const result = days.map((day) => ({ day, in: 0, out: 0 }));

    movements.forEach((m) => {
      const d = new Date(m.createdAt);
      const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
      const entry = result.find((r) => r.day === weekday);
      if (entry) {
        if (m.type === "in") entry.in += m.quantity;
        else if (m.type === "out") entry.out += m.quantity;
      }
    });

    return result;
  }, [movements]);

  return (
    <div className="w-full h-[300px]">
      {isLoading ? (
        <p className="text-gray-500 text-sm">กำลังโหลดข้อมูล...</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="in"
              stroke="#16a34a"
              name="เข้า"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="out"
              stroke="#dc2626"
              name="ออก"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
