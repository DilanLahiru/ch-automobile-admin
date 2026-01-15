
import React, { useState } from 'react'
import {
  Plus,
  Filter,
  MoreHorizontal,
  Car,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { SearchBar } from '../../components/ui/SearchBar'

// Mock Data
const inventoryData = [
  {
    id: 1,
    vehicle: '2019 Toyota Camry',
    vin: '...8923',
    owner: 'John Smith',
    status: 'In Service',
    service: 'Oil Change',
    date: 'Oct 24, 2023',
  },
  {
    id: 2,
    vehicle: '2021 Ford F-150',
    vin: '...4421',
    owner: 'Construction Co.',
    status: 'Needs Repair',
    service: 'Brake Check',
    date: 'Oct 23, 2023',
  },
  {
    id: 3,
    vehicle: '2018 Honda Civic',
    vin: '...1102',
    owner: 'Sarah Connor',
    status: 'Available',
    service: 'Completed',
    date: 'Oct 22, 2023',
  },
  {
    id: 4,
    vehicle: '2022 Tesla Model 3',
    vin: '...5592',
    owner: 'Tech Corp',
    status: 'In Service',
    service: 'Tire Rotation',
    date: 'Oct 24, 2023',
  },
  {
    id: 5,
    vehicle: '2020 BMW X5',
    vin: '...3381',
    owner: 'Mike Ross',
    status: 'Needs Repair',
    service: 'Engine Diag',
    date: 'Oct 21, 2023',
  },
  {
    id: 6,
    vehicle: '2017 Audi A4',
    vin: '...7723',
    owner: 'Jessica Pearson',
    status: 'Available',
    service: 'Detailing',
    date: 'Oct 20, 2023',
  },
]

export function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="h-3 w-3" /> Ready
          </Badge>
        )
      case 'In Service':
        return (
          <Badge variant="default" className="gap-1">
            <Clock className="h-3 w-3" /> In Service
          </Badge>
        )
      case 'Needs Repair':
        return (
          <Badge variant="warning" className="gap-1">
            <AlertCircle className="h-3 w-3" /> Needs Repair
          </Badge>
        )
      default:
        return <Badge variant="neutral">{status}</Badge>
    }
  }

  const filteredData = inventoryData.filter(
    (item) =>
      item.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Repair History
          </h1>
          <p className="text-sm text-gray-500">
            Manage and track all vehicle repairs and services.
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card noPadding className="overflow-visible">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-72">
            <SearchBar
              placeholder="Search vehicle, VIN, or owner..."
              value={searchTerm}
              onSearch={setSearchTerm}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Filter className="h-3.5 w-3.5" />}
            >
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Vehicle Info</th>
                <th className="px-6 py-4 font-medium">Owner</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Last Service</th>
                <th className="px-6 py-4 font-medium">Date In</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                        <Car className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.vehicle}
                        </p>
                        <p className="text-xs text-gray-500">VIN: {item.vin}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.owner}</td>
                  <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 text-gray-600">{item.service}</td>
                  <td className="px-6 py-4 text-gray-600">{item.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <p className="text-xs text-gray-500">
            Showing <span className="font-medium">1-6</span> of{' '}
            <span className="font-medium">24</span> results
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
