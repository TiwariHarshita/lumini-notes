import { motion } from "framer-motion";

export default function StatRing({ label, value, suffix = "%", detail, delay = 0 }) {
  const circumference = 2 * Math.PI * 42;
  const progress = circumference - (value / 100) * circumference;

  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      whileHover={{ y: -4 }}
    >
      <p>{label}</p>
      <div className="ring-wrap">
        <svg viewBox="0 0 100 100">
          <circle className="ring-bg" cx="50" cy="50" r="42" />
          <motion.circle
            className="ring-progress"
            cx="50" cy="50" r="42"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: progress }}
            transition={{ delay: delay + 0.15, duration: 1.1, ease: "easeOut" }}
          />
        </svg>
        <strong>{value}{suffix}</strong>
      </div>
      <small>{detail}</small>
    </motion.div>
  );
}
