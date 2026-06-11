import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { storage } from '../../utils/helpers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const styles = `
  .gpm-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(15,25,35,.7); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 1rem;
  }
  .gpm-card {
    background: #fff; border-radius: 16px;
    box-shadow: 0 24px 60px rgba(0,0,0,.3);
    padding: 1.8rem; width: 380px; max-width: 100%;
    position: relative;
  }
  .gpm-hdr { text-align: center; margin-bottom: 1.2rem; }
  .gpm-hdr h2 { font-size: 1.15rem; font-weight: 800; color: #111827; }
  .gpm-hdr p { font-size: .76rem; color: #6b7280; margin-top: .25rem; line-height: 1.5; }
  .gpm-line { width: 32px; height: 3px; background: #f5a623; border-radius: 2px; margin: .4rem auto 0; }
  .gpm-grp { margin-bottom: .75rem; }
  .gpm-lbl { font-size: .62rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: .4px; display: block; margin-bottom: .2rem; }
  .gpm-wrap { position: relative; display: flex; align-items: center; }
  .gpm-ico { position: absolute; left: .7rem; color: #d4870a; font-size: .78rem; pointer-events: none; }
  .gpm-wa-ico { position: absolute; left: .7rem; color: #25D366; font-size: .88rem; pointer-events: none; }
  .gpm-input {
    width: 100%; border: 1.5px solid #e8eaed; border-radius: 9px;
    padding: .52rem .75rem .52rem 2.1rem;
    font-size: .8rem; color: #111827; font-weight: 500;
    background: #f7f8fa; outline: none; transition: all .18s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .gpm-input:focus { border-color: #f5a623; background: #fff; box-shadow: 0 0 0 3px rgba(245,166,35,.12); }
  .gpm-input::placeholder { font-size: .72rem; color: #c3c8d0; }
  .gpm-wa-same { display: flex; align-items: center; gap: 4px; font-size: .6rem; font-weight: 600; color: #6b7280; cursor: pointer; }
  .gpm-wa-same input { width: 11px; height: 11px; accent-color: #f5a623; cursor: pointer; }
  .gpm-lbl-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: .2rem; }
  .gpm-btn {
    width: 100%; background: #0f1923; color: #fff; border: none;
    cursor: pointer; padding: .65rem 1rem; border-radius: 9px;
    font-size: .82rem; font-weight: 700; margin-top: .5rem;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: background .2s; font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .gpm-btn:hover:not(:disabled) { background: #1a2e3d; }
  .gpm-btn:disabled { opacity: .6; cursor: not-allowed; }
  .gpm-spin { width: 11px; height: 11px; border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; border-radius: 50%; animation: gpmspin .7s linear infinite; }
  @keyframes gpmspin { to { transform: rotate(360deg); } }
  .gpm-skip { width: 100%; background: transparent; border: none; color: #9ca3af; font-size: .72rem; cursor: pointer; margin-top: .5rem; font-family: 'Plus Jakarta Sans', sans-serif; }
  .gpm-skip:hover { color: #6b7280; }
`;

const GooglePhoneModal = ({ user, token, onComplete }) => {
  const [phone, setPhone]           = useState('');
  const [whatsapp, setWhatsapp]     = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [loading, setLoading]       = useState(false);

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    if (sameAsPhone) setWhatsapp(e.target.value);
  };

  const handleSameAsPhone = (e) => {
    setSameAsPhone(e.target.checked);
    if (e.target.checked) setWhatsapp(phone);
  };

  const handleSubmit = async () => {
    const phoneRgx = /^(?:\+265|0)(?:88|99|98|66)\d{7}$/;
    if (!phoneRgx.test(phone)) {
      toast.error('Enter a valid Malawian number (e.g. 0888123456)');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/update-phone`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone, whatsapp: sameAsPhone ? phone : whatsapp }),
      });
      const data = await res.json();
      if (data.success) {
        const updatedUser = { ...user, phone, whatsapp: sameAsPhone ? phone : whatsapp };
        storage.set('user', updatedUser);
        toast.success('Phone number saved!');
        onComplete(updatedUser);
      } else {
        toast.error(data.message || 'Failed to save phone number');
      }
    } catch {
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <div className="gpm-overlay">
        <div className="gpm-card">
          <div className="gpm-hdr">
            <h2>One Last Step 📱</h2>
            <p>Add your phone number so buyers and tenants can contact you via WhatsApp or call.</p>
            <div className="gpm-line" />
          </div>

          <div className="gpm-grp">
            <label className="gpm-lbl">Phone Number</label>
            <div className="gpm-wrap">
              <i className="fa fa-phone gpm-ico" />
              <input className="gpm-input" type="tel" value={phone}
                onChange={handlePhoneChange} placeholder="0888123456" />
            </div>
          </div>

          <div className="gpm-grp">
            <div className="gpm-lbl-row">
              <label className="gpm-lbl" style={{margin:0}}>WhatsApp</label>
              <label className="gpm-wa-same">
                <input type="checkbox" checked={sameAsPhone} onChange={handleSameAsPhone} />
                Same as phone
              </label>
            </div>
            <div className="gpm-wrap">
              <i className="fab fa-whatsapp gpm-wa-ico" />
              <input className="gpm-input" type="tel"
                value={sameAsPhone ? phone : whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                placeholder="0888123456" disabled={sameAsPhone}
                style={{ opacity: sameAsPhone ? 0.7 : 1 }} />
            </div>
          </div>

          <button className="gpm-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? <><div className="gpm-spin" /> Saving…</> : <><i className="fa fa-check" /> Save & Continue</>}
          </button>
          <button className="gpm-skip" onClick={() => onComplete(user)}>
            Skip for now
          </button>
        </div>
      </div>
    </>
  );
};

export default GooglePhoneModal;