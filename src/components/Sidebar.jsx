import React, { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  TrendingUp,
  Truck,
} from "lucide-react";
import { motion } from "framer-motion";
import { logoutUser, getUserProfile } from "../features/authSlice";

import BGLogo from "../assets/Logoes.png";

const navItems = [
  {
    path: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
  },
  // {
  //   path: '/dashboard/revenue',
  //   label: 'Revenue',
  //   icon: BarChart3,
  // },
  {
    path: "/dashboard/service-orders-list",
    label: "Repair History",
    icon: Car,
  },
  {
    path: "/dashboard/appointments",
    label: "Appointments",
    icon: CalendarDays,
  },
  {
    path: "/dashboard/service-orders",
    label: "Service Orders",
    icon: FileText,
  },
  {
    path: "/dashboard/stock",
    label: "Inventory",
    icon: Package,
  },
  {
    path: "/dashboard/employees",
    label: "Employees",
    icon: Package,
  },
  {
    path: "/dashboard/suppliers",
    label: "Suppliers",
    icon: Truck,
  },
  {
    path: "/dashboard/reports",
    label: "Reports & Analytics",
    icon: TrendingUp,
  },
  {
    path: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still redirect to login even if there's an error
      navigate("/");
    }
  };

  const handleGetUserProfile = async () => {
    dispatch(getUserProfile());
  };

  useEffect(() => {
    handleGetUserProfile();
  }, [dispatch]);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white shadow-sm">
      <div className="flex h-full flex-col px-4 py-6">
        {/* Logo */}
        <div className="mb-4 flex items-center gap-3 px-2">
          <div className="flex w-full items-center justify-center">
            <img src={BGLogo} alt="Logo" className="w-fit h-18" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive ? "text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg bg-blue-50"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
                <Icon
                  className={`relative z-10 h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}
                />
                <span className="relative z-10">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto border-t border-gray-100 pt-4 space-y-1">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>

        {/* User Profile Snippet */}
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
          <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-200">
            <span className="sr-only">User Avatar</span>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User Name")}&background=random&color=fff&size=64`}   
              alt={`${user?.name || "User Name"}'s avatar`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-gray-900">
              {user?.name || "User Name"}
            </p>
            <p className="truncate text-xs text-gray-500 uppercase">
              {user?.role || "Manager"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
