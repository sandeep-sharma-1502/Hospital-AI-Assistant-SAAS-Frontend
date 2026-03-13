import { useBookAppointment } from "../hooks/useBookAppointment";
import DoctorSelect from "./DoctorSelect";
import DateSelect from "./DateSelect";
import SlotList from "./SlotList";
import PatientForm from "./PatientForm";

export default function BookAppointmentModal({ doctors, onClose }) {
  const booking = useBookAppointment();

  return (
    <div className="p-6 bg-card rounded-[32px] w-full max-w-lg">
      {booking.step === 1 && (
        <DoctorSelect
          doctors={doctors}
          onSelect={(doc) => {
            booking.setDoctor(doc);
            booking.setStep(2);
          }}
        />
      )}

      {booking.step === 2 && (
        <DateSelect
          value={booking.date}
          onChange={booking.setDate}
          onNext={booking.loadSlots}
        />
      )}

      {booking.step === 3 && (
        <SlotList
          slots={booking.slots}
          onSelect={(slot) => {
            booking.setSlot(slot);
            booking.setStep(4);
          }}
        />
      )}

      {booking.step === 4 && (
        <PatientForm
          loading={booking.loading}
          onSubmit={booking.confirmBooking}
        />
      )}

      {booking.step === 6 && (
        <p className="text-center font-bold text-emerald-600">
          Appointment Confirmed 🎉
        </p>
      )}
    </div>
  );
}