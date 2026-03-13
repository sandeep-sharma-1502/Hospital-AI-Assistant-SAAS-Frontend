import apiClient from "../../../services/apiClient";

// Fetch all doctors
export const fetchDoctors = async () => {
  const response = await apiClient.get("/admin/doctors/");
  return response.data;
};

// Create doctor
export const createDoctor = async (data) => {
  const response = await apiClient.post("/admin/doctors/", data);
  return response.data;
};

// Create schedule
export const createSchedule = async (doctorId, data) => {
  const response = await apiClient.post(
    `/admin/doctors/${doctorId}/schedule`,
    data
  );
  return response.data;
};