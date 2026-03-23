import { createAppointment } from "../../appointments/services/appointmentApi";

export default function SlotTimeline({ slots }) {

  const book = async (slotId) => {

    await createAppointment(slotId);

    alert("Appointment booked");

  };

  if (!slots.length) {

    return <p>No slots</p>;

  }

  const colors = {
    AVAILABLE: "bg-green-500",
    BOOKED: "bg-gray-500",
    RESERVED: "bg-yellow-500",
    BLOCKED: "bg-red-500"
  };

  return (

    <div className="space-y-2">

      {slots.map(slot => (

        <div
          key={slot.id}
          className={`flex justify-between p-3 rounded text-white ${colors[slot.status]}`}
        >

          <span>{slot.startTime}</span>

          <div className="flex gap-2">

            <span>{slot.status}</span>

            {slot.status === "AVAILABLE" && (

              <button
                onClick={() => book(slot.id)}
                className="bg-white text-black px-2 py-1 rounded text-xs"
              >
                Book
              </button>

            )}

          </div>

        </div>

      ))}

    </div>

  );

}