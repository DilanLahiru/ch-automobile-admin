import { Phone, Store, UserPlus, XCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSupplier, updateSupplier, getAllSuppliers } from "../features/supplierSlice";
import { toast } from "react-toastify";

const SupplierRegistrationModal = ({ onAddSupplier, onClose, initialData }) => {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      contactNumber: "",
    }
  );

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.supplier);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Supplier name is required";
    }

    if (!formData.contactNumber?.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10,}$/.test(formData.contactNumber.replace(/[\s-]/g, ""))) {
      newErrors.contactNumber = "Contact number must be at least 10 digits";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      try {
        if (initialData?._id) {
          await dispatch(
            updateSupplier({ ...formData, _id: initialData._id })
          ).unwrap();
          toast.success("Supplier updated successfully!");
        } else {
          await dispatch(
            createSupplier({
              ...formData,
            })
          ).unwrap();
          // Reload suppliers after successful creation
          await dispatch(getAllSuppliers());
          toast.success("Supplier registered successfully!");
        }
        onAddSupplier();
        onClose();
      } catch (error) {
        console.error("Error:", error);
        toast.error(error || "Failed to save supplier");
      }
    } else {
      setErrors(validationErrors);
    }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {initialData?._id ? "Edit Supplier" : "Register New Supplier"}
                </h2>
                <p className="text-sm text-gray-500">
                  Fill in the supplier details below
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XCircle className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Supplier Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-11 rounded-lg border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                  placeholder="ABC Supplier Ltd."
                />
                <Store className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-11 rounded-lg border ${
                    errors.contactNumber ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                  placeholder="+94 71 234 5678"
                />
                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.contactNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {initialData?._id ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{initialData?._id ? "Update Supplier" : "Create Supplier"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierRegistrationModal;
