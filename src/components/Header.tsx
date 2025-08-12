'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type HeaderProps = {
  /** If provided, Home uses this instead of navigating */
  onHomeClick?: () => void;
};

const formatClock = (d: Date) =>
  d.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).replace(',', '');

export default function Header({ onHomeClick }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [clock, setClock] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setClock(formatClock(new Date()));
    const t = setInterval(() => setClock(formatClock(new Date())), 1000);
    return () => clearInterval(t);
  }, []);

  // Normalize path (strip trailing slash except root)
  const path = useMemo(() => {
    if (!pathname) return '/';
    return pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return path === '/';
    return path === href || path.startsWith(`${href}/`);
  };

  const linkClass = (href: string) =>
    [
      'text-lg md:text-xl font-bold transition-colors px-1 md:px-2 -mb-[1px]',
      isActive(href) ? 'text-green-200 border-b-2 border-green-400' : 'text-green-400 hover:text-green-300',
    ].join(' ');

  const handleHome = () => {
    if (onHomeClick) return onHomeClick();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-20 border-b border-green-400/30 bg-black/75 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Left: logo/name */}
          <div className="flex items-center gap-3">
            <Image src="/cds.png" alt="CyberDeath Logo" width={48} height={48} className="glitch" data-text="CDS" />
            <span className="hidden sm:block text-lg md:text-xl font-bold text-green-400 tracking-wide">
              CYBERDEATH SECURITY
            </span>
          </div>

          {/* Right: menu + clock */}
          <div className="ml-auto hidden md:flex items-center gap-4">
            <button onClick={handleHome} className={linkClass('/')}>HOME</button>
            <Link href="/projects" className={linkClass('/projects')}>PROJECTS</Link>
            <Link href="/blog" className={linkClass('/blog')}>BLOG</Link>

            <div className="pl-3 ml-2 border-l border-green-400/20 text-sm md:text-base text-green-200/90 select-none font-mono">
              {isClient ? clock : ''}
            </div>
          </div>

          {/* Mobile clock + hamburger */}
          <div className="md:hidden ml-auto flex items-center gap-3">
            <div className="text-xs text-green-200/90 select-none font-mono">{isClient ? clock : ''}</div>
            <button
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(v => !v)}
              className="inline-flex items-center justify-center rounded border border-green-400/30 text-green-300 hover:text-green-100 hover:border-green-300 px-3 py-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                {mobileOpen ? (
                  <path fillRule="evenodd" d="M6 18L18 6M6 6l12 12" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" clipRule="evenodd" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-green-400/20 bg-black/90">
          <div className="px-4 py-3 space-y-2">
            <button onClick={() => { handleHome(); setMobileOpen(false); }} className={linkClass('/') + ' block w-full text-left'}>
              HOME
            </button>
            <Link href="/projects" className={linkClass('/projects') + ' block w-full text-left'} onClick={() => setMobileOpen(false)}>
              PROJECTS
            </Link>
            <Link href="/blog" className={linkClass('/blog') + ' block w-full text-left'} onClick={() => setMobileOpen(false)}>
              BLOG
            </Link>
            <div className="pt-2 text-xs text-green-200/90 font-mono">{clock}</div>
          </div>
        </div>
      )}
    </nav>
  );
}
