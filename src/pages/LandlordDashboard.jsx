import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaPlus, FaHome, FaCalendarCheck, FaEnvelope,
  FaCog, FaSignOutAlt, FaEdit, FaTrash, FaEye,
  FaStar, FaMapMarkerAlt, FaDoorOpen, FaCheckCircle,
  FaBell, FaUser, FaSearch, FaBars, FaTimes, FaBuilding,
  FaSpinner, FaExclamationTriangle, FaSync, FaChartLine,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0d1b3e;
    --navy2: #112255;
    --blue: #1a3fa4;
    --orange: #e8501a;
    --orange-light: #ff6b3d;
    --orange-pale: #fff3ef;
    --white: #ffffff;
    --gray-bg: #f4f6fa;
    --gray-light: #e4e6eb;
    --text-dark: #111827;
    --text-mid: #4b5563;
    --text-light: #9ca3af;
    --success: #059669;
    --success-pale: #ecfdf5;
    --danger: #dc2626;
    --warning: #d97706;
    --card-radius: 16px;
    --transition: all 0.22s ease;
  }

  html { font-size: 16px; -webkit-text-size-adjust: 100%; }
  body { font-family: 'Manrope', sans-serif; background: var(--gray-bg); color: var(--text-dark); min-height: 100vh; }

  .ld-topbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    background: var(--navy); height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem;
    box-shadow: 0 2px 20px rgba(0,0,0,0.3);
  }
  .ld-topbar-left { display: flex; align-items: center; gap: 1rem; }
  .ld-logo { display: flex; align-items: center; gap: 0.65rem; text-decoration: none; }
  /* ── LOGO IMAGE ── */
  .ld-logo-icon {
    width: 38px; height: 38px; border-radius: 10px;
    overflow: hidden; border: 2px solid rgba(255,255,255,0.15);
    flex-shrink: 0;
  }
  .ld-logo-icon img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ld-logo-name { font-size: 1.15rem; font-weight: 800; color: var(--white); letter-spacing: -0.3px; }
  .ld-logo-badge {
    font-size: 0.6rem; font-weight: 700;
    background: rgba(232,80,26,0.3); color: #ffb49a;
    border: 1px solid rgba(232,80,26,0.5);
    padding: 3px 9px; border-radius: 20px;
    letter-spacing: 1px; text-transform: uppercase;
  }
  .ld-topbar-right { display: flex; align-items: center; gap: 0.6rem; }
  .ld-topbar-btn {
    display: flex; align-items: center; gap: 0.4rem;
    padding: 0.45rem 1rem; border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.85);
    font-size: 0.85rem; font-weight: 600;
    font-family: 'Manrope', sans-serif;
    cursor: pointer; transition: var(--transition); text-decoration: none;
  }
  .ld-topbar-btn:hover { background: rgba(255,255,255,0.15); color: white; }
  .ld-topbar-btn.danger { color: #fca5a5; border-color: rgba(252,165,165,0.3); }
  .ld-topbar-btn.danger:hover { background: rgba(220,38,38,0.25); color: #fca5a5; }
  .ld-hamburger { display: none; background: none; border: none; color: white; font-size: 1.3rem; cursor: pointer; padding: 0.4rem; border-radius: 6px; transition: var(--transition); }
  .ld-hamburger:hover { background: rgba(255,255,255,0.1); }

  .ld-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 1100; backdrop-filter: blur(2px); }
  .ld-overlay.open { display: block; }
  .ld-drawer {
    position: fixed; top: 0; left: 0; bottom: 0; width: 290px;
    background: var(--navy); z-index: 1200;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
    display: flex; flex-direction: column; overflow-y: auto;
    box-shadow: 4px 0 30px rgba(0,0,0,0.4);
  }
  .ld-drawer.open { transform: translateX(0); }
  .ld-drawer-top {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .ld-drawer-close { background: rgba(255,255,255,0.08); border: none; color: rgba(255,255,255,0.7); font-size: 1rem; cursor: pointer; padding: 0.4rem; border-radius: 6px; transition: var(--transition); }
  .ld-drawer-close:hover { background: rgba(255,255,255,0.15); color: white; }
  .ld-drawer-user {
    padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; gap: 0.9rem;
    background: rgba(232,80,26,0.08);
  }
  .ld-drawer-avatar {
    width: 46px; height: 46px; border-radius: 50%;
    background: linear-gradient(135deg, var(--orange), var(--orange-light)); color: white;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; font-weight: 800; flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(232,80,26,0.4);
  }
  .ld-drawer-uname { font-size: 0.95rem; font-weight: 700; color: white; }
  .ld-drawer-uemail { font-size: 0.72rem; color: rgba(255,255,255,0.4); margin-top: 2px; }
  .ld-drawer-role { font-size: 0.65rem; font-weight: 700; color: #ffb49a; background: rgba(232,80,26,0.2); padding: 2px 7px; border-radius: 10px; display: inline-block; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  .ld-drawer-nav { flex: 1; padding: 0.5rem 0; }
  .ld-drawer-section { padding: 0.75rem 1.5rem 0.25rem; font-size: 0.65rem; font-weight: 800; color: rgba(255,255,255,0.25); text-transform: uppercase; letter-spacing: 1.2px; }
  .ld-drawer-link {
    display: flex; align-items: center; gap: 0.85rem;
    padding: 0.85rem 1.5rem; color: rgba(255,255,255,0.65);
    font-size: 0.9rem; font-weight: 600; cursor: pointer;
    transition: var(--transition); border: none; background: none;
    width: 100%; text-align: left; font-family: 'Manrope', sans-serif;
    border-left: 3px solid transparent; text-decoration: none;
  }
  .ld-drawer-link:hover { background: rgba(255,255,255,0.06); color: white; }
  .ld-drawer-link.active { background: rgba(232,80,26,0.12); color: white; border-left-color: var(--orange); }
  .ld-drawer-link svg { font-size: 0.9rem; width: 18px; flex-shrink: 0; }
  .ld-drawer-link.active svg { color: var(--orange); }
  .ld-drawer-foot { padding: 1rem 1.5rem; border-top: 1px solid rgba(255,255,255,0.08); }
  .ld-drawer-logout {
    display: flex; align-items: center; gap: 0.75rem;
    color: #fca5a5; font-size: 0.9rem; font-weight: 600;
    cursor: pointer; background: rgba(220,38,38,0.1); border: 1px solid rgba(252,165,165,0.2);
    font-family: 'Manrope', sans-serif; width: 100%; padding: 0.7rem 1rem; border-radius: 8px;
    transition: var(--transition);
  }
  .ld-drawer-logout:hover { background: rgba(220,38,38,0.2); }

  .ld-page { padding-top: 64px; min-height: 100vh; }

  .ld-banner {
    background: linear-gradient(135deg, #0a1628 0%, var(--navy2) 50%, #1a3575 100%);
    padding: 2.5rem 2rem 3rem; position: relative; overflow: hidden;
  }
  .ld-banner::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 75% 50%, rgba(232,80,26,0.18) 0%, transparent 65%);
  }
  .ld-banner::after {
    content: ''; position: absolute; right: -80px; top: -80px;
    width: 320px; height: 320px; border-radius: 50%;
    background: rgba(232,80,26,0.05); border: 1px solid rgba(232,80,26,0.12);
  }
  .ld-banner-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; justify-content: space-between; align-items: center;
    gap: 2rem; flex-wrap: wrap; position: relative; z-index: 1;
  }
  .ld-banner-eyebrow {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.7rem; font-weight: 700; letter-spacing: 1.8px;
    text-transform: uppercase; color: var(--orange); margin-bottom: 0.6rem;
    background: rgba(232,80,26,0.12); padding: 4px 10px; border-radius: 20px;
    border: 1px solid rgba(232,80,26,0.25);
  }
  .ld-banner h1 { font-size: 1.9rem; font-weight: 900; color: white; line-height: 1.2; margin-bottom: 0.4rem; letter-spacing: -0.5px; }
  .ld-banner p { font-size: 0.88rem; color: rgba(255,255,255,0.5); font-weight: 500; }
  .ld-banner-btns { display: flex; gap: 0.75rem; flex-shrink: 0; flex-wrap: wrap; }

  .ld-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.75rem 1.4rem; border-radius: 10px;
    font-size: 0.88rem; font-weight: 700; font-family: 'Manrope', sans-serif;
    cursor: pointer; transition: var(--transition); border: none;
    text-decoration: none; white-space: nowrap;
  }
  .ld-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none !important; box-shadow: none !important; }
  .ld-btn-orange { background: var(--orange); color: white; box-shadow: 0 4px 16px rgba(232,80,26,0.4); }
  .ld-btn-orange:hover:not(:disabled) { background: var(--orange-light); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(232,80,26,0.5); }
  .ld-btn-ghost { background: rgba(255,255,255,0.1); color: white; border: 1.5px solid rgba(255,255,255,0.22); }
  .ld-btn-ghost:hover:not(:disabled) { background: rgba(255,255,255,0.18); }
  .ld-btn-danger { background: var(--danger); color: white; box-shadow: 0 4px 12px rgba(220,38,38,0.3); }
  .ld-btn-danger:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  .ld-btn-outline { background: white; color: var(--navy); border: 1.5px solid var(--gray-light); }
  .ld-btn-outline:hover:not(:disabled) { border-color: var(--navy); }

  .ld-main { max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem 5rem; }

  .ld-auth-loading {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 1rem; background: var(--gray-bg);
  }
  .ld-auth-loading p { color: var(--text-mid); font-weight: 600; font-family: 'Manrope', sans-serif; }

  .ld-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5rem 2rem; gap: 1rem; }
  .ld-spinner { animation: spin 0.8s linear infinite; font-size: 2rem; color: var(--orange); }
  @keyframes spin { to { transform: rotate(360deg); } }
  .ld-loading p { color: var(--text-mid); font-weight: 600; }

  .ld-error-box {
    background: #fef2f2; border: 1px solid #fecaca;
    border-radius: var(--card-radius); padding: 1.25rem 1.5rem;
    display: flex; align-items: center; gap: 1rem;
    margin-bottom: 1.5rem; color: var(--danger);
  }
  .ld-error-box p { font-size: 0.88rem; font-weight: 600; flex: 1; }

  .ld-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
  .ld-stat {
    background: white; border-radius: var(--card-radius);
    padding: 1.4rem 1.5rem; border: 1px solid var(--gray-light);
    box-shadow: 0 1px 6px rgba(0,0,0,0.05);
    display: flex; align-items: center; gap: 1rem;
    transition: var(--transition); position: relative; overflow: hidden;
  }
  .ld-stat::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
    background: var(--orange); transform: scaleY(0); transition: var(--transition);
    transform-origin: bottom; border-radius: 0 2px 2px 0;
  }
  .ld-stat:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.1); transform: translateY(-3px); }
  .ld-stat:hover::before { transform: scaleY(1); }
  .ld-stat-ico { width: 50px; height: 50px; border-radius: 13px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
  .ico-orange { background: var(--orange-pale); color: var(--orange); }
  .ico-navy   { background: #eef1fb; color: var(--blue); }
  .ico-green  { background: var(--success-pale); color: var(--success); }
  .ico-amber  { background: #fffbeb; color: #d97706; }
  .ld-stat-num { font-size: 1.85rem; font-weight: 900; color: var(--navy); line-height: 1; margin-bottom: 0.3rem; }
  .ld-stat-lbl { font-size: 0.75rem; font-weight: 700; color: var(--text-mid); text-transform: uppercase; letter-spacing: 0.5px; }

  .ld-skeleton {
    background: linear-gradient(90deg, #f0f2f5 25%, #e4e6eb 50%, #f0f2f5 75%);
    background-size: 200% 100%; border-radius: 8px; animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  .ld-sec-hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem; }
  .ld-sec-hd h2 { font-size: 1.15rem; font-weight: 800; color: var(--navy); display: flex; align-items: center; gap: 0.5rem; }
  .ld-sec-hd h2 svg { color: var(--orange); }

  .ld-quick { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
  .ld-quick-card {
    background: white; border: 1.5px solid var(--gray-light);
    border-radius: var(--card-radius); padding: 1.5rem 1rem;
    text-align: center; cursor: pointer; transition: var(--transition);
    display: flex; flex-direction: column; align-items: center; gap: 0.65rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04); font-family: 'Manrope', sans-serif;
    position: relative;
  }
  .ld-quick-card:hover { border-color: var(--orange); box-shadow: 0 8px 28px rgba(232,80,26,0.14); transform: translateY(-4px); }
  .ld-quick-ico { width: 54px; height: 54px; border-radius: 14px; background: var(--orange-pale); color: var(--orange); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; transition: var(--transition); }
  .ld-quick-card:hover .ld-quick-ico { background: var(--orange); color: white; transform: scale(1.05); }
  .ld-quick-title { font-size: 0.88rem; font-weight: 800; color: var(--text-dark); }
  .ld-quick-sub { font-size: 0.75rem; color: var(--text-mid); font-weight: 500; }
  .ld-notif-dot { position: absolute; top: 0.7rem; right: 0.7rem; width: 9px; height: 9px; background: var(--orange); border-radius: 50%; border: 2px solid white; animation: pulse-dot 2s infinite; }
  @keyframes pulse-dot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.6; transform:scale(1.3); } }

  .ld-panel { background: white; border-radius: var(--card-radius); border: 1px solid var(--gray-light); box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden; margin-bottom: 2rem; }
  .ld-panel-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.2rem 1.5rem; border-bottom: 1px solid var(--gray-light);
    background: #f9fafb; flex-wrap: wrap; gap: 0.75rem;
  }
  .ld-panel-label { font-size: 0.95rem; font-weight: 800; color: var(--navy); display: flex; align-items: center; gap: 0.5rem; }
  .ld-panel-label svg { color: var(--orange); }
  .ld-count-pill { background: var(--navy); color: white; font-size: 0.7rem; font-weight: 700; padding: 2px 9px; border-radius: 20px; }
  .ld-search-box { display: flex; align-items: center; gap: 0.5rem; background: white; border: 1.5px solid var(--gray-light); border-radius: 9px; padding: 0.5rem 0.9rem; min-width: 220px; transition: var(--transition); }
  .ld-search-box:focus-within { border-color: var(--orange); box-shadow: 0 0 0 3px rgba(232,80,26,0.1); }
  .ld-search-box input { border: none; outline: none; font-family: 'Manrope', sans-serif; font-size: 0.875rem; color: var(--text-dark); width: 100%; background: transparent; }
  .ld-search-box svg { color: var(--text-light); flex-shrink: 0; }

  .ld-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; padding: 1.5rem; }

  .ld-hcard { border: 1.5px solid var(--gray-light); border-radius: 14px; overflow: hidden; transition: var(--transition); background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
  .ld-hcard:hover { box-shadow: 0 10px 32px rgba(0,0,0,0.12); transform: translateY(-4px); border-color: rgba(232,80,26,0.3); }

  .ld-hcard-img { position: relative; height: 180px; overflow: hidden; background: linear-gradient(135deg, #e4e6eb, #f0f2f5); }
  .ld-hcard-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
  .ld-hcard:hover .ld-hcard-img img { transform: scale(1.05); }
  .ld-hcard-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text-light); font-size: 2.5rem; }

  .ld-hcard-status { position: absolute; top: 0.75rem; left: 0.75rem; display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.3rem 0.75rem; border-radius: 20px; font-size: 0.72rem; font-weight: 700; backdrop-filter: blur(8px); }
  .ld-hcard-status.verified { background: rgba(5,150,105,0.9); color: white; }
  .ld-hcard-status.pending  { background: rgba(217,119,6,0.9); color: white; }

  .ld-hcard-actions-overlay { position: absolute; top: 0.75rem; right: 0.75rem; display: flex; gap: 0.4rem; opacity: 0; transition: var(--transition); }
  .ld-hcard:hover .ld-hcard-actions-overlay { opacity: 1; }
  .ld-hcard-act-btn { width: 34px; height: 34px; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; transition: var(--transition); backdrop-filter: blur(8px); }
  .ld-hcard-act-btn.view { background: rgba(255,255,255,0.9); color: var(--navy); }
  .ld-hcard-act-btn.edit { background: rgba(26,63,164,0.9); color: white; }
  .ld-hcard-act-btn.del  { background: rgba(220,38,38,0.9); color: white; }
  .ld-hcard-act-btn:hover { transform: scale(1.12); }

  .ld-hcard-body { padding: 1.1rem 1.25rem; }
  .ld-hcard-name { font-size: 1rem; font-weight: 800; color: var(--navy); margin-bottom: 0.35rem; }
  .ld-hcard-addr { font-size: 0.8rem; color: var(--text-mid); display: flex; align-items: center; gap: 0.3rem; margin-bottom: 0.85rem; }
  .ld-hcard-addr svg { color: var(--orange); flex-shrink: 0; }

  .ld-hcard-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-bottom: 0.85rem; }
  .ld-hcard-stat { background: var(--gray-bg); border-radius: 9px; padding: 0.55rem 0.5rem; text-align: center; }
  .ld-hcard-stat-val { font-size: 0.95rem; font-weight: 800; color: var(--navy); line-height: 1; }
  .ld-hcard-stat-lbl { font-size: 0.62rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.3px; margin-top: 0.2rem; }

  .ld-hcard-foot { display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1.25rem; border-top: 1px solid var(--gray-light); background: #fafafa; }
  .ld-hcard-price { font-size: 1rem; font-weight: 800; color: var(--orange); }
  .ld-hcard-price span { font-size: 0.72rem; font-weight: 600; color: var(--text-light); }
  .ld-hcard-foot-actions { display: flex; gap: 0.4rem; }
  .ld-foot-btn { display: flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.85rem; border-radius: 7px; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: var(--transition); font-family: 'Manrope', sans-serif; border: 1.5px solid var(--gray-light); background: white; color: var(--text-dark); }
  .ld-foot-btn:hover { border-color: var(--navy); background: var(--navy); color: white; }
  .ld-foot-btn.danger { border-color: #fecaca; color: var(--danger); }
  .ld-foot-btn.danger:hover { border-color: var(--danger); background: var(--danger); color: white; }

  .ld-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .ld-table { width: 100%; border-collapse: collapse; min-width: 700px; }
  .ld-table th { background: var(--gray-bg); padding: 0.85rem 1.1rem; text-align: left; font-size: 0.72rem; font-weight: 800; color: var(--navy); text-transform: uppercase; letter-spacing: 0.6px; border-bottom: 2px solid var(--gray-light); white-space: nowrap; }
  .ld-table td { padding: 1rem 1.1rem; border-bottom: 1px solid var(--gray-light); font-size: 0.875rem; vertical-align: middle; }
  .ld-table tbody tr:last-child td { border-bottom: none; }
  .ld-table tbody tr:hover { background: #fdf4f1; }
  .ld-cell-name { font-weight: 800; color: var(--navy); font-size: 0.9rem; }
  .ld-badge { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.28rem 0.75rem; border-radius: 20px; font-size: 0.72rem; font-weight: 700; }
  .ld-badge-verified { background: var(--success-pale); color: #065f46; }
  .ld-badge-pending  { background: #fffbeb; color: #92400e; }
  .ld-row-actions { display: flex; gap: 0.4rem; }
  .ld-icon-btn { width: 32px; height: 32px; border-radius: 7px; border: 1px solid var(--gray-light); background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-mid); font-size: 0.82rem; transition: var(--transition); }
  .ld-icon-btn:hover { background: var(--navy); color: white; border-color: var(--navy); }
  .ld-icon-btn.del:hover { background: var(--danger); color: white; border-color: var(--danger); }

  .ld-empty { text-align: center; padding: 4rem 2rem; }
  .ld-empty-ico { width: 80px; height: 80px; background: var(--orange-pale); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: var(--orange); margin: 0 auto 1.25rem; }
  .ld-empty h3 { font-size: 1.25rem; font-weight: 800; color: var(--navy); margin-bottom: 0.5rem; }
  .ld-empty p { color: var(--text-mid); font-size: 0.88rem; margin-bottom: 1.5rem; max-width: 320px; margin-left: auto; margin-right: auto; }

  .ld-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 1rem; backdrop-filter: blur(3px); }
  .ld-modal { background: white; border-radius: 18px; padding: 2rem; max-width: 400px; width: 100%; box-shadow: 0 24px 64px rgba(0,0,0,0.25); animation: modal-in 0.2s ease; }
  @keyframes modal-in { from { opacity:0; transform:scale(0.95) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
  .ld-modal-icon { width: 60px; height: 60px; background: #fef2f2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: var(--danger); font-size: 1.5rem; }
  .ld-modal h3 { font-size: 1.15rem; font-weight: 800; color: var(--navy); margin-bottom: 0.5rem; text-align: center; }
  .ld-modal p { color: var(--text-mid); font-size: 0.875rem; margin-bottom: 1.5rem; line-height: 1.6; text-align: center; }
  .ld-modal-actions { display: flex; gap: 0.75rem; }
  .ld-modal-actions .ld-btn { flex: 1; justify-content: center; }

  .ld-refresh-btn { display: flex; align-items: center; gap: 0.4rem; background: white; border: 1.5px solid var(--gray-light); border-radius: 8px; padding: 0.45rem 0.9rem; font-size: 0.8rem; font-weight: 600; color: var(--text-mid); cursor: pointer; transition: var(--transition); font-family: 'Manrope', sans-serif; }
  .ld-refresh-btn:hover:not(:disabled) { border-color: var(--orange); color: var(--orange); background: var(--orange-pale); }
  .ld-refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .spin { animation: spin 0.8s linear infinite; }

  .ld-view-toggle { display: flex; background: var(--gray-bg); border-radius: 8px; padding: 3px; border: 1px solid var(--gray-light); }
  .ld-view-btn { padding: 0.35rem 0.75rem; border-radius: 6px; border: none; background: none; cursor: pointer; font-size: 0.82rem; font-weight: 600; color: var(--text-mid); transition: var(--transition); font-family: 'Manrope', sans-serif; }
  .ld-view-btn.active { background: white; color: var(--navy); box-shadow: 0 1px 4px rgba(0,0,0,0.1); }

  @media (max-width: 1024px) {
    .ld-stats { grid-template-columns: repeat(2, 1fr); }
    .ld-quick { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .ld-topbar { padding: 0 1rem; }
    .ld-hamburger { display: block; }
    .ld-topbar-right .ld-topbar-btn { display: none; }
    .ld-banner { padding: 1.5rem 1rem 2rem; }
    .ld-banner h1 { font-size: 1.5rem; }
    .ld-banner-btns { width: 100%; }
    .ld-btn { padding: 0.65rem 1.1rem; font-size: 0.85rem; }
    .ld-main { padding: 1rem 0.85rem 4rem; }
    .ld-stats { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
    .ld-stat { padding: 1rem; gap: 0.75rem; }
    .ld-stat-num { font-size: 1.6rem; }
    .ld-stat-ico { width: 44px; height: 44px; font-size: 1.05rem; }
    .ld-quick { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
    .ld-panel-head { padding: 0.9rem 1rem; }
    .ld-search-box { min-width: 0; flex: 1; }
    .ld-cards-grid { grid-template-columns: 1fr; padding: 1rem; gap: 1rem; }
    .ld-table-wrap { display: none; }
  }
  @media (max-width: 480px) {
    .ld-banner h1 { font-size: 1.3rem; }
    .ld-banner-btns { flex-direction: column; }
    .ld-btn { width: 100%; justify-content: center; }
    .ld-stats { gap: 0.6rem; }
    .ld-quick { gap: 0.6rem; }
    .ld-quick-sub { display: none; }
    .ld-panel-head { flex-direction: column; align-items: stretch; }
    .ld-cards-grid { padding: 0.75rem; }
  }
`;

function DeleteModal({ hostel, onConfirm, onCancel, loading }) {
  return (
    <div className="ld-modal-backdrop" onClick={e => { if (e.target === e.currentTarget && !loading) onCancel(); }}>
      <div className="ld-modal">
        <div className="ld-modal-icon"><FaTrash /></div>
        <h3>Delete Hostel?</h3>
        <p>Are you sure you want to permanently delete <strong>"{hostel?.name}"</strong>? This action cannot be undone.</p>
        <div className="ld-modal-actions">
          <button className="ld-btn ld-btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className="ld-btn ld-btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? <><FaSpinner className="spin" /> Deleting...</> : <><FaTrash /> Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="ld-stat" style={{ pointerEvents: 'none' }}>
      <div className="ld-skeleton" style={{ width: 50, height: 50, borderRadius: 13, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="ld-skeleton" style={{ width: 55, height: 26, marginBottom: 8 }} />
        <div className="ld-skeleton" style={{ width: 85, height: 11 }} />
      </div>
    </div>
  );
}

function HostelCard({ hostel, onView, onEdit, onDelete }) {
  const img = hostel.images?.[0]?.url || hostel.images?.[0] || null;
  return (
    <div className="ld-hcard">
      <div className="ld-hcard-img">
        {img
          ? <img src={img} alt={hostel.name} />
          : <div className="ld-hcard-img-placeholder"><FaBuilding /></div>
        }
        <span className={`ld-hcard-status ${hostel.verified ? 'verified' : 'pending'}`}>
          {hostel.verified ? <><FaCheckCircle /> Verified</> : '⏳ Pending'}
        </span>
        <div className="ld-hcard-actions-overlay">
          <button className="ld-hcard-act-btn view" title="View"   onClick={onView}><FaEye /></button>
          <button className="ld-hcard-act-btn edit" title="Edit"   onClick={onEdit}><FaEdit /></button>
          <button className="ld-hcard-act-btn del"  title="Delete" onClick={onDelete}><FaTrash /></button>
        </div>
      </div>
      <div className="ld-hcard-body">
        <div className="ld-hcard-name">{hostel.name}</div>
        <div className="ld-hcard-addr"><FaMapMarkerAlt /> {hostel.address}</div>
        <div className="ld-hcard-stats">
          <div className="ld-hcard-stat">
            <div className="ld-hcard-stat-val">{hostel.availableRooms ?? 0}/{hostel.totalRooms ?? 0}</div>
            <div className="ld-hcard-stat-lbl">Rooms</div>
          </div>
          <div className="ld-hcard-stat">
            <div className="ld-hcard-stat-val">{hostel.totalViews ?? hostel.viewCount ?? 0}</div>
            <div className="ld-hcard-stat-lbl">Views</div>
          </div>
          <div className="ld-hcard-stat">
            <div className="ld-hcard-stat-val" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:3 }}>
              <FaStar style={{ color:'#f59e0b', fontSize:'0.75rem' }} />
              {hostel.rating ?? hostel.averageRating
                ? (hostel.rating || hostel.averageRating).toFixed(1)
                : 'N/A'}
            </div>
            <div className="ld-hcard-stat-lbl">Rating</div>
          </div>
        </div>
      </div>
      <div className="ld-hcard-foot">
        <div className="ld-hcard-price">MK {hostel.price?.toLocaleString() ?? '—'}<span> /mo</span></div>
        <div className="ld-hcard-foot-actions">
          <button className="ld-foot-btn" onClick={onEdit}><FaEdit /> Edit</button>
          <button className="ld-foot-btn danger" onClick={onDelete}><FaTrash /> Delete</button>
        </div>
      </div>
    </div>
  );
}

const LandlordDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, token, loading: authLoading } = useAuth();

  const [drawerOpen,     setDrawerOpen]     = useState(false);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [viewMode,       setViewMode]       = useState('cards');
  const [hostels,        setHostels]        = useState([]);
  const [loadingHostels, setLoadingHostels] = useState(true);
  const [error,          setError]          = useState(null);
  const [refreshing,     setRefreshing]     = useState(false);
  const [deleteTarget,   setDeleteTarget]   = useState(null);
  const [deleting,       setDeleting]       = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const fetchHostels = useCallback(async (silent = false) => {
    if (!token) return;
    if (!silent) setLoadingHostels(true);
    else setRefreshing(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/hostels/my-hostels`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Server error (${res.status})`);
      }
      const data = await res.json();
      const list = data.hostels || data.data || data || [];
      setHostels(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message);
      if (silent) toast.error('Refresh failed: ' + err.message);
    } finally {
      setLoadingHostels(false);
      setRefreshing(false);
    }
  }, [token]);

  const fetchUnread = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/messages/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUnreadMessages(data.count || 0);
      }
    } catch (_) {}
  }, [token]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { navigate('/login'); return; }
    if (user?.role !== 'owner') { toast.error('Access denied. Owner account required.'); navigate('/'); return; }
    fetchHostels();
    fetchUnread();
  }, [authLoading, isAuthenticated, user?.role]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/hostels/${deleteTarget._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Delete failed');
      }
      setHostels(prev => prev.filter(h => h._id !== deleteTarget._id));
      toast.success(`"${deleteTarget.name}" deleted successfully`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error('Delete failed: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = hostels.filter(h =>
    h.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Active Listings', value: hostels.length,                                                       icon: <FaBuilding />,      color: 'ico-orange' },
    { label: 'Total Bookings',  value: hostels.reduce((a, h) => a + (h.bookings || 0), 0),                   icon: <FaCalendarCheck />, color: 'ico-navy'   },
    { label: 'Total Views',     value: hostels.reduce((a, h) => a + (h.totalViews || h.viewCount || 0), 0),   icon: <FaEye />,           color: 'ico-green'  },
    {
      label: 'Avg Rating',
      value: hostels.length
        ? (hostels.reduce((a, h) => a + (h.rating || h.averageRating || 0), 0) / hostels.length).toFixed(1)
        : '0.0',
      icon: <FaStar />, color: 'ico-amber',
    },
  ];

  const quickActions = [
    { icon: <FaPlus />,      title: 'List Hostel',  sub: 'Add new property',   action: () => navigate('/hostels/create') },
    { icon: <FaEnvelope />,  title: 'Messages',     sub: 'Chat with students', action: () => navigate('/messages'),  badge: unreadMessages > 0 },
    { icon: <FaUser />,      title: 'My Profile',   sub: 'Account settings',   action: () => navigate('/profile')   },
    { icon: <FaHome />,      title: 'Browse',       sub: 'See all hostels',    action: () => navigate('/hostels')   },
  ];

  // ── DRAWER NAV LINKS — all properly linked ──
  const navLinks = [
    { icon: <FaHome />,          label: 'Dashboard',      path: '/landlord-dashboard' },
    { icon: <FaBuilding />,      label: 'My Hostels',     path: '/my-hostels'         },
    { icon: <FaCalendarCheck />, label: 'Bookings',       path: '/bookings'           },
    { icon: <FaEnvelope />,      label: 'Messages',       path: '/messages'           },
    { icon: <FaBell />,          label: 'Notifications',  path: '/notifications'      },
    { icon: <FaUser />,          label: 'Profile',        path: '/profile'            },
    { icon: <FaCog />,           label: 'Settings',       path: '/profile'            },
  ];

  const handleLogout = () => { logout(); navigate('/login'); };

  if (authLoading) {
    return (
      <>
        <style>{styles}</style>
        <div className="ld-auth-loading">
          <FaSpinner style={{ fontSize: '2.2rem', color: '#e8501a', animation: 'spin 0.8s linear infinite' }} />
          <p>Loading your dashboard...</p>
        </div>
      </>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <style>{styles}</style>

      {deleteTarget && (
        <DeleteModal
          hostel={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => !deleting && setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      <div className={`ld-overlay${drawerOpen ? ' open' : ''}`} onClick={() => setDrawerOpen(false)} />

      {/* DRAWER */}
      <div className={`ld-drawer${drawerOpen ? ' open' : ''}`}>
        <div className="ld-drawer-top">
          {/* ── DRAWER LOGO using PezaHostelLogo.png ── */}
          <Link to="/" className="ld-logo">
            <div className="ld-logo-icon"><img src="/PezaHostelLogo.png" alt="PezaHostel" /></div>
            <span className="ld-logo-name">PezaHostel</span>
          </Link>
          <button className="ld-drawer-close" onClick={() => setDrawerOpen(false)}><FaTimes /></button>
        </div>
        <div className="ld-drawer-user">
          <div className="ld-drawer-avatar">{user?.firstName?.[0]?.toUpperCase() || 'U'}</div>
          <div>
            <div className="ld-drawer-uname">{user?.firstName} {user?.lastName}</div>
            <div className="ld-drawer-uemail">{user?.email}</div>
            <div className="ld-drawer-role">Owner</div>
          </div>
        </div>
        <nav className="ld-drawer-nav">
          <div className="ld-drawer-section">Main Menu</div>
          {navLinks.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`ld-drawer-link${window.location.pathname === item.path ? ' active' : ''}`}
              onClick={() => setDrawerOpen(false)}
            >
              {item.icon} {item.label}
            </Link>
          ))}
          {/* About & Contact links */}
          <div className="ld-drawer-section">Info</div>
          <Link to="/about"   className="ld-drawer-link" onClick={() => setDrawerOpen(false)}><FaHome /> About Us</Link>
          <Link to="/contact" className="ld-drawer-link" onClick={() => setDrawerOpen(false)}><FaEnvelope /> Contact</Link>
        </nav>
        <div className="ld-drawer-foot">
          <button className="ld-drawer-logout" onClick={handleLogout}>
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>

      {/* TOPBAR */}
      <nav className="ld-topbar">
        <div className="ld-topbar-left">
          <button className="ld-hamburger" onClick={() => setDrawerOpen(true)}><FaBars /></button>
          {/* ── TOPBAR LOGO using PezaHostelLogo.png ── */}
          <Link to="/" className="ld-logo">
            <div className="ld-logo-icon"><img src="/PezaHostelLogo.png" alt="PezaHostel" /></div>
            <span className="ld-logo-name">PezaHostel</span>
            <span className="ld-logo-badge">Owner</span>
          </Link>
        </div>
        <div className="ld-topbar-right">
          <Link to="/profile" className="ld-topbar-btn"><FaUser /> {user?.firstName}</Link>
          <button className="ld-topbar-btn danger" onClick={handleLogout}><FaSignOutAlt /> Sign Out</button>
        </div>
      </nav>

      <div className="ld-page">
        {/* BANNER */}
        <div className="ld-banner">
          <div className="ld-banner-inner">
            <div>
              <div className="ld-banner-eyebrow">🏢 Owner Portal</div>
              <h1>Welcome back, {user?.firstName}!</h1>
              <p>Manage your properties and connect with students</p>
            </div>
            <div className="ld-banner-btns">
              <button className="ld-btn ld-btn-orange" onClick={() => navigate('/hostels/create')}>
                <FaPlus /> Add New Hostel
              </button>
              <button className="ld-btn ld-btn-ghost" onClick={() => navigate('/messages')}>
                <FaEnvelope /> Messages {unreadMessages > 0 && `(${unreadMessages})`}
              </button>
            </div>
          </div>
        </div>

        <div className="ld-main">
          {error && (
            <div className="ld-error-box">
              <FaExclamationTriangle size={18} style={{ flexShrink: 0 }} />
              <p>{error}</p>
              <button className="ld-btn ld-btn-orange" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }} onClick={() => fetchHostels()}>
                Retry
              </button>
            </div>
          )}

          {/* STATS */}
          <div className="ld-stats">
            {loadingHostels
              ? Array(4).fill(0).map((_, i) => <StatSkeleton key={i} />)
              : stats.map((s, i) => (
                  <div key={i} className="ld-stat">
                    <div className={`ld-stat-ico ${s.color}`}>{s.icon}</div>
                    <div>
                      <div className="ld-stat-num">{s.value}</div>
                      <div className="ld-stat-lbl">{s.label}</div>
                    </div>
                  </div>
                ))
            }
          </div>

          {/* QUICK ACTIONS */}
          <div className="ld-sec-hd">
            <h2><FaBuilding /> Quick Actions</h2>
          </div>
          <div className="ld-quick">
            {quickActions.map((item, i) => (
              <div key={i} className="ld-quick-card" onClick={item.action}>
                {item.badge && <span className="ld-notif-dot" />}
                <div className="ld-quick-ico">{item.icon}</div>
                <div className="ld-quick-title">{item.title}</div>
                <div className="ld-quick-sub">{item.sub}</div>
              </div>
            ))}
          </div>

          {/* MY HOSTELS */}
          <div className="ld-sec-hd">
            <h2>
              <FaHome /> My Hostels
              {!loadingHostels && hostels.length > 0 && (
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-mid)', marginLeft: 4 }}>
                  ({hostels.length})
                </span>
              )}
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="ld-view-toggle">
                <button className={`ld-view-btn${viewMode === 'cards' ? ' active' : ''}`} onClick={() => setViewMode('cards')}>Cards</button>
                <button className={`ld-view-btn${viewMode === 'table' ? ' active' : ''}`} onClick={() => setViewMode('table')}>Table</button>
              </div>
              <button className="ld-refresh-btn" onClick={() => fetchHostels(true)} disabled={refreshing || loadingHostels}>
                <FaSync className={refreshing ? 'spin' : ''} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button className="ld-btn ld-btn-orange" style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }} onClick={() => navigate('/hostels/create')}>
                <FaPlus /> Add Hostel
              </button>
            </div>
          </div>

          {loadingHostels ? (
            <div className="ld-loading">
              <FaSpinner className="ld-spinner" />
              <p>Loading your hostels...</p>
            </div>
          ) : hostels.length === 0 && !error ? (
            <div className="ld-panel">
              <div className="ld-empty">
                <div className="ld-empty-ico"><FaBuilding /></div>
                <h3>No hostels listed yet</h3>
                <p>Start by adding your first property to connect with students looking for accommodation</p>
                <button className="ld-btn ld-btn-orange" onClick={() => navigate('/hostels/create')}>
                  <FaPlus /> List Your First Hostel
                </button>
              </div>
            </div>
          ) : (
            <div className="ld-panel">
              <div className="ld-panel-head">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="ld-panel-label"><FaBuilding /> Properties</span>
                  <span className="ld-count-pill">{filtered.length}</span>
                </div>
                <div className="ld-search-box">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search by name or location..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="ld-empty" style={{ padding: '2.5rem' }}>
                  <p style={{ color: 'var(--text-mid)', marginBottom: 0 }}>
                    No hostels match "<strong>{searchQuery}</strong>"
                  </p>
                </div>
              ) : viewMode === 'cards' ? (
                <div className="ld-cards-grid">
                  {filtered.map(hostel => (
                    <HostelCard
                      key={hostel._id}
                      hostel={hostel}
                      onView={() => navigate(`/hostels/${hostel._id}`)}
                      onEdit={() => navigate(`/hostels/edit/${hostel._id}`)}
                      onDelete={() => setDeleteTarget(hostel)}
                    />
                  ))}
                </div>
              ) : (
                <div className="ld-table-wrap">
                  <table className="ld-table">
                    <thead>
                      <tr>
                        <th>Hostel Name</th><th>Location</th><th>Rooms</th>
                        <th>Price/Month</th><th>Views</th><th>Rating</th>
                        <th>Status</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(hostel => (
                        <tr key={hostel._id}>
                          <td><span className="ld-cell-name">{hostel.name}</span></td>
                          <td>
                            <span style={{ display:'flex', alignItems:'center', gap:'0.3rem', color:'var(--text-mid)', fontSize:'0.83rem' }}>
                              <FaMapMarkerAlt style={{ color:'var(--orange)', flexShrink:0 }} />
                              {hostel.address}
                            </span>
                          </td>
                          <td>
                            <span style={{ display:'flex', alignItems:'center', gap:'0.3rem' }}>
                              <FaDoorOpen style={{ color:'var(--text-light)' }} />
                              <strong>{hostel.availableRooms ?? '—'}</strong>/{hostel.totalRooms ?? '—'}
                            </span>
                          </td>
                          <td style={{ fontWeight:800, color:'var(--orange)' }}>MK {hostel.price?.toLocaleString() ?? '—'}</td>
                          <td>{hostel.totalViews ?? hostel.viewCount ?? 0}</td>
                          <td>
                            <span style={{ display:'flex', alignItems:'center', gap:'0.3rem' }}>
                              <FaStar style={{ color:'#f59e0b' }} />
                              {(hostel.rating || hostel.averageRating)
                                ? (hostel.rating || hostel.averageRating).toFixed(1)
                                : 'N/A'}
                            </span>
                          </td>
                          <td>
                            <span className={`ld-badge ${hostel.verified ? 'ld-badge-verified' : 'ld-badge-pending'}`}>
                              {hostel.verified ? <><FaCheckCircle /> Verified</> : 'Pending'}
                            </span>
                          </td>
                          <td>
                            <div className="ld-row-actions">
                              <button className="ld-icon-btn" title="View"   onClick={() => navigate(`/hostels/${hostel._id}`)}><FaEye /></button>
                              <button className="ld-icon-btn" title="Edit"   onClick={() => navigate(`/hostels/edit/${hostel._id}`)}><FaEdit /></button>
                              <button className="ld-icon-btn del" title="Delete" onClick={() => setDeleteTarget(hostel)}><FaTrash /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LandlordDashboard;