import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHostel } from '../context/HostelContext';
import { useAuth } from '../context/AuthContext';
import {
  FaUser, FaHome, FaBookmark, FaEnvelope, FaHeart, FaBell,
  FaCog, FaSignOutAlt, FaArrowRight, FaChartLine, FaCheckCircle,
  FaMapMarkerAlt, FaStar, FaPhone, FaFilter, FaSearch, FaVideo,
  FaThumbsUp, FaComment, FaShare, FaEllipsisH, FaImages,
  FaUserFriends, FaChevronDown, FaChevronRight, FaBars, FaTimes
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import HostelFilters from '../components/hostel/HostelFilters';
import Pagination from '../components/common/Pagination';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0d1b3e;
    --blue: #1a3fa4;
    --orange: #e8501a;
    --orange-light: rgba(232,80,26,0.1);
    --white: #ffffff;
    --gray-bg: #f0f2f5;
    --gray-light: #e4e6eb;
    --text-dark: #050505;
    --text-mid: #65676b;
    --success: #10b981;
    --danger: #e41e3f;
    --shadow: 0 1px 3px rgba(0,0,0,0.12);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.14);
    --transition: all 0.2s ease;
    --topbar-h: 60px;
    --left-w: 280px;
    --right-w: 320px;
  }

  html { scroll-behavior: smooth; overflow-x: hidden; }
  body { font-family: 'Manrope', sans-serif; background: var(--gray-bg); color: var(--text-dark); -webkit-font-smoothing: antialiased; overflow-x: hidden; width: 100%; }

  /* ══════════ TOPBAR ══════════ */
  .fb-topbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    height: var(--topbar-h); background: var(--white); box-shadow: var(--shadow);
    display: flex; align-items: center; padding: 0 12px; gap: 8px;
  }
  .fb-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; flex-shrink: 0; }
  .fb-logo-icon {
    width: 40px; height: 40px; border-radius: 50%;
    background: linear-gradient(135deg, var(--orange) 0%, #c0390e 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; box-shadow: 0 2px 8px rgba(232,80,26,0.35); flex-shrink: 0;
  }
  .fb-logo-text { font-size: 1.2rem; font-weight: 900; color: var(--orange); letter-spacing: -0.5px; }
  .fb-search-form {
    display: flex; align-items: center; gap: 8px; background: var(--gray-bg);
    border-radius: 20px; padding: 8px 14px; flex: 1; max-width: 260px;
    transition: var(--transition);
  }
  .fb-search-form:focus-within { box-shadow: 0 0 0 2px var(--orange); background: var(--white); }
  .fb-search-form svg { color: var(--text-mid); flex-shrink: 0; font-size: 0.9rem; }
  .fb-search-form input {
    border: none; background: transparent; outline: none;
    font-family: 'Manrope', sans-serif; font-size: 0.88rem;
    color: var(--text-dark); width: 100%; font-weight: 600;
  }
  .fb-search-form input::placeholder { color: var(--text-mid); font-weight: 500; }
  .fb-topbar-center { flex: 1; display: flex; justify-content: center; align-items: center; gap: 4px; }
  .fb-nav-tab {
    display: flex; align-items: center; justify-content: center;
    width: 96px; height: 48px; border-radius: 8px; cursor: pointer;
    color: var(--text-mid); font-size: 1.35rem; transition: var(--transition);
    position: relative; border: none; background: transparent; text-decoration: none;
  }
  .fb-nav-tab:hover { background: var(--gray-bg); color: var(--navy); }
  .fb-nav-tab.active { color: var(--orange); }
  .fb-nav-tab.active::after {
    content: ''; position: absolute; bottom: -6px; left: 8px; right: 8px;
    height: 3px; background: var(--orange); border-radius: 3px 3px 0 0;
  }
  .fb-nav-badge {
    position: absolute; top: 5px; right: 14px; background: var(--danger);
    color: white; font-size: 0.62rem; font-weight: 900; padding: 1px 5px;
    border-radius: 10px; min-width: 17px; text-align: center; line-height: 1.4;
  }
  .fb-topbar-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .fb-icon-btn {
    width: 40px; height: 40px; border-radius: 50%; background: var(--gray-bg);
    display: flex; align-items: center; justify-content: center; cursor: pointer;
    color: var(--text-dark); font-size: 1rem; border: none; transition: var(--transition);
    text-decoration: none; position: relative; flex-shrink: 0;
  }
  .fb-icon-btn:hover { background: var(--gray-light); transform: scale(1.05); }
  .fb-icon-btn .dot {
    position: absolute; top: 3px; right: 3px; width: 9px; height: 9px;
    background: var(--danger); border-radius: 50%; border: 2px solid white;
  }
  .fb-avatar-btn {
    width: 40px; height: 40px; border-radius: 50%;
    background: linear-gradient(135deg, var(--navy), var(--blue));
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 0.88rem; font-weight: 900; cursor: pointer;
    border: 2px solid transparent; transition: var(--transition); flex-shrink: 0;
  }
  .fb-avatar-btn:hover { border-color: var(--orange); transform: scale(1.05); }
  .fb-menu-btn {
    display: none; width: 40px; height: 40px; border-radius: 50%;
    background: var(--gray-bg); align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-dark); font-size: 1rem; border: none; flex-shrink: 0;
  }

  /* ══════════ PAGE LAYOUT ══════════ */
  .fb-page {
    padding-top: var(--topbar-h); min-height: 100vh;
    display: grid; grid-template-columns: var(--left-w) 1fr var(--right-w);
    grid-template-areas: "left center right";
    max-width: 1600px; margin: 0 auto; align-items: start;
  }

  /* ══════════ LEFT SIDEBAR ══════════ */
  .fb-left {
    grid-area: left; position: sticky; top: var(--topbar-h);
    height: calc(100vh - var(--topbar-h)); overflow-y: auto;
    padding: 12px 8px 24px; border-right: 1px solid var(--gray-light);
    background: var(--white);
  }
  .fb-left::-webkit-scrollbar { width: 3px; }
  .fb-left::-webkit-scrollbar-thumb { background: var(--gray-light); border-radius: 4px; }
  .fb-left-overlay {
    display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    z-index: 998; backdrop-filter: blur(2px);
  }
  .fb-sidebar-profile {
    display: flex; align-items: center; gap: 10px; padding: 10px;
    border-radius: 10px; text-decoration: none; color: var(--text-dark);
    transition: var(--transition); margin-bottom: 6px;
  }
  .fb-sidebar-profile:hover { background: var(--gray-bg); }
  .fb-sidebar-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: linear-gradient(135deg, var(--navy), var(--blue));
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 0.85rem; font-weight: 900; flex-shrink: 0;
  }
  .fb-sidebar-name { font-weight: 800; font-size: 0.95rem; line-height: 1.2; }
  .fb-sidebar-role { font-size: 0.72rem; color: var(--text-mid); font-weight: 600; }
  .fb-sidebar-link {
    display: flex; align-items: center; gap: 10px; padding: 8px 10px;
    border-radius: 8px; text-decoration: none; color: var(--text-dark);
    font-size: 0.93rem; font-weight: 700; transition: var(--transition);
    cursor: pointer; border: none; background: transparent; width: 100%;
    font-family: 'Manrope', sans-serif;
  }
  .fb-sidebar-link:hover { background: var(--gray-bg); }
  .fb-sidebar-link.danger:hover { background: rgba(239,68,68,0.1); color: #ef4444; }
  .fb-sidebar-icon {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; flex-shrink: 0;
  }
  .fb-sidebar-badge {
    margin-left: auto; background: var(--danger); color: white;
    font-size: 0.68rem; font-weight: 900; padding: 2px 7px;
    border-radius: 10px; min-width: 20px; text-align: center;
  }
  .fb-sidebar-divider { border: none; border-top: 1px solid var(--gray-light); margin: 8px 10px; }
  .fb-sidebar-section {
    font-size: 0.74rem; color: var(--text-mid); font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.6px; padding: 6px 10px 4px;
  }

  /* ══════════ CENTER FEED ══════════ */
  .fb-center {
    grid-area: center; padding: 20px 16px 40px;
    min-height: calc(100vh - var(--topbar-h));
    max-width: 680px; margin: 0 auto; width: 100%;
  }

  /* Welcome Banner */
  .fb-welcome {
    background: linear-gradient(135deg, var(--navy) 0%, var(--blue) 55%, #2655d4 100%);
    border-radius: 14px; padding: 22px 24px; margin-bottom: 16px;
    color: white; box-shadow: var(--shadow-md); position: relative; overflow: hidden;
  }
  .fb-welcome::after {
    content: ''; position: absolute; top: -50px; right: -50px;
    width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;
  }
  .fb-welcome::before {
    content: ''; position: absolute; bottom: -30px; right: 70px;
    width: 110px; height: 110px; background: rgba(255,255,255,0.04); border-radius: 50%;
  }
  .fb-welcome h2 {
    font-size: 1.4rem; font-weight: 900; margin-bottom: 5px;
    color: #ffffff; text-shadow: 0 1px 4px rgba(0,0,0,0.25); position: relative; z-index: 1;
  }
  .fb-welcome p {
    font-size: 0.9rem; color: rgba(255,255,255,0.92); font-weight: 700;
    position: relative; z-index: 1;
  }

  /* Stories */
  .fb-stories { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 16px; scrollbar-width: none; }
  .fb-stories::-webkit-scrollbar { display: none; }
  .fb-story {
    flex-shrink: 0; width: 108px; height: 180px; border-radius: 12px;
    overflow: hidden; position: relative; cursor: pointer;
    background: linear-gradient(135deg, var(--navy), var(--blue));
    transition: var(--transition); box-shadow: var(--shadow);
  }
  .fb-story:hover { transform: scale(1.04); box-shadow: var(--shadow-md); }
  .fb-story img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .fb-story-grad { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.78) 100%); }
  .fb-story-ava {
    position: absolute; top: 10px; left: 10px; width: 34px; height: 34px;
    border-radius: 50%; border: 3px solid var(--orange);
    background: linear-gradient(135deg, var(--navy), var(--blue));
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 0.8rem; font-weight: 900;
  }
  .fb-story-label { position: absolute; bottom: 10px; left: 8px; right: 8px; font-size: 0.76rem; font-weight: 800; color: white; line-height: 1.3; }
  .fb-story-price { font-size: 0.68rem; opacity: 0.9; margin-top: 2px; font-weight: 700; }
  .fb-story-add {
    background: var(--white); border: 2px solid var(--gray-light);
    display: flex; flex-direction: column; align-items: center; justify-content: flex-end; padding-bottom: 14px;
  }
  .fb-story-add-ring {
    width: 42px; height: 42px; border-radius: 50%; background: var(--orange);
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 1.25rem; font-weight: 900; border: 3px solid white;
    margin-bottom: 8px; box-shadow: 0 2px 8px rgba(232,80,26,0.3);
  }
  .fb-story-add span { font-size: 0.75rem; font-weight: 800; color: var(--text-dark); text-align: center; line-height: 1.3; }

  /* Compose */
  .fb-compose { background: var(--white); border-radius: 12px; padding: 12px 14px; box-shadow: var(--shadow); margin-bottom: 16px; }
  .fb-compose-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .fb-compose-input {
    flex: 1; background: var(--gray-bg); border: none; border-radius: 22px;
    padding: 10px 16px; font-family: 'Manrope', sans-serif;
    font-size: 0.92rem; color: var(--text-mid); cursor: pointer;
    outline: none; transition: var(--transition); font-weight: 600;
  }
  .fb-compose-input:hover, .fb-compose-input:focus { background: #e4e6eb; }
  .fb-compose-search-btn {
    background: var(--orange); color: white; border: none; border-radius: 22px;
    padding: 10px 18px; cursor: pointer; font-weight: 900; font-size: 0.85rem;
    font-family: 'Manrope', sans-serif; transition: var(--transition); white-space: nowrap;
  }
  .fb-compose-search-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .fb-compose-divider { border: none; border-top: 1px solid var(--gray-light); margin: 2px 0 8px; }
  .fb-compose-actions { display: flex; }
  .fb-compose-action {
    flex: 1; display: flex; align-items: center; justify-content: center;
    gap: 6px; padding: 8px 4px; border-radius: 8px; cursor: pointer;
    font-size: 0.83rem; font-weight: 800; color: var(--text-mid);
    transition: var(--transition); border: none; background: transparent;
    font-family: 'Manrope', sans-serif;
  }
  .fb-compose-action:hover { background: var(--gray-bg); }

  /* Filters */
  .fb-filters-box { background: var(--white); border-radius: 12px; padding: 12px 14px; box-shadow: var(--shadow); margin-bottom: 16px; }
  .fb-filters-hd { display: flex; align-items: center; justify-content: space-between; cursor: pointer; user-select: none; }
  .fb-filters-hd h3 { font-size: 0.98rem; font-weight: 800; color: var(--text-dark); display: flex; align-items: center; gap: 8px; }
  .fb-filters-hd h3 svg { color: var(--orange); }
  .fb-filter-toggle {
    background: var(--gray-bg); border: none; border-radius: 6px; padding: 5px 12px;
    cursor: pointer; font-weight: 800; font-size: 0.78rem; font-family: 'Manrope', sans-serif;
    color: var(--text-dark); transition: var(--transition); display: flex; align-items: center; gap: 4px;
  }
  .fb-filter-toggle:hover { background: var(--gray-light); }

  /* Results bar */
  .fb-results-bar {
    background: var(--white); border-radius: 10px; padding: 10px 14px;
    margin-bottom: 14px; display: flex; justify-content: space-between;
    align-items: center; box-shadow: var(--shadow);
  }
  .fb-results-count { font-weight: 800; font-size: 0.9rem; color: var(--navy); display: flex; align-items: center; gap: 6px; }
  .fb-results-count svg { color: var(--orange); }
  .fb-results-page { font-size: 0.8rem; color: var(--text-mid); font-weight: 700; }

  /* ══════════ POST CARD ══════════ */
  .fb-post { background: var(--white); border-radius: 12px; box-shadow: var(--shadow); margin-bottom: 16px; overflow: hidden; transition: var(--transition); }
  .fb-post:hover { box-shadow: var(--shadow-md); }
  .fb-post-hd { display: flex; align-items: center; gap: 10px; padding: 14px 14px 8px; }
  .fb-post-ava {
    width: 42px; height: 42px; border-radius: 50%;
    background: linear-gradient(135deg, var(--navy), var(--blue));
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 1rem; font-weight: 900; flex-shrink: 0;
  }
  .fb-post-meta { flex: 1; min-width: 0; }
  .fb-post-owner { font-weight: 900; font-size: 0.97rem; color: var(--text-dark); line-height: 1.2; }
  .fb-post-loc { font-size: 0.77rem; color: var(--text-mid); font-weight: 700; display: flex; align-items: center; gap: 4px; flex-wrap: wrap; margin-top: 2px; }
  .fb-post-loc svg { color: var(--orange); flex-shrink: 0; }
  .fb-post-more-btn {
    width: 36px; height: 36px; border-radius: 50%; border: none; background: transparent;
    cursor: pointer; color: var(--text-mid); display: flex; align-items: center; justify-content: center;
    font-size: 1rem; transition: var(--transition); flex-shrink: 0;
  }
  .fb-post-more-btn:hover { background: var(--gray-bg); }
  .fb-post-caption { padding: 0 14px 10px; font-size: 0.93rem; font-weight: 700; color: var(--text-dark); line-height: 1.65; }
  .fb-post-caption strong { color: var(--orange); font-weight: 900; font-size: 1rem; display: block; margin-bottom: 2px; }

  /* Images */
  .fb-post-imgs { position: relative; background: #111; overflow: hidden; }
  .fb-post-img-single img { width: 100%; max-height: 480px; object-fit: cover; display: block; transition: transform 0.3s ease; }
  .fb-post-img-single:hover img { transform: scale(1.01); }
  .fb-post-img-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
  .fb-post-img-grid2 img { width: 100%; height: 220px; object-fit: cover; display: block; }
  .fb-post-img-grid3 { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
  .fb-post-img-grid3 .img-main { grid-row: span 2; }
  .fb-post-img-grid3 .img-main img { width: 100%; height: 302px; object-fit: cover; display: block; }
  .fb-post-img-grid3 .img-sub img { width: 100%; height: 150px; object-fit: cover; display: block; }
  .fb-post-img-more { position: relative; overflow: hidden; }
  .fb-post-img-more img { width: 100%; height: 150px; object-fit: cover; display: block; filter: brightness(0.5); }
  .fb-post-img-more-lbl { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.6rem; font-weight: 900; }
  .fb-post-no-img { height: 200px; background: linear-gradient(135deg, var(--navy), var(--blue)); display: flex; align-items: center; justify-content: center; color: white; flex-direction: column; gap: 8px; }
  .fb-post-no-img span { font-size: 0.88rem; opacity: 0.75; font-weight: 700; }
  .fb-img-badges { position: absolute; top: 10px; left: 10px; display: flex; gap: 6px; flex-wrap: wrap; z-index: 2; }
  .fb-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 900; backdrop-filter: blur(6px); }
  .fb-badge-verified { background: rgba(16,185,129,0.92); color: white; }
  .fb-badge-price { background: rgba(232,80,26,0.92); color: white; font-size: 0.78rem; }
  .fb-badge-rooms { background: rgba(13,27,62,0.88); color: white; }

  /* View Details bar */
  .fb-view-details-bar {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 11px 14px; cursor: pointer; transition: var(--transition);
    font-weight: 900; font-size: 0.92rem; color: var(--orange);
    border: none; width: 100%; font-family: 'Manrope', sans-serif;
    background: linear-gradient(90deg, rgba(232,80,26,0.07) 0%, rgba(26,63,164,0.07) 100%);
    border-top: 1px solid var(--gray-light); letter-spacing: 0.2px;
  }
  .fb-view-details-bar:hover { background: rgba(232,80,26,0.12); }
  .fb-view-details-bar svg { font-size: 1rem; transition: transform 0.2s; }
  .fb-view-details-bar:hover svg { transform: translateX(5px); }

  /* Info chips */
  .fb-post-chips { display: flex; flex-wrap: wrap; gap: 7px; padding: 10px 14px 7px; border-bottom: 1px solid var(--gray-light); }
  .fb-chip { display: inline-flex; align-items: center; gap: 5px; background: var(--gray-bg); padding: 5px 10px; border-radius: 20px; font-size: 0.78rem; font-weight: 800; color: var(--text-dark); }
  .fb-chip svg { font-size: 0.75rem; }
  .chip-orange { color: var(--orange); }
  .chip-green { color: var(--success); }
  .chip-gold { color: #f59e0b; }

  /* Reactions */
  .fb-post-reactions { padding: 8px 14px; display: flex; justify-content: space-between; align-items: center; font-size: 0.83rem; color: var(--text-mid); font-weight: 700; }
  .fb-react-row { display: flex; align-items: center; gap: 4px; }
  .fb-react-emojis span { font-size: 1.05rem; }

  /* Action buttons */
  .fb-post-actions { display: flex; border-top: 1px solid var(--gray-light); padding: 2px 6px; }
  .fb-act-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px;
    padding: 8px 4px; border-radius: 8px; cursor: pointer; font-size: 0.83rem; font-weight: 800;
    color: var(--text-mid); transition: var(--transition); border: none; background: transparent;
    font-family: 'Manrope', sans-serif; white-space: nowrap;
  }
  .fb-act-btn:hover { background: var(--gray-bg); color: var(--text-dark); }
  .fb-act-btn.cta {
    color: var(--white); background: var(--orange); border-radius: 8px;
    margin: 4px; flex: 1.2; font-weight: 900;
  }
  .fb-act-btn.cta:hover { background: #c0390e; transform: translateY(-1px); }
  .fb-act-btn svg { font-size: 0.95rem; }

  /* ══════════ RIGHT SIDEBAR ══════════ */
  .fb-right {
    grid-area: right; position: sticky; top: var(--topbar-h);
    height: calc(100vh - var(--topbar-h)); overflow-y: auto;
    padding: 16px 12px 24px; border-left: 1px solid var(--gray-light); background: var(--white);
  }
  .fb-right::-webkit-scrollbar { width: 3px; }
  .fb-right::-webkit-scrollbar-thumb { background: var(--gray-light); border-radius: 4px; }
  .fb-right-title { font-size: 1.05rem; font-weight: 900; color: var(--text-dark); margin-bottom: 10px; }
  .fb-right-divider { border: none; border-top: 1px solid var(--gray-light); margin: 14px 0; }
  .fb-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
  .fb-stat-card {
    background: var(--gray-bg); padding: 12px 10px; border-radius: 10px;
    border: 1px solid var(--gray-light); transition: var(--transition); cursor: pointer;
  }
  .fb-stat-card:hover { background: var(--gray-light); transform: translateY(-2px); box-shadow: var(--shadow); }
  .fb-stat-card-icon { font-size: 1.15rem; margin-bottom: 5px; }
  .fb-stat-card-val { font-size: 1.55rem; font-weight: 900; color: var(--navy); line-height: 1; }
  .fb-stat-card-lbl { font-size: 0.72rem; color: var(--text-mid); font-weight: 800; margin-top: 3px; text-transform: uppercase; letter-spacing: 0.3px; }
  .fb-ql { display: flex; align-items: center; gap: 10px; padding: 8px 8px; border-radius: 8px; text-decoration: none; color: var(--text-dark); font-size: 0.88rem; font-weight: 800; transition: var(--transition); margin-bottom: 2px; }
  .fb-ql:hover { background: var(--gray-bg); }
  .fb-ql-icon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; }
  .fb-ql-lbl { flex: 1; }
  .fb-ql-sub { font-size: 0.72rem; color: var(--text-mid); font-weight: 600; }
  .fb-listing-item { display: flex; align-items: center; gap: 10px; padding: 7px 8px; border-radius: 8px; cursor: pointer; transition: var(--transition); }
  .fb-listing-item:hover { background: var(--gray-bg); }
  .fb-listing-ava { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg, var(--navy), var(--blue)); display: flex; align-items: center; justify-content: center; color: white; font-size: 0.8rem; font-weight: 900; position: relative; }
  .fb-online-dot { position: absolute; bottom: 1px; right: 1px; width: 9px; height: 9px; background: var(--success); border-radius: 50%; border: 2px solid white; }
  .fb-listing-name { font-size: 0.85rem; font-weight: 800; color: var(--text-dark); line-height: 1.2; }
  .fb-listing-price { font-size: 0.73rem; color: var(--text-mid); font-weight: 700; }
  .fb-right-footer { font-size: 0.72rem; color: var(--text-mid); line-height: 1.9; padding: 0 8px; font-weight: 600; }
  .fb-right-footer a { color: var(--text-mid); text-decoration: none; }
  .fb-right-footer a:hover { text-decoration: underline; }

  /* ══════════ LOADING / EMPTY ══════════ */
  .fb-loading, .fb-empty { text-align: center; padding: 3rem 2rem; background: var(--white); border-radius: 12px; box-shadow: var(--shadow); margin-bottom: 16px; }
  .fb-spinner { width: 44px; height: 44px; border: 4px solid var(--gray-light); border-top-color: var(--orange); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fb-loading p, .fb-empty p { color: var(--text-mid); font-weight: 700; font-size: 0.9rem; }
  .fb-empty h3 { font-size: 1.1rem; font-weight: 900; margin-bottom: 6px; }
  .fb-empty-icon { font-size: 3rem; margin-bottom: 10px; }
  .fb-empty-btn { background: var(--orange); color: white; border: none; padding: 9px 20px; border-radius: 8px; cursor: pointer; font-weight: 900; font-size: 0.9rem; font-family: 'Manrope', sans-serif; transition: var(--transition); margin-top: 12px; }
  .fb-empty-btn:hover { opacity: 0.9; }
  .fb-pagination { margin: 16px 0 8px; }

  /* ══════════ MOBILE BOTTOM NAV ══════════ */
  .fb-bottom-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; width: 100%; z-index: 1000; background: var(--white); border-top: 1px solid var(--gray-light); padding: 6px 0 8px; box-shadow: 0 -2px 8px rgba(0,0,0,0.08); }
  .fb-bottom-nav-inner { display: flex; justify-content: space-around; align-items: center; width: 100%; max-width: 100%; }
  .fb-bottom-tab { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; color: var(--text-mid); font-size: 1.2rem; transition: var(--transition); padding: 4px 12px; border: none; background: transparent; position: relative; text-decoration: none; font-family: 'Manrope', sans-serif; }
  .fb-bottom-tab.active { color: var(--orange); }
  .fb-bottom-tab span.lbl { font-size: 0.62rem; font-weight: 800; }
  .fb-bottom-badge { position: absolute; top: 0; right: 8px; background: var(--danger); color: white; font-size: 0.58rem; font-weight: 900; padding: 1px 4px; border-radius: 8px; }

  /* ══════════ RESPONSIVE ══════════ */
  @media (min-width: 1400px) { .fb-center { max-width: 720px; } }

  @media (max-width: 1200px) {
    :root { --left-w: 240px; --right-w: 280px; }
  }

  @media (max-width: 1024px) {
    :root { --left-w: 72px; --right-w: 0px; }
    .fb-right { display: none; }
    .fb-page { grid-template-columns: var(--left-w) 1fr; grid-template-areas: "left center"; }
    .fb-sidebar-name, .fb-sidebar-role, .fb-sidebar-section { display: none; }
    .fb-sidebar-link span:not(.fb-sidebar-badge) { display: none; }
    .fb-sidebar-link { padding: 10px; justify-content: center; }
    .fb-sidebar-icon { margin: 0; }
    .fb-sidebar-profile { justify-content: center; }
    .fb-sidebar-profile .fb-sidebar-name { display: none; }
    .fb-center { max-width: 100%; }
    .fb-logo-text { display: block; }
  }

  /* ══════════ TABLET PORTRAIT ══════════ */
  @media (max-width: 768px) {
    :root {
      --left-w: 0px;
      --right-w: 0px;
      --topbar-h: 56px;
    }

    /* Full-width single column layout — NO overflow */
    html, body { overflow-x: hidden; width: 100%; }
    .fb-page {
      display: block !important;
      width: 100%;
      padding-top: var(--topbar-h);
    }

    /* Hide sidebars by default */
    .fb-left { display: none; }
    .fb-right { display: none; }

    /* Mobile sidebar drawer */
    .fb-left.mobile-open {
      display: flex !important; flex-direction: column;
      position: fixed; top: var(--topbar-h); left: 0;
      width: min(300px, 85vw);
      height: calc(100vh - var(--topbar-h));
      z-index: 999; box-shadow: var(--shadow-md);
      padding: 12px 8px 80px; overflow-y: auto;
      background: var(--white);
    }

    /* Overlay */
    .fb-left-overlay { display: block; }

    /* Show hamburger, hide center tabs */
    .fb-menu-btn { display: flex; }
    .fb-topbar-center { display: none; }

    /* Topbar: logo + search + right icons only — no overflow */
    .fb-topbar { padding: 0 10px; gap: 8px; }
    .fb-logo-text { display: block; font-size: 1rem; }
    .fb-search-form {
      flex: 1; max-width: none; min-width: 0;
      padding: 7px 10px;
    }
    /* Hide some topbar right icons on mobile to save space */
    .fb-icon-btn.hide-mobile { display: none; }

    /* Center feed: full width, proper padding, space for bottom nav */
    .fb-center {
      width: 100%;
      max-width: 100% !important;
      margin: 0 !important;
      padding: 12px 12px 90px !important;
    }

    /* Show bottom nav */
    .fb-bottom-nav { display: block; }

    /* Cards full width */
    .fb-post { width: 100%; border-radius: 10px; }
    .fb-compose { border-radius: 10px; }
    .fb-filters-box { border-radius: 10px; }
    .fb-results-bar { border-radius: 10px; }
    .fb-welcome { border-radius: 12px; }
  }

  /* ══════════ MOBILE PHONE ══════════ */
  @media (max-width: 480px) {
    html, body { overflow-x: hidden; width: 100%; font-size: 16px; }

    .fb-center { padding: 10px 10px 90px !important; }

    /* Welcome banner — bigger, bolder, white text */
    .fb-welcome { padding: 20px 16px; border-radius: 10px; }
    .fb-welcome h2 {
      font-size: 1.3rem !important;
      font-weight: 900 !important;
      color: #ffffff !important;
      line-height: 1.3;
    }
    .fb-welcome p {
      font-size: 0.92rem !important;
      font-weight: 700 !important;
      color: rgba(255,255,255,0.95) !important;
    }

    /* Topbar compact */
    .fb-topbar { padding: 0 8px; gap: 6px; }
    .fb-logo-text { font-size: 0.95rem; }
    .fb-search-form { padding: 7px 10px; }
    .fb-search-form input { font-size: 0.85rem; }
    /* Only show avatar on far right */
    .fb-topbar-right .fb-icon-btn { display: none; }
    .fb-topbar-right .fb-avatar-btn { display: flex; }

    /* Post card — bigger text */
    .fb-post { border-radius: 8px; margin-bottom: 12px; }
    .fb-post-owner {
      font-size: 1rem !important;
      font-weight: 900 !important;
      color: #050505 !important;
    }
    .fb-post-loc { font-size: 0.82rem !important; font-weight: 700 !important; }
    .fb-post-caption {
      font-size: 0.95rem !important;
      font-weight: 700 !important;
      line-height: 1.65 !important;
      color: #050505 !important;
    }
    .fb-post-caption strong {
      font-size: 1.05rem !important;
      font-weight: 900 !important;
    }

    /* Info chips — readable size */
    .fb-chip {
      font-size: 0.8rem !important;
      font-weight: 800 !important;
      padding: 5px 10px !important;
    }

    /* Reactions */
    .fb-post-reactions { font-size: 0.88rem !important; font-weight: 700 !important; }

    /* Action buttons — icons + CTA text only */
    .fb-post-actions { padding: 2px 4px; }
    .fb-act-btn {
      font-size: 0.82rem !important;
      font-weight: 800 !important;
      padding: 8px 4px;
    }
    .fb-act-btn > span { display: none; }
    .fb-act-btn.cta > span { display: inline !important; font-size: 0.85rem !important; }
    .fb-act-btn svg { font-size: 1rem !important; }

    /* View details bar */
    .fb-view-details-bar {
      font-size: 0.95rem !important;
      font-weight: 900 !important;
      padding: 12px 14px !important;
    }

    /* Images */
    .fb-post-img-grid2 img { height: 160px; }
    .fb-post-img-grid3 .img-main img { height: 240px; }
    .fb-post-img-grid3 .img-sub img { height: 119px; }
    .fb-post-img-more img { height: 119px !important; }

    /* Stories */
    .fb-story { width: 96px; height: 162px; }
    .fb-story-label { font-size: 0.8rem !important; font-weight: 900 !important; }

    /* Compose box */
    .fb-compose-input { font-size: 0.95rem !important; }
    .fb-compose-search-btn { font-size: 0.88rem !important; padding: 10px 14px; }
    .fb-compose-action { font-size: 0.85rem !important; font-weight: 800 !important; }

    /* Filters */
    .fb-filters-hd h3 { font-size: 1rem !important; }

    /* Results bar */
    .fb-results-count { font-size: 0.92rem !important; font-weight: 800 !important; }

    /* Bottom nav — full width, bigger labels */
    .fb-bottom-nav {
      left: 0 !important; right: 0 !important;
      width: 100% !important;
      padding: 8px 0 10px;
    }
    .fb-bottom-nav-inner { width: 100%; }
    .fb-bottom-tab { flex: 1; padding: 4px 8px; }
    .fb-bottom-tab svg { font-size: 1.35rem !important; }
    .fb-bottom-tab .lbl { font-size: 0.68rem !important; font-weight: 800 !important; }

    /* Badges */
    .fb-badge { font-size: 0.76rem !important; font-weight: 900 !important; padding: 4px 10px !important; }
  }

  /* ══════════ VERY SMALL SCREENS (360px) ══════════ */
  @media (max-width: 360px) {
    .fb-center { padding: 8px 8px 88px !important; }
    .fb-welcome h2 { font-size: 1.15rem !important; }
    .fb-logo-text { display: none; }
    .fb-story { width: 84px; height: 148px; }
    .fb-chip { font-size: 0.75rem !important; padding: 4px 8px !important; }
    .fb-post-owner { font-size: 0.95rem !important; }
  }
`;

// Real SVG-based HostelLink Logo
const HostelLinkLogo = () => (
  <div className="fb-logo-icon">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 3L21 10.5V21C21 21.55 20.55 22 20 22H15V16H9V22H4C3.45 22 3 21.55 3 21V10.5Z" fill="white"/>
      <circle cx="12" cy="12" r="2" fill="rgba(232,80,26,0.85)"/>
    </svg>
  </div>
);

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { hostels, loading, filters, pagination, fetchHostels, updateFilters, resetFilters, changePage } = useHostel();

  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Ensure viewport meta is correct for mobile
  useEffect(() => {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  }, []);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (user?.role !== 'student') { navigate('/landlord-dashboard'); return; }
    fetchHostels();
  }, [isAuthenticated, user, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({ ...filters, search: searchInput, page: 1 });
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  if (!isAuthenticated) return null;

  const initials = ((user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')).toUpperCase() || 'HL';

  const stats = [
    { label: 'Bookings', value: '3', icon: '📋', color: '#e8501a', bg: 'rgba(232,80,26,0.1)', link: '/bookings' },
    { label: 'Messages', value: '12', icon: '💬', color: '#1a3fa4', bg: 'rgba(26,63,164,0.1)', link: '/messages' },
    { label: 'Saved', value: '8', icon: '❤️', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', link: '/favorites' },
    { label: 'Hostels', value: pagination?.total || hostels.length, icon: '🏠', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  ];

  const sidebarLinks = [
    { icon: <FaHome />, label: 'Browse Hostels', link: '/hostels', color: '#e8501a', bg: 'rgba(232,80,26,0.1)' },
    { icon: <FaBookmark />, label: 'My Bookings', link: '/bookings', color: '#1a3fa4', bg: 'rgba(26,63,164,0.1)' },
    { icon: <FaHeart />, label: 'Saved Hostels', link: '/favorites', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    { icon: <FaEnvelope />, label: 'Messages', link: '/messages', color: '#1a3fa4', bg: 'rgba(26,63,164,0.1)', badge: 12 },
    { icon: <FaBell />, label: 'Notifications', link: '/notifications', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', badge: 3 },
    { icon: <FaVideo />, label: 'Hostel Videos', link: '/videos', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { icon: <FaCog />, label: 'Settings', link: '/profile', color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
  ];

  const quickLinks = [
    { icon: <FaBookmark />, label: 'My Bookings', sub: 'View reservations', link: '/bookings', color: '#e8501a', bg: 'rgba(232,80,26,0.1)' },
    { icon: <FaHeart />, label: 'Saved Hostels', sub: '8 saved', link: '/favorites', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    { icon: <FaEnvelope />, label: 'Messages', sub: '12 unread', link: '/messages', color: '#1a3fa4', bg: 'rgba(26,63,164,0.1)' },
    { icon: <FaVideo />, label: 'Hostel Videos', sub: 'Watch tours', link: '/videos', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  ];

  const renderImages = (hostel) => {
    const images = hostel.images || [];
    const badges = (
      <div className="fb-img-badges">
        {hostel.verified && <span className="fb-badge fb-badge-verified">✓ Verified</span>}
        <span className="fb-badge fb-badge-price">MK {hostel.price?.toLocaleString()}/mo</span>
        {hostel.availableRooms > 0 && <span className="fb-badge fb-badge-rooms">{hostel.availableRooms} free</span>}
      </div>
    );

    if (images.length === 0) return (
      <div className="fb-post-no-img" style={{ position: 'relative' }}>
        <span style={{ fontSize: '2.5rem' }}>🏠</span>
        <span>No photos uploaded yet</span>
        {badges}
      </div>
    );
    if (images.length === 1) return (
      <div className="fb-post-img-single" style={{ position: 'relative' }}>
        <img src={images[0]} alt={hostel.name} />
        {badges}
      </div>
    );
    if (images.length === 2) return (
      <div style={{ position: 'relative' }}>
        <div className="fb-post-img-grid2">
          {images.slice(0, 2).map((img, i) => <img key={i} src={img} alt={hostel.name} />)}
        </div>
        {badges}
      </div>
    );
    return (
      <div style={{ position: 'relative' }}>
        <div className="fb-post-img-grid3">
          <div className="img-main"><img src={images[0]} alt={hostel.name} /></div>
          <div className="img-sub"><img src={images[1]} alt={hostel.name} /></div>
          {images.length > 3 ? (
            <div className="img-sub fb-post-img-more">
              <img src={images[2]} alt="" />
              <div className="fb-post-img-more-lbl">+{images.length - 2}</div>
            </div>
          ) : (
            <div className="img-sub"><img src={images[2]} alt={hostel.name} /></div>
          )}
        </div>
        {badges}
      </div>
    );
  };

  const renderPost = (hostel) => {
    const ownerName = hostel.owner
      ? `${hostel.owner.firstName || ''} ${hostel.owner.lastName || ''}`.trim() || 'HostelLink Owner'
      : 'HostelLink Owner';
    const ownerInitial = hostel.owner?.firstName?.[0]?.toUpperCase() || 'H';
    const rating = (hostel.averageRating || 4.5).toFixed(1);

    return (
      <div key={hostel._id} className="fb-post">
        <div className="fb-post-hd">
          <div className="fb-post-ava">{ownerInitial}</div>
          <div className="fb-post-meta">
            <div className="fb-post-owner">{ownerName}</div>
            <div className="fb-post-loc">
              <FaMapMarkerAlt /> {hostel.address} &nbsp;·&nbsp; 🌐 Public
            </div>
          </div>
          <button className="fb-post-more-btn"><FaEllipsisH /></button>
        </div>

        <div className="fb-post-caption">
          <strong>{hostel.name}</strong>
          {hostel.description
            ? hostel.description.length > 110
              ? hostel.description.slice(0, 110) + '…'
              : hostel.description
            : 'Quality student accommodation near campus.'}
        </div>

        <div className="fb-post-imgs">{renderImages(hostel)}</div>

        {/* ✅ VIEW DETAILS BAR — clearly below the image */}
        <button className="fb-view-details-bar" onClick={() => navigate(`/hostels/${hostel._id}`)}>
          View Details &nbsp;<FaArrowRight />
        </button>

        <div className="fb-post-chips">
          <span className="fb-chip"><FaHome className="chip-orange" /> {hostel.type}</span>
          <span className="fb-chip"><span>👥</span> {hostel.gender}</span>
          <span className="fb-chip"><FaCheckCircle className="chip-green" /> <span style={{ color: 'var(--success)', fontWeight: 900 }}>{hostel.availableRooms}</span>/{hostel.totalRooms}</span>
          <span className="fb-chip"><FaStar className="chip-gold" /> {rating}</span>
          {hostel.contactPhone && <span className="fb-chip"><FaPhone className="chip-orange" /> {hostel.contactPhone}</span>}
        </div>

        <div className="fb-post-reactions">
          <div className="fb-react-row">
            <div className="fb-react-emojis">
              <span>👍</span><span>❤️</span><span>😍</span>
            </div>
            <span style={{ marginLeft: 4 }}>{(hostel.viewCount || 0) + 15}</span>
          </div>
          <span>{hostel.viewCount || 0} views</span>
        </div>

        <div className="fb-post-actions">
          <button className="fb-act-btn"><FaThumbsUp /><span>Interested</span></button>
          <button className="fb-act-btn" onClick={() => navigate(`/messages?to=${hostel.owner?._id}`)}><FaComment /><span>Message</span></button>
          <button className="fb-act-btn" onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/hostels/${hostel._id}`); toast.success('Link copied!'); }}><FaShare /><span>Share</span></button>
          <button className="fb-act-btn cta" onClick={() => navigate(`/hostels/${hostel._id}`)}>View Details <FaArrowRight /></button>
        </div>
      </div>
    );
  };

  const SidebarContent = () => (
    <>
      <Link to="/profile" className="fb-sidebar-profile" onClick={() => setMobileMenuOpen(false)}>
        <div className="fb-sidebar-avatar">{initials}</div>
        <div>
          <div className="fb-sidebar-name">{user?.firstName} {user?.lastName}</div>
          <div className="fb-sidebar-role">Student · MUBAS</div>
        </div>
      </Link>
      <hr className="fb-sidebar-divider" />
      {sidebarLinks.map((item, i) => (
        <Link key={i} to={item.link} className="fb-sidebar-link" onClick={() => setMobileMenuOpen(false)}>
          <div className="fb-sidebar-icon" style={{ background: item.bg, color: item.color }}>{item.icon}</div>
          <span>{item.label}</span>
          {item.badge && <span className="fb-sidebar-badge">{item.badge}</span>}
        </Link>
      ))}
      <hr className="fb-sidebar-divider" />
      <div className="fb-sidebar-section">Your Stats</div>
      {stats.map((s, i) => (
        <div key={i} className="fb-sidebar-link" style={{ cursor: 'default' }}>
          <div className="fb-sidebar-icon" style={{ background: s.bg, fontSize: '1rem' }}>{s.icon}</div>
          <span>{s.label}: <strong>{s.value}</strong></span>
        </div>
      ))}
      <hr className="fb-sidebar-divider" />
      <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="fb-sidebar-link danger">
        <div className="fb-sidebar-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}><FaSignOutAlt /></div>
        <span>Logout</span>
      </button>
    </>
  );

  const featuredHostels = hostels.slice(0, 5);

  return (
    <>
      <style>{styles}</style>

      {/* TOPBAR */}
      <nav className="fb-topbar">
        <button className="fb-menu-btn" onClick={() => setMobileMenuOpen(o => !o)}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <Link to="/" className="fb-logo">
          <HostelLinkLogo />
          <span className="fb-logo-text">HostelLink</span>
        </Link>
        <form onSubmit={handleSearch} className="fb-search-form">
          <FaSearch />
          <input type="text" placeholder="Search hostels..." value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        </form>
        <div className="fb-topbar-center">
          {[
            { icon: <FaHome />, key: 'home' },
            { icon: <FaVideo />, key: 'videos', link: '/videos' },
            { icon: <FaBookmark />, key: 'bookings', link: '/bookings' },
            { icon: <FaUserFriends />, key: 'messages', link: '/messages', badge: 12 },
            { icon: <FaBell />, key: 'notifications', link: '/notifications', badge: 3 },
          ].map(tab => tab.link ? (
            <Link key={tab.key} to={tab.link} className={`fb-nav-tab${activeTab === tab.key ? ' active' : ''}`} onClick={() => setActiveTab(tab.key)}>
              {tab.icon}
              {tab.badge && <span className="fb-nav-badge">{tab.badge}</span>}
            </Link>
          ) : (
            <button key={tab.key} className={`fb-nav-tab${activeTab === tab.key ? ' active' : ''}`} onClick={() => setActiveTab(tab.key)}>
              {tab.icon}
            </button>
          ))}
        </div>
        <div className="fb-topbar-right">
          <Link to="/profile" className="fb-icon-btn"><FaUser /></Link>
          <Link to="/messages" className="fb-icon-btn"><FaEnvelope /><span className="dot" /></Link>
          <Link to="/notifications" className="fb-icon-btn"><FaBell /><span className="dot" /></Link>
          <button className="fb-avatar-btn" onClick={handleLogout} title="Logout">{initials}</button>
        </div>
      </nav>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && <div className="fb-left-overlay" onClick={() => setMobileMenuOpen(false)} />}

      {/* PAGE */}
      <div className="fb-page">

        {/* LEFT */}
        <aside className={`fb-left${mobileMenuOpen ? ' mobile-open' : ''}`}>
          <SidebarContent />
        </aside>

        {/* CENTER */}
        <main className="fb-center">
          <div className="fb-welcome">
            <h2>Welcome back, {user?.firstName}! 👋</h2>
            <p>Discover your perfect student hostel near MUBAS campus</p>
          </div>

          {/* Stories */}
          {featuredHostels.length > 0 && (
            <div className="fb-stories">
              <div className="fb-story fb-story-add" onClick={() => navigate('/bookings')}>
                <div style={{ flex: 1 }} />
                <div className="fb-story-add-ring">+</div>
                <span>My Bookings</span>
                <div style={{ height: 14 }} />
              </div>
              {featuredHostels.map(h => (
                <div key={h._id} className="fb-story" onClick={() => navigate(`/hostels/${h._id}`)}>
                  {h.images?.[0] && <img src={h.images[0]} alt={h.name} />}
                  <div className="fb-story-grad" />
                  <div className="fb-story-ava">{h.owner?.firstName?.[0]?.toUpperCase() || 'H'}</div>
                  <div className="fb-story-label">
                    {h.name}
                    <div className="fb-story-price">MK {h.price?.toLocaleString()}/mo</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Compose */}
          <div className="fb-compose">
            <div className="fb-compose-row">
              <div className="fb-avatar-btn" style={{ cursor: 'default', fontSize: '0.8rem', border: 'none' }}>{initials}</div>
              <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', gap: 8 }}>
                <input className="fb-compose-input" placeholder="Search hostels by name or location..." value={searchInput} onChange={e => setSearchInput(e.target.value)} />
                <button type="submit" className="fb-compose-search-btn">Search</button>
              </form>
            </div>
            <div className="fb-compose-divider" />
            <div className="fb-compose-actions">
              <button className="fb-compose-action" onClick={() => navigate('/videos')} style={{ color: '#f02849' }}>
                <FaVideo style={{ color: '#f02849' }} /> <span>Videos</span>
              </button>
              <button className="fb-compose-action" onClick={() => setShowFilters(s => !s)} style={{ color: '#45bd62' }}>
                <FaImages style={{ color: '#45bd62' }} /> <span>Filter</span>
              </button>
              <button className="fb-compose-action" onClick={() => navigate('/bookings')} style={{ color: '#f7b928' }}>
                <FaBookmark style={{ color: '#f7b928' }} /> <span>Bookings</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="fb-filters-box">
            <div className="fb-filters-hd" onClick={() => setShowFilters(s => !s)}>
              <h3><FaFilter /> Filter Hostels</h3>
              <button className="fb-filter-toggle">
                {showFilters ? 'Hide' : 'Show'} {showFilters ? <FaChevronDown /> : <FaChevronRight />}
              </button>
            </div>
            {showFilters && (
              <div style={{ marginTop: 12 }}>
                <HostelFilters filters={filters} onFilterChange={updateFilters} onReset={resetFilters} />
              </div>
            )}
          </div>

          {!loading && hostels.length > 0 && (
            <div className="fb-results-bar">
              <div className="fb-results-count"><FaHome /> {hostels.length} of {pagination?.total || hostels.length} hostels</div>
              <span className="fb-results-page">Page {pagination?.page || 1} of {pagination?.totalPages || 1}</span>
            </div>
          )}

          {loading ? (
            <div className="fb-loading"><div className="fb-spinner" /><p>Loading hostels...</p></div>
          ) : hostels.length === 0 ? (
            <div className="fb-empty">
              <div className="fb-empty-icon">🏠</div>
              <h3>No hostels found</h3>
              <p>Try adjusting your filters or search term</p>
              <button className="fb-empty-btn" onClick={resetFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              {hostels.map(h => renderPost(h))}
              {pagination?.totalPages > 1 && (
                <div className="fb-pagination">
                  <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={page => { changePage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
                </div>
              )}
            </>
          )}
        </main>

        {/* RIGHT */}
        <aside className="fb-right">
          <div className="fb-right-title">Your Overview</div>
          <div className="fb-stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="fb-stat-card" onClick={() => s.link && navigate(s.link)}>
                <div className="fb-stat-card-icon">{s.icon}</div>
                <div className="fb-stat-card-val" style={{ color: s.color }}>{s.value}</div>
                <div className="fb-stat-card-lbl">{s.label}</div>
              </div>
            ))}
          </div>
          <hr className="fb-right-divider" />
          <div className="fb-right-title">Quick Access</div>
          {quickLinks.map((ql, i) => (
            <Link key={i} to={ql.link} className="fb-ql">
              <div className="fb-ql-icon" style={{ background: ql.bg, color: ql.color }}>{ql.icon}</div>
              <div className="fb-ql-lbl">
                <div>{ql.label}</div>
                <div className="fb-ql-sub">{ql.sub}</div>
              </div>
            </Link>
          ))}
          <hr className="fb-right-divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div className="fb-right-title" style={{ marginBottom: 0 }}>Active Listings</div>
            <FaSearch style={{ color: 'var(--text-mid)', cursor: 'pointer', fontSize: '0.85rem' }} />
          </div>
          {hostels.slice(0, 7).map(h => (
            <div key={h._id} className="fb-listing-item" onClick={() => navigate(`/hostels/${h._id}`)}>
              <div className="fb-listing-ava">
                {h.owner?.firstName?.[0]?.toUpperCase() || 'H'}
                {h.availableRooms > 0 && <div className="fb-online-dot" />}
              </div>
              <div>
                <div className="fb-listing-name">{h.name}</div>
                <div className="fb-listing-price">MK {h.price?.toLocaleString()}/mo · {h.availableRooms} free</div>
              </div>
            </div>
          ))}
          <hr className="fb-right-divider" />
          <div className="fb-right-footer">
            <a href="/about">About</a> · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · <a href="/help">Help</a><br />
            © {new Date().getFullYear()} HostelLink MUBAS
          </div>
        </aside>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fb-bottom-nav">
        <div className="fb-bottom-nav-inner">
          {[
            { icon: <FaHome />, label: 'Home', key: 'home', action: () => setActiveTab('home') },
            { icon: <FaVideo />, label: 'Videos', key: 'videos', action: () => navigate('/videos') },
            { icon: <FaBookmark />, label: 'Bookings', key: 'bookings', action: () => navigate('/bookings') },
            { icon: <FaEnvelope />, label: 'Messages', key: 'messages', action: () => navigate('/messages'), badge: 12 },
            { icon: <FaUser />, label: 'Profile', key: 'profile', action: () => navigate('/profile') },
          ].map(tab => (
            <button key={tab.key} className={`fb-bottom-tab${activeTab === tab.key ? ' active' : ''}`} onClick={tab.action}>
              {tab.icon}
              <span className="lbl">{tab.label}</span>
              {tab.badge && <span className="fb-bottom-badge">{tab.badge}</span>}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default StudentDashboard;
