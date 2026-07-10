import { useState } from "react";
import { format } from "date-fns";

export default function EventForm({ selectedDate, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    event_date: format(selectedDate || new Date(), "yyyy-MM-dd"),
    start_time: "09:00",
    end_time: "10:00",
    description: "",
    color: "plum"
  });

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
  };

  return (
    <form className="planner-form" onSubmit={submit}>
      <label>
        Event title
        <input autoFocus value={form.title} onChange={update("title")} placeholder="What are you planning?" />
      </label>
      <div className="form-row">
        <label>Date<input type="date" value={form.event_date} onChange={update("event_date")} /></label>
        <label>Starts<input type="time" value={form.start_time} onChange={update("start_time")} /></label>
        <label>Ends<input type="time" value={form.end_time} onChange={update("end_time")} /></label>
      </div>
      <label>
        Note
        <textarea value={form.description} onChange={update("description")} placeholder="Add a little context..." />
      </label>
      <label>
        Color
        <div className="color-options">
          {["plum", "rose", "mint", "sun", "sky"].map(color => (
            <button
              type="button"
              key={color}
              className={`color-dot color-${color} ${form.color === color ? "active" : ""}`}
              onClick={() => setForm({ ...form, color })}
              aria-label={color}
            />
          ))}
        </div>
      </label>
      <div className="form-actions">
        <button type="button" className="secondary-btn" onClick={onCancel}>Cancel</button>
        <button className="primary-btn">Save event</button>
      </div>
    </form>
  );
}
