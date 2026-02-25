import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { handleApiError } from '../../utils/helpers';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

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

  /* ══════════════════════════════════
     TOPBAR
  ══════════════════════════════════ */
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

  /* ══════════════════════════════════
     MAIN CONTENT - FULLSCREEN CENTERED FORM
  ══════════════════════════════════ */
  .rp-main {
    position: fixed;
    top: 60px; left: 0; right: 0; bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f4f6fb;
    overflow: hidden;
  }

  /* ── FORM CARD ── */
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

  /* role toggle */
  .rp-role-lbl {
    display: block; font-size: 0.62rem; font-weight: 700; color: var(--text-mid);
    text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.28rem;
  }
  .rp-role-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.75rem; }
  .rp-role-opt { position: relative; }
  .rp-role-opt input { position: absolute; opacity: 0; width: 0; height: 0; }
  .rp-role-btn {
    display: flex; align-items: center; gap: 0.4rem;
    padding: 0.46rem 0.75rem; border: 1.5px solid #e5e7eb; border-radius: 7px;
    cursor: pointer; font-size: 0.78rem; font-weight: 600; color: var(--text-mid);
    background: #fafafa; transition: all 0.18s; user-select: none;
    font-family: 'Manrope', sans-serif;
  }
  .rp-role-btn:hover { border-color: var(--blue); color: var(--blue); }
  .rp-role-opt input:checked + .rp-role-btn {
    border-color: var(--orange); color: var(--orange); background: #fff5f2;
  }

  /* section divider */
  .rp-sec {
    font-size: 0.6rem; font-weight: 700; color: var(--orange);
    text-transform: uppercase; letter-spacing: 0.9px;
    margin: 0.65rem 0 0.5rem; display: flex; align-items: center; gap: 0.4rem;
  }
  .rp-sec::after { content: ''; flex: 1; height: 1px; background: #ececec; }

  /* fields */
  .rp-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.55rem; }
  .rp-grp { margin-bottom: 0.55rem; }
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

  /* captcha */
  .rp-captcha {
    border: 1.5px solid #e5e7eb; border-radius: 6px; padding: 0.55rem 0.75rem;
    background: #fafafa; display: flex; align-items: center;
    justify-content: space-between; margin-bottom: 0.55rem;
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

  /* terms */
  .rp-terms {
    display: flex; align-items: flex-start; gap: 0.4rem;
    margin-bottom: 0.75rem; font-size: 0.72rem; color: var(--text-mid);
    line-height: 1.5; cursor: pointer;
  }
  .rp-terms input { width: 12px; height: 12px; margin-top: 2px; cursor: pointer; accent-color: var(--orange); flex-shrink: 0; }
  .rp-terms a { color: var(--blue); font-weight: 600; text-decoration: none; }
  .rp-terms a:hover { color: var(--orange); }

  /* submit */
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

  /* login link */
  .rp-login-link { text-align: center; margin-top: 0.8rem; font-size: 0.76rem; color: var(--text-mid); }
  .rp-login-link a { color: var(--orange); font-weight: 700; text-decoration: none; }
  .rp-login-link a:hover { text-decoration: underline; }

  @media (max-width: 768px) {
    .rp-bar { padding: 0 1rem; }
    .rp-bar-brand { display: none; }
    .rp-row { grid-template-columns: 1fr; }
    .rp-card { max-height: 85vh; }
  }
`;

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '', role: 'student', studentId: ''
  });
  const [loading, setLoading] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const { register, logout } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCaptcha = () => {
    if (captchaChecked || captchaLoading) return;
    setCaptchaLoading(true);
    setTimeout(() => { setCaptchaLoading(false); setCaptchaChecked(true); }, 1200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaChecked) { toast.error('Please verify you are not a robot!'); return; }
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match!'); return; }
    if (formData.role === 'student' && !formData.studentId) { toast.error('Student ID is required!'); return; }
    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;
      await register(dataToSend);
      logout();
      toast.success('Registration successful! Please login to continue.');
      navigate('/login');
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

      {/* ── TOPBAR ── */}
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

      {/* ── MAIN CONTENT - CENTERED FORM ── */}
      <div className="rp-main">
        <div className="rp-card">
          <div className="rp-card-hdr">
            <h2>Create Your Account</h2>
            <p>Fill in your details to get started</p>
            <div className="rp-line"></div>
          </div>

          <form onSubmit={handleSubmit}>
            <span className="rp-role-lbl">I am a</span>
            <div className="rp-role-row">
              <div className="rp-role-opt">
                <input type="radio" id="rs" name="role" value="student" checked={formData.role === 'student'} onChange={handleChange} />
                <label className="rp-role-btn" htmlFor="rs"><i className="fa fa-user-graduate"></i> Student</label>
              </div>
              <div className="rp-role-opt">
                <input type="radio" id="ro" name="role" value="owner" checked={formData.role === 'owner'} onChange={handleChange} />
                <label className="rp-role-btn" htmlFor="ro"><i className="fa fa-building"></i> Hostel Owner</label>
              </div>
            </div>

            <div className="rp-sec"><i className="fa fa-user"></i> Personal Information</div>

            <div className="rp-row">
              <div className="rp-grp">
                <label className="rp-lbl" htmlFor="fn">First Name</label>
                <div className="rp-wrap"><i className="fa fa-user rp-ico"></i>
                  <input id="fn" className="rp-input" type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" required />
                </div>
              </div>
              <div className="rp-grp">
                <label className="rp-lbl" htmlFor="ln">Last Name</label>
                <div className="rp-wrap"><i className="fa fa-user rp-ico"></i>
                  <input id="ln" className="rp-input" type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" required />
                </div>
              </div>
            </div>

            <div className="rp-grp">
              <label className="rp-lbl" htmlFor="em">Email Address</label>
              <div className="rp-wrap"><i className="fa fa-envelope rp-ico"></i>
                <input id="em" className="rp-input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
              </div>
            </div>

            <div className="rp-grp">
              <label className="rp-lbl" htmlFor="ph">Phone Number</label>
              <div className="rp-wrap"><i className="fa fa-phone rp-ico"></i>
                <input id="ph" className="rp-input" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" required />
              </div>
            </div>

            {formData.role === 'student' && (
              <div className="rp-grp">
                <label className="rp-lbl" htmlFor="sid">Student ID</label>
                <div className="rp-wrap"><i className="fa fa-id-card rp-ico"></i>
                  <input id="sid" className="rp-input" type="text" name="studentId" value={formData.studentId} onChange={handleChange} placeholder="Enter student ID" required />
                </div>
              </div>
            )}

            <div className="rp-sec"><i className="fa fa-lock"></i> Security</div>

            <div className="rp-row">
              <div className="rp-grp">
                <label className="rp-lbl" htmlFor="pw">Password</label>
                <div className="rp-wrap"><i className="fa fa-lock rp-ico"></i>
                  <input id="pw" className="rp-input" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create password" required />
                </div>
              </div>
              <div className="rp-grp">
                <label className="rp-lbl" htmlFor="cpw">Confirm</label>
                <div className="rp-wrap"><i className="fa fa-lock rp-ico"></i>
                  <input id="cpw" className="rp-input" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm" required />
                </div>
              </div>
            </div>

            {/* CAPTCHA */}
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

            {/* Terms */}
            <label className="rp-terms">
              <input type="checkbox" required />
              <span>I agree to the <Link to="/terms">Terms &amp; Conditions</Link> and <Link to="/privacy">Privacy Policy</Link></span>
            </label>

            {/* Submit */}
            <button type="submit" className="rp-submit" disabled={loading}>
              {loading
                ? <><div className="rp-submit-spin"></div> Creating Account...</>
                : <><i className="fa fa-user-plus"></i> Create Account</>
              }
            </button>
          </form>

          <p className="rp-login-link">Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;