# Service Order Management System - Quick Setup Guide

## Installation & Setup

### 1. Files Already Created ✓

The following files have been created and integrated:

- ✅ `src/features/serviceOrderSlice.js` - Redux state management
- ✅ `src/pages/ServiceOrder/ServiceOrderPage.jsx` - Main service order creation (REFACTORED)
- ✅ `src/pages/ServiceOrder/ServiceOrderListPage.jsx` - Service order list view
- ✅ `src/pages/Invoice/InvoiceGenerationPage.jsx` - Invoice generation & printing
- ✅ `src/store/store.js` - Updated with serviceOrderReducer
- ✅ `src/utils/baseUrl.js` - Updated with API paths

### 2. Routes Setup

Add these routes to your router configuration (likely in `App.jsx` or route setup file):

```jsx
// Service Orders
{
  path: '/dashboard/service-orders',
  element: <ServiceOrderListPage />,
},
{
  path: '/dashboard/service-orders/new',
  element: <ServiceOrderPage />,
},

// Invoice Generation
{
  path: '/dashboard/invoices/new',
  element: <InvoiceGenerationPage />,
}
```

**Import the components:**
```jsx
import { ServiceOrderPage } from './pages/ServiceOrder/ServiceOrderPage'
import { ServiceOrderListPage } from './pages/ServiceOrder/ServiceOrderListPage'
import { InvoiceGenerationPage } from './pages/Invoice/InvoiceGenerationPage'
```

### 3. Navigation Menu Setup

Add menu items to your sidebar/header navigation:

```jsx
// In your navigation/menu configuration:
{
  title: 'Service Orders',
  icon: <Wrench />,
  path: '/dashboard/service-orders',
  badge: 'New', // Optional
},
```

### 4. Backend API Requirements

Your backend needs to implement these endpoints:

#### Service Order Endpoints:
```
POST   /api/service-order/create
GET    /api/service-order/all
PUT    /api/service-order/update
DELETE /api/service-order/delete/:id
GET    /api/service-order/:id
```

**Expected Request/Response Format:**

Create Service Order:
```javascript
// REQUEST
POST /api/service-order/create
{
  "repairs": [
    {
      "vehicleId": 1,
      "employeeId": "emp_123",
      "serviceDescription": "Oil change",
      "laborCost": 500,
      "parts": [
        {
          "_id": "part_1",
          "name": "Engine Oil",
          "price": 800,
          "quantity": 2
        }
      ],
      "status": "completed"
    }
  ],
  "totalAmount": 2100,
  "orderDate": "2025-02-02T10:00:00.000Z"
}

// RESPONSE
{
  "_id": "order_123",
  "repairs": [...],
  "totalAmount": 2100,
  "orderDate": "2025-02-02T10:00:00.000Z",
  "createdAt": "2025-02-02T10:00:00.000Z"
}
```

### 5. Database Schema (MongoDB Example)

```javascript
// Service Order Schema
const serviceOrderSchema = new Schema({
  repairs: [{
    vehicleId: Number,
    employeeId: String,
    serviceDescription: String,
    laborCost: Number,
    parts: [{
      _id: String,
      name: String,
      price: Number,
      quantity: Number
    }],
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    }
  }],
  totalAmount: Number,
  orderDate: Date,
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true })

// Create Model
const ServiceOrder = mongoose.model('ServiceOrder', serviceOrderSchema)
```

### 6. Verify Dependencies

All required packages are already in your `package.json`:

- ✅ `react-redux` & `@reduxjs/toolkit` - State management
- ✅ `react-toastify` - Notifications
- ✅ `react-router-dom` - Routing
- ✅ `lucide-react` - Icons
- ✅ `html2canvas` - PDF generation
- ✅ `jspdf` - PDF export
- ✅ `react-to-print` - Print functionality

No additional packages needed!

### 7. Test the Implementation

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to Service Orders:**
   - Go to `/dashboard/service-orders` to view list
   - Click "New Service Order" or go to `/dashboard/service-orders/new`

3. **Create a Test Service Order:**
   - Select a vehicle
   - Assign an employee
   - Add a service description
   - Add parts (if available in database)
   - Set labor cost
   - Click "Create Service Order & Invoice"

4. **Test Invoice Generation:**
   - After creating an order, you should be redirected to invoice
   - Test Print button
   - Test Download PDF button

## Configuration Options

### Customize Business Information

Edit the `businessInfo` object in `InvoiceGenerationPage.jsx`:

```javascript
const businessInfo = {
  name: 'CH Automobile Service Center',
  address: '123 Main Street, Karachi, Pakistan',
  phone: '+92-300-1234567',
  email: 'info@chautomobile.com',
  taxId: 'TX-123456789',
}
```

### Replace Mock Vehicle Data

In both `ServiceOrderPage.jsx` and `ServiceOrderListPage.jsx`, replace:

```javascript
const mockVehicles = [
  // ... mock data
]
```

With API call:
```javascript
const { vehicle: vehiclesFromRedux } = useSelector((state) => state.vehicle)

const getAvailableVehicles = () => {
  return Array.isArray(vehiclesFromRedux) ? vehiclesFromRedux : []
}
```

And add vehicle slice to Redux store.

### Customize Invoice Template

Edit the invoice template in `InvoiceGenerationPage.jsx`:
- Change colors, fonts, layout
- Add/remove fields
- Customize payment terms and notes
- Add company logo

## Troubleshooting

### Issue: "Cannot find module" errors
**Solution:** Ensure all imports are correct and files are created in right locations

### Issue: Redux state not updating
**Solution:** 
1. Check store.js includes serviceOrderReducer
2. Verify API paths in baseUrl.js are correct
3. Check browser console for network errors

### Issue: Invoice not printing
**Solution:**
1. Check that html2canvas and jspdf are installed
2. Verify printRef is properly attached
3. Test with different browser (Chrome works best)

### Issue: Employees/Products not loading
**Solution:**
1. Dispatch getAllEmployee() and getAllProducts() in useEffect
2. Check Redux state in browser DevTools
3. Verify API endpoints return correct data format

### Issue: Parts not appearing in dropdown
**Solution:**
1. Verify productsFromRedux is array with correct structure
2. Check products have _id, name, price fields
3. Verify API is returning products correctly

## Performance Tips

1. **For Large Lists:**
   - Add pagination to ServiceOrderListPage
   - Implement virtual scrolling for long lists

2. **For Many Repairs:**
   - Consider breaking into multiple orders
   - Implement batch processing

3. **For Slow Networks:**
   - Add loading skeletons
   - Implement request caching
   - Show progress indicators

## Security Considerations

1. **Validation:**
   - Validate all inputs before sending to API
   - Check user permissions on backend

2. **Authentication:**
   - Include auth token in API calls (already implemented)
   - Verify user can only see their own orders

3. **Data Protection:**
   - Don't store sensitive data in localStorage
   - Use HTTPS for API calls

## Next Steps

1. Implement backend API endpoints
2. Update vehicle management (create vehicleSlice)
3. Test with real data from your database
4. Customize UI/branding to match your design
5. Add email notifications for invoice
6. Implement payment processing
7. Add service history reports

## Common Use Cases

### Use Case 1: Simple Repair
1. Create new service order
2. Select 1 vehicle
3. Assign 1 employee
4. Add parts or just labor cost
5. Generate invoice

### Use Case 2: Multiple Vehicle Repairs
1. Create new service order
2. Add Repair 1 - Vehicle A
3. Add Repair 2 - Vehicle B
4. Add Repair 3 - Vehicle C
5. All combined in one invoice

### Use Case 3: Complex Repair with Many Parts
1. Create new service order
2. Select vehicle
3. Assign employee
4. Add description: "Transmission overhaul"
5. Add multiple parts (gaskets, seals, fluid, etc.)
6. Set labor cost (expensive repair)
7. Generate invoice with itemized parts

## Support

For questions or issues:
1. Check SERVICE_ORDER_DOCUMENTATION.md
2. Review error messages in console
3. Check Redux DevTools for state
4. Verify backend API is running
5. Test API endpoints with Postman

---

**Status:** ✅ Ready to integrate with backend

**Last Updated:** February 2, 2025
