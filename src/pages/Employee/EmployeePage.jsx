import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Search,
  Hash,
  CheckCircle,
  User,
  Edit2,
  Trash2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../features/employeeSlice";
import EmployeeRegistration from "../../components/EmployeeRegistrationModal";
import { toast } from "react-toastify";

// Main EmployeePage Component
export function EmployeePage() {
  const dispatch = useDispatch();
  const { employee: employeesFromRedux, isLoading, error } = useSelector(
    (state) => state.employee,
  );
  const [employees, setEmployees] = useState([]);

  const [showRegistration, setShowRegistration] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    handleLoadEmployees();
  }, []);

  const filteredEmployees = employeesFromRedux.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.nicNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddEmployee = (employee) => {
    if (editingEmployee) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingEmployee.id ? { ...employee, id: emp.id } : emp,
        ),
      );
      setEditingEmployee(null);
    } else {
      setEmployees((prev) => [...prev, employee]);
    }
    // Reload from database to ensure sync
    dispatch(getAllEmployee());
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowRegistration(true);
  };

  const handleDeleteEmployee = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      dispatch(deleteEmployee(id))
        .then(() => {
          toast.success("Employee deleted successfully!");
        })
        .catch((error) => {
          toast.error(error || "Failed to delete employee");
        });
    }
  };

  const handleCloseRegistration = () => {
    setShowRegistration(false);
    setEditingEmployee(null);
  };

  const handleLoadEmployees = () => {
    dispatch(getAllEmployee());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Employee Management
              </h1>
              <p className="text-gray-600">
                Register and manage your organization's employees
              </p>
            </div>
            <button
              onClick={() => {
                setEditingEmployee(null);
                setShowRegistration(true);
              }}
              className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Register Employee</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {employeesFromRedux.length || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            {/* <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {employees.filter((e) => e.status === "Active").length}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div> */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">New This Month</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {
                      employeesFromRedux.filter((employee) => {
                        const today = new Date();
                        const date = new Date(employee.createdAt);
                        return (
                          date.getMonth() === today.getMonth() &&
                          date.getFullYear() === today.getFullYear()
                        );
                      }).length || 0
                    }
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <UserPlus className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            {/* <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Departments</p>
                  <p className="text-2xl font-bold text-orange-600">5</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Hash className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search employees by name, email, or NIC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Employee List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">NIC Number</th>
                <th className="px-6 py-4 font-medium">Contact Number</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Address</th>
                <th className="px-6 py-4 font-medium">EPF Number</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee._id}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">{employee.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {employee.nicNumber}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                  {employee.contactNumber}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {employee.email}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {employee.address}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {employee.epfNumber}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditEmployee(employee)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee._id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistration && (
        <EmployeeRegistration
          onAddEmployee={handleAddEmployee}
          onClose={handleCloseRegistration}
          initialData={editingEmployee}
        />
      )}
    </div>
  );
}
