import apiClient from "../../../services/apiClient";

export const getAnalytics = async () => {
  const res = await apiClient.get("/admin/analytics");
  return res.data;
};