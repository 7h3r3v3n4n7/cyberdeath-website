import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectsGrid from "@/components/ProjectsGrid";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <Header />
      <main className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold text-center mb-4" data-text="PROJECTS">
            PROJECTS
          </h2>
          <ProjectsGrid />
        </div>
      </main>
      <Footer />
    </div>
  );
}
