"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [slug, setSlug] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/posts/${slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setPost(data.post);

        // Fetch all posts for related posts
        const allPostsResponse = await fetch('/api/blog/posts');
        if (allPostsResponse.ok) {
          const allPostsData = await allPostsResponse.json();
          const related = allPostsData.posts
            .filter((p: BlogPost) => p.id !== data.post.id)
            .filter((p: BlogPost) => p.tags.some((tag: string) => data.post.tags.includes(tag)))
            .slice(0, 3);
          setRelatedPosts(related);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading || !post) {
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
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <nav className="mb-4">
              <Link href="/blog" className="text-green-400 hover:text-green-300">
                ← Back to Blog
              </Link>
            </nav>
            
            <h1 className="text-4xl font-bold mb-4 glitch" data-text={post.title}>
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span>By {post.author}</span>
              <span>•</span>
              <span>{formatDate(post.date)}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
            
            <div className="flex flex-wrap gap-1.5 mt-4">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  className="px-2 py-0.5 bg-green-900 text-green-300 rounded text-xs hover:bg-green-800 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-green max-w-none mb-8">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({children}) => <h1 className="text-3xl font-bold mb-4 text-green-400">{children}</h1>,
                h2: ({children}) => <h2 className="text-2xl font-bold mb-3 text-green-400">{children}</h2>,
                h3: ({children}) => <h3 className="text-xl font-bold mb-2 text-green-400">{children}</h3>,
                p: ({children}) => <p className="mb-4 text-gray-300 leading-relaxed">{children}</p>,
                ul: ({children}) => <ul className="list-disc list-inside mb-4 text-gray-300 space-y-1">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-inside mb-4 text-gray-300 space-y-1">{children}</ol>,
                li: ({children}) => <li className="text-gray-300">{children}</li>,
                strong: ({children}) => <strong className="font-bold text-green-300">{children}</strong>,
                em: ({children}) => <em className="italic text-gray-200">{children}</em>,
                code: ({children, className}) => {
                  const isInline = !className;
                  if (isInline) {
                    return <code className="bg-gray-800 text-green-300 px-1 py-0.5 rounded text-sm">{children}</code>;
                  }
                  return (
                    <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4">
                      <code className="text-green-300 text-sm">{children}</code>
                    </pre>
                  );
                },
                blockquote: ({children}) => (
                  <blockquote className="border-l-4 border-green-500 pl-4 italic text-gray-300 mb-4">
                    {children}
                  </blockquote>
                ),
                a: ({children, href}) => (
                  <a href={href} className="text-green-400 hover:text-green-300 underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                hr: () => <hr className="border-gray-700 my-6" />
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={async () => {
                if (navigator.share) {
                  await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.href,
                  });
                } else {
                  await navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Share
            </button>
            
            <button
              onClick={() => {
                try {
                  const bookmarks: Bookmark[] = JSON.parse(localStorage.getItem('cyberdeath-bookmarks') || '[]');
                  const isBookmarked = bookmarks.some((b: Bookmark) => b.slug === post.slug);
                  
                  if (isBookmarked) {
                    const newBookmarks = bookmarks.filter((b: Bookmark) => b.slug !== post.slug);
                    localStorage.setItem('cyberdeath-bookmarks', JSON.stringify(newBookmarks));
                  } else {
                    const newBookmark: Bookmark = {
                      slug: post.slug,
                      title: post.title,
                      date: post.date
                    };
                    localStorage.setItem('cyberdeath-bookmarks', JSON.stringify([...bookmarks, newBookmark]));
                  }
                  
                  // Force re-render
                  window.dispatchEvent(new Event('storage'));
                } catch (error) {
                  console.error('Error managing bookmarks:', error);
                }
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Bookmark
            </button>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="border-t border-gray-800 pt-8">
              <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <article key={relatedPost.id} className="bg-gray-900 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">
                      <Link href={`/blog/${relatedPost.slug}`} className="hover:text-green-300">
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-gray-400 mb-4">{relatedPost.excerpt}</p>
                    <div className="flex flex-wrap gap-1">
                      {relatedPost.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 bg-green-900 text-green-300 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
