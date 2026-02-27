export const uploadDocument = async (file) => {
  // Real API: return apiClient.post('/admin/knowledge/upload', formData);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        status: 'processing' 
      });
    }, 2000);
  });
};