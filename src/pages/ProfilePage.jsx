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
    --gray-bg: #f0f2f5;
    --gray-light: #e4e6eb;
    --text-dark: #050505;
    --text-mid: #65676b;
    --text-light: #9ca3af;
    --success: #059669;
    --success-pale: #ecfdf5;
    --danger: #dc2626;
    --card-radius: 12px;
    --transition: all 0.2s ease;
    --shadow: 0 1px 3px rgba(0,0,0,0.12);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.14);
  }

  body { font-family: 'Manrope', sans-serif; background: var(--gray-bg); color: var(--text-dark); }
  .prof-page { min-height: 100vh; background: var(--gray-bg); }

  .prof-cover-wrap {
    position: relative; height: 320px;
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy2) 40%, var(--blue) 70%, #2655d4 100%);
    overflow: hidden;
  }
  .prof-cover-wrap::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 70% 40%, rgba(232,80,26,0.2) 0%, transparent 60%);
  }
  .prof-cover-wrap::after {
    content: ''; position: absolute; right: -100px; top: -100px;
    width: 400px; height: 400px; border-radius: 50%;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  }
  .prof-cover-edit-btn {
    position: absolute; bottom: 1rem; right: 1rem;
    display: flex; align-items: center; gap: 0.5rem;
    background: rgba(255,255,255,0.9); color: var(--text-dark);
    border: none; border-radius: 8px; padding: 0.5rem 1rem;
    font-size: 0.82rem; font-weight: 700; cursor: pointer;
    font-family: 'Manrope', sans-serif; transition: var(--transition);
    backdrop-filter: blur(4px);
  }
  .prof-cover-edit-btn:hover { background: white; }

  .prof-header { background: white; border-bottom: 1px solid var(--gray-light); box-shadow: var(--shadow); }
  .prof-header-inner { max-width: 1080px; margin: 0 auto; padding: 0 1.5rem; }
  .prof-avatar-row {
    display: flex; align-items: flex-end; gap: 1.5rem;
    margin-top: -60px; padding-bottom: 1rem; flex-wrap: wrap;
  }
  .prof-avatar-wrap { position: relative; flex-shrink: 0; }
  .prof-avatar {
    width: 168px; height: 168px; border-radius: 50%;
    border: 4px solid white;
    background: linear-gradient(135deg, var(--navy), var(--blue));
    display: flex; align-items: center; justify-content: center;
    font-size: 3.5rem; font-weight: 900; color: white;
    overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  }
  .prof-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .prof-avatar-edit {
    position: absolute; bottom: 8px; right: 8px;
    width: 36px; height: 36px; border-radius: 50%;
    background: var(--gray-light); border: 2px solid white;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-dark); font-size: 0.85rem;
    transition: var(--transition);
  }
  .prof-avatar-edit:hover { background: var(--orange-pale); color: var(--orange); }
  .prof-header-info { flex: 1; padding-bottom: 0.5rem; min-width: 0; }
  .prof-name { font-size: 1.8rem; font-weight: 900; color: var(--text-dark); line-height: 1.15; }
  .prof-role-badge {
    display: inline-flex; align-items: center; gap: 0.35rem;
    background: var(--orange-pale); color: var(--orange);
    border: 1px solid rgba(232,80,26,0.2);
    border-radius: 20px; padding: 3px 12px;
    font-size: 0.78rem; font-weight: 700; margin-top: 0.35rem;
  }
  .prof-bio { font-size: 0.9rem; color: var(--text-mid); margin-top: 0.5rem; font-weight: 500; }
  .prof-verified-badge {
    display: inline-flex; align-items: center; gap: 0.3rem;
    background: var(--success-pale); color: var(--success);
    border-radius: 20px; padding: 3px 10px; font-size: 0.72rem; font-weight: 700;
  }
  .prof-header-actions {
    display: flex; gap: 0.5rem; align-items: flex-end;
    padding-bottom: 1rem; flex-wrap: wrap; flex-shrink: 0;
  }
  .prof-action-btn {
    display: flex; align-items: center; gap: 0.45rem;
    padding: 0.55rem 1.1rem; border-radius: 8px;
    font-size: 0.88rem; font-weight: 700; cursor: pointer;
    transition: var(--transition); font-family: 'Manrope', sans-serif;
    border: none; white-space: nowrap;
  }
  .prof-action-btn.primary { background: var(--orange); color: white; box-shadow: 0 3px 10px rgba(232,80,26,0.3); }
  .prof-action-btn.primary:hover { background: var(--orange-light); transform: translateY(-1px); }
  .prof-action-btn.secondary { background: var(--gray-light); color: var(--text-dark); }
  .prof-action-btn.secondary:hover { background: #d8dadf; }
  .prof-action-btn.danger { background: rgba(220,38,38,0.1); color: var(--danger); border: 1px solid rgba(220,38,38,0.2); }
  .prof-action-btn.danger:hover { background: rgba(220,38,38,0.15); }

  .prof-nav { display: flex; gap: 0; border-top: 1px solid var(--gray-light); overflow-x: auto; scrollbar-width: none; }
  .prof-nav::-webkit-scrollbar { display: none; }
  .prof-nav-tab {
    display: flex; align-items: center; gap: 0.4rem;
    padding: 0.85rem 1.25rem; font-size: 0.88rem; font-weight: 700;
    color: var(--text-mid); cursor: pointer; border: none; background: none;
    font-family: 'Manrope', sans-serif; transition: var(--transition);
    position: relative; white-space: nowrap; border-bottom: 3px solid transparent;
  }
  .prof-nav-tab:hover { background: var(--gray-bg); color: var(--text-dark); }
  .prof-nav-tab.active { color: var(--orange); border-bottom-color: var(--orange); }

  .prof-body {
    max-width: 1080px; margin: 0 auto; padding: 1.5rem;
    display: grid; grid-template-columns: 360px 1fr; gap: 1.5rem; align-items: start;
  }

  .prof-card {
    background: white; border-radius: var(--card-radius);
    border: 1px solid var(--gray-light);
    box-shadow: var(--shadow); overflow: hidden; margin-bottom: 1rem;
  }
  .prof-card-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 1.25rem; border-bottom: 1px solid var(--gray-light); background: #fafafa;
  }
  .prof-card-title { font-size: 0.95rem; font-weight: 800; color: var(--navy); display: flex; align-items: center; gap: 0.5rem; }
  .prof-card-title svg { color: var(--orange); }
  .prof-card-body { padding: 1.25rem; }
  .prof-edit-link {
    font-size: 0.8rem; font-weight: 700; color: var(--orange);
    cursor: pointer; background: none; border: none;
    font-family: 'Manrope', sans-serif; transition: var(--transition);
  }
  .prof-edit-link:hover { color: var(--orange-light); }

  .prof-info-row {
    display: flex; align-items: center; gap: 0.85rem;
    padding: 0.6rem 0; border-bottom: 1px solid rgba(0,0,0,0.04);
  }
  .prof-info-row:last-child { border-bottom: none; }
  .prof-info-icon { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
  .prof-info-label { font-size: 0.72rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.4px; }
  .prof-info-value { font-size: 0.88rem; font-weight: 700; color: var(--text-dark); }

  .prof-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
  .prof-stat-box {
    background: var(--gray-bg); border-radius: 10px; padding: 0.9rem 0.75rem;
    text-align: center; cursor: pointer; transition: var(--transition); border: 1px solid var(--gray-light);
  }
  .prof-stat-box:hover { background: var(--orange-pale); border-color: rgba(232,80,26,0.2); transform: translateY(-2px); }
  .prof-stat-val { font-size: 1.4rem; font-weight: 900; color: var(--navy); line-height: 1; }
  .prof-stat-lbl { font-size: 0.68rem; font-weight: 700; color: var(--text-mid); text-transform: uppercase; letter-spacing: 0.4px; margin-top: 0.25rem; }

  .prof-form-section {
    background: white; border-radius: var(--card-radius);
    border: 1px solid var(--gray-light); box-shadow: var(--shadow);
    margin-bottom: 1rem; overflow: hidden;
  }
  .prof-form-head {
    padding: 1rem 1.25rem; border-bottom: 1px solid var(--gray-light);
    background: linear-gradient(135deg, var(--navy), var(--navy2));
    display: flex; align-items: center; gap: 0.75rem;
  }
  .prof-form-head-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: rgba(232,80,26,0.2); color: var(--orange);
    display: flex; align-items: center; justify-content: center; font-size: 1rem;
  }
  .prof-form-head h3 { font-size: 1rem; font-weight: 800; color: white; }
  .prof-form-head p { font-size: 0.75rem; color: rgba(255,255,255,0.6); }
  .prof-form-body { padding: 1.5rem; }
  .prof-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .prof-form-group { margin-bottom: 1rem; }
  .prof-form-group.full { grid-column: 1 / -1; }
  .prof-label { display: block; font-size: 0.72rem; font-weight: 700; color: var(--text-mid); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.4rem; }
  .prof-input {
    width: 100%; padding: 0.7rem 0.9rem;
    border: 1.5px solid var(--gray-light); border-radius: 9px;
    font-family: 'Manrope', sans-serif; font-size: 0.875rem;
    color: var(--text-dark); background: white; outline: none; transition: var(--transition);
  }
  .prof-input:focus { border-color: var(--orange); box-shadow: 0 0 0 3px rgba(232,80,26,0.08); }
  .prof-input:disabled { background: var(--gray-bg); color: var(--text-mid); cursor: not-allowed; }
  .prof-textarea {
    width: 100%; padding: 0.7rem 0.9rem;
    border: 1.5px solid var(--gray-light); border-radius: 9px;
    font-family: 'Manrope', sans-serif; font-size: 0.875rem;
    color: var(--text-dark); background: white; outline: none;
    transition: var(--transition); resize: vertical; min-height: 90px;
  }
  .prof-textarea:focus { border-color: var(--orange); box-shadow: 0 0 0 3px rgba(232,80,26,0.08); }
  .prof-input-wrap { position: relative; }
  .prof-input-wrap .prof-input { padding-right: 2.5rem; }
  .prof-input-eye {
    position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%);
    cursor: pointer; color: var(--text-light); font-size: 0.9rem;
    background: none; border: none; padding: 0;
  }
  .prof-input-eye:hover { color: var(--text-mid); }
  .prof-form-actions {
    display: flex; gap: 0.75rem; justify-content: flex-end;
    padding-top: 1rem; border-top: 1px solid var(--gray-light); margin-top: 0.5rem;
  }
  .prof-save-btn {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.7rem 1.5rem; border-radius: 9px;
    background: var(--orange); color: white; border: none;
    font-size: 0.88rem; font-weight: 700; cursor: pointer;
    transition: var(--transition); font-family: 'Manrope', sans-serif;
    box-shadow: 0 3px 10px rgba(232,80,26,0.3);
  }
  .prof-save-btn:hover:not(:disabled) { background: var(--orange-light); transform: translateY(-1px); }
  .prof-save-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .prof-cancel-btn {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.7rem 1.25rem; border-radius: 9px;
    background: var(--gray-light); color: var(--text-dark); border: none;
    font-size: 0.88rem; font-weight: 700; cursor: pointer;
    transition: var(--transition); font-family: 'Manrope', sans-serif;
  }
  .prof-cancel-btn:hover { background: #d8dadf; }

  .prof-pwd-strength { margin-top: 0.5rem; }
  .prof-pwd-bars { display: flex; gap: 4px; margin-bottom: 0.3rem; }
  .prof-pwd-bar { flex: 1; height: 4px; border-radius: 2px; background: var(--gray-light); transition: var(--transition); }
  .prof-pwd-bar.weak   { background: var(--danger); }
  .prof-pwd-bar.fair   { background: #f59e0b; }
  .prof-pwd-bar.strong { background: var(--success); }
  .prof-pwd-text { font-size: 0.72rem; font-weight: 700; }
  .pwd-weak   { color: var(--danger); }
  .pwd-fair   { color: #f59e0b; }
  .pwd-strong { color: var(--success); }

  .prof-alert {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.85rem 1.1rem; border-radius: 9px; margin-bottom: 1rem;
    font-size: 0.85rem; font-weight: 600;
  }
  .prof-alert.success { background: var(--success-pale); color: #065f46; border: 1px solid #a7f3d0; }
  .prof-alert.error   { background: #fef2f2; color: var(--danger); border: 1px solid #fecaca; }

  .prof-loading { min-height: 60vh; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 1rem; }
  .prof-spinner { animation: spin 0.8s linear infinite; font-size: 2rem; color: var(--orange); }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Avatar upload loading overlay */
  .prof-avatar-uploading {
    position: absolute; inset: 0; border-radius: 50%;
    background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 1.5rem;
  }

  @media (max-width: 900px) {
    .prof-body { grid-template-columns: 1fr; }
    .prof-cover-wrap { height: 220px; }
    .prof-avatar { width: 130px; height: 130px; font-size: 2.8rem; }
    .prof-avatar-row { margin-top: -50px; }
    .prof-name { font-size: 1.5rem; }
    .prof-form-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 600px) {
    .prof-body { padding: 1rem 0.75rem; }
    .prof-header-inner { padding: 0 0.75rem; }
    .prof-avatar { width: 110px; height: 110px; font-size: 2.2rem; }
    .prof-avatar-row { margin-top: -40px; gap: 0.75rem; }
    .prof-name { font-size: 1.3rem; }
    .prof-header-actions { width: 100%; }
    .prof-action-btn { flex: 1; justify-content: center; font-size: 0.82rem; }
    .prof-nav-tab { padding: 0.75rem 0.9rem; font-size: 0.82rem; }
    .prof-cover-wrap { height: 180px; }
  }
`;

const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', cls: '' };
  let score = 0;
  if (pwd.length >= 8)           score++;
  if (/[A-Z]/.test(pwd))         score++;
  if (/[0-9]/.test(pwd))         score++;
  if (/[^A-Za-z0-9]/.test(pwd))  score++;
  if (score <= 1) return { score, label: 'Weak',   cls: 'pwd-weak'   };
  if (score <= 2) return { score, label: 'Fair',   cls: 'pwd-fair'   };
  return               { score, label: 'Strong', cls: 'pwd-strong' };
};

const ProfilePage = () => {
  const navigate  = useNavigate();
  const { user, logout, updateUser } = useAuth();

  const avatarInputRef = useRef(null);

  const [activeTab,     setActiveTab]     = useState('about');
  const [pageLoading,   setPageLoading]   = useState(true);
  const [profileData,   setProfileData]   = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [saving,        setSaving]        = useState(false);
  const [formData,      setFormData]      = useState({});
  const [formAlert,     setFormAlert]     = useState(null);

  const [pwdData,       setPwdData]       = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdSaving,     setPwdSaving]     = useState(false);
  const [pwdAlert,      setPwdAlert]      = useState(null);
  const [showPwd,       setShowPwd]       = useState({ current: false, new: false, confirm: false });

  const [stats,         setStats]         = useState({ bookings: 0, messages: 0, hostels: 0, notifications: 0 });

  const pwdStrength = getPasswordStrength(pwdData.newPassword);

  // ── LOAD PROFILE + STATS ──────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setPageLoading(true);

        // Load profile first
        let data = user;
        try {
          const res = await api.get('/users/profile');
          data = res.data.user || res.data.data || res.data;
        } catch {
          // fallback to auth context user
        }

        setProfileData(data);
        setFormData({
          firstName: data?.firstName || '',
          lastName:  data?.lastName  || '',
          email:     data?.email     || '',
          phone:     data?.phone     || '',
          studentId: data?.studentId || '',
          bio:       data?.bio       || '',
        });

        // ✅ Check role FIRST before any API calls to avoid 403
        const isOwner = data?.role === 'owner' || data?.role === 'landlord';

        // Fetch messages and notifications — safe for all roles
        const [messagesRes, notifsRes] = await Promise.all([
          api.get('/messages/unread-count').catch(() => ({ data: { count: 0 } })),
          api.get('/notifications/unread-count').catch(() => ({ data: { count: 0 } })),
        ]);

        // ✅ Only fetch bookings for STUDENTS, hostels for OWNERS
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
          hostels:       isOwner
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
      setFormAlert({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setSaving(false);
    }
  };

  // ── CHANGE PASSWORD ───────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pwdData.currentPassword || !pwdData.newPassword) {
      setPwdAlert({ type: 'error', msg: 'Please fill in all password fields' });
      return;
    }
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      setPwdAlert({ type: 'error', msg: 'New passwords do not match' });
      return;
    }
    if (pwdData.newPassword.length < 8) {
      setPwdAlert({ type: 'error', msg: 'Password must be at least 8 characters' });
      return;
    }
    setPwdSaving(true);
    setPwdAlert(null);
    try {
      await api.put('/users/change-password', {
        currentPassword: pwdData.currentPassword,
        newPassword:     pwdData.newPassword,
      });
      setPwdAlert({ type: 'success', msg: 'Password changed successfully!' });
      setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed!');
    } catch (err) {
      setPwdAlert({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to change password',
      });
    } finally {
      setPwdSaving(false);
    }
  };

  // ── AVATAR UPLOAD ─────────────────────────────
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
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
      console.error('Avatar upload error:', err);
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setAvatarUploading(false);
      // Reset file input so same file can be re-uploaded
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
          <p style={{ color: 'var(--text-mid)', fontWeight: 600, fontFamily: 'Manrope' }}>
            Loading profile...
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
        { val: stats.hostels,       lbl: 'My Hostels',    link: '/landlord-dashboard', color: '#e8501a' },
        { val: stats.messages,      lbl: 'Messages',      link: '/messages',           color: '#1a3fa4' },
        { val: stats.notifications, lbl: 'Notifications', link: '/notifications',      color: '#f59e0b' },
      ]
    : [
        { val: stats.bookings,      lbl: 'Bookings',      link: '/bookings',           color: '#e8501a' },
        { val: stats.messages,      lbl: 'Messages',      link: '/messages',           color: '#1a3fa4' },
        { val: stats.notifications, lbl: 'Notifications', link: '/notifications',      color: '#f59e0b' },
      ];

  const quickLinks = isOwner
    ? [
        { icon: <FaBuilding />, label: 'My Dashboard',   link: '/landlord-dashboard', bg: 'rgba(232,80,26,0.1)',   color: '#e8501a' },
        { icon: <FaHome />,     label: 'Browse Hostels', link: '/hostels',            bg: 'rgba(26,63,164,0.1)',  color: '#1a3fa4' },
        { icon: <FaEnvelope />, label: 'Messages',       link: '/messages',           bg: 'rgba(26,63,164,0.1)',  color: '#1a3fa4' },
        { icon: <FaBell />,     label: 'Notifications',  link: '/notifications',      bg: 'rgba(245,158,11,0.1)', color: '#d97706' },
      ]
    : [
        { icon: <FaHome />,     label: 'Browse Hostels', link: '/hostels',            bg: 'rgba(232,80,26,0.1)',   color: '#e8501a' },
        { icon: <FaBookmark />, label: 'My Bookings',    link: '/bookings',           bg: 'rgba(26,63,164,0.1)',  color: '#1a3fa4' },
        { icon: <FaHeart />,    label: 'Saved Hostels',  link: '/favorites',          bg: 'rgba(239,68,68,0.1)',  color: '#ef4444' },
        { icon: <FaEnvelope />, label: 'Messages',       link: '/messages',           bg: 'rgba(26,63,164,0.1)',  color: '#1a3fa4' },
        { icon: <FaBell />,     label: 'Notifications',  link: '/notifications',      bg: 'rgba(245,158,11,0.1)', color: '#d97706' },
      ];

  return (
    <>
      <style>{styles}</style>

      <div className="prof-page">

        {/* COVER */}
        <div className="prof-cover-wrap">
          <button className="prof-cover-edit-btn">
            <FaCamera /> Edit Cover Photo
          </button>
        </div>

        {/* HEADER */}
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
                      <FaSpinner style={{ animation: 'spin 0.8s linear infinite' }} />
                    </div>
                  )}
                </div>
                <div
                  className="prof-avatar-edit"
                  onClick={() => !avatarUploading && avatarInputRef.current?.click()}
                  title="Change profile picture"
                >
                  {avatarUploading ? <FaSpinner style={{ animation: 'spin 0.8s linear infinite' }} /> : <FaCamera />}
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarUpload}
                />
              </div>

              {/* Name + role */}
              <div className="prof-header-info">
                <div className="prof-name">
                  {displayUser?.firstName} {displayUser?.lastName}
                </div>
                <div className="prof-role-badge">
                  {isOwner ? <FaBuilding /> : <FaUserGraduate />}
                  {isOwner ? 'Hostel Owner' : 'MUBAS Student'}
                </div>
                {displayUser?.verified && (
                  <div style={{ marginTop: 6 }}>
                    <span className="prof-verified-badge">
                      <FaCheckCircle /> Verified Account
                    </span>
                  </div>
                )}
                {displayUser?.bio && (
                  <p className="prof-bio">{displayUser.bio}</p>
                )}
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
                { key: 'about',    label: 'About',        icon: <FaUser />  },
                { key: 'edit',     label: 'Edit Profile', icon: <FaUser />  },
                { key: 'security', label: 'Security',     icon: <FaLock />  },
              ].map((tab) => (
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

        {/* BODY */}
        <div className="prof-body">

          {/* LEFT COLUMN */}
          <div>

            {/* Stats */}
            <div className="prof-card">
              <div className="prof-card-head">
                <div className="prof-card-title"><FaChartLine /> Activity</div>
              </div>
              <div className="prof-card-body">
                <div className="prof-stats-grid">
                  {statBoxes.map((s, i) => (
                    <div key={i} className="prof-stat-box" onClick={() => navigate(s.link)}>
                      <div className="prof-stat-val" style={{ color: s.color }}>{s.val}</div>
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
                  { icon: <FaEnvelope />,
                    bg: 'rgba(26,63,164,0.1)',   color: '#1a3fa4',
                    label: 'Email', value: displayUser?.email || '—' },
                  { icon: <FaPhone />,
                    bg: 'rgba(16,185,129,0.1)', color: '#059669',
                    label: 'Phone', value: displayUser?.phone || 'Not added' },
                  { icon: isOwner ? <FaBuilding /> : <FaUserGraduate />,
                    bg: 'rgba(139,92,246,0.1)', color: '#7c3aed',
                    label: isOwner ? 'Role' : 'Student ID',
                    value: isOwner ? 'Hostel Owner' : (displayUser?.studentId || '—') },
                  { icon: <FaCalendarAlt />,
                    bg: 'rgba(232,80,26,0.1)',   color: '#e8501a',
                    label: 'Member Since', value: joinDate },
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
              <div className="prof-card-body" style={{ padding: '0.75rem' }}>
                {quickLinks.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(item.link)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      width: '100%', padding: '0.65rem 0.75rem',
                      borderRadius: 8, border: 'none', background: 'none',
                      cursor: 'pointer', fontFamily: 'Manrope', fontWeight: 700,
                      fontSize: '0.88rem', color: 'var(--text-dark)',
                      transition: 'background 0.2s', textAlign: 'left',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: item.bg, color: item.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
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
                    background: 'linear-gradient(135deg, var(--navy), var(--blue))',
                    borderRadius: 12,
                  }}>
                    <div style={{
                      width: 72, height: 72, borderRadius: '50%',
                      border: '3px solid rgba(255,255,255,0.3)',
                      background: 'rgba(255,255,255,0.1)',
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
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'white' }}>
                        {displayUser?.firstName} {displayUser?.lastName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', marginTop: 3 }}>
                        {displayUser?.email}
                      </div>
                      <div style={{ marginTop: 6 }}>
                        <span style={{
                          background: 'rgba(232,80,26,0.3)', color: '#ffb49a',
                          border: '1px solid rgba(232,80,26,0.4)',
                          borderRadius: 20, padding: '2px 10px',
                          fontSize: '0.7rem', fontWeight: 700,
                        }}>
                          {isOwner ? '🏠 Owner' : '🎓 Student'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {displayUser?.bio && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
                        Bio
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-mid)', lineHeight: 1.7, fontWeight: 500 }}>
                        {displayUser.bio}
                      </p>
                    </div>
                  )}

                  {/* Info grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {[
                      { label: 'Full Name',    value: `${displayUser?.firstName || ''} ${displayUser?.lastName || ''}`.trim() },
                      { label: 'Email',        value: displayUser?.email },
                      { label: 'Phone',        value: displayUser?.phone || 'Not added' },
                      { label: 'Role',         value: isOwner ? 'Hostel Owner' : 'Student' },
                      { label: 'Member Since', value: joinDate },
                      { label: 'Status',       value: displayUser?.verified ? '✅ Verified' : '⏳ Pending' },
                    ].map((item, i) => (
                      <div key={i} style={{
                        background: 'var(--gray-bg)', borderRadius: 9,
                        padding: '0.75rem', border: '1px solid var(--gray-light)',
                      }}>
                        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '0.25rem' }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)', wordBreak: 'break-word' }}>
                          {item.value || '—'}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-light)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
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
                      <input className="prof-input" value={formData.firstName || ''} onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))} placeholder="First name" />
                    </div>
                    <div className="prof-form-group">
                      <label className="prof-label">Last Name *</label>
                      <input className="prof-input" value={formData.lastName || ''} onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))} placeholder="Last name" />
                    </div>
                    <div className="prof-form-group">
                      <label className="prof-label">Email Address</label>
                      <input className="prof-input" value={formData.email || ''} disabled title="Email cannot be changed" />
                    </div>
                    <div className="prof-form-group">
                      <label className="prof-label">Phone Number</label>
                      <input className="prof-input" value={formData.phone || ''} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} placeholder="e.g. 0888123456" />
                    </div>
                    {!isOwner && (
                      <div className="prof-form-group">
                        <label className="prof-label">Student ID</label>
                        <input className="prof-input" value={formData.studentId || ''} onChange={e => setFormData(p => ({ ...p, studentId: e.target.value }))} placeholder="Your student ID" />
                      </div>
                    )}
                    <div className={`prof-form-group${!isOwner ? '' : ' full'}`}>
                      <label className="prof-label">Bio</label>
                      <textarea className="prof-textarea" value={formData.bio || ''} onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))} placeholder="Tell others a little about yourself..." rows={3} />
                    </div>
                  </div>
                  <div className="prof-form-actions">
                    <button className="prof-cancel-btn" onClick={() => { setActiveTab('about'); setFormAlert(null); }}>
                      <FaTimes /> Cancel
                    </button>
                    <button className="prof-save-btn" onClick={handleSaveProfile} disabled={saving}>
                      {saving
                        ? <><FaSpinner style={{ animation: 'spin 0.8s linear infinite' }} /> Saving...</>
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
                        <button type="button" className="prof-input-eye" onClick={() => setShowPwd(p => ({ ...p, current: !p.current }))}>
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
                        <button type="button" className="prof-input-eye" onClick={() => setShowPwd(p => ({ ...p, new: !p.new }))}>
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
                        <button type="button" className="prof-input-eye" onClick={() => setShowPwd(p => ({ ...p, confirm: !p.confirm }))}>
                          {showPwd.confirm ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {pwdData.confirmPassword && pwdData.newPassword !== pwdData.confirmPassword && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: 4, fontWeight: 600 }}>❌ Passwords do not match</p>
                      )}
                      {pwdData.confirmPassword && pwdData.newPassword === pwdData.confirmPassword && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: 4, fontWeight: 600 }}>✅ Passwords match</p>
                      )}
                    </div>
                    <div style={{ background: 'var(--gray-bg)', borderRadius: 9, padding: '0.85rem 1rem', marginBottom: '1rem', border: '1px solid var(--gray-light)' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FaShieldAlt style={{ color: 'var(--orange)' }} /> Password Tips
                      </div>
                      {['At least 8 characters long', 'Mix of uppercase and lowercase letters', 'Include numbers and special characters', 'Avoid using personal information'].map((tip, i) => (
                        <div key={i} style={{ fontSize: '0.78rem', color: 'var(--text-mid)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: 4 }}>
                          <span style={{ color: 'var(--success)', fontSize: '0.7rem' }}>✓</span> {tip}
                        </div>
                      ))}
                    </div>
                    <div className="prof-form-actions">
                      <button type="button" className="prof-cancel-btn" onClick={() => { setActiveTab('about'); setPwdAlert(null); }}>
                        <FaTimes /> Cancel
                      </button>
                      <button type="submit" className="prof-save-btn" disabled={pwdSaving}>
                        {pwdSaving
                          ? <><FaSpinner style={{ animation: 'spin 0.8s linear infinite' }} /> Changing...</>
                          : <><FaKey /> Change Password</>
                        }
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;