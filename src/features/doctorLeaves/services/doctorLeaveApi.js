import apiClient from "../../../services/apiClient";

export const createDoctorLeave = async (data) => {
  const res = await apiClient.post("/admin/doctor-leaves", data);
  return res.data;
};

export const getDoctorLeaves = async (doctorId) => {
  const res = await apiClient.get(`/admin/doctor-leaves/doctor/${doctorId}`);
  return res.data;
};

export const deleteDoctorLeave = async (id) => {
  const res = await apiClient.delete(`/admin/doctor-leaves/${id}`);
  return res.data;
};

export const updateDoctorLeave = async (id, data) => {
  const res = await apiClient.put(`/admin/doctor-leaves/${id}`, data);
  return res.data;
};