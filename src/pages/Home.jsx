import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0a1628;
    --navy2: #0f2044;
    --blue: #1a3fa4;
    --orange: #e8501a;
    --orange-light: #ff6b35;
    --orange-pale: #fff4f0;
    --white: #ffffff;
    --gray-bg: #f5f6fa;
    --gray-light: #e8eaf0;
    --text-dark: #0a1628;
    --text-mid: #4b5670;
    --text-light: #8892a4;
    --card-radius: 16px;
    --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  html { scroll-behavior: smooth; }
  body {
    font-family: 'DM Sans', sans-serif;
    color: var(--text-dark);
    background: #fff;
    overflow-x: hidden;
  }
  a { text-decoration: none; color: inherit; }
  button { font-family: 'DM Sans', sans-serif; }

  /* ── NAVBAR ── */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2.5rem; height: 70px;
    background: rgba(10,22,40,0.97);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .logo {
    display: flex; align-items: center; gap: 12px;
    color: white; cursor: pointer;
    background: none; border: none; padding: 0;
  }
  .logo-icon {
    width: 40px; height: 40px; border-radius: 12px;
    overflow: hidden; flex-shrink: 0;
    box-shadow: 0 0 0 2px rgba(232,80,26,0.4);
  }
  .logo-icon img { width: 100%; height: 100%; object-fit: cover; }
  .logo-text strong {
    display: block; font-family: 'Syne', sans-serif;
    font-size: 1.05rem; font-weight: 800;
    letter-spacing: 1.5px; color: white;
  }
  .logo-text span { font-size: 0.62rem; opacity: 0.5; letter-spacing: 0.8px; color: white; }

  .nav-actions { display: flex; align-items: center; gap: 0.6rem; }
  .nav-login {
    color: rgba(255,255,255,0.75); font-size: 0.875rem; font-weight: 500;
    display: flex; align-items: center; gap: 6px;
    padding: 0.45rem 1rem; border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.18); transition: var(--transition);
  }
  .nav-login:hover { border-color: rgba(255,255,255,0.5); color: white; background: rgba(255,255,255,0.06); }
  .nav-signup {
    background: var(--orange); color: white; border: none; cursor: pointer;
    padding: 0.5rem 1.1rem; border-radius: 8px; font-size: 0.875rem; font-weight: 600;
    display: flex; align-items: center; gap: 6px; transition: var(--transition);
    text-decoration: none;
    box-shadow: 0 4px 14px rgba(232,80,26,0.35);
  }
  .nav-signup:hover { background: var(--orange-light); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(232,80,26,0.4); }

  @media (max-width: 480px) {
    nav { padding: 0 1rem; }
    .logo-text span { display: none; }
    .nav-login-text { display: none; }
  }

  /* ── HERO ── */
  .hero {
    position: relative; min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 7rem 1.5rem 5rem; text-align: center; overflow: hidden;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background: linear-gradient(150deg, #070f24 0%, #0f2044 45%, #0a1e52 100%);
  }
  .hero-bg-img {
    position: absolute; inset: 0;
    background: url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1600&auto=format&fit=crop') center/cover no-repeat;
    opacity: 0.12;
  }
  .hero-bg-orb1 {
    position: absolute; width: 600px; height: 600px;
    border-radius: 50%; top: -150px; right: -150px;
    background: radial-gradient(circle, rgba(232,80,26,0.15) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-bg-orb2 {
    position: absolute; width: 400px; height: 400px;
    border-radius: 50%; bottom: -100px; left: -100px;
    background: radial-gradient(circle, rgba(26,63,164,0.2) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-content { position: relative; z-index: 2; max-width: 700px; width: 100%; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(232,80,26,0.15); border: 1px solid rgba(232,80,26,0.3);
    color: #ff8c65; border-radius: 100px; padding: 6px 16px;
    font-size: 0.78rem; font-weight: 600; letter-spacing: 0.5px;
    margin-bottom: 1.5rem;
  }
  .hero-badge span { width: 6px; height: 6px; border-radius: 50%; background: var(--orange); display: inline-block; }
  .hero-content h1 {
    color: white; font-family: 'Syne', sans-serif;
    font-size: clamp(2.2rem, 5.5vw, 3.8rem); font-weight: 800;
    line-height: 1.12; margin-bottom: 1.25rem; letter-spacing: -0.5px;
  }
  .hero-content h1 .accent { color: var(--orange); }
  .hero-content p {
    color: rgba(255,255,255,0.68); font-size: clamp(1rem, 2vw, 1.1rem);
    margin-bottom: 2.5rem; line-height: 1.75; font-weight: 400;
    max-width: 560px; margin-left: auto; margin-right: auto;
  }
  .hero-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 3.5rem; }
  .hero-btn-primary {
    background: var(--orange); color: white; border: none; cursor: pointer;
    padding: 0.9rem 2rem; border-radius: 12px; font-size: 0.95rem; font-weight: 700;
    display: inline-flex; align-items: center; gap: 8px; transition: var(--transition);
    text-decoration: none; box-shadow: 0 6px 20px rgba(232,80,26,0.4);
  }
  .hero-btn-primary:hover { background: var(--orange-light); transform: translateY(-2px); box-shadow: 0 10px 28px rgba(232,80,26,0.45); }
  .hero-btn-ghost {
    background: rgba(255,255,255,0.08); color: white;
    border: 1px solid rgba(255,255,255,0.25); cursor: pointer;
    padding: 0.9rem 2rem; border-radius: 12px; font-size: 0.95rem; font-weight: 600;
    display: inline-flex; align-items: center; gap: 8px; transition: var(--transition);
    text-decoration: none; backdrop-filter: blur(4px);
  }
  .hero-btn-ghost:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.5); transform: translateY(-2px); }

  .hero-stats {
    display: flex; justify-content: center; gap: 0; flex-wrap: wrap;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px; overflow: hidden;
    background: rgba(255,255,255,0.04); backdrop-filter: blur(8px);
    max-width: 480px; margin: 0 auto;
  }
  .hero-stat {
    flex: 1; min-width: 100px; padding: 1.25rem 1rem; text-align: center;
    border-right: 1px solid rgba(255,255,255,0.1);
  }
  .hero-stat:last-child { border-right: none; }
  .hero-stat strong { display: block; font-family: 'Syne', sans-serif; font-size: 1.6rem; font-weight: 800; color: var(--orange); line-height: 1; }
  .hero-stat span { font-size: 0.75rem; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 4px; display: block; }

  /* ── EXPLORE SECTION ── */
  .explore-section { background: var(--navy); padding: 6rem 1.5rem; }
  .section-header { text-align: center; margin-bottom: 3rem; }
  .section-label {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;
    color: var(--orange); margin-bottom: 0.75rem;
  }
  .section-label::before, .section-label::after {
    content: ''; display: block; width: 24px; height: 1px; background: var(--orange); opacity: 0.5;
  }
  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.7rem, 3.5vw, 2.4rem); font-weight: 800;
    color: var(--navy); line-height: 1.2; letter-spacing: -0.3px;
  }
  .section-title.light { color: white; }
  .section-title em { font-style: normal; color: var(--orange); }

  .types-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
    gap: 1rem; max-width: 1200px; margin: 0 auto;
  }
  .type-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: var(--card-radius);
    padding: 1.75rem 1rem 1.5rem; text-align: center;
    cursor: pointer; transition: var(--transition); color: white;
    width: 100%; position: relative; overflow: hidden;
  }
  .type-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--orange) 0%, var(--orange-light) 100%);
    opacity: 0; transition: var(--transition);
  }
  .type-card:hover::before { opacity: 1; }
  .type-card:hover { border-color: var(--orange); transform: translateY(-4px); box-shadow: 0 16px 40px rgba(232,80,26,0.3); }
  .type-card > * { position: relative; z-index: 1; }
  .type-card i { font-size: 1.6rem; margin-bottom: 0.75rem; display: block; color: var(--orange); transition: color 0.25s; }
  .type-card:hover i { color: white; }
  .type-card h4 { font-size: 0.92rem; font-weight: 700; color: white; margin-bottom: 0.5rem; }
  .area-count {
    display: inline-block; font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.7);
    background: rgba(255,255,255,0.1); border-radius: 100px; padding: 3px 10px;
    transition: var(--transition);
  }
  .type-card:hover .area-count { background: rgba(255,255,255,0.2); color: white; }

  .type-card-skeleton {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
    border-radius: var(--card-radius); padding: 1.75rem 1rem;
    animation: pulse 1.6s ease-in-out infinite;
  }
  .skeleton-circle { width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.08); margin: 0 auto 0.75rem; }
  .skeleton-line { height: 10px; border-radius: 6px; background: rgba(255,255,255,0.08); margin: 0 auto 0.5rem; }
  .skeleton-line.short { width: 65%; }
  .skeleton-line.shorter { width: 42%; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }

  /* ── LOCATIONS ── */
  .locations-section { background: #070f24; padding: 6rem 1.5rem; }
  .locations-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: 210px 210px;
    gap: 1rem; max-width: 1100px; margin: 2.5rem auto 0;
  }
  .loc-card {
    border-radius: var(--card-radius); overflow: hidden;
    position: relative; cursor: pointer; border: none;
    background: transparent; padding: 0; display: block;
  }
  .loc-card img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
  .loc-card:hover img { transform: scale(1.07); }
  .loc-card.big { grid-row: 1 / 3; }
  .loc-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(7,15,36,0.9) 0%, rgba(7,15,36,0.2) 50%, transparent 100%);
    display: flex; flex-direction: column; justify-content: flex-end; padding: 1.25rem;
    transition: var(--transition);
  }
  .loc-card:hover .loc-overlay { background: linear-gradient(to top, rgba(232,80,26,0.7) 0%, rgba(7,15,36,0.2) 60%, transparent 100%); }
  .loc-count {
    display: inline-block; font-size: 0.7rem; font-weight: 700;
    color: var(--orange); background: rgba(232,80,26,0.15);
    border: 1px solid rgba(232,80,26,0.3); border-radius: 100px;
    padding: 3px 10px; margin-bottom: 0.4rem; width: fit-content;
    transition: var(--transition);
  }
  .loc-card:hover .loc-count { background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.3); color: white; }
  .loc-overlay h4 { color: white; font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 700; }
  .loc-overlay p { color: rgba(255,255,255,0.65); font-size: 0.78rem; margin-top: 2px; }

  /* ── DUAL ── */
  .dual-section { padding: 6rem 1.5rem; background: var(--gray-bg); }
  .dual-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem; max-width: 960px; margin: 0 auto;
  }
  .dual-card {
    background: white; padding: 2.5rem; border-radius: var(--card-radius);
    text-align: center; border: 1px solid var(--gray-light);
    box-shadow: 0 4px 20px rgba(0,0,0,0.05); transition: var(--transition);
    position: relative; overflow: hidden;
  }
  .dual-card::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--orange), var(--orange-light));
    transform: scaleX(0); transform-origin: left; transition: var(--transition);
  }
  .dual-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
  .dual-card:hover::after { transform: scaleX(1); }
  .dual-icon {
    width: 64px; height: 64px; border-radius: 18px; margin: 0 auto 1.25rem;
    display: flex; align-items: center; justify-content: center; font-size: 1.6rem;
  }
  .dual-icon.student { background: rgba(26,63,164,0.1); color: var(--blue); }
  .dual-icon.owner { background: rgba(5,150,105,0.1); color: #059669; }
  .dual-card h3 { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 800; color: var(--navy); margin-bottom: 0.75rem; }
  .dual-card p { color: var(--text-mid); font-size: 0.9rem; line-height: 1.75; margin-bottom: 1.75rem; }
  .btn-outline {
    border: 2px solid var(--navy); color: var(--navy); background: transparent;
    padding: 0.6rem 1.5rem; border-radius: 9px; font-size: 0.875rem; font-weight: 700;
    cursor: pointer; transition: var(--transition); text-decoration: none; display: inline-block;
  }
  .btn-outline:hover { background: var(--navy); color: white; }

  /* ── FEATURES ── */
  .features-section { padding: 6rem 1.5rem; background: white; }
  .features-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.25rem; max-width: 1100px; margin: 3rem auto 0;
  }
  .feature-card {
    background: var(--gray-bg); padding: 2rem 1.75rem;
    border-radius: var(--card-radius); border: 1px solid var(--gray-light);
    transition: var(--transition);
  }
  .feature-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,0.08); background: white; }
  .feature-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(232,80,26,0.1); color: var(--orange);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; margin-bottom: 1.25rem;
  }
  .feature-card h4 { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: var(--navy); margin-bottom: 0.5rem; }
  .feature-card p { font-size: 0.875rem; color: var(--text-mid); line-height: 1.7; }

  /* ── CTA ── */
  .cta-section {
    background: linear-gradient(135deg, var(--navy) 0%, #0f2044 50%, #1a3fa4 100%);
    color: white; text-align: center; padding: 6rem 1.5rem; position: relative; overflow: hidden;
  }
  .cta-section::before {
    content: ''; position: absolute; top: -200px; right: -200px;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(232,80,26,0.15) 0%, transparent 70%);
  }
  .cta-section > * { position: relative; z-index: 1; }
  .cta-section h2 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 800;
    margin-bottom: 0.75rem; color: white; line-height: 1.2;
  }
  .cta-section p {
    opacity: 0.7; margin-bottom: 2.25rem; font-size: 1rem; color: white;
    max-width: 500px; margin-left: auto; margin-right: auto;
  }
  .btn-primary {
    background: var(--orange); color: white; border: none; cursor: pointer;
    padding: 0.9rem 2.2rem; border-radius: 12px; font-size: 0.95rem; font-weight: 700;
    display: inline-flex; align-items: center; gap: 8px; transition: var(--transition);
    text-decoration: none; box-shadow: 0 6px 20px rgba(232,80,26,0.4);
  }
  .btn-primary:hover { background: var(--orange-light); transform: translateY(-2px); box-shadow: 0 10px 28px rgba(232,80,26,0.5); }

  /* ── FOOTER ── */
  footer {
    background: #060d1e; color: rgba(255,255,255,0.45);
    padding: 4rem 1.5rem 2rem;
    border-top: 1px solid rgba(255,255,255,0.05);
  }
  .footer-inner { max-width: 1100px; margin: 0 auto; }
  .footer-grid {
    display: grid; grid-template-columns: 2.2fr 1fr 1fr 1fr;
    gap: 2.5rem; margin-bottom: 3rem;
  }
  .footer-brand-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; }
  .footer-brand-logo .fb-icon {
    width: 36px; height: 36px; border-radius: 10px; overflow: hidden; flex-shrink: 0;
    box-shadow: 0 0 0 2px rgba(232,80,26,0.3);
  }
  .footer-brand-logo .fb-icon img { width: 100%; height: 100%; object-fit: cover; }
  .footer-brand-logo strong {
    font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 800;
    letter-spacing: 1px; color: white;
  }
  .footer-brand p { font-size: 0.83rem; line-height: 1.75; color: rgba(255,255,255,0.38); max-width: 260px; margin-bottom: 1.25rem; }
  .footer-social { display: flex; gap: 0.5rem; }
  .footer-social a {
    width: 34px; height: 34px; border-radius: 8px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,0.5); font-size: 0.82rem; transition: var(--transition);
  }
  .footer-social a:hover { background: var(--orange); border-color: var(--orange); color: white; }
  .footer-col h5 {
    color: rgba(255,255,255,0.8); font-family: 'Syne', sans-serif;
    font-size: 0.82rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1px; margin-bottom: 1.1rem;
  }
  .footer-col a {
    display: block; color: rgba(255,255,255,0.38); font-size: 0.83rem;
    margin-bottom: 0.6rem; transition: var(--transition);
  }
  .footer-col a:hover { color: var(--orange); padding-left: 4px; }
  .footer-divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin-bottom: 1.5rem; }
  .footer-bottom {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 0.75rem;
    font-size: 0.78rem; color: rgba(255,255,255,0.25);
  }
  .footer-bottom-links { display: flex; gap: 1.5rem; }
  .footer-bottom-links a { color: rgba(255,255,255,0.25); font-size: 0.78rem; transition: var(--transition); }
  .footer-bottom-links a:hover { color: var(--orange); }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .footer-grid { grid-template-columns: 1fr 1fr; }
    .footer-brand { grid-column: 1 / -1; }
    .footer-brand p { max-width: 100%; }
    .locations-grid { grid-template-columns: 1fr 1fr; grid-template-rows: auto; }
    .loc-card.big { grid-row: auto; }
  }
  @media (max-width: 600px) {
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .hero-btns { flex-direction: column; align-items: center; }
    .hero-btn-primary, .hero-btn-ghost { width: 100%; max-width: 300px; justify-content: center; }
    .types-grid { grid-template-columns: repeat(2, 1fr); }
    .locations-grid { grid-template-columns: 1fr; }
    .footer-bottom { flex-direction: column; text-align: center; }
    .footer-bottom-links { justify-content: center; }
  }
  @media (max-width: 400px) {
    .footer-grid { grid-template-columns: 1fr; }
  }
`;

const AREA_DEFINITIONS = [
  { icon: "fa fa-bed",            label: "Chitawira"  },
  { icon: "fa fa-home",           label: "Nkolokosa"  },
  { icon: "fa fa-building",       label: "Chichiri"   },
  { icon: "fa fa-users",          label: "Mandala"    },
  { icon: "fa fa-star",           label: "Queens"     },
  { icon: "fa fa-map-marker-alt", label: "Manja"      },
  { icon: "fa fa-city",           label: "Mjamba"     },
  { icon: "fa fa-flag",           label: "Kamba"      },
  { icon: "fa fa-map",            label: "Chinyonga"  },
];

function Navbar({ isAuthenticated }) {
  const navigate = useNavigate();
  return (
    <nav>
      <button onClick={() => navigate('/')} className="logo">
        <div className="logo-icon"><img src="/logo2.png" alt="HostelLink" /></div>
        <div className="logo-text">
          <strong>PEZAHOSTEL</strong>
          <span>OFF-CAMPUS ACCOMMODATION</span>
        </div>
      </button>
      <div className="nav-actions">
        {isAuthenticated ? (
          <>
            <a href="/profile" className="nav-login">
              <i className="fa fa-user" />
              <span className="nav-login-text">Profile</span>
            </a>
            <a href="/hostels" className="nav-signup">
              <i className="fa fa-th-large" />
              <span>Browse</span>
            </a>
          </>
        ) : (
          <>
            <a href="/login" className="nav-login">
              <i className="fa fa-sign-in-alt" />
              <span className="nav-login-text">Login</span>
            </a>
            <a href="/register" className="nav-signup">
              <i className="fa fa-user-plus" />
              <span>Sign Up</span>
            </a>
          </>
        )}
      </div>
    </nav>
  );
}

function Hero({ isAuthenticated }) {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-bg-img" />
      <div className="hero-bg-orb1" />
      <div className="hero-bg-orb2" />
      <div className="hero-content">
        <div className="hero-badge">
          <span /> MUBAS Off-Campus Network
        </div>
        <h1>
          Find Safe & Affordable<br />
          <span className="accent">Hostels Near MUBAS.</span>
        </h1>
        <p>
          The smartest way for students to discover accommodation and for hostel owners
          to connect with verified tenants — all in one place.
        </p>
        <div className="hero-btns">
          <a href="/register" className="hero-btn-primary">
            <i className="fa fa-search" /> Find a Hostel
          </a>
          <a href="/register" className="hero-btn-ghost">
            <i className="fa fa-building" /> List Your Hostel
          </a>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <strong>200+</strong>
            <span>Students Housed</span>
          </div>
          <div className="hero-stat">
            <strong>50+</strong>
            <span>Listed Hostels</span>
          </div>
          <div className="hero-stat">
            <strong>9</strong>
            <span>Areas Covered</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExploreSection({ isAuthenticated }) {
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAreaCounts = async () => {
      try {
        const res = await fetch(`${API_URL}/hostels?limit=500`);
        const data = await res.json();
        if (data.success && Array.isArray(data.hostels)) {
          const counts = {};
          data.hostels.forEach(hostel => {
            const addr = (hostel.address || "").toLowerCase();
            AREA_DEFINITIONS.forEach(area => {
              if (addr.includes(area.label.toLowerCase())) {
                counts[area.label] = (counts[area.label] || 0) + 1;
              }
            });
          });
          setAreas(AREA_DEFINITIONS.map(area => ({ ...area, count: counts[area.label] || 0 })));
        } else {
          setAreas(AREA_DEFINITIONS.map(a => ({ ...a, count: 0 })));
        }
      } catch {
        setAreas(AREA_DEFINITIONS.map(a => ({ ...a, count: 0 })));
      } finally {
        setLoading(false);
      }
    };
    fetchAreaCounts();
  }, []);

  const handleClick = (label) =>
    navigate(isAuthenticated ? `/hostels?search=${encodeURIComponent(label)}` : '/login');

  return (
    <section className="explore-section">
      <div className="section-header">
        <div className="section-label">Hostel By Location</div>
        <h2 className="section-title light">Explore Hostel <em>Areas</em></h2>
      </div>
      <div className="types-grid">
        {loading
          ? AREA_DEFINITIONS.map((_, i) => (
              <div key={i} className="type-card-skeleton">
                <div className="skeleton-circle" />
                <div className="skeleton-line short" />
                <div className="skeleton-line shorter" />
              </div>
            ))
          : areas.map(t => (
              <button key={t.label} className="type-card" onClick={() => handleClick(t.label)}>
                <i className={t.icon} />
                <h4>{t.label}</h4>
                <span className="area-count">
                  {t.count > 0 ? `${t.count} Hostel${t.count !== 1 ? 's' : ''}` : 'View Hostels'}
                </span>
              </button>
            ))
        }
      </div>
    </section>
  );
}

function LocationsSection({ isAuthenticated }) {
  const navigate = useNavigate();
  const handleClick = () => navigate(isAuthenticated ? '/hostels' : '/login');
  const locations = [
    { img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop", big: true, count: "7 Hostels", name: "Chitawira", desc: "Closest to Campus" },
    { img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&auto=format&fit=crop", count: "5 Hostels", name: "Ndirande", desc: "Affordable Options" },
    { img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop", count: "4 Hostels", name: "Mandala", desc: "Premium Listings" },
    { img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop", count: "3 Hostels", name: "Near Queens", desc: "Budget Friendly" },
    { img: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&auto=format&fit=crop", count: "6 Hostels", name: "Zingwangwa", desc: "Popular Student Area" },
  ];
  return (
    <section className="locations-section">
      <div className="section-header">
        <div className="section-label">Our Property Areas</div>
        <h2 className="section-title light">Top Locations Near <em>MUBAS</em></h2>
      </div>
      <div className="locations-grid">
        {locations.map(loc => (
          <button key={loc.name} className={`loc-card${loc.big ? ' big' : ''}`} onClick={handleClick}>
            <img src={loc.img} alt={loc.name} />
            <div className="loc-overlay">
              <span className="loc-count">{loc.count}</span>
              <h4>{loc.name}</h4>
              <p>{loc.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function DualSection() {
  return (
    <section className="dual-section">
      <div className="section-header">
        <div className="section-label">Who It's For</div>
        <h2 className="section-title">Built for <em>Everyone</em></h2>
      </div>
      <div className="dual-grid">
        <div className="dual-card">
          <div className="dual-icon student"><i className="fa fa-user-graduate" /></div>
          <h3>For Students</h3>
          <p>Search verified hostels, compare prices, view photos, and contact owners directly — all in one place.</p>
          <a href="/register" className="btn-outline">Find a Hostel</a>
        </div>
        <div className="dual-card">
          <div className="dual-icon owner"><i className="fa fa-building" /></div>
          <h3>For Hostel Owners</h3>
          <p>List your property, receive booking requests, and manage payments securely from one dashboard.</p>
          <a href="/register" className="btn-outline">Start Listing</a>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: "fa fa-search",          title: "Smart Search",         desc: "Filter by price, location, amenities and availability in seconds." },
    { icon: "fa fa-comments",        title: "Direct Communication", desc: "Students connect directly with hostel owners for faster responses." },
    { icon: "fa fa-shield-alt",      title: "Verified Listings",    desc: "We verify owners to ensure trust and safety for all students." },
    { icon: "fa fa-money-bill-wave", title: "Secure Payments",      desc: "Safe deposit system with Airtel Money & TNM Mpamba integration." },
  ];
  return (
    <section className="features-section">
      <div className="section-header">
        <div className="section-label">Why Us</div>
        <h2 className="section-title">Why Choose <em>Our Platform?</em></h2>
      </div>
      <div className="features-grid">
        {features.map(f => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon"><i className={f.icon} /></div>
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-logo">
              <div className="fb-icon"><img src="/logo2.png" alt="HostelLink" /></div>
              <strong>PEZAHOSTEL</strong>
            </div>
            <p>The smartest way for MUBAS students to find off-campus accommodation and for owners to connect with verified tenants.</p>
            <div className="footer-social">
              <a href="#"><i className="fab fa-facebook-f" /></a>
              <a href="#"><i className="fab fa-twitter" /></a>
              <a href="#"><i className="fab fa-whatsapp" /></a>
              <a href="#"><i className="fab fa-instagram" /></a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Quick Links</h5>
            <a href="/register">Find a Hostel</a>
            <a href="/register">List Your Hostel</a>
            <a href="/login">Login</a>
            <a href="/register">Sign Up</a>
          </div>
          <div className="footer-col">
            <h5>Areas</h5>
            <a href="/register">Chitawira</a>
            <a href="/register">Chichiri</a>
            <a href="/register">Mandala</a>
            <a href="/register">Queens</a>
            <a href="/register">Nkolokosa</a>
          </div>
          <div className="footer-col">
            <h5>Support</h5>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
          </div>
        </div>
        <hr className="footer-divider" />
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} PezaHostel · Built for MUBAS Students</span>
          <div className="footer-bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <Navbar isAuthenticated={isAuthenticated} user={user} />
      <Hero isAuthenticated={isAuthenticated} />
      <ExploreSection isAuthenticated={isAuthenticated} />
      <LocationsSection isAuthenticated={isAuthenticated} />
      <DualSection />
      <FeaturesSection />
      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join the growing MUBAS accommodation network today and find your perfect hostel.</p>
        <a href="/register" className="btn-primary">
          <i className="fa fa-user-plus" /> Create Free Account
        </a>
      </section>
      <Footer />
    </>
  );
}