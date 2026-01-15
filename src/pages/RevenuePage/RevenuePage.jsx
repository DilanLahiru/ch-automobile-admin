
import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wrench,
  Users,
} from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

const monthlyData = [
  {
    name: 'May',
    revenue: 42000,
    repairs: 120,
  },
  {
    name: 'Jun',
    revenue: 48000,
    repairs: 135,
  },
  {
    name: 'Jul',
    revenue: 51000,
    repairs: 142,
  },
  {
    name: 'Aug',
    revenue: 49000,
    repairs: 138,
  },
  {
    name: 'Sep',
    revenue: 56000,
    repairs: 155,
  },
  {
    name: 'Oct',
    revenue: 62000,
    repairs: 170,
  },
]

export function RevenuePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Revenue Analytics
          </h1>
          <p className="text-sm text-gray-500">
            Financial performance and repair statistics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Download Report</Button>
          <Button variant="secondary">Last 30 Days</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="mt-2 text-3xl font-bold text-gray-900">RS.62,450</h3>
            </div>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center font-medium text-green-600">
              <TrendingUp className="mr-1 h-4 w-4" />
              12.5%
            </span>
            <span className="ml-2 text-gray-500">vs last month</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Repairs Completed
              </p>
              <h3 className="mt-2 text-3xl font-bold text-gray-900">170</h3>
            </div>
            <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
              <Wrench className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center font-medium text-green-600">
              <TrendingUp className="mr-1 h-4 w-4" />
              8.2%
            </span>
            <span className="ml-2 text-gray-500">vs last month</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Avg. Ticket Size
              </p>
              <h3 className="mt-2 text-3xl font-bold text-gray-900">RS.367</h3>
            </div>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center font-medium text-red-600">
              <TrendingDown className="mr-1 h-4 w-4" />
              2.1%
            </span>
            <span className="ml-2 text-gray-500">vs last month</span>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Monthly Revenue Overview">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#6b7280',
                    fontSize: 12,
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#6b7280',
                    fontSize: 12,
                  }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  cursor={{
                    fill: '#f9fafb',
                  }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Repair Volume Trend">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorRepairs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#6b7280',
                    fontSize: 12,
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#6b7280',
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="repairs"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRepairs)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
