import { format, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock3, Plus, Sparkles } from "lucide-react";
import MonthCalendar from "../components/MonthCalendar";
import StatRing from "../components/StatRing";

export default function Overview({
  user, month, setMonth, selectedDate, setSelectedDate, events, notes, onAddEvent, onOpenNotes
}) {
  const todaysEvents = events
    .filter(e => isSameDay(new Date(e.event_date + "T00:00:00"), new Date()))
    .sort((a,b) => (a.start_time || "").localeCompare(b.start_time || ""));

  const completed = events.filter(e => new Date(e.event_date + "T23:59:59") < new Date()).length;
  const completion = events.length ? Math.min(100, Math.round((completed / events.length) * 100)) : 0;

  return (
    <div className="page-grid overview-grid">
      <motion.section
        className="welcome-card"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="welcome-chip"><Sparkles size={14}/> {format(new Date(), "EEEE, MMMM d")}</span>
          <h2>Hello, {user?.user_metadata?.full_name?.split(" ")[0] || "there"}.</h2>
          <p>Your day is looking calm. Pick one meaningful thing and begin there.</p>
          <button onClick={onAddEvent}><Plus size={16}/> Plan something</button>
        </div>
        <div className="quote-orbit">
          <div className="orbit-ring ring-a" />
          <div className="orbit-ring ring-b" />
          <div className="orbit-core">one<br/>thing</div>
        </div>
      </motion.section>

      <div className="stats-column">
        <StatRing label="Plan rhythm" value={completion} detail={`${completed} finished items`} delay={0.1}/>
        <StatRing label="Notes" value={Math.min(100, notes.length * 12)} detail={`${notes.length} saved thoughts`} delay={0.2}/>
        <StatRing label="This week" value={Math.min(100, events.length * 8)} detail={`${events.length} planned events`} delay={0.3}/>
      </div>

      <MonthCalendar
        compact
        month={month}
        setMonth={setMonth}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        events={events}
      />

      <section className="today-card">
        <div className="section-head">
          <div>
            <p className="eyebrow">Today</p>
            <h3>Your timeline</h3>
          </div>
          <button onClick={onAddEvent}><Plus size={17}/></button>
        </div>

        <div className="timeline-list">
          {todaysEvents.length ? todaysEvents.map((event, i) => (
            <motion.div
              key={event.id}
              className="timeline-item"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <span className={`timeline-accent tone-${event.color || "plum"}`} />
              <div>
                <strong>{event.title}</strong>
                <p><Clock3 size={14}/> {event.start_time?.slice(0,5) || "Any time"}</p>
              </div>
              <ArrowUpRight size={17}/>
            </motion.div>
          )) : (
            <div className="empty-mini">
              <span>☕</span>
              <p>No events yet. Keep the space or add one.</p>
            </div>
          )}
        </div>
      </section>

      <section className="notes-preview">
        <div className="section-head">
          <div>
            <p className="eyebrow">Recent notes</p>
            <h3>Thoughts worth keeping</h3>
          </div>
          <button className="text-btn" onClick={onOpenNotes}>View all</button>
        </div>
        <div className="note-preview-grid">
          {notes.slice(0, 3).map((note, index) => (
            <motion.article
              key={note.id}
              className={`note-preview note-tone-${note.color || "cream"}`}
              whileHover={{ y: -5, rotate: index === 1 ? 1 : -0.5 }}
            >
              <small>{format(new Date(note.created_at), "MMM d")}</small>
              <h4>{note.title}</h4>
              <p>{note.content}</p>
            </motion.article>
          ))}
          {!notes.length && <div className="empty-wide">Your notes will appear here.</div>}
        </div>
      </section>
    </div>
  );
}
