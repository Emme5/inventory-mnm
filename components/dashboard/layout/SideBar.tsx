"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiHome2Line,
  RiBox3Line,
  RiBarChart2Line,
  RiUser3Line,
} from "@remixicon/react";
import { useState } from "react";

const menuItems = [
  { label: "Home", href: "/dashboard", icon: RiHome2Line },
  { label: "Items", href: "/dashboard/items", icon: RiBox3Line },
  { label: "Stock", href: "/dashboard/stock", icon: RiBarChart2Line },
  { label: "Account", href: "/dashboard/account", icon: RiUser3Line },
];

export function SideBar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ width: 80 }}
        animate={{ width: expanded ? 200 : 70 }}
        onHoverStart={() => setExpanded(true)}
        onHoverEnd={() => setExpanded(false)}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="hidden md:flex md:flex-col bg-white border-r overflow-hidden"
      >
        <nav className="flex flex-col py-4 space-y-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-6 py-4 rounded-md transition-colors ${
                    active
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={22} />
                  {/* แสดง label เฉพาะตอน expanded */}
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap text-sm"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </motion.aside>

      {/* Mobile Bottom Bar */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-white border-t py-4 md:hidden"
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
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
