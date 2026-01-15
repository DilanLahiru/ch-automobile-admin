
import React, { useState } from 'react'
import {
  Plus,
  Filter,
  MoreHorizontal,
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Box,
} from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { SearchBar } from '../../components/ui/SearchBar'
import { AddProductDialog } from '../../components/AddProductDialog'

// Mock Data for Car Parts
const stockData = [
  {
    id: 1,
    name: 'Premium Oil Filter',
    sku: 'OF-2023-X',
    category: 'Engine Parts',
    price: 12.99,
    stock: 100,
    quantity: 45,
    minLevel: 10,
    status: 'In Stock',
  },
  {
    id: 2,
    name: 'Ceramic Brake Pads (Front)',
    sku: 'BP-F-550',
    category: 'Brake System',
    price: 89.50,
    stock: 150,
    quantity: 8,
    minLevel: 15,
    status: 'Low Stock',
  },
  {
    id: 3,
    name: 'Synthetic Motor Oil 5W-30',
    sku: 'OIL-SYN-5W30',
    category: 'Fluids',
    price: 34.99,
    stock: 100,
    quantity: 90,
    minLevel: 50,
    status: 'In Stock',
  },
  {
    id: 4,
    name: 'Spark Plug Iridium',
    sku: 'SP-IR-99',
    category: 'Ignition',
    price: 18.75,
    stock: 50,
    quantity: 0,
    minLevel: 20,
    
    status: 'Out of Stock',
  },
  {
    id: 5,
    name: 'Air Filter Cabin',
    sku: 'AF-C-200',
    category: 'Filters',
    price: 22.50,
    stock: 40,
    quantity: 15,
    minLevel: 10,
    status: 'In Stock',
  },
  {
    id: 6,
    name: 'Alternator 120A',
    sku: 'ALT-120-G',
    category: 'Electrical',
    price: 185.00,
    stock: 35,
    quantity: 3,
    minLevel: 5,
    status: 'Low Stock',
  },
  {
    id: 7,
    name: 'Timing Belt Kit',
    sku: 'TBK-900',
    category: 'Engine Parts',
    price: 145.00,
    stock: 20,
    quantity: 12,
    minLevel: 8,
    
    status: 'In Stock',
  },
]

export function StockManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Stock':
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="h-3 w-3" /> In Stock
          </Badge>
        )
      case 'Low Stock':
        return (
          <Badge variant="warning" className="gap-1">
            <AlertTriangle className="h-3 w-3" /> Low Stock
          </Badge>
        )
      case 'Out of Stock':
        return (
          <Badge variant="error" className="gap-1">
            <XCircle className="h-3 w-3" /> Out of Stock
          </Badge>
        )
      default:
        return <Badge variant="neutral">{status}</Badge>
    }
  }

  const handleAddProduct = (productData) => {
    console.log('New product added:', productData)
    // Here you would update your stockData state or make an API call
    // For now, we'll just log it
    setIsAddProductOpen(false)
  }

  const filteredData = stockData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate Stats
  const totalProducts = stockData.length
  const lowStockCount = stockData.filter((i) => i.status === 'Low Stock').length
  const outOfStockCount = stockData.filter((i) => i.status === 'Out of Stock').length
  const totalValue = stockData.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory management</h1>
          <p className="text-sm text-gray-500">
            Manage parts inventory, reorder levels, and suppliers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Import CSV</Button>
          <Button leftIcon={<Plus className="h-4 w-4" /> } onClick={() => setIsAddProductOpen(true)}>Add Product</Button>
        </div>
      </div>

      {/* Main Content */}
      <Card noPadding className="overflow-visible">
        {/* Filters */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-72">
            <SearchBar
              placeholder="Search part name, SKU, category..."
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
                <th className="px-6 py-4 font-medium">Product Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Available Quantity</th>
                <th className="px-6 py-4 font-medium">Status</th>
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
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                        <Box className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.category}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.stock}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">{item.quantity}</span>
                      {/* <span className="text-xs text-gray-400">/ {item.minLevel}</span> */}
                    </div>
                    {/* Simple progress bar for stock level visualization */}
                    <div className="mt-1 h-1.5 w-24 rounded-full bg-gray-100">
                      <div
                        className={`h-1.5 rounded-full ${
                            item.quantity === 0
                              ? 'bg-red-500'
                              : item.quantity <= item.minLevel
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                          }
                        }`}
                        style={{ width: `${Math.min((item.quantity / (item.minLevel * 2)) * 100, 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
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
            Showing <span className="font-medium">1-{filteredData.length}</span> of{' '}
            <span className="font-medium">{stockData.length}</span> results
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </Card>
      {/* Add Product Dialog */}
      <AddProductDialog
        open={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  )
}
