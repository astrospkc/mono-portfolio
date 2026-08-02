import { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  Briefcase,
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
  const location = useLocation();
  const navigate = useNavigate();

  // API state
  const [health, setHealth] = useState<ApiHealth | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [feeds, setFeeds] = useState<FeedItem[]>([]);

  useEffect(() => {
    if (!location.pathname.startsWith('/admin')) {
      fetchHealth().then(setHealth);
      fetchProjects().then(setProjects);
      fetchBlogs().then(setBlogs);
      fetchFeeds().then(setFeeds);
    }
  }, [location.pathname]);

  // If path starts with /admin, render standalone Admin Dashboard Page
  if (location.pathname.startsWith('/admin')) {
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
            <button className="btn-follow" onClick={() => navigate('/contact')}>
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
          <NavLink
            to="/"
            end
            className={({ isActive }) => `tab-btn ${isActive ? 'active' : ''}`}
          >
            Feed
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `tab-btn ${isActive ? 'active' : ''}`}
          >
            About
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) => `tab-btn ${isActive ? 'active' : ''}`}
          >
            Projects
          </NavLink>
          <NavLink
            to="/blog"
            className={({ isActive }) => `tab-btn ${isActive ? 'active' : ''}`}
          >
            Blog
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => `tab-btn ${isActive ? 'active' : ''}`}
          >
            Contact Me
          </NavLink>
        </div>

        {/* Dynamic Tab Body with Routes */}
        <div className="tab-content">
          <Routes>
            <Route path="/" element={<FeedSection feeds={feeds} />} />
            <Route path="/about" element={<AboutSection />} />
            <Route path="/projects" element={<ProjectsSection projects={projects} />} />
            <Route path="/blog" element={<BlogSection blogs={blogs} />} />
            <Route path="/contact" element={<ContactSection />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
