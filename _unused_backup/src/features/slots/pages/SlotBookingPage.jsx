import { useState } from "react";
import SlotGrid from "../components/SlotGrid";
import { fetchAvailableSlots } from "../../appointments/services/appointmentApi";

export default function SlotBookingPage() {

  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);

  const loadSlots = async () => {

    const data = await fetchAvailableSlots(
      doctorId,
      date
    );

    setSlots(data);

  };

  return (

    <div className="p-8">

      <h1 className="text-2xl font-bold mb-6">
        Slot Booking
      </h1>

      <div className="flex gap-3 mb-6">

        <input
          placeholder="Doctor ID"
          className="p-3 border rounded"
          onChange={(e) =>
            setDoctorId(e.target.value)
          }
        />

        <input
          type="date"
          className="p-3 border rounded"
          onChange={(e) =>
            setDate(e.target.value)
          }
        />

        <button
          onClick={loadSlots}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Load Slots
        </button>

      </div>

      <SlotGrid slots={slots} />

    </div>

  );

}