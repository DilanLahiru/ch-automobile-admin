import React, { useState, useEffect } from "react";
import {
  Wrench,
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  AlertCircle,
  Save,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllServiceTypes,
  createServiceType,
  updateServiceType,
  deleteServiceType,
  selectServiceTypes,
  selectServiceTypeLoading,
} from "../../../features/serviceTypeSlice";
import { toast } from "react-toastify";

/**
 * ServiceTypeSection Component
 * Handles creating and managing service types in the settings page
 */
export function ServiceTypeSection() {
  const dispatch = useDispatch();
  const serviceTypes = useSelector(selectServiceTypes);
  const loading = useSelector(selectServiceTypeLoading);

  const [formData, setFormData] = useState({ name: "", price: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(getAllServiceTypes());
  }, [dispatch]);

  const filteredServiceTypes = serviceTypes.filter(
    (st) =>
      (st.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (st.price?.toString() || "").includes(searchTerm)
  );

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) {
      newErrors.name = "Service type name is required";
    }
    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = "Price must be a valid positive number";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        if (editingId) {
          await dispatch(
            updateServiceType({
              id: editingId,
              serviceTypeData: {
                name: formData.name,
                price: parseFloat(formData.price),
              },
            })
          ).unwrap();
          toast.success("Service type updated successfully!");
        } else {
          await dispatch(
            createServiceType({
              name: formData.name,
              price: parseFloat(formData.price),
            })
          ).unwrap();
          toast.success("Service type created successfully!");
        }
        setFormData({ name: "", price: "" });
        setEditingId(null);
        dispatch(getAllServiceTypes());
      } catch (error) {
        toast.error(error || "Failed to save service type");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleEdit = (serviceType) => {
    setEditingId(serviceType._id);
    setFormData({
      name: serviceType.name,
      price: serviceType.price,
    });
    setErrors({});
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this service type?")) {
      dispatch(deleteServiceType(id))
        .then(() => {
          toast.success("Service type deleted successfully!");
        })
        .catch((error) => {
          toast.error(error || "Failed to delete service type");
        });
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", price: "" });
    setEditingId(null);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <section
      id="service-type-panel"
      role="tabpanel"
      className="bg-white rounded-lg shadow p-8 max-w-4xl"
    >
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">Service Types</h2>
        <p className="text-gray-600 text-sm mt-1">
          Create and manage service types with pricing
        </p>
      </div>

      {/* Form Section */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {editingId ? "Edit Service Type" : "Create New Service Type"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service Type Name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Service Type Name *
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="e.g., Oil Change, Engine Repair"
                className={`w-full px-4 py-3 pl-11 text-xs rounded-lg border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-200`}
              />
              <Wrench className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Price (Rs) *
            </label>
            <div className="relative">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                disabled={isSubmitting}
                step="0.01"
                min="0"
                placeholder="0.00"
                className={`w-full px-4 py-3 pl-4 text-xs rounded-lg border ${
                  errors.price ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-200`}
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="flex items-center gap-2 px-6 py-3 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {editingId ? "Update" : "Create"}
              </>
            )}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 text-xs border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>
      </motion.form>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Service Types Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-8"
          >
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="text-gray-600">Loading service types...</p>
          </motion.div>
        ) : filteredServiceTypes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-8 bg-gray-50"
          >
            <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              {searchTerm ? "No service types found" : "No service types created yet"}
            </p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                    Service Type Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                    Price (Rs)
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredServiceTypes.map((serviceType, index) => (
                  <motion.tr
                    key={serviceType._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Wrench className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-xs font-medium text-gray-900">
                          {serviceType.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-gray-900">
                        Rs. {parseFloat(serviceType.price).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(serviceType)}
                          disabled={isSubmitting || loading}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(serviceType._id)}
                          disabled={isSubmitting || loading}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
