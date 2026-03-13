import apiClient from "../../../services/apiClient";

// Get all appointments (Admin)
export const fetchAppointments = async () => {
  const response = await apiClient.get("/admin/appointments");
  return response.data;
};

// Cancel appointment
export const cancelAppointment = async (appointmentId) => {
  const response = await apiClient.delete(
    `/admin/appointments/${appointmentId}`
  );
  return response.data;
};

// Create appointment (optional if needed in admin)
export const createAppointment = async (data) => {
  const response = await apiClient.post(
    "/admin/appointments",
    data
  );
  return response.data;
};

// Fetch available slots (PUBLIC)
export const fetchAvailableSlots = async (doctorId, date) => {
  const res = await apiClient.get(
    `/slots/${doctorId}?target_date=${date}`
  );
  return res.data;
};