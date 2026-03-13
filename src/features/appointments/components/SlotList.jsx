export default function SlotList({ slots, onSelect }) {
  if (!slots.length) {
    return <p className="text-sm text-text-secondary">No slots available</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {slots.map(slot => (
        <button
          key={slot.id}
          onClick={() => onSelect(slot)}
          className="p-3 bg-card border border-border-subtle rounded-xl hover:bg-emerald-500/10"
        >
          {new Date(slot.start_time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </button>
      ))}
    </div>
  );
}