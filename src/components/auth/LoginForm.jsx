import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { handleApiError } from '../../utils/helpers';
import '../../styles/global.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy: #0d1b3e; --blue: #1a3fa4; --orange: #e8501a;
    --text-dark: #111827; --text-mid: #4b5563; --card-radius: 14px;
  }
  html, body, #root { height: 100%; width: 100%; overflow: hidden; font-family: 'Manrope', sans-serif; }
  .rp-bar{position:fixed;top:0;left:0;right:0;z-index:500;height:60px;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;background:rgba(8,18,48,0.97);backdrop-filter:blur(8px);box-shadow:0 2px 18px rgba(0,0,0,0.4);}
  .rp-bar-logo{display:flex;align-items:center;gap:9px;text-decoration:none;}
  .rp-bar-logo-img{width:36px;height:36px;border-radius:50%;overflow:hidden;flex-shrink:0;}
  .rp-bar-logo-img img{width:100%;height:100%;object-fit:cover;}
  .rp-bar-brand span{color:rgba(255,255,255,0.42);font-size:0.56rem;}
  .rp-bar-actions{display:flex;align-items:center;gap:0.6rem;}
  .rp-bar-login{color:rgba(255,255,255,0.78);font-size:0.82rem;font-weight:600;background:transparent;border:1.5px solid rgba(255,255,255,0.2);padding:0.36rem 0.95rem;border-radius:6px;cursor:pointer;text-decoration:none;transition:all 0.18s;display:flex;align-items:center;gap:5px;}
  .rp-bar-login:hover{border-color:rgba(255,255,255,0.55);color:#fff;}
  .rp-bar-signup{color:#fff;font-size:0.82rem;font-weight:700;background:var(--orange);border:none;padding:0.36rem 0.95rem;border-radius:6px;cursor:pointer;text-decoration:none;transition:opacity 0.18s;display:flex;align-items:center;gap:5px;}
  .rp-bar-signup:hover{opacity:0.88;}
  .rp-main{position:fixed;top:60px;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background:#f4f6fb;overflow:hidden;}
  .rp-card{background:#fff;border-radius:var(--card-radius);box-shadow:0 8px 40px rgba(13,27,62,0.12);padding:1.6rem 1.7rem 1.4rem;width:420px;max-width:90%;max-height:90vh;overflow-y:auto;}
  .rp-card-hdr{text-align:center;margin-bottom:1.1rem;}
  .rp-card-hdr h2{font-size:1.28rem;font-weight:800;color:var(--navy);margin-bottom:0.15rem;}
  .rp-card-hdr p{color:var(--text-mid);font-size:0.75rem;}
  .rp-line{width:38px;height:3px;background:var(--orange);border-radius:2px;margin:0.45rem auto 0;}
  .rp-grp{margin-bottom:1rem;}
  .rp-lbl{display:block;font-size:0.6rem;font-weight:700;color:var(--text-mid);text-transform:uppercase;letter-spacing:0.4px;margin-bottom:0.22rem;}
  .rp-wrap{position:relative;display:flex;align-items:center;}
  .rp-ico{position:absolute;left:0.68rem;color:var(--blue);font-size:0.68rem;pointer-events:none;}
  .rp-input{width:100%;border:1.5px solid #e5e7eb;border-radius:6px;padding:0.44rem 0.65rem 0.44rem 1.9rem;font-size:0.78rem;font-family:'Manrope',sans-serif;color:var(--text-dark);font-weight:500;background:#fafafa;outline:none;transition:border-color 0.18s,box-shadow 0.18s,background 0.18s;}
  .rp-input:focus{border-color:var(--blue);background:#fff;box-shadow:0 0 0 3px rgba(26,63,164,0.07);}
  .rp-input::placeholder{color:#c0c6d0;font-weight:400;}
  .rp-row-flex{display:flex;justify-content:space-between;align-items:center;margin:0.5rem 0 1rem;}
  .rp-checkbox{display:flex;align-items:center;gap:0.4rem;font-size:0.72rem;color:var(--text-mid);cursor:pointer;}
  .rp-checkbox input{width:12px;height:12px;accent-color:var(--orange);}
  .rp-forgot{font-size:0.72rem;color:var(--orange);text-decoration:none;font-weight:600;}
  .rp-forgot:hover{text-decoration:underline;}
  .rp-captcha{border:1.5px solid #e5e7eb;border-radius:6px;padding:0.55rem 0.75rem;background:#fafafa;display:flex;align-items:center;justify-content:space-between;margin-bottom:0.55rem;cursor:pointer;transition:border-color 0.18s;user-select:none;}
  .rp-captcha:hover{border-color:var(--blue);}
  .rp-cap-l{display:flex;align-items:center;gap:0.55rem;}
  .rp-cap-box{width:18px;height:18px;border:2px solid #9ca3af;border-radius:3px;display:flex;align-items:center;justify-content:center;transition:all 0.18s;flex-shrink:0;}
  .rp-cap-box.on{background:#2563eb;border-color:#2563eb;}
  .rp-cap-box.on::after{content:'✓';color:#fff;font-size:0.65rem;font-weight:700;}
  .rp-cap-txt{font-size:0.76rem;font-weight:600;color:var(--text-dark);}
  .rp-cap-txt.spin-mode{color:var(--text-mid);display:flex;align-items:center;gap:0.35rem;}
  .rp-spin{width:12px;height:12px;border:2px solid #e5e7eb;border-top-color:#2563eb;border-radius:50%;animation:rpspin 0.7s linear infinite;}
  @keyframes rpspin{to{transform:rotate(360deg);}}
  .rp-cap-r{display:flex;flex-direction:column;align-items:flex-end;gap:1px;}
  .rp-cap-note{font-size:0.47rem;color:#9ca3af;text-align:right;line-height:1.3;}
  .rp-terms{display:flex;align-items:flex-start;gap:0.4rem;margin-bottom:0.75rem;font-size:0.72rem;color:var(--text-mid);line-height:1.5;cursor:pointer;}
  .rp-terms input{width:12px;height:12px;margin-top:2px;cursor:pointer;accent-color:var(--orange);flex-shrink:0;}
  .rp-terms a{color:var(--blue);font-weight:600;text-decoration:none;}
  .rp-terms a:hover{color:var(--orange);}
  .rp-submit{width:100%;background:var(--orange);color:#fff;border:none;cursor:pointer;padding:0.62rem 1rem;border-radius:7px;font-size:0.84rem;font-weight:700;font-family:'Manrope',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px;transition:opacity 0.18s,transform 0.14s;}
  .rp-submit:hover:not(:disabled){opacity:0.9;transform:translateY(-1px);}
  .rp-submit:disabled{opacity:0.6;cursor:not-allowed;}
  .rp-submit-spin{width:12px;height:12px;border:2px solid rgba(255,255,255,0.35);border-top-color:#fff;border-radius:50%;animation:rpspin 0.7s linear infinite;}
  .rp-link{text-align:center;margin-top:0.8rem;font-size:0.76rem;color:var(--text-mid);}
  .rp-link a{color:var(--orange);font-weight:700;text-decoration:none;}
  .rp-link a:hover{text-decoration:underline;}
  .g-btn{width:100%;background:#fff;color:#3c4043;border:1.5px solid #dadce0;cursor:pointer;padding:0.62rem 1rem;border-radius:7px;font-size:0.84rem;font-weight:700;font-family:'Manrope',sans-serif;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.18s;margin-top:0.5rem;}
  .g-btn:hover:not(:disabled){background:#f8f9fa;border-color:#c0c0c0;box-shadow:0 2px 8px rgba(0,0,0,0.1);}
  .g-btn:disabled{opacity:0.6;cursor:not-allowed;}
  .g-btn svg{width:18px;height:18px;flex-shrink:0;}
  .or-divider{display:flex;align-items:center;gap:0.75rem;margin:0.85rem 0 0;font-size:0.72rem;color:#9ca3af;font-weight:600;}
  .or-divider::before,.or-divider::after{content:'';flex:1;height:1px;background:#e5e7eb;}
  @media(max-width:768px){.rp-bar{padding:0 1rem;}.rp-bar-brand{display:none;}.rp-card{max-height:85vh;}}
`;

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCaptcha = () => {
    if (captchaChecked || captchaLoading) return;
    setCaptchaLoading(true);
    setTimeout(() => { setCaptchaLoading(false); setCaptchaChecked(true); }, 1200);
  };

  // ── Google Login ───────────────────────────────────
  const handleGoogleSuccess = async (tokenResponse) => {
    setGoogleLoading(true);
    try {
      // Fetch user info from Google using access token
      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
      });
      const googleUserInfo = await userInfoRes.json();

      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleUserInfo })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success(`Welcome back, ${data.user.firstName}!`);
        const dashboardUrl = data.user.role === 'owner' ? '/landlord-dashboard' : '/dashboard';
        setTimeout(() => navigate(dashboardUrl), 500);
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
    if (!captchaChecked) { toast.error('Please verify you are not a robot!'); return; }
    setLoading(true);
    try {
      const response = await login(formData);
      toast.success('Login successful!');
      navigate(response.dashboardUrl || '/dashboard');
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

      <nav className="rp-bar">
        <Link to="/" className="rp-bar-logo">
          <div className="rp-bar-logo-img"><img src="/PezaHostelLogo.png" alt="PezaHostel" /></div>
          <div className="rp-bar-brand"><span>OFF-CAMPUS ACCOMMODATION</span></div>
        </Link>
        <div className="rp-bar-actions">
          <Link to="/login" className="rp-bar-login"><i className="fa fa-sign-in-alt"></i> Login</Link>
          <Link to="/register" className="rp-bar-signup"><i className="fa fa-user-plus"></i> Sign Up</Link>
        </div>
      </nav>

      <div className="rp-main">
        <div className="rp-card">
          <div className="rp-card-hdr">
            <h2>Welcome Back</h2>
            <p>Sign in to continue to your account</p>
            <div className="rp-line"></div>
          </div>

          {/* EMAIL FORM FIRST */}
          <form onSubmit={handleSubmit}>
            <div className="rp-grp">
              <label className="rp-lbl" htmlFor="email">Email Address</label>
              <div className="rp-wrap">
                <i className="fa fa-envelope rp-ico"></i>
                <input id="email" className="rp-input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
              </div>
            </div>
            <div className="rp-grp">
              <label className="rp-lbl" htmlFor="password">Password</label>
              <div className="rp-wrap">
                <i className="fa fa-lock rp-ico"></i>
                <input id="password" className="rp-input" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
              </div>
            </div>
            <div className="rp-row-flex">
              <label className="rp-checkbox"><input type="checkbox" /> Remember me</label>
              <Link to="/forgot-password" className="rp-forgot">Forgot Password?</Link>
            </div>
            <div className="rp-captcha" onClick={handleCaptcha} role="button" tabIndex={0}>
              <div className="rp-cap-l">
                <div className={`rp-cap-box${captchaChecked ? ' on' : ''}`}></div>
                {captchaLoading
                  ? <span className="rp-cap-txt spin-mode"><div className="rp-spin"></div> Verifying...</span>
                  : <span className="rp-cap-txt">{captchaChecked ? 'Verified ✓' : "I'm not a robot"}</span>}
              </div>
              <div className="rp-cap-r">
                <i className="fa fa-shield-alt" style={{ color: '#4285f4', fontSize: '1.15rem' }}></i>
                <div className="rp-cap-note">reCAPTCHA<br />Privacy · Terms</div>
              </div>
            </div>
            <label className="rp-terms">
              <input type="checkbox" required />
              <span>I agree to the <Link to="/terms">Terms &amp; Conditions</Link> and <Link to="/privacy">Privacy Policy</Link></span>
            </label>
            <button type="submit" className="rp-submit" disabled={loading}>
              {loading
                ? <><div className="rp-submit-spin"></div> Signing in...</>
                : <><i className="fa fa-sign-in-alt"></i> Sign In</>}
            </button>

            {/* GOOGLE AT BOTTOM */}
            <div className="or-divider">or sign in faster with</div>
            <button type="button" className="g-btn" onClick={() => googleLogin()} disabled={googleLoading}>
              {googleLoading
                ? <><div className="rp-spin" style={{ borderTopColor: '#4285f4' }} /> Connecting...</>
                : <><GoogleIcon /> Continue with Google</>}
            </button>
          </form>

          <p className="rp-link">Don't have an account? <Link to="/register">Sign up here</Link></p>
        </div>
      </div>
    </>
  );
};

export default LoginForm;