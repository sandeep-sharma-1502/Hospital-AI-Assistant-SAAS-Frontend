import { useEffect, useState } from "react";

import {
  fetchAppointments,
  cancelAppointment,
  rescheduleAppointment,
  updateAppointment
} from "../services/appointmentApi";
import toast from "react-hot-toast";

export const useAppointments = (filters = {}) => {

  const [appointments, setAppointments] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load appointments
   */
  const loadAppointments = async (overrideFilters = {}) => {

    try {

      setLoading(true);

      const params = { ...filters, ...overrideFilters };
      const response = await fetchAppointments(params);

      setAppointments(response.appointments || []);
      setMeta(response.meta || { page: 1, totalPages: 1, total: 0 });

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
   * Update Status
   */
  const updateStatus = async (id, data) => {
    try {
      await updateAppointment(id, data);
      await loadAppointments();
      toast.success("Status Updated Successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
      throw err;
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

  }, [filters.page, filters.status, filters.search]); // Re-fetch on filter change

  return {

    appointments,
    meta,
    loading,
    error,

    cancel,
    reschedule,
    updateStatus,

    reload: loadAppointments

  };

};