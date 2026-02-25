import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaShieldAlt, FaUserGraduate, FaBuilding, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { handleApiError } from '../../utils/helpers';
import '../../styles/global.css';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0d1b3e;
    --navy2: #112255;
    --blue: #1a3fa4;
    --orange: #e8501a;
    --text-dark: #111827;
    --text-mid: #4b5563;
    --card-radius: 14px;
  }

  /* Lock entire page — zero scroll */
  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
    font-family: 'Manrope', sans-serif;
  }

  /* TOPBAR - EXACT same as Register Page */
  .rp-bar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 500;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    background: rgba(8, 18, 48, 0.97);
    backdrop-filter: blur(8px);
    box-shadow: 0 2px 18px rgba(0,0,0,0.4);
  }
  .rp-bar-logo {
    display: flex; align-items: center; gap: 9px; text-decoration: none;
  }
  .rp-bar-logo-img {
    width: 36px; height: 36px; border-radius: 50%; overflow: hidden; flex-shrink: 0;
  }
  .rp-bar-logo-img img { width: 100%; height: 100%; object-fit: cover; }
  .rp-bar-brand strong {
    display: block; color: #fff; font-size: 0.9rem; font-weight: 800;
    letter-spacing: 1px; font-family: 'Manrope', sans-serif;
  }
  .rp-bar-brand span {
    color: rgba(255,255,255,0.42); font-size: 0.56rem;
    letter-spacing: 0.4px; font-family: 'Manrope', sans-serif;
  }
  .rp-bar-actions { display: flex; align-items: center; gap: 0.6rem; }
  .rp-bar-login {
    color: rgba(255,255,255,0.78); font-size: 0.82rem; font-weight: 600;
    font-family: 'Manrope', sans-serif; background: transparent;
    border: 1.5px solid rgba(255,255,255,0.2); padding: 0.36rem 0.95rem;
    border-radius: 6px; cursor: pointer; text-decoration: none;
    transition: all 0.18s; display: flex; align-items: center; gap: 5px;
  }
  .rp-bar-login:hover { border-color: rgba(255,255,255,0.55); color: #fff; }
  .rp-bar-signup {
    color: #fff; font-size: 0.82rem; font-weight: 700;
    font-family: 'Manrope', sans-serif; background: var(--orange);
    border: none; padding: 0.36rem 0.95rem; border-radius: 6px;
    cursor: pointer; text-decoration: none; transition: opacity 0.18s;
    display: flex; align-items: center; gap: 5px;
  }
  .rp-bar-signup:hover { opacity: 0.88; }

  /* MAIN CONTENT - FULLSCREEN CENTERED FORM */
  .rp-main {
    position: fixed;
    top: 60px; left: 0; right: 0; bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f4f6fb;
    overflow: hidden;
  }

  /* FORM CARD - EXACT same as Register Page */
  .rp-card {
    background: #fff;
    border-radius: var(--card-radius);
    box-shadow: 0 8px 40px rgba(13,27,62,0.12);
    padding: 1.6rem 1.7rem 1.4rem;
    width: 420px;
    max-width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  }
  .rp-card-hdr { text-align: center; margin-bottom: 1.1rem; }
  .rp-card-hdr h2 {
    font-size: 1.28rem; font-weight: 800; color: var(--navy); margin-bottom: 0.15rem;
  }
  .rp-card-hdr p { color: var(--text-mid); font-size: 0.75rem; }
  .rp-line {
    width: 38px; height: 3px; background: var(--orange);
    border-radius: 2px; margin: 0.45rem auto 0;
  }

  /* section divider */
  .rp-sec {
    font-size: 0.6rem; font-weight: 700; color: var(--orange);
    text-transform: uppercase; letter-spacing: 0.9px;
    margin: 0.65rem 0 0.5rem; display: flex; align-items: center; gap: 0.4rem;
  }
  .rp-sec::after { content: ''; flex: 1; height: 1px; background: #ececec; }

  /* fields */
  .rp-grp { margin-bottom: 1rem; }
  .rp-lbl {
    display: block; font-size: 0.6rem; font-weight: 700; color: var(--text-mid);
    text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 0.22rem;
  }
  .rp-wrap { position: relative; display: flex; align-items: center; }
  .rp-ico { position: absolute; left: 0.68rem; color: var(--blue); font-size: 0.68rem; pointer-events: none; }
  .rp-input {
    width: 100%; border: 1.5px solid #e5e7eb; border-radius: 6px;
    padding: 0.44rem 0.65rem 0.44rem 1.9rem; font-size: 0.78rem;
    font-family: 'Manrope', sans-serif; color: var(--text-dark);
    font-weight: 500; background: #fafafa; outline: none;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  }
  .rp-input:focus {
    border-color: var(--blue); background: #fff;
    box-shadow: 0 0 0 3px rgba(26,63,164,0.07);
  }
  .rp-input::placeholder { color: #c0c6d0; font-weight: 400; }

  /* remember me and forgot password row */
  .rp-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0.5rem 0 1rem;
  }
  .rp-checkbox {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.72rem;
    color: var(--text-mid);
    cursor: pointer;
  }
  .rp-checkbox input {
    width: 12px;
    height: 12px;
    accent-color: var(--orange);
  }
  .rp-forgot {
    font-size: 0.72rem;
    color: var(--orange);
    text-decoration: none;
    font-weight: 600;
  }
  .rp-forgot:hover {
    text-decoration: underline;
  }

  /* captcha */
  .rp-captcha {
    border: 1.5px solid #e5e7eb; border-radius: 6px; padding: 0.55rem 0.75rem;
    background: #fafafa; display: flex; align-items: center;
    justify-content: space-between; margin-bottom: 0.75rem;
    cursor: pointer; transition: border-color 0.18s; user-select: none;
  }
  .rp-captcha:hover { border-color: var(--blue); }
  .rp-cap-l { display: flex; align-items: center; gap: 0.55rem; }
  .rp-cap-box {
    width: 18px; height: 18px; border: 2px solid #9ca3af; border-radius: 3px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.18s; flex-shrink: 0;
  }
  .rp-cap-box.on { background: #2563eb; border-color: #2563eb; }
  .rp-cap-box.on::after { content: '✓'; color: #fff; font-size: 0.65rem; font-weight: 700; }
  .rp-cap-txt { font-size: 0.76rem; font-weight: 600; color: var(--text-dark); }
  .rp-cap-txt.spin-mode { color: var(--text-mid); display: flex; align-items: center; gap: 0.35rem; }
  .rp-spin {
    width: 12px; height: 12px; border: 2px solid #e5e7eb;
    border-top-color: #2563eb; border-radius: 50%; animation: rpspin 0.7s linear infinite;
  }
  @keyframes rpspin { to { transform: rotate(360deg); } }
  .rp-cap-r { display: flex; flex-direction: column; align-items: flex-end; gap: 1px; }
  .rp-cap-note { font-size: 0.47rem; color: #9ca3af; text-align: right; line-height: 1.3; }

  /* terms - EXACT same as Register Page */
  .rp-terms {
    display: flex; align-items: flex-start; gap: 0.4rem;
    margin-bottom: 0.75rem; font-size: 0.72rem; color: var(--text-mid);
    line-height: 1.5; cursor: pointer;
  }
  .rp-terms input { width: 12px; height: 12px; margin-top: 2px; cursor: pointer; accent-color: var(--orange); flex-shrink: 0; }
  .rp-terms a { color: var(--blue); font-weight: 600; text-decoration: none; }
  .rp-terms a:hover { color: var(--orange); }

  /* submit button - EXACT same as Register Page */
  .rp-submit {
    width: 100%; background: var(--orange); color: #fff; border: none;
    cursor: pointer; padding: 0.62rem 1rem; border-radius: 7px;
    font-size: 0.84rem; font-weight: 700; font-family: 'Manrope', sans-serif;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: opacity 0.18s, transform 0.14s;
  }
  .rp-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  .rp-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .rp-submit-spin {
    width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff; border-radius: 50%; animation: rpspin 0.7s linear infinite;
  }

  /* login/register link - EXACT same as Register Page */
  .rp-link {
    text-align: center; margin-top: 0.8rem; font-size: 0.76rem; color: var(--text-mid);
  }
  .rp-link a { color: var(--orange); font-weight: 700; text-decoration: none; }
  .rp-link a:hover { text-decoration: underline; }

  @media (max-width: 768px) {
    .rp-bar { padding: 0 1rem; }
    .rp-bar-brand { display: none; }
    .rp-card { max-height: 85vh; }
  }
`;

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCaptcha = () => {
    if (captchaChecked || captchaLoading) return;
    setCaptchaLoading(true);
    setTimeout(() => {
      setCaptchaLoading(false);
      setCaptchaChecked(true);
    }, 1200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!captchaChecked) {
      toast.error('Please verify you are not a robot!');
      return;
    }
    
    setLoading(true);

    try {
      await login(formData);
      toast.success('Login successful!');
      navigate('/dashboard');
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

      {/* TOPBAR - EXACT same as Register Page */}
      <nav className="rp-bar">
        <Link to="/" className="rp-bar-logo">
          <div className="rp-bar-logo-img"><img src="/logo2.png" alt="HostelLink" /></div>
          <div className="rp-bar-brand">
            <strong>HOSTELLINK</strong>
            <span>OFF-CAMPUS ACCOMODATION</span>
          </div>
        </Link>
        <div className="rp-bar-actions">
          <Link to="/login" className="rp-bar-login"><i className="fa fa-sign-in-alt"></i> Login</Link>
          <Link to="/register" className="rp-bar-signup"><i className="fa fa-user-plus"></i> Sign Up</Link>
        </div>
      </nav>

      {/* MAIN CONTENT - CENTERED FORM */}
      <div className="rp-main">
        <div className="rp-card">
          <div className="rp-card-hdr">
            <h2>Welcome Back</h2>
            <p>Sign in to continue to your account</p>
            <div className="rp-line"></div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="rp-grp">
              <label className="rp-lbl" htmlFor="email">Email Address</label>
              <div className="rp-wrap">
                <i className="fa fa-envelope rp-ico"></i>
                <input
                  id="email"
                  className="rp-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="rp-grp">
              <label className="rp-lbl" htmlFor="password">Password</label>
              <div className="rp-wrap">
                <i className="fa fa-lock rp-ico"></i>
                <input
                  id="password"
                  className="rp-input"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="rp-row">
              <label className="rp-checkbox">
                <input type="checkbox" />
                Remember me
              </label>

              <Link to="/forgot-password" className="rp-forgot">
                Forgot Password?
              </Link>
            </div>

            {/* CAPTCHA - EXACT same as Register Page */}
            <div className="rp-captcha" onClick={handleCaptcha} role="button" tabIndex={0}>
              <div className="rp-cap-l">
                <div className={`rp-cap-box${captchaChecked ? ' on' : ''}`}></div>
                {captchaLoading
                  ? <span className="rp-cap-txt spin-mode"><div className="rp-spin"></div> Verifying...</span>
                  : <span className="rp-cap-txt">{captchaChecked ? 'Verified ✓' : "I'm not a robot"}</span>
                }
              </div>
              <div className="rp-cap-r">
                <i className="fa fa-shield-alt" style={{ color: '#4285f4', fontSize: '1.15rem' }}></i>
                <div className="rp-cap-note">reCAPTCHA<br />Privacy · Terms</div>
              </div>
            </div>

            {/* Terms - EXACT same as Register Page */}
            <label className="rp-terms">
              <input type="checkbox" required />
              <span>I agree to the <Link to="/terms">Terms &amp; Conditions</Link> and <Link to="/privacy">Privacy Policy</Link></span>
            </label>

            {/* Submit Button - EXACT same as Register Page */}
            <button type="submit" className="rp-submit" disabled={loading}>
              {loading
                ? <><div className="rp-submit-spin"></div> Signing in...</>
                : <><i className="fa fa-sign-in-alt"></i> Sign In</>
              }
            </button>
          </form>

          {/* Sign Up Link - EXACT same as Register Page */}
          <p className="rp-link">
            Don't have an account? <Link to="/register">Sign up here</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginForm;