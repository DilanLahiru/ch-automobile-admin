import React, { useState, useEffect } from "react";
import {
  Filter,
  MoreHorizontal,
  Car,
  AlertCircle,
  CheckCircle2,
  Clock,
  Wrench,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { SearchBar } from "../../components/ui/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { getAllServiceOrders } from "../../features/serviceOrderSlice";

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
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    handleLoadAllServiceOrders();
  }, []);

  useEffect(() => {
    // Filter data whenever serviceOrders or searchTerm changes
    const filtered = serviceOrders.filter(
      (item) =>
        item.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serviceDescription?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredData(filtered);
  }, [serviceOrders, searchTerm]);

  const handleLoadAllServiceOrders = async () => {
    try {
      await dispatch(getAllServiceOrders());
    } catch (error) {
      console.error("Error loading service orders:", error);
    }
  };

  /**
   * Get status badge component based on service order status
   * @param {string} status - The status from backend (completed, pending, in-progress, etc.)
   * @returns {JSX.Element} Badge component with appropriate styling
   */
  const getStatusBadge = (status) => {
    const statusMap = {
      completed: {
        variant: "success",
        icon: CheckCircle2,
        label: "Completed",
      },
      pending: {
        variant: "warning",
        icon: AlertCircle,
        label: "Pending",
      },
      "in-progress": {
        variant: "default",
        icon: Clock,
        label: "In Progress",
      },
      cancelled: {
        variant: "destructive",
        icon: AlertCircle,
        label: "Cancelled",
      },
    };

    const statusConfig = statusMap[status?.toLowerCase()] || {
      variant: "neutral",
      icon: Wrench,
      label: status || "Unknown",
    };

    const Icon = statusConfig.icon;

    return (
      <Badge variant={statusConfig.variant} className="gap-1">
        <Icon className="h-3 w-3" /> {statusConfig.label}
      </Badge>
    );
  };

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
              placeholder="Search vehicle number, customer ID..."
              value={searchTerm}
              onSearch={setSearchTerm}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Filter className="h-3.5 w-3.5" />}
            >
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>

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
                {/* <th className="px-6 py-4 font-medium">Status</th> */}
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    Loading service orders...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((order) => (
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
                            {order.customerId.name || "Unknown Customer"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.customerId.contactNumber || "No Contact"}
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
                    {/* <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td> */}
                    <td className="px-6 py-4 text-right">
                      <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No service orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-6 py-4 sm:flex-row">
          <p className="text-xs text-gray-500">
            Showing <span className="font-medium">{filteredData.length}</span>{" "}
            of <span className="font-medium">{serviceOrders.length}</span> results
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
