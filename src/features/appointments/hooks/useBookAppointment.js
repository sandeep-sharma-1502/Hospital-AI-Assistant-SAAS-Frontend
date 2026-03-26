import { useState } from "react";
import toast from "react-hot-toast";

import {
  fetchAvailableSlots,
  createAppointment,
  checkBookingStatus
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
   * Confirm booking (Queue + Polling ✅)
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

      const data = await createAppointment({
        slotId: slot.id,
        patientId: form.patientId
      });

      if (data?.status === "QUEUED" && data?.trackingId) {
        toast.loading("Booking in progress...", { id: "booking-toast" });

        let attempts = 0;
        const poll = setInterval(async () => {
          attempts++;
          try {
             const statusData = await checkBookingStatus(data.trackingId);
             
             if (statusData?.status === "SUCCESS") {
                clearInterval(poll);
                toast.success("Appointment booked successfully", { id: "booking-toast" });
                setStep(6);
                window.dispatchEvent(new Event("appointment-booked"));
                setLoading(false);
             } else if (statusData?.status === "FAILED") {
                clearInterval(poll);
                toast.error(statusData?.error || "Booking failed", { id: "booking-toast" });
                setLoading(false);
             } else if (attempts > 30) {
                // timeout after 60 seconds
                clearInterval(poll);
                toast.error("Booking timed out", { id: "booking-toast" });
                setLoading(false);
             }
          } catch(e) {
             console.error("Polling error", e);
          }
        }, 2000); 
      } else {
         toast.success("Appointment booked successfully");
         setStep(6);
         window.dispatchEvent(new Event("appointment-booked"));
         setLoading(false);
      }

    } catch (err) {

      toast.error(err.message || "Booking failed");
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