import { useEffect, useState } from 'react';
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Rss, 
  Mail, 
  Server
} from 'lucide-react';
import { Project, BlogPost, ApiHealth } from './types';
import { fetchHealth, fetchProjects, fetchBlogs } from './api/api';
import { FeedSection } from './components/sections/FeedSection';
import { AboutSection } from './components/sections/AboutSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { BlogSection } from './components/sections/BlogSection';
import { ContactSection } from './components/sections/ContactSection';

export function App() {
  const [activeTab, setActiveTab] = useState<'feed' | 'about' | 'projects' | 'blog' | 'contact'>('feed');
  
  // API state
  const [health, setHealth] = useState<ApiHealth | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchHealth().then(setHealth);
    fetchProjects().then(setProjects);
    fetchBlogs().then(setBlogs);
  }, []);

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
              <Briefcase size={14} /> Systems Dev @ <span className="highlight-google">GoFiber</span>
            </div>
            <div className="meta-item">
              <MapPin size={14} /> /links
            </div>
            <div className="meta-item">
              <Calendar size={14} /> Joined 2026
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
          {activeTab === 'feed' && <FeedSection />}
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
