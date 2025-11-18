import DashboardStats from "./DashboardStats";
import { ManualScanOut } from "../ManualScanOut";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowDownToLine, Search } from "lucide-react";

export default function DashboardContent() {
  return (
    <div className="space-y-8">
      {/* สรุปตัวเลข */}
      <DashboardStats />

      <Separator />

      <div className="flex gap-4 mb-6 items-center justify-center">
        <Link href="/dashboard/items/add">
          <Button className="bg-green-600 hover:bg-green-700 text-white flex gap-2">
            <ArrowDownToLine size={18} />
            รับเข้า
          </Button>
        </Link>

        <Link href="/dashboard/stock">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex gap-2">
            <Search size={18} />
            เช็คสต็อค
          </Button>
        </Link>
      </div>
      
      <Separator />

      <section className="text-lg font-semibold mb-4">
        <h2>เอาของออกแบบ (Manual)</h2>
        <ManualScanOut />
      </section>

      <Separator />

      {/* ส่วนอื่น ๆ เช่น กราฟ, รายการล่าสุด */}
      <section>
        <h2 className="text-lg font-semibold mb-4">ภาพรวม</h2>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p>ใส่กราฟหรือข้อมูลภาพรวมตรงนี้</p>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold mb-4">รายการล่าสุด</h2>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p>ตาราง/ลิสต์รายการล่าสุด</p>
        </div>
      </section>

      <Separator />
    </div>
  );
}
