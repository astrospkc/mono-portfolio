export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  stars: number;
  link: string;
}

export interface BlogPost {
  id: string;
  title: string;
  snippet: string;
  date: string;
  readTime: string;
  tags: string[];
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
