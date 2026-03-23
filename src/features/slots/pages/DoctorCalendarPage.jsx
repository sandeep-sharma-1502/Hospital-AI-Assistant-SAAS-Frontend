import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";

import { fetchDoctorSlots } from "../services/slotApi";
import DoctorBlockModal from "../../doctorBlocks/components/DoctorBlockModal";

export default function DoctorCalendarPage({ doctor }) {
  const [events, setEvents] = useState([]);
  const [blockRange, setBlockRange] = useState(null);

  useEffect(() => {
    if (doctor) loadSlots();
  }, [doctor]);

  const loadSlots = async () => {
    try {
      const data = await fetchDoctorSlots(doctor.id);

      const calendarEvents = data.map(slot => ({
        id: slot.id,
        title: slot.status === "AVAILABLE" ? "Available" : "Occupied",
        start: `${slot.date}T${slot.startTime}`,
        end: `${slot.date}T${slot.endTime}`,
        // Professional Glowing Colors
        backgroundColor: slot.status === "AVAILABLE" 
          ? "rgba(16, 185, 129, 0.15)" 
          : "rgba(244, 63, 94, 0.15)",
        borderColor: slot.status === "AVAILABLE" ? "#10b981" : "#f43f5e",
        textColor: slot.status === "AVAILABLE" ? "#34d399" : "#fb7185",
      }));

      setEvents(calendarEvents);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (info) => {
    setBlockRange({
      start: info.startStr,
      end: info.endStr
    });
  };

  return (
    <div className="calendar-pro-wrapper">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        selectMirror={true}
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="19:00:00" // 7 PM tak restrict kiya space bachane ke liye
        slotDuration="00:30:00"
        height="auto"
        events={events}
        select={handleSelect}
        nowIndicator={true}
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'today'
        }}
      />

      {blockRange && (
        <DoctorBlockModal
          doctor={doctor}
          start={blockRange.start}
          end={blockRange.end}
          onClose={() => setBlockRange(null)}
          onCreated={() => {
            setBlockRange(null);
            loadSlots();
          }}
        />
      )}

      <style jsx global>{`
        /* --- CALENDAR BODY COMPRESSION --- */
        .fc .fc-timegrid-slot {
          height: 32px !important; /* Balanced: Not too small, not too big */
        }

        /* --- TOOLBAR: CLEAN & MINIMAL --- */
        .fc .fc-toolbar {
          display: flex;
          align-items: center;
          padding: 8px 12px !important;
          margin-bottom: 0px !important;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .fc .fc-toolbar-title {
          font-size: 13px !important;
          font-weight: 700 !important;
          color: #e4e4e7 !important;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .fc .fc-button {
          background: transparent !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          font-size: 10px !important;
          text-transform: uppercase !important;
          font-weight: 700 !important;
          padding: 4px 8px !important;
          color: #a1a1aa !important;
        }
        .fc .fc-button-primary:not(:disabled):active, 
        .fc .fc-button-primary:not(:disabled).fc-button-active {
          background: #3b82f6 !important;
          border-color: #3b82f6 !important;
          color: white !important;
        }

        /* --- HEADERS: COMPACT DATES --- */
        .fc .fc-col-header-cell {
          padding: 6px 0 !important;
          background: rgba(0, 0, 0, 0.2);
        }
        .fc .fc-col-header-cell-cushion {
          font-size: 10px !important;
          font-weight: 800 !important;
          color: #71717a !important;
        }

        /* --- SLOTS & EVENTS --- */
        .fc .fc-timegrid-slot-label-cushion {
          font-size: 9px !important;
          font-weight: 600;
          color: #52525b !important;
        }
        .fc-v-event {
          border-radius: 6px !important;
          border-left: 3px solid !important; /* Left accent bar */
          padding: 2px 4px !important;
        }
        .fc-event-main {
          font-size: 9px !important;
          font-weight: 700 !important;
        }

        /* --- BORDER SYSTEM --- */
        .fc-theme-standard td, .fc-theme-standard th {
          border: 1px solid rgba(255, 255, 255, 0.03) !important;
        }
        .fc .fc-timegrid-now-indicator-line {
          border-color: #3b82f6 !important;
        }
      `}</style>
    </div>
  );
}