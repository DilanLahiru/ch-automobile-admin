
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../../components/Sidebar'
import { motion } from 'framer-motion'

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <div className="mx-auto max-w-7xl p-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
            }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  )
}
