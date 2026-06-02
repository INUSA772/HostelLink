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
    --teal-dark:   #0d4a40;
    --teal:        #1a5c52;
    --teal-mid:    #2d8a72;
    --teal-light:  #e8f5f2;
    --teal-pale:   #f0faf7;
    --cream:       #f8f9f7;
    --white:       #ffffff;
    --gray-bg:     #f4f6f4;
    --dark:        #0a0a0a;
    --mid:         #4b5563;
    --light-border:#e2ede9;
    --radius:      14px;
    --green-check: #22c55e;
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
     HERO — real photo background with dark overlay
  ══════════════════════════════════ */
  .ph-hero {
    min-height: 100vh;
    width: 100%;
    background-image: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    padding: 6rem 1.2rem 4rem;
    position: relative;
    overflow: hidden;
  }

  /* Dark overlay so text stays readable */
  .ph-hero::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(
      160deg,
      rgba(5, 22, 10, 0.78) 0%,
      rgba(10, 40, 25, 0.72) 50%,
      rgba(5, 30, 18, 0.80) 100%
    );
    pointer-events: none;
    z-index: 1;
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

  /* All hero direct children need z-index above overlay */
  .ph-hero > * { position: relative; z-index: 2; }

  .ph-hero-left { flex: 1; min-width: 0; text-align: left; }

  /* Pill badge like TandPay */
  .ph-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 999px;
    padding: 0.4rem 1rem;
    font-size: 0.82rem;
    font-weight: 600;
    color: rgba(255,255,255,0.90);
    margin-bottom: 1.5rem;
    backdrop-filter: blur(6px);
  }
  .ph-hero-badge-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--green-check);
    flex-shrink: 0;
  }

  .ph-hero-left h1 {
    font-family: 'Poppins', sans-serif;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800; color: white; line-height: 1.15;
    margin-bottom: 1rem;
  }
  .ph-hero-left h1 em { color: #4dd9b8; font-style: normal; }

  .ph-hero-sub {
    font-size: clamp(0.9rem, 2vw, 1.05rem);
    color: rgba(255,255,255,0.75);
    max-width: 480px; line-height: 1.8;
    margin-bottom: 2rem;
  }

  .ph-hero-btns {
    display: flex; gap: 1rem; flex-wrap: wrap;
  }
  .ph-btn-primary {
    background: var(--teal); color: white;
    padding: 0.85rem 2rem; border-radius: 10px;
    font-size: 0.95rem; font-weight: 700;
    display: inline-flex; align-items: center; gap: 8px;
    transition: background 0.2s; text-decoration: none;
    box-shadow: 0 4px 16px rgba(13,74,64,0.25);
  }
  .ph-btn-primary:hover { background: var(--teal-dark); }
  .ph-btn-ghost {
    background: rgba(255,255,255,0.12); color: white;
    border: 1.5px solid rgba(255,255,255,0.4);
    padding: 0.85rem 2rem; border-radius: 10px;
    font-size: 0.95rem; font-weight: 700;
    display: inline-flex; align-items: center; gap: 8px;
    transition: all 0.2s; text-decoration: none;
    backdrop-filter: blur(4px);
  }
  .ph-btn-ghost:hover { background: rgba(255,255,255,0.22); }

  /* Trust badges row like TandPay */
  .ph-hero-trust {
    display: flex; gap: 2rem; flex-wrap: wrap;
    margin-top: 1.8rem;
  }
  .ph-hero-trust-item {
    display: flex; align-items: center; gap: 6px;
    font-size: 0.84rem; font-weight: 600; color: rgba(255,255,255,0.80);
  }
  .ph-hero-trust-item i { color: var(--green-check); font-size: 1rem; }

  .ph-hero-stats {
    display: flex; gap: 2.5rem; flex-wrap: wrap;
    margin-top: 2rem; padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.15);
  }
  .ph-hero-stat strong {
    display: block; font-family: 'Poppins', sans-serif;
    font-size: 1.6rem; font-weight: 800; color: #4dd9b8;
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
  .ph-cards-mask::before { top: 0;    background: linear-gradient(to bottom, rgba(5,22,10,0.7), transparent); }
  .ph-cards-mask::after  { bottom: 0; background: linear-gradient(to top,   rgba(5,22,10,0.7), transparent); }

  .ph-cards-col { display: flex; flex-direction: column; gap: 1.2rem; }
  .ph-cards-up   { animation: scrollUp   18s linear infinite; }
  .ph-cards-down { animation: scrollDown 22s linear infinite; margin-top: 60px; }
  @keyframes scrollUp   { 0% { transform: translateY(0); }    100% { transform: translateY(-50%); } }
  @keyframes scrollDown { 0% { transform: translateY(-50%); } 100% { transform: translateY(0); } }

  .ph-anim-card {
    width: 170px; border-radius: 16px; padding: 1.2rem 1rem;
    display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem;
    box-shadow: 0 8px 28px rgba(0,0,0,0.08);
    border: 1px solid rgba(0,0,0,0.07);
    background: white;
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
    background: var(--teal);
  }
  .ph-anim-title { font-size: 0.8rem; font-weight: 800; color: #111; line-height: 1.2; }
  .ph-anim-sub   { font-size: 0.7rem; color: #6b7280; line-height: 1.4; }

  /* All cards white with teal icons */
  .ph-anim-card.blue,
  .ph-anim-card.orange,
  .ph-anim-card.green,
  .ph-anim-card.purple,
  .ph-anim-card.cyan,
  .ph-anim-card.yellow,
  .ph-anim-card.red,
  .ph-anim-card.pink { background: white; }

  .ph-anim-card.blue   .ph-anim-icon { background: var(--teal); }
  .ph-anim-card.orange .ph-anim-icon { background: var(--teal-mid); }
  .ph-anim-card.green  .ph-anim-icon { background: #059669; }
  .ph-anim-card.purple .ph-anim-icon { background: var(--teal-dark); }
  .ph-anim-card.cyan   .ph-anim-icon { background: #0891b2; }
  .ph-anim-card.yellow .ph-anim-icon { background: var(--teal-mid); }
  .ph-anim-card.red    .ph-anim-icon { background: var(--teal); }
  .ph-anim-card.pink   .ph-anim-icon { background: #0d6e5e; }

  /* Waves at bottom of hero */
  .ph-wave {
    position: absolute; bottom: -0.5rem; left: 0; width: 100%; height: 11rem; z-index: 3;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='0.04' d='M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,176C672,181,768,139,864,128C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L0,320Z'/%3E%3C/svg%3E") repeat-x;
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
    .ph-hero-trust { justify-content: center; }
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
     TRUST BAR — like TandPay's bottom trust row
  ══════════════════════════════════ */
  .ph-trust-bar {
    background: var(--cream);
    border-top: 1px solid var(--light-border);
    border-bottom: 1px solid var(--light-border);
    padding: 1.2rem 1.2rem;
  }
  .ph-trust-bar-inner {
    max-width: 1100px; margin: 0 auto;
    display: flex; align-items: center; justify-content: center;
    flex-wrap: wrap; gap: 2rem;
  }
  .ph-trust-item {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.84rem; font-weight: 600; color: var(--mid);
  }
  .ph-trust-item i { font-size: 1.1rem; color: var(--teal); }
  .ph-trust-divider {
    width: 1px; height: 28px; background: var(--light-border);
  }
  @media (max-width: 640px) {
    .ph-trust-divider { display: none; }
  }

  /* ══════════════════════════════════
     SHARED SECTION STYLES
  ══════════════════════════════════ */
  .ph-sec-label {
    font-size: 0.73rem; font-weight: 700; letter-spacing: 2.5px;
    text-transform: uppercase; color: var(--teal-mid);
    text-align: center; margin-bottom: 0.5rem;
  }
  .ph-sec-title {
    font-family: 'Poppins', sans-serif;
    font-size: clamp(1.6rem, 3.5vw, 2.3rem);
    font-weight: 800; text-align: center; line-height: 1.15; margin-bottom: 0.6rem;
  }
  .ph-sec-title em { font-style: normal; color: var(--teal-mid); }
  .ph-sec-sub {
    text-align: center; font-size: 0.93rem; line-height: 1.8;
    color: var(--mid); max-width: 520px; margin: 0 auto 2.5rem;
  }

  /* ══════════════════════════════════
     SEARCH BAR
  ══════════════════════════════════ */
  .ph-search-sec {
    background: white;
    padding: 2rem 1.2rem 0;
    border-bottom: 1px solid var(--light-border);
  }
  .ph-search-wrap {
    max-width: 820px; margin: 0 auto;
    display: flex; gap: 0.75rem; flex-wrap: wrap;
    background: white; border: 2px solid var(--light-border);
    border-radius: 14px; padding: 0.6rem 0.6rem 0.6rem 1.2rem;
    box-shadow: 0 4px 24px rgba(13,74,64,0.08);
    transition: border-color 0.2s;
  }
  .ph-search-wrap:focus-within { border-color: var(--teal); }
  .ph-search-field {
    flex: 1; min-width: 160px; display: flex; align-items: center; gap: 8px;
  }
  .ph-search-field i { color: var(--teal); font-size: 0.95rem; flex-shrink: 0; }
  .ph-search-field input, .ph-search-field select {
    border: none; outline: none; font-family: 'Manrope', sans-serif;
    font-size: 0.9rem; font-weight: 600; color: var(--dark);
    background: transparent; width: 100%; min-width: 0;
  }
  .ph-search-field select option { font-weight: 500; }
  .ph-search-field input::placeholder { color: #9ca3af; font-weight: 500; }
  .ph-search-divider { width: 1px; background: var(--light-border); align-self: stretch; flex-shrink: 0; }
  .ph-search-btn {
    background: var(--teal); color: white; border: none; cursor: pointer;
    padding: 0.65rem 1.4rem; border-radius: 10px;
    font-size: 0.9rem; font-weight: 700; font-family: 'Manrope', sans-serif;
    display: flex; align-items: center; gap: 6px;
    transition: background 0.2s; white-space: nowrap; flex-shrink: 0;
  }
  .ph-search-btn:hover { background: var(--teal-dark); }
  .ph-search-tags {
    display: flex; gap: 0.5rem; flex-wrap: wrap;
    max-width: 820px; margin: 0.9rem auto 0; padding-bottom: 1.4rem;
  }
  .ph-search-tag {
    background: var(--teal-pale); border: 1px solid var(--light-border);
    color: var(--teal-dark); font-size: 0.74rem; font-weight: 700;
    padding: 0.3rem 0.85rem; border-radius: 999px; cursor: pointer;
    transition: all 0.18s; font-family: 'Manrope', sans-serif; border: none;
  }
  .ph-search-tag:hover { background: var(--teal); color: white; }
  @media (max-width: 600px) {
    .ph-search-wrap { flex-direction: column; padding: 0.8rem; gap: 0.5rem; }
    .ph-search-divider { height: 1px; width: 100%; }
    .ph-search-btn { width: 100%; justify-content: center; }
  }

  /* ══════════════════════════════════
     DISTRICTS — sliding carousel
  ══════════════════════════════════ */
  .ph-dist-sec { background: var(--gray-bg); padding: clamp(2.5rem,5vw,4.5rem) 0; overflow: hidden; }
  .ph-dist-sec-inner { padding: 0 1.2rem; max-width: 1200px; margin: 0 auto; }
  .ph-dist-sec .ph-sec-label { color: var(--teal-mid); }
  .ph-dist-sec .ph-sec-title { color: var(--dark); }
  .ph-dist-sec .ph-sec-sub   { color: var(--mid); }

  /* Carousel track */
  .ph-dist-carousel-outer {
    position: relative; margin-top: 1.8rem; overflow: hidden;
  }
  /* left/right fade edges */
  .ph-dist-carousel-outer::before,
  .ph-dist-carousel-outer::after {
    content: ''; position: absolute; top: 0; bottom: 0; width: 80px; z-index: 2; pointer-events: none;
  }
  .ph-dist-carousel-outer::before { left: 0;  background: linear-gradient(to right, var(--gray-bg), transparent); }
  .ph-dist-carousel-outer::after  { right: 0; background: linear-gradient(to left,  var(--gray-bg), transparent); }

  .ph-dist-track {
    display: flex; gap: 1.2rem;
    width: max-content;
    animation: distSlide 40s linear infinite;
  }
  .ph-dist-track:hover { animation-play-state: paused; }
  @keyframes distSlide {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  /* Each district card in carousel */
  .ph-dcar {
    width: 280px; flex-shrink: 0; border-radius: 16px;
    overflow: hidden; background: white; cursor: pointer;
    border: 1.5px solid var(--light-border);
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    transition: transform 0.25s, box-shadow 0.25s;
    text-decoration: none; color: inherit; display: block;
  }
  .ph-dcar:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(13,74,64,0.15); border-color: var(--teal-mid); }

  /* Image strip — up to 3 images shown as a mosaic */
  .ph-dcar-imgs {
    height: 160px; position: relative; background: var(--teal-light);
    display: grid; gap: 2px;
  }
  .ph-dcar-imgs.one   { grid-template-columns: 1fr; }
  .ph-dcar-imgs.two   { grid-template-columns: 1fr 1fr; }
  .ph-dcar-imgs.three { grid-template-columns: 2fr 1fr; grid-template-rows: 1fr 1fr; }
  .ph-dcar-imgs.three .ph-dcar-img:first-child { grid-row: 1 / 3; }

  .ph-dcar-img {
    overflow: hidden; background: var(--teal-light);
  }
  .ph-dcar-img img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform 0.4s;
  }
  .ph-dcar:hover .ph-dcar-img img { transform: scale(1.06); }

  /* Fallback icon when no images */
  .ph-dcar-no-img {
    height: 160px; display: flex; align-items: center; justify-content: center;
    background: var(--teal-light); font-size: 3rem; color: var(--teal-mid); opacity: 0.5;
  }

  /* District badge overlay */
  .ph-dcar-badge {
    position: absolute; top: 10px; left: 10px;
    background: rgba(13,74,64,0.85); color: white;
    font-size: 0.68rem; font-weight: 700; padding: 3px 10px;
    border-radius: 20px; backdrop-filter: blur(4px);
    letter-spacing: 0.3px;
  }
  .ph-dcar-count-badge {
    position: absolute; top: 10px; right: 10px;
    background: var(--teal); color: white;
    font-size: 0.66rem; font-weight: 700; padding: 3px 9px;
    border-radius: 20px;
  }

  /* Card body */
  .ph-dcar-body { padding: 0.9rem 1rem; }
  .ph-dcar-name {
    font-size: 1rem; font-weight: 800; color: var(--dark);
    display: flex; align-items: center; gap: 6px; margin-bottom: 0.35rem;
  }
  .ph-dcar-name i { color: var(--teal); font-size: 0.85rem; }
  .ph-dcar-meta {
    display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.6rem;
  }
  .ph-dcar-meta-item {
    font-size: 0.72rem; color: var(--mid); display: flex; align-items: center; gap: 4px;
  }
  .ph-dcar-meta-item i { color: var(--teal-mid); }

  /* Mini property previews inside card */
  .ph-dcar-props { display: flex; flex-direction: column; gap: 0.4rem; }
  .ph-dcar-prop {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.4rem 0.5rem; border-radius: 8px;
    background: var(--teal-pale); border: 1px solid var(--light-border);
    font-size: 0.74rem;
  }
  .ph-dcar-prop-img {
    width: 34px; height: 34px; border-radius: 6px;
    object-fit: cover; flex-shrink: 0; background: var(--teal-light);
  }
  .ph-dcar-prop-info { flex: 1; min-width: 0; }
  .ph-dcar-prop-title { font-weight: 700; color: var(--dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ph-dcar-prop-price { color: var(--teal-dark); font-weight: 800; font-size: 0.7rem; }

  .ph-dcar-footer {
    padding: 0.65rem 1rem; border-top: 1px solid var(--light-border);
    display: flex; align-items: center; justify-content: space-between;
    background: var(--teal-pale);
  }
  .ph-dcar-footer span { font-size: 0.75rem; font-weight: 600; color: var(--teal); }
  .ph-dcar-footer i { font-size: 0.8rem; color: var(--teal-mid); }

  /* Nav arrows */
  .ph-dist-nav {
    display: flex; justify-content: center; gap: 0.75rem; margin-top: 1.4rem; padding: 0 1.2rem;
  }
  .ph-dist-nav-btn {
    width: 40px; height: 40px; border-radius: 50%;
    background: white; border: 1.5px solid var(--light-border);
    color: var(--teal); font-size: 1rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .ph-dist-nav-btn:hover { background: var(--teal); color: white; border-color: var(--teal); }

  /* "View all" pill */
  .ph-dist-viewall {
    display: flex; justify-content: center; margin-top: 1.4rem; padding: 0 1.2rem 0.5rem;
  }
  .ph-dist-viewall a {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--teal); color: white;
    padding: 0.6rem 1.8rem; border-radius: 999px;
    font-size: 0.85rem; font-weight: 700; text-decoration: none;
    transition: background 0.2s; box-shadow: 0 4px 14px rgba(13,74,64,0.2);
  }
  .ph-dist-viewall a:hover { background: var(--teal-dark); }

  /* ══════════════════════════════════
     PROPERTY TYPES
  ══════════════════════════════════ */
  .ph-types-sec { background: white; padding: clamp(3rem,6vw,5.5rem) 1.2rem; }
  .ph-types-sec .ph-sec-label { color: var(--teal-mid); }
  .ph-types-sec .ph-sec-title { color: var(--dark); }
  .ph-types-sec .ph-sec-sub   { color: var(--mid); }

  .ph-types-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
    gap: 1rem; max-width: 1100px; margin: 0 auto;
  }
  .ph-type-card {
    background: var(--teal-pale);
    border: 1.5px solid var(--light-border);
    border-radius: var(--radius); padding: 1.8rem 1rem;
    text-align: center; color: var(--dark); transition: all 0.25s;
  }
  .ph-type-card:hover {
    background: var(--teal); border-color: var(--teal); color: white;
    transform: translateY(-5px); box-shadow: 0 12px 28px rgba(26,92,82,0.20);
  }
  .ph-type-card i { font-size: 1.7rem; color: var(--teal); display: block; margin-bottom: 0.75rem; transition: color 0.25s; }
  .ph-type-card:hover i { color: white; }
  .ph-type-card h4 { font-size: 0.95rem; font-weight: 800; margin-bottom: 0.4rem; }
  .ph-type-card span { font-size: 0.72rem; color: var(--mid); transition: color 0.25s; }
  .ph-type-card:hover span { color: rgba(255,255,255,0.80); }

  @media (max-width: 520px) { .ph-types-grid { grid-template-columns: repeat(2, 1fr); } }

  /* ══════════════════════════════════
     LOCATIONS PHOTO GRID
  ══════════════════════════════════ */
  .ph-locs-sec { background: var(--teal-pale); padding: clamp(3rem,6vw,5.5rem) 1.2rem; }
  .ph-locs-sec .ph-sec-label { color: var(--teal-mid); }
  .ph-locs-sec .ph-sec-title { color: var(--dark); }

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
    background: linear-gradient(to top, rgba(13,74,64,0.80) 0%, transparent 55%);
    display: flex; flex-direction: column; justify-content: flex-end; padding: 1.2rem;
  }
  .ph-loc-overlay small { color: rgba(255,255,255,0.7); font-size: 0.74rem; }
  .ph-loc-overlay h4    { color: white; font-size: 1rem; font-weight: 700; }
  .ph-loc-overlay p     { color: rgba(255,255,255,0.65); font-size: 0.8rem; }

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
    text-align: center; box-shadow: 0 8px 28px rgba(13,74,64,0.08);
    border: 1px solid var(--light-border); transition: all 0.3s;
    display: flex; flex-direction: column; align-items: center;
  }
  .ph-dual-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(13,74,64,0.14); }
  .ph-dual-icon { font-size: 2.5rem; margin-bottom: 1rem; }
  .ph-dual-icon.tenant   { color: var(--teal); }
  .ph-dual-icon.landlord { color: var(--teal-mid); }
  .ph-dual-card h3 { font-size: 1.2rem; font-weight: 800; color: var(--dark); margin-bottom: 0.75rem; }
  .ph-dual-card p  { color: var(--mid); font-size: 0.88rem; line-height: 1.75; margin-bottom: 1.5rem; }
  .ph-btn-outline {
    border: 2px solid var(--teal); color: var(--teal); background: transparent;
    padding: 0.55rem 1.4rem; border-radius: 8px; font-size: 0.88rem; font-weight: 700;
    transition: all 0.2s; display: inline-block; text-decoration: none;
  }
  .ph-btn-outline:hover { background: var(--teal); color: white; }

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
    box-shadow: 0 6px 20px rgba(13,74,64,0.07); transition: transform 0.3s;
    border: 1px solid var(--light-border);
  }
  .ph-feature-card:hover { transform: translateY(-6px); }
  .ph-feature-card i { font-size: 2rem; color: var(--teal); display: block; margin-bottom: 1rem; }
  .ph-feature-card h4 { font-size: 1rem; font-weight: 700; color: var(--dark); margin-bottom: 0.5rem; }
  .ph-feature-card p  { font-size: 0.85rem; color: var(--mid); line-height: 1.6; }

  /* ══════════════════════════════════
     PROBLEM SECTION — like TandPay's 3-card problem layout
  ══════════════════════════════════ */
  .ph-problem-sec {
    background: white;
    padding: clamp(3rem,6vw,5.5rem) 1.2rem;
  }
  .ph-problem-label {
    display: inline-block;
    background: var(--teal-light);
    color: var(--teal);
    font-size: 0.78rem; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    padding: 0.4rem 1.2rem; border-radius: 999px;
    margin-bottom: 1rem;
  }
  .ph-problem-title {
    font-family: 'Poppins', sans-serif;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 800; line-height: 1.15;
    color: var(--dark);
    text-align: center;
    margin-bottom: 3rem;
  }
  .ph-problem-title em { font-style: normal; color: var(--teal-mid); }
  .ph-problem-cards {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem; max-width: 1100px; margin: 0 auto;
  }
  .ph-problem-card {
    background: white;
    border: 1.5px solid var(--light-border);
    border-radius: var(--radius);
    padding: 2rem 1.8rem;
    transition: box-shadow 0.3s;
  }
  .ph-problem-card:hover { box-shadow: 0 12px 36px rgba(13,74,64,0.10); }
  .ph-problem-card.highlight {
    background: var(--teal-light);
    border-color: var(--teal-mid);
  }
  .ph-problem-card p {
    font-size: 0.88rem; line-height: 1.75; color: var(--mid); margin-top: 0.75rem;
  }
  .ph-problem-card h4 {
    font-size: 1.05rem; font-weight: 800; color: var(--dark); margin-top: 1rem;
  }
  .ph-problem-card.highlight h4 { color: var(--teal-dark); }

  /* ══════════════════════════════════
     FAQ
  ══════════════════════════════════ */
  .ph-faq {
    position: relative;
    padding: clamp(3rem,6vw,5.5rem) 1.2rem clamp(4rem,8vw,6rem);
    background: var(--teal-pale); text-align: center; overflow: hidden;
  }
  .ph-faq::before {
    content: ''; position: absolute; inset: 0;
    background: transparent; z-index: 0;
  }
  .ph-faq-qmark {
    position: absolute; right: 4%; top: 50%; transform: translateY(-50%);
    font-size: clamp(8rem, 20vw, 22rem); font-weight: 900;
    color: rgba(26,92,82,0.05); pointer-events: none; z-index: 1;
    font-family: 'Poppins', sans-serif; line-height: 1;
  }
  .ph-faq-inner { position: relative; z-index: 2; }
  .ph-faq-heading {
    display: inline-block;
    font-size: clamp(2.2rem, 5vw, 3.5rem);
    color: var(--teal); position: relative; letter-spacing: 0.2rem;
    font-family: 'Poppins', sans-serif; font-weight: 600;
    margin-bottom: 3rem; padding: 0.5rem 1.5rem;
  }
  .ph-faq-heading::before {
    content: ''; position: absolute; top: 0; left: 0;
    width: 1.8rem; height: 1.8rem;
    border-top: 0.32rem solid var(--teal); border-left: 0.32rem solid var(--teal);
  }
  .ph-faq-heading::after {
    content: ''; position: absolute; bottom: 0; right: 0;
    width: 1.8rem; height: 1.8rem;
    border-bottom: 0.32rem solid var(--teal); border-right: 0.32rem solid var(--teal);
  }
  .ph-faq-list { max-width: 860px; margin: 0 auto; }
  .ph-acc { margin-bottom: 0.6rem; cursor: pointer; }
  .ph-acc-header { display: flex; align-items: stretch; }
  .ph-acc-plus {
    width: 52px; flex-shrink: 0; background: white;
    border: 2px solid var(--teal);
    display: flex; align-items: center; justify-content: center; transition: all 0.3s;
  }
  .ph-acc-plus span {
    font-size: 1.8rem; color: var(--teal); font-weight: 300;
    line-height: 1; transition: transform 0.3s, color 0.3s; display: block;
  }
  .ph-acc-label {
    flex: 1; background: var(--teal); min-height: 54px;
    display: flex; align-items: center; padding: 0 1.6rem; transition: background 0.3s;
  }
  .ph-acc-label h3 {
    font-size: clamp(0.82rem, 2vw, 1rem); font-weight: 600;
    color: white; margin: 0; text-align: left; font-family: 'Poppins', sans-serif;
  }
  .ph-acc:hover .ph-acc-label { background: var(--teal-dark); }
  .ph-acc:hover .ph-acc-plus  { background: var(--teal-light); }
  .ph-acc:hover .ph-acc-plus span { color: var(--teal); }
  .ph-acc.open .ph-acc-plus   { background: var(--teal-light); }
  .ph-acc.open .ph-acc-plus span { transform: rotate(45deg); color: var(--teal); }
  .ph-acc-body {
    max-height: 0; overflow: hidden;
    transition: max-height 0.4s ease, padding 0.3s;
    background: white;
    border-left: 3px solid var(--teal); text-align: left;
    border: 1px solid var(--light-border); border-top: none; border-left: 3px solid var(--teal);
  }
  .ph-acc.open .ph-acc-body { max-height: 400px; padding: 1.2rem 1.8rem; }
  .ph-acc-body p { font-size: 0.95rem; line-height: 1.8; color: var(--mid); font-family: 'Poppins', sans-serif; }

  @media (max-width: 520px) {
    .ph-acc-plus { width: 44px; }
    .ph-acc-label { padding: 0 1rem; min-height: 48px; }
  }

  /* ══════════════════════════════════
     CTA
  ══════════════════════════════════ */
  .ph-cta-sec {
    background: linear-gradient(135deg, var(--teal-dark) 0%, var(--teal) 100%);
    color: white; text-align: center;
    padding: clamp(3rem,6vw,5.5rem) 1.2rem;
  }
  .ph-cta-sec h2 { font-size: clamp(1.5rem,3vw,2rem); font-weight: 800; margin-bottom: 0.75rem; color: white; }
  .ph-cta-sec p  { color: rgba(255,255,255,0.80); margin-bottom: 2rem; font-size: 1rem; }
  .ph-cta-sec .ph-btn-primary {
    background: white; color: var(--teal-dark);
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  }
  .ph-cta-sec .ph-btn-primary:hover { background: var(--teal-pale); }

  /* ══════════════════════════════════
     FOOTER
  ══════════════════════════════════ */
  .ph-footer { background: #0f1a17; color: rgba(255,255,255,0.5); padding: clamp(2rem,5vw,3.5rem) 1.2rem 1.5rem; }
  .ph-footer-grid {
    display: grid; grid-template-columns: 2fr 1fr 1fr;
    gap: 2rem; max-width: 1100px; margin: 0 auto 2rem;
  }
  .ph-footer-brand strong { display: block; color: white; font-size: 1rem; font-weight: 800; margin-bottom: 0.5rem; }
  .ph-footer-brand p { font-size: 0.82rem; line-height: 1.7; color: rgba(255,255,255,0.42); max-width: 260px; }
  .ph-footer-col h5 { color: rgba(255,255,255,0.85); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1rem; }
  .ph-footer-col a { display: block; color: rgba(255,255,255,0.45); font-size: 0.82rem; margin-bottom: 0.5rem; transition: color 0.2s; }
  .ph-footer-col a:hover { color: #4dd9b8; }
  .ph-footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1.2rem; text-align: center; font-size: 0.76rem; color: rgba(255,255,255,0.28); max-width: 1100px; margin: 0 auto; }

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
          <div className="ph-hero-badge">
            <span className="ph-hero-badge-dot" />
            Finding homes across Malawi
          </div>
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
          <div className="ph-hero-trust">
            <div className="ph-hero-trust-item"><i className="fa fa-check-circle" /> No middlemen needed</div>
            <div className="ph-hero-trust-item"><i className="fa fa-check-circle" /> Pay via mobile money</div>
            <div className="ph-hero-trust-item"><i className="fa fa-check-circle" /> 2.5% service fee only</div>
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

// ── TRUST BAR ─────────────────────────────────────────────────────────────────
function TrustBar() {
  return (
    <div className="ph-trust-bar">
      <div className="ph-trust-bar-inner">
        <div className="ph-trust-item"><i className="fa fa-shield-alt" /> Registered Malawian platform</div>
        <div className="ph-trust-divider" />
        <div className="ph-trust-item"><i className="fa fa-mobile-alt" /> Powered by mobile money</div>
        <div className="ph-trust-divider" />
        <div className="ph-trust-item"><i className="fa fa-map-marker-alt" /> Available across all 28 districts</div>
        <div className="ph-trust-divider" />
        <div className="ph-trust-item"><i className="fa fa-lock" /> Dispute protection built in</div>
      </div>
    </div>
  );
}

// ── SEARCH BAR ────────────────────────────────────────────────────────────────
function SearchBar({ isAuthenticated }) {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("district", location);
    if (type)     params.set("type", type);
    navigate(`/properties${params.toString() ? "?" + params.toString() : ""}`);
  };

  const quickTags = ["Lilongwe", "Blantyre", "Zomba", "Mzuzu", "Mangochi", "Salima"];

  return (
    <div className="ph-search-sec">
      <div className="ph-search-wrap">
        <div className="ph-search-field">
          <i className="fa fa-map-marker-alt" />
          <select value={location} onChange={e => setLocation(e.target.value)}>
            <option value="">All Districts</option>
            {MALAWI_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="ph-search-divider" />
        <div className="ph-search-field">
          <i className="fa fa-home" />
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="">All Property Types</option>
            {PROPERTY_TYPES.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
          </select>
        </div>
        <button className="ph-search-btn" onClick={handleSearch}>
          <i className="fa fa-search" /> Search
        </button>
      </div>
      <div className="ph-search-tags">
        {quickTags.map(tag => (
          <button key={tag} className="ph-search-tag"
            onClick={() => navigate(`/properties?district=${encodeURIComponent(tag)}`)}>
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── DISTRICT CAROUSEL CARD ────────────────────────────────────────────────────
function DistrictCarouselCard({ district, properties, navigate }) {
  const distProps = properties.filter(p =>
    (p.district || "").toLowerCase() === district.label.toLowerCase()
  );
  const imgs = distProps
    .flatMap(p => p.images || p.photos || [])
    .filter(Boolean)
    .slice(0, 3);
  const imgCount = imgs.length;
  const previewProps = distProps.slice(0, 2);

  const handleClick = () => {
    navigate(`/properties?district=${encodeURIComponent(district.label)}`);
  };

  return (
    <div className="ph-dcar" onClick={handleClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === "Enter" && handleClick()}>

      {/* Image mosaic */}
      {imgCount === 0 ? (
        <div className="ph-dcar-no-img"><i className={district.icon} /></div>
      ) : (
        <div className={`ph-dcar-imgs ${imgCount === 1 ? "one" : imgCount === 2 ? "two" : "three"}`}
          style={{ position: "relative" }}>
          {imgs.map((src, i) => (
            <div key={i} className="ph-dcar-img">
              <img src={src} alt={district.label} loading="lazy" />
            </div>
          ))}
          <span className="ph-dcar-badge"><i className={district.icon} style={{ marginRight: 4 }} />{district.label}</span>
          {distProps.length > 0 &&
            <span className="ph-dcar-count-badge">{distProps.length} listing{distProps.length !== 1 ? "s" : ""}</span>
          }
        </div>
      )}

      {/* Body */}
      <div className="ph-dcar-body">
        <div className="ph-dcar-name">
          <i className={district.icon} />
          {district.label}
        </div>
        <div className="ph-dcar-meta">
          <span className="ph-dcar-meta-item"><i className="fa fa-building" /> {distProps.length} propert{distProps.length !== 1 ? "ies" : "y"}</span>
          {distProps.some(p => (p.listingType || p.listing_type || "").toLowerCase().includes("rent")) &&
            <span className="ph-dcar-meta-item"><i className="fa fa-key" /> For Rent</span>}
          {distProps.some(p => (p.listingType || p.listing_type || "").toLowerCase().includes("sale")) &&
            <span className="ph-dcar-meta-item"><i className="fa fa-tag" /> For Sale</span>}
        </div>

        {/* Mini property previews */}
        {previewProps.length > 0 && (
          <div className="ph-dcar-props">
            {previewProps.map((prop, i) => {
              const propImg = (prop.images || prop.photos || [])[0];
              const price = prop.price ? "MWK " + Number(prop.price).toLocaleString() : "POA";
              return (
                <div key={i} className="ph-dcar-prop">
                  {propImg
                    ? <img src={propImg} alt="" className="ph-dcar-prop-img" />
                    : <div className="ph-dcar-prop-img" style={{ display:"flex",alignItems:"center",justifyContent:"center" }}><i className="fa fa-home" style={{ color:"#2d8a72",fontSize:"1rem" }} /></div>
                  }
                  <div className="ph-dcar-prop-info">
                    <div className="ph-dcar-prop-title">{prop.title || prop.name || "Property"}</div>
                    <div className="ph-dcar-prop-price">{price}{!(prop.listingType||"").toLowerCase().includes("sale") ? "/mo" : ""}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="ph-dcar-footer">
        <span>View all in {district.label}</span>
        <i className="fa fa-arrow-right" />
      </div>
    </div>
  );
}

// ── DISTRICTS SECTION ─────────────────────────────────────────────────────────
function DistrictsSection({ isAuthenticated, allProperties }) {
  const navigate = useNavigate();

  // All 28 districts with icons for the carousel
  const ALL_DISTRICTS = [
    { icon: "fa fa-city",           label: "Lilongwe"   },
    { icon: "fa fa-building",       label: "Blantyre"   },
    { icon: "fa fa-university",     label: "Zomba"      },
    { icon: "fa fa-mountain",       label: "Mzuzu"      },
    { icon: "fa fa-seedling",       label: "Kasungu"    },
    { icon: "fa fa-water",          label: "Mangochi"   },
    { icon: "fa fa-tree",           label: "Salima"     },
    { icon: "fa fa-home",           label: "Mulanje"    },
    { icon: "fa fa-map-marker-alt", label: "Dedza"      },
    { icon: "fa fa-leaf",           label: "Ntcheu"     },
    { icon: "fa fa-drum",           label: "Balaka"     },
    { icon: "fa fa-map",            label: "Machinga"   },
    { icon: "fa fa-sun",            label: "Chiradzulu" },
    { icon: "fa fa-cloud",          label: "Thyolo"     },
    { icon: "fa fa-mountain",       label: "Phalombe"   },
    { icon: "fa fa-water",          label: "Chikwawa"   },
    { icon: "fa fa-anchor",         label: "Nsanje"     },
    { icon: "fa fa-road",           label: "Neno"       },
    { icon: "fa fa-map-pin",        label: "Mwanza"     },
    { icon: "fa fa-water",          label: "Nkhata Bay" },
    { icon: "fa fa-snowflake",      label: "Rumphi"     },
    { icon: "fa fa-globe",          label: "Karonga"    },
    { icon: "fa fa-compass",        label: "Chitipa"    },
    { icon: "fa fa-mountain",       label: "Mzimba"     },
    { icon: "fa fa-seedling",       label: "Dowa"       },
    { icon: "fa fa-tree",           label: "Ntchisi"    },
    { icon: "fa fa-border-all",     label: "Mchinji"    },
    { icon: "fa fa-island-tropical", label: "Likoma"   },
  ];

  // Duplicate the list for seamless infinite scroll
  const doubled = [...ALL_DISTRICTS, ...ALL_DISTRICTS];

  return (
    <>
      <SearchBar isAuthenticated={isAuthenticated} />

      <section className="ph-dist-sec">
        <div className="ph-dist-sec-inner">
          <p className="ph-sec-label">Browse by location</p>
          <h2 className="ph-sec-title">Find Properties by <em style={{ color: "#2d8a72" }}>District</em></h2>
          <p className="ph-sec-sub">All 28 districts — click any card to see live listings with photos and prices.</p>
        </div>

        <div className="ph-dist-carousel-outer">
          <div className="ph-dist-track">
            {doubled.map((d, i) => (
              <DistrictCarouselCard
                key={`${d.label}-${i}`}
                district={d}
                properties={allProperties}
                navigate={navigate}
              />
            ))}
          </div>
        </div>

        <div className="ph-dist-viewall">
          <a href="/properties"><i className="fa fa-th" /> View All Properties</a>
        </div>
      </section>
    </>
  );
}

// ── PROPERTY TYPES ────────────────────────────────────────────────────────────
function TypesSection({ isAuthenticated }) {
  const navigate = useNavigate();
  const go = (type) => navigate(isAuthenticated ? `/properties?type=${encodeURIComponent(type)}` : "/login");
  return (
    <section className="ph-types-sec">
      <p className="ph-sec-label">What are you looking for?</p>
      <h2 className="ph-sec-title">Browse by <em>Property Type</em></h2>
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
      <h2 className="ph-sec-title">Top Locations Across <em>Malawi</em></h2>
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
  const [allProperties, setAllProperties] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/properties?limit=500`)
      .then(r => r.json())
      .then(data => {
        if (data.success && Array.isArray(data.properties)) setAllProperties(data.properties);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      {/* NO Navbar here — Navbar.jsx handles it separately */}
      <Hero isAuthenticated={isAuthenticated} />
      <TrustBar />
      <DistrictsSection isAuthenticated={isAuthenticated} allProperties={allProperties} />
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