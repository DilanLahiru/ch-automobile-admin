import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import appointmentReducer from "../features/appointmentSlice";
import customerReducer from "../features/customerSlice";
import categoryReducer from "../features/categorySlice";
import productReducer from "../features/productSlice";
import supplierReducer from "../features/supplierSlice";
import EmployeeReducer from "../features/employeeSlice";
import serviceOrderReducer from "../features/serviceOrderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    appointment: appointmentReducer,
    customer: customerReducer,
    category: categoryReducer,
    product: productReducer,
    supplier: supplierReducer,
    employee: EmployeeReducer,
    serviceOrder: serviceOrderReducer,
  },
});