import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaPlus, FaHome, FaCalendarCheck, FaEnvelope,
  FaCog, FaSignOutAlt, FaEdit, FaTrash, FaEye,
  FaStar, FaMapMarkerAlt, FaDoorOpen, FaCheckCircle,
  FaBell, FaUser, FaSearch, FaBars, FaTimes,
  FaChartBar, FaBuilding, FaMoneyBillWave
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --slate: #1e293b;
    --slate-mid: #334155;
    --slate-light: #475569;
    --teal: #0f766e;
    --teal-light: #14b8a6;
    --teal-pale: #f0fdfa;
    --amber: #d97706;
    --amber-pale: #fffbeb;
    --white: #ffffff;
    --off-white: #f8fafc;
    --border: #e2e8f0;
    --border-strong: #cbd5e1;
    --text-dark: #0f172a;
    --text-mid: #475569;
    --text-light: #94a3b8;
    --success: #059669;
    --danger: #dc2626;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
    --shadow-lg: 0 12px 40px rgba(0,0,0,0.12);
    --radius: 10px;
    --radius-lg: 16px;
    --transition: all 0.22s ease;
  }

  html { font-size: 16px; -webkit-text-size-adjust: 100%; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--off-white);
    color: var(--text-dark);
    min-height: 100vh;
  }

  /* ── TOPBAR ─────────────────────────────────── */
  .ld-topbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    background: var(--slate);
    height: 60px;
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.2);
  }

  .ld-topbar-left { display: flex; align-items: center; gap: 1rem; }

  .ld-logo {
    display: flex; align-items: center; gap: 0.6rem;
    text-decoration: none;
  }

  .ld-logo-icon {
    width: 34px; height: 34px;
    background: var(--teal);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; color: white;
  }

  .ld-logo-text {
    font-family: 'DM Serif Display', serif;
    font-size: 1.2rem;
    color: var(--white);
    letter-spacing: -0.3px;
  }

  .ld-logo-badge {
    font-size: 0.65rem;
    font-weight: 700;
    background: var(--amber);
    color: white;
    padding: 2px 7px;
    border-radius: 20px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-left: 2px;
  }

  .ld-topbar-right { display: flex; align-items: center; gap: 0.75rem; }

  .ld-topbar-btn {
    display: flex; align-items: center; gap: 0.4rem;
    padding: 0.45rem 0.9rem;
    border-radius: 7px;
    border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.85);
    font-size: 0.85rem;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: var(--transition);
    text-decoration: none;
  }

  .ld-topbar-btn:hover {
    background: rgba(255,255,255,0.15);
    color: white;
  }

  .ld-topbar-btn.logout {
    color: #fca5a5;
    border-color: rgba(252,165,165,0.3);
  }

  .ld-topbar-btn.logout:hover {
    background: rgba(220, 38, 38, 0.2);
    color: #fca5a5;
  }

  /* Hide text labels on mobile topbar */
  .ld-topbar-btn .btn-label {
    display: inline;
  }

  .ld-hamburger {
    display: none;
    background: none;
    border: none;
    color: white;
    font-size: 1.3rem;
    cursor: pointer;
    padding: 0.4rem;
  }

  /* ── PAGE WRAPPER ────────────────────────────── */
  .ld-page {
    padding-top: 60px;
    min-height: 100vh;
  }

  /* ── BANNER ──────────────────────────────────── */
  .ld-banner {
    background: linear-gradient(135deg, var(--slate) 0%, var(--slate-mid) 60%, #1e3a5f 100%);
    padding: 2.5rem 2rem 3rem;
    position: relative;
    overflow: hidden;
  }

  .ld-banner::before {
    content: '';
    position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  .ld-banner-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1.5rem;
    flex-wrap: wrap;
    position: relative;
  }

  .ld-banner-tag {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--teal-light);
    margin-bottom: 0.6rem;
  }

  .ld-banner h1 {
    font-family: 'DM Serif Display', serif;
    font-size: 2rem;
    color: white;
    line-height: 1.2;
    margin-bottom: 0.5rem;
  }

  .ld-banner p {
    font-size: 0.95rem;
    color: rgba(255,255,255,0.6);
    font-weight: 400;
  }

  .ld-banner-actions {
    display: flex;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  .ld-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.7rem 1.4rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: var(--transition);
    border: none;
    text-decoration: none;
    white-space: nowrap;
  }

  .ld-btn-primary {
    background: var(--teal);
    color: white;
  }

  .ld-btn-primary:hover {
    background: var(--teal-light);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(15,118,110,0.4);
  }

  .ld-btn-outline {
    background: rgba(255,255,255,0.08);
    color: white;
    border: 1.5px solid rgba(255,255,255,0.25);
  }

  .ld-btn-outline:hover {
    background: rgba(255,255,255,0.15);
  }

  /* ── MAIN CONTENT ────────────────────────────── */
  .ld-main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
  }

  /* ── STATS ───────────────────────────────────── */
  .ld-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 2.5rem;
  }

  .ld-stat {
    background: white;
    border-radius: var(--radius);
    padding: 1.4rem 1.5rem;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: var(--transition);
  }

  .ld-stat:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
    border-color: var(--teal-light);
  }

  .ld-stat-ico {
    width: 48px; height: 48px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .ld-stat-ico.teal { background: var(--teal-pale); color: var(--teal); }
  .ld-stat-ico.amber { background: var(--amber-pale); color: var(--amber); }
  .ld-stat-ico.blue { background: #eff6ff; color: #2563eb; }
  .ld-stat-ico.purple { background: #faf5ff; color: #7c3aed; }

  .ld-stat-info { flex: 1; min-width: 0; }

  .ld-stat-num {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--text-dark);
    line-height: 1;
    margin-bottom: 0.3rem;
  }

  .ld-stat-lbl {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-mid);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* ── SECTION HEADING ─────────────────────────── */
  .ld-section-hd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .ld-section-hd h2 {
    font-family: 'DM Serif Display', serif;
    font-size: 1.3rem;
    color: var(--text-dark);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .ld-section-hd h2 svg {
    color: var(--teal);
    font-size: 1rem;
  }

  /* ── QUICK ACTIONS ───────────────────────────── */
  .ld-quick {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 2.5rem;
  }

  .ld-quick-card {
    background: white;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.5rem 1rem;
    text-align: center;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    box-shadow: var(--shadow-sm);
    font-family: 'DM Sans', sans-serif;
  }

  .ld-quick-card:hover {
    border-color: var(--teal);
    box-shadow: 0 4px 20px rgba(15,118,110,0.12);
    transform: translateY(-3px);
  }

  .ld-quick-ico {
    width: 52px; height: 52px;
    border-radius: 12px;
    background: var(--teal-pale);
    color: var(--teal);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem;
    transition: var(--transition);
  }

  .ld-quick-card:hover .ld-quick-ico {
    background: var(--teal);
    color: white;
  }

  .ld-quick-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-dark);
  }

  .ld-quick-sub {
    font-size: 0.8rem;
    color: var(--text-mid);
  }

  /* ── HOSTELS PANEL ───────────────────────────── */
  .ld-panel {
    background: white;
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    margin-bottom: 2rem;
  }

  .ld-panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border);
    flex-wrap: wrap;
    gap: 0.75rem;
    background: var(--off-white);
  }

  .ld-panel-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.15rem;
    color: var(--text-dark);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .ld-panel-title svg { color: var(--teal); }

  .ld-panel-count {
    background: var(--teal);
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 20px;
  }

  .ld-search-wrap {
    display: flex; align-items: center; gap: 0.5rem;
    background: white;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.5rem 0.9rem;
    min-width: 200px;
  }

  .ld-search-wrap input {
    border: none; outline: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    color: var(--text-dark);
    width: 100%;
    background: transparent;
  }

  .ld-search-wrap svg { color: var(--text-light); flex-shrink: 0; }

  /* TABLE */
  .ld-table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .ld-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 700px;
  }

  .ld-table th {
    background: #f8fafc;
    padding: 0.9rem 1.2rem;
    text-align: left;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--text-mid);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }

  .ld-table td {
    padding: 1rem 1.2rem;
    border-bottom: 1px solid var(--border);
    font-size: 0.875rem;
    color: var(--text-dark);
    vertical-align: middle;
  }

  .ld-table tbody tr:last-child td { border-bottom: none; }

  .ld-table tbody tr:hover { background: var(--teal-pale); }

  .ld-hostel-name-cell { font-weight: 700; color: var(--slate); }
  .ld-hostel-name-sub {
    font-size: 0.75rem;
    color: var(--text-mid);
    font-weight: 400;
    margin-top: 2px;
  }

  .ld-badge {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.3rem 0.75rem;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 600;
  }

  .ld-badge-verified { background: #d1fae5; color: #065f46; }
  .ld-badge-pending { background: #fef3c7; color: #92400e; }

  .ld-tbl-actions { display: flex; gap: 0.5rem; }

  .ld-icon-btn {
    width: 34px; height: 34px;
    border-radius: 7px;
    border: 1px solid var(--border);
    background: white;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--text-mid);
    font-size: 0.85rem;
    transition: var(--transition);
  }

  .ld-icon-btn:hover { background: var(--teal); color: white; border-color: var(--teal); }
  .ld-icon-btn.del:hover { background: var(--danger); color: white; border-color: var(--danger); }

  /* MOBILE CARDS (replaces table on small screens) */
  .ld-hostel-cards { display: none; padding: 1rem; gap: 1rem; flex-direction: column; }

  .ld-hostel-card {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    background: white;
    box-shadow: var(--shadow-sm);
  }

  .ld-hostel-card-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1rem;
    background: var(--teal-pale);
    border-bottom: 1px solid var(--border);
  }

  .ld-hostel-card-name {
    font-weight: 700;
    color: var(--slate);
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
  }

  .ld-hostel-card-addr {
    font-size: 0.8rem;
    color: var(--text-mid);
    display: flex; align-items: center; gap: 0.3rem;
  }

  .ld-hostel-card-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }

  .ld-hostel-card-stat {
    padding: 0.8rem 1rem;
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .ld-hostel-card-stat:nth-child(even) { border-right: none; }
  .ld-hostel-card-stat:nth-last-child(-n+2) { border-bottom: none; }

  .ld-hcs-label {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-light);
    margin-bottom: 0.2rem;
  }

  .ld-hcs-value {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text-dark);
    display: flex; align-items: center; gap: 0.3rem;
  }

  .ld-hostel-card-foot {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-top: 1px solid var(--border);
    background: #fafafa;
  }

  /* EMPTY STATE */
  .ld-empty {
    text-align: center;
    padding: 4rem 2rem;
  }

  .ld-empty-icon {
    width: 80px; height: 80px;
    background: var(--teal-pale);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem;
    color: var(--teal);
    margin: 0 auto 1.5rem;
  }

  .ld-empty h3 {
    font-family: 'DM Serif Display', serif;
    font-size: 1.4rem;
    color: var(--slate);
    margin-bottom: 0.5rem;
  }

  .ld-empty p {
    color: var(--text-mid);
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  /* MOBILE DRAWER */
  .ld-drawer-overlay {
    display: none;
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 1100;
  }

  .ld-drawer-overlay.open { display: block; }

  .ld-drawer {
    position: fixed;
    top: 0; left: 0; bottom: 0;
    width: 280px;
    background: var(--slate);
    z-index: 1200;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .ld-drawer.open { transform: translateX(0); }

  .ld-drawer-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .ld-drawer-close {
    background: none; border: none;
    color: rgba(255,255,255,0.7);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.3rem;
  }

  .ld-drawer-nav { padding: 1rem 0; flex: 1; }

  .ld-drawer-item {
    display: flex; align-items: center; gap: 0.9rem;
    padding: 0.9rem 1.5rem;
    color: rgba(255,255,255,0.75);
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    border: none; background: none;
    width: 100%; text-align: left;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
  }

  .ld-drawer-item:hover, .ld-drawer-item.active {
    background: rgba(255,255,255,0.08);
    color: white;
  }

  .ld-drawer-item svg { font-size: 1rem; color: var(--teal-light); }

  .ld-drawer-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid rgba(255,255,255,0.1);
  }

  .ld-drawer-logout {
    display: flex; align-items: center; gap: 0.75rem;
    color: #fca5a5;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    background: none; border: none;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── RESPONSIVE ──────────────────────────────── */

  @media (max-width: 1024px) {
    .ld-stats { grid-template-columns: repeat(2, 1fr); }
    .ld-quick { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 768px) {
    .ld-topbar { padding: 0 1rem; }
    .ld-topbar-btn .btn-label { display: none; }
    .ld-hamburger { display: block; }
    .ld-topbar-right .ld-topbar-btn { display: none; }

    .ld-banner { padding: 1.75rem 1.25rem 2.25rem; }
    .ld-banner h1 { font-size: 1.5rem; }
    .ld-banner p { font-size: 0.875rem; }
    .ld-banner-actions { width: 100%; }
    .ld-btn { flex: 1; justify-content: center; padding: 0.7rem 1rem; font-size: 0.85rem; }

    .ld-main { padding: 1.25rem 1rem 3rem; }

    .ld-stats { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
    .ld-stat { padding: 1rem; gap: 0.75rem; }
    .ld-stat-num { font-size: 1.5rem; }
    .ld-stat-ico { width: 42px; height: 42px; font-size: 1rem; }
    .ld-stat-lbl { font-size: 0.72rem; }

    .ld-quick { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
    .ld-quick-card { padding: 1.25rem 0.75rem; gap: 0.5rem; }
    .ld-quick-ico { width: 44px; height: 44px; font-size: 1.1rem; }
    .ld-quick-title { font-size: 0.875rem; }

    .ld-panel-head { padding: 1rem; }
    .ld-search-wrap { min-width: 0; flex: 1; }

    /* Hide table, show cards */
    .ld-table-wrap { display: none; }
    .ld-hostel-cards { display: flex; }

    .ld-section-hd h2 { font-size: 1.1rem; }
  }

  @media (max-width: 480px) {
    .ld-stats { grid-template-columns: repeat(2, 1fr); gap: 0.6rem; }
    .ld-stat { flex-direction: column; align-items: flex-start; padding: 1rem; gap: 0.5rem; }
    .ld-stat-num { font-size: 1.6rem; }

    .ld-quick { grid-template-columns: repeat(2, 1fr); }
    .ld-quick-card { gap: 0.4rem; }
    .ld-quick-sub { display: none; }

    .ld-banner h1 { font-size: 1.3rem; }
    .ld-banner-actions { flex-direction: column; }
    .ld-btn { width: 100%; }

    .ld-panel-head { flex-direction: column; align-items: stretch; }
    .ld-panel-head > div { display: flex; align-items: center; gap: 0.5rem; }
  }
`;

const LandlordDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [hostels] = React.useState([
    {
      _id: 1,
      name: 'Campus View Hostel',
      address: 'Chitawira, Blantyre',
      price: 150000,
      totalRooms: 12,
      availableRooms: 3,
      totalViews: 245,
      verified: true,
      bookings: 9,
      rating: 4.8
    },
    {
      _id: 2,
      name: 'Budget Stay Inn',
      address: 'Nkolokosa, Blantyre',
      price: 120000,
      totalRooms: 8,
      availableRooms: 2,
      totalViews: 189,
      verified: true,
      bookings: 6,
      rating: 4.5
    },
  ]);

  const filtered = hostels.filter(h =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    {
      label: 'Active Listings',
      value: hostels.length,
      icon: <FaBuilding />,
      color: 'teal'
    },
    {
      label: 'Total Bookings',
      value: hostels.reduce((a, h) => a + h.bookings, 0),
      icon: <FaCalendarCheck />,
      color: 'amber'
    },
    {
      label: 'Total Views',
      value: hostels.reduce((a, h) => a + h.totalViews, 0),
      icon: <FaEye />,
      color: 'blue'
    },
    {
      label: 'Avg Rating',
      value: (hostels.reduce((a, h) => a + h.rating, 0) / hostels.length).toFixed(1),
      icon: <FaStar />,
      color: 'purple'
    },
  ];

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (user?.role !== 'owner') { navigate('/'); return; }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) return null;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      <style>{styles}</style>

      {/* MOBILE DRAWER */}
      <div
        className={`ld-drawer-overlay${drawerOpen ? ' open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />
      <div className={`ld-drawer${drawerOpen ? ' open' : ''}`}>
        <div className="ld-drawer-head">
          <a href="/" className="ld-logo" style={{ textDecoration: 'none' }}>
            <div className="ld-logo-icon"><FaHome /></div>
            <span className="ld-logo-text">HostelLink</span>
          </a>
          <button className="ld-drawer-close" onClick={() => setDrawerOpen(false)}>
            <FaTimes />
          </button>
        </div>
        <nav className="ld-drawer-nav">
          {[
            { icon: <FaHome />, label: 'Dashboard', path: '/landlord' },
            { icon: <FaBuilding />, label: 'My Hostels', path: '/my-hostels' },
            { icon: <FaCalendarCheck />, label: 'Bookings', path: '/bookings' },
            { icon: <FaEnvelope />, label: 'Messages', path: '/messages' },
            { icon: <FaBell />, label: 'Notifications', path: '/notifications' },
            { icon: <FaUser />, label: 'Profile', path: '/profile' },
            { icon: <FaCog />, label: 'Settings', path: '/settings' },
          ].map((item, i) => (
            <button
              key={i}
              className="ld-drawer-item"
              onClick={() => { navigate(item.path); setDrawerOpen(false); }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="ld-drawer-footer">
          <button className="ld-drawer-logout" onClick={handleLogout}>
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>

      {/* TOPBAR */}
      <nav className="ld-topbar">
        <div className="ld-topbar-left">
          <button className="ld-hamburger" onClick={() => setDrawerOpen(true)}>
            <FaBars />
          </button>
          <a href="/" className="ld-logo">
            <div className="ld-logo-icon"><FaHome /></div>
            <span className="ld-logo-text">HostelLink</span>
            <span className="ld-logo-badge">Owner</span>
          </a>
        </div>
        <div className="ld-topbar-right">
          <a href="/profile" className="ld-topbar-btn">
            <FaUser /> <span className="btn-label">Profile</span>
          </a>
          <button className="ld-topbar-btn logout" onClick={handleLogout}>
            <FaSignOutAlt /> <span className="btn-label">Sign Out</span>
          </button>
        </div>
      </nav>

      <div className="ld-page">
        {/* BANNER */}
        <div className="ld-banner">
          <div className="ld-banner-inner">
            <div>
              <div className="ld-banner-tag">Owner Portal</div>
              <h1>Good day, {user?.firstName || 'Landlord'}</h1>
              <p>Manage your properties and track your business performance</p>
            </div>
            <div className="ld-banner-actions">
              <button className="ld-btn ld-btn-primary" onClick={() => navigate('/hostels/create')}>
                <FaPlus /> Add New Hostel
              </button>
              <button className="ld-btn ld-btn-outline" onClick={() => navigate('/messages')}>
                <FaEnvelope /> Messages
              </button>
            </div>
          </div>
        </div>

        <div className="ld-main">
          {/* STATS */}
          <div className="ld-stats">
            {stats.map((s, i) => (
              <div key={i} className="ld-stat">
                <div className={`ld-stat-ico ${s.color}`}>{s.icon}</div>
                <div className="ld-stat-info">
                  <div className="ld-stat-num">{s.value}</div>
                  <div className="ld-stat-lbl">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <div className="ld-section-hd">
            <h2><FaChartBar /> Quick Actions</h2>
          </div>
          <div className="ld-quick" style={{ marginBottom: '2.5rem' }}>
            {[
              { icon: <FaPlus />, title: 'List Hostel', sub: 'Add property', action: () => navigate('/hostels/create') },
              { icon: <FaEnvelope />, title: 'Messages', sub: 'Chat with students', action: () => navigate('/messages') },
              { icon: <FaBell />, title: 'Notifications', sub: 'Bookings & alerts', action: () => navigate('/notifications') },
              { icon: <FaUser />, title: 'My Profile', sub: 'Account settings', action: () => navigate('/profile') },
            ].map((item, i) => (
              <div key={i} className="ld-quick-card" onClick={item.action}>
                <div className="ld-quick-ico">{item.icon}</div>
                <div className="ld-quick-title">{item.title}</div>
                <div className="ld-quick-sub">{item.sub}</div>
              </div>
            ))}
          </div>

          {/* MY HOSTELS */}
          <div className="ld-section-hd">
            <h2><FaBuilding /> My Hostels</h2>
            <button className="ld-btn ld-btn-primary" style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem' }} onClick={() => navigate('/hostels/create')}>
              <FaPlus /> Add Hostel
            </button>
          </div>

          {hostels.length === 0 ? (
            <div className="ld-panel">
              <div className="ld-empty">
                <div className="ld-empty-icon"><FaBuilding /></div>
                <h3>No hostels listed yet</h3>
                <p>Start by adding your first property to attract students</p>
                <button className="ld-btn ld-btn-primary" onClick={() => navigate('/hostels/create')}>
                  <FaPlus /> List Your First Hostel
                </button>
              </div>
            </div>
          ) : (
            <div className="ld-panel">
              <div className="ld-panel-head">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="ld-panel-title">
                    <FaBuilding /> Properties
                  </span>
                  <span className="ld-panel-count">{filtered.length}</span>
                </div>
                <div className="ld-search-wrap">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search hostels..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* DESKTOP TABLE */}
              <div className="ld-table-wrap">
                <table className="ld-table">
                  <thead>
                    <tr>
                      <th>Hostel Name</th>
                      <th>Location</th>
                      <th>Rooms</th>
                      <th>Monthly Price</th>
                      <th>Views</th>
                      <th>Bookings</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(hostel => (
                      <tr key={hostel._id}>
                        <td>
                          <div className="ld-hostel-name-cell">{hostel.name}</div>
                        </td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-mid)', fontSize: '0.85rem' }}>
                            <FaMapMarkerAlt style={{ color: 'var(--teal)', flexShrink: 0 }} />
                            {hostel.address}
                          </span>
                        </td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <FaDoorOpen style={{ color: 'var(--text-light)' }} />
                            <strong>{hostel.availableRooms}</strong>/{hostel.totalRooms}
                          </span>
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--teal)' }}>
                          MK {hostel.price.toLocaleString()}
                        </td>
                        <td>{hostel.totalViews}</td>
                        <td><strong>{hostel.bookings}</strong></td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <FaStar style={{ color: '#f59e0b' }} />
                            {hostel.rating}
                          </span>
                        </td>
                        <td>
                          <span className={`ld-badge ${hostel.verified ? 'ld-badge-verified' : 'ld-badge-pending'}`}>
                            {hostel.verified ? <><FaCheckCircle /> Verified</> : 'Pending'}
                          </span>
                        </td>
                        <td>
                          <div className="ld-tbl-actions">
                            <button className="ld-icon-btn" title="View" onClick={() => navigate(`/hostels/${hostel._id}`)}>
                              <FaEye />
                            </button>
                            <button className="ld-icon-btn" title="Edit" onClick={() => navigate(`/hostels/edit/${hostel._id}`)}>
                              <FaEdit />
                            </button>
                            <button className="ld-icon-btn del" title="Delete" onClick={() => toast.info('Delete feature coming soon')}>
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="ld-hostel-cards">
                {filtered.map(hostel => (
                  <div key={hostel._id} className="ld-hostel-card">
                    <div className="ld-hostel-card-head">
                      <div>
                        <div className="ld-hostel-card-name">{hostel.name}</div>
                        <div className="ld-hostel-card-addr">
                          <FaMapMarkerAlt style={{ color: 'var(--teal)' }} />
                          {hostel.address}
                        </div>
                      </div>
                      <span className={`ld-badge ${hostel.verified ? 'ld-badge-verified' : 'ld-badge-pending'}`}>
                        {hostel.verified ? <><FaCheckCircle /> Verified</> : 'Pending'}
                      </span>
                    </div>
                    <div className="ld-hostel-card-body">
                      <div className="ld-hostel-card-stat">
                        <div className="ld-hcs-label">Price / Month</div>
                        <div className="ld-hcs-value" style={{ color: 'var(--teal)' }}>
                          MK {hostel.price.toLocaleString()}
                        </div>
                      </div>
                      <div className="ld-hostel-card-stat">
                        <div className="ld-hcs-label">Rooms</div>
                        <div className="ld-hcs-value">
                          <FaDoorOpen style={{ color: 'var(--text-light)' }} />
                          {hostel.availableRooms}/{hostel.totalRooms}
                        </div>
                      </div>
                      <div className="ld-hostel-card-stat">
                        <div className="ld-hcs-label">Views</div>
                        <div className="ld-hcs-value">
                          <FaEye style={{ color: 'var(--text-light)' }} />
                          {hostel.totalViews}
                        </div>
                      </div>
                      <div className="ld-hostel-card-stat">
                        <div className="ld-hcs-label">Rating</div>
                        <div className="ld-hcs-value">
                          <FaStar style={{ color: '#f59e0b' }} />
                          {hostel.rating}
                        </div>
                      </div>
                    </div>
                    <div className="ld-hostel-card-foot">
                      <button className="ld-icon-btn" onClick={() => navigate(`/hostels/${hostel._id}`)}>
                        <FaEye />
                      </button>
                      <button className="ld-icon-btn" onClick={() => navigate(`/hostels/edit/${hostel._id}`)}>
                        <FaEdit />
                      </button>
                      <button className="ld-icon-btn del" onClick={() => toast.info('Delete feature coming soon')}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LandlordDashboard;