'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Header({ setMenuState, currentTime }: HeaderProps) {
  const router = useRouter();

  const handleBlogClick = () => {
    router.push('/blog');
  };

  return (
    <nav className="relative z-10 border-b border-green-400/30 bg-black/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Image
              src="/cds.png"
              alt="CyberDeath Logo"
              width={60}
              height={60}
              className="glitch"
              data-text="CDS"
            />
            <span className="text-xl font-bold text-green-400">CYBERDEATH SECURITY</span>
          </div>
          <div className="flex items-center space-x-8">
            <div className="hidden md:flex space-x-8">
              <button onClick={() => setMenuState?.("terminal")} className="text-xl font-bold hover:text-green-300 transition-colors">HOME</button>
              <button onClick={() => setMenuState?.("projects")} className="text-xl font-bold hover:text-green-300 transition-colors">PROJECTS</button>
              <button onClick={handleBlogClick} className="text-xl font-bold hover:text-green-300 transition-colors">BLOG</button>
            </div>
            <div className="text-sm text-green-500">
              {currentTime}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
