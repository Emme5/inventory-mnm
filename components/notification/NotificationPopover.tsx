"use client"

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNoti } from "@/hooks/useNotifications"
import { Notification } from "@/types/item"
import { RiNotification3Line } from "@remixicon/react"

export function NotificationPopover() {
  const { notifications } = useNoti()   // ✅ ดึง state จาก global hook

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
            notifications.map((n: Notification) => (
              <div
                key={n.id}
                className="flex items-center gap-2 border-b py-2 text-sm"
              >
                {n.icon}
                <span>{n.message}</span>
                <span className="ml-auto text-xs text-gray-400">
                  {n.createdAt.toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
