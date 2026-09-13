import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHostel } from '../context/HostelContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  FaHome, FaBookmark, FaEnvelope, FaBell,
  FaCog, FaSignOutAlt, FaArrowRight,
  FaCheckCircle, FaMapMarkerAlt, FaStar, FaPhone,
  FaSearch, FaBars, FaTimes, FaInfoCircle, FaPhoneAlt,
  FaHeart, FaUser, FaBed, FaDoorOpen, FaEye
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import Pagination from '../components/common/Pagination';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&display=swap');
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
    --green-check: #22c55e;
    --text-light:  #9ca3af;
    --success:     #059669;
    --success-pale:#ecfdf5;
    --danger:      #dc2626;
    --card-radius: 16px;
    --nav-h:       64px;
    --sidebar-w:   260px;
    --transition:  all 0.22s ease;
  }

  html { font-size: 16px; scroll-behavior: smooth; }
  body { font-family: 'Manrope', sans-serif; background: var(--gray-bg); color: var(--dark); min-height: 100vh; overflow-x: hidden; }
  a { text-decoration: none; color: inherit; }

  /* ── TOPBAR ── */
  .td-topbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    height: var(--nav-h); background: var(--teal-dark);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; box-shadow: 0 2px 20px rgba(13,74,64,0.5);
  }
  .td-topbar-left { display: flex; align-items: center; gap: 1rem; }
  .td-logo { display: flex; align-items: center; gap: 0.65rem; text-decoration: none; }
  .td-logo-icon { width: 38px; height: 38px; border-radius: 10px; overflow: hidden; border: 2px solid rgba(255,255,255,0.15); flex-shrink: 0; }
  .td-logo-icon img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .td-logo-name { font-size: 1.1rem; font-weight: 800; color: var(--white); letter-spacing: -0.3px; }
  .td-topbar-right { display: flex; align-items: center; gap: 0.6rem; }
  .td-topbar-btn { display: flex; align-items: center; gap: 0.4rem; padding: 0.42rem 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.18); background: rgba(255,255,255,0.09); color: rgba(255,255,255,0.85); font-size: 0.83rem; font-weight: 600; font-family: 'Manrope', sans-serif; cursor: pointer; transition: var(--transition); text-decoration: none; }
  .td-topbar-btn:hover { background: rgba(255,255,255,0.18); color: white; }
  .td-topbar-btn.danger { color: #fca5a5; border-color: rgba(252,165,165,0.3); }
  .td-topbar-btn.danger:hover { background: rgba(220,38,38,0.2); }
  .td-hamburger { display: none; background: none; border: none; color: white; font-size: 1.3rem; cursor: pointer; padding: 0.4rem; border-radius: 6px; }
  .td-hamburger:hover { background: rgba(255,255,255,0.1); }

  /* ── LAYOUT ── */
  .td-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 1100; backdrop-filter: blur(2px); }
  .td-overlay.open { display: block; }

  .td-page { padding-top: var(--nav-h); display: grid; grid-template-columns: var(--sidebar-w) 1fr; min-height: 100vh; }

  /* ── SIDEBAR ── */
  .td-sidebar {
    position: fixed; top: var(--nav-h); left: 0; bottom: 0;
    width: var(--sidebar-w); background: var(--white);
    border-right: 1px solid var(--light-border);
    display: flex; flex-direction: column;
    overflow-y: auto; z-index: 900;
    padding: 1.5rem 0 2rem;
  }
  .td-sidebar::-webkit-scrollbar { width: 3px; }
  .td-sidebar::-webkit-scrollbar-thumb { background: var(--light-border); border-radius: 4px; }

  .td-sidebar-user { padding: 0 1.25rem 1.25rem; margin-bottom: 0.5rem; border-bottom: 1px solid var(--light-border); }
  .td-sidebar-avatar { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, var(--teal-dark), var(--teal-mid)); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 900; margin-bottom: 0.75rem; }
  .td-sidebar-name { font-size: 0.95rem; font-weight: 800; color: var(--dark); line-height: 1.2; }
  .td-sidebar-role { font-size: 0.72rem; font-weight: 700; color: var(--teal-mid); background: var(--teal-light); display: inline-block; padding: 2px 8px; border-radius: 10px; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }

  .td-sidebar-section { padding: 0.65rem 1.5rem 0.2rem; font-size: 0.63rem; font-weight: 800; color: var(--text-light); text-transform: uppercase; letter-spacing: 1.2px; }
  .td-sidebar-link { display: flex; align-items: center; gap: 0.75rem; padding: 0.72rem 1.25rem; color: var(--mid); font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: var(--transition); border: none; background: none; width: 100%; text-align: left; font-family: 'Manrope', sans-serif; text-decoration: none; border-left: 3px solid transparent; margin: 1px 0; }
  .td-sidebar-link:hover { background: var(--teal-pale); color: var(--teal-dark); }
  .td-sidebar-link.active { background: var(--teal-light); color: var(--teal-dark); border-left-color: var(--teal); font-weight: 700; }
  .td-sidebar-link svg { font-size: 0.9rem; width: 18px; flex-shrink: 0; color: var(--teal-mid); }
  .td-sidebar-link.active svg { color: var(--teal); }
  .td-sidebar-divider { border: none; border-top: 1px solid var(--light-border); margin: 0.75rem 0; }
  .td-sidebar-logout { display: flex; align-items: center; gap: 0.75rem; color: var(--danger); font-size: 0.88rem; font-weight: 600; cursor: pointer; background: none; border: none; width: 100%; padding: 0.72rem 1.25rem; font-family: 'Manrope', sans-serif; transition: var(--transition); }
  .td-sidebar-logout:hover { background: #fef2f2; }
  .td-sidebar-logout svg { font-size: 0.9rem; width: 18px; color: var(--danger); }

  /* ── MAIN CONTENT ── */
  .td-main { grid-column: 2; padding: 2rem 2rem 5rem; min-height: calc(100vh - var(--nav-h)); }

  /* ── BANNER ── */
  .td-banner {
    background: linear-gradient(135deg, #05201a 0%, var(--teal-dark) 50%, var(--teal) 100%);
    border-radius: var(--card-radius); padding: 2rem 2.5rem; margin-bottom: 2rem;
    position: relative; overflow: hidden;
  }
  .td-banner::before { content: ''; position: absolute; right: -60px; top: -60px; width: 260px; height: 260px; border-radius: 50%; background: rgba(45,138,114,0.1); border: 1px solid rgba(45,138,114,0.2); }
  .td-banner::after  { content: ''; position: absolute; right: 80px; bottom: -40px; width: 160px; height: 160px; border-radius: 50%; background: rgba(45,138,114,0.07); }
  .td-banner-inner { position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; }
  .td-banner-left h1 { font-family: 'Poppins', sans-serif; font-size: 1.8rem; font-weight: 800; color: white; margin-bottom: 0.35rem; }
  .td-banner-left p { font-size: 0.88rem; color: rgba(255,255,255,0.6); font-weight: 500; }
  .td-banner-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  .td-btn-primary { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.7rem 1.4rem; background: var(--teal-mid); color: white; border: none; border-radius: 10px; font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: var(--transition); font-family: 'Manrope', sans-serif; text-decoration: none; }
  .td-btn-primary:hover { background: var(--teal-dark); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(13,74,64,0.35); }
  .td-btn-ghost { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.7rem 1.4rem; background: rgba(255,255,255,0.1); color: white; border: 1.5px solid rgba(255,255,255,0.22); border-radius: 10px; font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: var(--transition); font-family: 'Manrope', sans-serif; text-decoration: none; }
  .td-btn-ghost:hover { background: rgba(255,255,255,0.18); }

  /* ── STATS ── */
  .td-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
  .td-stat { background: var(--white); border-radius: var(--card-radius); padding: 1.4rem 1.5rem; border: 1px solid var(--light-border); box-shadow: 0 1px 6px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 1rem; transition: var(--transition); cursor: pointer; position: relative; overflow: hidden; }
  .td-stat::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--teal); transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease; }
  .td-stat:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(13,74,64,0.12); }
  .td-stat:hover::after { transform: scaleX(1); }
  .td-stat-icon { width: 48px; height: 48px; border-radius: 13px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
  .ico-teal  { background: var(--teal-light); color: var(--teal); }
  .ico-green { background: var(--success-pale); color: var(--success); }
  .ico-mid   { background: var(--teal-pale); color: var(--teal-mid); }
  .ico-dark  { background: rgba(13,74,64,0.08); color: var(--teal-dark); }
  .td-stat-num { font-size: 1.7rem; font-weight: 900; color: var(--teal-dark); line-height: 1; margin-bottom: 0.25rem; }
  .td-stat-lbl { font-size: 0.73rem; font-weight: 700; color: var(--mid); text-transform: uppercase; letter-spacing: 0.5px; }

  /* ── SECTION HEADER ── */
  .td-sec-hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem; }
  .td-sec-hd h2 { font-family: 'Poppins', sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--teal-dark); display: flex; align-items: center; gap: 0.5rem; }
  .td-sec-hd h2 svg { color: var(--teal-mid); }

  /* ── SEARCH BAR ── */
  .td-search-wrap { background: var(--white); border: 1.5px solid var(--light-border); border-radius: 10px; padding: 0 1rem; display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; transition: var(--transition); }
  .td-search-wrap:focus-within { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(26,92,82,0.1); }
  .td-search-wrap svg { color: var(--text-light); flex-shrink: 0; }
  .td-search-wrap input { flex: 1; border: none; outline: none; font-family: 'Manrope', sans-serif; font-size: 0.9rem; color: var(--dark); padding: 0.75rem 0; background: transparent; }
  .td-search-wrap input::placeholder { color: var(--text-light); }
  .td-search-btn { background: var(--teal); color: white; border: none; border-radius: 7px; padding: 0.45rem 1rem; font-size: 0.82rem; font-weight: 700; cursor: pointer; font-family: 'Manrope', sans-serif; transition: var(--transition); }
  .td-search-btn:hover { background: var(--teal-dark); }

  /* ── PROPERTY GRID ── */
  .td-prop-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 1.25rem; margin-bottom: 2rem; }

  /* ── PROPERTY CARD ── */
  .td-prop-card { background: var(--white); border: 1.5px solid var(--light-border); border-radius: var(--card-radius); overflow: hidden; transition: var(--transition); box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; flex-direction: column; }
  .td-prop-card:hover { transform: translateY(-5px); box-shadow: 0 14px 36px rgba(13,74,64,0.14); border-color: var(--teal-mid); }
  .td-prop-img { position: relative; height: 190px; overflow: hidden; background: var(--teal-light); flex-shrink: 0; }
  .td-prop-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
  .td-prop-card:hover .td-prop-img img { transform: scale(1.06); }
  .td-prop-no-img { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: var(--teal-mid); opacity: 0.4; }
  .td-prop-badges { position: absolute; top: 10px; left: 10px; display: flex; gap: 6px; flex-wrap: wrap; }
  .td-prop-badge { font-size: 0.67rem; font-weight: 700; padding: 3px 9px; border-radius: 20px; backdrop-filter: blur(6px); }
  .td-badge-verified { background: rgba(5,150,105,0.9); color: white; }
  .td-badge-price    { background: rgba(13,74,64,0.88); color: white; }
  .td-badge-rooms    { background: rgba(34,197,94,0.88); color: white; }
  .td-prop-body { padding: 1rem; flex: 1; }
  .td-prop-name { font-size: 0.97rem; font-weight: 800; color: var(--dark); margin-bottom: 0.3rem; line-height: 1.3; }
  .td-prop-loc  { font-size: 0.76rem; color: var(--mid); display: flex; align-items: center; gap: 4px; margin-bottom: 0.65rem; }
  .td-prop-loc svg { color: var(--teal-mid); font-size: 0.7rem; }
  .td-prop-price { font-size: 1.1rem; font-weight: 900; color: var(--teal); margin-bottom: 0.65rem; }
  .td-prop-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .td-chip { display: inline-flex; align-items: center; gap: 4px; background: var(--teal-pale); color: var(--teal-dark); padding: 3px 9px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; }
  .td-chip svg { font-size: 0.65rem; color: var(--teal-mid); }
  .td-prop-foot { padding: 0.85rem 1rem; border-top: 1px solid var(--light-border); display: flex; gap: 0.5rem; }
  .td-view-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.55rem; background: var(--teal); color: white; border: none; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; font-family: 'Manrope', sans-serif; transition: var(--transition); text-decoration: none; }
  .td-view-btn:hover { background: var(--teal-dark); }
  .td-call-btn { display: flex; align-items: center; gap: 0.4rem; padding: 0.55rem 0.9rem; background: var(--teal-light); color: var(--teal); border: 1.5px solid var(--light-border); border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; font-family: 'Manrope', sans-serif; transition: var(--transition); text-decoration: none; }
  .td-call-btn:hover { background: var(--teal); color: white; border-color: var(--teal); }

  /* ── SKELETON ── */
  .td-skeleton { background: linear-gradient(90deg, #f0f4f2 25%, #e4ece8 50%, #f0f4f2 75%); background-size: 200% 100%; border-radius: 8px; animation: shimmer 1.4s infinite; }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  .td-card-skeleton { background: var(--white); border: 1.5px solid var(--light-border); border-radius: var(--card-radius); overflow: hidden; }

  /* ── EMPTY / ERROR ── */
  .td-empty { text-align: center; padding: 4rem 2rem; background: var(--white); border-radius: var(--card-radius); border: 1px solid var(--light-border); }
  .td-empty-icon { width: 72px; height: 72px; background: var(--teal-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: var(--teal); margin: 0 auto 1.25rem; }
  .td-empty h3 { font-family: 'Poppins', sans-serif; font-size: 1.15rem; font-weight: 800; color: var(--teal-dark); margin-bottom: 0.5rem; }
  .td-empty p { color: var(--mid); font-size: 0.88rem; margin-bottom: 1.25rem; }
  .td-empty-btn { background: var(--teal); color: white; border: none; padding: 0.65rem 1.6rem; border-radius: 8px; font-size: 0.88rem; font-weight: 700; cursor: pointer; font-family: 'Manrope', sans-serif; transition: var(--transition); }
  .td-empty-btn:hover { background: var(--teal-dark); }

  /* ── PAGINATION ── */
  .td-pagination { display: flex; justify-content: center; margin-top: 1rem; }

  /* ── QUICK LINKS PANEL ── */
  .td-quick-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
  .td-quick-card { background: var(--white); border: 1.5px solid var(--light-border); border-radius: var(--card-radius); padding: 1.4rem 1rem; text-align: center; cursor: pointer; transition: var(--transition); display: flex; flex-direction: column; align-items: center; gap: 0.6rem; text-decoration: none; color: var(--dark); box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
  .td-quick-card:hover { border-color: var(--teal); box-shadow: 0 8px 28px rgba(26,92,82,0.16); transform: translateY(-4px); }
  .td-quick-ico { width: 50px; height: 50px; border-radius: 13px; background: var(--teal-light); color: var(--teal); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; transition: var(--transition); }
  .td-quick-card:hover .td-quick-ico { background: var(--teal); color: white; }
  .td-quick-title { font-size: 0.86rem; font-weight: 800; color: var(--dark); }
  .td-quick-sub   { font-size: 0.73rem; color: var(--mid); font-weight: 500; }

  /* ── MOBILE ── */
  @media (max-width: 1024px) {
    .td-stats { grid-template-columns: repeat(2, 1fr); }
    .td-quick-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 768px) {
    :root { --sidebar-w: 0px; --nav-h: 56px; }
    .td-topbar { padding: 0 1rem; }
    .td-hamburger { display: block; }
    .td-topbar-right .td-topbar-btn { display: none; }
    .td-page { grid-template-columns: 1fr; }
    .td-sidebar { transform: translateX(-100%); width: 280px; transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); }
    .td-sidebar.open { transform: translateX(0); }
    .td-main { grid-column: 1; padding: 1.25rem 1rem 5rem; }
    .td-banner { padding: 1.5rem; }
    .td-banner-left h1 { font-size: 1.4rem; }
    .td-banner-actions { width: 100%; }
    .td-stats { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
    .td-prop-grid { grid-template-columns: 1fr; }
    .td-quick-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
  }

  @media (max-width: 480px) {
    .td-banner-left h1 { font-size: 1.2rem; }
    .td-stats { gap: 0.6rem; }
    .td-stat { padding: 1rem; }
    .td-stat-num { font-size: 1.4rem; }
    .td-banner-actions { flex-direction: column; }
    .td-btn-primary, .td-btn-ghost { width: 100%; justify-content: center; }
  }
`;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { hostels, loading, filters, pagination, fetchHostels, updateFilters, resetFilters, changePage } = useHostel();

  const [searchInput,    setSearchInput]    = useState('');
  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [statsData,      setStatsData]      = useState({ bookings: 0, messages: 0, saved: 0, notifications: 0 });
  const [statsLoading,   setStatsLoading]   = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (user?.role !== 'tenant') { navigate('/landlord-dashboard'); return; }
    fetchHostels();
  }, [isAuthenticated, user, filters]);

  const fetchStats = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'tenant') return;
    try {
      setStatsLoading(true);
      const [bookingsRes, messagesRes, notifsRes] = await Promise.allSettled([
        api.get('/bookings?limit=1'),
        api.get('/messages/unread-count'),
        api.get('/notifications/unread-count'),
      ]);
      setStatsData({
        bookings:      bookingsRes.status  === 'fulfilled' ? (bookingsRes.value.data?.total  || bookingsRes.value.data?.count || 0) : 0,
        messages:      messagesRes.status  === 'fulfilled' ? (messagesRes.value.data?.count  || 0) : 0,
        notifications: notifsRes.status    === 'fulfilled' ? (notifsRes.value.data?.count    || 0) : 0,
        saved: 0,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({ ...filters, search: searchInput, page: 1 });
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  if (!isAuthenticated) return null;

  const initials = ((user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')).toUpperCase() || 'TN';

  const stats = [
    { label: 'My Bookings',  value: statsLoading ? '—' : statsData.bookings,      icon: <FaBookmark />, color: 'ico-teal',  link: '/bookings'       },
    { label: 'Messages',     value: statsLoading ? '—' : statsData.messages,      icon: <FaEnvelope />, color: 'ico-mid',   link: '/messages'       },
    { label: 'Saved',        value: statsLoading ? '—' : statsData.saved,         icon: <FaHeart />,    color: 'ico-green', link: '/favorites'      },
    { label: 'Properties',   value: pagination?.total || hostels.length,          icon: <FaHome />,     color: 'ico-dark'                           },
  ];

  const navLinks = [
    { icon: <FaHome />,       label: 'Browse Properties', path: '/hostels'        },
    { icon: <FaBookmark />,   label: 'My Bookings',       path: '/bookings'       },
    { icon: <FaEnvelope />,   label: 'Messages',          path: '/messages',      badge: statsData.messages > 0 ? statsData.messages : null },
    { icon: <FaBell />,       label: 'Notifications',     path: '/notifications', badge: statsData.notifications > 0 ? statsData.notifications : null },
    { icon: <FaInfoCircle />, label: 'About Us',          path: '/about'          },
    { icon: <FaPhoneAlt />,   label: 'Contact',           path: '/contact'        },
    { icon: <FaUser />,       label: 'My Profile',        path: '/profile'        },
  ];

  const quickActions = [
    { icon: <FaHome />,     title: 'Browse All',   sub: 'Find your next home',   path: '/hostels'    },
    { icon: <FaBookmark />, title: 'My Bookings',  sub: 'View your bookings',    path: '/bookings'   },
    { icon: <FaEnvelope />, title: 'Messages',     sub: statsData.messages > 0 ? `${statsData.messages} unread` : 'No new messages', path: '/messages' },
  ];

  const renderPropertyCard = (hostel) => {
    const images = hostel.images || [];
    const rating = (hostel.averageRating || 4.5).toFixed(1);
    return (
      <div key={hostel._id} className="td-prop-card">
        <div className="td-prop-img">
          {images.length > 0
            ? <img src={images[0]} alt={hostel.name} />
            : <div className="td-prop-no-img"><FaHome /></div>
          }
          <div className="td-prop-badges">
            {hostel.verified && <span className="td-prop-badge td-badge-verified">✓ Verified</span>}
            {hostel.availableRooms > 0 && <span className="td-prop-badge td-badge-rooms">{hostel.availableRooms} free</span>}
          </div>
        </div>

        <div className="td-prop-body">
          <div className="td-prop-name">{hostel.name}</div>
          <div className="td-prop-loc"><FaMapMarkerAlt /> {hostel.address}</div>
          <div className="td-prop-price">MK {hostel.price?.toLocaleString()}<span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mid)' }}>/mo</span></div>
          <div className="td-prop-chips">
            <span className="td-chip"><FaBed /> {hostel.type}</span>
            <span className="td-chip"><FaStar style={{ color: '#f59e0b' }} /> {rating}</span>
            <span className="td-chip"><FaDoorOpen /> {hostel.availableRooms}/{hostel.totalRooms}</span>
          </div>
        </div>

        <div className="td-prop-foot">
          <button className="td-view-btn" onClick={() => navigate(`/hostels/${hostel._id}`)}>
            View Details <FaArrowRight />
          </button>
          {hostel.contactPhone && (
            <a className="td-call-btn" href={`tel:${hostel.contactPhone}`}>
              <FaPhone />
            </a>
          )}
        </div>
      </div>
    );
  };

  const SkeletonCard = () => (
    <div className="td-card-skeleton">
      <div className="td-skeleton" style={{ height: 190 }} />
      <div style={{ padding: '1rem' }}>
        <div className="td-skeleton" style={{ height: 16, marginBottom: 8, width: '70%' }} />
        <div className="td-skeleton" style={{ height: 12, marginBottom: 8, width: '50%' }} />
        <div className="td-skeleton" style={{ height: 20, marginBottom: 10, width: '40%' }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="td-skeleton" style={{ height: 24, width: 70, borderRadius: 20 }} />
          <div className="td-skeleton" style={{ height: 24, width: 55, borderRadius: 20 }} />
        </div>
      </div>
      <div style={{ padding: '0.85rem 1rem', borderTop: '1px solid var(--light-border)', display: 'flex', gap: 8 }}>
        <div className="td-skeleton" style={{ flex: 1, height: 36, borderRadius: 8 }} />
        <div className="td-skeleton" style={{ width: 44, height: 36, borderRadius: 8 }} />
      </div>
    </div>
  );

  return (
    <>
      <style>{styles}</style>

      {/* TOPBAR */}
      <nav className="td-topbar">
        <div className="td-topbar-left">
          <button className="td-hamburger" onClick={() => setSidebarOpen(o => !o)}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <Link to="/" className="td-logo">
            <div className="td-logo-icon"><img src="/PezaHostelLogo.png" alt="PezaNyumba" /></div>
            <span className="td-logo-name">PezaNyumba</span>
          </Link>
        </div>
        <div className="td-topbar-right">
          <Link to="/profile" className="td-topbar-btn"><FaUser /> {user?.firstName}</Link>
          <button className="td-topbar-btn danger" onClick={handleLogout}><FaSignOutAlt /> Sign Out</button>
        </div>
      </nav>

      {/* OVERLAY */}
      <div className={`td-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

      <div className="td-page">
        {/* SIDEBAR */}
        <aside className={`td-sidebar${sidebarOpen ? ' open' : ''}`}>
          <div className="td-sidebar-user">
            <div className="td-sidebar-avatar">{initials}</div>
            <div className="td-sidebar-name">{user?.firstName} {user?.lastName}</div>
            <div className="td-sidebar-role">Tenant</div>
          </div>

          <div className="td-sidebar-section">Navigation</div>
          {navLinks.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`td-sidebar-link${window.location.pathname === item.path ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon} {item.label}
              {item.badge && (
                <span style={{ marginLeft: 'auto', background: 'var(--teal)', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '2px 7px', borderRadius: 10 }}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}

          <div className="td-sidebar-divider" />
          <button className="td-sidebar-logout" onClick={handleLogout}>
            <FaSignOutAlt /> Sign Out
          </button>
        </aside>

        {/* MAIN */}
        <main className="td-main">
          {/* BANNER */}
          <div className="td-banner">
            <div className="td-banner-inner">
              <div className="td-banner-left">
                <h1>Welcome back, {user?.firstName}! 🏠</h1>
                <p>Discover your perfect home across Malawi</p>
              </div>
              <div className="td-banner-actions">
                <Link to="/hostels" className="td-btn-primary"><FaSearch /> Browse Properties</Link>
                <Link to="/messages" className="td-btn-ghost"><FaEnvelope /> Messages {statsData.messages > 0 && `(${statsData.messages})`}</Link>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="td-stats">
            {stats.map((s, i) => (
              <div key={i} className="td-stat" onClick={() => s.link && navigate(s.link)}>
                <div className={`td-stat-icon ${s.color}`}>{s.icon}</div>
                <div>
                  <div className="td-stat-num">{s.value}</div>
                  <div className="td-stat-lbl">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <div className="td-sec-hd">
            <h2><FaArrowRight /> Quick Access</h2>
          </div>
          <div className="td-quick-grid">
            {quickActions.map((item, i) => (
              <Link key={i} to={item.path} className="td-quick-card">
                <div className="td-quick-ico">{item.icon}</div>
                <div className="td-quick-title">{item.title}</div>
                <div className="td-quick-sub">{item.sub}</div>
              </Link>
            ))}
          </div>

          {/* PROPERTIES */}
          <div className="td-sec-hd">
            <h2><FaHome /> Available Properties</h2>
          </div>

          {/* SEARCH */}
          <form onSubmit={handleSearch} className="td-search-wrap">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by name, location, type..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <button type="submit" className="td-search-btn">Search</button>
          </form>

          {/* GRID */}
          {loading ? (
            <div className="td-prop-grid">
              {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : hostels.length === 0 ? (
            <div className="td-empty">
              <div className="td-empty-icon"><FaHome /></div>
              <h3>No properties found</h3>
              <p>Try adjusting your search or clear filters to see all listings.</p>
              <button className="td-empty-btn" onClick={resetFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="td-prop-grid">
                {hostels.map(h => renderPropertyCard(h))}
              </div>
              {pagination?.totalPages > 1 && (
                <div className="td-pagination">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={page => { changePage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default StudentDashboard;