import axios from "axios";
import { attachInterceptors } from "./interceptors";

const apiClient = axios.create({
  baseURL: "http://localhost:8765/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach interceptors
attachInterceptors(apiClient);

export default apiClient;