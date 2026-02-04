// import React, { useState, useEffect } from 'react'
// import {
//   ChevronLeft,
//   ChevronRight,
//   Calendar as CalendarIcon,
//   Clock,
//   Wrench,
//   Plus,
//   X,
//   User,
//   Car,
//   Phone,
//   Mail,
//   CalendarDays,
//   ChevronUp,
//   ChevronDown,
//   Edit,
//   Trash2,
//   MoreVertical,
//   Check,
//   AlertCircle,
//   Info,
// } from 'lucide-react'
// import { Card } from '../../components/ui/Card'
// import { Button } from '../../components/ui/Button'
// import { Badge } from '../../components/ui/Badge'
// import {useDispatch, useSelector} from 'react-redux'
// import {getAllAppointments, createAppointment} from '../../features/appointmentSlice'
// import {getAllCustomers} from '../../features/customerSlice'

// const timeSlots = [
//   '08:00 AM', '08:30 AM',
//   '09:00 AM', '09:30 AM',
//   '10:00 AM', '10:30 AM',
//   '11:00 AM', '11:30 AM',
//   '12:00 PM', '12:30 PM',
//   '01:00 PM', '01:30 PM',
//   '02:00 PM', '02:30 PM',
//   '03:00 PM', '03:30 PM',
//   '04:00 PM', '04:30 PM',
//   '05:00 PM'
// ]

// const serviceTypes = [
//   { id: 'maintenance', name: 'Maintenance', duration: '1h' },
//   { id: 'repair', name: 'Repair', duration: '2h' },
//   { id: 'inspection', name: 'Inspection', duration: '30m' },
//   { id: 'tire-change', name: 'Tire Change', duration: '1h' },
//   { id: 'oil-change', name: 'Oil Change', duration: '45m' },
//   { id: 'battery-replacement', name: 'Battery Replacement', duration: '1h' },
//   { id: 'transmission-replacement', name: 'Transmission Replacement', duration: '1h' },
//   { id: 'brake-replacement', name: 'Brake Replacement', duration: '1h' },
//   { id: 'fuel-injection', name: 'Fuel Injection', duration: '1h' },
//   { id: 'cooling-system', name: 'Cooling System', duration: '1h' },
//   { id: 'engine-tuning', name: 'Engine Tuning', duration: '1h' },
//   { id: 'air-filter', name: 'Air Filter', duration: '1h' },
//   { id: 'wheel-alignment', name: 'Wheel Alignment', duration: '1h' },
//   { id: 'tire-rotation', name: 'Tire Rotation', duration: '1h' },
//   { id: 'transmission-change', name: 'Transmission Change', duration: '1h' },
//   { id: 'battery-change', name: 'Battery Change', duration: '1h' },
//   { id: 'hybrid-system', name: 'Hybrid System', duration: '1h' },
// ]

// const months = [
//   'January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December'
// ]

// export function AppointmentsPage() {
//   const dispatch = useDispatch();
//   const {appointments: appointmentsFromRedux, loading} = useSelector((state) => state.appointment);

//   const [currentDate, setCurrentDate] = useState(new Date())
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
//   const [showBookingModal, setShowBookingModal] = useState(false)
//   const [showMonthSelector, setShowMonthSelector] = useState(false)
//   const [appointments, setAppointments] = useState({})
//   const [editingAppointment, setEditingAppointment] = useState(null)
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
//   const [showAppointmentMenu, setShowAppointmentMenu] = useState(null)
//   const [appointmentForm, setAppointmentForm] = useState({
//     id: null,
//     date: selectedDate,
//     time: '',
//     customerName: '',
//     phone: '',
//     email: '',
//     vehicleNumber: '',
//     vehicleModel: '',
//     serviceType: '',
//     notes: '',
//     status: 'pending',
//   })

//   const today = new Date()
//   const currentYear = currentDate.getFullYear()
//   const currentMonth = currentDate.getMonth()
//   const selectedDateObj = new Date(selectedDate)

//   useEffect(() => {
//     dispatch(getAllAppointments());
//   }, [dispatch]);

//   // Transform backend appointments to calendar format
//   useEffect(() => {
//     if (appointmentsFromRedux && Array.isArray(appointmentsFromRedux)) {
//       const transformedAppointments = {};

//       appointmentsFromRedux.forEach((apt) => {
//         // Format the date from the backend (appointmentDate is ISO string)
//         if (!apt.appointmentDate) return;

//         const dateString = apt.appointmentDate.split('T')[0];

//         if (!transformedAppointments[dateString]) {
//           transformedAppointments[dateString] = [];
//         }

//         // Get the status color based on status
//         let statusColor = 'bg-amber-100 border-amber-200 text-amber-700'; // default/pending
//         if (apt.status === 'accepted') {
//           statusColor = 'bg-green-100 border-green-200 text-green-700';
//         } else if (apt.status === 'rejected') {
//           statusColor = 'bg-red-100 border-red-200 text-red-700';
//         }

//         // Find matching service type or use the service type as-is
//         const serviceTypeId = apt.serviceType?.toLowerCase().replace(/\s+/g, '-') || 'maintenance';
//         const matchingService = serviceTypes.find(s =>
//           s.id === serviceTypeId ||
//           s.name.toLowerCase() === apt.serviceType?.toLowerCase()
//         );

//         transformedAppointments[dateString].push({
//           id: apt._id,
//           time: apt.appointmentTime || '09:00 AM',
//           customer: apt.customerName || 'Unknown Customer',
//           vehicleNumber: apt.vehicleNumber || 'N/A',
//           vehicleModel: apt.vehicleModel || 'N/A',
//           type: serviceTypeId,
//           duration: matchingService ? matchingService.duration : '1h',
//           color: statusColor,
//           phone: apt.customerContactNumber || '',
//           email: apt.email || '',
//           notes: apt.note || '',
//           status: apt.status || 'pending',
//         });
//       });

//       setAppointments(transformedAppointments);
//     }
//   }, [appointmentsFromRedux]);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString('en-US', {
//       weekday: 'long',
//       month: 'long',
//       day: 'numeric',
//       year: 'numeric',
//     })
//   }

//   const formatShortDate = (dateString) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//     })
//   }

//   const getDaysInMonth = (year, month) => {
//     return new Date(year, month + 1, 0).getDate()
//   }

//   const getFirstDayOfMonth = (year, month) => {
//     return new Date(year, month, 1).getDay()
//   }

//   const generateCalendarDays = () => {
//     const daysInMonth = getDaysInMonth(currentYear, currentMonth)
//     const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
//     const days = []

//     for (let i = 0; i < firstDay; i++) {
//       days.push(null)
//     }

//     for (let i = 1; i <= daysInMonth; i++) {
//       days.push(i)
//     }

//     return days
//   }

//   const getDateString = (day) => {
//     return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
//   }

//   const getAppointmentsForDate = (dateString) => {
//     return appointments[dateString] || []
//   }

//   const getAppointmentByTime = (dateString, time) => {
//     const dayAppointments = getAppointmentsForDate(dateString);
//     return dayAppointments.find(app => app.time === time);
//   }

//   const isTimeSlotBooked = (dateString, time) => {
//     const dayAppointments = getAppointmentsForDate(dateString);
//     return dayAppointments.some(app => app.time === time);
//   }

//   const isDayBlocked = (dateString) => {
//     const dayAppointments = getAppointmentsForDate(dateString)
//     return dayAppointments.length >= 8 // Increased limit since we have more time slots
//   }

//   const hasAppointments = (dateString) => {
//     const dayAppointments = getAppointmentsForDate(dateString)
//     return dayAppointments.length > 0
//   }

//   const getAppointmentCount = (dateString) => {
//     const dayAppointments = getAppointmentsForDate(dateString)
//     return dayAppointments.length
//   }

//   const isPastDate = (dateString) => {
//     const date = new Date(dateString)
//     const today = new Date()
//     today.setHours(0, 0, 0, 0)
//     return date < today
//   }

//   const getDayOfWeek = (dateString) => {
//     const date = new Date(dateString)
//     return date.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
//   }

//   const isClosedDay = (dateString) => {
//     const dayOfWeek = getDayOfWeek(dateString)
//     return dayOfWeek === 0 // Sunday is closed
//   }

//   const isSaturday = (dateString) => {
//     const dayOfWeek = getDayOfWeek(dateString)
//     return dayOfWeek === 6 // Saturday
//   }

//   const getAvailableTimeSlots = (dateString) => {
//     const dayOfWeek = getDayOfWeek(dateString)

//     // Sunday - closed
//     if (dayOfWeek === 0) {
//       return []
//     }

//     // Saturday - until 12:00 noon only
//     if (dayOfWeek === 6) {
//       return timeSlots.filter(time => {
//         const hour = parseInt(time.split(':')[0]);
//         const isPM = time.includes('PM');
//         return !isPM || (isPM && hour === 12);
//       });
//     }

//     // Monday to Friday - full day
//     return timeSlots;
//   }

//   const handleDateSelect = (day) => {
//     if (!day) return
//     const dateString = getDateString(day)
//     setSelectedDate(dateString)
//     setShowAppointmentMenu(null)
//   }

//   const handlePrevMonth = () => {
//     setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
//     setShowAppointmentMenu(null)
//   }

//   const handleNextMonth = () => {
//     setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
//     setShowAppointmentMenu(null)
//   }

//   const handleMonthSelect = (monthIndex) => {
//     setCurrentDate(new Date(currentYear, monthIndex, 1))
//     setShowMonthSelector(false)
//     setShowAppointmentMenu(null)
//   }

//   const handleCreateAppointment = (time) => {
//     if (isClosedDay(selectedDate)) {
//       alert('We are closed on Sundays. Please select a weekday.')
//       return
//     }

//     if (isDayBlocked(selectedDate)) {
//       alert('This day is fully booked. Please select another day.')
//       return
//     }

//     if (isPastDate(selectedDate)) {
//       alert('Cannot book appointments for past dates.')
//       return
//     }

//     setAppointmentForm({
//       id: null,
//       date: selectedDate,
//       time,
//       customerName: '',
//       phone: '',
//       email: '',
//       vehicleNumber: '',
//       vehicleModel: '',
//       serviceType: '',
//       notes: '',
//       status: 'pending',
//     })
//     setEditingAppointment(null)
//     setShowBookingModal(true)
//   }

//   const handleEditAppointment = (appointment) => {
//     setAppointmentForm({
//       id: appointment.id,
//       date: selectedDate,
//       time: appointment.time,
//       customerName: appointment.customer,
//       phone: appointment.phone || '',
//       email: appointment.email || '',
//       vehicleNumber: appointment.vehicleNumber,
//       vehicleModel: appointment.vehicleModel,
//       serviceType: appointment.type,
//       notes: appointment.notes || '',
//       status: appointment.status || 'pending',
//     })
//     setEditingAppointment(appointment)
//     setShowBookingModal(true)
//     setShowAppointmentMenu(null)
//   }

//   const handleDeleteAppointment = (appointmentId) => {
//     const dateAppointments = getAppointmentsForDate(selectedDate)
//     const updatedAppointments = dateAppointments.filter(app => app.id !== appointmentId)

//     setAppointments(prev => ({
//       ...prev,
//       [selectedDate]: updatedAppointments
//     }))

//     setShowDeleteConfirm(null)
//     setShowAppointmentMenu(null)
//   }

//   const handleSubmitAppointment = () => {
//     const appointmentData = {
//       id: appointmentForm.id || Date.now(),
//       time: appointmentForm.time,
//       customer: appointmentForm.customerName,
//       vehicleNumber: appointmentForm.vehicleNumber,
//       vehicleModel: appointmentForm.vehicleModel,
//       type: appointmentForm.serviceType,
//       duration: serviceTypes.find(s => s.id === appointmentForm.serviceType)?.duration || '1h',
//       color: getColorForService(appointmentForm.serviceType, appointmentForm.status),
//       phone: appointmentForm.phone,
//       email: appointmentForm.email,
//       notes: appointmentForm.notes,
//       status: appointmentForm.status,
//     }

//     const dateAppointments = getAppointmentsForDate(selectedDate)

//     if (editingAppointment) {
//       // Update existing appointment
//       const updatedAppointments = dateAppointments.map(app =>
//         app.id === editingAppointment.id ? appointmentData : app
//       )

//       setAppointments(prev => ({
//         ...prev,
//         [selectedDate]: updatedAppointments
//       }))
//     } else {
//       // Create new appointment
//       // Check for time slot conflict
//       const timeConflict = dateAppointments.find(app => app.time === appointmentForm.time)
//       if (timeConflict) {
//         alert('This time slot is already booked. Please choose another time.')
//         return
//       }

//       setAppointments(prev => ({
//         ...prev,
//         [selectedDate]: [...dateAppointments, appointmentData]
//       }))
//     }

//     setShowBookingModal(false)
//     setEditingAppointment(null)
//     setAppointmentForm({
//       id: null,
//       date: selectedDate,
//       time: '',
//       customerName: '',
//       phone: '',
//       email: '',
//       vehicleNumber: '',
//       vehicleModel: '',
//       serviceType: '',
//       notes: '',
//       status: 'pending',
//     })
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'accepted':
//         return 'bg-green-50 border-green-200'
//       case 'rejected':
//         return 'bg-red-50 border-red-200'
//       case 'pending':
//       default:
//         return 'bg-amber-50 border-amber-200'
//     }
//   }

//   const getStatusBadgeColor = (status) => {
//     switch (status) {
//       case 'accepted':
//         return 'bg-green-100 text-green-800'
//       case 'rejected':
//         return 'bg-red-100 text-red-800'
//       case 'pending':
//       default:
//         return 'bg-amber-100 text-amber-800'
//     }
//   }

//   const getColorForService = (serviceType, status = 'pending') => {
//     // First check status color
//     switch (status) {
//       case 'accepted':
//         return 'bg-green-100 border-green-200 text-green-700'
//       case 'rejected':
//         return 'bg-red-100 border-red-200 text-red-700'
//       case 'pending':
//       default:
//         // Fall back to service type colors if no specific status
//         switch (serviceType) {
//           case 'maintenance':
//             return 'bg-blue-100 border-blue-200 text-blue-700'
//           case 'repair':
//             return 'bg-orange-100 border-orange-200 text-orange-700'
//           case 'inspection':
//             return 'bg-purple-100 border-purple-200 text-purple-700'
//           case 'emergency':
//             return 'bg-red-100 border-red-200 text-red-700'
//           case 'tire-change':
//             return 'bg-amber-100 border-amber-200 text-amber-700'
//           default:
//             return 'bg-amber-100 border-amber-200 text-amber-700'
//         }
//     }
//   }

//   const selectedDayAppointments = getAppointmentsForDate(selectedDate)
//   const availableTimeSlots = getAvailableTimeSlots(selectedDate)

//   const calendarDays = generateCalendarDays()

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <div className="text-center py-12">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <p className="mt-4 text-gray-600">Loading appointments...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Booking/Edit Modal */}
//       {showBookingModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <Card className="w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl">
//             <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-6 flex justify-between items-start">
//               <div>
//                 <h2 className="text-2xl font-bold text-slate-900">
//                   {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
//                 </h2>
//                 <p className="text-sm text-slate-600 mt-2">
//                   <CalendarDays className="inline h-4 w-4 mr-1" />
//                   {formatDate(appointmentForm.date)} at {appointmentForm.time}
//                 </p>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => {
//                   setShowBookingModal(false)
//                   setEditingAppointment(null)
//                 }}
//                 className="hover:bg-slate-200"
//               >
//                 <X className="h-5 w-5" />
//               </Button>
//             </div>

//             <div className="p-6 space-y-6">
//               {/* Status Section (for editing) */}
//               {editingAppointment && (
//                 <div className={`p-4 rounded-lg border-2 ${getStatusColor(appointmentForm.status)}`}>
//                   <label className="block text-sm font-semibold text-slate-700 mb-3">
//                     Appointment Status
//                   </label>
//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => setAppointmentForm({ ...appointmentForm, status: 'pending' })}
//                       className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${appointmentForm.status === 'pending' ? 'bg-amber-200 text-amber-900 ring-2 ring-amber-400' : 'bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 text-sm'}`}
//                     >
//                       <Clock className="inline h-4 w-4 mr-2 mb-0.5" />
//                       Pending
//                     </button>
//                     <button
//                       onClick={() => setAppointmentForm({ ...appointmentForm, status: 'accepted' })}
//                       className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${appointmentForm.status === 'accepted' ? 'bg-green-200 text-green-900 ring-2 ring-green-400' : 'bg-white border border-green-200 text-green-700 hover:bg-green-50 text-sm'}`}
//                     >
//                       <Check className="inline h-4 w-4 mr-2" />
//                       Accept
//                     </button>
//                     <button
//                       onClick={() => setAppointmentForm({ ...appointmentForm, status: 'rejected' })}
//                       className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${appointmentForm.status === 'rejected' ? 'bg-red-200 text-red-900 ring-2 ring-red-400' : 'bg-white border border-red-200 text-red-700 hover:bg-red-50 text-sm'}`}
//                     >
//                       <X className="inline h-4 w-4 mr-2 mb-0.5" />
//                       Reject
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Customer Information */}
//               <div>
//                 <label className="block text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">
//                   <User className="inline h-4 w-4 mr-2 text-blue-600" />
//                   Customer Information
//                 </label>
//                 <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
//                   <div className="relative">
//                     <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                     <input
//                       type="text"
//                       placeholder="Full Name *"
//                       className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 text-sm"
//                       value={appointmentForm.customerName}
//                       onChange={(e) => setAppointmentForm({ ...appointmentForm, customerName: e.target.value })}
//                     />
//                   </div>
//                   <div className="relative">
//                     <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                     <input
//                       type="tel"
//                       placeholder="Phone Number"
//                       className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 text-sm"
//                       value={appointmentForm.phone}
//                       onChange={(e) => setAppointmentForm({ ...appointmentForm, phone: e.target.value })}
//                     />
//                   </div>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                     <input
//                       type="email"
//                       placeholder="Email Address"
//                       className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 text-sm"
//                       value={appointmentForm.email}
//                       onChange={(e) => setAppointmentForm({ ...appointmentForm, email: e.target.value })}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Vehicle Details */}
//               <div>
//                 <label className="block text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">
//                   <Car className="inline h-4 w-4 mr-2 text-green-600" />
//                   Vehicle Details
//                 </label>
//                 <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
//                   <div className="relative">
//                     <Car className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                     <input
//                       type="text"
//                       placeholder="Vehicle Number *"
//                       className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 text-sm"
//                       value={appointmentForm.vehicleNumber}
//                       onChange={(e) => setAppointmentForm({ ...appointmentForm, vehicleNumber: e.target.value })}
//                     />
//                   </div>
//                   <div className="relative">
//                     <Car className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                     <input
//                       type="text"
//                       placeholder="Vehicle Model *"
//                       className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 text-sm"
//                       value={appointmentForm.vehicleModel}
//                       onChange={(e) => setAppointmentForm({ ...appointmentForm, vehicleModel: e.target.value })}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Service Type */}
//               <div>
//                 <label className="block text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">
//                   <Wrench className="inline h-4 w-4 mr-2 text-orange-600" />
//                   Service Type
//                 </label>
//                 <div className="grid grid-cols-3 gap-2">
//                   {serviceTypes.map((service) => (
//                     <button
//                       key={service.id}
//                       className={`p-3 rounded-lg border-2 text-sm transition-all font-medium ${
//                         appointmentForm.serviceType === service.id
//                           ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-100'
//                           : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
//                       }`}
//                       onClick={() => setAppointmentForm({ ...appointmentForm, serviceType: service.id })}
//                     >
//                       <div className="text-left">{service.name}</div>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Additional Notes */}
//               <div>
//                 <label className="block text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">
//                   <AlertCircle className="inline h-4 w-4 mr-2 text-purple-600" />
//                   Additional Notes
//                 </label>
//                 <textarea
//                   placeholder="Any special instructions, concerns, or customer requests..."
//                   className="w-full px-4 py-3 border text-sm border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 min-h-[100px] resize-none"
//                   value={appointmentForm.notes}
//                   onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
//                 />
//               </div>

//               {/* Action Buttons */}
//               <div className="flex gap-3 pt-6 border-t border-slate-200">
//                 <Button
//                   variant="outline"
//                   className="flex-1 py-2.5"
//                   onClick={() => {
//                     setShowBookingModal(false)
//                     setEditingAppointment(null)
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700"
//                   onClick={handleSubmitAppointment}
//                   disabled={!appointmentForm.customerName || !appointmentForm.vehicleNumber || !appointmentForm.vehicleModel || !appointmentForm.serviceType}
//                 >
//                   {editingAppointment ? 'Update Appointment' : 'Book Appointment'}
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <Card className="w-full max-w-md">
//             <div className="flex flex-col items-center text-center p-6">
//               <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
//                 <AlertCircle className="h-6 w-6 text-red-600" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                 Delete Appointment
//               </h3>
//               <p className="text-sm text-gray-500 mb-6">
//                 Are you sure you want to delete this appointment? This action cannot be undone.
//               </p>
//               <div className="flex gap-3 w-full">
//                 <Button
//                   variant="outline"
//                   className="flex-1"
//                   onClick={() => setShowDeleteConfirm(null)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   className="flex-1"
//                   onClick={() => handleDeleteAppointment(showDeleteConfirm.id)}
//                 >
//                   Delete Appointment
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>
//           <p className="text-sm text-slate-600 mt-1">
//             Manage service bookings and appointment statuses
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             leftIcon={<CalendarIcon className="h-4 w-4" />}
//             className="border-slate-300 text-slate-700 hover:bg-slate-50"
//             onClick={() => setSelectedDate(today.toISOString().split('T')[0])}
//           >
//             Today
//           </Button>
//           <Button
//             leftIcon={<Clock className="h-4 w-4" />}
//             onClick={() => {
//               setAppointmentForm({
//                 id: null,
//                 date: selectedDate,
//                 time: '',
//                 customerName: '',
//                 phone: '',
//                 email: '',
//                 vehicleNumber: '',
//                 vehicleModel: '',
//                 serviceType: '',
//                 notes: '',
//                 status: 'pending',
//               })
//               setShowBookingModal(true)
//             }}
//             className="bg-blue-600 hover:bg-blue-700"
//           >
//             New Appointment
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//         {/* Calendar Sidebar */}
//         <Card className="lg:col-span-1 h-fit">
//           <div className="mb-4 flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className="relative">
//                 <button
//                   onClick={() => setShowMonthSelector(!showMonthSelector)}
//                   className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100"
//                 >
//                   <span className="font-semibold text-gray-900">
//                     {months[currentMonth]} {currentYear}
//                   </span>
//                   {showMonthSelector ? (
//                     <ChevronUp className="h-4 w-4 text-gray-500" />
//                   ) : (
//                     <ChevronDown className="h-4 w-4 text-gray-500" />
//                   )}
//                 </button>

//                 {showMonthSelector && (
//                   <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48 max-h-60 overflow-y-auto">
//                     {months.map((month, index) => (
//                       <button
//                         key={month}
//                         onClick={() => handleMonthSelect(index)}
//                         className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${index === currentMonth ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
//                       >
//                         {month} {currentYear}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="flex gap-1">
//               <button
//                 onClick={handlePrevMonth}
//                 className="rounded-full p-1 hover:bg-gray-100"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </button>
//               <button
//                 onClick={handleNextMonth}
//                 className="rounded-full p-1 hover:bg-gray-100"
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
//             <span className="text-gray-400">Su</span>
//             <span className="text-gray-400">Mo</span>
//             <span className="text-gray-400">Tu</span>
//             <span className="text-gray-400">We</span>
//             <span className="text-gray-400">Th</span>
//             <span className="text-gray-400">Fr</span>
//             <span className="text-gray-400">Sa</span>
//           </div>

//           <div className="grid grid-cols-7 gap-1 text-center text-sm">
//             {calendarDays.map((day, index) => {
//               if (day === null) {
//                 return <div key={`empty-${index}`} className="aspect-square" />
//               }

//               const dateString = getDateString(day)
//               const isBlocked = isDayBlocked(dateString)
//               const hasApps = hasAppointments(dateString)
//               const appCount = getAppointmentCount(dateString)
//               const isSelected = selectedDate === dateString
//               const isPast = isPastDate(dateString)
//               const isClosed = isClosedDay(dateString)
//               const isToday = dateString === today.toISOString().split('T')[0]

//               return (
//                 <button
//                   key={day}
//                   onClick={() => handleDateSelect(day)}
//                   disabled={isBlocked || isPast || isClosed}
//                   className={`aspect-square rounded-full flex flex-col items-center justify-center relative transition-all
//                     ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : ''}
//                     ${!isSelected && !isBlocked && !isPast && !isClosed ? 'hover:bg-gray-50 text-gray-700' : ''}
//                     ${isBlocked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
//                     ${isPast ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : ''}
//                     ${isClosed ? 'bg-red-50 text-red-400 cursor-not-allowed' : ''}
//                     ${isToday && !isSelected ? 'ring-2 ring-blue-200 bg-blue-50' : ''}
//                   `}
//                 >
//                   {day}
//                   {hasApps && !isSelected && (
//                     <div className="absolute -top-1 -right-1">
//                       <div className={`h-5 w-5 rounded-full text-white text-[10px] flex items-center justify-center
//                         ${appCount >= 8 ? 'bg-red-500' : appCount >= 4 ? 'bg-orange-500' : 'bg-blue-500'}`}
//                       >
//                         {appCount}
//                       </div>
//                     </div>
//                   )}
//                   {isBlocked && (
//                     <span className="text-[8px] mt-0.5 font-medium">FULL</span>
//                   )}
//                   {isClosed && !isSelected && (
//                     <span className="text-[8px] mt-0.5 font-medium">CLOSED</span>
//                   )}
//                   {isPast && !isSelected && !isClosed && (
//                     <span className="text-[8px] mt-0.5">PAST</span>
//                   )}
//                 </button>
//               )
//             })}
//           </div>

//           {/* Selected Day Summary */}
//           <div className="mt-6 border-t border-gray-100 pt-4">
//             <div className="flex justify-between items-center mb-3">
//               <div>
//                 <h4 className="text-xs font-semibold uppercase text-gray-500">
//                   Selected Day
//                 </h4>
//                 <p className="font-medium text-gray-900">
//                   {formatDate(selectedDate)}
//                 </p>
//               </div>
//               <Badge variant={isDayBlocked(selectedDate) ? 'destructive' : 'success'}>
//                 {isDayBlocked(selectedDate) ? 'Fully Booked' : `${selectedDayAppointments.length} Booked`}
//               </Badge>
//             </div>

//             {/* Selected Day Appointments */}
//             <div className="space-y-3 mb-4">
//               {selectedDayAppointments.length > 0 ? (
//                 selectedDayAppointments.map((app) => (
//                   <div key={app.id} className="group relative">
//                     <div className={`flex items-start gap-3 p-3 rounded-lg border-l-4 transition-all hover:shadow-md ${app.color}`}>
//                       <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${app.color.split(' ')[0]}`}>
//                         <Wrench className="h-4 w-4" />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 mb-1">
//                           <p className="text-sm font-semibold text-gray-900 truncate">
//                             {app.customer}
//                           </p>
//                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadgeColor(app.status)}`}>
//                             {app.status?.toUpperCase()}
//                           </span>
//                         </div>
//                         <p className="text-xs text-gray-600 truncate">
//                           {app.time} • {app.vehicleNumber}
//                         </p>
//                         <p className="text-xs text-gray-600 truncate">
//                           {app.vehicleModel}
//                         </p>
//                         <p className="text-xs font-medium text-gray-700 truncate mt-0.5">
//                           {serviceTypes.find(s => s.id === app.type)?.name || app.type}
//                         </p>
//                       </div>
//                       <Badge variant="neutral" className="text-xs whitespace-nowrap">
//                         {app.duration}
//                       </Badge>
//                     </div>
//                     <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button
//                         onClick={() => setShowAppointmentMenu(showAppointmentMenu === app.id ? null : app.id)}
//                         className="p-1 hover:bg-gray-300 rounded-full"
//                       >
//                         <MoreVertical className="h-4 w-4 text-gray-600" />
//                       </button>
//                       {showAppointmentMenu === app.id && (
//                         <div className="absolute right-0 top-8 bg-white border border-gray-300 rounded-lg shadow-lg z-10 w-48">
//                           <button
//                             onClick={() => handleEditAppointment(app)}
//                             className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2"
//                           >
//                             <Edit className="h-4 w-4 text-blue-600" />
//                             Edit Appointment
//                           </button>
//                           <button
//                             onClick={() => {
//                               setShowDeleteConfirm({ id: app.id, customer: app.customer })
//                               setShowAppointmentMenu(null)
//                             }}
//                             className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                             Delete Appointment
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
//                   <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                   <p className="text-sm font-medium">No appointments for this day</p>
//                   <p className="text-xs mt-1">Click on a time slot to book</p>
//                 </div>
//               )}
//             </div>

//             {/* Quick Stats */}
//             <div className="grid grid-cols-3 gap-2 text-xs">
//               <div className="bg-blue-50 p-2 rounded text-center">
//                 <div className="font-semibold text-blue-700">
//                   {selectedDayAppointments.filter(a => a.status === 'pending').length}
//                 </div>
//                 <div className="text-blue-600">Pending</div>
//               </div>
//               <div className="bg-green-50 p-2 rounded text-center">
//                 <div className="font-semibold text-green-700">
//                   {selectedDayAppointments.filter(a => a.status === 'accepted').length}
//                 </div>
//                 <div className="text-green-600">Accepted</div>
//               </div>
//               <div className="bg-red-50 p-2 rounded text-center">
//                 <div className="font-semibold text-red-700">
//                   {selectedDayAppointments.filter(a => a.status === 'rejected').length}
//                 </div>
//                 <div className="text-red-600">Rejected</div>
//               </div>
//             </div>
//           </div>
//         </Card>

//         {/* Daily Schedule */}
//         <Card className="lg:col-span-2 border-2 border-slate-200 shadow-lg">
//           <div className="p-6">
//             <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
//               <div>
//                 <h2 className="text-xl font-bold text-slate-900">
//                   Schedule for {formatDate(selectedDate)}
//                 </h2>
//                 <p className="text-sm text-slate-700 font-medium mt-1">
//                   <Info className="inline h-4 w-4 mr-1 text-blue-600" />
//                   Click on an appointment to edit or delete
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Badge variant="outline" className="border-slate-300 bg-slate-50 text-slate-700 font-semibold">
//                   {selectedDayAppointments.length} appointment(s)
//                 </Badge>
//                 <Button
//                   size="sm"
//                   leftIcon={<Plus className="h-3 w-3" />}
//                   onClick={() => {
//                     if (isDayBlocked(selectedDate)) {
//                       alert('This day is fully booked. Please select another day.')
//                       return
//                     }
//                     if (isPastDate(selectedDate)) {
//                       alert('Cannot book appointments for past dates.')
//                       return
//                     }
//                     setAppointmentForm({
//                       id: null,
//                       date: selectedDate,
//                       time: '',
//                       customerName: '',
//                       phone: '',
//                       email: '',
//                       vehicleNumber: '',
//                       vehicleModel: '',
//                       serviceType: '',
//                       notes: '',
//                       status: 'pending',
//                     })
//                     setShowBookingModal(true)
//                   }}
//                   disabled={isDayBlocked(selectedDate) || isPastDate(selectedDate) || isClosedDay(selectedDate)}
//                   className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
//                 >
//                   Book Slot
//                 </Button>
//               </div>
//             </div>

//             <div className="space-y-4">
//               {availableTimeSlots.map((time) => {
//                 const appointment = getAppointmentByTime(selectedDate, time);
//                 const isBooked = isTimeSlotBooked(selectedDate, time);
//                 const isPast = isPastDate(selectedDate);
//                 const isClosed = isClosedDay(selectedDate);

//                 return (
//                   <div key={time} className="flex gap-4 group">
//                     <div className="w-24 flex-shrink-0 text-right">
//                       <div className="text-sm font-medium text-gray-900">{time}</div>
//                       <div className="text-xs text-gray-500">
//                         {isBooked ? 'Booked' : isClosed ? 'Closed' : 'Available'}
//                       </div>
//                     </div>
//                     <div className="flex-1 min-h-[3rem] relative">
//                       <div className="absolute inset-0 border-t border-gray-100 -z-10 top-3.5"></div>

//                       {isBooked && appointment ? (
//                         <div
//                           className={`rounded-lg border-2 p-4 shadow-sm transition-all hover:shadow-md cursor-pointer relative group/appointment ${appointment.color}`}
//                           onClick={() => handleEditAppointment(appointment)}
//                         >
//                           <div className="flex justify-between items-start gap-2">
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-center gap-2 mb-1">
//                                 <span className="font-bold text-sm">
//                                   {appointment.customer}
//                                 </span>
//                                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadgeColor(appointment.status)}`}>
//                                   {appointment.status?.toUpperCase()}
//                                 </span>
//                               </div>
//                               <div className="text-xs text-gray-700 space-y-0.5">
//                                 <p className="font-semibold">
//                                   {appointment.vehicleNumber} • {appointment.vehicleModel}
//                                 </p>
//                                 <p className="opacity-75">
//                                   {appointment.time} • Duration: {appointment.duration}
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="flex items-center gap-2 flex-shrink-0">
//                               <Badge
//                                 variant="neutral"
//                                 className="bg-white/50 border-transparent text-current text-[10px] whitespace-nowrap"
//                               >
//                                 {serviceTypes.find(s => s.id === appointment.type)?.name || appointment.type}
//                               </Badge>
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   setShowAppointmentMenu(showAppointmentMenu === appointment.id ? null : appointment.id)
//                                 }}
//                                 className="p-1 hover:bg-white/40 rounded opacity-0 group-hover/appointment:opacity-100"
//                               >
//                                 <MoreVertical className="h-4 w-4" />
//                               </button>
//                             </div>
//                           </div>
//                           {appointment.notes && (
//                             <div className="mt-2 text-xs text-gray-700 truncate bg-white/40 px-2 py-1 rounded">
//                               📝 {appointment.notes}
//                             </div>
//                           )}
//                           {showAppointmentMenu === appointment.id && (
//                             <div className="absolute right-2 top-12 bg-white border border-gray-300 rounded-lg shadow-lg z-10 w-48">
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   handleEditAppointment(appointment)
//                                 }}
//                                 className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2 font-medium border-b border-gray-200"
//                               >
//                                 <Edit className="h-4 w-4 text-blue-600" />
//                                 Edit Appointment
//                               </button>
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   setShowDeleteConfirm({ id: appointment.id, customer: appointment.customer })
//                                   setShowAppointmentMenu(null)
//                                 }}
//                                 className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                                 Delete
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => handleCreateAppointment(time)}
//                           disabled={isPast || isClosed}
//                           className={`h-full w-full rounded-lg transition-colors cursor-pointer border-2 border-dashed flex items-center justify-center
//                             ${isPast || isClosed ? 'cursor-not-allowed opacity-40 border-gray-300' : 'opacity-0 group-hover:opacity-100 hover:bg-blue-50 hover:border-blue-300 border-slate-300'}
//                           `}
//                         >
//                           {isPast ? (
//                             <span className="text-xs text-gray-500 font-semibold">Past Date</span>
//                           ) : isClosed ? (
//                             <span className="text-xs text-red-500 font-semibold">Closed</span>
//                           ) : (
//                             <Plus className="h-4 w-4 text-slate-400" />
//                           )}
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>

//             {/* No appointments message */}
//             {selectedDayAppointments.length === 0 && availableTimeSlots.length > 0 && (
//               <div className="text-center py-12 text-gray-500">
//                 <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                 <p className="text-lg font-medium">No appointments scheduled for this day</p>
//                 <p className="text-sm mt-2">Click "Book Slot" to add an appointment</p>
//               </div>
//             )}

//             {/* No time slots available (Sunday/closed) */}
//             {availableTimeSlots.length === 0 && (
//               <div className="text-center py-12 text-gray-500">
//                 <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                 <p className="text-lg font-medium">We are closed on Sundays</p>
//                 <p className="text-sm mt-2">Please select a weekday to book appointments</p>
//               </div>
//             )}

//             {/* Appointment Actions Info */}
//             <div className="mt-8 pt-6 border-t border-slate-200">
//               <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">Quick Actions</p>
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                   <div className="p-1.5 bg-blue-200 rounded">
//                     <Edit className="h-4 w-4 text-blue-700" />
//                   </div>
//                   <div>
//                     <p className="text-xs font-semibold text-blue-900">Click appointment</p>
//                     <p className="text-xs text-blue-700">to edit details</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
//                   <div className="p-1.5 bg-red-200 rounded">
//                     <Trash2 className="h-4 w-4 text-red-700" />
//                   </div>
//                   <div>
//                     <p className="text-xs font-semibold text-red-900">Click menu icon</p>
//                     <p className="text-xs text-red-700">to delete</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Card>
//       </div>
//     </div>
//   )
// }

// import React, { useState, useEffect } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Calendar as CalendarIcon,
//   Clock,
//   Wrench,
//   Plus,
//   X,
//   User,
//   Car,
//   Phone,
//   Mail,
//   CalendarDays,
//   ChevronUp,
//   ChevronDown,
//   Edit,
//   Trash2,
//   MoreVertical,
//   Check,
//   AlertCircle,
//   Info,
//   Search,
//   UserPlus,
//   Loader2,
// } from "lucide-react";
// import { Card } from "../../components/ui/Card";
// import { Button } from "../../components/ui/Button";
// import { Badge } from "../../components/ui/Badge";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getAllAppointments,
//   createAppointment,
//   updateAppointment,
//   deleteAppointment,
// } from "../../features/appointmentSlice";
// import { getAllCustomers, createCustomer } from "../../features/customerSlice";

// const timeSlots = [
//   "08:00 AM",
//   "08:30 AM",
//   "09:00 AM",
//   "09:30 AM",
//   "10:00 AM",
//   "10:30 AM",
//   "11:00 AM",
//   "11:30 AM",
//   "12:00 PM",
//   "12:30 PM",
//   "01:00 PM",
//   "01:30 PM",
//   "02:00 PM",
//   "02:30 PM",
//   "03:00 PM",
//   "03:30 PM",
//   "04:00 PM",
//   "04:30 PM",
//   "05:00 PM",
// ];

// const serviceTypes = [
//   { id: "maintenance", name: "Maintenance", duration: "1h" },
//   { id: "repair", name: "Repair", duration: "2h" },
//   { id: "inspection", name: "Inspection", duration: "30m" },
//   { id: "tire-change", name: "Tire Change", duration: "1h" },
//   { id: "oil-change", name: "Oil Change", duration: "45m" },
//   { id: "battery-replacement", name: "Battery Replacement", duration: "1h" },
//   {
//     id: "transmission-replacement",
//     name: "Transmission Replacement",
//     duration: "1h",
//   },
//   { id: "brake-replacement", name: "Brake Replacement", duration: "1h" },
//   { id: "fuel-injection", name: "Fuel Injection", duration: "1h" },
//   { id: "cooling-system", name: "Cooling System", duration: "1h" },
//   { id: "engine-tuning", name: "Engine Tuning", duration: "1h" },
//   { id: "air-filter", name: "Air Filter", duration: "1h" },
//   { id: "wheel-alignment", name: "Wheel Alignment", duration: "1h" },
//   { id: "tire-rotation", name: "Tire Rotation", duration: "1h" },
//   { id: "transmission-change", name: "Transmission Change", duration: "1h" },
//   { id: "battery-change", name: "Battery Change", duration: "1h" },
//   { id: "hybrid-system", name: "Hybrid System", duration: "1h" },
// ];

// const months = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];

// export function AppointmentsPage() {
//   const dispatch = useDispatch();
//   // Replace your existing useSelector calls with these
//   const {
//     appointments: appointmentsFromRedux,
//     loading: appointmentsLoading,
//     creating: appointmentCreating,
//     updating: appointmentUpdating,
//     deleting: appointmentDeleting,
//   } = useSelector((state) => state.appointment);

//   const { customers: customersFromRedux, loading: customersLoading } =
//     useSelector((state) => state.customer);

//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );
//   const [showBookingModal, setShowBookingModal] = useState(false);
//   const [showMonthSelector, setShowMonthSelector] = useState(false);
//   const [appointments, setAppointments] = useState({});
//   const [editingAppointment, setEditingAppointment] = useState(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
//   const [showAppointmentMenu, setShowAppointmentMenu] = useState(null);

//   // New states for customer management
//   const [showCustomerModal, setShowCustomerModal] = useState(false);
//   const [customerSearch, setCustomerSearch] = useState("");
//   const [filteredCustomers, setFilteredCustomers] = useState([]);

//   // Appointment form state (updated to include customerId)
//   // Replace your existing appointmentForm state with this
//   const [appointmentForm, setAppointmentForm] = useState({
//     id: null,
//     date: selectedDate,
//     time: "",
//     customerId: "",
//     customerName: "",
//     customerContactNumber: "",
//     email: "",
//     vehicleNumber: "",
//     vehicleModel: "",
//     serviceType: "",
//     notes: "",
//     status: "pending",
//   });

//   // Customer form state
//   // Add this to your existing state
//   const [customerForm, setCustomerForm] = useState({
//     name: "",
//     contactNumber: "",
//     email: "",
//     address: "",
//   });

//   const today = new Date();
//   const currentYear = currentDate.getFullYear();
//   const currentMonth = currentDate.getMonth();
//   const selectedDateObj = new Date(selectedDate);

//   // Load appointments on component mount
//   useEffect(() => {
//     dispatch(getAllAppointments());
//   }, [dispatch]);

//   // Load customers when booking modal opens
//   // Add this useEffect to load customers when modal opens
//   useEffect(() => {
//     if (showBookingModal) {
//       dispatch(getAllCustomers());
//     }
//   }, [showBookingModal, dispatch]);

//   // Filter customers based on search
//   // Add this useEffect after your existing useEffect hooks
//   useEffect(() => {
//     if (customerSearch.trim() === "") {
//       setFilteredCustomers(customersFromRedux || []);
//     } else {
//       const filtered = (customersFromRedux || []).filter(
//         (customer) =>
//           customer.name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
//           customer.contactNumber?.includes(customerSearch) ||
//           customer.email?.toLowerCase().includes(customerSearch.toLowerCase())
//       );
//       setFilteredCustomers(filtered);
//     }
//   }, [customerSearch, customersFromRedux]);

//   // Transform backend appointments to calendar format
//   useEffect(() => {
//     if (appointmentsFromRedux && Array.isArray(appointmentsFromRedux)) {
//       const transformedAppointments = {};

//       appointmentsFromRedux.forEach((apt) => {
//         if (!apt.appointmentDate) return;

//         const dateString = apt.appointmentDate.split("T")[0];

//         if (!transformedAppointments[dateString]) {
//           transformedAppointments[dateString] = [];
//         }

//         let statusColor = "bg-amber-100 border-amber-200 text-amber-700";
//         if (apt.status === "accepted") {
//           statusColor = "bg-green-100 border-green-200 text-green-700";
//         } else if (apt.status === "rejected") {
//           statusColor = "bg-red-100 border-red-200 text-red-700";
//         }

//         const serviceTypeId =
//           apt.serviceType?.toLowerCase().replace(/\s+/g, "-") || "maintenance";
//         const matchingService = serviceTypes.find(
//           (s) =>
//             s.id === serviceTypeId ||
//             s.name.toLowerCase() === apt.serviceType?.toLowerCase()
//         );

//         transformedAppointments[dateString].push({
//           id: apt._id,
//           time: apt.appointmentTime || "09:00 AM",
//           customer: apt.customerName || "Unknown Customer",
//           customerId: apt.customerId,
//           vehicleNumber: apt.vehicleNumber || "N/A",
//           vehicleModel: apt.vehicleModel || "N/A",
//           type: serviceTypeId,
//           duration: matchingService ? matchingService.duration : "1h",
//           color: statusColor,
//           phone: apt.customerContactNumber || "",
//           email: apt.email || "",
//           notes: apt.note || "",
//           status: apt.status || "pending",
//         });
//       });

//       setAppointments(transformedAppointments);
//     }
//   }, [appointmentsFromRedux]);

//   // Format functions
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       weekday: "long",
//       month: "long",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const formatShortDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const getDaysInMonth = (year, month) => {
//     return new Date(year, month + 1, 0).getDate();
//   };

//   const getFirstDayOfMonth = (year, month) => {
//     return new Date(year, month, 1).getDay();
//   };

//   const generateCalendarDays = () => {
//     const daysInMonth = getDaysInMonth(currentYear, currentMonth);
//     const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
//     const days = [];

//     for (let i = 0; i < firstDay; i++) {
//       days.push(null);
//     }

//     for (let i = 1; i <= daysInMonth; i++) {
//       days.push(i);
//     }

//     return days;
//   };

//   const getDateString = (day) => {
//     return `${currentYear}-${String(currentMonth + 1).padStart(
//       2,
//       "0"
//     )}-${String(day).padStart(2, "0")}`;
//   };

//   const getAppointmentsForDate = (dateString) => {
//     return appointments[dateString] || [];
//   };

//   const getAppointmentByTime = (dateString, time) => {
//     const dayAppointments = getAppointmentsForDate(dateString);
//     return dayAppointments.find((app) => app.time === time);
//   };

//   const isTimeSlotBooked = (dateString, time) => {
//     const dayAppointments = getAppointmentsForDate(dateString);
//     return dayAppointments.some((app) => app.time === time);
//   };

//   const isDayBlocked = (dateString) => {
//     const dayAppointments = getAppointmentsForDate(dateString);
//     return dayAppointments.length >= 8;
//   };

//   const hasAppointments = (dateString) => {
//     const dayAppointments = getAppointmentsForDate(dateString);
//     return dayAppointments.length > 0;
//   };

//   const getAppointmentCount = (dateString) => {
//     const dayAppointments = getAppointmentsForDate(dateString);
//     return dayAppointments.length;
//   };

//   const isPastDate = (dateString) => {
//     const date = new Date(dateString);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return date < today;
//   };

//   const getDayOfWeek = (dateString) => {
//     const date = new Date(dateString);
//     return date.getDay();
//   };

//   const isClosedDay = (dateString) => {
//     const dayOfWeek = getDayOfWeek(dateString);
//     return dayOfWeek === 0;
//   };

//   const isSaturday = (dateString) => {
//     const dayOfWeek = getDayOfWeek(dateString);
//     return dayOfWeek === 6;
//   };

//   const getAvailableTimeSlots = (dateString) => {
//     const dayOfWeek = getDayOfWeek(dateString);

//     if (dayOfWeek === 0) {
//       return [];
//     }

//     if (dayOfWeek === 6) {
//       return timeSlots.filter((time) => {
//         const hour = parseInt(time.split(":")[0]);
//         const isPM = time.includes("PM");
//         return !isPM || (isPM && hour === 12);
//       });
//     }

//     return timeSlots;
//   };

//   const handleDateSelect = (day) => {
//     if (!day) return;
//     const dateString = getDateString(day);
//     setSelectedDate(dateString);
//     setShowAppointmentMenu(null);
//   };

//   const handlePrevMonth = () => {
//     setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
//     setShowAppointmentMenu(null);
//   };

//   const handleNextMonth = () => {
//     setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
//     setShowAppointmentMenu(null);
//   };

//   const handleMonthSelect = (monthIndex) => {
//     setCurrentDate(new Date(currentYear, monthIndex, 1));
//     setShowMonthSelector(false);
//     setShowAppointmentMenu(null);
//   };

//   const handleCreateAppointment = (time) => {
//     if (isClosedDay(selectedDate)) {
//       alert("We are closed on Sundays. Please select a weekday.");
//       return;
//     }

//     if (isDayBlocked(selectedDate)) {
//       alert("This day is fully booked. Please select another day.");
//       return;
//     }

//     if (isPastDate(selectedDate)) {
//       alert("Cannot book appointments for past dates.");
//       return;
//     }

//     setAppointmentForm({
//       id: null,
//       date: selectedDate,
//       time,
//       customerId: "",
//       customerName: "",
//       customerContactNumber: "",
//       email: "",
//       vehicleNumber: "",
//       vehicleModel: "",
//       serviceType: "",
//       notes: "",
//       status: "pending",
//     });
//     setEditingAppointment(null);
//     setShowBookingModal(true);
//   };

//   // Replace your existing handleEditAppointment with this
// const handleEditAppointment = (appointment) => {
//   setAppointmentForm({
//     id: appointment.id,
//     date: selectedDate,
//     time: appointment.time,
//     customerId: appointment.customerId || '',
//     customerName: appointment.customer,
//     customerContactNumber: appointment.phone || '',
//     email: appointment.email || '',
//     vehicleNumber: appointment.vehicleNumber,
//     vehicleModel: appointment.vehicleModel,
//     serviceType: appointment.type,
//     notes: appointment.notes || '',
//     status: appointment.status || 'pending',
//   })
//   setEditingAppointment(appointment)
//   setShowBookingModal(true)
//   setShowAppointmentMenu(null)
// }

//   // Replace your existing handleDeleteAppointment with this
// const handleDeleteAppointment = (appointmentId) => {
//   dispatch(deleteAppointment(appointmentId))
//     .unwrap()
//     .then(() => {
//       setShowDeleteConfirm(null)
//       setShowAppointmentMenu(null)
//     })
//     .catch((error) => {
//       alert('Failed to delete appointment: ' + error.message)
//     })
// }

//   // Replace your existing handleSubmitAppointment with this
//   const handleSubmitAppointment = () => {
//     if (!appointmentForm.customerId) {
//       alert("Please select or register a customer first.");
//       return;
//     }

//     if (
//       !appointmentForm.vehicleNumber ||
//       !appointmentForm.vehicleModel ||
//       !appointmentForm.serviceType
//     ) {
//       alert(
//         "Please fill in all required fields: Vehicle Number, Vehicle Model, and Service Type."
//       );
//       return;
//     }

//     const appointmentData = {
//       customerId: appointmentForm.customerId,
//       customerName: appointmentForm.customerName,
//       customerContactNumber: appointmentForm.customerContactNumber,
//       appointmentDate: appointmentForm.date,
//       appointmentTime: appointmentForm.time,
//       vehicleNumber: appointmentForm.vehicleNumber,
//       vehicleModel: appointmentForm.vehicleModel,
//       serviceType: appointmentForm.serviceType,
//       status: appointmentForm.status,
//       note: appointmentForm.notes,
//     };

//     if (editingAppointment) {
//       // Update existing appointment
//       dispatch(
//         updateAppointment({ id: editingAppointment.id, ...appointmentData })
//       )
//         .unwrap()
//         .then(() => {
//           setShowBookingModal(false);
//           setEditingAppointment(null);
//           resetAppointmentForm();
//         })
//         .catch((error) => {
//           alert("Failed to update appointment: " + error.message);
//         });
//     } else {
//       // Create new appointment
//       // Check for time slot conflict on the selected date
//       const dateAppointments = getAppointmentsForDate(selectedDate);
//       const timeConflict = dateAppointments.find(
//         (app) => app.time === appointmentForm.time
//       );
//       if (timeConflict) {
//         alert("This time slot is already booked. Please choose another time.");
//         return;
//       }

//       dispatch(createAppointment(appointmentData))
//         .unwrap()
//         .then(() => {
//           setShowBookingModal(false);
//           resetAppointmentForm();
//         })
//         .catch((error) => {
//           alert("Failed to create appointment: " + error.message);
//         });
//     }
//   };

//   // Add this function after handleCustomerSelect
//   const handleRegisterCustomer = () => {
//     if (!customerForm.name || !customerForm.contactNumber) {
//       alert("Please fill in at least name and contact number.");
//       return;
//     }

//     dispatch(createCustomer(customerForm))
//       .unwrap()
//       .then((newCustomer) => {
//         // Update appointment form with new customer
//         setAppointmentForm({
//           ...appointmentForm,
//           customerId: newCustomer._id,
//           customerName: newCustomer.name,
//           customerContactNumber: newCustomer.contactNumber,
//           email: newCustomer.email || "",
//         });

//         // Close customer modal and reset form
//         setShowCustomerModal(false);
//         setCustomerForm({
//           name: "",
//           contactNumber: "",
//           email: "",
//           address: "",
//         });
//       })
//       .catch((error) => {
//         alert("Failed to register customer: " + error.message);
//       });
//   };

//   const resetAppointmentForm = () => {
//     setAppointmentForm({
//       id: null,
//       date: selectedDate,
//       time: "",
//       customerId: "",
//       customerName: "",
//       customerContactNumber: "",
//       email: "",
//       vehicleNumber: "",
//       vehicleModel: "",
//       serviceType: "",
//       notes: "",
//       status: "pending",
//     });
//   };

//   // Add this function after your other handler functions
//   const handleCustomerSelect = (customer) => {
//     setAppointmentForm({
//       ...appointmentForm,
//       customerId: customer._id,
//       customerName: customer.name,
//       customerContactNumber: customer.contactNumber,
//       email: customer.email || "",
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "accepted":
//         return "bg-green-50 border-green-200";
//       case "rejected":
//         return "bg-red-50 border-red-200";
//       case "pending":
//       default:
//         return "bg-amber-50 border-amber-200";
//     }
//   };

//   const getStatusBadgeColor = (status) => {
//     switch (status) {
//       case "accepted":
//         return "bg-green-100 text-green-800";
//       case "rejected":
//         return "bg-red-100 text-red-800";
//       case "pending":
//       default:
//         return "bg-amber-100 text-amber-800";
//     }
//   };

//   const getColorForService = (serviceType, status = "pending") => {
//     switch (status) {
//       case "accepted":
//         return "bg-green-100 border-green-200 text-green-700";
//       case "rejected":
//         return "bg-red-100 border-red-200 text-red-700";
//       case "pending":
//       default:
//         switch (serviceType) {
//           case "maintenance":
//             return "bg-blue-100 border-blue-200 text-blue-700";
//           case "repair":
//             return "bg-orange-100 border-orange-200 text-orange-700";
//           case "inspection":
//             return "bg-purple-100 border-purple-200 text-purple-700";
//           default:
//             return "bg-amber-100 border-amber-200 text-amber-700";
//         }
//     }
//   };

//   const selectedDayAppointments = getAppointmentsForDate(selectedDate);
//   const availableTimeSlots = getAvailableTimeSlots(selectedDate);
//   const calendarDays = generateCalendarDays();

//   if (appointmentsLoading) {
//   return (
//     <div className="space-y-6">
//       <div className="text-center py-12">
//         <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         <p className="mt-4 text-gray-600">Loading appointments...</p>
//       </div>
//     </div>
//   )
// }

//   return (
//     <div className="space-y-6">
//       {/* Booking/Edit Modal */}
//       {showBookingModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <Card className="w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl">
//             <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-6 flex justify-between items-start">
//               <div>
//                 <h2 className="text-2xl font-bold text-slate-900">
//                   {editingAppointment ? "Edit Appointment" : "New Appointment"}
//                 </h2>
//                 <p className="text-sm text-slate-600 mt-2">
//                   <CalendarDays className="inline h-4 w-4 mr-1" />
//                   {formatDate(appointmentForm.date)} at {appointmentForm.time}
//                 </p>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => {
//                   setShowBookingModal(false);
//                   setEditingAppointment(null);
//                   resetAppointmentForm();
//                 }}
//                 className="hover:bg-slate-200"
//               >
//                 <X className="h-5 w-5" />
//               </Button>
//             </div>

//             <div className="p-6 space-y-6">
//               {/* Status Section (for editing) */}
//               {editingAppointment && (
//                 <div
//                   className={`p-4 rounded-lg border-2 ${getStatusColor(
//                     appointmentForm.status
//                   )}`}
//                 >
//                   <label className="block text-sm font-semibold text-slate-700 mb-3">
//                     Appointment Status
//                   </label>
//                   <div className="flex gap-3">
//                     <button
//                       onClick={() =>
//                         setAppointmentForm({
//                           ...appointmentForm,
//                           status: "pending",
//                         })
//                       }
//                       className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
//                         appointmentForm.status === "pending"
//                           ? "bg-amber-200 text-amber-900 ring-2 ring-amber-400"
//                           : "bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 text-sm"
//                       }`}
//                     >
//                       <Clock className="inline h-4 w-4 mr-2 mb-0.5" />
//                       Pending
//                     </button>
//                     <button
//                       onClick={() =>
//                         setAppointmentForm({
//                           ...appointmentForm,
//                           status: "accepted",
//                         })
//                       }
//                       className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
//                         appointmentForm.status === "accepted"
//                           ? "bg-green-200 text-green-900 ring-2 ring-green-400"
//                           : "bg-white border border-green-200 text-green-700 hover:bg-green-50 text-sm"
//                       }`}
//                     >
//                       <Check className="inline h-4 w-4 mr-2" />
//                       Accept
//                     </button>
//                     <button
//                       onClick={() =>
//                         setAppointmentForm({
//                           ...appointmentForm,
//                           status: "rejected",
//                         })
//                       }
//                       className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
//                         appointmentForm.status === "rejected"
//                           ? "bg-red-200 text-red-900 ring-2 ring-red-400"
//                           : "bg-white border border-red-200 text-red-700 hover:bg-red-50 text-sm"
//                       }`}
//                     >
//                       <X className="inline h-4 w-4 mr-2 mb-0.5" />
//                       Reject
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Customer Selection */}
//               <div>
//                 <label className="block text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">
//                   <User className="inline h-4 w-4 mr-2 text-blue-600" />
//                   Customer Selection
//                 </label>
//                 <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
//                   {/* Customer Search */}
//                   <div className="relative">
//                     <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                     <input
//                       type="text"
//                       placeholder="Search customers by name, phone, or email..."
//                       className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 text-sm"
//                       value={customerSearch}
//                       onChange={(e) => setCustomerSearch(e.target.value)}
//                     />
//                   </div>

//                   {/* Customers List */}
//                   <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg bg-white">
//                     {customersLoading ? (
//                       <div className="p-4 text-center">
//                         <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
//                         <p className="text-sm text-slate-600 mt-2">
//                           Loading customers...
//                         </p>
//                       </div>
//                     ) : filteredCustomers.length === 0 ? (
//                       <div className="p-4 text-center text-slate-500">
//                         <p className="text-sm">No customers found</p>
//                         <p className="text-xs mt-1">
//                           Register a new customer to continue
//                         </p>
//                       </div>
//                     ) : (
//                       filteredCustomers.map((customer) => (
//                         <div
//                           key={customer._id}
//                           className={`p-3 border-b border-slate-100 last:border-b-0 cursor-pointer transition-colors hover:bg-blue-50 ${
//                             appointmentForm.customerId === customer._id
//                               ? "bg-blue-100 border-l-4 border-l-blue-500"
//                               : ""
//                           }`}
//                           onClick={() => handleCustomerSelect(customer)}
//                         >
//                           <div className="flex items-center justify-between">
//                             <div>
//                               <p className="font-medium text-slate-900">
//                                 {customer.name}
//                               </p>
//                               <p className="text-xs text-slate-600">
//                                 📞 {customer.contactNumber}
//                                 {customer.email && ` • ✉️ ${customer.email}`}
//                               </p>
//                             </div>
//                             {appointmentForm.customerId === customer._id && (
//                               <Check className="h-5 w-5 text-blue-600" />
//                             )}
//                           </div>
//                         </div>
//                       ))
//                     )}
//                   </div>

//                   {/* Register New Customer Button */}
//                   <div className="pt-2">
//                     <Button
//                       type="button"
//                       variant="outline"
//                       leftIcon={<UserPlus className="h-4 w-4" />}
//                       onClick={() => setShowCustomerModal(true)}
//                       className="w-full hover:bg-blue-50 hover:border-blue-300"
//                     >
//                       Register New Customer
//                     </Button>
//                   </div>

//                   {/* Selected Customer Display */}
//                   {appointmentForm.customerId && (
//                     <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm font-semibold text-blue-900">
//                             {appointmentForm.customerName}
//                           </p>
//                           <p className="text-xs text-blue-700">
//                             Phone: {appointmentForm.customerContactNumber}
//                             {appointmentForm.email &&
//                               ` • Email: ${appointmentForm.email}`}
//                           </p>
//                         </div>
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => {
//                             setAppointmentForm({
//                               ...appointmentForm,
//                               customerId: "",
//                               customerName: "",
//                               customerContactNumber: "",
//                               email: "",
//                             });
//                           }}
//                           className="text-xs h-7 px-2"
//                         >
//                           Change
//                         </Button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Vehicle Details */}
//               <div>
//                 <label className="block text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">
//                   <Car className="inline h-4 w-4 mr-2 text-green-600" />
//                   Vehicle Details
//                 </label>
//                 <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
//                   <div className="relative">
//                     <Car className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                     <input
//                       type="text"
//                       placeholder="Vehicle Number *"
//                       className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 text-sm"
//                       value={appointmentForm.vehicleNumber}
//                       onChange={(e) =>
//                         setAppointmentForm({
//                           ...appointmentForm,
//                           vehicleNumber: e.target.value,
//                         })
//                       }
//                       required
//                     />
//                   </div>
//                   <div className="relative">
//                     <Car className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                     <input
//                       type="text"
//                       placeholder="Vehicle Model *"
//                       className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 text-sm"
//                       value={appointmentForm.vehicleModel}
//                       onChange={(e) =>
//                         setAppointmentForm({
//                           ...appointmentForm,
//                           vehicleModel: e.target.value,
//                         })
//                       }
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Service Type */}
//               <div>
//                 <label className="block text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">
//                   <Wrench className="inline h-4 w-4 mr-2 text-orange-600" />
//                   Service Type
//                 </label>
//                 <div className="grid grid-cols-3 gap-2">
//                   {serviceTypes.map((service) => (
//                     <button
//                       key={service.id}
//                       type="button"
//                       className={`p-3 rounded-lg border-2 text-sm transition-all font-medium ${
//                         appointmentForm.serviceType === service.id
//                           ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-100"
//                           : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
//                       }`}
//                       onClick={() =>
//                         setAppointmentForm({
//                           ...appointmentForm,
//                           serviceType: service.id,
//                         })
//                       }
//                     >
//                       <div className="text-left">{service.name}</div>
//                       <div className="text-xs text-slate-500 mt-1">
//                         {service.duration}
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Additional Notes */}
//               <div>
//                 <label className="block text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">
//                   <AlertCircle className="inline h-4 w-4 mr-2 text-purple-600" />
//                   Additional Notes
//                 </label>
//                 <textarea
//                   placeholder="Any special instructions, concerns, or customer requests..."
//                   className="w-full px-4 py-3 border text-sm border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 min-h-[100px] resize-none"
//                   value={appointmentForm.notes}
//                   onChange={(e) =>
//                     setAppointmentForm({
//                       ...appointmentForm,
//                       notes: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               {/* Action Buttons */}
//               <div className="flex gap-3 pt-6 border-t border-slate-200">
//                 <Button
//                   variant="outline"
//                   className="flex-1 py-2.5"
//                   onClick={() => {
//                     setShowBookingModal(false);
//                     setEditingAppointment(null);
//                     resetAppointmentForm();
//                   }}
//                   disabled={appointmentCreating || appointmentUpdating}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700"
//                   onClick={handleSubmitAppointment}
//                   disabled={
//                     !appointmentForm.customerId ||
//                     !appointmentForm.vehicleNumber ||
//                     !appointmentForm.vehicleModel ||
//                     !appointmentForm.serviceType ||
//                     appointmentCreating ||
//                     appointmentUpdating
//                   }
//                 >
//                   {appointmentCreating || appointmentUpdating ? (
//                     <>
//                       <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                       {editingAppointment ? "Updating..." : "Creating..."}
//                     </>
//                   ) : editingAppointment ? (
//                     "Update Appointment"
//                   ) : (
//                     "Book Appointment"
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         </div>
//       )}

//       {/* Customer Registration Modal */}
//       {showCustomerModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <Card className="w-full max-w-md">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-semibold text-slate-900">
//                   Register New Customer
//                 </h3>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => {
//                     setShowCustomerModal(false);
//                     setCustomerForm({
//                       name: "",
//                       contactNumber: "",
//                       email: "",
//                       address: "",
//                     });
//                   }}
//                 >
//                   <X className="h-5 w-5" />
//                 </Button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1 text-slate-700">
//                     Full Name *
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
//                     value={customerForm.name}
//                     onChange={(e) =>
//                       setCustomerForm({ ...customerForm, name: e.target.value })
//                     }
//                     placeholder="Enter customer name"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1 text-slate-700">
//                     Contact Number *
//                   </label>
//                   <input
//                     type="tel"
//                     className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
//                     value={customerForm.contactNumber}
//                     onChange={(e) =>
//                       setCustomerForm({
//                         ...customerForm,
//                         contactNumber: e.target.value,
//                       })
//                     }
//                     placeholder="Enter phone number"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1 text-slate-700">
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
//                     value={customerForm.email}
//                     onChange={(e) =>
//                       setCustomerForm({
//                         ...customerForm,
//                         email: e.target.value,
//                       })
//                     }
//                     placeholder="Enter email address (optional)"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1 text-slate-700">
//                     Address
//                   </label>
//                   <textarea
//                     className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 min-h-[80px] resize-none"
//                     value={customerForm.address}
//                     onChange={(e) =>
//                       setCustomerForm({
//                         ...customerForm,
//                         address: e.target.value,
//                       })
//                     }
//                     placeholder="Enter address (optional)"
//                   />
//                 </div>

//                 <div className="flex gap-2 pt-4">
//                   <Button
//                     variant="outline"
//                     className="flex-1"
//                     onClick={() => {
//                       setShowCustomerModal(false);
//                       setCustomerForm({
//                         name: "",
//                         contactNumber: "",
//                         email: "",
//                         address: "",
//                       });
//                     }}
//                     disabled={customerCreating}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     className="flex-1 bg-green-600 hover:bg-green-700"
//                     onClick={handleRegisterCustomer}
//                     disabled={
//                       !customerForm.name ||
//                       !customerForm.contactNumber ||
//                       customerCreating
//                     }
//                   >
//                     {customerCreating ? (
//                       <>
//                         <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                         Registering...
//                       </>
//                     ) : (
//                       "Register Customer"
//                     )}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <Card className="w-full max-w-md">
//             <div className="flex flex-col items-center text-center p-6">
//               <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
//                 <AlertCircle className="h-6 w-6 text-red-600" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                 Delete Appointment
//               </h3>
//               <p className="text-sm text-gray-500 mb-6">
//                 Are you sure you want to delete {showDeleteConfirm.customer}'s
//                 appointment? This action cannot be undone.
//               </p>
//               <div className="flex gap-3 w-full">
//                 <Button
//                   variant="outline"
//                   className="flex-1"
//                   onClick={() => setShowDeleteConfirm(null)}
//                   disabled={appointmentDeleting}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   className="flex-1"
//                   onClick={() => handleDeleteAppointment(showDeleteConfirm.id)}
//                   disabled={appointmentDeleting}
//                 >
//                   {appointmentDeleting ? (
//                     <>
//                       <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                       Deleting...
//                     </>
//                   ) : (
//                     "Delete Appointment"
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>
//           <p className="text-sm text-slate-600 mt-1">
//             Manage service bookings and appointment statuses
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             leftIcon={<CalendarIcon className="h-4 w-4" />}
//             className="border-slate-300 text-slate-700 hover:bg-slate-50"
//             onClick={() => setSelectedDate(today.toISOString().split("T")[0])}
//           >
//             Today
//           </Button>
//           <Button
//             leftIcon={<Clock className="h-4 w-4" />}
//             onClick={() => {
//               resetAppointmentForm();
//               setAppointmentForm((prev) => ({ ...prev, date: selectedDate }));
//               setShowBookingModal(true);
//             }}
//             className="bg-blue-600 hover:bg-blue-700"
//           >
//             New Appointment
//           </Button>
//         </div>
//       </div>

//       {/* Calendar and Schedule Grid */}
//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//         {/* Calendar Sidebar */}
//         <Card className="lg:col-span-1 h-fit">
//           <div className="mb-4 flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className="relative">
//                 <button
//                   onClick={() => setShowMonthSelector(!showMonthSelector)}
//                   className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100"
//                 >
//                   <span className="font-semibold text-gray-900">
//                     {months[currentMonth]} {currentYear}
//                   </span>
//                   {showMonthSelector ? (
//                     <ChevronUp className="h-4 w-4 text-gray-500" />
//                   ) : (
//                     <ChevronDown className="h-4 w-4 text-gray-500" />
//                   )}
//                 </button>

//                 {showMonthSelector && (
//                   <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48 max-h-60 overflow-y-auto">
//                     {months.map((month, index) => (
//                       <button
//                         key={month}
//                         onClick={() => handleMonthSelect(index)}
//                         className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
//                           index === currentMonth
//                             ? "bg-blue-50 text-blue-600 font-medium"
//                             : ""
//                         }`}
//                       >
//                         {month} {currentYear}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="flex gap-1">
//               <button
//                 onClick={handlePrevMonth}
//                 className="rounded-full p-1 hover:bg-gray-100"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </button>
//               <button
//                 onClick={handleNextMonth}
//                 className="rounded-full p-1 hover:bg-gray-100"
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
//             <span className="text-gray-400">Su</span>
//             <span className="text-gray-400">Mo</span>
//             <span className="text-gray-400">Tu</span>
//             <span className="text-gray-400">We</span>
//             <span className="text-gray-400">Th</span>
//             <span className="text-gray-400">Fr</span>
//             <span className="text-gray-400">Sa</span>
//           </div>

//           <div className="grid grid-cols-7 gap-1 text-center text-sm">
//             {calendarDays.map((day, index) => {
//               if (day === null) {
//                 return <div key={`empty-${index}`} className="aspect-square" />;
//               }

//               const dateString = getDateString(day);
//               const isBlocked = isDayBlocked(dateString);
//               const hasApps = hasAppointments(dateString);
//               const appCount = getAppointmentCount(dateString);
//               const isSelected = selectedDate === dateString;
//               const isPast = isPastDate(dateString);
//               const isClosed = isClosedDay(dateString);
//               const isToday = dateString === today.toISOString().split("T")[0];

//               return (
//                 <button
//                   key={day}
//                   onClick={() => handleDateSelect(day)}
//                   disabled={isBlocked || isPast || isClosed}
//                   className={`aspect-square rounded-full flex flex-col items-center justify-center relative transition-all
//                     ${
//                       isSelected
//                         ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
//                         : ""
//                     }
//                     ${
//                       !isSelected && !isBlocked && !isPast && !isClosed
//                         ? "hover:bg-gray-50 text-gray-700"
//                         : ""
//                     }
//                     ${
//                       isBlocked
//                         ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                         : ""
//                     }
//                     ${
//                       isPast
//                         ? "bg-gray-50 text-gray-300 cursor-not-allowed"
//                         : ""
//                     }
//                     ${
//                       isClosed
//                         ? "bg-red-50 text-red-400 cursor-not-allowed"
//                         : ""
//                     }
//                     ${
//                       isToday && !isSelected
//                         ? "ring-2 ring-blue-200 bg-blue-50"
//                         : ""
//                     }
//                   `}
//                 >
//                   {day}
//                   {hasApps && !isSelected && (
//                     <div className="absolute -top-1 -right-1">
//                       <div
//                         className={`h-5 w-5 rounded-full text-white text-[10px] flex items-center justify-center
//                         ${
//                           appCount >= 8
//                             ? "bg-red-500"
//                             : appCount >= 4
//                             ? "bg-orange-500"
//                             : "bg-blue-500"
//                         }`}
//                       >
//                         {appCount}
//                       </div>
//                     </div>
//                   )}
//                   {isBlocked && (
//                     <span className="text-[8px] mt-0.5 font-medium">FULL</span>
//                   )}
//                   {isClosed && !isSelected && (
//                     <span className="text-[8px] mt-0.5 font-medium">
//                       CLOSED
//                     </span>
//                   )}
//                   {isPast && !isSelected && !isClosed && (
//                     <span className="text-[8px] mt-0.5">PAST</span>
//                   )}
//                 </button>
//               );
//             })}
//           </div>

//           {/* Selected Day Summary */}
//           <div className="mt-6 border-t border-gray-100 pt-4">
//             <div className="flex justify-between items-center mb-3">
//               <div>
//                 <h4 className="text-xs font-semibold uppercase text-gray-500">
//                   Selected Day
//                 </h4>
//                 <p className="font-medium text-gray-900">
//                   {formatDate(selectedDate)}
//                 </p>
//               </div>
//               <Badge
//                 variant={isDayBlocked(selectedDate) ? "destructive" : "success"}
//               >
//                 {isDayBlocked(selectedDate)
//                   ? "Fully Booked"
//                   : `${selectedDayAppointments.length} Booked`}
//               </Badge>
//             </div>

//             {/* Selected Day Appointments */}
//             <div className="space-y-3 mb-4">
//               {selectedDayAppointments.length > 0 ? (
//                 selectedDayAppointments.map((app) => (
//                   <div key={app.id} className="group relative">
//                     <div
//                       className={`flex items-start gap-3 p-3 rounded-lg border-l-4 transition-all hover:shadow-md ${app.color}`}
//                     >
//                       <div
//                         className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
//                           app.color.split(" ")[0]
//                         }`}
//                       >
//                         <Wrench className="h-4 w-4" />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 mb-1">
//                           <p className="text-sm font-semibold text-gray-900 truncate">
//                             {app.customer}
//                           </p>
//                           <span
//                             className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadgeColor(
//                               app.status
//                             )}`}
//                           >
//                             {app.status?.toUpperCase()}
//                           </span>
//                         </div>
//                         <p className="text-xs text-gray-600 truncate">
//                           {app.time} • {app.vehicleNumber}
//                         </p>
//                         <p className="text-xs text-gray-600 truncate">
//                           {app.vehicleModel}
//                         </p>
//                         <p className="text-xs font-medium text-gray-700 truncate mt-0.5">
//                           {serviceTypes.find((s) => s.id === app.type)?.name ||
//                             app.type}
//                         </p>
//                       </div>
//                       <Badge
//                         variant="neutral"
//                         className="text-xs whitespace-nowrap"
//                       >
//                         {app.duration}
//                       </Badge>
//                     </div>
//                     <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button
//                         onClick={() =>
//                           setShowAppointmentMenu(
//                             showAppointmentMenu === app.id ? null : app.id
//                           )
//                         }
//                         className="p-1 hover:bg-gray-300 rounded-full"
//                       >
//                         <MoreVertical className="h-4 w-4 text-gray-600" />
//                       </button>
//                       {showAppointmentMenu === app.id && (
//                         <div className="absolute right-0 top-8 bg-white border border-gray-300 rounded-lg shadow-lg z-10 w-48">
//                           <button
//                             onClick={() => handleEditAppointment(app)}
//                             className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2"
//                           >
//                             <Edit className="h-4 w-4 text-blue-600" />
//                             Edit Appointment
//                           </button>
//                           <button
//                             onClick={() => {
//                               setShowDeleteConfirm({
//                                 id: app.id,
//                                 customer: app.customer,
//                               });
//                               setShowAppointmentMenu(null);
//                             }}
//                             className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                             Delete Appointment
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
//                   <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                   <p className="text-sm font-medium">
//                     No appointments for this day
//                   </p>
//                   <p className="text-xs mt-1">Click on a time slot to book</p>
//                 </div>
//               )}
//             </div>

//             {/* Quick Stats */}
//             <div className="grid grid-cols-3 gap-2 text-xs">
//               <div className="bg-blue-50 p-2 rounded text-center">
//                 <div className="font-semibold text-blue-700">
//                   {
//                     selectedDayAppointments.filter(
//                       (a) => a.status === "pending"
//                     ).length
//                   }
//                 </div>
//                 <div className="text-blue-600">Pending</div>
//               </div>
//               <div className="bg-green-50 p-2 rounded text-center">
//                 <div className="font-semibold text-green-700">
//                   {
//                     selectedDayAppointments.filter(
//                       (a) => a.status === "accepted"
//                     ).length
//                   }
//                 </div>
//                 <div className="text-green-600">Accepted</div>
//               </div>
//               <div className="bg-red-50 p-2 rounded text-center">
//                 <div className="font-semibold text-red-700">
//                   {
//                     selectedDayAppointments.filter(
//                       (a) => a.status === "rejected"
//                     ).length
//                   }
//                 </div>
//                 <div className="text-red-600">Rejected</div>
//               </div>
//             </div>
//           </div>
//         </Card>

//         {/* Daily Schedule */}
//         <Card className="lg:col-span-2 border-2 border-slate-200 shadow-lg">
//           <div className="p-6">
//             <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
//               <div>
//                 <h2 className="text-xl font-bold text-slate-900">
//                   Schedule for {formatDate(selectedDate)}
//                 </h2>
//                 <p className="text-sm text-slate-700 font-medium mt-1">
//                   <Info className="inline h-4 w-4 mr-1 text-blue-600" />
//                   Click on an appointment to edit or delete
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Badge
//                   variant="outline"
//                   className="border-slate-300 bg-slate-50 text-slate-700 font-semibold"
//                 >
//                   {selectedDayAppointments.length} appointment(s)
//                 </Badge>
//                 <Button
//                   size="sm"
//                   leftIcon={<Plus className="h-3 w-3" />}
//                   onClick={() => {
//                     if (isDayBlocked(selectedDate)) {
//                       alert(
//                         "This day is fully booked. Please select another day."
//                       );
//                       return;
//                     }
//                     if (isPastDate(selectedDate)) {
//                       alert("Cannot book appointments for past dates.");
//                       return;
//                     }
//                     resetAppointmentForm();
//                     setAppointmentForm((prev) => ({
//                       ...prev,
//                       date: selectedDate,
//                     }));
//                     setShowBookingModal(true);
//                   }}
//                   disabled={
//                     isDayBlocked(selectedDate) ||
//                     isPastDate(selectedDate) ||
//                     isClosedDay(selectedDate)
//                   }
//                   className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
//                 >
//                   Book Slot
//                 </Button>
//               </div>
//             </div>

//             <div className="space-y-4">
//               {availableTimeSlots.map((time) => {
//                 const appointment = getAppointmentByTime(selectedDate, time);
//                 const isBooked = isTimeSlotBooked(selectedDate, time);
//                 const isPast = isPastDate(selectedDate);
//                 const isClosed = isClosedDay(selectedDate);

//                 return (
//                   <div key={time} className="flex gap-4 group">
//                     <div className="w-24 flex-shrink-0 text-right">
//                       <div className="text-sm font-medium text-gray-900">
//                         {time}
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         {isBooked
//                           ? "Booked"
//                           : isClosed
//                           ? "Closed"
//                           : "Available"}
//                       </div>
//                     </div>
//                     <div className="flex-1 min-h-[3rem] relative">
//                       <div className="absolute inset-0 border-t border-gray-100 -z-10 top-3.5"></div>

//                       {isBooked && appointment ? (
//                         <div
//                           className={`rounded-lg border-2 p-4 shadow-sm transition-all hover:shadow-md cursor-pointer relative group/appointment ${appointment.color}`}
//                           onClick={() => handleEditAppointment(appointment)}
//                         >
//                           <div className="flex justify-between items-start gap-2">
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-center gap-2 mb-1">
//                                 <span className="font-bold text-sm">
//                                   {appointment.customer}
//                                 </span>
//                                 <span
//                                   className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadgeColor(
//                                     appointment.status
//                                   )}`}
//                                 >
//                                   {appointment.status?.toUpperCase()}
//                                 </span>
//                               </div>
//                               <div className="text-xs text-gray-700 space-y-0.5">
//                                 <p className="font-semibold">
//                                   {appointment.vehicleNumber} •{" "}
//                                   {appointment.vehicleModel}
//                                 </p>
//                                 <p className="opacity-75">
//                                   {appointment.time} • Duration:{" "}
//                                   {appointment.duration}
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="flex items-center gap-2 flex-shrink-0">
//                               <Badge
//                                 variant="neutral"
//                                 className="bg-white/50 border-transparent text-current text-[10px] whitespace-nowrap"
//                               >
//                                 {serviceTypes.find(
//                                   (s) => s.id === appointment.type
//                                 )?.name || appointment.type}
//                               </Badge>
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   setShowAppointmentMenu(
//                                     showAppointmentMenu === appointment.id
//                                       ? null
//                                       : appointment.id
//                                   );
//                                 }}
//                                 className="p-1 hover:bg-white/40 rounded opacity-0 group-hover/appointment:opacity-100"
//                               >
//                                 <MoreVertical className="h-4 w-4" />
//                               </button>
//                             </div>
//                           </div>
//                           {appointment.notes && (
//                             <div className="mt-2 text-xs text-gray-700 truncate bg-white/40 px-2 py-1 rounded">
//                               📝 {appointment.notes}
//                             </div>
//                           )}
//                           {showAppointmentMenu === appointment.id && (
//                             <div className="absolute right-2 top-12 bg-white border border-gray-300 rounded-lg shadow-lg z-10 w-48">
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleEditAppointment(appointment);
//                                 }}
//                                 className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2 font-medium border-b border-gray-200"
//                               >
//                                 <Edit className="h-4 w-4 text-blue-600" />
//                                 Edit Appointment
//                               </button>
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   setShowDeleteConfirm({
//                                     id: appointment.id,
//                                     customer: appointment.customer,
//                                   });
//                                   setShowAppointmentMenu(null);
//                                 }}
//                                 className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                                 Delete
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => handleCreateAppointment(time)}
//                           disabled={isPast || isClosed}
//                           className={`h-full w-full rounded-lg transition-colors cursor-pointer border-2 border-dashed flex items-center justify-center
//                             ${
//                               isPast || isClosed
//                                 ? "cursor-not-allowed opacity-40 border-gray-300"
//                                 : "opacity-0 group-hover:opacity-100 hover:bg-blue-50 hover:border-blue-300 border-slate-300"
//                             }
//                           `}
//                         >
//                           {isPast ? (
//                             <span className="text-xs text-gray-500 font-semibold">
//                               Past Date
//                             </span>
//                           ) : isClosed ? (
//                             <span className="text-xs text-red-500 font-semibold">
//                               Closed
//                             </span>
//                           ) : (
//                             <Plus className="h-4 w-4 text-slate-400" />
//                           )}
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* No appointments message */}
//             {selectedDayAppointments.length === 0 &&
//               availableTimeSlots.length > 0 && (
//                 <div className="text-center py-12 text-gray-500">
//                   <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                   <p className="text-lg font-medium">
//                     No appointments scheduled for this day
//                   </p>
//                   <p className="text-sm mt-2">
//                     Click "Book Slot" to add an appointment
//                   </p>
//                 </div>
//               )}

//             {/* No time slots available (Sunday/closed) */}
//             {availableTimeSlots.length === 0 && (
//               <div className="text-center py-12 text-gray-500">
//                 <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                 <p className="text-lg font-medium">We are closed on Sundays</p>
//                 <p className="text-sm mt-2">
//                   Please select a weekday to book appointments
//                 </p>
//               </div>
//             )}
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// }

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
  Info,
  Search,
} from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { useDispatch, useSelector } from 'react-redux'
import { 
  getAllAppointments, 
  createAppointment,
  updateAppointment,
  deleteAppointment 
} from '../../features/appointmentSlice'
import { 
  getAllCustomers,
  createCustomer 
} from '../../features/customerSlice'

const timeSlots = [
  '08:00 AM', '08:30 AM',
  '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM',
  '05:00 PM'
]

const serviceTypes = [
  { id: 'maintenance', name: 'Maintenance', duration: '1h' },
  { id: 'repair', name: 'Repair', duration: '2h' },
  { id: 'inspection', name: 'Inspection', duration: '30m' },
  { id: 'tire-change', name: 'Tire Change', duration: '1h' },
  { id: 'oil-change', name: 'Oil Change', duration: '45m' },
  { id: 'battery-replacement', name: 'Battery Replacement', duration: '1h' },
  { id: 'transmission-replacement', name: 'Transmission Replacement', duration: '1h' },
  { id: 'brake-replacement', name: 'Brake Replacement', duration: '1h' },
  { id: 'fuel-injection', name: 'Fuel Injection', duration: '1h' },
  { id: 'cooling-system', name: 'Cooling System', duration: '1h' },
  { id: 'engine-tuning', name: 'Engine Tuning', duration: '1h' },
  { id: 'air-filter', name: 'Air Filter', duration: '1h' },
  { id: 'wheel-alignment', name: 'Wheel Alignment', duration: '1h' },
  { id: 'tire-rotation', name: 'Tire Rotation', duration: '1h' },
  { id: 'transmission-change', name: 'Transmission Change', duration: '1h' },
  { id: 'battery-change', name: 'Battery Change', duration: '1h' },
  { id: 'hybrid-system', name: 'Hybrid System', duration: '1h' },
]

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function AppointmentsPage() {
  const dispatch = useDispatch();
  
  // Redux state
  const { 
    appointments: appointmentsFromRedux, 
    loading: appointmentsLoading,
    creating: appointmentCreating,
    updating: appointmentUpdating,
    deleting: appointmentDeleting 
  } = useSelector((state) => state.appointment);
  
  const { 
    customers: customersFromRedux, 
    loading: customersLoading 
  } = useSelector((state) => state.customer);

  // Component state
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showMonthSelector, setShowMonthSelector] = useState(false)
  const [appointments, setAppointments] = useState({})
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [showAppointmentMenu, setShowAppointmentMenu] = useState(null)
  
  // Customer state
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [customerSearch, setCustomerSearch] = useState('')
  const [filteredCustomers, setFilteredCustomers] = useState([])
  
  // Appointment form state
  const [appointmentForm, setAppointmentForm] = useState({
    id: null,
    date: selectedDate,
    time: '',
    customerId: '',
    customerName: '',
    phone: '',
    email: '',
    vehicleNumber: '',
    vehicleModel: '',
    serviceType: '',
    notes: '',
    status: 'pending',
  })
  
  // Customer form state
  const [customerForm, setCustomerForm] = useState({
    name: '',
    contactNumber: '',
    email: '',
  })

  const today = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const selectedDateObj = new Date(selectedDate)

  // Load appointments on component mount
  useEffect(() => {
    dispatch(getAllAppointments());
  }, [dispatch]);

  // Load customers when booking modal opens
  useEffect(() => {
    if (showBookingModal) {
      dispatch(getAllCustomers());
    }
  }, [showBookingModal, dispatch]);

  // Filter customers based on search
  useEffect(() => {
    if (!customersFromRedux) return;
    
    if (customerSearch.trim() === '') {
      setFilteredCustomers(customersFromRedux);
    } else {
      const filtered = customersFromRedux.filter(customer => 
        customer.name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.contactNumber?.includes(customerSearch) ||
        customer.email?.toLowerCase().includes(customerSearch.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [customerSearch, customersFromRedux]);

  // Transform backend appointments to calendar format
  useEffect(() => {
    if (appointmentsFromRedux && Array.isArray(appointmentsFromRedux)) {
      const transformedAppointments = {};
      
      appointmentsFromRedux.forEach((apt) => {
        if (!apt.appointmentDate) return;
        
        const dateString = apt.appointmentDate.split('T')[0];
        
        if (!transformedAppointments[dateString]) {
          transformedAppointments[dateString] = [];
        }

        let statusColor = 'bg-amber-100 border-amber-200 text-amber-700';
        if (apt.status === 'accepted') {
          statusColor = 'bg-green-100 border-green-200 text-green-700';
        } else if (apt.status === 'rejected') {
          statusColor = 'bg-red-100 border-red-200 text-red-700';
        }

        const serviceTypeId = apt.serviceType?.toLowerCase().replace(/\s+/g, '-') || 'maintenance';
        const matchingService = serviceTypes.find(s => 
          s.id === serviceTypeId || 
          s.name.toLowerCase() === apt.serviceType?.toLowerCase()
        );

        transformedAppointments[dateString].push({
          id: apt._id,
          time: apt.appointmentTime || '09:00 AM',
          customer: apt.customerName || 'Unknown Customer',
          customerId: apt.customerId,
          vehicleNumber: apt.vehicleNumber || 'N/A',
          vehicleModel: apt.vehicleModel || 'N/A',
          type: serviceTypeId,
          duration: matchingService ? matchingService.duration : '1h',
          color: statusColor,
          phone: apt.customerContactNumber || '',
          email: apt.email || '',
          notes: apt.note || '',
          status: apt.status || 'pending',
        });
      });
      
      setAppointments(transformedAppointments);
    }
  }, [appointmentsFromRedux]);

  // Helper functions
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
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

  const getAppointmentByTime = (dateString, time) => {
    const dayAppointments = getAppointmentsForDate(dateString);
    return dayAppointments.find(app => app.time === time);
  }

  const isTimeSlotBooked = (dateString, time) => {
    const dayAppointments = getAppointmentsForDate(dateString);
    return dayAppointments.some(app => app.time === time);
  }

  const isDayBlocked = (dateString) => {
    const dayAppointments = getAppointmentsForDate(dateString)
    return dayAppointments.length >= 8
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
    return date.getDay()
  }

  const isClosedDay = (dateString) => {
    const dayOfWeek = getDayOfWeek(dateString)
    return dayOfWeek === 0
  }

  const getAvailableTimeSlots = (dateString) => {
    const dayOfWeek = getDayOfWeek(dateString)
    
    if (dayOfWeek === 0) {
      return []
    }
    
    if (dayOfWeek === 6) {
      return timeSlots.filter(time => {
        const hour = parseInt(time.split(':')[0]);
        const isPM = time.includes('PM');
        return !isPM || (isPM && hour === 12);
      });
    }
    
    return timeSlots;
  }

  // Event handlers
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
      id: null,
      date: selectedDate,
      time,
      customerId: '',
      customerName: '',
      phone: '',
      email: '',
      vehicleNumber: '',
      vehicleModel: '',
      serviceType: '',
      notes: '',
      status: 'pending',
    })
    setEditingAppointment(null)
    setShowBookingModal(true)
  }

  const handleEditAppointment = (appointment) => {
    setAppointmentForm({
      id: appointment.id,
      date: selectedDate,
      time: appointment.time,
      customerId: appointment.customerId || '',
      customerName: appointment.customer,
      phone: appointment.phone || '',
      email: appointment.email || '',
      vehicleNumber: appointment.vehicleNumber,
      vehicleModel: appointment.vehicleModel,
      serviceType: appointment.type,
      notes: appointment.notes || '',
      status: appointment.status || 'pending',
    })
    setEditingAppointment(appointment)
    setShowBookingModal(true)
    setShowAppointmentMenu(null)
  }

  const handleDeleteAppointment = (appointmentId) => {
    dispatch(deleteAppointment(appointmentId))
      .unwrap()
      .then(() => {
        setShowDeleteConfirm(null)
        setShowAppointmentMenu(null)
      })
      .catch((error) => {
        alert('Failed to delete appointment: ' + error.message)
      })
  }

  const handleCustomerSelect = (customer) => {
    setAppointmentForm({
      ...appointmentForm,
      customerId: customer._id,
      customerName: customer.name,
      phone: customer.contactNumber,
      email: customer.email || '',
    })
  }

  const handleRegisterCustomer = () => {
    if (!customerForm.name || !customerForm.contactNumber) {
      alert('Please fill in name and contact number.')
      return
    }

    dispatch(createCustomer(customerForm))
      .unwrap()
      .then((newCustomer) => {
        // Update appointment form with new customer
        setAppointmentForm({
          ...appointmentForm,
          customerId: newCustomer._id,
          customerName: newCustomer.name,
          phone: newCustomer.contactNumber,
          email: newCustomer.email || '',
        })
        
        // Close customer modal
        setShowCustomerModal(false)
        setCustomerForm({
          name: '',
          contactNumber: '',
          email: '',
        })
      })
      .catch((error) => {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        alert('Failed to register customer: ' + error.message)
      })
  }

  const handleSubmitAppointment = () => {
    if (!appointmentForm.customerId) {
      alert('Please select or register a customer first.')
      return
    }

    if (!appointmentForm.vehicleNumber || !appointmentForm.vehicleModel || !appointmentForm.serviceType) {
      alert('Please fill in all required fields: Vehicle Number, Vehicle Model, and Service Type.')
      return
    }

    const appointmentData = {
      customerId: appointmentForm.customerId,
      customerName: appointmentForm.customerName,
      customerContactNumber: appointmentForm.phone,
      appointmentDate: appointmentForm.date,
      appointmentTime: appointmentForm.time,
      vehicleNumber: appointmentForm.vehicleNumber,
      vehicleModel: appointmentForm.vehicleModel,
      serviceType: appointmentForm.serviceType,
      status: appointmentForm.status,
      note: appointmentForm.notes,
    }

    if (editingAppointment) {
      // Update existing appointment
      dispatch(updateAppointment({ id: editingAppointment.id, ...appointmentData }))
        .unwrap()
        .then(() => {
          setShowBookingModal(false)
          setEditingAppointment(null)
          resetAppointmentForm()
        })
        .catch((error) => {
          alert('Failed to update appointment: ' + error.message)
        })
    } else {
      // Create new appointment
      // Check for time slot conflict
      const dateAppointments = getAppointmentsForDate(selectedDate)
      const timeConflict = dateAppointments.find(app => app.time === appointmentForm.time)
      if (timeConflict) {
        alert('This time slot is already booked. Please choose another time.')
        return
      }
      
      dispatch(createAppointment(appointmentData))
        .unwrap()
        .then(() => {
          setShowBookingModal(false)
          resetAppointmentForm()
        })
        .catch((error) => {
          console.log('====================================');
          console.log(error);
          console.log('====================================');
          alert('Failed to create appointment: ' + error.message)
        })
    }
  }

  const resetAppointmentForm = () => {
    setAppointmentForm({
      id: null,
      date: selectedDate,
      time: '',
      customerId: '',
      customerName: '',
      phone: '',
      email: '',
      vehicleNumber: '',
      vehicleModel: '',
      serviceType: '',
      notes: '',
      status: 'pending',
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-50 border-green-200'
      case 'rejected':
        return 'bg-red-50 border-red-200'
      case 'pending':
      default:
        return 'bg-amber-50 border-amber-200'
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
      default:
        return 'bg-amber-100 text-amber-800'
    }
  }

  const selectedDayAppointments = getAppointmentsForDate(selectedDate)
  const availableTimeSlots = getAvailableTimeSlots(selectedDate)
  const calendarDays = generateCalendarDays()

  if (appointmentsLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Booking/Edit Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
                </h2>
                <p className="text-sm text-slate-600 mt-2">
                  <CalendarDays className="inline h-4 w-4 mr-1" />
                  {formatDate(appointmentForm.date)} at {appointmentForm.time}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowBookingModal(false)
                  setEditingAppointment(null)
                  resetAppointmentForm()
                }}
                className="hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Section (for editing) */}
              {editingAppointment && (
                <div className={`p-4 rounded-lg border-2 ${getStatusColor(appointmentForm.status)}`}>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Appointment Status
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setAppointmentForm({ ...appointmentForm, status: 'pending' })}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${appointmentForm.status === 'pending' ? 'bg-amber-200 text-amber-900 ring-2 ring-amber-400' : 'bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 text-sm'}`}
                    >
                      <Clock className="inline h-4 w-4 mr-2 mb-0.5" />
                      Pending
                    </button>
                    <button
                      onClick={() => setAppointmentForm({ ...appointmentForm, status: 'accepted' })}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${appointmentForm.status === 'accepted' ? 'bg-green-200 text-green-900 ring-2 ring-green-400' : 'bg-white border border-green-200 text-green-700 hover:bg-green-50 text-sm'}`}
                    >
                      <Check className="inline h-4 w-4 mr-2" />
                      Accept
                    </button>
                    <button
                      onClick={() => setAppointmentForm({ ...appointmentForm, status: 'rejected' })}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${appointmentForm.status === 'rejected' ? 'bg-red-200 text-red-900 ring-2 ring-red-400' : 'bg-white border border-red-200 text-red-700 hover:bg-red-50 text-sm'}`}
                    >
                      <X className="inline h-4 w-4 mr-2 mb-0.5" />
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {/* Customer Selection */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">
                  <User className="inline h-4 w-4 mr-2 text-blue-600" />
                  Customer Selection
                </label>
                
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  {/* Customer Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search customers by name, phone, or email..."
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 text-sm"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                    />
                  </div>

                  {/* Customers List */}
                  <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg bg-white">
                    {customersLoading ? (
                      <div className="p-4 text-center">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-sm text-slate-600 mt-2">Loading customers...</p>
                      </div>
                    ) : filteredCustomers.length === 0 ? (
                      <div className="p-4 text-center text-slate-500">
                        <p className="text-sm">No customers found</p>
                        <p className="text-xs mt-1">Register a new customer to continue</p>
                      </div>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <div
                          key={customer._id}
                          className={`p-3 border-b border-slate-100 last:border-b-0 cursor-pointer transition-colors hover:bg-blue-50 ${
                            appointmentForm.customerId === customer._id ? 'bg-blue-100 border-l-4 border-l-blue-500' : ''
                          }`}
                          onClick={() => handleCustomerSelect(customer)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-slate-900">{customer.name}</p>
                              <p className="text-xs text-slate-600">
                                📞 {customer.contactNumber}
                                {customer.email && ` • ✉️ ${customer.email}`}
                              </p>
                            </div>
                            {appointmentForm.customerId === customer._id && (
                              <Check className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Register New Customer Button */}
                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      leftIcon={<Plus className="h-4 w-4" />}
                      onClick={() => setShowCustomerModal(true)}
                      className="w-full hover:bg-blue-50 hover:border-blue-300"
                    >
                      Register New Customer
                    </Button>
                  </div>

                  {/* Selected Customer Display */}
                  {appointmentForm.customerId && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-blue-900">
                            {appointmentForm.customerName}
                          </p>
                          <p className="text-xs text-blue-700">
                            Phone: {appointmentForm.phone}
                            {appointmentForm.email && ` • Email: ${appointmentForm.email}`}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setAppointmentForm({
                              ...appointmentForm,
                              customerId: '',
                              customerName: '',
                              phone: '',
                              email: '',
                            })
                          }}
                          className="text-xs h-7 px-2"
                        >
                          Change
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Details */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">
                  <Car className="inline h-4 w-4 mr-2 text-green-600" />
                  Vehicle Details
                </label>
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="relative">
                    <Car className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Vehicle Number *"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 text-sm"
                      value={appointmentForm.vehicleNumber}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, vehicleNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="relative">
                    <Car className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Vehicle Model *"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 text-sm"
                      value={appointmentForm.vehicleModel}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, vehicleModel: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">
                  <Wrench className="inline h-4 w-4 mr-2 text-orange-600" />
                  Service Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {serviceTypes.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      className={`p-3 rounded-lg border-2 text-sm transition-all font-medium ${
                        appointmentForm.serviceType === service.id
                          ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-100'
                          : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                      }`}
                      onClick={() => setAppointmentForm({ ...appointmentForm, serviceType: service.id })}
                    >
                      <div className="text-left">{service.name}</div>
                      <div className="text-xs text-slate-500 mt-1">{service.duration}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">
                  <AlertCircle className="inline h-4 w-4 mr-2 text-purple-600" />
                  Additional Notes
                </label>
                <textarea
                  placeholder="Any special instructions, concerns, or customer requests..."
                  className="w-full px-4 py-3 border text-sm border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 min-h-[100px] resize-none"
                  value={appointmentForm.notes}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-200">
                <Button
                  variant="outline"
                  className="flex-1 py-2.5"
                  onClick={() => {
                    setShowBookingModal(false)
                    setEditingAppointment(null)
                    resetAppointmentForm()
                  }}
                  disabled={appointmentCreating || appointmentUpdating}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700"
                  onClick={handleSubmitAppointment}
                  disabled={
                    !appointmentForm.customerId ||
                    !appointmentForm.vehicleNumber ||
                    !appointmentForm.vehicleModel ||
                    !appointmentForm.serviceType ||
                    appointmentCreating ||
                    appointmentUpdating
                  }
                >
                  {appointmentCreating ? 'Creating...' : appointmentUpdating ? 'Updating...' : editingAppointment ? 'Update Appointment' : 'Book Appointment'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Customer Registration Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Register New Customer</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCustomerModal(false)
                    setCustomerForm({
                      name: '',
                      contactNumber: '',
                      email: '',
                    })
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
                    value={customerForm.name}
                    onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
                    placeholder="Enter customer name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
                    value={customerForm.contactNumber}
                    onChange={(e) => setCustomerForm({...customerForm, contactNumber: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
                    placeholder="Enter email address (optional)"
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowCustomerModal(false)
                      setCustomerForm({
                        name: '',
                        contactNumber: '',
                        email: '',
                      })
                    }}
                    disabled={customersLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={handleRegisterCustomer}
                    disabled={!customerForm.name || !customerForm.contactNumber || customersLoading}
                  >
                    {customersLoading ? 'Registering...' : 'Register Customer'}
                  </Button>
                </div>
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
                Are you sure you want to delete {showDeleteConfirm.customer}'s appointment?
                This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(null)}
                  disabled={appointmentDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDeleteAppointment(showDeleteConfirm.id)}
                  disabled={appointmentDeleting}
                >
                  {appointmentDeleting ? 'Deleting...' : 'Delete Appointment'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage service bookings and appointment statuses
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={<CalendarIcon className="h-4 w-4" />}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => setSelectedDate(today.toISOString().split('T')[0])}
          >
            Today
          </Button>
          <Button 
            leftIcon={<Clock className="h-4 w-4" />}
            onClick={() => {
              resetAppointmentForm()
              setAppointmentForm(prev => ({ ...prev, date: selectedDate }))
              setShowBookingModal(true)
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            New Appointment
          </Button>
        </div>
      </div>

      {/* Calendar and Schedule Grid */}
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
                        ${appCount >= 8 ? 'bg-red-500' : appCount >= 4 ? 'bg-orange-500' : 'bg-blue-500'}`}
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
              <Badge variant={isDayBlocked(selectedDate) ? 'destructive' : 'success'}>
                {isDayBlocked(selectedDate) ? 'Fully Booked' : `${selectedDayAppointments.length} Booked`}
              </Badge>
            </div>
            
            {/* Selected Day Appointments */}
            <div className="space-y-3 mb-4">
              {selectedDayAppointments.length > 0 ? (
                selectedDayAppointments.map((app) => (
                  <div key={app.id} className="group relative">
                    <div className={`flex items-start gap-3 p-3 rounded-lg border-l-4 transition-all hover:shadow-md ${app.color}`}>
                      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${app.color.split(' ')[0]}`}>
                        <Wrench className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {app.customer}
                          </p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadgeColor(app.status)}`}>
                            {app.status?.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          {app.time} • {app.vehicleNumber}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {app.vehicleModel}
                        </p>
                        <p className="text-xs font-medium text-gray-700 truncate mt-0.5">
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
                        className="p-1 hover:bg-gray-300 rounded-full"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-600" />
                      </button>
                      {showAppointmentMenu === app.id && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-300 rounded-lg shadow-lg z-10 w-48">
                          <button
                            onClick={() => handleEditAppointment(app)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                            Edit Appointment
                          </button>
                          <button
                            onClick={() => {
                              setShowDeleteConfirm({ id: app.id, customer: app.customer })
                              setShowAppointmentMenu(null)
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
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
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-blue-50 p-2 rounded text-center">
                <div className="font-semibold text-blue-700">
                  {selectedDayAppointments.filter(a => a.status === 'pending').length}
                </div>
                <div className="text-blue-600">Pending</div>
              </div>
              <div className="bg-green-50 p-2 rounded text-center">
                <div className="font-semibold text-green-700">
                  {selectedDayAppointments.filter(a => a.status === 'accepted').length}
                </div>
                <div className="text-green-600">Accepted</div>
              </div>
              <div className="bg-red-50 p-2 rounded text-center">
                <div className="font-semibold text-red-700">
                  {selectedDayAppointments.filter(a => a.status === 'rejected').length}
                </div>
                <div className="text-red-600">Rejected</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Daily Schedule */}
        <Card className="lg:col-span-2 border-2 border-slate-200 shadow-lg">
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Schedule for {formatDate(selectedDate)}
                </h2>
                <p className="text-sm text-slate-700 font-medium mt-1">
                  <Info className="inline h-4 w-4 mr-1 text-blue-600" />
                  Click on an appointment to edit or delete
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-slate-300 bg-slate-50 text-slate-700 font-semibold">
                  {selectedDayAppointments.length} appointment(s)
                </Badge>
                <Button
                  size="sm"
                  leftIcon={<Plus className="h-3 w-3" />}
                  onClick={() => {
                    if (isDayBlocked(selectedDate)) {
                      alert('This day is fully booked. Please select another day.')
                      return
                    }
                    if (isPastDate(selectedDate)) {
                      alert('Cannot book appointments for past dates.')
                      return
                    }
                    resetAppointmentForm()
                    setAppointmentForm(prev => ({ ...prev, date: selectedDate }))
                    setShowBookingModal(true)
                  }}
                  disabled={isDayBlocked(selectedDate) || isPastDate(selectedDate) || isClosedDay(selectedDate)}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  Book Slot
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {availableTimeSlots.map((time) => {
                const appointment = getAppointmentByTime(selectedDate, time);
                const isBooked = isTimeSlotBooked(selectedDate, time);
                const isPast = isPastDate(selectedDate);
                const isClosed = isClosedDay(selectedDate);
                
                return (
                  <div key={time} className="flex gap-4 group">
                    <div className="w-24 flex-shrink-0 text-right">
                      <div className="text-sm font-medium text-gray-900">{time}</div>
                      <div className="text-xs text-gray-500">
                        {isBooked ? 'Booked' : isClosed ? 'Closed' : 'Available'}
                      </div>
                    </div>
                    <div className="flex-1 min-h-[3rem] relative">
                      <div className="absolute inset-0 border-t border-gray-100 -z-10 top-3.5"></div>

                      {isBooked && appointment ? (
                        <div
                          className={`rounded-lg border-2 p-4 shadow-sm transition-all hover:shadow-md cursor-pointer relative group/appointment ${appointment.color}`}
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm">
                                  {appointment.customer}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadgeColor(appointment.status)}`}>
                                  {appointment.status?.toUpperCase()}
                                </span>
                              </div>
                              <div className="text-xs text-gray-700 space-y-0.5">
                                <p className="font-semibold">
                                  {appointment.vehicleNumber} • {appointment.vehicleModel}
                                </p>
                                <p className="opacity-75">
                                  {appointment.time} • Duration: {appointment.duration}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge
                                variant="neutral"
                                className="bg-white/50 border-transparent text-current text-[10px] whitespace-nowrap"
                              >
                                {serviceTypes.find(s => s.id === appointment.type)?.name || appointment.type}
                              </Badge>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowAppointmentMenu(showAppointmentMenu === appointment.id ? null : appointment.id)
                                }}
                                className="p-1 hover:bg-white/40 rounded opacity-0 group-hover/appointment:opacity-100"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          {appointment.notes && (
                            <div className="mt-2 text-xs text-gray-700 truncate bg-white/40 px-2 py-1 rounded">
                              📝 {appointment.notes}
                            </div>
                          )}
                          {showAppointmentMenu === appointment.id && (
                            <div className="absolute right-2 top-12 bg-white border border-gray-300 rounded-lg shadow-lg z-10 w-48">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditAppointment(appointment)
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2 font-medium border-b border-gray-200"
                              >
                                <Edit className="h-4 w-4 text-blue-600" />
                                Edit Appointment
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowDeleteConfirm({ id: appointment.id, customer: appointment.customer })
                                  setShowAppointmentMenu(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium"
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
                          disabled={isPast || isClosed}
                          className={`h-full w-full rounded-lg transition-colors cursor-pointer border-2 border-dashed flex items-center justify-center
                            ${isPast || isClosed ? 'cursor-not-allowed opacity-40 border-gray-300' : 'opacity-0 group-hover:opacity-100 hover:bg-blue-50 hover:border-blue-300 border-slate-300'}
                          `}
                        >
                          {isPast ? (
                            <span className="text-xs text-gray-500 font-semibold">Past Date</span>
                          ) : isClosed ? (
                            <span className="text-xs text-red-500 font-semibold">Closed</span>
                          ) : (
                            <Plus className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* No appointments message */}
            {selectedDayAppointments.length === 0 && availableTimeSlots.length > 0 && (
              <div className="text-center py-12 text-gray-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No appointments scheduled for this day</p>
                <p className="text-sm mt-2">Click "Book Slot" to add an appointment</p>
              </div>
            )}
            
            {/* No time slots available (Sunday/closed) */}
            {availableTimeSlots.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">We are closed on Sundays</p>
                <p className="text-sm mt-2">Please select a weekday to book appointments</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
