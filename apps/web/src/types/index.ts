export interface Project {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  tags: string[];
  stars: number;
  link?: string;
  github_link?: string;
  demo_link?: string;
  image?: string;
}

export interface BlogPost {
  id?: string;
  _id?: string;
  title: string;
  snippet: string;
  date: string;
  readTime: string;
  tags: string[];
  image?: string;
}

export interface FeedItem {
  id?: string;
  _id?: string;
  content: string;
  timestamp: string;
  likes?: number;
  category?: string;
  image?: string;
}

export interface ApiHealth {
  status: string;
  service: string;
  uptime: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

