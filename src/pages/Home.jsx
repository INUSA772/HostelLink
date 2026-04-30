import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MALAWI_DISTRICTS = [
  "Lilongwe", "Blantyre", "Zomba", "Mzuzu", "Kasungu", "Mangochi",
  "Dedza", "Salima", "Ntcheu", "Balaka", "Machinga", "Chiradzulu",
  "Thyolo", "Mulanje", "Phalombe", "Chikwawa", "Nsanje", "Neno",
  "Mwanza", "Nkhata Bay", "Rumphi", "Karonga", "Chitipa", "Mzimba",
  "Dowa", "Ntchisi", "Mchinji", "Likoma",
];

const DISTRICT_CARDS = [
  { icon: "fa fa-city",           label: "Lilongwe" },
  { icon: "fa fa-building",       label: "Blantyre" },
  { icon: "fa fa-university",     label: "Zomba"    },
  { icon: "fa fa-mountain",       label: "Mzuzu"    },
  { icon: "fa fa-seedling",       label: "Kasungu"  },
  { icon: "fa fa-water",          label: "Mangochi" },
  { icon: "fa fa-tree",           label: "Salima"   },
  { icon: "fa fa-home",           label: "Mulanje"  },
  { icon: "fa fa-map-marker-alt", label: "Dedza"    },
];

const PROPERTY_TYPES = [
  { icon: "fa fa-home",        label: "House",           desc: "Family homes"        },
  { icon: "fa fa-building",    label: "Flat/Apartment",  desc: "Modern apartments"   },
  { icon: "fa fa-bed",         label: "Single Room",     desc: "Affordable rooms"    },
  { icon: "fa fa-door-closed", label: "Self-Contained",  desc: "Own entrance & bath" },
  { icon: "fa fa-seedling",    label: "Plot of Land",    desc: "Build your dream"    },
  { icon: "fa fa-store",       label: "Commercial Space",desc: "Shops & offices"     },
];

const FAQ_ITEMS = [
  { question: "How do I find a house on PezaHostel?",         answer: "Create a free account, choose your district and budget, then browse all available listings. You can message the landlord directly through the app — no walking required." },
  { question: "Is PezaHostel free for tenants?",              answer: "Yes. Searching for a property and contacting landlords is completely free for tenants. There are no hidden charges whatsoever." },
  { question: "How does PezaHostel verify landlords?",        answer: "Every landlord who registers goes through our identity and property verification process before their listing goes live. This protects tenants from fraud." },
  { question: "What happens if I have a dispute?",            answer: "PezaHostel has a built-in dispute resolution system. Both parties submit their case and our team mediates fairly and quickly." },
  { question: "Can I list my property on PezaHostel?",        answer: "Yes. Create a landlord account, fill in your property details, upload photos, and your listing will be live within 24 hours after verification." },
];

const CARDS_COL1 = [
  { theme: "blue",   icon: "fa fa-shield-alt",    title: "Verified Properties", sub: "All listings checked & approved" },
  { theme: "orange", icon: "fa fa-tag",            title: "Best Prices",         sub: "Affordable for every budget",    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop" },
  { theme: "green",  icon: "fa fa-check-circle",  title: "Trusted Landlords",   sub: "Identity-verified owners"        },
  { theme: "purple", icon: "fa fa-map-marker-alt",title: "All Districts",       sub: "28 districts covered",           image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&auto=format&fit=crop" },
  { theme: "blue",   icon: "fa fa-shield-alt",    title: "Verified Properties", sub: "All listings checked & approved" },
  { theme: "orange", icon: "fa fa-tag",            title: "Best Prices",         sub: "Affordable for every budget",    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop" },
  { theme: "green",  icon: "fa fa-check-circle",  title: "Trusted Landlords",   sub: "Identity-verified owners"        },
  { theme: "purple", icon: "fa fa-map-marker-alt",title: "All Districts",       sub: "28 districts covered",           image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&auto=format&fit=crop" },
];

const CARDS_COL2 = [
  { theme: "cyan",   icon: "fa fa-bolt",      title: "Quick Inquiry",    sub: "Contact landlords in seconds", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&auto=format&fit=crop" },
  { theme: "yellow", icon: "fa fa-headset",   title: "Dispute Support",  sub: "We resolve problems fairly"   },
  { theme: "red",    icon: "fa fa-comments",  title: "Direct Messaging", sub: "Chat with landlords safely",  image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&auto=format&fit=crop" },
  { theme: "pink",   icon: "fa fa-star",      title: "Top Rated",        sub: "Reviews from real tenants"    },
  { theme: "cyan",   icon: "fa fa-bolt",      title: "Quick Inquiry",    sub: "Contact landlords in seconds", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&auto=format&fit=crop" },
  { theme: "yellow", icon: "fa fa-headset",   title: "Dispute Support",  sub: "We resolve problems fairly"   },
  { theme: "red",    icon: "fa fa-comments",  title: "Direct Messaging", sub: "Chat with landlords safely",  image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&auto=format&fit=crop" },
  { theme: "pink",   icon: "fa fa-star",      title: "Top Rated",        sub: "Reviews from real tenants"    },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&family=Righteous&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:    #0d1b3e;
    --blue:    #1a3fa4;
    --orange:  #e8501a;
    --orange2: #c94010;
    --white:   #ffffff;
    --gray-bg: #f4f6fa;
    --dark:    #111827;
    --mid:     #4b5563;
    --radius:  14px;
  }

  html { scroll-behavior: smooth; }
  body {
    font-family: 'Manrope', sans-serif;
    color: var(--dark);
    background: #fff;
    overflow-x: hidden;
  }
  a { text-decoration: none; color: inherit; }
  button { font-family: inherit; cursor: pointer; border: none; background: none; padding: 0; }

  /* ══════════════════════════════════
     HERO — solid dark background, NO image showing through
  ══════════════════════════════════ */
  .ph-hero {
    min-height: 100vh;
    width: 100%;
    /* SOLID dark gradient — no background-image so logo PNG never shows */
    background: linear-gradient(160deg, #050f2d 0%, #0a1a4a 55%, #061a0e 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    padding: 6rem 1.2rem 4rem;
    position: relative;
    overflow: hidden;
  }

  /* Subtle glow effects */
  .ph-hero::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 15% 85%, rgba(232,80,26,0.18) 0%, transparent 50%),
      radial-gradient(ellipse at 85% 15%, rgba(26,63,164,0.25) 0%, transparent 50%);
    pointer-events: none;
  }

  .ph-hero-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    width: 100%;
    max-width: 1200px;
    position: relative;
    z-index: 2;
  }

  .ph-hero-left { flex: 1; min-width: 0; text-align: left; }

  .ph-hero-left h1 {
    font-family: 'Poppins', sans-serif;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800; color: white; line-height: 1.15;
    margin-bottom: 1rem;
  }
  .ph-hero-left h1 em { color: #facc15; font-style: normal; }

  .ph-hero-sub {
    font-size: clamp(0.9rem, 2vw, 1.05rem);
    color: rgba(255,255,255,0.68);
    max-width: 480px; line-height: 1.8;
    margin-bottom: 2rem;
  }

  .ph-hero-btns {
    display: flex; gap: 1rem; flex-wrap: wrap;
  }
  .ph-btn-primary {
    background: var(--orange); color: white;
    padding: 0.85rem 2rem; border-radius: 10px;
    font-size: 0.95rem; font-weight: 700;
    display: inline-flex; align-items: center; gap: 8px;
    transition: background 0.2s; text-decoration: none;
  }
  .ph-btn-primary:hover { background: var(--orange2); }
  .ph-btn-ghost {
    background: rgba(255,255,255,0.1); color: white;
    border: 1.5px solid rgba(255,255,255,0.3);
    padding: 0.85rem 2rem; border-radius: 10px;
    font-size: 0.95rem; font-weight: 700;
    display: inline-flex; align-items: center; gap: 8px;
    transition: all 0.2s; text-decoration: none;
  }
  .ph-btn-ghost:hover { background: rgba(255,255,255,0.2); }

  .ph-hero-stats {
    display: flex; gap: 2.5rem; flex-wrap: wrap;
    margin-top: 2.5rem; padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.12);
  }
  .ph-hero-stat strong {
    display: block; font-family: 'Poppins', sans-serif;
    font-size: 1.6rem; font-weight: 800; color: #facc15;
  }
  .ph-hero-stat span { font-size: 0.78rem; color: rgba(255,255,255,0.55); }

  /* ── ANIMATED CARDS (right side) ── */
  .ph-hero-right {
    flex: 1; display: flex; align-items: center; justify-content: center;
  }
  .ph-cards-mask {
    position: relative; height: 420px; overflow: hidden;
    display: flex; gap: 1.2rem; align-items: flex-start;
  }
  .ph-cards-mask::before,
  .ph-cards-mask::after {
    content: ''; position: absolute; left: 0; right: 0;
    height: 80px; z-index: 3; pointer-events: none;
  }
  .ph-cards-mask::before { top: 0;    background: linear-gradient(to bottom, #050f2d, transparent); }
  .ph-cards-mask::after  { bottom: 0; background: linear-gradient(to top,   #050f2d, transparent); }

  .ph-cards-col { display: flex; flex-direction: column; gap: 1.2rem; }
  .ph-cards-up   { animation: scrollUp   8s linear infinite; }
  .ph-cards-down { animation: scrollDown 10s linear infinite; margin-top: 60px; }
  @keyframes scrollUp   { 0% { transform: translateY(0); }    100% { transform: translateY(-50%); } }
  @keyframes scrollDown { 0% { transform: translateY(-50%); } 100% { transform: translateY(0); } }

  .ph-anim-card {
    width: 170px; border-radius: 16px; padding: 1.2rem 1rem;
    display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem;
    box-shadow: 0 8px 28px rgba(0,0,0,0.2);
    border: 1px solid rgba(255,255,255,0.4);
    backdrop-filter: blur(6px); flex-shrink: 0; transition: transform 0.2s;
  }
  .ph-anim-card:hover { transform: scale(1.04); }
  .ph-anim-card.with-image { padding: 0; }
  .ph-anim-img  { width: 100%; height: 110px; object-fit: cover; border-radius: 16px 16px 0 0; display: block; }
  .ph-anim-body { padding: 0.9rem; display: flex; flex-direction: column; gap: 0.4rem; }
  .ph-anim-icon {
    width: 34px; height: 34px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; color: white; flex-shrink: 0;
  }
  .ph-anim-title { font-size: 0.8rem; font-weight: 800; color: #111; line-height: 1.2; }
  .ph-anim-sub   { font-size: 0.7rem; color: #6b7280; line-height: 1.4; }

  .ph-anim-card.blue   { background: rgba(219,234,254,0.95); } .ph-anim-card.blue   .ph-anim-icon { background: #2563eb; }
  .ph-anim-card.orange { background: rgba(255,237,213,0.95); } .ph-anim-card.orange .ph-anim-icon { background: #e8501a; }
  .ph-anim-card.green  { background: rgba(209,250,229,0.95); } .ph-anim-card.green  .ph-anim-icon { background: #059669; }
  .ph-anim-card.purple { background: rgba(237,233,254,0.95); } .ph-anim-card.purple .ph-anim-icon { background: #7c3aed; }
  .ph-anim-card.cyan   { background: rgba(207,250,254,0.95); } .ph-anim-card.cyan   .ph-anim-icon { background: #0891b2; }
  .ph-anim-card.yellow { background: rgba(254,249,195,0.95); } .ph-anim-card.yellow .ph-anim-icon { background: #d97706; }
  .ph-anim-card.red    { background: rgba(254,226,226,0.95); } .ph-anim-card.red    .ph-anim-icon { background: #dc2626; }
  .ph-anim-card.pink   { background: rgba(252,231,243,0.95); } .ph-anim-card.pink   .ph-anim-icon { background: #db2777; }

  /* Waves at bottom of hero */
  .ph-wave {
    position: absolute; bottom: -0.5rem; left: 0; width: 100%; height: 11rem; z-index: 1;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='0.06' d='M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,176C672,181,768,139,864,128C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L0,320Z'/%3E%3C/svg%3E") repeat-x;
    background-size: 1440px 11rem;
    animation: waves 8s linear infinite;
  }
  .ph-wave2 { animation-direction: reverse; animation-duration: 6s; opacity: 0.3; }
  .ph-wave3 { animation-duration: 4s; opacity: 0.5; }
  @keyframes waves { 0% { background-position-x: 0; } 100% { background-position-x: 1440px; } }

  /* hero responsive */
  @media (max-width: 1024px) {
    .ph-hero-wrapper { flex-direction: column; text-align: center; gap: 2rem; }
    .ph-hero-left { text-align: center; }
    .ph-hero-sub  { margin: 0 auto 2rem; }
    .ph-hero-btns { justify-content: center; }
    .ph-hero-stats { justify-content: center; }
    .ph-cards-mask { height: 280px; }
    .ph-anim-card { width: 148px; }
  }
  @media (max-width: 768px) {
    .ph-hero-right { display: none; }
    .ph-hero-btns { flex-direction: column; align-items: center; }
    .ph-btn-primary, .ph-btn-ghost { width: 100%; max-width: 300px; justify-content: center; }
    .ph-hero-stats { gap: 1.5rem; }
  }

  /* ══════════════════════════════════
     SHARED SECTION STYLES
  ══════════════════════════════════ */
  .ph-sec-label {
    font-size: 0.73rem; font-weight: 700; letter-spacing: 2.5px;
    text-transform: uppercase; color: var(--orange);
    text-align: center; margin-bottom: 0.5rem;
  }
  .ph-sec-title {
    font-family: 'Poppins', sans-serif;
    font-size: clamp(1.6rem, 3.5vw, 2.3rem);
    font-weight: 800; text-align: center; line-height: 1.15; margin-bottom: 0.6rem;
  }
  .ph-sec-title em { font-style: normal; color: var(--orange); }
  .ph-sec-sub {
    text-align: center; font-size: 0.93rem; line-height: 1.8;
    color: var(--mid); max-width: 520px; margin: 0 auto 2.5rem;
  }

  /* ══════════════════════════════════
     DISTRICTS
  ══════════════════════════════════ */
  .ph-dist-sec { background: var(--navy); padding: clamp(3rem,6vw,5.5rem) 1.2rem; }
  .ph-dist-sec .ph-sec-label { color: rgba(255,255,255,0.45); }
  .ph-dist-sec .ph-sec-title { color: white; }
  .ph-dist-sec .ph-sec-sub   { color: rgba(255,255,255,0.42); }

  .ph-dist-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem; max-width: 1100px; margin: 0 auto;
  }
  .ph-dist-card {
    background: rgba(255,255,255,0.07);
    border: 1.5px solid rgba(255,255,255,0.12);
    border-radius: var(--radius); padding: 1.5rem 1rem;
    text-align: center; color: white;
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    transition: all 0.25s;
  }
  .ph-dist-card:hover {
    background: var(--orange); border-color: var(--orange);
    transform: translateY(-5px); box-shadow: 0 12px 30px rgba(232,80,26,0.35);
  }
  .ph-dist-card i { font-size: 1.7rem; color: var(--orange); transition: color 0.25s; margin-bottom: 0.3rem; }
  .ph-dist-card:hover i { color: white; }
  .ph-dist-card h4 { font-size: 0.92rem; font-weight: 700; }
  .ph-dist-count {
    font-size: 0.7rem; font-weight: 700; color: white;
    background: rgba(232,80,26,0.65); border-radius: 20px; padding: 2px 10px;
    transition: background 0.25s;
  }
  .ph-dist-card:hover .ph-dist-count { background: rgba(255,255,255,0.25); }

  @media (max-width: 768px) { .ph-dist-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 400px) { .ph-dist-grid { gap: 0.75rem; } }

  /* ══════════════════════════════════
     PROPERTY TYPES
  ══════════════════════════════════ */
  .ph-types-sec { background: var(--navy); padding: clamp(3rem,6vw,5.5rem) 1.2rem; }
  .ph-types-sec .ph-sec-label { color: rgba(255,255,255,0.45); }
  .ph-types-sec .ph-sec-title { color: white; }
  .ph-types-sec .ph-sec-sub   { color: rgba(255,255,255,0.42); }

  .ph-types-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
    gap: 1rem; max-width: 1100px; margin: 0 auto;
  }
  .ph-type-card {
    background: rgba(255,255,255,0.08);
    border: 1.5px solid rgba(255,255,255,0.14);
    border-radius: var(--radius); padding: 1.8rem 1rem;
    text-align: center; color: white; transition: all 0.25s;
  }
  .ph-type-card:hover {
    background: var(--orange); border-color: var(--orange);
    transform: translateY(-5px); box-shadow: 0 12px 28px rgba(232,80,26,0.35);
  }
  .ph-type-card i { font-size: 1.7rem; color: var(--orange); display: block; margin-bottom: 0.75rem; transition: color 0.25s; }
  .ph-type-card:hover i { color: white; }
  .ph-type-card h4 { font-size: 0.95rem; font-weight: 800; margin-bottom: 0.4rem; }
  .ph-type-card span { font-size: 0.72rem; color: rgba(255,255,255,0.58); transition: color 0.25s; }
  .ph-type-card:hover span { color: rgba(255,255,255,0.9); }

  @media (max-width: 520px) { .ph-types-grid { grid-template-columns: repeat(2, 1fr); } }

  /* ══════════════════════════════════
     LOCATIONS PHOTO GRID
  ══════════════════════════════════ */
  .ph-locs-sec { background: #0a1630; padding: clamp(3rem,6vw,5.5rem) 1.2rem; }
  .ph-locs-sec .ph-sec-title { color: white; }

  .ph-locs-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: 220px 220px;
    gap: 1rem; max-width: 1100px; margin: 2rem auto 0;
  }
  .ph-loc-card {
    border-radius: var(--radius); overflow: hidden;
    position: relative; border: none; background: transparent; padding: 0;
    cursor: pointer;
  }
  .ph-loc-card img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s; }
  .ph-loc-card:hover img { transform: scale(1.06); }
  .ph-loc-card.big { grid-row: 1 / 3; }
  .ph-loc-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(13,27,62,0.85) 0%, transparent 55%);
    display: flex; flex-direction: column; justify-content: flex-end; padding: 1.2rem;
  }
  .ph-loc-overlay small { color: rgba(255,255,255,0.65); font-size: 0.74rem; }
  .ph-loc-overlay h4    { color: white; font-size: 1rem; font-weight: 700; }
  .ph-loc-overlay p     { color: rgba(255,255,255,0.6); font-size: 0.8rem; }

  @media (max-width: 768px) {
    .ph-locs-grid { grid-template-columns: 1fr 1fr; grid-template-rows: auto; }
    .ph-loc-card.big { grid-row: auto; }
    .ph-loc-card { height: 200px; }
  }
  @media (max-width: 520px) {
    .ph-locs-grid { grid-template-columns: 1fr; }
    .ph-loc-card { height: 180px; }
  }

  /* ══════════════════════════════════
     DUAL — TENANT / LANDLORD
  ══════════════════════════════════ */
  .ph-dual-sec {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2rem; padding: clamp(3rem,6vw,5.5rem) 1.2rem;
    max-width: 1100px; margin: 0 auto;
  }
  .ph-dual-card {
    background: white; padding: 2.5rem 2rem; border-radius: var(--radius);
    text-align: center; box-shadow: 0 8px 28px rgba(0,0,0,0.07);
    border: 1px solid #e5e7eb; transition: all 0.3s;
    display: flex; flex-direction: column; align-items: center;
  }
  .ph-dual-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,0.12); }
  .ph-dual-icon { font-size: 2.5rem; margin-bottom: 1rem; }
  .ph-dual-icon.tenant   { color: #2563eb; }
  .ph-dual-icon.landlord { color: #16a34a; }
  .ph-dual-card h3 { font-size: 1.2rem; font-weight: 800; color: var(--navy); margin-bottom: 0.75rem; }
  .ph-dual-card p  { color: var(--mid); font-size: 0.88rem; line-height: 1.75; margin-bottom: 1.5rem; }
  .ph-btn-outline {
    border: 2px solid var(--navy); color: var(--navy); background: transparent;
    padding: 0.55rem 1.4rem; border-radius: 8px; font-size: 0.88rem; font-weight: 700;
    transition: all 0.2s; display: inline-block; text-decoration: none;
  }
  .ph-btn-outline:hover { background: var(--navy); color: white; }

  /* ══════════════════════════════════
     FEATURES
  ══════════════════════════════════ */
  .ph-features-sec { background: var(--gray-bg); padding: clamp(3rem,6vw,5.5rem) 1.2rem; text-align: center; }
  .ph-features-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem; max-width: 1100px; margin: 2.5rem auto 0;
  }
  .ph-feature-card {
    background: white; padding: 2rem; border-radius: var(--radius);
    box-shadow: 0 6px 20px rgba(0,0,0,0.06); transition: transform 0.3s;
  }
  .ph-feature-card:hover { transform: translateY(-6px); }
  .ph-feature-card i { font-size: 2rem; color: var(--blue); display: block; margin-bottom: 1rem; }
  .ph-feature-card h4 { font-size: 1rem; font-weight: 700; color: var(--navy); margin-bottom: 0.5rem; }
  .ph-feature-card p  { font-size: 0.85rem; color: var(--mid); line-height: 1.6; }

  /* ══════════════════════════════════
     FAQ
  ══════════════════════════════════ */
  .ph-faq {
    position: relative;
    padding: clamp(3rem,6vw,5.5rem) 1.2rem clamp(4rem,8vw,6rem);
    background: #1a1a2e; text-align: center; overflow: hidden;
  }
  .ph-faq::before {
    content: ''; position: absolute; inset: 0;
    background: rgba(15,15,35,0.85); z-index: 0;
  }
  .ph-faq-qmark {
    position: absolute; right: 4%; top: 50%; transform: translateY(-50%);
    font-size: clamp(8rem, 20vw, 22rem); font-weight: 900;
    color: rgba(255,255,255,0.03); pointer-events: none; z-index: 1;
    font-family: 'Poppins', sans-serif; line-height: 1;
  }
  .ph-faq-inner { position: relative; z-index: 2; }
  .ph-faq-heading {
    display: inline-block;
    font-size: clamp(2.2rem, 5vw, 3.5rem);
    color: #00bfff; position: relative; letter-spacing: 0.2rem;
    font-family: 'Poppins', sans-serif; font-weight: 600;
    margin-bottom: 3rem; padding: 0.5rem 1.5rem;
  }
  .ph-faq-heading::before {
    content: ''; position: absolute; top: 0; left: 0;
    width: 1.8rem; height: 1.8rem;
    border-top: 0.32rem solid #00bfff; border-left: 0.32rem solid #00bfff;
  }
  .ph-faq-heading::after {
    content: ''; position: absolute; bottom: 0; right: 0;
    width: 1.8rem; height: 1.8rem;
    border-bottom: 0.32rem solid #00bfff; border-right: 0.32rem solid #00bfff;
  }
  .ph-faq-list { max-width: 860px; margin: 0 auto; }
  .ph-acc { margin-bottom: 0.6rem; cursor: pointer; }
  .ph-acc-header { display: flex; align-items: stretch; }
  .ph-acc-plus {
    width: 52px; flex-shrink: 0; background: #1a1a2e;
    border: 2px solid #00bfff;
    display: flex; align-items: center; justify-content: center; transition: all 0.3s;
  }
  .ph-acc-plus span {
    font-size: 1.8rem; color: #00bfff; font-weight: 300;
    line-height: 1; transition: transform 0.3s, color 0.3s; display: block;
  }
  .ph-acc-label {
    flex: 1; background: #00bfff; min-height: 54px;
    display: flex; align-items: center; padding: 0 1.6rem; transition: background 0.3s;
  }
  .ph-acc-label h3 {
    font-size: clamp(0.82rem, 2vw, 1rem); font-weight: 600;
    color: white; margin: 0; text-align: left; font-family: 'Poppins', sans-serif;
  }
  .ph-acc:hover .ph-acc-label { background: #00aadd; }
  .ph-acc:hover .ph-acc-plus  { background: #00bfff; }
  .ph-acc:hover .ph-acc-plus span { color: white; }
  .ph-acc.open .ph-acc-plus   { background: #00bfff; }
  .ph-acc.open .ph-acc-plus span { transform: rotate(45deg); color: white; }
  .ph-acc-body {
    max-height: 0; overflow: hidden;
    transition: max-height 0.4s ease, padding 0.3s;
    background: rgba(0,191,255,0.08);
    border-left: 3px solid #00bfff; text-align: left;
  }
  .ph-acc.open .ph-acc-body { max-height: 400px; padding: 1.2rem 1.8rem; }
  .ph-acc-body p { font-size: 0.95rem; line-height: 1.8; color: rgba(255,255,255,0.72); font-family: 'Poppins', sans-serif; }

  @media (max-width: 520px) {
    .ph-acc-plus { width: 44px; }
    .ph-acc-label { padding: 0 1rem; min-height: 48px; }
  }

  /* ══════════════════════════════════
     CTA
  ══════════════════════════════════ */
  .ph-cta-sec {
    background: linear-gradient(135deg, #0d1b3e 0%, #1a3fa4 100%);
    color: white; text-align: center;
    padding: clamp(3rem,6vw,5.5rem) 1.2rem;
  }
  .ph-cta-sec h2 { font-size: clamp(1.5rem,3vw,2rem); font-weight: 800; margin-bottom: 0.75rem; color: white; }
  .ph-cta-sec p  { color: rgba(255,255,255,0.75); margin-bottom: 2rem; font-size: 1rem; }

  /* ══════════════════════════════════
     FOOTER
  ══════════════════════════════════ */
  .ph-footer { background: #070f24; color: rgba(255,255,255,0.5); padding: clamp(2rem,5vw,3.5rem) 1.2rem 1.5rem; }
  .ph-footer-grid {
    display: grid; grid-template-columns: 2fr 1fr 1fr;
    gap: 2rem; max-width: 1100px; margin: 0 auto 2rem;
  }
  .ph-footer-brand strong { display: block; color: white; font-size: 1rem; font-weight: 800; margin-bottom: 0.5rem; }
  .ph-footer-brand p { font-size: 0.82rem; line-height: 1.7; color: rgba(255,255,255,0.38); max-width: 260px; }
  .ph-footer-col h5 { color: rgba(255,255,255,0.8); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1rem; }
  .ph-footer-col a { display: block; color: rgba(255,255,255,0.4); font-size: 0.82rem; margin-bottom: 0.5rem; transition: color 0.2s; }
  .ph-footer-col a:hover { color: var(--orange); }
  .ph-footer-bottom { border-top: 1px solid rgba(255,255,255,0.07); padding-top: 1.2rem; text-align: center; font-size: 0.76rem; color: rgba(255,255,255,0.25); max-width: 1100px; margin: 0 auto; }

  @media (max-width: 768px) {
    .ph-footer-grid { grid-template-columns: 1fr 1fr; }
    .ph-footer-brand { grid-column: 1 / -1; }
    .ph-footer-brand p { max-width: 100%; }
  }
  @media (max-width: 480px) { .ph-footer-grid { grid-template-columns: 1fr; } }
`;

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero({ isAuthenticated }) {
  const navigate = useNavigate();
  return (
    <section className="ph-hero">
      <div className="ph-hero-wrapper">
        {/* Left */}
        <div className="ph-hero-left">
          <h1>Find Your <em>Perfect Home</em><br />Anywhere in Malawi</h1>
          <p className="ph-hero-sub">
            No more walking from door to door. Browse verified houses, flats,
            and plots for rent or sale across all 28 districts — all from your phone.
          </p>
          <div className="ph-hero-btns">
            <button className="ph-btn-primary" onClick={() => navigate(isAuthenticated ? "/properties" : "/register")}>
              <i className="fa fa-search" /> Find a Property
            </button>
            <button className="ph-btn-ghost" onClick={() => navigate(isAuthenticated ? "/add-property" : "/register")}>
              <i className="fa fa-building" /> List Your Property
            </button>
          </div>
          <div className="ph-hero-stats">
            <div className="ph-hero-stat"><strong>340+</strong><span>Properties Listed</span></div>
            <div className="ph-hero-stat"><strong>28</strong><span>Districts Covered</span></div>
            <div className="ph-hero-stat"><strong>🛡️</strong><span>Dispute Protection</span></div>
          </div>
        </div>

        {/* Right — animated cards */}
        <div className="ph-hero-right">
          <div className="ph-cards-mask">
            <div className="ph-cards-col ph-cards-up">
              {CARDS_COL1.map((c, i) => (
                <div key={i} className={`ph-anim-card ${c.theme}${c.image ? " with-image" : ""}`}>
                  {c.image && <img src={c.image} alt={c.title} className="ph-anim-img" />}
                  <div className={c.image ? "ph-anim-body" : ""}>
                    <div className="ph-anim-icon"><i className={c.icon} /></div>
                    <div className="ph-anim-title">{c.title}</div>
                    <div className="ph-anim-sub">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="ph-cards-col ph-cards-down">
              {CARDS_COL2.map((c, i) => (
                <div key={i} className={`ph-anim-card ${c.theme}${c.image ? " with-image" : ""}`}>
                  {c.image && <img src={c.image} alt={c.title} className="ph-anim-img" />}
                  <div className={c.image ? "ph-anim-body" : ""}>
                    <div className="ph-anim-icon"><i className={c.icon} /></div>
                    <div className="ph-anim-title">{c.title}</div>
                    <div className="ph-anim-sub">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Waves */}
      <div className="ph-wave" />
      <div className="ph-wave ph-wave2" />
      <div className="ph-wave ph-wave3" />
    </section>
  );
}

// ── DISTRICTS ─────────────────────────────────────────────────────────────────
function DistrictsSection({ isAuthenticated }) {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/properties?limit=500`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.properties)) {
          const c = {};
          data.properties.forEach((p) => { if (p.district) c[p.district] = (c[p.district] || 0) + 1; });
          setCounts(c);
        }
      })
      .catch(() => {});
  }, []);

  const go = (d) => navigate(isAuthenticated ? `/properties?district=${encodeURIComponent(d)}` : "/login");

  return (
    <section className="ph-dist-sec">
      <p className="ph-sec-label">Browse by location</p>
      <h2 className="ph-sec-title" style={{ color: "white" }}>Find Properties by <em>District</em></h2>
      <p className="ph-sec-sub">Click your district to see all available properties near you right now.</p>
      <div className="ph-dist-grid">
        {DISTRICT_CARDS.map((d) => (
          <button key={d.label} className="ph-dist-card" onClick={() => go(d.label)}>
            <i className={d.icon} />
            <h4>{d.label}</h4>
            <span className="ph-dist-count">
              {counts[d.label] ? `${counts[d.label]} listing${counts[d.label] !== 1 ? "s" : ""}` : "Browse →"}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

// ── PROPERTY TYPES ────────────────────────────────────────────────────────────
function TypesSection({ isAuthenticated }) {
  const navigate = useNavigate();
  const go = (type) => navigate(isAuthenticated ? `/properties?type=${encodeURIComponent(type)}` : "/login");
  return (
    <section className="ph-types-sec">
      <p className="ph-sec-label">What are you looking for?</p>
      <h2 className="ph-sec-title" style={{ color: "white" }}>Browse by <em>Property Type</em></h2>
      <p className="ph-sec-sub">Whether you need a room, a house, or land to build on — we have it all across Malawi.</p>
      <div className="ph-types-grid">
        {PROPERTY_TYPES.map((t) => (
          <button key={t.label} className="ph-type-card" onClick={() => go(t.label)}>
            <i className={t.icon} />
            <h4>{t.label}</h4>
            <span>{t.desc}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

// ── LOCATIONS PHOTO GRID ──────────────────────────────────────────────────────
function LocationsSection({ isAuthenticated }) {
  const navigate = useNavigate();
  const go = () => navigate(isAuthenticated ? "/properties" : "/login");
  const locs = [
    { img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop", big: true, count: "12+ Properties", name: "Lilongwe",  desc: "Capital City — All Types" },
    { img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&auto=format&fit=crop",           count: "9 Properties",   name: "Blantyre",  desc: "Commercial Hub"           },
    { img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop",           count: "5 Properties",   name: "Zomba",     desc: "University Town"          },
    { img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop",           count: "4 Properties",   name: "Mzuzu",     desc: "Northern Region Hub"      },
    { img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop",           count: "6 Properties",   name: "Mangochi",  desc: "Lakeshore Living"         },
  ];
  return (
    <section className="ph-locs-sec">
      <p className="ph-sec-label">Our property areas</p>
      <h2 className="ph-sec-title" style={{ color: "white" }}>Top Locations Across <em>Malawi</em></h2>
      <div className="ph-locs-grid">
        {locs.map((l) => (
          <button key={l.name} className={`ph-loc-card${l.big ? " big" : ""}`} onClick={go}>
            <img src={l.img} alt={l.name} />
            <div className="ph-loc-overlay">
              <small>{l.count}</small>
              <h4>{l.name}</h4>
              <p>{l.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

// ── DUAL SECTION ──────────────────────────────────────────────────────────────
function DualSection() {
  return (
    <div className="ph-dual-sec">
      <div className="ph-dual-card">
        <div className="ph-dual-icon tenant"><i className="fa fa-user" /></div>
        <h3>For Tenants</h3>
        <p>Browse verified properties, compare prices, view photos, and contact landlords directly — no middlemen, no walking from door to door.</p>
        <a href="/register" className="ph-btn-outline">Find a Home</a>
      </div>
      <div className="ph-dual-card">
        <div className="ph-dual-icon landlord"><i className="fa fa-building" /></div>
        <h3>For Landlords</h3>
        <p>List your house, flat, room, or plot for free. Receive inquiries from verified tenants and manage everything from your dashboard.</p>
        <a href="/register" className="ph-btn-outline">List a Property</a>
      </div>
    </div>
  );
}

// ── FEATURES ──────────────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    { icon: "fa fa-search",        title: "Smart Search",       desc: "Filter by district, price, property type, and bedrooms instantly." },
    { icon: "fa fa-comments",      title: "Direct Messaging",   desc: "Tenants connect directly with landlords — no agents, no extra fees." },
    { icon: "fa fa-shield-alt",    title: "Verified Listings",  desc: "Every landlord is verified before listing to protect tenants from fraud." },
    { icon: "fa fa-balance-scale", title: "Dispute Resolution", desc: "If a problem arises with your landlord, our team mediates and resolves it fairly." },
  ];
  return (
    <section className="ph-features-sec">
      <p className="ph-sec-label">Why choose us</p>
      <h2 className="ph-sec-title">Why Choose <em>PezaNyumba?</em></h2>
      <div className="ph-features-grid">
        {features.map((f) => (
          <div className="ph-feature-card" key={f.title}>
            <i className={f.icon} />
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <section className="ph-faq">
      <div className="ph-faq-qmark" aria-hidden="true">?</div>
      <div className="ph-faq-inner">
        <h2 className="ph-faq-heading">FAQ</h2>
        <div className="ph-faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className={`ph-acc${open === i ? " open" : ""}`} onClick={() => setOpen(open === i ? null : i)}>
              <div className="ph-acc-header">
                <div className="ph-acc-plus"><span>+</span></div>
                <div className="ph-acc-label"><h3>{item.question}</h3></div>
              </div>
              <div className="ph-acc-body"><p>{item.answer}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="ph-footer">
      <div className="ph-footer-grid">
        <div className="ph-footer-brand">
          <strong>PezaNyumba 🇲🇼</strong>
          <p>Malawi's number one platform for finding and listing houses, flats, rooms, and plots. No more walking from door to door.</p>
        </div>
        <div className="ph-footer-col">
          <h5>Platform</h5>
          <a href="/properties">Browse properties</a>
          <a href="/register">List a property</a>
          <a href="/login">Login</a>
          <a href="/register">Create account</a>
        </div>
        <div className="ph-footer-col">
          <h5>Support</h5>
          <a href="/contact">Contact us</a>
          <a href="/about">About PezaNyumba</a>
          <a href="/contact">Report a dispute</a>
        </div>
      </div>
      <div className="ph-footer-bottom">
        © {new Date().getFullYear()} PezaNyumba. All rights reserved. Made with ❤️ in Malawi 🇲🇼
      </div>
    </footer>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function Home() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      {/* NO Navbar here — Navbar.jsx handles it separately */}
      <Hero isAuthenticated={isAuthenticated} />
      <DistrictsSection isAuthenticated={isAuthenticated} />
      <TypesSection isAuthenticated={isAuthenticated} />
      <LocationsSection isAuthenticated={isAuthenticated} />
      <DualSection />
      <FeaturesSection />
      <FAQSection />
      <section className="ph-cta-sec">
        <h2>Ready to find your home?</h2>
        <p>Join thousands of Malawians already using PezaHostel to find and list properties.</p>
        <a href="/register" className="ph-btn-primary">
          <i className="fa fa-user-plus" /> Create Free Account
        </a>
      </section>
      <Footer />
    </>
  );
}