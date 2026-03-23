import apiClient from "../../../services/apiClient";

export const getPatients = async () => {
  const res = await apiClient.get("/patients");
  return res.data;
};

export const getPatientById = async (id) => {
  const res = await apiClient.get(`/patients/${id}`);
  return res.data;
};

export const createPatient = async (data) => {
  const res = await apiClient.post("/patients", data);
  return res.data;
};

export const updatePatient = async (id, data) => {
  const res = await apiClient.put(`/patients/${id}`, data);
  return res.data;
};

export const deletePatient = async (id) => {
  const res = await apiClient.delete(`/patients/${id}`);
  return res.data;
};

export const getPatientAppointments = async (id) => {
  const res = await apiClient.get(`/patients/${id}/appointments`);
  return res.data;
};

/**
 * 🔥 ADD THIS (IMPORTANT)
 */
export const searchPatientsApi = async (query) => {

  const res = await apiClient.get("/patients/search", {
    params: { q: query }
  });

  return res.data?.data ?? [];

};