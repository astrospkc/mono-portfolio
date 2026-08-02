import { useEffect, useState } from 'react';
import {
  Briefcase,
  Calendar,
  MapPin,
  Sparkles,
  Rss,
  Mail,
  Server,
  Github,
  Linkedin,
  Youtube,
  Instagram
} from 'lucide-react';
import { Project, BlogPost, ApiHealth, FeedItem } from './types';
import { fetchHealth, fetchProjects, fetchBlogs, fetchFeeds } from './api/api';
import { FeedSection } from './components/sections/FeedSection';
import { AboutSection } from './components/sections/AboutSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { BlogSection } from './components/sections/BlogSection';
import { ContactSection } from './components/sections/ContactSection';
import { AdminSection } from './components/sections/AdminSection';

export function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [activeTab, setActiveTab] = useState<'feed' | 'about' | 'projects' | 'blog' | 'contact'>('feed');

  // API state
  const [health, setHealth] = useState<ApiHealth | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [feeds, setFeeds] = useState<FeedItem[]>([]);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (currentPath !== '/admin') {
      fetchHealth().then(setHealth);
      fetchProjects().then(setProjects);
      fetchBlogs().then(setBlogs);
      fetchFeeds().then(setFeeds);
    }
  }, [currentPath]);

  // If path is /admin, render standalone Admin Dashboard Page
  if (currentPath === '/admin' || currentPath === '/admin/') {
    return (
      <div className="app-viewport">
        <div className="browser-window">
          <div className="browser-header">
            <span className="dot dot-red"></span>
            <span className="dot dot-yellow"></span>
            <span className="dot dot-green"></span>
            <span className="browser-title">mono_portfolio — Admin Dashboard (/admin)</span>
          </div>
          <div style={{ padding: '1.5rem 1rem' }}>
            <AdminSection />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-viewport">
      <div className="browser-window">
        {/* Browser Top Bar */}
        <div className="browser-header">
          <span className="dot dot-red"></span>
          <span className="dot dot-yellow"></span>
          <span className="dot dot-green"></span>
          <span className="browser-title">mono_portfolio — Vite + React & GoFiber v3</span>
        </div>

        {/* Profile Banner */}
        <div className="profile-banner"></div>

        {/* Profile Header Body */}
        <div className="profile-header-body">
          <div className="avatar-wrapper">
            <div className="avatar-img">
              P
            </div>
            <button className="btn-follow" onClick={() => setActiveTab('contact')}>
              <Mail size={16} /> Contact Me <Rss size={14} />
            </button>
          </div>

          <div className="profile-name-row">
            <h1 className="profile-name">Punam</h1>
            <Sparkles className="sparkle-badge" size={20} />
          </div>

          <div className="profile-bio">
            Brings ideas to life with code ✨
          </div>

          <div className="profile-subbio">
            Full-Stack Engineer & Systems Architect. Specialized in High-Performance Golang Microservices, React, and Modern Monorepos.
          </div>

          <div className="profile-meta-row">
            <div className="meta-item">
              <Briefcase size={14} /> Fullstack Engineer @ <span className="highlight-google">Punam</span>
            </div>

            <div className="social-links-group">
              <a href="https://github.com/astrospkc" target="_blank" rel="noopener noreferrer" className="social-link-pill">
                <Github size={14} /> Github
              </a>
              <a href="https://www.linkedin.com/in/punam-k-2018951b6/" target="_blank" rel="noopener noreferrer" className="social-link-pill">
                <Linkedin size={14} /> Linkedin
              </a>
              <a href="https://www.youtube.com/@im_unfiltered1" target="_blank" rel="noopener noreferrer" className="social-link-pill">
                <Youtube size={14} /> Youtube
              </a>
              <a href="https://www.instagram.com/im_unfiltered1/" target="_blank" rel="noopener noreferrer" className="social-link-pill">
                <Instagram size={14} /> Instagram
              </a>
            </div>

            {health && (
              <div className="meta-item" style={{ color: '#4ade80' }}>
                <Server size={14} /> Backend: {health.service} ({health.status})
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="nav-tabs">
          <button
            className={`tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => setActiveTab('feed')}
          >
            Feed
          </button>
          <button
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button
            className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button
            className={`tab-btn ${activeTab === 'blog' ? 'active' : ''}`}
            onClick={() => setActiveTab('blog')}
          >
            Blog
          </button>
          <button
            className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            Contact Me
          </button>
        </div>

        {/* Dynamic Tab Body */}
        <div className="tab-content">
          {activeTab === 'feed' && <FeedSection feeds={feeds} />}
          {activeTab === 'about' && <AboutSection />}
          {activeTab === 'projects' && <ProjectsSection projects={projects} />}
          {activeTab === 'blog' && <BlogSection blogs={blogs} />}
          {activeTab === 'contact' && <ContactSection />}
        </div>
      </div>
    </div>
  );
}

export default App;


