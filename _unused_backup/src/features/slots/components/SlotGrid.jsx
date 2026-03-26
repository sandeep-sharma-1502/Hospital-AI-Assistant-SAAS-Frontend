export default function SlotGrid({ slots, onBook }) {

  if (!slots.length) {

    return (
      <p className="text-gray-500">
        No slots available
      </p>
    );

  }

  const statusColor = {

    AVAILABLE: "bg-green-500",
    BOOKED: "bg-gray-500",
    RESERVED: "bg-yellow-500",
    BLOCKED: "bg-red-500"

  };

  return (

    <div className="grid grid-cols-4 gap-3">

      {slots.map(slot => (

        <button
          key={slot.id}
          disabled={slot.status !== "AVAILABLE"}
          onClick={() => onBook(slot)}
          className={`p-3 text-white rounded ${statusColor[slot.status]}`}
        >

          {slot.startTime}

        </button>

      ))}

    </div>

  );

}