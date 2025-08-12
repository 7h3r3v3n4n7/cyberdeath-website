import type { Metadata } from "next";
import "./globals.css";
import Background from "@/components/Background";

export const metadata: Metadata = {
  title: "CyberDeathSec",
  description: "A showcase of cybersecurity projects, hacking tools, and technical insights",
  keywords: ["cybersecurity", "hacking", "projects", "blog"],
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased bg-black text-green-400`}
      >
        <Background />
        {children}
      </body>
    </html>
  );
}
