import { NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/service';

export async function GET() {
  try {
    const posts = await getAllBlogPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
