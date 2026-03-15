import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { Users, CheckCircle, Clock, DollarSign, FileText, Mail, Wrench, TrendingUp, AlertCircle, Phone } from 'lucide-react';
import { getAllEmployee, getAllEmployee as fetchAllEmployees } from '../../features/employeeSlice';
import { getAllServiceOrders, getAllServiceOrders as fetchAllServiceOrders, getServiceOrdersByEmployee } from '../../features/serviceOrderSlice';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

/**
 * Report Page - Employee Performance Reporting
 */
const ReportPage = () => {
  const dispatch = useDispatch();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch employee and service order data from API
  useEffect(() => {
    dispatch(fetchAllEmployees());
  }, [dispatch]);

  // Fetch service orders for selected employee
  useEffect(() => {
    if (selectedEmployeeId) {
      dispatch(getServiceOrdersByEmployee(selectedEmployeeId));
    }
  }, [selectedEmployeeId, dispatch]);

  // Load employee and service order data from Redux
  const { employee: employeeState, isLoading: employeeLoading, error: employeeError } = useSelector((state) => state.employee);
  const { employeeRecords, isLoading: serviceLoading, error: serviceError } = useSelector((state) => state.serviceOrder);

  // Memoize the arrays to prevent unnecessary rerenders
  const employees = useMemo(() => {
    if (!Array.isArray(employeeState)) return [];
    return employeeState;
  }, [employeeState]);

  // Set first employee as default when employees load
  useEffect(() => {
    if (employees.length > 0 && !selectedEmployeeId) {
      setSelectedEmployeeId(employees[0]._id || employees[0].id);
    }
  }, [employees, selectedEmployeeId]);

  // Get selected employee data
  const selectedEmployee = useMemo(() => {
    return employees.find(
      (emp) => emp._id === selectedEmployeeId || emp.id === selectedEmployeeId
    );
  }, [employees, selectedEmployeeId]);

  // Get service orders for selected employee from Redux state
  const employeeServiceOrders = useMemo(() => {
    if (!Array.isArray(employeeRecords)) return [];
    return employeeRecords;
  }, [employeeRecords]);

  // Filter employees based on search
  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    return employees.filter((emp) =>
      (emp.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  // Calculate selected employee stats
  const selectedEmployeeStats = useMemo(() => ({
    totalServices: employeeServiceOrders.length,
    completedServices: employeeServiceOrders.filter(
      (o) => o.status === 'completed'
    ).length,
    pendingServices: employeeServiceOrders.filter(
      (o) => o.status === 'pending'
    ).length,
    totalRevenue: employeeServiceOrders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0
    ),
  }), [employeeServiceOrders]);

  // Calculate overall team stats (based on current employee's services)
  const teamStats = useMemo(() => ({
    totalEmployees: employees.length,
    totalServices: employeeServiceOrders.length,
    totalCompleted: employeeServiceOrders.filter((o) => o.status === 'completed').length,
    totalRevenue: employeeServiceOrders.reduce((sum, o) => sum + (o.totalCost || 0), 0),
  }), [employees, employeeServiceOrders]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white shadow-lg rounded-lg border border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-8 w-8 text-slate-700" />
            <h1 className="text-3xl font-bold text-slate-900">Employee Performance Reports</h1>
          </div>
          <p className="text-slate-600 text-sm">Monitor technician productivity and service metrics</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error & Loading States */}
        {employeeError && (
          <div className="mb-6 bg-red-900/30 border border-red-600 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Error loading employees</p>
              <p className="text-sm text-red-200">{employeeError}</p>
            </div>
          </div>
        )}
        {serviceError && (
          <div className="mb-6 bg-red-900/30 border border-red-600 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Error loading service orders</p>
              <p className="text-sm text-red-200">{serviceError}</p>
            </div>
          </div>
        )}
        {(employeeLoading || serviceLoading) && (
          <div className="mb-6 bg-white border border-blue-800 rounded-lg p-4 flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full"></div>
            <p className="text-blue-200">Loading data...</p>
          </div>
        )}

        {/* Employee Selector Dropdown */}
        {employees.length > 0 && (
          <div className="mb-8">
            <h2 className="text-slate-900 font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-slate-700" />
              Select Technician
            </h2>
            <div className="relative mb-4 w-full md:w-96">
              <input
                type="text"
                placeholder="Search technicians..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white border text-sm border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              />
              
              {/* Dropdown List */}
              {searchTerm && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {filteredEmployees.length === 0 ? (
                    <div className="px-4 py-3 text-center text-slate-500 text-sm">
                      No technicians found
                    </div>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <button
                        key={employee._id || employee.id}
                        onClick={() => {
                          setSelectedEmployeeId(employee._id || employee.id);
                          setSearchTerm('');
                        }}
                        className={`w-full px-4 py-3 text-sm text-left transition-colors border-b border-slate-100 last:border-b-0 hover:bg-slate-50 ${
                          selectedEmployeeId === (employee._id || employee.id)
                            ? 'bg-slate-100'
                            : ''
                        }`}
                      >
                        <div className="font-medium text-slate-900">{employee.name}</div>
                        <div className="text-xs text-slate-500">{employee.position || employee.specialization || 'Technician'}</div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            
            {/* Selected Employee Display */}
            {selectedEmployee && (
              <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg inline-block">
                <p className="text-sm text-slate-600">Selected: <span className="font-semibold text-slate-900 px-2">{selectedEmployee.name}</span></p>
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        {selectedEmployee ? (
          <div className="space-y-6">
            {/* Employee Header Card */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-md">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">{selectedEmployee.name}</h2>
                  <p className="text-slate-700 flex items-center gap-2 text-sm font-medium">
                    <Wrench className="h-4 w-4 text-slate-700" />
                    {selectedEmployee.specialization || selectedEmployee.position || 'Technician'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-600 text-xs font-semibold uppercase tracking-wide mb-2">Email</p>
                  <p className="text-slate-900 font-medium flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="truncate">{selectedEmployee.email || 'N/A'}</span>
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-600 text-xs font-semibold uppercase tracking-wide mb-2">Phone</p>
                  <p className="text-slate-900 font-medium text-sm flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    {selectedEmployee.contactNumber || 'N/A'}
                    </p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-600 text-xs font-semibold uppercase tracking-wide mb-2">Total Services</p>
                  <p className="text-slate-900 font-medium text-lg flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-orange-600 inline-block" />
                    {employeeServiceOrders.length}
                    </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide mb-2">Completion Rate</p>
                  <p className="text-slate-900 font-medium text-lg flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-600 inline-block" />
                    {employeeServiceOrders.length > 0 
                      ? Math.round((selectedEmployeeStats.completedServices / employeeServiceOrders.length) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Services"
                value={selectedEmployeeStats.totalServices}
                icon={FileText}
                color="blue"
                subtitle="Overall services handled"
              />
              <MetricCard
                title="Completed"
                value={selectedEmployeeStats.completedServices}
                icon={CheckCircle}
                color="green"
                subtitle="Successfully finished"
              />
              <MetricCard
                title="Pending"
                value={selectedEmployeeStats.pendingServices}
                icon={Clock}
                color="amber"
                subtitle="In progress"
              />
              <MetricCard
                title="Total Revenue"
                value={`Rs. ${selectedEmployeeStats.totalRevenue.toLocaleString()}`}
                icon={DollarSign}
                color="purple"
                subtitle="Services revenue"
              />
            </div>

            {/* Service Details Table */}
            {employeeServiceOrders.length > 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <h3 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-slate-700" />
                    Service History
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Vehicle</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Parts</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Labor</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeServiceOrders.map((order, idx) => (
                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-slate-600">
                            <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs text-slate-700">
                              {order._id ? order._id.substring(0, 6) : 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-xs text-slate-900">{order.customer?.name || 'N/A'}</div>
                            <div className="text-xs text-slate-600">{order.customer?.contactNumber || ''}</div>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-900 font-sans font-semibold">
                            {order.vehicleNumber || 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                              {order.partsCount || 0} parts
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-900 font-semibold">
                            Rs. {(order.laborCost || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                              order.status === 'completed'
                                ? 'bg-lime-200 text-slate-600 border-lime-600'
                                : order.status === 'pending'
                                ? 'bg-slate-100 text-slate-700 border-slate-300'
                                : 'bg-slate-100 text-slate-600 border-slate-300'
                            }`}>
                              {order.status || 'pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-900">
                            Rs. {(order.totalAmount || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-700">
                            {order.date ? moment(order.date).format('MMM DD, YYYY') : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-md">
                <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4 opacity-50" />
                <p className="text-slate-600 text-lg">No service history available for this technician</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-md">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4 opacity-50" />
            <p className="text-slate-600 text-lg">Select a technician to view their details and service history</p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Metric Card Component
 */
const MetricCard = ({ title, value, icon: Icon, color = 'blue', subtitle }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600',
      icon: 'text-blue-600',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-600',
      icon: 'text-green-600',
    },
    amber: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-600',
      icon: 'text-orange-600',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-600',
      icon: 'text-purple-600',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-lg p-4 shadow-sm`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-slate-800 text-sm mb-1 font-semibold">{title}</p>
          <p className="text-xl font-bold text-slate-900">{value}</p>
        </div>
        <Icon className={`h-6 w-6 ${colors.icon} opacity-80`} />
      </div>
      {subtitle && (
        <p className={`text-xs ${colors.text} mt-2`}>{subtitle}</p>
      )}
    </div>
  );
};

export default ReportPage;
