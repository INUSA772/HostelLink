import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,300;0,400;0,500;1,100;1,300;1,400;1,500&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

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

  body { font-family: 'Manrope', sans-serif; color: var(--text-dark); background: #fff; overflow: auto !important;}
  a { text-decoration: none; color: inherit; }

  /* ── NAVBAR ── */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2.5rem; height: 68px;
    background: rgba(13,27,62,0.96); backdrop-filter: blur(8px);
  }
  .logo {
    display: flex; align-items: center; gap: 10px; color: white;
    cursor: pointer; background: none; border: none; padding: 0;
  }
  .logo-icon { width: 38px; height: 38px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
  .logo-icon img { width: 100%; height: 100%; object-fit: cover; }
  .logo-text strong { display: block; font-size: 1rem; font-weight: 800; letter-spacing: 1px; color: white; }
  .logo-text span { font-size: 0.65rem; opacity: 0.7; letter-spacing: 0.5px; color: white; }

  /* ── NAVBAR CENTER TEXT (FANCY LOGO STYLE) ── */
  .nav-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 1.8rem;
    align-items: center;
  }

  .nav-center-item {
    color: rgba(255,255,255,0.8);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    transition: all 0.3s ease;
    cursor: pointer;
    font-family: 'Manrope', sans-serif;
    position: relative;
  }

  .nav-center-item::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 0%;
    height: 1.5px;
    background: var(--orange);
    transition: width 0.3s ease;
  }

  .nav-center-item:hover::after { width: 100%; }
  .nav-center-item:hover { color: white; }

  /* Fancy primary nav item — logo-style */
  .nav-center-item.fancy {
    font-family: 'Righteous', cursive;
    font-size: 1.05rem;
    font-weight: 400;
    letter-spacing: 3px;
    background: linear-gradient(90deg, #00e5ff 0%, #ffffff 40%, #e8501a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: none;
    background-size: 200% auto;
    animation: logoShine 4s linear infinite;
    position: relative;
  }

  .nav-center-item.fancy::before {
    content: '⬡';
    font-size: 0.6rem;
    margin-right: 5px;
    -webkit-text-fill-color: #00e5ff;
    animation: spinHex 6s linear infinite;
    display: inline-block;
  }

  .nav-center-item.fancy::after { display: none; }

  @keyframes logoShine {
    0% { background-position: 0% center; }
    100% { background-position: 200% center; }
  }

  @keyframes spinHex {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Dot separator */
  .nav-center-dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(255,255,255,0.3);
  }

  .nav-actions { display: flex; align-items: center; gap: 0.75rem; }

  .nav-login {
    color: rgba(255,255,255,0.85); font-size: 0.88rem; font-weight: 600;
    text-decoration: none; display: flex; align-items: center; gap: 5px;
    padding: 0.4rem 0.9rem; border-radius: 6px;
    border: 1.5px solid rgba(255,255,255,0.25); transition: all 0.2s;
    white-space: nowrap;
  }
  .nav-login:hover { border-color: rgba(255,255,255,0.6); color: white; }

  .nav-signup {
    background: var(--orange); color: white; border: none; cursor: pointer;
    padding: 0.45rem 1rem; border-radius: 6px; font-size: 0.88rem; font-weight: 700;
    display: flex; align-items: center; gap: 5px; transition: opacity 0.2s;
    text-decoration: none; white-space: nowrap;
  }
  .nav-signup:hover { opacity: 0.88; }

  /* Hide text labels on very small screens, show only icons */
  @media (max-width: 400px) {
    nav { padding: 0 0.8rem; }
    .logo-text { display: none; }
    .nav-login-text { display: none; }
    .nav-signup-text { display: none; }
    .nav-login { padding: 0.4rem 0.6rem; }
    .nav-signup { padding: 0.45rem 0.6rem; }
  }
  @media (max-width: 600px) {
    nav { padding: 0 1rem; }
    .logo-text span { display: none; }
  }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    width: 100vw;
    background-image: url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1400&auto=format&fit=crop');
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;
    text-align: center;
    padding: 0 1rem;
    position: relative;
    overflow: hidden !important;
  }

  .hero-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    width: 100%;
    max-width: 1200px;
    position: relative;
    z-index: 2;
  }

  .hero-left {
    flex: 1;
    min-width: 0;
  }

  /* ── HERO RIGHT — ANIMATED CARDS COLUMN (PayChangu style) ── */
  .hero-right {
    flex: 1;
    min-height: 480px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.2rem;
    overflow: visible;
  }

  /* Two columns of cards */
  .cards-col {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  /* Column 1 scrolls UP continuously */
  .cards-col-up {
    animation: scrollUp 8s linear infinite;
  }

  /* Column 2 scrolls DOWN continuously */
  .cards-col-down {
    animation: scrollDown 10s linear infinite;
    margin-top: 60px; /* offset so they look staggered */
  }

  @keyframes scrollUp {
    0%   { transform: translateY(0); }
    100% { transform: translateY(-50%); }
  }

  @keyframes scrollDown {
    0%   { transform: translateY(-50%); }
    100% { transform: translateY(0); }
  }

  /* Fade mask top & bottom */
  .hero-right-mask {
    position: relative;
    height: 420px;
    overflow: hidden;
    display: flex;
    gap: 1.2rem;
    align-items: flex-start;
  }

  .hero-right-mask::before,
  .hero-right-mask::after {
    content: '';
    position: absolute;
    left: 0; right: 0;
    height: 80px;
    z-index: 3;
    pointer-events: none;
  }

  .hero-right-mask::before {
    top: 0;
    background: linear-gradient(to bottom, rgba(255,255,255,0.9), transparent);
  }

  .hero-right-mask::after {
    bottom: 0;
    background: linear-gradient(to top, rgba(255,255,255,0.9), transparent);
  }

  /* Individual animated card */
  .anim-card {
    width: 170px;
    border-radius: 16px;
    padding: 1.2rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    box-shadow: 0 8px 28px rgba(0,0,0,0.12);
    border: 1px solid rgba(255,255,255,0.5);
    backdrop-filter: blur(6px);
    flex-shrink: 0;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .anim-card:hover {
    transform: scale(1.04);
    box-shadow: 0 14px 40px rgba(0,0,0,0.2);
  }

  .anim-card-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    color: white;
    flex-shrink: 0;
  }

  .anim-card-title {
    font-size: 0.82rem;
    font-weight: 800;
    color: #111827;
    line-height: 1.2;
  }

  .anim-card-sub {
    font-size: 0.72rem;
    color: #6b7280;
    line-height: 1.4;
  }

  /* Card color themes */
  .anim-card.blue   { background: rgba(219,234,254,0.85); }
  .anim-card.orange { background: rgba(255,237,213,0.85); }
  .anim-card.green  { background: rgba(209,250,229,0.85); }
  .anim-card.purple { background: rgba(237,233,254,0.85); }
  .anim-card.red    { background: rgba(254,226,226,0.85); }
  .anim-card.cyan   { background: rgba(207,250,254,0.85); }
  .anim-card.yellow { background: rgba(254,249,195,0.85); }
  .anim-card.pink   { background: rgba(252,231,243,0.85); }

  .anim-card.blue   .anim-card-icon { background: #2563eb; }
  .anim-card.orange .anim-card-icon { background: #e8501a; }
  .anim-card.green  .anim-card-icon { background: #059669; }
  .anim-card.purple .anim-card-icon { background: #7c3aed; }
  .anim-card.red    .anim-card-icon { background: #dc2626; }
  .anim-card.cyan   .anim-card-icon { background: #0891b2; }
  .anim-card.yellow .anim-card-icon { background: #d97706; }
  .anim-card.pink   .anim-card-icon { background: #db2777; }

  .hero h1 {
    color: #021048e6;
    font-size: 3.5rem;
    text-shadow: 0px 0px 10px cyan,
                 0px 0px 20px cyan,
                 0px 0px 40px cyan,
                 0px 0px 80px cyan;
    font-family: 'Poppins', sans-serif;
    margin-bottom: 1.2rem;
    z-index: 2;
  }

  /* ── WAVES ── */
  .wave {
    position: absolute;
    bottom: -.5rem;
    left: 0;
    height: 11rem;
    width: 100%;
    background: url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1400&auto=format&fit=crop');
    background-size: 100rem 11rem;
    animation: waves 8s linear infinite;
    background-repeat: repeat-x;
    opacity: 0.3;
  }
  .wave1 { animation-duration: 8s; opacity: 0.4; }
  .wave2 { animation-direction: reverse; animation-duration: 6s; opacity: 0.3; bottom: -0.3rem; }
  .wave3 { animation-duration: 4s; opacity: 0.5; bottom: 0rem; }
  @keyframes waves {
    0% { background-position-x: 0; }
    100% { background-position-x: 100rem; }
  }

  /* CTA buttons in hero */
  .hero-btns {
    display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
    z-index: 2;
    position: relative;
  }
  .hero-btn-primary {
    background: var(--orange); color: white; border: none; cursor: pointer;
    padding: 0.85rem 2rem; border-radius: 10px; font-size: 1rem; font-weight: 700;
    display: inline-flex; align-items: center; gap: 8px; transition: opacity 0.2s;
    text-decoration: none;
  }
  .hero-btn-primary:hover { opacity: 0.9; }
  .hero-btn-ghost {
    background: rgba(255,255,255,0.12); color: white;
    border: 1.5px solid rgba(255,255,255,0.35); cursor: pointer;
    padding: 0.85rem 2rem; border-radius: 10px; font-size: 1rem; font-weight: 700;
    display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s;
    text-decoration: none;
  }
  .hero-btn-ghost:hover { background: rgba(255,255,255,0.22); border-color: rgba(255,255,255,0.6); }

  /* Hero stats */
  .hero-stats {
    display: flex; justify-content: center; gap: 2.5rem; flex-wrap: wrap;
    margin-top: 3rem; padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.15);
  }
  .hero-stat strong { display: block; font-size: 1.6rem; font-weight: 800; color: #facc15; }
  .hero-stat span { font-size: 0.82rem; color: rgba(255,255,255,0.65); }

  /* ── SECTIONS ── */
  .section-label { font-size: 0.8rem; font-weight: 700; color: var(--orange); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem; text-align: center; }
  .section-title { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; text-align: center; color: var(--navy); }
  .section-title em { font-style: normal; color: var(--orange); }

  /* ── EXPLORE SECTION ── */
  .explore-section { background: var(--navy); padding: 5rem 1.5rem; }
  .explore-section .section-label { color: rgba(255,255,255,0.6); }
  .explore-section .section-title { color: white; }
  .explore-section .section-title em { color: var(--orange); }

  .types-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
    margin-top: 3rem;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  .type-card {
    background: rgba(255,255,255,0.08);
    border: 1.5px solid rgba(255,255,255,0.15);
    border-radius: var(--card-radius);
    padding: 1.8rem 1rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.25s;
    color: white;
    width: 100%;
  }
  .type-card:hover {
    background: var(--orange);
    border-color: var(--orange);
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(232,80,26,0.35);
  }
  .type-card i {
    font-size: 1.7rem;
    margin-bottom: 0.75rem;
    display: block;
    color: var(--orange);
    transition: color 0.25s;
  }
  .type-card:hover i { color: white; }
  .type-card h4 {
    font-size: 1rem;
    font-weight: 800;
    color: #ffffff;
    margin-bottom: 0.5rem;
    text-shadow: 0 1px 4px rgba(0,0,0,0.4);
  }
  .type-card .area-count {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 700;
    color: #fff;
    background: rgba(232,80,26,0.8);
    border-radius: 20px;
    padding: 3px 10px;
  }
  .type-card:hover .area-count { background: rgba(255,255,255,0.25); }

  .type-card-skeleton {
    background: rgba(255,255,255,0.05);
    border: 1.5px solid rgba(255,255,255,0.08);
    border-radius: var(--card-radius); padding: 1.8rem 1rem;
    animation: pulse 1.4s ease-in-out infinite;
  }
  .skeleton-circle { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.1); margin: 0 auto 0.8rem; }
  .skeleton-line { height: 12px; border-radius: 6px; background: rgba(255,255,255,0.1); margin: 0 auto 0.5rem; }
  .skeleton-line.short { width: 70%; }
  .skeleton-line.shorter { width: 45%; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  /* ── LOCATIONS ── */
  .locations-section { background: #0a1630; padding: 5rem 1.5rem; }
  .locations-section .section-title { color: white; }
  .locations-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: 220px 220px;
    gap: 1rem; max-width: 1100px; margin: 2.5rem auto 0;
  }
  .loc-card { border-radius: var(--card-radius); overflow: hidden; position: relative; cursor: pointer; border: none; background: transparent; padding: 0; }
  .loc-card img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s; }
  .loc-card:hover img { transform: scale(1.05); }
  .loc-card.big { grid-row: 1 / 3; }
  .loc-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(13,27,62,0.85) 0%, transparent 60%); display: flex; flex-direction: column; justify-content: flex-end; padding: 1.2rem; }
  .loc-overlay small { color: rgba(255,255,255,0.7); font-size: 0.75rem; }
  .loc-overlay h4 { color: white; font-size: 1rem; font-weight: 700; }
  .loc-overlay p { color: rgba(255,255,255,0.6); font-size: 0.8rem; }

  /* ── DUAL CARDS ── */
  .dual-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 2rem; padding: 5rem 1.5rem; max-width: 1100px; margin: 0 auto; }
  .dual-card { background: white; padding: 2.5rem; border-radius: var(--card-radius); text-align: center; box-shadow: 0 8px 30px rgba(0,0,0,0.07); transition: 0.3s ease; }
  .dual-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,0.12); }
  .dual-icon { font-size: 2.5rem; margin-bottom: 1rem; }
  .dual-icon.student { color: #2563eb; }
  .dual-icon.owner { color: #16a34a; }
  .dual-card h3 { font-size: 1.2rem; font-weight: 800; color: var(--navy); margin-bottom: 0.75rem; }
  .dual-card p { color: var(--text-mid); font-size: 0.9rem; line-height: 1.7; margin-bottom: 1.5rem; }
  .btn-outline { border: 2px solid var(--navy); color: var(--navy); background: transparent; padding: 0.55rem 1.4rem; border-radius: 8px; font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; }
  .btn-outline:hover { background: var(--navy); color: white; }

  /* ── FEATURES ── */
  .features-section { padding: 5rem 1.5rem; background: var(--gray-bg); text-align: center; }
  .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; max-width: 1100px; margin: 3rem auto 0; }
  .feature-card { background: white; padding: 2rem; border-radius: var(--card-radius); box-shadow: 0 6px 20px rgba(0,0,0,0.06); transition: 0.3s; }
  .feature-card:hover { transform: translateY(-6px); }
  .feature-icon { font-size: 2rem; color: var(--blue); margin-bottom: 1rem; }
  .feature-card h4 { font-size: 1rem; font-weight: 700; color: var(--navy); margin-bottom: 0.5rem; }
  .feature-card p { font-size: 0.85rem; color: var(--text-mid); line-height: 1.6; }

  /* ── CTA ── */
  .cta-section { background: linear-gradient(135deg, #0d1b3e 0%, #1a3fa4 100%); color: white; text-align: center; padding: 5rem 1.5rem; }
  .cta-section h2 { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; margin-bottom: 0.75rem; color: white; }
  .cta-section p { opacity: 0.85; margin-bottom: 2rem; font-size: 1rem; color: white; }
  .btn-primary {
    background: var(--orange); color: white; border: none; cursor: pointer;
    padding: 0.85rem 2.2rem; border-radius: 10px; font-size: 1rem; font-weight: 700;
    display: inline-flex; align-items: center; gap: 8px; transition: opacity 0.2s; text-decoration: none;
  }
  .btn-primary:hover { opacity: 0.9; }

  /* ── FAQ SECTION WITH FREQUENCY WAVES ── */
  .faq-section {
    position: relative;
    min-height: 70vh;
    width: 100%;
    text-align: center;
    padding: 4rem 2rem 2rem;
    background: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&auto=format&fit=crop') center/cover no-repeat;
    background-attachment: fixed;
    overflow: hidden;
  }

  .faq-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }

  .faq-content {
    position: relative;
    z-index: 2;
    max-width: 900px;
    margin: 0 auto;
  }

  .faq-heading {
    margin: 2rem;
    padding-top: 2rem;
    display: inline-block;
    font-size: 3.5rem;
    color: #00bfff;
    position: relative;
    letter-spacing: .2rem;
    font-weight: 800;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  }

  .faq-heading::before, .faq-heading::after {
    content: '';
    position: absolute;
    height: 2.5rem;
    width: 2.5rem;
    border-top: .4rem solid #00bfff;
    border-left: .4rem solid #00bfff;
  }

  .faq-heading::before {
    top: 1.8rem;
    left: -2rem;
  }

  .faq-heading::after {
    bottom: -.5rem;
    right: -2rem;
    transform: rotate(180deg);
  }

  .faq-row {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 2rem;
    flex-wrap: wrap;
  }

  .accordion-container {
    width: 100%;
    max-width: 700px;
    text-align: left;
  }

  .accordion {
    margin-bottom: 0.5rem;
  }

  .accordion-header {
    background: linear-gradient(135deg, rgba(0, 191, 255, 0.9) 0%, rgba(0, 153, 204, 0.9) 100%);
    margin: 1rem 0;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 8px;
    transition: all 0.3s;
    backdrop-filter: blur(10px);
  }

  .accordion-header:hover {
    background: linear-gradient(135deg, #00bfff 0%, #0099cc 100%);
    transform: translateX(5px);
    box-shadow: 0 6px 20px rgba(0, 191, 255, 0.4);
  }

  .accordion-header span {
    display: inline-flex;
    text-align: center;
    height: 2.5rem;
    width: 2.5rem;
    line-height: 2.5rem;
    font-size: 1.8rem;
    background: rgba(51, 51, 51, 0.9);
    color: #00bfff;
    border-radius: 4px;
    flex-shrink: 0;
    justify-content: center;
    transition: transform 0.3s;
  }

  .accordion-header.active span {
    transform: rotate(45deg);
    background: rgba(0, 191, 255, 0.3);
    color: #fff;
  }

  .accordion-header h3 {
    color: #fff;
    font-weight: 600;
    font-size: 1.1rem;
    margin: 0;
    flex: 1;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }

  .accordion-body {
    padding: 1.5rem;
    color: #222;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    background-color: rgba(255, 255, 255, 0.95);
    font-size: 1rem;
    display: none;
    margin-bottom: 0.5rem;
    border-radius: 0 0 8px 8px;
    line-height: 1.7;
    backdrop-filter: blur(5px);
  }

  .accordion-body.active {
    display: block;
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ── FREQUENCY WAVE ANIMATION ── */
  .frequency-waves {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 120px;
    z-index: 2;
  }

  .frequency-wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .frequency-wave svg {
    width: 100%;
    height: 100%;
  }

  .wave-path {
    fill: none;
    stroke: #00bfff;
    stroke-width: 2;
    opacity: 0.7;
    filter: drop-shadow(0 2px 3px rgba(0, 191, 255, 0.5));
  }

  .wave-path:nth-child(1) {
    animation: waveFrequency1 4s ease-in-out infinite;
    stroke-opacity: 0.7;
  }

  .wave-path:nth-child(2) {
    animation: waveFrequency2 5s ease-in-out infinite;
    stroke-opacity: 0.5;
  }

  .wave-path:nth-child(3) {
    animation: waveFrequency3 6s ease-in-out infinite;
    stroke-opacity: 0.3;
  }

  @keyframes waveFrequency1 {
    0%, 100% {
      d: path('M 0,60 Q 150,30 300,60 T 600,60 T 900,60 T 1200,60');
    }
    25% {
      d: path('M 0,40 Q 150,20 300,40 T 600,40 T 900,40 T 1200,40');
    }
    50% {
      d: path('M 0,80 Q 150,40 300,80 T 600,80 T 900,80 T 1200,80');
    }
    75% {
      d: path('M 0,50 Q 150,15 300,50 T 600,50 T 900,50 T 1200,50');
    }
  }

  @keyframes waveFrequency2 {
    0%, 100% {
      d: path('M 0,50 Q 150,40 300,50 T 600,50 T 900,50 T 1200,50');
    }
    25% {
      d: path('M 0,30 Q 150,10 300,30 T 600,30 T 900,30 T 1200,30');
    }
    50% {
      d: path('M 0,70 Q 150,50 300,70 T 600,70 T 900,70 T 1200,70');
    }
    75% {
      d: path('M 0,45 Q 150,20 300,45 T 600,45 T 900,45 T 1200,45');
    }
  }

  @keyframes waveFrequency3 {
    0%, 100% {
      d: path('M 0,65 Q 150,55 300,65 T 600,65 T 900,65 T 1200,65');
    }
    25% {
      d: path('M 0,35 Q 150,25 300,35 T 600,35 T 900,35 T 1200,35');
    }
    50% {
      d: path('M 0,85 Q 150,65 300,85 T 600,85 T 900,85 T 1200,85');
    }
    75% {
      d: path('M 0,55 Q 150,25 300,55 T 600,55 T 900,55 T 1200,55');
    }
  }

  /* ── FOOTER ── */
  footer {
    background: #070f24;
    color: rgba(255,255,255,0.55);
    padding: 3rem 1.5rem 1.5rem;
  }
  .footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 2rem;
    max-width: 1100px;
    margin: 0 auto 2rem;
  }
  .footer-brand strong { color: white; font-size: 1rem; font-weight: 800; letter-spacing: 1px; display: block; margin-bottom: 0.5rem; }
  .footer-brand p { font-size: 0.83rem; line-height: 1.7; color: rgba(255,255,255,0.45); max-width: 260px; }
  .footer-col h5 { color: rgba(255,255,255,0.85); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1rem; }
  .footer-col a { display: block; color: rgba(255,255,255,0.45); font-size: 0.83rem; margin-bottom: 0.5rem; text-decoration: none; transition: color 0.2s; }
  .footer-col a:hover { color: var(--orange); }
  .footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.08);
    padding-top: 1.2rem;
    text-align: center;
    font-size: 0.78rem;
    color: rgba(255,255,255,0.3);
    max-width: 1100px;
    margin: 0 auto;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 1024px) {
    .hero-wrapper { flex-direction: column; gap: 2rem; }
    .hero-right-mask { height: 300px; }
    .anim-card { width: 150px; }
  }

  @media (max-width: 768px) {
    .hero h1 { font-size: 2.5rem; }
    .hero h2 { font-size: 1.8rem; }
    .locations-grid { grid-template-columns: 1fr 1fr; grid-template-rows: auto; }
    .loc-card.big { grid-row: auto; }
    .footer-grid { grid-template-columns: 1fr 1fr; }
    .footer-brand { grid-column: 1 / -1; }
    .footer-brand p { max-width: 100%; }
    .faq-row { padding: 0 1rem; }
    .accordion-container { width: 100%; }
  }

  @media (max-width: 520px) {
    .hero h1 { font-size: 2rem; }
    .hero h2 { font-size: 1.3rem; }
    .hero-btns { flex-direction: column; align-items: center; }
    .hero-btn-primary, .hero-btn-ghost { width: 100%; max-width: 300px; justify-content: center; }
    .hero-stats { gap: 1.5rem; }
    .types-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
    .type-card { padding: 1.4rem 0.75rem; }
    .type-card h4 { font-size: 0.88rem; }
    .locations-grid { grid-template-columns: 1fr; }
    .loc-card.big { grid-row: auto; }
    .footer-grid { grid-template-columns: 1fr; }
    .dual-section { padding: 3rem 1rem; }
    .features-section { padding: 3rem 1rem; }
    .cta-section { padding: 3rem 1rem; }
    .faq-section { padding: 2rem 1rem; }
    .faq-heading { font-size: 2rem; margin: 1rem; }
    .accordion-header { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
    .accordion-header h3 { font-size: 0.95rem; }
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

// ✅ FAQ DATA FOR PEZAHOSTEL
const FAQ_DATA = [
  {
    question: "How do I find a hostel on PezaHostel?",
    answer: "Simply browse our listings by location, filter by price and amenities, view photos, and contact owners directly. You can also search by specific areas near MUBAS."
  },
  {
    question: "How do I book a hostel?",
    answer: "Select your desired hostel, choose your check-in date and duration, and proceed to payment. Our secure payment system accepts Airtel Money,TNM Mpamba and banks."
  },
  {
    question: "Is PezaHostel safe and secure?",
    answer: "Yes! We verify all hostel owners to ensure trust and safety. All payments are processed securely, and we have a direct communication system between students and owners."
  },
  {
    question: "Can I list my hostel on PezaHostel?",
    answer: "Absolutely! Register as a hostel owner, provide your property details, upload photos, and start receiving booking requests from verified students."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept secure payments via Airtel Money and TNM Mpamba. All transactions are encrypted and protected for your safety."
  }
];

function Navbar({ isAuthenticated, user }) {
  const navigate = useNavigate();
  return (
    <nav>
      <button onClick={() => navigate('/')} className="logo">
        <div className="logo-icon"><img src="/logo2.png" alt="HostelLink" /></div>
        <div className="logo-text">
      
          <span>OFF-CAMPUS ACCOMMODATION</span>
        </div>
      </button>

      {/* Fancy Center Text — logo-style */}
      <div className="nav-center">
        <div className="nav-center-item fancy">PezaHostel</div>
        <div className="nav-center-dot" />
        <div className="nav-center-item">Students</div>
        <div className="nav-center-dot" />
        <div className="nav-center-item">Owners</div>
        <div className="nav-center-dot" />
        {/* <div className="nav-center-item">MUBAS</div>  Fancy Center Text — logo-style */}
      </div>

      <div className="nav-actions">
        {isAuthenticated ? (
          <>
            <a href="/Login" className="nav-login">
              <i className="fa fa-user" />
              <span className="nav-login-text">Login</span>
            </a>
            <a href="/Register" className="nav-signup">
              <i className="fa fa-th-large" />
              <span className="nav-signup-text"> Signup</span>
            </a>
          </>
        ) : (
          <>
            <a href="/login" className="nav-login">
              <i className="fa fa-sign-in-alt" />
              <span className="nav-login-text"> Login</span>
            </a>
            <a href="/register" className="nav-signup">
              <i className="fa fa-user-plus" />
              <span className="nav-signup-text"> Sign Up</span>
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
      <div className="hero-content">
        <h1>Find Safe & Affordable <span>Hostels Near MUBAS.</span></h1>
        <p>The smartest way for students to find accommodation and for hostel owners to connect with verified tenants.</p>
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
      {/* ✅ WAVES ADDED HERE */}
      <div className="wave wave1"></div>
      <div className="wave wave2"></div>
      <div className="wave wave3"></div>
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
          setAreas(AREA_DEFINITIONS.map(area => ({
            ...area,
            count: counts[area.label] || 0,
          })));
        } else {
          setAreas(AREA_DEFINITIONS.map(a => ({ ...a, count: 0 })));
        }
      } catch (err) {
        setAreas(AREA_DEFINITIONS.map(a => ({ ...a, count: 0 })));
      } finally {
        setLoading(false);
      }
    };
    fetchAreaCounts();
  }, []);

  const handleClick = (areaLabel) => {
    navigate(isAuthenticated ? `/hostels?search=${encodeURIComponent(areaLabel)}` : '/login');
  };

  return (
    <section className="explore-section">
      <p className="section-label">Hostel By Location</p>
      <h2 className="section-title">Explore Hostel <em>Areas</em></h2>
      <div className="types-grid">
        {loading ? (
          AREA_DEFINITIONS.map((_, i) => (
            <div key={i} className="type-card-skeleton">
              <div className="skeleton-circle" />
              <div className="skeleton-line short" />
              <div className="skeleton-line shorter" />
            </div>
          ))
        ) : (
          areas.map(t => (
            <button key={t.label} className="type-card" onClick={() => handleClick(t.label)}>
              <i className={t.icon} />
              <h4>{t.label}</h4>
              <span className="area-count">
                {t.count > 0 ? `${t.count} Hostel${t.count !== 1 ? 's' : ''}` : 'View Hostels'}
              </span>
            </button>
          ))
        )}
      </div>
    </section>
  );
}

function LocationsSection({ isAuthenticated }) {
  const navigate = useNavigate();
  const handleClick = () => navigate(isAuthenticated ? '/hostels' : '/login');
  const locations = [
    { img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop", big: true, count: "7 Hostels Available", name: "Chitawira", desc: "Close Campus Accommodation" },
    { img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&auto=format&fit=crop", count: "5 Hostels Available", name: "Ndirande", desc: "Affordable Options" },
    { img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop", count: "4 Hostels Available", name: "Mandala", desc: "Premium Listings" },
    { img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop", count: "3 Hostels Available", name: "Near Queens", desc: "Budget Friendly" },
    { img: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&auto=format&fit=crop", count: "6 Hostels Available", name: "Zingwangwa", desc: "Popular Student Area" },
  ];
  return (
    <section className="locations-section">
      <p className="section-label">Our Property Areas</p>
      <h2 className="section-title" style={{ color: "white" }}>Top Locations Near <em>MUBAS</em></h2>
      <div className="locations-grid">
        {locations.map(loc => (
          <button key={loc.name} className={`loc-card${loc.big ? " big" : ""}`} onClick={handleClick}>
            <img src={loc.img} alt={loc.name} />
            <div className="loc-overlay">
              <small>{loc.count}</small>
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
    <div className="dual-section">
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
  );
}

function FeaturesSection() {
  const features = [
    { icon: "fa fa-search", title: "Smart Search", desc: "Filter by price, location, amenities and availability." },
    { icon: "fa fa-home", title: "Direct Communication", desc: "Students connect directly with hostel owners for faster responses." },
    { icon: "fa fa-shield-alt", title: "Verified Listings", desc: "We verify owners to ensure trust and safety for all students." },
    { icon: "fa fa-money-bill-wave", title: "Secure Payments", desc: "Safe deposit system with Airtel Money & TNM Mpamba." },
  ];
  return (
    <section className="features-section">
      <h2 className="section-title">Why Choose <em>Our Platform?</em></h2>
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

// ✅ FAQ COMPONENT WITH ACCORDION & FREQUENCY WAVES
function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-content">
        <h1 className="faq-heading" id="faq">FAQ</h1>
        <div className="faq-row">
          <div className="accordion-container">
            {FAQ_DATA.map((item, index) => (
              <div key={index} className="accordion">
                <div
                  className={`accordion-header ${activeIndex === index ? 'active' : ''}`}
                  onClick={() => toggleAccordion(index)}
                >
                  <span>+</span>
                  <h3>{item.question}</h3>
                </div>
                <div className={`accordion-body ${activeIndex === index ? 'active' : ''}`}>
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ FREQUENCY WAVES AT BOTTOM */}
      <div className="frequency-waves">
        <div className="frequency-wave">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path
              className="wave-path"
              d="M 0,60 Q 150,30 300,60 T 600,60 T 900,60 T 1200,60"
            />
          </svg>
        </div>
        <div className="frequency-wave" style={{ bottom: '20px' }}>
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path
              className="wave-path"
              d="M 0,50 Q 150,40 300,50 T 600,50 T 900,50 T 1200,50"
            />
          </svg>
        </div>
        <div className="frequency-wave" style={{ bottom: '40px' }}>
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path
              className="wave-path"
              d="M 0,65 Q 150,55 300,65 T 600,65 T 900,65 T 1200,65"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

// ✅ FIXED: Removed auto-redirect useEffect — users now only navigate when they click something
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
      <FAQSection />
      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join the growing MUBAS accommodation network today.</p>
        <a href="/register" className="btn-primary"><i className="fa fa-user-plus" /> Create Free Account</a>
      </section>

      {/* ✅ FAQ SECTION WITH FREQUENCY WAVES & BACKGROUND PHOTO */}
      <FAQSection />
    </>
  );
}