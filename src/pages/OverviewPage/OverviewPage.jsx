import React, { useState } from 'react'
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
} from 'lucide-react'

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

// Mock data for upcoming appointments
const upcomingAppointments = [
  {
    id: 1,
    customerName: 'John Mitchell',
    vehicleInfo: '2022 Toyota Camry',
    serviceType: 'Oil Change & Inspection',
    date: '2025-01-06',
    time: '09:00 AM',
    status: 'Confirmed',
    estimatedDuration: '1.5 hrs',
    priority: 'normal',
  },
  {
    id: 2,
    customerName: 'Sarah Johnson',
    vehicleInfo: '2021 Honda Accord',
    serviceType: 'Brake Service',
    date: '2025-01-06',
    time: '11:30 AM',
    status: 'Confirmed',
    estimatedDuration: '2 hrs',
    priority: 'high',
  },
  {
    id: 3,
    customerName: 'Emily Rodriguez',
    vehicleInfo: '2023 Ford F-150',
    serviceType: 'Tire Rotation',
    date: '2025-01-06',
    time: '02:00 PM',
    status: 'Pending',
    estimatedDuration: '1 hr',
    priority: 'normal',
  },
  {
    id: 4,
    customerName: 'Robert Wilson',
    vehicleInfo: '2020 BMW X5',
    serviceType: 'Full Service & Diagnostics',
    date: '2025-01-07',
    time: '10:00 AM',
    status: 'Confirmed',
    estimatedDuration: '3 hrs',
    priority: 'high',
  },
  {
    id: 5,
    customerName: 'Michael Davis',
    vehicleInfo: '2019 Chevrolet Silverado',
    serviceType: 'Battery Replacement',
    date: '2025-01-07',
    time: '01:00 PM',
    status: 'Confirmed',
    estimatedDuration: '0.5 hrs',
    priority: 'normal',
  },
]

// Summary stats with enhanced data
const SUMMARY_STATS = [
  {
    title: 'Completed Repairs',
    value: '45',
    change: '+12.5%',
    trend: 'up',
    icon: CheckCircle,
    color: 'from-emerald-500 to-cyan-500',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    chartColor: '#10b981',
  },
  {
    title: 'Low Stock Items',
    value: lowStockItems.length,
    change: '5 items',
    trend: 'warning',
    icon: AlertTriangle,
    color: 'from-rose-500 to-pink-500',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    chartColor: '#ef4444',
  },
  {
    title: 'Total Revenue',
    value: 'Rs. 89000',
    change: '+18.3%',
    trend: 'up',
    icon: DollarSign,
    color: 'from-blue-500 to-indigo-500',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    chartColor: '#3b82f6',
  },
  {
    title: 'Active Customers',
    value: customerData.filter(c => c.status === 'Active').length,
    change: '+2 this month',
    trend: 'up',
    icon: Users,
    color: 'from-violet-500 to-purple-500',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    chartColor: '#8b5cf6',
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
    case 'Confirmed': return 'text-emerald-600 bg-emerald-50'
    case 'Pending': return 'text-amber-600 bg-amber-50'
    case 'Completed': return 'text-blue-600 bg-blue-50'
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

export function OverviewPage() {
  const [timeRange, setTimeRange] = useState('6M')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-6 space-y-6">

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SUMMARY_STATS.map((stat, index) => (
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
                      'text-rose-600'
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
                      {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1">
                  Reschedule
                </Button>
                <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Start Service
                </Button>
              </div> */}
            </div>
          ))}
        </div>
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

        {/* Top Customers */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
              <p className="text-sm text-gray-500">Your most valuable clients</p>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {customerData
              .sort((a, b) => b.totalSpent - a.totalSpent)
              .slice(0, 5)
              .map((customer) => (
                <div
                  key={customer.id}
                  className="group p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{customer.name}</h4>
                          <Badge
                            variant={
                              customer.loyalty === 'Platinum' ? 'default' :
                              customer.loyalty === 'Gold' ? 'secondary' : 'outline'
                            }
                            size="sm"
                          >
                            {customer.loyalty}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{customer.email}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">{customer.totalOrders}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">
                        ${customer.totalSpent.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  )
}