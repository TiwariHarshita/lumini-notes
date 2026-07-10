import { format, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import { Clock3, MapPin, Trash2 } from "lucide-react";
import MonthCalendar from "../components/MonthCalendar";

export default function CalendarPage({
  month, setMonth, selectedDate, setSelectedDate, events, onAdd, onDelete
}) {
  const selectedEvents = events.filter(event =>
    isSameDay(new Date(event.event_date + "T00:00:00"), selectedDate)
  );

  return (
    <div className="calendar-page-layout">
      <MonthCalendar
        month={month}
        setMonth={setMonth}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        events={events}
        onAdd={onAdd}
      />
      <aside className="agenda-panel">
        <div className="agenda-date">
          <span>{format(selectedDate, "EEE")}</span>
          <strong>{format(selectedDate, "d")}</strong>
          <p>{format(selectedDate, "MMMM yyyy")}</p>
        </div>

        <div className="agenda-list">
          {selectedEvents.map((event, index) => (
            <motion.article
              key={event.id}
              className={`agenda-item tone-border-${event.color || "plum"}`}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <div>
                <small><Clock3 size={13}/> {event.start_time?.slice(0,5)} – {event.end_time?.slice(0,5)}</small>
                <h4>{event.title}</h4>
                {event.description && <p>{event.description}</p>}
              </div>
              <button onClick={() => onDelete(event.id)} title="Delete event"><Trash2 size={16}/></button>
            </motion.article>
          ))}
          {!selectedEvents.length && (
            <div className="empty-agenda">
              <div>✦</div>
              <h4>A clear day</h4>
              <p>Add an event, a study block or just leave room to breathe.</p>
              <button onClick={onAdd}>Add an event</button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
