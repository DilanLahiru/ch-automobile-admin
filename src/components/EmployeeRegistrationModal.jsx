import { Hash, IdCard, Mail, MapPin, Phone, UserPlus, Users, XCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEmployee, updateEmployee, getAllEmployee } from "../features/employeeSlice";
import { toast } from "react-toastify";

const EmployeeRegistration = ({ onAddEmployee, onClose, initialData }) => {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      contactNumber: "",
      email: "",
      address: "",
      nicNumber: "",
      epfNumber: "",
      //department: '',
      //position: ''
    },
  );

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.employee);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.contactNumber?.trim())
      newErrors.contactNumber = "Contact number is required";
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.address?.trim()) newErrors.address = "Address is required";
    if (!formData.nicNumber?.trim())
      newErrors.nicNumber = "NIC number is required";
    if (!formData.epfNumber?.trim())
      newErrors.epfNumber = "EPF number is required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      try {
        if (initialData?._id) {
          await dispatch(
            updateEmployee({ ...formData, _id: initialData._id }),
          ).unwrap();
          toast.success("Employee updated successfully!");
        } else {
          const result = await dispatch(
            createEmployee({
              ...formData,
            }),
          ).unwrap();
          // Reload employees after successful creation
          await dispatch(getAllEmployee());
          toast.success("Employee registered successfully!");
        }
        onAddEmployee();
        onClose();
      } catch (error) {
        console.error("Error:", error);
        toast.error(error || "Failed to save employee");
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {initialData?._id ? "Edit Employee" : "Register New Employee"}
                </h2>
                <p className="text-sm text-gray-500">
                  Fill in the employee details below
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-11 rounded-lg border ${errors.name ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                  placeholder="John Doe"
                />
                <Users className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

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
                  className={`w-full px-4 py-3 pl-11 rounded-lg border ${errors.contactNumber ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                  placeholder="+94 77 123 4567"
                />
                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.contactNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.contactNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-11 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                  placeholder="john@company.com"
                />
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NIC Number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="nicNumber"
                  value={formData.nicNumber || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-11 rounded-lg border ${errors.nicNumber ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                  placeholder="123456789V"
                />
                <IdCard className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.nicNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.nicNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                EPF Number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="epfNumber"
                  value={formData.epfNumber || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-11 rounded-lg border ${errors.epfNumber ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                  placeholder="EPF123456"
                />
                <Hash className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.epfNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.epfNumber}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <div className="relative">
                <textarea
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-4 py-3 pl-11 rounded-lg border ${errors.address ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none`}
                  placeholder="123 Main Street, Colombo"
                />
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Saving..."
                : initialData?._id
                  ? "Update Employee"
                  : "Register Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeRegistration;