import React from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';

import { REPORT_TABS }            from './constants/reportTabs';
import { useReportData }           from './hooks/useReportData';
import { TabNavigation }           from './components/TabNavigation';
import { EmployeePerformanceTab }  from './components/EmployeePerformanceTab';
import { ProductInsightsTab }      from './components/ProductInsightsTab';
import { EmployeeInsightsTab }     from './components/EmployeeInsightsTab';
import { PaymentReportsTab }       from './components/PaymentReportsTab';

// ---------------------------------------------------------------------------
// Render helpers
// ---------------------------------------------------------------------------
const renderTab = (activeTab, data) => {
  switch (activeTab) {
    case 'employee-performance':
      return <EmployeePerformanceTab {...data} />;
    case 'product-insights':
      return <ProductInsightsTab {...data} />;
    case 'employee-insights':
      return <EmployeeInsightsTab {...data} />;
    case 'payment-reports':
      return <PaymentReportsTab {...data} />;
    default:
      return null;
  }
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const ReportPage = () => {
  const data = useReportData();
  const { activeTab, setActiveTab, employeeLoading, serviceLoading, employeeError, serviceError } = data;
  return (
    <div className="min-h-screen bg-white">
      {/* â”€â”€ Page header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="bg-white shadow-lg rounded-lg border border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-8 w-8 text-slate-700" />
            <h1 className="text-3xl font-bold text-slate-900">Service Reports</h1>
          </div>
          <p className="text-slate-600 text-sm">
            Monitor technician productivity, product usage, and payment insights
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* â”€â”€ Error banners â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {employeeError && (
          <div className="mb-6 bg-red-900/30 border border-red-600 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Error loading employees</p>
              <p className="text-sm text-red-200">{employeeError}</p>
            </div>
          </div>
        )}
        {serviceError && (
          <div className="mb-6 bg-red-900/30 border border-red-600 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Error loading service orders</p>
              <p className="text-sm text-red-200">{serviceError}</p>
            </div>
          </div>
        )}

        {/* â”€â”€ Loading indicator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {(employeeLoading || serviceLoading) && (
          <div className="mb-6 bg-white border border-blue-300 rounded-lg p-4 flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full" />
            <p className="text-blue-600 text-sm">Loading dataâ€¦</p>
          </div>
        )}

        {/* â”€â”€ Tabs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <TabNavigation tabs={REPORT_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* â”€â”€ Active tab content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {renderTab(activeTab, data)}
      </div>
    </div>
  );
};

export default ReportPage;
