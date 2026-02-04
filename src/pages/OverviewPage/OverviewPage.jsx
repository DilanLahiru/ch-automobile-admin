import React, { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'
import {
  TrendingUp,
  AlertTriangle,
  Package,
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
  ShoppingCart,
  DollarSign,
  RefreshCw,
  MoreVertical,
  Filter,
  Download,
  ChevronRight,
  Battery,
  Zap,
  Shield,
  Car,
  CalendarDays,
} from 'lucide-react'
import {useDispatch, useSelector} from 'react-redux'
import {getAllAppointments} from '../../features/appointmentSlice'

// Card Component
const Card = ({ className = '', children }) => (
  <div className={`bg-white rounded-lg shadow ${className}`}>
    {children}
  </div>
)

// Button Component
const Button = ({ 
  children, 
  className = '', 
  variant = 'default', 
  size = 'default',
  onClick,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

// Badge Component
const Badge = ({ 
  children, 
  className = '', 
  variant = 'default',
  size = 'default'
}) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    outline: 'border border-gray-300 text-gray-700',
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-1 text-sm',
  }
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  )
}

// Mock data for completed parts
const completedPartsData = [
  { month: 'Jan', parts: 45, revenue: 12500 },
  { month: 'Feb', parts: 52, revenue: 14200 },
  { month: 'Mar', parts: 48, revenue: 13800 },
  { month: 'Apr', parts: 61, revenue: 16500 },
  { month: 'May', parts: 58, revenue: 15900 },
  { month: 'Jun', parts: 72, revenue: 19400 },
]

// Mock data for low stock items
const lowStockItems = [
  {
    id: 1,
    partName: 'Brake Pads (Front)',
    partNumber: 'BP-2024-01',
    currentStock: 5,
    minimumStock: 15,
    category: 'Braking System',
    supplier: 'AutoParts Co.',
    urgency: 'high',
  },
  {
    id: 2,
    partName: 'Oil Filter',
    partNumber: 'OF-2024-02',
    currentStock: 8,
    minimumStock: 20,
    category: 'Engine',
    supplier: 'TechFilter Inc.',
    urgency: 'medium',
  },
  {
    id: 3,
    partName: 'Air Filter',
    partNumber: 'AF-2024-03',
    currentStock: 3,
    minimumStock: 15,
    category: 'Engine',
    supplier: 'AirTech Solutions',
    urgency: 'high',
  },
  {
    id: 4,
    partName: 'Spark Plugs Set',
    partNumber: 'SP-2024-04',
    currentStock: 12,
    minimumStock: 25,
    category: 'Ignition',
    supplier: 'ElectroAuto Ltd.',
    urgency: 'medium',
  },
  {
    id: 5,
    partName: 'Battery 12V',
    partNumber: 'BT-2024-05',
    currentStock: 6,
    minimumStock: 12,
    category: 'Electrical',
    supplier: 'PowerCell Industries',
    urgency: 'high',
  },
]

// Mock data for customers
const customerData = [
  {
    id: 1,
    name: 'John Mitchell',
    email: 'john.mitchell@example.com',
    phone: '+1-555-0101',
    totalOrders: 12,
    totalSpent: 15400,
    lastOrder: '2025-01-02',
    status: 'Active',
    loyalty: 'Platinum',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1-555-0102',
    totalOrders: 8,
    totalSpent: 9800,
    lastOrder: '2024-12-28',
    status: 'Active',
    loyalty: 'Gold',
  },
  {
    id: 3,
    name: 'Michael Davis',
    email: 'michael.davis@example.com',
    phone: '+1-555-0103',
    totalOrders: 5,
    totalSpent: 6200,
    lastOrder: '2024-12-15',
    status: 'Inactive',
    loyalty: 'Silver',
  },
  {
    id: 4,
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    phone: '+1-555-0104',
    totalOrders: 18,
    totalSpent: 22500,
    lastOrder: '2025-01-03',
    status: 'Active',
    loyalty: 'Platinum',
  },
  {
    id: 5,
    name: 'David Chen',
    email: 'david.chen@example.com',
    phone: '+1-555-0105',
    totalOrders: 3,
    totalSpent: 4100,
    lastOrder: '2024-11-20',
    status: 'Inactive',
    loyalty: 'Bronze',
  },
]

const getStockPercentage = (current, minimum) => {
  return Math.round((current / minimum) * 100)
}

const getUrgencyColor = (urgency) => {
  switch (urgency) {
    case 'high': return 'bg-rose-500'
    case 'medium': return 'bg-amber-500'
    default: return 'bg-emerald-500'
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'accepted':
    case 'Confirmed': 
      return 'text-emerald-600 bg-emerald-50'
    case 'pending':
    case 'Pending': 
      return 'text-amber-600 bg-amber-50'
    case 'rejected':
      return 'text-red-600 bg-red-50'
    case 'Completed': 
      return 'text-blue-600 bg-blue-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return 'border-rose-300 bg-rose-50/50'
    case 'medium': return 'border-amber-300 bg-amber-50/50'
    default: return 'border-gray-200 bg-white'
  }
}

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

// Helper function to get service duration
const getServiceDuration = (serviceType) => {
  const serviceDurations = {
    'regular maintenance': '1.5 hrs',
    'maintenance': '1.5 hrs',
    'repair': '2 hrs',
    'inspection': '1 hr',
    'tire-change': '1 hr',
    'oil-change': '1 hr',
    'battery-replacement': '1.5 hrs',
    'hybrid-system': '2.5 hrs',
    'battery-change': '1.5 hrs',
    'brake-replacement': '2 hrs',
    'air-filter': '0.5 hrs',
    'transmission-change': '3 hrs',
    'wheel-alignment': '1.5 hrs',
    'fuel-injection': '2 hrs',
    'cooling-system': '2 hrs',
    'engine-tuning': '2 hrs'
  };
  
  return serviceDurations[serviceType.toLowerCase()] || '1 hr';
};

// Helper function to get next 48 hours appointments
const getUpcomingAppointments = (appointments) => {
  if (!Array.isArray(appointments)) return [];
  
  const now = new Date();
  const twoDaysLater = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  
  return appointments
    .filter(appointment => {
      if (!appointment.appointmentDate || !appointment.status) return false;
      
      const appointmentDate = new Date(appointment.appointmentDate);
      const isUpcoming = appointmentDate >= now && appointmentDate <= twoDaysLater;
      const isAcceptedOrPending = ['accepted', 'pending'].includes(appointment.status);
      
      return isUpcoming && isAcceptedOrPending;
    })
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 6) // Show only top 6 upcoming appointments
    .map(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      const now = new Date();
      const hoursDifference = Math.abs(appointmentDate - now) / 36e5;
      
      let priority = 'normal';
      if (hoursDifference <= 24) priority = 'high';
      else if (hoursDifference <= 48) priority = 'medium';
      
      const estimatedDuration = getServiceDuration(appointment.serviceType);
      const serviceType = appointment.serviceType || 'General Service';
      
      return {
        id: appointment._id,
        customerName: appointment.customerName || 'Unknown Customer',
        vehicleInfo: `${appointment.vehicleModel || 'Unknown'} - ${appointment.vehicleNumber || 'N/A'}`,
        serviceType: serviceType,
        date: appointment.appointmentDate,
        time: appointment.appointmentTime || '09:00 AM',
        status: appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1),
        estimatedDuration: estimatedDuration,
        priority: priority,
        originalData: appointment
      };
    });
};

// Helper function to extract unique customers from appointments
const getTopCustomers = (appointments) => {
  if (!Array.isArray(appointments)) return [];
  
  const customerMap = new Map();
  
  appointments.forEach(appointment => {
    const customerId = appointment.customerId || appointment.customerName;
    if (customerId) {
      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, {
          id: customerId,
          name: appointment.customerName,
          phone: appointment.customerContactNumber,
          totalAppointments: 1,
          totalSpent: 0, // This would need actual revenue data
          status: 'Active',
          loyalty: 'Regular'
        });
      } else {
        const customer = customerMap.get(customerId);
        customer.totalAppointments += 1;
        customerMap.set(customerId, customer);
      }
    }
  });
  
  // Convert map to array and sort by total appointments
  const customers = Array.from(customerMap.values())
    .sort((a, b) => b.totalAppointments - a.totalAppointments)
    .slice(0, 5);
  
  return customers;
};

export function OverviewPage() {
  const [timeRange, setTimeRange] = useState('6M');
  const dispatch = useDispatch();
  const { appointments: appointmentsFromRedux, loading } = useSelector((state) => state.appointment);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [summaryStats, setSummaryStats] = useState([
    {
      title: 'Total Appointments',
      value: '0',
      change: '+0%',
      trend: 'up',
      icon: CheckCircle,
      color: 'from-emerald-500 to-cyan-500',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      chartColor: '#10b981',
    },
    {
      title: 'Pending Appointments',
      value: '0',
      change: '0 pending',
      trend: 'warning',
      icon: AlertTriangle,
      color: 'from-rose-500 to-pink-500',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      chartColor: '#ef4444',
    },
    {
      title: 'Today\'s Appointments',
      value: '0',
      change: '+0%',
      trend: 'up',
      icon: Clock,
      color: 'from-blue-500 to-indigo-500',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      chartColor: '#3b82f6',
    },
    {
      title: 'Active Customers',
      value: '0',
      change: '+0 this month',
      trend: 'up',
      icon: Users,
      color: 'from-violet-500 to-purple-500',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      chartColor: '#8b5cf6',
    },
  ]);

  useEffect(() => {
    dispatch(getAllAppointments());
  }, [dispatch]);

  useEffect(() => {
    if (appointmentsFromRedux && Array.isArray(appointmentsFromRedux)) {
      // Transform appointments data
      const upcoming = getUpcomingAppointments(appointmentsFromRedux);
      setUpcomingAppointments(upcoming);
      
      // Get top customers from appointments
      const customers = getTopCustomers(appointmentsFromRedux);
      setTopCustomers(customers);
      
      // Calculate statistics
      const totalAppointments = appointmentsFromRedux.length;
      const pendingAppointments = appointmentsFromRedux.filter(app => app.status === 'pending').length;
      const acceptedAppointments = appointmentsFromRedux.filter(app => app.status === 'accepted').length;
      const rejectedAppointments = appointmentsFromRedux.filter(app => app.status === 'rejected').length;
      
      // Calculate today's appointments
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      const todayAppointments = appointmentsFromRedux.filter(app => {
        const appointmentDate = new Date(app.appointmentDate);
        const appointmentDateString = appointmentDate.toISOString().split('T')[0];
        return appointmentDateString === todayString;
      }).length;
      
      // Calculate unique customers
      const uniqueCustomerIds = [...new Set(appointmentsFromRedux
        .filter(app => app.customerId)
        .map(app => app.customerId))];
      const uniqueCustomers = uniqueCustomerIds.length;
      
      // Get current month appointments for trend calculation
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const currentMonthAppointments = appointmentsFromRedux.filter(app => {
        const appointmentDate = new Date(app.appointmentDate);
        return appointmentDate.getMonth() === currentMonth && appointmentDate.getFullYear() === currentYear;
      }).length;
      
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthAppointments = appointmentsFromRedux.filter(app => {
        const appointmentDate = new Date(app.appointmentDate);
        const appointmentMonth = appointmentDate.getMonth();
        const appointmentYear = appointmentDate.getFullYear();
        return appointmentMonth === lastMonth && 
               appointmentYear === (currentMonth === 0 ? currentYear - 1 : currentYear);
      }).length;
      
      // Calculate percentage change
      const calculateChange = (current, previous) => {
        if (previous === 0) return current > 0 ? '+100%' : '0%';
        const change = ((current - previous) / previous) * 100;
        return `${change >= 0 ? '+' : ''}${Math.round(change)}%`;
      };
      
      const totalChange = calculateChange(currentMonthAppointments, lastMonthAppointments);
      const pendingChange = pendingAppointments > 0 ? `${pendingAppointments} pending` : '0 pending';
      const todayChange = calculateChange(todayAppointments, 0);
      const customersChange = uniqueCustomers > 0 ? `+${uniqueCustomers} total` : '0 total';
      
      // Service type distribution for chart
      const serviceTypeCounts = {};
      appointmentsFromRedux.forEach(app => {
        const serviceType = app.serviceType || 'Unknown';
        serviceTypeCounts[serviceType] = (serviceTypeCounts[serviceType] || 0) + 1;
      });
      
      // Create chart data from service type counts
      const chartData = Object.keys(serviceTypeCounts).map((serviceType, index) => ({
        name: serviceType,
        value: serviceTypeCounts[serviceType],
        fill: `hsl(${index * 60}, 70%, 50%)` // Generate different colors
      }));
      
      // Update summary stats
      setSummaryStats([
        {
          title: 'Total Appointments',
          value: totalAppointments.toString(),
          change: totalChange,
          trend: totalAppointments > lastMonthAppointments ? 'up' : 'down',
          icon: CheckCircle,
          color: 'from-emerald-500 to-cyan-500',
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-600',
          chartColor: '#10b981',
        },
        {
          title: 'Pending Appointments',
          value: pendingAppointments.toString(),
          change: pendingChange,
          trend: 'warning',
          icon: AlertTriangle,
          color: 'from-rose-500 to-pink-500',
          iconBg: 'bg-rose-100',
          iconColor: 'text-rose-600',
          chartColor: '#ef4444',
        },
        {
          title: 'Today\'s Appointments',
          value: todayAppointments.toString(),
          change: todayChange,
          trend: todayAppointments > 0 ? 'up' : 'neutral',
          icon: Clock,
          color: 'from-blue-500 to-indigo-500',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          chartColor: '#3b82f6',
        },
        {
          title: 'Active Customers',
          value: uniqueCustomers.toString(),
          change: customersChange,
          trend: 'up',
          icon: Users,
          color: 'from-violet-500 to-purple-500',
          iconBg: 'bg-violet-100',
          iconColor: 'text-violet-600',
          chartColor: '#8b5cf6',
        },
      ]);
    }
  }, [appointmentsFromRedux]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-6 space-y-6">

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat, index) => (
          <div
            key={index}
            className="relative group cursor-pointer transform transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
              style={{ background: `linear-gradient(135deg, ${stat.chartColor}20, transparent)` }}
            ></div>
            <div className="relative bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <div className={`inline-flex p-3 rounded-xl ${stat.iconBg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <p className="text-sm text-gray-500 mt-4">{stat.title}</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-md font-bold text-gray-900">{stat.value}</span>
                    <span className={`text-sm font-semibold ${
                      stat.trend === 'up' ? 'text-emerald-600' : 
                      stat.trend === 'warning' ? 'text-amber-600' : 
                      stat.trend === 'neutral' ? 'text-blue-600' : 'text-rose-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="w-20 h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={completedPartsData.slice(-4)}>
                      <Area
                        type="monotone"
                        dataKey="parts"
                        stroke={stat.chartColor}
                        fill={stat.chartColor}
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
            <p className="text-sm text-gray-500">Scheduled service appointments for the next 48 hours</p>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            View Calendar
          </Button>
        </div>
        
        {/* {upcomingAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className={`group p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:shadow-lg ${getPriorityColor(appointment.priority)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">{appointment.time}</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{appointment.customerName}</h4>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Car className="w-3 h-3" />
                      {appointment.vehicleInfo}
                    </p>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{appointment.serviceType}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {appointment.estimatedDuration}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(appointment.date)}
                      </span>
                    </div>
                  </div>
                  
                  {appointment.originalData.note && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600 italic">
                        📝 Note: {appointment.originalData.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">No upcoming appointments</p>
            <p className="text-sm text-gray-500 mt-2">You have no appointments scheduled for the next 48 hours</p>
          </div>
        )}
      </Card> */}

      {upcomingAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className={`group p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:shadow-lg ${getPriorityColor(appointment.priority)}`}
              >
                <div className='pb-1'>
                    <CalendarDays className="w-4 h-4 text-blue-600 inline-block mr-2" />
                    <span className="font-semibold text-sm text-gray-900">{formatDate(appointment.date)}</span>
                </div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-blue-600" />
                    <span className="font-semibold text-xs text-gray-900">{appointment.time}</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">{appointment.customerName}</h4>
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                      <Car className="w-3 h-3 text-blue-600" />
                      {appointment.vehicleInfo}
                    </p>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                      <Shield className="w-3 h-3 text-blue-600" />
                      {appointment.serviceType}
                    </p>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
            <p className="text-sm text-gray-500">Scheduled service appointments for the next 48 hours</p>
            
            {/* Show test data to verify appointments exist */}
            {/* {testUpcomingAppointments.length > 0 && (
              <div className="mt-8">
                <h4 className="text-md font-semibold text-gray-700 mb-4">Available Appointments (Next 30 days):</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testUpcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-900">{appointment.customerName}</span>
                        <Badge variant="outline" size="sm">{appointment.daysFromNow} days</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{appointment.serviceType}</p>
                      <p className="text-sm text-gray-500">{formatDate(appointment.date)} at {appointment.time}</p>
                      <p className="text-xs text-gray-400 mt-2">Status: {appointment.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        )}
      </Card>

      {/* Low Stock Items & Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Items */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
              <p className="text-sm text-gray-500">Items requiring immediate attention</p>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {lowStockItems.map((item) => {
              const percentage = getStockPercentage(item.currentStock, item.minimumStock)
              return (
                <div
                  key={item.id}
                  className="group p-4 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getUrgencyColor(item.urgency)}`}></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{item.partName}</h4>
                          <Badge variant="secondary" size="sm">{item.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-500 font-mono mt-1">{item.partNumber}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex-1 mr-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Stock Level</span>
                        <span className="font-semibold">{item.currentStock}/{item.minimumStock}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            percentage >= 75 ? 'bg-emerald-500' :
                            percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700">
                      Reorder
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Top Customers from Appointments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
              <p className="text-sm text-gray-500">Your most valuable clients from appointments</p>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              View All
            </Button>
          </div>
          
          {topCustomers.length > 0 ? (
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div
                  key={customer.id}
                  className="group p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                        {customer.name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{customer.name || 'Unknown Customer'}</h4>
                          <Badge
                            variant={
                              customer.totalAppointments >= 5 ? 'default' :
                              customer.totalAppointments >= 3 ? 'secondary' : 'outline'
                            }
                            size="sm"
                          >
                            {customer.totalAppointments >= 5 ? 'Premium' :
                             customer.totalAppointments >= 3 ? 'Regular' : 'New'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{customer.phone || 'No contact'}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Appointments</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">{customer.totalAppointments}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">
                        <span className="text-sm text-emerald-600 font-medium">Active</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">No customer data</p>
              <p className="text-sm text-gray-500 mt-2">Customer information will appear after appointments are created</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

// import React, { useState, useEffect } from 'react'
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   AreaChart,
//   Area,
//   RadarChart,
//   Radar,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
// } from 'recharts'
// import {
//   TrendingUp,
//   AlertTriangle,
//   Package,
//   Users,
//   CheckCircle,
//   Clock,
//   ArrowRight,
//   ShoppingCart,
//   DollarSign,
//   RefreshCw,
//   MoreVertical,
//   Filter,
//   Download,
//   ChevronRight,
//   Battery,
//   Zap,
//   Shield,
//   Car,
//   CalendarDays,
// } from 'lucide-react'
// import {useDispatch, useSelector} from 'react-redux'
// import {getAllAppointments} from '../../features/appointmentSlice'

// // Card Component
// const Card = ({ className = '', children }) => (
//   <div className={`bg-white rounded-lg shadow ${className}`}>
//     {children}
//   </div>
// )

// // Button Component
// const Button = ({ 
//   children, 
//   className = '', 
//   variant = 'default', 
//   size = 'default',
//   onClick,
//   ...props 
// }) => {
//   const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  
//   const variants = {
//     default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
//     outline: 'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
//     ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
//   }
  
//   const sizes = {
//     sm: 'px-3 py-1.5 text-sm',
//     default: 'px-4 py-2',
//     lg: 'px-6 py-3 text-lg',
//   }
  
//   return (
//     <button
//       className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
//       onClick={onClick}
//       {...props}
//     >
//       {children}
//     </button>
//   )
// }

// // Badge Component
// const Badge = ({ 
//   children, 
//   className = '', 
//   variant = 'default',
//   size = 'default'
// }) => {
//   const variants = {
//     default: 'bg-blue-100 text-blue-800',
//     secondary: 'bg-gray-100 text-gray-800',
//     outline: 'border border-gray-300 text-gray-700',
//   }
  
//   const sizes = {
//     sm: 'px-2 py-0.5 text-xs',
//     default: 'px-2.5 py-1 text-sm',
//   }
  
//   return (
//     <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
//       {children}
//     </span>
//   )
// }

// // Mock data for completed parts
// const completedPartsData = [
//   { month: 'Jan', parts: 45, revenue: 12500 },
//   { month: 'Feb', parts: 52, revenue: 14200 },
//   { month: 'Mar', parts: 48, revenue: 13800 },
//   { month: 'Apr', parts: 61, revenue: 16500 },
//   { month: 'May', parts: 58, revenue: 15900 },
//   { month: 'Jun', parts: 72, revenue: 19400 },
// ]

// // Mock data for low stock items
// const lowStockItems = [
//   {
//     id: 1,
//     partName: 'Brake Pads (Front)',
//     partNumber: 'BP-2024-01',
//     currentStock: 5,
//     minimumStock: 15,
//     category: 'Braking System',
//     supplier: 'AutoParts Co.',
//     urgency: 'high',
//   },
//   {
//     id: 2,
//     partName: 'Oil Filter',
//     partNumber: 'OF-2024-02',
//     currentStock: 8,
//     minimumStock: 20,
//     category: 'Engine',
//     supplier: 'TechFilter Inc.',
//     urgency: 'medium',
//   },
//   {
//     id: 3,
//     partName: 'Air Filter',
//     partNumber: 'AF-2024-03',
//     currentStock: 3,
//     minimumStock: 15,
//     category: 'Engine',
//     supplier: 'AirTech Solutions',
//     urgency: 'high',
//   },
//   {
//     id: 4,
//     partName: 'Spark Plugs Set',
//     partNumber: 'SP-2024-04',
//     currentStock: 12,
//     minimumStock: 25,
//     category: 'Ignition',
//     supplier: 'ElectroAuto Ltd.',
//     urgency: 'medium',
//   },
//   {
//     id: 5,
//     partName: 'Battery 12V',
//     partNumber: 'BT-2024-05',
//     currentStock: 6,
//     minimumStock: 12,
//     category: 'Electrical',
//     supplier: 'PowerCell Industries',
//     urgency: 'high',
//   },
// ]

// // Mock data for customers
// const customerData = [
//   {
//     id: 1,
//     name: 'John Mitchell',
//     email: 'john.mitchell@example.com',
//     phone: '+1-555-0101',
//     totalOrders: 12,
//     totalSpent: 15400,
//     lastOrder: '2025-01-02',
//     status: 'Active',
//     loyalty: 'Platinum',
//   },
//   {
//     id: 2,
//     name: 'Sarah Johnson',
//     email: 'sarah.johnson@example.com',
//     phone: '+1-555-0102',
//     totalOrders: 8,
//     totalSpent: 9800,
//     lastOrder: '2024-12-28',
//     status: 'Active',
//     loyalty: 'Gold',
//   },
//   {
//     id: 3,
//     name: 'Michael Davis',
//     email: 'michael.davis@example.com',
//     phone: '+1-555-0103',
//     totalOrders: 5,
//     totalSpent: 6200,
//     lastOrder: '2024-12-15',
//     status: 'Inactive',
//     loyalty: 'Silver',
//   },
//   {
//     id: 4,
//     name: 'Emily Rodriguez',
//     email: 'emily.rodriguez@example.com',
//     phone: '+1-555-0104',
//     totalOrders: 18,
//     totalSpent: 22500,
//     lastOrder: '2025-01-03',
//     status: 'Active',
//     loyalty: 'Platinum',
//   },
//   {
//     id: 5,
//     name: 'David Chen',
//     email: 'david.chen@example.com',
//     phone: '+1-555-0105',
//     totalOrders: 3,
//     totalSpent: 4100,
//     lastOrder: '2024-11-20',
//     status: 'Inactive',
//     loyalty: 'Bronze',
//   },
// ]

// const getStockPercentage = (current, minimum) => {
//   return Math.round((current / minimum) * 100)
// }

// const getUrgencyColor = (urgency) => {
//   switch (urgency) {
//     case 'high': return 'bg-rose-500'
//     case 'medium': return 'bg-amber-500'
//     default: return 'bg-emerald-500'
//   }
// }

// const getStatusColor = (status) => {
//   switch (status) {
//     case 'accepted':
//     case 'Confirmed': 
//       return 'text-emerald-600 bg-emerald-50'
//     case 'pending':
//     case 'Pending': 
//       return 'text-amber-600 bg-amber-50'
//     case 'rejected':
//       return 'text-red-600 bg-red-50'
//     case 'Completed': 
//       return 'text-blue-600 bg-blue-50'
//     default: return 'text-gray-600 bg-gray-50'
//   }
// }

// const getPriorityColor = (priority) => {
//   switch (priority) {
//     case 'high': return 'border-rose-300 bg-rose-50/50'
//     case 'medium': return 'border-amber-300 bg-amber-50/50'
//     default: return 'border-gray-200 bg-white'
//   }
// }

// // Helper function to format date
// const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   return date.toLocaleDateString('en-US', { 
//     month: 'short', 
//     day: 'numeric',
//     year: 'numeric'
//   });
// };

// // Helper function to get upcoming appointments (next 7 days)
// const getUpcomingAppointments = (appointments) => {
//   if (!Array.isArray(appointments)) return [];
  
//   const now = new Date();
//   const sevenDaysLater = new Date();
//   sevenDaysLater.setDate(now.getDate() + 7); // Next 7 days
  
//   return appointments
//     .filter(appointment => {
//       if (!appointment.appointmentDate || !appointment.status) return false;
      
//       const appointmentDate = new Date(appointment.appointmentDate);
      
//       // Check if appointment is in the future (including today) and within next 7 days
//       const isUpcoming = appointmentDate >= now && appointmentDate <= sevenDaysLater;
      
//       // Only show pending and accepted appointments
//       const isAcceptedOrPending = ['accepted', 'pending'].includes(appointment.status);
      
//       return isUpcoming && isAcceptedOrPending;
//     })
//     .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
//     .map(appointment => {
//       const appointmentDate = new Date(appointment.appointmentDate);
//       const now = new Date();
      
//       // Calculate days difference
//       const timeDiff = appointmentDate.getTime() - now.getTime();
//       const daysDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
//       let priority = 'normal';
//       if (daysDifference <= 1) priority = 'high'; // Tomorrow or today
//       else if (daysDifference <= 3) priority = 'medium'; // Within 3 days
      
//       const serviceType = appointment.serviceType || 'General Service';
      
//       return {
//         id: appointment._id,
//         customerName: appointment.customerName || 'Unknown Customer',
//         vehicleInfo: `${appointment.vehicleModel || 'Unknown'} - ${appointment.vehicleNumber || 'N/A'}`,
//         serviceType: serviceType,
//         date: appointment.appointmentDate,
//         time: appointment.appointmentTime || '09:00 AM',
//         status: appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1),
//         priority: priority,
//         originalData: appointment
//       };
//     });
// };

// // Helper function to extract unique customers from appointments
// const getTopCustomers = (appointments) => {
//   if (!Array.isArray(appointments)) return [];
  
//   const customerMap = new Map();
  
//   appointments.forEach(appointment => {
//     const customerId = appointment.customerId || appointment.customerName;
//     if (customerId) {
//       if (!customerMap.has(customerId)) {
//         customerMap.set(customerId, {
//           id: customerId,
//           name: appointment.customerName,
//           phone: appointment.customerContactNumber,
//           totalAppointments: 1,
//           totalSpent: 0, // This would need actual revenue data
//           status: 'Active',
//           loyalty: 'Regular'
//         });
//       } else {
//         const customer = customerMap.get(customerId);
//         customer.totalAppointments += 1;
//         customerMap.set(customerId, customer);
//       }
//     }
//   });
  
//   // Convert map to array and sort by total appointments
//   const customers = Array.from(customerMap.values())
//     .sort((a, b) => b.totalAppointments - a.totalAppointments)
//     .slice(0, 5);
  
//   return customers;
// };

// // Debug function to check appointments
// const debugAppointments = (appointments) => {
//   console.log('=== DEBUG: All Appointments ===');
//   appointments?.forEach((app, index) => {
//     console.log(`${index + 1}. Date: ${app.appointmentDate}, Status: ${app.status}, Customer: ${app.customerName}`);
//   });
//   console.log('=== END DEBUG ===');
// };

// export function OverviewPage() {
//   const [timeRange, setTimeRange] = useState('6M');
//   const dispatch = useDispatch();
//   const { appointments: appointmentsFromRedux, loading } = useSelector((state) => state.appointment);
//   const [upcomingAppointments, setUpcomingAppointments] = useState([]);
//   const [topCustomers, setTopCustomers] = useState([]);
//   const [summaryStats, setSummaryStats] = useState([
//     {
//       title: 'Total Appointments',
//       value: '0',
//       change: '+0%',
//       trend: 'up',
//       icon: CheckCircle,
//       color: 'from-emerald-500 to-cyan-500',
//       iconBg: 'bg-emerald-100',
//       iconColor: 'text-emerald-600',
//       chartColor: '#10b981',
//     },
//     {
//       title: 'Pending Appointments',
//       value: '0',
//       change: '0 pending',
//       trend: 'warning',
//       icon: AlertTriangle,
//       color: 'from-rose-500 to-pink-500',
//       iconBg: 'bg-rose-100',
//       iconColor: 'text-rose-600',
//       chartColor: '#ef4444',
//     },
//     {
//       title: 'Today\'s Appointments',
//       value: '0',
//       change: '+0%',
//       trend: 'up',
//       icon: Clock,
//       color: 'from-blue-500 to-indigo-500',
//       iconBg: 'bg-blue-100',
//       iconColor: 'text-blue-600',
//       chartColor: '#3b82f6',
//     },
//     {
//       title: 'Active Customers',
//       value: '0',
//       change: '+0 this month',
//       trend: 'up',
//       icon: Users,
//       color: 'from-violet-500 to-purple-500',
//       iconBg: 'bg-violet-100',
//       iconColor: 'text-violet-600',
//       chartColor: '#8b5cf6',
//     },
//   ]);

//   useEffect(() => {
//     dispatch(getAllAppointments());
//   }, [dispatch]);

//   useEffect(() => {
//     if (appointmentsFromRedux && Array.isArray(appointmentsFromRedux)) {
//       // Debug: Log appointments data
//       debugAppointments(appointmentsFromRedux);
      
//       // Transform appointments data
//       const upcoming = getUpcomingAppointments(appointmentsFromRedux);
//       console.log('Upcoming appointments:', upcoming);
//       setUpcomingAppointments(upcoming);
      
//       // Get top customers from appointments
//       const customers = getTopCustomers(appointmentsFromRedux);
//       setTopCustomers(customers);
      
//       // Calculate statistics
//       const totalAppointments = appointmentsFromRedux.length;
//       const pendingAppointments = appointmentsFromRedux.filter(app => app.status === 'pending').length;
//       const acceptedAppointments = appointmentsFromRedux.filter(app => app.status === 'accepted').length;
//       const rejectedAppointments = appointmentsFromRedux.filter(app => app.status === 'rejected').length;
      
//       // Calculate today's appointments
//       const today = new Date();
//       const todayString = today.toISOString().split('T')[0];
//       const todayAppointments = appointmentsFromRedux.filter(app => {
//         const appointmentDate = new Date(app.appointmentDate);
//         const appointmentDateString = appointmentDate.toISOString().split('T')[0];
//         return appointmentDateString === todayString;
//       }).length;
      
//       // Calculate unique customers
//       const uniqueCustomerIds = [...new Set(appointmentsFromRedux
//         .filter(app => app.customerId)
//         .map(app => app.customerId))];
//       const uniqueCustomers = uniqueCustomerIds.length;
      
//       // Get current month appointments for trend calculation
//       const currentMonth = new Date().getMonth();
//       const currentYear = new Date().getFullYear();
//       const currentMonthAppointments = appointmentsFromRedux.filter(app => {
//         const appointmentDate = new Date(app.appointmentDate);
//         return appointmentDate.getMonth() === currentMonth && appointmentDate.getFullYear() === currentYear;
//       }).length;
      
//       const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
//       const lastMonthAppointments = appointmentsFromRedux.filter(app => {
//         const appointmentDate = new Date(app.appointmentDate);
//         const appointmentMonth = appointmentDate.getMonth();
//         const appointmentYear = appointmentDate.getFullYear();
//         return appointmentMonth === lastMonth && 
//                appointmentYear === (currentMonth === 0 ? currentYear - 1 : currentYear);
//       }).length;
      
//       // Calculate percentage change
//       const calculateChange = (current, previous) => {
//         if (previous === 0) return current > 0 ? '+100%' : '0%';
//         const change = ((current - previous) / previous) * 100;
//         return `${change >= 0 ? '+' : ''}${Math.round(change)}%`;
//       };
      
//       const totalChange = calculateChange(currentMonthAppointments, lastMonthAppointments);
//       const pendingChange = pendingAppointments > 0 ? `${pendingAppointments} pending` : '0 pending';
//       const todayChange = calculateChange(todayAppointments, 0);
//       const customersChange = uniqueCustomers > 0 ? `${uniqueCustomers} total` : '0 total';
      
//       // Update summary stats
//       setSummaryStats([
//         {
//           title: 'Total Appointments',
//           value: totalAppointments.toString(),
//           change: totalChange,
//           trend: totalAppointments > lastMonthAppointments ? 'up' : 'down',
//           icon: CheckCircle,
//           color: 'from-emerald-500 to-cyan-500',
//           iconBg: 'bg-emerald-100',
//           iconColor: 'text-emerald-600',
//           chartColor: '#10b981',
//         },
//         {
//           title: 'Pending Appointments',
//           value: pendingAppointments.toString(),
//           change: pendingChange,
//           trend: 'warning',
//           icon: AlertTriangle,
//           color: 'from-rose-500 to-pink-500',
//           iconBg: 'bg-rose-100',
//           iconColor: 'text-rose-600',
//           chartColor: '#ef4444',
//         },
//         {
//           title: 'Today\'s Appointments',
//           value: todayAppointments.toString(),
//           change: todayChange,
//           trend: todayAppointments > 0 ? 'up' : 'neutral',
//           icon: Clock,
//           color: 'from-blue-500 to-indigo-500',
//           iconBg: 'bg-blue-100',
//           iconColor: 'text-blue-600',
//           chartColor: '#3b82f6',
//         },
//         {
//           title: 'Active Customers',
//           value: uniqueCustomers.toString(),
//           change: customersChange,
//           trend: 'up',
//           icon: Users,
//           color: 'from-violet-500 to-purple-500',
//           iconBg: 'bg-violet-100',
//           iconColor: 'text-violet-600',
//           chartColor: '#8b5cf6',
//         },
//       ]);
//     }
//   }, [appointmentsFromRedux]);

//   // For testing: Show all upcoming appointments for the next 30 days
//   const getAllUpcomingAppointments = (appointments) => {
//     if (!Array.isArray(appointments)) return [];
    
//     const now = new Date();
//     const thirtyDaysLater = new Date();
//     thirtyDaysLater.setDate(now.getDate() + 30);
    
//     return appointments
//       .filter(appointment => {
//         if (!appointment.appointmentDate || !appointment.status) return false;
        
//         const appointmentDate = new Date(appointment.appointmentDate);
//         const isUpcoming = appointmentDate >= now && appointmentDate <= thirtyDaysLater;
//         const isAcceptedOrPending = ['accepted', 'pending'].includes(appointment.status);
        
//         return isUpcoming && isAcceptedOrPending;
//       })
//       .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
//       .map(appointment => {
//         const appointmentDate = new Date(appointment.appointmentDate);
//         const now = new Date();
//         const timeDiff = appointmentDate.getTime() - now.getTime();
//         const daysDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
//         let priority = 'normal';
//         if (daysDifference <= 1) priority = 'high';
//         else if (daysDifference <= 7) priority = 'medium';
        
//         const serviceType = appointment.serviceType || 'General Service';
        
//         return {
//           id: appointment._id,
//           customerName: appointment.customerName || 'Unknown Customer',
//           vehicleInfo: `${appointment.vehicleModel || 'Unknown'} - ${appointment.vehicleNumber || 'N/A'}`,
//           serviceType: serviceType,
//           date: appointment.appointmentDate,
//           time: appointment.appointmentTime || '09:00 AM',
//           status: appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1),
//           priority: priority,
//           originalData: appointment,
//           daysFromNow: daysDifference
//         };
//       });
//   };

//   // Get test data for display
//   const testUpcomingAppointments = appointmentsFromRedux ? getAllUpcomingAppointments(appointmentsFromRedux) : [];

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-6 flex items-center justify-center">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <p className="mt-4 text-gray-600">Loading dashboard data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-6 space-y-6">

//       {/* Summary Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {summaryStats.map((stat, index) => (
//           <div
//             key={index}
//             className="relative group cursor-pointer transform transition-all duration-300 hover:-translate-y-1"
//           >
//             <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
//               style={{ background: `linear-gradient(135deg, ${stat.chartColor}20, transparent)` }}
//             ></div>
//             <div className="relative bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-shadow">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <div className={`inline-flex p-3 rounded-xl ${stat.iconBg}`}>
//                     <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
//                   </div>
//                   <p className="text-sm text-gray-500 mt-4">{stat.title}</p>
//                   <div className="flex items-baseline gap-2 mt-2">
//                     <span className="text-md font-bold text-gray-900">{stat.value}</span>
//                     <span className={`text-sm font-semibold ${
//                       stat.trend === 'up' ? 'text-emerald-600' : 
//                       stat.trend === 'warning' ? 'text-amber-600' : 
//                       stat.trend === 'neutral' ? 'text-blue-600' : 'text-rose-600'
//                     }`}>
//                       {stat.change}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="w-20 h-16">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart data={completedPartsData.slice(-4)}>
//                       <Area
//                         type="monotone"
//                         dataKey="parts"
//                         stroke={stat.chartColor}
//                         fill={stat.chartColor}
//                         fillOpacity={0.2}
//                         strokeWidth={2}
//                       />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Upcoming Appointments */}
//       <Card className="p-6">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
//             <p className="text-sm text-gray-500">Scheduled service appointments for the next 7 days</p>
//           </div>
//           <Button variant="outline" size="sm" className="flex items-center gap-2">
//             <Clock className="w-4 h-4" />
//             View Calendar
//           </Button>
//         </div>
        
//         {upcomingAppointments.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {upcomingAppointments.map((appointment) => (
//               <div
//                 key={appointment.id}
//                 className={`group p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:shadow-lg ${getPriorityColor(appointment.priority)}`}
//               >
//                 <div className='pb-1'>
//                     <CalendarDays className="w-4 h-4 text-blue-600 inline-block mr-2" />
//                     <span className="font-semibold text-sm text-gray-900">{formatDate(appointment.date)}</span>
//                 </div>
//                 <div className="flex items-start justify-between mb-3">
//                   <div className="flex items-center gap-2">
//                     <Clock className="w-3 h-3 text-blue-600" />
//                     <span className="font-semibold text-xs text-gray-900">{appointment.time}</span>
//                   </div>
//                   <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
//                     {appointment.status}
//                   </span>
//                 </div>
                
//                 <div className="space-y-2">
//                   <div>
//                     <h4 className="font-semibold text-sm text-gray-900">{appointment.customerName}</h4>
//                     <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
//                       <Car className="w-3 h-3 text-blue-600" />
//                       {appointment.vehicleInfo}
//                     </p>
//                   </div>
                  
//                   <div className="pt-3 border-t border-gray-200">
//                     <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
//                       <Shield className="w-3 h-3 text-blue-600" />
//                       {appointment.serviceType}
//                     </p>
//                   </div>
                  
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-lg font-medium text-gray-900">No upcoming appointments for next 7 days</p>
//             <p className="text-sm text-gray-500 mt-2">You have no appointments scheduled for the next week</p>
            
//             {/* Show test data to verify appointments exist */}
//             {testUpcomingAppointments.length > 0 && (
//               <div className="mt-8">
//                 <h4 className="text-md font-semibold text-gray-700 mb-4">Available Appointments (Next 30 days):</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {testUpcomingAppointments.map((appointment) => (
//                     <div key={appointment.id} className="p-4 border border-gray-300 rounded-lg bg-gray-50">
//                       <div className="flex justify-between items-center mb-2">
//                         <span className="font-semibold text-gray-900">{appointment.customerName}</span>
//                         <Badge variant="outline" size="sm">{appointment.daysFromNow} days</Badge>
//                       </div>
//                       <p className="text-sm text-gray-600">{appointment.serviceType}</p>
//                       <p className="text-sm text-gray-500">{formatDate(appointment.date)} at {appointment.time}</p>
//                       <p className="text-xs text-gray-400 mt-2">Status: {appointment.status}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </Card>

//       {/* Low Stock Items & Customers Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Low Stock Items */}
//         <Card className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
//               <p className="text-sm text-gray-500">Items requiring immediate attention</p>
//             </div>
//             <Button variant="outline" size="sm" className="flex items-center gap-2">
//               <AlertTriangle className="w-4 h-4" />
//               View All
//             </Button>
//           </div>
//           <div className="space-y-4">
//             {lowStockItems.map((item) => {
//               const percentage = getStockPercentage(item.currentStock, item.minimumStock)
//               return (
//                 <div
//                   key={item.id}
//                   className="group p-4 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50/50 transition-all duration-300 cursor-pointer"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className={`w-3 h-3 rounded-full ${getUrgencyColor(item.urgency)}`}></div>
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <h4 className="font-semibold text-gray-900">{item.partName}</h4>
//                           <Badge variant="secondary" size="sm">{item.category}</Badge>
//                         </div>
//                         <p className="text-sm text-gray-500 font-mono mt-1">{item.partNumber}</p>
//                       </div>
//                     </div>
//                     <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
//                       <ArrowRight className="w-4 h-4" />
//                     </Button>
//                   </div>
//                   <div className="flex items-center justify-between mt-4">
//                     <div className="flex-1 mr-4">
//                       <div className="flex justify-between text-sm text-gray-600 mb-1">
//                         <span>Stock Level</span>
//                         <span className="font-semibold">{item.currentStock}/{item.minimumStock}</span>
//                       </div>
//                       <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                         <div
//                           className={`h-full transition-all duration-500 ${
//                             percentage >= 75 ? 'bg-emerald-500' :
//                             percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'
//                           }`}
//                           style={{ width: `${Math.min(percentage, 100)}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                     <Button size="sm" className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700">
//                       Reorder
//                     </Button>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </Card>

//         {/* Top Customers from Appointments */}
//         <Card className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
//               <p className="text-sm text-gray-500">Your most valuable clients from appointments</p>
//             </div>
//             <Button variant="outline" size="sm" className="flex items-center gap-2">
//               <Users className="w-4 h-4" />
//               View All
//             </Button>
//           </div>
          
//           {topCustomers.length > 0 ? (
//             <div className="space-y-4">
//               {topCustomers.map((customer, index) => (
//                 <div
//                   key={customer.id}
//                   className="group p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
//                         {customer.name?.charAt(0) || 'C'}
//                       </div>
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <h4 className="font-semibold text-gray-900">{customer.name || 'Unknown Customer'}</h4>
//                           <Badge
//                             variant={
//                               customer.totalAppointments >= 5 ? 'default' :
//                               customer.totalAppointments >= 3 ? 'secondary' : 'outline'
//                             }
//                             size="sm"
//                           >
//                             {customer.totalAppointments >= 5 ? 'Premium' :
//                              customer.totalAppointments >= 3 ? 'Regular' : 'New'}
//                           </Badge>
//                         </div>
//                         <p className="text-sm text-gray-500 mt-1">{customer.phone || 'No contact'}</p>
//                       </div>
//                     </div>
//                     <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4 mt-4">
//                     <div className="text-center p-3 bg-gray-50 rounded-lg">
//                       <p className="text-sm text-gray-600">Total Appointments</p>
//                       <p className="text-xl font-bold text-gray-900 mt-1">{customer.totalAppointments}</p>
//                     </div>
//                     <div className="text-center p-3 bg-gray-50 rounded-lg">
//                       <p className="text-sm text-gray-600">Status</p>
//                       <p className="text-xl font-bold text-gray-900 mt-1">
//                         <span className="text-sm text-emerald-600 font-medium">Active</span>
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-lg font-medium text-gray-900">No customer data</p>
//               <p className="text-sm text-gray-500 mt-2">Customer information will appear after appointments are created</p>
//             </div>
//           )}
//         </Card>
//       </div>
//     </div>
//   )
// }