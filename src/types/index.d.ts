// Authentication Types
declare global {
  interface JWTPayload {
    userId: number;
    email: string;
    role: string;
  }

  interface User {
    id: number;
    email: string;
    username: string;
    role: 'USER' | 'ADMIN';
    createdAt: Date;
    updatedAt: Date;
  }

  // Blog Post Types
  interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    readTime: string;
    tags: string[];
    author: string;
    slug: string;
  }

  interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    published: boolean;
    featured: boolean;
    readTime: string;
    authorId: number;
    author: {
      username: string;
      email: string;
    };
    tags: Tag[];
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  }

  interface Tag {
    id: number;
    name: string;
  }

  // GitHub API Types
  interface GitHubRepo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    updated_at: string;
    topics: string[];
    archived: boolean;
    fork: boolean;
  }

  // Admin Types
  interface UpdateData {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    published?: boolean;
    featured?: boolean;
  }

  // Terminal Types
  interface TerminalHistory {
    command: string;
    response: string;
    timestamp: Date;
  }

  // Matrix Effect Types
  interface MatrixParticle {
    id: number;
    x: number;
    y: number;
    speed: number;
  }

  // Project Types
  interface Project {
    id: number;
    title: string;
    description: string;
    tech: string[];
    status: 'ACTIVE' | 'DEVELOPMENT' | 'COMPLETE';
    github: string;
    features: string[];
  }

  // Component Props Types
  interface HeaderProps {
    menuState: string;
    setMenuState?: (state: string) => void;
    currentTime: string;
  }

  interface TypingTextProps {
    text: string;
    speed?: number;
    onComplete?: () => void;
  }

  // API Response Types
  interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
  }

  interface PostsResponse {
    posts: Post[];
  }

  interface PostResponse {
    post: Post;
  }

  // Form Types
  interface LoginFormData {
    username: string;
    password: string;
  }

  interface CreatePostFormData {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    tags: string[];
    published: boolean;
    featured: boolean;
  }

  // Bookmark Types
  interface Bookmark {
    slug: string;
    title: string;
    date: string;
  }
}

export {};
