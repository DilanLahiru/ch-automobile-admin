
import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Car,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  Wrench,
  Package,
  FileText,
} from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  {
    path: '/dashboard',
    label: 'Overview',
    icon: LayoutDashboard,
  },
  {
    path: '/dashboard/revenue',
    label: 'Revenue',
    icon: BarChart3,
  },
  {
    path: '/dashboard/inventory',
    label: 'Repair History',
    icon: Car,
  },
  {
    path: '/dashboard/appointments',
    label: 'Appointments',
    icon: CalendarDays,
  },
  {
    path: '/dashboard/service-orders',
    label: 'Service Orders',
    icon: FileText,
  },
  {
    path: '/dashboard/stock',
    label: 'Inventory',
    icon: Package,
  },
  {
    path: '/dashboard/employees',
    label: 'Employees',
    icon: Package,
  },
  
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white shadow-sm">
      <div className="flex h-full flex-col px-4 py-6">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <Wrench className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              CH Automobile
            </h1>
            <p className="text-xs font-medium text-gray-500">Admin Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive ? 'text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg bg-blue-50"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
                <Icon
                  className={`relative z-10 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                />
                <span className="relative z-10">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto border-t border-gray-100 pt-4 space-y-1">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
            <Settings className="h-5 w-5 text-gray-400" />
            Settings
          </button>
          <NavLink
            to="/"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </NavLink>
        </div>

        {/* User Profile Snippet */}
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
          <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-200">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-gray-900">
              Chamila Herath
            </p>
            <p className="truncate text-xs text-gray-500">Manager</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
