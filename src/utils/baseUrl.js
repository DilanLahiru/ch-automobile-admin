// Define the base URL for the API
//export const baseUrl = "http://212.24.110.146:5000";
export const baseUrl = "http://192.168.8.102:3000";

export const API_PATH = {
  AUTH: {
    LOGIN: "/api/employee/login-admin",
    REGISTER: "/api/user/register",
    GET_LOGIN_USER: `/api/employee/current`,
  },
  APPOINTMENT: {
    GET_ALL: "/api/appointment/all",
    CREATE: "/api/appointment/create",
    UPDATE: "/api/appointment/update",
    DELETE: "/api/appointment/delete",
  },
  CUSTOMER: {
    GET_ALL: "/api/customer/all",
    CREATE: "/api/customer/register",
    UPDATE: "/api/customer/update",
    DELETE: "/api/customer/delete",
  },
  PRODUCT: {
    GET_ALL: "/api/product/all",
    CREATE: "/api/product/create",
  },
  SUPPLIER: {
    GET_ALL: "/api/supplier/all",
    CREATE: "/api/supplier/create",
  },
  CATEGORY: {
    GET_ALL: "/api/category/load",
    CREATE: "/api/category/create",
    GET_BY_ID: (id) => `/api/category/${id}`,
  },
  EMLOYEE: {
    GET_ALL: "/api/employee/all",
    CREATE: "/api/employee/create",
    UPDATE: "/api/employee/update",
    DELETE: "/api/employee/delete",
  },
  SERVICE_ORDER: {
    GET_ALL: "/api/service-record/all",
    CREATE: "/api/service-record/create",
    UPDATE: "/api/service-record/update",
    DELETE: "/api/service-record/delete",
    GET_BY_ID: (id) => `/api/service-record/${id}`,
  },
  INVOICE: {
    CREATE: "/api/invoice/create",
    GET_BY_ORDER: (orderId) => `/api/invoice/order/${orderId}`,
  }
};
