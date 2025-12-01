"use client";

import PushManager from "../notification/PushManager";
import { Button } from "../ui/button";

export default function AccountProfile() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-gray-800">
        บัญชีผู้ใช้ (Account)
      </h2>

      {/* Profile Card */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold">
          JD
        </div>
        <div className="text-center md:text-left flex-1">
          <h3 className="text-xl font-bold text-gray-800">John Developer</h3>
          <p className="text-gray-500">Inventory Manager</p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
            <Button className="bg-indigo-600 text-white text-sm hover:bg-indigo-700">
              Edit Profile
            </Button>
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
              อีเมล
            </label>
            <input
              type="email"
              value="dev@example.com"
              disabled
              className="w-full bg-gray-50 px-4 py-2 border border-gray-200 rounded-lg text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เบอร์โทรศัพท์
            </label>
            <input
              type="tel"
              placeholder="0xx-xxx-xxxx"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              บทบาท (Role)
            </label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Manager</option>
              <option>Staff</option>
              <option>Viewer</option>
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
