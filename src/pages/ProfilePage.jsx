import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';
import {
  FaCamera, FaEdit, FaEnvelope, FaPhone,
  FaCalendarAlt, FaUserGraduate, FaHome, FaBookmark,
  FaHeart, FaBell, FaSignOutAlt, FaSave,
  FaTimes, FaLock, FaEye, FaEyeSlash, FaCheckCircle,
  FaSpinner, FaUser, FaShieldAlt, FaKey, FaBars,
  FaChartLine, FaBuilding,
} from 'react-icons/fa';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Nunito+Sans:wght@400;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:        #0f1923;
    --navy-mid:    #1a2e3d;
    --amber:       #f5a623;
    --amber-light: #fef3d8;
    --amber-dark:  #d4870a;
    --white:       #ffffff;
    --off-white:   #f7f8fa;
    --light-gray:  #f0f2f5;
    --border:      #e8eaed;
    --mid:         #6b7280;
    --dark:        #111827;
    --wa-green:    #25D366;
    --success:     #059669;
    --success-pale:#ecfdf5;
    --danger:      #dc2626;
    --radius:      12px;
    --radius-lg:   16px;
    --font:        'Plus Jakarta Sans', 'Nunito Sans', sans-serif;
    --shadow:      0 1px 3px rgba(0,0,0,0.08);
    --shadow-md:   0 4px 16px rgba(0,0,0,0.10);
  }

  body { font-family: var(--font); background: var(--off-white); color: var(--dark); }
  a { text-decoration: none; color: inherit; }
  button { font-family: var(--font); cursor: pointer; border: none; background: none; padding: 0; }

  .prof-page { min-height: 100vh; background: var(--off-white); }

  /* ══ COVER ══ */
  .prof-cover-wrap {
    position: relative; height: 300px;
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 50%, #1e3a52 100%);
    overflow: hidden;
  }
  .prof-cover-wrap::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 70% 40%, rgba(245,166,35,0.18) 0%, transparent 60%);
  }
  .prof-cover-wrap::after {
    content: ''; position: absolute; right: -80px; top: -80px;
    width: 380px; height: 380px; border-radius: 50%;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
  }
  /* Amber accent ring */
  .prof-cover-wrap .cover-ring {
    position: absolute; left: -60px; bottom: -120px;
    width: 340px; height: 340px; border-radius: 50%;
    border: 40px solid rgba(245,166,35,0.07);
    pointer-events: none;
  }
  .prof-cover-edit-btn {
    position: absolute; bottom: 1rem; right: 1rem;
    display: flex; align-items: center; gap: 0.5rem;
    background: rgba(255,255,255,0.12); color: white;
    border: 1.5px solid rgba(255,255,255,0.2);
    border-radius: 9px; padding: 0.5rem 1rem;
    font-size: 0.82rem; font-weight: 700; cursor: pointer;
    font-family: var(--font); transition: all .2s;
    backdrop-filter: blur(8px);
  }
  .prof-cover-edit-btn:hover { background: rgba(255,255,255,0.2); }

  /* ══ HEADER ══ */
  .prof-header { background: white; border-bottom: 1.5px solid var(--border); box-shadow: var(--shadow); }
  .prof-header-inner { max-width: 1080px; margin: 0 auto; padding: 0 1.5rem; }
  .prof-avatar-row {
    display: flex; align-items: flex-end; gap: 1.5rem;
    margin-top: -64px; padding-bottom: 1rem; flex-wrap: wrap;
  }
  .prof-avatar-wrap { position: relative; flex-shrink: 0; }
  .prof-avatar {
    width: 160px; height: 160px; border-radius: 50%;
    border: 4px solid white;
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    display: flex; align-items: center; justify-content: center;
    font-size: 3.2rem; font-weight: 900; color: white;
    overflow: hidden; box-shadow: 0 6px 24px rgba(15,25,35,0.22);
  }
  .prof-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .prof-avatar-uploading {
    position: absolute; inset: 0; border-radius: 50%;
    background: rgba(15,25,35,0.55);
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 1.5rem;
  }
  .prof-avatar-edit {
    position: absolute; bottom: 8px; right: 8px;
    width: 38px; height: 38px; border-radius: 50%;
    background: var(--amber); border: 3px solid white;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--navy); font-size: 0.85rem;
    transition: all .2s; box-shadow: 0 2px 8px rgba(245,166,35,0.4);
  }
  .prof-avatar-edit:hover { background: var(--amber-dark); transform: scale(1.08); }

  .prof-header-info { flex: 1; padding-bottom: 0.5rem; min-width: 0; }
  .prof-name { font-size: 1.75rem; font-weight: 900; color: var(--navy); line-height: 1.15; letter-spacing: -.5px; }
  .prof-role-badge {
    display: inline-flex; align-items: center; gap: 0.35rem;
    background: var(--amber-light); color: var(--amber-dark);
    border: 1.5px solid rgba(245,166,35,0.3);
    border-radius: 20px; padding: 3px 12px;
    font-size: 0.75rem; font-weight: 800; margin-top: 0.35rem; letter-spacing: .2px;
  }
  .prof-bio { font-size: .88rem; color: var(--mid); margin-top: 0.5rem; font-weight: 500; line-height: 1.6; }
  .prof-verified-badge {
    display: inline-flex; align-items: center; gap: 0.3rem;
    background: var(--success-pale); color: var(--success);
    border-radius: 20px; padding: 3px 10px; font-size: 0.72rem; font-weight: 800;
    border: 1px solid #a7f3d0;
  }

  .prof-header-actions {
    display: flex; gap: 0.5rem; align-items: flex-end;
    padding-bottom: 1rem; flex-wrap: wrap; flex-shrink: 0;
  }
  .prof-action-btn {
    display: flex; align-items: center; gap: 0.45rem;
    padding: 0.55rem 1.1rem; border-radius: 9px;
    font-size: .85rem; font-weight: 800; cursor: pointer;
    transition: all .2s; font-family: var(--font); border: none; white-space: nowrap;
  }
  .prof-action-btn.primary {
    background: var(--navy); color: white;
    box-shadow: 0 4px 14px rgba(15,25,35,0.25);
  }
  .prof-action-btn.primary:hover { background: var(--navy-mid); transform: translateY(-1px); }
  .prof-action-btn.secondary { background: var(--light-gray); color: var(--dark); border: 1.5px solid var(--border); }
  .prof-action-btn.secondary:hover { background: var(--border); }
  .prof-action-btn.amber { background: var(--amber); color: var(--navy); box-shadow: 0 3px 10px rgba(245,166,35,.3); }
  .prof-action-btn.amber:hover { background: var(--amber-dark); transform: translateY(-1px); }
  .prof-action-btn.danger { background: rgba(220,38,38,0.08); color: var(--danger); border: 1.5px solid rgba(220,38,38,0.2); }
  .prof-action-btn.danger:hover { background: rgba(220,38,38,0.14); }

  /* ══ NAV TABS ══ */
  .prof-nav {
    display: flex; gap: 0; border-top: 1.5px solid var(--border);
    overflow-x: auto; scrollbar-width: none;
  }
  .prof-nav::-webkit-scrollbar { display: none; }
  .prof-nav-tab {
    display: flex; align-items: center; gap: 0.4rem;
    padding: 0.9rem 1.25rem; font-size: .88rem; font-weight: 700;
    color: var(--mid); cursor: pointer; border: none; background: none;
    font-family: var(--font); transition: all .2s;
    position: relative; white-space: nowrap;
    border-bottom: 3px solid transparent;
  }
  .prof-nav-tab:hover { background: var(--off-white); color: var(--navy); }
  .prof-nav-tab.active { color: var(--navy); border-bottom-color: var(--amber); font-weight: 900; }

  /* ══ BODY ══ */
  .prof-body {
    max-width: 1080px; margin: 0 auto; padding: 1.5rem;
    display: grid; grid-template-columns: 340px 1fr; gap: 1.5rem; align-items: start;
  }

  /* ══ CARDS ══ */
  .prof-card {
    background: white; border-radius: var(--radius-lg);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    overflow: hidden; margin-bottom: 1rem;
  }
  .prof-card-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 1.25rem; border-bottom: 1.5px solid var(--border); background: var(--off-white);
  }
  .prof-card-title {
    font-size: .92rem; font-weight: 900; color: var(--navy);
    display: flex; align-items: center; gap: 0.5rem; letter-spacing: -.2px;
  }
  .prof-card-title svg { color: var(--amber); }
  .prof-card-body { padding: 1.25rem; }
  .prof-edit-link {
    font-size: .8rem; font-weight: 800; color: var(--amber-dark);
    cursor: pointer; background: none; border: none;
    font-family: var(--font); transition: color .2s;
  }
  .prof-edit-link:hover { color: var(--amber); }

  /* ══ INFO ROWS ══ */
  .prof-info-row {
    display: flex; align-items: center; gap: 0.85rem;
    padding: 0.65rem 0; border-bottom: 1px solid rgba(0,0,0,0.04);
  }
  .prof-info-row:last-child { border-bottom: none; }
  .prof-info-icon {
    width: 38px; height: 38px; border-radius: 50%;
    flex-shrink: 0; display: flex; align-items: center;
    justify-content: center; font-size: .9rem;
  }
  .prof-info-label { font-size: .7rem; font-weight: 800; color: var(--mid); text-transform: uppercase; letter-spacing: .6px; }
  .prof-info-value { font-size: .88rem; font-weight: 700; color: var(--dark); }

  /* ══ STATS ══ */
  .prof-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
  .prof-stat-box {
    background: var(--off-white); border-radius: 10px; padding: 0.9rem 0.75rem;
    text-align: center; cursor: pointer; transition: all .2s;
    border: 1.5px solid var(--border);
  }
  .prof-stat-box:hover {
    background: var(--amber-light); border-color: rgba(245,166,35,.35);
    transform: translateY(-2px); box-shadow: 0 6px 16px rgba(245,166,35,.15);
  }
  .prof-stat-val { font-size: 1.4rem; font-weight: 900; color: var(--navy); line-height: 1; }
  .prof-stat-lbl { font-size: .67rem; font-weight: 800; color: var(--mid); text-transform: uppercase; letter-spacing: .5px; margin-top: .25rem; }

  /* ══ FORM SECTIONS ══ */
  .prof-form-section {
    background: white; border-radius: var(--radius-lg);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    margin-bottom: 1rem; overflow: hidden;
  }
  .prof-form-head {
    padding: 1.1rem 1.25rem; border-bottom: 1.5px solid var(--border);
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%);
    display: flex; align-items: center; gap: 0.75rem;
  }
  .prof-form-head-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: rgba(245,166,35,0.2); color: var(--amber);
    display: flex; align-items: center; justify-content: center; font-size: 1.05rem;
    flex-shrink: 0;
  }
  .prof-form-head h3 { font-size: 1rem; font-weight: 900; color: white; letter-spacing: -.2px; }
  .prof-form-head p { font-size: .75rem; color: rgba(255,255,255,0.55); margin-top: 2px; }
  .prof-form-body { padding: 1.5rem; }
  .prof-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .prof-form-group { margin-bottom: 1rem; }
  .prof-form-group.full { grid-column: 1 / -1; }

  .prof-label {
    display: block; font-size: .68rem; font-weight: 800; color: var(--mid);
    text-transform: uppercase; letter-spacing: .7px; margin-bottom: .35rem;
  }
  .prof-input {
    width: 100%; padding: .65rem .9rem;
    border: 1.5px solid var(--border); border-radius: 9px;
    font-family: var(--font); font-size: .875rem;
    color: var(--dark); background: var(--off-white); outline: none; transition: all .18s;
  }
  .prof-input:focus { border-color: var(--amber); background: white; box-shadow: 0 0 0 3px rgba(245,166,35,.12); }
  .prof-input:disabled { background: var(--light-gray); color: var(--mid); cursor: not-allowed; }
  .prof-textarea {
    width: 100%; padding: .65rem .9rem;
    border: 1.5px solid var(--border); border-radius: 9px;
    font-family: var(--font); font-size: .875rem;
    color: var(--dark); background: var(--off-white); outline: none;
    transition: all .18s; resize: vertical; min-height: 90px;
  }
  .prof-textarea:focus { border-color: var(--amber); background: white; box-shadow: 0 0 0 3px rgba(245,166,35,.12); }

  .prof-input-wrap { position: relative; }
  .prof-input-wrap .prof-input { padding-right: 2.5rem; }
  .prof-input-eye {
    position: absolute; right: .75rem; top: 50%; transform: translateY(-50%);
    cursor: pointer; color: var(--mid); font-size: .9rem;
    background: none; border: none; padding: 0; transition: color .2s;
  }
  .prof-input-eye:hover { color: var(--navy); }

  .prof-form-actions {
    display: flex; gap: .75rem; justify-content: flex-end;
    padding-top: 1rem; border-top: 1.5px solid var(--border); margin-top: .5rem;
  }
  .prof-save-btn {
    display: flex; align-items: center; gap: .5rem;
    padding: .7rem 1.5rem; border-radius: 9px;
    background: var(--navy); color: white; border: none;
    font-size: .88rem; font-weight: 800; cursor: pointer;
    transition: all .2s; font-family: var(--font);
    box-shadow: 0 4px 14px rgba(15,25,35,.25);
  }
  .prof-save-btn:hover:not(:disabled) { background: var(--navy-mid); transform: translateY(-1px); }
  .prof-save-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }
  .prof-cancel-btn {
    display: flex; align-items: center; gap: .5rem;
    padding: .7rem 1.25rem; border-radius: 9px;
    background: var(--light-gray); color: var(--dark);
    border: 1.5px solid var(--border);
    font-size: .88rem; font-weight: 700; cursor: pointer;
    transition: all .2s; font-family: var(--font);
  }
  .prof-cancel-btn:hover { background: var(--border); }

  /* ══ PASSWORD STRENGTH ══ */
  .prof-pwd-strength { margin-top: .5rem; }
  .prof-pwd-bars { display: flex; gap: 4px; margin-bottom: .3rem; }
  .prof-pwd-bar { flex: 1; height: 4px; border-radius: 2px; background: var(--border); transition: all .3s; }
  .prof-pwd-bar.weak   { background: var(--danger); }
  .prof-pwd-bar.fair   { background: #f59e0b; }
  .prof-pwd-bar.strong { background: var(--success); }
  .prof-pwd-text { font-size: .72rem; font-weight: 800; }
  .pwd-weak   { color: var(--danger); }
  .pwd-fair   { color: #f59e0b; }
  .pwd-strong { color: var(--success); }

  /* ══ ALERTS ══ */
  .prof-alert {
    display: flex; align-items: center; gap: .75rem;
    padding: .85rem 1.1rem; border-radius: 9px; margin-bottom: 1rem;
    font-size: .85rem; font-weight: 700;
  }
  .prof-alert.success { background: var(--success-pale); color: #065f46; border: 1.5px solid #a7f3d0; }
  .prof-alert.error   { background: #fef2f2; color: var(--danger); border: 1.5px solid #fecaca; }

  /* ══ LOADING ══ */
  .prof-loading {
    min-height: 60vh; display: flex; align-items: center;
    justify-content: center; flex-direction: column; gap: 1rem;
    font-family: var(--font);
  }
  .prof-spinner { animation: spin .8s linear infinite; font-size: 2rem; color: var(--amber); }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ══ RESPONSIVE ══ */
  @media(max-width: 900px) {
    .prof-body { grid-template-columns: 1fr; }
    .prof-cover-wrap { height: 220px; }
    .prof-avatar { width: 130px; height: 130px; font-size: 2.8rem; }
    .prof-avatar-row { margin-top: -50px; }
    .prof-name { font-size: 1.5rem; }
    .prof-form-grid { grid-template-columns: 1fr; }
  }
  @media(max-width: 600px) {
    .prof-body { padding: 1rem .75rem; }
    .prof-header-inner { padding: 0 .75rem; }
    .prof-avatar { width: 110px; height: 110px; font-size: 2.2rem; }
    .prof-avatar-row { margin-top: -42px; gap: .75rem; }
    .prof-name { font-size: 1.3rem; }
    .prof-header-actions { width: 100%; }
    .prof-action-btn { flex: 1; justify-content: center; font-size: .8rem; }
    .prof-nav-tab { padding: .75rem .9rem; font-size: .82rem; }
    .prof-cover-wrap { height: 175px; }
  }
`;

const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', cls: '' };
  let score = 0;
  if (pwd.length >= 8)          score++;
  if (/[A-Z]/.test(pwd))        score++;
  if (/[0-9]/.test(pwd))        score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { score, label: 'Weak',   cls: 'pwd-weak'   };
  if (score <= 2) return { score, label: 'Fair',   cls: 'pwd-fair'   };
  return               { score, label: 'Strong', cls: 'pwd-strong' };
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const avatarInputRef = useRef(null);

  const [activeTab,       setActiveTab]       = useState('about');
  const [pageLoading,     setPageLoading]     = useState(true);
  const [profileData,     setProfileData]     = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [saving,    setSaving]    = useState(false);
  const [formData,  setFormData]  = useState({});
  const [formAlert, setFormAlert] = useState(null);

  const [pwdData,   setPwdData]   = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdAlert,  setPwdAlert]  = useState(null);
  const [showPwd,   setShowPwd]   = useState({ current: false, new: false, confirm: false });

  const [stats, setStats] = useState({ bookings: 0, messages: 0, properties: 0, notifications: 0 });

  const pwdStrength = getPasswordStrength(pwdData.newPassword);

  // ── LOAD PROFILE + STATS ──────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setPageLoading(true);
        let data = user;
        try {
          const res = await api.get('/users/profile');
          data = res.data.user || res.data.data || res.data;
        } catch { /* fallback to auth context user */ }

        setProfileData(data);
        setFormData({
          firstName: data?.firstName || '',
          lastName:  data?.lastName  || '',
          email:     data?.email     || '',
          phone:     data?.phone     || '',
          studentId: data?.studentId || '',
          bio:       data?.bio       || '',
        });

        const isOwner = data?.role === 'owner' || data?.role === 'landlord';

        const [messagesRes, notifsRes] = await Promise.all([
          api.get('/messages/unread-count').catch(() => ({ data: { count: 0 } })),
          api.get('/notifications/unread-count').catch(() => ({ data: { count: 0 } })),
        ]);

        let roleRes = { data: {} };
        if (isOwner) {
          roleRes = await api.get('/hostels/my-hostels')
            .catch(() => ({ data: { hostels: [], data: [] } }));
        } else {
          roleRes = await api.get('/bookings?limit=1')
            .catch(() => ({ data: { total: 0 } }));
        }

        setStats({
          messages:      messagesRes.data?.count || 0,
          notifications: notifsRes.data?.count   || 0,
          bookings:      isOwner ? 0 : (roleRes.data?.total || roleRes.data?.count || 0),
          properties:    isOwner
            ? (roleRes.data?.hostels?.length || roleRes.data?.data?.length || roleRes.data?.count || 0)
            : 0,
        });

      } catch (err) {
        console.error('Profile load error:', err);
        if (user) {
          setProfileData(user);
          setFormData({
            firstName: user.firstName || '',
            lastName:  user.lastName  || '',
            email:     user.email     || '',
            phone:     user.phone     || '',
            studentId: user.studentId || '',
            bio:       user.bio       || '',
          });
        }
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, [user]);

  // ── SAVE PROFILE ──────────────────────────────
  const handleSaveProfile = async () => {
    if (!formData.firstName || !formData.lastName) {
      setFormAlert({ type: 'error', msg: 'First and last name are required' });
      return;
    }
    setSaving(true);
    setFormAlert(null);
    try {
      const res = await api.put('/users/profile', formData);
      const updated = res.data.user || res.data.data || res.data;
      setProfileData(updated);
      updateUser(updated);
      setFormAlert({ type: 'success', msg: 'Profile updated successfully!' });
      setActiveTab('about');
      toast.success('Profile updated!');
    } catch (err) {
      setFormAlert({ type: 'error', msg: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  // ── CHANGE PASSWORD ───────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pwdData.currentPassword || !pwdData.newPassword) {
      setPwdAlert({ type: 'error', msg: 'Please fill in all password fields' }); return;
    }
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      setPwdAlert({ type: 'error', msg: 'New passwords do not match' }); return;
    }
    if (pwdData.newPassword.length < 8) {
      setPwdAlert({ type: 'error', msg: 'Password must be at least 8 characters' }); return;
    }
    setPwdSaving(true); setPwdAlert(null);
    try {
      await api.put('/users/change-password', {
        currentPassword: pwdData.currentPassword,
        newPassword:     pwdData.newPassword,
      });
      setPwdAlert({ type: 'success', msg: 'Password changed successfully!' });
      setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed!');
    } catch (err) {
      setPwdAlert({ type: 'error', msg: err.response?.data?.message || 'Failed to change password' });
    } finally {
      setPwdSaving(false);
    }
  };

  // ── AVATAR UPLOAD ─────────────────────────────
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    const fd = new FormData();
    fd.append('profilePicture', file);
    setAvatarUploading(true);
    try {
      const res = await api.put('/users/profile/avatar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updated = res.data.user || res.data.data || res.data;
      setProfileData(updated);
      updateUser(updated);
      toast.success('Profile picture updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  if (pageLoading) {
    return (
      <>
        <style>{styles}</style>
        <div className="prof-loading">
          <FaSpinner className="prof-spinner" />
          <p style={{ color: 'var(--mid)', fontWeight: 600, fontFamily: 'var(--font)' }}>
            Loading profile…
          </p>
        </div>
      </>
    );
  }

  const displayUser = profileData || user;
  const initials    = ((displayUser?.firstName?.[0] || '') + (displayUser?.lastName?.[0] || '')).toUpperCase() || 'ME';
  const isOwner     = displayUser?.role === 'owner' || displayUser?.role === 'landlord';
  const joinDate    = displayUser?.createdAt
    ? new Date(displayUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  const statBoxes = isOwner
    ? [
        { val: stats.properties,   lbl: 'My Listings',    link: '/landlord-dashboard' },
        { val: stats.messages,     lbl: 'Messages',       link: '/messages'           },
        { val: stats.notifications,lbl: 'Notifications',  link: '/notifications'      },
      ]
    : [
        { val: stats.bookings,     lbl: 'Bookings',       link: '/bookings'           },
        { val: stats.messages,     lbl: 'Messages',       link: '/messages'           },
        { val: stats.notifications,lbl: 'Notifications',  link: '/notifications'      },
      ];

  const quickLinks = isOwner
    ? [
        { icon: <FaBuilding />, label: 'My Dashboard',       link: '/landlord-dashboard', bg: 'rgba(245,166,35,0.12)',  color: 'var(--amber-dark)' },
        { icon: <FaHome />,     label: 'Browse Properties',  link: '/properties',         bg: 'rgba(15,25,35,0.07)',   color: 'var(--navy)'       },
        { icon: <FaEnvelope />, label: 'Messages',           link: '/messages',           bg: 'rgba(15,25,35,0.07)',   color: 'var(--navy)'       },
        { icon: <FaBell />,     label: 'Notifications',      link: '/notifications',      bg: 'rgba(245,166,35,0.12)', color: 'var(--amber-dark)' },
      ]
    : [
        { icon: <FaHome />,     label: 'Browse Properties',  link: '/properties',         bg: 'rgba(245,166,35,0.12)', color: 'var(--amber-dark)' },
        { icon: <FaBookmark />, label: 'My Bookings',        link: '/bookings',           bg: 'rgba(15,25,35,0.07)',   color: 'var(--navy)'       },
        { icon: <FaHeart />,    label: 'Saved Properties',   link: '/favorites',          bg: 'rgba(239,68,68,0.1)',   color: '#ef4444'           },
        { icon: <FaEnvelope />, label: 'Messages',           link: '/messages',           bg: 'rgba(15,25,35,0.07)',   color: 'var(--navy)'       },
        { icon: <FaBell />,     label: 'Notifications',      link: '/notifications',      bg: 'rgba(245,166,35,0.12)', color: 'var(--amber-dark)' },
      ];

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      <div className="prof-page">

        {/* ══ COVER ══ */}
        <div className="prof-cover-wrap">
          <div className="cover-ring" />
          <button className="prof-cover-edit-btn">
            <FaCamera /> Edit Cover
          </button>
        </div>

        {/* ══ HEADER ══ */}
        <div className="prof-header">
          <div className="prof-header-inner">
            <div className="prof-avatar-row">

              {/* Avatar */}
              <div className="prof-avatar-wrap">
                <div className="prof-avatar">
                  {displayUser?.profilePicture
                    ? <img src={displayUser.profilePicture} alt={displayUser.firstName} />
                    : initials
                  }
                  {avatarUploading && (
                    <div className="prof-avatar-uploading">
                      <FaSpinner style={{ animation: 'spin .8s linear infinite' }} />
                    </div>
                  )}
                </div>
                <div
                  className="prof-avatar-edit"
                  onClick={() => !avatarUploading && avatarInputRef.current?.click()}
                  title="Change profile picture"
                >
                  {avatarUploading
                    ? <FaSpinner style={{ animation: 'spin .8s linear infinite' }} />
                    : <FaCamera />
                  }
                </div>
                <input ref={avatarInputRef} type="file" accept="image/*"
                  style={{ display: 'none' }} onChange={handleAvatarUpload} />
              </div>

              {/* Name + role */}
              <div className="prof-header-info">
                <div className="prof-name">
                  {displayUser?.firstName} {displayUser?.lastName}
                </div>
                <div className="prof-role-badge">
                  {isOwner ? <FaBuilding /> : <FaUserGraduate />}
                  {isOwner ? 'Property Owner' : 'PezaNyumba Member'}
                </div>
                {displayUser?.verified && (
                  <div style={{ marginTop: 6 }}>
                    <span className="prof-verified-badge">
                      <FaCheckCircle /> Verified Account
                    </span>
                  </div>
                )}
                {displayUser?.bio && <p className="prof-bio">{displayUser.bio}</p>}
              </div>

              {/* Actions */}
              <div className="prof-header-actions">
                <button className="prof-action-btn primary" onClick={() => setActiveTab('edit')}>
                  <FaUser /> Edit Profile
                </button>
                <button className="prof-action-btn secondary" onClick={() => setActiveTab('security')}>
                  <FaLock />
                </button>
                <button className="prof-action-btn danger" onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>

            {/* Nav tabs */}
            <div className="prof-nav">
              {[
                { key: 'about',    label: 'About',         icon: <FaUser />  },
                { key: 'edit',     label: 'Edit Profile',  icon: <FaEdit />  },
                { key: 'security', label: 'Security',      icon: <FaLock />  },
              ].map(tab => (
                <button
                  key={tab.key}
                  className={`prof-nav-tab${activeTab === tab.key ? ' active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ══ BODY ══ */}
        <div className="prof-body">

          {/* ── LEFT COLUMN ── */}
          <div>

            {/* Activity stats */}
            <div className="prof-card">
              <div className="prof-card-head">
                <div className="prof-card-title"><FaChartLine /> Activity</div>
              </div>
              <div className="prof-card-body">
                <div className="prof-stats-grid">
                  {statBoxes.map((s, i) => (
                    <div key={i} className="prof-stat-box" onClick={() => navigate(s.link)}>
                      <div className="prof-stat-val">{s.val}</div>
                      <div className="prof-stat-lbl">{s.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* About info */}
            <div className="prof-card">
              <div className="prof-card-head">
                <div className="prof-card-title"><FaUser /> About</div>
                <button className="prof-edit-link" onClick={() => setActiveTab('edit')}>Edit</button>
              </div>
              <div className="prof-card-body">
                {[
                  { icon: <FaEnvelope />, bg: 'rgba(15,25,35,0.07)',   color: 'var(--navy)',       label: 'Email',        value: displayUser?.email || '—'              },
                  { icon: <FaPhone />,    bg: 'rgba(5,150,105,0.1)',   color: '#059669',           label: 'Phone',        value: displayUser?.phone || 'Not added'      },
                  { icon: isOwner ? <FaBuilding /> : <FaUserGraduate />,
                                          bg: 'rgba(245,166,35,0.12)', color: 'var(--amber-dark)', label: isOwner ? 'Role' : 'Member ID',
                                          value: isOwner ? 'Property Owner' : (displayUser?.studentId || '—')            },
                  { icon: <FaCalendarAlt />, bg: 'rgba(245,166,35,0.12)', color: 'var(--amber-dark)', label: 'Member Since', value: joinDate },
                  { icon: <FaShieldAlt />,
                    bg: displayUser?.verified ? 'rgba(5,150,105,0.1)' : 'rgba(245,158,11,0.1)',
                    color: displayUser?.verified ? '#059669' : '#d97706',
                    label: 'Status',
                    value: displayUser?.verified ? 'Verified ✓' : 'Pending Verification' },
                ].map((item, i) => (
                  <div key={i} className="prof-info-row">
                    <div className="prof-info-icon" style={{ background: item.bg, color: item.color }}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="prof-info-label">{item.label}</div>
                      <div className="prof-info-value">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="prof-card">
              <div className="prof-card-head">
                <div className="prof-card-title"><FaBars /> Quick Links</div>
              </div>
              <div className="prof-card-body" style={{ padding: '.75rem' }}>
                {quickLinks.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(item.link)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '.75rem',
                      width: '100%', padding: '.65rem .75rem',
                      borderRadius: 9, border: 'none', background: 'none',
                      cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 700,
                      fontSize: '.88rem', color: 'var(--dark)',
                      transition: 'background .15s', textAlign: 'left',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--off-white)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: item.bg, color: item.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      fontSize: '.9rem',
                    }}>
                      {item.icon}
                    </div>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div>

            {/* ABOUT TAB */}
            {activeTab === 'about' && (
              <div className="prof-card">
                <div className="prof-card-head">
                  <div className="prof-card-title"><FaUser /> Profile Overview</div>
                </div>
                <div className="prof-card-body">

                  {/* Profile banner */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '1.25rem',
                    marginBottom: '1.5rem', padding: '1.25rem',
                    background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)',
                    borderRadius: 12, position: 'relative', overflow: 'hidden',
                  }}>
                    {/* Amber accent */}
                    <div style={{
                      position: 'absolute', right: -30, top: -30,
                      width: 120, height: 120, borderRadius: '50%',
                      border: '25px solid rgba(245,166,35,0.12)', pointerEvents: 'none',
                    }} />
                    <div style={{
                      width: 72, height: 72, borderRadius: '50%',
                      border: '3px solid rgba(245,166,35,0.4)',
                      background: 'rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.6rem', fontWeight: 900, color: 'white',
                      overflow: 'hidden', flexShrink: 0,
                    }}>
                      {displayUser?.profilePicture
                        ? <img src={displayUser.profilePicture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : initials
                      }
                    </div>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'white', letterSpacing: '-.3px' }}>
                        {displayUser?.firstName} {displayUser?.lastName}
                      </div>
                      <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>
                        {displayUser?.email}
                      </div>
                      <div style={{ marginTop: 7 }}>
                        <span style={{
                          background: 'rgba(245,166,35,0.25)', color: 'var(--amber)',
                          border: '1px solid rgba(245,166,35,0.35)',
                          borderRadius: 20, padding: '2px 10px',
                          fontSize: '.7rem', fontWeight: 800,
                        }}>
                          {isOwner ? '🏠 Property Owner' : '👤 Member'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {displayUser?.bio && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '.7rem', fontWeight: 800, color: 'var(--mid)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '.4rem' }}>
                        Bio
                      </div>
                      <p style={{ fontSize: '.9rem', color: 'var(--mid)', lineHeight: 1.75, fontWeight: 500 }}>
                        {displayUser.bio}
                      </p>
                    </div>
                  )}

                  {/* Info grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
                    {[
                      { label: 'Full Name',    value: `${displayUser?.firstName || ''} ${displayUser?.lastName || ''}`.trim() },
                      { label: 'Email',        value: displayUser?.email                              },
                      { label: 'Phone',        value: displayUser?.phone || 'Not added'               },
                      { label: 'Role',         value: isOwner ? 'Property Owner' : 'Member'           },
                      { label: 'Member Since', value: joinDate                                        },
                      { label: 'Status',       value: displayUser?.verified ? '✅ Verified' : '⏳ Pending' },
                    ].map((item, i) => (
                      <div key={i} style={{
                        background: 'var(--off-white)', borderRadius: 9,
                        padding: '.75rem', border: '1.5px solid var(--border)',
                      }}>
                        <div style={{ fontSize: '.67rem', fontWeight: 800, color: 'var(--mid)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '.25rem' }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--dark)', wordBreak: 'break-word' }}>
                          {item.value || '—'}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1.5px solid var(--border)', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
                    <button className="prof-action-btn primary" onClick={() => setActiveTab('edit')}>
                      <FaUser /> Edit Profile
                    </button>
                    <button className="prof-action-btn secondary" onClick={() => setActiveTab('security')}>
                      <FaKey /> Change Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* EDIT TAB */}
            {activeTab === 'edit' && (
              <div className="prof-form-section">
                <div className="prof-form-head">
                  <div className="prof-form-head-icon"><FaUser /></div>
                  <div>
                    <h3>Edit Profile</h3>
                    <p>Update your personal information</p>
                  </div>
                </div>
                <div className="prof-form-body">
                  {formAlert && (
                    <div className={`prof-alert ${formAlert.type}`}>
                      {formAlert.type === 'success' ? <FaCheckCircle /> : <FaTimes />}
                      {formAlert.msg}
                    </div>
                  )}
                  <div className="prof-form-grid">
                    <div className="prof-form-group">
                      <label className="prof-label">First Name *</label>
                      <input className="prof-input" value={formData.firstName || ''}
                        onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))}
                        placeholder="First name" />
                    </div>
                    <div className="prof-form-group">
                      <label className="prof-label">Last Name *</label>
                      <input className="prof-input" value={formData.lastName || ''}
                        onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))}
                        placeholder="Last name" />
                    </div>
                    <div className="prof-form-group">
                      <label className="prof-label">Email Address</label>
                      <input className="prof-input" value={formData.email || ''} disabled title="Email cannot be changed" />
                    </div>
                    <div className="prof-form-group">
                      <label className="prof-label">Phone Number</label>
                      <input className="prof-input" value={formData.phone || ''}
                        onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                        placeholder="e.g. 0888123456" />
                    </div>
                    {!isOwner && (
                      <div className="prof-form-group">
                        <label className="prof-label">Member ID</label>
                        <input className="prof-input" value={formData.studentId || ''}
                          onChange={e => setFormData(p => ({ ...p, studentId: e.target.value }))}
                          placeholder="Your member ID" />
                      </div>
                    )}
                    <div className={`prof-form-group${!isOwner ? '' : ' full'}`}>
                      <label className="prof-label">Bio</label>
                      <textarea className="prof-textarea" rows={3}
                        value={formData.bio || ''}
                        onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
                        placeholder="Tell others a little about yourself…" />
                    </div>
                  </div>
                  <div className="prof-form-actions">
                    <button className="prof-cancel-btn" onClick={() => { setActiveTab('about'); setFormAlert(null); }}>
                      <FaTimes /> Cancel
                    </button>
                    <button className="prof-save-btn" onClick={handleSaveProfile} disabled={saving}>
                      {saving
                        ? <><FaSpinner style={{ animation: 'spin .8s linear infinite' }} /> Saving…</>
                        : <><FaSave /> Save Changes</>
                      }
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="prof-form-section">
                <div className="prof-form-head">
                  <div className="prof-form-head-icon"><FaLock /></div>
                  <div>
                    <h3>Change Password</h3>
                    <p>Keep your account secure with a strong password</p>
                  </div>
                </div>
                <div className="prof-form-body">
                  {pwdAlert && (
                    <div className={`prof-alert ${pwdAlert.type}`}>
                      {pwdAlert.type === 'success' ? <FaCheckCircle /> : <FaTimes />}
                      {pwdAlert.msg}
                    </div>
                  )}
                  <form onSubmit={handleChangePassword}>
                    <div className="prof-form-group">
                      <label className="prof-label">Current Password *</label>
                      <div className="prof-input-wrap">
                        <input
                          className="prof-input"
                          type={showPwd.current ? 'text' : 'password'}
                          value={pwdData.currentPassword}
                          onChange={e => setPwdData(p => ({ ...p, currentPassword: e.target.value }))}
                          placeholder="Enter current password"
                        />
                        <button type="button" className="prof-input-eye"
                          onClick={() => setShowPwd(p => ({ ...p, current: !p.current }))}>
                          {showPwd.current ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    <div className="prof-form-group">
                      <label className="prof-label">New Password *</label>
                      <div className="prof-input-wrap">
                        <input
                          className="prof-input"
                          type={showPwd.new ? 'text' : 'password'}
                          value={pwdData.newPassword}
                          onChange={e => setPwdData(p => ({ ...p, newPassword: e.target.value }))}
                          placeholder="Enter new password"
                        />
                        <button type="button" className="prof-input-eye"
                          onClick={() => setShowPwd(p => ({ ...p, new: !p.new }))}>
                          {showPwd.new ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {pwdData.newPassword && (
                        <div className="prof-pwd-strength">
                          <div className="prof-pwd-bars">
                            {[1,2,3,4].map(i => (
                              <div key={i} className={`prof-pwd-bar${
                                i <= pwdStrength.score
                                  ? pwdStrength.score <= 1 ? ' weak' : pwdStrength.score <= 2 ? ' fair' : ' strong'
                                  : ''
                              }`} />
                            ))}
                          </div>
                          <span className={`prof-pwd-text ${pwdStrength.cls}`}>{pwdStrength.label} password</span>
                        </div>
                      )}
                    </div>
                    <div className="prof-form-group">
                      <label className="prof-label">Confirm New Password *</label>
                      <div className="prof-input-wrap">
                        <input
                          className="prof-input"
                          type={showPwd.confirm ? 'text' : 'password'}
                          value={pwdData.confirmPassword}
                          onChange={e => setPwdData(p => ({ ...p, confirmPassword: e.target.value }))}
                          placeholder="Confirm new password"
                        />
                        <button type="button" className="prof-input-eye"
                          onClick={() => setShowPwd(p => ({ ...p, confirm: !p.confirm }))}>
                          {showPwd.confirm ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {pwdData.confirmPassword && pwdData.newPassword !== pwdData.confirmPassword && (
                        <p style={{ fontSize: '.75rem', color: 'var(--danger)', marginTop: 4, fontWeight: 700 }}>❌ Passwords do not match</p>
                      )}
                      {pwdData.confirmPassword && pwdData.newPassword === pwdData.confirmPassword && (
                        <p style={{ fontSize: '.75rem', color: 'var(--success)', marginTop: 4, fontWeight: 700 }}>✅ Passwords match</p>
                      )}
                    </div>

                    {/* Password tips */}
                    <div style={{
                      background: 'var(--off-white)', borderRadius: 10, padding: '.9rem 1rem',
                      marginBottom: '1rem', border: '1.5px solid var(--border)',
                    }}>
                      <div style={{ fontSize: '.78rem', fontWeight: 900, color: 'var(--navy)', marginBottom: '.5rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                        <FaShieldAlt style={{ color: 'var(--amber)' }} /> Password Tips
                      </div>
                      {[
                        'At least 8 characters long',
                        'Mix of uppercase and lowercase letters',
                        'Include numbers and special characters',
                        'Avoid using personal information',
                      ].map((tip, i) => (
                        <div key={i} style={{ fontSize: '.78rem', color: 'var(--mid)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '.4rem', marginTop: 4 }}>
                          <span style={{ color: 'var(--success)', fontSize: '.7rem' }}>✓</span> {tip}
                        </div>
                      ))}
                    </div>

                    <div className="prof-form-actions">
                      <button type="button" className="prof-cancel-btn" onClick={() => { setActiveTab('about'); setPwdAlert(null); }}>
                        <FaTimes /> Cancel
                      </button>
                      <button type="submit" className="prof-save-btn" disabled={pwdSaving}>
                        {pwdSaving
                          ? <><FaSpinner style={{ animation: 'spin .8s linear infinite' }} /> Changing…</>
                          : <><FaKey /> Change Password</>
                        }
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>{/* end right column */}
        </div>{/* end body */}
      </div>{/* end page */}
    </>
  );
};

export default ProfilePage;