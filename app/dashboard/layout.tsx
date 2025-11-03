import { ActivityBar } from "@/components/dashboard/ActivityBar"
import { Navbar } from "@/components/dashboard/Navbar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
    <div className="flex flex-1">
      <ActivityBar />
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
    </div>
  )
}
