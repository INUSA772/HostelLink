import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { handleApiError } from '../../utils/helpers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --teal:      #0d6e5e;
    --teal-dark: #0a5a4c;
    --teal-light:#e8f5f2;
    --text-dark: #111827;
    --text-mid:  #4b5563;
    --border:    #e5e7eb;
    --card-radius: 16px;
    --green:#16a34a; --red:#dc2626; --yellow:#f59e0b;
  }
  html, body, #root { height: 100%; width: 100%; font-family: 'Manrope', sans-serif; }

  /* ── NAVBAR ── */
  .rp-bar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 500;
    height: 64px; display: flex; align-items: center;
    justify-content: space-between; padding: 0 2rem;
    background: #ffffff;
    border-bottom: 1px solid #e8f0ee;
    box-shadow: 0 1px 8px rgba(13,110,94,0.07);
  }
  .rp-bar-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .rp-bar-logo-img { width: 34px; height: 34px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: var(--teal-light); }
  .rp-bar-logo-img img { width: 100%; height: 100%; object-fit: cover; }
  .rp-bar-brand strong { display: block; font-size: 0.95rem; font-weight: 800; color: #0d4a40; letter-spacing: 0.5px; }
  .rp-bar-brand span { font-size: 0.58rem; color: #6b7280; letter-spacing: 0.5px; }
  .rp-bar-actions { display: flex; align-items: center; gap: 0.6rem; }
  .rp-bar-login {
    color: #374151; font-size: 0.82rem; font-weight: 600;
    background: transparent; border: 1.5px solid #d1d5db;
    padding: 0.3rem 0.9rem; border-radius: 7px; cursor: pointer;
    text-decoration: none; transition: all 0.2s;
  }
  .rp-bar-login:hover { border-color: var(--teal); color: var(--teal); }
  .rp-bar-signup {
    color: #fff; font-size: 0.82rem; font-weight: 700;
    background: var(--teal); border: none;
    padding: 0.35rem 1rem; border-radius: 7px; cursor: pointer;
    text-decoration: none; transition: background 0.2s;
    box-shadow: 0 2px 8px rgba(13,110,94,0.25);
  }
  .rp-bar-signup:hover { background: var(--teal-dark); }

  /* ── FULL-SCREEN BACKGROUND ── */
  .rp-main {
    position: fixed; top: 64px; left: 0; right: 0; bottom: 0;
    display: flex; align-items: center; justify-content: center;
    overflow: auto; padding: 1.5rem 1rem;
    background-image: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80');
    background-size: cover;
    background-position: center;
  }
  .rp-main::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(
      135deg,
      rgba(5,30,20,0.75) 0%,
      rgba(10,50,35,0.70) 50%,
      rgba(5,25,15,0.80) 100%
    );
    pointer-events: none;
  }

  /* ── CARD ── */
  .rp-card {
    position: relative; z-index: 2;
    background: #ffffff;
    border-radius: var(--card-radius);
    box-shadow: 0 24px 64px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.10);
    padding: 2rem 2rem 1.5rem;
    width: 420px; max-width: 100%;
  }

  /* ── CARD HEADER ── */
  .rp-card-hdr { text-align: center; margin-bottom: 1.2rem; }
  .rp-card-hdr h2 { font-size: 1.4rem; font-weight: 800; color: var(--text-dark); margin-bottom: 0.25rem; }
  .rp-card-hdr p  { color: var(--text-mid); font-size: 0.82rem; }
  .rp-line { width: 36px; height: 3px; background: var(--teal); border-radius: 2px; margin: 0.5rem auto 0; }

  /* ── ROLE SELECTOR ── */
  .rp-role-lbl { display: block; font-size: 0.65rem; font-weight: 700; color: var(--text-mid); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.4rem; }
  .rp-role-row  { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-bottom: 1rem; }
  .rp-role-opt  { position: relative; }
  .rp-role-opt input { position: absolute; opacity: 0; width: 0; height: 0; }
  .rp-role-btn  {
    display: flex; align-items: center; justify-content: center; gap: 0.4rem;
    padding: 0.5rem 0.5rem; border: 1.5px solid var(--border);
    border-radius: 9px; cursor: pointer; font-size: 0.8rem;
    font-weight: 600; color: var(--text-mid); background: #fafafa;
    transition: all 0.18s;
  }
  .rp-role-btn:hover { border-color: var(--teal); color: var(--teal); }
  .rp-role-opt input:checked + .rp-role-btn {
    border-color: var(--teal); color: var(--teal); background: var(--teal-light);
  }

  /* ── FORM FIELDS ── */
  .rp-grp { margin-bottom: 0.85rem; }
  .rp-lbl  {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 0.65rem; font-weight: 700; color: var(--text-mid);
    text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 0.25rem;
  }
  .rp-strength { font-size: 0.6rem; text-transform: none; font-weight: 700; letter-spacing: 0; }
  .rp-strength.weak   { color: var(--red); }
  .rp-strength.medium { color: var(--yellow); }
  .rp-strength.strong { color: var(--green); }
  .rp-wrap { position: relative; display: flex; align-items: center; }
  .rp-ico  { position: absolute; left: 0.7rem; color: var(--teal); font-size: 0.8rem; pointer-events: none; }
  .rp-toggle { position: absolute; right: 0.7rem; color: #9ca3af; font-size: 0.8rem; cursor: pointer; z-index: 2; }
  .rp-toggle:hover { color: var(--teal); }
  .rp-input {
    width: 100%; border: 1.5px solid var(--border); border-radius: 9px;
    padding: 0.55rem 0.75rem 0.55rem 2.1rem;
    font-size: 0.82rem; font-family: 'Manrope', sans-serif;
    color: var(--text-dark); font-weight: 500; background: #fafafa; outline: none;
    transition: all 0.18s;
  }
  .rp-input:focus { border-color: var(--teal); background: #fff; box-shadow: 0 0 0 3px rgba(13,110,94,0.09); }
  .rp-input::placeholder { font-size: 0.75rem; color: #cbd5e1; }
  .rp-input.password-weak   { border-color: var(--red); }
  .rp-input.password-medium { border-color: var(--yellow); }
  .rp-input.password-strong { border-color: var(--green); }

  /* ── CAPTCHA ── */
  .rp-captcha {
    border: 1.5px solid var(--border); border-radius: 9px;
    padding: 0.55rem 0.75rem; background: #fafafa;
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 0.85rem; cursor: pointer;
  }
  .rp-cap-l  { display: flex; align-items: center; gap: 0.5rem; }
  .rp-cap-box { width: 17px; height: 17px; border: 2px solid #9ca3af; border-radius: 3px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .rp-cap-box.on { background: var(--teal); border-color: var(--teal); }
  .rp-cap-box.on::after { content: '✓'; color: #fff; font-size: 0.65rem; font-weight: 700; }
  .rp-cap-txt { font-size: 0.76rem; font-weight: 600; color: var(--text-dark); }
  .rp-spin { width: 11px; height: 11px; border: 2px solid #e5e7eb; border-top-color: var(--teal); border-radius: 50%; animation: rpspin 0.7s linear infinite; }
  @keyframes rpspin { to { transform: rotate(360deg); } }
  .rp-cap-note { font-size: 0.5rem; color: #9ca3af; text-align: right; line-height: 1.3; }

  /* ── TERMS ── */
  .rp-terms {
    display: flex; align-items: center; gap: 0.4rem;
    margin-bottom: 0.85rem; font-size: 0.72rem; color: var(--text-mid); cursor: pointer;
  }
  .rp-terms input { width: 13px; height: 13px; cursor: pointer; accent-color: var(--teal); flex-shrink: 0; }
  .rp-terms a { color: var(--teal); font-weight: 600; text-decoration: none; }
  .rp-terms a:hover { text-decoration: underline; }

  /* ── SUBMIT BUTTON ── */
  .rp-submit {
    width: 100%; background: var(--teal); color: #fff; border: none;
    cursor: pointer; padding: 0.7rem 1rem; border-radius: 9px;
    font-size: 0.85rem; font-weight: 700; font-family: 'Manrope', sans-serif;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: background 0.2s, box-shadow 0.2s;
    box-shadow: 0 3px 12px rgba(13,110,94,0.28);
  }
  .rp-submit:hover:not(:disabled) { background: var(--teal-dark); box-shadow: 0 5px 18px rgba(13,110,94,0.36); }
  .rp-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .rp-submit-spin { width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: rpspin 0.7s linear infinite; }

  /* ── GOOGLE BUTTON ── */
  .or-divider { display: flex; align-items: center; gap: 0.7rem; margin: 0.8rem 0 0.6rem; font-size: 0.72rem; color: #9ca3af; }
  .or-divider::before, .or-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .g-btn {
    width: 100%; background: #fff; color: #3c4043;
    border: 1.5px solid #dadce0; cursor: pointer;
    padding: 0.62rem 1rem; border-radius: 9px;
    font-size: 0.82rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.18s;
  }
  .g-btn:hover:not(:disabled) { background: #f8f9fa; border-color: #b0b0b0; }
  .g-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .g-btn svg { width: 17px; height: 17px; }

  /* ── SIGN IN LINK ── */
  .rp-link { text-align: center; margin-top: 1rem; font-size: 0.75rem; color: var(--text-mid); }
  .rp-link a { color: var(--teal); font-weight: 700; text-decoration: none; }
  .rp-link a:hover { text-decoration: underline; }

  /* ── OTP SCREEN ── */
  .otp-wrap { text-align: center; }
  .otp-phone-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--teal-light); border: 1.5px solid #a7d4cc;
    border-radius: 9px; padding: 0.45rem 0.9rem;
    font-size: 0.75rem; font-weight: 700; color: var(--teal); margin-bottom: 1rem;
  }
  .otp-inputs { display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 0.9rem; }
  .otp-input {
    width: 44px; height: 50px; border: 2px solid var(--border);
    border-radius: 9px; text-align: center; font-size: 1.2rem;
    font-weight: 800; font-family: 'Manrope', sans-serif; outline: none;
    transition: border-color 0.18s;
  }
  .otp-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(13,110,94,0.09); }
  .otp-timer { font-size: 0.72rem; color: var(--text-mid); margin-bottom: 0.8rem; }
  .otp-timer span { color: var(--teal); font-weight: 800; }
  .otp-resend { background: transparent; border: none; color: var(--teal); font-size: 0.72rem; font-weight: 700; cursor: pointer; }
  .otp-resend:disabled { color: #9ca3af; cursor: not-allowed; }

  @media (max-width: 480px) {
    .rp-card { padding: 1.5rem 1.2rem; }
    .rp-bar  { padding: 0 1rem; }
    .otp-input { width: 38px; height: 45px; }
  }
`;

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const OtpScreen = ({ userId, phone, onSuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) { toast.error('Please enter the complete code'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp: otpString })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Phone number verified!');
        setTimeout(() => onSuccess(data), 1000);
      } else {
        toast.error(data.message || 'Invalid OTP');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch { toast.error('Connection error'); }
    finally { setLoading(false); }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (data.success) {
        setTimeLeft(600);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        toast.success('New verification code sent!');
      } else {
        toast.error(data.message || 'Could not resend code');
      }
    } catch { toast.error('Connection error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="otp-wrap">
      <div className="rp-card-hdr">
        <h2>Verify Your Phone</h2>
        <p>Enter the 6-digit code sent to your phone</p>
        <div className="rp-line" />
      </div>
      <div className="otp-phone-badge">
        <i className="fa fa-phone" /> {phone}
      </div>
      <div className="otp-inputs" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input key={i} ref={el => inputRefs.current[i] = el}
            className="otp-input" type="text" inputMode="numeric" maxLength={1} value={digit}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)} autoFocus={i === 0} />
        ))}
      </div>
      <div className="otp-timer">
        {timeLeft > 0 ? (
          <>Code expires in <span>{formatTime(timeLeft)}</span></>
        ) : (
          <span style={{ color: '#dc2626' }}>Code expired — request a new one</span>
        )}
      </div>
      <button className="rp-submit" onClick={handleVerify} disabled={loading || otp.join('').length !== 6}>
        {loading
          ? <><div className="rp-submit-spin" /> Verifying...</>
          : <><i className="fa fa-check" /> Verify & Continue</>}
      </button>
      <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
        <span style={{ fontSize: '0.72rem', color: '#4b5563' }}>Didn't receive the code? </span>
        <button className="otp-resend" onClick={handleResend} disabled={loading || timeLeft > 550}>
          {loading ? 'Sending...' : 'Resend Code'}
        </button>
      </div>
    </div>
  );
};

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '', phone: '', password: '', confirmPassword: '', role: 'tenant'
  });
  const [showPassword, setShowPassword]             = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength]     = useState('');
  const [loading, setLoading]                       = useState(false);
  const [googleLoading, setGoogleLoading]           = useState(false);
  const [captchaChecked, setCaptchaChecked]         = useState(false);
  const [captchaLoading, setCaptchaLoading]         = useState(false);
  const [showOtp, setShowOtp]                       = useState(false);
  const [otpUserId, setOtpUserId]                   = useState(null);
  const [attempts, setAttempts]                     = useState(0);
  const { register } = useAuth();
  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    if (!password) return '';
    let s = 0;
    if (password.length >= 8) s++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) s++;
    if (password.match(/\d/)) s++;
    if (password.match(/[^a-zA-Z\d]/)) s++;
    if (s <= 2) return 'weak';
    if (s === 3) return 'medium';
    return 'strong';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'password') setPasswordStrength(checkPasswordStrength(value));
  };

  const handleCaptcha = () => {
    if (captchaChecked || captchaLoading) return;
    setCaptchaLoading(true);
    setTimeout(() => { setCaptchaLoading(false); setCaptchaChecked(true); }, 1200);
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    setGoogleLoading(true);
    try {
      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
      });
      const googleUserInfo = await userInfoRes.json();
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleUserInfo, role: formData.role,
          phone: formData.phone,
          fullName: formData.fullName || googleUserInfo.name
        })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        const expiry = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);
        localStorage.setItem('tokenExpiry', expiry);
        toast.success(`Welcome ${data.user.fullName || data.user.firstName}!`);
        const dashboardUrl = data.user.role === 'landlord' ? '/landlord-dashboard' : '/dashboard';
        setTimeout(() => navigate(dashboardUrl), 500);
      } else {
        toast.error(data.message || 'Google sign up failed');
      }
    } catch {
      toast.error('Google sign up failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error('Google sign up failed'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (attempts >= 5) { toast.error('Too many registration attempts. Please try again later.'); return; }
    if (!captchaChecked) { toast.error('Please verify you are not a robot'); return; }
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match!'); return; }
    if (formData.password.length < 8) { toast.error('Password must be at least 8 characters long'); return; }
    if (passwordStrength === 'weak') {
      toast.error('Please use a stronger password (mix of uppercase, lowercase, numbers, and special characters)'); return;
    }
    const phoneRegex = /^(?:\+265|0)(?:88|99|98|66)\d{7}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Enter valid Malawian number (e.g., 0888123456 or +265888123456)'); return;
    }
    if (!formData.fullName.trim()) { toast.error('Please enter your full name'); return; }

    setAttempts(prev => prev + 1);
    setLoading(true);
    try {
      const data = await register(formData);
      if (data.requiresOtp) {
        setOtpUserId(data.userId);
        setShowOtp(true);
        toast.info('Verification code sent to your phone!');
      } else {
        toast.success('Registration successful! Please login');
        setTimeout(() => navigate('/login'), 500);
      }
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSuccess = () => {
    toast.success('Phone verified! Please login');
    setTimeout(() => navigate('/login'), 500);
  };

  const Navbar = () => (
    <nav className="rp-bar">
      <Link to="/" className="rp-bar-logo">
        <div className="rp-bar-logo-img">
          <img src="/PezaHostelLogo.png" alt="PezaNyumba" />
        </div>
        <div className="rp-bar-brand">
          <strong>PezaNyumba</strong>
          <span>FIND YOUR PERFECT HOME</span>
        </div>
      </Link>
      <div className="rp-bar-actions">
        <Link to="/login"    className="rp-bar-login"><i className="fa fa-sign-in-alt" /> Login</Link>
        <Link to="/register" className="rp-bar-signup"><i className="fa fa-user-plus" /> Sign Up</Link>
      </div>
    </nav>
  );

  if (showOtp) return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <Navbar />
      <div className="rp-main">
        <div className="rp-card">
          <OtpScreen userId={otpUserId} phone={formData.phone} onSuccess={handleOtpSuccess} />
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      <Navbar />

      <div className="rp-main">
        <div className="rp-card">

          <div className="rp-card-hdr">
            <h2>Create Account</h2>
            <p>Join Malawi's trusted rental platform</p>
            <div className="rp-line" />
          </div>

          <span className="rp-role-lbl">I am a</span>
          <div className="rp-role-row">
            <div className="rp-role-opt">
              <input type="radio" id="rt" name="role" value="tenant"
                checked={formData.role === 'tenant'} onChange={handleChange} />
              <label className="rp-role-btn" htmlFor="rt">
                <i className="fa fa-user" /> Tenant
              </label>
            </div>
            <div className="rp-role-opt">
              <input type="radio" id="rl" name="role" value="landlord"
                checked={formData.role === 'landlord'} onChange={handleChange} />
              <label className="rp-role-btn" htmlFor="rl">
                <i className="fa fa-home" /> Landlord
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="rp-grp">
              <label className="rp-lbl" htmlFor="fullName">Full Name</label>
              <div className="rp-wrap">
                <i className="fa fa-user rp-ico" />
                <input id="fullName" className="rp-input" type="text" name="fullName"
                  value={formData.fullName} onChange={handleChange}
                  placeholder="John Banda" required autoComplete="name" />
              </div>
            </div>

            {/* Phone */}
            <div className="rp-grp">
              <label className="rp-lbl" htmlFor="phone">Phone Number</label>
              <div className="rp-wrap">
                <i className="fa fa-phone rp-ico" />
                <input id="phone" className="rp-input" type="tel" name="phone"
                  value={formData.phone} onChange={handleChange}
                  placeholder="0888123456 or +265888123456"
                  required autoComplete="tel" />
              </div>
            </div>

            {/* Password */}
            <div className="rp-grp">
              <label className="rp-lbl" htmlFor="password">
                Password
                {passwordStrength && (
                  <span className={`rp-strength ${passwordStrength}`}>
                    {passwordStrength === 'weak'   && '⚠️ Weak'}
                    {passwordStrength === 'medium' && '⚡ Medium'}
                    {passwordStrength === 'strong' && '✅ Strong'}
                  </span>
                )}
              </label>
              <div className="rp-wrap">
                <i className="fa fa-lock rp-ico" />
                <input id="password"
                  className={`rp-input${passwordStrength ? ` password-${passwordStrength}` : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  name="password" value={formData.password} onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required autoComplete="new-password" />
                <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} rp-toggle`}
                  onClick={() => setShowPassword(!showPassword)} />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="rp-grp">
              <label className="rp-lbl" htmlFor="confirmPassword">Confirm Password</label>
              <div className="rp-wrap">
                <i className="fa fa-check-circle rp-ico" />
                <input id="confirmPassword" className="rp-input"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                  placeholder="Confirm your password"
                  required autoComplete="new-password" />
                <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} rp-toggle`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
              </div>
            </div>

            {/* Captcha */}
            <div className="rp-captcha" onClick={handleCaptcha} role="button" tabIndex={0}>
              <div className="rp-cap-l">
                <div className={`rp-cap-box${captchaChecked ? ' on' : ''}`} />
                {captchaLoading
                  ? <span className="rp-cap-txt"><div className="rp-spin" /> Verifying...</span>
                  : <span className="rp-cap-txt">{captchaChecked ? 'Verified ✓' : "I'm not a robot"}</span>
                }
              </div>
              <div>
                <i className="fa fa-shield-alt" style={{ color: '#0d6e5e', fontSize: '1.1rem' }} />
                <div className="rp-cap-note">Security<br />Check</div>
              </div>
            </div>

            {/* Terms */}
            <label className="rp-terms">
              <input type="checkbox" required />
              <span>I agree to the <Link to="/terms">Terms</Link> &amp; <Link to="/privacy">Privacy Policy</Link></span>
            </label>

            {/* Submit */}
            <button type="submit" className="rp-submit" disabled={loading}>
              {loading
                ? <><div className="rp-submit-spin" /> Creating Account...</>
                : <><i className="fa fa-user-plus" /> Sign Up</>
              }
            </button>

            <div className="or-divider">or sign up faster with</div>

            <button type="button" className="g-btn" onClick={() => googleLogin()} disabled={googleLoading}>
              {googleLoading
                ? <><div className="rp-spin" style={{ borderTopColor: '#4285f4' }} /> Connecting...</>
                : <><GoogleIcon /> Continue with Google</>
              }
            </button>
          </form>

          <p className="rp-link">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;