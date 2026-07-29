import { ApiHealth, Project, BlogPost, ContactFormData } from '../types';

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
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error('Failed to fetch projects');
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
    const res = await fetch('/api/blogs');
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

export async function sendContactMessage(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/contact', {
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
