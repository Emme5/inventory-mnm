"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PushManager from "../notification/PushManager";
import { User } from "@/types/type";
import { toast } from "sonner";

async function fetchUser(): Promise<User> {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

async function updateUser(user: Partial<User>): Promise<User> {
  const res = await fetch("/api/users", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}

export default function AccountProfile() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.info(`ได้เปลี่ยนบทบาทเป็น "${data.role}" เรียบร้อย ✅`);
    },
    onError: () => {
      toast.error("เกิดข้อผิดพลาดในการบันทึก ❌");
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (!user) return <p>No user session</p>;

  const displayName = user.name ?? "ไม่ระบุชื่อ";

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-gray-800">
        บัญชีผู้ใช้ (Account)
      </h2>

      {/* Profile Card */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold">
          {displayName.slice(0, 2).toUpperCase()}
        </div>
        <div className="text-center md:text-left flex-1">
          <h3 className="text-xl font-bold text-gray-800">{displayName}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>{" "}
          <p className="text-gray-500">{user.role}</p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          การตั้งค่าทั่วไป
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              บทบาท (Role)
            </label>
            <select
              value={user.role}
              onChange={(e) =>
                mutation.mutate({
                  id: user.id,
                  role: e.target.value as "Staff" | "Viewer",
                })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Staff">Staff</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            การแจ้งเตือน (Notifications)
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">แจ้งเตือน</p>
                <p className="text-xs text-gray-500">แจ้งเตือนทุกอย่าง</p>
              </div>
              <PushManager />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">
                  สรุปยอดรายวันทางอีเมล
                </p>
                <p className="text-xs text-gray-500">ส่งรายงานทุก 8:00 น.</p>
              </div>
              <div className="w-12 h-6 bg-gray-300 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
