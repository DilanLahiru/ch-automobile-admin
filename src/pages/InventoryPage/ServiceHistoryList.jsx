import React, { useState, useEffect, useMemo } from "react";
import {
  Filter,
  MoreHorizontal,
  Car,
  AlertCircle,
  CheckCircle2,
  Clock,
  Wrench,
  X,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { SearchBar } from "../../components/ui/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { getAllServiceOrders } from "../../features/serviceOrderSlice";
import {
  downloadServiceHistoryAsPDF,
  printServiceHistory,
} from "../../utils/serviceHistoryPdfUtils";

/**
 * Utility function to format currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
  }).format(amount);
};

/**
 * Utility function to format date
 * @param {string} dateString - ISO date string from backend
 * @returns {string} Formatted date string
 */
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Utility function to format time
 * @param {string} dateString - ISO date string from backend
 * @returns {string} Formatted time string
 */
const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function ServiceHistoryList() {
  const dispatch = useDispatch();
  const { orders: serviceOrders = [], loading } = useSelector(
    (state) => state.serviceOrder,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    employee: "all",
    dateFrom: "",
    dateTo: "",
    minAmount: "",
    maxAmount: "",
    sortBy: "newest",
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    handleLoadAllServiceOrders();
  }, []);

  const statuses = useMemo(
    () =>
      [...new Set(serviceOrders.map((order) => String(order.status || "").trim()).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b)),
    [serviceOrders],
  );

  const employees = useMemo(() => {
    const employeeMap = new Map();
    serviceOrders.forEach((order) => {
      const employee = order.employeeId;
      const id =
        typeof employee === "object" && employee
          ? employee._id || employee.name || "unassigned"
          : employee || "unassigned";
      const name =
        typeof employee === "object" && employee
          ? employee.name || "Unassigned"
          : employee || "Unassigned";
      employeeMap.set(String(id), { id: String(id), name: String(name) });
    });
    return [...employeeMap.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [serviceOrders]);

  const filteredData = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const startDate = filters.dateFrom
      ? new Date(`${filters.dateFrom}T00:00:00`).getTime()
      : null;
    const endDate = filters.dateTo
      ? new Date(`${filters.dateTo}T23:59:59.999`).getTime()
      : null;

    const filtered = serviceOrders.filter((item) => {
      const customer = item.customerId;
      const customerName =
        typeof customer === "object" && customer ? customer.name : customer;
      const employee = item.employeeId;
      const employeeName =
        typeof employee === "object" && employee
          ? employee.name || "Unassigned"
          : employee || "Unassigned";
      const employeeId =
        typeof employee === "object" && employee
          ? employee._id || employee.name || "unassigned"
          : employee || "unassigned";
      const searchableValues = [
        item.vehicleNumber,
        customerName,
        typeof customer === "object" && customer ? customer.contactNumber : "",
        item.serviceDescription,
        employeeName,
      ];
      const matchesSearch =
        !normalizedSearch ||
        searchableValues.some((value) =>
          String(value || "").toLowerCase().includes(normalizedSearch),
        );
      const matchesStatus =
        filters.status === "all" ||
        String(item.status || "").trim().toLowerCase() ===
          filters.status.toLowerCase();
      const matchesEmployee =
        filters.employee === "all" ||
        String(employeeId) === filters.employee;

      const serviceDate = new Date(item.createdAt).getTime();
      const matchesStartDate = startDate === null || serviceDate >= startDate;
      const matchesEndDate = endDate === null || serviceDate <= endDate;
      const amount = Number(item.totalAmount) || 0;
      const matchesMinAmount =
        filters.minAmount === "" || amount >= Number(filters.minAmount);
      const matchesMaxAmount =
        filters.maxAmount === "" || amount <= Number(filters.maxAmount);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesEmployee &&
        matchesStartDate &&
        matchesEndDate &&
        matchesMinAmount &&
        matchesMaxAmount
      );
    });

    return [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "amount-asc":
          return (Number(a.totalAmount) || 0) - (Number(b.totalAmount) || 0);
        case "amount-desc":
          return (Number(b.totalAmount) || 0) - (Number(a.totalAmount) || 0);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [serviceOrders, searchTerm, filters]);

  const activeFilterCount =
    Number(filters.status !== "all") +
    Number(filters.employee !== "all") +
    Number(filters.dateFrom !== "") +
    Number(filters.dateTo !== "") +
    Number(filters.minAmount !== "") +
    Number(filters.maxAmount !== "") +
    Number(filters.sortBy !== "newest");

  const handleFilterChange = (field, value) => {
    setFilters((previous) => ({ ...previous, [field]: value }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      status: "all",
      employee: "all",
      dateFrom: "",
      dateTo: "",
      minAmount: "",
      maxAmount: "",
      sortBy: "newest",
    });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [serviceOrders, searchTerm, filters]);

  const handleLoadAllServiceOrders = async () => {
    try {
      await dispatch(getAllServiceOrders());
    } catch (error) {
      console.error("Error loading service orders:", error);
    }
  };

  const handleShowInvoice = (order) => {
    setSelectedOrder(order);
    setShowInvoiceModal(true);
  };

  const handleCloseInvoiceModal = () => {
    setShowInvoiceModal(false);
    setSelectedOrder(null);
  };

  const totalPages = Math.max(1, Math.ceil(filteredData.length / recordsPerPage));
  const firstRecordIndex = (currentPage - 1) * recordsPerPage;
  const paginatedData = filteredData.slice(
    firstRecordIndex,
    firstRecordIndex + recordsPerPage,
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service History</h1>
          <p className="text-sm text-gray-500">
            Track and manage all service orders and repairs.
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <Card noPadding className="overflow-visible">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-72">
            <SearchBar
              placeholder="Search vehicle, customer, service, or employee..."
              value={searchTerm}
              onSearch={setSearchTerm}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Filter className="h-3.5 w-3.5" />}
              onClick={() => setIsFilterOpen((open) => !open)}
              aria-expanded={isFilterOpen}
            >
              Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </Button>
            {(activeFilterCount > 0 || searchTerm.trim()) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            )}
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>

        {isFilterOpen && (
          <div className="border-b border-gray-100 bg-gray-50/70 p-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="space-y-1.5">
                <label htmlFor="history-employee" className="text-xs font-medium text-gray-700">
                  Assigned employee
                </label>
                <select
                  id="history-employee"
                  value={filters.employee}
                  onChange={(event) => handleFilterChange("employee", event.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-700"
                >
                  <option value="all">All employees</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="history-date-from" className="text-xs font-medium text-gray-700">
                  Service date from
                </label>
                <input
                  id="history-date-from"
                  type="date"
                  value={filters.dateFrom}
                  max={filters.dateTo || undefined}
                  onChange={(event) => handleFilterChange("dateFrom", event.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-700"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="history-date-to" className="text-xs font-medium text-gray-700">
                  Service date to
                </label>
                <input
                  id="history-date-to"
                  type="date"
                  value={filters.dateTo}
                  min={filters.dateFrom || undefined}
                  onChange={(event) => handleFilterChange("dateTo", event.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-700"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="history-sort" className="text-xs font-medium text-gray-700">
                  Sort by
                </label>
                <select
                  id="history-sort"
                  value={filters.sortBy}
                  onChange={(event) => handleFilterChange("sortBy", event.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-700"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="amount-desc">Amount: high to low</option>
                  <option value="amount-asc">Amount: low to high</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Vehicle</th>
                <th className="px-6 py-4 font-medium">Service Date</th>
                <th className="px-6 py-4 font-medium">Assign To</th>
                <th className="px-6 py-4 font-medium">Service Description</th>
                <th className="px-6 py-4 font-medium">Parts</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    Loading service orders...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                paginatedData.map((order) => (
                  <tr
                    key={order._id}
                    className="group transition-colors hover:bg-gray-50/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                          <Car className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-xs">
                            {order.vehicleNumber || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.customerId?.name || "Unknown Customer"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.customerId?.contactNumber || "No Contact"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-900">
                        {formatDate(order.createdAt)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(order.createdAt)}
                      </div>
                    </td>

                    <td className="px-6 py-4 w-40">
                      <p className="text-gray-600 text-xs">
                        {order.employeeId?.name || "Unassigned"}
                      </p>
                    </td>

                    <td className="px-6 py-4 w-40">
                      <p className="text-gray-600 text-xs">
                        {order.serviceDescription || "General Service"}
                      </p>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {order.parts && order.parts.length > 0 ? (
                          order.parts.map((part, idx) => (
                            <div key={idx} className="text-xs text-gray-600">
                              <p className="font-medium">{part.name?.toLowerCase()}</p>
                              <p className="text-gray-500">
                                Qty: {part.quantity}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-500">No parts</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-semibold text-gray-900 text-xs">
                        {formatCurrency(order.totalAmount || 0)}
                      </p>
                      {/* <p className="text-xs text-gray-500">
                        Labor: {formatCurrency(order.laborCost || 0)}
                      </p> */}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => printServiceHistory(order)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-100 hover:text-blue-600"
                          title="Print Service History"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            downloadServiceHistoryAsPDF(
                              order,
                              `Service_History_${order.vehicleNumber}.pdf`
                            )
                          }
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-green-100 hover:text-green-600"
                          title="Download as PDF"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleShowInvoice(order)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm.trim() || activeFilterCount > 0
                      ? "No service orders match your search or filters."
                      : "No service orders found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-6 py-4 sm:flex-row">
          <p className="text-xs text-gray-500">
            Showing <span className="font-medium">{filteredData.length === 0 ? 0 : firstRecordIndex + 1}-{Math.min(firstRecordIndex + recordsPerPage, filteredData.length)}</span>{" "}
            of <span className="font-medium">{filteredData.length}</span> results
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ChevronLeft className="h-3.5 w-3.5" />}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages || filteredData.length === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}