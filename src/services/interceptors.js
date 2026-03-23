import { store } from "../store";

export const attachInterceptors = (axiosInstance) => {

  /*
  REQUEST INTERCEPTOR
  */

  axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
  );

  /*
  RESPONSE INTERCEPTOR
  */

  axiosInstance.interceptors.response.use(

    (response) => response,

    (error) => {

      /*
      Unauthorized
      */

      if (error.response?.status === 401) {
        
        const requestUrl = error.config?.url || "";
        const isAdminRequest = requestUrl.includes("/admin/");
        // ✅ Don't redirect if the is-auth check itself 401s — the rejected thunk handles it
        const isAuthCheck = requestUrl.includes("/admin/auth/is-auth");

        if (isAdminRequest && !isAuthCheck) {
          localStorage.removeItem("adminUser");
          // ✅ Use replace() to avoid polluting browser history
          window.location.replace("/admin/login");
        }
      }

      /*
      Backend error format
      */

      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        "Something went wrong";

      return Promise.reject(new Error(message));

    }

  );

};