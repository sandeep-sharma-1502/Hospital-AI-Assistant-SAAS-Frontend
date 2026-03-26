// export const fetchSessions = async () => {
//   // Mock data for admin review
//   return [
//     { 
//       id: "SES-101", 
//       patientName: "Anonymous", 
//       startTime: "2026-02-27 10:30", 
//       duration: "5m 12s", 
//       status: 'completed', 
//       summary: "Inquiry about vaccination drive." 
//     },
//     { 
//       id: "SES-102", 
//       patientName: "Rahul Sharma", 
//       startTime: "2026-02-27 11:15", 
//       duration: "2m 45s", 
//       status: 'flagged', 
//       summary: "Emergency: High fever and breathing issues." 
//     },
//     { 
//       id: "SES-103", 
//       patientName: "Anonymous", 
//       startTime: "2026-02-27 12:00", 
//       duration: "8m 20s", 
//       status: 'active', 
//       summary: "Checking hospital room availability." 
//     },
//   ];
// };


import apiClient from "../../../services/apiClient";

export const fetchSessions = async () => {
  const res = await apiClient.get("/sessions");
  return res.data;
};

export const fetchSession = async (id) => {
  const res = await apiClient.get(`/sessions/${id}`);
  return res.data;
};

export const startSession = async (payload) => {
  const res = await apiClient.post("/sessions/start", payload);
  return res.data;
};

export const logSession = async (payload) => {
  const res = await apiClient.post("/sessions/log", payload);
  return res.data;
};

export const endSession = async (payload) => {
  const res = await apiClient.post("/sessions/end", payload);
  return res.data;
};