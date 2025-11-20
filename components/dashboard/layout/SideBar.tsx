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

  return (
    <>
      {/* Desktop Sidebar */}
      <TooltipProvider>
        <motion.aside
          initial={{ width: 70 }}
          animate={{ width: expanded ? 200 : 70 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="hidden md:flex md:flex-col bg-white border-r overflow-hidden"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:bg-gray-100"
              >
                <PanelsTopLeft className="mx-3" size={18} />
                {expanded && <span className="text-sm"></span>}
              </button>
            </TooltipTrigger>
            {!expanded && (
              <TooltipContent side="right">เปิดเมนู</TooltipContent>
            )}
          </Tooltip>

          <nav className="flex flex-col py-4 space-y-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = item.href ? pathname === item.href : false;

              if (item.label === "Camera") {
                return <Camera key="camera" />;
              }

              return (
                <Tooltip key={item.href!}>
                  <TooltipTrigger asChild>
                    <Link href={item.href!}>
                      <div
                        className={`flex items-center gap-3 px-6 py-4 rounded-md transition-colors ${
                          active
                            ? "bg-blue-100 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <Icon size={22} />
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
        </motion.aside>
      </TooltipProvider>

      {/* Mobile Bottom Bar */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-white border-t py-4 md:hidden"
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = item.href ? pathname === item.href : false;

          if (item.label === "Camera") {
            return <Camera key="camera" />;
          }

          return (
            <Link key={item.href!} href={item.href!}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center text-xs ${
                  active ? "text-blue-600" : "text-gray-500"
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
