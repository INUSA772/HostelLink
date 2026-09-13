import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { toast } from 'react-toastify';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0d1b3e;
    --navy2: #112255;
    --blue: #1a3fa4;
    --orange: #e8501a;
    --white: #ffffff;
    --gray-bg: #f4f6fa;
    --text-dark: #111827;
    --text-mid: #4b5563;
    --card-radius: 14px;
  }

  body { font-family: 'Manrope', sans-serif; background: var(--gray-bg); color: var(--text-dark); }
  a { text-decoration: none; color: inherit; }

  .contact-page {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--gray-bg) 0%, #ffffff 100%);
    padding-top: 68px;
  }

  /* ── TOP NAV ── */
  .contact-topnav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: white;
    border-bottom: 1px solid #e5e7eb;
    padding: 0.75rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }

  .contact-back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--gray-bg);
    border: 1px solid #e5e7eb;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 700;
    color: var(--navy);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
    font-family: 'Manrope', sans-serif;
  }

  .contact-back-btn:hover {
    background: var(--navy);
    color: white;
    border-color: var(--navy);
  }

  /* ── HERO SECTION — navy bg, white text ── */
  .contact-hero {
    background: var(--navy);
    color: #ffffff;
    padding: 3rem 1.5rem;
    text-align: center;
  }

  .contact-hero h1 {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    margin-bottom: 0.75rem;
    font-family: 'Poppins', sans-serif;
    color: #ffffff;
  }

  .contact-hero p {
    font-size: 1rem;
    color: #ffffff;
    opacity: 0.9;
    max-width: 500px;
    margin: 0 auto;
  }

  /* ── MAIN CONTENT ── */
  .contact-content {
    max-width: 1200px;
    margin: 3rem auto;
    padding: 0 1.5rem;
  }

  /* ── CONTACT INFO GRID ── */
  .contact-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
  }

  .contact-info-card {
    background: white;
    padding: 2.5rem 2rem;
    border-radius: var(--card-radius);
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    text-align: center;
    border: 1px solid #e5e7eb;
    transition: all 0.3s;
  }

  .contact-info-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.12);
    border-color: var(--orange);
  }

  .contact-info-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 1.5rem;
    background: linear-gradient(135deg, var(--orange), #ff6b35);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    color: white;
  }

  .contact-info-card h3 {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--navy);
    margin-bottom: 0.75rem;
    font-family: 'Poppins', sans-serif;
  }

  .contact-info-card p {
    font-size: 0.95rem;
    color: var(--text-mid);
    line-height: 1.6;
  }

  .contact-info-card a {
    color: var(--orange);
    font-weight: 600;
    transition: all 0.2s;
  }

  .contact-info-card a:hover {
    opacity: 0.8;
  }

  /* ── CONTACT FORM SECTION ── */
  .contact-form-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    margin-bottom: 4rem;
  }

  .contact-form {
    background: white;
    padding: 2.5rem 2rem;
    border-radius: var(--card-radius);
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    border: 1px solid #e5e7eb;
  }

  .contact-form h2 {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--navy);
    margin-bottom: 1.5rem;
    font-family: 'Poppins', sans-serif;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-label {
    display: block;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .form-input,
  .form-textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1.5px solid #e5e7eb;
    border-radius: 8px;
    font-family: 'Manrope', sans-serif;
    font-size: 0.95rem;
    color: var(--text-dark);
    transition: all 0.2s;
    background: white;
    outline: none;
  }

  .form-input:focus,
  .form-textarea:focus {
    border-color: var(--orange);
    box-shadow: 0 0 0 3px rgba(232,80,26,0.1);
  }

  .form-textarea {
    resize: vertical;
    min-height: 120px;
  }

  .form-btn {
    width: 100%;
    padding: 0.9rem 1.5rem;
    background: linear-gradient(135deg, var(--orange), #ff6b35);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Manrope', sans-serif;
  }

  .form-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(232,80,26,0.3);
  }

  .form-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  /* ── SIDE INFO ── */
  .contact-side-info {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .info-box {
    background: white;
    padding: 2rem;
    border-radius: var(--card-radius);
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    border: 1px solid #e5e7eb;
  }

  .info-box h3 {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--navy);
    margin-bottom: 1rem;
    font-family: 'Poppins', sans-serif;
  }

  .info-item {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .info-item:last-child {
    margin-bottom: 0;
  }

  .info-item-icon {
    width: 40px;
    height: 40px;
    background: var(--gray-bg);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--orange);
    flex-shrink: 0;
    font-size: 1.2rem;
  }

  .info-item-content {
    flex: 1;
  }

  .info-item-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 0.2rem;
  }

  .info-item-text {
    font-size: 0.85rem;
    color: var(--text-mid);
    line-height: 1.5;
  }

  /* ── SOCIAL LINKS ── */
  .social-links {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .social-link {
    width: 40px;
    height: 40px;
    background: var(--gray-bg);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--orange);
    transition: all 0.2s;
    cursor: pointer;
    font-size: 1.1rem;
  }

  .social-link:hover {
    background: var(--orange);
    color: white;
    transform: translateY(-3px);
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .contact-form-section { grid-template-columns: 1fr; }
  }

  @media (max-width: 768px) {
    .contact-hero { padding: 2rem 1rem; }
    .contact-hero h1 { font-size: 1.8rem; }
    .contact-form { padding: 1.5rem; }
    .contact-info-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 520px) {
    .contact-topnav { padding: 0.5rem 1rem; }
    .contact-back-btn { padding: 0.4rem 0.8rem; font-size: 0.8rem; }
    .contact-hero h1 { font-size: 1.5rem; }
    .contact-content { padding: 0 1rem; }
    .contact-form { padding: 1.25rem; }
    .info-box { padding: 1.5rem; }
  }
`;

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="contact-page">

        {/* Top Nav */}
        <div className="contact-topnav">
          <button className="contact-back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
        </div>

        {/* Hero — navy bg, white text */}
        <section className="contact-hero">
          <h1>Get In Touch</h1>
          <p>
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </section>

        {/* Main Content */}
        <div className="contact-content">

          {/* Contact Info Cards */}
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <div className="contact-info-icon"><FaPhone /></div>
              <h3>Phone</h3>
              <p>
                <a href="tel:+265888660180">+265 888 660 1803</a>
                <br />Monday - Friday, 9AM - 5PM
              </p>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon"><FaEnvelope /></div>
              <h3>Email</h3>
              <p>
                <a href="mailto:forjiteckco@gmail.com">forjiteckco@gmail.com</a>
                <br />We reply within 24 hours
              </p>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon"><FaMapMarkerAlt /></div>
              <h3>Location</h3>
              <p>
                Blantyre, Malawi
                <br />Near MUBAS Campus
              </p>
            </div>
          </div>

          {/* Form + Side Info */}
          <div className="contact-form-section">
            <form className="contact-form" onSubmit={handleSubmit}>
              <h2>Send us a Message</h2>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input type="text" className="form-input" name="subject" value={formData.subject} onChange={handleChange} placeholder="How can we help?" required />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-textarea" name="message" value={formData.message} onChange={handleChange} placeholder="Tell us more..." required></textarea>
              </div>

              <button type="submit" className="form-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            <div className="contact-side-info">
              <div className="info-box">
                <h3>Office Hours</h3>
                <div className="info-item">
                  <div className="info-item-icon"><FaClock /></div>
                  <div className="info-item-content">
                    <div className="info-item-title">Monday - Friday</div>
                    <div className="info-item-text">9:00 AM - 5:00 PM (WAT)</div>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-item-icon"><FaClock /></div>
                  <div className="info-item-content">
                    <div className="info-item-title">Saturday</div>
                    <div className="info-item-text">10:00 AM - 2:00 PM (WAT)</div>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-item-icon"><FaClock /></div>
                  <div className="info-item-content">
                    <div className="info-item-title">Sunday</div>
                    <div className="info-item-text">Closed</div>
                  </div>
                </div>
              </div>

              <div className="info-box">
                <h3>Connect With Us</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-mid)', marginBottom: '1rem' }}>
                  Follow us on social media for updates and announcements.
                </p>
                <div className="social-links">
                  <a href="#" className="social-link" title="Facebook"><FaFacebook /></a>
                  <a href="#" className="social-link" title="Twitter"><FaTwitter /></a>
                  <a href="#" className="social-link" title="Instagram"><FaInstagram /></a>
                </div>
              </div>

              <div className="info-box">
                <h3>Quick Links</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <a href="/about" style={{ fontSize: '0.9rem', color: 'var(--orange)', fontWeight: '600' }}
                    onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
                    onMouseLeave={(e) => (e.target.style.opacity = '1')}>→ About Us</a>
                  <a href="/hostels" style={{ fontSize: '0.9rem', color: 'var(--orange)', fontWeight: '600' }}
                    onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
                    onMouseLeave={(e) => (e.target.style.opacity = '1')}>→ Browse Hostels</a>
                  <a href="/register" style={{ fontSize: '0.9rem', color: 'var(--orange)', fontWeight: '600' }}
                    onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
                    onMouseLeave={(e) => (e.target.style.opacity = '1')}>→ Create Account</a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Contact;