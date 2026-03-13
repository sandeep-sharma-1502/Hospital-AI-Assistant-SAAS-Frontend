import { store } from "../store";

export const attachInterceptors = (axiosInstance) => {

  // REQUEST
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // RESPONSE
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        window.location.href = "/admin/login";
      }

      // 🔥 Proper error message forwarding
      const message =
        error.response?.data?.detail ||
        error.message ||
        "Something went wrong";

      return Promise.reject(message);
    }
  );
};