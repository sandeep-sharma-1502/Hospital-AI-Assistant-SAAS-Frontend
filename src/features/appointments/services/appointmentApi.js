import apiClient from "../../../services/apiClient";

/**
 * Fetch appointments
 */
export const fetchAppointments = async () => {

  const res = await apiClient.get("/appointments");

  return res.data?.data ?? [];

};


/**
 * Create appointment (UPDATED ✅)
 */
export const createAppointment = async ({
  slotId,
  patientId
}) => {

  const res = await apiClient.post("/appointments", {
    slotId,
    patientId,
    mode: "DIRECT",   // 🔥 important
    source: "ADMIN"   // 🔥 important
  });

  return res.data?.data;

};

/**
 * Check booking status
 */
export const checkBookingStatus = async (trackingId) => {
  const res = await apiClient.get(`/appointments/status/${trackingId}`);
  return res.data?.data;
};

/**
 * Update appointment
 */
export const updateAppointment = async (id, data) => {
  const res = await apiClient.patch(`/appointments/${id}`, data);
  return res.data?.data;
};


/**
 * Cancel appointment
 */
export const cancelAppointment = async (id) => {

  const res = await apiClient.post(`/appointments/${id}/cancel`);

  return res.data;

};


/**
 * Reschedule appointment
 */
export const rescheduleAppointment = async (id, newSlotId) => {

  const res = await apiClient.post(`/appointments/${id}/reschedule`, {
    newSlotId
  });

  return res.data;

};


/**
 * Fetch available slots
 */
export const fetchAvailableSlots = async (doctorId, date) => {

  const res = await apiClient.get("/slots", {
    params: {
      doctorId,
      date
    }
  });

  return res.data?.data ?? [];

};