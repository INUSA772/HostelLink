import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaPlus, FaHome, FaCalendarCheck, FaEnvelope,
  FaCog, FaSignOutAlt, FaEdit, FaTrash, FaEye,
  FaStar, FaMapMarkerAlt, FaDoorOpen, FaCheckCircle,
  FaBell, FaUser, FaSearch, FaBars, FaTimes, FaBuilding
} from 'react-icons/fa';
import { toast } from 'react-toastify';

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
    --card-radius: 14px;
    --transition: all 0.22s ease;
  }

  html { font-size: 16px; -webkit-text-size-adjust: 100%; }

  body {
    font-family: 'Manrope', sans-serif;
    background: var(--gray-bg);
    color: var(--text-dark);
    min-height: 100vh;
  }

  /* ── TOPBAR ─────────────────────────────── */
  .ld-topbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    background: var(--navy);
    height: 62px;
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 0 1.75rem;
    box-shadow: 0 2px 16px rgba(0,0,0,0.25);
  }

  .ld-topbar-left { display: flex; align-items: center; gap: 1rem; }

  .ld-logo {
    display: flex; align-items: center; gap: 0.65rem;
    text-decoration: none;
  }

  .ld-logo-mark {
    width: 36px; height: 36px;
    background: var(--orange);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; color: white;
    box-shadow: 0 3px 10px rgba(232,80,26,0.4);
  }

  .ld-logo-name {
    font-size: 1.15rem; font-weight: 800;
    color: var(--white); letter-spacing: -0.3px;
  }

  .ld-logo-badge {
    font-size: 0.62rem; font-weight: 700;
    background: rgba(232,80,26,0.25);
    color: #ffb49a;
    border: 1px solid rgba(232,80,26,0.4);
    padding: 2px 8px; border-radius: 20px;
    letter-spacing: 0.8px; text-transform: uppercase;
  }

  .ld-topbar-right { display: flex; align-items: center; gap: 0.6rem; }

  .ld-topbar-btn {
    display: flex; align-items: center; gap: 0.4rem;
    padding: 0.45rem 1rem; border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.8);
    font-size: 0.85rem; font-weight: 600;
    font-family: 'Manrope', sans-serif;
    cursor: pointer; transition: var(--transition);
    text-decoration: none;
  }

  .ld-topbar-btn:hover { background: rgba(255,255,255,0.14); color: white; }

  .ld-topbar-btn.danger { color: #fca5a5; border-color: rgba(252,165,165,0.25); }
  .ld-topbar-btn.danger:hover { background: rgba(220,38,38,0.2); }

  .ld-hamburger {
    display: none; background: none; border: none;
    color: white; font-size: 1.3rem;
    cursor: pointer; padding: 0.4rem;
  }

  /* ── DRAWER ─────────────────────────────── */
  .ld-overlay {
    display: none; position: fixed; inset: 0;
    background: rgba(0,0,0,0.55); z-index: 1100;
  }
  .ld-overlay.open { display: block; }

  .ld-drawer {
    position: fixed; top: 0; left: 0; bottom: 0;
    width: 285px; background: var(--navy);
    z-index: 1200;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
    display: flex; flex-direction: column; overflow-y: auto;
  }
  .ld-drawer.open { transform: translateX(0); }

  .ld-drawer-top {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.1rem 1.25rem;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .ld-drawer-close {
    background: none; border: none;
    color: rgba(255,255,255,0.5);
    font-size: 1.2rem; cursor: pointer; padding: 0.3rem;
  }

  .ld-drawer-nav { flex: 1; padding: 0.75rem 0; }

  .ld-drawer-link {
    display: flex; align-items: center; gap: 0.9rem;
    padding: 0.9rem 1.5rem;
    color: rgba(255,255,255,0.7);
    font-size: 0.95rem; font-weight: 600;
    cursor: pointer; transition: var(--transition);
    border: none; background: none;
    width: 100%; text-align: left;
    font-family: 'Manrope', sans-serif;
  }
  .ld-drawer-link:hover { background: rgba(255,255,255,0.07); color: white; }
  .ld-drawer-link svg { color: var(--orange); font-size: 0.95rem; }

  .ld-drawer-foot {
    padding: 1.1rem 1.5rem;
    border-top: 1px solid rgba(255,255,255,0.08);
  }

  .ld-drawer-logout {
    display: flex; align-items: center; gap: 0.75rem;
    color: #fca5a5; font-size: 0.9rem; font-weight: 600;
    cursor: pointer; background: none; border: none;
    font-family: 'Manrope', sans-serif;
  }

  /* ── PAGE ───────────────────────────────── */
  .ld-page { padding-top: 62px; min-height: 100vh; }

  /* ── BANNER ─────────────────────────────── */
  .ld-banner {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy2) 55%, #1c2e72 100%);
    padding: 2.75rem 2rem 3.25rem;
    position: relative; overflow: hidden;
  }

  .ld-banner::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 80% 50%, rgba(232,80,26,0.14) 0%, transparent 60%);
  }

  .ld-banner::after {
    content: '';
    position: absolute; right: -60px; top: -60px;
    width: 280px; height: 280px; border-radius: 50%;
    background: rgba(232,80,26,0.06);
    border: 1px solid rgba(232,80,26,0.1);
  }

  .ld-banner-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; justify-content: space-between;
    align-items: flex-end; gap: 2rem; flex-wrap: wrap;
    position: relative; z-index: 1;
  }

  .ld-banner-eyebrow {
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 1.8px; text-transform: uppercase;
    color: var(--orange); margin-bottom: 0.5rem;
  }

  .ld-banner h1 {
    font-size: 2rem; font-weight: 900;
    color: white; line-height: 1.15;
    margin-bottom: 0.5rem; letter-spacing: -0.5px;
  }

  .ld-banner p {
    font-size: 0.9rem; color: rgba(255,255,255,0.55); font-weight: 500;
  }

  .ld-banner-btns { display: flex; gap: 0.75rem; flex-shrink: 0; }

  .ld-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.75rem 1.5rem; border-radius: 9px;
    font-size: 0.9rem; font-weight: 700;
    font-family: 'Manrope', sans-serif;
    cursor: pointer; transition: var(--transition);
    border: none; text-decoration: none; white-space: nowrap;
  }

  .ld-btn-orange {
    background: var(--orange); color: white;
    box-shadow: 0 4px 16px rgba(232,80,26,0.35);
  }
  .ld-btn-orange:hover {
    background: var(--orange-light);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(232,80,26,0.45);
  }

  .ld-btn-ghost {
    background: rgba(255,255,255,0.08); color: white;
    border: 1.5px solid rgba(255,255,255,0.2);
  }
  .ld-btn-ghost:hover { background: rgba(255,255,255,0.15); }

  /* ── MAIN ───────────────────────────────── */
  .ld-main {
    max-width: 1200px; margin: 0 auto;
    padding: 2rem 1.5rem 5rem;
  }

  /* ── STATS ──────────────────────────────── */
  .ld-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem; margin-bottom: 2.5rem;
  }

  .ld-stat {
    background: white; border-radius: var(--card-radius);
    padding: 1.5rem; border: 1px solid var(--gray-light);
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    display: flex; align-items: center; gap: 1rem;
    transition: var(--transition);
    position: relative; overflow: hidden;
  }

  .ld-stat::after {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 4px; background: var(--orange);
    transform: scaleY(0); transition: var(--transition);
    transform-origin: bottom;
  }

  .ld-stat:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.09);
    transform: translateY(-3px);
  }
  .ld-stat:hover::after { transform: scaleY(1); }

  .ld-stat-ico {
    width: 50px; height: 50px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; flex-shrink: 0;
  }

  .ico-orange { background: var(--orange-pale); color: var(--orange); }
  .ico-navy   { background: #eef1fb; color: var(--blue); }
  .ico-green  { background: var(--success-pale); color: var(--success); }
  .ico-amber  { background: #fffbeb; color: #d97706; }

  .ld-stat-num {
    font-size: 1.9rem; font-weight: 900;
    color: var(--navy); line-height: 1; margin-bottom: 0.3rem;
  }

  .ld-stat-lbl {
    font-size: 0.78rem; font-weight: 700;
    color: var(--text-mid); text-transform: uppercase; letter-spacing: 0.5px;
  }

  /* ── SECTION HEADER ─────────────────────── */
  .ld-sec-hd {
    display: flex; align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;
  }

  .ld-sec-hd h2 {
    font-size: 1.2rem; font-weight: 800; color: var(--navy);
    display: flex; align-items: center; gap: 0.5rem;
  }
  .ld-sec-hd h2 svg { color: var(--orange); }

  /* ── QUICK ACTIONS ──────────────────────── */
  .ld-quick {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1rem; margin-bottom: 2.5rem;
  }

  .ld-quick-card {
    background: white; border: 1.5px solid var(--gray-light);
    border-radius: var(--card-radius);
    padding: 1.5rem 1rem; text-align: center; cursor: pointer;
    transition: var(--transition);
    display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    font-family: 'Manrope', sans-serif;
  }
  .ld-quick-card:hover {
    border-color: var(--orange);
    box-shadow: 0 6px 24px rgba(232,80,26,0.12);
    transform: translateY(-3px);
  }

  .ld-quick-ico {
    width: 52px; height: 52px; border-radius: 13px;
    background: var(--orange-pale); color: var(--orange);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.25rem; transition: var(--transition);
  }
  .ld-quick-card:hover .ld-quick-ico { background: var(--orange); color: white; }

  .ld-quick-title { font-size: 0.9rem; font-weight: 800; color: var(--text-dark); }
  .ld-quick-sub { font-size: 0.78rem; color: var(--text-mid); font-weight: 500; }

  /* ── PANEL ──────────────────────────────── */
  .ld-panel {
    background: white; border-radius: var(--card-radius);
    border: 1px solid var(--gray-light);
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    overflow: hidden; margin-bottom: 2rem;
  }

  .ld-panel-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.2rem 1.5rem;
    border-bottom: 1px solid var(--gray-light);
    background: #f9fafb;
    flex-wrap: wrap; gap: 0.75rem;
  }

  .ld-panel-label {
    font-size: 1rem; font-weight: 800; color: var(--navy);
    display: flex; align-items: center; gap: 0.5rem;
  }
  .ld-panel-label svg { color: var(--orange); }

  .ld-count-pill {
    background: var(--navy); color: white;
    font-size: 0.72rem; font-weight: 700;
    padding: 2px 9px; border-radius: 20px;
  }

  .ld-search-box {
    display: flex; align-items: center; gap: 0.5rem;
    background: white; border: 1px solid var(--gray-light);
    border-radius: 8px; padding: 0.5rem 0.9rem;
    min-width: 200px;
  }
  .ld-search-box input {
    border: none; outline: none;
    font-family: 'Manrope', sans-serif;
    font-size: 0.875rem; color: var(--text-dark);
    width: 100%; background: transparent;
  }
  .ld-search-box svg { color: var(--text-light); flex-shrink: 0; }

  /* TABLE */
  .ld-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }

  .ld-table { width: 100%; border-collapse: collapse; min-width: 720px; }

  .ld-table th {
    background: var(--gray-bg); padding: 0.9rem 1.2rem;
    text-align: left; font-size: 0.75rem; font-weight: 800;
    color: var(--navy); text-transform: uppercase;
    letter-spacing: 0.6px;
    border-bottom: 2px solid var(--gray-light); white-space: nowrap;
  }

  .ld-table td {
    padding: 1rem 1.2rem;
    border-bottom: 1px solid var(--gray-light);
    font-size: 0.875rem; vertical-align: middle;
  }

  .ld-table tbody tr:last-child td { border-bottom: none; }
  .ld-table tbody tr:hover { background: #fdf4f1; }

  .ld-cell-name { font-weight: 800; color: var(--navy); font-size: 0.9rem; }

  .ld-badge {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.3rem 0.8rem; border-radius: 20px;
    font-size: 0.75rem; font-weight: 700;
  }
  .ld-badge-verified { background: var(--success-pale); color: #065f46; }
  .ld-badge-pending  { background: #fffbeb; color: #92400e; }

  .ld-row-actions { display: flex; gap: 0.45rem; }

  .ld-icon-btn {
    width: 34px; height: 34px; border-radius: 7px;
    border: 1px solid var(--gray-light); background: white;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: var(--text-mid); font-size: 0.85rem; transition: var(--transition);
  }
  .ld-icon-btn:hover { background: var(--navy); color: white; border-color: var(--navy); }
  .ld-icon-btn.del:hover { background: var(--danger); color: white; border-color: var(--danger); }

  /* MOBILE CARDS */
  .ld-m-cards { display: none; flex-direction: column; gap: 0; }

  .ld-m-card {
    border-bottom: 1px solid var(--gray-light);
    padding: 1rem 1.25rem;
  }
  .ld-m-card:last-child { border-bottom: none; }

  .ld-m-card-top {
    display: flex; justify-content: space-between;
    align-items: flex-start; margin-bottom: 0.75rem;
  }

  .ld-m-card-name { font-weight: 800; color: var(--navy); font-size: 0.95rem; }
  .ld-m-card-addr {
    font-size: 0.78rem; color: var(--text-mid);
    display: flex; align-items: center; gap: 0.3rem; margin-top: 0.2rem;
  }

  .ld-m-card-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem; margin-bottom: 0.75rem;
  }

  .ld-m-stat {
    background: var(--gray-bg); border-radius: 8px;
    padding: 0.5rem 0.6rem; text-align: center;
  }

  .ld-m-stat-val {
    font-size: 0.9rem; font-weight: 800;
    color: var(--navy); line-height: 1; margin-bottom: 0.15rem;
  }

  .ld-m-stat-lbl {
    font-size: 0.65rem; font-weight: 700;
    color: var(--text-light);
    text-transform: uppercase; letter-spacing: 0.4px;
  }

  .ld-m-card-foot {
    display: flex; justify-content: flex-end; gap: 0.5rem;
  }

  /* EMPTY */
  .ld-empty { text-align: center; padding: 4rem 2rem; }

  .ld-empty-ico {
    width: 76px; height: 76px; background: var(--orange-pale);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem; color: var(--orange); margin: 0 auto 1.25rem;
  }

  .ld-empty h3 { font-size: 1.3rem; font-weight: 800; color: var(--navy); margin-bottom: 0.5rem; }
  .ld-empty p { color: var(--text-mid); font-size: 0.9rem; margin-bottom: 1.5rem; }

  /* ── RESPONSIVE ─────────────────────────── */
  @media (max-width: 1024px) {
    .ld-stats { grid-template-columns: repeat(2, 1fr); }
    .ld-quick { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 768px) {
    .ld-topbar { padding: 0 1rem; }
    .ld-hamburger { display: block; }
    .ld-topbar-right .ld-topbar-btn { display: none; }

    .ld-banner { padding: 1.75rem 1.25rem 2.25rem; }
    .ld-banner h1 { font-size: 1.6rem; }
    .ld-banner p { font-size: 0.85rem; }
    .ld-banner-btns { width: 100%; }
    .ld-btn { flex: 1; justify-content: center; padding: 0.7rem 1rem; }

    .ld-main { padding: 1.25rem 0.9rem 4rem; }

    .ld-stats { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
    .ld-stat { padding: 1.1rem; gap: 0.75rem; }
    .ld-stat-num { font-size: 1.6rem; }
    .ld-stat-ico { width: 44px; height: 44px; font-size: 1.05rem; }

    .ld-quick { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
    .ld-quick-card { padding: 1.2rem 0.75rem; }
    .ld-quick-ico { width: 46px; height: 46px; font-size: 1.1rem; }

    .ld-panel-head { padding: 1rem; }
    .ld-search-box { min-width: 0; flex: 1; }

    .ld-table-wrap { display: none; }
    .ld-m-cards { display: flex; }
  }

  @media (max-width: 480px) {
    .ld-banner h1 { font-size: 1.35rem; }
    .ld-banner-btns { flex-direction: column; }
    .ld-btn { width: 100%; }

    .ld-stats { gap: 0.6rem; }
    .ld-stat-num { font-size: 1.5rem; }

    .ld-quick { gap: 0.6rem; }
    .ld-quick-sub { display: none; }

    .ld-panel-head { flex-direction: column; align-items: stretch; }
    .ld-search-box { max-width: 100%; }
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
    { label: 'Active Listings', value: hostels.length, icon: <FaBuilding />, color: 'ico-orange' },
    { label: 'Total Bookings', value: hostels.reduce((a, h) => a + h.bookings, 0), icon: <FaCalendarCheck />, color: 'ico-navy' },
    { label: 'Total Views', value: hostels.reduce((a, h) => a + h.totalViews, 0), icon: <FaEye />, color: 'ico-green' },
    { label: 'Avg Rating', value: (hostels.reduce((a, h) => a + h.rating, 0) / hostels.length).toFixed(1), icon: <FaStar />, color: 'ico-amber' },
  ];

  const quickActions = [
    { icon: <FaPlus />, title: 'List Hostel', sub: 'Add property', action: () => navigate('/hostels/create') },
    { icon: <FaEnvelope />, title: 'Messages', sub: 'Chat with students', action: () => navigate('/messages') },
    { icon: <FaBell />, title: 'Notifications', sub: 'Bookings & alerts', action: () => navigate('/notifications') },
    { icon: <FaUser />, title: 'My Profile', sub: 'Account settings', action: () => navigate('/profile') },
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

      {/* DRAWER */}
      <div className={`ld-overlay${drawerOpen ? ' open' : ''}`} onClick={() => setDrawerOpen(false)} />
      <div className={`ld-drawer${drawerOpen ? ' open' : ''}`}>
        <div className="ld-drawer-top">
          <a href="/" className="ld-logo">
            <div className="ld-logo-mark"><FaHome /></div>
            <span className="ld-logo-name">HostelLink</span>
          </a>
          <button className="ld-drawer-close" onClick={() => setDrawerOpen(false)}><FaTimes /></button>
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
            <button key={i} className="ld-drawer-link" onClick={() => { navigate(item.path); setDrawerOpen(false); }}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="ld-drawer-foot">
          <button className="ld-drawer-logout" onClick={handleLogout}><FaSignOutAlt /> Sign Out</button>
        </div>
      </div>

      {/* TOPBAR */}
      <nav className="ld-topbar">
        <div className="ld-topbar-left">
          <button className="ld-hamburger" onClick={() => setDrawerOpen(true)}><FaBars /></button>
          <a href="/" className="ld-logo">
            <div className="ld-logo-mark"><FaHome /></div>
            <span className="ld-logo-name">HostelLink</span>
            <span className="ld-logo-badge">Owner</span>
          </a>
        </div>
        <div className="ld-topbar-right">
          <a href="/profile" className="ld-topbar-btn"><FaUser /> Profile</a>
          <button className="ld-topbar-btn danger" onClick={handleLogout}><FaSignOutAlt /> Sign Out</button>
        </div>
      </nav>

      <div className="ld-page">
        {/* BANNER */}
        <div className="ld-banner">
          <div className="ld-banner-inner">
            <div>
              <div className="ld-banner-eyebrow">Owner Portal</div>
              <h1>Welcome, {user?.firstName || 'Landlord'} 🏢</h1>
              <p>Manage your properties and track your performance</p>
            </div>
            <div className="ld-banner-btns">
              <button className="ld-btn ld-btn-orange" onClick={() => navigate('/hostels/create')}>
                <FaPlus /> Add New Hostel
              </button>
              <button className="ld-btn ld-btn-ghost" onClick={() => navigate('/messages')}>
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
                <div>
                  <div className="ld-stat-num">{s.value}</div>
                  <div className="ld-stat-lbl">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <div className="ld-sec-hd">
            <h2><FaBuilding /> Quick Actions</h2>
          </div>
          <div className="ld-quick">
            {quickActions.map((item, i) => (
              <div key={i} className="ld-quick-card" onClick={item.action}>
                <div className="ld-quick-ico">{item.icon}</div>
                <div className="ld-quick-title">{item.title}</div>
                <div className="ld-quick-sub">{item.sub}</div>
              </div>
            ))}
          </div>

          {/* MY HOSTELS */}
          <div className="ld-sec-hd">
            <h2><FaHome /> My Hostels</h2>
            <button
              className="ld-btn ld-btn-orange"
              style={{ fontSize: '0.82rem', padding: '0.55rem 1.1rem' }}
              onClick={() => navigate('/hostels/create')}
            >
              <FaPlus /> Add Hostel
            </button>
          </div>

          {hostels.length === 0 ? (
            <div className="ld-panel">
              <div className="ld-empty">
                <div className="ld-empty-ico"><FaBuilding /></div>
                <h3>No hostels listed yet</h3>
                <p>Start by adding your first property to attract students</p>
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
                      <th>Price / Month</th>
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
                        <td><span className="ld-cell-name">{hostel.name}</span></td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-mid)', fontSize: '0.85rem' }}>
                            <FaMapMarkerAlt style={{ color: 'var(--orange)', flexShrink: 0 }} />
                            {hostel.address}
                          </span>
                        </td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <FaDoorOpen style={{ color: 'var(--text-light)' }} />
                            <strong>{hostel.availableRooms}</strong>/{hostel.totalRooms}
                          </span>
                        </td>
                        <td style={{ fontWeight: 800, color: 'var(--orange)' }}>
                          MK {hostel.price.toLocaleString()}
                        </td>
                        <td>{hostel.totalViews}</td>
                        <td><strong>{hostel.bookings}</strong></td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <FaStar style={{ color: '#f59e0b' }} /> {hostel.rating}
                          </span>
                        </td>
                        <td>
                          <span className={`ld-badge ${hostel.verified ? 'ld-badge-verified' : 'ld-badge-pending'}`}>
                            {hostel.verified ? <><FaCheckCircle /> Verified</> : 'Pending'}
                          </span>
                        </td>
                        <td>
                          <div className="ld-row-actions">
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
              <div className="ld-m-cards">
                {filtered.map(hostel => (
                  <div key={hostel._id} className="ld-m-card">
                    <div className="ld-m-card-top">
                      <div>
                        <div className="ld-m-card-name">{hostel.name}</div>
                        <div className="ld-m-card-addr">
                          <FaMapMarkerAlt style={{ color: 'var(--orange)' }} />
                          {hostel.address}
                        </div>
                      </div>
                      <span className={`ld-badge ${hostel.verified ? 'ld-badge-verified' : 'ld-badge-pending'}`}>
                        {hostel.verified ? <><FaCheckCircle /> Verified</> : 'Pending'}
                      </span>
                    </div>
                    <div className="ld-m-card-grid">
                      <div className="ld-m-stat">
                        <div className="ld-m-stat-val" style={{ color: 'var(--orange)', fontSize: '0.82rem' }}>
                          MK {(hostel.price / 1000).toFixed(0)}K
                        </div>
                        <div className="ld-m-stat-lbl">Price</div>
                      </div>
                      <div className="ld-m-stat">
                        <div className="ld-m-stat-val">{hostel.availableRooms}/{hostel.totalRooms}</div>
                        <div className="ld-m-stat-lbl">Rooms</div>
                      </div>
                      <div className="ld-m-stat">
                        <div className="ld-m-stat-val">{hostel.bookings}</div>
                        <div className="ld-m-stat-lbl">Bookings</div>
                      </div>
                      <div className="ld-m-stat">
                        <div className="ld-m-stat-val">{hostel.totalViews}</div>
                        <div className="ld-m-stat-lbl">Views</div>
                      </div>
                      <div className="ld-m-stat">
                        <div className="ld-m-stat-val">{hostel.rating} ⭐</div>
                        <div className="ld-m-stat-lbl">Rating</div>
                      </div>
                    </div>
                    <div className="ld-m-card-foot">
                      <button className="ld-icon-btn" onClick={() => navigate(`/hostels/${hostel._id}`)}><FaEye /></button>
                      <button className="ld-icon-btn" onClick={() => navigate(`/hostels/edit/${hostel._id}`)}><FaEdit /></button>
                      <button className="ld-icon-btn del" onClick={() => toast.info('Delete feature coming soon')}><FaTrash /></button>
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