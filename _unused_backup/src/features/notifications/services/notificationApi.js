import apiClient from "../../../services/apiClient";

export const getNotifications = async () => {
  const res = await apiClient.get("/notifications");
  return res.data;
};

export const createNotification = async (data) => {
  const res = await apiClient.post("/notifications", data);
  return res.data;
};

export const markNotificationRead = async (id) => {
  const res = await apiClient.patch(`/notifications/${id}/read`);
  return res.data;
};