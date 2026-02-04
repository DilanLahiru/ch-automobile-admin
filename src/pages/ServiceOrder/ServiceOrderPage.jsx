// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Plus,
//   Trash2,
//   ArrowRight,
//   Save,
//   FileText,
//   Clock,
//   CheckCircle,
//   AlertCircle,
// } from "lucide-react";
// import { Card } from "../../components/ui/Card";
// import { Button } from "../../components/ui/Button";
// import { Input } from "../../components/ui/Input";
// import { Badge } from "../../components/ui/Badge";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllEmployee } from "../../features/employeeSlice";
// import { getAllAppointments } from "../../features/appointmentSlice";
// import { getAllProducts } from "../../features/productSlice";
// import { createServiceOrder } from "../../features/serviceOrderSlice";
// import { toast } from "react-toastify";

// export function ServiceOrderPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Redux selectors
//   const { employee: employeesFromRedux, isLoading: isLoadingEmployees } =
//     useSelector((state) => state.employee);
//   const {
//     appointments: appointmentsFromRedux,
//     isLoading: isLoadingAppointments,
//   } = useSelector((state) => state.appointment);
//   const { products: productsFromRedux, loading: isLoadingProducts } =
//     useSelector((state) => state.product);
//   const { isLoading: isLoadingServiceOrder } = useSelector(
//     (state) => state.serviceOrder,
//   );

//   // State for multiple repairs
//   const [repairs, setRepairs] = useState([]);
//   const [currentRepairIndex, setCurrentRepairIndex] = useState(0);
//   const [availableVehicles, setAvailableVehicles] = useState([]);
//   const [draftRepairs, setDraftRepairs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadAllDetails();
//     loadDraftRepairs();
//   }, []);

//   // Update available vehicles when appointments load
//   useEffect(() => {
//     if (appointmentsFromRedux && appointmentsFromRedux.length > 0) {
//       const vehicles = processAvailableVehicles(appointmentsFromRedux);
//       setAvailableVehicles(vehicles);
//     }
//   }, [appointmentsFromRedux]);

//   // Initialize repair when data is loaded
//   useEffect(() => {
//     if (!isLoadingAppointments && !isLoadingEmployees && !isLoadingProducts) {
//       if (repairs.length === 0) {
//         initializeNewRepair();
//       }
//       setLoading(false);
//     }
//   }, [isLoadingAppointments, isLoadingEmployees, isLoadingProducts]);

//   const loadAllDetails = async () => {
//     try {
//       setLoading(true);
//       await Promise.all([
//         dispatch(getAllEmployee()),
//         dispatch(getAllAppointments()),
//         dispatch(getAllProducts()),
//       ]);
//     } catch (error) {
//       console.error("Error loading details:", error);
//       toast.error("Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadDraftRepairs = () => {
//     try {
//       const savedDrafts = localStorage.getItem("serviceOrderDrafts");
//       if (savedDrafts) {
//         const drafts = JSON.parse(savedDrafts);
//         if (Array.isArray(drafts)) {
//           setDraftRepairs(drafts);
//         }
//       }
//     } catch (error) {
//       console.error("Error loading drafts:", error);
//     }
//   };

//   const handleLoadDraft = (draft) => {
//     setRepairs(draft.repairs);
//     setCurrentRepairIndex(0);
//     toast.success("Draft loaded successfully!");
//   };

//   const handleDeleteDraft = (index) => {
//     const updatedDrafts = draftRepairs.filter((_, i) => i !== index);
//     setDraftRepairs(updatedDrafts);
//     localStorage.setItem("serviceOrderDrafts", JSON.stringify(updatedDrafts));
//     toast.success("Draft deleted");
//   };

//   const processAvailableVehicles = (appointments) => {
//     if (!Array.isArray(appointments)) return [];

//     // Filter for unique vehicles and appointments that are ready for service
//     const uniqueVehicles = new Map();

//     appointments.forEach((appt) => {
//       console.log(appt);
//       // Accept pending, confirmed, or completed appointments
//       if (appt.vehicleNumber) {
//         uniqueVehicles.set(appt.vehicleNumber, {
//           appointmentId: appt._id,
//           registrationNo: appt.vehicleNumber,
//           vehicleNumber: appt.vehicleNumber,
//           make: appt.vehicleMake || appt.make || "Unknown Make",
//           model: appt.vehicleModel || appt.model || "Unknown Model",
//           vehicleModel: appt.vehicleModel || appt.model || "Unknown Model",
//           owner: appt.customerName || appt.customer?.name || "Unknown Owner",
//           customerName:
//             appt.customerName || appt.customer?.name || "Unknown Owner",
//           appointmentId: appt._id,
//           vehicleId: appt.vehicleId,
//         });
//       }
//     });

//     return Array.from(uniqueVehicles.values());
//   };

//   const initializeNewRepair = () => {
//     const newRepair = {
//       id: Date.now(),
//       vehicleNumber: "",
//       employeeId: "",
//       serviceDescription: "",
//       laborCost: 0,
//       parts: [], // Initialize with empty array
//       status: "pending",
//       createdAt: new Date().toISOString(),
//     };
//     setRepairs([newRepair]);
//     setCurrentRepairIndex(0);
//   };

//   const currentRepair = repairs[currentRepairIndex] || {
//     id: "",
//     vehicleNumber: "",
//     employeeId: "",
//     serviceDescription: "",
//     laborCost: 0,
//     parts: [],
//     status: "pending",
//     createdAt: "",
//   };

//   // Employee methods
//   const getAvailableEmployees = () => {
//     return Array.isArray(employeesFromRedux)
//       ? employeesFromRedux.filter((emp) => {
//           return emp.status !== "inactive";
//         })
//       : [];
//   };

//   const getSelectedEmployee = () => {
//     return getAvailableEmployees().find(
//       (emp) => emp._id === currentRepair.employeeId,
//     );
//   };

//   // Get appointments for selected vehicle
//   const getVehicleAppointments = () => {
//     return Array.isArray(appointmentsFromRedux)
//       ? appointmentsFromRedux.filter((appt) => {
//           return appt.vehicleNumber === currentRepair.vehicleNumber;
//         })
//       : [];
//   };

//   // Get selected vehicle details from available vehicles
//   const getSelectedVehicle = () => {
//     return getVehicleAppointments().find(
//       (v) => v.vehicleNumber === currentRepair.vehicleNumber,
//     );
//   };

//   // Parts methods
//   const getAvailableParts = () => {
//     const parts = Array.isArray(productsFromRedux) ? productsFromRedux : [];
//     console.log("Available Parts:", parts);
//     return parts;
//   };

//   const handleAddPart = (selectedPartId, quantity) => {
//     if (!selectedPartId || !currentRepair.vehicleNumber) {
//       toast.warning("Please select a vehicle first");
//       return;
//     }

//     const part = getAvailableParts().find((p) => p._id === selectedPartId);
//     if (!part) {
//       toast.warning("Selected part not found");
//       return;
//     }

//     const updatedRepairs = [...repairs];
//     const partQuantity = parseInt(quantity) || 1;

//     // Ensure parts array exists
//     if (!updatedRepairs[currentRepairIndex].parts) {
//       updatedRepairs[currentRepairIndex].parts = [];
//     }

//     const existingPartIndex = updatedRepairs[
//       currentRepairIndex
//     ].parts.findIndex((p) => p._id === part._id);

//     if (existingPartIndex >= 0) {
//       updatedRepairs[currentRepairIndex].parts[existingPartIndex].quantity +=
//         partQuantity;
//     } else {
//       updatedRepairs[currentRepairIndex].parts.push({
//         _id: part._id,
//         name: part.name,
//         price: part.price || 0,
//         quantity: partQuantity,
//       });
//     }

//     setRepairs(updatedRepairs);
//     toast.success("Part added to repair");
//   };

//   const handleRemovePart = (partId) => {
//     const updatedRepairs = [...repairs];
//     if (updatedRepairs[currentRepairIndex]?.parts) {
//       updatedRepairs[currentRepairIndex].parts = updatedRepairs[
//         currentRepairIndex
//       ].parts.filter((p) => p._id !== partId);
//       setRepairs(updatedRepairs);
//     }
//   };

//   const handleUpdateRepairField = (field, value) => {
//     const updatedRepairs = [...repairs];
//     updatedRepairs[currentRepairIndex] = {
//       ...updatedRepairs[currentRepairIndex],
//       [field]: value,
//     };
//     setRepairs(updatedRepairs);
//   };

//   const handleAddNewRepair = () => {
//     const newRepair = {
//       id: Date.now(),
//       vehicleNumber: "",
//       employeeId: "",
//       serviceDescription: "",
//       laborCost: 0,
//       parts: [], // Initialize with empty array
//       status: "pending",
//       createdAt: new Date().toISOString(),
//     };
//     setRepairs([...repairs, newRepair]);
//     setCurrentRepairIndex(repairs.length);
//   };

//   const handleRemoveRepair = (index) => {
//     if (repairs.length === 1) {
//       toast.warning("You must have at least one repair");
//       return;
//     }
//     const updatedRepairs = repairs.filter((_, i) => i !== index);
//     setRepairs(updatedRepairs);
//     if (currentRepairIndex >= updatedRepairs.length) {
//       setCurrentRepairIndex(updatedRepairs.length - 1);
//     }
//   };

//   const calculateRepairTotal = (repair) => {
//     if (!repair) return 0;

//     const parts = repair.parts || [];
//     const partsTotal = parts.reduce((sum, part) => {
//       const price = part.price || 0;
//       const quantity = part.quantity || 0;
//       return sum + price * quantity;
//     }, 0);

//     const laborCost = parseFloat(repair.laborCost) || 0;
//     return partsTotal + laborCost;
//   };

//   const calculateGrandTotal = () => {
//     if (!repairs || repairs.length === 0) return 0;

//     return repairs.reduce(
//       (total, repair) => total + calculateRepairTotal(repair),
//       0,
//     );
//   };

//   const handleSaveDraft = () => {
//     // Validate at least one repair
//     if (repairs.length === 0 || !currentRepair.vehicleNumber) {
//       toast.error("Please select a vehicle for each repair");
//       return;
//     }

//     // Create draft object with metadata
//     const draftObject = {
//       id: Date.now(),
//       repairs: repairs,
//       createdAt: new Date().toISOString(),
//       lastModified: new Date().toISOString(),
//       summary: `${repairs.length} repair(s) - ${repairs.map((r) => r.vehicleNumber).join(", ")}`,
//     };

//     // Add to drafts list
//     const updatedDrafts = [draftObject, ...draftRepairs];
//     setDraftRepairs(updatedDrafts);

//     // Save to localStorage
//     localStorage.setItem("serviceOrderDrafts", JSON.stringify(updatedDrafts));

//     // Also keep the old single-draft for backward compatibility
//     localStorage.setItem("serviceOrderDraft", JSON.stringify(repairs));

//     toast.success("Service order draft saved successfully");
//   };

//   const handleCreateServiceOrder = async () => {
//     // Validation
//     const incompleteRepairs = repairs.filter(
//       (repair) => !repair.vehicleNumber || !repair.employeeId,
//     );

//     if (incompleteRepairs.length > 0) {
//       toast.error("Please assign both vehicle and employee to all repairs");
//       return;
//     }

//     // Prepare order data
//     const orderData = {
//       repairs: repairs.map((repair) => ({
//         appointmentId: getSelectedVehicle()?.appointmentId,
//         vehicleNumber: repair.vehicleNumber,
//         customerId: getSelectedVehicle()?.customerId,
//         employeeId: repair.employeeId,
//         serviceDescription: repair.serviceDescription,
//         laborCost: parseFloat(repair.laborCost) || 0,
//         parts: repair.parts.map((part) => ({
//           _id: part._id,
//           name: part.name,
//           price: part.price,
//           quantity: part.quantity,
//         })),
//         status: "completed",
//       })),
//       totalAmount: calculateGrandTotal(),
//       orderDate: new Date().toISOString(),
//     };

//     console.log(orderData);

//     // try {
//     //   const result = await dispatch(createServiceOrder(orderData));
//     //   if (result.payload) {
//     //     toast.success("Service order created successfully!");
//     //     // Clear draft
//     //     localStorage.removeItem("serviceOrderDraft");
//     //     // Navigate to invoices or service order list
//     //     navigate("/dashboard/invoices/new", {
//     //       state: { serviceOrder: result.payload },
//     //     });
//     //   }
//     // } catch (error) {
//     //   toast.error("Failed to create service order");
//     //   console.error(error);
//     // }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <Clock className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600">Loading service order data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Service Orders</h1>
//           <p className="text-sm text-gray-500">
//             Manage multiple vehicle repairs, assign employees, and handle parts
//           </p>
//         </div>
//         <Button variant="outline" onClick={() => navigate("/dashboard")}>
//           Back to Dashboard
//         </Button>
//       </div>

//       {/* Loading States */}
//       {(isLoadingAppointments || isLoadingEmployees || isLoadingProducts) && (
//         <Card className="bg-blue-50 border-blue-200">
//           <div className="flex items-center justify-center p-4">
//             <Clock className="h-5 w-5 text-blue-600 mr-2 animate-pulse" />
//             <p className="text-sm text-blue-700">Loading data...</p>
//           </div>
//         </Card>
//       )}

//       {/* Saved Drafts Section */}
//       {draftRepairs.length > 0 && (
//         <Card title="Saved Drafts">
//           <div className="space-y-3">
//             {draftRepairs.map((draft, index) => (
//               <div
//                 key={draft.id}
//                 className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
//               >
//                 <div className="flex-1">
//                   <p className="font-medium text-gray-900">{draft.summary}</p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Created: {new Date(draft.createdAt).toLocaleString()}
//                   </p>
//                 </div>
//                 <div className="flex gap-2 ml-4">
//                   <Button
//                     className="px-3 py-1 text-sm"
//                     onClick={() => handleLoadDraft(draft)}
//                   >
//                     Load
//                   </Button>
//                   <button
//                     onClick={() => handleDeleteDraft(index)}
//                     className="px-3 py-1 text-sm text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Card>
//       )}

//       {/* Repairs Tabs */}
//       <Card>
//         <div className="flex gap-2 flex-wrap border-b border-gray-200 pb-4">
//           {repairs.map((repair, index) => (
//             <button
//               key={repair.id || index}
//               onClick={() => setCurrentRepairIndex(index)}
//               className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors relative ${
//                 currentRepairIndex === index
//                   ? "bg-blue-100 text-blue-700 border-b-2 border-blue-700"
//                   : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//               }`}
//             >
//               Repair #{index + 1}
//               {repair.vehicleNumber && (
//                 <span className="text-xs ml-2">({repair.vehicleNumber})</span>
//               )}
//               {repair.status === "completed" && (
//                 <CheckCircle className="h-4 w-4 absolute top-1 right-1 text-green-600" />
//               )}
//             </button>
//           ))}
//           <button
//             onClick={handleAddNewRepair}
//             className="px-4 py-2 rounded-lg font-medium text-sm bg-green-100 text-green-700 hover:bg-green-200 transition-colors flex items-center gap-2"
//           >
//             <Plus className="h-4 w-4" /> Add Repair
//           </button>
//         </div>
//       </Card>

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//         {/* Main Content */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Vehicle & Employee Selection */}
//           <Card title="Vehicle & Employee Assignment">
//             <div className="space-y-4">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {/* Vehicle Selection */}
//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                     Select Vehicle
//                   </label>
//                   <select
//                     className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                     value={currentRepair.vehicleNumber || ""}
//                     onChange={(e) =>
//                       handleUpdateRepairField("vehicleNumber", e.target.value)
//                     }
//                     disabled={isLoadingAppointments}
//                   >
//                     <option value="">-- Select a Vehicle --</option>
//                     {availableVehicles.length === 0 &&
//                       !isLoadingAppointments && (
//                         <option value="" disabled>
//                           No vehicles available
//                         </option>
//                       )}
//                     {availableVehicles.map((v) => {
//                       console.log(v);
//                       return (
//                         <option key={v.vehicleNumber} value={v.vehicleNumber}>
//                           {v.vehicleNumber} - {v.customerName}
//                         </option>
//                       );
//                     })}
//                   </select>
//                   {isLoadingAppointments && (
//                     <p className="mt-1 text-xs text-gray-500">
//                       Loading vehicles...
//                     </p>
//                   )}
//                 </div>

//                 {/* Employee Assignment */}
//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                     Assign Employee
//                   </label>
//                   <select
//                     className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                     value={currentRepair.employeeId || ""}
//                     onChange={(e) =>
//                       handleUpdateRepairField("employeeId", e.target.value)
//                     }
//                     disabled={isLoadingEmployees}
//                   >
//                     <option value="">-- Assign Employee --</option>
//                     {getAvailableEmployees().map((emp) => (
//                       <option key={emp._id} value={emp._id}>
//                         {emp.name} - {emp.position || "Technician"}
//                       </option>
//                     ))}
//                   </select>
//                   {isLoadingEmployees && (
//                     <p className="mt-1 text-xs text-gray-500">
//                       Loading employees...
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Vehicle Details Summary */}
//               {getSelectedVehicle() && (
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//                   <div className="flex items-start gap-2">
//                     <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
//                     <div className="text-sm">
//                       <p className="font-medium text-blue-900">
//                         Vehicle Details
//                       </p>
//                       <p className="text-blue-700 text-xs mt-1">
//                         {getSelectedVehicle().vehicleNumber}{" "}
//                         {getSelectedVehicle().vehicleModel} -{" "}
//                         {getSelectedVehicle().customerName}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Assigned Employee Info */}
//               {getSelectedEmployee() && (
//                 <div className="bg-green-50 border border-green-200 rounded-lg p-3">
//                   <div className="flex items-start gap-2">
//                     <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
//                     <div className="text-sm">
//                       <p className="font-medium text-green-900">
//                         Assigned Employee
//                       </p>
//                       <p className="text-green-700 text-xs mt-1">
//                         {getSelectedEmployee().name} (
//                         {getSelectedEmployee().position || "Technician"})
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </Card>

//           {/* Parts Management */}
//           <Card title={`Parts & Materials - Repair #${currentRepairIndex + 1}`}>
//             <div className="space-y-4">
//               {/* Add Parts Form */}
//               <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
//                 <div className="flex-1">
//                   <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                     Add Part
//                   </label>
//                   <select
//                     id="partSelect"
//                     className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                     disabled={isLoadingProducts}
//                   >
//                     <option value="">-- Select Part --</option>
//                     {getAvailableParts().map((p) => (
//                       <option key={p._id} value={p._id}>
//                         {p.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="w-24">
//                   <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                     Qty
//                   </label>
//                   <input
//                     type="number"
//                     id="partQty"
//                     min="1"
//                     defaultValue="1"
//                     className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                   />
//                 </div>
//                 <Button
//                   onClick={() => {
//                     const partId = document.getElementById("partSelect").value;
//                     const qty = document.getElementById("partQty").value;
//                     handleAddPart(partId, qty);
//                     document.getElementById("partSelect").value = "";
//                     document.getElementById("partQty").value = "1";
//                   }}
//                   disabled={!currentRepair.vehicleNumber || isLoadingProducts}
//                 >
//                   <Plus className="h-4 w-4 mr-2" /> Add
//                 </Button>
//               </div>

//               {/* Parts List */}
//               {currentRepair.parts && currentRepair.parts.length > 0 ? (
//                 <div className="overflow-hidden rounded-lg border border-gray-200">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                           Part Name
//                         </th>
//                         <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
//                           Price
//                         </th>
//                         <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
//                           Qty
//                         </th>
//                         <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
//                           Total
//                         </th>
//                         <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
//                           Action
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {(currentRepair.parts || []).map((part, index) => (
//                         <tr key={part._id || index}>
//                           <td className="px-4 py-3 text-sm text-gray-900">
//                             {part.name}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-900 text-right">
//                             Rs. {(part.price || 0).toFixed(2)}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-900 text-right">
//                             {part.quantity || 0}
//                           </td>
//                           <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
//                             Rs.{" "}
//                             {((part.price || 0) * (part.quantity || 0)).toFixed(
//                               2,
//                             )}
//                           </td>
//                           <td className="px-4 py-3 text-right">
//                             <button
//                               onClick={() => handleRemovePart(part._id)}
//                               className="text-red-600 hover:text-red-900"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
//                   <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
//                   <p className="text-sm text-gray-500">
//                     No parts added. Select parts to include in this repair.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </Card>

//           {/* Service Description */}
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-gray-700">
//               Service Description
//             </label>
//             <textarea
//               className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//               rows={3}
//               placeholder="Describe the service performed..."
//               value={currentRepair.serviceDescription || ""}
//               onChange={(e) =>
//                 handleUpdateRepairField("serviceDescription", e.target.value)
//               }
//             />
//           </div>
//         </div>

//         {/* Right Sidebar - Summary */}
//         <div className="space-y-6">
//           {/* Current Repair Summary */}
//           <Card title={`Repair #${currentRepairIndex + 1} Summary`}>
//             <div className="space-y-4">
//               <div className="text-sm space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Vehicle:</span>
//                   <span className="font-medium">
//                     {getSelectedVehicle()?.vehicleNumber || "Not selected"}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Employee:</span>
//                   <span className="font-medium">
//                     {getSelectedEmployee()?.name || "Not assigned"}
//                   </span>
//                 </div>
//               </div>

//               <div className="border-t border-gray-100 pt-4 space-y-3">
//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                     Labor Cost (Rs.)
//                   </label>
//                   <Input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     value={currentRepair.laborCost || 0}
//                     onChange={(e) =>
//                       handleUpdateRepairField("laborCost", e.target.value)
//                     }
//                     placeholder="0.00"
//                   />
//                 </div>
//               </div>

//               <div className="border-t border-gray-100 pt-4 space-y-2">
//                 <div className="flex justify-between text-sm text-gray-600">
//                   <span>Parts Total:</span>
//                   <span>
//                     Rs.{" "}
//                     {(currentRepair.parts || [])
//                       .reduce(
//                         (sum, p) => sum + (p.price || 0) * (p.quantity || 0),
//                         0,
//                       )
//                       .toFixed(2)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-600">
//                   <span>Labor:</span>
//                   <span>
//                     Rs. {(parseFloat(currentRepair.laborCost) || 0).toFixed(2)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
//                   <span>Repair Total:</span>
//                   <span>
//                     Rs. {calculateRepairTotal(currentRepair).toFixed(2)}
//                   </span>
//                 </div>
//               </div>

//               <div className="pt-4 space-y-2 border-t border-gray-100">
//                 <Button
//                   className={`w-full ${
//                     currentRepair.status === "completed"
//                       ? "bg-green-600 hover:bg-green-700"
//                       : "bg-gray-300 hover:bg-gray-400"
//                   }`}
//                   onClick={() => {
//                     const newStatus =
//                       currentRepair.status === "completed"
//                         ? "pending"
//                         : "completed";
//                     const updatedRepairs = repairs.map((r, idx) =>
//                       idx === currentRepairIndex
//                         ? { ...r, status: newStatus }
//                         : r,
//                     );
//                     setRepairs(updatedRepairs);
//                   }}
//                 >
//                   {currentRepair.status === "completed" ? (
//                     <>
//                       <CheckCircle className="h-4 w-4 mr-2" /> Mark as Pending
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle className="h-4 w-4 mr-2" /> Mark as Completed
//                     </>
//                   )}
//                 </Button>
//                 {repairs.length > 1 && (
//                   <Button
//                     variant="secondary"
//                     className="w-full text-red-600 hover:text-red-900"
//                     onClick={() => handleRemoveRepair(currentRepairIndex)}
//                   >
//                     <Trash2 className="h-4 w-4 mr-2" /> Remove Repair
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </Card>

//           {/* Selected Repair Total */}
//           <Card title="Order Summary">
//             <div className="space-y-4">
//               <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
//                 <p className="text-sm text-gray-600 mb-2">
//                   Repair #{currentRepairIndex + 1} Total
//                 </p>
//                 <p className="text-3xl font-bold text-blue-900">
//                   Rs. {calculateRepairTotal(currentRepair).toFixed(2)}
//                 </p>
//               </div>

//               <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
//                 <p className="font-medium mb-2">Total Repairs in Order: {repairs.length}</p>
//                 <p>Grand Total: Rs. {calculateGrandTotal().toFixed(2)}</p>
//               </div>

//               <div className="space-y-3">
//                 <Button
//                   className="w-full"
//                   onClick={handleCreateServiceOrder}
//                   disabled={isLoadingServiceOrder || repairs.length === 0}
//                   rightIcon={<ArrowRight className="h-4 w-4" />}
//                 >
//                   {isLoadingServiceOrder
//                     ? "Creating..."
//                     : "Create Service Order & Invoice"}
//                 </Button>
//                 <Button
//                   variant="secondary"
//                   className="w-full"
//                   onClick={handleSaveDraft}
//                   leftIcon={<Save className="h-4 w-4" />}
//                 >
//                   Save as Draft
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  ArrowRight,
  Save,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { useDispatch, useSelector } from "react-redux";
import { getAllEmployee } from "../../features/employeeSlice";
import { getAllAppointments } from "../../features/appointmentSlice";
import { getAllProducts } from "../../features/productSlice";
import { createServiceOrder } from "../../features/serviceOrderSlice";
import { toast } from "react-toastify";

export function ServiceOrderPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux selectors
  const { employee: employeesFromRedux, isLoading: isLoadingEmployees } =
    useSelector((state) => state.employee);
  const {
    appointments: appointmentsFromRedux,
    isLoading: isLoadingAppointments,
  } = useSelector((state) => state.appointment);
  const { products: productsFromRedux, loading: isLoadingProducts } =
    useSelector((state) => state.product);
  const { isLoading: isLoadingServiceOrder } = useSelector(
    (state) => state.serviceOrder,
  );

  // State for multiple repairs
  const [repairs, setRepairs] = useState([]);
  const [currentRepairIndex, setCurrentRepairIndex] = useState(0);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [draftRepairs, setDraftRepairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllDetails();
    loadDraftRepairs();
  }, []);

  // Update available vehicles when appointments load
  useEffect(() => {
    if (appointmentsFromRedux && appointmentsFromRedux.length > 0) {
      const vehicles = processAvailableVehicles(appointmentsFromRedux);
      setAvailableVehicles(vehicles);
    }
  }, [appointmentsFromRedux]);

  // Initialize repair when data is loaded
  useEffect(() => {
    if (!isLoadingAppointments && !isLoadingEmployees && !isLoadingProducts) {
      if (repairs.length === 0) {
        initializeNewRepair();
      }
      setLoading(false);
    }
  }, [isLoadingAppointments, isLoadingEmployees, isLoadingProducts]);

  const loadAllDetails = async () => {
    try {
      setLoading(true);
      await Promise.all([
        dispatch(getAllEmployee()),
        dispatch(getAllAppointments()),
        dispatch(getAllProducts()),
      ]);
    } catch (error) {
      console.error("Error loading details:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const loadDraftRepairs = () => {
    try {
      const savedDrafts = localStorage.getItem("serviceOrderDrafts");
      if (savedDrafts) {
        const drafts = JSON.parse(savedDrafts);
        if (Array.isArray(drafts)) {
          setDraftRepairs(drafts);
        }
      }
    } catch (error) {
      console.error("Error loading drafts:", error);
    }
  };

  const handleLoadDraft = (draft) => {
    setRepairs(draft.repairs);
    setCurrentRepairIndex(0);
    toast.success("Draft loaded successfully!");
  };

  const handleDeleteDraft = (index) => {
    const updatedDrafts = draftRepairs.filter((_, i) => i !== index);
    setDraftRepairs(updatedDrafts);
    localStorage.setItem("serviceOrderDrafts", JSON.stringify(updatedDrafts));
    toast.success("Draft deleted");
  };

  const processAvailableVehicles = (appointments) => {
    if (!Array.isArray(appointments)) return [];
    console.log("processAvailableVehicles: ", appointments);
    // Filter for unique vehicles and appointments that are ready for service
    const uniqueVehicles = new Map();

    // only include status accepted appointments for now
    appointments.forEach((appt) => {
      if (appt.vehicleNumber && appt.status === "accepted") {
        if (!uniqueVehicles.has(appt.vehicleNumber)) {
          uniqueVehicles.set(appt.vehicleNumber, {
            appointmentId: appt._id,
            registrationNo: appt.vehicleNumber,
            vehicleNumber: appt.vehicleNumber,
            make: appt.vehicleMake || appt.make || "Unknown Make",
            model: appt.vehicleModel || appt.model || "Unknown Model",
            vehicleModel: appt.vehicleModel || appt.model || "Unknown Model",
            owner: appt.customerName || appt.customer?.name || "Unknown Owner",
            customerName:
              appt.customerName || appt.customer?.name || "Unknown Owner",
            customerId: appt.customerId || null,
            appointmentId: appt._id,
            vehicleId: appt.vehicleId,
          });
        }
      }
    });
    // appointments.forEach((appt) => {
    //   // Accept pending, confirmed, or completed appointments
    //   if (appt.vehicleNumber && appt.status === "accepted") {
    //     uniqueVehicles.set(appt.vehicleNumber, {
    //       appointmentId: appt._id,
    //       registrationNo: appt.vehicleNumber,
    //       vehicleNumber: appt.vehicleNumber,
    //       make: appt.vehicleMake || appt.make || "Unknown Make",
    //       model: appt.vehicleModel || appt.model || "Unknown Model",
    //       vehicleModel: appt.vehicleModel || appt.model || "Unknown Model",
    //       owner: appt.customerName || appt.customer?.name || "Unknown Owner",
    //       customerName:
    //         appt.customerName || appt.customer?.name || "Unknown Owner",
    //       customerId: appt.customerId || null,
    //       appointmentId: appt._id,
    //       vehicleId: appt.vehicleId,
    //     });
    //   }
    // });

    return Array.from(uniqueVehicles.values());
  };

  const initializeNewRepair = () => {
    const newRepair = {
      id: Date.now(),
      vehicleNumber: "",
      employeeId: "",
      serviceDescription: "",
      laborCost: 0,
      parts: [], // Initialize with empty array
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setRepairs([newRepair]);
    setCurrentRepairIndex(0);
  };

  const currentRepair = repairs[currentRepairIndex] || {
    id: "",
    vehicleNumber: "",
    employeeId: "",
    serviceDescription: "",
    laborCost: 0,
    parts: [],
    status: "pending",
    createdAt: "",
  };

  // Employee methods
  const getAvailableEmployees = () => {
    return Array.isArray(employeesFromRedux)
      ? employeesFromRedux.filter((emp) => {
          return emp.status !== "inactive";
        })
      : [];
  };

  const getSelectedEmployee = () => {
    return getAvailableEmployees().find(
      (emp) => emp._id === currentRepair.employeeId,
    );
  };

  // Get appointments for selected vehicle
  const getVehicleAppointments = () => {
    return Array.isArray(appointmentsFromRedux)
      ? appointmentsFromRedux.filter((appt) => {
          return appt.vehicleNumber === currentRepair.vehicleNumber;
        })
      : [];
  };

  // Get selected vehicle details from available vehicles
  const getSelectedVehicle = () => {
    return getVehicleAppointments().find(
      (v) => v.vehicleNumber === currentRepair.vehicleNumber,
    );
  };

  // Parts methods
  const getAvailableParts = () => {
    const parts = Array.isArray(productsFromRedux) ? productsFromRedux : [];
    return parts;
  };

  const handleAddPart = (selectedPartId, quantity) => {
    if (!selectedPartId || !currentRepair.vehicleNumber) {
      toast.warning("Please select a vehicle first");
      return;
    }

    const part = getAvailableParts().find((p) => p._id === selectedPartId);
    if (!part) {
      toast.warning("Selected part not found");
      return;
    }

    const updatedRepairs = [...repairs];
    const partQuantity = parseInt(quantity) || 1;

    // Ensure parts array exists
    if (!updatedRepairs[currentRepairIndex].parts) {
      updatedRepairs[currentRepairIndex].parts = [];
    }

    const existingPartIndex = updatedRepairs[
      currentRepairIndex
    ].parts.findIndex((p) => p._id === part._id);

    if (existingPartIndex >= 0) {
      updatedRepairs[currentRepairIndex].parts[existingPartIndex].quantity +=
        partQuantity;
    } else {
      updatedRepairs[currentRepairIndex].parts.push({
        _id: part._id,
        name: part.name,
        price: part.price || 0,
        quantity: partQuantity,
      });
    }

    setRepairs(updatedRepairs);
    toast.success("Part added to repair");
  };

  const handleRemovePart = (partId) => {
    const updatedRepairs = [...repairs];
    if (updatedRepairs[currentRepairIndex]?.parts) {
      updatedRepairs[currentRepairIndex].parts = updatedRepairs[
        currentRepairIndex
      ].parts.filter((p) => p._id !== partId);
      setRepairs(updatedRepairs);
    }
  };

  const handleUpdateRepairField = (field, value) => {
    const updatedRepairs = [...repairs];
    updatedRepairs[currentRepairIndex] = {
      ...updatedRepairs[currentRepairIndex],
      [field]: value,
    };
    setRepairs(updatedRepairs);
  };

  const handleAddNewRepair = () => {
    const newRepair = {
      id: Date.now(),
      vehicleNumber: "",
      employeeId: "",
      serviceDescription: "",
      laborCost: 0,
      parts: [], // Initialize with empty array
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setRepairs([...repairs, newRepair]);
    setCurrentRepairIndex(repairs.length);
  };

  const handleRemoveRepair = (index) => {
    if (repairs.length === 1) {
      toast.warning("You must have at least one repair");
      return;
    }
    const updatedRepairs = repairs.filter((_, i) => i !== index);
    setRepairs(updatedRepairs);
    if (currentRepairIndex >= updatedRepairs.length) {
      setCurrentRepairIndex(updatedRepairs.length - 1);
    }
  };

  const calculateRepairTotal = (repair) => {
    if (!repair) return 0;

    const parts = repair.parts || [];
    const partsTotal = parts.reduce((sum, part) => {
      const price = part.price || 0;
      const quantity = part.quantity || 0;
      return sum + price * quantity;
    }, 0);

    const laborCost = parseFloat(repair.laborCost) || 0;
    return partsTotal + laborCost;
  };

  const calculateGrandTotal = () => {
    if (!repairs || repairs.length === 0) return 0;

    return repairs.reduce(
      (total, repair) => total + calculateRepairTotal(repair),
      0,
    );
  };

  const handleSaveDraft = () => {
    // Validate at least one repair
    if (repairs.length === 0 || !currentRepair.vehicleNumber) {
      toast.error("Please select a vehicle for each repair");
      return;
    }

    // Create draft object with metadata
    const draftObject = {
      id: Date.now(),
      repairs: repairs,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      summary: `${repairs.length} repair(s) - ${repairs.map((r) => r.vehicleNumber).join(", ")}`,
    };

    // Add to drafts list
    const updatedDrafts = [draftObject, ...draftRepairs];
    setDraftRepairs(updatedDrafts);

    // Save to localStorage
    localStorage.setItem("serviceOrderDrafts", JSON.stringify(updatedDrafts));

    // Also keep the old single-draft for backward compatibility
    localStorage.setItem("serviceOrderDraft", JSON.stringify(repairs));

    toast.success("Service order draft saved successfully");
  };

  const handleCreateServiceOrder = async () => {
    // Validate only the current repair
    if (!currentRepair.vehicleNumber || !currentRepair.employeeId) {
      toast.error("Please assign both vehicle and employee to this repair");
      return;
    }

    // Get vehicle details for the current repair
    const currentVehicle = availableVehicles.find(
      (v) => v.vehicleNumber === currentRepair.vehicleNumber,
    );

    console.log("current vehicle: ", currentVehicle);
    

    // Prepare order data with only the current repair
    const orderData = {
      appointmentId: currentVehicle?.appointmentId,
      vehicleNumber: currentRepair.vehicleNumber,
      customerId: currentVehicle?.customerId,
      employeeId: currentRepair.employeeId,
      serviceDescription: currentRepair.serviceDescription,
      laborCost: parseFloat(currentRepair.laborCost) || 0,
      parts: (currentRepair.parts || []).map((part) => ({
        _id: part._id,
        name: part.name,
        price: part.price,
        quantity: part.quantity,
      })),
      status: "completed",
      totalAmount: calculateRepairTotal(currentRepair),
    };

    console.log(orderData);

    try {
      const result = dispatch(createServiceOrder(orderData)).unwrap();
      if (result.payload) {
        toast.success("Service order created successfully!");
    
        // Remove the current repair from the repairs array
        const updatedRepairs = repairs.filter((_, idx) => idx !== currentRepairIndex);
    
        if (updatedRepairs.length > 0) {
          setRepairs(updatedRepairs);
          setCurrentRepairIndex(Math.max(0, currentRepairIndex - 1));
          toast.info("Remaining repairs are still in draft");
        } else {
          // No more repairs, clear everything
          localStorage.removeItem("serviceOrderDraft");
          initializeNewRepair();
        }
    
        // Navigate to invoices
        navigate("/dashboard/invoices/new", {
          state: { serviceOrder: result.payload },
        });
      }
    } catch (error) {
      toast.error("Failed to create service order");
      console.log("Create service order error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Clock className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading service order data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Orders</h1>
          <p className="text-sm text-gray-500">
            Manage multiple vehicle repairs, assign employees, and handle parts
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      {/* Loading States */}
      {(isLoadingAppointments || isLoadingEmployees || isLoadingProducts) && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center justify-center p-4">
            <Clock className="h-5 w-5 text-blue-600 mr-2 animate-pulse" />
            <p className="text-sm text-blue-700">Loading data...</p>
          </div>
        </Card>
      )}

      {/* Saved Drafts Section */}
      {draftRepairs.length > 0 && (
        <Card title="Saved Drafts">
          <div className="space-y-3">
            {draftRepairs.map((draft, index) => (
              <div
                key={draft.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{draft.summary}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {new Date(draft.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    className="px-3 py-1 text-sm"
                    onClick={() => handleLoadDraft(draft)}
                  >
                    Load
                  </Button>
                  <button
                    onClick={() => handleDeleteDraft(index)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Repairs Tabs */}
      <Card>
        <div className="flex gap-2 flex-wrap border-b border-gray-200 pb-4">
          {repairs.map((repair, index) => (
            <button
              key={repair.id || index}
              onClick={() => setCurrentRepairIndex(index)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors relative ${
                currentRepairIndex === index
                  ? "bg-blue-100 text-blue-700 border-b-2 border-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Repair #{index + 1}
              {repair.vehicleNumber && (
                <span className="text-xs ml-2">({repair.vehicleNumber})</span>
              )}
              {repair.status === "completed" && (
                <CheckCircle className="h-4 w-4 absolute top-1 right-1 text-green-600" />
              )}
            </button>
          ))}
          <button
            onClick={handleAddNewRepair}
            className="px-4 py-2 rounded-lg font-medium text-sm bg-green-100 text-green-700 hover:bg-green-200 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Repair
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle & Employee Selection */}
          <Card title="Vehicle & Employee Assignment">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Vehicle Selection */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Select Vehicle
                  </label>
                  <select
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={currentRepair.vehicleNumber || ""}
                    onChange={(e) =>
                      handleUpdateRepairField("vehicleNumber", e.target.value)
                    }
                    disabled={isLoadingAppointments}
                  >
                    <option value="">-- Select a Vehicle --</option>
                    {availableVehicles.length === 0 &&
                      !isLoadingAppointments && (
                        <option value="" disabled>
                          No vehicles available
                        </option>
                      )}
                    {availableVehicles.map((v) => {
                      return (
                        <option key={v.vehicleNumber} value={v.vehicleNumber}>
                          {v.vehicleNumber} - {v.customerName}
                        </option>
                      );
                    })}
                  </select>
                  {isLoadingAppointments && (
                    <p className="mt-1 text-xs text-gray-500">
                      Loading vehicles...
                    </p>
                  )}
                </div>

                {/* Employee Assignment */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Assign Employee
                  </label>
                  <select
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={currentRepair.employeeId || ""}
                    onChange={(e) =>
                      handleUpdateRepairField("employeeId", e.target.value)
                    }
                    disabled={isLoadingEmployees}
                  >
                    <option value="">-- Assign Employee --</option>
                    {getAvailableEmployees().map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} - {emp.position || "Technician"}
                      </option>
                    ))}
                  </select>
                  {isLoadingEmployees && (
                    <p className="mt-1 text-xs text-gray-500">
                      Loading employees...
                    </p>
                  )}
                </div>
              </div>

              {/* Vehicle Details Summary */}
              {getSelectedVehicle() && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900">
                        Vehicle Details
                      </p>
                      <p className="text-blue-700 text-xs mt-1">
                        {getSelectedVehicle().vehicleNumber}{" "}
                        {getSelectedVehicle().vehicleModel} -{" "}
                        {getSelectedVehicle().customerName}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Assigned Employee Info */}
              {getSelectedEmployee() && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-green-900">
                        Assigned Employee
                      </p>
                      <p className="text-green-700 text-xs mt-1">
                        {getSelectedEmployee().name} (
                        {getSelectedEmployee().position || "Technician"})
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Parts Management */}
          <Card title={`Parts & Materials - Repair #${currentRepairIndex + 1}`}>
            <div className="space-y-4">
              {/* Add Parts Form */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Add Part
                  </label>
                  <select
                    id="partSelect"
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={isLoadingProducts}
                  >
                    <option value="">-- Select Part --</option>
                    {getAvailableParts().map((p) => (
                      <option key={p._id} value={p._id}>
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
                    id="partQty"
                    min="1"
                    defaultValue="1"
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <Button
                  onClick={() => {
                    const partId = document.getElementById("partSelect").value;
                    const qty = document.getElementById("partQty").value;
                    handleAddPart(partId, qty);
                    document.getElementById("partSelect").value = "";
                    document.getElementById("partQty").value = "1";
                  }}
                  disabled={!currentRepair.vehicleNumber || isLoadingProducts}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
              </div>

              {/* Parts List */}
              {currentRepair.parts && currentRepair.parts.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Part Name
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Price
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Qty
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Total
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(currentRepair.parts || []).map((part, index) => (
                        <tr key={part._id || index}>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {part.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">
                            Rs. {(part.price || 0).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">
                            {part.quantity || 0}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                            Rs.{" "}
                            {((part.price || 0) * (part.quantity || 0)).toFixed(
                              2,
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleRemovePart(part._id)}
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
                  <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    No parts added. Select parts to include in this repair.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Service Description */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Service Description
            </label>
            <textarea
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={3}
              placeholder="Describe the service performed..."
              value={currentRepair.serviceDescription || ""}
              onChange={(e) =>
                handleUpdateRepairField("serviceDescription", e.target.value)
              }
            />
          </div>
        </div>

        {/* Right Sidebar - Summary */}
        <div className="space-y-6">
          {/* Current Repair Summary */}
          <Card title={`Repair #${currentRepairIndex + 1} Summary`}>
            <div className="space-y-4">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium">
                    {getSelectedVehicle()?.vehicleNumber || "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Employee:</span>
                  <span className="font-medium">
                    {getSelectedEmployee()?.name || "Not assigned"}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Labor Cost (Rs.)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0"
                    value={currentRepair.laborCost}
                    onChange={(e) =>
                      handleUpdateRepairField("laborCost", e.target.value)
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Parts Total:</span>
                  <span>
                    Rs.{" "}
                    {(currentRepair.parts || [])
                      .reduce(
                        (sum, p) => sum + (p.price || 0) * (p.quantity || 0),
                        0,
                      )
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Labor:</span>
                  <span>
                    Rs. {(parseFloat(currentRepair.laborCost) || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Repair Total:</span>
                  <span>
                    Rs. {calculateRepairTotal(currentRepair).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-4 space-y-2 border-t border-gray-100">
                <Button
                  className={`w-full ${
                    currentRepair.status === "completed"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  onClick={() => {
                    const newStatus =
                      currentRepair.status === "completed"
                        ? "pending"
                        : "completed";
                    const updatedRepairs = repairs.map((r, idx) =>
                      idx === currentRepairIndex
                        ? { ...r, status: newStatus }
                        : r,
                    );
                    setRepairs(updatedRepairs);
                  }}
                >
                  {currentRepair.status === "completed" ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" /> Mark as Pending
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" /> Mark as Completed
                    </>
                  )}
                </Button>
                {repairs.length > 1 && (
                  <Button
                    variant="secondary"
                    className="w-full text-red-600 hover:text-red-900"
                    onClick={() => handleRemoveRepair(currentRepairIndex)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Remove Repair
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Selected Repair Total */}
          <Card title="Order Summary">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Current Repair Total
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  Rs. {calculateRepairTotal(currentRepair).toFixed(2)}
                </p>
              </div>

              {/* <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium mb-2">
                  Total Repairs in Draft: {repairs.length}
                </p>
                <p>All Repairs Total: Rs. {calculateGrandTotal().toFixed(2)}</p>
              </div> */}

              <div className="space-y-3">
                <Button
                  className="w-full"
                  onClick={handleCreateServiceOrder}
                  disabled={isLoadingServiceOrder || repairs.length === 0}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  {isLoadingServiceOrder
                    ? "Completing..."
                    : "Complete Repair"}
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={handleSaveDraft}
                  leftIcon={<Save className="h-4 w-4" />}
                >
                  Save All as Draft
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
