import React, { useState, useEffect } from 'react';
import {
  Lock,
  User,
  Key,
  FolderPlus,
  FileText,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Plus,
  Tag,
  Star,
  Link as LinkIcon,
  Calendar,
  Clock,
  Image as ImageIcon
} from 'lucide-react';
import { loginAdmin, registerAdmin, createProject, createBlog, createFeed } from '../../api/api';

export function AdminSection() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Active Admin Sub-Tab
  const [adminTab, setAdminTab] = useState<'projects' | 'blog' | 'feed'>('projects');

  // Status Toast State
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form States - Project
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTags, setProjTags] = useState('');
  const [projStars, setProjStars] = useState<number>(0);
  const [projGithubLink, setProjGithubLink] = useState('');
  const [projDemoLink, setProjDemoLink] = useState('');
  const [projImage, setProjImage] = useState('');

  // Form States - Blog
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSnippet, setBlogSnippet] = useState('');
  const [blogDate, setBlogDate] = useState(new Date().toISOString().split('T')[0]);
  const [blogReadTime, setBlogReadTime] = useState('5 min read');
  const [blogTags, setBlogTags] = useState('');
  const [blogImage, setBlogImage] = useState('');

  // Form States - Feed
  const [feedContent, setFeedContent] = useState('');
  const [feedCategory, setFeedCategory] = useState('General');
  const [feedImage, setFeedImage] = useState('');


  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token);
    } else {
      localStorage.removeItem('adminToken');
    }
  }, [token]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsSubmittingAuth(true);

    try {
      if (authMode === 'login') {
        const res = await loginAdmin(username, password);
        setToken(res.token);
        setAuthSuccess('Successfully authenticated as admin!');
      } else {
        const res = await registerAdmin(username, password);
        setAuthSuccess(res.message + '. You can now log in.');
        setAuthMode('login');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  const showToast = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsLoading(true);
    try {
      const tagsArray = projTags.split(',').map(t => t.trim()).filter(Boolean);
      await createProject({
        title: projTitle,
        description: projDesc,
        tags: tagsArray,
        stars: Number(projStars) || 0,
        link: projDemoLink || projGithubLink,
        github_link: projGithubLink,
        demo_link: projDemoLink,
        image: projImage
      }, token);
      showToast('success', 'Project created successfully!');
      setProjTitle('');
      setProjDesc('');
      setProjTags('');
      setProjStars(0);
      setProjGithubLink('');
      setProjDemoLink('');
      setProjImage('');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsLoading(true);
    try {
      const tagsArray = blogTags.split(',').map(t => t.trim()).filter(Boolean);
      await createBlog({
        title: blogTitle,
        snippet: blogSnippet,
        date: blogDate,
        readTime: blogReadTime,
        tags: tagsArray,
        image: blogImage
      }, token);
      showToast('success', 'Blog post published successfully!');
      setBlogTitle('');
      setBlogSnippet('');
      setBlogTags('');
      setBlogImage('');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to create blog post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsLoading(true);
    try {
      await createFeed({
        content: feedContent,
        timestamp: new Date().toISOString(),
        category: feedCategory,
        likes: 0,
        image: feedImage
      }, token);
      showToast('success', 'Feed post added successfully!');
      setFeedContent('');
      setFeedImage('');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to create feed post');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="section-container" style={{ maxWidth: '440px', margin: '2rem auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            display: 'inline-flex',
            padding: '1rem',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.1)',
            color: '#818cf8',
            marginBottom: '0.75rem'
          }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#f3f4f6' }}>
            {authMode === 'login' ? 'Admin Portal Login' : 'Register Admin Account'}
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Manage projects, blog posts, and live feed updates.
          </p>
        </div>

        {authError && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            {authError}
          </div>
        )}

        {authSuccess && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: '#4ade80',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={16} />
            {authSuccess}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.35rem' }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#6b7280' }} />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="xyz"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.65rem 0.65rem 2.5rem',
                  background: 'rgba(17, 24, 39, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#f9fafb',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.35rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Key size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#6b7280' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.65rem 0.65rem 2.5rem',
                  background: 'rgba(17, 24, 39, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#f9fafb',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmittingAuth}
            style={{
              marginTop: '0.5rem',
              padding: '0.75rem',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {isSubmittingAuth ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Create Admin Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: '#9ca3af' }}>
          {authMode === 'login' ? (
            <span>
              Don't have an admin account?{' '}
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(''); setAuthSuccess(''); }}
                style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Register
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
                style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="section-container">
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={22} style={{ color: '#818cf8' }} /> Admin Management Dashboard
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            Add new projects, blog posts, and live feeds to your portfolio.
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '6px',
            color: '#f87171',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem'
          }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Toast Notification */}
      {statusMessage && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          marginBottom: '1.25rem',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: statusMessage.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: statusMessage.type === 'success' ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
          color: statusMessage.type === 'success' ? '#4ade80' : '#f87171',
        }}>
          {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {statusMessage.text}
        </div>
      )}

      {/* Dashboard Action Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        background: 'rgba(17, 24, 39, 0.4)',
        padding: '0.35rem',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <button
          onClick={() => setAdminTab('projects')}
          style={{
            flex: 1,
            padding: '0.6rem',
            borderRadius: '6px',
            border: 'none',
            background: adminTab === 'projects' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
            color: adminTab === 'projects' ? '#818cf8' : '#9ca3af',
            fontWeight: adminTab === 'projects' ? 600 : 400,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          <FolderPlus size={18} /> Add Project
        </button>

        <button
          onClick={() => setAdminTab('blog')}
          style={{
            flex: 1,
            padding: '0.6rem',
            borderRadius: '6px',
            border: 'none',
            background: adminTab === 'blog' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
            color: adminTab === 'blog' ? '#818cf8' : '#9ca3af',
            fontWeight: adminTab === 'blog' ? 600 : 400,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          <FileText size={18} /> Add Blog
        </button>

        <button
          onClick={() => setAdminTab('feed')}
          style={{
            flex: 1,
            padding: '0.6rem',
            borderRadius: '6px',
            border: 'none',
            background: adminTab === 'feed' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
            color: adminTab === 'feed' ? '#818cf8' : '#9ca3af',
            fontWeight: adminTab === 'feed' ? 600 : 400,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          <MessageSquare size={18} /> Add Feed
        </button>
      </div>

      {/* Tab 1: ADD PROJECT */}
      {adminTab === 'projects' && (
        <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.35rem' }}>
              Project Title
            </label>
            <input
              type="text"
              required
              value={projTitle}
              onChange={(e) => setProjTitle(e.target.value)}
              placeholder="e.g. Distributed Real-time Engine"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                background: 'rgba(17, 24, 39, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#f9fafb',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.35rem' }}>
              Description
            </label>
            <textarea
              required
              rows={3}
              value={projDesc}
              onChange={(e) => setProjDesc(e.target.value)}
              placeholder="Brief description of the project, features, and stack..."
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                background: 'rgba(17, 24, 39, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#f9fafb',
                fontSize: '0.9rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.35rem' }}>
                Tags (comma-separated)
              </label>
              <div style={{ position: 'relative' }}>
                <Tag size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#6b7280' }} />
                <input
                  type="text"
                  value={projTags}
                  onChange={(e) => setProjTags(e.target.value)}
                  placeholder="Go, Fiber, MongoDB, React"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.65rem 0.65rem 2.2rem',
                    background: 'rgba(17, 24, 39, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#f9fafb',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.35rem' }}>
                GitHub Stars Count
              </label>
              <div style={{ position: 'relative' }}>
                <Star size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#6b7280' }} />
                <input
                  type="number"
                  min="0"
                  value={projStars}
                  onChange={(e) => setProjStars(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.65rem 0.65rem 2.2rem',
                    background: 'rgba(17, 24, 39, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#f9fafb',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.35rem' }}>
                GitHub Repository Link
              </label>
              <div style={{ position: 'relative' }}>
                <LinkIcon size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#6b7280' }} />
                <input
                  type="url"
                  value={projGithubLink}
                  onChange={(e) => setProjGithubLink(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.65rem 0.65rem 2.2rem',
                    background: 'rgba(17, 24, 39, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#f9fafb',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.35rem' }}>
                Live Demo Link
              </label>
              <div style={{ position: 'relative' }}>
                <LinkIcon size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#6b7280' }} />
                <input
                  type="url"
                  value={projDemoLink}
                  onChange={(e) => setProjDemoLink(e.target.value)}
                  placeholder="https://myproject-demo.com"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.65rem 0.65rem 2.2rem',
                    background: 'rgba(17, 24, 39, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#f9fafb',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.35rem' }}>
              Project Image (URL or File Upload)
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <ImageIcon size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#6b7280' }} />
                <input
                  type="text"
                  value={projImage}
                  onChange={(e) => setProjImage(e.target.value)}
                  placeholder="https://example.com/project-thumbnail.png or upload image"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.65rem 0.65rem 2.2rem',
                    background: 'rgba(17, 24, 39, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#f9fafb',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              <input
                type="file"
                accept="image/*"
                id="proj-image-file"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setProjImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label
                htmlFor="proj-image-file"
                style={{
                  padding: '0.65rem 1rem',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '8px',
                  color: '#818cf8',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Browse Image
              </label>
            </div>
            {projImage && (
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src={projImage} alt="Preview" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)' }} />
                <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>Image attached</span>
                <button type="button" onClick={() => setProjImage('')} style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.75rem', cursor: 'pointer' }}>Remove</button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem'
            }}
          >
            <Plus size={18} /> {isLoading ? 'Saving...' : 'Add Project to Portfolio'}
          </button>
        </form>
      )}

      {/* Tab 2: ADD BLOG */}
      {adminTab === 'blog' && (
        <form onSubmit={handleCreateBlog} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.35rem' }}>
              Blog Title
            </label>
            <input
              type="text"
              required
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              placeholder="e.g. Building Scalable Microservices with GoFiber v3"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                background: 'rgba(17, 24, 39, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#f9fafb',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.35rem' }}>
              Snippet / Abstract
            </label>
            <textarea
              required
              rows={3}
              value={blogSnippet}
              onChange={(e) => setBlogSnippet(e.target.value)}
              placeholder="A brief summary of the blog post content..."
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                background: 'rgba(17, 24, 39, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#f9fafb',
                fontSize: '0.9rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.35rem' }}>
              Cover Image (URL or File Upload)
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <ImageIcon size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#6b7280' }} />
                <input
                  type="text"
                  value={blogImage}
                  onChange={(e) => setBlogImage(e.target.value)}
                  placeholder="https://example.com/blog-cover.jpg or upload image"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.65rem 0.65rem 2.2rem',
                    background: 'rgba(17, 24, 39, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#f9fafb',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              <input
                type="file"
                accept="image/*"
                id="blog-image-file"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setBlogImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label
                htmlFor="blog-image-file"
                style={{
                  padding: '0.65rem 1rem',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '8px',
                  color: '#818cf8',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Browse Image
              </label>
            </div>
            {blogImage && (
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src={blogImage} alt="Preview" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)' }} />
                <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>Image attached</span>
                <button type="button" onClick={() => setBlogImage('')} style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.75rem', cursor: 'pointer' }}>Remove</button>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.35rem' }}>
                Publish Date
              </label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#6b7280' }} />
                <input
                  type="text"
                  value={blogDate}
                  onChange={(e) => setBlogDate(e.target.value)}
                  placeholder="Jul 31, 2026"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.65rem 0.65rem 2.2rem',
                    background: 'rgba(17, 24, 39, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#f9fafb',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.35rem' }}>
                Read Time
              </label>
              <div style={{ position: 'relative' }}>
                <Clock size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#6b7280' }} />
                <input
                  type="text"
                  value={blogReadTime}
                  onChange={(e) => setBlogReadTime(e.target.value)}
                  placeholder="5 min read"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.65rem 0.65rem 2.2rem',
                    background: 'rgba(17, 24, 39, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#f9fafb',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.35rem' }}>
                Tags (comma-separated)
              </label>
              <div style={{ position: 'relative' }}>
                <Tag size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#6b7280' }} />
                <input
                  type="text"
                  value={blogTags}
                  onChange={(e) => setBlogTags(e.target.value)}
                  placeholder="Golang, Architecture"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.65rem 0.65rem 2.2rem',
                    background: 'rgba(17, 24, 39, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#f9fafb',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem'
            }}
          >
            <Plus size={18} /> {isLoading ? 'Publishing...' : 'Publish Blog Post'}
          </button>
        </form>
      )}

      {/* Tab 3: ADD FEED */}
      {adminTab === 'feed' && (
        <form onSubmit={handleCreateFeed} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.35rem' }}>
              Category Tag
            </label>
            <select
              value={feedCategory}
              onChange={(e) => setFeedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                background: 'rgba(17, 24, 39, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#f9fafb',
                fontSize: '0.9rem'
              }}
            >
              <option value="General">General Status Update</option>
              <option value="Project Update">Project Milestone</option>
              <option value="Tech Insights">Tech Insight / Article</option>
              <option value="Announcement">Announcement</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.35rem' }}>
              Feed Content Post
            </label>
            <textarea
              required
              rows={4}
              value={feedContent}
              onChange={(e) => setFeedContent(e.target.value)}
              placeholder="What's happening? Share a quick update, link, or project thought..."
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                background: 'rgba(17, 24, 39, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#f9fafb',
                fontSize: '0.9rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.35rem' }}>
              Feed Image / Media (URL or File Upload)
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <ImageIcon size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#6b7280' }} />
                <input
                  type="text"
                  value={feedImage}
                  onChange={(e) => setFeedImage(e.target.value)}
                  placeholder="https://example.com/feed-image.png or upload image"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.65rem 0.65rem 2.2rem',
                    background: 'rgba(17, 24, 39, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#f9fafb',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              <input
                type="file"
                accept="image/*"
                id="feed-image-file"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setFeedImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label
                htmlFor="feed-image-file"
                style={{
                  padding: '0.65rem 1rem',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '8px',
                  color: '#818cf8',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Browse Image
              </label>
            </div>
            {feedImage && (
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src={feedImage} alt="Preview" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)' }} />
                <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>Image attached</span>
                <button type="button" onClick={() => setFeedImage('')} style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.75rem', cursor: 'pointer' }}>Remove</button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem'
            }}
          >
            <Plus size={18} /> {isLoading ? 'Posting...' : 'Post Update to Live Feed'}
          </button>
        </form>
      )}
    </div>
  );
}

