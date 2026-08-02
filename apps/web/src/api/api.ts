import { ApiHealth, Project, BlogPost, ContactFormData, FeedItem } from '../types';
import baseUrl from '../service/api_service';
export async function fetchHealth(): Promise<ApiHealth | null> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch health status:', err);
    return null;
  }
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${baseUrl}/api/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    console.log('Projects fetched successfully:', res);
    return await res.json();
  } catch (err) {
    console.warn('Falling back to default projects:', err);
    return [
      {
        id: '1',
        title: 'TurboGo Monorepo Architecture',
        description: 'High-throughput microservices orchestrated with Turborepo, GoFiber v3, and React 18.',
        tags: ['Go', 'GoFiber v3', 'Turborepo', 'React', 'TypeScript'],
        stars: 142,
        link: '#'
      },
      {
        id: '2',
        title: 'Distributed Real-time Engine',
        description: 'Low-latency WebSockets & SSE event distributor built in Golang with high concurrency goroutines.',
        tags: ['Go', 'WebSockets', 'Redis', 'Docker'],
        stars: 98,
        link: '#'
      }
    ];
  }
}

export async function fetchBlogs(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${baseUrl}/api/blogs`);
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return await res.json();
  } catch (err) {
    console.warn('Falling back to default blogs:', err);
    return [
      {
        id: '1',
        title: 'Building Scalable GoFiber v3 APIs in Monorepos',
        snippet: 'A comprehensive guide on integrating GoFiber v3 with Turborepo and pnpm workspaces for rapid full-stack dev.',
        date: 'Jul 24, 2026',
        readTime: '5 min read',
        tags: ['Golang', 'Architecture', 'Turborepo']
      }
    ];
  }
}

export async function fetchFeeds(): Promise<FeedItem[]> {
  try {
    const res = await fetch(`${baseUrl}/api/feeds`);
    if (!res.ok) throw new Error('Failed to fetch feeds');
    return await res.json();
  } catch (err) {
    console.warn('Falling back to default feeds:', err);
    return [
      {
        id: '1',
        content: 'Hello World! Welcome to my monorepo portfolio. Building scalable backend engines with GoFiber v3 and sleek user interfaces using React & TypeScript.',
        category: 'Announcement',
        timestamp: '2026-01-20'
      }
    ];
  }
}

export async function sendContactMessage(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const resData = await res.json();

  if (!res.ok) {
    throw new Error(resData.error || 'Failed to submit message');
  }

  return resData;
}

export async function loginAdmin(username: string, password: string): Promise<{ token: string; message: string }> {
  const res = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Login failed');
  }
  return data;
}

export async function registerAdmin(username: string, password: string): Promise<{ message: string }> {
  const res = await fetch(`${baseUrl}/api/admin/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Registration failed');
  }
  return data;
}

export async function createProject(project: Omit<Project, 'id' | '_id'>, token: string): Promise<Project> {
  const res = await fetch(`${baseUrl}/api/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(project),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create project');
  }
  return data;
}

export async function createBlog(blog: Omit<BlogPost, 'id' | '_id'>, token: string): Promise<BlogPost> {
  const res = await fetch(`${baseUrl}/api/blogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(blog),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create blog post');
  }
  return data;
}

export async function createFeed(feed: Omit<FeedItem, 'id' | '_id'>, token: string): Promise<FeedItem> {
  const res = await fetch(`${baseUrl}/api/feeds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(feed),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to post feed item');
  }
  return data;
}

