﻿import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ═══════════════════════════════════════
   LANGUAGE (lightweight subset shared with Home.jsx)
   Falls back to English; full LANGS object lives in Home.jsx.
   This keeps the page self-contained without duplicating
   the entire translation table.
═══════════════════════════════════════ */
const T = {
  back: "Back to listings",
  forSale: "For Sale",
  forRent: "For Rent",
  verifiedBadge: "ID Verified",
  bed: "Bedroom", bath: "Bathroom",
  bedPlural: "Bedrooms", bathPlural: "Bathrooms",
  avail: "Available units",
  priceOnRequest: "Price on request",
  about: "About this property",
  amenities: "Amenities & Features",
  location: "Location",
  contactOwner: "Contact the owner",
  listedBy: "Listed by",
  waBtn: "Message on WhatsApp",
  callBtn: "Call",
  noContact: "No contact information available",
  shareBtn: "Share",
  saveBtn: "Save", savedBtn: "Saved",
  shareCopied: "Link copied!",
  favAdded: "Saved to favorites",
  favRemoved: "Removed from favorites",
  loading: "Loading property…",
  notFoundTitle: "Property not found",
  notFoundDesc: "This listing may have been removed or is no longer available.",
  notFoundBtn: "Browse other properties",
  lightboxOf: "of",
  lightboxClose: "Close",
  similarTitle: "Similar properties",
  similarSub: "Other listings you might like",
  reportBtn: "Report this listing",
  mapUnavailable: "Map location not available for this property",
};

/* ═══════════════════════════════════════
   STYLES — extends Home.jsx navy/amber system
═══════════════════════════════════════ */
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
    --wa-green:    #25D366;
    --wa-green-dark:#1da851;
    --success:     #10b981;
    --error:       #ef4444;
    --radius:      12px;
    --radius-lg:   16px;
    --font:        'Plus Jakarta Sans', 'Nunito Sans', sans-serif;
  }

  html, body { font-family: var(--font); color: var(--dark); background: var(--off-white); -webkit-text-size-adjust: 100%; }
  a { text-decoration: none; color: inherit; }
  button { font-family: inherit; cursor: pointer; border: none; background: none; padding: 0; }
  img { max-width: 100%; }

  @keyframes toastIn { from{opacity:0;transform:translateY(10px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes pdspin { to { transform: rotate(360deg); } }

  /* ══════════════════════════════
     STICKY TOP BAR
  ══════════════════════════════ */
  .pd-topbar {
    position: sticky; top: 0; z-index: 500;
    background: #fff; border-bottom: 1px solid #eaeaea;
    box-shadow: 0 2px 12px rgba(0,0,0,.06);
  }
  .pd-topbar-inner {
    max-width: 1180px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 1rem; height: 58px; gap: .75rem;
  }
  .pd-back {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: .85rem; font-weight: 700; color: var(--navy);
    padding: .5rem .9rem; border-radius: 9px;
    border: 1.5px solid var(--border); transition: all .18s;
    background: #fff; flex-shrink: 0;
  }
  .pd-back:hover { border-color: var(--navy); background: var(--off-white); }
  .pd-topbar-logo { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .pd-topbar-logo-icon {
    width: 32px; height: 32px; border-radius: 8px; overflow: hidden;
    border: 2px solid var(--amber); display:flex; align-items:center; justify-content:center; background:#fff;
  }
  .pd-topbar-logo-icon img { width: 100%; height: 100%; object-fit: contain; }
  .pd-topbar-logo-text { font-size: .98rem; font-weight: 800; color: var(--navy); display: none; }
  .pd-topbar-actions { display: flex; gap: .5rem; margin-left: auto; }
  .pd-icon-btn {
    width: 38px; height: 38px; border-radius: 9px;
    border: 1.5px solid var(--border); background: #fff; color: var(--mid);
    display: flex; align-items: center; justify-content: center;
    font-size: .9rem; transition: all .18s; cursor: pointer;
  }
  .pd-icon-btn:hover { border-color: var(--amber); color: var(--amber-dark); background: var(--amber-light); }
  .pd-icon-btn.saved { background: var(--amber-light); border-color: var(--amber); color: var(--amber-dark); }
  @media(min-width: 640px) { .pd-topbar-logo-text { display: block; } }

  /* ══════════════════════════════
     LAYOUT
  ══════════════════════════════ */
  .pd-page { max-width: 1180px; margin: 0 auto; padding: 1.25rem 1rem 4rem; }
  .pd-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
  @media(min-width: 960px) {
    .pd-grid { grid-template-columns: 1.7fr 1fr; align-items: start; }
    .pd-sidebar { position: sticky; top: 80px; }
  }

  /* ══════════════════════════════
     GALLERY
  ══════════════════════════════ */
  .pd-gallery {
    border-radius: var(--radius-lg); overflow: hidden;
    background: var(--light-gray); border: 1.5px solid var(--border);
    box-shadow: 0 4px 20px rgba(15,25,35,.06);
  }
  .pd-gallery-main {
    position: relative; width: 100%; aspect-ratio: 16/10; background: #0d1620;
    overflow: hidden; cursor: pointer;
  }
  .pd-gallery-main img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .pd-gallery-noimg {
    width: 100%; height: 100%; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: .5rem;
    color: rgba(255,255,255,.35); font-size: 1rem;
  }
  .pd-gallery-noimg i { font-size: 2.5rem; }
  .pd-gallery-badges { position: absolute; top: 12px; left: 12px; display: flex; gap: 6px; z-index: 2; }
  .pd-badge { font-size: .68rem; font-weight: 700; padding: 4px 11px; border-radius: 20px; text-transform: uppercase; letter-spacing: .5px; }
  .pd-badge.rent { background: var(--navy); color: #fff; }
  .pd-badge.sale { background: var(--amber); color: var(--navy); }
  .pd-badge.type { background: rgba(255,255,255,.92); color: #374151; }
  .pd-verified-pill {
    position: absolute; top: 12px; right: 12px; z-index: 2;
    background: rgba(5,150,105,.92); color: #fff;
    font-size: .68rem; font-weight: 800; padding: 4px 12px; border-radius: 20px;
    display: flex; align-items: center; gap: 5px; backdrop-filter: blur(4px);
  }
  .pd-gallery-count {
    position: absolute; bottom: 12px; right: 12px; z-index: 2;
    background: rgba(0,0,0,.55); color: #fff; font-size: .78rem; font-weight: 700;
    padding: 5px 12px; border-radius: 20px; display: flex; align-items: center; gap: 6px;
    backdrop-filter: blur(4px);
  }
  .pd-gallery-nav {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 42px; height: 42px; border-radius: 50%;
    background: rgba(255,255,255,.18); border: none; color: #fff;
    font-size: 1rem; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .2s; backdrop-filter: blur(4px); z-index: 2;
  }
  .pd-gallery-nav:hover { background: rgba(255,255,255,.32); }
  .pd-gallery-prev { left: 10px; } .pd-gallery-next { right: 10px; }
  .pd-thumbs {
    display: flex; gap: 6px; padding: .65rem; overflow-x: auto;
    background: var(--off-white); -webkit-overflow-scrolling: touch;
  }
  .pd-thumbs::-webkit-scrollbar { height: 4px; }
  .pd-thumbs::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  .pd-thumb {
    flex-shrink: 0; width: 76px; height: 56px; border-radius: 8px; overflow: hidden;
    border: 2px solid transparent; cursor: pointer; transition: border-color .18s;
  }
  .pd-thumb.active { border-color: var(--amber); }
  .pd-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

  /* ══════════════════════════════
     DETAIL CARD
  ══════════════════════════════ */
  .pd-card {
    background: #fff; border-radius: var(--radius-lg); border: 1.5px solid var(--border);
    box-shadow: 0 4px 20px rgba(15,25,35,.05); padding: 1.5rem; margin-top: 1.25rem;
  }
  .pd-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: .68rem; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--amber-dark); background: var(--amber-light);
    padding: 4px 11px; border-radius: 6px; margin-bottom: .75rem;
  }
  .pd-title { font-size: clamp(1.3rem, 4vw, 1.9rem); font-weight: 900; color: var(--navy); letter-spacing: -.5px; line-height: 1.2; margin-bottom: .4rem; }
  .pd-loc { display: flex; align-items: center; gap: 6px; color: var(--mid); font-size: .9rem; font-weight: 500; margin-bottom: 1.1rem; }
  .pd-loc i { color: var(--amber-dark); }
  .pd-price-row { display: flex; align-items: baseline; gap: .4rem; margin-bottom: 1.25rem; }
  .pd-price { font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 900; color: var(--navy); letter-spacing: -1px; }
  .pd-price-suffix { font-size: .9rem; font-weight: 600; color: var(--mid); }

  .pd-meta-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: .65rem;
    border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
    padding: 1.1rem 0; margin-bottom: 1.25rem;
  }
  .pd-meta-item { display: flex; align-items: center; gap: .65rem; }
  .pd-meta-ico {
    width: 38px; height: 38px; border-radius: 9px; background: var(--off-white);
    display: flex; align-items: center; justify-content: center; font-size: 1rem; color: var(--amber-dark);
    flex-shrink: 0; border: 1px solid var(--border);
  }
  .pd-meta-text small { display: block; font-size: .65rem; font-weight: 800; color: var(--mid); text-transform: uppercase; letter-spacing: .6px; }
  .pd-meta-text strong { display: block; font-size: .9rem; font-weight: 800; color: var(--navy); text-transform: capitalize; margin-top: 1px; }

  .pd-section-title { font-size: 1rem; font-weight: 900; color: var(--navy); margin-bottom: .75rem; display: flex; align-items: center; gap: 8px; }
  .pd-section-title i { color: var(--amber); }
  .pd-desc { color: var(--mid); line-height: 1.8; font-size: .92rem; margin-bottom: 1.5rem; white-space: pre-line; }

  .pd-amenities { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: .6rem; margin-bottom: 0; }
  .pd-amenity {
    display: flex; align-items: center; gap: .5rem; padding: .65rem .85rem;
    background: var(--off-white); border: 1.5px solid var(--border); border-radius: 9px;
    font-size: .82rem; font-weight: 600; color: var(--dark);
  }
  .pd-amenity i { color: var(--success); flex-shrink: 0; }

  /* ══════════════════════════════
     MAP
  ══════════════════════════════ */
  .pd-map-wrap { border-radius: 12px; overflow: hidden; border: 1.5px solid var(--border); height: 280px; background: var(--off-white); }
  .pd-map-wrap iframe { width: 100%; height: 100%; border: none; display: block; }
  .pd-map-fallback {
    width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: .5rem; color: var(--mid); font-size: .85rem; text-align: center; padding: 1rem;
  }
  .pd-map-fallback i { font-size: 2rem; color: var(--border); }

  /* ══════════════════════════════
     SIDEBAR — owner / contact
  ══════════════════════════════ */
  .pd-owner-card {
    background: #fff; border: 1.5px solid var(--border); border-radius: var(--radius-lg);
    padding: 1.4rem; box-shadow: 0 4px 20px rgba(15,25,35,.05);
  }
  .pd-owner-top { display: flex; align-items: center; gap: .85rem; margin-bottom: 1.1rem; padding-bottom: 1.1rem; border-bottom: 1px solid var(--border); }
  .pd-owner-avatar {
    width: 52px; height: 52px; border-radius: 50%; background: var(--navy); color: var(--amber);
    display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 800; flex-shrink: 0;
  }
  .pd-owner-name { font-size: .98rem; font-weight: 800; color: var(--navy); }
  .pd-owner-role { font-size: .76rem; color: var(--mid); font-weight: 600; margin-top: 1px; }
  .pd-owner-verified { display: inline-flex; align-items: center; gap: 4px; font-size: .68rem; font-weight: 800; color: #065f46; background: #dcfce7; padding: 2px 9px; border-radius: 20px; margin-top: 5px; }
  .pd-contact-label { font-size: .7rem; font-weight: 800; color: var(--mid); text-transform: uppercase; letter-spacing: .8px; margin-bottom: .65rem; }
  .pd-owner-btns { display: flex; flex-direction: column; gap: .6rem; }
  .pd-btn-wa {
    width: 100%; background: var(--wa-green); color: #fff; padding: .8rem 1rem; border-radius: 10px;
    font-size: .92rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background .18s; box-shadow: 0 4px 14px rgba(37,211,102,.3);
  }
  .pd-btn-wa:hover { background: var(--wa-green-dark); }
  .pd-btn-call {
    width: 100%; background: var(--navy); color: #fff; padding: .8rem 1rem; border-radius: 10px;
    font-size: .92rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background .18s;
  }
  .pd-btn-call:hover { background: var(--navy-mid); }
  .pd-no-contact { text-align: center; font-size: .82rem; color: var(--mid); padding: .85rem; background: var(--off-white); border-radius: 9px; font-weight: 600; }
  .pd-trust-note { display: flex; align-items: flex-start; gap: 8px; margin-top: 1.1rem; padding-top: 1.1rem; border-top: 1px solid var(--border); font-size: .76rem; color: var(--mid); line-height: 1.6; }
  .pd-trust-note i { color: var(--amber-dark); margin-top: 2px; flex-shrink: 0; }

  .pd-report-btn {
    width: 100%; margin-top: 1rem; padding: .7rem; border: 1.5px solid var(--border); border-radius: 9px;
    background: #fff; color: var(--mid); font-size: .8rem; font-weight: 700; display: flex; align-items: center;
    justify-content: center; gap: 6px; transition: all .18s;
  }
  .pd-report-btn:hover { border-color: var(--error); color: var(--error); background: #fef2f2; }

  /* ══════════════════════════════
     SIMILAR PROPERTIES
  ══════════════════════════════ */
  .pd-similar { margin-top: 2.5rem; }
  .pd-similar-head { margin-bottom: 1rem; }
  .pd-similar-head h2 { font-size: 1.15rem; font-weight: 900; color: var(--navy); }
  .pd-similar-head p { font-size: .85rem; color: var(--mid); margin-top: 2px; }
  .pd-similar-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
  .pd-sim-card {
    border: 1.5px solid var(--border); border-radius: var(--radius-lg); overflow: hidden;
    background: #fff; transition: all .25s; box-shadow: 0 2px 10px rgba(0,0,0,.05); display: flex; flex-direction: column;
  }
  .pd-sim-card:hover { transform: translateY(-4px); box-shadow: 0 14px 32px rgba(15,25,35,.12); border-color: var(--amber); }
  .pd-sim-img-wrap { position: relative; height: 140px; overflow: hidden; background: var(--light-gray); }
  .pd-sim-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .pd-sim-body { padding: .85rem; }
  .pd-sim-name { font-size: .85rem; font-weight: 800; color: var(--navy); margin-bottom: .25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pd-sim-loc { font-size: .72rem; color: var(--mid); margin-bottom: .35rem; }
  .pd-sim-price { font-size: .88rem; font-weight: 800; color: var(--navy); }

  /* ══════════════════════════════
     LIGHTBOX
  ══════════════════════════════ */
  .pd-lightbox-overlay { position:fixed; inset:0; background:rgba(0,0,0,.92); z-index:10000; display:flex; align-items:center; justify-content:center; animation:fadeIn .2s ease; padding:.75rem; }
  .pd-lightbox-box { background:#111; border-radius:16px; overflow:hidden; max-width:900px; width:100%; max-height:calc(100vh - 1.5rem); display:flex; flex-direction:column; box-shadow:0 32px 80px rgba(0,0,0,.6); }
  .pd-lightbox-header { display:flex; align-items:center; gap:.75rem; padding:.9rem 1.2rem; background:#1a1a1a; border-bottom:1px solid #2a2a2a; flex-shrink:0; }
  .pd-lightbox-title { flex:1; font-size:.88rem; font-weight:700; color:white; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .pd-lightbox-counter { font-size:.78rem; font-weight:600; color:rgba(255,255,255,.45); background:rgba(255,255,255,.08); padding:3px 10px; border-radius:20px; white-space:nowrap; }
  .pd-lightbox-close { width:34px; height:34px; min-width:34px; border-radius:8px; background:rgba(255,255,255,.1); border:none; color:rgba(255,255,255,.7); font-size:.9rem; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .2s; }
  .pd-lightbox-close:hover { background:#dc2626; color:white; }
  .pd-lightbox-main { position:relative; flex:1; display:flex; align-items:center; justify-content:center; background:#000; min-height:0; overflow:hidden; }
  .pd-lightbox-img { max-width:100%; max-height:65vh; object-fit:contain; display:block; }
  .pd-lightbox-nav { position:absolute; top:50%; transform:translateY(-50%); width:44px; height:44px; border-radius:50%; background:rgba(255,255,255,.15); border:none; color:white; font-size:1rem; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .2s; z-index:2; backdrop-filter:blur(4px); }
  .pd-lightbox-nav:hover { background:rgba(255,255,255,.3); }
  .pd-lightbox-prev { left:8px; } .pd-lightbox-next { right:8px; }
  .pd-lightbox-thumbs { display:flex; gap:6px; padding:.75rem 1rem; background:#1a1a1a; overflow-x:auto; flex-shrink:0; }
  .pd-lightbox-thumb { flex-shrink:0; width:56px; height:42px; border-radius:6px; overflow:hidden; border:2px solid transparent; cursor:pointer; transition:border-color .2s; }
  .pd-lightbox-thumb.active { border-color: var(--amber); }
  .pd-lightbox-thumb img { width:100%; height:100%; object-fit:cover; display:block; }

  /* ══════════════════════════════
     LOADING / NOT FOUND
  ══════════════════════════════ */
  .pd-loading-wrap { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: var(--mid); }
  .pd-spinner { width: 40px; height: 40px; border: 3px solid var(--amber-light); border-top-color: var(--amber); border-radius: 50%; animation: pdspin .7s linear infinite; }
  .pd-notfound { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; gap: .75rem; }
  .pd-notfound-ico { font-size: 3.5rem; color: var(--border); margin-bottom: .25rem; }
  .pd-notfound h2 { font-size: 1.3rem; font-weight: 900; color: var(--navy); }
  .pd-notfound p { color: var(--mid); font-size: .9rem; max-width: 320px; }
  .pd-notfound-btn {
    margin-top: .5rem; background: var(--navy); color: #fff; padding: .75rem 1.6rem; border-radius: 10px;
    font-weight: 800; font-size: .88rem; display: inline-flex; align-items: center; gap: 8px; transition: background .2s;
  }
  .pd-notfound-btn:hover { background: var(--navy-mid); }

  /* ══════════════════════════════
     TOAST
  ══════════════════════════════ */
  .pd-toast-wrap {
    position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
    z-index: 99999; display: flex; flex-direction: column; gap: .5rem;
    align-items: center; pointer-events: none;
  }
  .pd-toast {
    background: var(--navy); color: white; padding: .65rem 1.4rem; border-radius: 999px;
    font-size: .83rem; font-weight: 700; box-shadow: 0 8px 24px rgba(0,0,0,.25);
    animation: toastIn .25s cubic-bezier(.34,1.56,.64,1); display: flex; align-items: center; gap: .5rem; white-space: nowrap;
  }
`;

/* ═══════════════════════════════════════
   HELPERS — mirrors Home.jsx conventions
═══════════════════════════════════════ */
function waLink(num) {
  if (!num) return null;
  const clean = num.toString().replace(/\D/g, "");
  const intl = clean.startsWith("0") ? "265" + clean.slice(1) : clean;
  return `https://wa.me/${intl}`;
}

function normalise(p) {
  return {
    _id:            p._id || p.id,
    name:           p.name || p.title || "Unnamed Property",
    description:    p.description || "",
    type:           p.type || p.propertyType || p.property_type || "",
    listingType:    p.listingType || p.listing_type || "For Rent",
    price:          p.price || 0,
    district:       p.district || p.location?.formattedAddress?.split(",").pop()?.trim() || "",
    address:        p.address || p.location?.formattedAddress || "",
    bedrooms:       p.bedrooms || p.beds || 0,
    bathrooms:      p.bathrooms || p.baths || 0,
    totalRooms:     p.totalRooms || p.total_rooms || 0,
    availableRooms: p.availableRooms || p.available_rooms || 0,
    gender:         p.gender || "",
    amenities:      p.amenities || [],
    images:         p.images || p.photos || [],
    contactPhone:   p.contactPhone || p.owner?.phone || p.phone || "",
    whatsapp:       p.whatsapp || p.contactPhone || p.owner?.phone || p.phone || "",
    owner:          p.owner || null,
    verified:       p.verified || p.isVerified || false,
    location:       p.location || null,
  };
}

function formatPrice(price, listingType) {
  if (!price) return T.priceOnRequest;
  const suffix = (listingType || "").toLowerCase().includes("sale") ? "" : "/mo";
  return "MWK " + Number(price).toLocaleString() + suffix;
}

function buildShareMessage(p) {
  const price = formatPrice(p.price, p.listingType);
  const url   = `${window.location.origin}/properties/${p._id}`;
  return encodeURIComponent(
    `Found this on PezaNyumba 🏡 ${p.name} in ${p.district || "Malawi"} — ${price}. View: ${url}`
  );
}

function trackPropertyView(propertyId) {
  if (!propertyId) return;
  fetch(`${API_URL}/admin/properties/${propertyId}/view`, { method: "POST" }).catch(() => {});
}

const FALLBACK_IMG = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop";

const AMENITY_ICONS = {
  "Water 24/7": "fa-tint", "WiFi": "fa-wifi", "Electricity (ESCOM)": "fa-bolt",
  "Solar Power": "fa-solar-panel", "CCTV Security": "fa-video", "Security Guard": "fa-shield-alt",
  "Parking": "fa-car", "Garden": "fa-tree", "Borehole Water": "fa-water",
  "Flush Toilet": "fa-toilet", "Bathroom": "fa-bath", "Kitchen": "fa-utensils",
  "Living Room": "fa-couch", "Dining Room": "fa-chair", "Store Room": "fa-box",
  "Servant Quarters": "fa-home", "Fence/Wall": "fa-border-all", "Gate": "fa-door-closed",
  "Tiled Floors": "fa-grip-lines", "Ceiling": "fa-grip-horizontal",
};

/* ═══════════════════════════════════════
   FAVORITES (localStorage, shared key with Home.jsx)
═══════════════════════════════════════ */
function useFavorites() {
  const [favIds, setFavIds] = useState(() => {
    try {
      const raw = localStorage.getItem("peza_favorites");
      return new Set(raw ? JSON.parse(raw) : []);
    } catch { return new Set(); }
  });
  const toggle = (id) => {
    setFavIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      try { localStorage.setItem("peza_favorites", JSON.stringify([...next])); } catch {}
      return next;
    });
  };
  return { favIds, toggle };
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = (msg) => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 2800);
  };
  return { toasts, show };
}

function ToastContainer({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div className="pd-toast-wrap">
      {toasts.map(t => <div key={t.id} className="pd-toast">✓ {t.msg}</div>)}
    </div>
  );
}

/* ═══════════════════════════════════════
   LIGHTBOX
═══════════════════════════════════════ */
function Lightbox({ images, startIndex = 0, name, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const touchStartX = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx(i => (i + 1) % images.length);
      if (e.key === "ArrowLeft")  setIdx(i => (i - 1 + images.length) % images.length);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [images.length, onClose]);

  function onTouchStart(e) { touchStartX.current = e.touches[0].clientX; }
  function onTouchEnd(e) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) setIdx(i => dx < 0 ? (i + 1) % images.length : (i - 1 + images.length) % images.length);
    touchStartX.current = null;
  }

  return (
    <div className="pd-lightbox-overlay" onClick={e => e.target === e.currentTarget && onClose()} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="pd-lightbox-box">
        <div className="pd-lightbox-header">
          <div className="pd-lightbox-title"><i className="fa fa-images" style={{color:"var(--amber)",marginRight:"8px"}} />{name}</div>
          <div className="pd-lightbox-counter">{idx + 1} {T.lightboxOf} {images.length}</div>
          <button className="pd-lightbox-close" onClick={onClose}><i className="fa fa-times" /></button>
        </div>
        <div className="pd-lightbox-main">
          {images.length > 1 && <button className="pd-lightbox-nav pd-lightbox-prev" onClick={() => setIdx(i => (i - 1 + images.length) % images.length)}><i className="fa fa-chevron-left" /></button>}
          <img src={images[idx]} alt={`${name} — photo ${idx + 1}`} className="pd-lightbox-img" />
          {images.length > 1 && <button className="pd-lightbox-nav pd-lightbox-next" onClick={() => setIdx(i => (i + 1) % images.length)}><i className="fa fa-chevron-right" /></button>}
        </div>
        {images.length > 1 && (
          <div className="pd-lightbox-thumbs">
            {images.map((src, i) => (
              <button key={i} className={`pd-lightbox-thumb${idx === i ? " active" : ""}`} onClick={() => setIdx(i)}>
                <img src={src} alt={`thumb ${i + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   GALLERY
═══════════════════════════════════════ */
function Gallery({ p, onOpenLightbox }) {
  const [idx, setIdx] = useState(0);
  const images = p.images.length > 0 ? p.images : [];
  const isForSale = p.listingType.toLowerCase().includes("sale");

  return (
    <div className="pd-gallery">
      <div className="pd-gallery-main" onClick={() => images.length > 0 && onOpenLightbox(idx)}>
        {images.length > 0
          ? <img src={images[idx]} alt={`${p.name} — photo ${idx + 1}`} />
          : <div className="pd-gallery-noimg"><i className="fa fa-home" /><span>No photos uploaded yet</span></div>
        }
        <div className="pd-gallery-badges">
          <span className={`pd-badge ${isForSale ? "sale" : "rent"}`}>{isForSale ? T.forSale : T.forRent}</span>
          {p.type && <span className="pd-badge type">{p.type}</span>}
        </div>
        {p.verified && (
          <div className="pd-verified-pill"><i className="fa fa-check-circle" /> {T.verifiedBadge}</div>
        )}
        {images.length > 1 && (
          <>
            <button className="pd-gallery-nav pd-gallery-prev" onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }}><i className="fa fa-chevron-left" /></button>
            <button className="pd-gallery-nav pd-gallery-next" onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }}><i className="fa fa-chevron-right" /></button>
            <div className="pd-gallery-count"><i className="fa fa-images" /> {idx + 1}/{images.length}</div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="pd-thumbs">
          {images.map((src, i) => (
            <button key={i} className={`pd-thumb${idx === i ? " active" : ""}`} onClick={() => setIdx(i)}>
              <img src={src} alt={`thumb ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   SIMILAR PROPERTIES
═══════════════════════════════════════ */
function SimilarProperties({ current, navigate }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const param = current.district
      ? `district=${encodeURIComponent(current.district)}`
      : `type=${encodeURIComponent(current.type)}`;
    fetch(`${API_URL}/properties?${param}&limit=8`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const list = (data.properties || data.hostels || data.data || [])
          .map(normalise)
          .filter(p => p._id !== current._id)
          .slice(0, 4);
        setItems(list);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [current._id, current.district, current.type]);

  if (!loading && items.length === 0) return null;

  return (
    <div className="pd-similar">
      <div className="pd-similar-head">
        <h2>{T.similarTitle}</h2>
        <p>{T.similarSub}{current.district ? ` in ${current.district}` : ""}</p>
      </div>
      {loading ? (
        <div className="pd-similar-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="pd-sim-card" style={{ opacity: .5 }}>
              <div className="pd-sim-img-wrap" />
              <div className="pd-sim-body">
                <div style={{ height: 12, background: "var(--light-gray)", borderRadius: 4, marginBottom: 8 }} />
                <div style={{ height: 10, width: "60%", background: "var(--light-gray)", borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="pd-similar-grid">
          {items.map(p => (
            <button key={p._id} className="pd-sim-card" onClick={() => navigate(`/properties/${p._id}`)}>
              <div className="pd-sim-img-wrap">
                <img src={p.images[0] || FALLBACK_IMG} alt={p.name} loading="lazy" />
              </div>
              <div className="pd-sim-body">
                <div className="pd-sim-name">{p.name}</div>
                <div className="pd-sim-loc">{[p.address, p.district].filter(Boolean).join(", ") || "Malawi"}</div>
                <div className="pd-sim-price">{formatPrice(p.price, p.listingType)}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favIds, toggle } = useFavorites();
  const { toasts, show } = useToast();

  const [property, setProperty] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    fetch(`${API_URL}/properties/${id}`)
      .then(r => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then(data => {
        if (cancelled) return;
        const raw = data.property || data.data || data;
        if (!raw || (!raw._id && !raw.id)) throw new Error("not found");
        setProperty(normalise(raw));
        trackPropertyView(raw._id || raw.id);
      })
      .catch(() => { if (!cancelled) setNotFound(true); })
      .finally(() => !cancelled && setLoading(false));
    window.scrollTo(0, 0);
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
        <div className="pd-topbar">
          <div className="pd-topbar-inner">
            <button className="pd-back" onClick={() => navigate(-1)}><i className="fa fa-arrow-left" /> {T.back}</button>
          </div>
        </div>
        <div className="pd-loading-wrap">
          <div className="pd-spinner" />
          <p>{T.loading}</p>
        </div>
      </>
    );
  }

  if (notFound || !property) {
    return (
      <>
        <style>{styles}</style>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
        <div className="pd-topbar">
          <div className="pd-topbar-inner">
            <button className="pd-back" onClick={() => navigate(-1)}><i className="fa fa-arrow-left" /> {T.back}</button>
            <Link to="/" className="pd-topbar-logo">
              <div className="pd-topbar-logo-icon"><img src="/PEZ.png" alt="PezaNyumba" /></div>
              <span className="pd-topbar-logo-text">PezaNyumba</span>
            </Link>
          </div>
        </div>
        <div className="pd-notfound">
          <div className="pd-notfound-ico"><i className="fa fa-home" /></div>
          <h2>{T.notFoundTitle}</h2>
          <p>{T.notFoundDesc}</p>
          <Link to="/properties" className="pd-notfound-btn"><i className="fa fa-search" /> {T.notFoundBtn}</Link>
        </div>
      </>
    );
  }

  const p          = property;
  const isSaved    = favIds.has(p._id);
  const wa         = waLink(p.whatsapp);
  const call       = p.contactPhone ? `tel:${p.contactPhone}` : null;
  const ownerName  = p.owner ? `${p.owner.firstName || ""} ${p.owner.lastName || ""}`.trim() : "";
  const ownerInitials = ownerName ? ownerName.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() : "PN";
  const mapQuery   = p.address || p.district ? `${p.address || ""}${p.address && p.district ? ", " : ""}${p.district || ""}, Malawi` : null;
  const mapEmbedUrl = mapQuery ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed` : null;

  function handleShare() {
    const msg = buildShareMessage(p);
    const url = `${window.location.origin}/properties/${p._id}`;
    if (navigator.share) {
      navigator.share({
        title: p.name,
        text: `Found this on PezaNyumba 🏡 ${p.name} in ${p.district || "Malawi"}`,
        url,
      }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${msg}`, "_blank", "noopener,noreferrer");
    }
    show(T.shareCopied);
  }

  function handleSave() {
    toggle(p._id);
    show(isSaved ? T.favRemoved : T.favAdded);
  }

  const meta = [
    p.bedrooms       > 0 && { icon: "fa-bed",       small: p.bedrooms === 1 ? T.bed : T.bedPlural,   value: p.bedrooms },
    p.bathrooms      > 0 && { icon: "fa-bath",      small: p.bathrooms === 1 ? T.bath : T.bathPlural, value: p.bathrooms },
    p.availableRooms > 0 && { icon: "fa-door-open", small: T.avail, value: p.availableRooms },
    p.gender              && { icon: "fa-user",     small: "Preference", value: p.gender },
    p.type                && { icon: "fa-home",     small: "Property type", value: p.type },
    p.listingType         && { icon: "fa-tag",      small: "Listing", value: p.listingType },
  ].filter(Boolean);

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      <ToastContainer toasts={toasts} />

      {lightbox !== null && p.images.length > 0 && (
        <Lightbox images={p.images} startIndex={lightbox} name={p.name} onClose={() => setLightbox(null)} />
      )}

      {/* TOP BAR */}
      <div className="pd-topbar">
        <div className="pd-topbar-inner">
          <button className="pd-back" onClick={() => navigate(-1)}><i className="fa fa-arrow-left" /> {T.back}</button>
          <Link to="/" className="pd-topbar-logo">
            <div className="pd-topbar-logo-icon"><img src="/PEZ.png" alt="PezaNyumba" /></div>
            <span className="pd-topbar-logo-text">PezaNyumba</span>
          </Link>
          <div className="pd-topbar-actions">
            <button className={`pd-icon-btn${isSaved ? " saved" : ""}`} onClick={handleSave} title={isSaved ? T.savedBtn : T.saveBtn} aria-label={isSaved ? T.savedBtn : T.saveBtn}>
              <i className={isSaved ? "fa fa-heart" : "far fa-heart"} />
            </button>
            <button className="pd-icon-btn" onClick={handleShare} title={T.shareBtn} aria-label={T.shareBtn}>
              <i className="fab fa-whatsapp" />
            </button>
          </div>
        </div>
      </div>

      <div className="pd-page">
        <div className="pd-grid">

          {/* MAIN COLUMN */}
          <div>
            <Gallery p={p} onOpenLightbox={setLightbox} />

            <div className="pd-card">
              <div className="pd-eyebrow"><i className="fa fa-map-marker-alt" /> {p.district || "Malawi"}</div>
              <h1 className="pd-title">{p.name}</h1>
              <div className="pd-loc"><i className="fa fa-map-marker-alt" /> {[p.address, p.district].filter(Boolean).join(", ") || "Malawi"}</div>
              <div className="pd-price-row">
                <span className="pd-price">{formatPrice(p.price, p.listingType)}</span>
              </div>

              {meta.length > 0 && (
                <div className="pd-meta-grid">
                  {meta.map((m, i) => (
                    <div key={i} className="pd-meta-item">
                      <div className="pd-meta-ico"><i className={`fa ${m.icon}`} /></div>
                      <div className="pd-meta-text">
                        <small>{m.small}</small>
                        <strong>{m.value}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {p.description && (
                <>
                  <div className="pd-section-title"><i className="fa fa-align-left" /> {T.about}</div>
                  <p className="pd-desc">{p.description}</p>
                </>
              )}

              {p.amenities.length > 0 && (
                <>
                  <div className="pd-section-title"><i className="fa fa-check-circle" /> {T.amenities}</div>
                  <div className="pd-amenities">
                    {p.amenities.map(a => (
                      <div key={a} className="pd-amenity">
                        <i className={`fa ${AMENITY_ICONS[a] || "fa-check"}`} /> {a}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="pd-card">
              <div className="pd-section-title"><i className="fa fa-map-marked-alt" /> {T.location}</div>
              <div className="pd-map-wrap">
                {mapEmbedUrl
                  ? <iframe title={`Map showing ${p.name}`} src={mapEmbedUrl} loading="lazy" allowFullScreen />
                  : <div className="pd-map-fallback"><i className="fa fa-map-marked-alt" /><span>{T.mapUnavailable}</span></div>
                }
              </div>
            </div>

            <SimilarProperties current={p} navigate={navigate} />
          </div>

          {/* SIDEBAR */}
          <div className="pd-sidebar">
            <div className="pd-owner-card">
              <div className="pd-owner-top">
                <div className="pd-owner-avatar">{ownerInitials}</div>
                <div>
                  <div className="pd-owner-role">{T.listedBy}</div>
                  <div className="pd-owner-name">{ownerName || "PezaNyumba Landlord"}</div>
                  {p.verified && (
                    <div className="pd-owner-verified"><i className="fa fa-check-circle" /> {T.verifiedBadge}</div>
                  )}
                </div>
              </div>

              <div className="pd-contact-label">{T.contactOwner}</div>
              <div className="pd-owner-btns">
                {wa && (
                  <a className="pd-btn-wa" href={wa} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-whatsapp" /> {T.waBtn}
                  </a>
                )}
                {call && (
                  <a className="pd-btn-call" href={call}>
                    <i className="fa fa-phone" /> {T.callBtn}: {p.contactPhone}
                  </a>
                )}
                {!wa && !call && <div className="pd-no-contact">{T.noContact}</div>}
              </div>

              <div className="pd-trust-note">
                <i className="fa fa-shield-alt" />
                <span>For your safety, always view the property in person before making any payment. PezaNyumba never collects rent or deposits on behalf of landlords.</span>
              </div>
            </div>

            <button className="pd-report-btn" onClick={() => show("Thanks — our team will review this listing.")}>
              <i className="fa fa-flag" /> {T.reportBtn}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}