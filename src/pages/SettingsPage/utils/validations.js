/**
 * Settings Page Validation Functions
 * Comprehensive validation for profile, password, and repair data
 */

import { VALIDATION_RULES } from "../constants";

/**
 * Validates profile name
 * @param {string} name - The name to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateProfileName = (name) => {
  if (!name.trim()) {
    return { isValid: false, error: "Name is required" };
  }
  if (name.trim().length < VALIDATION_RULES.MIN_NAME_LENGTH) {
    return {
      isValid: false,
      error: `Name must be at least ${VALIDATION_RULES.MIN_NAME_LENGTH} characters`,
    };
  }
  return { isValid: true, error: "" };
};

/**
 * Validates password change input
 * @param {Object} data - Password data { currentPassword, newPassword, confirmPassword }
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validatePasswordChange = (data) => {
  const { currentPassword, newPassword, confirmPassword } = data;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { isValid: false, error: "All fields are required" };
  }

  if (newPassword !== confirmPassword) {
    return { isValid: false, error: "New passwords do not match" };
  }

  if (newPassword.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
    return {
      isValid: false,
      error: `New password must be at least ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} characters`,
    };
  }

  if (currentPassword === newPassword) {
    return {
      isValid: false,
      error: "New password must be different from current password",
    };
  }

  return { isValid: true, error: "" };
};

/**
 * Validates repair history form data
 * @param {Object} data - Repair data
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateRepairData = (data) => {
  const { customerName, contactNumber, date, vehicleNumber, repairSummary } = data;

  if (!customerName?.trim()) {
    return { isValid: false, error: "Customer name is required" };
  }

  if (!contactNumber?.trim()) {
    return { isValid: false, error: "Contact number is required" };
  }

  if (!/^\d{10,}$/.test(contactNumber.replace(/\D/g, ""))) {
    return { isValid: false, error: "Contact number must be valid (at least 10 digits)" };
  }

  if (!date) {
    return { isValid: false, error: "Date is required" };
  }

  if (!vehicleNumber?.trim()) {
    return { isValid: false, error: "Vehicle number is required" };
  }

  if (!repairSummary?.trim()) {
    return { isValid: false, error: "Repair summary is required" };
  }

  if (repairSummary.trim().length < 10) {
    return { isValid: false, error: "Repair summary must be at least 10 characters" };
  }

  return { isValid: true, error: "" };
};

/**
 * Extract and format error message from various error types
 * @param {string|Object} error - Error from Redux or catch
 * @param {string} defaultMessage - Fallback message
 * @returns {string} - Formatted error message
 */
export const formatErrorMessage = (error, defaultMessage = "An error occurred") => {
  if (typeof error === "string") {
    return error;
  }
  if (error?.message) {
    return error.message;
  }
  return defaultMessage;
};
