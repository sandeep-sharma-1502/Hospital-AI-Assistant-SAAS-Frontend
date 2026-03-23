import apiClient from "../../../services/apiClient";

export const getDepartments = async () => {
  const res = await apiClient.get("/admin/departments");
  return res.data;
};

export const getDepartmentById = async (id) => {
  const res = await apiClient.get(`/admin/departments/${id}`);
  return res.data;
};

export const createDepartment = async (data) => {
  const res = await apiClient.post("/admin/departments", data);
  return res.data;
};

export const updateDepartment = async (id, data) => {
  const res = await apiClient.patch(`/admin/departments/${id}`, data);
  return res.data;
};

export const deleteDepartment = async (id) => {
  const res = await apiClient.delete(`/admin/departments/${id}`);
  return res.data;
};