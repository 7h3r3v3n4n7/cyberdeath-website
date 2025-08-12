import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-green-400">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <nav className="mb-4">
              <Link href="/" className="text-green-400 hover:text-green-300">
                ← Back to Home
              </Link>
            </nav>
            
            <h1 className="text-4xl font-bold mb-4 glitch" data-text="PRIVACY POLICY">
              PRIVACY POLICY
            </h1>
            <p className="text-gray-400 mb-8">Effective Date: August 11, 2025</p>
          </header>

          <div className="space-y-8">
            <section className="bg-gray-900 p-6 rounded-lg border border-green-400/30">
              <h2 className="text-2xl font-bold text-green-300 mb-4">1. Information We Collect</h2>
              <p className="text-gray-300 leading-relaxed">We collect information you provide directly to us, including contact details, engagement scope, and any data needed to perform our services.</p>
            </section>

            <section className="bg-gray-900 p-6 rounded-lg border border-green-400/30">
              <h2 className="text-2xl font-bold text-green-300 mb-4">2. How We Use Information</h2>
              <p className="text-gray-300 leading-relaxed">We use collected information to deliver services, improve our offerings, and comply with legal obligations.</p>
            </section>

            <section className="bg-gray-900 p-6 rounded-lg border border-green-400/30">
              <h2 className="text-2xl font-bold text-green-300 mb-4">3. Data Retention</h2>
              <p className="text-gray-300 leading-relaxed">We retain client data only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.</p>
            </section>

            <section className="bg-gray-900 p-6 rounded-lg border border-green-400/30">
              <h2 className="text-2xl font-bold text-green-300 mb-4">4. Data Sharing</h2>
              <p className="text-gray-300 leading-relaxed">We do not sell or rent personal data. We may share information with trusted partners only to the extent necessary to provide services.</p>
            </section>

            <section className="bg-gray-900 p-6 rounded-lg border border-green-400/30">
              <h2 className="text-2xl font-bold text-green-300 mb-4">5. Security Measures</h2>
              <p className="text-gray-300 leading-relaxed">We employ industry-standard security measures to protect data from unauthorized access, alteration, or disclosure.</p>
            </section>

            <section className="bg-gray-900 p-6 rounded-lg border border-green-400/30">
              <h2 className="text-2xl font-bold text-green-300 mb-4">6. Your Rights</h2>
              <p className="text-gray-300 leading-relaxed">You may request access, correction, or deletion of your data by contacting us directly.</p>
            </section>

            <section className="bg-gray-900 p-6 rounded-lg border border-green-400/30">
              <h2 className="text-2xl font-bold text-green-300 mb-4">7. Policy Changes</h2>
              <p className="text-gray-300 leading-relaxed">We may update this Privacy Policy from time to time. The updated policy will be posted on our website with the new effective date.</p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}