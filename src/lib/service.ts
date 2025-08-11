import { prisma } from './prisma';

export async function getAllBlogPosts() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: {
          username: true,
          email: true
        }
      },
      tags: true
    },
    orderBy: { publishedAt: 'desc' }
  });

  return posts.map((post: any) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    date: post.publishedAt || post.createdAt,
    readTime: post.readTime,
    tags: post.tags.map((tag: any) => tag.name),
    author: post.author.username,
    slug: post.slug
  }));
}

export async function getBlogPostBySlug(slug: string) {
  const post = await prisma.post.findFirst({
    where: { 
      slug,
      published: true 
    },
    include: {
      author: {
        select: {
          username: true,
          email: true
        }
      },
      tags: true
    }
  });

  if (!post) return null;

  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    date: post.publishedAt || post.createdAt,
    readTime: post.readTime,
    tags: post.tags.map((tag: any) => tag.name),
    author: post.author.username,
    slug: post.slug
  };
}

export async function getBlogPostsByTag(tagName: string) {
  const posts = await prisma.post.findMany({
    where: { 
      published: true,
      tags: {
        some: {
          name: tagName
        }
      }
    },
    include: {
      author: {
        select: {
          username: true,
          email: true
        }
      },
      tags: true
    },
    orderBy: { publishedAt: 'desc' }
  });

  return posts.map((post: any) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    date: post.publishedAt || post.createdAt,
    readTime: post.readTime,
    tags: post.tags.map((tag: any) => tag.name),
    author: post.author.username,
    slug: post.slug
  }));
}

export async function searchBlogPosts(query: string) {
  const posts = await prisma.post.findMany({
    where: { 
      published: true,
      OR: [
        { title: { contains: query } },
        { excerpt: { contains: query } },
        { content: { contains: query } }
      ]
    },
    include: {
      author: {
        select: {
          username: true,
          email: true
        }
      },
      tags: true
    },
    orderBy: { publishedAt: 'desc' }
  });

  return posts.map((post: any) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    date: post.publishedAt || post.createdAt,
    readTime: post.readTime,
    tags: post.tags.map((tag: any) => tag.name),
    author: post.author.username,
    slug: post.slug
  }));
}
