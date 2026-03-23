import apiClient from "../../../services/apiClient";

// --- DOCTOR CORE APIs ---
export const fetchDoctors = async () => {
  const res = await apiClient.get("/admin/doctors");
  return res.data.data; 
};

export const createDoctor = async (data) => {
  const res = await apiClient.post("/admin/doctors", data);
  return res.data;
};

export const updateDoctor = async (id, data) => {
  const res = await apiClient.patch(`/admin/doctors/${id}`, data);
  return res.data;
};

export const deleteDoctor = async (id) => {
  const res = await apiClient.delete(`/admin/doctors/${id}`);
  return res.data;
};

// --- SCHEDULE / ROSTER APIs ---

export const getDoctorSchedules = async (doctorId) => {
  const res = await apiClient.get(`/admin/schedules/${doctorId}`);
  return res.data;
};

export const createSchedule = async (doctorId, data) => {
  const payload = {
    doctorId,
    ...data,
  };
  const res = await apiClient.post("/admin/schedules", payload);
  return res.data;
};

export const updateSchedule = async (id, payload) => {
  const res = await apiClient.put(`/admin/schedules/${id}`, payload);
  return res.data;
};

/**
 * MISSING FUNCTION: Schedule delete karne ke liye
 */
export const deleteDoctorSchedule = async (id) => {
  const res = await apiClient.delete(`/admin/schedules/${id}`);
  return res.data;
};

// --- CALENDAR & OTHER ---

export const getDoctorCalendar = async (doctorId) => {
  const res = await apiClient.get(`/admin/doctors/${doctorId}/calendar`);
  return res.data;
};