
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Search,
  Trash2,
  FileText,
  Car,
  Wrench,
  Save,
  ArrowRight,
} from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'

// Mock Data for Parts (simplified from StockManagementPage)
const availableParts = [
  { id: 1, name: 'Premium Oil Filter', price: 12500.00, sku: 'OF-2023-X' },
  { id: 2, name: 'Ceramic Brake Pads (Front)', price: 4500.00, sku: 'BP-F-550' },
  { id: 3, name: 'Synthetic Motor Oil 5W-30', price: 15000.00, sku: 'OIL-SYN-5W30' },
  { id: 4, name: 'Spark Plug Iridium', price: 4000.00, sku: 'SP-IR-99' },
  { id: 5, name: 'Air Filter Cabin', price: 20000.00, sku: 'AF-C-200' },
]

// Mock Data for Vehicles
const vehicles = [
  { id: 1, name: '2019 Toyota Camry', owner: 'John Smith' },
  { id: 2, name: '2021 Ford F-150', owner: 'Construction Co.' },
  { id: 3, name: '2018 Honda Civic', owner: 'Sarah Connor' },
]

export function ServiceOrderPage() {
  const navigate = useNavigate()
  const [selectedVehicle, setSelectedVehicle] = useState('')
  const [serviceDescription, setServiceDescription] = useState('')
  const [laborCost, setLaborCost] = useState(0)
  const [selectedPartId, setSelectedPartId] = useState('')
  const [partQuantity, setPartQuantity] = useState(1)
  const [addedParts, setAddedParts] = useState([])

  const handleAddPart = () => {
    if (!selectedPartId) return
    const part = availableParts.find((p) => p.id === parseInt(selectedPartId))
    if (part) {
      const existingPartIndex = addedParts.findIndex((p) => p.id === part.id)
      if (existingPartIndex >= 0) {
        const updatedParts = [...addedParts]
        updatedParts[existingPartIndex].quantity += parseInt(partQuantity)
        setAddedParts(updatedParts)
      } else {
        setAddedParts([...addedParts, { ...part, quantity: parseInt(partQuantity) }])
      }
      setSelectedPartId('')
      setPartQuantity(1)
    }
  }

  const handleRemovePart = (id) => {
    setAddedParts(addedParts.filter((p) => p.id !== id))
  }

  const calculateTotal = () => {
    const partsTotal = addedParts.reduce((sum, part) => sum + part.price * part.quantity, 0)
    return partsTotal + parseFloat(laborCost || 0)
  }

  const handleGenerateInvoice = () => {
    // In a real app, you'd save the order first and pass the ID
    // For this demo, we'll pass state via navigation or just navigate to a generic invoice page
    // We'll simulate saving and navigating to the invoice view
    const orderData = {
      vehicle: vehicles.find(v => v.id === parseInt(selectedVehicle)),
      description: serviceDescription,
      parts: addedParts,
      labor: parseFloat(laborCost),
      total: calculateTotal(),
      date: new Date().toLocaleDateString(),
      orderNumber: 'SO-' + Math.floor(Math.random() * 10000)
    }
    // Navigate to invoice page with state
    navigate('/dashboard/invoices/new', { state: { orderData } })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Service Order</h1>
          <p className="text-sm text-gray-500">
            Create a new service record and add parts
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard/service-orders')}>
          Back to List
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Service Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Vehicle & Service Information">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Select Vehicle
                </label>
                <select
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                >
                  <option value="">-- Select a Vehicle --</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} - {v.owner}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Service Description
                </label>
                <textarea
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe the service performed..."
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card title="Parts & Materials">
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Add Part
                  </label>
                  <select
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={selectedPartId}
                    onChange={(e) => setSelectedPartId(e.target.value)}
                  >
                    <option value="">-- Select Part --</option>
                    {availableParts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-24">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Qty
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={partQuantity}
                    onChange={(e) => setPartQuantity(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddPart} disabled={!selectedVehicle || !selectedPartId}>
                  <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
              </div>

              {/* Parts List Table */}
              {addedParts.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {addedParts.map((part) => (
                        <tr key={part.id}>
                          <td className="px-4 py-3 text-sm text-gray-900">{part.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">Rs. {part.price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">{part.quantity}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                            Rs. {(part.price * part.quantity).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleRemovePart(part.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <Wrench className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No parts added yet. Select parts above to add them to this order.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Summary & Actions */}
        <div className="space-y-6">
          <Card title="Order Summary">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Labor Cost (Rs.)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={laborCost}
                  onChange={(e) => setLaborCost(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Parts Total:</span>
                  <span>Rs. {addedParts.reduce((sum, p) => sum + p.price * p.quantity, 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Labor:</span>
                  <span>Rs. {parseFloat(laborCost || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total Estimate:</span>
                  <span>Rs. {calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button 
                  className="w-full" 
                  onClick={handleGenerateInvoice}
                  disabled={!selectedVehicle || (addedParts.length === 0 && !laborCost)}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Generate Invoice
                </Button>
                <Button variant="secondary" className="w-full" leftIcon={<Save className="h-4 w-4" />}>
                  Save Draft
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
