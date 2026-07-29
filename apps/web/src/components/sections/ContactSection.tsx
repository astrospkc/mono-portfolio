import { useState, FormEvent } from 'react';
import { Send, CheckCircle, MessageSquare } from 'lucide-react';
import { sendContactMessage } from '../../api/api';
import { ContactFormData } from '../../types';

export function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);

    try {
      const res = await sendContactMessage(formData);
      setSubmitSuccess(res.message || 'Message sent directly to inbox!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setSubmitError(err.message || 'An error occurred while sending message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Get In Touch <MessageSquare size={20} style={{ display: 'inline', color: 'var(--accent-pink)' }} />
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Write a message below. It will be sent directly to my GoFiber v3 backend inbox!
        </p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        {submitSuccess && (
          <div className="alert-success">
            <CheckCircle size={18} /> {submitSuccess}
          </div>
        )}

        {submitError && (
          <div className="alert-error">
            {submitError}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="e.g. Alex Johnson"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Your Email</label>
            <input 
              type="email" 
              className="form-input"
              placeholder="alex@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Subject</label>
          <input 
            type="text" 
            className="form-input"
            placeholder="Project Inquiry / Collaboration"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Message</label>
          <textarea 
            className="form-textarea"
            placeholder="Write your message here..."
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          ></textarea>
        </div>

        <button type="submit" className="btn-submit" disabled={submitting}>
          {submitting ? 'Sending Message...' : 'Send Direct to Inbox'} <Send size={16} />
        </button>
      </form>
    </div>
  );
}
