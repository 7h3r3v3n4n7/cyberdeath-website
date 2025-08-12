// /components/ProjectsGrid.tsx
export const revalidate = 300; // revalidate every 5 minutes

type GitHubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  archived: boolean;
  fork: boolean;
  updated_at: string;
};

export default async function ProjectsGrid() {
  let repos: GitHubRepo[] = [];
  try {
    const res = await fetch(
      "https://api.github.com/users/7h3r3v3n4n7/repos?sort=updated&per_page=10",
      {
        // Server fetch with caching
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate },
      }
    );

    if (!res.ok) {
      throw new Error(`GitHub API returned ${res.status}`);
    }

    const data: GitHubRepo[] = await res.json();
    repos = data.filter(r => !r.fork && !r.archived).slice(0, 6);
  } catch {
    // render a friendly empty state
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-2xl font-bold text-green-300 mb-2">No Projects Found</h3>
        <p className="text-green-500">Unable to load projects from GitHub right now.</p>
      </div>
    );
  }

  if (!repos.length) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-2xl font-bold text-green-300 mb-2">No Projects Found</h3>
        <p className="text-green-500">Try again later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {repos.map(repo => (
        <div key={repo.id} className="border border-green-400/30 bg-black/50 p-6 hover:border-green-400 transition-colors group transform hover:scale-105">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-green-400 group-hover:text-green-300 transition-colors">
              {repo.name}
            </h3>
            <span className={`px-2 py-1 text-xs font-mono ${
              repo.language === 'Python' ? 'bg-blue-400 text-black' :
              repo.language === 'HTML' ? 'bg-purple-400 text-black' :
              repo.language === 'PowerShell' ? 'bg-cyan-400 text-black' :
              'bg-gray-400 text-black'
            }`}>
              {repo.language || 'Unknown'}
            </span>
          </div>
          <p className="text-green-200 mb-4 text-sm leading-relaxed">
            {repo.description || 'No description available.'}
          </p>
          <div className="flex items-center text-green-300 text-xs mb-2">⭐ {repo.stargazers_count}</div>
          <div className="flex items-center text-green-300 text-xs">🍴 {repo.forks_count}</div>
          <div className="flex gap-2 mt-4">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-colors font-mono text-center"
            >
              VIEW ON GITHUB
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
