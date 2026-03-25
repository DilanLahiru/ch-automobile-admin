import React, { useCallback, useState, useEffect } from "react";
import { Mail, Save, AlertCircle, CheckCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../../features/authSlice";
import { validateProfileName, formatErrorMessage } from "../utils/validations";

/**
 * ProfileSection Component 
 * Handles profile management (name, email display)
 */
export function ProfileSection({ user }) {
  const dispatch = useDispatch();

  // State
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Initialize profile data from user
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || user.fullName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Handlers
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    // Validate
    const validation = validateProfileName(profileData.name);
    if (!validation.isValid) {
      setMessage({ text: validation.error, type: "error" });
      return;
    }

    setIsLoading(true);

    try {
      await dispatch(
        updateProfile({
          name: profileData.name.trim(),
        })
      ).unwrap();

      setMessage({
        text: "Profile updated successfully!",
        type: "success",
      });
    } catch (error) {
      const errorMessage = formatErrorMessage(error, "Failed to update profile");
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="profile-panel"
      role="tabpanel"
      className="bg-white rounded-lg shadow p-8 max-w-4xl"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Update Your Profile</h2>
        <p className="text-gray-600 text-sm mt-1">
          Manage your personal information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name Field */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
              <span className="text-red-500 ml-1" aria-label="required">
                *
              </span>
            </label>
            <input
              id="fullName"
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              placeholder={user?.name || "Enter your full name"}
              aria-label="Full name"
              aria-required="true"
              aria-invalid={
                message.type === "error" && message.text.includes("Name")
              }
              className="w-full px-4 py-2 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Email Field (Read-only) */}
          <div>
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={profileData.email}
              placeholder={user?.email || "N/A"}
              aria-label="Email address (read-only)"
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              disabled
              readOnly
            />
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            role="alert"
            className={`flex items-center gap-3 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle
                className="h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
            ) : (
              <AlertCircle
                className="h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="w-1/2 flex items-center text-sm justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="h-5 w-5" aria-hidden="true" />
          {isLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex gap-3">
          <AlertCircle
            className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Profile Information:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>You can update your full name</li>
              <li>Your email address is displayed for reference</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
