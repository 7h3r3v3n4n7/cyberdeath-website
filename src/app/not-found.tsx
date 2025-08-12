import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
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
              PAGE NOT FOUND
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
            >
              RETURN HOME
            </Link>
            
            <div className="mt-8">
              <Link
                href="/blog"
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                ← Go to Blog
              </Link>
            </div>
          </div>

          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
