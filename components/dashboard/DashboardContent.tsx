"use client";

import DashboardStats from "./DashboardStats";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowDownToLine, LogOut, Search } from "lucide-react";
import NotificationPopover from "@/components/notification/NotificationPopover";
import MovementChart from "./MovementChart";
import { signOut } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useQuery } from "@tanstack/react-query";
import { Item } from "@/types/type";

export default function DashboardContent() {
  const { data: items = [], isLoading } = useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: async () => {
      const res = await fetch("/api/items");
      if (!res.ok) throw new Error("Failed to fetch items");
      return res.json();
    },
  });

  if (isLoading) {
    return <p className="text-gray-500 text-sm">กำลังโหลดข้อมูล...</p>;
  }

  const now = new Date();
  const lastUpdated = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
          <NotificationPopover />
          <Button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-md hover:bg-red-100 hover:text-red-600 transition-colors md:hidden flex gap-2"
          >
            <LogOut size={18} />
          </Button>
        </div>
      </div>

      <DashboardStats />

      <Separator />

      <div className="flex gap-4 mb-6 items-center justify-center">
        <Link href="/dashboard/items">
          <Button className="bg-green-600 hover:bg-green-700 text-white flex gap-2">
            <ArrowDownToLine size={18} />
            เพิ่มใหม่
          </Button>
        </Link>

        <Link href="/dashboard/stock">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex gap-2">
            <Search size={18} />
            เช็ค
          </Button>
        </Link>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4">Week/Total</h2>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <MovementChart />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Low Stock Alerts</h2>
        <div className="rounded-lg border bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>สินค้า</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>สถานะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items
                .filter(
                  (item) =>
                    item.quantity === 0 || item.quantity <= (item.minStock ?? 0)
                )
                .map((item) => {
                  let status = "In Stock";
                  let colorClass =
                    "bg-green-100 text-green-700 border border-green-300";

                  if (item.quantity === 0) {
                    status = "Out of Stock";
                    colorClass =
                      "bg-red-100 text-red-700 border border-red-300";
                  } else if (item.quantity <= (item.minStock ?? 0)) {
                    status = "Low Stock";
                    colorClass =
                      "bg-orange-100 text-orange-700 border border-orange-300";
                  }

                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.minStock}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}
                        >
                          {status}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
