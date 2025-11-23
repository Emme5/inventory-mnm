"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Boxes,
  LayoutDashboard,
  PanelsTopLeft,
  Scan,
  UserRound,
  Warehouse,
} from "lucide-react";
import Camera from "@/components/camera/Camera";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const menuItems = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Items", href: "/dashboard/items", icon: Boxes },
  { label: "Camera", type: "component", icon: Scan },
  { label: "Stock", href: "/dashboard/stock", icon: Warehouse },
  { label: "Account", href: "/dashboard/account", icon: UserRound },
];

export default function SideBar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <TooltipProvider>
        <motion.aside
          initial={{ width: 70 }}
          animate={{ width: expanded ? 200 : 70 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="hidden md:flex md:flex-col bg-slate-900 border-r border-slate-800 text-slate-200 overflow-hidden"
        >
          <div className="flex items-center h-14 px-3 border-b border-slate-800">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="flex items-center justify-center hover:bg-slate-800 rounded-md p-2"
                  aria-label="Toggle sidebar"
                >
                  <PanelsTopLeft size={18} className="text-slate-300" />
                </button>
              </TooltipTrigger>
              {!expanded && (
                <TooltipContent side="right">เปิดเมนู</TooltipContent>
              )}
            </Tooltip>

            {expanded && (
              <div className="ml-2">
                <div className="text-sm font-semibold tracking-wide">
                  INVENTORY
                </div>
                <div className="text-[11px] text-slate-400">
                  Management System
                </div>
              </div>
            )}
          </div>

          {/* Menu */}
          <nav className="flex flex-col gap-2 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = item.href ? pathname === item.href : false;

              if (item.label === "Camera") {
                return (
                  <Tooltip key="camera">
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setCameraOpen(true)} // ✅ เปิดกล้อง
                        className={`mx-2 flex items-center gap-3 px-3 py-3 rounded-md transition-colors w-full text-left ${
                          active
                            ? "bg-blue-600/20 text-blue-400"
                            : "text-slate-300 hover:bg-slate-800/60"
                        }`}
                      >
                        <Icon
                          size={22}
                          className={
                            active ? "text-blue-400" : "text-slate-300"
                          }
                        />
                        {expanded && (
                          <span className="whitespace-nowrap text-sm">
                            {item.label}
                          </span>
                        )}
                      </button>
                    </TooltipTrigger>
                    {!expanded && (
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    )}
                  </Tooltip>
                );
              }

              return (
                <Tooltip key={item.href!}>
                  <TooltipTrigger asChild>
                    <Link href={item.href!}>
                      <div
                        className={`mx-2 flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${
                          active
                            ? "bg-blue-600/20 text-blue-400"
                            : "text-slate-300 hover:bg-slate-800/60"
                        }`}
                      >
                        <Icon
                          size={22}
                          className={
                            active ? "text-blue-400" : "text-slate-300"
                          }
                        />
                        {expanded && (
                          <span className="whitespace-nowrap text-sm">
                            {item.label}
                          </span>
                        )}
                      </div>
                    </Link>
                  </TooltipTrigger>
                  {!expanded && (
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </nav>

          <Camera open={cameraOpen} onOpenChange={setCameraOpen} />

          {/* Footer */}
          <div className="mt-auto border-t border-slate-800">
            <button className="mx-2 my-2 w-[calc(100%-1rem)] flex items-center gap-3 px-3 py-2 rounded-md text-slate-300 hover:bg-slate-800/60">
              <UserRound size={18} />
              {expanded && <span className="text-sm">ออกจากระบบ</span>}
            </button>
          </div>
        </motion.aside>
      </TooltipProvider>

      {/* Mobile Bottom Bar */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-slate-900 border-t border-slate-800 py-4 md:hidden"
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = item.href ? pathname === item.href : false;

          if (item.label === "Camera") {
            return (
              <motion.button
                key="camera"
                whileTap={{ scale: 0.9 }}
                onClick={() => setCameraOpen(true)}
                className={`flex flex-col items-center text-xs ${
                  active
                    ? "text-blue-400"
                    : "text-slate-300 hover:text-slate-200"
                }`}
              >
                <Icon size={22} />
                <span>{item.label}</span>
              </motion.button>
            );
          }

          return (
            <Link key={item.href!} href={item.href!}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center text-xs ${
                  active
                    ? "text-blue-400"
                    : "text-slate-300 hover:text-slate-200"
                }`}
              >
                <Icon size={22} />
                <span>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </motion.nav>
    </>
  );
}
