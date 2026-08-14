import React, { useEffect, useState } from "react";
import { AlertCircle, Edit2, Loader2, Search, Trash2, Users, X } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  deleteCustomer,
  getAllCustomers,
  selectCustomer,
  updateCustomer,
} from "../../../features/customerSlice";

export function CustomerListSection() {
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector(selectCustomer);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingCustomerId, setDeletingCustomerId] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ name: "", contactNumber: "", email: "" });
  const [formErrors, setFormErrors] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    dispatch(getAllCustomers());
  }, [dispatch]);

  const normalizedCustomers = Array.isArray(customers) ? customers : [];
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  const filteredCustomers = normalizedCustomers.filter((customer) =>
    [customer.name, customer.contactNumber, customer.email].some((value) =>
      value?.toString().toLowerCase().includes(normalizedSearchTerm)
    )
  );

  const handleDelete = async (customer) => {
    if (!customer._id) {
      toast.error("This customer cannot be removed because its ID is missing.");
      return;
    }

    if (!window.confirm(`Remove ${customer.name || "this customer"}?`)) {
      return;
    }

    setDeletingCustomerId(customer._id);
    try {
      await dispatch(deleteCustomer(customer._id)).unwrap();
      toast.success("Customer removed successfully.");
    } catch (deleteError) {
      toast.error(deleteError || "Failed to remove customer.");
    } finally {
      setDeletingCustomerId(null);
    }
  };

  const openEditDialog = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name || "",
      contactNumber: customer.contactNumber || "",
      email: customer.email || "",
    });
    setFormErrors({});
  };

  const closeEditDialog = () => {
    if (!isUpdating) {
      setEditingCustomer(null);
      setFormErrors({});
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentFormData) => ({ ...currentFormData, [name]: value }));
    setFormErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    const name = formData.name.trim();
    const contactNumber = formData.contactNumber.trim();
    const email = formData.email.trim();

    if (!name) nextErrors.name = "Customer name is required.";
    if (!contactNumber) nextErrors.contactNumber = "Phone number is required.";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Enter a valid email address.";

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    setIsUpdating(true);
    try {
      await dispatch(updateCustomer({ _id: editingCustomer._id, name, contactNumber, email })).unwrap();
      toast.success("Customer updated successfully.");
      setEditingCustomer(null);
    } catch (updateError) {
      toast.error(updateError || "Failed to update customer.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <section
      id="customers-panel"
      role="tabpanel"
      className="bg-white rounded-lg shadow p-8 max-w-5xl"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Customers</h2>
        <p className="text-gray-600 text-sm mt-1">
          View and search registered customers
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by name, phone, or email"
          className="w-full pl-11 pr-4 py-3 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="text-gray-600">Loading customers...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <p className="text-sm font-medium text-red-700">Unable to load customers</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center p-8 bg-gray-50">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              {searchTerm ? "No customers match your search" : "No customers registered yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer._id || `${customer.email}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-xs font-medium text-gray-900">
                          {customer.name || "Unnamed customer"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-700">
                      {customer.contactNumber || "-"}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-700">
                      {customer.email || "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditDialog(customer)}
                          disabled={loading || !customer._id}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={`Edit ${customer.name || "customer"}`}
                          aria-label={`Edit ${customer.name || "customer"}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(customer)}
                          disabled={loading || deletingCustomerId === customer._id}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={`Remove ${customer.name || "customer"}`}
                          aria-label={`Remove ${customer.name || "customer"}`}
                        >
                          {deletingCustomerId === customer._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
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

      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleUpdate}
            className="w-full max-w-md rounded-lg bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Edit Customer</h3>
                <p className="mt-1 text-sm text-gray-600">Update customer contact details</p>
              </div>
              <button type="button" onClick={closeEditDialog} disabled={isUpdating} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50" aria-label="Close edit customer dialog">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label htmlFor="customer-name" className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                <input id="customer-name" name="name" value={formData.name} onChange={handleFormChange} disabled={isUpdating} className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.name ? "border-red-500" : "border-gray-300"}`} />
                {formErrors.name && <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="customer-phone" className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                <input id="customer-phone" name="contactNumber" type="tel" value={formData.contactNumber} onChange={handleFormChange} disabled={isUpdating} className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.contactNumber ? "border-red-500" : "border-gray-300"}`} />
                {formErrors.contactNumber && <p className="mt-1 text-xs text-red-600">{formErrors.contactNumber}</p>}
              </div>
              <div>
                <label htmlFor="customer-email" className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input id="customer-email" name="email" type="email" value={formData.email} onChange={handleFormChange} disabled={isUpdating} className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.email ? "border-red-500" : "border-gray-300"}`} />
                {formErrors.email && <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>}
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
              <button type="button" onClick={closeEditDialog} disabled={isUpdating} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={isUpdating} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                {isUpdating ? "Updating..." : "Update Customer"}
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </section>
  );
}