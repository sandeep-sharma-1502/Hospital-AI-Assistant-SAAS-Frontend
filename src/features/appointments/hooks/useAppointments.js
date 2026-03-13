// 


import { useEffect, useState } from "react";
import {
  fetchAppointments,
  cancelAppointment
} from "../services/appointmentApi";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (err) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      if (newStatus === "cancelled") {
        await cancelAppointment(id);
        await loadAppointments();
      }
    } catch {
      alert("Error updating appointment");
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  return {
    appointments,
    loading,
    error,
    updateStatus,
    reload: loadAppointments
  };
};