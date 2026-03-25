import React from "react";
import { User, Lock, History } from "lucide-react";
import { motion } from "framer-motion";

/**
 * TabNavigation Component
 * Handles tab switching between Profile, Password, and Repair History
 */
export function TabNavigation({ activeTab, onTabChange, isLoading }) {
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Password", icon: Lock },
    { id: "repairs", label: "Old Repairs", icon: History },
  ];

  return (
    <div className="flex gap-2 border-b border-gray-200 mb-8">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            disabled={isLoading}
            aria-selected={isActive}
            aria-label={`Switch to ${tab.label} tab`}
            role="tab"
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors relative disabled:opacity-50 disabled:cursor-not-allowed ${
              isActive
                ? "text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {tab.label}

            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
