"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatDateShort } from "@/lib/utils";

export default function BlogPage() {
  const [allBlogPosts, setAllBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setAllBlogPosts(data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const allTags = ["all", ...Array.from(new Set(allBlogPosts.flatMap((post: BlogPost) => post.tags)))];

  const filteredPosts = allBlogPosts.filter((post: BlogPost) => {
    const matchesSearch = searchQuery === "" || 
                         post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTag = selectedTag === "all" || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-gray-400 mb-6">
            Cybersecurity insights, technical deep-dives, and security analysis
          </p>
          
          {/* Search and Filter */}
          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-green-400 placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
            
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2 py-0.5 rounded text-xs transition-colors ${
                    selectedTag === tag
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 text-green-400 hover:bg-gray-600"
                  }`}
                >
                  {tag.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-gray-400">
            Showing {filteredPosts.length} of {allBlogPosts.length} posts
          </div>
        </header>

        {/* Posts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {currentPosts.map((post) => (
            <article key={post.id} className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                <span>{formatDateShort(post.date)}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              
              <h2 className="text-xl font-semibold mb-3">
                <Link href={`/blog/${post.slug}`} className="hover:text-green-300">
                  {post.title}
                </Link>
              </h2>
              
              <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-1.5 py-0.5 bg-green-900 text-green-300 rounded text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="text-sm text-gray-500">
                By {post.author}
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 text-green-400 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              Previous
            </button>
            
            <span className="px-4 py-2 text-green-400">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-700 text-green-400 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
