import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';
import api from '../services/api';
import {
  FaBell, FaEnvelope, FaHome, FaCalendarCheck,
  FaCheckCircle, FaTrash, FaArrowLeft, FaSpinner,
  FaCheck, FaBellSlash,
} from 'react-icons/fa';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0d1b3e;
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
    --transition: all 0.2s ease;
  }

  body { font-family: 'Manrope', sans-serif; background: var(--gray-bg); }

  /* ── TOPBAR ── */
  .notif-topbar {
    position: sticky; top: 0; z-index: 100;
    background: var(--navy); height: 62px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 1.5rem;
    box-shadow: 0 2px 16px rgba(0,0,0,0.25);
  }
  .notif-topbar-left { display: flex; align-items: center; gap: 0.75rem; }
  .notif-back-btn {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.15);
    color: white; width: 36px; height: 36px; border-radius: 9px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: var(--transition); font-size: 0.9rem;
  }
  .notif-back-btn:hover { background: rgba(255,255,255,0.2); }
  .notif-topbar-title { font-size: 1.05rem; font-weight: 800; color: white; }
  .notif-topbar-badge {
    font-size: 0.62rem; font-weight: 700;
    background: var(--orange); color: white;
    padding: 3px 8px; border-radius: 20px;
  }
  .notif-topbar-actions { display: flex; gap: 0.5rem; }
  .notif-top-btn {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.85); font-size: 0.8rem; font-weight: 700;
    padding: 0.4rem 0.9rem; border-radius: 8px; cursor: pointer;
    transition: var(--transition);
    display: flex; align-items: center; gap: 0.4rem;
    font-family: 'Manrope', sans-serif;
  }
  .notif-top-btn:hover { background: rgba(255,255,255,0.2); color: white; }
  .notif-top-btn.danger { color: #fca5a5; border-color: rgba(252,165,165,0.25); }
  .notif-top-btn.danger:hover { background: rgba(220,38,38,0.2); }

  /* ── PAGE ── */
  .notif-page { max-width: 720px; margin: 0 auto; padding: 1.5rem 1rem 4rem; }

  /* ── TABS ── */
  .notif-tabs {
    display: flex; gap: 0.5rem; margin-bottom: 1.5rem;
    background: white; padding: 0.4rem; border-radius: 12px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  .notif-tab {
    flex: 1; padding: 0.55rem 0.5rem; border-radius: 9px; border: none;
    background: none; cursor: pointer; font-family: 'Manrope', sans-serif;
    font-size: 0.82rem; font-weight: 700; color: var(--text-mid);
    transition: var(--transition);
    display: flex; align-items: center; justify-content: center; gap: 0.35rem;
  }
  .notif-tab.active {
    background: var(--orange); color: white;
    box-shadow: 0 3px 10px rgba(232,80,26,0.3);
  }
  .notif-tab-count {
    background: rgba(0,0,0,0.15); color: inherit;
    font-size: 0.65rem; font-weight: 800;
    padding: 1px 5px; border-radius: 10px;
  }
  .notif-tab.active .notif-tab-count { background: rgba(255,255,255,0.25); }

  /* ── LIST ── */
  .notif-list { display: flex; flex-direction: column; }

  .notif-item {
    background: white; border-radius: var(--card-radius);
    border: 1px solid var(--gray-light);
    margin-bottom: 0.6rem;
    display: flex; align-items: flex-start; gap: 0.9rem;
    padding: 1rem 1.1rem;
    cursor: pointer; transition: var(--transition);
    position: relative; overflow: hidden;
  }
  .notif-item:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    transform: translateY(-1px);
  }
  .notif-item.unread {
    border-left: 3px solid var(--orange);
    background: linear-gradient(to right, var(--orange-pale), white 40%);
  }
  .notif-item.unread::after {
    content: '';
    position: absolute; top: 0.9rem; right: 0.9rem;
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--orange);
    animation: pulse-dot 2s infinite;
  }
  @keyframes pulse-dot {
    0%,100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.3); }
  }

  /* Avatar / Icon */
  .notif-sender-avatar {
    width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.05rem; font-weight: 800; color: white;
    background: linear-gradient(135deg, var(--navy), #1a3fa4);
    overflow: hidden; position: relative;
  }
  .notif-sender-avatar img { width: 100%; height: 100%; object-fit: cover; }

  .notif-type-badge {
    position: absolute; bottom: -2px; right: -2px;
    width: 18px; height: 18px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.55rem; border: 2px solid white;
  }
  .badge-msg      { background: #1d4ed8; color: white; }
  .badge-booking  { background: var(--success); color: white; }
  .badge-hostel   { background: var(--orange); color: white; }
  .badge-system   { background: #6b7280; color: white; }

  .notif-icon {
    width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
  }
  .notif-icon.msg      { background: #dbeafe; color: #1d4ed8; }
  .notif-icon.booking  { background: var(--success-pale); color: var(--success); }
  .notif-icon.hostel   { background: var(--orange-pale); color: var(--orange); }
  .notif-icon.system   { background: #f3f4f6; color: #6b7280; }
  .notif-icon.verified { background: var(--success-pale); color: var(--success); }

  .notif-content { flex: 1; min-width: 0; padding-right: 0.75rem; }
  .notif-title {
    font-size: 0.9rem; font-weight: 800; color: var(--text-dark);
    margin-bottom: 0.2rem; line-height: 1.35;
  }
  .notif-body {
    font-size: 0.82rem; color: var(--text-mid);
    line-height: 1.5; margin-bottom: 0.35rem;
  }
  .notif-time { font-size: 0.72rem; color: var(--text-light); font-weight: 600; }

  .notif-actions {
    display: flex; flex-direction: column; gap: 0.35rem;
    flex-shrink: 0; align-items: flex-end; padding-top: 0.1rem;
  }
  .notif-del-btn {
    width: 30px; height: 30px; border-radius: 8px;
    background: none; border: 1px solid var(--gray-light);
    color: var(--text-light); cursor: pointer; font-size: 0.75rem;
    display: flex; align-items: center; justify-content: center;
    transition: var(--transition);
  }
  .notif-del-btn:hover { background: #fef2f2; color: var(--danger); border-color: #fecaca; }

  /* ── EMPTY ── */
  .notif-empty {
    text-align: center; padding: 4rem 2rem;
    background: white; border-radius: var(--card-radius);
    border: 1px solid var(--gray-light);
  }
  .notif-empty-ico {
    width: 80px; height: 80px; background: var(--gray-bg);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 2rem; color: var(--text-light); margin: 0 auto 1.25rem;
  }
  .notif-empty h3 { font-size: 1.15rem; font-weight: 800; color: var(--navy); margin-bottom: 0.5rem; }
  .notif-empty p { color: var(--text-mid); font-size: 0.88rem; line-height: 1.6; }

  /* ── LOADING ── */
  .notif-loading {
    display: flex; align-items: center; justify-content: center;
    padding: 3rem; gap: 0.75rem;
  }
  .notif-spinner { animation: spin 0.8s linear infinite; color: var(--orange); font-size: 1.5rem; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .notif-loading p { color: var(--text-mid); font-size: 0.88rem; font-weight: 600; }

  /* ── LOAD MORE ── */
  .notif-load-more {
    width: 100%; padding: 0.75rem; border-radius: var(--card-radius);
    background: white; border: 1.5px solid var(--gray-light);
    color: var(--text-mid); font-size: 0.85rem; font-weight: 700;
    cursor: pointer; transition: var(--transition);
    font-family: 'Manrope', sans-serif; margin-top: 0.25rem;
  }
  .notif-load-more:hover { border-color: var(--orange); color: var(--orange); }

  @media (max-width: 600px) {
    .notif-topbar { padding: 0 1rem; }
    .notif-page { padding: 1rem 0.75rem 4rem; }
    .notif-top-btn span { display: none; }
    .notif-item { padding: 0.85rem 0.9rem; gap: 0.75rem; }
    .notif-tabs { gap: 0.3rem; }
    .notif-tab { font-size: 0.78rem; padding: 0.5rem 0.4rem; }
  }
`;

// ── TYPE CONFIG ───────────────────────────────────
const typeConfig = {
  new_message:       { icon: <FaEnvelope />,     cls: 'msg',      badge: 'badge-msg'     },
  booking_created:   { icon: <FaCalendarCheck />, cls: 'booking',  badge: 'badge-booking' },
  booking_confirmed: { icon: <FaCheckCircle />,   cls: 'booking',  badge: 'badge-booking' },
  booking_cancelled: { icon: <FaCalendarCheck />, cls: 'booking',  badge: 'badge-booking' },
  new_hostel:        { icon: <FaHome />,          cls: 'hostel',   badge: 'badge-hostel'  },
  hostel_verified:   { icon: <FaCheckCircle />,   cls: 'verified', badge: 'badge-hostel'  },
  system:            { icon: <FaBell />,          cls: 'system',   badge: 'badge-system'  },
};

// ── TIME FORMAT ───────────────────────────────────
const formatTime = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000)    return 'Just now';
  if (diff < 3600000)  return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

// ── MAIN COMPONENT ────────────────────────────────
const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearUnreadNotifs } = useSocket();

  const [notifications, setNotifications] = useState([]);
  const [loading,        setLoading]       = useState(true);
  const [activeTab,      setActiveTab]     = useState('all');
  const [unreadCount,    setUnreadCount]   = useState(0);
  const [page,           setPage]          = useState(1);
  const [hasMore,        setHasMore]       = useState(false);
  const [loadingMore,    setLoadingMore]   = useState(false);

  const loadNotifications = useCallback(async (pg = 1) => {
    try {
      if (pg === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await api.get(`/notifications?page=${pg}&limit=20`);
      const data = res.data;

      if (pg === 1) {
        setNotifications(data.data || []);
      } else {
        setNotifications((prev) => [...prev, ...(data.data || [])]);
      }

      setUnreadCount(data.unread || 0);
      setHasMore(pg < (data.pages || 1));
      clearUnreadNotifs();
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [clearUnreadNotifs]);

  useEffect(() => {
    loadNotifications(1);
  }, []);

  const handleClick = async (notif) => {
    if (!notif.read) {
      try {
        await api.put(`/notifications/${notif._id}/read`);
        setNotifications((prev) =>
          prev.map((n) => n._id === notif._id ? { ...n, read: true } : n)
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {}
    }
    if (notif.link) navigate(notif.link);
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success('Notification removed');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Clear all notifications?')) return;
    try {
      await api.delete('/notifications/delete-all');
      setNotifications([]);
      setUnreadCount(0);
      toast.success('All notifications cleared');
    } catch {
      toast.error('Failed to clear notifications');
    }
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === 'all')      return true;
    if (activeTab === 'unread')   return !n.read;
    if (activeTab === 'messages') return n.type === 'new_message';
    if (activeTab === 'bookings') return n.type.includes('booking');
    return true;
  });

  const tabCounts = {
    all:      notifications.length,
    unread:   notifications.filter((n) => !n.read).length,
    messages: notifications.filter((n) => n.type === 'new_message').length,
    bookings: notifications.filter((n) => n.type.includes('booking')).length,
  };

  return (
    <>
      <style>{styles}</style>

      {/* TOPBAR */}
      <div className="notif-topbar">
        <div className="notif-topbar-left">
          <button className="notif-back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
          <span className="notif-topbar-title">Notifications</span>
          {unreadCount > 0 && (
            <span className="notif-topbar-badge">{unreadCount} new</span>
          )}
        </div>
        <div className="notif-topbar-actions">
          {unreadCount > 0 && (
            <button className="notif-top-btn" onClick={handleMarkAllRead}>
              <FaCheck /> <span>Mark all read</span>
            </button>
          )}
          {notifications.length > 0 && (
            <button className="notif-top-btn danger" onClick={handleDeleteAll}>
              <FaTrash /> <span>Clear all</span>
            </button>
          )}
        </div>
      </div>

      <div className="notif-page">

        {/* TABS */}
        <div className="notif-tabs">
          {[
            { key: 'all',      label: 'All'      },
            { key: 'unread',   label: 'Unread'   },
            { key: 'messages', label: 'Messages' },
            { key: 'bookings', label: 'Bookings' },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`notif-tab${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {tabCounts[tab.key] > 0 && (
                <span className="notif-tab-count">{tabCounts[tab.key]}</span>
              )}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="notif-loading">
            <FaSpinner className="notif-spinner" />
            <p>Loading notifications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="notif-empty">
            <div className="notif-empty-ico"><FaBellSlash /></div>
            <h3>
              {activeTab === 'unread'
                ? "You're all caught up! 🎉"
                : 'No notifications yet'}
            </h3>
            <p>
              {activeTab === 'unread'
                ? 'No unread notifications'
                : 'When you receive messages or booking updates they will appear here'}
            </p>
          </div>
        ) : (
          <div className="notif-list">
            {filtered.map((notif) => {
              const config = typeConfig[notif.type] || typeConfig.system;
              return (
                <div
                  key={notif._id}
                  className={`notif-item${!notif.read ? ' unread' : ''}`}
                  onClick={() => handleClick(notif)}
                >
                  {/* Sender avatar with type badge OR plain icon */}
                  {notif.sender ? (
                    <div className="notif-sender-avatar">
                      {notif.sender.profilePicture
                        ? <img src={notif.sender.profilePicture} alt="" />
                        : (notif.sender.firstName?.[0] || '?').toUpperCase()
                      }
                      <div className={`notif-type-badge ${config.badge}`}>
                        {config.icon}
                      </div>
                    </div>
                  ) : (
                    <div className={`notif-icon ${config.cls}`}>
                      {config.icon}
                    </div>
                  )}

                  <div className="notif-content">
                    <div className="notif-title">{notif.title}</div>
                    <div className="notif-body">{notif.body}</div>
                    <div className="notif-time">{formatTime(notif.createdAt)}</div>
                  </div>

                  <div className="notif-actions">
                    <button
                      className="notif-del-btn"
                      title="Remove"
                      onClick={(e) => handleDelete(e, notif._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}

            {hasMore && (
              <button
                className="notif-load-more"
                disabled={loadingMore}
                onClick={() => {
                  const next = page + 1;
                  setPage(next);
                  loadNotifications(next);
                }}
              >
                {loadingMore ? 'Loading...' : 'Load more notifications'}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;