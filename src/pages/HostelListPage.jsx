// frontend/src/pages/PropertiesListing.jsx
// PezaNyumba — Upgraded Property Listings Page
// Production-grade | Wishlist | Grid/List toggle | Verified badges | Full filter panel

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DISTRICTS = [
  'Balaka','Blantyre','Chikwawa','Chiradzulu','Chitipa','Dedza','Dowa',
  'Karonga','Kasungu','Likoma','Lilongwe','Machinga','Mangochi','Mchinji',
  'Mulanje','Mwanza','Mzimba','Mzuzu','Neno','Nkhata Bay','Nkhotakota',
  'Nsanje','Ntcheu','Ntchisi','Phalombe','Rumphi','Salima','Thyolo','Zomba',
];

const PROPERTY_TYPES = [
  'House','Flat/Apartment','Single Room','Self-Contained',
  'Plot of Land','Commercial Space','Townhouse','Hostel',
];

const LISTING_PURPOSES = ['For Rent','For Sale'];

const BEDROOMS_OPTIONS = ['1','2','3','4','5+'];

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --teal-900: #062922;
    --teal-800: #0d4a40;
    --teal-700: #1a5c52;
    --teal-600: #1e7a6a;
    --teal-500: #2d8a72;
    --teal-400: #3da68a;
    --teal-200: #a8dcd0;
    --teal-100: #d4eeea;
    --teal-50:  #eef9f6;

    --sale-bg:  #0891b2;
    --sale-bg2: #0e7490;

    --cream: #f8faf9;
    --white: #ffffff;
    --dark:  #111827;
    --mid:   #4b5563;
    --light: #9ca3af;
    --border: #dde8e5;
    --border-hover: #a8dcd0;

    --wa: #25D366;
    --wa-dark: #128c4e;

    --radius-sm: 6px;
    --radius:    12px;
    --radius-lg: 18px;

    --shadow-sm: 0 1px 4px rgba(13,74,64,.07);
    --shadow:    0 4px 16px rgba(13,74,64,.10);
    --shadow-lg: 0 12px 36px rgba(13,74,64,.14);

    --navbar-h: 62px;
    --sidebar-w: 270px;
    --font: 'Manrope', sans-serif;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    font-family: var(--font);
    background: var(--cream);
    color: var(--dark);
  }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--teal-200); border-radius: 99px; }

  /* ══════════════════════════════════════════════════
     NAVBAR
  ══════════════════════════════════════════════════ */
  .pz-navbar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 600;
    height: var(--navbar-h);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    background: rgba(6,41,34,.97);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,.06);
  }

  .pz-nav-left { display: flex; align-items: center; gap: 1rem; }

  .pz-logo {
    display: flex;
    align-items: center;
    gap: 9px;
    text-decoration: none;
    flex-shrink: 0;
  }

  .pz-logo-mark {
    width: 38px; height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--teal-500), var(--teal-700));
    display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 900; font-size: 17px; letter-spacing: -1px;
    flex-shrink: 0;
  }

  .pz-logo-text strong {
    display: block; color: #fff;
    font-size: 0.9rem; font-weight: 900; letter-spacing: 1.5px;
  }

  .pz-logo-text span {
    color: rgba(255,255,255,.38);
    font-size: 0.55rem; letter-spacing: 0.5px;
  }

  .pz-nav-divider {
    width: 1px; height: 22px;
    background: rgba(255,255,255,.1);
  }

  .pz-nav-links { display: flex; align-items: center; gap: 0.25rem; }

  .pz-nav-link {
    color: rgba(255,255,255,.6);
    font-size: 0.82rem; font-weight: 600;
    padding: 0.35rem 0.8rem;
    border-radius: var(--radius-sm);
    text-decoration: none;
    transition: color .15s, background .15s;
  }
  .pz-nav-link:hover { color: #fff; background: rgba(255,255,255,.07); }
  .pz-nav-link.active { color: var(--teal-200); }

  .pz-nav-right { display: flex; align-items: center; gap: 0.5rem; }

  .pz-btn-nav {
    font-size: 0.8rem; font-weight: 700;
    padding: 0.38rem 0.9rem;
    border-radius: var(--radius-sm);
    text-decoration: none; cursor: pointer;
    transition: all .15s; border: 1.5px solid transparent;
    display: flex; align-items: center; gap: 5px;
    font-family: var(--font);
  }
  .pz-btn-nav.ghost {
    color: rgba(255,255,255,.7);
    border-color: rgba(255,255,255,.18);
    background: transparent;
  }
  .pz-btn-nav.ghost:hover { color: #fff; border-color: rgba(255,255,255,.4); }
  .pz-btn-nav.solid {
    color: #fff; background: var(--teal-600); border-color: var(--teal-600);
  }
  .pz-btn-nav.solid:hover { background: var(--teal-700); border-color: var(--teal-700); }

  /* ══════════════════════════════════════════════════
     PAGE LAYOUT
  ══════════════════════════════════════════════════ */
  .pz-page {
    display: flex;
    margin-top: var(--navbar-h);
    min-height: calc(100vh - var(--navbar-h));
  }

  /* ── SIDEBAR ── */
  .pz-sidebar {
    width: var(--sidebar-w);
    flex-shrink: 0;
    background: var(--white);
    border-right: 1px solid var(--border);
    padding: 1.5rem 1.25rem;
    height: calc(100vh - var(--navbar-h));
    overflow-y: auto;
    position: sticky;
    top: var(--navbar-h);
  }

  .pz-sidebar-title {
    font-size: 0.7rem; font-weight: 800;
    text-transform: uppercase; letter-spacing: 1.2px;
    color: var(--teal-800); margin-bottom: 1.25rem;
    display: flex; align-items: center; gap: 7px;
  }
  .pz-sidebar-title i { color: var(--teal-500); }

  .pz-filter-section { margin-bottom: 1.5rem; }

  .pz-filter-label {
    display: block;
    font-size: 0.72rem; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.6px;
    color: var(--mid); margin-bottom: 0.5rem;
  }

  .pz-filter-input,
  .pz-filter-select {
    width: 100%;
    padding: 0.6rem 0.85rem;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 0.85rem; font-family: var(--font);
    color: var(--dark); background: var(--white);
    outline: none; transition: border-color .18s, box-shadow .18s;
    appearance: none;
  }
  .pz-filter-input:focus,
  .pz-filter-select:focus {
    border-color: var(--teal-500);
    box-shadow: 0 0 0 3px rgba(45,138,114,.12);
  }

  .pz-filter-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }

  /* Chip buttons */
  .pz-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .pz-chip {
    font-size: 0.74rem; font-weight: 700;
    padding: 0.3rem 0.7rem; border-radius: 20px;
    border: 1.5px solid var(--border);
    background: var(--white); color: var(--mid);
    cursor: pointer; transition: all .15s;
    font-family: var(--font);
  }
  .pz-chip:hover { border-color: var(--teal-400); color: var(--teal-700); }
  .pz-chip.selected {
    background: var(--teal-700); color: white; border-color: var(--teal-700);
  }

  /* Range slider */
  .pz-range-wrap { display: flex; align-items: center; gap: 0.4rem; margin-top: 0.4rem; }
  .pz-range-val {
    font-size: 0.78rem; font-weight: 700; color: var(--teal-700);
    white-space: nowrap; min-width: 60px; text-align: right;
  }

  .pz-sidebar-actions { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.25rem; }
  .pz-sidebar-btn {
    width: 100%; padding: 0.65rem;
    border-radius: var(--radius-sm); font-size: 0.85rem;
    font-weight: 700; font-family: var(--font);
    cursor: pointer; transition: all .18s; border: none;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .pz-sidebar-btn.primary { background: var(--teal-700); color: white; }
  .pz-sidebar-btn.primary:hover { background: var(--teal-800); }
  .pz-sidebar-btn.secondary {
    background: var(--teal-50); color: var(--teal-800);
    border: 1.5px solid var(--border);
  }
  .pz-sidebar-btn.secondary:hover { background: var(--teal-100); }

  /* ── MAIN CONTENT ── */
  .pz-content {
    flex: 1; min-width: 0;
    padding: 1.5rem 1.5rem 3rem;
    overflow-y: auto;
  }

  /* ── TOP BAR ── */
  .pz-topbar {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.25rem;
  }

  .pz-topbar-left h1 {
    font-size: 1.65rem; font-weight: 900; color: var(--dark);
    line-height: 1.2; margin-bottom: 0.2rem;
  }
  .pz-topbar-left p { font-size: 0.88rem; color: var(--mid); }

  .pz-topbar-right { display: flex; align-items: center; gap: 0.5rem; }

  .pz-view-toggle {
    display: flex; border: 1.5px solid var(--border); border-radius: var(--radius-sm); overflow: hidden;
  }
  .pz-view-btn {
    padding: 0.4rem 0.7rem; background: var(--white);
    border: none; cursor: pointer; color: var(--mid);
    font-size: 0.9rem; transition: all .15s;
  }
  .pz-view-btn.active { background: var(--teal-700); color: white; }

  .pz-sort-select {
    padding: 0.4rem 0.75rem;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 0.82rem; font-family: var(--font);
    color: var(--dark); background: var(--white);
    outline: none; cursor: pointer;
  }

  /* ── RESULTS BAR ── */
  .pz-results-bar {
    display: flex; align-items: center; gap: 0.75rem;
    margin-bottom: 1rem; flex-wrap: wrap;
  }
  .pz-results-count {
    font-size: 0.85rem; font-weight: 600; color: var(--mid);
  }
  .pz-results-count strong { color: var(--teal-700); }

  /* Active filter tags */
  .pz-active-filters { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .pz-filter-tag {
    display: inline-flex; align-items: center; gap: 5px;
    background: var(--teal-50); color: var(--teal-800);
    border: 1px solid var(--teal-200);
    font-size: 0.74rem; font-weight: 700;
    padding: 0.2rem 0.6rem; border-radius: 20px;
    cursor: pointer; transition: background .15s;
  }
  .pz-filter-tag:hover { background: var(--teal-100); }
  .pz-filter-tag i { font-size: 0.65rem; }

  /* ── LOADING ── */
  .pz-loading-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.25rem;
  }
  .pz-skeleton {
    background: var(--white); border-radius: var(--radius); overflow: hidden;
    border: 1.5px solid var(--border);
  }
  .pz-skeleton-img { height: 175px; background: linear-gradient(90deg,#e8f5f2 25%,#d4eeea 50%,#e8f5f2 75%); background-size: 200%; animation: shimmer 1.4s infinite; }
  .pz-skeleton-body { padding: 1rem; }
  .pz-skeleton-line {
    height: 12px; border-radius: 4px; margin-bottom: 0.6rem;
    background: linear-gradient(90deg,#e8f5f2 25%,#d4eeea 50%,#e8f5f2 75%);
    background-size: 200%; animation: shimmer 1.4s infinite;
  }
  .pz-skeleton-line.short { width: 60%; }
  .pz-skeleton-line.shorter { width: 40%; }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── EMPTY ── */
  .pz-empty {
    text-align: center; padding: 5rem 2rem;
    background: var(--white); border-radius: var(--radius-lg);
    border: 1.5px solid var(--border);
  }
  .pz-empty-icon { font-size: 3.5rem; margin-bottom: 1rem; opacity: .45; }
  .pz-empty h3 { font-size: 1.3rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--dark); }
  .pz-empty p { color: var(--mid); font-size: 0.95rem; margin-bottom: 1.5rem; }
  .pz-empty-btn {
    background: var(--teal-700); color: white; border: none;
    padding: 0.7rem 2rem; border-radius: var(--radius-sm);
    font-weight: 700; font-size: 0.9rem; cursor: pointer;
    transition: background .2s; font-family: var(--font);
  }
  .pz-empty-btn:hover { background: var(--teal-800); }

  /* ══════════════════════════════════════════════════
     PROPERTY GRID
  ══════════════════════════════════════════════════ */
  .pz-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.25rem;
    margin-bottom: 2rem;
  }

  .pz-card {
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    display: flex; flex-direction: column;
    transition: transform .22s, box-shadow .22s, border-color .22s;
    position: relative;
  }
  .pz-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
    border-color: var(--border-hover);
  }

  /* Image */
  .pz-card-img {
    position: relative; height: 175px; overflow: hidden;
    background: var(--teal-50); flex-shrink: 0;
  }
  .pz-card-img img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform .4s;
  }
  .pz-card:hover .pz-card-img img { transform: scale(1.06); }
  .pz-card-no-img {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    font-size: 2.5rem; color: var(--teal-200);
  }

  /* Wishlist heart */
  .pz-wishlist-btn {
    position: absolute; top: 10px; right: 10px; z-index: 2;
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(255,255,255,.9); backdrop-filter: blur(4px);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem; color: var(--light);
    transition: all .18s; box-shadow: 0 2px 8px rgba(0,0,0,.12);
  }
  .pz-wishlist-btn:hover { color: #e11d48; transform: scale(1.1); }
  .pz-wishlist-btn.wishlisted { color: #e11d48; }
  .pz-wishlist-btn.wishlisted i::before { content: '\f004'; font-weight: 900; }

  /* Badges */
  .pz-badges {
    position: absolute; top: 10px; left: 10px;
    display: flex; gap: 5px; flex-wrap: wrap; z-index: 2;
  }
  .pz-badge {
    font-size: 0.62rem; font-weight: 800;
    padding: 3px 8px; border-radius: 20px;
    text-transform: uppercase; letter-spacing: 0.6px;
  }
  .pz-badge.rent { background: var(--teal-700); color: white; }
  .pz-badge.sale { background: var(--sale-bg); color: white; }
  .pz-badge.type { background: rgba(255,255,255,.9); color: #374151; }
  .pz-badge.verified {
    background: rgba(34,197,94,.15); color: #15803d;
    border: 1px solid rgba(34,197,94,.3);
  }

  /* View counter */
  .pz-view-count {
    position: absolute; bottom: 8px; right: 8px;
    background: rgba(0,0,0,.45); color: white;
    font-size: 0.65rem; font-weight: 700;
    padding: 2px 7px; border-radius: 20px;
    display: flex; align-items: center; gap: 3px;
    backdrop-filter: blur(4px);
  }

  /* Body */
  .pz-card-body { padding: 0.9rem; flex: 1; }

  .pz-card-title {
    font-size: 0.93rem; font-weight: 800; color: var(--dark);
    line-height: 1.3; margin-bottom: 0.3rem;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }

  .pz-card-location {
    font-size: 0.74rem; color: var(--mid);
    display: flex; align-items: center; gap: 4px; margin-bottom: 0.55rem;
  }
  .pz-card-location i { color: var(--teal-500); font-size: 0.7rem; }

  .pz-card-price { font-size: 1.05rem; font-weight: 900; color: var(--teal-800); }
  .pz-card-period { font-size: 0.75rem; font-weight: 500; color: var(--mid); }

  .pz-card-meta {
    display: flex; gap: 0.8rem; margin-top: 0.55rem; flex-wrap: wrap;
  }
  .pz-card-meta-item {
    font-size: 0.72rem; color: var(--mid);
    display: flex; align-items: center; gap: 3px;
  }
  .pz-card-meta-item i { color: var(--teal-500); font-size: 0.68rem; }

  /* Actions */
  .pz-card-actions {
    padding: 0.7rem 0.9rem;
    border-top: 1px solid var(--border);
    display: flex; gap: 0.5rem;
  }

  .pz-btn-view {
    flex: 1; background: var(--teal-700); color: white;
    border: none; border-radius: var(--radius-sm); padding: 0.48rem;
    font-size: 0.76rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center; gap: 5px;
    text-decoration: none; transition: background .18s; cursor: pointer;
    font-family: var(--font);
  }
  .pz-btn-view:hover { background: var(--teal-800); }

  .pz-btn-wa {
    background: var(--wa); color: white;
    border: none; border-radius: var(--radius-sm);
    padding: 0.48rem 0.65rem;
    font-size: 0.76rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center; gap: 4px;
    text-decoration: none; transition: background .18s; cursor: pointer;
  }
  .pz-btn-wa:hover { background: var(--wa-dark); }

  .pz-btn-call {
    background: var(--teal-50); color: var(--teal-700);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm); padding: 0.48rem 0.65rem;
    font-size: 0.76rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center; gap: 4px;
    text-decoration: none; transition: all .18s; cursor: pointer;
  }
  .pz-btn-call:hover { background: var(--teal-700); color: white; border-color: var(--teal-700); }

  /* ══════════════════════════════════════════════════
     LIST VIEW
  ══════════════════════════════════════════════════ */
  .pz-list { display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 2rem; }

  .pz-list-card {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
    display: flex; transition: transform .2s, box-shadow .2s, border-color .2s;
  }
  .pz-list-card:hover {
    transform: translateY(-2px); box-shadow: var(--shadow);
    border-color: var(--border-hover);
  }
  .pz-list-img {
    width: 200px; flex-shrink: 0; position: relative;
    background: var(--teal-50); overflow: hidden;
  }
  .pz-list-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .pz-list-body { flex: 1; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between; }
  .pz-list-top {}
  .pz-list-title { font-size: 1rem; font-weight: 800; margin-bottom: 0.3rem; }
  .pz-list-loc { font-size: 0.78rem; color: var(--mid); display: flex; align-items: center; gap: 4px; margin-bottom: 0.5rem; }
  .pz-list-loc i { color: var(--teal-500); }
  .pz-list-desc { font-size: 0.82rem; color: var(--mid); line-height: 1.5; margin-bottom: 0.6rem;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .pz-list-bottom { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }
  .pz-list-price-block {}
  .pz-list-price { font-size: 1.1rem; font-weight: 900; color: var(--teal-800); }
  .pz-list-actions { display: flex; gap: 0.5rem; }

  /* ══════════════════════════════════════════════════
     PAGINATION
  ══════════════════════════════════════════════════ */
  .pz-pagination {
    display: flex; justify-content: center;
    align-items: center; gap: 0.35rem; flex-wrap: wrap;
    margin-top: 1.5rem;
  }
  .pz-page-btn {
    min-width: 36px; height: 36px; padding: 0 0.5rem;
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    background: var(--white); color: var(--teal-700);
    font-size: 0.84rem; font-weight: 700;
    cursor: pointer; transition: all .18s;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font);
  }
  .pz-page-btn:hover:not(:disabled) { background: var(--teal-700); color: white; border-color: var(--teal-700); }
  .pz-page-btn.active { background: var(--teal-700); color: white; border-color: var(--teal-700); }
  .pz-page-btn:disabled { opacity: .4; cursor: not-allowed; }

  /* ══════════════════════════════════════════════════
     MOBILE FILTER TOGGLE
  ══════════════════════════════════════════════════ */
  .pz-filter-toggle {
    display: none;
    background: var(--teal-700); color: white; border: none;
    padding: 0.55rem 1rem; border-radius: var(--radius-sm);
    font-size: 0.85rem; font-weight: 700;
    cursor: pointer; align-items: center; gap: 7px;
    font-family: var(--font);
  }

  .pz-mobile-sidebar-overlay {
    display: none;
    position: fixed; inset: 0; z-index: 700;
    background: rgba(0,0,0,.5);
  }
  .pz-mobile-sidebar {
    position: absolute; top: 0; left: 0; bottom: 0;
    width: min(var(--sidebar-w), 90vw);
    background: var(--white);
    padding: 1.5rem 1.25rem;
    overflow-y: auto;
  }
  .pz-mobile-sidebar-close {
    position: absolute; top: 1rem; right: 1rem;
    background: var(--teal-50); border: none;
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 0.9rem; color: var(--mid);
  }

  /* ══════════════════════════════════════════════════
     RESPONSIVE
  ══════════════════════════════════════════════════ */
  @media (max-width: 960px) {
    .pz-sidebar { display: none; }
    .pz-filter-toggle { display: flex; }
    .pz-mobile-sidebar-overlay.open { display: block; }
    .pz-nav-links { display: none; }
    .pz-logo-text { display: none; }
    .pz-list-img { width: 130px; }
  }

  @media (max-width: 640px) {
    .pz-content { padding: 1rem 0.75rem 3rem; }
    .pz-topbar-left h1 { font-size: 1.3rem; }
    .pz-list-card { flex-direction: column; }
    .pz-list-img { width: 100%; height: 160px; }
    .pz-btn-nav.ghost { display: none; }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const formatPrice = (n) => {
  const num = Number(n || 0);
  if (num >= 1_000_000) return `MWK ${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `MWK ${(num / 1_000).toFixed(0)}K`;
  return `MWK ${num.toLocaleString()}`;
};

const isForSale = (prop) =>
  (prop.listingType || prop.listingPurpose || '').toLowerCase().includes('sale');

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON CARDS
// ─────────────────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="pz-skeleton">
      <div className="pz-skeleton-img" />
      <div className="pz-skeleton-body">
        <div className="pz-skeleton-line" />
        <div className="pz-skeleton-line short" />
        <div className="pz-skeleton-line shorter" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER PANEL (reused in sidebar & mobile drawer)
// ─────────────────────────────────────────────────────────────────────────────

function FilterPanel({ filters, onChange, onSearch, onReset, onClose }) {
  const { search, type, purpose, district, bedrooms, minPrice, maxPrice, sort } = filters;

  const toggleChip = (field, val) => {
    onChange(field, filters[field] === val ? '' : val);
  };

  return (
    <div>
      {onClose && (
        <button className="pz-mobile-sidebar-close" onClick={onClose} aria-label="Close filters">
          <i className="fa fa-times"></i>
        </button>
      )}

      <p className="pz-sidebar-title">
        <i className="fa fa-sliders-h"></i> Filters
      </p>

      {/* Search */}
      <div className="pz-filter-section">
        <label className="pz-filter-label">Search</label>
        <input
          className="pz-filter-input"
          type="text"
          placeholder="Title, location, keywords..."
          value={search}
          onChange={e => onChange('search', e.target.value)}
        />
      </div>

      {/* District */}
      <div className="pz-filter-section">
        <label className="pz-filter-label">District</label>
        <select
          className="pz-filter-select"
          value={district}
          onChange={e => onChange('district', e.target.value)}
        >
          <option value="">All 28 Districts</option>
          {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Listing Purpose */}
      <div className="pz-filter-section">
        <label className="pz-filter-label">Listing Type</label>
        <div className="pz-chips">
          {LISTING_PURPOSES.map(p => (
            <button
              key={p}
              className={`pz-chip ${purpose === p ? 'selected' : ''}`}
              onClick={() => toggleChip('purpose', p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div className="pz-filter-section">
        <label className="pz-filter-label">Property Type</label>
        <div className="pz-chips">
          {PROPERTY_TYPES.map(t => (
            <button
              key={t}
              className={`pz-chip ${type === t ? 'selected' : ''}`}
              onClick={() => toggleChip('type', t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div className="pz-filter-section">
        <label className="pz-filter-label">Bedrooms</label>
        <div className="pz-chips">
          {BEDROOMS_OPTIONS.map(b => (
            <button
              key={b}
              className={`pz-chip ${bedrooms === b ? 'selected' : ''}`}
              onClick={() => toggleChip('bedrooms', b)}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="pz-filter-section">
        <label className="pz-filter-label">Price Range (MWK)</label>
        <div className="pz-filter-row">
          <input
            className="pz-filter-input"
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={e => onChange('minPrice', e.target.value)}
          />
          <input
            className="pz-filter-input"
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={e => onChange('maxPrice', e.target.value)}
          />
        </div>
      </div>

      {/* Sort */}
      <div className="pz-filter-section">
        <label className="pz-filter-label">Sort By</label>
        <select
          className="pz-filter-select"
          value={sort}
          onChange={e => onChange('sort', e.target.value)}
        >
          <option value="">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="views_desc">Most Viewed</option>
        </select>
      </div>

      <div className="pz-sidebar-actions">
        <button className="pz-sidebar-btn primary" onClick={onSearch}>
          <i className="fa fa-search"></i> Search Properties
        </button>
        <button className="pz-sidebar-btn secondary" onClick={onReset}>
          <i className="fa fa-redo"></i> Clear All Filters
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROPERTY CARD (Grid View)
// ─────────────────────────────────────────────────────────────────────────────

function PropertyCard({ property, wishlisted, onWishlist }) {
  const sale = isForSale(property);
  const navigate = useNavigate();

  return (
    <div className="pz-card">
      <div className="pz-card-img">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title || property.name}
            loading="lazy"
          />
        ) : (
          <div className="pz-card-no-img">
            <i className="fa fa-home"></i>
          </div>
        )}

        {/* Wishlist */}
        <button
          className={`pz-wishlist-btn ${wishlisted ? 'wishlisted' : ''}`}
          onClick={e => { e.stopPropagation(); onWishlist(property._id); }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <i className={`${wishlisted ? 'fas' : 'far'} fa-heart`}></i>
        </button>

        {/* Badges */}
        <div className="pz-badges">
          <span className={`pz-badge ${sale ? 'sale' : 'rent'}`}>
            {sale ? 'For Sale' : 'For Rent'}
          </span>
          {property.type && (
            <span className="pz-badge type">{property.type}</span>
          )}
          {property.verified && (
            <span className="pz-badge verified">
              <i className="fa fa-check-circle"></i> Verified
            </span>
          )}
        </div>

        {/* View count */}
        {property.views > 0 && (
          <div className="pz-view-count">
            <i className="fa fa-eye"></i> {property.views}
          </div>
        )}
      </div>

      <div className="pz-card-body">
        <div className="pz-card-title">{property.title || property.name}</div>
        <div className="pz-card-location">
          <i className="fa fa-map-marker-alt"></i>
          {[property.area, property.district].filter(Boolean).join(', ') || 'Malawi'}
        </div>
        <div>
          <span className="pz-card-price">{formatPrice(property.price)}</span>
          {!sale && <span className="pz-card-period"> /month</span>}
        </div>
        <div className="pz-card-meta">
          {property.bedrooms > 0 && (
            <span className="pz-card-meta-item">
              <i className="fa fa-bed"></i> {property.bedrooms} bed
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="pz-card-meta-item">
              <i className="fa fa-bath"></i> {property.bathrooms} bath
            </span>
          )}
          {property.size && (
            <span className="pz-card-meta-item">
              <i className="fa fa-expand-arrows-alt"></i> {property.size}m²
            </span>
          )}
        </div>
      </div>

      <div className="pz-card-actions">
        <Link to={`/properties/${property._id}`} className="pz-btn-view">
          <i className="fa fa-eye"></i> View
        </Link>
        {property.whatsapp && (
          <a
            className="pz-btn-wa"
            href={`https://wa.me/${property.whatsapp.replace(/\D/g, '')}?text=Hi, I'm interested in ${encodeURIComponent(property.title || 'your property')} listed on PezaNyumba.`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact via WhatsApp"
          >
            <i className="fab fa-whatsapp"></i>
          </a>
        )}
        {property.phone && (
          <a className="pz-btn-call" href={`tel:${property.phone}`} aria-label="Call owner">
            <i className="fa fa-phone"></i>
          </a>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROPERTY LIST CARD (List View)
// ─────────────────────────────────────────────────────────────────────────────

function PropertyListCard({ property, wishlisted, onWishlist }) {
  const sale = isForSale(property);

  return (
    <div className="pz-list-card">
      <div className="pz-list-img">
        {property.images && property.images.length > 0 ? (
          <img src={property.images[0]} alt={property.title || property.name} loading="lazy" />
        ) : (
          <div className="pz-card-no-img" style={{ height: '100%' }}>
            <i className="fa fa-home"></i>
          </div>
        )}
        <div className="pz-badges" style={{ top: 8, left: 8 }}>
          <span className={`pz-badge ${sale ? 'sale' : 'rent'}`}>
            {sale ? 'For Sale' : 'For Rent'}
          </span>
          {property.verified && (
            <span className="pz-badge verified"><i className="fa fa-check-circle"></i> Verified</span>
          )}
        </div>
      </div>

      <div className="pz-list-body">
        <div className="pz-list-top">
          <div className="pz-list-title">{property.title || property.name}</div>
          <div className="pz-list-loc">
            <i className="fa fa-map-marker-alt"></i>
            {[property.area, property.district].filter(Boolean).join(', ') || 'Malawi'}
          </div>
          {property.description && (
            <div className="pz-list-desc">{property.description}</div>
          )}
          <div className="pz-card-meta" style={{ marginBottom: '0.5rem' }}>
            {property.bedrooms > 0 && (
              <span className="pz-card-meta-item"><i className="fa fa-bed"></i> {property.bedrooms} bed</span>
            )}
            {property.bathrooms > 0 && (
              <span className="pz-card-meta-item"><i className="fa fa-bath"></i> {property.bathrooms} bath</span>
            )}
            {property.size && (
              <span className="pz-card-meta-item"><i className="fa fa-expand-arrows-alt"></i> {property.size}m²</span>
            )}
          </div>
        </div>

        <div className="pz-list-bottom">
          <div className="pz-list-price-block">
            <span className="pz-list-price">{formatPrice(property.price)}</span>
            {!sale && <span className="pz-card-period"> /month</span>}
          </div>
          <div className="pz-list-actions">
            <Link to={`/properties/${property._id}`} className="pz-btn-view" style={{ minWidth: 90 }}>
              <i className="fa fa-eye"></i> Details
            </Link>
            {property.whatsapp && (
              <a
                className="pz-btn-wa"
                href={`https://wa.me/${property.whatsapp.replace(/\D/g, '')}?text=Hi, I'm interested in ${encodeURIComponent(property.title || 'your property')} listed on PezaNyumba.`}
                target="_blank" rel="noopener noreferrer"
              >
                <i className="fab fa-whatsapp"></i> WhatsApp
              </a>
            )}
            {property.phone && (
              <a className="pz-btn-call" href={`tel:${property.phone}`}>
                <i className="fa fa-phone"></i>
              </a>
            )}
            <button
              className={`pz-wishlist-btn`}
              style={{ position: 'static', width: 36, height: 36, background: 'var(--teal-50)', border: '1.5px solid var(--border)' }}
              onClick={() => onWishlist(property._id)}
              aria-label="Wishlist"
            >
              <i className={`${wishlisted ? 'fas' : 'far'} fa-heart`} style={{ color: wishlisted ? '#e11d48' : 'var(--light)' }}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_FILTERS = {
  search: '', type: '', purpose: '', district: '',
  bedrooms: '', minPrice: '', maxPrice: '', sort: '',
};

export default function PropertiesListing() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [pendingFilters, setPendingFilters] = useState(EMPTY_FILTERS);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [view, setView] = useState('grid'); // 'grid' | 'list'
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pz_wishlist') || '[]'); }
    catch { return []; }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const abortRef = useRef(null);

  // Persist wishlist
  useEffect(() => {
    try { localStorage.setItem('pz_wishlist', JSON.stringify(wishlist)); }
    catch {}
  }, [wishlist]);

  const toggleWishlist = useCallback((id) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const fetchProperties = useCallback(async (page = 1, activeFilters = filters) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (activeFilters.search)   params.set('search', activeFilters.search);
      if (activeFilters.type)     params.set('type', activeFilters.type);
      if (activeFilters.purpose)  params.set('listingType', activeFilters.purpose);
      if (activeFilters.district) params.set('district', activeFilters.district);
      if (activeFilters.bedrooms) params.set('bedrooms', activeFilters.bedrooms.replace('+', ''));
      if (activeFilters.minPrice) params.set('minPrice', activeFilters.minPrice);
      if (activeFilters.maxPrice) params.set('maxPrice', activeFilters.maxPrice);
      if (activeFilters.sort)     params.set('sort', activeFilters.sort);

      const res = await fetch(`${API_URL}/properties?${params}`, { signal: controller.signal });
      const data = await res.json();

      if (data.success) {
        setProperties(data.properties || []);
        setPagination({
          page: data.pagination?.page || 1,
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.totalPages || 1,
        });
      } else {
        setProperties([]);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('[PezaNyumba] fetch error:', err);
        setProperties([]);
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initial load
  useEffect(() => {
    fetchProperties(1, EMPTY_FILTERS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (field, value) => {
    setPendingFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    setFilters(pendingFilters);
    fetchProperties(1, pendingFilters);
    setMobileOpen(false);
  };

  const handleReset = () => {
    setPendingFilters(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
    fetchProperties(1, EMPTY_FILTERS);
    setMobileOpen(false);
  };

  const handlePageChange = (page) => {
    fetchProperties(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Active filter tags
  const activeFilterTags = Object.entries(filters)
    .filter(([k, v]) => v && k !== 'sort')
    .map(([k, v]) => ({
      key: k,
      label: k === 'search' ? `"${v}"` : k === 'purpose' ? v : k === 'minPrice' ? `Min: ${formatPrice(v)}` : k === 'maxPrice' ? `Max: ${formatPrice(v)}` : v,
    }));

  const removeFilterTag = (key) => {
    const updated = { ...filters, [key]: '' };
    setFilters(updated);
    setPendingFilters(updated);
    fetchProperties(1, updated);
  };

  // Pagination buttons
  const pageButtons = () => {
    const { page, totalPages } = pagination;
    const pages = [];
    const delta = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '…') {
        pages.push('…');
      }
    }
    return pages;
  };

  return (
    <>
      <style>{styles}</style>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />

      {/* ── NAVBAR ── */}
      <nav className="pz-navbar" aria-label="Main navigation">
        <div className="pz-nav-left">
          <Link to="/" className="pz-logo" aria-label="PezaNyumba Home">
            <div className="pz-logo-mark" aria-hidden="true">PN</div>
            <div className="pz-logo-text">
              <strong>PEZANYUMBA</strong>
              <span>Find Your Perfect Home in Malawi</span>
            </div>
          </Link>
          <div className="pz-nav-divider" aria-hidden="true"></div>
          <nav className="pz-nav-links" aria-label="Site links">
            <Link to="/properties" className="pz-nav-link active">Browse</Link>
            <Link to="/about" className="pz-nav-link">About</Link>
            <Link to="/contact" className="pz-nav-link">Contact</Link>
          </nav>
        </div>
        <div className="pz-nav-right">
          <Link to="/login" className="pz-btn-nav ghost">
            <i className="fa fa-sign-in-alt"></i> Login
          </Link>
          <Link to="/register" className="pz-btn-nav solid">
            <i className="fa fa-plus"></i> List Property
          </Link>
        </div>
      </nav>

      {/* ── PAGE ── */}
      <div className="pz-page">

        {/* ── DESKTOP SIDEBAR ── */}
        <aside className="pz-sidebar" aria-label="Property filters">
          <FilterPanel
            filters={pendingFilters}
            onChange={handleFilterChange}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </aside>

        {/* ── MOBILE FILTER OVERLAY ── */}
        <div
          className={`pz-mobile-sidebar-overlay ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen(false)}
          role="dialog"
          aria-label="Property filters"
          aria-modal="true"
        >
          <div
            className="pz-mobile-sidebar"
            onClick={e => e.stopPropagation()}
          >
            <FilterPanel
              filters={pendingFilters}
              onChange={handleFilterChange}
              onSearch={handleSearch}
              onReset={handleReset}
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <main className="pz-content">

          {/* Top bar */}
          <div className="pz-topbar">
            <div className="pz-topbar-left">
              <h1>Find Your Perfect Home</h1>
              <p>Browse verified properties across all 28 districts of Malawi</p>
            </div>
            <div className="pz-topbar-right">
              <button
                className="pz-filter-toggle"
                onClick={() => setMobileOpen(true)}
                aria-label="Open filters"
              >
                <i className="fa fa-sliders-h"></i> Filters
              </button>
              <select
                className="pz-sort-select"
                value={pendingFilters.sort}
                onChange={e => { handleFilterChange('sort', e.target.value); }}
                aria-label="Sort properties"
              >
                <option value="">Newest</option>
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
                <option value="views_desc">Most Viewed</option>
              </select>
              <div className="pz-view-toggle" role="group" aria-label="View mode">
                <button
                  className={`pz-view-btn ${view === 'grid' ? 'active' : ''}`}
                  onClick={() => setView('grid')}
                  aria-label="Grid view" aria-pressed={view === 'grid'}
                >
                  <i className="fa fa-th-large"></i>
                </button>
                <button
                  className={`pz-view-btn ${view === 'list' ? 'active' : ''}`}
                  onClick={() => setView('list')}
                  aria-label="List view" aria-pressed={view === 'list'}
                >
                  <i className="fa fa-list"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Results bar + active tags */}
          {!loading && (
            <div className="pz-results-bar">
              <p className="pz-results-count">
                <strong>{pagination.total.toLocaleString()}</strong> propert{pagination.total === 1 ? 'y' : 'ies'} found
                {pagination.totalPages > 1 && ` · Page ${pagination.page} of ${pagination.totalPages}`}
              </p>
              {activeFilterTags.length > 0 && (
                <div className="pz-active-filters" role="list" aria-label="Active filters">
                  {activeFilterTags.map(tag => (
                    <button
                      key={tag.key}
                      className="pz-filter-tag"
                      onClick={() => removeFilterTag(tag.key)}
                      role="listitem"
                      aria-label={`Remove filter: ${tag.label}`}
                    >
                      {tag.label} <i className="fa fa-times"></i>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className={view === 'grid' ? 'pz-loading-grid' : 'pz-list'} aria-busy="true" aria-label="Loading properties">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Empty state */}
          {!loading && properties.length === 0 && (
            <div className="pz-empty" role="status">
              <div className="pz-empty-icon" aria-hidden="true">🏠</div>
              <h3>No properties found</h3>
              <p>Try adjusting your filters or search for a different location</p>
              <button className="pz-empty-btn" onClick={handleReset}>
                <i className="fa fa-redo" style={{ marginRight: '0.5rem' }}></i>
                Clear All Filters
              </button>
            </div>
          )}

          {/* Grid view */}
          {!loading && properties.length > 0 && view === 'grid' && (
            <div className="pz-grid" role="list" aria-label="Property listings">
              {properties.map(p => (
                <div key={p._id} role="listitem">
                  <PropertyCard
                    property={p}
                    wishlisted={wishlist.includes(p._id)}
                    onWishlist={toggleWishlist}
                  />
                </div>
              ))}
            </div>
          )}

          {/* List view */}
          {!loading && properties.length > 0 && view === 'list' && (
            <div className="pz-list" role="list" aria-label="Property listings">
              {properties.map(p => (
                <div key={p._id} role="listitem">
                  <PropertyListCard
                    property={p}
                    wishlisted={wishlist.includes(p._id)}
                    onWishlist={toggleWishlist}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <nav className="pz-pagination" aria-label="Pagination">
              <button
                className="pz-page-btn"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                aria-label="Previous page"
              >
                <i className="fa fa-chevron-left"></i>
              </button>

              {pageButtons().map((p, i) =>
                p === '…' ? (
                  <span key={`ellipsis-${i}`} style={{ padding: '0 0.25rem', color: 'var(--light)' }}>…</span>
                ) : (
                  <button
                    key={p}
                    className={`pz-page-btn ${pagination.page === p ? 'active' : ''}`}
                    onClick={() => handlePageChange(p)}
                    aria-label={`Page ${p}`}
                    aria-current={pagination.page === p ? 'page' : undefined}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                className="pz-page-btn"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                aria-label="Next page"
              >
                <i className="fa fa-chevron-right"></i>
              </button>
            </nav>
          )}

        </main>
      </div>
    </>
  );
}