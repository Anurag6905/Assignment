import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Hero from "./components/Hero";
import TypewriterFill from "./components/TypewriterFill";
import Navbar from "./components/Navbar";

const LANDING_DURATION = 3500;

export default function App() {
  const [showHero, setShowHero] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowHero(true), LANDING_DURATION);
    return () => clearTimeout(timer);
  }, []);

  return (
  <>
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
          <TypewriterFill text="ITZFIZZ DIGITAL" />
        </motion.div>
      )}
      {showHero && (
        <>
          <motion.div 
            key="navbar"
            initial={{ opacity: 0, y: 80}}
            animate={{opacity: 1, y: 0}}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              height: "auto",
              width: "100vw",
              background: "#181818",
            }}
            >
              <Navbar />
          </motion.div>
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
        </>
      )}
    </AnimatePresence>
  </>
  );
}
