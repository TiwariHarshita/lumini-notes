import { useMemo } from "react";
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, isToday
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function MonthCalendar({
  month, setMonth, selectedDate, setSelectedDate, events, compact = false, onAdd
}) {
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [month]);

  const previous = () => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  const next = () => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));

  return (
    <section className={`calendar-card ${compact ? "compact-calendar" : ""}`}>
      <div className="calendar-head">
        <div>
          <p className="eyebrow">Schedule</p>
          <h3>{format(month, "MMMM yyyy")}</h3>
        </div>
        <div className="calendar-controls">
          <button onClick={previous}><ChevronLeft size={17}/></button>
          <button onClick={() => setMonth(new Date())}>Today</button>
          <button onClick={next}><ChevronRight size={17}/></button>
          {!compact && <button className="small-primary" onClick={onAdd}><Plus size={15}/> Add event</button>}
        </div>
      </div>

      <div className="weekday-row">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <span key={d}>{d}</span>)}
      </div>

      <div className="calendar-grid">
        {days.map((day) => {
          const dayEvents = events.filter(event => isSameDay(new Date(event.event_date + "T00:00:00"), day));
          const selected = isSameDay(day, selectedDate);
          return (
            <motion.button
              key={day.toISOString()}
              className={[
                "calendar-day",
                !isSameMonth(day, month) ? "outside" : "",
                selected ? "selected" : "",
                isToday(day) ? "today" : ""
              ].join(" ")}
              onClick={() => setSelectedDate(day)}
              whileHover={{ scale: compact ? 1.05 : 1.015 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="day-number">{format(day, "d")}</span>
              {!compact && (
                <div className="day-events">
                  {dayEvents.slice(0, 2).map(event => (
                    <span key={event.id} className={`event-pill tone-${event.color || "plum"}`}>
                      {event.title}
                    </span>
                  ))}
                  {dayEvents.length > 2 && <small>+{dayEvents.length - 2} more</small>}
                </div>
              )}
              {compact && dayEvents.length > 0 && <i className="event-dot" />}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
