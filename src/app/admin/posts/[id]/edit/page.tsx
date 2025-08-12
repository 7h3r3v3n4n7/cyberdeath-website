"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import Link from "next/link";

type TagFromApi = { name?: string } | string;

type PostFromApi = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  readTime: string;
  tags: TagFromApi[];
  published: boolean;
  featured: boolean;
};

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    readTime: "",
    tags: "",
    published: false,
    featured: false,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [csrfToken, setCsrfToken] = useState<string>("");

  // Live clock + CSRF on mount
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleString()), 1000);

    (async () => {
      try {
        const res = await fetch("/api/csrf");
        if (res.ok) {
          const data = await res.json();
          setCsrfToken(data.csrfToken ?? "");
        }
      } catch (err) {
        console.error("Error fetching CSRF token:", err);
      }
    })();

    return () => clearInterval(timer);
  }, []);

  const postId = params?.id; // typed as string via generic above

  const fetchPost = useCallback(async () => {
    if (!postId) return;
    setFetching(true);
    try {
      const response = await fetch(`/api/admin/posts/${encodeURIComponent(postId)}`);
      if (!response.ok) {
        alert("Post not found");
        router.push("/admin/dashboard");
        return;
      }
      const data = (await response.json()) as { post: PostFromApi };
      const post = data.post;

      const tagsString = Array.isArray(post.tags)
        ? post.tags
            .map((t) => (typeof t === "string" ? t : t?.name ?? ""))
            .filter(Boolean)
            .join(", ")
        : "";

      setFormData({
        title: post.title ?? "",
        slug: post.slug ?? "",
        excerpt: post.excerpt ?? "",
        content: post.content ?? "",
        readTime: post.readTime ?? "",
        tags: tagsString,
        published: Boolean(post.published),
        featured: Boolean(post.featured),
      });
    } catch (error) {
      console.error("Error fetching post:", error);
      alert("Error fetching post");
      router.push("/admin/dashboard");
    } finally {
      setFetching(false);
    }
  }, [postId, router]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId) return;
    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const response = await fetch(`/api/admin/posts/${encodeURIComponent(postId)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
      body: JSON.stringify({ ...formData, tags: tagsArray }),
      });

      if (response.ok) {
        router.push("/admin/dashboard");
      } else {
        const error = await response.json().catch(() => ({}));
        alert(`Error: ${error?.error ?? "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Error updating post");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const next = type === "checkbox" ? target.checked : value;

    setFormData((prev) => ({ ...prev, [name]: next }));
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono">
        <AdminHeader currentTime={currentTime} />
        <main className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-4xl mb-4 animate-pulse">⏳</div>
            <p className="text-green-300">Loading post...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <AdminHeader currentTime={currentTime} />

      <main className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold" data-text="EDIT POST">
              EDIT POST
            </h1>
            <Link
              href="/admin/dashboard"
              className="px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-500 transition-colors"
            >
              BACK TO DASHBOARD
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-green-400 placeholder-gray-500 focus:outline-none focus:border-green-500"
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-green-400 placeholder-gray-500 focus:outline-none focus:border-green-500"
                    placeholder="post-slug"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Excerpt</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-green-400 placeholder-gray-500 focus:outline-none focus:border-green-500"
                placeholder="Brief description of the post"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content (Markdown)</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={20}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-green-400 placeholder-gray-500 focus:outline-none focus:border-green-500 font-mono text-sm"
                placeholder={`# Your markdown content here...

## Headers
Use # for h1, ## for h2, etc.

## Lists
- Bullet points
- More items

## Code
\`\`\`bash
nmap -sV 192.168.1.1
\`\`\`

## Links
[Link text](https://example.com)

## Bold and Italic
**Bold text** and *italic text*`}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Read Time</label>
                <input
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-green-400 placeholder-gray-500 focus:outline-none focus:border-green-500"
                  placeholder="5 min read"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-green-400 placeholder-gray-500 focus:outline-none focus:border-green-500"
                  placeholder="cybersecurity, penetration-testing, nmap"
                  required
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm">Published</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm">Featured</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-green-400 text-black font-bold rounded-lg hover:bg-green-300 transition-colors disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Post"}
              </button>
              <Link
                href="/admin/dashboard"
                className="px-8 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}