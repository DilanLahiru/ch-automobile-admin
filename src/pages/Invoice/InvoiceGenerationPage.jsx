import React, { useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import { Download, Share2, ArrowLeft, FileText } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export function InvoiceGenerationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const printRef = useRef()

  const { employee: employeesFromRedux } = useSelector((state) => state.employee)

  const serviceOrder = location.state?.serviceOrder
  const [invoiceData, setInvoiceData] = useState(
    serviceOrder || {
      invoiceNumber: 'INV-' + Date.now(),
      invoiceDate: new Date().toLocaleDateString(),
      repairs: [],
    }
  )

  // Mock business data
  const businessInfo = {
    name: 'CH Automobile Service Center',
    address: '123 Main Street, Karachi, Pakistan',
    phone: '+92-300-1234567',
    email: 'info@chautomobile.com',
    taxId: 'TX-123456789',
  }

  const mockVehicles = [
    { id: 1, registrationNo: 'ABC-123', owner: 'Ahmad Khan', make: 'Toyota', model: 'Corolla' },
    { id: 2, registrationNo: 'XYZ-456', owner: 'Fatima Ali', make: 'Honda', model: 'Civic' },
    { id: 3, registrationNo: 'PQR-789', owner: 'Hassan Ahmed', make: 'Suzuki', model: 'Swift' },
  ]

  const getVehicleInfo = (vehicleId) => {
    return mockVehicles.find((v) => v.id === parseInt(vehicleId))
  }

  const getEmployeeInfo = (employeeId) => {
    return Array.isArray(employeesFromRedux)
      ? employeesFromRedux.find((emp) => emp._id === employeeId)
      : null
  }

  const calculateRepairTotal = (repair) => {
    const partsTotal = repair.parts.reduce((sum, part) => sum + part.price * part.quantity, 0)
    return partsTotal + (parseFloat(repair.laborCost) || 0)
  }

  const calculateGrandTotal = () => {
    return invoiceData.repairs.reduce((total, repair) => total + calculateRepairTotal(repair), 0)
  }

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: invoiceData.invoiceNumber,
  })

  const handleDownloadPDF = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).jsPDF
      const canvas = await html2canvas(printRef.current)
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`${invoiceData.invoiceNumber}.pdf`)
      toast.success('Invoice downloaded successfully')
    } catch (error) {
      toast.error('Failed to download invoice')
      console.error(error)
    }
  }

  if (!invoiceData.repairs || invoiceData.repairs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Generate Invoice</h1>
        </div>
        <Card>
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No service order data available</p>
            <Button onClick={() => navigate('/dashboard/service-orders')}>
              Back to Service Orders
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Service Order Invoice</h1>
            <p className="text-sm text-gray-500">Invoice: {invoiceData.invoiceNumber}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="secondary"
            onClick={handlePrint}
            leftIcon={<Download className="h-4 w-4" />}
          >
            Print
          </Button>
          <Button
            variant="secondary"
            onClick={handleDownloadPDF}
            leftIcon={<Download className="h-4 w-4" />}
          >
            Download PDF
          </Button>
        </div>
      </div>

      {/* Invoice Preview */}
      <Card>
        <div
          ref={printRef}
          className="bg-white p-8 text-gray-900"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          {/* Header Section */}
          <div className="flex justify-between items-start mb-8 border-b-2 border-gray-300 pb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-700 mb-2">{businessInfo.name}</h1>
              <p className="text-sm text-gray-600 mb-1">{businessInfo.address}</p>
              <p className="text-sm text-gray-600 mb-1">Phone: {businessInfo.phone}</p>
              <p className="text-sm text-gray-600">Email: {businessInfo.email}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">INVOICE</p>
              <p className="text-sm text-gray-600 mt-4">Invoice #: {invoiceData.invoiceNumber}</p>
              <p className="text-sm text-gray-600">Date: {invoiceData.invoiceDate}</p>
              <p className="text-sm text-gray-600">Tax ID: {businessInfo.taxId}</p>
            </div>
          </div>

          {/* Repair Details */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Service Order Details</h2>

            {invoiceData.repairs.map((repair, repairIndex) => {
              const vehicle = getVehicleInfo(repair.vehicleId)
              const employee = getEmployeeInfo(repair.employeeId)

              return (
                <div key={repairIndex} className="mb-8 border border-gray-300 rounded-lg p-6">
                  {/* Repair Header */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Vehicle Information</p>
                      {vehicle && (
                        <>
                          <p className="text-sm text-gray-900">
                            <strong>Registration:</strong> {vehicle.registrationNo}
                          </p>
                          <p className="text-sm text-gray-900">
                            <strong>Make/Model:</strong> {vehicle.make} {vehicle.model}
                          </p>
                          <p className="text-sm text-gray-900">
                            <strong>Owner:</strong> {vehicle.owner}
                          </p>
                        </>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Assigned Technician</p>
                      {employee && (
                        <>
                          <p className="text-sm text-gray-900">
                            <strong>Name:</strong> {employee.name}
                          </p>
                          <p className="text-sm text-gray-900">
                            <strong>Position:</strong> {employee.position || 'Technician'}
                          </p>
                          <p className="text-sm text-gray-900">
                            <strong>Contact:</strong> {employee.phone || 'N/A'}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Service Description */}
                  {repair.serviceDescription && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 font-semibold">Service Description</p>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">
                        {repair.serviceDescription}
                      </p>
                    </div>
                  )}

                  {/* Parts Table */}
                  {repair.parts && repair.parts.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 font-semibold mb-3">Parts & Materials</p>
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-gray-100 border border-gray-300">
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                              Part Name
                            </th>
                            <th className="border border-gray-300 px-3 py-2 text-right font-semibold">
                              Unit Price
                            </th>
                            <th className="border border-gray-300 px-3 py-2 text-right font-semibold">
                              Qty
                            </th>
                            <th className="border border-gray-300 px-3 py-2 text-right font-semibold">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {repair.parts.map((part, partIndex) => (
                            <tr key={partIndex} className="border border-gray-300">
                              <td className="border border-gray-300 px-3 py-2">{part.name}</td>
                              <td className="border border-gray-300 px-3 py-2 text-right">
                                Rs. {part.price.toFixed(2)}
                              </td>
                              <td className="border border-gray-300 px-3 py-2 text-right">
                                {part.quantity}
                              </td>
                              <td className="border border-gray-300 px-3 py-2 text-right font-semibold">
                                Rs. {(part.price * part.quantity).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Repair Summary */}
                  <div className="flex justify-end mb-6">
                    <div className="w-64">
                      <div className="flex justify-between border-b border-gray-300 py-2 mb-2">
                        <span className="font-semibold">Parts Subtotal:</span>
                        <span>
                          Rs.{' '}
                          {repair.parts
                            .reduce((sum, p) => sum + p.price * p.quantity, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-300 py-2 mb-2">
                        <span className="font-semibold">Labor Cost:</span>
                        <span>Rs. {(parseFloat(repair.laborCost) || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between bg-blue-100 py-2 px-3 rounded font-bold text-base">
                        <span>Repair Total:</span>
                        <span>Rs. {calculateRepairTotal(repair).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Grand Total */}
          <div className="border-t-4 border-gray-400 pt-6 flex justify-end">
            <div className="w-80">
              <div className="flex justify-between text-lg font-bold bg-gray-200 p-4 rounded-lg">
                <span>Grand Total:</span>
                <span>Rs. {calculateGrandTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="mt-10 border-t border-gray-300 pt-6 text-xs text-gray-600">
            <p className="mb-3">
              <strong>Payment Terms:</strong> Payment due within 30 days of invoice date.
            </p>
            <p className="mb-3">
              <strong>Bank Details:</strong> Bank Name: XYZ Bank, Account: 123-456-789, IBAN: PK00XXXX0000000000
            </p>
            <p>
              <strong>Notes:</strong> All warranty claims must be made within 30 days of service completion.
              Thank you for your business!
            </p>
          </div>

          {/* Signature Section */}
          <div className="mt-10 flex justify-between">
            <div className="text-center w-40">
              <p className="text-xs text-gray-600 mb-8">Authorized By</p>
              <div className="border-t border-gray-400 pt-2">
                <p className="text-xs font-semibold">Service Manager</p>
              </div>
            </div>
            <div className="text-center w-40">
              <p className="text-xs text-gray-600 mb-8">Customer Signature</p>
              <div className="border-t border-gray-400 pt-2">
                <p className="text-xs font-semibold">Customer</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap">
        <Button onClick={() => navigate('/dashboard/service-orders')} variant="secondary">
          Back to Service Orders
        </Button>
        <Button onClick={handlePrint} leftIcon={<Download className="h-4 w-4" />}>
          Print Invoice
        </Button>
        <Button onClick={handleDownloadPDF} leftIcon={<Download className="h-4 w-4" />}>
          Download as PDF
        </Button>
      </div>
    </div>
  )
}
