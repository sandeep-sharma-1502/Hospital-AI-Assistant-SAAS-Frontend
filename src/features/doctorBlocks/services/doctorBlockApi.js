import apiClient from "../../../services/apiClient";

export const getDoctorBlocks = async (doctorId) => {
  const res = await apiClient.get(`/admin/doctor-blocks/doctor/${doctorId}`);
  return res.data;
};

export const createDoctorBlock = async (data) => {
  const res = await apiClient.post("/admin/doctor-blocks", data);
  return res.data;
};

export const updateDoctorBlock = async (id, data) => {
  const res = await apiClient.patch(`/admin/doctor-blocks/${id}`, data);
  return res.data;
};

export const deleteDoctorBlock = async (id) => {
  const res = await apiClient.delete(`/admin/doctor-blocks/${id}`);
  return res.data;
};