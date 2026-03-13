export default function DoctorSelect({ doctors, onSelect }) {
  return (
    <div className="space-y-2">
      {doctors.map(doc => (
        <button
          key={doc.id}
          onClick={() => onSelect(doc)}
          className="w-full p-4 bg-card border border-border-subtle rounded-xl hover:bg-blue-500/10"
        >
          <p className="font-bold">{doc.name}</p>
          <p className="text-xs text-text-secondary">{doc.department}</p>
        </button>
      ))}
    </div>
  );
}