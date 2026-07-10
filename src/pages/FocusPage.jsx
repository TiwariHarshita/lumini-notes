import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";

export default function FocusPage() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setSeconds(value => {
        if (value <= 1) {
          setRunning(false);
          setSessions(s => s + 1);
          return 25 * 60;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running]);

  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const progress = 1 - seconds / (25 * 60);

  return (
    <div className="focus-page">
      <motion.section className="focus-card" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}}>
        <p className="eyebrow">Focus room</p>
        <h2>Make space for one thing.</h2>
        <div className="focus-timer">
          <svg viewBox="0 0 240 240">
            <circle className="timer-bg" cx="120" cy="120" r="103" />
            <motion.circle
              className="timer-progress"
              cx="120" cy="120" r="103"
              strokeDasharray={647}
              animate={{ strokeDashoffset: 647 * (1 - progress) }}
            />
          </svg>
          <div>
            <strong>{minutes}:{secs}</strong>
            <span>focus session</span>
          </div>
        </div>
        <div className="timer-actions">
          <button onClick={() => setRunning(!running)} className="primary-btn">
            {running ? <Pause size={18}/> : <Play size={18}/>}
            {running ? "Pause" : "Start focus"}
          </button>
          <button onClick={() => {setRunning(false);setSeconds(25*60)}} className="secondary-btn"><RotateCcw size={18}/></button>
        </div>
      </motion.section>

      <section className="focus-side-card">
        <p className="eyebrow">Today</p>
        <h3>{sessions} completed sessions</h3>
        <div className="session-dots">
          {Array.from({length:4}).map((_,i)=>(
            <span key={i} className={i < sessions ? "done" : ""}><CheckCircle2 size={23}/></span>
          ))}
        </div>
        <blockquote>“You do not need more time. You need fewer directions.”</blockquote>
      </section>
    </div>
  );
}
