import Link from "next/link";
import NotificationPopover from "@/components/notification/NotificationPopover";
import { UserRound } from "lucide-react";
import PushManager from "@/components/notification/PushManager";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Logo / Brand */}
        <Link href="/dashboard" className="text-lg font-bold text-blue-600">
          IMS PWa
        </Link>

        {/* Center menu (desktop only) */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/dashboard" className="hover:text-blue-600">
            Overview
          </Link>
          <Link href="/dashboard/items" className="hover:text-blue-600">
            Items
          </Link>
          <Link href="/dashboard/stock" className="hover:text-blue-600">
            Stock
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <PushManager />
          <NotificationPopover />

          <button className="p-2 hover:bg-gray-100 rounded-full">
            <UserRound size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
