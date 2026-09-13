import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { storage } from '../../utils/helpers';
import GooglePhoneModal from './GooglePhoneModal';
import { handleApiError } from '../../utils/helpers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/* ─────────────────────────────────────────────
   STYLES — identical to RegisterForm (Navy/Amber theme)
───────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy:        #0f1923;
    --navy-mid:    #1a2e3d;
    --amber:       #f5a623;
    --amber-light: #fef3d8;
    --amber-dark:  #d4870a;
    --white:       #fff;
    --off-white:   #f7f8fa;
    --border:      #e8eaed;
    --text-dark:   #111827;
    --text-mid:    #6b7280;
    --radius:      12px;
    --green:       #16a34a;
    --red:         #dc2626;
    --yellow:      #f59e0b;
    --wa:          #25D366;
    --font:        'Plus Jakarta Sans', sans-serif;
  }
  html, body, #root { height: 100%; font-family: var(--font); }

  /* ── NAV ── */
  .rp-bar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 500;
    height: 60px; display: flex; align-items: center; justify-content: space-between;
    padding: 0 1.5rem; background: var(--navy);
    box-shadow: 0 2px 16px rgba(0,0,0,.25);
  }
  .rp-bar-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .rp-bar-logo-img {
    width: 36px; height: 36px; border-radius: 9px; overflow: hidden;
    background: white;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .rp-bar-logo-img img { width: 100%; height: 100%; object-fit: cover; }
  .rp-bar-brand strong { display: block; font-size: .92rem; font-weight: 800; color: #fff; letter-spacing: -.2px; }
  .rp-bar-brand span   { font-size: .56rem; color: rgba(255,255,255,.45); letter-spacing: .6px; }
  .rp-bar-login {
    color: rgba(255,255,255,.8); font-size: .8rem; font-weight: 700;
    border: 1.5px solid rgba(255,255,255,.2); padding: .32rem .9rem;
    border-radius: 8px; cursor: pointer; text-decoration: none; transition: all .18s;
    font-family: var(--font);
  }
  .rp-bar-login:hover { border-color: var(--amber); color: var(--amber); }

  /* ── FULL-SCREEN BG ── */
  .rp-main {
    position: fixed; top: 60px; left: 0; right: 0; bottom: 0;
    display: flex; align-items: center; justify-content: center;
    overflow-y: auto; padding: 1.2rem 1rem;
    background-image: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80');
    background-size: cover; background-position: center;
  }
  .rp-main::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(15,25,35,.88) 0%, rgba(26,46,61,.82) 100%);
    pointer-events: none;
  }

  /* ── CARD ── */
  .rp-card {
    position: relative; z-index: 2;
    background: #fff; border-radius: 18px;
    box-shadow: 0 28px 70px rgba(0,0,0,.28);
    padding: 1.8rem 1.8rem 1.4rem;
    width: 400px; max-width: 100%;
  }

  /* ── HEADER ── */
  .rp-hdr { text-align: center; margin-bottom: 1.2rem; }
  .rp-hdr h2 { font-size: 1.3rem; font-weight: 800; color: var(--text-dark); letter-spacing: -.3px; }
  .rp-hdr p  { font-size: .78rem; color: var(--text-mid); margin-top: .2rem; }
  .rp-line   { width: 36px; height: 3px; background: var(--amber); border-radius: 2px; margin: .45rem auto 0; }

  /* ── ROLE PILLS ── */
  .rp-role-lbl {
    font-size: .62rem; font-weight: 700; color: var(--text-mid);
    text-transform: uppercase; letter-spacing: .5px;
    display: block; margin-bottom: .35rem;
  }
  .rp-role-row { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; margin-bottom: 1rem; }
  .rp-role-opt { position: relative; }
  .rp-role-opt input { position: absolute; opacity: 0; width: 0; height: 0; }
  .rp-role-btn {
    display: flex; align-items: center; justify-content: center; gap: .4rem;
    padding: .55rem .5rem; border: 1.5px solid var(--border);
    border-radius: 9px; cursor: pointer; font-size: .78rem;
    font-weight: 700; color: var(--text-mid); background: var(--off-white);
    transition: all .18s; font-family: var(--font);
  }
  .rp-role-btn:hover { border-color: var(--amber); color: var(--amber-dark); background: var(--amber-light); }
  .rp-role-opt input:checked + .rp-role-btn {
    border-color: var(--amber); color: var(--amber-dark);
    background: var(--amber-light);
    box-shadow: 0 0 0 2px rgba(245,166,35,.2);
  }

  /* ── FORM FIELDS ── */
  .rp-grp { margin-bottom: .75rem; }
  .rp-lbl {
    display: flex; justify-content: space-between; align-items: center;
    font-size: .62rem; font-weight: 700; color: var(--text-mid);
    text-transform: uppercase; letter-spacing: .4px; margin-bottom: .22rem;
  }
  .rp-wrap { position: relative; display: flex; align-items: center; }
  .rp-ico    { position: absolute; left: .7rem; color: var(--amber-dark); font-size: .78rem; pointer-events: none; z-index: 1; }
  .rp-toggle { position: absolute; right: .7rem; color: #9ca3af; font-size: .78rem; cursor: pointer; z-index: 2; }
  .rp-toggle:hover { color: var(--amber-dark); }
  .rp-input {
    width: 100%; border: 1.5px solid var(--border); border-radius: 9px;
    padding: .52rem .75rem .52rem 2.1rem;
    font-size: .8rem; font-family: var(--font);
    color: var(--text-dark); font-weight: 500; background: var(--off-white);
    outline: none; transition: all .18s;
  }
  .rp-input:focus {
    border-color: var(--amber); background: #fff;
    box-shadow: 0 0 0 3px rgba(245,166,35,.12);
  }
  .rp-input::placeholder { font-size: .73rem; color: #c3c8d0; }

  /* ── REMEMBER / FORGOT ── */
  .rp-row-flex {
    display: flex; justify-content: space-between; align-items: center;
    margin: .1rem 0 .75rem;
  }
  .rp-checkbox {
    display: flex; align-items: center; gap: .4rem;
    font-size: .7rem; color: var(--text-mid); cursor: pointer;
  }
  .rp-checkbox input { width: 13px; height: 13px; accent-color: var(--navy); }
  .rp-forgot { font-size: .7rem; color: var(--amber-dark); text-decoration: none; font-weight: 700; }
  .rp-forgot:hover { color: var(--amber); text-decoration: underline; }

  /* ── CAPTCHA ── */
  .rp-captcha {
    border: 1.5px solid var(--border); border-radius: 9px;
    padding: .5rem .75rem; background: var(--off-white);
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: .75rem; cursor: pointer; transition: border-color .2s;
  }
  .rp-captcha:hover { border-color: var(--amber); }
  .rp-cap-l { display: flex; align-items: center; gap: .5rem; }
  .rp-cap-box {
    width: 16px; height: 16px; border: 2px solid #9ca3af;
    border-radius: 3px; display: flex; align-items: center; justify-content: center;
    transition: all .2s;
  }
  .rp-cap-box.on { background: var(--navy); border-color: var(--navy); }
  .rp-cap-box.on::after { content: '✓'; color: #fff; font-size: .6rem; font-weight: 700; }
  .rp-cap-txt { font-size: .74rem; font-weight: 600; color: var(--text-dark); }
  .rp-spin {
    width: 11px; height: 11px; border: 2px solid #e5e7eb;
    border-top-color: var(--amber); border-radius: 50%;
    animation: rpspin .7s linear infinite; display: inline-block;
  }
  @keyframes rpspin { to { transform: rotate(360deg); } }
  .rp-cap-note { font-size: .48rem; color: #9ca3af; text-align: right; line-height: 1.3; }

  /* ── SUBMIT ── */
  .rp-submit {
    width: 100%; background: var(--navy); color: #fff; border: none;
    cursor: pointer; padding: .7rem 1rem; border-radius: 9px;
    font-size: .84rem; font-weight: 700; font-family: var(--font);
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: background .2s, transform .15s, box-shadow .2s;
    box-shadow: 0 4px 16px rgba(15,25,35,.28);
  }
  .rp-submit:hover:not(:disabled) { background: var(--navy-mid); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(15,25,35,.35); }
  .rp-submit:disabled { opacity: .6; cursor: not-allowed; transform: none; }
  .rp-submit-spin {
    width: 12px; height: 12px; border: 2px solid rgba(255,255,255,.35);
    border-top-color: #fff; border-radius: 50%; animation: rpspin .7s linear infinite;
  }

  /* ── GOOGLE ── */
  .or-div {
    display: flex; align-items: center; gap: .6rem;
    margin: .75rem 0 .55rem; font-size: .7rem; color: #9ca3af;
  }
  .or-div::before, .or-div::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .g-btn {
    width: 100%; background: #fff; color: #3c4043;
    border: 1.5px solid #dadce0; cursor: pointer;
    padding: .6rem 1rem; border-radius: 9px;
    font-size: .8rem; font-weight: 700; font-family: var(--font);
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all .18s;
  }
  .g-btn:hover:not(:disabled) { background: var(--off-white); border-color: #b0b0b0; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
  .g-btn:disabled { opacity: .6; cursor: not-allowed; }
  .g-btn svg { width: 16px; height: 16px; }

  /* ── SIGN UP LINK ── */
  .rp-link { text-align: center; margin-top: .9rem; font-size: .73rem; color: var(--text-mid); }
  .rp-link a { color: var(--amber-dark); font-weight: 700; text-decoration: none; }
  .rp-link a:hover { color: var(--amber); }

  @media (max-width: 480px) {
    .rp-card { padding: 1.4rem 1.1rem; }
    .rp-bar  { padding: 0 1rem; }
  }
`;

/* ─── Google Icon ─── */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const getRedirectPath = (user, from) => {
  if (from && from !== '/login' && from !== '/register') return from;
  if (user.role === 'landlord')    return '/landlord-dashboard';
  if (user.role === 'land_seller') return '/landlord-dashboard';
  if (user.role === 'admin')       return '/admin';
  return '/dashboard';
};

/* ─────────────────────────────────────────────
   MAIN LOGIN FORM
───────────────────────────────────────────── */
const LoginForm = () => {
  const [formData, setFormData]             = useState({ phone: '', password: '', role: 'landlord' });
  const [showPassword, setShowPassword]     = useState(false);
  const [loading, setLoading]               = useState(false);
  const [googleLoading, setGoogleLoading]   = useState(false);
  const [captcha, setCaptcha]               = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [googleToken, setGoogleToken] = useState(null);
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from || null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCaptcha = () => {
    if (captcha || captchaLoading) return;
    setCaptchaLoading(true);
    setTimeout(() => { setCaptchaLoading(false); setCaptcha(true); }, 1100);
  };

  /* Google OAuth */
  const handleGoogleSuccess = async (tokenResponse) => {
    setGoogleLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: tokenResponse.access_token, role: formData.role }),
      });
      const data = await res.json();
      if (data.success) {
      storage.set('token', data.token);
      storage.set('user', data.user);
      toast.success(`Welcome back, ${data.user.fullName || data.user.firstName}!`);
      setGoogleUser(data.user);
      setGoogleToken(data.token);
      setShowPhoneModal(true);
      } else {
        toast.error(data.message || 'Google login failed');
      }
    } catch {
      toast.error('Google login failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error('Google login failed'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captcha) { toast.error('Please verify you are not a robot'); return; }
    if (!formData.password) { toast.error('Please enter your password'); return; }

    const isEmail = formData.phone.includes('@');

    if (!isEmail) {
      const phoneRgx = /^(?:\+265|0)\d{8,9}$/;
      if (!phoneRgx.test(formData.phone)) {
        toast.error('Enter a valid Malawian number (e.g. 0888123456)');
        return;
      }
    }

    const payload = isEmail
      ? { email: formData.phone, password: formData.password }
      : { phone: formData.phone, password: formData.password };

    setLoading(true);
    try {
      const response = await login(payload);
      toast.success('Login successful!');
      if (response.user.role === 'landlord') {
        if (response.user.verificationStatus === 'pending') {
          toast.info('Your account is pending verification.');
        } else if (response.user.verificationStatus === 'rejected') {
          toast.error('Verification failed. Please contact support.');
        }
      }
      navigate(getRedirectPath(response.user, from), { replace: true });
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      {showPhoneModal && (
  <GooglePhoneModal
    user={googleUser}
    token={googleToken}
    onComplete={(updatedUser) => {
      setShowPhoneModal(false);
      navigate(getRedirectPath(updatedUser, from));
    }}
  />
)}
      {/* NAV — identical to RegisterForm */}
      <nav className="rp-bar">
        <Link to="/" className="rp-bar-logo">
          <div className="rp-bar-logo-img">
            <img src="/PEZ.png" alt="PezaNyumba" />
          </div>
          <div className="rp-bar-brand">
            <strong>PezaNyumba</strong>
          </div>
        </Link>
        <Link to="/register" className="rp-bar-login">
          <i className="fa fa-user-plus" /> Register
        </Link>
      </nav>

      <div className="rp-main">
        <div className="rp-card">

          <div className="rp-hdr">
            <h2>Welcome Back</h2>
            <p>Sign in to your PezaNyumba account</p>
            <div className="rp-line" />
          </div>

          {/* Role pills — amber theme, matching register */}
          <span className="rp-role-lbl">I am a</span>
          <div className="rp-role-row">
            {[
              { value: 'landlord',    icon: 'fa-home',     label: 'Landlord'    },
              { value: 'land_seller', icon: 'fa-seedling', label: 'Land Seller' },
            ].map(r => (
              <div className="rp-role-opt" key={r.value}>
                <input type="radio" id={`role_${r.value}`} name="role"
                  value={r.value} checked={formData.role === r.value} onChange={handleChange} />
                <label className="rp-role-btn" htmlFor={`role_${r.value}`}>
                  <i className={`fa ${r.icon}`} /> {r.label}
                </label>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>

            {/* Phone / Email */}
            <div className="rp-grp">
              <label className="rp-lbl" htmlFor="phone">Phone Number</label>
              <div className="rp-wrap">
                <i className="fa fa-phone rp-ico" />
                <input id="phone" className="rp-input" type="text" name="phone"
                  value={formData.phone} onChange={handleChange}
                  placeholder="0888123456 or admin@email.com"
                  required autoComplete="tel" />
              </div>
            </div>

            {/* Password */}
            <div className="rp-grp">
              <label className="rp-lbl" htmlFor="password">
                Password
                <Link to="/forgot-password" className="rp-forgot">Forgot Password?</Link>
              </label>
              <div className="rp-wrap">
                <i className="fa fa-lock rp-ico" />
                <input id="password" className="rp-input"
                  type={showPassword ? 'text' : 'password'}
                  name="password" value={formData.password} onChange={handleChange}
                  placeholder="Enter your password"
                  required autoComplete="current-password" />
                <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} rp-toggle`}
                  onClick={() => setShowPassword(!showPassword)} />
              </div>
            </div>

            {/* Remember me */}
            <div className="rp-row-flex">
              <label className="rp-checkbox">
                <input type="checkbox" /> Remember me
              </label>
            </div>

            {/* Captcha */}
            <div className="rp-captcha" onClick={handleCaptcha} role="button" tabIndex={0}>
              <div className="rp-cap-l">
                <div className={`rp-cap-box${captcha ? ' on' : ''}`} />
                {captchaLoading
                  ? <span className="rp-cap-txt"><div className="rp-spin" /> Verifying…</span>
                  : <span className="rp-cap-txt">{captcha ? 'Verified ✓' : "I'm not a robot"}</span>
                }
              </div>
              <div>
                <i className="fa fa-shield-alt" style={{ color: 'var(--amber)', fontSize: '1.05rem' }} />
                <div className="rp-cap-note">Security<br />Check</div>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="rp-submit" disabled={loading}>
              {loading
                ? <><div className="rp-submit-spin" /> Signing in…</>
                : <><i className="fa fa-sign-in-alt" /> Sign In</>
              }
            </button>

            <div className="or-div">or continue with</div>

            <button type="button" className="g-btn" onClick={() => googleLogin()} disabled={googleLoading}>
              {googleLoading
                ? <><div className="rp-spin" style={{ borderTopColor: '#4285f4' }} /> Connecting…</>
                : <><GoogleIcon /> Continue with Google</>
              }
            </button>
          </form>

          <p className="rp-link">
            Don't have an account? <Link to="/register">Sign up here</Link>
          </p>

        </div>
      </div>
    </>
  );
};

export default LoginForm;