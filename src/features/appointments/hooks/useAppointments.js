import { useState } from 'react';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([
    { id: 'APP-001', patient: 'Anjali Gupta', doctor: 'Dr. Verma', date: '2026-03-01', time: '10:30 AM', status: 'confirmed', type: 'Cardiology' },
    { id: 'APP-002', patient: 'Rahul Singh', doctor: 'Dr. Iyer', date: '2026-03-01', time: '12:00 PM', status: 'pending', type: 'General Checkup' },
    { id: 'APP-003', patient: 'Sana Khan', doctor: 'Dr. Verma', date: '2026-03-02', time: '09:15 AM', status: 'cancelled', type: 'Follow-up' },
  ]);

  const updateStatus = (id, newStatus) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  return { appointments, updateStatus };
};