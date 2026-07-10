import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="ambient-bg" aria-hidden="true">
      <motion.div
        className="orb orb-one"
        animate={{ x: [0, 36, -18, 0], y: [0, -25, 20, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="orb orb-two"
        animate={{ x: [0, -30, 22, 0], y: [0, 20, -28, 0], scale: [1, 0.92, 1.08, 1] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="orb orb-three"
        animate={{ rotate: [0, 20, -14, 0], scale: [1, 1.12, 0.94, 1] }}
        transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="grain" />
    </div>
  );
}
