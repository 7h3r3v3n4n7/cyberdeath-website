"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TypingText from "../components/TypingText";

export default function Home() {
  const router = useRouter();
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [menuState, setMenuState] = useState("terminal");
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [welcomeComplete, setWelcomeComplete] = useState(false);
  const [helpComplete, setHelpComplete] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        setGlitchIntensity(Math.random());
        setTimeout(() => setGlitchIntensity(0), 200);
      }
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Auto-scroll terminal to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const handleWelcomeComplete = useCallback(() => {
    setWelcomeComplete(true);
  }, []);

  const handleHelpComplete = useCallback(() => {
    setHelpComplete(true);
  }, []);

  const processCommand = (command: string) => {
    const cmd = command.toLowerCase().trim();
    let response = "";

    switch (cmd) {
      case "help":
        response = `<div class="space-y-2">
          <div class="text-green-400 font-semibold mb-3">Available commands:</div>
          <div class="text-left max-w-md mx-auto space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-green-300 font-bold">help</span>
              <span class="text-green-500">- Show this help</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-green-300 font-bold">projects</span>
              <span class="text-green-500">- Show projects</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-green-300 font-bold">blog</span>
              <span class="text-green-500">- Show blog</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-green-300 font-bold">clear</span>
              <span class="text-green-500">- Clear terminal</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-green-300 font-bold">glitch</span>
              <span class="text-green-500">- Trigger glitch effect</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-green-300 font-bold">about</span>
              <span class="text-green-500">- About CyberDeath</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-green-300 font-bold">exit</span>
              <span class="text-green-500">- Close terminal</span>
            </div>
          </div>
        </div>`;
        break;
      case "projects":
        setTerminalHistory(p => [...p, `> ${command}`, "Loading projects..."]);
        setTimeout(() => router.push("/projects"), 500);
        return;
      case "blog":
        setTerminalHistory(p => [...p, `> ${command}`, "Loading blog..."]);
        setTimeout(() => router.push("/blog"), 500);
        return;
      case "clear":
        setTerminalHistory([]);
        return;
      case "glitch":
        setGlitchIntensity(1);
        setTimeout(() => setGlitchIntensity(0), 500);
        response = "Glitch effect triggered!";
        break;
      case "about":
        response = `CyberDeath - Cybersecurity research, penetration testing, and LLM manipulation.
        Specializing in AI-powered security tools, phishing simulation, and operational security.
        GitHub: @7h3r3v3n4n7`;
        break;
      case "exit":
        setMenuState("terminal");
        return;
      default:
        response = `Command not found: ${cmd}. Type 'help' for available commands.`;
        return;
    }

    if (response) {
      setTerminalHistory(prev => [...prev, `> ${command}`, response]);
    }
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCommand.trim()) {
      processCommand(currentCommand);
      setCurrentCommand("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommandSubmit(e as React.FormEvent);
    }
  };


  const renderTerminal = () => (
    <div className="w-full max-w-4xl mx-auto bg-black/90 border border-green-400/50 rounded-lg p-6 font-mono shadow-lg shadow-green-400/20 relative z-20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>
      
      <div 
        ref={terminalRef} 
        className="h-96 overflow-y-auto mb-4 text-green-300 text-sm scrollbar-thin scrollbar-track-transparent scrollbar-thumb-green-400/30 hover:scrollbar-thumb-green-400/50 transition-all duration-300"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(74, 222, 128, 0.3) transparent'
        }}
      >
        <div className="mb-2 text-left">
          <div style={{ display: !welcomeComplete ? 'block' : 'none' }}>
            <TypingText
              key="welcome-line"
              text="Welcome to CyberDeath Terminal v2.0"
              speed={40}
              onComplete={handleWelcomeComplete}
            />
          </div>
          <div style={{ display: welcomeComplete && !helpComplete ? 'block' : 'none' }}>
            <TypingText
              key="help-line"
              text="Type &apos;help&apos; to see available commands"
              speed={40}
              onComplete={handleHelpComplete}
            />
          </div>
          {welcomeComplete && helpComplete && (
            <>
              <span className="text-green-400 font-mono">Welcome to CyberDeath Terminal v2.0</span>
              <div className="mt-2 text-green-400 font-mono">Type &apos;help&apos; to see available commands</div>
            </>
          )}
        </div>


        <div className="mb-2 text-left" />
        {terminalHistory.map((line, index) => (
          <div key={index} className="mb-1 text-left">
            {line.startsWith('<') ? (
              <div className="terminal-output" dangerouslySetInnerHTML={{ 
                __html: line.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                           .replace(/javascript:/gi, '')
                           .replace(/on\w+\s*=/gi, '')
              }} />
            ) : (
              <span>{line}</span>
            )}
          </div>
        ))}
        <div className="flex items-center bg-black/50 border border-green-400/20 rounded px-3 py-2 mt-4 text-left">
          <span className="text-green-400 mr-2 font-bold">~$</span>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full bg-transparent text-green-300 outline-none border-none placeholder-green-500/50 caret-transparent"
              placeholder="Enter command..."
              autoFocus
              disabled={!helpComplete}
            />
            <span 
              className="terminal-cursor text-green-400 absolute top-0 font-mono"
              style={{ 
                left: `${currentCommand.length * 0.6}em`,
                animation: 'blink 1s infinite'
              }}
            >
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      {glitchIntensity > 0 && (
        <div 
          className="fixed inset-0 pointer-events-none z-50"
          style={{ opacity: glitchIntensity }}
        >
          <div className="absolute inset-0 bg-red-500/20 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-blue-500/20 mix-blend-multiply"></div>
        </div>
      )}
      
      <Header onHomeClick={() => setMenuState('terminal')} />

      <main className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        {menuState === "terminal" && (
          <div className="text-center space-y-8">
            
            {renderTerminal()}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
