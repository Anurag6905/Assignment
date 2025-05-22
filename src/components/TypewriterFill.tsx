import React, { useState, useEffect } from "react";
import "../CSS/Design.css"

interface TypewriterFillProps {
  text: string;
  typingDelay?: number;
  fillDelay?: number;
}

const TypewriterFill: React.FC<TypewriterFillProps> = ({
  text,
  typingDelay = 120,
  fillDelay = 600,
}) => {
  const [typed, setTyped] = useState("");
  const [showFill, setShowFill] = useState(false);

  // Typewriter effect
  useEffect(() => {
    if (typed.length < text.length) {
      const timeout = setTimeout(() => {
        setTyped(text.slice(0, typed.length + 1));
      }, typingDelay);
      return () => clearTimeout(timeout);
    } else {
      // Start fill animation after typing
      const timer = setTimeout(() => setShowFill(true), fillDelay);
      return () => clearTimeout(timer);
    }
  }, [typed, text, typingDelay, fillDelay]);

  return (
    <div className="twf-container">
      {/* Outlined (typewriter) text */}
      <span className="twf-outlined">{typed}</span>
      {/* Filled text, revealed from bottom up */}
      <span
        className="twf-filled"
        style={{
          clipPath: showFill
            ? "inset(0% 0% 0% 0%)"
            : "inset(100% 0% 0% 0%)",
          transition: "clip-path 1.1s cubic-bezier(.77,0,.18,1)",
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default TypewriterFill;
