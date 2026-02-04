
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage/Login';
import { DashboardLayout } from './pages/DashboardLayout/DashboardLayout';
import { OverviewPage } from './pages/OverviewPage/OverviewPage';
import { ServiceHistoryList } from './pages/InventoryPage/ServiceHistoryList';
import { AppointmentsPage } from './pages/AppointmentsPage/AppointmentsPage';
import { RevenuePage } from './pages/RevenuePage/RevenuePage';
import { StockManagementPage } from './pages/StockManagement/StockManagementPage';
import { ServiceOrderPage } from './pages/ServiceOrder/ServiceOrderPage';
import { InvoicePage } from './pages/Invoice/InvoicePage';
import { EmployeePage } from './pages/Employee/EmployeePage';
import {ServiceOrderListPage} from './pages/ServiceOrder/ServiceOrderListPage';

export default function App() {
  return <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="service-orders-list" element={<ServiceHistoryList />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="revenue" element={<RevenuePage />} />
           <Route path="stock" element={<StockManagementPage />} />
            <Route path="service-orders" element={<ServiceOrderPage />} />
            <Route path="invoices/new" element={<InvoicePage />} />
            <Route path="employees" element={<EmployeePage />} />
        </Route>

        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>;
}
