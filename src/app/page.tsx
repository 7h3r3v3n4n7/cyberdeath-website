"use client";

import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Typing animation component
function TypingText({ text, speed = 50, onComplete }: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

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

  // Blinking cursor effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <div className="flex items-center typing-text text-left">
      <span className="text-green-400 font-mono select-none">{displayedText}</span>
      {showCursor && <span className="text-green-400 ml-1 font-mono select-none">|</span>}
    </div>
  );
}

export default function Home() {
  const [currentTime, setCurrentTime] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [menuState, setMenuState] = useState("terminal");
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [matrixMode, setMatrixMode] = useState(false);
  const [matrixParticles, setMatrixParticles] = useState<Array<MatrixParticle>>([]);
  const [welcomeComplete, setWelcomeComplete] = useState(false);
  const [helpComplete, setHelpComplete] = useState(false);
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch GitHub repositories
  useEffect(() => {
    const fetchGitHubRepos = async () => {
      setLoadingRepos(true);
      try {
        const response = await fetch('https://api.github.com/users/7h3r3v3n4n7/repos?sort=updated&per_page=10');
        if (response.ok) {
          const repos: GitHubRepo[] = await response.json();
          // Filter out forks and archived repos, keep only main projects
          const filteredRepos = repos
            .filter(repo => !repo.fork && !repo.archived)
            .slice(0, 6); // Limit to 6 repos
          setGithubRepos(filteredRepos);
        }
      } catch (error) {
        console.error('Error fetching GitHub repos:', error);
      } finally {
        setLoadingRepos(false);
      }
    };

    fetchGitHubRepos();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      speed: Math.random() * 2 + 0.5
    }));
    setMatrixParticles(particles);

    const interval = setInterval(() => {
      setMatrixParticles(prev => prev.map(p => ({
        ...p,
        y: (p.y + p.speed) % 100
      })));
    }, 100);

    return () => clearInterval(interval);
  }, []);

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
              <span class="text-green-500">- List projects</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-green-300 font-bold">blog</span>
              <span class="text-green-500">- Show blog posts</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-green-300 font-bold">clear</span>
              <span class="text-green-500">- Clear terminal</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-green-300 font-bold">matrix</span>
              <span class="text-green-500">- Toggle matrix mode ${matrixMode ? '(ENABLED)' : '(DISABLED)'}</span>
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
        if (loadingRepos) {
          response = "Loading projects from GitHub...";
        } else if (githubRepos.length > 0) {
          const projectsList = githubRepos.map((repo, index) => 
            `<div class="flex items-center mb-2">
              <span class="text-green-300 mr-3">[${index + 1}]</span>
              <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="terminal-link font-bold">${repo.name}</a>
              <span class="text-green-500 ml-2">- ${repo.language || 'Unknown'} • ⭐ ${repo.stargazers_count} • 🍴 ${repo.forks_count}</span>
            </div>`
          ).join('');
          
          response = `<div class="space-y-2">
            <div class="text-green-400 font-semibold mb-3">Projects from GitHub:</div>
            <div class="text-left max-w-md mx-auto">
              ${projectsList}
            </div>
            <div class="text-green-500 text-sm mt-3">Type 'project &lt;number&gt;' for details</div>
          </div>`;
        } else {
          response = "Unable to load projects from GitHub. Check your connection.";
        }
        break;
      case "blog":
        response = "Redirecting to blog page...";
        setTimeout(() => {
          window.location.href = '/blog';
        }, 1000);
        break;
      case "clear":
        setTerminalHistory([]);
        return;
      case "matrix":
        setMatrixMode(prev => !prev);
        response = matrixMode ? "Matrix mode disabled. Welcome back to reality." : "Matrix mode enabled. Reality is bending...";
        break;
      case "glitch":
        setGlitchIntensity(1);
        setTimeout(() => setGlitchIntensity(0), 500);
        response = "Glitch effect triggered!";
        break;
      case "about":
        response = `CyberDeath - Cybersecurity researcher, penetration tester, and ethical hacker.
        Specializing in AI-powered security tools, phishing simulation, and operational security.
        GitHub: @7h3r3v3n4n7`;
        break;
      case "exit":
        setMenuState("terminal");
        return;
      default:
        if (cmd.startsWith("project ")) {
          const num = parseInt(cmd.split(" ")[1]);
          if (num >= 1 && num <= githubRepos.length) {
            const repo = githubRepos[num - 1];
            const lastUpdated = new Date(repo.updated_at).toLocaleDateString();
            response = `<div class="space-y-2">
              <div class="text-green-400 font-semibold mb-3">Project ${num}: ${repo.name}</div>
              <div class="text-left max-w-md mx-auto space-y-2">
                <div class="flex items-center">
                  <span class="text-green-300 font-bold mr-2">Description:</span>
                  <span class="text-green-200">${repo.description || 'No description available'}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-green-300 font-bold mr-2">Language:</span>
                  <span class="text-green-200">${repo.language || 'Unknown'}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-green-300 font-bold mr-2">Stats:</span>
                  <span class="text-green-200">⭐ ${repo.stargazers_count} stars • 🍴 ${repo.forks_count} forks</span>
                </div>
                <div class="flex items-center">
                  <span class="text-green-300 font-bold mr-2">Updated:</span>
                  <span class="text-green-200">${lastUpdated}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-green-300 font-bold mr-2">GitHub:</span>
                  <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="terminal-link">${repo.html_url}</a>
                </div>
              </div>
            </div>`;
          } else {
            response = `Invalid project number. Use 'projects' to list available projects (1-${githubRepos.length}).`;
          }
        } else if (cmd.startsWith("post ")) {
          const num = parseInt(cmd.split(" ")[1]);
          if (num >= 1 && num <= 3) {
            const posts = ["Breaking Down Modern Encryption", "Social Engineering Techniques", "Zero-Day Exploits"];
            response = `Post ${num}: ${posts[num-1]}
            This is a sample blog post about cybersecurity topics.`;
          } else {
            response = "Invalid post number. Use 'blog' to list available posts.";
          }
        } else if (cmd) {
          response = `Command not found: ${cmd}. Type 'help' for available commands.`;
        }
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

  const renderMatrixBackground = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {matrixParticles.map(particle => (
        <div
          key={particle.id}
          className={`absolute text-xs font-mono transition-all duration-500 ${
            matrixMode 
              ? 'text-green-400/60 text-lg animate-pulse' 
              : 'text-green-400/20 text-xs'
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.id * 0.1}s`,
            transform: matrixMode ? `scale(${1 + Math.random() * 0.5})` : 'scale(1)'
          }}
        >
          {String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))}
        </div>
      ))}
      
      {/* Enhanced matrix effect when enabled */}
      {matrixMode && (
        <>
          {/* Additional falling characters */}
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={`falling-${i}`}
              className="absolute text-green-400/40 text-sm font-mono animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            >
              {String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))}
            </div>
          ))}
          
          {/* Matrix rain effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/5 to-transparent animate-pulse"></div>
        </>
      )}
    </div>
  );

  const renderTerminal = () => (
    <div className="w-full max-w-4xl mx-auto bg-black/90 border border-green-400/50 rounded-lg p-6 font-mono shadow-lg shadow-green-400/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="flex items-center space-x-2">
          {matrixMode && (
            <span className="text-green-500 text-xs animate-pulse">[MATRIX MODE]</span>
          )}
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
          {!welcomeComplete ? (
            <TypingText 
              text="Welcome to CyberDeath Terminal v2.0" 
              speed={40}
              onComplete={() => {
                setWelcomeComplete(true);
                setTimeout(() => setHelpComplete(true), 500);
              }}
            />
          ) : (
            <span className="text-green-400 font-mono typing-text">Welcome to CyberDeath Terminal v2.0</span>
          )}
        </div>
        <div className="mb-2 text-left">
          {welcomeComplete && !helpComplete ? (
            <TypingText 
              text="Type &apos;help&apos; to see available commands" 
              speed={40}
              onComplete={() => {
                setHelpComplete(true);
              }}
            />
          ) : helpComplete ? (
            <span className="text-green-400 font-mono typing-text">Type &apos;help&apos; to see available commands</span>
          ) : null}
        </div>
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

  const renderProjects = () => (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-16" data-text="PROJECTS">
        PROJECTS
      </h2>
      {loadingRepos ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4 animate-pulse">⏳</div>
          <h3 className="text-2xl font-bold text-green-300 mb-2">Loading Projects</h3>
          <p className="text-green-500">Fetching repositories from GitHub...</p>
        </div>
      ) : githubRepos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {githubRepos.map((repo) => (
            <div key={repo.id} className="border border-green-400/30 bg-black/50 p-6 hover:border-green-400 transition-colors group transform hover:scale-105">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-green-400 group-hover:text-green-300 transition-colors">
                  {repo.name}
                </h3>
                <span className={`px-2 py-1 text-xs font-mono ${
                  repo.language === 'Python' ? 'bg-blue-400 text-black' :
                  repo.language === 'HTML' ? 'bg-purple-400 text-black' :
                  repo.language === 'PowerShell' ? 'bg-cyan-400 text-black' :
                  'bg-gray-400 text-black'
                }`}>
                  {repo.language || 'Unknown'}
                </span>
              </div>
              <p className="text-green-200 mb-4 text-sm leading-relaxed">
                {repo.description || 'No description available.'}
              </p>
              <div className="flex items-center text-green-300 text-xs mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/></svg>
                {repo.stargazers_count}
              </div>
              <div className="flex items-center text-green-300 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M22 11v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8"/><path d="M6 13h12a3 3 0 0 0 0-6H6a3 3 0 0 0 0 6"/></svg>
                {repo.forks_count}
              </div>
              <div className="flex gap-2 mt-4">
                <a 
                  href={repo.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-2 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-colors font-mono text-center"
                >
                  VIEW ON GITHUB
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-green-300 mb-2">No Projects Found</h3>
          <p className="text-green-500">Unable to load projects from GitHub. Please check your connection.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      {renderMatrixBackground()}
      
      {glitchIntensity > 0 && (
        <div 
          className="fixed inset-0 pointer-events-none z-50"
          style={{ opacity: glitchIntensity }}
        >
          <div className="absolute inset-0 bg-red-500/20 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-blue-500/20 mix-blend-multiply"></div>
        </div>
      )}
      
      <Header menuState={menuState} setMenuState={setMenuState} currentTime={currentTime} />

      <main className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        {menuState === "terminal" && (
          <div className="text-center space-y-8">
            
            {renderTerminal()}
          </div>
        )}

        {menuState === "projects" && (
          <div className="space-y-8">
            {renderProjects()}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
