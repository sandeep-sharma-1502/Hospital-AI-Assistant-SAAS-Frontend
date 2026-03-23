import { useEffect, useState } from "react";

import {
  fetchAppointments,
  cancelAppointment,
  rescheduleAppointment
} from "../services/appointmentApi";

export const useAppointments = () => {

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load appointments
   */
  const loadAppointments = async () => {

    try {

      setLoading(true);

      const data = await fetchAppointments();

      setAppointments(data || []);

      setError(null);

    } catch (err) {

      console.error(err);

      setError("Failed to load appointments");

    } finally {

      setLoading(false);

    }

  };

  /**
   * Cancel appointment
   */
  const cancel = async (id) => {

    try {

      await cancelAppointment(id);

      await loadAppointments();

    } catch (err) {

      console.error(err);

      alert("Failed to cancel appointment");

    }

  };

  /**
   * Reschedule appointment
   */
  const reschedule = async (appointmentId, newSlotId) => {

    try {

      await rescheduleAppointment(
        appointmentId,
        newSlotId
      );

      await loadAppointments();

    } catch (err) {

      console.error(err);

      alert("Reschedule failed");

    }

  };

  /**
   * Initial load + booking refresh
   */
  useEffect(() => {

    loadAppointments();

    const handleRefresh = () => loadAppointments();

    window.addEventListener(
      "appointment-booked",
      handleRefresh
    );

    return () => {

      window.removeEventListener(
        "appointment-booked",
        handleRefresh
      );

    };

  }, []);

  return {

    appointments,
    loading,
    error,

    cancel,
    reschedule,

    reload: loadAppointments

  };

};