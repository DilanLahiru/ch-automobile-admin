# API Examples & Request/Response Format

## Service Order Endpoints

### 1. Create Service Order

**Endpoint:** `POST /api/service-order/create`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "repairs": [
    {
      "vehicleId": 1,
      "employeeId": "507f1f77bcf86cd799439011",
      "serviceDescription": "Oil change and filter replacement - Basic maintenance",
      "laborCost": 500,
      "parts": [
        {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Engine Oil 5L",
          "price": 800,
          "quantity": 1
        },
        {
          "_id": "507f1f77bcf86cd799439013",
          "name": "Oil Filter",
          "price": 200,
          "quantity": 1
        }
      ],
      "status": "completed"
    },
    {
      "vehicleId": 2,
      "employeeId": "507f1f77bcf86cd799439014",
      "serviceDescription": "Transmission fluid check and top-up",
      "laborCost": 300,
      "parts": [
        {
          "_id": "507f1f77bcf86cd799439015",
          "name": "Transmission Fluid",
          "price": 1200,
          "quantity": 2
        }
      ],
      "status": "completed"
    }
  ],
  "totalAmount": 3000,
  "orderDate": "2025-02-02T10:30:00.000Z"
}
```

**Success Response (201):**
```json
{
  "_id": "507f191e810c19729de860ea",
  "repairs": [
    {
      "_id": "507f191e810c19729de860eb",
      "vehicleId": 1,
      "employeeId": "507f1f77bcf86cd799439011",
      "serviceDescription": "Oil change and filter replacement - Basic maintenance",
      "laborCost": 500,
      "parts": [
        {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Engine Oil 5L",
          "price": 800,
          "quantity": 1
        },
        {
          "_id": "507f1f77bcf86cd799439013",
          "name": "Oil Filter",
          "price": 200,
          "quantity": 1
        }
      ],
      "status": "completed"
    },
    {
      "_id": "507f191e810c19729de860ec",
      "vehicleId": 2,
      "employeeId": "507f1f77bcf86cd799439014",
      "serviceDescription": "Transmission fluid check and top-up",
      "laborCost": 300,
      "parts": [
        {
          "_id": "507f1f77bcf86cd799439015",
          "name": "Transmission Fluid",
          "price": 1200,
          "quantity": 2
        }
      ],
      "status": "completed"
    }
  ],
  "totalAmount": 3000,
  "orderDate": "2025-02-02T10:30:00.000Z",
  "status": "pending",
  "createdAt": "2025-02-02T10:35:20.000Z",
  "updatedAt": "2025-02-02T10:35:20.000Z"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "repairs": "Each repair must have vehicleId and employeeId",
    "totalAmount": "totalAmount is required"
  }
}
```

---

### 2. Get All Service Orders

**Endpoint:** `GET /api/service-order/all`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters (Optional):**
```
?status=completed
?sortBy=createdAt
?sortOrder=desc
?limit=10
?skip=0
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f191e810c19729de860ea",
      "repairs": [
        {
          "_id": "507f191e810c19729de860eb",
          "vehicleId": 1,
          "employeeId": "507f1f77bcf86cd799439011",
          "serviceDescription": "Oil change...",
          "laborCost": 500,
          "parts": [...],
          "status": "completed"
        }
      ],
      "totalAmount": 3000,
      "orderDate": "2025-02-02T10:30:00.000Z",
      "status": "completed",
      "createdAt": "2025-02-02T10:35:20.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "pages": 3
}
```

---

### 3. Get Service Order by ID

**Endpoint:** `GET /api/service-order/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f191e810c19729de860ea",
    "repairs": [...],
    "totalAmount": 3000,
    "orderDate": "2025-02-02T10:30:00.000Z",
    "status": "completed",
    "createdAt": "2025-02-02T10:35:20.000Z",
    "updatedAt": "2025-02-02T10:35:20.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Service order not found"
}
```

---

### 4. Update Service Order

**Endpoint:** `PUT /api/service-order/update`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "_id": "507f191e810c19729de860ea",
  "repairs": [
    {
      "_id": "507f191e810c19729de860eb",
      "vehicleId": 1,
      "employeeId": "507f1f77bcf86cd799439011",
      "serviceDescription": "Updated description",
      "laborCost": 600,
      "parts": [...],
      "status": "completed"
    }
  ],
  "totalAmount": 3100,
  "status": "completed"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Service order updated successfully",
  "data": {
    "_id": "507f191e810c19729de860ea",
    "repairs": [...],
    "totalAmount": 3100,
    "updatedAt": "2025-02-02T11:00:00.000Z"
  }
}
```

---

### 5. Delete Service Order

**Endpoint:** `DELETE /api/service-order/delete/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Service order deleted successfully",
  "data": {
    "_id": "507f191e810c19729de860ea",
    "deleted": true
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Service order not found"
}
```

---

## Invoice Endpoints

### 1. Create Invoice

**Endpoint:** `POST /api/invoice/create`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "serviceOrderId": "507f191e810c19729de860ea",
  "invoiceDate": "2025-02-02",
  "dueDate": "2025-03-04",
  "notes": "Thank you for your business!",
  "paymentTerms": "Due within 30 days"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f191e810c19729de860ed",
    "invoiceNumber": "INV-2025-00001",
    "serviceOrderId": "507f191e810c19729de860ea",
    "invoiceDate": "2025-02-02",
    "dueDate": "2025-03-04",
    "totalAmount": 3000,
    "status": "generated",
    "createdAt": "2025-02-02T10:35:20.000Z"
  }
}
```

---

### 2. Get Invoice by Order ID

**Endpoint:** `GET /api/invoice/order/:orderId`

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f191e810c19729de860ed",
    "invoiceNumber": "INV-2025-00001",
    "serviceOrderId": "507f191e810c19729de860ea",
    "repairs": [
      {
        "vehicleId": 1,
        "employeeId": "507f1f77bcf86cd799439011",
        "parts": [
          {
            "name": "Engine Oil 5L",
            "price": 800,
            "quantity": 1
          }
        ],
        "laborCost": 500,
        "repairTotal": 1300
      }
    ],
    "totalAmount": 3000,
    "invoiceDate": "2025-02-02",
    "dueDate": "2025-03-04"
  }
}
```

---

## Error Response Formats

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "field1": "Error message",
    "field2": "Error message"
  }
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Authorization token is missing or invalid"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "You don't have permission to perform this action"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details for development"
}
```

---

## cURL Examples

### Create Service Order
```bash
curl -X POST http://localhost:3000/api/service-order/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "repairs": [
      {
        "vehicleId": 1,
        "employeeId": "507f1f77bcf86cd799439011",
        "serviceDescription": "Oil change",
        "laborCost": 500,
        "parts": [
          {
            "_id": "507f1f77bcf86cd799439012",
            "name": "Engine Oil",
            "price": 800,
            "quantity": 1
          }
        ],
        "status": "completed"
      }
    ],
    "totalAmount": 1300,
    "orderDate": "2025-02-02T10:30:00Z"
  }'
```

### Get All Service Orders
```bash
curl -X GET http://localhost:3000/api/service-order/all \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Service Order by ID
```bash
curl -X GET http://localhost:3000/api/service-order/507f191e810c19729de860ea \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Service Order
```bash
curl -X PUT http://localhost:3000/api/service-order/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "_id": "507f191e810c19729de860ea",
    "repairs": [...],
    "totalAmount": 3100,
    "status": "completed"
  }'
```

### Delete Service Order
```bash
curl -X DELETE http://localhost:3000/api/service-order/delete/507f191e810c19729de860ea \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Invoice
```bash
curl -X POST http://localhost:3000/api/invoice/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "serviceOrderId": "507f191e810c19729de860ea",
    "invoiceDate": "2025-02-02",
    "dueDate": "2025-03-04"
  }'
```

---

## Postman Collection

Import this collection into Postman:

```json
{
  "info": {
    "name": "Service Order API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Service Order",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/service-order/create"
      }
    },
    {
      "name": "Get All Service Orders",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/service-order/all"
      }
    },
    {
      "name": "Get Service Order by ID",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/service-order/:id"
      }
    },
    {
      "name": "Update Service Order",
      "request": {
        "method": "PUT",
        "url": "{{baseUrl}}/api/service-order/update"
      }
    },
    {
      "name": "Delete Service Order",
      "request": {
        "method": "DELETE",
        "url": "{{baseUrl}}/api/service-order/delete/:id"
      }
    }
  ]
}
```

---

## Integration Testing Checklist

- [ ] Test create with single repair
- [ ] Test create with multiple repairs
- [ ] Test create with multiple parts per repair
- [ ] Test get all service orders
- [ ] Test search/filter functionality
- [ ] Test update service order
- [ ] Test delete service order
- [ ] Test invoice generation
- [ ] Test authorization (missing token)
- [ ] Test validation (missing required fields)
- [ ] Test error responses
- [ ] Test concurrent requests
- [ ] Test with large dataset
- [ ] Test PDF export
- [ ] Test print functionality

---

## Notes

- Replace `http://localhost:3000` with your actual API base URL
- Replace `YOUR_TOKEN` with actual JWT token
- Adjust headers if your API uses different authentication method
- Verify database IDs match your actual data
- Test all endpoints before deployment
