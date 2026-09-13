import React from 'react';
import { Link } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:        #0f1923;
    --navy-mid:    #1a2e3d;
    --amber:       #f5a623;
    --amber-light: #fef3d8;
    --amber-dark:  #d4870a;
    --white:       #fff;
    --off-white:   #f7f8fa;
    --border:      #e8eaed;
    --text-dark:   #111827;
    --text-mid:    #6b7280;
    --font:        'Plus Jakarta Sans', sans-serif;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
    font-family: var(--font);
  }

  /* ── NAV — identical to RegisterForm / LoginForm ── */
  .rp-bar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 500;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    background: var(--navy);
    box-shadow: 0 2px 16px rgba(0,0,0,.25);
  }
  .rp-bar-logo {
    display: flex; align-items: center; gap: 10px; text-decoration: none;
  }
  .rp-bar-logo-img {
    width: 36px; height: 36px; border-radius: 9px; overflow: hidden;
    background: white;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .rp-bar-logo-img img { width: 100%; height: 100%; object-fit: cover; }
  .rp-bar-brand strong {
    display: block; font-size: .92rem; font-weight: 800;
    color: #fff; letter-spacing: -.2px;
  }
  .rp-bar-brand span {
    font-size: .56rem; color: rgba(255,255,255,.45); letter-spacing: .6px;
  }
  .rp-bar-actions { display: flex; align-items: center; gap: .6rem; }
  .rp-bar-login {
    color: rgba(255,255,255,.8); font-size: .8rem; font-weight: 700;
    border: 1.5px solid rgba(255,255,255,.2); padding: .32rem .9rem;
    border-radius: 8px; cursor: pointer; text-decoration: none;
    transition: all .18s; font-family: var(--font);
    display: flex; align-items: center; gap: 5px;
  }
  .rp-bar-login:hover { border-color: var(--amber); color: var(--amber); }
  .rp-bar-signup {
    color: #fff; font-size: .8rem; font-weight: 700;
    background: var(--amber); border: none; padding: .32rem .9rem;
    border-radius: 8px; cursor: pointer; text-decoration: none;
    transition: opacity .18s; font-family: var(--font);
    display: flex; align-items: center; gap: 5px;
  }
  .rp-bar-signup:hover { opacity: .88; }

  /* ── MAIN — scrollable area below nav ── */
  .rp-main-content {
    position: fixed;
    top: 60px; left: 0; right: 0; bottom: 0;
    overflow-y: auto;
    background-image: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80');
    background-size: cover;
    background-position: center;
  }
  .rp-main-content::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(15,25,35,.90) 0%, rgba(26,46,61,.85) 100%);
    pointer-events: none;
  }

  /* ── 404 CARD ── */
  .rp-404-container {
    position: relative; z-index: 2;
    min-height: 100%;
    display: flex; align-items: center; justify-content: center;
    padding: 2rem;
  }
  .rp-404-card {
    background: #fff; border-radius: 18px;
    box-shadow: 0 28px 70px rgba(0,0,0,.28);
    padding: 3rem 2.5rem 2.5rem;
    width: 460px; max-width: 100%;
    text-align: center;
  }

  /* ── 404 NUMBER ── */
  .rp-404-number {
    font-size: 7rem; font-weight: 900; line-height: 1;
    color: var(--navy); margin-bottom: .5rem;
    letter-spacing: -4px;
    position: relative; display: inline-block;
  }
  .rp-404-number::after {
    content: '';
    display: block; width: 48px; height: 4px;
    background: var(--amber); border-radius: 2px;
    margin: .6rem auto 0;
  }

  /* ── TEXT ── */
  .rp-404-title {
    font-size: 1.5rem; font-weight: 800;
    color: var(--text-dark); margin: 1.2rem 0 .6rem;
    letter-spacing: -.3px;
  }
  .rp-404-text {
    color: var(--text-mid); font-size: .9rem;
    line-height: 1.7; margin-bottom: 2rem;
    max-width: 320px; margin-left: auto; margin-right: auto;
  }

  /* ── BUTTONS ── */
  .rp-404-btns {
    display: flex; gap: .75rem; justify-content: center; flex-wrap: wrap;
  }
  .rp-404-btn-primary {
    background: var(--navy); color: #fff; border: none;
    padding: .72rem 1.6rem; border-radius: 9px;
    font-size: .88rem; font-weight: 700; font-family: var(--font);
    display: inline-flex; align-items: center; gap: .45rem;
    cursor: pointer; text-decoration: none;
    transition: background .2s, transform .15s, box-shadow .2s;
    box-shadow: 0 4px 16px rgba(15,25,35,.28);
  }
  .rp-404-btn-primary:hover {
    background: var(--navy-mid);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(15,25,35,.35);
  }
  .rp-404-btn-ghost {
    background: var(--amber-light); color: var(--amber-dark);
    border: 1.5px solid #f0d89a;
    padding: .72rem 1.6rem; border-radius: 9px;
    font-size: .88rem; font-weight: 700; font-family: var(--font);
    display: inline-flex; align-items: center; gap: .45rem;
    cursor: pointer; text-decoration: none;
    transition: all .2s;
  }
  .rp-404-btn-ghost:hover {
    background: var(--amber); color: #fff; border-color: var(--amber);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    .rp-bar { padding: 0 1rem; }
    .rp-404-number { font-size: 5.5rem; }
    .rp-404-title  { font-size: 1.25rem; }
    .rp-404-card   { padding: 2.5rem 1.5rem 2rem; }
  }
  @media (max-width: 480px) {
    .rp-404-btns { flex-direction: column; align-items: stretch; }
    .rp-404-btn-primary,
    .rp-404-btn-ghost { justify-content: center; }
  }
`;

const NotFound = () => {
  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      {/* NAV */}
      <nav className="rp-bar">
        <Link to="/" className="rp-bar-logo">
          <div className="rp-bar-logo-img">
            <img src="/PEZ.png" alt="PezaNyumba" />
          </div>
          <div className="rp-bar-brand">
            <strong>PezaNyumba</strong>
          </div>
        </Link>
        <div className="rp-bar-actions">
          <Link to="/login"    className="rp-bar-login">
            <i className="fa fa-sign-in-alt" /> Login
          </Link>
          <Link to="/register" className="rp-bar-signup">
            <i className="fa fa-user-plus" /> Register
          </Link>
        </div>
      </nav>

      {/* MAIN */}
      <div className="rp-main-content">
        <div className="rp-404-container">
          <div className="rp-404-card">

            <div className="rp-404-number">404</div>

            <h2 className="rp-404-title">Page Not Found</h2>

            <p className="rp-404-text">
              The page you're looking for doesn't exist or may have been moved.
              Let's get you back on track.
            </p>

            <div className="rp-404-btns">
              <Link to="/" className="rp-404-btn-primary">
                <i className="fa fa-home" /> Back to Home
              </Link>
              <Link to="/properties" className="rp-404-btn-ghost">
                <i className="fa fa-search" /> Browse Properties
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;