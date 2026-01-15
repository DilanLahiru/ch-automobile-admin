import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  IdCard,
  Hash,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Employee Registration Component
const EmployeeRegistration = ({ onAddEmployee, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
    address: '',
    nicNumber: '',
    epfNumber: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.nicNumber.trim()) newErrors.nicNumber = 'NIC number is required';
    if (!formData.epfNumber.trim()) newErrors.epfNumber = 'EPF number is required';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      onAddEmployee({
        ...formData,
        id: Date.now(),
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      });
      setFormData({
        name: '',
        contactNumber: '',
        email: '',
        address: '',
        nicNumber: '',
        epfNumber: ''
      });
      onClose();
    } else {
      setErrors(validationErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Register New Employee</h2>
                <p className="text-sm text-gray-500">Fill in the employee details below</p>
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
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-11 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
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
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-11 rounded-lg border ${errors.contactNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                  placeholder="+94 77 123 4567"
                />
                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.contactNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
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
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-11 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
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
                  value={formData.nicNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-11 rounded-lg border ${errors.nicNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
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
                  value={formData.epfNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-11 rounded-lg border ${errors.epfNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
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
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-4 py-3 pl-11 rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none`}
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
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
            >
              Register Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Employee Card Component
const EmployeeCard = ({ employee, onEdit, onDelete }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (str) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-pink-100 text-pink-600',
      'bg-orange-100 text-orange-600'
    ];
    const index = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${getRandomColor(employee.name)} font-semibold text-lg`}>
              {getInitials(employee.name)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{employee.name}</h3>
              <p className="text-sm text-gray-500">{employee.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(employee)}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => onDelete(employee.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Phone className="w-4 h-4 text-gray-400 mr-3" />
            <span className="text-gray-600">{employee.contactNumber}</span>
          </div>
          <div className="flex items-center text-sm">
            <IdCard className="w-4 h-4 text-gray-400 mr-3" />
            <span className="text-gray-600">NIC: {employee.nicNumber}</span>
          </div>
          <div className="flex items-center text-sm">
            <Hash className="w-4 h-4 text-gray-400 mr-3" />
            <span className="text-gray-600">EPF: {employee.epfNumber}</span>
          </div>
          <div className="flex items-start text-sm">
            <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-1" />
            <span className="text-gray-600">{employee.address}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-sm font-medium text-green-600">{employee.status}</span>
          </div>
          <span className="text-xs text-gray-500">
            Joined: {new Date(employee.joinDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

// Main EmployeePage Component
export function EmployeePage() {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'John Smith',
      contactNumber: '+94 77 123 4567',
      email: 'john.smith@company.com',
      address: '123 Main Street, Colombo',
      nicNumber: '123456789V',
      epfNumber: 'EPF123456',
      joinDate: '2024-01-15',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      contactNumber: '+94 76 234 5678',
      email: 'sarah.j@company.com',
      address: '456 Park Avenue, Kandy',
      nicNumber: '987654321V',
      epfNumber: 'EPF654321',
      joinDate: '2024-02-20',
      status: 'Active'
    }
  ]);

  const [showRegistration, setShowRegistration] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.nicNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = (employee) => {
    if (editingEmployee) {
      setEmployees(prev =>
        prev.map(emp => emp.id === editingEmployee.id ? { ...employee, id: emp.id } : emp)
      );
      setEditingEmployee(null);
    } else {
      setEmployees(prev => [...prev, employee]);
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowRegistration(true);
  };

  const handleDeleteEmployee = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const handleCloseRegistration = () => {
    setShowRegistration(false);
    setEditingEmployee(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Management</h1>
              <p className="text-gray-600">Register and manage your organization's employees</p>
            </div>
            <button
              onClick={() => setShowRegistration(true)}
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
                  <p className="text-2xl font-bold text-gray-800">{employees.length}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {employees.filter(e => e.status === 'Active').length}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">New This Month</p>
                  <p className="text-2xl font-bold text-purple-600">2</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <UserPlus className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Departments</p>
                  <p className="text-2xl font-bold text-orange-600">5</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Hash className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
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
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Employee Directory ({filteredEmployees.length})
          </h2>
          
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <Users className="w-16 h-16 text-gray-300 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No employees found</h3>
              <p className="text-gray-500">Try adjusting your search or add a new employee</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map(employee => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  onEdit={handleEditEmployee}
                  onDelete={handleDeleteEmployee}
                />
              ))}
            </div>
          )}
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

export default EmployeePage;