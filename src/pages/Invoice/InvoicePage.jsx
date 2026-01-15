
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Printer,
  Download,
  Mail,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'

export function InvoicePage() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Get data from navigation state or use mock data if accessed directly
  const orderData = location.state?.orderData || {
    vehicle: { name: '2021 Ford F-150', owner: 'Construction Co.' },
    description: 'Standard maintenance and brake service',
    parts: [
      { id: 1, name: 'Premium Oil Filter', price: 12.99, quantity: 1 },
      { id: 2, name: 'Synthetic Motor Oil 5W-30', price: 34.99, quantity: 6 },
      { id: 3, name: 'Ceramic Brake Pads (Front)', price: 89.50, quantity: 1 },
    ],
    labor: 150.00,
    total: 462.43,
    date: new Date().toLocaleDateString(),
    orderNumber: 'SO-8842'
  }

  const subtotal = orderData.parts.reduce((sum, p) => sum + p.price * p.quantity, 0) + orderData.labor
  const taxRate = 0.08 // 8% tax
  const taxAmount = subtotal * taxRate
  const totalAmount = subtotal + taxAmount

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Invoice Generated</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Mail className="h-4 w-4" />}>Email</Button>
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>PDF</Button>
          <Button leftIcon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>Print</Button>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="mx-auto max-w-4xl bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 print:shadow-none print:border-none">
        {/* Invoice Header */}
        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                  AF
                </div>
                <span className="text-xl font-bold text-gray-900">CH Automobile Service</span>
              </div>
              <p className="text-gray-500 text-sm">CH Automobile service</p>
              <p className="text-gray-500 text-sm">304 A Abaya Street, Kalutara 80110</p>
              <p className="text-gray-500 text-sm">info@chautomobile.com</p>
              <p className="text-gray-500 text-sm">+94 (71) 427 4163</p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h2>
              <p className="text-gray-500 font-medium">#{orderData.orderNumber}</p>
              <div className="mt-4 space-y-1">
                <div className="flex justify-end gap-4 text-sm">
                  <span className="text-gray-500">Date Issued:</span>
                  <span className="font-medium text-gray-900">{orderData.date}</span>
                </div>
                <div className="flex justify-end gap-4 text-sm">
                  <span className="text-gray-500">Due Date:</span>
                  <span className="font-medium text-gray-900">{orderData.date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To Info */}
        <div className="p-8 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Bill To</h3>
              <p className="font-bold text-gray-900 text-lg">{orderData.vehicle.owner}</p>
              <p className="text-gray-600 text-sm mt-1">Client ID: C-4421</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Vehicle Details</h3>
              <p className="font-medium text-gray-900">{orderData.vehicle.name}</p>
              <p className="text-gray-600 text-sm mt-1">Service: {orderData.description}</p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="p-8">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th className="py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Labor Item */}
              <tr>
                <td className="py-4 text-sm text-gray-900">
                  <p className="font-medium">Labor / Service Charge</p>
                  <p className="text-gray-500 text-xs">{orderData.description}</p>
                </td>
                <td className="py-4 text-right text-sm text-gray-600">1</td>
                <td className="py-4 text-right text-sm text-gray-600">Rs. {orderData.labor.toFixed(2)}</td>
                <td className="py-4 text-right text-sm font-medium text-gray-900">${orderData.labor.toFixed(2)}</td>
              </tr>
              
              {/* Parts Items */}
              {orderData.parts.map((part, index) => (
                <tr key={index}>
                  <td className="py-4 text-sm text-gray-900">
                    <p className="font-medium">{part.name}</p>
                    <p className="text-gray-500 text-xs">SKU: {part.sku}</p>
                  </td>
                  <td className="py-4 text-right text-sm text-gray-600">{part.quantity}</td>
                  <td className="py-4 text-right text-sm text-gray-600">Rs.{part.price.toFixed(2)}</td>
                  <td className="py-4 text-right text-sm font-medium text-gray-900">
                    Rs. {(part.price * part.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="p-8 bg-gray-50/30 border-t border-gray-100">
          <div className="flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>Rs.{subtotal.toFixed(2)}</span>
              </div>
              {/* <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (8%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div> */}
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                <span>Total Due</span>
                <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 text-center text-sm text-gray-500">
          <p>Thank you for your business!</p>
          <p className="mt-1">Payment is due within 30 days. Please include invoice number on your check.</p>
        </div>
      </div>
    </div>
  )
}
