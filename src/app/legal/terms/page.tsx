import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsOfService() {
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
            
            <h1 className="text-4xl font-bold mb-4 glitch" data-text="TERMS OF SERVICE">
              TERMS OF SERVICE
            </h1>
            <p className="text-gray-400 mb-8">Effective Date: August 11, 2025</p>
          </header>

          <div className="space-y-8">
            <section className="bg-gray-900 p-6 rounded-lg border border-green-400/30">
              <h2 className="text-2xl font-bold text-green-300 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">By accessing or using Cyberdeath Security&apos;s services, you agree to these Terms of Service and our <Link href="/legal/privacy" className="text-green-400 hover:text-green-300 underline">Privacy Policy</Link>.</p>
            </section>

            <section className="bg-gray-900 p-6 rounded-lg border border-green-400/30">
              <h2 className="text-2xl font-bold text-green-300 mb-4">2. Authorized Use</h2>
              <p className="text-gray-300 leading-relaxed">You agree to use our services only for lawful, authorized purposes. Any penetration testing, vulnerability scanning, or related activity must have explicit written authorization.</p>
            </section>

            <section className="bg-gray-900 p-6 rounded-lg border border-green-400/30">
              <h2 className="text-2xl font-bold text-green-300 mb-4">3. Service Scope</h2>
              <p className="text-gray-300 leading-relaxed">We define the scope of all engagements in writing before starting. Changes must be mutually agreed upon in writing.</p>
            </section>

            <section className="bg-gray-900 p-6 rounded-lg border border-green-400/30">
              <h2 className="text-2xl font-bold text-green-300 mb-4">4. Payment & Invoicing</h2>
              <p className="text-gray-300 leading-relaxed">Fees are outlined in the service agreement. Payment terms are net 15 days unless otherwise stated.</p>
            </section>

            <section className="bg-gray-900 p-6 rounded-lg border border-green-400/30">
              <h2 className="text-2xl font-bold text-green-300 mb-4">5. Intellectual Property</h2>
              <p className="text-gray-300 leading-relaxed">All methodologies, tools, and reports remain the property of Cyberdeath Security unless otherwise agreed in writing.</p>
            </section>

            <section className="bg-gray-900 p-6 rounded-lg border border-green-400/30">
              <h2 className="text-2xl font-bold text-green-300 mb-4">6. Confidentiality</h2>
              <p className="text-gray-300 leading-relaxed">We protect all client information and data with appropriate safeguards and will not disclose it without consent, except as required by law.</p>
            </section>

            <section className="bg-gray-900 p-6 rounded-lg border border-green-400/30">
              <h2 className="text-2xl font-bold text-green-300 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed">Cyberdeath Security is not liable for indirect or consequential damages. Our total liability will not exceed the total amount paid for the services provided.</p>
            </section>

            <section className="bg-gray-900 p-6 rounded-lg border border-green-400/30">
              <h2 className="text-2xl font-bold text-green-300 mb-4">8. Termination</h2>
              <p className="text-gray-300 leading-relaxed">Either party may terminate the agreement with written notice if the other party breaches these Terms.</p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}