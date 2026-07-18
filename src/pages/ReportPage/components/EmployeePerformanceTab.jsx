import React from 'react';
import moment from 'moment';
import {
  Users,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Mail,
  Phone,
  Wrench,
  ChevronDown,
} from 'lucide-react';
import { MetricCard } from './MetricCard';

// ---------------------------------------------------------------------------
// Service history row (expandable)
// ---------------------------------------------------------------------------
const ServiceRow = ({ order, idx, expandedRowId, setExpandedRowId }) => {
  const isExpanded = expandedRowId === idx;

  return (
    <React.Fragment>
      <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
        <td className="px-6 py-4">
          <p className="font-medium text-xs text-slate-900">{order.customer?.name || 'N/A'}</p>
          <p className="text-xs text-slate-500">{order.customer?.contactNumber || ''}</p>
        </td>
        <td className="px-6 py-4 text-xs font-semibold text-slate-900">{order.vehicleNumber || 'N/A'}</td>
        <td className="px-6 py-4 text-xs font-semibold text-slate-900">
          Rs.&nbsp;{(order.laborCost || 0).toLocaleString()}
        </td>
        <td className="px-6 py-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
              order.status === 'completed'
                ? 'bg-lime-200 text-slate-600 border-lime-600'
                : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            {order.status || 'pending'}
          </span>
        </td>
        <td className="px-6 py-4 text-xs font-bold text-slate-900">
          Rs.&nbsp;{(order.totalAmount || 0).toLocaleString()}
        </td>
        <td className="px-6 py-4 text-xs text-slate-700">
          {order.date ? moment(order.date).format('MMM DD, YYYY') : 'N/A'}
        </td>
        <td className="px-6 py-4">
          <button
            onClick={() => setExpandedRowId(isExpanded ? null : idx)}
            className="p-1 hover:bg-slate-200 rounded transition-colors"
            aria-label={isExpanded ? 'Collapse parts' : 'Expand parts'}
          >
            <ChevronDown
              className={`h-4 w-4 text-slate-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-slate-50 border-b border-slate-100">
          <td colSpan="7" className="px-6 py-6">
            <p className="text-sm font-semibold text-slate-900 mb-3">Parts Used</p>
            {Array.isArray(order.parts) && order.parts.length > 0 ? (
              <div className="overflow-x-auto border border-slate-300 rounded-lg">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300">
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">Part Name</th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">Qty</th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">Price</th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.parts.map((part, partIdx) => (
                      <tr key={partIdx} className="border-b border-slate-200 hover:bg-slate-100">
                        <td className="px-4 py-2 font-medium text-slate-900">{part.name || '-'}</td>
                        <td className="px-4 py-2 text-slate-700">{part.quantity ?? '-'}</td>
                        <td className="px-4 py-2 text-slate-700">
                          {part.price != null ? `Rs. ${Number(part.price).toLocaleString()}` : '-'}
                        </td>
                        <td className="px-4 py-2 font-semibold text-slate-900">
                          {part.quantity && part.price
                            ? `Rs. ${(part.quantity * part.price).toLocaleString()}`
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No specific parts recorded</p>
            )}
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

// ---------------------------------------------------------------------------
// Employee selector
// ---------------------------------------------------------------------------
const EmployeeSelector = ({
  employees,
  filteredEmployees,
  selectedEmployeeId,
  selectedEmployee,
  searchTerm,
  setSearchTerm,
  setSelectedEmployeeId,
}) => (
  <div className="mb-8">
    <h2 className="text-slate-900 font-semibold mb-4 flex items-center gap-2">
      <Users className="h-5 w-5 text-slate-700" />
      Select Technician
    </h2>

    <div className="relative mb-4 w-full md:w-96">
      <input
        type="text"
        placeholder="Search technicians…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-3 bg-white border text-sm border-slate-300 rounded-lg text-slate-900
                   placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
      {searchTerm && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-300 rounded-lg
                        shadow-lg z-50 max-h-60 overflow-y-auto">
          {filteredEmployees.length === 0 ? (
            <li className="px-4 py-3 text-center text-slate-500 text-sm">No technicians found</li>
          ) : (
            filteredEmployees.map((emp) => (
              <li key={emp._id || emp.id}>
                <button
                  onClick={() => {
                    setSelectedEmployeeId(emp._id || emp.id);
                    setSearchTerm('');
                  }}
                  className={`w-full px-4 py-3 text-sm text-left transition-colors border-b border-slate-100
                              last:border-b-0 hover:bg-slate-50 ${
                    selectedEmployeeId === (emp._id || emp.id) ? 'bg-slate-100' : ''
                  }`}
                >
                  <p className="font-medium text-slate-900">{emp.name}</p>
                  <p className="text-xs text-slate-500">{emp.position || emp.specialization || 'Technician'}</p>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>

    {selectedEmployee && (
      <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg inline-block">
        <p className="text-sm text-slate-600">
          Selected:&nbsp;
          <span className="font-semibold text-slate-900 px-2">{selectedEmployee.name}</span>
        </p>
      </div>
    )}
  </div>
);

// ---------------------------------------------------------------------------
// Main tab component
// ---------------------------------------------------------------------------
export const EmployeePerformanceTab = ({
  employees,
  filteredEmployees,
  selectedEmployee,
  selectedEmployeeId,
  setSelectedEmployeeId,
  searchTerm,
  setSearchTerm,
  employeeServiceOrders,
  selectedEmployeeStats,
  expandedRowId,
  setExpandedRowId,
}) => {
  if (!employees.length) return null;

  return (
    <div className="space-y-6">
      <EmployeeSelector
        employees={employees}
        filteredEmployees={filteredEmployees}
        selectedEmployee={selectedEmployee}
        selectedEmployeeId={selectedEmployeeId}
        setSelectedEmployeeId={setSelectedEmployeeId}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {!selectedEmployee ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-md">
          <Users className="h-12 w-12 text-slate-400 mx-auto mb-4 opacity-50" />
          <p className="text-slate-600 text-lg">Select a technician to view their details and service history</p>
        </div>
      ) : (
        <>
          {/* Profile card */}
          <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-md">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-1">{selectedEmployee.name}</h2>
              <p className="text-slate-600 flex items-center gap-2 text-sm font-medium">
                <Wrench className="h-4 w-4" />
                {selectedEmployee.specialization || selectedEmployee.position || 'Technician'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-600 text-xs font-semibold uppercase tracking-wide mb-2">Email</p>
                <p className="text-slate-900 font-medium flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-blue-600 shrink-0" />
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
                  <Wrench className="h-4 w-4 text-orange-600" />
                  {employeeServiceOrders.length}
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide mb-2">Completion Rate</p>
                <p className="text-slate-900 font-medium text-lg flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                  {employeeServiceOrders.length > 0
                    ? Math.round((selectedEmployeeStats.completedServices / employeeServiceOrders.length) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Total Services"  value={selectedEmployeeStats.totalServices}     icon={FileText}    color="blue"   subtitle="Overall services handled" />
            <MetricCard title="Completed"        value={selectedEmployeeStats.completedServices} icon={CheckCircle} color="green"  subtitle="Successfully finished"    />
            <MetricCard title="Pending"          value={selectedEmployeeStats.pendingServices}   icon={Clock}       color="amber"  subtitle="In progress"              />
            <MetricCard
              title="Total Revenue"
              value={`Rs. ${selectedEmployeeStats.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              color="purple"
              subtitle="Services revenue"
            />
          </div>

          {/* Service history table */}
          {employeeServiceOrders.length > 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-700" />
                <h3 className="text-base font-semibold text-slate-700">Service History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {['Customer', 'Vehicle', 'Labor', 'Status', 'Amount', 'Date', ''].map((h) => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {employeeServiceOrders.map((order, idx) => (
                      <ServiceRow
                        key={order._id || idx}
                        order={order}
                        idx={idx}
                        expandedRowId={expandedRowId}
                        setExpandedRowId={setExpandedRowId}
                      />
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
        </>
      )}
    </div>
  );
};
