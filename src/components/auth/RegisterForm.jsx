import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { storage } from '../../utils/helpers';
import GooglePhoneModal from './GooglePhoneModal';
import { handleApiError } from '../../utils/helpers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy: #0f1923; --navy-mid: #1a2e3d;
    --amber: #f5a623; --amber-light: #fef3d8; --amber-dark: #d4870a;
    --off-white: #f7f8fa; --border: #e8eaed;
    --text-dark: #111827; --text-mid: #6b7280;
    --green: #16a34a; --red: #dc2626; --yellow: #f59e0b;
    --wa: #25D366; --font: 'Plus Jakarta Sans', sans-serif;
  }
  html, body, #root { height: 100%; font-family: var(--font); }

  .rp-bar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 500;
    height: 52px; display: flex; align-items: center; justify-content: space-between;
    padding: 0 1.25rem; background: var(--navy);
  }
  .rp-bar-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
  .rp-bar-logo-img { width: 30px; height: 30px; border-radius: 7px; overflow: hidden; background: white; display: flex; align-items: center; justify-content: center; }
  .rp-bar-logo-img img { width: 100%; height: 100%; object-fit: cover; }
  .rp-bar-brand strong { font-size: .88rem; font-weight: 800; color: #fff; }
  .rp-bar-login { color: rgba(255,255,255,.8); font-size: .75rem; font-weight: 700; border: 1.5px solid rgba(255,255,255,.2); padding: .26rem .8rem; border-radius: 7px; text-decoration: none; transition: all .18s; }
  .rp-bar-login:hover { border-color: var(--amber); color: var(--amber); }

  .rp-main {
    position: fixed; top: 52px; left: 0; right: 0; bottom: 0;
    display: flex; align-items: center; justify-content: center;
    padding: .5rem 1rem;
    background-image: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80');
    background-size: cover; background-position: center;
  }
  .rp-main::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(15,25,35,.9) 0%, rgba(26,46,61,.85) 100%);
  }

  .rp-card {
    position: relative; z-index: 2;
    background: #fff; border-radius: 16px;
    box-shadow: 0 24px 60px rgba(0,0,0,.3);
    padding: 1.2rem 1.4rem 1rem;
    width: 460px; max-width: 100%;
  }

  .rp-hdr { text-align: center; margin-bottom: .75rem; }
  .rp-hdr h2 { font-size: 1.15rem; font-weight: 800; color: var(--text-dark); }
  .rp-hdr p  { font-size: .7rem; color: var(--text-mid); margin-top: .1rem; }
  .rp-line   { width: 28px; height: 3px; background: var(--amber); border-radius: 2px; margin: .3rem auto 0; }

  .rp-role-row { display: grid; grid-template-columns: 1fr 1fr; gap: .4rem; margin-bottom: .75rem; }
  .rp-role-opt { position: relative; }
  .rp-role-opt input { position: absolute; opacity: 0; width: 0; height: 0; }
  .rp-role-btn {
    display: flex; align-items: center; justify-content: center; gap: .3rem;
    padding: .4rem; border: 1.5px solid var(--border); border-radius: 8px;
    cursor: pointer; font-size: .72rem; font-weight: 700; color: var(--text-mid);
    background: var(--off-white); transition: all .18s; font-family: var(--font);
  }
  .rp-role-btn:hover { border-color: var(--amber); color: var(--amber-dark); background: var(--amber-light); }
  .rp-role-opt input:checked + .rp-role-btn { border-color: var(--amber); color: var(--amber-dark); background: var(--amber-light); box-shadow: 0 0 0 2px rgba(245,166,35,.2); }

  .rp-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; }
  .rp-grp { margin-bottom: .5rem; }
  .rp-lbl { display: flex; justify-content: space-between; align-items: center; font-size: .58rem; font-weight: 700; color: var(--text-mid); text-transform: uppercase; letter-spacing: .4px; margin-bottom: .15rem; }
  .rp-strength { font-size: .56rem; text-transform: none; font-weight: 700; letter-spacing: 0; }
  .rp-strength.weak { color: var(--red); } .rp-strength.medium { color: var(--yellow); } .rp-strength.strong { color: var(--green); }
  .rp-wrap { position: relative; display: flex; align-items: center; }
  .rp-ico { position: absolute; left: .6rem; color: var(--amber-dark); font-size: .72rem; pointer-events: none; z-index: 1; }
  .rp-wa-ico { position: absolute; left: .6rem; color: var(--wa); font-size: .82rem; pointer-events: none; z-index: 1; }
  .rp-toggle { position: absolute; right: .6rem; color: #9ca3af; font-size: .72rem; cursor: pointer; z-index: 2; }
  .rp-toggle:hover { color: var(--amber-dark); }
  .rp-input {
    width: 100%; border: 1.5px solid var(--border); border-radius: 8px;
    padding: .42rem .65rem .42rem 1.9rem;
    font-size: .75rem; font-family: var(--font); color: var(--text-dark);
    font-weight: 500; background: var(--off-white); outline: none; transition: all .18s;
  }
  .rp-input:focus { border-color: var(--amber); background: #fff; box-shadow: 0 0 0 3px rgba(245,166,35,.12); }
  .rp-input::placeholder { font-size: .68rem; color: #c3c8d0; }
  .rp-input.password-weak { border-color: var(--red); }
  .rp-input.password-medium { border-color: var(--yellow); }
  .rp-input.password-strong { border-color: var(--green); }
  .rp-input.wa-field:focus { border-color: var(--wa); box-shadow: 0 0 0 3px rgba(37,211,102,.12); }

  .rp-wa-same { display: flex; align-items: center; gap: 3px; font-size: .56rem; font-weight: 600; color: var(--text-mid); cursor: pointer; letter-spacing: 0; text-transform: none; }
  .rp-wa-same input { width: 10px; height: 10px; accent-color: var(--amber); cursor: pointer; }

  .rp-footer-row { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; align-items: center; margin-bottom: .6rem; margin-top: .25rem; }
  .rp-captcha { border: 1.5px solid var(--border); border-radius: 8px; padding: .38rem .55rem; background: var(--off-white); display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: border-color .2s; }
  .rp-captcha:hover { border-color: var(--amber); }
  .rp-cap-l { display: flex; align-items: center; gap: .35rem; }
  .rp-cap-box { width: 14px; height: 14px; border: 2px solid #9ca3af; border-radius: 3px; display: flex; align-items: center; justify-content: center; transition: all .2s; flex-shrink: 0; }
  .rp-cap-box.on { background: var(--navy); border-color: var(--navy); }
  .rp-cap-box.on::after { content: '✓'; color: #fff; font-size: .52rem; font-weight: 700; }
  .rp-cap-txt { font-size: .65rem; font-weight: 600; color: var(--text-dark); }
  .rp-cap-note { font-size: .42rem; color: #9ca3af; text-align: right; line-height: 1.3; }
  .rp-spin { width: 10px; height: 10px; border: 2px solid #e5e7eb; border-top-color: var(--amber); border-radius: 50%; animation: rpspin .7s linear infinite; display: inline-block; }
  @keyframes rpspin { to { transform: rotate(360deg); } }
  .rp-terms { display: flex; align-items: center; gap: .3rem; font-size: .63rem; color: var(--text-mid); cursor: pointer; line-height: 1.35; }
  .rp-terms input { width: 11px; height: 11px; cursor: pointer; accent-color: var(--navy); flex-shrink: 0; }
  .rp-terms a { color: var(--amber-dark); font-weight: 700; text-decoration: none; }

  .rp-submit { width: 100%; background: var(--navy); color: #fff; border: none; cursor: pointer; padding: .58rem 1rem; border-radius: 9px; font-size: .8rem; font-weight: 700; font-family: var(--font); display: flex; align-items: center; justify-content: center; gap: 6px; transition: background .2s; box-shadow: 0 4px 14px rgba(15,25,35,.28); }
  .rp-submit:hover:not(:disabled) { background: var(--navy-mid); }
  .rp-submit:disabled { opacity: .6; cursor: not-allowed; }
  .rp-submit-spin { width: 11px; height: 11px; border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; border-radius: 50%; animation: rpspin .7s linear infinite; }

  .or-div { display: flex; align-items: center; gap: .5rem; margin: .5rem 0 .4rem; font-size: .65rem; color: #9ca3af; }
  .or-div::before, .or-div::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .g-btn { width: 100%; background: #fff; color: #3c4043; border: 1.5px solid #dadce0; cursor: pointer; padding: .5rem 1rem; border-radius: 9px; font-size: .76rem; font-weight: 700; font-family: var(--font); display: flex; align-items: center; justify-content: center; gap: 8px; transition: all .18s; }
  .g-btn:hover:not(:disabled) { background: var(--off-white); border-color: #b0b0b0; }
  .g-btn svg { width: 14px; height: 14px; }

  .rp-link { text-align: center; margin-top: .55rem; font-size: .68rem; color: var(--text-mid); }
  .rp-link a { color: var(--amber-dark); font-weight: 700; text-decoration: none; }

  .otp-wrap { text-align: center; }
  .otp-phone-badge { display: inline-flex; align-items: center; gap: .5rem; background: var(--amber-light); border: 1.5px solid #f0d89a; border-radius: 9px; padding: .4rem .85rem; font-size: .74rem; font-weight: 700; color: var(--amber-dark); margin-bottom: 1rem; }
  .otp-inputs { display: flex; gap: .5rem; justify-content: center; margin-bottom: .85rem; }
  .otp-input { width: 42px; height: 48px; border: 2px solid var(--border); border-radius: 9px; text-align: center; font-size: 1.15rem; font-weight: 800; font-family: var(--font); outline: none; transition: border-color .18s; }
  .otp-input:focus { border-color: var(--amber); box-shadow: 0 0 0 3px rgba(245,166,35,.12); }
  .otp-timer { font-size: .7rem; color: var(--text-mid); margin-bottom: .75rem; }
  .otp-timer span { color: var(--amber-dark); font-weight: 800; }
  .otp-resend { background: transparent; border: none; color: var(--amber-dark); font-size: .7rem; font-weight: 700; cursor: pointer; font-family: var(--font); }
  .otp-resend:disabled { color: #9ca3af; cursor: not-allowed; }

  @media (max-width: 500px) {
    .rp-card { padding: 1rem .9rem .85rem; }
    .rp-grid2 { grid-template-columns: 1fr; gap: 0; }
    .rp-footer-row { grid-template-columns: 1fr; }
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
  const [otp, setOtp]           = useState(['','','','','','']);
  const [loading, setLoading]   = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(x => x - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const fmt = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  const handleChange = (i, v) => {
    if (!/^\d*$/.test(v)) return;
    const n = [...otp]; n[i] = v.slice(-1); setOtp(n);
    if (v && i < 5) inputRefs.current[i+1]?.focus();
  };
  const handleKey = (i, e) => { if (e.key==='Backspace' && !otp[i] && i>0) inputRefs.current[i-1]?.focus(); };
  const handlePaste = (e) => {
    e.preventDefault();
    const p = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6);
    if (p.length===6) { setOtp(p.split('')); inputRefs.current[5]?.focus(); }
  };
  const verify = async () => {
    const code = otp.join('');
    if (code.length!==6) { toast.error('Enter the complete code'); return; }
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/auth/verify-otp`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({userId, otp: code}) });
      const d = await r.json();
      if (d.success) { toast.success('Phone verified!'); setTimeout(() => onSuccess(d), 800); }
      else { toast.error(d.message || 'Invalid code'); setOtp(['','','','','','']); inputRefs.current[0]?.focus(); }
    } catch { toast.error('Connection error'); }
    finally { setLoading(false); }
  };
  const resend = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/auth/resend-otp`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({userId}) });
      const d = await r.json();
      if (d.success) { setTimeLeft(600); setOtp(['','','','','','']); inputRefs.current[0]?.focus(); toast.success('New code sent!'); }
      else toast.error(d.message || 'Could not resend');
    } catch { toast.error('Connection error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="otp-wrap">
      <div className="rp-hdr"><h2>Verify Your Phone</h2><p>Enter the 6-digit code sent to</p><div className="rp-line" /></div>
      <div className="otp-phone-badge"><i className="fa fa-phone" /> {phone}</div>
      <div className="otp-inputs" onPaste={handlePaste}>
        {otp.map((d,i) => (
          <input key={i} ref={el => inputRefs.current[i]=el} className="otp-input"
            type="text" inputMode="numeric" maxLength={1} value={d}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKey(i, e)} autoFocus={i===0} />
        ))}
      </div>
      <div className="otp-timer">{timeLeft > 0 ? <>Expires in <span>{fmt(timeLeft)}</span></> : <span style={{color:'#dc2626'}}>Code expired</span>}</div>
      <button className="rp-submit" onClick={verify} disabled={loading || otp.join('').length!==6}>
        {loading ? <><div className="rp-submit-spin" /> Verifying...</> : <><i className="fa fa-check" /> Verify & Continue</>}
      </button>
      <div style={{marginTop:'.5rem',textAlign:'center'}}>
        <span style={{fontSize:'.67rem',color:'#6b7280'}}>Didn't get it? </span>
        <button className="otp-resend" onClick={resend} disabled={loading || timeLeft > 550}>{loading ? 'Sending…' : 'Resend'}</button>
      </div>
    </div>
  );
};

const RegisterForm = () => {
  const [formData, setFormData] = useState({ fullName:'', phone:'', whatsapp:'', sameAsPhone:true, password:'', confirmPassword:'', role:'landlord' });
  const [showPw, setShowPw]               = useState(false);
  const [showCpw, setShowCpw]             = useState(false);
  const [pwStrength, setPwStrength]       = useState('');
  const [loading, setLoading]             = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [captcha, setCaptcha]             = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [showOtp, setShowOtp]             = useState(false);
  const [otpUserId, setOtpUserId]         = useState(null);
  const [attempts, setAttempts]           = useState(0);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [googleToken, setGoogleToken] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const checkStrength = (pw) => {
    if (!pw) return '';
    let s = 0;
    if (pw.length >= 8) s++;
    if (pw.match(/[a-z]/) && pw.match(/[A-Z]/)) s++;
    if (pw.match(/\d/)) s++;
    if (pw.match(/[^a-zA-Z\d]/)) s++;
    return s <= 2 ? 'weak' : s === 3 ? 'medium' : 'strong';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'sameAsPhone') { setFormData(p => ({ ...p, sameAsPhone: checked, whatsapp: checked ? p.phone : '' })); return; }
    setFormData(p => {
      const next = { ...p, [name]: type === 'checkbox' ? checked : value };
      if (name === 'phone' && p.sameAsPhone) next.whatsapp = value;
      return next;
    });
    if (name === 'password') setPwStrength(checkStrength(value));
  };

  const handleCaptcha = () => {
    if (captcha || captchaLoading) return;
    setCaptchaLoading(true);
    setTimeout(() => { setCaptchaLoading(false); setCaptcha(true); }, 1100);
  };

  const handleGoogleSuccess = async (tokenResponse) => {
  setGoogleLoading(true);
  try {
    const res = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        credential: tokenResponse.access_token,
        role: formData.role,
      }),
    });
    const data = await res.json();
  if (data.success) {
  storage.set('token', data.token);
  storage.set('user', data.user);
  storage.set('tokenExpiry', new Date().getTime() + 7*24*60*60*1000);
  toast.success(`Welcome ${data.user.fullName || data.user.firstName}!`);
  setGoogleUser(data.user);
  setGoogleToken(data.token);
  setShowPhoneModal(true);
} else toast.error(data.message || 'Google sign-up failed');
  } catch { toast.error('Google sign-up failed'); }
  finally { setGoogleLoading(false); }
};
  const googleLogin = useGoogleLogin({ onSuccess: handleGoogleSuccess, onError: () => toast.error('Google sign-up failed') });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (attempts >= 5) { toast.error('Too many attempts. Try again later.'); return; }
    if (!captcha) { toast.error('Please verify you are not a robot'); return; }
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (formData.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (pwStrength === 'weak') { toast.error('Please use a stronger password'); return; }
    const phoneRgx = /^(?:\+265|0)\d{8,9}$/;
    if (!phoneRgx.test(formData.phone)) { toast.error('Enter a valid Malawian number (e.g. 0888123456)'); return; }
    if (!formData.fullName.trim()) { toast.error('Please enter your full name'); return; }
    setAttempts(a => a+1);
    setLoading(true);
    try {
      const payload = { ...formData, whatsapp: formData.sameAsPhone ? formData.phone : formData.whatsapp };
      const data = await register(payload);
      if (data.requiresOtp) { setOtpUserId(data.userId); setShowOtp(true); toast.info('Verification code sent!'); }
      else { toast.success('Registration successful! Please login.'); setTimeout(() => navigate('/login'), 500); }
    } catch (err) { toast.error(handleApiError(err)); }
    finally { setLoading(false); }
  };

  const handleOtpSuccess = () => { toast.success('Verified! Please login.'); setTimeout(() => navigate('/login'), 500); };

  const Navbar = () => (
    <nav className="rp-bar">
      <Link to="/" className="rp-bar-logo">
        <div className="rp-bar-logo-img"><img src="/PEZ.png" alt="PezaNyumba" /></div>
        <div className="rp-bar-brand"><strong>PezaNyumba</strong></div>
      </Link>
      <Link to="/login" className="rp-bar-login"><i className="fa fa-sign-in-alt" /> Login</Link>
    </nav>
  );

  if (showOtp) return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <Navbar />
      <div className="rp-main"><div className="rp-card"><OtpScreen userId={otpUserId} phone={formData.phone} onSuccess={handleOtpSuccess} /></div></div>
    </>
  );

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
            navigate('/landlord-dashboard');
          }}
        />
      )}
      <Navbar />
      <div className="rp-main">
        <div className="rp-card">

          <div className="rp-hdr">
            <h2>Create Account</h2>
            <p>Landlords &amp; land sellers only — tenants browse free</p>
            <div className="rp-line" />
          </div>

          {/* Role */}
          <div className="rp-role-row">
            {[{value:'landlord',icon:'fa-home',label:'Landlord'},{value:'land_seller',icon:'fa-seedling',label:'Land Seller'}].map(r => (
              <div className="rp-role-opt" key={r.value}>
                <input type="radio" id={`role_${r.value}`} name="role" value={r.value} checked={formData.role===r.value} onChange={handleChange} />
                <label className="rp-role-btn" htmlFor={`role_${r.value}`}><i className={`fa ${r.icon}`} /> {r.label}</label>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>

            {/* Full Name — full width */}
            <div className="rp-grp">
              <label className="rp-lbl" htmlFor="fullName">Full Name</label>
              <div className="rp-wrap">
                <i className="fa fa-user rp-ico" />
                <input id="fullName" className="rp-input" type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Banda" required autoComplete="name" />
              </div>
            </div>

            {/* Phone + WhatsApp */}
            <div className="rp-grid2">
              <div className="rp-grp">
                <label className="rp-lbl" htmlFor="phone">Phone</label>
                <div className="rp-wrap">
                  <i className="fa fa-phone rp-ico" />
                  <input id="phone" className="rp-input" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="0888123456" required autoComplete="tel" />
                </div>
              </div>
              <div className="rp-grp">
                <label className="rp-lbl" htmlFor="whatsapp">
                  WhatsApp
                  <label className="rp-wa-same">
                    <input type="checkbox" name="sameAsPhone" checked={formData.sameAsPhone} onChange={handleChange} /> Same
                  </label>
                </label>
                <div className="rp-wrap">
                  <i className="fab fa-whatsapp rp-wa-ico" />
                  <input id="whatsapp" className="rp-input wa-field" type="tel" name="whatsapp"
                    value={formData.sameAsPhone ? formData.phone : formData.whatsapp}
                    onChange={handleChange} placeholder="0888123456"
                    disabled={formData.sameAsPhone} style={{paddingLeft:'1.9rem', opacity: formData.sameAsPhone ? 0.7 : 1}} />
                </div>
              </div>
            </div>

            {/* Password + Confirm */}
            <div className="rp-grid2">
              <div className="rp-grp">
                <label className="rp-lbl" htmlFor="password">
                  Password
                  {pwStrength && <span className={`rp-strength ${pwStrength}`}>{pwStrength==='weak'?'⚠ Weak':pwStrength==='medium'?'⚡ Ok':'✓ Strong'}</span>}
                </label>
                <div className="rp-wrap">
                  <i className="fa fa-lock rp-ico" />
                  <input id="password" className={`rp-input${pwStrength ? ` password-${pwStrength}` : ''}`}
                    type={showPw ? 'text' : 'password'} name="password" value={formData.password}
                    onChange={handleChange} placeholder="Min. 8 chars" required autoComplete="new-password" />
                  <i className={`fa ${showPw?'fa-eye-slash':'fa-eye'} rp-toggle`} onClick={() => setShowPw(!showPw)} />
                </div>
              </div>
              <div className="rp-grp">
                <label className="rp-lbl" htmlFor="confirmPassword">Confirm</label>
                <div className="rp-wrap">
                  <i className="fa fa-check-circle rp-ico" />
                  <input id="confirmPassword" className="rp-input"
                    type={showCpw ? 'text' : 'password'} name="confirmPassword"
                    value={formData.confirmPassword} onChange={handleChange}
                    placeholder="Repeat" required autoComplete="new-password" />
                  <i className={`fa ${showCpw?'fa-eye-slash':'fa-eye'} rp-toggle`} onClick={() => setShowCpw(!showCpw)} />
                </div>
              </div>
            </div>

            {/* Captcha + Terms */}
            <div className="rp-footer-row">
              <div className="rp-captcha" onClick={handleCaptcha} role="button" tabIndex={0}>
                <div className="rp-cap-l">
                  <div className={`rp-cap-box${captcha?' on':''}`} />
                  {captchaLoading
                    ? <span className="rp-cap-txt"><div className="rp-spin" /> Checking…</span>
                    : <span className="rp-cap-txt">{captcha ? 'Verified ✓' : "Not a robot"}</span>
                  }
                </div>
                <div><i className="fa fa-shield-alt" style={{color:'var(--amber)',fontSize:'.95rem'}} /><div className="rp-cap-note">Security<br/>Check</div></div>
              </div>
              <label className="rp-terms">
                <input type="checkbox" required />
                <span>I agree to the <Link to="/terms">Terms</Link> &amp; <Link to="/privacy">Privacy Policy</Link></span>
              </label>
            </div>

            <button type="submit" className="rp-submit" disabled={loading}>
              {loading ? <><div className="rp-submit-spin" /> Creating Account…</> : <><i className="fa fa-user-plus" /> Create Account</>}
            </button>

            <div className="or-div">or continue with</div>

            <button type="button" className="g-btn" onClick={() => googleLogin()} disabled={googleLoading}>
              {googleLoading ? <><div className="rp-spin" style={{borderTopColor:'#4285f4'}} /> Connecting…</> : <><GoogleIcon /> Continue with Google</>}
            </button>
          </form>

          <p className="rp-link">Already have an account? <Link to="/login">Sign in</Link></p>

        </div>
      </div>
    </>
  );
};

export default RegisterForm;
