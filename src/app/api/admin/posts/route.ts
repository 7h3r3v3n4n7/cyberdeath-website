import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { adminRateLimit } from '@/lib/rateLimit';
import { csrfProtection } from '@/lib/csrf';

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = adminRateLimit(request);
  if (rateLimitResult instanceof NextResponse) {
    return rateLimitResult;
  }

  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            username: true,
            email: true
          }
        },
        tags: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = adminRateLimit(request);
  if (rateLimitResult instanceof NextResponse) {
    return rateLimitResult;
  }

  // Apply CSRF protection
  const csrfResult = csrfProtection(request);
  if (csrfResult) {
    return csrfResult;
  }

  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title, slug, excerpt, content, tags, published = false } = await request.json();

    // Input validation
    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (title.length > 200) {
      return NextResponse.json(
        { error: 'Title too long (max 200 characters)' },
        { status: 400 }
      );
    }

    if (slug.length > 100) {
      return NextResponse.json(
        { error: 'Slug too long (max 100 characters)' },
        { status: 400 }
      );
    }

    if (excerpt.length > 500) {
      return NextResponse.json(
        { error: 'Excerpt too long (max 500 characters)' },
        { status: 400 }
      );
    }

    if (content.length > 50000) {
      return NextResponse.json(
        { error: 'Content too long (max 50,000 characters)' },
        { status: 400 }
      );
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: 'Slug must contain only lowercase letters, numbers, and hyphens' },
        { status: 400 }
      );
    }

    // Validate tags
    if (tags && (!Array.isArray(tags) || tags.length > 10)) {
      return NextResponse.json(
        { error: 'Tags must be an array with maximum 10 items' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug }
    });

    if (existingPost) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        published,
        authorId: payload.userId,
        tags: {
          connectOrCreate: tags?.map((tagName: string) => ({
            where: { name: tagName },
            create: { name: tagName }
          })) || []
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
      }
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
