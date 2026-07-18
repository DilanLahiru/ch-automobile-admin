import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllEmployee as fetchAllEmployees } from '../../../features/employeeSlice';
import {
  getAllServiceOrders as fetchAllServiceOrders,
  getServiceOrdersByEmployee,
} from '../../../features/serviceOrderSlice';

// ---------------------------------------------------------------------------
// Pure helper — intentionally not exported (internal to this hook)
// ---------------------------------------------------------------------------
const resolveEmployeeMeta = (order, employees) => {
  const emp = order?.employeeId;

  if (emp && typeof emp === 'object') {
    return { id: emp._id || emp.id || '', name: emp.name || 'Unknown Employee' };
  }

  if (typeof emp === 'string') {
    const matched = employees.find((e) => e._id === emp || e.id === emp);
    return { id: emp, name: matched?.name || 'Unknown Employee' };
  }

  return { id: '', name: 'Unknown Employee' };
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export const useReportData = () => {
  const dispatch = useDispatch();

  // ── UI state ──────────────────────────────────────────────────────────────
  const [activeTab,              setActiveTab]              = useState('employee-performance');
  const [selectedEmployeeId,     setSelectedEmployeeId]     = useState(null);
  const [searchTerm,             setSearchTerm]             = useState('');
  const [expandedRowId,          setExpandedRowId]          = useState(null);
  const [selectedInsightProduct, setSelectedInsightProduct] = useState('');
  const [selectedInsightEmployee,setSelectedInsightEmployee]= useState('');
  const [selectedPaymentMethod,  setSelectedPaymentMethod]  = useState('');

  // ── Initial data fetch ────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchAllEmployees());
    dispatch(fetchAllServiceOrders());
  }, [dispatch]);

  // Re-fetch per-employee service history whenever selection changes
  useEffect(() => {
    if (selectedEmployeeId) {
      dispatch(getServiceOrdersByEmployee(selectedEmployeeId));
    }
  }, [selectedEmployeeId, dispatch]);

  // ── Redux selectors ───────────────────────────────────────────────────────
  const {
    employee: employeeState,
    isLoading: employeeLoading,
    error:     employeeError,
  } = useSelector((state) => state.employee);

  const {
    orders,
    employeeRecords,
    isLoading: serviceLoading,
    error:     serviceError,
  } = useSelector((state) => state.serviceOrder);

  // ── Derived lists ─────────────────────────────────────────────────────────
  const employees = useMemo(
    () => (Array.isArray(employeeState) ? employeeState : []),
    [employeeState],
  );

  const allServiceOrders = useMemo(
    () => (Array.isArray(orders) ? orders : []),
    [orders],
  );

  const employeeServiceOrders = useMemo(
    () => (Array.isArray(employeeRecords) ? employeeRecords : []),
    [employeeRecords],
  );

  // Auto-select first employee on load
  useEffect(() => {
    if (employees.length > 0 && !selectedEmployeeId) {
      setSelectedEmployeeId(employees[0]._id || employees[0].id);
    }
  }, [employees, selectedEmployeeId]);

  // ── Employee-performance tab data ─────────────────────────────────────────
  const selectedEmployee = useMemo(
    () => employees.find((emp) => emp._id === selectedEmployeeId || emp.id === selectedEmployeeId),
    [employees, selectedEmployeeId],
  );

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    return employees.filter((emp) =>
      (emp.name || '').toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [employees, searchTerm]);

  const selectedEmployeeStats = useMemo(
    () => ({
      totalServices:     employeeServiceOrders.length,
      completedServices: employeeServiceOrders.filter((o) => o.status === 'completed').length,
      pendingServices:   employeeServiceOrders.filter((o) => o.status === 'pending').length,
      totalRevenue:      employeeServiceOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    }),
    [employeeServiceOrders],
  );

  // ── Product-insights tab data ─────────────────────────────────────────────
  const topProducts = useMemo(() => {
    const productMap = new Map();

    allServiceOrders.forEach((order) => {
      const parts = Array.isArray(order?.parts) ? order.parts : [];
      if (!parts.length) return;

      parts.forEach((part) => {
        const name     = part?.name || 'Unknown Product';
        const quantity = Number(part?.quantity) || 0;
        const price    = Number(part?.price)    || 0;
        const key      = part?._id || name;

        if (!productMap.has(key)) {
          productMap.set(key, {
            id: key, name, totalQuantity: 0, totalAmount: 0, servicesCount: 0, services: [],
          });
        }

        const current = productMap.get(key);
        current.totalQuantity += quantity;
        current.totalAmount   += quantity * price;
        current.servicesCount += 1;
        current.services.push({
          orderId:      order?._id || '-',
          customerName: order?.customer?.name || order?.customerId?.name || 'N/A',
          vehicleNumber: order?.vehicleNumber || 'N/A',
          employeeName: resolveEmployeeMeta(order, employees).name,
          status:       order?.status || 'pending',
          date:         order?.date || order?.createdAt || order?.orderDate || null,
          quantity,
          lineAmount:   quantity * price,
        });
      });
    });

    return Array.from(productMap.values())
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10);
  }, [allServiceOrders, employees]);

  // ── Employee-insights tab data ────────────────────────────────────────────
  const employeeServiceLeaderboard = useMemo(() => {
    const employeeMap = new Map();

    allServiceOrders
      .filter((order) => order?.status === 'completed')
      .forEach((order) => {
        const { id, name } = resolveEmployeeMeta(order, employees);
        const key = id || name;

        if (!employeeMap.has(key)) {
          employeeMap.set(key, {
            id: key, name, completedServices: 0, totalRevenue: 0, latestServiceDate: null, services: [],
          });
        }

        const current     = employeeMap.get(key);
        const serviceDate = order?.date || order?.createdAt || order?.orderDate || null;

        current.completedServices += 1;
        current.totalRevenue      += Number(order?.totalAmount || 0);

        if (
          !current.latestServiceDate ||
          (serviceDate && new Date(serviceDate) > new Date(current.latestServiceDate))
        ) {
          current.latestServiceDate = serviceDate;
        }

        current.services.push({
          orderId:      order?._id || '-',
          customerName: order?.customer?.name || order?.customerId?.name || 'N/A',
          vehicleNumber: order?.vehicleNumber || 'N/A',
          totalAmount:  Number(order?.totalAmount || 0),
          date:         serviceDate,
          serviceType:  order?.serviceType || order?.serviceDescription || 'General Service',
        });
      });

    return Array.from(employeeMap.values()).sort((a, b) => b.completedServices - a.completedServices);
  }, [allServiceOrders, employees]);

  // ── Payment-reports tab data ──────────────────────────────────────────────
  const paymentMethodReports = useMemo(() => {
    const paymentMap = new Map();

    allServiceOrders.forEach((order) => {
      const raw         = (order?.paymentType || 'unknown').toString().trim().toLowerCase();
      const paymentType = raw || 'unknown';
      const methodLabel =
        paymentType === 'unknown'
          ? 'Not Specified'
          : paymentType.charAt(0).toUpperCase() + paymentType.slice(1);

      if (!paymentMap.has(paymentType)) {
        paymentMap.set(paymentType, {
          id: paymentType, method: methodLabel,
          servicesCount: 0, completedServices: 0, pendingServices: 0,
          totalAmount: 0, totalFees: 0, services: [],
        });
      }

      const current     = paymentMap.get(paymentType);
      const amount      = Number(order?.totalAmount       || 0);
      const fee         = Number(order?.cardProcessingFee || 0);
      const serviceDate = order?.date || order?.createdAt || order?.orderDate || null;

      current.servicesCount += 1;
      current.totalAmount   += amount;
      current.totalFees     += fee;

      if (order?.status === 'completed') current.completedServices += 1;
      else current.pendingServices += 1;

      current.services.push({
        orderId:      order?._id || '-',
        customerName: order?.customer?.name || order?.customerId?.name || 'N/A',
        vehicleNumber: order?.vehicleNumber || 'N/A',
        amount,
        fee,
        status:       order?.status || 'pending',
        date:         serviceDate,
        employeeName: resolveEmployeeMeta(order, employees).name,
      });
    });

    return Array.from(paymentMap.values()).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [allServiceOrders, employees]);

  // ── Auto-select first items when lists resolve ────────────────────────────
  useEffect(() => {
    if (!selectedInsightProduct && topProducts.length > 0) {
      setSelectedInsightProduct(topProducts[0].id);
    }
  }, [topProducts, selectedInsightProduct]);

  useEffect(() => {
    if (!selectedInsightEmployee && employeeServiceLeaderboard.length > 0) {
      setSelectedInsightEmployee(employeeServiceLeaderboard[0].id);
    }
  }, [employeeServiceLeaderboard, selectedInsightEmployee]);

  useEffect(() => {
    if (!selectedPaymentMethod && paymentMethodReports.length > 0) {
      setSelectedPaymentMethod(paymentMethodReports[0].id);
    }
  }, [paymentMethodReports, selectedPaymentMethod]);

  // ── Derived selected-item objects ─────────────────────────────────────────
  const selectedProductInsight = useMemo(
    () => topProducts.find((p) => p.id === selectedInsightProduct) ?? null,
    [topProducts, selectedInsightProduct],
  );

  const selectedEmployeeInsight = useMemo(
    () => employeeServiceLeaderboard.find((e) => e.id === selectedInsightEmployee) ?? null,
    [employeeServiceLeaderboard, selectedInsightEmployee],
  );

  const selectedPaymentInsight = useMemo(
    () => paymentMethodReports.find((p) => p.id === selectedPaymentMethod) ?? null,
    [paymentMethodReports, selectedPaymentMethod],
  );

  // ── Public API ────────────────────────────────────────────────────────────
  return {
    // UI state
    activeTab,              setActiveTab,
    selectedEmployeeId,     setSelectedEmployeeId,
    searchTerm,             setSearchTerm,
    expandedRowId,          setExpandedRowId,
    selectedInsightProduct, setSelectedInsightProduct,
    selectedInsightEmployee,setSelectedInsightEmployee,
    selectedPaymentMethod,  setSelectedPaymentMethod,
    // Loading / error
    employeeLoading, employeeError,
    serviceLoading,  serviceError,
    // Lists
    employees,
    allServiceOrders,
    employeeServiceOrders,
    filteredEmployees,
    // Employee-performance
    selectedEmployee,
    selectedEmployeeStats,
    // Product-insights
    topProducts,
    selectedProductInsight,
    // Employee-insights
    employeeServiceLeaderboard,
    selectedEmployeeInsight,
    // Payment-reports
    paymentMethodReports,
    selectedPaymentInsight,
  };
};
