// Define the base URL for the API
export const baseUrl = "https://api.chautomobile.lk";
//export const baseUrl = "http://192.168.8.100:3000";

export const API_PATH = {
  AUTH: {
    LOGIN: "/api/user/login",
    REGISTER: "/api/user/register",
    GET_LOGIN_USER: `/api/employee/current`,
    GET_PROFILE: "/api/user/profile",
    UPDATE_PROFILE:  "/api/user/update-profile",
    CHANGE_PASSWORD:  "/api/user/update-password",
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
    UPDATE: (id) => `/api/product/update/${id}`,
    DELETE: (id) => `/api/product/delete/${id}`,
  },
  SUPPLIER: {
    GET_ALL: "/api/supplier/all",
    CREATE: "/api/supplier/create",
    UPDATE: (id) => `/api/supplier/update/${id}`,
    DELETE: (id) => `/api/supplier/delete/${id}`,
  },
  CATEGORY: {
    GET_ALL: "/api/category/load",
    CREATE: "/api/category/create",
    GET_BY_ID: (id) => `/api/category/${id}`,
  },
  EMLOYEE: {
    GET_ALL: "/api/employee/all",
    CREATE: "/api/employee/create",
    UPDATE: (id) => `/api/employee/update/${id}`,
    DELETE: (id) => `/api/employee/delete/${id}`,
  },
  OLD_SERVICE_ORDER: {
    GET_ALL: "/api/old-service-record/all",
    CREATE: "/api/old-service-record/create",
  },
  SERVICE_ORDER: {
    GET_ALL: "/api/service-record/all",
    CREATE: "/api/service-record/create",
    UPDATE: "/api/service-record/update",
    DELETE: "/api/service-record/delete",
    GET_BY_ID: (id) => `/api/service-record/${id}`,
    GET_BY_EMPLOYEE: (employeeId) => `/api/service-record/employee/${employeeId}`,
  },
  INVOICE: {
    CREATE: "/api/invoice/create",
    GET_BY_ORDER: (orderId) => `/api/invoice/order/${orderId}`,
  },
  SERVICE_TYPE: {
    CREATE: "/api/service-type/create",
    GET_ALL: "/api/service-type/all",
    UPDATE: (id) => `/api/service-type/update/${id}`,
    DELETE: (id) => `/api/service-type/delete/${id}`,
  },
  OTHER_CHARGES: {
    CREATE: "/api/other-charge/create",
    GET_ALL: "/api/other-charge/all",
    UPDATE: (id) => `/api/other-charge/update/${id}`,
    DELETE: (id) => `/api/other-charge/delete/${id}`,
  }
};
