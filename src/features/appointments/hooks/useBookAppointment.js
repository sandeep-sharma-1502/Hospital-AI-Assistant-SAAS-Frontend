import { useState } from "react";
import { fetchAvailableSlots, createAppointment } from "../services/appointmentApi";
import toast from "react-hot-toast";

export const useBookAppointment = () => {
  const [step, setStep] = useState(1);
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadSlots = async () => {
    try {
      setLoading(true);
      const data = await fetchAvailableSlots(doctor.id, date);
      setSlots(data);
      setStep(3);
    } catch {
      toast.error("Failed to load slots");
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = async (patient) => {
    try {
      setLoading(true);

      await createAppointment({
        doctor_id: doctor.id,
        availability_slot_id: slot.id,
        patient_name: patient.name,
        phone_number: patient.phone
      });

      toast.success("Appointment booked successfully");
      setStep(6);

    // Auto close after 2 seconds
    setTimeout(() => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("appointment-booked"));
    }
    }, 1500);
    } catch {
      toast.error("Booking failed");
    } finally {
      setLoading(false);
    }
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
    confirmBooking,
    loading
  };
};