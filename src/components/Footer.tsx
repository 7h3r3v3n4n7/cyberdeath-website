'use client';

import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-green-400/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Image
            src="/cds.png"
            alt="CyberDeath Logo"
            width={32}
            height={32}
            className="glitch"
            data-text="CDS"
          />
          <span className="text-lg font-bold">CYBERDEATH SECURITY</span>
        </div>
        <p className="text-green-500 text-sm">
          © {new Date().getFullYear()} CyberDeath Security. All rights reserved. Stay secure, stay frosty.
        </p>
        <div className="mt-4 text-green-400/60 text-xs">
          <span className="terminal-cursor">SYSTEM_STATUS: ONLINE</span>
        </div>
      </div>
    </footer>
  );
}
