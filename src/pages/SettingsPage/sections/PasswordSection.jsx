import React, { useCallback, useState } from "react";
import {
  Lock,
  Save,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { changePassword } from "../../../features/authSlice";
import { validatePasswordChange, formatErrorMessage } from "../utils/validations";

/**
 * PasswordSection Component
 * Handles password change functionality
 */
export function PasswordSection() {
  const dispatch = useDispatch();

  // State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Handlers
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const toggleVisibility = useCallback((field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    // Validate
    const validation = validatePasswordChange(passwordData);
    if (!validation.isValid) {
      setMessage({ text: validation.error, type: "error" });
      return;
    }

    setIsLoading(true);

    setTimeout(async () => {
      try {
        await dispatch(
          changePassword({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          })
        ).unwrap();

        setMessage({
          text: "Password changed successfully!",
          type: "success",
        });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error) {
        const errorMessage = formatErrorMessage(error, "Failed to change password");
        setMessage({ text: errorMessage, type: "error" });
      } finally {
        setIsLoading(false);
      }
    }, 2000);
  };

  return (
    <section
      id="password-panel"
      role="tabpanel"
      className="bg-white rounded-lg shadow p-8 max-w-2xl"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Change Your Password</h2>
        <p className="text-gray-600 text-sm mt-1">
          Enter your current password and choose a new one
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-lg border border-blue-200"
          >
            <Loader2
              className="h-8 w-8 text-blue-600 animate-spin mb-3"
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-blue-700">
              Updating your password...
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Please wait while we secure your account
            </p>
          </motion.div>
        )}

        {/* Current Password */}
        <PasswordField
          id="currentPassword"
          label="Current Password"
          name="currentPassword"
          value={passwordData.currentPassword}
          showPassword={showPasswords.current}
          onToggleVisibility={() => toggleVisibility("current")}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter your current password"
        />

        {/* New Password */}
        <PasswordField
          id="newPassword"
          label="New Password"
          name="newPassword"
          value={passwordData.newPassword}
          showPassword={showPasswords.new}
          onToggleVisibility={() => toggleVisibility("new")}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter your new password"
        />

        {/* Confirm Password */}
        <PasswordField
          id="confirmPassword"
          label="Confirm New Password"
          name="confirmPassword"
          value={passwordData.confirmPassword}
          showPassword={showPasswords.confirm}
          onToggleVisibility={() => toggleVisibility("confirm")}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Confirm your new password"
        />

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
          className="w-full flex text-sm items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="h-5 w-5" aria-hidden="true" />
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </form>

      {/* Security Info */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex gap-3">
          <AlertCircle
            className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Security Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Use a strong password with mix of uppercase, lowercase, numbers and symbols</li>
              <li>Never share your password with anyone</li>
              <li>Change your password regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * PasswordField Component
 * Reusable password input field with show/hide toggle
 */
function PasswordField({
  id,
  label,
  name,
  value,
  showPassword,
  onToggleVisibility,
  onChange,
  disabled,
  placeholder,
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        <span className="text-red-500 ml-1" aria-label="required">
          *
        </span>
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-label={label}
          aria-required="true"
          className="w-full px-4 text-sm py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
          disabled={disabled}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          aria-label={showPassword ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Eye className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
