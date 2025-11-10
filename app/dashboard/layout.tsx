import { SideBar } from "@/components/dashboard/layout/SideBar";
import { Navbar } from "@/components/dashboard/layout/Navbar";
import { FloatingCamera } from "@/components/camera/FloatingCamera";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
        <FloatingCamera />
      </div>
    </div>
  );
}
