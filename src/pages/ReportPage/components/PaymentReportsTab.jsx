import React from 'react';
import moment from 'moment';
import { CreditCard, DollarSign } from 'lucide-react';
import { MetricCard } from './MetricCard';

// ---------------------------------------------------------------------------
// Payment method summary table
// ---------------------------------------------------------------------------
const PaymentSummaryTable = ({
  paymentMethodReports,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md">
    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
      <CreditCard className="h-4 w-4 text-slate-700" />
      <p className="text-xs font-medium text-slate-700">Payment Method Summary</p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {['Method', 'Services', 'Completed', 'Pending', 'Total Amount', 'Fees'].map((h) => (
              <th key={h} className="px-6 py-4 text-left text-xs font-mono text-slate-700 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paymentMethodReports.length > 0 ? (
            paymentMethodReports.map((method) => (
              <tr
                key={method.id}
                onClick={() => setSelectedPaymentMethod(method.id)}
                className={`border-b border-slate-100 cursor-pointer hover:bg-slate-200 ${
                  selectedPaymentMethod === method.id ? 'bg-slate-100' : ''
                }`}
              >
                <td className="px-6 py-4 text-xs font-medium text-slate-700 uppercase">{method.method}</td>
                <td className="px-6 py-4 text-xs text-slate-700">{method.servicesCount}</td>
                <td className="px-6 py-4 text-xs text-slate-700">{method.completedServices}</td>
                <td className="px-6 py-4 text-xs text-slate-700">{method.pendingServices}</td>
                <td className="px-6 py-4 text-xs font-medium text-slate-700">
                  Rs.&nbsp;{method.totalAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-700">
                  Rs.&nbsp;{method.totalFees.toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-slate-500 text-sm">
                No payment data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Detail table for the selected payment method
// ---------------------------------------------------------------------------
const PaymentDetailTable = ({ selectedPaymentInsight }) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md">
    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
      <h3 className="text-xs font-medium text-slate-700">
        Service Details — {selectedPaymentInsight?.method ?? 'No method selected'}
      </h3>
      <p className="text-xs font-medium text-slate-500 mt-1">
        {selectedPaymentInsight ? 'All service orders paid by this method' : 'Click a row above to drill down'}
      </p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {['Customer', 'Vehicle', 'Employee', 'Status', 'Amount', 'Fee', 'Date'].map((h) => (
              <th key={h} className="px-6 py-4 text-left text-xs font-mono text-slate-700 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {selectedPaymentInsight?.services?.length > 0 ? (
            selectedPaymentInsight.services.slice(0, 12).map((service, index) => (
              <tr key={`${service.orderId}-${index}`} className="border-b border-slate-100 hover:bg-slate-200">
                <td className="px-6 py-4 text-xs text-slate-700">{service.customerName}</td>
                <td className="px-6 py-4 text-xs text-slate-700">{service.vehicleNumber}</td>
                <td className="px-6 py-4 text-xs text-slate-700">{service.employeeName}</td>
                <td className="px-6 py-4 text-xs text-slate-700">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                      service.status === 'completed'
                        ? 'bg-lime-200 text-slate-600 border-lime-600'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {service.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-700">
                  Rs.&nbsp;{service.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-700">
                  Rs.&nbsp;{service.fee.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-xs text-slate-700">
                  {service.date ? moment(service.date).format('MMM DD, YYYY') : 'N/A'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="px-6 py-8 text-center text-slate-500 text-sm">
                Select a payment method above to view service details
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
export const PaymentReportsTab = ({
  paymentMethodReports,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  selectedPaymentInsight,
}) => {
  const totalAmount = paymentMethodReports.reduce((sum, m) => sum + m.totalAmount, 0);
  const totalFees   = paymentMethodReports.reduce((sum, m) => sum + m.totalFees, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Payment Methods"
          value={paymentMethodReports.length}
          icon={CreditCard}
          color="blue"
          subtitle="Methods used in service orders"
        />
        <MetricCard
          title="Total Paid Amount"
          value={`Rs. ${totalAmount.toLocaleString()}`}
          icon={DollarSign}
          color="green"
          subtitle="All payment methods combined"
        />
        <MetricCard
          title="Card Processing Fees"
          value={`Rs. ${totalFees.toLocaleString()}`}
          icon={CreditCard}
          color="amber"
          subtitle="Total fees collected"
        />
      </div>

      <PaymentSummaryTable
        paymentMethodReports={paymentMethodReports}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
      />

      <PaymentDetailTable selectedPaymentInsight={selectedPaymentInsight} />
    </div>
  );
};
