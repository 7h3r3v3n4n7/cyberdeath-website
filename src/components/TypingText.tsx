"use client";

import React, { useState, useEffect } from "react";

function TypingText({ text, speed = 50, onComplete }: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  // Typewriter effect using setTimeout
  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  // Blink cursor
  useEffect(() => {
    const id = setInterval(() => setShowCursor(v => !v), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center text-left relative z-20">
      <span className="text-green-400 font-mono select-none relative z-20">
        {displayedText}
      </span>
      {showCursor && (
        <span className="text-green-400 ml-1 font-mono select-none relative z-20">|</span>
      )}
    </div>
  );
}

export default TypingText;
