import React, { useCallback, useState, useEffect } from "react";
import {
  Save,
  AlertCircle,
  CheckCircle,
  History,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getAllOldServiceRecords, createOldServiceRecord } from "../../../features/oldServiceRecordSlice";
import { LoadingSkeleton } from "../../../components/ui/LoadingSkeleton";
import { validateRepairData, formatErrorMessage } from "../utils/validations";
import { formatDate, truncateText, getPaginationRange, calculatePagination } from "../utils/helpers";
import { PAGINATION_CONFIG } from "../constants";

/**
 * RepairHistorySection Component
 * Manages viewing and adding old repair records with pagination
 */
export function RepairHistorySection() {
  const dispatch = useDispatch();
  const { oldServiceRecords: repairHistory, isLoading: isLoadingHistory } = useSelector(
    (state) => state.oldServiceRecord
  );

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRepairData, setNewRepairData] = useState({
    customerName: "",
    contactNumber: "",
    date: "",
    vehicleNumber: "",
    repairSummary: "",
  });
  const [addMessage, setAddMessage] = useState({ text: "", type: "" });
  const [isAddingRepair, setIsAddingRepair] = useState(false);

  // Fetch repair history on mount
  useEffect(() => {
    dispatch(getAllOldServiceRecords()).catch((error) => {
      const errorMessage = formatErrorMessage(error, "Failed to load repair history.");
      setError(errorMessage);
    });
  }, [dispatch]);

  // Calculate pagination
  const totalRepairs = repairHistory?.length || 0;
  const { startIndex, endIndex, totalPages } = calculatePagination(currentPage, totalRepairs);
  const paginatedRepairs = repairHistory?.slice(startIndex, endIndex) || [];
  const paginationRange = getPaginationRange(currentPage, totalPages);

  // Handlers
  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  }, [currentPage, totalPages]);

  const handleGoToPage = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleRepairChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewRepairData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleRepairSubmit = async (e) => {
    e.preventDefault();
    setAddMessage({ text: "", type: "" });

    // Validate
    const validation = validateRepairData(newRepairData);
    if (!validation.isValid) {
      setAddMessage({ text: validation.error, type: "error" });
      return;
    }

    setIsAddingRepair(true);

    try {
      await dispatch(
        createOldServiceRecord({
          customerName: newRepairData.customerName.trim(),
          contactNumber: newRepairData.contactNumber.trim(),
          serviceDate: newRepairData.date,
          vehicleNumber: newRepairData.vehicleNumber.trim(),
          serviceSummary: newRepairData.repairSummary.trim(),
        })
      ).unwrap();

      setAddMessage({
        text: "Repair record added successfully!",
        type: "success",
      });

      // Reset form
      setNewRepairData({
        customerName: "",
        contactNumber: "",
        date: "",
        vehicleNumber: "",
        repairSummary: "",
      });

      // Close form and refresh
      setTimeout(() => {
        setShowAddForm(false);
        dispatch(getAllOldServiceRecords());
        setCurrentPage(1);
      }, 1500);
    } catch (error) {
      const errorMessage = formatErrorMessage(error, "Failed to add repair record");
      setAddMessage({ text: errorMessage, type: "error" });
    } finally {
      setIsAddingRepair(false);
    }
  };

  return (
    <section
      id="repair-history-panel"
      role="tabpanel"
      className="bg-white rounded-lg shadow p-8"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Repair History</h2>
          <p className="text-gray-600 text-sm mt-1">
            View and add past repair and service records
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {showAddForm ? "Cancel" : "Add Repair"}
        </button>
      </div>

      {/* Add Repair Form */}
      {showAddForm && (
        <AddRepairForm
          data={newRepairData}
          onChange={handleRepairChange}
          onSubmit={handleRepairSubmit}
          message={addMessage}
          isLoading={isAddingRepair}
        />
      )}

      {/* Content */}
      {isLoadingHistory ? (
        <div className="space-y-4">
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      ) : error ? (
        <div
          role="alert"
          className="flex items-center gap-3 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200"
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      ) : totalRepairs === 0 ? (
        <EmptyState />
      ) : (
        <>
          <RepairTable repairs={paginatedRepairs} />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalRepairs={totalRepairs}
              startIndex={startIndex}
              endIndex={endIndex}
              paginationRange={paginationRange}
              onPrevious={handlePreviousPage}
              onNext={handleNextPage}
              onGoToPage={handleGoToPage}
            />
          )}
          <InfoBox />
        </>
      )}
    </section>
  );
}

/**
 * AddRepairForm Component
 */
function AddRepairForm({ data, onChange, onSubmit, message, isLoading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Add New Repair Record
      </h3>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            id="customerName"
            label="Customer Name"
            name="customerName"
            value={data.customerName}
            onChange={onChange}
            placeholder="Enter customer name"
            disabled={isLoading}
          />
          <FormField
            id="contactNumber"
            label="Contact Number"
            name="contactNumber"
            type="tel"
            value={data.contactNumber}
            onChange={onChange}
            placeholder="Enter contact number"
            disabled={isLoading}
          />
          <FormField
            id="repair-date"
            label="Date"
            name="date"
            type="date"
            value={data.date}
            onChange={onChange}
            disabled={isLoading}
          />
          <FormField
            id="vehicleNumber"
            label="Vehicle Number"
            name="vehicleNumber"
            value={data.vehicleNumber}
            onChange={onChange}
            placeholder="Enter vehicle registration number"
            disabled={isLoading}
          />
        </div>

        {/* Repair Summary */}
        <div>
          <label
            htmlFor="repairSummary"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Repair Summary
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          </label>
          <textarea
            id="repairSummary"
            name="repairSummary"
            value={data.repairSummary}
            onChange={onChange}
            placeholder="Describe the repair work done..."
            aria-label="Repair summary"
            aria-required="true"
            rows="4"
            className="w-full px-3 py-2 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 resize-none"
            disabled={isLoading}
          />
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            role="alert"
            className={`flex items-center gap-3 p-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" aria-hidden="true" />
                Save Repair Record
              </>
            )}
          </button>
          <button
            type="button"
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}

/**
 * FormField Component
 */
function FormField({
  id,
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        <span className="text-red-500 ml-1" aria-label="required">
          *
        </span>
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={label}
        aria-required="true"
        className="w-full px-3 py-2 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        disabled={disabled}
      />
    </div>
  );
}

/**
 * RepairTable Component
 */
function RepairTable({ repairs }) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="w-full border-collapse" role="table" aria-label="Repair history table">
        <thead>
          <tr className="bg-gray-50 border-b-2 border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700" scope="col">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700" scope="col">
              Customer Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700" scope="col">
              Contact Number
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700" scope="col">
              Vehicle Number
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700" scope="col">
              Repair Summary
            </th>
          </tr>
        </thead>
        <tbody>
          {repairs.map((repair, index) => (
            <tr
              key={repair._id || index}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3 text-xs text-gray-900 font-sans font-medium">
                {formatDate(repair.serviceDate || repair.createdAt)}
              </td>
              <td className="px-4 py-3 text-xs text-gray-900 font-sans font-medium">
                {repair.customerName || "N/A"}
              </td>
              <td className="px-4 py-3 text-xs text-gray-600 font-sans font-medium">
                {repair.contactNumber || "N/A"}
              </td>
              <td className="px-4 py-3 text-xs text-gray-600 font-sans font-medium">
                {repair.vehicleNumber || "N/A"}
              </td>
              <td
                className="px-4 py-3 text-xs text-gray-600 font-sans font-medium"
                title={repair.serviceSummary || ""}
              >
                {truncateText(repair.serviceSummary || "N/A", 100)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Pagination Component
 */
function Pagination({
  currentPage,
  totalPages,
  totalRepairs,
  startIndex,
  endIndex,
  paginationRange,
  onPrevious,
  onNext,
  onGoToPage,
}) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="text-sm text-gray-600">
        Showing <span className="font-medium">{startIndex + 1}-{Math.min(endIndex, totalRepairs)}</span> of{" "}
        <span className="font-medium">{totalRepairs}</span> repairs
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrevious}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-1">
          {paginationRange.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onGoToPage(pageNum)}
              aria-label={`Go to page ${pageNum}`}
              aria-current={pageNum === currentPage ? "page" : undefined}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pageNum === currentPage
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/**
 * EmptyState Component
 */
function EmptyState() {
  return (
    <div className="text-center py-12">
      <History className="h-12 w-12 text-gray-300 mx-auto mb-4" aria-hidden="true" />
      <p className="text-gray-500 font-medium mb-2">No repair history found</p>
      <p className="text-gray-400 text-sm">
        Your completed repairs and services will appear here
      </p>
    </div>
  );
}

/**
 * InfoBox Component
 */
function InfoBox() {
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex gap-3">
        <AlertCircle
          className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">About Your Repair History:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>All completed service records are displayed here</li>
            <li>Contact us if you have questions about any repair</li>
            <li>Records are sorted by most recent first</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
