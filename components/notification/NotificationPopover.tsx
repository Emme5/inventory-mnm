"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ApiMovement } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { ArrowBigUp, ArrowDownToLine, BellRing } from "lucide-react";

export function NotificationPopover() {
  const { data: notifications = [] } = useQuery<ApiMovement[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/movements");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    },
    refetchInterval: 3000,
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 hover:bg-gray-100 rounded-full">
          <BellRing size={20} />
          {notifications.length > 0 && (
            <span className="absolute top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              {notifications.length}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4">
        <ScrollArea className="h-64">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">ไม่มีการแจ้งเตือน</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="flex items-center gap-2 border-b py-4 p-2 text-sm"
              >
                {" "}
                {n.type === "out" ? (
                  <ArrowBigUp className="text-red-300" />
                ) : (
                  <ArrowDownToLine className="text-blue-300" />
                )}
                <span>
                  {n.type === "out" &&
                    `นำสินค้า ${n.item?.name ?? "ไม่พบชื่อ"} ออกไป ${
                      n.quantity
                    } ชิ้น`}
                  {n.type === "in" &&
                    `เพิ่มสินค้า ${n.item?.name ?? "ไม่พบชื่อ"} เข้ามา ${
                      n.quantity
                    } ชิ้น`}
                  {n.type === "adjust" &&
                    `ปรับสินค้า ${n.item?.name ?? "ไม่พบชื่อ"} จำนวน ${
                      n.quantity
                    } ชิ้น`}
                </span>
                <span className="ml-auto text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleString("th-TH", {
                    timeZone: "Asia/Bangkok",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
