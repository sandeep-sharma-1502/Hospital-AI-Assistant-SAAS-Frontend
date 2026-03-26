import apiClient from "../../../services/apiClient";

export const registerDevice = async (data) => {
  const res = await apiClient.post("/devices/register", data);
  return res.data;
};