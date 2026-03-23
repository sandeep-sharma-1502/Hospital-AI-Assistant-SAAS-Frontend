import apiClient from "../../../services/apiClient";

export const uploadDocument = async (file) => {

  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post(
    "/admin/knowledge/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const fetchDocuments = async () => {
  const res = await apiClient.get("/admin/knowledge");
  return res.data;
};