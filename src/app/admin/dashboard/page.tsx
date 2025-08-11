"use client";

import { useState, useEffect } from "react";

import AdminHeader from "@/components/AdminHeader";
import Link from "next/link";

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [csrfToken, setCsrfToken] = useState<string>("");


  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchCSRFToken();
  }, []);

  const fetchCSRFToken = async () => {
    try {
      const response = await fetch('/api/csrf');
      if (response.ok) {
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      }
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/admin/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };



  const togglePublish = async (postId: number, published: boolean) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken
        },
        body: JSON.stringify({ published: !published }),
      });

      if (response.ok) {
        fetchPosts(); // Refresh the list
        fetchCSRFToken(); // Get new CSRF token
      }
    } catch (error) {
      console.error("Error toggling publish:", error);
    }
  };

  const deletePost = async (postId: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "x-csrf-token": csrfToken
        },
      });

      if (response.ok) {
        fetchPosts(); // Refresh the list
        fetchCSRFToken(); // Get new CSRF token
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <AdminHeader currentTime={currentTime} />

      <main className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold" data-text="ADMIN DASHBOARD">
              ADMIN DASHBOARD
            </h1>
            <div className="flex gap-4">
              <Link
                href="/admin/posts/new"
                className="px-6 py-3 bg-green-400 text-black font-bold rounded-lg hover:bg-green-300 transition-colors"
              >
                NEW POST
              </Link>

            </div>
          </div>

          <div className="border border-green-400/30 bg-black/50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Blog Posts</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4 animate-pulse">⏳</div>
                <p className="text-green-300">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-green-300 mb-4">No posts found</p>
                <Link
                  href="/admin/posts/new"
                  className="px-6 py-3 bg-green-400 text-black font-bold rounded-lg hover:bg-green-300 transition-colors"
                >
                  CREATE FIRST POST
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="border border-green-400/20 bg-black/30 p-4 rounded-lg flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-green-300 mb-1">
                        {post.title}
                      </h3>
                      <p className="text-green-500 text-sm">
                        Slug: {post.slug} • Created: {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 text-xs font-mono rounded ${
                          post.published
                            ? "bg-green-400 text-black"
                            : "bg-yellow-400 text-black"
                        }`}
                      >
                        {post.published ? "PUBLISHED" : "DRAFT"}
                      </span>
                      <button
                        onClick={() => togglePublish(post.id, post.published)}
                        className="px-3 py-1 border border-green-400 text-green-400 text-xs hover:bg-green-400 hover:text-black transition-colors rounded"
                      >
                        {post.published ? "UNPUBLISH" : "PUBLISH"}
                      </button>
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="px-3 py-1 border border-blue-400 text-blue-400 text-xs hover:bg-blue-400 hover:text-black transition-colors rounded"
                      >
                        EDIT
                      </Link>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="px-3 py-1 border border-red-400 text-red-400 text-xs hover:bg-red-400 hover:text-black transition-colors rounded"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
