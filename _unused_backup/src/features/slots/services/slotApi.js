import apiClient from "../../../services/apiClient";

export const getDoctorSlots = async (doctorId, date) => {
  const res = await apiClient.get(`/slots?doctorId=${doctorId}&date=${date}`);
  return res.data;
};

export const getAvailableSlots = async () => {
  const res = await apiClient.get("/slots/available");
  return res.data;
};

export const reserveSlot = async (data) => {
  const res = await apiClient.post("/slots/reserve", data);
  return res.data;
};

export const releaseSlot = async (data) => {
  const res = await apiClient.post("/slots/release", data);
  return res.data;
};

export const aiSearchSlots = async (data) => {
  const res = await apiClient.post("/slots/ai-search", data);
  return res.data;
};

export const fetchDoctorSlots = async (doctorId) => {

  const res = await apiClient.get(`/slots/doctor/${doctorId}`);

  return res.data.data;
};