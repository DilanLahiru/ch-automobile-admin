import React from 'react';
import moment from 'moment';
import { Trophy, CheckCircle } from 'lucide-react';
import { MetricCard } from './MetricCard';

// ---------------------------------------------------------------------------
// Leaderboard table
// ---------------------------------------------------------------------------
const LeaderboardTable = ({
  employeeServiceLeaderboard,
  selectedInsightEmployee,
  setSelectedInsightEmployee,
}) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md">
    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
      <Trophy className="h-4 w-4 text-slate-700" />
      <h3 className="text-xs font-medium text-slate-700">Top Employees by Completed Services</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {['Rank', 'Employee', 'Completed', 'Revenue', 'Latest Service'].map((h) => (
              <th key={h} className="px-6 py-4 text-left text-xs font-mono text-slate-700 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employeeServiceLeaderboard.length > 0 ? (
            employeeServiceLeaderboard.map((employee, index) => (
              <tr
                key={employee.id || employee.name}
                onClick={() => setSelectedInsightEmployee(employee.id)}
                className={`border-b border-slate-100 cursor-pointer hover:bg-slate-200 ${
                  selectedInsightEmployee === employee.id ? 'bg-slate-100' : ''
                }`}
              >
                <td className="px-6 py-4 text-xs font-semibold text-slate-700">#{index + 1}</td>
                <td className="px-6 py-4 text-xs font-medium text-slate-700">{employee.name}</td>
                <td className="px-6 py-4 text-xs text-slate-700 font-medium">{employee.completedServices}</td>
                <td className="px-6 py-4 text-xs font-medium text-slate-700">
                  Rs.&nbsp;{employee.totalRevenue.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-xs text-slate-700">
                  {employee.latestServiceDate
                    ? moment(employee.latestServiceDate).format('MMM DD, YYYY')
                    : 'N/A'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-sm">
                No completed services found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Detail table for selected employee
// ---------------------------------------------------------------------------
const EmployeeServiceDetailTable = ({ selectedEmployeeInsight }) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md">
    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
      <h3 className="text-xs font-medium text-slate-700">Completed Service Details</h3>
      <p className="text-xs font-semibold text-slate-500 mt-1">
        {selectedEmployeeInsight?.name ?? 'Click an employee in the table above'}
      </p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {['Customer', 'Vehicle', 'Service', 'Amount', 'Date'].map((h) => (
              <th key={h} className="px-6 py-4 text-left text-xs font-mono text-slate-700 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {selectedEmployeeInsight?.services?.length > 0 ? (
            selectedEmployeeInsight.services.slice(0, 10).map((service, index) => (
              <tr key={`${service.orderId}-${index}`} className="border-b border-slate-100 hover:bg-slate-200">
                <td className="px-6 py-4 text-xs text-slate-700 font-display">{service.customerName}</td>
                <td className="px-6 py-4 text-xs text-slate-700 font-display">{service.vehicleNumber}</td>
                <td className="px-6 py-4 text-xs text-slate-700 font-display">{service.serviceType}</td>
                <td className="px-6 py-4 text-xs font-display text-slate-900">
                  Rs.&nbsp;{service.totalAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-xs text-slate-700 font-display">
                  {service.date ? moment(service.date).format('MMM DD, YYYY') : 'N/A'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-slate-500 text-sm">
                Select an employee above to view their completed service details
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Main tab component
// ---------------------------------------------------------------------------
export const EmployeeInsightsTab = ({
  employeeServiceLeaderboard,
  allServiceOrders,
  selectedInsightEmployee,
  setSelectedInsightEmployee,
  selectedEmployeeInsight,
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <MetricCard
        title="Employees Ranked"
        value={employeeServiceLeaderboard.length}
        icon={Trophy}
        color="green"
        subtitle="By number of completed services"
      />
      <MetricCard
        title="Completed Services"
        value={allServiceOrders.filter((o) => o?.status === 'completed').length}
        icon={CheckCircle}
        color="purple"
        subtitle="Across all service orders"
      />
    </div>

    <LeaderboardTable
      employeeServiceLeaderboard={employeeServiceLeaderboard}
      selectedInsightEmployee={selectedInsightEmployee}
      setSelectedInsightEmployee={setSelectedInsightEmployee}
    />

    <EmployeeServiceDetailTable selectedEmployeeInsight={selectedEmployeeInsight} />
  </div>
);
