import { useState } from "react";
import toast from "react-hot-toast";

import {
  fetchAvailableSlots,
  createAppointment
} from "../services/appointmentApi";

export const useBookAppointment = () => {

  const [step, setStep] = useState(1);
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [slot, setSlot] = useState(null);

  const [loading, setLoading] = useState(false);

  /**
   * Fetch slots
   */
  const loadSlots = async () => {

    if (!doctor || !date) {
      toast.error("Select doctor and date");
      return;
    }

    try {

      setLoading(true);

      const data = await fetchAvailableSlots(
        doctor.id,
        date
      );

      setSlots(data);
      setStep(3);

    } catch {

      toast.error("Failed to load slots");

    } finally {

      setLoading(false);

    }

  };

  /**
   * Select slot (NO API call now ✅)
   */
  const selectSlot = (selectedSlot) => {

    setSlot(selectedSlot);
    setStep(4);

  };

  /**
   * Confirm booking (UPDATED ✅)
   */
  const confirmBooking = async (form) => {

    if (!slot) {
      toast.error("No slot selected");
      return;
    }

    if (!form?.patientId) {
      toast.error("Select patient");
      return;
    }

    try {

      setLoading(true);

      await createAppointment({
        slotId: slot.id,
        patientId: form.patientId
      });

      toast.success("Appointment booked successfully");

      setStep(6);

      window.dispatchEvent(
        new Event("appointment-booked")
      );

    } catch (err) {

      toast.error(err.message || "Booking failed");

    } finally {

      setLoading(false);

    }

  };

  /**
   * Reset booking state
   */
  const resetBooking = () => {

    setStep(1);
    setDoctor(null);
    setDate("");
    setSlots([]);
    setSlot(null);

  };

  return {
    step,
    setStep,
    doctor,
    setDoctor,
    date,
    setDate,
    slots,
    slot,
    setSlot,
    loadSlots,
    selectSlot,      // ✅ NEW
    confirmBooking,
    resetBooking,
    loading
  };

};