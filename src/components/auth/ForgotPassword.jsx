import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import authService from '../../services/authService';
import { handleApiError } from '../../utils/helpers';
import '../../styles/global.css';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0d1b3e;
    --navy2: #112255;
    --blue: #1a3fa4;
    --orange: #e8501a;
    --text-dark: #111827;
    --text-mid: #4b5563;
    --card-radius: 14px;
    --success: #10b981;
    --white: #ffffff;
    --gray: #6b7280;
    --light-gray: #e5e7eb;
  }

  /* Lock entire page — zero scroll */
  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
    font-family: 'Manrope', sans-serif;
  }

  /* TOPBAR - EXACT same as Register/Login Page */
  .rp-bar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 500;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    background: rgba(8, 18, 48, 0.97);
    backdrop-filter: blur(8px);
    box-shadow: 0 2px 18px rgba(0,0,0,0.4);
  }
  .rp-bar-logo {
    display: flex; align-items: center; gap: 9px; text-decoration: none;
  }
  .rp-bar-logo-img {
    width: 36px; height: 36px; border-radius: 50%; overflow: hidden; flex-shrink: 0;
  }
  .rp-bar-logo-img img { width: 100%; height: 100%; object-fit: cover; }
  .rp-bar-brand strong {
    display: block; color: #fff; font-size: 0.9rem; font-weight: 800;
    letter-spacing: 1px; font-family: 'Manrope', sans-serif;
  }
  .rp-bar-brand span {
    color: rgba(255,255,255,0.42); font-size: 0.56rem;
    letter-spacing: 0.4px; font-family: 'Manrope', sans-serif;
  }
  .rp-bar-actions { display: flex; align-items: center; gap: 0.6rem; }
  .rp-bar-login {
    color: rgba(255,255,255,0.78); font-size: 0.82rem; font-weight: 600;
    font-family: 'Manrope', sans-serif; background: transparent;
    border: 1.5px solid rgba(255,255,255,0.2); padding: 0.36rem 0.95rem;
    border-radius: 6px; cursor: pointer; text-decoration: none;
    transition: all 0.18s; display: flex; align-items: center; gap: 5px;
  }
  .rp-bar-login:hover { border-color: rgba(255,255,255,0.55); color: #fff; }
  .rp-bar-signup {
    color: #fff; font-size: 0.82rem; font-weight: 700;
    font-family: 'Manrope', sans-serif; background: var(--orange);
    border: none; padding: 0.36rem 0.95rem; border-radius: 6px;
    cursor: pointer; text-decoration: none; transition: opacity 0.18s;
    display: flex; align-items: center; gap: 5px;
  }
  .rp-bar-signup:hover { opacity: 0.88; }

  /* MAIN CONTENT - FULLSCREEN CENTERED FORM */
  .rp-main {
    position: fixed;
    top: 60px; left: 0; right: 0; bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f4f6fb;
    overflow: hidden;
  }

  /* FORM CARD - EXACT same as Register/Login Page */
  .rp-card {
    background: #fff;
    border-radius: var(--card-radius);
    box-shadow: 0 8px 40px rgba(13,27,62,0.12);
    padding: 2rem;
    width: 420px;
    max-width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  }
  .rp-card-hdr { text-align: center; margin-bottom: 1.1rem; }
  .rp-card-hdr h2 {
    font-size: 1.28rem; font-weight: 800; color: var(--navy); margin-bottom: 0.15rem;
  }
  .rp-card-hdr p { color: var(--text-mid); font-size: 0.75rem; }
  .rp-line {
    width: 38px; height: 3px; background: var(--orange);
    border-radius: 2px; margin: 0.45rem auto 0;
  }

  /* fields */
  .rp-grp { margin-bottom: 1.5rem; }
  .rp-lbl {
    display: block; font-size: 0.6rem; font-weight: 700; color: var(--text-mid);
    text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 0.22rem;
  }
  .rp-wrap { position: relative; display: flex; align-items: center; }
  .rp-ico { position: absolute; left: 0.68rem; color: var(--blue); font-size: 0.68rem; pointer-events: none; }
  .rp-input {
    width: 100%; border: 1.5px solid #e5e7eb; border-radius: 6px;
    padding: 0.44rem 0.65rem 0.44rem 1.9rem; font-size: 0.78rem;
    font-family: 'Manrope', sans-serif; color: var(--text-dark);
    font-weight: 500; background: #fafafa; outline: none;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  }
  .rp-input:focus {
    border-color: var(--blue); background: #fff;
    box-shadow: 0 0 0 3px rgba(26,63,164,0.07);
  }
  .rp-input::placeholder { color: #c0c6d0; font-weight: 400; }

  /* submit button - EXACT same as Register/Login Page */
  .rp-submit {
    width: 100%; background: var(--orange); color: #fff; border: none;
    cursor: pointer; padding: 0.62rem 1rem; border-radius: 7px;
    font-size: 0.84rem; font-weight: 700; font-family: 'Manrope', sans-serif;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: opacity 0.18s, transform 0.14s;
  }
  .rp-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  .rp-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .rp-submit-spin {
    width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff; border-radius: 50%; animation: rpspin 0.7s linear infinite;
  }

  /* back link */
  .rp-link {
    text-align: center; margin-top: 1.5rem; font-size: 0.76rem; color: var(--text-mid);
  }
  .rp-link a { color: var(--orange); font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; }
  .rp-link a:hover { text-decoration: underline; }

  /* success state */
  .rp-success-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--success);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    font-size: 2rem;
    font-weight: 700;
  }
  .rp-success-text {
    color: var(--text-mid);
    font-size: 0.85rem;
    margin-bottom: 2rem;
    line-height: 1.6;
    text-align: center;
  }
  .rp-success-text strong {
    color: var(--navy);
    font-weight: 700;
  }

  @keyframes rpspin { to { transform: rotate(360deg); } }

  @media (max-width: 768px) {
    .rp-bar { padding: 0 1rem; }
    .rp-bar-brand { display: none; }
    .rp-card { max-height: 85vh; }
  }
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setEmailSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <>
        <style>{styles}</style>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

        {/* TOPBAR */}
        <nav className="rp-bar">
          <Link to="/" className="rp-bar-logo">
            <div className="rp-bar-logo-img"><img src="/logo2.png" alt="HostelLink" /></div>
            <div className="rp-bar-brand">
              <strong>HOSTELLINK</strong>
              <span>OFF-CAMPUS ACCOMODATION</span>
            </div>
          </Link>
          <div className="rp-bar-actions">
            <Link to="/login" className="rp-bar-login"><i className="fa fa-sign-in-alt"></i> Login</Link>
            <Link to="/register" className="rp-bar-signup"><i className="fa fa-user-plus"></i> Sign Up</Link>
          </div>
        </nav>

        {/* MAIN CONTENT - CENTERED FORM */}
        <div className="rp-main">
          <div className="rp-card" style={{ textAlign: 'center' }}>
            <div className="rp-success-icon">✓</div>
            
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: 'var(--navy)', 
              marginBottom: '1rem' 
            }}>
              Check Your Email
            </h2>
            
            <p style={{ 
              color: 'var(--gray)', 
              marginBottom: '2rem',
              fontSize: '0.9rem',
              lineHeight: '1.6'
            }}>
              We've sent a password reset link to <strong>{email}</strong>
            </p>

            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button className="rp-submit">
                <i className="fa fa-sign-in-alt"></i> Back to Login
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      {/* TOPBAR */}
      <nav className="rp-bar">
        <Link to="/" className="rp-bar-logo">
          <div className="rp-bar-logo-img"><img src="/logo2.png" alt="HostelLink" /></div>
          <div className="rp-bar-brand">
            <strong>HOSTELLINK</strong>
            <span>OFF-CAMPUS ACCOMODATION</span>
          </div>
        </Link>
        <div className="rp-bar-actions">
          <Link to="/login" className="rp-bar-login"><i className="fa fa-sign-in-alt"></i> Login</Link>
          <Link to="/register" className="rp-bar-signup"><i className="fa fa-user-plus"></i> Sign Up</Link>
        </div>
      </nav>

      {/* MAIN CONTENT - CENTERED FORM */}
      <div className="rp-main">
        <div className="rp-card">
          <div className="rp-card-hdr">
            <h2>Forgot Password?</h2>
            <p>Enter your email address and we'll send you a link to reset your password.</p>
            <div className="rp-line"></div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="rp-grp">
              <label className="rp-lbl" htmlFor="email">Email Address</label>
              <div className="rp-wrap">
                <i className="fa fa-envelope rp-ico"></i>
                <input
                  id="email"
                  className="rp-input"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="rp-submit" disabled={loading}>
              {loading
                ? <><div className="rp-submit-spin"></div> Sending...</>
                : <>Send Reset Link</>
              }
            </button>
          </form>

          {/* Back to Login Link */}
          <p className="rp-link">
            Remember your password?{' '}
            <Link to="/login">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;