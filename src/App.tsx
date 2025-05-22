import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Hero from "./components/Hero";
import TypewriterFill from "./components/TypewriterFill";

const LANDING_DURATION = 2500;

export default function App() {
  const [showHero, setShowHero] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowHero(true), LANDING_DURATION);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!showHero && (
        <motion.div
          key="landing"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -80 }}
          transition={{ duration: 0.7 }}
          style={{
            background: "#181818",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "fixed",
            width: "100vw",
            top: 0,
            left: 0,
            zIndex: 9999,
          }}
        >
          <TypewriterFill text="MANTHAN LAWDE" />
        </motion.div>
      )}
      {showHero && (
        <motion.div
          key="hero"
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            minHeight: "100vh",
            width: "100vw",
            background: "#181818",
          }}
        >
          <Hero />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
