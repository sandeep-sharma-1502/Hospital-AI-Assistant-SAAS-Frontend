import axios from "axios";

const userApiClient = axios.create({
  baseURL: "http://localhost:7000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error formatting
userApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default userApiClient;
