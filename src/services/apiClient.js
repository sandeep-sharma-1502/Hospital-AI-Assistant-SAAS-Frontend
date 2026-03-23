import axios from "axios";
import { attachInterceptors } from "./interceptors";

/*
Axios instance
*/

const apiClient = axios.create({

  baseURL: "http://localhost:7000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },

});

/*
Attach interceptors
*/

attachInterceptors(apiClient);

export default apiClient;