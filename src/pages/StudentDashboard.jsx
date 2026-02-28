import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHostel } from '../context/HostelContext';
import { useAuth } from '../context/AuthContext';
import {
  FaUser,
  FaHome,
  FaBookmark,
  FaEnvelope,
  FaHeart,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaArrowRight,
  FaChartLine,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaStar,
  FaPhone,
  FaFilter,
  FaSearch,
  FaVideo,
  FaThumbsUp,
  FaComment,
  FaShare,
  FaEllipsisH,
  FaPlay,
  FaTimes,
  FaImages,
  FaUserFriends,
  FaStore,
  FaNewspaper,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import HostelFilters from '../components/hostel/HostelFilters';
import Pagination from '../components/common/Pagination';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0d1b3e;
    --blue: #1a3fa4;
    --fb-blue: #1877f2;
    --orange: #e8501a;
    --white: #ffffff;
    --gray-bg: #f0f2f5;
    --gray-light: #e4e6eb;
    --gray-hover: #e4e6eb;
    --text-dark: #050505;
    --text-mid: #65676b;
    --success: #10b981;
    --radius: 8px;
    --transition: all 0.2s ease;
    --shadow: 0 1px 2px rgba(0,0,0,0.1);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.12);
  }

  body { font-family: 'Manrope', sans-serif; background: var(--gray-bg); color: var(--text-dark); }

  /* ====== TOPBAR (Facebook-style) ====== */
  .fb-topbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
    background: var(--white); box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    height: 56px; display: flex; align-items: center;
    padding: 0 1rem; gap: 0.5rem;
  }

  .fb-topbar-left {
    display: flex; align-items: center; gap: 0.5rem; min-width: 240px;
  }

  .fb-logo {
    font-size: 1.55rem; font-weight: 900; color: var(--orange);
    text-decoration: none; line-height: 1; letter-spacing: -1px;
    display: flex; align-items: center; gap: 0.3rem;
  }

  .fb-search-wrap {
    display: flex; align-items: center; gap: 0.5rem;
    background: var(--gray-bg); padding: 0.5rem 1rem;
    border-radius: 20px; min-width: 200px;
  }
  .fb-search-wrap svg { color: var(--text-mid); flex-shrink: 0; }
  .fb-search-wrap input {
    border: none; background: transparent; outline: none;
    font-family: 'Manrope', sans-serif; font-size: 0.9rem; width: 100%;
  }

  /* CENTER NAV TABS */
  .fb-topbar-center {
    flex: 1; display: flex; justify-content: center; gap: 0.25rem;
  }

  .fb-nav-tab {
    display: flex; align-items: center; justify-content: center;
    width: 110px; height: 48px; border-radius: 8px;
    cursor: pointer; color: var(--text-mid); font-size: 1.4rem;
    transition: var(--transition); position: relative; border: none;
    background: transparent; text-decoration: none;
  }
  .fb-nav-tab:hover { background: var(--gray-bg); color: var(--fb-blue); }
  .fb-nav-tab.active { color: var(--orange); }
  .fb-nav-tab.active::after {
    content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
    height: 3px; background: var(--orange); border-radius: 2px;
  }
  .fb-nav-badge {
    position: absolute; top: 6px; right: 18px;
    background: #e41e3f; color: white; font-size: 0.65rem;
    font-weight: 800; padding: 1px 5px; border-radius: 10px; min-width: 16px;
    text-align: center;
  }

  /* RIGHT ICONS */
  .fb-topbar-right {
    display: flex; align-items: center; gap: 0.5rem; min-width: 220px; justify-content: flex-end;
  }

  .fb-icon-btn {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--gray-bg); display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-dark); font-size: 1rem; border: none;
    transition: var(--transition); text-decoration: none; position: relative;
  }
  .fb-icon-btn:hover { background: var(--gray-light); }
  .fb-icon-btn .notif-dot {
    position: absolute; top: 2px; right: 2px; width: 10px; height: 10px;
    background: #e41e3f; border-radius: 50%; border: 2px solid white;
  }

  .fb-user-avatar-sm {
    width: 40px; height: 40px; border-radius: 50%;
    background: linear-gradient(135deg, var(--navy), var(--blue));
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 1rem; font-weight: 800; cursor: pointer;
    border: none; transition: var(--transition); overflow: hidden;
    flex-shrink: 0;
  }
  .fb-user-avatar-sm:hover { opacity: 0.85; }

  /* ====== THREE-COLUMN LAYOUT ====== */
  .fb-layout {
    display: grid;
    grid-template-columns: 280px 1fr 340px;
    gap: 0; max-width: 1500px; margin: 0 auto;
    padding-top: 56px;
  }

  /* ====== LEFT SIDEBAR ====== */
  .fb-left {
    position: fixed; top: 56px; left: 0;
    width: 280px; height: calc(100vh - 56px);
    overflow-y: auto; padding: 1rem 0.5rem;
    background: var(--white);
    border-right: 1px solid var(--gray-light);
  }
  .fb-left::-webkit-scrollbar { width: 4px; }
  .fb-left::-webkit-scrollbar-thumb { background: var(--gray-light); border-radius: 4px; }

  .fb-sidebar-user {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.6rem 0.75rem; border-radius: 8px;
    cursor: pointer; transition: var(--transition);
    text-decoration: none; color: var(--text-dark);
    margin-bottom: 0.5rem;
  }
  .fb-sidebar-user:hover { background: var(--gray-bg); }

  .fb-sidebar-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--navy), var(--blue));
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 0.9rem; font-weight: 800; flex-shrink: 0;
  }

  .fb-sidebar-username { font-weight: 700; font-size: 0.95rem; }

  .fb-sidebar-item {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.65rem 0.75rem; border-radius: 8px;
    cursor: pointer; transition: var(--transition);
    text-decoration: none; color: var(--text-dark);
    font-size: 0.92rem; font-weight: 600;
  }
  .fb-sidebar-item:hover { background: var(--gray-bg); }
  .fb-sidebar-item.active { background: rgba(232,80,26,0.08); color: var(--orange); }

  .fb-sidebar-icon {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; flex-shrink: 0;
  }

  .fb-sidebar-badge {
    margin-left: auto; background: #e41e3f; color: white;
    font-size: 0.7rem; font-weight: 800; padding: 2px 7px;
    border-radius: 10px; min-width: 20px; text-align: center;
  }

  .fb-sidebar-divider {
    border: none; border-top: 1px solid var(--gray-light);
    margin: 0.75rem 0.75rem;
  }

  .fb-sidebar-section-title {
    font-size: 0.8rem; color: var(--text-mid); font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.5px;
    padding: 0.5rem 0.75rem;
  }

  /* ====== CENTER FEED ====== */
  .fb-center {
    margin-left: 280px;
    margin-right: 340px;
    padding: 1.5rem 1rem;
    min-height: calc(100vh - 56px);
  }

  /* CREATE POST BOX */
  .fb-create-post {
    background: var(--white); border-radius: 10px;
    padding: 0.75rem 1rem; box-shadow: var(--shadow);
    margin-bottom: 1.25rem;
  }
  .fb-create-top {
    display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;
  }
  .fb-create-input {
    flex: 1; background: var(--gray-bg); border: none; border-radius: 20px;
    padding: 0.65rem 1rem; font-family: 'Manrope', sans-serif;
    font-size: 0.95rem; color: var(--text-mid); cursor: pointer;
    outline: none; transition: var(--transition);
  }
  .fb-create-input:hover { background: #e4e6eb; }
  .fb-create-divider { border: none; border-top: 1px solid var(--gray-light); margin: 0.25rem 0 0.5rem; }
  .fb-create-actions {
    display: flex; gap: 0;
  }
  .fb-create-action {
    flex: 1; display: flex; align-items: center; justify-content: center;
    gap: 0.4rem; padding: 0.5rem; border-radius: 8px; cursor: pointer;
    font-size: 0.85rem; font-weight: 700; color: var(--text-mid);
    transition: var(--transition); border: none; background: transparent;
    font-family: 'Manrope', sans-serif;
  }
  .fb-create-action:hover { background: var(--gray-bg); }
  .fb-create-action svg { font-size: 1.1rem; }

  /* HOSTEL CARD AS POST (Facebook-style) */
  .fb-post-card {
    background: var(--white); border-radius: 10px;
    box-shadow: var(--shadow); margin-bottom: 1.25rem;
    overflow: hidden; transition: var(--transition);
  }
  .fb-post-card:hover { box-shadow: var(--shadow-md); }

  .fb-post-header {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.9rem 1rem 0.6rem;
  }
  .fb-post-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    background: linear-gradient(135deg, var(--navy), var(--blue));
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 1rem; font-weight: 800; flex-shrink: 0;
    overflow: hidden;
  }
  .fb-post-meta { flex: 1; }
  .fb-post-owner-name { font-weight: 800; font-size: 0.95rem; color: var(--text-dark); }
  .fb-post-subtitle {
    font-size: 0.78rem; color: var(--text-mid);
    display: flex; align-items: center; gap: 0.3rem;
  }
  .fb-post-more {
    width: 36px; height: 36px; border-radius: 50%;
    background: transparent; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--text-mid); font-size: 1.1rem; transition: var(--transition);
  }
  .fb-post-more:hover { background: var(--gray-bg); }

  .fb-post-caption {
    padding: 0 1rem 0.75rem; font-size: 0.95rem;
    color: var(--text-dark); line-height: 1.5;
  }
  .fb-post-caption strong { color: var(--orange); }

  .fb-post-image-wrap {
    width: 100%; position: relative; overflow: hidden;
    background: #111; max-height: 460px;
  }
  .fb-post-image {
    width: 100%; max-height: 460px; object-fit: cover; display: block;
    transition: var(--transition);
  }
  .fb-post-image:hover { transform: scale(1.01); }
  .fb-post-no-image {
    width: 100%; height: 220px;
    background: linear-gradient(135deg, var(--navy) 0%, var(--blue) 100%);
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 3rem; flex-direction: column; gap: 0.5rem;
  }
  .fb-post-no-image span { font-size: 0.9rem; opacity: 0.7; }

  /* IMAGE GALLERY (multi-image grid) */
  .fb-post-image-grid-2 {
    display: grid; grid-template-columns: 1fr 1fr; gap: 2px;
    max-height: 300px;
  }
  .fb-post-image-grid-2 img { width: 100%; height: 150px; object-fit: cover; display: block; }

  .fb-post-image-grid-3 {
    display: grid; grid-template-columns: 1fr 1fr; gap: 2px;
    max-height: 300px;
  }
  .fb-post-image-grid-3 img:first-child { grid-row: span 2; height: 300px; object-fit: cover; width: 100%; }
  .fb-post-image-grid-3 img:not(:first-child) { height: 148px; object-fit: cover; width: 100%; }

  .fb-post-image-more {
    position: relative; overflow: hidden;
  }
  .fb-post-image-more img { width: 100%; height: 148px; object-fit: cover; display: block; }
  .fb-post-image-more-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 1.5rem; font-weight: 800;
  }

  /* VERIFIED + PRICE BADGE over image */
  .fb-post-image-badges {
    position: absolute; top: 10px; left: 10px; display: flex; gap: 0.4rem; flex-wrap: wrap;
  }
  .fb-badge {
    padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 800;
    backdrop-filter: blur(4px);
  }
  .fb-badge-verified { background: rgba(16,185,129,0.9); color: white; }
  .fb-badge-price { background: rgba(232,80,26,0.92); color: white; font-size: 0.82rem; }
  .fb-badge-rooms { background: rgba(13,27,62,0.85); color: white; }

  /* POST INFO ROW */
  .fb-post-info {
    display: flex; flex-wrap: wrap; gap: 1rem;
    padding: 0.75rem 1rem 0.5rem;
    border-bottom: 1px solid var(--gray-light);
  }
  .fb-post-info-item {
    display: flex; align-items: center; gap: 0.35rem;
    font-size: 0.82rem; color: var(--text-mid); font-weight: 600;
  }
  .fb-post-info-item svg { color: var(--orange); }
  .fb-post-info-item strong { color: var(--text-dark); }

  /* REACTION ROW */
  .fb-post-reaction-summary {
    padding: 0.4rem 1rem; display: flex; justify-content: space-between;
    align-items: center; font-size: 0.85rem; color: var(--text-mid);
  }
  .fb-reaction-icons { display: flex; gap: 0.15rem; }
  .fb-reaction-emoji { font-size: 1rem; }

  /* ACTION BUTTONS */
  .fb-post-actions {
    display: flex; border-top: 1px solid var(--gray-light);
    padding: 0.25rem 0.5rem;
  }
  .fb-post-action {
    flex: 1; display: flex; align-items: center; justify-content: center;
    gap: 0.4rem; padding: 0.5rem; border-radius: 6px;
    cursor: pointer; font-size: 0.88rem; font-weight: 700;
    color: var(--text-mid); transition: var(--transition);
    border: none; background: transparent; font-family: 'Manrope', sans-serif;
  }
  .fb-post-action:hover { background: var(--gray-bg); color: var(--text-dark); }
  .fb-post-action.primary { color: var(--orange); }
  .fb-post-action.primary:hover { background: rgba(232,80,26,0.08); }

  /* ====== RIGHT SIDEBAR ====== */
  .fb-right {
    position: fixed; top: 56px; right: 0;
    width: 340px; height: calc(100vh - 56px);
    overflow-y: auto; padding: 1.25rem 1rem;
    background: var(--white);
    border-left: 1px solid var(--gray-light);
  }
  .fb-right::-webkit-scrollbar { width: 4px; }
  .fb-right::-webkit-scrollbar-thumb { background: var(--gray-light); border-radius: 4px; }

  .fb-right-section { margin-bottom: 1.5rem; }
  .fb-right-title {
    font-size: 1.1rem; font-weight: 800; color: var(--text-dark);
    margin-bottom: 0.75rem;
  }

  /* STATS CARDS (right panel) */
  .fb-stat-row {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
  .fb-stat-box {
    background: var(--gray-bg); padding: 1rem; border-radius: 10px;
    border: 1px solid var(--gray-light); transition: var(--transition);
  }
  .fb-stat-box:hover { background: var(--gray-light); transform: translateY(-2px); }
  .fb-stat-box-icon { font-size: 1.2rem; color: var(--orange); margin-bottom: 0.4rem; }
  .fb-stat-box-value { font-size: 1.6rem; font-weight: 800; color: var(--navy); }
  .fb-stat-box-label { font-size: 0.75rem; color: var(--text-mid); font-weight: 600; }

  /* QUICK ACTIONS (right panel) */
  .fb-quick-link {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.6rem 0.75rem; border-radius: 8px;
    cursor: pointer; transition: var(--transition);
    text-decoration: none; color: var(--text-dark);
    font-size: 0.9rem; font-weight: 600; margin-bottom: 0.1rem;
  }
  .fb-quick-link:hover { background: var(--gray-bg); }
  .fb-quick-icon {
    width: 36px; height: 36px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; flex-shrink: 0;
  }

  /* CONTACTS / ACTIVE USERS */
  .fb-contact {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.5rem 0.75rem; border-radius: 8px;
    cursor: pointer; transition: var(--transition); position: relative;
  }
  .fb-contact:hover { background: var(--gray-bg); }
  .fb-contact-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--navy), var(--blue));
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 0.85rem; font-weight: 800; position: relative;
  }
  .fb-contact-online {
    position: absolute; bottom: 0; right: 0;
    width: 10px; height: 10px; background: var(--success);
    border-radius: 50%; border: 2px solid white;
  }
  .fb-contact-name { font-size: 0.9rem; font-weight: 600; }

  /* FILTERS MODAL SECTION */
  .fb-filters-wrap {
    background: var(--white); border-radius: 10px;
    padding: 1rem; box-shadow: var(--shadow); margin-bottom: 1.25rem;
  }
  .fb-filters-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 0.75rem; cursor: pointer;
  }
  .fb-filters-header h3 { font-size: 1rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; }
  .fb-filters-toggle {
    background: var(--gray-bg); border: none; border-radius: 6px;
    padding: 0.3rem 0.75rem; cursor: pointer; font-weight: 700; font-size: 0.8rem;
    font-family: 'Manrope', sans-serif; transition: var(--transition);
  }
  .fb-filters-toggle:hover { background: var(--gray-light); }

  /* LOADING */
  .fb-loading {
    text-align: center; padding: 3rem 2rem;
    background: var(--white); border-radius: 10px;
    box-shadow: var(--shadow);
  }
  .fb-spinner {
    width: 44px; height: 44px; border: 4px solid var(--gray-light);
    border-top-color: var(--orange); border-radius: 50%;
    animation: spin 0.8s linear infinite; margin: 0 auto 1rem;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* EMPTY STATE */
  .fb-empty {
    text-align: center; padding: 3rem 2rem;
    background: var(--white); border-radius: 10px; box-shadow: var(--shadow);
  }
  .fb-empty-icon { font-size: 3rem; margin-bottom: 1rem; }
  .fb-empty h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.4rem; }
  .fb-empty p { color: var(--text-mid); margin-bottom: 1rem; }
  .fb-empty-btn {
    background: var(--orange); color: white; border: none;
    padding: 0.6rem 1.4rem; border-radius: 6px; cursor: pointer;
    font-weight: 700; font-size: 0.9rem; font-family: 'Manrope', sans-serif;
    transition: var(--transition);
  }
  .fb-empty-btn:hover { opacity: 0.9; }

  /* RESULTS BAR */
  .fb-results-bar {
    background: var(--white); border-radius: 10px; padding: 0.75rem 1rem;
    margin-bottom: 1.25rem; display: flex; justify-content: space-between;
    align-items: center; box-shadow: var(--shadow); font-size: 0.88rem;
  }
  .fb-results-count { font-weight: 700; color: var(--navy); display: flex; align-items: center; gap: 0.4rem; }

  /* VIDEO ICON on post images */
  .fb-video-overlay {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 56px; height: 56px; border-radius: 50%;
    background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center;
    color: white; font-size: 1.4rem; cursor: pointer; transition: var(--transition);
  }
  .fb-video-overlay:hover { background: rgba(0,0,0,0.85); transform: translate(-50%,-50%) scale(1.05); }

  /* STORIES ROW */
  .fb-stories-row {
    display: flex; gap: 0.75rem; overflow-x: auto;
    padding-bottom: 0.5rem; margin-bottom: 1.25rem;
    scrollbar-width: none;
  }
  .fb-stories-row::-webkit-scrollbar { display: none; }

  .fb-story-card {
    flex-shrink: 0; width: 110px; height: 185px; border-radius: 12px;
    overflow: hidden; position: relative; cursor: pointer;
    background: linear-gradient(135deg, var(--navy), var(--blue));
    transition: var(--transition);
  }
  .fb-story-card:hover { transform: scale(1.03); }

  .fb-story-add {
    background: var(--white); border: 2px solid var(--gray-light);
    display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
    padding-bottom: 1rem;
  }
  .fb-story-add-icon {
    width: 40px; height: 40px; border-radius: 50%; background: var(--orange);
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 1.2rem; margin-bottom: 0.5rem;
    border: 3px solid white;
  }
  .fb-story-add span { font-size: 0.78rem; font-weight: 700; color: var(--text-dark); text-align: center; line-height: 1.3; }

  .fb-story-img { width: 100%; height: 100%; object-fit: cover; }
  .fb-story-gradient {
    width: 100%; height: 100%;
    background: linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%);
    position: absolute; inset: 0;
  }
  .fb-story-avatar {
    position: absolute; top: 10px; left: 10px;
    width: 36px; height: 36px; border-radius: 50%;
    border: 3px solid var(--orange); overflow: hidden;
    background: linear-gradient(135deg, var(--navy), var(--blue));
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 0.85rem; font-weight: 800;
  }
  .fb-story-label {
    position: absolute; bottom: 10px; left: 8px; right: 8px;
    font-size: 0.78rem; font-weight: 700; color: white; line-height: 1.3;
  }

  /* PAGINATION */
  .fb-pagination { margin: 1.5rem 0; }

  /* RESPONSIVE */
  @media (max-width: 1200px) {
    .fb-layout { grid-template-columns: 240px 1fr 300px; }
    .fb-left { width: 240px; }
    .fb-right { width: 300px; }
    .fb-center { margin-left: 240px; margin-right: 300px; }
  }

  @media (max-width: 992px) {
    .fb-layout { grid-template-columns: 1fr; }
    .fb-left { display: none; }
    .fb-right { display: none; }
    .fb-center { margin: 0; padding: 1rem 0.5rem; }
  }

  @media (max-width: 600px) {
    .fb-topbar-center { display: none; }
    .fb-post-actions { gap: 0; }
    .fb-post-action span { display: none; }
  }

  /* WELCOME BANNER */
  .fb-welcome-banner {
    background: linear-gradient(135deg, var(--navy) 0%, var(--blue) 60%, #2d5be3 100%);
    border-radius: 10px; padding: 1.5rem; margin-bottom: 1.25rem;
    color: white; box-shadow: var(--shadow-md); position: relative; overflow: hidden;
  }
  .fb-welcome-banner::before {
    content: '🏠'; position: absolute; right: 1.5rem; top: 50%;
    transform: translateY(-50%) rotate(-10deg); font-size: 4rem; opacity: 0.15;
  }
  .fb-welcome-banner h2 { font-size: 1.3rem; font-weight: 800; margin-bottom: 0.25rem; }
  .fb-welcome-banner p { font-size: 0.88rem; opacity: 0.85; }
`;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const {
    hostels,
    loading,
    filters,
    pagination,
    fetchHostels,
    updateFilters,
    resetFilters,
    changePage
  } = useHostel();

  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

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

  const initials = (user?.firstName?.[0] || '') + (user?.lastName?.[0] || '') || '?';

  const stats = [
    { label: 'My Bookings', value: '3', icon: <FaBookmark />, color: '#e8501a', bg: 'rgba(232,80,26,0.1)' },
    { label: 'Messages', value: '12', icon: <FaEnvelope />, color: '#1a3fa4', bg: 'rgba(26,63,164,0.1)' },
    { label: 'Favorites', value: '8', icon: <FaHeart />, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    { label: 'Available', value: pagination?.total || hostels.length, icon: <FaHome />, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  ];

  const navItems = [
    { icon: <FaHome />, label: 'Feed', key: 'home' },
    { icon: <FaVideo />, label: 'Videos', key: 'videos' },
    { icon: <FaBookmark />, label: 'Bookings', key: 'bookings', link: '/bookings' },
    { icon: <FaUserFriends />, label: 'Messages', key: 'messages', link: '/messages', badge: 12 },
    { icon: <FaBell />, label: 'Alerts', key: 'notifications', link: '/notifications', badge: 3 },
  ];

  const leftSidebarLinks = [
    { icon: <FaHome />, label: 'Browse Hostels', link: '/hostels', color: '#e8501a', bg: 'rgba(232,80,26,0.12)', key: 'home' },
    { icon: <FaBookmark />, label: 'My Bookings', link: '/bookings', color: '#1a3fa4', bg: 'rgba(26,63,164,0.12)', key: 'bookings' },
    { icon: <FaHeart />, label: 'Saved Hostels', link: '/favorites', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', key: 'favorites' },
    { icon: <FaEnvelope />, label: 'Messages', link: '/messages', color: '#1a3fa4', bg: 'rgba(26,63,164,0.12)', key: 'messages', badge: 12 },
    { icon: <FaBell />, label: 'Notifications', link: '/notifications', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', key: 'notifications', badge: 3 },
    { icon: <FaVideo />, label: 'Hostel Videos', link: '/videos', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', key: 'videos' },
    { icon: <FaCog />, label: 'Settings', link: '/profile', color: '#6b7280', bg: 'rgba(107,114,128,0.12)', key: 'settings' },
  ];

  // Story-style featured hostels (first 4)
  const featuredHostels = hostels.slice(0, 4);

  // Render hostel as a Facebook post
  const renderHostelPost = (hostel) => {
    const ownerName = hostel.owner
      ? `${hostel.owner.firstName || ''} ${hostel.owner.lastName || ''}`.trim() || 'HostelLink Owner'
      : 'HostelLink Owner';
    const ownerInitials = hostel.owner?.firstName?.[0]?.toUpperCase() || 'H';
    const images = hostel.images || [];
    const rating = (hostel.averageRating || 4.5).toFixed(1);

    const renderImages = () => {
      if (images.length === 0) {
        return (
          <div className="fb-post-no-image">
            <span>📷</span>
            <span>No photos yet</span>
          </div>
        );
      }
      if (images.length === 1) {
        return (
          <div style={{ position: 'relative' }}>
            <img src={images[0]} alt={hostel.name} className="fb-post-image" />
            <div className="fb-post-image-badges">
              {hostel.verified && <span className="fb-badge fb-badge-verified">✓ Verified</span>}
              <span className="fb-badge fb-badge-price">MK {hostel.price?.toLocaleString()}/mo</span>
              <span className="fb-badge fb-badge-rooms">{hostel.availableRooms} rooms free</span>
            </div>
          </div>
        );
      }
      if (images.length === 2) {
        return (
          <div style={{ position: 'relative' }}>
            <div className="fb-post-image-grid-2">
              {images.slice(0, 2).map((img, i) => <img key={i} src={img} alt={`${hostel.name} ${i+1}`} />)}
            </div>
            <div className="fb-post-image-badges">
              {hostel.verified && <span className="fb-badge fb-badge-verified">✓ Verified</span>}
              <span className="fb-badge fb-badge-price">MK {hostel.price?.toLocaleString()}/mo</span>
            </div>
          </div>
        );
      }
      // 3+ images
      return (
        <div style={{ position: 'relative' }}>
          <div className="fb-post-image-grid-3">
            {images.slice(0, 2).map((img, i) => <img key={i} src={img} alt={`${hostel.name} ${i+1}`} />)}
            {images.length > 3 ? (
              <div className="fb-post-image-more">
                <img src={images[2]} alt="" />
                <div className="fb-post-image-more-overlay">+{images.length - 2}</div>
              </div>
            ) : (
              <img src={images[2]} alt="" style={{ height: '148px', objectFit: 'cover', width: '100%' }} />
            )}
          </div>
          <div className="fb-post-image-badges">
            {hostel.verified && <span className="fb-badge fb-badge-verified">✓ Verified</span>}
            <span className="fb-badge fb-badge-price">MK {hostel.price?.toLocaleString()}/mo</span>
          </div>
        </div>
      );
    };

    return (
      <div key={hostel._id} className="fb-post-card">
        {/* POST HEADER */}
        <div className="fb-post-header">
          <div className="fb-post-avatar">{ownerInitials}</div>
          <div className="fb-post-meta">
            <div className="fb-post-owner-name">{ownerName}</div>
            <div className="fb-post-subtitle">
              <FaMapMarkerAlt style={{ color: 'var(--orange)' }} />
              {hostel.address}
              &nbsp;·&nbsp;🌐 Public listing
            </div>
          </div>
          <button className="fb-post-more" title="More options"><FaEllipsisH /></button>
        </div>

        {/* CAPTION */}
        <div className="fb-post-caption">
          <strong>{hostel.name}</strong> — {hostel.description
            ? hostel.description.length > 120
              ? hostel.description.slice(0, 120) + '...'
              : hostel.description
            : 'Quality student accommodation near campus.'}
        </div>

        {/* IMAGES */}
        <div className="fb-post-image-wrap">
          {renderImages()}
        </div>

        {/* INFO ROW */}
        <div className="fb-post-info">
          <div className="fb-post-info-item">
            <FaHome /><span>Type: <strong>{hostel.type}</strong></span>
          </div>
          <div className="fb-post-info-item">
            <span>👥</span><span>Gender: <strong style={{ textTransform: 'capitalize' }}>{hostel.gender}</strong></span>
          </div>
          <div className="fb-post-info-item">
            <FaCheckCircle style={{ color: 'var(--success)' }} />
            <span><strong style={{ color: 'var(--success)' }}>{hostel.availableRooms}</strong> of {hostel.totalRooms} rooms free</span>
          </div>
          <div className="fb-post-info-item">
            <FaStar style={{ color: '#f59e0b' }} /><span><strong>{rating}</strong> rating</span>
          </div>
          {hostel.contactPhone && (
            <div className="fb-post-info-item">
              <FaPhone /><span><strong>{hostel.contactPhone}</strong></span>
            </div>
          )}
        </div>

        {/* REACTION SUMMARY */}
        <div className="fb-post-reaction-summary">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div className="fb-reaction-icons">
              <span className="fb-reaction-emoji">👍</span>
              <span className="fb-reaction-emoji">❤️</span>
              <span className="fb-reaction-emoji">😍</span>
            </div>
            <span>{Math.floor(Math.random() * 80) + 20}</span>
          </div>
          <span>{hostel.viewCount || Math.floor(Math.random() * 30) + 5} views</span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="fb-post-actions">
          <button className="fb-post-action">
            <FaThumbsUp /><span>Interested</span>
          </button>
          <button className="fb-post-action" onClick={() => navigate(`/messages?to=${hostel.owner?._id}`)}>
            <FaComment /><span>Message</span>
          </button>
          <button className="fb-post-action" onClick={() => { navigator.clipboard?.writeText(window.location.origin + '/hostels/' + hostel._id); toast.success('Link copied!'); }}>
            <FaShare /><span>Share</span>
          </button>
          <button
            className="fb-post-action primary"
            onClick={() => navigate(`/hostels/${hostel._id}`)}
          >
            <FaArrowRight /><span>View Details</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      {/* ===== FACEBOOK-STYLE TOPBAR ===== */}
      <nav className="fb-topbar">
        {/* LEFT: Logo + Search */}
        <div className="fb-topbar-left">
          <a href="/" className="fb-logo">🏠 HostelLink</a>
          <form onSubmit={handleSearch} className="fb-search-wrap">
            <FaSearch />
            <input
              type="text"
              placeholder="Search hostels..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
        </div>

        {/* CENTER: Nav Tabs */}
        <div className="fb-topbar-center">
          {navItems.map(tab => (
            tab.link ? (
              <Link
                key={tab.key}
                to={tab.link}
                className={`fb-nav-tab${activeTab === tab.key ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
                title={tab.label}
              >
                {tab.icon}
                {tab.badge && <span className="fb-nav-badge">{tab.badge}</span>}
              </Link>
            ) : (
              <button
                key={tab.key}
                className={`fb-nav-tab${activeTab === tab.key ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
                title={tab.label}
              >
                {tab.icon}
                {tab.badge && <span className="fb-nav-badge">{tab.badge}</span>}
              </button>
            )
          ))}
        </div>

        {/* RIGHT: User controls */}
        <div className="fb-topbar-right">
          <Link to="/profile" className="fb-icon-btn" title="Profile & Settings"><FaUser /></Link>
          <Link to="/messages" className="fb-icon-btn" title="Messages">
            <FaEnvelope /><span className="notif-dot" />
          </Link>
          <Link to="/notifications" className="fb-icon-btn" title="Notifications">
            <FaBell /><span className="notif-dot" />
          </Link>
          <button className="fb-user-avatar-sm" onClick={handleLogout} title={`${user?.firstName} — click to logout`}>
            {initials}
          </button>
        </div>
      </nav>

      {/* ===== THREE-COLUMN LAYOUT ===== */}
      <div className="fb-layout">

        {/* ===== LEFT SIDEBAR ===== */}
        <div className="fb-left">
          <Link to="/profile" className="fb-sidebar-user">
            <div className="fb-sidebar-avatar">{initials}</div>
            <div className="fb-sidebar-username">{user?.firstName} {user?.lastName}</div>
          </Link>

          <hr className="fb-sidebar-divider" />

          {leftSidebarLinks.map(item => (
            <Link key={item.key} to={item.link} className="fb-sidebar-item">
              <div className="fb-sidebar-icon" style={{ background: item.bg, color: item.color }}>
                {item.icon}
              </div>
              {item.label}
              {item.badge && <span className="fb-sidebar-badge">{item.badge}</span>}
            </Link>
          ))}

          <hr className="fb-sidebar-divider" />
          <div className="fb-sidebar-section-title">Your Stats</div>

          {stats.map((s, i) => (
            <div key={i} className="fb-sidebar-item" style={{ cursor: 'default' }}>
              <div className="fb-sidebar-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>{s.label}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-mid)', fontWeight: 600 }}>{s.value}</div>
              </div>
            </div>
          ))}

          <hr className="fb-sidebar-divider" />

          <button
            onClick={handleLogout}
            className="fb-sidebar-item"
            style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
          >
            <div className="fb-sidebar-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
              <FaSignOutAlt />
            </div>
            Logout
          </button>
        </div>

        {/* ===== CENTER FEED ===== */}
        <div className="fb-center">

          {/* WELCOME BANNER */}
          <div className="fb-welcome-banner">
            <h2>Welcome back, {user?.firstName}! 👋</h2>
            <p>Discover your perfect student hostel near MUBAS campus</p>
          </div>

          {/* STORIES / FEATURED HOSTELS */}
          {featuredHostels.length > 0 && (
            <div className="fb-stories-row">
              {/* Add Story card */}
              <div className="fb-story-card fb-story-add" onClick={() => navigate('/bookings')}>
                <div className="fb-story-add-icon">+</div>
                <span>My Bookings</span>
              </div>
              {featuredHostels.map(hostel => (
                <div
                  key={hostel._id}
                  className="fb-story-card"
                  onClick={() => navigate(`/hostels/${hostel._id}`)}
                >
                  {hostel.images?.[0]
                    ? <img src={hostel.images[0]} alt={hostel.name} className="fb-story-img" />
                    : null
                  }
                  <div className="fb-story-gradient" />
                  <div className="fb-story-avatar">
                    {hostel.owner?.firstName?.[0]?.toUpperCase() || 'H'}
                  </div>
                  <div className="fb-story-label">
                    {hostel.name}
                    <div style={{ fontSize: '0.7rem', opacity: 0.85, marginTop: '2px' }}>
                      MK {hostel.price?.toLocaleString()}/mo
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CREATE POST / SEARCH BOX */}
          <div className="fb-create-post">
            <div className="fb-create-top">
              <div className="fb-user-avatar-sm" style={{ cursor: 'default' }}>{initials}</div>
              <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                <input
                  className="fb-create-input"
                  placeholder="Search hostels by name, location..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button type="submit" style={{ background: 'var(--orange)', color: 'white', border: 'none', borderRadius: '20px', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 700, fontFamily: 'Manrope, sans-serif' }}>
                  Search
                </button>
              </form>
            </div>
            <div className="fb-create-divider" />
            <div className="fb-create-actions">
              <button className="fb-create-action" onClick={() => navigate('/videos')} style={{ color: '#f02849' }}>
                <FaVideo style={{ color: '#f02849' }} /> <span>Videos</span>
              </button>
              <button className="fb-create-action" onClick={() => setShowFilters(!showFilters)} style={{ color: '#45bd62' }}>
                <FaImages style={{ color: '#45bd62' }} /> <span>Filter</span>
              </button>
              <button className="fb-create-action" onClick={() => navigate('/bookings')} style={{ color: '#f7b928' }}>
                <FaBookmark style={{ color: '#f7b928' }} /> <span>Bookings</span>
              </button>
            </div>
          </div>

          {/* FILTERS */}
          <div className="fb-filters-wrap">
            <div className="fb-filters-header" onClick={() => setShowFilters(!showFilters)}>
              <h3><FaFilter style={{ color: 'var(--orange)' }} /> Filter Hostels</h3>
              <button className="fb-filters-toggle">
                {showFilters ? 'Hide' : 'Show'} Filters {showFilters ? <FaChevronDown style={{ display: 'inline' }} /> : <FaChevronRight style={{ display: 'inline' }} />}
              </button>
            </div>
            {showFilters && (
              <HostelFilters
                filters={filters}
                onFilterChange={updateFilters}
                onReset={resetFilters}
              />
            )}
          </div>

          {/* RESULTS COUNT */}
          {!loading && hostels.length > 0 && (
            <div className="fb-results-bar">
              <div className="fb-results-count">
                <FaHome style={{ color: 'var(--orange)' }} />
                {hostels.length} of {pagination?.total || hostels.length} hostels
              </div>
              <span style={{ color: 'var(--text-mid)', fontSize: '0.82rem' }}>
                Page {pagination?.page} of {pagination?.totalPages}
              </span>
            </div>
          )}

          {/* FEED: HOSTEL POSTS */}
          {loading ? (
            <div className="fb-loading">
              <div className="fb-spinner" />
              <p style={{ color: 'var(--text-mid)' }}>Loading hostels...</p>
            </div>
          ) : hostels.length === 0 ? (
            <div className="fb-empty">
              <div className="fb-empty-icon">🏠</div>
              <h3>No hostels found</h3>
              <p>Try adjusting your filters or search term</p>
              <button className="fb-empty-btn" onClick={resetFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              {hostels.map(hostel => renderHostelPost(hostel))}
              {pagination?.totalPages > 1 && (
                <div className="fb-pagination">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={(page) => { changePage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* ===== RIGHT SIDEBAR ===== */}
        <div className="fb-right">

          {/* STATS */}
          <div className="fb-right-section">
            <div className="fb-right-title">Your Overview</div>
            <div className="fb-stat-row">
              {stats.map((s, i) => (
                <div key={i} className="fb-stat-box">
                  <div className="fb-stat-box-icon" style={{ color: s.color }}>{s.icon}</div>
                  <div className="fb-stat-box-value">{s.value}</div>
                  <div className="fb-stat-box-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--gray-light)', margin: '0 0 1.25rem' }} />

          {/* QUICK LINKS */}
          <div className="fb-right-section">
            <div className="fb-right-title">Quick Access</div>
            {[
              { icon: <FaBookmark />, label: 'My Bookings', sub: 'View all reservations', link: '/bookings', color: '#e8501a', bg: 'rgba(232,80,26,0.1)' },
              { icon: <FaHeart />, label: 'Saved Hostels', sub: 'Your favorites', link: '/favorites', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
              { icon: <FaEnvelope />, label: 'Messages', sub: '12 unread', link: '/messages', color: '#1a3fa4', bg: 'rgba(26,63,164,0.1)' },
              { icon: <FaVideo />, label: 'Videos', sub: 'Hostel tours', link: '/videos', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
            ].map((item, i) => (
              <Link key={i} to={item.link} className="fb-quick-link">
                <div className="fb-quick-icon" style={{ background: item.bg, color: item.color }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-mid)' }}>{item.sub}</div>
                </div>
              </Link>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--gray-light)', margin: '0 0 1.25rem' }} />

          {/* CONTACTS / NEARBY ACTIVE HOSTELS */}
          <div className="fb-right-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div className="fb-right-title" style={{ marginBottom: 0 }}>Active Listings</div>
              <FaSearch style={{ color: 'var(--text-mid)', cursor: 'pointer' }} />
            </div>
            {hostels.slice(0, 6).map((h, i) => (
              <div key={h._id} className="fb-contact" onClick={() => navigate(`/hostels/${h._id}`)}>
                <div className="fb-contact-avatar">
                  {h.owner?.firstName?.[0]?.toUpperCase() || 'H'}
                  {h.availableRooms > 0 && <div className="fb-contact-online" />}
                </div>
                <div>
                  <div className="fb-contact-name" style={{ fontSize: '0.85rem' }}>{h.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-mid)' }}>
                    MK {h.price?.toLocaleString()}/mo · {h.availableRooms} free
                  </div>
                </div>
              </div>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--gray-light)', margin: '0 0 1rem' }} />

          <div style={{ fontSize: '0.75rem', color: 'var(--text-mid)', lineHeight: 1.7, padding: '0 0.75rem' }}>
            HostelLink · About · Privacy · Terms ·<br />
            © 2025 HostelLink MUBAS
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;