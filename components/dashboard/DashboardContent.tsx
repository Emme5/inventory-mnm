import { DashboardStats } from "./DashboardStats";

export function DashboardContent() {
  return (
    <div className="space-y-8">
      {/* สรุปตัวเลข */}
      <DashboardStats />

      {/* ส่วนอื่น ๆ เช่น กราฟ, รายการล่าสุด */}
      <section>
        <h2 className="text-lg font-semibold mb-4">ภาพรวม</h2>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p>ใส่กราฟหรือข้อมูลภาพรวมตรงนี้</p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">รายการล่าสุด</h2>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p>ตาราง/ลิสต์รายการล่าสุด</p>
        </div>
      </section>
    </div>
  )
}