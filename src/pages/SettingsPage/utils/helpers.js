/**
 * Settings Page Helper Functions
 * Utility functions for data formatting and pagination
 */

import { PAGINATION_CONFIG } from "../constants";

/**
 * Format date to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date (MM/DD/YYYY)
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return "N/A";
  }
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated text with ellipsis
 */
export const truncateText = (text, length = 50) => {
  if (!text) return "N/A";
  return text.length > length ? text.substring(0, length) + "..." : text;
};

/**
 * Get pagination range for displaying page numbers
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @returns {Array} - Array of page numbers to display
 */
export const getPaginationRange = (currentPage, totalPages) => {
  const start = Math.max(1, currentPage - Math.floor(PAGINATION_CONFIG.VISIBLE_PAGES / 2));
  const end = Math.min(totalPages, start + PAGINATION_CONFIG.VISIBLE_PAGES - 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

/**
 * Calculate pagination values for data slicing
 * @param {number} currentPage - Current page number
 * @param {number} totalItems - Total number of items
 * @returns {Object} - { startIndex, endIndex, totalPages }
 */
export const calculatePagination = (currentPage, totalItems) => {
  const totalPages = Math.ceil(totalItems / PAGINATION_CONFIG.ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * PAGINATION_CONFIG.ITEMS_PER_PAGE;
  const endIndex = startIndex + PAGINATION_CONFIG.ITEMS_PER_PAGE;

  return { startIndex, endIndex, totalPages };
};
