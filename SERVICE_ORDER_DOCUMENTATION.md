# Service Order Management System - Implementation Guide

## Overview
This document describes the implementation of a comprehensive Service Order Management system that handles multiple vehicle repairs with employee assignment, parts management, and invoice generation.

## Features Implemented

### 1. Multiple Vehicle Repairs Support
- **Tab-based Repair Management**: Users can create and manage multiple repairs within a single service order
- **Individual Repair Tracking**: Each repair has its own vehicle assignment, employee assignment, service description, and parts list
- **Add/Remove Repairs**: Dynamic addition and removal of repairs with validation

### 2. Employee Assignment per Repair
- **Available Today Filter**: Filters employees with active status
- **Per-Repair Assignment**: Each repair can have a different technician assigned
- **Employee Details Display**: Shows employee name and position in the invoice

### 3. Parts Management per Vehicle
- **Per-Repair Parts**: Parts are managed at the repair level, not globally
- **Quantity Tracking**: Track parts quantity for each vehicle repair
- **Automatic Aggregation**: Parts are aggregated per repair for billing purposes

### 4. Invoice Generation
- **Complete Service Order Invoice**: Generates detailed invoices with all repairs included
- **Vehicle Details**: Shows vehicle registration, make, model, and owner for each repair
- **Employee Information**: Displays assigned technician details
- **Parts Itemization**: Lists all parts used with unit price, quantity, and total
- **Separate Repair Totals**: Calculates individual repair totals (parts + labor)
- **Grand Total**: Displays overall service order amount
- **Print & PDF Export**: Supports both printing and PDF download

### 5. Service Order List/History
- **Search Functionality**: Search by order ID, vehicle registration, or owner name
- **Status Filtering**: Filter by pending or completed repairs
- **Quick Actions**: View invoice or delete service order
- **Repair Summary**: Shows number of repairs and total amount per order

## File Structure

### New Files Created:

```
src/
├── features/
│   └── serviceOrderSlice.js          # Redux slice for service orders
├── pages/
│   ├── ServiceOrder/
│   │   ├── ServiceOrderPage.jsx       # Main service order creation page (REFACTORED)
│   │   └── ServiceOrderListPage.jsx   # Service order list view (NEW)
│   └── Invoice/
│       └── InvoiceGenerationPage.jsx  # Invoice generation page (NEW)
└── utils/
    └── baseUrl.js                      # API paths (UPDATED)
```

### Modified Files:

1. **src/store/store.js** - Added serviceOrderReducer
2. **src/utils/baseUrl.js** - Added SERVICE_ORDER and INVOICE API paths
3. **src/pages/ServiceOrder/ServiceOrderPage.jsx** - Complete refactor to support multiple repairs

## Redux Store Structure

### Service Order Slice (serviceOrderSlice.js)

**State:**
```javascript
{
  orders: [],           // Array of service orders
  isLoading: false,     // Loading state
  error: null           // Error messages
}
```

**Actions:**
- `getAllServiceOrders()` - Fetch all service orders
- `createServiceOrder()` - Create new service order
- `updateServiceOrder()` - Update existing service order
- `deleteServiceOrder()` - Delete service order
- `clearError()` - Clear error messages

## API Integration

### API Endpoints Required

Add these endpoints to your backend:

```
POST   /api/service-order/create        - Create service order
GET    /api/service-order/all           - Get all service orders
PUT    /api/service-order/update        - Update service order
DELETE /api/service-order/delete/:id    - Delete service order
GET    /api/service-order/:id           - Get service order by ID
POST   /api/invoice/create              - Create invoice
GET    /api/invoice/order/:orderId      - Get invoice by order ID
```

## Data Structure

### Service Order Object

```javascript
{
  _id: "order_id",
  orderDate: "2025-02-02T10:00:00.000Z",
  totalAmount: 5000,
  repairs: [
    {
      id: 1234567890,                    // Unique ID for repair
      vehicleId: 1,                       // Vehicle ID (from mockVehicles)
      employeeId: "employee_id",         // Employee ID from Redux
      serviceDescription: "Oil change and filter replacement",
      laborCost: 500,
      parts: [
        {
          _id: "part_id",
          name: "Engine Oil",
          price: 800,
          quantity: 2
        },
        {
          _id: "part_id_2",
          name: "Oil Filter",
          price: 200,
          quantity: 1
        }
      ],
      status: "completed" | "pending"
    },
    // ... more repairs
  ]
}
```

## Key Features & Usage

### 1. Creating a Service Order

1. Navigate to `/dashboard/service-orders/new`
2. System initializes with one empty repair form
3. For each repair:
   - Select vehicle from dropdown
   - Assign employee (filtered for availability)
   - Enter service description
   - Add parts from inventory with quantities
   - Enter labor cost
4. Click "Add Repair" to add additional repairs
5. All repairs are combined into a single service order
6. Click "Create Service Order & Invoice" to save and generate invoice

### 2. Managing Multiple Repairs

- **Tab Navigation**: Use repair tabs to switch between repairs
- **Individual Totals**: Each repair shows its own total (parts + labor)
- **Grand Total**: Bottom right shows total for all repairs combined
- **Remove Repair**: Click "Remove Repair" to delete a repair (minimum 1 required)

### 3. Parts Management

- Parts are added per repair, not globally
- When adding parts:
  - System validates that a vehicle is selected first
  - Duplicate parts can be added (quantity increases)
  - Parts are removed individually using the trash icon
- Each part shows: name, unit price, quantity, and total price

### 4. Viewing Service Orders

1. Navigate to `/dashboard/service-orders`
2. View list of all service orders with statuses
3. Search by order ID, vehicle registration, or owner name
4. Filter by completion status (Pending/Completed)
5. Quick actions:
   - Click file icon to view/print invoice
   - Click trash icon to delete order

### 5. Invoice Generation

The invoice includes:
- **Header**: Business information and invoice details
- **For Each Repair**:
  - Vehicle information (registration, make, model, owner)
  - Assigned technician details
  - Service description
  - Parts itemized table
  - Repair subtotal (parts + labor)
- **Footer**: 
  - Grand total
  - Payment terms
  - Bank details
  - Notes
  - Signature sections

**Actions:**
- Print: Opens browser print dialog
- Download PDF: Exports invoice as PDF file

## Draft Saving

Service orders can be saved as drafts:
1. Click "Save as Draft" button
2. Draft is saved to browser localStorage
3. Can be resumed later before final submission

To resume draft:
- The system would need to load draft from localStorage on page load
- (Currently basic implementation - can be enhanced)

## Validation Rules

1. **Each Repair Requires:**
   - Vehicle selection (mandatory)
   - Employee assignment (mandatory for invoice generation)
   - At least vehicle selection to add parts

2. **Service Order Requires:**
   - Minimum 1 repair
   - All repairs must have both vehicle and employee assigned

3. **Parts:**
   - Quantity minimum is 1
   - Part price and inventory are from product database

## Integration Notes

### Mock Data
Currently using mock vehicle data for demo purposes:
```javascript
const mockVehicles = [
  { id: 1, registrationNo: 'ABC-123', owner: 'Ahmad Khan', make: 'Toyota', model: 'Corolla' },
  { id: 2, registrationNo: 'XYZ-456', owner: 'Fatima Ali', make: 'Honda', model: 'Civic' },
  { id: 3, registrationNo: 'PQR-789', owner: 'Hassan Ahmed', make: 'Suzuki', model: 'Swift' },
]
```

**To integrate real data:**
1. Create a `vehicleSlice.js` in features folder
2. Create API endpoints for vehicle management
3. Replace mockVehicles with actual data from Redux
4. Update API calls in serviceOrderPage

### Employee Data
- Uses existing `employeeSlice.js`
- Filters employees with `status !== 'inactive'`
- Expects fields: `_id`, `name`, `position`, `phone`

### Product Data
- Uses existing `productSlice.js`
- Expects fields: `_id`, `name`, `price`

## UI Components Used

- **Card** - Container component from `ui/Card`
- **Button** - Action buttons from `ui/Button`
- **Input** - Text input from `ui/Input`
- **Badge** - Status badges from `ui/Badge`
- **Icons** - Lucide React icons

## Toast Notifications

User feedback via react-toastify:
- Part added successfully
- Vehicle selection required
- Service order created
- Invoice download
- Error messages

## Local Storage

- `serviceOrderDraft` - Stores draft service orders as JSON

## Browser Compatibility

- Requires modern browser with ES6+ support
- PDF export requires html2canvas and jsPDF libraries (already in package.json)
- Print functionality uses browser print dialog

## Performance Considerations

1. **Lazy Loading**: Employee and product data loaded on component mount
2. **Memoization**: Consider adding React.memo for large lists
3. **Pagination**: For large service order lists, implement pagination
4. **Indexed Search**: Search is client-side; for large datasets, use server-side search

## Future Enhancements

1. **Vehicle Management Module** - Add CRUD operations for vehicles
2. **Service Templates** - Pre-defined repair packages
3. **Recurring Services** - Schedule regular maintenance
4. **Payment Integration** - Online payment processing
5. **Appointment Integration** - Link service orders to appointments
6. **Email Invoices** - Auto-send invoices to customers
7. **SMS Notifications** - Notify customers of completion
8. **Warranty Tracking** - Track warranty periods
9. **Service History** - Vehicle service history dashboard
10. **Analytics** - Reports on revenue, most common repairs, etc.

## Troubleshooting

### Parts not showing up
- Check that product data is loaded from Redux
- Verify product structure has `_id`, `name`, `price` fields

### Employees not showing
- Check that employee data is loaded
- Verify employee status is not 'inactive'
- Check employee structure has `_id`, `name` fields

### Invoice PDF export failing
- Ensure html2canvas and jsPDF are installed
- Check browser console for errors
- Verify printRef is properly attached to div

### Service order not saving
- Check Redux store is properly configured
- Verify API endpoint is correct
- Check browser console for network errors
- Ensure all required fields are filled

## Support & Contact

For questions or issues, contact the development team.
