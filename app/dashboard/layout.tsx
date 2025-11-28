import SideBar from "@/components/SideBar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login"); // ถ้าไม่มี session → บังคับไปหน้า login
  }

  return (
    <div className="min-h-screen flex">
      <SideBar />
      <main className="flex-1 p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
