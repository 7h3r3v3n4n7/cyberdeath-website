"use client";

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BlogNotFound() {
  return (
    <div className="min-h-screen bg-black text-green-400">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold mb-4 glitch" data-text="404">
              404
            </h1>
            <h2 className="text-3xl font-bold mb-4 text-green-300">
              POST NOT FOUND
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/blog"
              className="inline-block px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
            >
              BACK TO BLOG
            </Link>
            
            <div className="mt-8">
              <Link
                href="/"
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                ← Return to Home
              </Link>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gray-900 rounded-lg border border-green-400/30">
            <h3 className="text-lg font-bold mb-4 text-green-300">
              Looking for something specific?
            </h3>
            <p className="text-gray-400 mb-4">
              Check out our latest posts or use the search function to find what you&apos;re looking for.
            </p>
            <Link
              href="/blog"
              className="inline-block px-6 py-2 border border-green-400 text-green-400 rounded hover:bg-green-400 hover:text-black transition-colors"
            >
              BROWSE ALL POSTS
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
