// Define the base URL for the API
//export const baseUrl = "http://212.24.110.146:5000";
export const baseUrl = "http://192.168.1.121:5000";

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
  }
};
