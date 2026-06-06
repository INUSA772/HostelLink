/**
 * PezaNyumba — Home.jsx
 *
 * Changes from original:
 * ─────────────────────────────────────────────────────────────────────────────
 * BRANDING
 *   • All "PezaHostel" references replaced with "PezaNyumba"
 *   • All "MUBAS" references replaced with "Malawi"
 *
 * BUGS FIXED
 *   • Property cards now navigate to /properties/:id on click (not broken drawer)
 *   • Slide cards open BrowseDrawer correctly without firing on drag
 *   • WhatsApp number formatter handles both +265 and 0-prefixed numbers
 *   • trackWhatsappClick uses correct /properties endpoint, not /admin/hostels
 *   • API calls fall back gracefully when both /properties and /hostels return nothing
 *   • District drawer opened from LocationsSection now passes correct name field
 *   • BrowseDrawer "View All" link points to /properties (was /properties but nav was broken)
 *   • AnimCard with-image body wrapper rendered incorrectly when no image — fixed
 *
 * UX / DESIGN
 *   • Hero Browse button scrolls to #browse-districts (kept)
 *   • Register CTA links corrected (/register preserved)
 *   • Footer links added: Home, Properties, About, Contact, Login, Register
 *   • Trust bar responsive improvements
 *   • Sticky top navbar added for logged-in / guest state
 *   • SEO meta tags rendered via react-helmet-async (with graceful fallback)
 *   • Open Graph + structured data (JSON-LD) injected in <head>
 *
 * PERFORMANCE
 *   • allProperties fetch deduped — fetches once, shared across all sections
 *   • Images use loading="lazy"
 *   • FALLBACK_IMGS served deterministically (index mod length)
 *
 * SECURITY
 *   • WhatsApp href uses safe number cleaning (no eval/injection risk)
 *   • External links get rel="noopener noreferrer"
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SITE_URL = import.meta.env.VITE_SITE_URL || "https://pezanyumba.mw";

/* ── WhatsApp helper ────────────────────────────────────────────────────── */
function waLink(num) {
  if (!num) return null;
  const clean = String(num).replace(/\D/g, "");
  if (!clean) return null;
  const intl = clean.startsWith("265") ? clean : clean.startsWith("0") ? "265" + clean.slice(1) : "265" + clean;
  return `https://wa.me/${intl}`;
}

function trackWhatsappClick(propertyId) {
  if (!propertyId) return;
  fetch(`${API_URL}/properties/${propertyId}/whatsapp-click`, { method: "POST" }).catch(() => {});
}

/* ── Constants ──────────────────────────────────────────────────────────── */
const PROPERTY_TYPES = [
  { icon: "fa fa-home",         label: "House",            desc: "Family homes"         },
  { icon: "fa fa-building",     label: "Flat/Apartment",   desc: "Modern apartments"    },
  { icon: "fa fa-bed",          label: "Single Room",      desc: "Affordable rooms"     },
  { icon: "fa fa-door-closed",  label: "Self-Contained",   desc: "Own entrance & bath"  },
  { icon: "fa fa-seedling",     label: "Plot of Land",     desc: "Build your dream"     },
  { icon: "fa fa-store",        label: "Commercial Space", desc: "Shops & offices"      },
];

const FAQ_ITEMS = [
  { question: "How do I find a house on PezaNyumba?",       answer: "No account needed! Browse by district or type, view full details, then WhatsApp or call the landlord directly." },
  { question: "Do I need an account to search?",            answer: "No. Tenants and buyers browse all listings, see prices and photos, and contact landlords completely free." },
  { question: "Who can create an account on PezaNyumba?",   answer: "Only landlords and land owners. Tenants just browse freely — no sign-up needed." },
  { question: "How does PezaNyumba verify landlords?",      answer: "Every landlord goes through identity and property verification before their listing goes live." },
  { question: "Can I list my property on PezaNyumba?",      answer: "Yes — if you're a landlord or land owner. Register, fill in details, upload photos, and your listing goes live within 24 hours." },
];

const ANIM_COL1 = [
  { theme: "blue",   icon: "fa fa-shield-alt",     title: "Verified Properties", sub: "All listings checked & approved" },
  { theme: "orange", icon: "fa fa-tag",             title: "Best Prices",         sub: "Affordable for every budget",    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop" },
  { theme: "green",  icon: "fa fa-check-circle",   title: "Trusted Landlords",   sub: "Identity-verified owners"        },
  { theme: "purple", icon: "fa fa-map-marker-alt", title: "All Districts",        sub: "28 districts covered",           image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&auto=format&fit=crop" },
  { theme: "blue",   icon: "fa fa-shield-alt",     title: "Verified Properties", sub: "All listings checked & approved" },
  { theme: "orange", icon: "fa fa-tag",             title: "Best Prices",         sub: "Affordable for every budget",    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop" },
  { theme: "green",  icon: "fa fa-check-circle",   title: "Trusted Landlords",   sub: "Identity-verified owners"        },
  { theme: "purple", icon: "fa fa-map-marker-alt", title: "All Districts",        sub: "28 districts covered",           image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&auto=format&fit=crop" },
];
const ANIM_COL2 = [
  { theme: "cyan",   icon: "fa fa-bolt",     title: "Quick Inquiry",    sub: "Contact landlords in seconds", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&auto=format&fit=crop" },
  { theme: "yellow", icon: "fa fa-headset",  title: "Dispute Support",  sub: "We resolve problems fairly"  },
  { theme: "red",    icon: "fa fa-comments", title: "Direct Messaging", sub: "Chat with landlords safely",  image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&auto=format&fit=crop" },
  { theme: "pink",   icon: "fa fa-star",     title: "Top Rated",        sub: "Reviews from real tenants"   },
  { theme: "cyan",   icon: "fa fa-bolt",     title: "Quick Inquiry",    sub: "Contact landlords in seconds", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&auto=format&fit=crop" },
  { theme: "yellow", icon: "fa fa-headset",  title: "Dispute Support",  sub: "We resolve problems fairly"  },
  { theme: "red",    icon: "fa fa-comments", title: "Direct Messaging", sub: "Chat with landlords safely",  image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&auto=format&fit=crop" },
  { theme: "pink",   icon: "fa fa-star",     title: "Top Rated",        sub: "Reviews from real tenants"   },
];

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&auto=format&fit=crop",
];

/* ── Normalise API responses ────────────────────────────────────────────── */
function normalise(p) {
  return {
    _id:            p._id || p.id || "",
    name:           p.name || p.title || "Unnamed Property",
    description:    p.description || "",
    type:           p.type || p.propertyType || p.property_type || "",
    listingType:    p.listingType || p.listing_type || "For Rent",
    price:          Number(p.price) || 0,
    district:       p.district || p.location?.city || "",
    address:        p.address || p.location?.formattedAddress || "",
    bedrooms:       Number(p.bedrooms || p.beds) || 0,
    bathrooms:      Number(p.bathrooms || p.baths) || 0,
    availableRooms: Number(p.availableRooms || p.available_rooms) || 0,
    gender:         p.gender || "",
    amenities:      Array.isArray(p.amenities) ? p.amenities : [],
    images:         Array.isArray(p.images) ? p.images : Array.isArray(p.photos) ? p.photos : [],
    contactPhone:   p.contactPhone || p.phone || p.owner?.phone || "",
    whatsapp:       p.whatsapp || p.contactPhone || p.phone || p.owner?.phone || "",
    ownerName:      p.owner ? `${p.owner.firstName || ""} ${p.owner.lastName || ""}`.trim() : "",
  };
}

function formatPrice(price, listingType) {
  if (!price) return "Price on request";
  const forSale = (listingType || "").toLowerCase().includes("sale");
  return "MWK " + Number(price).toLocaleString() + (forSale ? "" : "/mo");
}

/* ── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --teal-dark:#0d4a40; --teal:#1a5c52; --teal-mid:#2d8a72;
    --teal-light:#e8f5f2; --teal-pale:#f0faf7;
    --cream:#f8f9f7; --white:#fff; --gray-bg:#f4f6f4;
    --dark:#0a0a0a; --mid:#4b5563; --light-border:#e2ede9;
    --radius:14px; --green-check:#22c55e; --wa:#25D366;
    --nav-h:60px;
  }
  html { scroll-behavior:smooth; }
  body { font-family:'Manrope',sans-serif; color:var(--dark); background:#fff; overflow-x:hidden; }
  a { text-decoration:none; color:inherit; }
  button { font-family:inherit; cursor:pointer; border:none; background:none; padding:0; }

  /* ── TOP NAV ── */
  .pn-topnav {
    position:fixed; top:0; left:0; right:0; z-index:900;
    height:var(--nav-h); background:rgba(10,25,20,.92);
    backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
    display:flex; align-items:center; justify-content:space-between;
    padding:0 1.5rem; border-bottom:1px solid rgba(255,255,255,.07);
  }
  .pn-topnav-logo { display:flex; align-items:center; gap:10px; text-decoration:none; }
  .pn-topnav-icon { width:34px; height:34px; border-radius:9px; background:var(--teal); display:flex; align-items:center; justify-content:center; font-size:.85rem; font-weight:800; color:white; flex-shrink:0; }
  .pn-topnav-brand { font-size:.9rem; font-weight:800; color:white; letter-spacing:.5px; }
  .pn-topnav-brand span { color:rgba(255,255,255,.45); font-size:.65rem; display:block; font-weight:500; }
  .pn-topnav-links { display:flex; align-items:center; gap:.5rem; }
  .pn-topnav-link { color:rgba(255,255,255,.72); font-size:.82rem; font-weight:600; padding:.38rem .85rem; border-radius:6px; border:1px solid transparent; text-decoration:none; transition:all .18s; display:inline-flex; align-items:center; gap:5px; }
  .pn-topnav-link:hover { border-color:rgba(255,255,255,.25); color:#fff; }
  .pn-topnav-btn { font-size:.82rem; font-weight:700; padding:.38rem 1rem; border-radius:6px; text-decoration:none; display:inline-flex; align-items:center; gap:5px; transition:all .18s; }
  .pn-topnav-btn.ghost { color:rgba(255,255,255,.78); border:1px solid rgba(255,255,255,.25); }
  .pn-topnav-btn.ghost:hover { border-color:rgba(255,255,255,.5); color:#fff; }
  .pn-topnav-btn.solid { background:var(--teal); color:white; border:none; }
  .pn-topnav-btn.solid:hover { background:var(--teal-dark); }
  @media(max-width:600px){ .pn-topnav-link{ display:none } .pn-topnav-brand span{ display:none } }

  /* ── HERO ── */
  .ph-hero {
    min-height:100vh; width:100%;
    padding-top:var(--nav-h);
    background-image:url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80');
    background-size:cover; background-position:center; background-attachment:fixed;
    display:flex; align-items:center; justify-content:center; flex-direction:column;
    text-align:center; padding-left:1.2rem; padding-right:1.2rem; padding-bottom:4rem;
    position:relative; overflow:hidden;
  }
  .ph-hero::before {
    content:''; position:absolute; inset:0; pointer-events:none; z-index:1;
    background:linear-gradient(160deg,rgba(5,22,10,.80) 0%,rgba(10,40,25,.74) 50%,rgba(5,30,18,.82) 100%);
  }
  .ph-hero-wrapper { display:flex; align-items:center; justify-content:center; gap:3rem; width:100%; max-width:1200px; position:relative; z-index:2; }
  .ph-hero-left { flex:1; min-width:0; text-align:left; }
  .ph-hero-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.25); border-radius:999px; padding:.4rem 1rem; font-size:.82rem; font-weight:600; color:rgba(255,255,255,.90); margin-bottom:1.5rem; backdrop-filter:blur(6px); }
  .ph-hero-badge-dot { width:8px; height:8px; border-radius:50%; background:var(--green-check); flex-shrink:0; animation:pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
  .ph-hero-left h1 { font-family:'Poppins',sans-serif; font-size:clamp(2rem,5vw,3.5rem); font-weight:800; color:white; line-height:1.15; margin-bottom:1rem; }
  .ph-hero-left h1 em { color:#4dd9b8; font-style:normal; }
  .ph-hero-sub { font-size:clamp(.9rem,2vw,1.05rem); color:rgba(255,255,255,.75); max-width:480px; line-height:1.8; margin-bottom:2rem; }
  .ph-hero-btns { display:flex; gap:1rem; flex-wrap:wrap; }
  .ph-btn-primary { background:var(--teal); color:white; padding:.85rem 2rem; border-radius:10px; font-size:.95rem; font-weight:700; display:inline-flex; align-items:center; gap:8px; transition:background .2s,transform .15s; text-decoration:none; box-shadow:0 4px 16px rgba(13,74,64,.3); }
  .ph-btn-primary:hover { background:var(--teal-dark); transform:translateY(-1px); }
  .ph-btn-ghost { background:rgba(255,255,255,.12); color:white; border:1.5px solid rgba(255,255,255,.4); padding:.85rem 2rem; border-radius:10px; font-size:.95rem; font-weight:700; display:inline-flex; align-items:center; gap:8px; transition:all .2s; text-decoration:none; backdrop-filter:blur(4px); }
  .ph-btn-ghost:hover { background:rgba(255,255,255,.22); }
  .ph-hero-trust { display:flex; gap:2rem; flex-wrap:wrap; margin-top:1.8rem; }
  .ph-hero-trust-item { display:flex; align-items:center; gap:6px; font-size:.84rem; font-weight:600; color:rgba(255,255,255,.80); }
  .ph-hero-trust-item i { color:var(--green-check); }
  .ph-hero-stats { display:flex; gap:2.5rem; flex-wrap:wrap; margin-top:2rem; padding-top:2rem; border-top:1px solid rgba(255,255,255,.15); }
  .ph-hero-stat strong { display:block; font-family:'Poppins',sans-serif; font-size:1.6rem; font-weight:800; color:#4dd9b8; }
  .ph-hero-stat span { font-size:.78rem; color:rgba(255,255,255,.55); }
  .ph-hero-right { flex:1; display:flex; align-items:center; justify-content:center; }
  .ph-cards-mask { position:relative; height:420px; overflow:hidden; display:flex; gap:1.2rem; align-items:flex-start; }
  .ph-cards-mask::before,.ph-cards-mask::after { content:''; position:absolute; left:0; right:0; height:80px; z-index:3; pointer-events:none; }
  .ph-cards-mask::before { top:0; background:linear-gradient(to bottom,rgba(5,22,10,.7),transparent); }
  .ph-cards-mask::after  { bottom:0; background:linear-gradient(to top,rgba(5,22,10,.7),transparent); }
  .ph-cards-col { display:flex; flex-direction:column; gap:1.2rem; }
  .ph-cards-up   { animation:scrollUp   20s linear infinite; }
  .ph-cards-down { animation:scrollDown 25s linear infinite; margin-top:60px; }
  @keyframes scrollUp   { 0%{transform:translateY(0)}    100%{transform:translateY(-50%)} }
  @keyframes scrollDown { 0%{transform:translateY(-50%)} 100%{transform:translateY(0)} }
  .ph-anim-card { width:170px; border-radius:16px; overflow:hidden; display:flex; flex-direction:column; align-items:flex-start; box-shadow:0 8px 28px rgba(0,0,0,.08); border:1px solid rgba(0,0,0,.07); background:white; flex-shrink:0; transition:transform .2s; }
  .ph-anim-card:hover { transform:scale(1.04); }
  .ph-anim-img { width:100%; height:110px; object-fit:cover; display:block; }
  .ph-anim-body { padding:.9rem; display:flex; flex-direction:column; gap:.4rem; }
  .ph-anim-icon { width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:1rem; color:white; flex-shrink:0; }
  .ph-anim-title { font-size:.8rem; font-weight:800; color:#111; line-height:1.2; }
  .ph-anim-sub   { font-size:.7rem; color:#6b7280; line-height:1.4; }
  .ph-anim-card.blue   .ph-anim-icon{background:var(--teal)}
  .ph-anim-card.orange .ph-anim-icon{background:var(--teal-mid)}
  .ph-anim-card.green  .ph-anim-icon{background:#059669}
  .ph-anim-card.purple .ph-anim-icon{background:var(--teal-dark)}
  .ph-anim-card.cyan   .ph-anim-icon{background:#0891b2}
  .ph-anim-card.yellow .ph-anim-icon{background:var(--teal-mid)}
  .ph-anim-card.red    .ph-anim-icon{background:var(--teal)}
  .ph-anim-card.pink   .ph-anim-icon{background:#0d6e5e}
  .ph-wave { position:absolute; bottom:-.5rem; left:0; width:100%; height:11rem; z-index:3; background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='0.04' d='M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,176C672,181,768,139,864,128C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L0,320Z'/%3E%3C/svg%3E") repeat-x; background-size:1440px 11rem; animation:waves 8s linear infinite; }
  .ph-wave2 { animation-direction:reverse; animation-duration:6s; opacity:.3; }
  .ph-wave3 { animation-duration:4s; opacity:.5; }
  @keyframes waves { 0%{background-position-x:0} 100%{background-position-x:1440px} }
  @media(max-width:1024px){
    .ph-hero-wrapper{flex-direction:column;text-align:center;gap:2rem}
    .ph-hero-left{text-align:center} .ph-hero-sub{margin:0 auto 2rem}
    .ph-hero-btns{justify-content:center} .ph-hero-stats{justify-content:center}
    .ph-hero-trust{justify-content:center} .ph-cards-mask{height:280px} .ph-anim-card{width:148px}
  }
  @media(max-width:768px){
    .ph-hero-right{display:none} .ph-hero-btns{flex-direction:column;align-items:center}
    .ph-btn-primary,.ph-btn-ghost{width:100%;max-width:300px;justify-content:center}
    .ph-hero-stats{gap:1.5rem}
  }

  /* ── TRUST BAR ── */
  .ph-trust-bar { background:var(--cream); border-top:1px solid var(--light-border); border-bottom:1px solid var(--light-border); padding:1.2rem; overflow-x:auto; }
  .ph-trust-bar-inner { max-width:1100px; margin:0 auto; display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:2rem; white-space:nowrap; }
  .ph-trust-item { display:flex; align-items:center; gap:8px; font-size:.84rem; font-weight:600; color:var(--mid); }
  .ph-trust-item i { font-size:1.1rem; color:var(--teal); }
  .ph-trust-divider { width:1px; height:28px; background:var(--light-border); flex-shrink:0; }
  @media(max-width:640px){ .ph-trust-divider{display:none} }

  /* ── SHARED SECTION ── */
  .ph-sec-label { font-size:.73rem; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:var(--teal-mid); text-align:center; margin-bottom:.5rem; }
  .ph-sec-title { font-family:'Poppins',sans-serif; font-size:clamp(1.6rem,3.5vw,2.3rem); font-weight:800; text-align:center; line-height:1.15; margin-bottom:.6rem; }
  .ph-sec-title em { font-style:normal; color:var(--teal-mid); }
  .ph-sec-sub { text-align:center; font-size:.93rem; line-height:1.8; color:var(--mid); max-width:520px; margin:0 auto 2.5rem; }

  /* ── DISTRICTS / SLIDER ── */
  .ph-dist-sec { background:var(--gray-bg); padding:clamp(3rem,6vw,5.5rem) 1.2rem; }
  .ph-dist-search { display:flex; gap:.6rem; max-width:640px; margin:0 auto 2.5rem; flex-wrap:wrap; }
  .ph-dist-search input,.ph-dist-search select { flex:1; min-width:160px; padding:.65rem 1rem; border:1.5px solid #d1d5db; border-radius:10px; font-size:.88rem; background:white; color:#111; outline:none; font-family:inherit; transition:border .2s; }
  .ph-dist-search input:focus,.ph-dist-search select:focus { border-color:var(--teal); }
  .ph-dist-search-btn { background:var(--teal); color:white; border:none; border-radius:10px; padding:.65rem 1.4rem; font-size:.88rem; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition:background .2s; font-family:inherit; }
  .ph-dist-search-btn:hover { background:var(--teal-dark); }
  .ph-slider-viewport { overflow:hidden; max-width:1100px; margin:0 auto; position:relative; cursor:grab; user-select:none; -webkit-user-select:none; }
  .ph-slider-viewport:active { cursor:grabbing; }
  .ph-slider-track { display:flex; gap:1.2rem; transition:transform .55s cubic-bezier(.4,0,.2,1); will-change:transform; }
  .ph-slider-track.no-transition { transition:none !important; }
  .ph-slide-card { flex-shrink:0; width:240px; border-radius:16px; overflow:hidden; background:white; border:1.5px solid var(--light-border); cursor:pointer; text-align:left; padding:0; transition:transform .25s,box-shadow .25s; box-shadow:0 2px 12px rgba(0,0,0,.06); }
  .ph-slide-card:hover { transform:translateY(-6px); box-shadow:0 18px 40px rgba(13,74,64,.18); border-color:var(--teal-mid); }
  .ph-slide-img { width:100%; height:155px; object-fit:cover; display:block; pointer-events:none; }
  .ph-slide-body { padding:.95rem 1rem; }
  .ph-slide-district { font-size:.66rem; font-weight:700; text-transform:uppercase; letter-spacing:1.8px; color:var(--teal-mid); margin-bottom:.3rem; }
  .ph-slide-name { font-size:.93rem; font-weight:800; color:#111; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:.25rem; }
  .ph-slide-meta { font-size:.74rem; color:#6b7280; display:flex; gap:.7rem; margin-top:.35rem; flex-wrap:wrap; }
  .ph-slide-badge { display:inline-block; font-size:.64rem; font-weight:700; padding:2px 9px; border-radius:20px; background:var(--teal-light); color:var(--teal-dark); margin-top:.45rem; }
  .ph-slide-price { font-size:.92rem; font-weight:800; color:var(--teal); margin-top:.45rem; }
  .ph-prop-nav { display:flex; align-items:center; justify-content:space-between; max-width:1100px; margin:1.4rem auto 0; }
  .ph-prop-dots { display:flex; gap:6px; }
  .ph-prop-dot { width:8px; height:8px; border-radius:50%; background:#d1d5db; border:none; cursor:pointer; padding:0; transition:all .3s; }
  .ph-prop-dot.active { background:var(--teal); width:24px; border-radius:4px; }
  .ph-prop-nav-btns { display:flex; gap:.5rem; }
  .ph-prop-nav-btn { width:38px; height:38px; border-radius:50%; border:1.5px solid var(--teal); background:white; color:var(--teal); font-size:1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .2s; }
  .ph-prop-nav-btn:hover { background:var(--teal); color:white; }
  .ph-prop-empty { text-align:center; padding:2.5rem; color:var(--mid); font-size:.9rem; background:white; border-radius:var(--radius); border:1.5px dashed var(--light-border); }
  @media(max-width:1100px){ .ph-slide-card{ width: calc((100vw - 3.6rem) / 3) } }
  @media(max-width:768px)  { .ph-slide-card{ width: calc((100vw - 3rem) / 2) } }
  @media(max-width:520px)  { .ph-slide-card{ width: calc(100vw - 2.4rem) } }

  /* ── PROPERTY TYPES ── */
  .ph-types-sec { background:white; padding:clamp(3rem,6vw,5.5rem) 1.2rem; }
  .ph-types-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(155px,1fr)); gap:1rem; max-width:1100px; margin:0 auto; }
  .ph-type-card { background:var(--teal-pale); border:1.5px solid var(--light-border); border-radius:var(--radius); padding:1.8rem 1rem; text-align:center; color:var(--dark); transition:all .25s; cursor:pointer; }
  .ph-type-card:hover { background:var(--teal); border-color:var(--teal); color:white; transform:translateY(-5px); box-shadow:0 12px 28px rgba(26,92,82,.20); }
  .ph-type-card i { font-size:1.7rem; color:var(--teal); display:block; margin-bottom:.75rem; transition:color .25s; }
  .ph-type-card:hover i { color:white; }
  .ph-type-card h4 { font-size:.95rem; font-weight:800; margin-bottom:.4rem; }
  .ph-type-card span { font-size:.72rem; color:var(--mid); transition:color .25s; }
  .ph-type-card:hover span { color:rgba(255,255,255,.80); }
  @media(max-width:520px){ .ph-types-grid{grid-template-columns:repeat(2,1fr)} }

  /* ── DRAWER ── */
  .ph-browse-overlay { position:fixed; inset:0; background:rgba(5,22,10,.65); z-index:1000; display:flex; align-items:flex-end; justify-content:center; backdrop-filter:blur(4px); animation:fadeIn .25s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .ph-browse-drawer { background:white; width:100%; max-width:1100px; max-height:90vh; border-radius:20px 20px 0 0; display:flex; flex-direction:column; animation:slideUp .3s cubic-bezier(.34,1.56,.64,1); overflow:hidden; }
  @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
  .ph-browse-header { display:flex; align-items:center; justify-content:space-between; padding:1.4rem 1.6rem; border-bottom:1px solid var(--light-border); flex-shrink:0; }
  .ph-browse-header-left { display:flex; align-items:center; gap:.75rem; }
  .ph-browse-header-icon { width:40px; height:40px; border-radius:12px; background:var(--teal-light); display:flex; align-items:center; justify-content:center; font-size:1.1rem; color:var(--teal); }
  .ph-browse-header h3 { font-size:1.1rem; font-weight:800; color:var(--dark); }
  .ph-browse-header p  { font-size:.78rem; color:var(--mid); margin-top:1px; }
  .ph-browse-close { width:36px; height:36px; border-radius:10px; background:var(--gray-bg); border:1px solid var(--light-border); font-size:1.2rem; color:var(--mid); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .2s; }
  .ph-browse-close:hover { background:#fee2e2; color:#dc2626; border-color:#fca5a5; }
  .ph-browse-body { flex:1; overflow-y:auto; padding:1.4rem 1.6rem; }
  .ph-browse-loading { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:3rem; gap:1rem; color:var(--mid); font-size:.9rem; }
  .ph-spinner { width:36px; height:36px; border:3px solid var(--teal-light); border-top-color:var(--teal); border-radius:50%; animation:spin .7s linear infinite; }
  @keyframes spin { to{transform:rotate(360deg)} }
  .ph-browse-empty { text-align:center; padding:3rem 1rem; }
  .ph-browse-empty-icon { font-size:3rem; margin-bottom:1rem; opacity:.3; }
  .ph-browse-empty h4 { font-size:1rem; font-weight:700; color:var(--dark); margin-bottom:.5rem; }
  .ph-browse-empty p  { font-size:.85rem; color:var(--mid); }
  .ph-prop-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:1.2rem; }
  .ph-browse-footer { padding:1rem 1.6rem; border-top:1px solid var(--light-border); display:flex; align-items:center; justify-content:space-between; flex-shrink:0; background:var(--teal-pale); }
  .ph-browse-footer p { font-size:.82rem; color:var(--mid); }
  .ph-browse-footer strong { color:var(--teal-dark); }
  .ph-browse-see-all { background:var(--teal); color:white; padding:.55rem 1.4rem; border-radius:8px; font-size:.85rem; font-weight:700; display:inline-flex; align-items:center; gap:6px; transition:background .2s; text-decoration:none; border:none; cursor:pointer; font-family:inherit; }
  .ph-browse-see-all:hover { background:var(--teal-dark); }

  /* ── PROPERTY CARD ── */
  .ph-prop-card { border:1.5px solid var(--light-border); border-radius:var(--radius); overflow:hidden; background:white; transition:all .25s; box-shadow:0 2px 8px rgba(0,0,0,.05); display:flex; flex-direction:column; }
  .ph-prop-card:hover { transform:translateY(-4px); box-shadow:0 12px 30px rgba(13,74,64,.12); border-color:var(--teal-mid); }
  .ph-prop-img-wrap { position:relative; height:170px; overflow:hidden; background:var(--teal-light); flex-shrink:0; cursor:pointer; }
  .ph-prop-img-wrap img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .4s; }
  .ph-prop-card:hover .ph-prop-img-wrap img { transform:scale(1.05); }
  .ph-prop-no-img { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:2.5rem; color:var(--teal-mid); opacity:.4; }
  .ph-prop-badges { position:absolute; top:10px; left:10px; display:flex; gap:5px; flex-wrap:wrap; }
  .ph-prop-badge { font-size:.66rem; font-weight:700; padding:3px 9px; border-radius:20px; text-transform:uppercase; letter-spacing:.5px; }
  .ph-prop-badge.rent { background:var(--teal); color:white; }
  .ph-prop-badge.sale { background:#0891b2; color:white; }
  .ph-prop-badge.type { background:rgba(255,255,255,.92); color:#374151; }
  .ph-prop-body { padding:1rem; flex:1; cursor:pointer; }
  .ph-prop-name { font-size:.95rem; font-weight:800; color:var(--dark); margin-bottom:.3rem; line-height:1.3; }
  .ph-prop-loc  { font-size:.76rem; color:var(--mid); display:flex; align-items:center; gap:4px; margin-bottom:.6rem; }
  .ph-prop-loc i { color:var(--teal); font-size:.72rem; }
  .ph-prop-price { font-size:1.05rem; font-weight:800; color:var(--teal-dark); }
  .ph-prop-meta { display:flex; gap:.8rem; margin-top:.5rem; flex-wrap:wrap; }
  .ph-prop-meta-item { font-size:.72rem; color:var(--mid); display:flex; align-items:center; gap:3px; }
  .ph-prop-meta-item i { color:var(--teal); }
  .ph-prop-actions { padding:.75rem 1rem; border-top:1px solid var(--light-border); display:flex; gap:.5rem; }
  .ph-prop-wa { flex:1; background:var(--wa); color:white; border:none; border-radius:8px; padding:.5rem .5rem; font-size:.78rem; font-weight:700; display:flex; align-items:center; justify-content:center; gap:5px; text-decoration:none; transition:background .18s; cursor:pointer; }
  .ph-prop-wa:hover { background:#128c4e; }
  .ph-prop-call { background:var(--teal-light); color:var(--teal); border:1.5px solid var(--light-border); border-radius:8px; padding:.5rem .75rem; font-size:.78rem; font-weight:700; display:flex; align-items:center; gap:5px; text-decoration:none; transition:all .18s; }
  .ph-prop-call:hover { background:var(--teal); color:white; }
  .ph-prop-view { flex:1; background:var(--teal-light); color:var(--teal-dark); border:1.5px solid var(--light-border); border-radius:8px; padding:.5rem .75rem; font-size:.78rem; font-weight:700; display:flex; align-items:center; justify-content:center; gap:5px; text-decoration:none; transition:all .18s; }
  .ph-prop-view:hover { background:var(--teal); color:white; }

  /* ── LOCATIONS GRID ── */
  .ph-locs-sec { background:var(--teal-pale); padding:clamp(3rem,6vw,5.5rem) 1.2rem; }
  .ph-locs-grid { display:grid; grid-template-columns:2fr 1fr 1fr; grid-template-rows:220px 220px; gap:1rem; max-width:1100px; margin:2rem auto 0; }
  .ph-loc-card { border-radius:var(--radius); overflow:hidden; position:relative; border:none; background:transparent; padding:0; cursor:pointer; }
  .ph-loc-card img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .4s; }
  .ph-loc-card:hover img { transform:scale(1.06); }
  .ph-loc-card.big { grid-row:1/3; }
  .ph-loc-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(13,74,64,.80) 0%,transparent 55%); display:flex; flex-direction:column; justify-content:flex-end; padding:1.2rem; }
  .ph-loc-overlay small { color:rgba(255,255,255,.7); font-size:.74rem; }
  .ph-loc-overlay h4    { color:white; font-size:1rem; font-weight:700; }
  .ph-loc-overlay p     { color:rgba(255,255,255,.65); font-size:.8rem; }
  @media(max-width:768px){ .ph-locs-grid{grid-template-columns:1fr 1fr;grid-template-rows:auto} .ph-loc-card.big{grid-row:auto} .ph-loc-card{height:200px} }
  @media(max-width:520px){ .ph-locs-grid{grid-template-columns:1fr} .ph-loc-card{height:180px} }

  /* ── DUAL ── */
  .ph-dual-sec { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:2rem; padding:clamp(3rem,6vw,5.5rem) 1.2rem; max-width:1100px; margin:0 auto; }
  .ph-dual-card { background:white; padding:2.5rem 2rem; border-radius:var(--radius); text-align:center; box-shadow:0 8px 28px rgba(13,74,64,.08); border:1px solid var(--light-border); transition:all .3s; display:flex; flex-direction:column; align-items:center; }
  .ph-dual-card:hover { transform:translateY(-8px); box-shadow:0 20px 50px rgba(13,74,64,.14); }
  .ph-dual-icon { font-size:2.5rem; margin-bottom:1rem; }
  .ph-dual-icon.tenant   { color:var(--teal); }
  .ph-dual-icon.landlord { color:var(--teal-mid); }
  .ph-dual-card h3 { font-size:1.2rem; font-weight:800; color:var(--dark); margin-bottom:.75rem; }
  .ph-dual-card p  { color:var(--mid); font-size:.88rem; line-height:1.75; margin-bottom:1.5rem; }
  .ph-dual-note { font-size:.75rem; color:var(--teal-mid); font-weight:700; background:var(--teal-light); padding:.35rem .9rem; border-radius:20px; margin-bottom:1.2rem; }
  .ph-btn-outline { border:2px solid var(--teal); color:var(--teal); background:transparent; padding:.55rem 1.4rem; border-radius:8px; font-size:.88rem; font-weight:700; transition:all .2s; display:inline-block; text-decoration:none; }
  .ph-btn-outline:hover { background:var(--teal); color:white; }

  /* ── FEATURES ── */
  .ph-features-sec { background:var(--gray-bg); padding:clamp(3rem,6vw,5.5rem) 1.2rem; text-align:center; }
  .ph-features-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1.5rem; max-width:1100px; margin:2.5rem auto 0; }
  .ph-feature-card { background:white; padding:2rem; border-radius:var(--radius); box-shadow:0 6px 20px rgba(13,74,64,.07); transition:transform .3s; border:1px solid var(--light-border); }
  .ph-feature-card:hover { transform:translateY(-6px); }
  .ph-feature-card i { font-size:2rem; color:var(--teal); display:block; margin-bottom:1rem; }
  .ph-feature-card h4 { font-size:1rem; font-weight:700; color:var(--dark); margin-bottom:.5rem; }
  .ph-feature-card p  { font-size:.85rem; color:var(--mid); line-height:1.6; }

  /* ── FAQ ── */
  .ph-faq { position:relative; padding:clamp(3rem,6vw,5.5rem) 1.2rem clamp(4rem,8vw,6rem); background:var(--teal-pale); text-align:center; overflow:hidden; }
  .ph-faq-qmark { position:absolute; right:4%; top:50%; transform:translateY(-50%); font-size:clamp(8rem,20vw,22rem); font-weight:900; color:rgba(26,92,82,.05); pointer-events:none; z-index:1; font-family:'Poppins',sans-serif; line-height:1; }
  .ph-faq-inner { position:relative; z-index:2; }
  .ph-faq-heading { display:inline-block; font-size:clamp(2.2rem,5vw,3.5rem); color:var(--teal); position:relative; letter-spacing:.2rem; font-family:'Poppins',sans-serif; font-weight:600; margin-bottom:3rem; padding:.5rem 1.5rem; }
  .ph-faq-heading::before { content:''; position:absolute; top:0; left:0; width:1.8rem; height:1.8rem; border-top:.32rem solid var(--teal); border-left:.32rem solid var(--teal); }
  .ph-faq-heading::after  { content:''; position:absolute; bottom:0; right:0; width:1.8rem; height:1.8rem; border-bottom:.32rem solid var(--teal); border-right:.32rem solid var(--teal); }
  .ph-faq-list { max-width:860px; margin:0 auto; }
  .ph-acc { margin-bottom:.6rem; cursor:pointer; }
  .ph-acc-header { display:flex; align-items:stretch; }
  .ph-acc-plus { width:52px; flex-shrink:0; background:white; border:2px solid var(--teal); display:flex; align-items:center; justify-content:center; transition:all .3s; }
  .ph-acc-plus span { font-size:1.8rem; color:var(--teal); font-weight:300; line-height:1; transition:transform .3s,color .3s; display:block; }
  .ph-acc-label { flex:1; background:var(--teal); min-height:54px; display:flex; align-items:center; padding:0 1.6rem; transition:background .3s; }
  .ph-acc-label h3 { font-size:clamp(.82rem,2vw,1rem); font-weight:600; color:white; margin:0; text-align:left; font-family:'Poppins',sans-serif; }
  .ph-acc:hover .ph-acc-label { background:var(--teal-dark); }
  .ph-acc:hover .ph-acc-plus,.ph-acc.open .ph-acc-plus { background:var(--teal-light); }
  .ph-acc.open .ph-acc-plus span { transform:rotate(45deg); color:var(--teal); }
  .ph-acc-body { max-height:0; overflow:hidden; transition:max-height .4s ease,padding .3s; background:white; border:1px solid var(--light-border); border-top:none; border-left:3px solid var(--teal); text-align:left; }
  .ph-acc.open .ph-acc-body { max-height:400px; padding:1.2rem 1.8rem; }
  .ph-acc-body p { font-size:.95rem; line-height:1.8; color:var(--mid); font-family:'Poppins',sans-serif; }

  /* ── CTA ── */
  .ph-cta-sec { background:linear-gradient(135deg,var(--teal-dark) 0%,var(--teal) 100%); color:white; text-align:center; padding:clamp(3rem,6vw,5.5rem) 1.2rem; }
  .ph-cta-sec h2 { font-size:clamp(1.5rem,3vw,2rem); font-weight:800; margin-bottom:.75rem; color:white; }
  .ph-cta-sec p  { color:rgba(255,255,255,.80); margin-bottom:2rem; font-size:1rem; }
  .ph-cta-note { font-size:.8rem; color:rgba(255,255,255,.55); margin-top:1rem; }
  .ph-cta-sec .ph-btn-primary { background:white; color:var(--teal-dark); box-shadow:0 4px 20px rgba(0,0,0,.2); }
  .ph-cta-sec .ph-btn-primary:hover { background:var(--teal-pale); }

  /* ── FOOTER ── */
  .ph-footer { background:#0f1a17; color:rgba(255,255,255,.5); padding:clamp(2rem,5vw,3.5rem) 1.2rem 1.5rem; }
  .ph-footer-grid { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:2rem; max-width:1100px; margin:0 auto 2rem; }
  .ph-footer-brand strong { display:block; color:white; font-size:1rem; font-weight:800; margin-bottom:.5rem; }
  .ph-footer-brand p { font-size:.82rem; line-height:1.7; color:rgba(255,255,255,.42); max-width:260px; }
  .ph-footer-col h5 { color:rgba(255,255,255,.85); font-size:.8rem; font-weight:700; text-transform:uppercase; letter-spacing:.5px; margin-bottom:1rem; }
  .ph-footer-col a { display:block; color:rgba(255,255,255,.45); font-size:.82rem; margin-bottom:.5rem; transition:color .2s; text-decoration:none; }
  .ph-footer-col a:hover { color:#4dd9b8; }
  .ph-footer-bottom { border-top:1px solid rgba(255,255,255,.08); padding-top:1.2rem; text-align:center; font-size:.76rem; color:rgba(255,255,255,.28); max-width:1100px; margin:0 auto; }
  @media(max-width:900px){ .ph-footer-grid{grid-template-columns:1fr 1fr} .ph-footer-brand{grid-column:1/-1} }
  @media(max-width:480px){ .ph-footer-grid{grid-template-columns:1fr} }
`;

/* ══════════════════════════════════════════════════
   PROPERTY CARD
══════════════════════════════════════════════════ */
function PropertyCard({ property, onClick }) {
  const p        = normalise(property);
  const imgSrc   = p.images[0] || null;
  const forSale  = p.listingType.toLowerCase().includes("sale");
  const wa       = waLink(p.whatsapp);
  const callHref = p.contactPhone ? `tel:${p.contactPhone}` : null;

  return (
    <div className="ph-prop-card">
      <div className="ph-prop-img-wrap" onClick={() => onClick && onClick(p._id)}>
        {imgSrc
          ? <img src={imgSrc} alt={p.name} loading="lazy" />
          : <div className="ph-prop-no-img"><i className="fa fa-home" /></div>
        }
        <div className="ph-prop-badges">
          <span className={`ph-prop-badge ${forSale ? "sale" : "rent"}`}>{forSale ? "For Sale" : "For Rent"}</span>
          {p.type && <span className="ph-prop-badge type">{p.type}</span>}
        </div>
      </div>

      <div className="ph-prop-body" onClick={() => onClick && onClick(p._id)}>
        <div className="ph-prop-name">{p.name}</div>
        <div className="ph-prop-loc">
          <i className="fa fa-map-marker-alt" />
          {[p.address, p.district].filter(Boolean).join(", ") || "Malawi"}
        </div>
        <div className="ph-prop-price">{formatPrice(p.price, p.listingType)}</div>
        <div className="ph-prop-meta">
          {p.bedrooms  > 0 && <span className="ph-prop-meta-item"><i className="fa fa-bed"  /> {p.bedrooms} bed</span>}
          {p.bathrooms > 0 && <span className="ph-prop-meta-item"><i className="fa fa-bath" /> {p.bathrooms} bath</span>}
          {p.availableRooms > 0 && <span className="ph-prop-meta-item"><i className="fa fa-door-open" /> {p.availableRooms} avail.</span>}
        </div>
      </div>

      <div className="ph-prop-actions">
        {wa && (
          <a className="ph-prop-wa" href={wa} target="_blank" rel="noopener noreferrer"
            onClick={(e) => { e.stopPropagation(); trackWhatsappClick(p._id); }}>
            <i className="fab fa-whatsapp" /> WhatsApp
          </a>
        )}
        {callHref && (
          <a className="ph-prop-call" href={callHref} onClick={(e) => e.stopPropagation()}>
            <i className="fa fa-phone" /> Call
          </a>
        )}
        {p._id && (
          <Link className="ph-prop-view" to={`/properties/${p._id}`} onClick={(e) => e.stopPropagation()}>
            <i className="fa fa-eye" /> View
          </Link>
        )}
        {!wa && !callHref && (
          <span style={{ fontSize: ".75rem", color: "#9ca3af", padding: ".5rem" }}>No contact info</span>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   BROWSE DRAWER
══════════════════════════════════════════════════ */
function BrowseDrawer({ filter, filterValue, filterIcon, onClose, allProperties }) {
  const navigate  = useNavigate();
  const [loading, setLoading]       = useState(true);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    setLoading(true);
    const source = Array.isArray(allProperties) && allProperties.length > 0
      ? allProperties
      : null;

    if (source) {
      const filtered = source.filter(raw => {
        const p = normalise(raw);
        if (filter === "district") return p.district.toLowerCase() === filterValue.toLowerCase();
        if (filter === "type")
          return p.type.toLowerCase().includes(filterValue.toLowerCase())
              || filterValue.toLowerCase().includes(p.type.toLowerCase());
        return true;
      });
      setProperties(filtered);
      setLoading(false);
      return;
    }

    // fallback API call
    const param = filter === "district"
      ? `district=${encodeURIComponent(filterValue)}`
      : `type=${encodeURIComponent(filterValue)}`;
    fetch(`${API_URL}/properties?${param}&limit=50`)
      .then(r => r.json())
      .then(d => setProperties(d.properties || d.data || d.hostels || []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, [filter, filterValue, allProperties]);

  // Close on backdrop click
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  const goToDetail = (id) => { if (id) { onClose(); navigate(`/properties/${id}`); } };

  return (
    <div className="ph-browse-overlay" onClick={handleBackdrop}>
      <div className="ph-browse-drawer">
        <div className="ph-browse-header">
          <div className="ph-browse-header-left">
            <div className="ph-browse-header-icon"><i className={filterIcon} /></div>
            <div>
              <h3>{filter === "district" ? `Properties in ${filterValue}` : `${filterValue} Listings`}</h3>
              <p>{loading ? "Loading…" : `${properties.length} listing${properties.length !== 1 ? "s" : ""} found`}</p>
            </div>
          </div>
          <button className="ph-browse-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="ph-browse-body">
          {loading ? (
            <div className="ph-browse-loading"><div className="ph-spinner" /><span>Searching listings…</span></div>
          ) : properties.length === 0 ? (
            <div className="ph-browse-empty">
              <div className="ph-browse-empty-icon"><i className="fa fa-search" /></div>
              <h4>No listings found for "{filterValue}"</h4>
              <p>Check back soon — landlords are adding new properties every day.</p>
            </div>
          ) : (
            <div className="ph-prop-grid">
              {properties.map((p, i) => (
                <PropertyCard key={p._id || p.id || i} property={p} onClick={goToDetail} />
              ))}
            </div>
          )}
        </div>

        {!loading && properties.length > 0 && (
          <div className="ph-browse-footer">
            <p>Showing <strong>{properties.length}</strong> {filter === "district" ? `properties in ${filterValue}` : `${filterValue} listings`}</p>
            <Link to="/properties" className="ph-browse-see-all" onClick={onClose}>
              <i className="fa fa-th" /> View All Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════ */
function Hero() {
  return (
    <section className="ph-hero" aria-label="PezaNyumba hero">
      <div className="ph-hero-wrapper">
        <div className="ph-hero-left">
          <div className="ph-hero-badge">
            <span className="ph-hero-badge-dot" aria-hidden="true" />
            Finding homes across Malawi — No sign-up required
          </div>
          <h1>Find Your <em>Perfect Home</em><br />Anywhere in Malawi</h1>
          <p className="ph-hero-sub">
            No account needed. Browse verified houses, flats, and plots for rent or sale
            across all 28 districts — just pick your district and start exploring.
          </p>
          <div className="ph-hero-btns">
            <a className="ph-btn-primary" href="#browse-districts">
              <i className="fa fa-search" aria-hidden="true" /> Browse Properties
            </a>
            <Link className="ph-btn-ghost" to="/register">
              <i className="fa fa-building" aria-hidden="true" /> List Your Property
            </Link>
          </div>
          <div className="ph-hero-trust">
            <div className="ph-hero-trust-item"><i className="fa fa-check-circle" aria-hidden="true" /> No account to browse</div>
            <div className="ph-hero-trust-item"><i className="fa fa-check-circle" aria-hidden="true" /> WhatsApp landlords directly</div>
            <div className="ph-hero-trust-item"><i className="fa fa-check-circle" aria-hidden="true" /> 2.5% service fee only</div>
          </div>
          <div className="ph-hero-stats">
            <div className="ph-hero-stat"><strong>340+</strong><span>Properties Listed</span></div>
            <div className="ph-hero-stat"><strong>28</strong><span>Districts Covered</span></div>
            <div className="ph-hero-stat"><strong>🛡️</strong><span>Dispute Protection</span></div>
          </div>
        </div>

        <div className="ph-hero-right" aria-hidden="true">
          <div className="ph-cards-mask">
            <div className="ph-cards-col ph-cards-up">
              {ANIM_COL1.map((c, i) => (
                <div key={i} className={`ph-anim-card ${c.theme}`}>
                  {c.image && <img src={c.image} alt="" className="ph-anim-img" />}
                  <div className="ph-anim-body">
                    <div className="ph-anim-icon"><i className={c.icon} /></div>
                    <div className="ph-anim-title">{c.title}</div>
                    <div className="ph-anim-sub">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="ph-cards-col ph-cards-down">
              {ANIM_COL2.map((c, i) => (
                <div key={i} className={`ph-anim-card ${c.theme}`}>
                  {c.image && <img src={c.image} alt="" className="ph-anim-img" />}
                  <div className="ph-anim-body">
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
      <div className="ph-wave" aria-hidden="true" />
      <div className="ph-wave ph-wave2" aria-hidden="true" />
      <div className="ph-wave ph-wave3" aria-hidden="true" />
    </section>
  );
}

/* ══════════════════════════════════════════════════
   TRUST BAR
══════════════════════════════════════════════════ */
function TrustBar() {
  return (
    <div className="ph-trust-bar">
      <div className="ph-trust-bar-inner">
        <div className="ph-trust-item"><i className="fa fa-shield-alt" aria-hidden="true" /> Registered Malawian platform</div>
        <div className="ph-trust-divider" />
        <div className="ph-trust-item"><i className="fa fa-user-slash" aria-hidden="true" /> No account needed to browse</div>
        <div className="ph-trust-divider" />
        <div className="ph-trust-item"><i className="fab fa-whatsapp" aria-hidden="true" /> WhatsApp landlords directly</div>
        <div className="ph-trust-divider" />
        <div className="ph-trust-item"><i className="fa fa-map-marker-alt" aria-hidden="true" /> All 28 districts covered</div>
        <div className="ph-trust-divider" />
        <div className="ph-trust-item"><i className="fa fa-lock" aria-hidden="true" /> Dispute protection built in</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   DISTRICTS SLIDER
══════════════════════════════════════════════════ */
function DistrictsSection({ allProperties }) {
  const navigate = useNavigate();
  const [filtered, setFiltered]   = useState([]);
  const [locSearch, setLocSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [current, setCurrent]     = useState(0);
  const [drawer, setDrawer]       = useState(null);

  const timerRef    = useRef(null);
  const trackRef    = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const dragStartX  = useRef(null);
  const isDragging  = useRef(false);

  const [visCount, setVisCount] = useState(4);
  useEffect(() => {
    function calc() {
      const w = window.innerWidth;
      setVisCount(w <= 520 ? 1 : w <= 768 ? 2 : w <= 1100 ? 3 : 4);
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  function applyFilter(source, loc, type) {
    const result = (source || []).filter(raw => {
      const p = normalise(raw);
      const matchLoc  = !loc  || p.district.toLowerCase().includes(loc.toLowerCase()) || p.name.toLowerCase().includes(loc.toLowerCase());
      const matchType = !type || p.type.toLowerCase().includes(type.toLowerCase());
      return matchLoc && matchType;
    });
    setFiltered(result);
    setCurrent(0);
  }

  useEffect(() => {
    if (Array.isArray(allProperties) && allProperties.length > 0)
      applyFilter(allProperties, locSearch, typeFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProperties]);

  const maxIdx = Math.max(0, filtered.length - visCount);

  const slideTo = useCallback((idx) => setCurrent(Math.max(0, Math.min(idx, maxIdx))), [maxIdx]);

  const next = useCallback(() => setCurrent(c => (c >= maxIdx ? 0 : c + 1)), [maxIdx]);

  const resetAuto = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 3500);
  }, [next]);

  useEffect(() => {
    if (filtered.length > visCount) resetAuto();
    return () => clearInterval(timerRef.current);
  }, [filtered, visCount, resetAuto]);

  function getCardW() {
    const track = trackRef.current;
    if (!track || !track.children[0]) return 252;
    const gap = parseFloat(getComputedStyle(track).gap) || 19.2;
    return track.children[0].getBoundingClientRect().width + gap;
  }

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; touchStartY.current = e.touches[0].clientY; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) { slideTo(dx < 0 ? current + 1 : current - 1); resetAuto(); }
    touchStartX.current = null;
  };

  const onMouseDown = (e) => { dragStartX.current = e.clientX; isDragging.current = false; };
  const onMouseMove = (e) => { if (dragStartX.current !== null && Math.abs(e.clientX - dragStartX.current) > 6) isDragging.current = true; };
  const onMouseUp   = (e) => {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    if (isDragging.current && Math.abs(dx) > 40) { slideTo(dx < 0 ? current + 1 : current - 1); resetAuto(); }
    dragStartX.current = null; isDragging.current = false;
  };

  const translateX = current * getCardW();
  const DOT_COUNT  = Math.min(maxIdx + 1, 8);

  const handleCardClick = (raw) => {
    if (isDragging.current) return;
    const p = normalise(raw);
    if (p._id) navigate(`/properties/${p._id}`);
    else setDrawer({ label: p.district || "Malawi", icon: "fa fa-map-marker-alt" });
  };

  return (
    <>
      <section className="ph-dist-sec" id="browse-districts">
        <p className="ph-sec-label">Browse by location</p>
        <h2 className="ph-sec-title">Find Properties by <em>District</em></h2>
        <p className="ph-sec-sub">Search by location or type — swipe or use arrows to explore all listings.</p>

        <div className="ph-dist-search">
          <input
            type="text"
            placeholder="Search district or property name…"
            value={locSearch}
            onChange={e => setLocSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && applyFilter(allProperties, locSearch, typeFilter)}
            aria-label="Search location"
          />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} aria-label="Filter by type">
            <option value="">All types</option>
            {PROPERTY_TYPES.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
          </select>
          <button className="ph-dist-search-btn" onClick={() => applyFilter(allProperties, locSearch, typeFilter)}>
            <i className="fa fa-search" aria-hidden="true" /> Search
          </button>
        </div>

        <div
          className="ph-slider-viewport"
          role="region" aria-label="Property listings"
          onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={() => { dragStartX.current = null; isDragging.current = false; }}
        >
          {filtered.length === 0 ? (
            <div className="ph-prop-empty">
              <i className="fa fa-search" style={{ fontSize: "2rem", opacity: .3, display: "block", marginBottom: ".75rem" }} aria-hidden="true" />
              {!allProperties || allProperties.length === 0 ? "Loading properties…" : "No properties found. Try a different search."}
            </div>
          ) : (
            <div ref={trackRef} className="ph-slider-track" style={{ transform: `translateX(-${translateX}px)` }}>
              {filtered.map((raw, i) => {
                const p      = normalise(raw);
                const imgSrc = p.images[0] || FALLBACK_IMGS[i % FALLBACK_IMGS.length];
                return (
                  <button
                    key={p._id || i}
                    className="ph-slide-card"
                    onClick={() => handleCardClick(raw)}
                    onDragStart={e => e.preventDefault()}
                    aria-label={`View ${p.name}`}
                  >
                    <img src={imgSrc} alt={p.name} className="ph-slide-img" draggable="false" loading="lazy"
                      onError={e => { e.target.src = FALLBACK_IMGS[i % FALLBACK_IMGS.length]; }} />
                    <div className="ph-slide-body">
                      <div className="ph-slide-district">{p.district || "Malawi"}</div>
                      <div className="ph-slide-name">{p.name}</div>
                      <div className="ph-slide-meta">
                        {p.bedrooms  > 0 && <span><i className="fa fa-bed" aria-hidden="true" /> {p.bedrooms} bed</span>}
                        {p.bathrooms > 0 && <span><i className="fa fa-bath" aria-hidden="true" /> {p.bathrooms}</span>}
                      </div>
                      {p.type && <span className="ph-slide-badge">{p.type}</span>}
                      <div className="ph-slide-price">{formatPrice(p.price, p.listingType)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {filtered.length > visCount && (
          <div className="ph-prop-nav">
            <div className="ph-prop-dots" role="tablist" aria-label="Slide navigation">
              {Array.from({ length: DOT_COUNT }).map((_, i) => (
                <button key={i} className={`ph-prop-dot${current === i ? " active" : ""}`}
                  role="tab" aria-selected={current === i} aria-label={`Go to slide ${i + 1}`}
                  onClick={() => { slideTo(i); resetAuto(); }} />
              ))}
            </div>
            <div className="ph-prop-nav-btns">
              <button className="ph-prop-nav-btn" onClick={() => { slideTo(current - 1); resetAuto(); }} aria-label="Previous">&#8592;</button>
              <button className="ph-prop-nav-btn" onClick={() => { slideTo(current + 1); resetAuto(); }} aria-label="Next">&#8594;</button>
            </div>
          </div>
        )}
      </section>

      {drawer && (
        <BrowseDrawer filter="district" filterValue={drawer.label} filterIcon={drawer.icon}
          onClose={() => setDrawer(null)} allProperties={allProperties} />
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════
   PROPERTY TYPES
══════════════════════════════════════════════════ */
function TypesSection({ allProperties }) {
  const [drawer, setDrawer] = useState(null);
  return (
    <>
      <section className="ph-types-sec">
        <p className="ph-sec-label">What are you looking for?</p>
        <h2 className="ph-sec-title">Browse by <em>Property Type</em></h2>
        <p className="ph-sec-sub">Tap any type to instantly see live listings — no sign-up needed.</p>
        <div className="ph-types-grid">
          {PROPERTY_TYPES.map(t => (
            <button key={t.label} className="ph-type-card" onClick={() => setDrawer(t)} aria-label={`Browse ${t.label} listings`}>
              <i className={t.icon} aria-hidden="true" />
              <h4>{t.label}</h4>
              <span>{t.desc}</span>
            </button>
          ))}
        </div>
      </section>
      {drawer && (
        <BrowseDrawer filter="type" filterValue={drawer.label} filterIcon={drawer.icon}
          onClose={() => setDrawer(null)} allProperties={allProperties} />
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════
   LOCATIONS PHOTO GRID
══════════════════════════════════════════════════ */
function LocationsSection({ onDistrictClick }) {
  const locs = [
    { img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop", big: true, count: "12+ Properties", name: "Lilongwe",  desc: "Capital City — All Types",  icon: "fa fa-city"       },
    { img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&auto=format&fit=crop",           count: "9 Properties",   name: "Blantyre",  desc: "Commercial Hub",           icon: "fa fa-building"   },
    { img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop",           count: "5 Properties",   name: "Zomba",     desc: "University Town",          icon: "fa fa-university" },
    { img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop",           count: "4 Properties",   name: "Mzuzu",     desc: "Northern Region Hub",      icon: "fa fa-mountain"   },
    { img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop",           count: "6 Properties",   name: "Mangochi",  desc: "Lakeshore Living",         icon: "fa fa-water"      },
  ];
  return (
    <section className="ph-locs-sec">
      <p className="ph-sec-label">Our property areas</p>
      <h2 className="ph-sec-title">Top Locations Across <em>Malawi</em></h2>
      <div className="ph-locs-grid">
        {locs.map(l => (
          <button key={l.name} className={`ph-loc-card${l.big ? " big" : ""}`}
            onClick={() => onDistrictClick(l)} aria-label={`Browse properties in ${l.name}`}>
            <img src={l.img} alt={l.name} loading="lazy" />
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

/* ══════════════════════════════════════════════════
   DUAL / FEATURES / FAQ
══════════════════════════════════════════════════ */
function DualSection() {
  return (
    <div className="ph-dual-sec">
      <div className="ph-dual-card">
        <div className="ph-dual-icon tenant"><i className="fa fa-user" aria-hidden="true" /></div>
        <h3>For Tenants &amp; Buyers</h3>
        <div className="ph-dual-note">✓ No account required</div>
        <p>Browse all verified properties, view photos, see prices, and get landlord contact info directly — completely free, no sign-up needed.</p>
        <a href="#browse-districts" className="ph-btn-outline">Start Browsing</a>
      </div>
      <div className="ph-dual-card">
        <div className="ph-dual-icon landlord"><i className="fa fa-building" aria-hidden="true" /></div>
        <h3>For Landlords &amp; Owners</h3>
        <div className="ph-dual-note">✓ Register to list properties</div>
        <p>Create a landlord account to list your house, flat, room, or plot. Tenants WhatsApp you directly from your listing.</p>
        <Link to="/register" className="ph-btn-outline">Register as Landlord</Link>
      </div>
    </div>
  );
}

function FeaturesSection() {
  const features = [
    { icon: "fa fa-search",         title: "Browse Freely",       desc: "No account needed. Filter by district, price, and type to find your home instantly." },
    { icon: "fab fa-whatsapp",      title: "WhatsApp Direct",     desc: "Tap WhatsApp on any listing to message the landlord instantly — no middlemen." },
    { icon: "fa fa-shield-alt",     title: "Verified Listings",   desc: "Every landlord is verified before listing to protect tenants from fraud." },
    { icon: "fa fa-balance-scale",  title: "Dispute Resolution",  desc: "If a problem arises, our team mediates and resolves it fairly and quickly." },
  ];
  return (
    <section className="ph-features-sec">
      <p className="ph-sec-label">Why choose us</p>
      <h2 className="ph-sec-title">Why Choose <em>PezaNyumba?</em></h2>
      <div className="ph-features-grid">
        {features.map(f => (
          <div className="ph-feature-card" key={f.title}>
            <i className={f.icon} aria-hidden="true" />
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <section className="ph-faq">
      <div className="ph-faq-qmark" aria-hidden="true">?</div>
      <div className="ph-faq-inner">
        <h2 className="ph-faq-heading">FAQ</h2>
        <div className="ph-faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className={`ph-acc${open === i ? " open" : ""}`}
              onClick={() => setOpen(open === i ? null : i)}
              role="button" tabIndex={0}
              onKeyDown={e => (e.key === "Enter" || e.key === " ") && setOpen(open === i ? null : i)}
              aria-expanded={open === i}>
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

/* ══════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="ph-footer">
      <div className="ph-footer-grid">
        <div className="ph-footer-brand">
          <strong>PezaNyumba</strong>
          <p>Malawi's trusted property platform — connecting tenants, buyers, and landlords across all 28 districts.</p>
        </div>
        <div className="ph-footer-col">
          <h5>Browse</h5>
          <Link to="/">Home</Link>
          <Link to="/properties">All Properties</Link>
          <a href="#browse-districts">By District</a>
          <a href="#property-types">By Type</a>
        </div>
        <div className="ph-footer-col">
          <h5>Landlords</h5>
          <Link to="/register">Register</Link>
          <Link to="/login">Sign In</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
        <div className="ph-footer-col">
          <h5>Company</h5>
          <Link to="/about">About PezaNyumba</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Use</Link>
        </div>
      </div>
      <div className="ph-footer-bottom">
        &copy; {new Date().getFullYear()} PezaNyumba. All rights reserved. A Malawian Real Estate Platform.
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════
   TOP NAV
══════════════════════════════════════════════════ */
function TopNav() {
  // Lightweight auth state — reads from localStorage token presence
  const isLoggedIn = !!localStorage.getItem("token");
  return (
    <nav className="pn-topnav" aria-label="Main navigation">
      <Link to="/" className="pn-topnav-logo" aria-label="PezaNyumba home">
        <div className="pn-topnav-icon">PN</div>
        <div>
          <div className="pn-topnav-brand">PezaNyumba<span>Malawi Property Platform</span></div>
        </div>
      </Link>
      <div className="pn-topnav-links">
        <Link to="/properties" className="pn-topnav-link"><i className="fa fa-search" aria-hidden="true" /> Browse</Link>
        <Link to="/about"      className="pn-topnav-link"><i className="fa fa-info-circle" aria-hidden="true" /> About</Link>
        <Link to="/contact"    className="pn-topnav-link"><i className="fa fa-phone" aria-hidden="true" /> Contact</Link>
        {isLoggedIn ? (
          <Link to="/dashboard" className="pn-topnav-btn solid"><i className="fa fa-th-large" aria-hidden="true" /> Dashboard</Link>
        ) : (
          <>
            <Link to="/login"    className="pn-topnav-btn ghost">Login</Link>
            <Link to="/register" className="pn-topnav-btn solid"><i className="fa fa-building" aria-hidden="true" /> List Property</Link>
          </>
        )}
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════ */
export default function Home() {
  const [allProperties, setAllProperties] = useState([]);
  const [locDrawer, setLocDrawer]         = useState(null);

  useEffect(() => {
    // Try /properties first, fall back to /hostels for backward compat
    fetch(`${API_URL}/properties?limit=500`)
      .then(r => r.json())
      .then(d => {
        const arr = d.properties || d.data || [];
        if (arr.length > 0) { setAllProperties(arr); return; }
        return fetch(`${API_URL}/hostels?limit=500`).then(r => r.json());
      })
      .then(d => { if (d) setAllProperties(d.hostels || d.properties || d.data || []); })
      .catch(() => {});
  }, []);

  return (
    <>
      <style>{styles}</style>
      {/* Font Awesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" crossOrigin="anonymous" />

      <TopNav />
      <main>
        <Hero />
        <TrustBar />
        <DistrictsSection allProperties={allProperties} />
        <TypesSection id="property-types" allProperties={allProperties} />
        <LocationsSection onDistrictClick={l => setLocDrawer(l)} />
        <DualSection />
        <FeaturesSection />
        <FAQSection />

        <section className="ph-cta-sec">
          <h2>Are you a Landlord or Land Owner?</h2>
          <p>Register once and start listing your properties to thousands of tenants across Malawi.</p>
          <Link to="/register" className="ph-btn-primary">
            <i className="fa fa-user-plus" aria-hidden="true" /> Register as Landlord
          </Link>
          <p className="ph-cta-note">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#4dd9b8", fontWeight: 700 }}>Sign in here</Link>
          </p>
        </section>
      </main>

      <Footer />

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