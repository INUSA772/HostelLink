import { useState, useEffect, useCallback, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MALAWI_DISTRICTS = [
  "Lilongwe", "Blantyre", "Zomba", "Mzuzu", "Kasungu", "Mangochi",
  "Dedza", "Salima", "Ntcheu", "Balaka", "Machinga", "Chiradzulu",
  "Thyolo", "Mulanje", "Phalombe", "Chikwawa", "Nsanje", "Neno",
  "Mwanza", "Nkhata Bay", "Rumphi", "Karonga", "Chitipa", "Mzimba",
  "Dowa", "Ntchisi", "Mchinji", "Likoma",
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
  { question: "How do I find a house on PezaNyumba?",         answer: "No account needed! Just browse by district or property type, view full details, and contact the landlord directly — no walking required." },
  { question: "Do I need to create an account to search?",    answer: "No. Tenants and land buyers can browse all listings, view photos, see prices, and get landlord contact info completely free — no sign-up required." },
  { question: "Who can create an account on PezaNyumba?",     answer: "Only landlords and land owners register on PezaNyumba. This keeps the platform focused and prevents spam listings. Tenants just browse freely." },
  { question: "How does PezaNyumba verify landlords?",        answer: "Every landlord who registers goes through our identity and property verification process before their listing goes live. This protects tenants from fraud." },
  { question: "What happens if I have a dispute?",            answer: "PezaNyumba has a built-in dispute resolution system. Both parties submit their case and our team mediates fairly and quickly." },
  { question: "Can I list my property on PezaNyumba?",        answer: "Yes — if you're a landlord or land owner. Create a landlord account, fill in your property details, upload photos, and your listing will be live within 24 hours after verification." },
];

const CARDS_COL1 = [
  { theme: "blue",   icon: "fa fa-shield-alt",    title: "Verified Properties", sub: "All listings checked & approved" },
  { theme: "orange", icon: "fa fa-tag",            title: "Best Prices",         sub: "Affordable for every budget",    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop" },
  { theme: "green", title: "Trusted Landlords",   sub: "Identity-verified owners"        },
  { theme: "purple", title: "All Districts",       sub: "28 districts covered",           image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&auto=format&fit=crop" },
  { theme: "blue",  title: "Verified Properties", sub: "All listings checked & approved" },
  { theme: "orange", title: "Best Prices",         sub: "Affordable for every budget",    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop" },
  { theme: "green",  title: "Trusted Landlords",   sub: "Identity-verified owners"        },
  { theme: "purple",title: "All Districts",       sub: "28 districts covered",           image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&auto=format&fit=crop" },
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

  /* ══════ HERO ══════ */
  .ph-hero {
    min-height: 100vh; width: 100%;
    background-image: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80');
    background-size: cover; background-position: center; background-attachment: fixed;
    display: flex; align-items: center; justify-content: center; flex-direction: column;
    text-align: center; padding: 6rem 1.2rem 4rem;
    position: relative; overflow: hidden;
  }
  .ph-hero::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(160deg, rgba(5,22,10,0.78) 0%, rgba(10,40,25,0.72) 50%, rgba(5,30,18,0.80) 100%);
    pointer-events: none; z-index: 1;
  }
  .ph-hero-wrapper {
    display: flex; align-items: center; justify-content: center; gap: 3rem;
    width: 100%; max-width: 1200px; position: relative; z-index: 2;
  }
  .ph-hero > * { position: relative; z-index: 2; }
  .ph-hero-left { flex: 1; min-width: 0; text-align: left; }
  .ph-hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25);
    border-radius: 999px; padding: 0.4rem 1rem;
    font-size: 0.82rem; font-weight: 600; color: rgba(255,255,255,0.90);
    margin-bottom: 1.5rem; backdrop-filter: blur(6px);
  }
  .ph-hero-badge-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green-check); flex-shrink: 0; }
  .ph-hero-left h1 {
    font-family: 'Poppins', sans-serif;
    font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; color: white; line-height: 1.15; margin-bottom: 1rem;
  }
  .ph-hero-left h1 em { color: #4dd9b8; font-style: normal; }
  .ph-hero-sub { font-size: clamp(0.9rem, 2vw, 1.05rem); color: rgba(255,255,255,0.75); max-width: 480px; line-height: 1.8; margin-bottom: 2rem; }
  .ph-hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
  .ph-btn-primary {
    background: var(--teal); color: white; padding: 0.85rem 2rem; border-radius: 10px;
    font-size: 0.95rem; font-weight: 700; display: inline-flex; align-items: center; gap: 8px;
    transition: background 0.2s; text-decoration: none; box-shadow: 0 4px 16px rgba(13,74,64,0.25);
  }
  .ph-btn-primary:hover { background: var(--teal-dark); }
  .ph-btn-ghost {
    background: rgba(255,255,255,0.12); color: white; border: 1.5px solid rgba(255,255,255,0.4);
    padding: 0.85rem 2rem; border-radius: 10px;
    font-size: 0.95rem; font-weight: 700; display: inline-flex; align-items: center; gap: 8px;
    transition: all 0.2s; text-decoration: none; backdrop-filter: blur(4px);
  }
  .ph-btn-ghost:hover { background: rgba(255,255,255,0.22); }
  .ph-hero-trust { display: flex; gap: 2rem; flex-wrap: wrap; margin-top: 1.8rem; }
  .ph-hero-trust-item { display: flex; align-items: center; gap: 6px; font-size: 0.84rem; font-weight: 600; color: rgba(255,255,255,0.80); }
  .ph-hero-trust-item i { color: var(--green-check); font-size: 1rem; }
  .ph-hero-stats {
    display: flex; gap: 2.5rem; flex-wrap: wrap; margin-top: 2rem; padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.15);
  }
  .ph-hero-stat strong { display: block; font-family: 'Poppins', sans-serif; font-size: 1.6rem; font-weight: 800; color: #4dd9b8; }
  .ph-hero-stat span { font-size: 0.78rem; color: rgba(255,255,255,0.55); }
  .ph-hero-right { flex: 1; display: flex; align-items: center; justify-content: center; }
  .ph-cards-mask {
    position: relative; height: 420px; overflow: hidden;
    display: flex; gap: 1.2rem; align-items: flex-start;
  }
  .ph-cards-mask::before, .ph-cards-mask::after {
    content: ''; position: absolute; left: 0; right: 0; height: 80px; z-index: 3; pointer-events: none;
  }
  .ph-cards-mask::before { top: 0; background: linear-gradient(to bottom, rgba(5,22,10,0.7), transparent); }
  .ph-cards-mask::after  { bottom: 0; background: linear-gradient(to top, rgba(5,22,10,0.7), transparent); }
  .ph-cards-col { display: flex; flex-direction: column; gap: 1.2rem; }
  .ph-cards-up   { animation: scrollUp   20s linear infinite; }
  .ph-cards-down { animation: scrollDown 25s linear infinite; margin-top: 60px; }
  @keyframes scrollUp   { 0% { transform: translateY(0); }    100% { transform: translateY(-50%); } }
  @keyframes scrollDown { 0% { transform: translateY(-50%); } 100% { transform: translateY(0); } }
  .ph-anim-card {
    width: 170px; border-radius: 16px; padding: 1.2rem 1rem;
    display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem;
    box-shadow: 0 8px 28px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.07);
    background: white; backdrop-filter: blur(6px); flex-shrink: 0; transition: transform 0.2s;
  }
  .ph-anim-card:hover { transform: scale(1.04); }
  .ph-anim-card.with-image { padding: 0; }
  .ph-anim-img { width: 100%; height: 110px; object-fit: cover; border-radius: 16px 16px 0 0; display: block; }
  .ph-anim-body { padding: 0.9rem; display: flex; flex-direction: column; gap: 0.4rem; }
  .ph-anim-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; color: white; flex-shrink: 0; background: var(--teal); }
  .ph-anim-title { font-size: 0.8rem; font-weight: 800; color: #111; line-height: 1.2; }
  .ph-anim-sub   { font-size: 0.7rem; color: #6b7280; line-height: 1.4; }
  .ph-anim-card.blue   .ph-anim-icon { background: var(--teal); }
  .ph-anim-card.orange .ph-anim-icon { background: var(--teal-mid); }
  .ph-anim-card.green  .ph-anim-icon { background: #059669; }
  .ph-anim-card.purple .ph-anim-icon { background: var(--teal-dark); }
  .ph-anim-card.cyan   .ph-anim-icon { background: #0891b2; }
  .ph-anim-card.yellow .ph-anim-icon { background: var(--teal-mid); }
  .ph-anim-card.red    .ph-anim-icon { background: var(--teal); }
  .ph-anim-card.pink   .ph-anim-icon { background: #0d6e5e; }
  .ph-wave {
    position: absolute; bottom: -0.5rem; left: 0; width: 100%; height: 11rem; z-index: 3;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='0.04' d='M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,176C672,181,768,139,864,128C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L0,320Z'/%3E%3C/svg%3E") repeat-x;
    background-size: 1440px 11rem; animation: waves 8s linear infinite;
  }
  .ph-wave2 { animation-direction: reverse; animation-duration: 6s; opacity: 0.3; }
  .ph-wave3 { animation-duration: 4s; opacity: 0.5; }
  @keyframes waves { 0% { background-position-x: 0; } 100% { background-position-x: 1440px; } }
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

  /* ══════ TRUST BAR ══════ */
  .ph-trust-bar { background: var(--cream); border-top: 1px solid var(--light-border); border-bottom: 1px solid var(--light-border); padding: 1.2rem; }
  .ph-trust-bar-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 2rem; }
  .ph-trust-item { display: flex; align-items: center; gap: 8px; font-size: 0.84rem; font-weight: 600; color: var(--mid); }
  .ph-trust-item i { font-size: 1.1rem; color: var(--teal); }
  .ph-trust-divider { width: 1px; height: 28px; background: var(--light-border); }
  @media (max-width: 640px) { .ph-trust-divider { display: none; } }

  /* ══════ SHARED SECTION STYLES ══════ */
  .ph-sec-label { font-size: 0.73rem; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--teal-mid); text-align: center; margin-bottom: 0.5rem; }
  .ph-sec-title { font-family: 'Poppins', sans-serif; font-size: clamp(1.6rem, 3.5vw, 2.3rem); font-weight: 800; text-align: center; line-height: 1.15; margin-bottom: 0.6rem; }
  .ph-sec-title em { font-style: normal; color: var(--teal-mid); }
  .ph-sec-sub { text-align: center; font-size: 0.93rem; line-height: 1.8; color: var(--mid); max-width: 520px; margin: 0 auto 2.5rem; }

  /* ══════ DISTRICTS — sliding property cards ══════ */
  .ph-dist-sec { background: var(--gray-bg); padding: clamp(3rem,6vw,5.5rem) 1.2rem; }

  .ph-dist-search {
    display: flex; gap: 0.6rem; max-width: 640px;
    margin: 0 auto 2.5rem; flex-wrap: wrap;
  }
  .ph-dist-search input,
  .ph-dist-search select {
    flex: 1; min-width: 160px; padding: 0.65rem 1rem;
    border: 1.5px solid #d1d5db; border-radius: 10px;
    font-size: 0.88rem; background: white; color: #111;
    outline: none; font-family: inherit; transition: border 0.2s;
  }
  .ph-dist-search input:focus,
  .ph-dist-search select:focus { border-color: var(--teal); }
  .ph-dist-search-btn {
    background: var(--teal); color: white; border: none; border-radius: 10px;
    padding: 0.65rem 1.4rem; font-size: 0.88rem; font-weight: 700; cursor: pointer;
    display: inline-flex; align-items: center; gap: 6px;
    transition: background 0.2s; font-family: inherit;
  }
  .ph-dist-search-btn:hover { background: var(--teal-dark); }

  .ph-prop-slider-outer { overflow: hidden; max-width: 1100px; margin: 0 auto; }
  .ph-prop-track {
    display: flex; gap: 1.2rem;
    transition: transform 0.6s cubic-bezier(.4,0,.2,1);
  }
  .ph-slide-card {
    flex-shrink: 0; width: 240px; border-radius: 14px; overflow: hidden;
    background: white; border: 1.5px solid var(--light-border); cursor: pointer;
    text-align: left; padding: 0;
    transition: transform 0.25s, box-shadow 0.25s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .ph-slide-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 14px 32px rgba(13,74,64,0.18);
    border-color: var(--teal-mid);
  }
  .ph-slide-img { width: 100%; height: 145px; object-fit: cover; display: block; }
  .ph-slide-body { padding: 0.9rem 1rem; }
  .ph-slide-district {
    font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1.5px; color: var(--teal-mid); margin-bottom: 0.3rem;
  }
  .ph-slide-name {
    font-size: 0.92rem; font-weight: 800; color: #111;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: 0.25rem;
  }
  .ph-slide-meta {
    font-size: 0.75rem; color: #6b7280;
    display: flex; gap: 0.7rem; margin-top: 0.3rem; flex-wrap: wrap;
  }
  .ph-slide-badge {
    display: inline-block; font-size: 0.65rem; font-weight: 700;
    padding: 2px 8px; border-radius: 20px;
    background: var(--teal-light); color: var(--teal-dark); margin-top: 0.4rem;
  }
  .ph-slide-price {
    font-size: 0.9rem; font-weight: 800; color: var(--teal); margin-top: 0.4rem;
  }

  .ph-prop-nav {
    display: flex; align-items: center; justify-content: space-between;
    max-width: 1100px; margin: 1.2rem auto 0;
  }
  .ph-prop-dots { display: flex; gap: 6px; }
  .ph-prop-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #d1d5db; border: none; cursor: pointer; padding: 0;
    transition: all 0.3s;
  }
  .ph-prop-dot.active { background: var(--teal); width: 22px; border-radius: 4px; }
  .ph-prop-nav-btns { display: flex; gap: 0.5rem; }
  .ph-prop-nav-btn {
    width: 36px; height: 36px; border-radius: 50%;
    border: 1.5px solid var(--teal); background: white; color: var(--teal);
    font-size: 1rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  }
  .ph-prop-nav-btn:hover { background: var(--teal); color: white; }
  .ph-prop-empty {
    text-align: center; padding: 2.5rem; color: var(--mid); font-size: 0.9rem;
    background: white; border-radius: var(--radius); border: 1.5px dashed var(--light-border);
  }

  /* ══════ PROPERTY TYPES ══════ */
  .ph-types-sec { background: white; padding: clamp(3rem,6vw,5.5rem) 1.2rem; }
  .ph-types-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(155px, 1fr)); gap: 1rem; max-width: 1100px; margin: 0 auto; }
  .ph-type-card {
    background: var(--teal-pale); border: 1.5px solid var(--light-border); border-radius: var(--radius);
    padding: 1.8rem 1rem; text-align: center; color: var(--dark); transition: all 0.25s;
  }
  .ph-type-card:hover { background: var(--teal); border-color: var(--teal); color: white; transform: translateY(-5px); box-shadow: 0 12px 28px rgba(26,92,82,0.20); }
  .ph-type-card i { font-size: 1.7rem; color: var(--teal); display: block; margin-bottom: 0.75rem; transition: color 0.25s; }
  .ph-type-card:hover i { color: white; }
  .ph-type-card h4 { font-size: 0.95rem; font-weight: 800; margin-bottom: 0.4rem; }
  .ph-type-card span { font-size: 0.72rem; color: var(--mid); transition: color 0.25s; }
  .ph-type-card:hover span { color: rgba(255,255,255,0.80); }
  @media (max-width: 520px) { .ph-types-grid { grid-template-columns: repeat(2, 1fr); } }

  /* ══════ PROPERTIES MODAL / DRAWER ══════ */
  .ph-browse-overlay {
    position: fixed; inset: 0; background: rgba(5,22,10,0.65); z-index: 1000;
    display: flex; align-items: flex-end; justify-content: center;
    backdrop-filter: blur(4px);
    animation: fadeIn 0.25s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .ph-browse-drawer {
    background: white; width: 100%; max-width: 1100px;
    max-height: 90vh; border-radius: 20px 20px 0 0;
    display: flex; flex-direction: column;
    animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
    overflow: hidden;
  }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  .ph-browse-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.4rem 1.6rem; border-bottom: 1px solid var(--light-border);
    flex-shrink: 0;
  }
  .ph-browse-header-left { display: flex; align-items: center; gap: 0.75rem; }
  .ph-browse-header-icon {
    width: 40px; height: 40px; border-radius: 12px; background: var(--teal-light);
    display: flex; align-items: center; justify-content: center; font-size: 1.1rem; color: var(--teal);
  }
  .ph-browse-header h3 { font-size: 1.1rem; font-weight: 800; color: var(--dark); }
  .ph-browse-header p  { font-size: 0.78rem; color: var(--mid); margin-top: 1px; }
  .ph-browse-close {
    width: 36px; height: 36px; border-radius: 10px; background: var(--gray-bg);
    border: 1px solid var(--light-border); font-size: 1.2rem; color: var(--mid);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s;
  }
  .ph-browse-close:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }
  .ph-browse-body { flex: 1; overflow-y: auto; padding: 1.4rem 1.6rem; }
  .ph-browse-loading {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 3rem; gap: 1rem; color: var(--mid); font-size: 0.9rem;
  }
  .ph-spinner {
    width: 36px; height: 36px; border: 3px solid var(--teal-light);
    border-top-color: var(--teal); border-radius: 50%; animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .ph-browse-empty {
    text-align: center; padding: 3rem 1rem;
  }
  .ph-browse-empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.3; }
  .ph-browse-empty h4 { font-size: 1rem; font-weight: 700; color: var(--dark); margin-bottom: 0.5rem; }
  .ph-browse-empty p { font-size: 0.85rem; color: var(--mid); }
  .ph-prop-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.2rem;
  }
  .ph-prop-card {
    border: 1.5px solid var(--light-border); border-radius: var(--radius);
    overflow: hidden; background: white; transition: all 0.25s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .ph-prop-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(13,74,64,0.12); border-color: var(--teal-mid); }
  .ph-prop-img-wrap { position: relative; height: 170px; overflow: hidden; background: var(--teal-light); }
  .ph-prop-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s; }
  .ph-prop-card:hover .ph-prop-img-wrap img { transform: scale(1.05); }
  .ph-prop-no-img {
    width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
    font-size: 2.5rem; color: var(--teal-mid); opacity: 0.4;
  }
  .ph-prop-badge {
    position: absolute; top: 10px; left: 10px;
    background: var(--teal); color: white;
    font-size: 0.68rem; font-weight: 700; padding: 3px 10px; border-radius: 20px;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .ph-prop-badge.for-sale { background: #0891b2; }
  .ph-prop-body { padding: 1rem; }
  .ph-prop-type { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--teal-mid); margin-bottom: 0.35rem; }
  .ph-prop-name { font-size: 0.95rem; font-weight: 800; color: var(--dark); margin-bottom: 0.35rem; line-height: 1.3; }
  .ph-prop-loc { font-size: 0.78rem; color: var(--mid); display: flex; align-items: center; gap: 5px; margin-bottom: 0.75rem; }
  .ph-prop-loc i { color: var(--teal); font-size: 0.75rem; }
  .ph-prop-price { font-size: 1.1rem; font-weight: 800; color: var(--teal-dark); }
  .ph-prop-price-sub { font-size: 0.72rem; color: var(--mid); font-weight: 500; }
  .ph-prop-footer {
    padding: 0.75rem 1rem; border-top: 1px solid var(--light-border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .ph-prop-meta { display: flex; gap: 1rem; }
  .ph-prop-meta-item { font-size: 0.75rem; color: var(--mid); display: flex; align-items: center; gap: 4px; }
  .ph-prop-meta-item i { color: var(--teal); }
  .ph-prop-contact {
    background: var(--teal); color: white; border: none; cursor: pointer;
    padding: 0.45rem 1rem; border-radius: 8px; font-size: 0.78rem; font-weight: 700;
    display: flex; align-items: center; gap: 6px; transition: background 0.2s; font-family: inherit;
  }
  .ph-prop-contact:hover { background: var(--teal-dark); }
  .ph-browse-footer {
    padding: 1rem 1.6rem; border-top: 1px solid var(--light-border);
    display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
    background: var(--teal-pale);
  }
  .ph-browse-footer p { font-size: 0.82rem; color: var(--mid); }
  .ph-browse-footer strong { color: var(--teal-dark); }
  .ph-browse-see-all {
    background: var(--teal); color: white; padding: 0.55rem 1.4rem;
    border-radius: 8px; font-size: 0.85rem; font-weight: 700;
    display: inline-flex; align-items: center; gap: 6px; transition: background 0.2s;
    text-decoration: none; border: none; cursor: pointer; font-family: inherit;
  }
  .ph-browse-see-all:hover { background: var(--teal-dark); }

  /* Contact info popup */
  .ph-contact-modal-overlay {
    position: fixed; inset: 0; z-index: 2000; background: rgba(5,22,10,0.7);
    display: flex; align-items: center; justify-content: center; padding: 1.2rem;
    backdrop-filter: blur(6px); animation: fadeIn 0.2s;
  }
  .ph-contact-modal {
    background: white; border-radius: 18px; padding: 2rem;
    width: 100%; max-width: 400px; text-align: center;
    animation: popIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  }
  @keyframes popIn { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .ph-contact-modal-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
  .ph-contact-modal h3 { font-size: 1.1rem; font-weight: 800; color: var(--dark); margin-bottom: 0.5rem; }
  .ph-contact-modal-prop { font-size: 0.82rem; color: var(--mid); margin-bottom: 1.5rem; line-height: 1.5; }
  .ph-contact-info { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; }
  .ph-contact-info-row {
    display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1rem;
    background: var(--teal-pale); border-radius: 10px; border: 1px solid var(--light-border);
    text-decoration: none; transition: all 0.2s;
  }
  .ph-contact-info-row:hover { background: var(--teal-light); border-color: var(--teal-mid); }
  .ph-contact-info-row i { font-size: 1.1rem; color: var(--teal); width: 22px; text-align: center; flex-shrink: 0; }
  .ph-contact-info-row div { text-align: left; }
  .ph-contact-info-row small { display: block; font-size: 0.7rem; color: var(--mid); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .ph-contact-info-row span { font-size: 0.9rem; font-weight: 700; color: var(--dark); }
  .ph-contact-close {
    width: 100%; padding: 0.75rem; background: var(--gray-bg);
    border: 1px solid var(--light-border); border-radius: 10px;
    font-size: 0.88rem; font-weight: 700; color: var(--mid);
    cursor: pointer; font-family: inherit; transition: all 0.2s;
  }
  .ph-contact-close:hover { background: var(--teal-light); color: var(--teal-dark); }

  /* ══════ LOCATIONS PHOTO GRID ══════ */
  .ph-locs-sec { background: var(--teal-pale); padding: clamp(3rem,6vw,5.5rem) 1.2rem; }
  .ph-locs-grid {
    display: grid; grid-template-columns: 2fr 1fr 1fr; grid-template-rows: 220px 220px;
    gap: 1rem; max-width: 1100px; margin: 2rem auto 0;
  }
  .ph-loc-card {
    border-radius: var(--radius); overflow: hidden; position: relative;
    border: none; background: transparent; padding: 0; cursor: pointer;
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

  /* ══════ DUAL ══════ */
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
  .ph-dual-note { font-size: 0.75rem; color: var(--teal-mid); font-weight: 700; background: var(--teal-light); padding: 0.35rem 0.9rem; border-radius: 20px; margin-bottom: 1.2rem; }
  .ph-btn-outline {
    border: 2px solid var(--teal); color: var(--teal); background: transparent;
    padding: 0.55rem 1.4rem; border-radius: 8px; font-size: 0.88rem; font-weight: 700;
    transition: all 0.2s; display: inline-block; text-decoration: none;
  }
  .ph-btn-outline:hover { background: var(--teal); color: white; }

  /* ══════ FEATURES ══════ */
  .ph-features-sec { background: var(--gray-bg); padding: clamp(3rem,6vw,5.5rem) 1.2rem; text-align: center; }
  .ph-features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; max-width: 1100px; margin: 2.5rem auto 0; }
  .ph-feature-card {
    background: white; padding: 2rem; border-radius: var(--radius);
    box-shadow: 0 6px 20px rgba(13,74,64,0.07); transition: transform 0.3s;
    border: 1px solid var(--light-border);
  }
  .ph-feature-card:hover { transform: translateY(-6px); }
  .ph-feature-card i { font-size: 2rem; color: var(--teal); display: block; margin-bottom: 1rem; }
  .ph-feature-card h4 { font-size: 1rem; font-weight: 700; color: var(--dark); margin-bottom: 0.5rem; }
  .ph-feature-card p  { font-size: 0.85rem; color: var(--mid); line-height: 1.6; }

  /* ══════ FAQ ══════ */
  .ph-faq { position: relative; padding: clamp(3rem,6vw,5.5rem) 1.2rem clamp(4rem,8vw,6rem); background: var(--teal-pale); text-align: center; overflow: hidden; }
  .ph-faq-qmark { position: absolute; right: 4%; top: 50%; transform: translateY(-50%); font-size: clamp(8rem, 20vw, 22rem); font-weight: 900; color: rgba(26,92,82,0.05); pointer-events: none; z-index: 1; font-family: 'Poppins', sans-serif; line-height: 1; }
  .ph-faq-inner { position: relative; z-index: 2; }
  .ph-faq-heading {
    display: inline-block; font-size: clamp(2.2rem, 5vw, 3.5rem); color: var(--teal);
    position: relative; letter-spacing: 0.2rem; font-family: 'Poppins', sans-serif;
    font-weight: 600; margin-bottom: 3rem; padding: 0.5rem 1.5rem;
  }
  .ph-faq-heading::before { content: ''; position: absolute; top: 0; left: 0; width: 1.8rem; height: 1.8rem; border-top: 0.32rem solid var(--teal); border-left: 0.32rem solid var(--teal); }
  .ph-faq-heading::after  { content: ''; position: absolute; bottom: 0; right: 0; width: 1.8rem; height: 1.8rem; border-bottom: 0.32rem solid var(--teal); border-right: 0.32rem solid var(--teal); }
  .ph-faq-list { max-width: 860px; margin: 0 auto; }
  .ph-acc { margin-bottom: 0.6rem; cursor: pointer; }
  .ph-acc-header { display: flex; align-items: stretch; }
  .ph-acc-plus { width: 52px; flex-shrink: 0; background: white; border: 2px solid var(--teal); display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
  .ph-acc-plus span { font-size: 1.8rem; color: var(--teal); font-weight: 300; line-height: 1; transition: transform 0.3s, color 0.3s; display: block; }
  .ph-acc-label { flex: 1; background: var(--teal); min-height: 54px; display: flex; align-items: center; padding: 0 1.6rem; transition: background 0.3s; }
  .ph-acc-label h3 { font-size: clamp(0.82rem, 2vw, 1rem); font-weight: 600; color: white; margin: 0; text-align: left; font-family: 'Poppins', sans-serif; }
  .ph-acc:hover .ph-acc-label { background: var(--teal-dark); }
  .ph-acc:hover .ph-acc-plus  { background: var(--teal-light); }
  .ph-acc.open .ph-acc-plus   { background: var(--teal-light); }
  .ph-acc.open .ph-acc-plus span { transform: rotate(45deg); color: var(--teal); }
  .ph-acc-body {
    max-height: 0; overflow: hidden; transition: max-height 0.4s ease, padding 0.3s;
    background: white; border-left: 3px solid var(--teal); text-align: left;
    border: 1px solid var(--light-border); border-top: none; border-left: 3px solid var(--teal);
  }
  .ph-acc.open .ph-acc-body { max-height: 400px; padding: 1.2rem 1.8rem; }
  .ph-acc-body p { font-size: 0.95rem; line-height: 1.8; color: var(--mid); font-family: 'Poppins', sans-serif; }
  @media (max-width: 520px) { .ph-acc-plus { width: 44px; } .ph-acc-label { padding: 0 1rem; min-height: 48px; } }

  /* ══════ CTA ══════ */
  .ph-cta-sec { background: linear-gradient(135deg, var(--teal-dark) 0%, var(--teal) 100%); color: white; text-align: center; padding: clamp(3rem,6vw,5.5rem) 1.2rem; }
  .ph-cta-sec h2 { font-size: clamp(1.5rem,3vw,2rem); font-weight: 800; margin-bottom: 0.75rem; color: white; }
  .ph-cta-sec p  { color: rgba(255,255,255,0.80); margin-bottom: 2rem; font-size: 1rem; }
  .ph-cta-note { font-size: 0.8rem; color: rgba(255,255,255,0.55); margin-top: 1rem; }
  .ph-cta-sec .ph-btn-primary { background: white; color: var(--teal-dark); box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
  .ph-cta-sec .ph-btn-primary:hover { background: var(--teal-pale); }

  /* ══════ FOOTER ══════ */
  .ph-footer { background: #0f1a17; color: rgba(255,255,255,0.5); padding: clamp(2rem,5vw,3.5rem) 1.2rem 1.5rem; }
  .ph-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 2rem; max-width: 1100px; margin: 0 auto 2rem; }
  .ph-footer-brand strong { display: block; color: white; font-size: 1rem; font-weight: 800; margin-bottom: 0.5rem; }
  .ph-footer-brand p { font-size: 0.82rem; line-height: 1.7; color: rgba(255,255,255,0.42); max-width: 260px; }
  .ph-footer-col h5 { color: rgba(255,255,255,0.85); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1rem; }
  .ph-footer-col a { display: block; color: rgba(255,255,255,0.45); font-size: 0.82rem; margin-bottom: 0.5rem; transition: color 0.2s; }
  .ph-footer-col a:hover { color: #4dd9b8; }
  .ph-footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1.2rem; text-align: center; font-size: 0.76rem; color: rgba(255,255,255,0.28); max-width: 1100px; margin: 0 auto; }
  @media (max-width: 768px) { .ph-footer-grid { grid-template-columns: 1fr 1fr; } .ph-footer-brand { grid-column: 1 / -1; } .ph-footer-brand p { max-width: 100%; } }
  @media (max-width: 480px) { .ph-footer-grid { grid-template-columns: 1fr; } }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatPrice(p) {
  if (!p && p !== 0) return "Price on request";
  return "MWK " + Number(p).toLocaleString();
}

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&auto=format&fit=crop",
];

function PropertyCard({ property, onContact }) {
  const imgs = property.images || property.photos || [];
  const imgSrc = imgs[0] || null;
  const isForSale = (property.listingType || property.listing_type || "").toLowerCase().includes("sale");

  return (
    <div className="ph-prop-card">
      <div className="ph-prop-img-wrap">
        {imgSrc
          ? <img src={imgSrc} alt={property.title || property.name || "Property"} />
          : <div className="ph-prop-no-img"><i className="fa fa-home" /></div>
        }
        <span className={`ph-prop-badge${isForSale ? " for-sale" : ""}`}>
          {isForSale ? "For Sale" : "For Rent"}
        </span>
      </div>
      <div className="ph-prop-body">
        <div className="ph-prop-type">{property.propertyType || property.property_type || property.type || "Property"}</div>
        <div className="ph-prop-name">{property.title || property.name || "Unnamed Property"}</div>
        <div className="ph-prop-loc">
          <i className="fa fa-map-marker-alt" />
          {[property.area || property.location, property.district].filter(Boolean).join(", ") || property.district || "Malawi"}
        </div>
        <div className="ph-prop-price">
          {formatPrice(property.price)}
          {!isForSale && <span className="ph-prop-price-sub"> /month</span>}
        </div>
      </div>
      <div className="ph-prop-footer">
        <div className="ph-prop-meta">
          {(property.bedrooms || property.beds) &&
            <span className="ph-prop-meta-item"><i className="fa fa-bed" /> {property.bedrooms || property.beds} bed</span>
          }
          {(property.bathrooms || property.baths) &&
            <span className="ph-prop-meta-item"><i className="fa fa-bath" /> {property.bathrooms || property.baths}</span>
          }
        </div>
        <button className="ph-prop-contact" onClick={() => onContact(property)}>
          <i className="fa fa-phone" /> Contact
        </button>
      </div>
    </div>
  );
}

// ── Browse Drawer ─────────────────────────────────────────────────────────────
function BrowseDrawer({ filter, filterValue, filterIcon, onClose, allProperties }) {
  const [loading, setLoading]         = useState(true);
  const [properties, setProperties]   = useState([]);
  const [contactProp, setContactProp] = useState(null);

  useEffect(() => {
    setLoading(true);
    if (allProperties && allProperties.length > 0) {
      const filtered = allProperties.filter((p) => {
        if (filter === "district") return (p.district || "").toLowerCase() === filterValue.toLowerCase();
        if (filter === "type") {
          const t = (p.propertyType || p.property_type || p.type || "").toLowerCase();
          return t.includes(filterValue.toLowerCase()) || filterValue.toLowerCase().includes(t);
        }
        return true;
      });
      setProperties(filtered);
      setLoading(false);
      return;
    }
    const param = filter === "district"
      ? `district=${encodeURIComponent(filterValue)}`
      : `type=${encodeURIComponent(filterValue)}`;
    fetch(`${API_URL}/properties?${param}&limit=50`)
      .then(r => r.json())
      .then(data => {
        setProperties(data.success && Array.isArray(data.properties) ? data.properties : []);
      })
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, [filter, filterValue, allProperties]);

  return (
    <>
      <div className="ph-browse-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="ph-browse-drawer">
          <div className="ph-browse-header">
            <div className="ph-browse-header-left">
              <div className="ph-browse-header-icon"><i className={filterIcon} /></div>
              <div>
                <h3>Properties in {filterValue}</h3>
                <p>{loading ? "Loading..." : `${properties.length} listing${properties.length !== 1 ? "s" : ""} found`}</p>
              </div>
            </div>
            <button className="ph-browse-close" onClick={onClose}>✕</button>
          </div>

          <div className="ph-browse-body">
            {loading ? (
              <div className="ph-browse-loading">
                <div className="ph-spinner" />
                <span>Searching listings…</span>
              </div>
            ) : properties.length === 0 ? (
              <div className="ph-browse-empty">
                <div className="ph-browse-empty-icon"><i className="fa fa-search" /></div>
                <h4>No listings found for "{filterValue}"</h4>
                <p>Check back soon — landlords are adding new properties every day.</p>
              </div>
            ) : (
              <div className="ph-prop-grid">
                {properties.map((p, i) => (
                  <PropertyCard key={p._id || p.id || i} property={p} onContact={setContactProp} />
                ))}
              </div>
            )}
          </div>

          {!loading && properties.length > 0 && (
            <div className="ph-browse-footer">
              <p>Showing <strong>{properties.length}</strong> properties in <strong>{filterValue}</strong></p>
              <a href="/properties" className="ph-browse-see-all">
                <i className="fa fa-th" /> View All Listings
              </a>
            </div>
          )}
        </div>
      </div>

      {contactProp && (
        <div className="ph-contact-modal-overlay" onClick={e => e.target === e.currentTarget && setContactProp(null)}>
          <div className="ph-contact-modal">
            <div className="ph-contact-modal-icon">🏠</div>
            <h3>Contact Landlord</h3>
            <p className="ph-contact-modal-prop">
              {contactProp.title || contactProp.name || "Property"}<br />
              <small>{[contactProp.area, contactProp.district].filter(Boolean).join(", ")}</small>
            </p>
            <div className="ph-contact-info">
              {(contactProp.ownerPhone || contactProp.phone || contactProp.landlordPhone) && (
                <a className="ph-contact-info-row" href={`tel:${contactProp.ownerPhone || contactProp.phone || contactProp.landlordPhone}`}>
                  <i className="fa fa-phone" />
                  <div>
                    <small>Call / WhatsApp</small>
                    <span>{contactProp.ownerPhone || contactProp.phone || contactProp.landlordPhone}</span>
                  </div>
                </a>
              )}
              {(contactProp.ownerEmail || contactProp.email || contactProp.landlordEmail) && (
                <a className="ph-contact-info-row" href={`mailto:${contactProp.ownerEmail || contactProp.email || contactProp.landlordEmail}`}>
                  <i className="fa fa-envelope" />
                  <div>
                    <small>Email</small>
                    <span>{contactProp.ownerEmail || contactProp.email || contactProp.landlordEmail}</span>
                  </div>
                </a>
              )}
              {(!contactProp.ownerPhone && !contactProp.phone && !contactProp.email && !contactProp.ownerEmail) && (
                <div className="ph-contact-info-row" style={{cursor:"default"}}>
                  <i className="fa fa-info-circle" />
                  <div>
                    <small>Contact Info</small>
                    <span>Visit /properties for full details</span>
                  </div>
                </div>
              )}
            </div>
            <button className="ph-contact-close" onClick={() => setContactProp(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="ph-hero">
      <div className="ph-hero-wrapper">
        <div className="ph-hero-left">
          <div className="ph-hero-badge">
            <span className="ph-hero-badge-dot" />
            Finding homes across Malawi — No sign-up required
          </div>
          <h1>Find Your <em>Perfect Home</em><br />Anywhere in Malawi</h1>
          <p className="ph-hero-sub">
            No account needed. Browse verified houses, flats, and plots for rent or sale
            across all 28 districts — just pick your district and start exploring.
          </p>
          <div className="ph-hero-btns">
            <a className="ph-btn-primary" href="#browse-districts">
              <i className="fa fa-search" /> Browse by District
            </a>
            <a className="ph-btn-ghost" href="/register">
              <i className="fa fa-building" /> List Your Property
            </a>
          </div>
          <div className="ph-hero-trust">
            <div className="ph-hero-trust-item"><i className="fa fa-check-circle" /> No account to browse</div>
            <div className="ph-hero-trust-item"><i className="fa fa-check-circle" /> Pay via mobile money</div>
            <div className="ph-hero-trust-item"><i className="fa fa-check-circle" /> 2.5% service fee only</div>
          </div>
          <div className="ph-hero-stats">
            <div className="ph-hero-stat"><strong>340+</strong><span>Properties Listed</span></div>
            <div className="ph-hero-stat"><strong>28</strong><span>Districts Covered</span></div>
            <div className="ph-hero-stat"><strong>🛡️</strong><span>Dispute Protection</span></div>
          </div>
        </div>
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
      <div className="ph-wave" />
      <div className="ph-wave ph-wave2" />
      <div className="ph-wave ph-wave3" />
    </section>
  );
}

// ── Trust Bar ─────────────────────────────────────────────────────────────────
function TrustBar() {
  return (
    <div className="ph-trust-bar">
      <div className="ph-trust-bar-inner">
        <div className="ph-trust-item"><i className="fa fa-shield-alt" /> Registered Malawian platform</div>
        <div className="ph-trust-divider" />
        <div className="ph-trust-item"><i className="fa fa-user-slash" /> No account needed to browse</div>
        <div className="ph-trust-divider" />
        <div className="ph-trust-item"><i className="fa fa-mobile-alt" /> Powered by mobile money</div>
        <div className="ph-trust-divider" />
        <div className="ph-trust-item"><i className="fa fa-map-marker-alt" /> All 28 districts covered</div>
        <div className="ph-trust-divider" />
        <div className="ph-trust-item"><i className="fa fa-lock" /> Dispute protection built in</div>
      </div>
    </div>
  );
}

// ── Districts — sliding property cards ───────────────────────────────────────
function DistrictsSection({ allProperties }) {
  const [filtered, setFiltered]   = useState([]);
  const [locSearch, setLocSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [current, setCurrent]     = useState(0);
  const [drawer, setDrawer]       = useState(null);
  const timerRef                  = useRef(null);

  const CARD_W  = 252; // 240px card + 12px gap
  const VIS_CNT = 4;

  // Populate slider from allProperties or fetch
  useEffect(() => {
    if (allProperties && allProperties.length > 0) {
      applyFilter(allProperties, locSearch, typeFilter);
    } else {
      fetch(`${API_URL}/properties?limit=500`)
        .then(r => r.json())
        .then(data => {
          if (data.success && Array.isArray(data.properties))
            applyFilter(data.properties, locSearch, typeFilter);
        })
        .catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProperties]);

  function applyFilter(source, loc, type) {
    const result = source.filter(p => {
      const matchLoc  = !loc  || (p.district || "").toLowerCase().includes(loc.toLowerCase())
                                || (p.title   || p.name || "").toLowerCase().includes(loc.toLowerCase());
      const matchType = !type || (p.propertyType || p.property_type || p.type || "").toLowerCase()
                                   .includes(type.toLowerCase());
      return matchLoc && matchType;
    });
    setFiltered(result);
    setCurrent(0);
  }

  const handleSearch = () => {
    const source = allProperties && allProperties.length > 0 ? allProperties : [];
    applyFilter(source, locSearch, typeFilter);
  };

  const maxIdx = Math.max(0, filtered.length - VIS_CNT);

  const slide = useCallback((idx) => {
    setCurrent(Math.max(0, Math.min(idx, maxIdx)));
  }, [maxIdx]);

  const resetAuto = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(c => (c >= maxIdx ? 0 : c + 1));
    }, 4000);
  }, [maxIdx]);

  useEffect(() => {
    resetAuto();
    return () => clearInterval(timerRef.current);
  }, [resetAuto]);

  const dotCount = Math.min(maxIdx + 1, 8);

  return (
    <>
      <section className="ph-dist-sec" id="browse-districts">
        <p className="ph-sec-label">Browse by location</p>
        <h2 className="ph-sec-title">Find Properties by <em style={{ color: "#2d8a72" }}>District</em></h2>
        <p className="ph-sec-sub">Search by location or type, then click any property to see full details — no sign-up needed.</p>

        {/* Search bar */}
        <div className="ph-dist-search">
          <input
            type="text"
            placeholder="Search district or property name..."
            value={locSearch}
            onChange={e => setLocSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
          />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">All types</option>
            {PROPERTY_TYPES.map(t => (
              <option key={t.label} value={t.label}>{t.label}</option>
            ))}
          </select>
          <button className="ph-dist-search-btn" onClick={handleSearch}>
            <i className="fa fa-search" /> Search
          </button>
        </div>

        {/* Slider */}
        <div className="ph-prop-slider-outer">
          {filtered.length === 0 ? (
            <div className="ph-prop-empty">
              <i className="fa fa-search" style={{ fontSize: "2rem", opacity: 0.3, display: "block", marginBottom: "0.75rem" }} />
              No properties found. Try a different search.
            </div>
          ) : (
            <div
              className="ph-prop-track"
              style={{ transform: `translateX(-${current * CARD_W}px)` }}
            >
              {filtered.map((p, i) => {
                const imgs = p.images || p.photos || [];
                const imgSrc = imgs[0] || FALLBACK_IMGS[i % FALLBACK_IMGS.length];
                const isForSale = (p.listingType || p.listing_type || "").toLowerCase().includes("sale");
                const propType  = p.propertyType || p.property_type || p.type || "Property";
                const price     = p.price ? "MWK " + Number(p.price).toLocaleString() + (isForSale ? "" : "/mo") : "Price on request";

                return (
                  <button
                    key={p._id || p.id || i}
                    className="ph-slide-card"
                    onClick={() => setDrawer({ label: p.district, icon: "fa fa-map-marker-alt" })}
                  >
                    <img
                      src={imgSrc}
                      alt={p.title || p.name || "Property"}
                      className="ph-slide-img"
                      onError={e => { e.target.src = FALLBACK_IMGS[i % FALLBACK_IMGS.length]; }}
                    />
                    <div className="ph-slide-body">
                      <div className="ph-slide-district">{p.district || "Malawi"}</div>
                      <div className="ph-slide-name">{p.title || p.name || "Property"}</div>
                      <div className="ph-slide-meta">
                        {(p.bedrooms || p.beds) && <span><i className="fa fa-bed" /> {p.bedrooms || p.beds} bed</span>}
                        {(p.bathrooms || p.baths) && <span><i className="fa fa-bath" /> {p.bathrooms || p.baths}</span>}
                      </div>
                      <span className="ph-slide-badge">{propType}</span>
                      <div className="ph-slide-price">{price}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Nav dots + arrows */}
        {filtered.length > VIS_CNT && (
          <div className="ph-prop-nav">
            <div className="ph-prop-dots">
              {Array.from({ length: dotCount }).map((_, i) => (
                <button
                  key={i}
                  className={`ph-prop-dot${current === i ? " active" : ""}`}
                  onClick={() => { slide(i); resetAuto(); }}
                />
              ))}
            </div>
            <div className="ph-prop-nav-btns">
              <button className="ph-prop-nav-btn" onClick={() => { slide(current - 1); resetAuto(); }}>&#8592;</button>
              <button className="ph-prop-nav-btn" onClick={() => { slide(current + 1); resetAuto(); }}>&#8594;</button>
            </div>
          </div>
        )}
      </section>

      {drawer && (
        <BrowseDrawer
          filter="district"
          filterValue={drawer.label}
          filterIcon={drawer.icon}
          onClose={() => setDrawer(null)}
          allProperties={allProperties}
        />
      )}
    </>
  );
}

// ── Property Types ────────────────────────────────────────────────────────────
function TypesSection({ allProperties }) {
  const [drawer, setDrawer] = useState(null);

  return (
    <>
      <section className="ph-types-sec">
        <p className="ph-sec-label">What are you looking for?</p>
        <h2 className="ph-sec-title">Browse by <em>Property Type</em></h2>
        <p className="ph-sec-sub">Whether you need a room, a house, or land to build on — tap any type to see live listings.</p>
        <div className="ph-types-grid">
          {PROPERTY_TYPES.map(t => (
            <button key={t.label} className="ph-type-card" onClick={() => setDrawer(t)}>
              <i className={t.icon} />
              <h4>{t.label}</h4>
              <span>{t.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {drawer && (
        <BrowseDrawer
          filter="type"
          filterValue={drawer.label}
          filterIcon={drawer.icon}
          onClose={() => setDrawer(null)}
          allProperties={allProperties}
        />
      )}
    </>
  );
}

// ── Locations Photo Grid ──────────────────────────────────────────────────────
function LocationsSection({ onDistrictClick }) {
  const locs = [
    { img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop", big: true, count: "12+ Properties", name: "Lilongwe",  desc: "Capital City — All Types",    icon: "fa fa-city"           },
    { img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&auto=format&fit=crop",           count: "9 Properties",   name: "Blantyre",  desc: "Commercial Hub",             icon: "fa fa-building"       },
    { img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop",           count: "5 Properties",   name: "Zomba",     desc: "University Town",            icon: "fa fa-university"     },
    { img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop",           count: "4 Properties",   name: "Mzuzu",     desc: "Northern Region Hub",        icon: "fa fa-mountain"       },
    { img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop",           count: "6 Properties",   name: "Mangochi",  desc: "Lakeshore Living",           icon: "fa fa-water"          },
  ];
  return (
    <section className="ph-locs-sec">
      <p className="ph-sec-label">Our property areas</p>
      <h2 className="ph-sec-title">Top Locations Across <em>Malawi</em></h2>
      <div className="ph-locs-grid">
        {locs.map(l => (
          <button key={l.name} className={`ph-loc-card${l.big ? " big" : ""}`} onClick={() => onDistrictClick(l)}>
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

// ── Dual Section ──────────────────────────────────────────────────────────────
function DualSection() {
  return (
    <div className="ph-dual-sec">
      <div className="ph-dual-card">
        <div className="ph-dual-icon tenant"><i className="fa fa-user" /></div>
        <h3>For Tenants & Buyers</h3>
        <div className="ph-dual-note">✓ No account required</div>
        <p>Browse all verified properties, view photos, see prices and get landlord contact info directly — completely free, no sign-up needed.</p>
        <a href="#browse-districts" className="ph-btn-outline">Start Browsing</a>
      </div>
      <div className="ph-dual-card">
        <div className="ph-dual-icon landlord"><i className="fa fa-building" /></div>
        <h3>For Landlords & Owners</h3>
        <div className="ph-dual-note">✓ Register to list properties</div>
        <p>Create a landlord account to list your house, flat, room, or plot. Receive inquiries from verified tenants and manage everything from your dashboard.</p>
        <a href="/register" className="ph-btn-outline">Register as Landlord</a>
      </div>
    </div>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    { icon: "fa fa-search",        title: "Browse Freely",       desc: "No account needed. Filter by district, price, and property type to find your home instantly." },
    { icon: "fa fa-comments",      title: "Direct Contact",      desc: "Get the landlord's phone number and call or WhatsApp directly — no middlemen, no extra fees." },
    { icon: "fa fa-shield-alt",    title: "Verified Listings",   desc: "Every landlord is verified before listing to protect tenants from fraud." },
    { icon: "fa fa-balance-scale", title: "Dispute Resolution",  desc: "If a problem arises with your landlord, our team mediates and resolves it fairly." },
  ];
  return (
    <section className="ph-features-sec">
      <p className="ph-sec-label">Why choose us</p>
      <h2 className="ph-sec-title">Why Choose <em>PezaNyumba?</em></h2>
      <div className="ph-features-grid">
        {features.map(f => (
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

// ── Main Export ───────────────────────────────────────────────────────────────
export default function Home() {
  const [allProperties, setAllProperties] = useState([]);
  const [locDrawer, setLocDrawer]         = useState(null);

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

      <Hero />
      <TrustBar />
      <DistrictsSection allProperties={allProperties} />
      <TypesSection allProperties={allProperties} />
      <LocationsSection onDistrictClick={(l) => setLocDrawer(l)} />
      <DualSection />
      <FeaturesSection />
      <FAQSection />

      <section className="ph-cta-sec">
        <h2>Are you a Landlord or Land Owner?</h2>
        <p>Register once and start listing your properties to thousands of tenants across Malawi.</p>
        <a href="/register" className="ph-btn-primary">
          <i className="fa fa-user-plus" /> Register as Landlord
        </a>
        <p className="ph-cta-note">Already have an account? <a href="/login" style={{color:"#4dd9b8",fontWeight:700}}>Sign in here</a></p>
      </section>

      {locDrawer && (
        <BrowseDrawer
          filter="district"
          filterValue={locDrawer.name}
          filterIcon={locDrawer.icon}
          onClose={() => setLocDrawer(null)}
          allProperties={allProperties}
        />
      )}
    </>
  );
}