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
  Download,
  Printer,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { useDispatch, useSelector } from "react-redux";
import { getAllEmployee } from "../../features/employeeSlice";
import { getAllAppointments } from "../../features/appointmentSlice";
import { getAllProducts } from "../../features/productSlice";
import { getAllServiceTypes, createServiceType, selectServiceTypes } from "../../features/serviceTypeSlice";
import { getAllOtherCharges, selectOtherCharges } from "../../features/otherChargesSlice";
import { createServiceOrder } from "../../features/serviceOrderSlice";
import { toast } from "react-toastify";
import {
  downloadServiceHistoryAsPDF,
  printServiceHistory,
} from "../../utils/serviceHistoryPdfUtils";

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
  const serviceTypes = useSelector(selectServiceTypes);
  const otherCharges = useSelector(selectOtherCharges);

  // State for multiple repairs
  const [repairs, setRepairs] = useState([]);
  const [currentRepairIndex, setCurrentRepairIndex] = useState(0);
  const [showNewServiceTypeForm, setShowNewServiceTypeForm] = useState(false);
  const [activeServiceTypeEntryId, setActiveServiceTypeEntryId] = useState(null);
  const [newServiceTypeName, setNewServiceTypeName] = useState("");
  const [newServiceTypePrice, setNewServiceTypePrice] = useState("");
  const [isSavingServiceType, setIsSavingServiceType] = useState(false);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [draftRepairs, setDraftRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedServiceOrder, setCompletedServiceOrder] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    loadAllDetails();
    loadDraftRepairs();
    generateInvoiceNumber();
  }, []);

  useEffect(() => {
    dispatch(getAllOtherCharges());
  }, [dispatch]);

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
        dispatch(getAllServiceTypes()),
        dispatch(getAllOtherCharges()),
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

  // Genarate random invoice number
  const generateInvoiceNumber = () => {
    const randomNumber = Math.floor(Math.random() * 1000000);
    setInvoiceNumber('INV-' + randomNumber);
  };

  const processAvailableVehicles = (appointments) => {
    if (!Array.isArray(appointments)) return [];
    // Filter for unique vehicles and appointments that are ready for service
    const uniqueVehicles = new Map();

    // Get today's date without time component
    const todayString = new Date().toISOString().split('T')[0];

    // only include status confirmed appointments for today
    appointments.forEach((appt) => {
      // Check if appointment is for today and has confirmed status
      const appointmentDateString = appt.appointmentDate ? appt.appointmentDate.split('T')[0] : null;
      
      if (appt.vehicleNumber && appt.status === "confirmed") {
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
            vehicleId: appt.vehicleId,
            invoiceNumber: appt.invoiceNumber,
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

  const createServiceTypeEntry = (overrides = {}) => ({
    id: Date.now() + Math.random(),
    serviceTypeId: "",
    serviceType: "",
    servicePrice: 0,
    serviceRate: 0,
    laborCost: 0,
    description: "",
    ...overrides,
  });

  const buildRepairWithServiceTypeEntries = (repair) => {
    const entries = Array.isArray(repair?.serviceTypeEntries) && repair.serviceTypeEntries.length > 0
      ? repair.serviceTypeEntries
      : [createServiceTypeEntry()];

    const totalLaborCost = entries.reduce((sum, entry) => {
      return sum + (parseFloat(entry.laborCost) || 0);
    }, 0);

    return {
      ...repair,
      serviceTypeEntries: entries,
      serviceTypeId: entries[0]?.serviceTypeId || "",
      serviceType: entries[0]?.serviceType || "",
      servicePrice: entries[0]?.servicePrice || 0,
      laborCost: totalLaborCost,
    };
  };

  const initializeNewRepair = () => {
    const newRepair = buildRepairWithServiceTypeEntries({
      id: Date.now(),
      vehicleNumber: "",
      employeeId: "",
      serviceTypeId: "",
      servicePrice: 0,
      serviceDescription: "",
      laborCost: 0,
      billDiscountPercent: 0,
      paymentType: "",
      otherCharges: [], // Array to store multiple charges
      parts: [], // Initialize with empty array
      status: "pending",
      createdAt: new Date().toISOString(),
      invoiceNumber: "",
      serviceTypeEntries: [createServiceTypeEntry()],
    });
    setRepairs([newRepair]);
    setCurrentRepairIndex(0);
  };

  const currentRepair = repairs[currentRepairIndex] || {
    id: "",
    vehicleNumber: "",
    employeeId: "",
    serviceTypeId: "",
    servicePrice: 0,
    serviceDescription: "",
    laborCost: 4500,
    billDiscountPercent: 0,
    paymentType: "",
    otherCharges: [],
    parts: [],
    status: "pending",
    createdAt: "",
    serviceType: "",
    serviceTypeEntries: [createServiceTypeEntry()],
    invoiceNumber: "",
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

  const getPartLineTotal = (part) => {
    const price = parseFloat(part?.price) || 0;
    const quantity = parseInt(part?.quantity, 10) || 0;
    const discountPercent = parseFloat(part?.discountPercent) || 0;
    const discountedAmount = price * quantity * (1 - Math.max(0, discountPercent) / 100);
    return discountedAmount;
  };

  const handleAddPart = (selectedPartId, quantity, discountPercent) => {
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
    const partQuantity = parseInt(quantity, 10) || 1;
    const parsedDiscount = Math.max(0, parseFloat(discountPercent) || 0);

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
        discountPercent: parsedDiscount,
      });
    }

    setRepairs(updatedRepairs);
    toast.success("Part added to repair");
  };

  const handleUpdatePartDiscount = (partId, discountPercent) => {
    const updatedRepairs = [...repairs];
    const parts = updatedRepairs[currentRepairIndex]?.parts || [];
    const partIndex = parts.findIndex((part) => part._id === partId);

    if (partIndex >= 0) {
      const parsedDiscount = Math.max(0, parseFloat(discountPercent) || 0);
      updatedRepairs[currentRepairIndex].parts[partIndex].discountPercent = parsedDiscount;
      setRepairs(updatedRepairs);
    }
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

  const handleAddServiceTypeEntry = () => {
    const updatedRepairs = [...repairs];
    const currentRepairData = updatedRepairs[currentRepairIndex] || {};
    const entries = [
      ...(currentRepairData.serviceTypeEntries || []),
      createServiceTypeEntry(),
    ];

    updatedRepairs[currentRepairIndex] = buildRepairWithServiceTypeEntries({
      ...currentRepairData,
      serviceTypeEntries: entries,
    });
    setRepairs(updatedRepairs);
  };

  const handleRemoveServiceTypeEntry = (entryId) => {
    const updatedRepairs = [...repairs];
    const currentRepairData = updatedRepairs[currentRepairIndex] || {};
    const entries = (currentRepairData.serviceTypeEntries || []).filter(
      (entry) => entry.id !== entryId,
    );

    updatedRepairs[currentRepairIndex] = buildRepairWithServiceTypeEntries({
      ...currentRepairData,
      serviceTypeEntries: entries.length > 0 ? entries : [createServiceTypeEntry()],
    });
    setRepairs(updatedRepairs);
  };

  const handleServiceTypeEntryChange = (entryId, serviceTypeId) => {
    if (serviceTypeId === "__other__") {
      setActiveServiceTypeEntryId(entryId);
      setShowNewServiceTypeForm(true);
      setNewServiceTypeName("");
      setNewServiceTypePrice("");
      return;
    }

    setShowNewServiceTypeForm(false);
    const selectedServiceType = serviceTypes.find((st) => st._id === serviceTypeId);
    const updatedRepairs = [...repairs];
    const currentRepairData = updatedRepairs[currentRepairIndex] || {};
    const price = selectedServiceType ? parseFloat(selectedServiceType.price) || 0 : 0;
    const entries = (currentRepairData.serviceTypeEntries || []).map((entry) => {
      if (entry.id !== entryId) return entry;
      return {
        ...entry,
        serviceTypeId: serviceTypeId,
        serviceType: selectedServiceType?.name || "General Service",
        servicePrice: price,
        serviceRate: price,
        laborCost: price,
      };
    });

    updatedRepairs[currentRepairIndex] = buildRepairWithServiceTypeEntries({
      ...currentRepairData,
      serviceTypeEntries: entries.length > 0 ? entries : [createServiceTypeEntry()],
    });
    setRepairs(updatedRepairs);
  };

  const handleServiceTypeEntryDescriptionChange = (entryId, description) => {
    const updatedRepairs = [...repairs];
    const currentRepairData = updatedRepairs[currentRepairIndex] || {};
    const entries = (currentRepairData.serviceTypeEntries || []).map((entry) => {
      if (entry.id !== entryId) return entry;
      return {
        ...entry,
        description,
      };
    });

    updatedRepairs[currentRepairIndex] = buildRepairWithServiceTypeEntries({
      ...currentRepairData,
      serviceTypeEntries: entries.length > 0 ? entries : [createServiceTypeEntry()],
    });
    setRepairs(updatedRepairs);
  };

  const handleServiceTypeEntryChargeChange = (entryId, value) => {
    const updatedRepairs = [...repairs];
    const currentRepairData = updatedRepairs[currentRepairIndex] || {};
    const entries = (currentRepairData.serviceTypeEntries || []).map((entry) => {
      if (entry.id !== entryId) return entry;
      const parsedValue = parseFloat(value);
      return {
        ...entry,
        laborCost: !isNaN(parsedValue) && parsedValue >= 0 ? parsedValue : 0,
        serviceAmount: !isNaN(parsedValue) && parsedValue >= 0 ? parsedValue : 0,
      };
    });

    updatedRepairs[currentRepairIndex] = buildRepairWithServiceTypeEntries({
      ...currentRepairData,
      serviceTypeEntries: entries.length > 0 ? entries : [createServiceTypeEntry()],
    });
    setRepairs(updatedRepairs);
  };

  const handleServiceTypeEntryRateChange = (entryId, value) => {
    const updatedRepairs = [...repairs];
    const currentRepairData = updatedRepairs[currentRepairIndex] || {};
    const entries = (currentRepairData.serviceTypeEntries || []).map((entry) => {
      if (entry.id !== entryId) return entry;
      const parsedValue = parseFloat(value);
      return {
        ...entry,
        serviceRate: !isNaN(parsedValue) && parsedValue >= 0 ? parsedValue : 0,
        servicePrice: !isNaN(parsedValue) && parsedValue >= 0 ? parsedValue : 0,
        laborCost: !isNaN(parsedValue) && parsedValue >= 0 ? parsedValue : 0,
      };
    });

    updatedRepairs[currentRepairIndex] = buildRepairWithServiceTypeEntries({
      ...currentRepairData,
      serviceTypeEntries: entries.length > 0 ? entries : [createServiceTypeEntry()],
    });
    setRepairs(updatedRepairs);
  };

  const handleSaveNewServiceType = async () => {
    if (!newServiceTypeName.trim()) {
      toast.error("Please enter a service type name");
      return;
    }
    const price = parseFloat(newServiceTypePrice);
    if (isNaN(price) || price < 0) {
      toast.error("Please enter a valid price");
      return;
    }
    setIsSavingServiceType(true);
    try {
      const result = await dispatch(
        createServiceType({ name: newServiceTypeName.trim(), price })
      ).unwrap();
      const updatedRepairs = [...repairs];
      const currentRepairData = updatedRepairs[currentRepairIndex] || {};
      const entries = (currentRepairData.serviceTypeEntries || []).map((entry) => {
        if (entry.id !== activeServiceTypeEntryId) return entry;
        return {
          ...entry,
          serviceTypeId: result._id,
          serviceType: result.name,
          servicePrice: result.price || 0,
          serviceRate: result.price || 0,
          laborCost: result.price || 0,
        };
      });

      updatedRepairs[currentRepairIndex] = buildRepairWithServiceTypeEntries({
        ...currentRepairData,
        serviceTypeEntries: entries.length > 0 ? entries : [createServiceTypeEntry({
          serviceTypeId: result._id,
          serviceType: result.name,
          servicePrice: result.price || 0,
          laborCost: result.price || 0,
        })],
      });
      setRepairs(updatedRepairs);
      setShowNewServiceTypeForm(false);
      setActiveServiceTypeEntryId(null);
      setNewServiceTypeName("");
      setNewServiceTypePrice("");
      dispatch(getAllServiceTypes());
      toast.success(`Service type "${result.name}" created and selected`);
    } catch (error) {
      toast.error("Failed to save service type");
    } finally {
      setIsSavingServiceType(false);
    }
  };

  const handleAddNewRepair = () => {
    const newRepair = buildRepairWithServiceTypeEntries({
      id: Date.now(),
      vehicleNumber: "",
      employeeId: "",
      serviceTypeId: "",
      servicePrice: 0,
      serviceDescription: "",
      laborCost: 0,
      billDiscountPercent: 0,
      paymentType: "",
      otherCharges: [], // Array to store multiple charges
      parts: [], // Initialize with empty array
      status: "pending",
      createdAt: new Date().toISOString(),
      invoiceNumber: "",
      serviceTypeEntries: [createServiceTypeEntry()],
    });
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

  const getRepairSubtotal = (repair) => {
    if (!repair) return 0;

    const parts = repair.parts || [];
    const partsTotal = parts.reduce((sum, part) => {
      return sum + getPartLineTotal(part);
    }, 0);

    const laborCost = parseFloat(repair.laborCost) || 0;
    return partsTotal + laborCost;
  };

  const getBillDiscountAmount = (repair) => {
    if (!repair) return 0;
    const subtotal = getRepairSubtotal(repair);
    const discountPercent = parseFloat(repair.billDiscountPercent) || 0;
    return Math.max(0, subtotal * (Math.min(100, Math.max(0, discountPercent)) / 100));
  };

  const getSubtotalAfterDiscount = (repair) => {
    if (!repair) return 0;
    return getRepairSubtotal(repair) - getBillDiscountAmount(repair);
  };

  const calculateCardProcessingFee = (repair) => {
    if (!repair || repair.paymentType !== "card") return 0;
    const subtotal = getSubtotalAfterDiscount(repair);
    return subtotal * 0.03;
  };

  const getOtherChargeAmount = (repair) => {
    if (!repair || !repair.otherCharges || repair.otherCharges.length === 0) return 0;
    return repair.otherCharges.reduce((total, charge) => {
      return total + (parseFloat(charge.amount) || 0);
    }, 0);
  };

  const handleAddOtherCharge = (chargeId) => {
    if (!chargeId) return;
    
    const selectedCharge = otherCharges?.find((c) => c._id === chargeId);
    if (!selectedCharge) return;

    // Check if charge already added
    if (currentRepair.otherCharges?.some((c) => c._id === chargeId)) {
      toast.warning("This charge is already added");
      return;
    }

    const updatedRepairs = [...repairs];
    updatedRepairs[currentRepairIndex] = {
      ...updatedRepairs[currentRepairIndex],
      otherCharges: [
        ...(updatedRepairs[currentRepairIndex].otherCharges || []),
        {
          _id: selectedCharge._id,
          chargeType: selectedCharge.chargeType || selectedCharge.type,
          amount: parseFloat(selectedCharge.amount) || 0,
        },
      ],
    };
    setRepairs(updatedRepairs);
    toast.success("Charge added");
  };

  const handleRemoveOtherCharge = (chargeId) => {
    const updatedRepairs = [...repairs];
    updatedRepairs[currentRepairIndex] = {
      ...updatedRepairs[currentRepairIndex],
      otherCharges: (updatedRepairs[currentRepairIndex].otherCharges || []).filter(
        (c) => c._id !== chargeId
      ),
    };
    setRepairs(updatedRepairs);
    toast.success("Charge removed");
  };

  const handleUpdateOtherChargeAmount = (chargeId, newAmount) => {
    const updatedRepairs = [...repairs];
    const chargeIndex = (updatedRepairs[currentRepairIndex].otherCharges || []).findIndex(
      (c) => c._id === chargeId
    );
    if (chargeIndex >= 0) {
      const parsedAmount = parseFloat(newAmount);
      updatedRepairs[currentRepairIndex].otherCharges[chargeIndex].amount =
        !isNaN(parsedAmount) && parsedAmount >= 0 ? parsedAmount : 0;
      setRepairs(updatedRepairs);
    }
  };

  const calculateRepairTotal = (repair) => {
    if (!repair) return 0;
    
    const subtotal = getSubtotalAfterDiscount(repair);
    const fee = calculateCardProcessingFee(repair);
    const otherChargeAmount = getOtherChargeAmount(repair);
    return subtotal + fee + otherChargeAmount;
  };

  const calculateTotalWithFee = (repair) => {
    return calculateRepairTotal(repair);
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

    const serviceTypeEntries = (currentRepair.serviceTypeEntries || [])
      .filter((entry) => entry.serviceTypeId || entry.description)
      .map((entry) => ({
        ...entry,
        description: entry.description?.trim() || "",
      }));

    const serviceTypeSummary = serviceTypeEntries
      .map((entry) => {
        const detail = entry.description?.trim();
        return detail ? `${entry.serviceType || "Service Type"}: ${detail}` : entry.serviceType || "Service Type";
      })
      .join(" | ");

    // const combinedServiceDescription = [currentRepair.serviceDescription?.trim(), serviceTypeSummary]
    //   .filter(Boolean)
    //   .join(" | ");

    const combinedServiceDescription = currentRepair.serviceDescription?.trim()

    // Validate that parts have been added
    // if (!currentRepair.parts || currentRepair.parts.length === 0) {
    //   toast.error("Please add Parts & Materials before completing the repair");
    //   return;
    // }

    // Get vehicle details for the current repair
    const currentVehicle = availableVehicles.find(
      (v) => v.vehicleNumber === currentRepair.vehicleNumber,
    );

    // Prepare order data with only the current repair
    const orderData = {
      appointmentId: currentVehicle?.appointmentId,
      vehicleNumber: currentRepair.vehicleNumber,
      customerId: currentVehicle?.customerId,
      employeeId: currentRepair.employeeId,
      serviceDescription: combinedServiceDescription,
      laborCost: parseFloat(currentRepair.laborCost) || 0,
      paymentType: currentRepair.paymentType || "",
      cardProcessingFee: calculateCardProcessingFee(currentRepair),
      otherCharges: (currentRepair.otherCharges || []).map((charge) => ({
        _id: charge._id,
        chargeType: charge.chargeType,
        amount: charge.amount,
      })), // Total of all charges
      parts: (currentRepair.parts || []).map((part) => ({
        _id: part._id,
        name: part.name,
        price: part.price,
        quantity: part.quantity,
        discountPercent: part.discountPercent || 0,
      })),
      billDiscountPercent: parseFloat(currentRepair.billDiscountPercent) || 0,
      status: "completed",
      totalAmount: calculateRepairTotal(currentRepair),
      serviceTypeId: serviceTypeEntries[0]?.serviceTypeId || currentRepair.serviceTypeId,
      serviceType: serviceTypeEntries[0]?.serviceType || currentRepair.serviceType || 'General Service',
      serviceTypeEntries,
      invoiceNumber: invoiceNumber,
    };

    try {
      const result = await dispatch(createServiceOrder(orderData)).unwrap();
      
      // Get employee details for complete service order
      const selectedEmployee = getAvailableEmployees().find(
        (emp) => emp._id === currentRepair.employeeId,
      );

      // Enrich the service order with complete details for PDF generation
      const enrichedServiceOrder = {
        ...result,
        vehicleNumber: currentRepair.vehicleNumber,
        customerId: currentVehicle?.customerId ? {
          name: currentVehicle?.customerName || "Unknown Customer",
          contactNumber: currentVehicle?.contactNumber || "N/A",
          email: currentVehicle?.email || "N/A",
          ...currentVehicle,
        } : null,
        employeeId: selectedEmployee ? {
          name: selectedEmployee.name,
          position: selectedEmployee.position || "Technician",
          ...selectedEmployee,
        } : null,
        serviceDescription: combinedServiceDescription,
        laborCost: parseFloat(currentRepair.laborCost) || 0,
        paymentType: currentRepair.paymentType || "",
        cardProcessingFee: calculateCardProcessingFee(currentRepair),
        otherCharges: currentRepair.otherCharges || [],
        otherChargeAmount: getOtherChargeAmount(currentRepair),
        parts: currentRepair.parts || [],
        status: "completed",
        totalAmount: calculateRepairTotal(currentRepair),
        serviceType: serviceTypeEntries[0]?.serviceType || currentRepair.serviceType,
        serviceTypeId: serviceTypeEntries[0]?.serviceTypeId || currentRepair.serviceTypeId,
        serviceTypeEntries,
        invoiceNumber: invoiceNumber,
      };

      // Store the completed service order for PDF download/print
      setCompletedServiceOrder(enrichedServiceOrder);
      
      // Success handling
      toast.success(`✓ Repair Completed!\nVehicle: ${currentRepair.vehicleNumber}\nTotal: Rs. ${calculateRepairTotal(currentRepair).toFixed(2)}`);
  
      // Remove the current repair from the repairs array
      const updatedRepairs = repairs.filter((_, idx) => idx !== currentRepairIndex);
  
      if (updatedRepairs.length > 0) {
        setRepairs(updatedRepairs);
        setCurrentRepairIndex(Math.max(0, currentRepairIndex - 1));
      } else {
        // No more repairs, clear everything
        localStorage.removeItem("serviceOrderDraft");
        initializeNewRepair();
      }
    } catch (error) {
      toast.error("Failed to create service order");
      console.error("Create service order error:", error);
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
    <div className="relative space-y-6">
      {/* Full-page loading overlay for service order creation */}
      {isLoadingServiceOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center shadow-xl">
            <Clock className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-900">Completing Service Order</p>
            <p className="text-sm text-gray-600 mt-2">Please wait while we process your request...</p>
          </div>
        </div>
      )}

      {/* Service Completed Success Modal */}
      {completedServiceOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full bg-white shadow-2xl">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Completed!</h2>
              <p className="text-sm text-gray-600">
                Vehicle <span className="font-semibold">{completedServiceOrder.vehicleNumber}</span> service order has been successfully created.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{completedServiceOrder._id?.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-lg text-green-600">
                    Rs. {(completedServiceOrder.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-4 text-center">You can now download or print the service receipt</p>

            <div className="space-y-3">
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => downloadServiceHistoryAsPDF(
                  completedServiceOrder,
                  `Service_History_${completedServiceOrder.vehicleNumber}.pdf`
                )}
                rightIcon={<Download className="h-4 w-4" />}
              >
                Download as PDF
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => printServiceHistory(completedServiceOrder)}
                rightIcon={<Printer className="h-4 w-4" />}
              >
                Print Receipt
              </Button>
              <button
                onClick={() => {
                  setCompletedServiceOrder(null);
                  setTimeout(() => {
                    window.location.reload();
                  }, 500);
                }}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Continue to Next Service
              </button>
            </div>
          </Card>
        </div>
      )}

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
              onClick={() => { setCurrentRepairIndex(index); setShowNewServiceTypeForm(false); }}
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
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Select Vehicle
                  </label>
                  <select
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Assign Employee
                  </label>
                  <select
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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

                {/* Service Type Selection */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-medium text-gray-700">
                      Select Service Type
                    </label>
                    <button
                      type="button"
                      onClick={handleAddServiceTypeEntry}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      + Add Service Type
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(currentRepair.serviceTypeEntries || []).map((entry, entryIndex) => (
                      <div key={entry.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <p className="text-xs font-medium text-gray-700">
                            Service Type #{entryIndex + 1}
                          </p>
                          {(currentRepair.serviceTypeEntries || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveServiceTypeEntry(entry.id)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <select
                          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={showNewServiceTypeForm && activeServiceTypeEntryId === entry.id ? "__other__" : (entry.serviceTypeId || "")}
                          onChange={(e) => handleServiceTypeEntryChange(entry.id, e.target.value)}
                        >
                          <option value="">-- Select Service Type --</option>
                          {serviceTypes && serviceTypes.length > 0 ? (
                            serviceTypes.map((st) => (
                              <option key={st._id} value={st._id}>
                                {st.name} - Rs. {(st.price || 0).toFixed(2)}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              No service types available
                            </option>
                          )}
                          <option value="__other__">Other (Add New)</option>
                        </select>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">
                              Rate (Rs.)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={parseFloat(entry.serviceRate ?? entry.laborCost ?? 0).toFixed(2)}
                              onChange={(e) => handleServiceTypeEntryRateChange(entry.id, e.target.value)}
                              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">
                              Amount (Rs.)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={parseFloat(entry.laborCost ?? entry.serviceAmount ?? 0).toFixed(2)}
                              onChange={(e) => handleServiceTypeEntryChargeChange(entry.id, e.target.value)}
                              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="mt-2">
                          <label className="mb-1 block text-xs font-medium text-gray-600">
                            Details
                          </label>
                          <textarea
                            rows={2}
                            value={entry.description || ""}
                            onChange={(e) => handleServiceTypeEntryDescriptionChange(entry.id, e.target.value)}
                            placeholder="Describe what was done, such as 'Shock mount replaced - back left side'"
                            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {showNewServiceTypeForm && (
                    <div className="mt-3 p-3 border border-blue-200 rounded-lg bg-blue-50 space-y-3">
                      <p className="text-xs font-medium text-blue-700">New Service Type</p>
                      <input
                        type="text"
                        placeholder="Service type name"
                        value={newServiceTypeName}
                        onChange={(e) => setNewServiceTypeName(e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Price (Rs.)"
                        min="0"
                        step="0.01"
                        value={newServiceTypePrice}
                        onChange={(e) => setNewServiceTypePrice(e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveNewServiceType}
                          disabled={isSavingServiceType}
                          className="flex-1 px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors"
                        >
                          {isSavingServiceType ? "Saving..." : "Save & Select"}
                        </button>
                        <button
                          onClick={() => {  
                            setShowNewServiceTypeForm(false);
                            setActiveServiceTypeEntryId(null);
                            setNewServiceTypeName("");
                            setNewServiceTypePrice("");
                          }}
                          className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Type Selection */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Payment Type
                  </label>
                  <select
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={currentRepair.paymentType || ""}
                    onChange={(e) =>
                      handleUpdateRepairField("paymentType", e.target.value)
                    }
                  >
                    <option value="">-- Select Payment Type --</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank-transfer">Bank Transfer</option>
                  </select>
                </div>

                {/* Other Charges Selection */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Other Charges (Optional)
                  </label>
                  <select
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddOtherCharge(e.target.value);
                        e.target.value = "";
                      }
                    }}
                  >
                    <option value="">-- Add Charge --</option>
                    {otherCharges && otherCharges.length > 0 ? (
                      otherCharges
                        .filter(charge => !currentRepair.otherCharges?.some(c => c._id === charge._id))
                        .map((charge) => (
                          <option key={charge._id} value={charge._id}>
                            {charge.chargeType || charge.type} - Rs. {(parseFloat(charge.amount) || 0).toFixed(2)}
                          </option>
                        ))
                    ) : (
                      <option value="" disabled>
                        No charges available
                      </option>
                    )}
                  </select>
                </div>
              </div>

              {/* Other Charges List */}
              {currentRepair.otherCharges && currentRepair.otherCharges.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Charges</h4>
                  <div className="space-y-2">
                    {currentRepair.otherCharges.map((charge) => (
                      <div
                        key={charge._id}
                        className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-xs font-medium text-purple-900">{charge.chargeType}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={parseFloat(charge.amount) || 0}
                            onChange={(e) =>
                              handleUpdateOtherChargeAmount(charge._id, e.target.value)
                            }
                            className="w-24 px-2 py-1 border border-purple-300 rounded text-xs text-right"
                          />
                          <button
                            onClick={() => handleRemoveOtherCharge(charge._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vehicle Details Summary */}
              {getSelectedVehicle() && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
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
                    <div className="text-xs">
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
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Add Part
                  </label>
                  <select
                    id="partSelect"
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Qty
                  </label>
                  <input
                    type="number"
                    id="partQty"
                    min="1"
                    defaultValue="1"
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="w-14">
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Disc %
                  </label>
                  <input
                    type="number"
                    id="partDiscount"
                    min="0"
                    max="100"
                    step="1"
                    defaultValue="0"
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <Button
                  onClick={() => {
                    const partId = document.getElementById("partSelect").value;
                    const qty = document.getElementById("partQty").value;
                    const discount = document.getElementById("partDiscount").value;
                    handleAddPart(partId, qty, discount);
                    document.getElementById("partSelect").value = "";
                    document.getElementById("partQty").value = "1";
                    document.getElementById("partDiscount").value = "0";
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
                          Disc %
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
                          <td className="px-4 py-3 text-xs text-gray-900">
                            {part.name}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-900 text-right">
                            Rs. {(part.price || 0).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-900 text-right">
                            {part.quantity || 0}
                          </td>
                          <td className="px-3 py-3 text-xs text-gray-900 text-right">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={parseFloat(part.discountPercent) || 0}
                              onChange={(e) => handleUpdatePartDiscount(part._id, e.target.value)}
                              className="w-14 rounded border border-gray-300 px-2 py-1 text-center text-xs"
                            />
                          </td>
                          <td className="px-4 py-3 text-xs font-medium text-gray-900 text-right">
                            Rs. {getPartLineTotal(part).toFixed(2)}
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
              Service Report
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
              <div className="text-xs space-y-2">
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
                {(currentRepair.serviceTypeEntries || []).some((entry) => entry.serviceTypeId) && (
                  <div className="space-y-2">
                    <span className="text-gray-600">Service Types:</span>
                    <div className="space-y-2">
                      {(currentRepair.serviceTypeEntries || []).filter((entry) => entry.serviceTypeId).map((entry) => (
                        <div key={entry.id} className="rounded-md border border-gray-200 bg-gray-50 p-2 text-xs">
                          <div className="font-medium text-gray-800">{entry.serviceType || "Service Type"}</div>
                          {entry.description ? (
                            <div className="text-gray-600 mt-1">{entry.description}</div>
                          ) : (
                            <div className="text-gray-400 mt-1">No details added</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {currentRepair.paymentType && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Type:</span>
                    <span className="font-medium capitalize">
                      {currentRepair.paymentType === "bank-transfer" ? "Bank Transfer" : currentRepair.paymentType}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Total Service Charge (Rs.)
                  </label>
                  <Input
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    type="number"
                    min="0"
                    step="0.01"
                    value={parseFloat(currentRepair.laborCost || 0).toFixed(2)}
                    disabled
                    placeholder="0.00"
                  />
                  <p className="text-xs text-blue-600 mt-1">
                    Auto-calculated from each added service type entry.
                  </p>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Bill Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={parseFloat(currentRepair.billDiscountPercent || 0)}
                    onChange={(e) => handleUpdateRepairField("billDiscountPercent", e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Parts Total:</span>
                  <span>
                    Rs. {getRepairSubtotal({ ...currentRepair, laborCost: 0 }).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Labor:</span>
                  <span>
                    Rs. {(parseFloat(currentRepair.laborCost) || 0).toFixed(2)}
                  </span>
                </div>
                {parseFloat(currentRepair.billDiscountPercent || 0) > 0 && (
                  <div className="flex justify-between text-xs text-red-600 bg-red-50 px-3 py-2 rounded">
                    <span>Bill Discount:</span>
                    <span className="font-medium">
                      - Rs. {getBillDiscountAmount(currentRepair).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Subtotal:</span>
                  <span>
                    Rs. {getSubtotalAfterDiscount(currentRepair).toFixed(2)}
                  </span>
                </div>
                {currentRepair.paymentType === "card" && (
                  <>
                    <div className="flex justify-between text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded">
                      <span>Card Processing Fee (3%):</span>
                      <span className="font-medium">
                        Rs. {calculateCardProcessingFee(currentRepair).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
                {currentRepair.otherCharges && currentRepair.otherCharges.length > 0 && (
                  <>
                    {currentRepair.otherCharges.map((charge) => (
                      <div key={charge._id} className="flex justify-between text-sm text-purple-600 bg-purple-50 px-3 py-2 rounded">
                        <span>{charge.chargeType}:</span>
                        <span className="font-medium">
                          Rs. {(parseFloat(charge.amount) || 0).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </>
                )}
                {currentRepair.paymentType === "card" && (
                  <div className="flex justify-between text-lg font-bold text-orange-700 bg-orange-100 px-3 py-3 rounded">
                    <span>Final Total:</span>
                    <span>
                      Rs. {calculateRepairTotal(currentRepair).toFixed(2)}
                    </span>
                  </div>
                )}
                {currentRepair.paymentType && currentRepair.paymentType !== "card" && (
                  <div className="flex justify-between text-lg font-bold text-blue-900 bg-blue-100 px-3 py-3 rounded">
                    <span>Total Amount:</span>
                    <span>
                      Rs. {calculateRepairTotal(currentRepair).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-2 border-t border-gray-100">
                {/* <Button
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
                </Button> */}
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
                  {currentRepair.paymentType === "card" ? "Final Total (with 3% card fee)" : "Total Amount"}
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
                {currentRepair.employeeId ? (
                  <Button
                    className="w-full"
                    onClick={handleCreateServiceOrder}
                    disabled={isLoadingServiceOrder || repairs.length === 0}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Complete Repair
                  </Button>
                ) : (
                  <div className="w-full">
                    <Button
                      className="w-full bg-gray-300 hover:bg-gray-300 cursor-not-allowed"
                      disabled={true}
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      Complete Repair
                    </Button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {!currentRepair.parts || currentRepair.parts.length === 0 
                        ? "Add Parts & Materials to complete this repair"
                        : "Assign an employee to complete this repair"}
                    </p>
                  </div>
                )}
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
