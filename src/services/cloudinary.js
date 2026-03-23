const CLOUD_NAME = "dksfnzapi";
const UPLOAD_PRESET = "doctor_upload";

export const uploadImageToCloudinary = async (file) => {

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  formData.append("folder", "doctors");

  const publicId = `doctor_${Date.now()}`;
  formData.append("public_id", publicId);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  const data = await res.json();

  return data.secure_url;
};