import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Phone,
  AlertCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../features/supplierSlice";
import SupplierRegistrationModal from "../../components/SupplierRegistrationModal";
import { toast } from "react-toastify";

export function SupplierPage() {
  const dispatch = useDispatch();
  const { suppliers, loading, error } = useSelector(
    (state) => state.supplier
  );

  const [showRegistration, setShowRegistration] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSupplier, setEditingSupplier] = useState(null);

  useEffect(() => {
    handleLoadSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      (supplier.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (supplier.contactNumber?.toString() || "").includes(searchTerm)
  );

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    dispatch(getAllSuppliers());
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setShowRegistration(true);
  };

  const handleDeleteSupplier = (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      dispatch(deleteSupplier(id))
        .then(() => {
          toast.success("Supplier deleted successfully!");
        })
        .catch((error) => {
          toast.error(error || "Failed to delete supplier");
        });
    }
  };

  const handleCloseRegistration = () => {
    setShowRegistration(false);
    setEditingSupplier(null);
  };

  const handleLoadSuppliers = () => {
    dispatch(getAllSuppliers());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Supplier Management
              </h1>
              <p className="text-gray-600 text-sm font-sans">
                Register and manage your suppliers
              </p>
            </div>
            <button
              onClick={() => {
                setEditingSupplier(null);
                setShowRegistration(true);
              }}
              className="mt-4 md:mt-0 flex text-sm items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Supplier
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or contact number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 text-sm font-sans pl-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Suppliers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {suppliers.length}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Suppliers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {suppliers.length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Filtered Results</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredSuppliers.length}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Table Header */}
          <div className="overflow-x-auto">
            {loading && suppliers.length === 0 ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading suppliers...</p>
                </div>
              </div>
            ) : error ? (
              <div className="p-8">
                <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <p>{error}</p>
                </div>
              </div>
            ) : filteredSuppliers.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12">
                <Package className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No suppliers found
                </h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  {suppliers.length === 0
                    ? "Start by adding your first supplier"
                    : "Try adjusting your search criteria"}
                </p>
                <button
                  onClick={() => {
                    setEditingSupplier(null);
                    setShowRegistration(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Supplier
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Supplier Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Contact Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuppliers.map((supplier, index) => (
                    <tr
                      key={supplier._id}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm font-sans">
                              {supplier.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-sans">{supplier.contactNumber}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditSupplier(supplier)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSupplier(supplier._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistration && (
        <SupplierRegistrationModal
          onAddSupplier={handleAddSupplier}
          onClose={handleCloseRegistration}
          initialData={editingSupplier}
        />
      )}
    </div>
  );
}

export default SupplierPage;