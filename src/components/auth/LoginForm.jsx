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
    --green: #16a34a; --red: #dc2626;
  }
  html, body, #root { height: 100%; width: 100%; overflow: hidden; font-family: 'Manrope', sans-serif; }
  .rp-bar{position:fixed;top:0;left:0;right:0;z-index:500;height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 1.5rem;background:rgba(8,18,48,0.97);backdrop-filter:blur(8px);box-shadow:0 2px 12px rgba(0,0,0,0.3);}
  .rp-bar-logo{display:flex;align-items:center;gap:8px;text-decoration:none;}
  .rp-bar-logo-img{width:30px;height:30px;border-radius:50%;overflow:hidden;flex-shrink:0;}
  .rp-bar-logo-img img{width:100%;height:100%;object-fit:cover;}
  .rp-bar-brand span{color:rgba(255,255,255,0.42);font-size:0.45rem;}
  .rp-bar-actions{display:flex;align-items:center;gap:0.5rem;}
  .rp-bar-login{color:rgba(255,255,255,0.78);font-size:0.7rem;font-weight:600;background:transparent;border:1.5px solid rgba(255,255,255,0.2);padding:0.25rem 0.8rem;border-radius:6px;cursor:pointer;text-decoration:none;}
  .rp-bar-login:hover{border-color:rgba(255,255,255,0.55);color:#fff;}
  .rp-bar-signup{color:#fff;font-size:0.7rem;font-weight:700;background:var(--orange);border:none;padding:0.25rem 0.8rem;border-radius:6px;cursor:pointer;text-decoration:none;}
  .rp-bar-signup:hover{opacity:0.88;}
  .rp-main{position:fixed;top:52px;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background:#f4f6fb;overflow:auto;padding:0.5rem;}
  .rp-card{background:#fff;border-radius:var(--card-radius);box-shadow:0 8px 28px rgba(13,27,62,0.12);padding:1rem 1.2rem;width:400px;max-width:100%;margin:0 auto;}
  .rp-card-hdr{text-align:center;margin-bottom:0.5rem;}
  .rp-card-hdr h2{font-size:1.25rem;font-weight:800;color:var(--navy);margin-bottom:0.1rem;}
  .rp-card-hdr p{color:var(--text-mid);font-size:0.7rem;}
  .rp-line{width:35px;height:2.5px;background:var(--orange);border-radius:2px;margin:0.35rem auto 0;}
  .rp-role-lbl{display:block;font-size:0.6rem;font-weight:700;color:var(--text-mid);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.25rem;}
  .rp-role-row{display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;margin-bottom:0.7rem;}
  .rp-role-opt{position:relative;}
  .rp-role-opt input{position:absolute;opacity:0;width:0;height:0;}
  .rp-role-btn{display:flex;align-items:center;justify-content:center;gap:0.4rem;padding:0.4rem 0.5rem;border:1.5px solid #e5e7eb;border-radius:8px;cursor:pointer;font-size:0.75rem;font-weight:600;color:var(--text-mid);background:#fafafa;transition:all 0.18s;}
  .rp-role-btn:hover{border-color:var(--blue);color:var(--blue);}
  .rp-role-opt input:checked+.rp-role-btn{border-color:var(--orange);color:var(--orange);background:#fff5f2;}
  .rp-grp{margin-bottom:0.6rem;}
  .rp-lbl{display:block;font-size:0.6rem;font-weight:700;color:var(--text-mid);text-transform:uppercase;letter-spacing:0.4px;margin-bottom:0.2rem;}
  .rp-wrap{position:relative;display:flex;align-items:center;}
  .rp-ico{position:absolute;left:0.65rem;color:var(--blue);font-size:0.7rem;pointer-events:none;}
  .rp-toggle{position:absolute;right:0.65rem;color:#9ca3af;font-size:0.7rem;cursor:pointer;z-index:2;}
  .rp-toggle:hover{color:var(--blue);}
  .rp-input{width:100%;border:1.5px solid #e5e7eb;border-radius:8px;padding:0.45rem 0.7rem 0.45rem 2rem;font-size:0.75rem;font-family:'Manrope',sans-serif;color:var(--text-dark);font-weight:500;background:#fafafa;outline:none;transition:all 0.18s;}
  .rp-input:focus{border-color:var(--blue);background:#fff;box-shadow:0 0 0 3px rgba(26,63,164,0.07);}
  .rp-input::placeholder{font-size:0.7rem;color:#cbd5e1;}
  .rp-row-flex{display:flex;justify-content:space-between;align-items:center;margin:0.4rem 0 0.6rem;}
  .rp-checkbox{display:flex;align-items:center;gap:0.4rem;font-size:0.68rem;color:var(--text-mid);cursor:pointer;}
  .rp-checkbox input{width:12px;height:12px;accent-color:var(--orange);}
  .rp-forgot{font-size:0.68rem;color:var(--orange);text-decoration:none;font-weight:600;}
  .rp-forgot:hover{text-decoration:underline;}
  .rp-captcha{border:1.5px solid #e5e7eb;border-radius:8px;padding:0.45rem 0.7rem;background:#fafafa;display:flex;align-items:center;justify-content:space-between;margin-bottom:0.6rem;cursor:pointer;}
  .rp-cap-l{display:flex;align-items:center;gap:0.5rem;}
  .rp-cap-box{width:16px;height:16px;border:2px solid #9ca3af;border-radius:3px;display:flex;align-items:center;justify-content:center;}
  .rp-cap-box.on{background:#2563eb;border-color:#2563eb;}
  .rp-cap-box.on::after{content:'✓';color:#fff;font-size:0.6rem;font-weight:700;}
  .rp-cap-txt{font-size:0.7rem;font-weight:600;color:var(--text-dark);}
  .rp-spin{width:10px;height:10px;border:2px solid #e5e7eb;border-top-color:#2563eb;border-radius:50%;animation:rpspin 0.7s linear infinite;}
  @keyframes rpspin{to{transform:rotate(360deg);}}
  .rp-cap-r i{color:#4285f4;font-size:1rem;}
  .rp-cap-note{font-size:0.45rem;color:#9ca3af;text-align:right;line-height:1.2;}
  .rp-submit{width:100%;background:var(--orange);color:#fff;border:none;cursor:pointer;padding:0.6rem 1rem;border-radius:8px;font-size:0.8rem;font-weight:700;font-family:'Manrope',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px;transition:opacity 0.18s;}
  .rp-submit:hover:not(:disabled){opacity:0.9;}
  .rp-submit:disabled{opacity:0.6;cursor:not-allowed;}
  .rp-submit-spin{width:11px;height:11px;border:2px solid rgba(255,255,255,0.35);border-top-color:#fff;border-radius:50%;animation:rpspin 0.7s linear infinite;}
  .rp-link{text-align:center;margin-top:0.7rem;font-size:0.7rem;color:var(--text-mid);}
  .rp-link a{color:var(--orange);font-weight:700;text-decoration:none;}
  .g-btn{width:100%;background:#fff;color:#3c4043;border:1.5px solid #dadce0;cursor:pointer;padding:0.6rem 1rem;border-radius:8px;font-size:0.8rem;font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.18s;margin-top:0.5rem;}
  .g-btn:hover:not(:disabled){background:#f8f9fa;border-color:#c0c0c0;}
  .g-btn:disabled{opacity:0.6;cursor:not-allowed;}
  .g-btn svg{width:16px;height:16px;}
  .or-divider{display:flex;align-items:center;gap:0.7rem;margin:0.7rem 0 0.5rem;font-size:0.68rem;color:#9ca3af;}
  .or-divider::before,.or-divider::after{content:'';flex:1;height:1px;background:#e5e7eb;}

  @media (max-width: 480px) {
    .rp-card{padding:0.9rem;width:95%;}
    .rp-input{padding:0.4rem 0.6rem 0.4rem 1.8rem;}
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

const LoginForm = () => {
  const [formData, setFormData] = useState({ phone: '', password: '', role: 'tenant' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCaptcha = () => {
    if (captchaChecked || captchaLoading) return;
    setCaptchaLoading(true);
    setTimeout(() => { setCaptchaLoading(false); setCaptchaChecked(true); }, 1200);
  };

  // Google Login
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
        body: JSON.stringify({ googleUserInfo, role: formData.role })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success(`Welcome back, ${data.user.fullName || data.user.firstName}!`);
        const dashboardUrl = data.user.role === 'landlord' ? '/landlord-dashboard' : '/dashboard';
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
    
    if (!captchaChecked) { 
      toast.error('Please verify you are not a robot!'); 
      return;
    }
    
    // Validate Malawian phone number
    const phoneRegex = /^(?:\+265|0)(?:88|99|98|66)\d{7}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Enter valid Malawian number (e.g., 0888123456 or +265888123456)');
      return;
    }
    
    if (!formData.password) {
      toast.error('Please enter your password');
      return;
    }
    
    setLoading(true);
    try {
      const response = await login(formData);
      toast.success('Login successful!');
      
      // Redirect based on role and verification status
      if (response.user.role === 'landlord') {
        if (response.user.verificationStatus === 'pending') {
          toast.info('Your account is pending verification. You will be notified once approved.');
        } else if (response.user.verificationStatus === 'rejected') {
          toast.error('Verification failed. Please contact support.');
        }
        navigate('/landlord-dashboard');
      } else {
        navigate('/dashboard');
      }
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
          <div className="rp-bar-logo-img"><img src="/PezaHostelLogo.png" alt="PezaNyumba" /></div>
          <div className="rp-bar-brand"><span>FIND YOUR HOME</span></div>
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
            <p>Sign in to your account</p>
            <div className="rp-line"></div>
          </div>

          {/* Role Selection */}
          <div className="rp-role-lbl">I am a</div>
          <div className="rp-role-row">
            <div className="rp-role-opt">
              <input type="radio" id="rt" name="role" value="tenant" checked={formData.role === 'tenant'} onChange={handleChange} />
              <label className="rp-role-btn" htmlFor="rt"><i className="fa fa-user"></i> Tenant</label>
            </div>
            <div className="rp-role-opt">
              <input type="radio" id="rl" name="role" value="landlord" checked={formData.role === 'landlord'} onChange={handleChange} />
              <label className="rp-role-btn" htmlFor="rl"><i className="fa fa-home"></i> Landlord</label>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="rp-grp">
              <label className="rp-lbl" htmlFor="phone">Phone Number</label>
              <div className="rp-wrap">
                <i className="fa fa-phone rp-ico"></i>
                <input id="phone" className="rp-input" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="0888123456 or +265888123456" required autoComplete="tel" />
              </div>
            </div>

            <div className="rp-grp">
              <label className="rp-lbl" htmlFor="password">Password</label>
              <div className="rp-wrap">
                <i className="fa fa-lock rp-ico"></i>
                <input id="password" className="rp-input" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required autoComplete="current-password" />
                <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} rp-toggle`} onClick={() => setShowPassword(!showPassword)}></i>
              </div>
            </div>

            <div className="rp-row-flex">
              <label className="rp-checkbox">
                <input type="checkbox" /> Remember me
              </label>
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
                <i className="fa fa-shield-alt" style={{ color: '#4285f4', fontSize: '1rem' }}></i>
                <div className="rp-cap-note">Security</div>
              </div>
            </div>

            <button type="submit" className="rp-submit" disabled={loading}>
              {loading
                ? <><div className="rp-submit-spin"></div> Signing in...</>
                : <><i className="fa fa-sign-in-alt"></i> Sign In</>}
            </button>

            {/* Google Authentication */}
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