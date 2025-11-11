"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RiNotification3Line } from "@remixicon/react";
import type { ApiMovement } from "@/types/type";
import { useEffect, useState } from "react";

export function NotificationPopover() {
  const [notifications, setNotifications] = useState<ApiMovement[]>([]);

  useEffect(() => {
    console.log("Fetching notifications...");
    const fetchData = async () => {
      const res = await fetch("/api/notifications");
      const json = await res.json();
      console.log("API response:", json); // ✅ ดูว่าได้อะไรกลับมา
      if (res.ok) {
        const data: ApiMovement[] = await res.json();
        setNotifications(data);
      }
    };
    fetchData();
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 hover:bg-gray-100 rounded-full">
          <RiNotification3Line size={20} />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              {notifications.length}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2">
        <ScrollArea className="h-64">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">ไม่มีการแจ้งเตือน</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="flex items-center gap-2 border-b py-2 text-sm"
              >
                <RiNotification3Line className="text-blue-500" />
                <span>
                  {n.type === "out" &&
                    `นำสินค้า ${n.Item.name} ออกไป ${n.quantity} ชิ้น`}
                  {n.type === "in" &&
                    `เพิ่มสินค้า ${n.Item.name} เข้ามา ${n.quantity} ชิ้น`}
                  {n.type === "adjust" &&
                    `ปรับสินค้า ${n.Item.name} จำนวน ${n.quantity} ชิ้น`}
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
