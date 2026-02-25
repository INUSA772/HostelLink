import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

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
    --white: #ffffff;
    --gray: #6b7280;
    --light-gray: #e5e7eb;
    --gray-lighter: #f4f6fb;
  }

  /* Lock entire page — zero scroll */
  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
    font-family: 'Manrope', sans-serif;
  }

  /* TOPBAR - EXACT same as all other pages */
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

  /* MAIN CONTENT - Scrollable area below topbar */
  .rp-main-content {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    background: var(--gray-lighter);
  }

  /* 404 Container */
  .rp-404-container {
    min-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
  }

  /* 404 Content */
  .rp-404-content {
    max-width: 500px;
  }

  .rp-404-number {
    font-size: 8rem;
    font-weight: 800;
    color: var(--orange);
    margin-bottom: 1rem;
    line-height: 1;
    text-shadow: 4px 4px 0 rgba(232, 80, 26, 0.15);
  }

  .rp-404-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--navy);
    margin-bottom: 1rem;
  }

  .rp-404-text {
    color: var(--gray);
    font-size: 1rem;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  /* Button - EXACT same style as other pages */
  .rp-404-btn {
    background: var(--orange);
    color: var(--white);
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    font-family: 'Manrope', sans-serif;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(232, 80, 26, 0.25);
  }
  .rp-404-btn:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(232, 80, 26, 0.3);
  }
  .rp-404-btn svg {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    .rp-bar { padding: 0 1rem; }
    .rp-bar-brand { display: none; }
    .rp-404-number { font-size: 6rem; }
    .rp-404-title { font-size: 1.5rem; }
  }
`;

const NotFound = () => {
  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      {/* TOPBAR - EXACT same as all other pages */}
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

      {/* MAIN CONTENT - Scrollable area */}
      <div className="rp-main-content">
        <div className="rp-404-container">
          <div className="rp-404-content">
            <div className="rp-404-number">
              404
            </div>
            
            <h2 className="rp-404-title">
              Page Not Found
            </h2>
            
            <p className="rp-404-text">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <Link to="/" style={{ textDecoration: 'none' }}>
              <button className="rp-404-btn">
                <FaHome />
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;