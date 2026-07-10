import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Trash2, Pin, X } from "lucide-react";
import { format } from "date-fns";

export default function NotesPage({ notes, search, onCreate, onUpdate, onDelete }) {
  const [activeId, setActiveId] = useState(notes[0]?.id || null);
  const [draft, setDraft] = useState(null);

  const filtered = useMemo(() => notes.filter(note =>
    `${note.title} ${note.content}`.toLowerCase().includes(search.toLowerCase())
  ), [notes, search]);

  const active = notes.find(n => n.id === activeId) || filtered[0];

  const newNote = () => {
    setDraft({ title: "", content: "", color: "cream" });
    setActiveId(null);
  };

  const saveDraft = async () => {
    if (!draft?.title.trim() && !draft?.content.trim()) return;
    const created = await onCreate(draft);
    setDraft(null);
    if (created?.id) setActiveId(created.id);
  };

  return (
    <div className="notes-layout">
      <section className="notes-list-panel">
        <div className="notes-list-head">
          <div>
            <p className="eyebrow">Library</p>
            <h3>All notes</h3>
          </div>
          <button onClick={newNote}><Plus size={18}/></button>
        </div>

        <div className="notes-search"><Search size={15}/><span>{filtered.length} notes</span></div>

        <div className="notes-list">
          {filtered.map(note => (
            <button
              key={note.id}
              className={`note-list-item ${active?.id === note.id ? "active" : ""}`}
              onClick={() => { setDraft(null); setActiveId(note.id); }}
            >
              <div>
                <strong>{note.title || "Untitled note"}</strong>
                <p>{note.content || "No content yet"}</p>
              </div>
              <small>{format(new Date(note.updated_at || note.created_at), "MMM d")}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="note-editor-panel">
        <AnimatePresence mode="wait">
          {draft ? (
            <motion.div key="new" className="note-editor" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
              <div className="editor-top">
                <span>New note</span>
                <button onClick={() => setDraft(null)}><X size={18}/></button>
              </div>
              <input
                className="note-title-input"
                autoFocus
                placeholder="A title for this thought"
                value={draft.title}
                onChange={e => setDraft({...draft, title:e.target.value})}
              />
              <textarea
                className="note-body-input"
                placeholder="Start writing..."
                value={draft.content}
                onChange={e => setDraft({...draft, content:e.target.value})}
              />
              <div className="editor-footer">
                <div className="color-options">
                  {["cream","blush","lavender","sage","blue"].map(color => (
                    <button
                      key={color}
                      className={`color-dot note-${color} ${draft.color === color ? "active" : ""}`}
                      onClick={() => setDraft({...draft, color})}
                    />
                  ))}
                </div>
                <button className="primary-btn" onClick={saveDraft}>Save note</button>
              </div>
            </motion.div>
          ) : active ? (
            <motion.div key={active.id} className="note-editor" initial={{opacity:0,x:8}} animate={{opacity:1,x:0}} exit={{opacity:0}}>
              <div className="editor-top">
                <span>Last updated {format(new Date(active.updated_at || active.created_at), "MMM d, h:mm a")}</span>
                <div>
                  <button title="Pin"><Pin size={17}/></button>
                  <button title="Delete" onClick={() => onDelete(active.id)}><Trash2 size={17}/></button>
                </div>
              </div>
              <input
                className="note-title-input"
                value={active.title}
                onChange={e => onUpdate(active.id, { title: e.target.value })}
              />
              <textarea
                className="note-body-input"
                value={active.content}
                onChange={e => onUpdate(active.id, { content: e.target.value })}
              />
              <div className="editor-footer">
                <div className="color-options">
                  {["cream","blush","lavender","sage","blue"].map(color => (
                    <button
                      key={color}
                      className={`color-dot note-${color} ${active.color === color ? "active" : ""}`}
                      onClick={() => onUpdate(active.id, { color })}
                    />
                  ))}
                </div>
                <span className="autosave">Saved automatically</span>
              </div>
            </motion.div>
          ) : (
            <div className="empty-editor">
              <span>✎</span>
              <h3>Write something worth remembering</h3>
              <button onClick={newNote}>Create your first note</button>
            </div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
