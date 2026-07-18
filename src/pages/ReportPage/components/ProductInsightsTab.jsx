import React from 'react';
import moment from 'moment';
import { Package, CheckCircle } from 'lucide-react';
import { MetricCard } from './MetricCard';

// ---------------------------------------------------------------------------
// Product list table
// ---------------------------------------------------------------------------
const ProductTable = ({ topProducts, selectedInsightProduct, setSelectedInsightProduct }) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md">
    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
      <Package className="h-4 w-4 text-slate-700" />
      <p className="text-xs font-medium text-slate-500">Most Used Products in Services</p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {['Product', 'Total Qty', 'Services Count', 'Total Value'].map((h) => (
              <th key={h} className="px-6 py-4 text-left text-xs font-mono text-slate-700 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {topProducts.length > 0 ? (
            topProducts.map((product) => (
              <tr
                key={product.id}
                onClick={() => setSelectedInsightProduct(product.id)}
                className={`border-b border-slate-100 cursor-pointer hover:bg-slate-200 ${
                  selectedInsightProduct === product.id ? 'bg-slate-100' : ''
                }`}
              >
                <td className="px-6 py-4 text-xs font-display text-slate-700">{product.name}</td>
                <td className="px-6 py-4 text-xs text-slate-700 font-display">{product.totalQuantity}</td>
                <td className="px-6 py-4 text-xs text-slate-700 font-display">{product.servicesCount}</td>
                <td className="px-6 py-4 text-xs font-display text-slate-700">
                  Rs.&nbsp;{product.totalAmount.toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-6 py-8 text-center text-slate-500 text-sm">
                No product usage data available yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Detail table for the selected product
// ---------------------------------------------------------------------------
const ProductServiceDetailTable = ({ selectedProductInsight }) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md">
    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
      <p className="text-xs font-medium text-slate-500">Service Details for Selected Product</p>
      <p className="text-xs text-slate-700 mt-1 font-semibold">
        {selectedProductInsight?.name ?? 'Click a product in the table above'}
      </p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {['Customer', 'Vehicle', 'Employee', 'Qty', 'Amount', 'Date'].map((h) => (
              <th key={h} className="px-6 py-4 text-left text-xs font-mono text-slate-700 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {selectedProductInsight?.services?.length > 0 ? (
            selectedProductInsight.services.slice(0, 10).map((service, index) => (
              <tr key={`${service.orderId}-${index}`} className="border-b border-slate-100 hover:bg-slate-200">
                {/* <td className="px-6 py-4 text-xs font-medium text-slate-900">{service.orderId}</td> */}
                <td className="px-6 py-4 text-xs text-slate-700 font-display">{service.customerName}</td>
                <td className="px-6 py-4 text-xs text-slate-700 font-display">{service.vehicleNumber}</td>
                <td className="px-6 py-4 text-xs text-slate-700 font-display">{service.employeeName}</td>
                <td className="px-6 py-4 text-xs text-slate-700 font-display">{service.quantity}</td>
                <td className="px-6 py-4 text-xs font-display text-slate-700">
                  Rs.&nbsp;{service.lineAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-xs text-slate-700 font-display">
                  {service.date ? moment(service.date).format('MMM DD, YYYY') : 'N/A'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-6 py-8 text-center text-slate-500 text-sm">
                Select a product above to view related service details
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
export const ProductInsightsTab = ({
  topProducts,
  allServiceOrders,
  selectedInsightProduct,
  setSelectedInsightProduct,
  selectedProductInsight,
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <MetricCard
        title="Products Tracked"
        value={topProducts.length}
        icon={Package}
        color="blue"
        subtitle="Top 10 most used products"
      />
      <MetricCard
        title="Completed Services"
        value={allServiceOrders.filter((o) => o?.status === 'completed').length}
        icon={CheckCircle}
        color="green"
        subtitle="Using tracked products"
      />
    </div>

    <ProductTable
      topProducts={topProducts}
      selectedInsightProduct={selectedInsightProduct}
      setSelectedInsightProduct={setSelectedInsightProduct}
    />

    <ProductServiceDetailTable selectedProductInsight={selectedProductInsight} />
  </div>
);
