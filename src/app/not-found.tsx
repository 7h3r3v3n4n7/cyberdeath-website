import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-green-400">
      <Header menuState="terminal" currentTime="" />
      
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

          <div className="mt-12 p-6 bg-gray-900 rounded-lg border border-green-400/30">
            <h3 className="text-lg font-bold mb-4 text-green-300">
              Navigation Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/"
                className="p-4 border border-green-400/30 rounded hover:bg-green-400/10 transition-colors"
              >
                <div className="text-2xl mb-2">🏠</div>
                <div className="font-bold text-green-300">Home</div>
                <div className="text-sm text-gray-400">Main terminal</div>
              </Link>
              
              <Link
                href="/blog"
                className="p-4 border border-green-400/30 rounded hover:bg-green-400/10 transition-colors"
              >
                <div className="text-2xl mb-2">📚</div>
                <div className="font-bold text-green-300">Blog</div>
                <div className="text-sm text-gray-400">Security articles</div>
              </Link>
              
              <Link
                href="/projects"
                className="p-4 border border-green-400/30 rounded hover:bg-green-400/10 transition-colors"
              >
                <div className="text-2xl mb-2">💻</div>
                <div className="font-bold text-green-300">Projects</div>
                <div className="text-sm text-gray-400">My work</div>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
