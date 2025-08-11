import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { adminRateLimit } from '@/lib/rateLimit';
import { csrfProtection } from '@/lib/csrf';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const resolvedParams = await params;
    const postId = parseInt(resolvedParams.id);

    const post = await prisma.post.findUnique({
      where: { id: postId },
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

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const resolvedParams = await params;
    const postId = parseInt(resolvedParams.id);
    
    if (isNaN(postId) || postId <= 0) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }
    
    const { title, slug, excerpt, content, tags, published, featured } = await request.json();

    // Input validation
    if (title !== undefined && (typeof title !== 'string' || title.length > 200)) {
      return NextResponse.json(
        { error: 'Title must be a string with maximum 200 characters' },
        { status: 400 }
      );
    }

    if (slug !== undefined) {
      if (typeof slug !== 'string' || slug.length > 100) {
        return NextResponse.json(
          { error: 'Slug must be a string with maximum 100 characters' },
          { status: 400 }
        );
      }
      if (!/^[a-z0-9-]+$/.test(slug)) {
        return NextResponse.json(
          { error: 'Slug must contain only lowercase letters, numbers, and hyphens' },
          { status: 400 }
        );
      }
    }

    if (excerpt !== undefined && (typeof excerpt !== 'string' || excerpt.length > 500)) {
      return NextResponse.json(
        { error: 'Excerpt must be a string with maximum 500 characters' },
        { status: 400 }
      );
    }

    if (content !== undefined && (typeof content !== 'string' || content.length > 50000)) {
      return NextResponse.json(
        { error: 'Content must be a string with maximum 50,000 characters' },
        { status: 400 }
      );
    }

    if (tags !== undefined && (!Array.isArray(tags) || tags.length > 10)) {
      return NextResponse.json(
        { error: 'Tags must be an array with maximum 10 items' },
        { status: 400 }
      );
    }

    const updateData: UpdateData = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (published !== undefined) {
      updateData.published = published;
    }
    if (featured !== undefined) updateData.featured = featured;

    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        ...updateData,
        ...(published && { publishedAt: new Date() }),
        ...(tags && {
          tags: {
            set: [],
            connectOrCreate: tags.map((tagName: string) => ({
              where: { name: tagName },
              create: { name: tagName }
            }))
          }
        })
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

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const resolvedParams = await params;
    const postId = parseInt(resolvedParams.id);

    await prisma.post.delete({
      where: { id: postId }
    });

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
