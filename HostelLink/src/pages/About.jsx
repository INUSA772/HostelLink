import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────
   DESIGN TOKENS — exact match to Home.jsx
───────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Nunito+Sans:wght@400;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:        #0f1923;
    --navy-mid:    #1a2e3d;
    --amber:       #f5a623;
    --amber-light: #fef3d8;
    --amber-dark:  #d4870a;
    --white:       #fff;
    --off-white:   #f7f8fa;
    --light-gray:  #f0f2f5;
    --border:      #e8eaed;
    --mid:         #6b7280;
    --dark:        #111827;
    --radius:      12px;
    --radius-lg:   16px;
    --font:        'Plus Jakarta Sans', 'Nunito Sans', sans-serif;
  }

  html { scroll-behavior: smooth; }
  body { font-family: var(--font); color: var(--dark); background: #fff; overflow-x: hidden; }
  a    { text-decoration: none; color: inherit; }
  button { font-family: inherit; cursor: pointer; border: none; background: none; padding: 0; }

  /* ── SHARED SECTION LABELS ── */
  .ab-label {
    font-size: .7rem; font-weight: 700; letter-spacing: 2.5px;
    text-transform: uppercase; color: var(--amber-dark);
    text-align: center; margin-bottom: .5rem;
  }
  .ab-title {
    font-family: var(--font);
    font-size: clamp(1.5rem, 5vw, 2.4rem);
    font-weight: 900; text-align: center; line-height: 1.1;
    color: var(--navy); letter-spacing: -.5px; margin-bottom: .65rem;
  }
  .ab-title em { font-style: normal; color: var(--amber); }
  .ab-sub {
    text-align: center; font-size: .9rem; line-height: 1.85;
    color: var(--mid); max-width: 540px; margin: 0 auto 3rem; font-weight: 500;
  }

  /* ═══════════════════════════════════════
     NAV BAR (mirrors Home Navbar exactly)
  ═══════════════════════════════════════ */
  .ab-nav {
    position: sticky; top: 0; z-index: 900;
    background: #fff; border-bottom: 1px solid #eaeaea;
    box-shadow: 0 2px 12px rgba(0,0,0,.06);
  }
  .ab-nav-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center;
    padding: 0 1.25rem; height: 60px;
  }
  .ab-back {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--off-white); border: 1.5px solid var(--border);
    padding: .45rem 1rem; border-radius: 8px;
    font-size: .83rem; font-weight: 700; color: var(--navy);
    transition: all .2s; cursor: pointer; margin-right: auto;
    font-family: var(--font);
  }
  .ab-back:hover { background: var(--navy); color: #fff; border-color: var(--navy); }
  .ab-logo {
    display: flex; align-items: center; gap: 8px;
    text-decoration: none; position: absolute; left: 50%; transform: translateX(-50%);
  }
  .ab-logo-icon {
    width: 34px; height: 34px; background: white; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; overflow: hidden;
  }
  .ab-logo-icon img { width: 100%; height: 100%; object-fit: contain; }
  .ab-logo-text { font-size: 1.05rem; font-weight: 800; color: var(--navy); letter-spacing: -.3px; }
  @media(min-width: 900px) {
    .ab-nav-inner { height: 68px; padding: 0 2rem; }
  }

  /* ═══════════════════════════════════════
     HERO
  ═══════════════════════════════════════ */
  .ab-hero {
    background: var(--navy);
    position: relative; overflow: hidden;
    padding: 5rem 1.5rem 4rem;
    text-align: center;
  }
  /* Diagonal amber stripes — subtle texture */
  .ab-hero::before {
    content: '';
    position: absolute; inset: 0; z-index: 0;
    background: repeating-linear-gradient(
      -55deg,
      transparent,
      transparent 60px,
      rgba(245,166,35,.04) 60px,
      rgba(245,166,35,.04) 61px
    );
    pointer-events: none;
  }
  /* Bottom amber accent line */
  .ab-hero::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--amber), transparent);
  }
  .ab-hero-inner { position: relative; z-index: 1; max-width: 760px; margin: 0 auto; }
  .ab-hero-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(245,166,35,.12); border: 1px solid rgba(245,166,35,.3);
    border-radius: 999px; padding: .4rem 1rem;
    font-size: .72rem; font-weight: 700; color: var(--amber);
    letter-spacing: 1.5px; text-transform: uppercase;
    margin-bottom: 1.5rem;
  }
  .ab-hero h1 {
    font-family: var(--font);
    font-size: clamp(2.2rem, 7vw, 4rem);
    font-weight: 900; color: #fff;
    line-height: 1.08; letter-spacing: -2px;
    margin-bottom: 1.25rem;
  }
  .ab-hero h1 em { color: var(--amber); font-style: normal; }
  .ab-hero-desc {
    font-size: clamp(.9rem, 2vw, 1.05rem);
    color: rgba(255,255,255,.65);
    line-height: 1.85; font-weight: 500;
    max-width: 520px; margin: 0 auto 2.5rem;
  }
  .ab-hero-stats {
    display: grid; grid-template-columns: repeat(3,1fr);
    gap: 1px; background: rgba(255,255,255,.08);
    border: 1px solid rgba(255,255,255,.08); border-radius: 14px;
    overflow: hidden; max-width: 480px; margin: 0 auto;
  }
  .ab-hero-stat {
    padding: 1.4rem 1rem; background: rgba(255,255,255,.03);
    text-align: center;
  }
  .ab-hero-stat strong {
    display: block; font-size: 1.8rem; font-weight: 900;
    color: var(--amber); letter-spacing: -1px;
  }
  .ab-hero-stat span {
    font-size: .68rem; font-weight: 600;
    color: rgba(255,255,255,.45); text-transform: uppercase; letter-spacing: 1px;
  }

  /* ═══════════════════════════════════════
     TRUST BAR (mirrors Home TrustBar)
  ═══════════════════════════════════════ */
  .ab-trust { background: var(--off-white); border-bottom: 1px solid var(--border); padding: 1.5rem 1.25rem; }
  .ab-trust-inner {
    max-width: 1100px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
  }
  .ab-trust-item { display: flex; align-items: center; gap: 12px; }
  .ab-trust-icon {
    width: 38px; height: 38px; min-width: 38px;
    border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-size: .95rem;
  }
  .ab-trust-icon.navy  { background: var(--navy); color: var(--amber); }
  .ab-trust-icon.amber { background: var(--amber); color: var(--navy); }
  .ab-trust-text strong { display: block; font-size: .83rem; font-weight: 700; color: var(--navy); }
  .ab-trust-text span   { font-size: .73rem; color: var(--mid); }
  @media(min-width: 640px) { .ab-trust-inner { grid-template-columns: repeat(4,1fr); } }

  /* ═══════════════════════════════════════
     STORY SECTION — full-bleed split layout
  ═══════════════════════════════════════ */
  .ab-story {
    max-width: 1100px; margin: 0 auto;
    padding: clamp(3rem, 7vw, 5.5rem) 1.5rem;
    display: grid; gap: 3rem;
  }
  .ab-story-text-col {}
  .ab-story-eyebrow {
    font-size: .7rem; font-weight: 700; letter-spacing: 2.5px;
    text-transform: uppercase; color: var(--amber-dark); margin-bottom: .75rem;
  }
  .ab-story h2 {
    font-family: var(--font);
    font-size: clamp(1.6rem, 4vw, 2.6rem);
    font-weight: 900; color: var(--navy);
    line-height: 1.12; letter-spacing: -.8px; margin-bottom: 1.5rem;
  }
  .ab-story h2 em { font-style: normal; color: var(--amber); }
  .ab-story p {
    font-size: .95rem; color: var(--mid);
    line-height: 1.9; font-weight: 500; margin-bottom: 1.2rem;
  }
  .ab-story p:last-child { margin-bottom: 0; }
  .ab-story-visual {
    background: var(--navy);
    border-radius: var(--radius-lg);
    padding: 2rem 1.75rem;
    display: flex; flex-direction: column; gap: 1.2rem;
    position: relative; overflow: hidden;
  }
  .ab-story-visual::before {
    content: '';
    position: absolute; bottom: -30px; right: -30px;
    width: 160px; height: 160px;
    background: rgba(245,166,35,.08);
    border-radius: 50%; pointer-events: none;
  }
  .ab-story-pill {
    display: flex; align-items: center; gap: 12px;
    background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
    border-radius: 10px; padding: 1rem 1.25rem;
    transition: background .2s;
  }
  .ab-story-pill:hover { background: rgba(255,255,255,.1); }
  .ab-story-pill-icon {
    width: 38px; height: 38px; min-width: 38px;
    background: rgba(245,166,35,.15); border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; color: var(--amber);
  }
  .ab-story-pill-text strong {
    display: block; font-size: .85rem; font-weight: 700; color: #fff; margin-bottom: 2px;
  }
  .ab-story-pill-text span { font-size: .76rem; color: rgba(255,255,255,.45); }
  @media(min-width: 860px) {
    .ab-story { grid-template-columns: 1.15fr 1fr; align-items: start; }
  }

  /* ═══════════════════════════════════════
     MISSION / VISION / VALUES — 3 cards
  ═══════════════════════════════════════ */
  .ab-mvv { background: var(--off-white); padding: clamp(3rem,7vw,5.5rem) 1.5rem; }
  .ab-mvv-inner { max-width: 1100px; margin: 0 auto; }
  .ab-mvv-grid {
    display: grid; gap: 1.25rem;
    grid-template-columns: 1fr;
    margin-top: 2rem;
  }
  .ab-mvv-card {
    background: #fff; border: 1.5px solid var(--border);
    border-radius: var(--radius-lg); padding: 2rem 1.75rem;
    transition: all .3s; position: relative; overflow: hidden;
  }
  .ab-mvv-card::before {
    content: '';
    position: absolute; top: 0; left: 0;
    width: 4px; height: 100%;
    background: var(--amber); border-radius: 99px 0 0 99px;
    transform: scaleY(0); transform-origin: top;
    transition: transform .3s;
  }
  .ab-mvv-card:hover { border-color: var(--amber); transform: translateY(-5px); box-shadow: 0 16px 40px rgba(15,25,35,.1); }
  .ab-mvv-card:hover::before { transform: scaleY(1); }
  .ab-mvv-emoji { font-size: 2.2rem; margin-bottom: 1rem; display: block; }
  .ab-mvv-card h3 {
    font-size: 1.1rem; font-weight: 800; color: var(--navy);
    margin-bottom: .65rem; letter-spacing: -.3px;
  }
  .ab-mvv-card p { font-size: .88rem; color: var(--mid); line-height: 1.8; font-weight: 500; }
  @media(min-width: 600px) { .ab-mvv-grid { grid-template-columns: repeat(3,1fr); } }

  /* ═══════════════════════════════════════
     CORE VALUES — 2-col feature grid (Home style)
  ═══════════════════════════════════════ */
  .ab-values { background: #fff; padding: clamp(3rem,7vw,5.5rem) 1.5rem; }
  .ab-values-inner { max-width: 1100px; margin: 0 auto; }
  .ab-values-grid {
    display: grid; gap: .9rem;
    grid-template-columns: repeat(2,1fr);
    max-width: 1100px; margin: 2rem auto 0;
  }
  .ab-val-card {
    background: var(--off-white); border: 1.5px solid var(--border);
    border-radius: var(--radius-lg); padding: 1.6rem 1.4rem;
    display: flex; gap: 1rem; align-items: flex-start;
    transition: all .25s;
  }
  .ab-val-card:hover {
    background: var(--navy); border-color: var(--navy);
    transform: translateY(-4px); box-shadow: 0 14px 30px rgba(15,25,35,.14);
  }
  .ab-val-icon {
    width: 44px; height: 44px; min-width: 44px;
    background: var(--amber-light); border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; color: var(--amber-dark); flex-shrink: 0;
    transition: background .25s;
  }
  .ab-val-card:hover .ab-val-icon { background: rgba(245,166,35,.2); }
  .ab-val-card h4 {
    font-size: .9rem; font-weight: 800; color: var(--navy);
    margin-bottom: .3rem; transition: color .25s;
  }
  .ab-val-card:hover h4 { color: #fff; }
  .ab-val-card p { font-size: .8rem; color: var(--mid); line-height: 1.65; font-weight: 500; transition: color .25s; }
  .ab-val-card:hover p { color: rgba(255,255,255,.6); }
  @media(min-width: 640px) { .ab-values-grid { grid-template-columns: repeat(3,1fr); } }

  /* ═══════════════════════════════════════
     STATS — amber border box style (Home)
  ═══════════════════════════════════════ */
  .ab-stats-sec { background: var(--navy); padding: clamp(3rem,7vw,5.5rem) 1.5rem; }
  .ab-stats-inner { max-width: 1100px; margin: 0 auto; }
  .ab-stats-inner .ab-label { color: var(--amber); }
  .ab-stats-inner .ab-title { color: #fff; }
  .ab-stats-inner .ab-title em { color: var(--amber); }
  .ab-stats-inner .ab-sub { color: rgba(255,255,255,.5); }
  .ab-stats-grid {
    display: grid; gap: 1px;
    grid-template-columns: repeat(2,1fr);
    background: rgba(255,255,255,.1);
    border: 1px solid rgba(255,255,255,.1);
    border-radius: var(--radius-lg); overflow: hidden;
    max-width: 860px; margin: 0 auto;
  }
  .ab-stat {
    background: var(--navy); padding: 2.5rem 1.5rem; text-align: center;
    transition: background .2s;
  }
  .ab-stat:hover { background: var(--navy-mid); }
  .ab-stat strong {
    display: block; font-size: clamp(2rem,5vw,3rem); font-weight: 900;
    color: var(--amber); letter-spacing: -2px; margin-bottom: .4rem;
  }
  .ab-stat span { font-size: .8rem; font-weight: 600; color: rgba(255,255,255,.5); text-transform: uppercase; letter-spacing: 1px; }
  @media(min-width: 600px) { .ab-stats-grid { grid-template-columns: repeat(4,1fr); } }

  /* ═══════════════════════════════════════
     TEAM
  ═══════════════════════════════════════ */
  .ab-team-sec { background: var(--off-white); padding: clamp(3rem,7vw,5.5rem) 1.5rem; }
  .ab-team-inner { max-width: 1100px; margin: 0 auto; }
  .ab-team-grid {
    display: grid; gap: 1.5rem;
    grid-template-columns: repeat(auto-fill, minmax(220px,1fr));
    margin-top: 2rem; justify-content: center; max-width: 620px; margin-left: auto; margin-right: auto;
  }
  .ab-team-card {
    background: #fff; border: 1.5px solid var(--border);
    border-radius: var(--radius-lg); overflow: hidden;
    text-align: center; transition: all .3s;
    box-shadow: 0 2px 10px rgba(0,0,0,.05);
  }
  .ab-team-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 45px rgba(15,25,35,.12);
    border-color: var(--amber);
  }
  .ab-team-img-wrap { width: 100%; height: 220px; overflow: hidden; position: relative; }
  .ab-team-img-wrap img {
    width: 100%; height: 100%; object-fit: cover; object-position: top center;
    transition: transform .4s;
  }
  .ab-team-card:hover .ab-team-img-wrap img { transform: scale(1.06); }
  /* Amber bottom accent line on hover */
  .ab-team-img-wrap::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 3px; background: var(--amber);
    transform: scaleX(0); transform-origin: left; transition: transform .3s;
  }
  .ab-team-card:hover .ab-team-img-wrap::after { transform: scaleX(1); }
  .ab-team-info { padding: 1.25rem 1.5rem 1.5rem; }
  .ab-team-name { font-size: 1rem; font-weight: 800; color: var(--navy); margin-bottom: .3rem; }
  .ab-team-role {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: .75rem; font-weight: 700;
    background: var(--amber-light); color: var(--amber-dark);
    padding: .28rem .8rem; border-radius: 999px;
  }

  /* ═══════════════════════════════════════
     CTA (mirrors Home ph-cta-sec)
  ═══════════════════════════════════════ */
  .ab-cta {
    background: var(--navy); color: white; text-align: center;
    padding: clamp(3rem,8vw,6rem) 1.5rem;
    border-top: 1px solid rgba(255,255,255,.06);
    position: relative; overflow: hidden;
  }
  .ab-cta::before {
    content: '';
    position: absolute; inset: 0; z-index: 0;
    background: repeating-linear-gradient(
      -55deg, transparent, transparent 60px,
      rgba(245,166,35,.03) 60px, rgba(245,166,35,.03) 61px
    );
    pointer-events: none;
  }
  .ab-cta-inner {
    position: relative; z-index: 1; max-width: 700px; margin: 0 auto;
    background: rgba(255,255,255,.04); border: 1.5px solid rgba(255,255,255,.1);
    border-radius: 20px; padding: 2.5rem 1.75rem;
  }
  .ab-cta-icon {
    width: 56px; height: 56px; border-radius: 14px;
    background: var(--amber); display: flex; align-items: center;
    justify-content: center; font-size: 1.4rem; color: var(--navy);
    margin: 0 auto 1.25rem;
  }
  .ab-cta h2 {
    font-size: clamp(1.3rem, 4vw, 2rem); font-weight: 900;
    color: #fff; margin-bottom: .65rem; letter-spacing: -.5px;
  }
  .ab-cta p { color: rgba(255,255,255,.6); font-size: .92rem; font-weight: 500; margin-bottom: 1.75rem; line-height: 1.7; }
  .ab-cta-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--amber); color: var(--navy);
    padding: .9rem 2.25rem; border-radius: var(--radius);
    font-size: .95rem; font-weight: 800;
    border: none; cursor: pointer; font-family: var(--font);
    transition: all .2s;
    box-shadow: 0 6px 22px rgba(245,166,35,.35);
  }
  .ab-cta-btn:hover { background: var(--amber-dark); transform: translateY(-2px); }
  .ab-cta-note { margin-top: 1rem; font-size: .8rem; color: rgba(255,255,255,.35); }
  .ab-cta-note a { color: var(--amber); font-weight: 700; }

  /* ── FOOTER (reuse Home footer identity) ── */
  .ab-footer {
    background: #0a1118; color: rgba(255,255,255,.3);
    padding: 1.75rem 1.5rem; text-align: center; font-size: .78rem;
  }
  .ab-footer span { display: block; margin-bottom: .25rem; }

  /* ── RESPONSIVE ── */
  @media(max-width: 480px) {
    .ab-hero h1 { letter-spacing: -1px; }
    .ab-hero-stats { max-width: 100%; }
    .ab-logo { display: none; }
  }
`;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const TEAM = [
  { name: "Majidu Inusa",     role: "Co-Founder", img: "/We5.jpeg" },
  { name: "Thandazani Kalua", role: "Co-Founder", img: "/We9.jpg"  },
];

const TRUST_ITEMS = [
  { icon: "fa fa-shield-alt",  label: "Fully Verified",      sub: "All properties checked",     style: "navy"  },
  { icon: "fa fa-map-marker-alt", label: "28 Districts",     sub: "All Malawi covered",         style: "amber" },
  { icon: "fa fa-comments",    label: "WhatsApp Direct",     sub: "No middlemen, ever",         style: "navy"  },
  { icon: "fa fa-lock",        label: "Dispute Protection",  sub: "Fair mediation built-in",    style: "amber" },
];

const MVV = [
  { emoji: "🎯", title: "Our Mission",  body: "Simplify property search by giving every Malawian a trusted, transparent way to find safe, verified homes — no account required to browse." },
  { emoji: "🌟", title: "Our Vision",   body: "Become Malawi's leading property platform — the first name tenants and landlords reach for across all 28 districts." },
  { emoji: "💡", title: "Our Values",   body: "Transparency, safety, affordability, and community. Every feature we build is guided by what's genuinely best for tenants and landlords alike." },
];

const VALUES = [
  { icon: "fa fa-check-circle",  title: "Trust & Transparency",   body: "Every listing is verified. No hidden fees, no surprises."     },
  { icon: "fa fa-shield-alt",    title: "Tenant Safety",          body: "We verify all landlords before their listings go live."        },
  { icon: "fa fa-tag",           title: "Affordability",          body: "Quality housing shouldn't break the bank — for anyone."        },
  { icon: "fa fa-handshake",     title: "Community",              body: "Building trust between tenants and owners, one listing at a time." },
  { icon: "fa fa-bolt",          title: "Speed & Efficiency",     body: "Find your perfect home in minutes, not weeks."                 },
  { icon: "fa fa-mobile-alt",    title: "Innovation",             body: "Using technology to solve real, everyday housing problems."    },
];

const STATS = [
  { value: "500+", label: "Homes Listed"       },
  { value: "150+", label: "Verified Properties" },
  { value: "28",   label: "Districts Covered"  },
  { value: "98%",  label: "Tenant Satisfaction" },
];

const STORY_PILLS = [
  { icon: "fa fa-lightbulb", title: "Born in Malawi",       sub: "Built for local realities, not imports." },
  { icon: "fa fa-users",     title: "Community First",      sub: "Tenants and landlords, equally served."  },
  { icon: "fa fa-chart-line",title: "Growing Fast",         sub: "New listings every single day."          },
  { icon: "fa fa-award",     title: "Trusted Platform",     sub: "Verified landlords, safe outcomes."      },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
const About = () => {
  const navigate = useNavigate();
  const [hoveredStat, setHoveredStat] = useState(null);

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      {/* ── NAV ── */}
      <nav className="ab-nav">
        <div className="ab-nav-inner">
          <button className="ab-back" onClick={() => navigate(-1)}>
            <i className="fa fa-arrow-left" /> Back
          </button>
          <a href="/" className="ab-logo">
            <div className="ab-logo-icon"><img src="/PEZ.png" alt="PezaNyumba" /></div>
            <span className="ab-logo-text">PezaNyumba Mw</span>
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="ab-hero">
        <div className="ab-hero-inner">
          <div className="ab-hero-badge">
          
          </div>
          <h1>
            Finding Home<br />
            Shouldn't Be This Hard.
          </h1>
          <p className="ab-hero-desc">
            PezaNyumba Mw was built to fix that. Connecting tenants, families and professionals across all 28 districts of Malawi with safe, verified properties. No sign-up needed to browse.
          </p>
          <div className="ab-hero-stats">
            {STATS.map(s => (
              <div className="ab-hero-stat" key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="ab-trust">
        <div className="ab-trust-inner">
          {TRUST_ITEMS.map(item => (
            <div className="ab-trust-item" key={item.label}>
              <div className={`ab-trust-icon ${item.style}`}><i className={item.icon} /></div>
              <div className="ab-trust-text">
                <strong>{item.label}</strong>
                <span>{item.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── OUR STORY ── */}
      <div className="ab-story">
        <div className="ab-story-text-col">
          <p className="ab-story-eyebrow">Our Story</p>
          <h2>We Saw the <em>Problem.</em><br />We Built the Fix.</h2>
          <p>
            People across Malawi were finding it hard to find safe, affordable houses for rent near workplaces, schools and universities. Traditional property searches were slow, unreliable, and full of scams.
          </p>
          <p>
            So we built PezaNyumba: a platform that bridges the gap between tenants and verified property owners. Every landlord is identity-checked. Every listing is reviewed. Tenants contact owners directly on WhatsApp — no agent, no commission, no mystery.
          </p>
          <p>
            From Lilongwe to Mzuzu, from Blantyre to Mangochi. PezaNyumba covers all 28 districts, because housing is a right, not a privilege.
          </p>
        </div>
        <div className="ab-story-visual">
          {STORY_PILLS.map(pill => (
            <div className="ab-story-pill" key={pill.title}>
              <div className="ab-story-pill-icon"><i className={pill.icon} /></div>
              <div className="ab-story-pill-text">
                <strong>{pill.title}</strong>
                <span>{pill.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MISSION / VISION / VALUES ── */}
      <section className="ab-mvv">
        <div className="ab-mvv-inner">
          <p className="ab-label">What drives us</p>
          <h2 className="ab-title">Mission, Vision &amp; <em>Values</em></h2>
          <p className="ab-sub">Three pillars that guide every decision we make from the features we build to the landlords we approve.</p>
          <div className="ab-mvv-grid">
            {MVV.map(card => (
              <div className="ab-mvv-card" key={card.title}>
                <span className="ab-mvv-emoji">{card.emoji}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="ab-values">
        <div className="ab-values-inner">
          <p className="ab-label">The way we work</p>
          <h2 className="ab-title">Core <em>Values</em></h2>
          <p className="ab-sub">Six principles that keep us honest, fast and focused on what actually matters to our users.</p>
          <div className="ab-values-grid">
            {VALUES.map(v => (
              <div className="ab-val-card" key={v.title}>
                <div className="ab-val-icon"><i className={v.icon} /></div>
                <div>
                  <h4>{v.title}</h4>
                  <p>{v.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="ab-stats-sec">
        <div className="ab-stats-inner">
          <p className="ab-label">By the numbers</p>
          <h2 className="ab-title">Growing Across <em>All of Malawi</em></h2>
          <p className="ab-sub" style={{color:'rgba(255,255,255,.5)'}}>Real numbers from real listings. Updated as landlords join every day.</p>
          <div className="ab-stats-grid">
            {STATS.map(s => (
              <div className="ab-stat" key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="ab-team-sec">
        <div className="ab-team-inner">
          <p className="ab-label">The people behind it</p>
         
          <p className="ab-sub">A mission to make property search simple, safe and accessible for every Malawian.</p>
          <div className="ab-team-grid">
            {TEAM.map(member => (
              <div className="ab-team-card" key={member.name}>
                <div className="ab-team-img-wrap">
                  <img src={member.img} alt={member.name} />
                </div>
                <div className="ab-team-info">
                  <div className="ab-team-name">{member.name}</div>
                  <div className="ab-team-role">
                    <i className="fa fa-star" style={{fontSize:'.6rem'}} /> {member.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ab-cta">
        <div className="ab-cta-inner">
          <div className="ab-cta-icon"><i className="fa fa-home" /></div>
          <h2>Ready to Find Your Perfect Home?</h2>
          <p>Join hundreds of tenants who have already found their ideal property on PezaNyumba — no account needed to start browsing.</p>
          <button className="ab-cta-btn" onClick={() => navigate('/properties')}>
            Browse Properties <i className="fa fa-arrow-right" />
          </button>
          <p className="ab-cta-note">
            Are you a landlord? <a href="/register">Register here →</a>
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
   
    </>
  );
};

export default About;