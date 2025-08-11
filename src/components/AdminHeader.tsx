'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminHeader({ currentTime }: { currentTime: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
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
            <span className="text-sm text-green-500">ADMIN PANEL</span>
          </div>
          <div className="flex items-center space-x-8">
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-xl font-bold hover:text-green-300 transition-colors">
                VIEW SITE
              </Link>
              <Link href="/admin/dashboard" className="text-xl font-bold hover:text-green-300 transition-colors">
                DASHBOARD
              </Link>
              <Link href="/admin/posts/new" className="text-xl font-bold hover:text-green-300 transition-colors">
                NEW POST
              </Link>
              <button 
                onClick={handleLogout}
                className="text-xl font-bold hover:text-red-400 transition-colors"
              >
                LOGOUT
              </button>
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
