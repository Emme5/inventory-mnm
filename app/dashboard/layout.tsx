import SideBar from "@/components/dashboard/layout/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <SideBar />
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
