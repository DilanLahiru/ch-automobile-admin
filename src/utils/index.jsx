import React, { useState, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Wrench,
  Plus,
  X,
  User,
  Car,
  Phone,
  Mail,
  CalendarDays,
  ChevronUp,
  ChevronDown,
  Edit,
  Trash2,
  MoreVertical,
  Check,
  AlertCircle,
} from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'

// Mock data for appointments across multiple months
const initialAppointments = {
  // October 2023
  '2023-10-01': [
    { id: 1, time: '09:00 AM', customer: 'Alice Johnson', vehicle: 'Toyota Prius', type: 'maintenance', duration: '1h', color: 'bg-blue-100 border-blue-200 text-blue-700', phone: '+1-555-1234', email: 'alice@example.com', notes: 'Regular maintenance check' },
    { id: 2, time: '10:00 AM', customer: 'Bob Smith', vehicle: 'Ford Explorer', type: 'repair', duration: '2h', color: 'bg-orange-100 border-orange-200 text-orange-700', phone: '+1-555-5678', email: 'bob@example.com', notes: 'Brake system repair' },
  ],
  '2023-10-02': [
    { id: 3, time: '01:00 PM', customer: 'Charlie Brown', vehicle: 'Honda Civic', type: 'inspection', duration: '30m', color: 'bg-green-100 border-green-200 text-green-700', phone: '+1-555-9012', email: 'charlie@example.com', notes: 'Annual safety inspection' },
  ],
  '2023-10-23': [
    { id: 4, time: '02:00 PM', customer: 'Diana Prince', vehicle: 'BMW 3 Series', type: 'maintenance', duration: '1.5h', color: 'bg-blue-100 border-blue-200 text-blue-700', phone: '+1-555-3456', email: 'diana@example.com', notes: 'Oil change and filter replacement' },
    { id: 5, time: '10:00 AM', customer: 'Ethan Hunt', vehicle: 'Audi Q7', type: 'repair', duration: '2.5h', color: 'bg-orange-100 border-orange-200 text-orange-700', phone: '+1-555-7890', email: 'ethan@example.com', notes: 'Transmission issue' },
  ],
  '2023-10-25': [
    { id: 6, time: '09:00 AM', customer: 'Fiona Gallagher', vehicle: 'Tesla Model 3', type: 'inspection', duration: '1h', color: 'bg-green-100 border-green-200 text-green-700', phone: '+1-555-2345', email: 'fiona@example.com', notes: 'Pre-purchase inspection' },
    { id: 7, time: '11:00 AM', customer: 'George Miller', vehicle: 'Jeep Wrangler', type: 'maintenance', duration: '1h', color: 'bg-blue-100 border-blue-200 text-blue-700', phone: '+1-555-6789', email: 'george@example.com', notes: 'Tire rotation' },
    { id: 8, time: '02:00 PM', customer: 'Helen Parker', vehicle: 'Mercedes C-Class', type: 'repair', duration: '3h', color: 'bg-orange-100 border-orange-200 text-orange-700', phone: '+1-555-0123', email: 'helen@example.com', notes: 'Electrical system repair' },
    { id: 9, time: '04:00 PM', customer: 'Ian Smith', vehicle: 'Volkswagen Golf', type: 'inspection', duration: '30m', color: 'bg-green-100 border-green-200 text-green-700', phone: '+1-555-4567', email: 'ian@example.com', notes: 'Emissions test' },
  ],
  // November 2023
  '2023-11-05': [
    { id: 10, time: '10:00 AM', customer: 'Jack Wilson', vehicle: 'Ford F-150', type: 'maintenance', duration: '2h', color: 'bg-blue-100 border-blue-200 text-blue-700', phone: '+1-555-8901', email: 'jack@example.com', notes: 'Full service' },
  ],
  '2023-11-15': [
    { id: 11, time: '09:00 AM', customer: 'Karen Davis', vehicle: 'Toyota Camry', type: 'repair', duration: '1.5h', color: 'bg-orange-100 border-orange-200 text-orange-700', phone: '+1-555-2345', email: 'karen@example.com', notes: 'AC repair' },
    { id: 12, time: '01:00 PM', customer: 'Liam Brown', vehicle: 'Honda CR-V', type: 'inspection', duration: '30m', color: 'bg-green-100 border-green-200 text-green-700', phone: '+1-555-6789', email: 'liam@example.com', notes: 'Insurance inspection' },
  ],
}

const timeSlots = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
]

const serviceTypes = [
  { id: 'maintenance', name: 'Maintenance', duration: '1h' },
  { id: 'repair', name: 'Repair', duration: '2h' },
  { id: 'inspection', name: 'Inspection', duration: '30m' },
  { id: 'emergency', name: 'Emergency', duration: '3h' },
  { id: 'tire-change', name: 'Tire Change', duration: '1h' },
  { id: 'oil-change', name: 'Oil Change', duration: '45m' },
]

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function AppointmentsPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState('2023-10-23')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showMonthSelector, setShowMonthSelector] = useState(false)
  const [appointments, setAppointments] = useState(initialAppointments)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [showAppointmentMenu, setShowAppointmentMenu] = useState(null)
  const [appointmentForm, setAppointmentForm] = useState({
    id: null,
    date: selectedDate,
    time: '',
    customerName: '',
    phone: '',
    email: '',
    vehicle: '',
    serviceType: '',
    notes: '',
  })

  const today = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const selectedDateObj = new Date(selectedDate)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatShortDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const getDateString = (day) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const getAppointmentsForDate = (dateString) => {
    return appointments[dateString] || []
  }

  const isDayBlocked = (dateString) => {
    const dayAppointments = getAppointmentsForDate(dateString)
    return dayAppointments.length >= 4
  }

  const hasAppointments = (dateString) => {
    const dayAppointments = getAppointmentsForDate(dateString)
    return dayAppointments.length > 0
  }

  const getAppointmentCount = (dateString) => {
    const dayAppointments = getAppointmentsForDate(dateString)
    return dayAppointments.length
  }

  const isPastDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString)
    return date.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  }

  const isClosedDay = (dateString) => {
    const dayOfWeek = getDayOfWeek(dateString)
    return dayOfWeek === 0 // Sunday is closed
  }

  const isSaturday = (dateString) => {
    const dayOfWeek = getDayOfWeek(dateString)
    return dayOfWeek === 6 // Saturday
  }

  const getAvailableTimeSlots = (dateString) => {
    const dayOfWeek = getDayOfWeek(dateString)
    
    // Sunday - closed
    if (dayOfWeek === 0) {
      return []
    }
    
    // Saturday - until 12:00 noon only
    if (dayOfWeek === 6) {
      return ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM']
    }
    
    // Monday to Friday - full day
    return [
      '08:00 AM',
      '09:00 AM',
      '10:00 AM',
      '11:00 AM',
      '12:00 PM',
      '01:00 PM',
      '02:00 PM',
      '03:00 PM',
      '04:00 PM',
    ]
  }

  const handleDateSelect = (day) => {
    if (!day) return
    const dateString = getDateString(day)
    setSelectedDate(dateString)
    setShowAppointmentMenu(null)
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
    setShowAppointmentMenu(null)
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
    setShowAppointmentMenu(null)
  }

  const handleMonthSelect = (monthIndex) => {
    setCurrentDate(new Date(currentYear, monthIndex, 1))
    setShowMonthSelector(false)
    setShowAppointmentMenu(null)
  }

  const handleCreateAppointment = (time) => {
    if (isClosedDay(selectedDate)) {
      alert('We are closed on Sundays. Please select a weekday.')
      return
    }
    
    if (isDayBlocked(selectedDate)) {
      alert('This day is fully booked. Please select another day.')
      return
    }
    
    if (isPastDate(selectedDate)) {
      alert('Cannot book appointments for past dates.')
      return
    }
    
    setAppointmentForm({
      ...appointmentForm,
      id: null,
      date: selectedDate,
      time,
      customerName: '',
      phone: '',
      email: '',
      vehicle: '',
      serviceType: '',
      notes: '',
    })
    setEditingAppointment(null)
    setShowBookingModal(true)
  }

  const handleEditAppointment = (appointment) => {
    setAppointmentForm({
      id: appointment.id,
      date: selectedDate,
      time: appointment.time,
      customerName: appointment.customer,
      phone: appointment.phone || '',
      email: appointment.email || '',
      vehicle: appointment.vehicle,
      serviceType: appointment.type,
      notes: appointment.notes || '',
    })
    setEditingAppointment(appointment)
    setShowBookingModal(true)
    setShowAppointmentMenu(null)
  }

  const handleDeleteAppointment = (appointmentId) => {
    const dateAppointments = getAppointmentsForDate(selectedDate)
    const updatedAppointments = dateAppointments.filter(app => app.id !== appointmentId)
    
    setAppointments(prev => ({
      ...prev,
      [selectedDate]: updatedAppointments
    }))
    
    setShowDeleteConfirm(null)
    setShowAppointmentMenu(null)
  }

  const handleSubmitAppointment = () => {
    const appointmentData = {
      id: appointmentForm.id || Date.now(),
      time: appointmentForm.time,
      customer: appointmentForm.customerName,
      vehicle: appointmentForm.vehicle,
      type: appointmentForm.serviceType,
      duration: serviceTypes.find(s => s.id === appointmentForm.serviceType)?.duration || '1h',
      color: getColorForService(appointmentForm.serviceType),
      phone: appointmentForm.phone,
      email: appointmentForm.email,
      notes: appointmentForm.notes,
    }

    const dateAppointments = getAppointmentsForDate(selectedDate)
    
    if (editingAppointment) {
      // Update existing appointment
      const updatedAppointments = dateAppointments.map(app =>
        app.id === editingAppointment.id ? appointmentData : app
      )
      
      setAppointments(prev => ({
        ...prev,
        [selectedDate]: updatedAppointments
      }))
    } else {
      // Create new appointment
      // Check for time slot conflict
      const timeConflict = dateAppointments.find(app => app.time === appointmentForm.time)
      if (timeConflict) {
        alert('This time slot is already booked. Please choose another time.')
        return
      }
      
      setAppointments(prev => ({
        ...prev,
        [selectedDate]: [...dateAppointments, appointmentData]
      }))
    }

    setShowBookingModal(false)
    setEditingAppointment(null)
    setAppointmentForm({
      id: null,
      date: selectedDate,
      time: '',
      customerName: '',
      phone: '',
      email: '',
      vehicle: '',
      serviceType: '',
      notes: '',
    })
  }

  const getColorForService = (serviceType) => {
    switch (serviceType) {
      case 'maintenance':
        return 'bg-blue-100 border-blue-200 text-blue-700'
      case 'repair':
        return 'bg-orange-100 border-orange-200 text-orange-700'
      case 'inspection':
        return 'bg-green-100 border-green-200 text-green-700'
      case 'emergency':
        return 'bg-red-100 border-red-200 text-red-700'
      case 'tire-change':
        return 'bg-purple-100 border-purple-200 text-purple-700'
      case 'oil-change':
        return 'bg-amber-100 border-amber-200 text-amber-700'
      default:
        return 'bg-gray-100 border-gray-200 text-gray-700'
    }
  }

  const selectedDayAppointments = getAppointmentsForDate(selectedDate)

  const calendarDays = generateCalendarDays()

  return (
    <div className="space-y-6">
      {/* Booking/Edit Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(appointmentForm.date)} at {appointmentForm.time}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowBookingModal(false)
                  setEditingAppointment(null)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Information
                </label>
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                      value={appointmentForm.customerName}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, customerName: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                      value={appointmentForm.phone}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                      value={appointmentForm.email}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Details
                </label>
                <div className="relative">
                  <Car className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Make, Model, Year"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                    value={appointmentForm.vehicle}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, vehicle: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {serviceTypes.map((service) => (
                    <button
                      key={service.id}
                      className={`p-3 rounded-lg border text-sm transition-colors ${appointmentForm.serviceType === service.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' : 'border-gray-200 hover:bg-gray-50'}`}
                      onClick={() => setAppointmentForm({ ...appointmentForm, serviceType: service.id })}
                    >
                      <div className="font-medium text-left">{service.name}</div>
                      <div className="text-xs text-gray-500 text-left mt-1">{service.duration}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  placeholder="Any special instructions or concerns..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg min-h-[100px]"
                  value={appointmentForm.notes}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowBookingModal(false)
                    setEditingAppointment(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmitAppointment}
                  disabled={!appointmentForm.customerName || !appointmentForm.vehicle || !appointmentForm.serviceType}
                >
                  {editingAppointment ? 'Update Appointment' : 'Book Appointment'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Appointment
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this appointment? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDeleteAppointment(showDeleteConfirm.id)}
                >
                  Delete Appointment
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500">
            Schedule and manage service bookings
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={<CalendarIcon className="h-4 w-4" />}
          >
            Month View
          </Button>
          <Button 
            leftIcon={<Clock className="h-4 w-4" />}
            onClick={() => {
              setAppointmentForm({
                id: null,
                date: selectedDate,
                time: '',
                customerName: '',
                phone: '',
                email: '',
                vehicle: '',
                serviceType: '',
                notes: '',
              })
              setShowBookingModal(true)
            }}
          >
            New Appointment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calendar Sidebar */}
        <Card className="lg:col-span-1 h-fit">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowMonthSelector(!showMonthSelector)}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100"
                >
                  <span className="font-semibold text-gray-900">
                    {months[currentMonth]} {currentYear}
                  </span>
                  {showMonthSelector ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </button>
                
                {showMonthSelector && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48 max-h-60 overflow-y-auto">
                    {months.map((month, index) => (
                      <button
                        key={month}
                        onClick={() => handleMonthSelect(index)}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${index === currentMonth ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
                      >
                        {month} {currentYear}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={handlePrevMonth}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                onClick={handleNextMonth}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
            <span className="text-gray-400">Su</span>
            <span className="text-gray-400">Mo</span>
            <span className="text-gray-400">Tu</span>
            <span className="text-gray-400">We</span>
            <span className="text-gray-400">Th</span>
            <span className="text-gray-400">Fr</span>
            <span className="text-gray-400">Sa</span>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />
              }
              
              const dateString = getDateString(day)
              const isBlocked = isDayBlocked(dateString)
              const hasApps = hasAppointments(dateString)
              const appCount = getAppointmentCount(dateString)
              const isSelected = selectedDate === dateString
              const isPast = isPastDate(dateString)
              const isClosed = isClosedDay(dateString)
              const isToday = dateString === today.toISOString().split('T')[0]
              
              return (
                <button
                  key={day}
                  onClick={() => handleDateSelect(day)}
                  disabled={isBlocked || isPast || isClosed}
                  className={`aspect-square rounded-full flex flex-col items-center justify-center relative transition-all
                    ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : ''}
                    ${!isSelected && !isBlocked && !isPast && !isClosed ? 'hover:bg-gray-50 text-gray-700' : ''}
                    ${isBlocked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                    ${isPast ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : ''}
                    ${isClosed ? 'bg-red-50 text-red-400 cursor-not-allowed' : ''}
                    ${isToday && !isSelected ? 'ring-2 ring-blue-200 bg-blue-50' : ''}
                  `}
                >
                  {day}
                  {hasApps && !isSelected && (
                    <div className="absolute -top-1 -right-1">
                      <div className={`h-5 w-5 rounded-full text-white text-[10px] flex items-center justify-center
                        ${appCount >= 4 ? 'bg-red-500' : appCount >= 2 ? 'bg-orange-500' : 'bg-blue-500'}`}
                      >
                        {appCount}
                      </div>
                    </div>
                  )}
                  {isBlocked && (
                    <span className="text-[8px] mt-0.5 font-medium">FULL</span>
                  )}
                  {isClosed && !isSelected && (
                    <span className="text-[8px] mt-0.5 font-medium">CLOSED</span>
                  )}
                  {isPast && !isSelected && !isClosed && (
                    <span className="text-[8px] mt-0.5">PAST</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Selected Day Summary */}
          <div className="mt-6 border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="text-xs font-semibold uppercase text-gray-500">
                  Selected Day
                </h4>
                <p className="font-medium text-gray-900">
                  {formatDate(selectedDate)}
                </p>
              </div>
              <Badge variant={isClosedDay(selectedDate) ? 'destructive' : isDayBlocked(selectedDate) ? 'destructive' : 'success'}>
                {isClosedDay(selectedDate) ? 'Closed (Sunday)' : isDayBlocked(selectedDate) ? 'Fully Booked' : `${selectedDayAppointments.length}/4 Booked`}
              </Badge>
            </div>
            
            {isSaturday(selectedDate) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-700 font-medium">
                  ⏰ Limited Hours: Saturday appointments available until 12:00 noon only
                </p>
              </div>
            )}
            
            {/* Selected Day Appointments */}
            <div className="space-y-3 mb-4">
              {selectedDayAppointments.length > 0 ? (
                selectedDayAppointments.map((app) => (
                  <div key={app.id} className="group relative">
                    <div className="flex items-start gap-3 p-2 rounded-lg bg-gray-50 hover:bg-gray-100">
                      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${app.color.split(' ')[0]}`}>
                        <Wrench className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {app.customer}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {app.time} • {app.vehicle}
                        </p>
                        <p className="text-xs font-medium truncate mt-0.5">
                          {serviceTypes.find(s => s.id === app.type)?.name || app.type}
                        </p>
                      </div>
                      <Badge variant="neutral" className="text-xs whitespace-nowrap">
                        {app.duration}
                      </Badge>
                    </div>
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setShowAppointmentMenu(showAppointmentMenu === app.id ? null : app.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </button>
                      {showAppointmentMenu === app.id && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48">
                          <button
                            onClick={() => handleEditAppointment(app)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Edit Appointment
                          </button>
                          <button
                            onClick={() => {
                              setShowDeleteConfirm({ id: app.id, customer: app.customer })
                              setShowAppointmentMenu(null)
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Appointment
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                  <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">No appointments for this day</p>
                  <p className="text-xs mt-1">Click on a time slot to book</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-50 p-2 rounded text-center">
                <div className="font-semibold text-blue-700">
                  {selectedDayAppointments.filter(a => a.type === 'maintenance').length}
                </div>
                <div className="text-blue-600">Maintenance</div>
              </div>
              <div className="bg-orange-50 p-2 rounded text-center">
                <div className="font-semibold text-orange-700">
                  {selectedDayAppointments.filter(a => a.type === 'repair').length}
                </div>
                <div className="text-orange-600">Repair</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Daily Schedule */}
        <Card className="lg:col-span-2" title={`Schedule for ${formatDate(selectedDate)}`}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Click on an appointment to edit or delete
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {selectedDayAppointments.length} of 4 slots filled
              </Badge>
              <Button
                size="sm"
                leftIcon={<Plus className="h-3 w-3" />}
                onClick={() => {
                  if (isClosedDay(selectedDate)) {
                    alert('We are closed on Sundays. Please select a weekday.')
                    return
                  }
                  if (isDayBlocked(selectedDate)) {
                    alert('This day is fully booked. Please select another day.')
                    return
                  }
                  if (isPastDate(selectedDate)) {
                    alert('Cannot book appointments for past dates.')
                    return
                  }
                  setAppointmentForm({
                    id: null,
                    date: selectedDate,
                    time: '',
                    customerName: '',
                    phone: '',
                    email: '',
                    vehicle: '',
                    serviceType: '',
                    notes: '',
                  })
                  setShowBookingModal(true)
                }}
                disabled={isClosedDay(selectedDate) || isDayBlocked(selectedDate) || isPastDate(selectedDate)}
              >
                Book Slot
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {(() => {
              const availableSlots = getAvailableTimeSlots(selectedDate)
              
              if (isClosedDay(selectedDate)) {
                return (
                  <div className="text-center py-8 text-gray-500 bg-red-50 rounded-lg border border-red-200">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                    <p className="text-sm font-medium text-red-700">We are closed on Sundays</p>
                    <p className="text-xs mt-1 text-red-600">Please select another day</p>
                  </div>
                )
              }
              
              return availableSlots.map((time) => {
                const appointment = selectedDayAppointments.find((a) => a.time === time)
                const isDayFull = isDayBlocked(selectedDate)
                const isPast = isPastDate(selectedDate)
                
                return (
                  <div key={time} className="flex gap-4 group">
                    <div className="w-20 flex-shrink-0 text-right text-sm text-gray-500 pt-2">
                      {time}
                    </div>
                    <div className="flex-1 min-h-[3rem] relative">
                      <div className="absolute inset-0 border-t border-gray-100 -z-10 top-3.5"></div>

                      {appointment ? (
                        <div
                          className={`rounded-lg border p-3 shadow-sm transition-all hover:shadow-md cursor-pointer relative group/appointment ${appointment.color}`}
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">
                                {appointment.customer}
                              </span>
                              <span className="text-xs opacity-75">
                                • {appointment.vehicle}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="neutral"
                                className="bg-white/50 border-transparent text-current text-[10px]"
                              >
                                {appointment.duration}
                              </Badge>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowAppointmentMenu(showAppointmentMenu === appointment.id ? null : appointment.id)
                                }}
                                className="p-1 hover:bg-white/30 rounded opacity-0 group-hover/appointment:opacity-100"
                              >
                                <MoreVertical className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-xs opacity-90">
                            <Wrench className="h-3 w-3" />
                            {serviceTypes.find(s => s.id === appointment.type)?.name || appointment.type}
                          </div>
                          {appointment.notes && (
                            <div className="mt-2 text-xs text-gray-600 truncate">
                              📝 {appointment.notes}
                            </div>
                          )}
                          {showAppointmentMenu === appointment.id && (
                            <div className="absolute right-2 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditAppointment(appointment)
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowDeleteConfirm({ id: appointment.id, customer: appointment.customer })
                                  setShowAppointmentMenu(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleCreateAppointment(time)}
                          disabled={isDayFull || isPast}
                          className={`h-full w-full rounded-lg transition-colors cursor-pointer border border-transparent flex items-center justify-center
                            ${isDayFull || isPast ? 'cursor-not-allowed opacity-50' : 'opacity-0 group-hover:opacity-100 hover:bg-gray-50 hover:border-dashed hover:border-gray-300'}
                          `}
                        >
                          {isDayFull ? (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <X className="h-3 w-3" /> Day Full
                            </span>
                          ) : isPast ? (
                            <span className="text-xs text-gray-400">Past Date</span>
                          ) : (
                            <Plus className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      )}
                  </div>
                </div>
              )
            })
            })}
          </div>
          
          {/* Appointment Actions Info */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-blue-100 rounded">
                  <Edit className="h-3 w-3 text-blue-600" />
                </div>
                <span>Click appointment to edit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 bg-red-100 rounded">
                  <Trash2 className="h-3 w-3 text-red-600" />
                </div>
                <span>Click ••• to delete</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}