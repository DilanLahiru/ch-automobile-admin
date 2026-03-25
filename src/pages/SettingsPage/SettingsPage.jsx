import React, { useState, useEffect } from "react";
import { useDispatch, useSelector} from "react-redux";
import { getUserProfile } from "../../features/authSlice";
import { TabNavigation } from "./components/TabNavigation";
import { ProfileSection } from "./sections/ProfileSection";
import { PasswordSection } from "./sections/PasswordSection";
import { RepairHistorySection } from "./sections/RepairHistorySection";

/**
 * SettingsPage Component
 * Manages user profile, password, and repair history through modular sections
 */
export function SettingsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");

  // Fetch user profile on mount
  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  const renderSection = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection user={user} />;
      case "password":
        return <PasswordSection />;
      case "repairs":
        return <RepairHistorySection />;
      default:
        return <ProfileSection user={user} />;
    }
  };

  return (
    <div className="w-full px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your profile, security, and repair history
        </p>
      </div>

      {/* Tab Navigation */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Dynamic Section Rendering */}
      <div className="mt-8">
        {renderSection()}
      </div>
    </div>
  );
}
