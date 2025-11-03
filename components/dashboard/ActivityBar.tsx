"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  RiHome2Line,
  RiBox3Line,
  RiBarChart2Line,
  RiUser3Line,
} from "@remixicon/react"

const menuItems = [
  { label: "Overview", href: "/dashboard", icon: RiHome2Line },
  { label: "Items", href: "/dashboard/items", icon: RiBox3Line },
  { label: "Stock", href: "/dashboard/stock", icon: RiBarChart2Line },
  { label: "Account", href: "/dashboard/account", icon: RiUser3Line },
]

export function ActivityBar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-20 bg-white border-r">
        <nav className="flex flex-col items-center py-4 space-y-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-lg ${
                    active ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={24} />
                </motion.div>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Bar */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-white border-t py-2 md:hidden"
      >
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
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
          )
        })}
      </motion.nav>
    </>
  )
}
