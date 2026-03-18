import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #080e1e; --bg2: #0d1528; --card: #111c33; --card2: #162040;
    --border: rgba(255,255,255,0.07); --orange: #e8501a; --orange2: #ff6b35;
    --blue: #1a3fa4; --blue2: #2655d4; --green: #10b981; --yellow: #f59e0b;
    --red: #ef4444; --purple: #8b5cf6; --text: #f0f4ff; --text2: #8892a4;
    --text3: #4b5670; --radius: 14px; --transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); }
  .adm-wrap { min-height: 100vh; background: var(--bg); }
  .adm-top {
    position: sticky; top: 0; z-index: 100;
    background: rgba(8,14,30,0.95); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; height: 64px;
  }
  .adm-top-left { display: flex; align-items: center; gap: 1rem; }
  .adm-logo { display: flex; align-items: center; gap: 10px; }
  .adm-logo-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, var(--orange), var(--orange2));
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; box-shadow: 0 4px 14px rgba(232,80,26,0.4);
  }
  .adm-logo-text { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 800; color: var(--text); letter-spacing: 0.5px; }
  .adm-logo-badge {
    background: rgba(232,80,26,0.15); border: 1px solid rgba(232,80,26,0.3);
    color: var(--orange); font-size: 0.68rem; font-weight: 700;
    padding: 2px 8px; border-radius: 100px; letter-spacing: 1px; text-transform: uppercase;
  }
  .adm-top-right { display: flex; align-items: center; gap: 0.75rem; }
  .adm-refresh-btn {
    display: flex; align-items: center; gap: 0.4rem;
    background: var(--card2); border: 1px solid var(--border);
    color: var(--text2); padding: 0.45rem 0.9rem; border-radius: 8px;
    font-size: 0.82rem; font-weight: 600; cursor: pointer;
    transition: var(--transition); font-family: 'DM Sans', sans-serif;
  }
  .adm-refresh-btn:hover { background: var(--card); color: var(--text); }
  .adm-back-btn {
    display: flex; align-items: center; gap: 0.4rem;
    background: rgba(232,80,26,0.1); border: 1px solid rgba(232,80,26,0.2);
    color: var(--orange); padding: 0.45rem 0.9rem; border-radius: 8px;
    font-size: 0.82rem; font-weight: 700; cursor: pointer;
    transition: var(--transition); font-family: 'DM Sans', sans-serif;
  }
  .adm-back-btn:hover { background: rgba(232,80,26,0.2); }
  .adm-last-updated { font-size: 0.75rem; color: var(--text3); }
  .adm-body { max-width: 1320px; margin: 0 auto; padding: 2rem 1.5rem; }
  .adm-hero { margin-bottom: 2rem; }
  .adm-hero h1 { font-family: 'Syne', sans-serif; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; color: var(--text); margin-bottom: 0.35rem; }
  .adm-hero h1 span { color: var(--orange); }
  .adm-hero p { font-size: 0.88rem; color: var(--text2); }
  .adm-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
  .adm-stat {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1.25rem 1.5rem;
    position: relative; overflow: hidden; transition: var(--transition);
  }
  .adm-stat::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--accent-color, var(--orange)); }
  .adm-stat:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.3); }
  .adm-stat-icon { width: 42px; height: 42px; border-radius: 10px; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; background: var(--icon-bg); color: var(--accent-color); }
  .adm-stat-val { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: var(--text); line-height: 1; margin-bottom: 0.3rem; }
  .adm-stat-lbl { font-size: 0.78rem; color: var(--text2); font-weight: 500; }
  .adm-stat-change { display: inline-flex; align-items: center; gap: 3px; font-size: 0.72rem; font-weight: 700; margin-top: 0.5rem; padding: 2px 7px; border-radius: 100px; }
  .adm-stat-change.up { background: rgba(16,185,129,0.12); color: var(--green); }
  .adm-stat-change.neutral { background: rgba(139,92,246,0.12); color: var(--purple); }
  .adm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
  .adm-panel { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .adm-panel-head { display: flex; align-items: center; justify-content: space-between; padding: 1.1rem 1.5rem; border-bottom: 1px solid var(--border); }
  .adm-panel-title { font-family: 'Syne', sans-serif; font-size: 0.9rem; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 0.5rem; }
  .adm-panel-title i { color: var(--orange); }
  .adm-panel-badge { background: rgba(232,80,26,0.12); color: var(--orange); font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 100px; }
  .adm-panel-body { padding: 1.5rem; }
  .adm-chart { display: flex; flex-direction: column; gap: 0.75rem; }
  .adm-chart-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
  .adm-chart-label { font-size: 0.78rem; color: var(--text2); width: 80px; flex-shrink: 0; text-align: right; font-weight: 500; }
  .adm-chart-bar-wrap { flex: 1; background: rgba(255,255,255,0.05); border-radius: 4px; height: 10px; overflow: hidden; }
  .adm-chart-bar { height: 100%; border-radius: 4px; transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }
  .adm-chart-val { font-size: 0.78rem; font-weight: 700; color: var(--text); width: 32px; text-align: right; }
  .adm-donut-wrap { display: flex; align-items: center; gap: 2rem; }
  .adm-donut { position: relative; width: 140px; height: 140px; flex-shrink: 0; }
  .adm-donut svg { transform: rotate(-90deg); }
  .adm-donut-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .adm-donut-center-val { font-family: 'Syne', sans-serif; font-size: 1.6rem; font-weight: 800; color: var(--text); }
  .adm-donut-center-lbl { font-size: 0.65rem; color: var(--text2); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .adm-donut-legend { flex: 1; }
  .adm-donut-item { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.65rem; }
  .adm-donut-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .adm-donut-item-label { font-size: 0.82rem; color: var(--text2); flex: 1; }
  .adm-donut-item-val { font-size: 0.82rem; font-weight: 700; color: var(--text); }
  .adm-table { width: 100%; border-collapse: collapse; }
  .adm-table th { text-align: left; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text3); padding: 0 1rem 0.75rem; border-bottom: 1px solid var(--border); }
  .adm-table td { padding: 0.85rem 1rem; font-size: 0.85rem; color: var(--text2); border-bottom: 1px solid rgba(255,255,255,0.03); }
  .adm-table tr:last-child td { border-bottom: none; }
  .adm-table tr:hover td { background: rgba(255,255,255,0.02); }
  .adm-table-name { font-weight: 600; color: var(--text); }
  .adm-table-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--blue), var(--blue2)); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; color: white; flex-shrink: 0; }
  .adm-table-cell { display: flex; align-items: center; gap: 0.6rem; }
  .adm-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 100px; font-size: 0.72rem; font-weight: 700; }
  .adm-badge.student { background: rgba(26,63,164,0.15); color: #6b9fff; }
  .adm-badge.owner { background: rgba(16,185,129,0.15); color: var(--green); }
  .adm-badge.admin { background: rgba(232,80,26,0.15); color: var(--orange); }
  .adm-badge.active { background: rgba(16,185,129,0.12); color: var(--green); }
  .adm-badge.pending { background: rgba(245,158,11,0.12); color: var(--yellow); }
  .adm-badge.confirmed { background: rgba(16,185,129,0.12); color: var(--green); }
  .adm-badge.cancelled { background: rgba(239,68,68,0.12); color: var(--red); }
  .adm-empty { text-align: center; padding: 2.5rem 1rem; color: var(--text3); font-size: 0.88rem; }
  .adm-reports { display: flex; flex-direction: column; gap: 0.75rem; }
  .adm-report-item { background: var(--card2); border: 1px solid var(--border); border-radius: 10px; padding: 1rem 1.25rem; display: flex; align-items: flex-start; gap: 0.85rem; }
  .adm-report-icon { width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0; background: rgba(239,68,68,0.12); color: var(--red); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
  .adm-report-body { flex: 1; }
  .adm-report-title { font-size: 0.88rem; font-weight: 600; color: var(--text); margin-bottom: 2px; }
  .adm-report-meta { font-size: 0.75rem; color: var(--text3); }
  .adm-report-time { font-size: 0.72rem; color: var(--text3); white-space: nowrap; }
  .adm-loading { min-height: 60vh; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 1rem; }
  .adm-spinner { width: 44px; height: 44px; border: 3px solid rgba(255,255,255,0.08); border-top-color: var(--orange); border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (max-width: 900px) { .adm-grid { grid-template-columns: 1fr; } }
  @media (max-width: 600px) { .adm-body { padding: 1rem 0.75rem; } .adm-top { padding: 0 1rem; } .adm-stats { grid-template-columns: 1fr 1fr; } .adm-donut-wrap { flex-direction: column; } }
`;

const fmt = (n) => n?.toLocaleString() ?? '0';
const timeAgo = (date) => {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export default function AdminDashboard() {
  const navigate  = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUp,  setLastUp]  = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stats');
      setData(res.data);
      setLastUp(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Admin stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return; // wait for auth to finish
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'admin') { navigate('/'); return; }
    load();
  }, [authLoading, user]);

  if (authLoading || loading) return (
    <>
      <style>{styles}</style>
      <div className="adm-wrap">
        <div className="adm-loading">
          <div className="adm-spinner" />
          <p style={{ color: 'var(--text2)', fontSize: '0.88rem' }}>Loading dashboard...</p>
        </div>
      </div>
    </>
  );

  const stats          = data?.stats || {};
  const recentUsers    = data?.recentUsers || [];
  const recentBookings = data?.recentBookings || [];
  const reports        = data?.reports || [];
  const regByMonth     = data?.registrationsByMonth || [];
  const roleBreakdown  = data?.roleBreakdown || { students: 0, owners: 0 };

  const totalUsers  = (roleBreakdown.students || 0) + (roleBreakdown.owners || 0);
  const studentPct  = totalUsers > 0 ? Math.round((roleBreakdown.students / totalUsers) * 100) : 0;
  const ownerPct    = totalUsers > 0 ? Math.round((roleBreakdown.owners   / totalUsers) * 100) : 0;
  const maxReg      = Math.max(...regByMonth.map(r => r.count), 1);

  const statCards = [
    { icon: '👥', label: 'Total Users',    val: fmt(stats.totalUsers),          accent: '#e8501a', iconBg: 'rgba(232,80,26,0.12)',  change: `+${stats.newUsersToday || 0} today`,     up: true  },
    { icon: '🎓', label: 'Students',       val: fmt(roleBreakdown.students),     accent: '#2655d4', iconBg: 'rgba(38,85,212,0.12)',  change: `${studentPct}% of users`,                up: false },
    { icon: '🏠', label: 'Hostel Owners',  val: fmt(roleBreakdown.owners),       accent: '#10b981', iconBg: 'rgba(16,185,129,0.12)', change: `${ownerPct}% of users`,                  up: false },
    { icon: '🏢', label: 'Total Hostels',  val: fmt(stats.totalHostels),         accent: '#8b5cf6', iconBg: 'rgba(139,92,246,0.12)', change: `${stats.activeHostels || 0} active`,      up: false },
    { icon: '📋', label: 'Total Bookings', val: fmt(stats.totalBookings),        accent: '#f59e0b', iconBg: 'rgba(245,158,11,0.12)', change: `${stats.pendingBookings || 0} pending`,   up: true  },
    { icon: '💰', label: 'Total Revenue',  val: `MK ${fmt(stats.totalRevenue)}`, accent: '#10b981', iconBg: 'rgba(16,185,129,0.12)', change: 'confirmed bookings',                      up: true  },
  ];

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <div className="adm-wrap">

        {/* TOPBAR */}
        <div className="adm-top">
          <div className="adm-top-left">
            <div className="adm-logo">
              <div className="adm-logo-icon">🏠</div>
              <span className="adm-logo-text">PezaHostel</span>
            </div>
            <span className="adm-logo-badge">Admin</span>
          </div>
          <div className="adm-top-right">
            {lastUp && <span className="adm-last-updated">Updated {lastUp}</span>}
            <button className="adm-refresh-btn" onClick={load}>
              <i className="fa fa-sync-alt" /> Refresh
            </button>
            <button className="adm-back-btn" onClick={() => navigate('/')}>
              <i className="fa fa-arrow-left" /> Exit
            </button>
          </div>
        </div>

        <div className="adm-body">

          {/* HERO */}
          <div className="adm-hero">
            <h1>System <span>Analytics</span></h1>
            <p>Real-time overview of PezaHostel platform performance</p>
          </div>

          {/* STAT CARDS */}
          <div className="adm-stats">
            {statCards.map((s, i) => (
              <div key={i} className="adm-stat" style={{ '--accent-color': s.accent, '--icon-bg': s.iconBg }}>
                <div className="adm-stat-icon">{s.icon}</div>
                <div className="adm-stat-val">{s.val}</div>
                <div className="adm-stat-lbl">{s.label}</div>
                <div className={`adm-stat-change ${s.up ? 'up' : 'neutral'}`}>
                  {s.up ? '↑' : '●'} {s.change}
                </div>
              </div>
            ))}
          </div>

          {/* ROW 1: Registrations + User breakdown */}
          <div className="adm-grid">
            <div className="adm-panel">
              <div className="adm-panel-head">
                <div className="adm-panel-title"><i className="fa fa-chart-bar" /> New Registrations</div>
                <span className="adm-panel-badge">Last 6 months</span>
              </div>
              <div className="adm-panel-body">
                {regByMonth.length === 0
                  ? <div className="adm-empty">No registration data yet</div>
                  : <div className="adm-chart">
                      {regByMonth.map((r, i) => (
                        <div key={i} className="adm-chart-row">
                          <div className="adm-chart-label">{r.month}</div>
                          <div className="adm-chart-bar-wrap">
                            <div className="adm-chart-bar" style={{ width: `${(r.count / maxReg) * 100}%`, background: 'linear-gradient(90deg, var(--orange), var(--orange2))' }} />
                          </div>
                          <div className="adm-chart-val">{r.count}</div>
                        </div>
                      ))}
                    </div>
                }
              </div>
            </div>

            <div className="adm-panel">
              <div className="adm-panel-head">
                <div className="adm-panel-title"><i className="fa fa-users" /> User Breakdown</div>
              </div>
              <div className="adm-panel-body">
                <div className="adm-donut-wrap">
                  <div className="adm-donut">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle cx="70" cy="70" r="55" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="18" />
                      <circle cx="70" cy="70" r="55" fill="none" stroke="var(--orange)" strokeWidth="18" strokeDasharray={`${studentPct * 3.456} 345.6`} strokeLinecap="round" />
                      <circle cx="70" cy="70" r="55" fill="none" stroke="var(--green)" strokeWidth="18" strokeDasharray={`${ownerPct * 3.456} 345.6`} strokeDashoffset={`-${studentPct * 3.456}`} strokeLinecap="round" />
                    </svg>
                    <div className="adm-donut-center">
                      <div className="adm-donut-center-val">{fmt(totalUsers)}</div>
                      <div className="adm-donut-center-lbl">Total</div>
                    </div>
                  </div>
                  <div className="adm-donut-legend">
                    <div className="adm-donut-item">
                      <div className="adm-donut-dot" style={{ background: 'var(--orange)' }} />
                      <div className="adm-donut-item-label">Students</div>
                      <div className="adm-donut-item-val">{fmt(roleBreakdown.students)} ({studentPct}%)</div>
                    </div>
                    <div className="adm-donut-item">
                      <div className="adm-donut-dot" style={{ background: 'var(--green)' }} />
                      <div className="adm-donut-item-label">Hostel Owners</div>
                      <div className="adm-donut-item-val">{fmt(roleBreakdown.owners)} ({ownerPct}%)</div>
                    </div>
                    <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: 4 }}>TODAY'S NEW SIGNUPS</div>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--orange)' }}>+{stats.newUsersToday || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2: Recent users + Recent bookings */}
          <div className="adm-grid">
            <div className="adm-panel">
              <div className="adm-panel-head">
                <div className="adm-panel-title"><i className="fa fa-user-plus" /> Recent Registrations</div>
                <span className="adm-panel-badge">{recentUsers.length} latest</span>
              </div>
              <div style={{ padding: 0, overflowX: 'auto' }}>
                {recentUsers.length === 0
                  ? <div className="adm-empty">No users yet</div>
                  : <table className="adm-table">
                      <thead><tr><th>User</th><th>Role</th><th>Joined</th></tr></thead>
                      <tbody>
                        {recentUsers.map((u, i) => (
                          <tr key={i}>
                            <td>
                              <div className="adm-table-cell">
                                <div className="adm-table-avatar">{u.firstName?.[0]}{u.lastName?.[0]}</div>
                                <div>
                                  <div className="adm-table-name">{u.firstName} {u.lastName}</div>
                                  <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{u.email}</div>
                                </div>
                              </div>
                            </td>
                            <td><span className={`adm-badge ${u.role}`}>{u.role}</span></td>
                            <td style={{ fontSize: '0.75rem' }}>{timeAgo(u.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                }
              </div>
            </div>

            <div className="adm-panel">
              <div className="adm-panel-head">
                <div className="adm-panel-title"><i className="fa fa-calendar-check" /> Recent Bookings</div>
                <span className="adm-panel-badge">{recentBookings.length} latest</span>
              </div>
              <div style={{ padding: 0, overflowX: 'auto' }}>
                {recentBookings.length === 0
                  ? <div className="adm-empty">No bookings yet</div>
                  : <table className="adm-table">
                      <thead><tr><th>Student</th><th>Hostel</th><th>Status</th><th>Amount</th></tr></thead>
                      <tbody>
                        {recentBookings.map((b, i) => (
                          <tr key={i}>
                            <td className="adm-table-name">{b.student?.firstName} {b.student?.lastName}</td>
                            <td style={{ fontSize: '0.78rem' }}>{b.hostel?.name}</td>
                            <td>
                              <span className={`adm-badge ${b.status === 'confirmed' ? 'confirmed' : b.status === 'cancelled' ? 'cancelled' : 'pending'}`}>
                                {b.status}
                              </span>
                            </td>
                            <td style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.82rem' }}>MK {fmt(b.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                }
              </div>
            </div>
          </div>

          {/* ROW 3: Booking breakdown + Reports */}
          <div className="adm-grid">
            <div className="adm-panel">
              <div className="adm-panel-head">
                <div className="adm-panel-title"><i className="fa fa-chart-pie" /> Booking Status Breakdown</div>
              </div>
              <div className="adm-panel-body">
                {[
                  { label: 'Confirmed',       val: stats.confirmedBookings || 0, color: 'var(--green)'  },
                  { label: 'Pending Payment', val: stats.pendingBookings   || 0, color: 'var(--yellow)' },
                  { label: 'Active',          val: stats.activeBookings    || 0, color: 'var(--blue2)'  },
                  { label: 'Completed',       val: stats.completedBookings || 0, color: 'var(--purple)' },
                  { label: 'Cancelled',       val: stats.cancelledBookings || 0, color: 'var(--red)'    },
                ].map((item, i) => {
                  const pct = Math.round((item.val / (stats.totalBookings || 1)) * 100);
                  return (
                    <div key={i} className="adm-chart-row">
                      <div className="adm-chart-label">{item.label}</div>
                      <div className="adm-chart-bar-wrap">
                        <div className="adm-chart-bar" style={{ width: `${pct}%`, background: item.color }} />
                      </div>
                      <div className="adm-chart-val">{item.val}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="adm-panel">
              <div className="adm-panel-head">
                <div className="adm-panel-title"><i className="fa fa-flag" /> User Reports</div>
                <span className="adm-panel-badge" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--red)' }}>{reports.length} total</span>
              </div>
              <div className="adm-panel-body">
                {reports.length === 0
                  ? <div className="adm-empty">
                      <i className="fa fa-check-circle" style={{ fontSize: '2rem', color: 'var(--green)', marginBottom: '0.5rem', display: 'block' }} />
                      No reports yet — all clear!
                    </div>
                  : <div className="adm-reports">
                      {reports.slice(0, 5).map((r, i) => (
                        <div key={i} className="adm-report-item">
                          <div className="adm-report-icon"><i className="fa fa-flag" /></div>
                          <div className="adm-report-body">
                            <div className="adm-report-title">{r.reason || 'Reported listing'}</div>
                            <div className="adm-report-meta">Hostel: {r.hostel?.name || '—'} · By: {r.reporter?.firstName || 'User'}</div>
                          </div>
                          <div className="adm-report-time">{timeAgo(r.createdAt)}</div>
                        </div>
                      ))}
                    </div>
                }
              </div>
            </div>
          </div>

          {/* ROW 4: All users */}
          <div className="adm-panel">
            <div className="adm-panel-head">
              <div className="adm-panel-title"><i className="fa fa-users" /> All Users</div>
              <span className="adm-panel-badge">{fmt(stats.totalUsers)} total</span>
            </div>
            <div style={{ padding: 0, overflowX: 'auto' }}>
              {(data?.allUsers || []).length === 0
                ? <div className="adm-empty">No users found</div>
                : <table className="adm-table">
                    <thead>
                      <tr><th>User</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Joined</th></tr>
                    </thead>
                    <tbody>
                      {(data?.allUsers || []).map((u, i) => (
                        <tr key={i}>
                          <td>
                            <div className="adm-table-cell">
                              <div className="adm-table-avatar" style={{ background: u.role === 'owner' ? 'linear-gradient(135deg,#059669,#10b981)' : 'linear-gradient(135deg,#1a3fa4,#2655d4)' }}>
                                {u.firstName?.[0]}{u.lastName?.[0]}
                              </div>
                              <div className="adm-table-name">{u.firstName} {u.lastName}</div>
                            </div>
                          </td>
                          <td style={{ fontSize: '0.78rem' }}>{u.email}</td>
                          <td style={{ fontSize: '0.78rem' }}>{u.phone || '—'}</td>
                          <td><span className={`adm-badge ${u.role}`}>{u.role}</span></td>
                          <td><span className={`adm-badge ${u.isActive ? 'active' : 'pending'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                          <td style={{ fontSize: '0.75rem' }}>{timeAgo(u.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              }
            </div>
          </div>

        </div>
      </div>
    </>
  );
}