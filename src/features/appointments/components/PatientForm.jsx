import { useState } from "react";

export default function PatientForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ name: "", phone: "" });

  return (
    <div className="space-y-4">
      <input
        placeholder="Patient Name"
        className="w-full p-3 bg-input-bg border border-border-subtle rounded-xl"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Phone Number"
        className="w-full p-3 bg-input-bg border border-border-subtle rounded-xl"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <button
        onClick={() => onSubmit(form)}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
      >
        Confirm Booking
      </button>
    </div>
  );
}