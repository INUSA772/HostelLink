import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

/* ─── helpers ─────────────────────────────────────────────────────────────── */
const fmt = (n) => n?.toLocaleString() ?? '0';
const timeAgo = (date) => {
  if (!date) return '—';
  const m = Math.floor((Date.now() - new Date(date)) / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

/* ─── styles ──────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --teal:        #1a5c52;
    --teal-dark:   #0d4a40;
    --teal-mid:    #2d8a72;
    --teal-light:  #e8f5f2;
    --teal-pale:   #f0faf7;
    --bg:          #f4f6f4;
    --white:       #ffffff;
    --dark:        #0a0a0a;
    --mid:         #4b5563;
    --light:       #9ca3af;
    --border:      #e2ede9;
    --radius:      12px;
    --radius-lg:   18px;
    --green:       #10b981;
    --green-pale:  #ecfdf5;
    --amber:       #f59e0b;
    --amber-pale:  #fffbeb;
    --red:         #ef4444;
    --red-pale:    #fef2f2;
    --blue:        #3b82f6;
    --blue-pale:   #eff6ff;
    --shadow:      0 4px 16px rgba(0,0,0,0.07);
    --shadow-lg:   0 16px 48px rgba(0,0,0,0.12);
    --transition:  all 0.2s ease;
  }
  html { font-size: 16px; }
  body { font-family: 'Manrope', sans-serif; background: var(--bg); color: var(--dark); min-height: 100vh; -webkit-font-smoothing: antialiased; }
  a { text-decoration: none; color: inherit; }
  button { font-family: 'Manrope', sans-serif; cursor: pointer; border: none; background: none; }

  /* ── TOPBAR ── */
  .a-top {
    position: sticky; top: 0; z-index: 200;
    height: 62px; background: var(--teal-dark);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 1.75rem;
    box-shadow: 0 2px 12px rgba(13,74,64,0.4);
  }
  .a-top-left  { display: flex; align-items: center; gap: 0.85rem; }
  .a-logo      { display: flex; align-items: center; gap: 9px; }
  .a-logo-img  { width: 34px; height: 34px; border-radius: 9px; overflow: hidden; border: 2px solid rgba(255,255,255,0.2); }
  .a-logo-img img { width: 100%; height: 100%; object-fit: cover; }
  .a-logo-name { font-family: 'Poppins', sans-serif; font-size: 0.95rem; font-weight: 700; color: white; }
  .a-admin-pill { font-size: 0.6rem; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; background: rgba(255,255,255,0.12); color: #6ee7b7; border: 1px solid rgba(110,231,183,0.3); padding: 3px 10px; border-radius: 20px; }
  .a-top-right { display: flex; align-items: center; gap: 0.5rem; }
  .a-top-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 0.38rem 0.85rem; border-radius: 8px;
    border: 1.5px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8);
    font-size: 0.78rem; font-weight: 600; transition: var(--transition);
  }
  .a-top-btn:hover { background: rgba(255,255,255,0.15); color: white; }
  .a-top-btn.danger { border-color: rgba(239,68,68,0.3); color: #fca5a5; }
  .a-top-btn.danger:hover { background: rgba(239,68,68,0.2); }

  /* ── TABS ── */
  .a-tabs {
    background: var(--teal-dark); border-top: 1px solid rgba(255,255,255,0.06);
    display: flex; gap: 0; padding: 0 1.75rem; overflow-x: auto;
  }
  .a-tab {
    display: flex; align-items: center; gap: 6px;
    padding: 0.75rem 1.1rem; font-size: 0.82rem; font-weight: 600;
    color: rgba(255,255,255,0.5); border-bottom: 2.5px solid transparent;
    cursor: pointer; transition: var(--transition); white-space: nowrap;
  }
  .a-tab:hover { color: rgba(255,255,255,0.8); }
  .a-tab.active { color: #6ee7b7; border-bottom-color: #6ee7b7; }
  .a-tab-count { background: rgba(255,255,255,0.1); font-size: 0.65rem; font-weight: 700; padding: 1px 6px; border-radius: 10px; }
  .a-tab.active .a-tab-count { background: rgba(110,231,183,0.2); color: #6ee7b7; }

  /* ── BODY ── */
  .a-body { max-width: 1300px; margin: 0 auto; padding: 2rem 1.5rem 5rem; }

  /* ── PAGE HEADER ── */
  .a-page-hd { margin-bottom: 1.75rem; }
  .a-page-hd h1 { font-family: 'Poppins', sans-serif; font-size: 1.5rem; font-weight: 800; color: var(--dark); margin-bottom: 0.2rem; }
  .a-page-hd h1 em { font-style: normal; color: var(--teal); }
  .a-page-hd p { font-size: 0.83rem; color: var(--mid); }

  /* ── STAT CARDS ── */
  .a-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
  .a-stat {
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1.2rem 1.3rem;
    box-shadow: var(--shadow); transition: var(--transition);
    position: relative; overflow: hidden;
  }
  .a-stat::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--accent, var(--teal)); transform: scaleX(0); transition: transform 0.3s ease; transform-origin: left; }
  .a-stat:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
  .a-stat:hover::after { transform: scaleX(1); }
  .a-stat-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
  .a-stat-ico { width: 38px; height: 38px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; }
  .a-stat-badge { font-size: 0.65rem; font-weight: 700; padding: 2px 7px; border-radius: 20px; }
  .a-stat-badge.up  { background: var(--green-pale); color: #065f46; }
  .a-stat-badge.neu { background: var(--teal-light); color: var(--teal-dark); }
  .a-stat-num { font-family: 'Poppins', sans-serif; font-size: 1.9rem; font-weight: 700; color: var(--dark); line-height: 1; margin-bottom: 4px; }
  .a-stat-lbl { font-size: 0.7rem; font-weight: 700; color: var(--light); text-transform: uppercase; letter-spacing: 0.5px; }

  /* ── PANEL ── */
  .a-panel { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow); margin-bottom: 1.5rem; }
  .a-panel-hd {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 1.4rem; border-bottom: 1px solid var(--border);
    background: #fafafa; flex-wrap: wrap; gap: 0.75rem;
  }
  .a-panel-title { font-size: 0.9rem; font-weight: 800; color: var(--dark); display: flex; align-items: center; gap: 6px; }
  .a-panel-title i { color: var(--teal); }
  .a-count { background: var(--teal-dark); color: white; font-size: 0.65rem; font-weight: 700; padding: 2px 8px; border-radius: 20px; }
  .a-panel-tools { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }

  /* ── SEARCH ── */
  .a-search { display: flex; align-items: center; gap: 6px; background: white; border: 1.5px solid var(--border); border-radius: 9px; padding: 0.42rem 0.8rem; min-width: 200px; transition: var(--transition); }
  .a-search:focus-within { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(26,92,82,0.09); }
  .a-search input { border: none; outline: none; font-family: 'Manrope', sans-serif; font-size: 0.8rem; color: var(--dark); background: transparent; width: 100%; }
  .a-search i { color: var(--light); font-size: 0.78rem; }

  /* ── FILTER SELECT ── */
  .a-filter { border: 1.5px solid var(--border); border-radius: 9px; padding: 0.42rem 0.75rem; font-size: 0.8rem; font-family: 'Manrope', sans-serif; color: var(--dark); background: white; outline: none; cursor: pointer; transition: var(--transition); }
  .a-filter:focus { border-color: var(--teal); }

  /* ── BUTTONS ── */
  .a-btn { display: inline-flex; align-items: center; gap: 5px; padding: 0.45rem 0.95rem; border-radius: 8px; font-size: 0.78rem; font-weight: 700; font-family: 'Manrope', sans-serif; cursor: pointer; transition: var(--transition); border: none; white-space: nowrap; }
  .a-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .a-btn-teal    { background: var(--teal); color: white; box-shadow: 0 2px 8px rgba(26,92,82,0.25); }
  .a-btn-teal:hover:not(:disabled)    { background: var(--teal-dark); }
  .a-btn-green   { background: var(--green); color: white; }
  .a-btn-green:hover:not(:disabled)   { opacity: 0.9; }
  .a-btn-red     { background: var(--red); color: white; }
  .a-btn-red:hover:not(:disabled)     { opacity: 0.9; }
  .a-btn-amber   { background: var(--amber); color: white; }
  .a-btn-amber:hover:not(:disabled)   { opacity: 0.9; }
  .a-btn-outline { background: white; color: var(--mid); border: 1.5px solid var(--border); }
  .a-btn-outline:hover:not(:disabled) { border-color: var(--teal); color: var(--teal); }
  .a-btn-sm { padding: 0.32rem 0.7rem; font-size: 0.72rem; border-radius: 7px; }

  /* ── BADGE ── */
  .a-badge { display: inline-flex; align-items: center; gap: 3px; padding: 3px 8px; border-radius: 20px; font-size: 0.68rem; font-weight: 700; white-space: nowrap; }
  .a-badge-v { background: var(--green-pale); color: #065f46; }
  .a-badge-p { background: var(--amber-pale); color: #92400e; }
  .a-badge-r { background: var(--red-pale); color: #991b1b; }
  .a-badge-landlord    { background: var(--teal-light); color: var(--teal-dark); }
  .a-badge-land_seller { background: #fef3c7; color: #92400e; }
  .a-badge-admin       { background: #ede9fe; color: #5b21b6; }
  .a-badge-active      { background: var(--green-pale); color: #065f46; }
  .a-badge-inactive    { background: #f3f4f6; color: var(--light); }

  /* ── USERS TABLE ── */
  .a-tbl-wrap { overflow-x: auto; }
  .a-tbl { width: 100%; border-collapse: collapse; min-width: 700px; }
  .a-tbl th { background: #f9fafb; padding: 0.75rem 1rem; text-align: left; font-size: 0.65rem; font-weight: 800; color: var(--mid); text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 2px solid var(--border); white-space: nowrap; }
  .a-tbl td { padding: 0.85rem 1rem; border-bottom: 1px solid var(--border); font-size: 0.82rem; vertical-align: middle; }
  .a-tbl tbody tr:last-child td { border-bottom: none; }
  .a-tbl tbody tr:hover { background: var(--teal-pale); }
  .a-cell-name { font-weight: 800; color: var(--dark); }
  .a-cell-sub  { font-size: 0.7rem; color: var(--light); margin-top: 1px; }
  .a-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--teal-light); color: var(--teal-dark); display: flex; align-items: center; justify-content: center; font-size: 0.82rem; font-weight: 800; flex-shrink: 0; }
  .a-cell-user { display: flex; align-items: center; gap: 0.65rem; }
  .a-row-actions { display: flex; gap: 0.35rem; flex-wrap: wrap; }

  /* ── PROPERTIES TABLE ── */
  .a-prop-img { width: 46px; height: 38px; border-radius: 7px; object-fit: cover; border: 1px solid var(--border); flex-shrink: 0; }
  .a-prop-no-img { width: 46px; height: 38px; border-radius: 7px; background: var(--teal-light); display: flex; align-items: center; justify-content: center; color: var(--teal); font-size: 0.9rem; flex-shrink: 0; }
  .a-scam-flag { display: flex; align-items: center; gap: 4px; background: var(--red-pale); border: 1px solid #fecaca; border-radius: 7px; padding: 3px 8px; font-size: 0.68rem; font-weight: 700; color: var(--red); }

  /* ── EMPTY ── */
  .a-empty { text-align: center; padding: 3rem 1rem; }
  .a-empty-ico { width: 60px; height: 60px; background: var(--teal-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; color: var(--teal); margin: 0 auto 0.9rem; }
  .a-empty h4 { font-size: 0.95rem; font-weight: 800; color: var(--dark); margin-bottom: 0.3rem; }
  .a-empty p  { font-size: 0.8rem; color: var(--light); }

  /* ── LOADING ── */
  .a-load { min-height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 0.75rem; background: var(--bg); }
  .a-spinner { width: 40px; height: 40px; border: 3px solid var(--teal-light); border-top-color: var(--teal); border-radius: 50%; animation: spin .8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .a-load p { font-size: 0.85rem; color: var(--mid); font-weight: 600; }

  /* ── CONFIRM MODAL ── */
  .a-modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; backdrop-filter: blur(4px); }
  .a-modal { background: white; border-radius: var(--radius-lg); padding: 2rem; max-width: 400px; width: 100%; box-shadow: var(--shadow-lg); animation: pop .2s ease; }
  @keyframes pop { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
  .a-modal-ico { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.4rem; }
  .a-modal-ico.danger { background: var(--red-pale); color: var(--red); }
  .a-modal-ico.warn   { background: var(--amber-pale); color: var(--amber); }
  .a-modal-ico.success{ background: var(--green-pale); color: var(--green); }
  .a-modal h3 { font-size: 1.05rem; font-weight: 800; color: var(--dark); text-align: center; margin-bottom: 0.4rem; }
  .a-modal p  { font-size: 0.82rem; color: var(--mid); text-align: center; margin-bottom: 1.25rem; line-height: 1.6; }
  .a-modal-btns { display: flex; gap: 0.6rem; }
  .a-modal-btns .a-btn { flex: 1; justify-content: center; }

  /* ── TOAST ── */
  .a-toast-wrap { position: fixed; bottom: 1.5rem; right: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; z-index: 2000; }
  .a-toast {
    background: var(--dark); color: white; padding: 0.7rem 1.1rem;
    border-radius: 10px; font-size: 0.82rem; font-weight: 600;
    display: flex; align-items: center; gap: 0.5rem;
    box-shadow: var(--shadow-lg); animation: slideInRight 0.25s ease;
    min-width: 220px;
  }
  @keyframes slideInRight { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
  .a-toast.success { border-left: 4px solid var(--green); }
  .a-toast.error   { border-left: 4px solid var(--red); }
  .a-toast.warn    { border-left: 4px solid var(--amber); }

  /* ── CHARTS ── */
  .a-bar-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.65rem; }
  .a-bar-label { font-size: 0.75rem; color: var(--mid); width: 90px; flex-shrink: 0; text-align: right; font-weight: 600; }
  .a-bar-track { flex: 1; background: var(--teal-light); border-radius: 4px; height: 9px; overflow: hidden; }
  .a-bar-fill  { height: 100%; border-radius: 4px; transition: width 0.8s ease; }
  .a-bar-val   { font-size: 0.75rem; font-weight: 700; color: var(--dark); width: 28px; text-align: right; }

  /* ── GRID ── */
  .a-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }

  @media(max-width:900px) { .a-grid2 { grid-template-columns: 1fr; } }
  @media(max-width:768px) {
    .a-top  { padding: 0 1rem; }
    .a-tabs { padding: 0 1rem; }
    .a-body { padding: 1rem 0.85rem 4rem; }
    .a-stats{ grid-template-columns: 1fr 1fr; gap: 0.65rem; }
    .a-search { min-width: 0; flex: 1; }
    .a-panel-hd { flex-direction: column; align-items: stretch; }
  }
  @media(max-width:480px) { .a-stats { grid-template-columns: 1fr 1fr; } }
`;

/* ─── TOAST ──────────────────────────────────────────────────────────────── */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };
  return { toasts, success: (m) => add(m, 'success'), error: (m) => add(m, 'error'), warn: (m) => add(m, 'warn') };
}
function Toasts({ toasts }) {
  const icons = { success: '✅', error: '❌', warn: '⚠️' };
  return (
    <div className="a-toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`a-toast ${t.type}`}>{icons[t.type]} {t.msg}</div>
      ))}
    </div>
  );
}

/* ─── CONFIRM MODAL ──────────────────────────────────────────────────────── */
function ConfirmModal({ config, onConfirm, onCancel, loading }) {
  if (!config) return null;
  return (
    <div className="a-modal-bg" onClick={e => e.target === e.currentTarget && !loading && onCancel()}>
      <div className="a-modal">
        <div className={`a-modal-ico ${config.type || 'danger'}`}>{config.icon || '🗑️'}</div>
        <h3>{config.title}</h3>
        <p>{config.message}</p>
        <div className="a-modal-btns">
          <button className="a-btn a-btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className={`a-btn a-btn-${config.btnClass || 'red'}`} onClick={onConfirm} disabled={loading}>
            {loading ? 'Working…' : config.confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN ───────────────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();

  const [tab,        setTab]        = useState('overview');
  const [data,       setData]       = useState(null);
  const [users,      setUsers]      = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [confirm,    setConfirm]    = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [propSearch, setPropSearch] = useState('');
  const [propFilter, setPropFilter] = useState('all');

  /* ── auth guard ── */
  useEffect(() => {
    if (authLoading) return;
    if (!user)                   { navigate('/login'); return; }
    if (user.role !== 'admin')   { navigate('/');     return; }
    loadAll();
  }, [authLoading, user]);

  const loadAll = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [statsRes, usersRes, propsRes] = await Promise.all([
        api.get('/admin/stats').catch(() => ({ data: {} })),
        api.get('/admin/users?limit=200').catch(() => ({ data: { users: [] } })),
        api.get('/hostels?limit=200').catch(() => ({ data: { hostels: [] } })),
      ]);
      setData(statsRes.data);
      setUsers(usersRes.data.users || usersRes.data.data || []);
      setProperties(propsRes.data.hostels || propsRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* ── verify user ── */
  const verifyUser = async (userId, action) => {
    setConfirmLoading(true);
    try {
      await api.patch(`/admin/users/${userId}/verify`, { action });
      setUsers(prev => prev.map(u =>
        u._id === userId
          ? { ...u, verificationStatus: action === 'approve' ? 'verified' : 'rejected', verified: action === 'approve' }
          : u
      ));
      toast.success(action === 'approve' ? 'User verified successfully' : 'User rejected');
    } catch {
      toast.error('Action failed. Try again.');
    } finally {
      setConfirmLoading(false);
      setConfirm(null);
    }
  };

  /* ── delete user ── */
  const deleteUser = async (userId) => {
    setConfirmLoading(true);
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success('User deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setConfirmLoading(false);
      setConfirm(null);
    }
  };

  /* ── delete property ── */
  const deleteProperty = async (propId) => {
    setConfirmLoading(true);
    try {
      await api.delete(`/hostels/${propId}`);
      setProperties(prev => prev.filter(p => p._id !== propId));
      toast.success('Property removed');
    } catch {
      toast.error('Delete failed');
    } finally {
      setConfirmLoading(false);
      setConfirm(null);
    }
  };

  /* ── flag scam ── */
  const flagScam = async (propId) => {
    setConfirmLoading(true);
    try {
      await api.patch(`/admin/hostels/${propId}/flag`, { flagged: true, reason: 'Scam / fraudulent listing' });
      setProperties(prev => prev.map(p =>
        p._id === propId ? { ...p, flagged: true, flagReason: 'Scam / fraudulent listing' } : p
      ));
      toast.warn('Property flagged as scam');
    } catch {
      // optimistic even if endpoint not ready
      setProperties(prev => prev.map(p => p._id === propId ? { ...p, flagged: true } : p));
      toast.warn('Property flagged (local)');
    } finally {
      setConfirmLoading(false);
      setConfirm(null);
    }
  };

  /* ── toggle user active ── */
  const toggleActive = async (userId, isActive) => {
    try {
      await api.patch(`/admin/users/${userId}`, { isActive: !isActive });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: !isActive } : u));
      toast.success(isActive ? 'User deactivated' : 'User activated');
    } catch {
      toast.error('Action failed');
    }
  };

  /* ── derived ── */
  const filteredUsers = users.filter(u => {
    const q = userSearch.toLowerCase();
    const matchSearch = !q || `${u.firstName} ${u.lastName} ${u.email} ${u.phone}`.toLowerCase().includes(q);
    const matchFilter = userFilter === 'all'
      || (userFilter === 'pending'  && u.verificationStatus === 'pending')
      || (userFilter === 'verified' && (u.verified || u.verificationStatus === 'verified'))
      || (userFilter === 'landlord' && u.role === 'landlord')
      || (userFilter === 'land_seller' && u.role === 'land_seller');
    return matchSearch && matchFilter;
  });

  const filteredProps = properties.filter(p => {
    const q = propSearch.toLowerCase();
    const matchSearch = !q || `${p.name} ${p.address} ${p.district}`.toLowerCase().includes(q);
    const matchFilter = propFilter === 'all'
      || (propFilter === 'flagged'   && p.flagged)
      || (propFilter === 'verified'  && p.verified)
      || (propFilter === 'pending'   && !p.verified);
    return matchSearch && matchFilter;
  });

  const pendingVerification = users.filter(u => u.verificationStatus === 'pending' || (!u.verified && (u.role === 'landlord' || u.role === 'land_seller')));
  const flaggedProps = properties.filter(p => p.flagged);

  /* ── stats ── */
  const stats = data?.stats || {};
  const statCards = [
    { ico: '👥', lbl: 'Total Users',       val: fmt(users.length),                            accent: 'var(--teal)',  ico_bg: 'var(--teal-light)',  badge: `+${stats.newUsersToday || 0} today`, up: true  },
    { ico: '🏠', lbl: 'Properties Listed', val: fmt(properties.length),                       accent: 'var(--blue)', ico_bg: 'var(--blue-pale)',   badge: `${properties.filter(p=>p.verified).length} verified`, up: false },
    { ico: '⏳', lbl: 'Pending Verify',    val: fmt(pendingVerification.length),              accent: 'var(--amber)',ico_bg: 'var(--amber-pale)',  badge: 'needs action',          up: false },
    { ico: '🚩', lbl: 'Flagged Scams',     val: fmt(flaggedProps.length),                     accent: 'var(--red)',  ico_bg: 'var(--red-pale)',    badge: 'investigate',           up: false },
    { ico: '✅', lbl: 'Verified Users',    val: fmt(users.filter(u=>u.verified).length),      accent: 'var(--green)',ico_bg: 'var(--green-pale)',  badge: 'approved',              up: true  },
    { ico: '📋', lbl: 'Total Bookings',    val: fmt(stats.totalBookings || 0),                accent: '#8b5cf6',    ico_bg: '#ede9fe',            badge: `${stats.pendingBookings||0} pending`, up: false },
  ];

  const regByMonth  = data?.registrationsByMonth || [];
  const maxReg      = Math.max(...regByMonth.map(r => r.count), 1);

  /* ── loading screen ── */
  if (authLoading || loading) return (
    <>
      <style>{styles}</style>
      <div className="a-load">
        <div className="a-spinner" />
        <p>Loading admin panel…</p>
      </div>
    </>
  );

  const TABS = [
    { id: 'overview',   label: 'Overview',   icon: 'fa-chart-line' },
    { id: 'users',      label: 'Users',      icon: 'fa-users',         count: users.length },
    { id: 'verify',     label: 'Verify',     icon: 'fa-shield-alt',    count: pendingVerification.length, urgent: true },
    { id: 'properties', label: 'Properties', icon: 'fa-building',      count: properties.length },
    { id: 'scams',      label: 'Flagged',    icon: 'fa-flag',          count: flaggedProps.length, urgent: flaggedProps.length > 0 },
  ];

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      <Toasts toasts={toast.toasts} />

      <ConfirmModal
        config={confirm}
        onConfirm={confirm?.onConfirm}
        onCancel={() => !confirmLoading && setConfirm(null)}
        loading={confirmLoading}
      />

      {/* ── TOPBAR ── */}
      <nav className="a-top">
        <div className="a-top-left">
          <div className="a-logo">
            <div className="a-logo-img"><img src="/PezaHostelLogo.png" alt="PezaNyumba" /></div>
            <span className="a-logo-name">PezaNyumba</span>
          </div>
          <span className="a-admin-pill">Admin Panel</span>
        </div>
        <div className="a-top-right">
          <button className="a-top-btn" onClick={() => loadAll(true)} disabled={refreshing}>
            <i className={`fa fa-sync-alt${refreshing ? ' fa-spin' : ''}`} />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
          <button className="a-top-btn danger" onClick={() => navigate('/')}>
            <i className="fa fa-arrow-left" /> Exit
          </button>
        </div>
      </nav>

      {/* ── TABS ── */}
      <div className="a-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`a-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            <i className={`fa ${t.icon}`} />
            {t.label}
            {t.count !== undefined && (
              <span className="a-tab-count" style={t.urgent && t.count > 0 ? {background:'rgba(239,68,68,0.25)',color:'#fca5a5'} : {}}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="a-body">

        {/* ════════ OVERVIEW ════════ */}
        {tab === 'overview' && (
          <>
            <div className="a-page-hd">
              <h1>Platform <em>Overview</em></h1>
              <p>Real-time stats for PezaNyumba — logged in as {user?.firstName}</p>
            </div>

            <div className="a-stats">
              {statCards.map((s, i) => (
                <div key={i} className="a-stat" style={{'--accent': s.accent}}>
                  <div className="a-stat-row">
                    <div className="a-stat-ico" style={{background: s.ico_bg, fontSize: '1.15rem'}}>{s.ico}</div>
                    <span className={`a-stat-badge ${s.up ? 'up' : 'neu'}`}>{s.badge}</span>
                  </div>
                  <div className="a-stat-num">{s.val}</div>
                  <div className="a-stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>

            <div className="a-grid2">
              {/* Registrations chart */}
              <div className="a-panel">
                <div className="a-panel-hd">
                  <div className="a-panel-title"><i className="fa fa-chart-bar" /> Registrations</div>
                  <span style={{fontSize:'.72rem',color:'var(--light)'}}>Last 6 months</span>
                </div>
                <div style={{padding:'1.25rem'}}>
                  {regByMonth.length === 0
                    ? <div className="a-empty"><div className="a-empty-ico">📊</div><h4>No data yet</h4></div>
                    : regByMonth.map((r, i) => (
                        <div key={i} className="a-bar-row">
                          <div className="a-bar-label">{r.month}</div>
                          <div className="a-bar-track">
                            <div className="a-bar-fill" style={{width:`${(r.count/maxReg)*100}%`, background:'linear-gradient(90deg,var(--teal),var(--teal-mid))'}} />
                          </div>
                          <div className="a-bar-val">{r.count}</div>
                        </div>
                      ))
                  }
                </div>
              </div>

              {/* Quick actions */}
              <div className="a-panel">
                <div className="a-panel-hd">
                  <div className="a-panel-title"><i className="fa fa-bolt" /> Quick Actions</div>
                </div>
                <div style={{padding:'1.25rem',display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                  {[
                    { ico: '⏳', label: 'Users pending verification', val: pendingVerification.length, action: () => setTab('verify'), color: 'var(--amber)', btnLabel: 'Review Now', btnClass: 'a-btn-amber' },
                    { ico: '🚩', label: 'Flagged / scam properties',  val: flaggedProps.length,       action: () => setTab('scams'), color: 'var(--red)',   btnLabel: 'Investigate', btnClass: 'a-btn-red' },
                    { ico: '🏢', label: 'Unverified properties',       val: properties.filter(p=>!p.verified).length, action: () => setTab('properties'), color: 'var(--blue)', btnLabel: 'Review', btnClass: 'a-btn-outline' },
                    { ico: '👥', label: 'Total registered owners',     val: users.filter(u=>u.role==='landlord'||u.role==='land_seller').length, action: () => setTab('users'), color: 'var(--teal)', btnLabel: 'View All', btnClass: 'a-btn-teal' },
                  ].map((item, i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.85rem',background:'#fafafa',borderRadius:'10px',border:'1px solid var(--border)'}}>
                      <div style={{fontSize:'1.4rem'}}>{item.ico}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:'.82rem',fontWeight:600,color:'var(--dark)'}}>{item.label}</div>
                        <div style={{fontFamily:"'Poppins',sans-serif",fontSize:'1.3rem',fontWeight:700,color:item.color,lineHeight:1.2}}>{item.val}</div>
                      </div>
                      <button className={`a-btn ${item.btnClass} a-btn-sm`} onClick={item.action}>{item.btnLabel}</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent users */}
            <div className="a-panel">
              <div className="a-panel-hd">
                <div className="a-panel-title"><i className="fa fa-user-plus" /> Recent Registrations</div>
                <button className="a-btn a-btn-outline a-btn-sm" onClick={() => setTab('users')}>View All</button>
              </div>
              <div className="a-tbl-wrap">
                <table className="a-tbl">
                  <thead><tr><th>User</th><th>Role</th><th>Phone</th><th>Status</th><th>Joined</th><th>Action</th></tr></thead>
                  <tbody>
                    {users.slice(0, 8).map((u, i) => (
                      <tr key={i}>
                        <td>
                          <div className="a-cell-user">
                            <div className="a-avatar">{u.firstName?.[0]}{u.lastName?.[0]}</div>
                            <div>
                              <div className="a-cell-name">{u.firstName} {u.lastName}</div>
                              <div className="a-cell-sub">{u.email || u.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className={`a-badge a-badge-${u.role}`}>{u.role?.replace('_',' ')}</span></td>
                        <td style={{fontSize:'.78rem',color:'var(--mid)'}}>{u.phone || '—'}</td>
                        <td>
                          {u.verified || u.verificationStatus === 'verified'
                            ? <span className="a-badge a-badge-v">✅ Verified</span>
                            : u.verificationStatus === 'rejected'
                              ? <span className="a-badge a-badge-r">❌ Rejected</span>
                              : <span className="a-badge a-badge-p">⏳ Pending</span>
                          }
                        </td>
                        <td style={{fontSize:'.75rem',color:'var(--light)'}}>{timeAgo(u.createdAt)}</td>
                        <td>
                          {!u.verified && u.verificationStatus !== 'rejected' && (
                            <button className="a-btn a-btn-green a-btn-sm"
                              onClick={() => setConfirm({
                                icon: '✅', type: 'success', title: 'Verify User',
                                message: `Approve ${u.firstName} ${u.lastName} as a verified ${u.role?.replace('_',' ')}?`,
                                confirmLabel: 'Verify', btnClass: 'green',
                                onConfirm: () => verifyUser(u._id, 'approve'),
                              })}>
                              Verify
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ════════ USERS ════════ */}
        {tab === 'users' && (
          <>
            <div className="a-page-hd">
              <h1>All <em>Users</em></h1>
              <p>{users.length} registered users on the platform</p>
            </div>
            <div className="a-panel">
              <div className="a-panel-hd">
                <div style={{display:'flex',alignItems:'center',gap:'.65rem'}}>
                  <div className="a-panel-title"><i className="fa fa-users" /> Users</div>
                  <span className="a-count">{filteredUsers.length}</span>
                </div>
                <div className="a-panel-tools">
                  <div className="a-search">
                    <i className="fa fa-search" />
                    <input placeholder="Search name, phone, email…" value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                  </div>
                  <select className="a-filter" value={userFilter} onChange={e => setUserFilter(e.target.value)}>
                    <option value="all">All roles</option>
                    <option value="landlord">Landlords</option>
                    <option value="land_seller">Land Sellers</option>
                    <option value="pending">Pending Verification</option>
                    <option value="verified">Verified</option>
                  </select>
                </div>
              </div>
              <div className="a-tbl-wrap">
                {filteredUsers.length === 0
                  ? <div className="a-empty"><div className="a-empty-ico">👥</div><h4>No users found</h4><p>Try adjusting your search or filter</p></div>
                  : <table className="a-tbl">
                      <thead>
                        <tr><th>User</th><th>Role</th><th>Phone</th><th>WhatsApp</th><th>Verification</th><th>Active</th><th>Joined</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u, i) => (
                          <tr key={i}>
                            <td>
                              <div className="a-cell-user">
                                <div className="a-avatar">{u.firstName?.[0]}{u.lastName?.[0]}</div>
                                <div>
                                  <div className="a-cell-name">{u.firstName} {u.lastName}</div>
                                  <div className="a-cell-sub">{u.email || '—'}</div>
                                </div>
                              </div>
                            </td>
                            <td><span className={`a-badge a-badge-${u.role}`}>{u.role?.replace('_',' ')}</span></td>
                            <td style={{fontSize:'.78rem'}}>{u.phone || '—'}</td>
                            <td style={{fontSize:'.78rem'}}>
                              {u.whatsapp
                                ? <a href={`https://wa.me/${u.whatsapp.replace(/\D/g,'').replace(/^0/,'265')}`} target="_blank" rel="noopener noreferrer" style={{color:'#25D366',fontWeight:700,display:'flex',alignItems:'center',gap:3}}>
                                    <i className="fab fa-whatsapp" /> {u.whatsapp}
                                  </a>
                                : '—'}
                            </td>
                            <td>
                              {u.verified || u.verificationStatus === 'verified'
                                ? <span className="a-badge a-badge-v">✅ Verified</span>
                                : u.verificationStatus === 'rejected'
                                  ? <span className="a-badge a-badge-r">❌ Rejected</span>
                                  : <span className="a-badge a-badge-p">⏳ Pending</span>
                              }
                            </td>
                            <td>
                              <button className={`a-btn a-btn-sm ${u.isActive !== false ? 'a-btn-outline' : 'a-btn-green'}`}
                                onClick={() => toggleActive(u._id, u.isActive !== false)}>
                                {u.isActive !== false ? 'Active' : 'Inactive'}
                              </button>
                            </td>
                            <td style={{fontSize:'.75rem',color:'var(--light)'}}>{timeAgo(u.createdAt)}</td>
                            <td>
                              <div className="a-row-actions">
                                {!u.verified && u.verificationStatus !== 'rejected' && (
                                  <button className="a-btn a-btn-green a-btn-sm"
                                    onClick={() => setConfirm({
                                      icon:'✅', type:'success', title:'Verify User',
                                      message:`Approve ${u.firstName} ${u.lastName} as a verified ${u.role?.replace('_',' ')}?`,
                                      confirmLabel:'Verify', btnClass:'green',
                                      onConfirm: () => verifyUser(u._id, 'approve'),
                                    })}>
                                    Verify
                                  </button>
                                )}
                                {u.verificationStatus !== 'rejected' && !u.verified && (
                                  <button className="a-btn a-btn-amber a-btn-sm"
                                    onClick={() => setConfirm({
                                      icon:'⚠️', type:'warn', title:'Reject User',
                                      message:`Reject ${u.firstName}'s verification? They will be notified.`,
                                      confirmLabel:'Reject', btnClass:'amber',
                                      onConfirm: () => verifyUser(u._id, 'reject'),
                                    })}>
                                    Reject
                                  </button>
                                )}
                                <button className="a-btn a-btn-red a-btn-sm"
                                  onClick={() => setConfirm({
                                    icon:'🗑️', type:'danger', title:'Delete User',
                                    message:`Permanently delete ${u.firstName} ${u.lastName}? All their properties will also be removed.`,
                                    confirmLabel:'Delete', btnClass:'red',
                                    onConfirm: () => deleteUser(u._id),
                                  })}>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                }
              </div>
            </div>
          </>
        )}

        {/* ════════ VERIFY ════════ */}
        {tab === 'verify' && (
          <>
            <div className="a-page-hd">
              <h1>Pending <em>Verification</em></h1>
              <p>{pendingVerification.length} account{pendingVerification.length !== 1 ? 's' : ''} waiting for your review</p>
            </div>
            {pendingVerification.length === 0 ? (
              <div className="a-panel">
                <div className="a-empty" style={{padding:'4rem'}}>
                  <div className="a-empty-ico">✅</div>
                  <h4>All clear!</h4>
                  <p>No accounts pending verification right now.</p>
                </div>
              </div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                {pendingVerification.map((u, i) => (
                  <div key={i} className="a-panel" style={{overflow:'visible'}}>
                    <div style={{padding:'1.25rem',display:'flex',alignItems:'flex-start',gap:'1rem',flexWrap:'wrap'}}>
                      <div className="a-avatar" style={{width:48,height:48,fontSize:'1.1rem',flexShrink:0}}>
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </div>
                      <div style={{flex:1,minWidth:200}}>
                        <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.3rem',flexWrap:'wrap'}}>
                          <span style={{fontWeight:800,fontSize:'1rem',color:'var(--dark)'}}>{u.firstName} {u.lastName}</span>
                          <span className={`a-badge a-badge-${u.role}`}>{u.role?.replace('_',' ')}</span>
                          <span className="a-badge a-badge-p">⏳ Pending</span>
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'0.4rem',marginTop:'0.5rem'}}>
                          {[
                            { ico: 'fa-phone',   val: u.phone || '—' },
                            { ico: 'fab fa-whatsapp', val: u.whatsapp || '—', color: '#25D366' },
                            { ico: 'fa-envelope', val: u.email || '—' },
                            { ico: 'fa-clock',    val: `Registered ${timeAgo(u.createdAt)}` },
                          ].map((row, j) => (
                            <div key={j} style={{display:'flex',alignItems:'center',gap:5,fontSize:'.78rem',color:'var(--mid)'}}>
                              <i className={`fa ${row.ico}`} style={{color: row.color || 'var(--teal)',width:14,textAlign:'center'}} />
                              {row.val}
                            </div>
                          ))}
                        </div>
                        {/* Properties by this user */}
                        {properties.filter(p => p.owner?._id === u._id || p.owner === u._id).length > 0 && (
                          <div style={{marginTop:'0.75rem',padding:'0.65rem 0.85rem',background:'var(--teal-pale)',borderRadius:9,border:'1px solid var(--border)',fontSize:'.78rem',color:'var(--mid)'}}>
                            <strong style={{color:'var(--teal-dark)'}}>
                              {properties.filter(p => p.owner?._id === u._id || p.owner === u._id).length} propert{properties.filter(p => p.owner?._id === u._id || p.owner === u._id).length !== 1 ? 'ies' : 'y'}
                            </strong> listed under this account
                          </div>
                        )}
                      </div>
                      <div style={{display:'flex',gap:'0.5rem',flexShrink:0,flexWrap:'wrap'}}>
                        <button className="a-btn a-btn-green"
                          onClick={() => setConfirm({
                            icon:'✅', type:'success', title:'Verify Account',
                            message:`Approve ${u.firstName} ${u.lastName} as a verified ${u.role?.replace('_',' ')}? Their listings will go live.`,
                            confirmLabel:'✅ Verify', btnClass:'green',
                            onConfirm: () => verifyUser(u._id, 'approve'),
                          })}>
                          ✅ Approve
                        </button>
                        <button className="a-btn a-btn-red"
                          onClick={() => setConfirm({
                            icon:'❌', type:'danger', title:'Reject Account',
                            message:`Reject ${u.firstName}'s verification request? They will be notified and cannot list properties.`,
                            confirmLabel:'❌ Reject', btnClass:'red',
                            onConfirm: () => verifyUser(u._id, 'reject'),
                          })}>
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ════════ PROPERTIES ════════ */}
        {tab === 'properties' && (
          <>
            <div className="a-page-hd">
              <h1>All <em>Properties</em></h1>
              <p>{properties.length} listings on the platform</p>
            </div>
            <div className="a-panel">
              <div className="a-panel-hd">
                <div style={{display:'flex',alignItems:'center',gap:'.65rem'}}>
                  <div className="a-panel-title"><i className="fa fa-building" /> Properties</div>
                  <span className="a-count">{filteredProps.length}</span>
                </div>
                <div className="a-panel-tools">
                  <div className="a-search">
                    <i className="fa fa-search" />
                    <input placeholder="Search name, district…" value={propSearch} onChange={e => setPropSearch(e.target.value)} />
                  </div>
                  <select className="a-filter" value={propFilter} onChange={e => setPropFilter(e.target.value)}>
                    <option value="all">All listings</option>
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                    <option value="flagged">Flagged / Scam</option>
                  </select>
                </div>
              </div>
              <div className="a-tbl-wrap">
                {filteredProps.length === 0
                  ? <div className="a-empty"><div className="a-empty-ico">🏠</div><h4>No properties found</h4></div>
                  : <table className="a-tbl">
                      <thead>
                        <tr><th>Property</th><th>Owner</th><th>District</th><th>Price</th><th>Status</th><th>Views</th><th>Listed</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        {filteredProps.map((p, i) => {
                          const imgs = p.images || [];
                          const img  = typeof imgs[0] === 'string' ? imgs[0] : imgs[0]?.url || null;
                          return (
                            <tr key={i}>
                              <td>
                                <div style={{display:'flex',alignItems:'center',gap:'0.65rem'}}>
                                  {img
                                    ? <img src={img} alt={p.name} className="a-prop-img" />
                                    : <div className="a-prop-no-img"><i className="fa fa-home" /></div>
                                  }
                                  <div>
                                    <div className="a-cell-name">{p.name}</div>
                                    <div className="a-cell-sub">{p.type || p.propertyType || '—'}</div>
                                  </div>
                                </div>
                              </td>
                              <td style={{fontSize:'.78rem'}}>
                                {p.owner?.firstName ? `${p.owner.firstName} ${p.owner.lastName}` : '—'}
                                {p.owner?.phone && <div style={{color:'var(--light)',fontSize:'.7rem'}}>{p.owner.phone}</div>}
                              </td>
                              <td style={{fontSize:'.78rem'}}>{p.district || p.address || '—'}</td>
                              <td style={{fontWeight:800,fontSize:'.85rem',color:'var(--teal-dark)'}}>
                                {p.price ? `MWK ${p.price.toLocaleString()}` : '—'}
                              </td>
                              <td>
                                {p.flagged
                                  ? <div className="a-scam-flag"><i className="fa fa-flag" /> Scam</div>
                                  : p.verified
                                    ? <span className="a-badge a-badge-v">✅ Live</span>
                                    : <span className="a-badge a-badge-p">⏳ Pending</span>
                                }
                              </td>
                              <td style={{fontSize:'.8rem'}}>{p.viewCount ?? p.totalViews ?? 0}</td>
                              <td style={{fontSize:'.72rem',color:'var(--light)'}}>{timeAgo(p.createdAt)}</td>
                              <td>
                                <div className="a-row-actions">
                                  {!p.flagged && (
                                    <button className="a-btn a-btn-amber a-btn-sm"
                                      onClick={() => setConfirm({
                                        icon:'🚩', type:'warn', title:'Flag as Scam',
                                        message:`Flag "${p.name}" as a scam listing? It will be hidden from public view immediately.`,
                                        confirmLabel:'🚩 Flag Scam', btnClass:'amber',
                                        onConfirm: () => flagScam(p._id),
                                      })}>
                                      🚩 Flag
                                    </button>
                                  )}
                                  <button className="a-btn a-btn-red a-btn-sm"
                                    onClick={() => setConfirm({
                                      icon:'🗑️', type:'danger', title:'Delete Property',
                                      message:`Permanently remove "${p.name}"? The owner will be notified.`,
                                      confirmLabel:'Delete', btnClass:'red',
                                      onConfirm: () => deleteProperty(p._id),
                                    })}>
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                }
              </div>
            </div>
          </>
        )}

        {/* ════════ SCAMS / FLAGGED ════════ */}
        {tab === 'scams' && (
          <>
            <div className="a-page-hd">
              <h1>Flagged <em>Listings</em></h1>
              <p>{flaggedProps.length} propert{flaggedProps.length !== 1 ? 'ies' : 'y'} flagged as suspicious or scam</p>
            </div>
            {flaggedProps.length === 0 ? (
              <div className="a-panel">
                <div className="a-empty" style={{padding:'4rem'}}>
                  <div className="a-empty-ico">🛡️</div>
                  <h4>All clear!</h4>
                  <p>No flagged listings at the moment. The platform is clean.</p>
                </div>
              </div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                {flaggedProps.map((p, i) => {
                  const imgs = p.images || [];
                  const img  = typeof imgs[0] === 'string' ? imgs[0] : imgs[0]?.url || null;
                  return (
                    <div key={i} className="a-panel" style={{borderLeft:'4px solid var(--red)'}}>
                      <div style={{padding:'1.25rem',display:'flex',alignItems:'flex-start',gap:'1rem',flexWrap:'wrap'}}>
                        {img
                          ? <img src={img} alt={p.name} style={{width:80,height:64,borderRadius:9,objectFit:'cover',flexShrink:0}} />
                          : <div className="a-prop-no-img" style={{width:80,height:64,borderRadius:9}}><i className="fa fa-home" /></div>
                        }
                        <div style={{flex:1,minWidth:200}}>
                          <div style={{display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'.35rem',flexWrap:'wrap'}}>
                            <span style={{fontWeight:800,fontSize:'1rem',color:'var(--dark)'}}>{p.name}</span>
                            <div className="a-scam-flag"><i className="fa fa-flag" /> Flagged Scam</div>
                          </div>
                          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'.35rem'}}>
                            {[
                              { ico:'fa-map-marker-alt', val: `${p.district || p.address || '—'}` },
                              { ico:'fa-tag',            val: `MWK ${p.price?.toLocaleString() || '—'}` },
                              { ico:'fa-user',           val: p.owner?.firstName ? `${p.owner.firstName} ${p.owner.lastName}` : '—' },
                              { ico:'fa-phone',          val: p.owner?.phone || p.contactPhone || '—' },
                            ].map((row,j) => (
                              <div key={j} style={{display:'flex',alignItems:'center',gap:4,fontSize:'.78rem',color:'var(--mid)'}}>
                                <i className={`fa ${row.ico}`} style={{color:'var(--teal)',width:14,textAlign:'center'}} />
                                {row.val}
                              </div>
                            ))}
                          </div>
                          {p.flagReason && (
                            <div style={{marginTop:'.6rem',padding:'.5rem .75rem',background:'var(--red-pale)',borderRadius:8,fontSize:'.75rem',color:'var(--red)',fontWeight:600}}>
                              Reason: {p.flagReason}
                            </div>
                          )}
                        </div>
                        <div style={{display:'flex',gap:'.5rem',flexShrink:0,flexWrap:'wrap'}}>
                          <button className="a-btn a-btn-outline"
                            onClick={() => setConfirm({
                              icon:'✅', type:'success', title:'Unflag Listing',
                              message:`Remove the scam flag from "${p.name}" and make it live again?`,
                              confirmLabel:'Unflag', btnClass:'green',
                              onConfirm: async () => {
                                setConfirmLoading(true);
                                try {
                                  await api.patch(`/admin/hostels/${p._id}/flag`, { flagged: false });
                                  setProperties(prev => prev.map(x => x._id === p._id ? {...x, flagged: false} : x));
                                  toast.success('Listing unflagged');
                                } catch {
                                  setProperties(prev => prev.map(x => x._id === p._id ? {...x, flagged: false} : x));
                                } finally { setConfirmLoading(false); setConfirm(null); }
                              },
                            })}>
                            ✅ Unflag
                          </button>
                          <button className="a-btn a-btn-red"
                            onClick={() => setConfirm({
                              icon:'🗑️', type:'danger', title:'Delete Scam Listing',
                              message:`Permanently delete "${p.name}" from the platform? This cannot be undone.`,
                              confirmLabel:'🗑️ Delete', btnClass:'red',
                              onConfirm: () => deleteProperty(p._id),
                            })}>
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

      </div>
    </>
  );
}