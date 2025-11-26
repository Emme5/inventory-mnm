import DashboardStats from "./DashboardStats";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowDownToLine, Search } from "lucide-react";
import NotificationPopover from "@/components/notification/NotificationPopover";
import PushManager from "@/components/notification/PushManager";
import MovementChart from "./MovementChart";

export default function DashboardContent() {
  
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
          <PushManager />
          <NotificationPopover />
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
        <h2 className="text-lg font-semibold mb-4">ภาพรวม</h2>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <MovementChart />
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold mb-4">Low Stock Alerts</h2>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p>ตาราง/แสดงการแจ้งเตือนสต็อกต่ำ ตรงนี้</p>
        </div>
      </section>

      <Separator />
    </div>
  );
}
