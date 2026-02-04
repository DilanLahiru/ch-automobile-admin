import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Eye,
  Trash2,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
} from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { useDispatch, useSelector } from 'react-redux'
import { getAllServiceOrders, deleteServiceOrder } from '../../features/serviceOrderSlice'
import { toast } from 'react-toastify'

export function ServiceOrderListPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { orders: serviceOrders, isLoading } = useSelector((state) => state.serviceOrder)
  const [filteredOrders, setFilteredOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock vehicle data
  const mockVehicles = [
    { id: 1, registrationNo: 'ABC-123', owner: 'Ahmad Khan', make: 'Toyota', model: 'Corolla' },
    { id: 2, registrationNo: 'XYZ-456', owner: 'Fatima Ali', make: 'Honda', model: 'Civic' },
    { id: 3, registrationNo: 'PQR-789', owner: 'Hassan Ahmed', make: 'Suzuki', model: 'Swift' },
  ]

  useEffect(() => {
    loadServiceOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [serviceOrders, searchTerm, filterStatus])

  const loadServiceOrders = async () => {
    dispatch(getAllServiceOrders())
  }

  const filterOrders = () => {
    let filtered = Array.isArray(serviceOrders) ? [...serviceOrders] : []

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((order) => {
        const allRepairsCompleted = order.repairs?.every((r) => r.status === 'completed')
        const repairStatus = allRepairsCompleted ? 'completed' : 'pending'
        return repairStatus === filterStatus
      })
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter((order) => {
        const searchLower = searchTerm.toLowerCase()
        const vehicleNo = order.repairs?.[0]?.vehicleId
        const vehicle = mockVehicles.find((v) => v.id === parseInt(vehicleNo))
        return (
          order._id?.toLowerCase().includes(searchLower) ||
          vehicle?.registrationNo?.toLowerCase().includes(searchLower) ||
          vehicle?.owner?.toLowerCase().includes(searchLower)
        )
      })
    }

    setFilteredOrders(filtered)
  }

  const getVehicleInfo = (vehicleId) => {
    return mockVehicles.find((v) => v.id === parseInt(vehicleId))
  }

  const getStatusIcon = (status) => {
    if (status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    }
    return <Clock className="h-5 w-5 text-yellow-600" />
  }

  const getStatusBadgeVariant = (status) => {
    return status === 'completed' ? 'success' : 'warning'
  }

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this service order?')) {
      try {
        await dispatch(deleteServiceOrder(orderId))
        toast.success('Service order deleted successfully')
      } catch (error) {
        toast.error('Failed to delete service order')
      }
    }
  }

  const handleViewInvoice = (order) => {
    navigate('/dashboard/invoices/new', {
      state: { serviceOrder: order },
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Orders</h1>
          <p className="text-sm text-gray-500">View and manage all vehicle repair orders</p>
        </div>
        <Button
          onClick={() => navigate('/dashboard/service-orders/new')}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          New Service Order
        </Button>
      </div>

      {/* Search & Filter */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Search by Order ID, Vehicle, or Owner
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Service Orders List */}
      {isLoading ? (
        <Card>
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading service orders...</p>
          </div>
        </Card>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const allRepairsCompleted = order.repairs?.every((r) => r.status === 'completed')
            const repairStatus = allRepairsCompleted ? 'completed' : 'pending'
            const firstRepair = order.repairs?.[0]
            const vehicle = getVehicleInfo(firstRepair?.vehicleId)

            return (
              <Card key={order._id} className="overflow-hidden">
                <div className="flex items-start justify-between p-6">
                  <div className="flex-1">
                    {/* Order Header */}
                    <div className="flex items-center gap-3 mb-4">
                      {getStatusIcon(repairStatus)}
                      <div>
                        <h3 className="font-semibold text-gray-900">Order ID: {order._id}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Created: {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(repairStatus)}>
                        {repairStatus.charAt(0).toUpperCase() + repairStatus.slice(1)}
                      </Badge>
                    </div>

                    {/* Vehicle & Repairs Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {vehicle ? (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 font-semibold mb-2">Vehicle Information</p>
                          <p className="text-sm font-medium text-gray-900">
                            {vehicle.registrationNo} - {vehicle.make} {vehicle.model}
                          </p>
                          <p className="text-xs text-gray-600">{vehicle.owner}</p>
                        </div>
                      ) : null}

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-semibold mb-2">Repair Summary</p>
                        <p className="text-sm text-gray-900">
                          <strong>Total Repairs:</strong> {order.repairs?.length || 0}
                        </p>
                        <p className="text-sm text-gray-900">
                          <strong>Total Amount:</strong> Rs. {(order.totalAmount || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Repairs Details */}
                    {order.repairs && order.repairs.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-600 font-semibold mb-2">Repairs Included</p>
                        <div className="space-y-2">
                          {order.repairs.map((repair, index) => (
                            <div
                              key={index}
                              className="text-xs bg-blue-50 p-2 rounded border border-blue-200"
                            >
                              <p className="font-medium text-gray-900 mb-1">
                                Repair #{index + 1} {repair.status === 'completed' && '✓'}
                              </p>
                              {repair.serviceDescription && (
                                <p className="text-gray-700 line-clamp-1">
                                  {repair.serviceDescription}
                                </p>
                              )}
                              {repair.parts && repair.parts.length > 0 && (
                                <p className="text-gray-600 mt-1">
                                  Parts Used: {repair.parts.length} items
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleViewInvoice(order)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Invoice"
                    >
                      <FileText className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Order"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all'
                ? 'No service orders found matching your filters'
                : 'No service orders yet'}
            </p>
            <Button onClick={() => navigate('/dashboard/service-orders/new')}>
              Create First Service Order
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
