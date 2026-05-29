import React, { useState, useEffect } from "react";
import {
  DollarSign,
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
  getAllOtherCharges,
  createOtherCharge,
  updateOtherCharge,
  deleteOtherCharge,
  selectOtherCharges,
  selectOtherChargesLoading,
} from "../../../features/otherChargesSlice";
import { toast } from "react-toastify";

/**
 * OtherChargesSection Component
 * Handles creating and managing other charges in the settings page
 */
export function OtherChargesSection() {
  const dispatch = useDispatch();
  const otherCharges = useSelector(selectOtherCharges);
  const loading = useSelector(selectOtherChargesLoading);

  const [formData, setFormData] = useState({ chargeType: "", amount: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(getAllOtherCharges());
  }, [dispatch]);

  const filteredCharges = otherCharges.filter(
    (charge) =>
      (charge.chargeType?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (charge.amount?.toString() || "").includes(searchTerm)
  );

  const validateForm = () => {
    const newErrors = {};
    if (!formData.chargeType?.trim()) {
      newErrors.chargeType = "Charge type is required";
    }
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) < 0) {
      newErrors.amount = "Amount must be a valid positive number";
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
            updateOtherCharge({
              id: editingId,
              chargeData: {
                chargeType: formData.chargeType,
                amount: parseFloat(formData.amount),
              },
            })
          ).unwrap();
          toast.success("Charge updated successfully!");
        } else {
          await dispatch(
            createOtherCharge({
              chargeType: formData.chargeType,
              amount: parseFloat(formData.amount),
            })
          ).unwrap();
          toast.success("Charge created successfully!");
        }
        setFormData({ chargeType: "", amount: "" });
        setEditingId(null);
        dispatch(getAllOtherCharges());
      } catch (error) {
        toast.error(error || "Failed to save charge");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleEdit = (charge) => {
    setEditingId(charge._id);
    setFormData({
      chargeType: charge.chargeType,
      amount: charge.amount,
    });
    setErrors({});
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this charge?")) {
      dispatch(deleteOtherCharge(id))
        .then(() => {
          toast.success("Charge deleted successfully!");
        })
        .catch((error) => {
          toast.error(error || "Failed to delete charge");
        });
    }
  };

  const handleCancel = () => {
    setFormData({ chargeType: "", amount: "" });
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
      id="other-charges-panel"
      role="tabpanel"
      className="bg-white rounded-lg shadow p-8 max-w-4xl"
    >
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">Other Charges</h2>
        <p className="text-gray-600 text-sm mt-1">
          Create and manage other charges with amounts
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
          {editingId ? "Edit Charge" : "Create New Charge"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Charge Type */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Charge Type *
            </label>
            <div className="relative">
              <input
                type="text"
                name="chargeType"
                value={formData.chargeType}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="e.g. Transport Fee"
                className={`w-full px-4 py-3 pl-4 text-xs rounded-lg border ${
                  errors.chargeType ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-200`}
              />
            </div>
            {errors.chargeType && (
              <p className="mt-1 text-sm text-red-600">{errors.chargeType}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Amount (Rs) *
            </label>
            <div className="relative">
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                disabled={isSubmitting}
                step="0.01"
                min="0"
                placeholder="0.00"
                className={`w-full px-4 py-3 pl-4 text-xs rounded-lg border ${
                  errors.amount ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-200`}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
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
            placeholder="Search by charge type or amount"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Other Charges Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-8"
          >
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="text-gray-600">Loading charges...</p>
          </motion.div>
        ) : filteredCharges.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-8 bg-gray-50"
          >
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              {searchTerm ? "No charges found" : "No charges created yet"}
            </p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                    Charge Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                    Amount (Rs)
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCharges.map((charge, index) => (
                  <motion.tr
                    key={charge._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <DollarSign className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-xs font-medium text-gray-900">
                          {charge.chargeType}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-gray-900">
                        Rs. {parseFloat(charge.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(charge)}
                          disabled={isSubmitting || loading}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(charge._id)}
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
