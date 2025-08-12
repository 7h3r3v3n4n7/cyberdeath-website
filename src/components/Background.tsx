"use client";

import { useMemo, useState, useEffect } from "react";

const CHARS =
  "｢｣､ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789";

type Column = {
  id: number;
  left: string;
  duration: string;
  delay: string;
  size: number;
  chars: string[];
};

export default function Background({ columns = 100 }: { columns?: number }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const data = useMemo<Column[]>(() => {
    if (!isClient) return [];
    
    return Array.from({ length: columns }, (_, i) => {
      const size = 0.9 + Math.random() * 0.6; // 0.9x - 1.5x
      const len = 18 + Math.floor(Math.random() * 20); // 18-37
      const chars = Array.from({ length: len }, () => CHARS[Math.floor(Math.random() * CHARS.length)]);
      
      return {
        id: i,
        left: `${(i / columns) * 100}%`,
        duration: `${(5 + Math.random() * 6).toFixed(2)}s`,
        delay: `${(Math.random() * 4).toFixed(2)}s`,
        size,
        chars,
      };
    });
  }, [columns, isClient]);

  if (!isClient) {
    return (
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Placeholder while loading */}
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* soft scan/pulse overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/5 to-transparent animate-pulse" />

      {/* top/bottom masks for nicer fade-in/out of streams */}
      <div className="absolute inset-0" style={{ WebkitMaskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)", maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)" }} />

      {data.map((col) => (
        <div
          key={col.id}
          className="absolute -top-[120%] h-[220%] animate-matrix-fall"
          style={{
            left: col.left,
            animationDuration: col.duration,
            animationDelay: col.delay,
          }}
        >
          <div className="flex flex-col items-center">
            {col.chars.map((c, idx) => {
              const opacity = 0.15 + (idx / col.chars.length) * 0.85;
              const isHead = idx === col.chars.length - 1;
              return (
                <span
                  key={idx}
                  className="select-none font-mono"
                  style={{
                    color: isHead ? "#e6ffe6" : "rgba(0,255,0,0.75)",
                    textShadow: isHead
                      ? "0 0 8px rgba(0,255,0,0.9), 0 0 18px rgba(0,255,0,0.5)"
                      : "0 0 6px rgba(0,255,0,0.4)",
                    fontSize: `${col.size * 14}px`,
                    lineHeight: `${col.size * 14}px`,
                    opacity,
                    filter: isHead ? "saturate(1.1) brightness(1.05)" : "none",
                  }}
                >
                  {c}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
