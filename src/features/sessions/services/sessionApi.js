export const fetchSessions = async () => {
  // Mock data for admin review
  return [
    { 
      id: "SES-101", 
      patientName: "Anonymous", 
      startTime: "2026-02-27 10:30", 
      duration: "5m 12s", 
      status: 'completed', 
      summary: "Inquiry about vaccination drive." 
    },
    { 
      id: "SES-102", 
      patientName: "Rahul Sharma", 
      startTime: "2026-02-27 11:15", 
      duration: "2m 45s", 
      status: 'flagged', 
      summary: "Emergency: High fever and breathing issues." 
    },
    { 
      id: "SES-103", 
      patientName: "Anonymous", 
      startTime: "2026-02-27 12:00", 
      duration: "8m 20s", 
      status: 'active', 
      summary: "Checking hospital room availability." 
    },
  ];
};