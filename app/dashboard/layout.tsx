import { ActivityBar } from "@/components/dashboard/ActivityBar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <ActivityBar />
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  )
}
