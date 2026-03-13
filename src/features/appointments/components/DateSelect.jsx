export default function DateSelect({ value, onChange, onNext }) {
  return (
    <div className="space-y-4">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 bg-input-bg border border-border-subtle rounded-xl"
      />
      <button
        onClick={onNext}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
      >
        Fetch Slots
      </button>
    </div>
  );
}