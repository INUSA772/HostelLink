import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { handleApiError } from '../../utils/helpers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy:#0d1b3e; --blue:#1a3fa4; --orange:#e8501a;
    --text-dark:#111827; --text-mid:#4b5563; --card-radius:14px;
    --green:#16a34a; --red:#dc2626;
  }
  html,body,#root{height:100%;width:100%;overflow:hidden;font-family:'Manrope',sans-serif;}

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

  .rp-main{position:fixed;top:60px;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background:#f4f6fb;overflow-y:auto;padding:1rem 0;}
  .rp-card{background:#fff;border-radius:var(--card-radius);box-shadow:0 8px 40px rgba(13,27,62,0.12);padding:1.6rem 1.7rem 1.4rem;width:420px;max-width:90%;max-height:90vh;overflow-y:auto;}
  .rp-card-hdr{text-align:center;margin-bottom:1.1rem;}
  .rp-card-hdr h2{font-size:1.28rem;font-weight:800;color:var(--navy);margin-bottom:0.15rem;}
  .rp-card-hdr p{color:var(--text-mid);font-size:0.75rem;}
  .rp-line{width:38px;height:3px;background:var(--orange);border-radius:2px;margin:0.45rem auto 0;}

  .rp-role-lbl{display:block;font-size:0.62rem;font-weight:700;color:var(--text-mid);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.28rem;}
  .rp-role-row{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:0.75rem;}
  .rp-role-opt{position:relative;}
  .rp-role-opt input{position:absolute;opacity:0;width:0;height:0;}
  .rp-role-btn{display:flex;align-items:center;gap:0.4rem;padding:0.46rem 0.75rem;border:1.5px solid #e5e7eb;border-radius:7px;cursor:pointer;font-size:0.78rem;font-weight:600;color:var(--text-mid);background:#fafafa;transition:all 0.18s;user-select:none;font-family:'Manrope',sans-serif;}
  .rp-role-btn:hover{border-color:var(--blue);color:var(--blue);}
  .rp-role-opt input:checked+.rp-role-btn{border-color:var(--orange);color:var(--orange);background:#fff5f2;}

  .rp-sec{font-size:0.6rem;font-weight:700;color:var(--orange);text-transform:uppercase;letter-spacing:0.9px;margin:0.65rem 0 0.5rem;display:flex;align-items:center;gap:0.4rem;}
  .rp-sec::after{content:'';flex:1;height:1px;background:#ececec;}
  .rp-row{display:grid;grid-template-columns:1fr 1fr;gap:0.55rem;}
  .rp-grp{margin-bottom:0.55rem;}
  .rp-lbl{display:block;font-size:0.6rem;font-weight:700;color:var(--text-mid);text-transform:uppercase;letter-spacing:0.4px;margin-bottom:0.22rem;}
  .rp-wrap{position:relative;display:flex;align-items:center;}
  .rp-ico{position:absolute;left:0.68rem;color:var(--blue);font-size:0.68rem;pointer-events:none;}
  .rp-input{width:100%;border:1.5px solid #e5e7eb;border-radius:6px;padding:0.44rem 0.65rem 0.44rem 1.9rem;font-size:0.78rem;font-family:'Manrope',sans-serif;color:var(--text-dark);font-weight:500;background:#fafafa;outline:none;transition:border-color 0.18s,box-shadow 0.18s,background 0.18s;}
  .rp-input:focus{border-color:var(--blue);background:#fff;box-shadow:0 0 0 3px rgba(26,63,164,0.07);}
  .rp-input::placeholder{color:#c0c6d0;font-weight:400;}

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
  .rp-login-link{text-align:center;margin-top:0.8rem;font-size:0.76rem;color:var(--text-mid);}
  .rp-login-link a{color:var(--orange);font-weight:700;text-decoration:none;}
  .rp-login-link a:hover{text-decoration:underline;}

  /* OTP SCREEN */
  .otp-wrap{text-align:center;padding:0.5rem 0;}
  .otp-phone-badge{display:inline-flex;align-items:center;gap:0.5rem;background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:8px;padding:0.5rem 1rem;font-size:0.8rem;font-weight:700;color:#1d4ed8;margin-bottom:1.2rem;}
  .otp-inputs{display:flex;gap:0.5rem;justify-content:center;margin-bottom:1rem;}
  .otp-input{width:46px;height:52px;border:2px solid #e5e7eb;border-radius:8px;text-align:center;font-size:1.3rem;font-weight:800;font-family:'Manrope',sans-serif;color:var(--navy);outline:none;transition:all 0.18s;background:#fafafa;}
  .otp-input:focus{border-color:var(--orange);background:#fff;box-shadow:0 0 0 3px rgba(232,80,26,0.1);}
  .otp-input.filled{border-color:var(--green);background:#f0fdf4;}
  .otp-timer{font-size:0.75rem;color:var(--text-mid);font-weight:600;margin-bottom:0.75rem;}
  .otp-timer span{color:var(--orange);font-weight:800;}
  .otp-resend{background:transparent;border:none;color:var(--blue);font-size:0.78rem;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif;padding:0.3rem;}
  .otp-resend:disabled{color:#9ca3af;cursor:not-allowed;}
  .otp-resend:hover:not(:disabled){text-decoration:underline;}
  .otp-error{background:#fef2f2;border:1.5px solid #fca5a5;border-radius:8px;padding:0.65rem 0.8rem;font-size:0.78rem;color:var(--red);font-weight:600;margin-bottom:0.75rem;display:flex;align-items:center;gap:0.4rem;}
  .otp-success{background:#f0fdf4;border:1.5px solid #86efac;border-radius:8px;padding:0.65rem 0.8rem;font-size:0.78rem;color:var(--green);font-weight:600;margin-bottom:0.75rem;display:flex;align-items:center;gap:0.4rem;}
  .otp-info{background:#fffbeb;border:1.5px solid #fcd34d;border-radius:8px;padding:0.65rem 0.8rem;font-size:0.75rem;color:#92400e;font-weight:600;margin-bottom:1rem;line-height:1.5;}

  @media(max-width:768px){
    .rp-bar{padding:0 1rem;}
    .rp-bar-brand{display:none;}
    .rp-row{grid-template-columns:1fr;}
    .rp-card{max-height:85vh;}
    .otp-input{width:40px;height:46px;font-size:1.1rem;}
  }
`;

// ── OTP VERIFICATION SCREEN ───────────────────────────────────────────────
const OtpScreen = ({ userId, phone, onSuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    // Auto-focus next input
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
    if (otpString.length !== 6) { setError('Please enter the complete 6-digit code.'); return; }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp: otpString })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Phone verified! Redirecting...');
        setTimeout(() => onSuccess(data), 1000);
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
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
        toast.success('New code sent!');
      } else {
        setError(data.message || 'Could not resend. Try again.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="otp-wrap">
      <div style={{fontSize:'2.5rem',marginBottom:'0.75rem'}}>📱</div>
      <div className="rp-card-hdr">
        <h2>Verify Your Phone</h2>
        <p>We sent a 6-digit code to your phone</p>
        <div className="rp-line"></div>
      </div>

      <div className="otp-phone-badge">
        <i className="fa fa-phone" /> {phone}
      </div>

      <div className="otp-info">
        ⚠️ Using <strong>Sandbox mode</strong> — check your Africa's Talking simulator at <strong>account.africastalking.com</strong> → Launch Simulator to see the OTP code.
      </div>

      {error && <div className="otp-error"><i className="fa fa-exclamation-circle" /> {error}</div>}
      {success && <div className="otp-success"><i className="fa fa-check-circle" /> {success}</div>}

      <div className="otp-inputs" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => inputRefs.current[i] = el}
            className={`otp-input${digit ? ' filled' : ''}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            autoFocus={i === 0}
          />
        ))}
      </div>

      <div className="otp-timer">
        {timeLeft > 0
          ? <>Code expires in <span>{formatTime(timeLeft)}</span></>
          : <span style={{color:'var(--red)'}}>Code expired — request a new one</span>
        }
      </div>

      <button className="rp-submit" onClick={handleVerify} disabled={loading || otp.join('').length !== 6}>
        {loading
          ? <><div className="rp-submit-spin" /> Verifying...</>
          : <><i className="fa fa-check" /> Verify & Complete Registration</>}
      </button>

      <div style={{marginTop:'0.75rem',textAlign:'center'}}>
        <span style={{fontSize:'0.75rem',color:'var(--text-mid)'}}>Didn't receive the code? </span>
        <button className="otp-resend" onClick={handleResend} disabled={resending || timeLeft > 540}>
          {resending ? 'Sending...' : 'Resend Code'}
        </button>
      </div>
    </div>
  );
};

// ── MAIN REGISTER FORM ────────────────────────────────────────────────────
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName:'', lastName:'', email:'', phone:'',
    password:'', confirmPassword:'', role:'student', studentId:''
  });
  const [loading, setLoading] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpUserId, setOtpUserId] = useState(null);
  const { register } = useAuth();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaChecked) { toast.error('Please verify you are not a robot!'); return; }
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match!'); return; }
    if (formData.role === 'student' && !formData.studentId) { toast.error('Student ID is required!'); return; }

    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || 'Registration failed.');
        return;
      }

      // Owner — show OTP screen
      if (data.requiresOtp) {
        setOtpUserId(data.userId);
        setShowOtp(true);
        toast.info('Verification code sent to your phone!');
        return;
      }

      // Student — registered immediately
      toast.success('Registration successful! Please login.');
      setTimeout(() => navigate('/login'), 500);

    } catch (error) {
      toast.error('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSuccess = (data) => {
    toast.success('Phone verified! Registration complete.');
    setTimeout(() => navigate('/login'), 500);
  };

  const Nav = () => (
    <nav className="rp-bar">
      <Link to="/" className="rp-bar-logo">
        <div className="rp-bar-logo-img"><img src="/PezaHostelLogo.png" alt="PezaHostel" /></div>
        <div className="rp-bar-brand"><span>OFF-CAMPUS ACCOMMODATION</span></div>
      </Link>
      <div className="rp-bar-actions">
        <Link to="/login" className="rp-bar-login"><i className="fa fa-sign-in-alt"></i> Login</Link>
      </div>
    </nav>
  );

  // ── OTP SCREEN ────────────────────────────────────────────────────────
  if (showOtp) return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <Nav />
      <div className="rp-main">
        <div className="rp-card">
          <OtpScreen
            userId={otpUserId}
            phone={formData.phone}
            onSuccess={handleOtpSuccess}
          />
          <button
            onClick={() => setShowOtp(false)}
            style={{width:'100%',padding:'0.55rem',background:'transparent',border:'1.5px solid #e5e7eb',borderRadius:'7px',cursor:'pointer',color:'var(--text-mid)',fontSize:'0.78rem',fontWeight:600,marginTop:'0.5rem',fontFamily:'Manrope,sans-serif'}}
          >
            <i className="fa fa-arrow-left" /> Back to Form
          </button>
        </div>
      </div>
    </>
  );

  // ── REGISTRATION FORM ─────────────────────────────────────────────────
  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <Nav />
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
                <input type="radio" id="rs" name="role" value="student" checked={formData.role==='student'} onChange={handleChange} />
                <label className="rp-role-btn" htmlFor="rs"><i className="fa fa-user-graduate"></i> Student</label>
              </div>
              <div className="rp-role-opt">
                <input type="radio" id="ro" name="role" value="owner" checked={formData.role==='owner'} onChange={handleChange} />
                <label className="rp-role-btn" htmlFor="ro"><i className="fa fa-building"></i> Hostel Owner</label>
              </div>
            </div>

            {formData.role === 'owner' && (
              <div style={{background:'#fffbeb',border:'1.5px solid #fcd34d',borderRadius:'8px',padding:'0.65rem 0.8rem',fontSize:'0.75rem',color:'#92400e',fontWeight:600,marginBottom:'0.75rem',lineHeight:1.5}}>
                <i className="fa fa-shield-alt" style={{marginRight:'0.4rem'}} />
                As a hostel owner, your phone number will be verified via SMS to protect students from fraud.
              </div>
            )}

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
                <input id="ph" className="rp-input" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. 0881234567" required />
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

            <div className="rp-captcha" onClick={handleCaptcha} role="button" tabIndex={0}>
              <div className="rp-cap-l">
                <div className={`rp-cap-box${captchaChecked?' on':''}`}></div>
                {captchaLoading
                  ? <span className="rp-cap-txt spin-mode"><div className="rp-spin"></div> Verifying...</span>
                  : <span className="rp-cap-txt">{captchaChecked ? 'Verified ✓' : "I'm not a robot"}</span>}
              </div>
              <div className="rp-cap-r">
                <i className="fa fa-shield-alt" style={{color:'#4285f4',fontSize:'1.15rem'}}></i>
                <div className="rp-cap-note">reCAPTCHA<br />Privacy · Terms</div>
              </div>
            </div>

            <label className="rp-terms">
              <input type="checkbox" required />
              <span>I agree to the <Link to="/terms">Terms &amp; Conditions</Link> and <Link to="/privacy">Privacy Policy</Link></span>
            </label>

            <button type="submit" className="rp-submit" disabled={loading}>
              {loading
                ? <><div className="rp-submit-spin"></div> {formData.role==='owner' ? 'Sending OTP...' : 'Creating Account...'}</>
                : <><i className="fa fa-user-plus"></i> {formData.role==='owner' ? 'Continue & Verify Phone' : 'Create Account'}</>}
            </button>
          </form>

          <p className="rp-login-link">Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;