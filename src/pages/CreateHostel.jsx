import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHostel } from '../context/HostelContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaHome, FaMapMarkerAlt, FaCheckCircle, FaPlus, FaTrash, FaCamera, FaTimes, FaWhatsapp, FaArrowLeft, FaArrowRight, FaRocket } from 'react-icons/fa';
import ImageUpload from '../components/common/ImageUpload';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/* ─── Constants ─── */
const MALAWI_DISTRICTS = {
  'Northern Region':  ['Chitipa','Karonga','Likoma','Mzimba','Nkhata Bay','Rumphi'],
  'Central Region':   ['Dedza','Dowa','Kasungu','Lilongwe','Mchinji','Nkhotakota','Ntcheu','Ntchisi','Salima'],
  'Southern Region':  ['Balaka','Blantyre','Chikwawa','Chiradzulu','Machinga','Mangochi','Mulanje','Mwanza','Neno','Nsanje','Phalombe','Thyolo','Zomba'],
};

const PROPERTY_TYPES = [
  { value: 'House',            icon: 'fa fa-home'       },
  { value: 'Flat/Apartment',   icon: 'fa fa-building'   },
  { value: 'Single Room',      icon: 'fa fa-bed'        },
  { value: 'Self-Contained',   icon: 'fa fa-door-closed'},
  { value: 'Plot of Land',     icon: 'fa fa-seedling'   },
  { value: 'Commercial Space', icon: 'fa fa-store'      },
];

const AMENITIES = [
  'Water 24/7','WiFi','Electricity (ESCOM)','Solar Power',
  'CCTV Security','Security Guard','Parking','Garden',
  'Borehole Water','Flush Toilet','Bathroom','Kitchen',
  'Living Room','Dining Room','Store Room','Servant Quarters',
  'Fence/Wall','Gate','Tiled Floors','Ceiling','Shops',
];

const CLOUDINARY_URL    = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const uploadImg = async (file) => {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_PRESET);
  const r = await fetch(CLOUDINARY_URL, { method: 'POST', body: fd });
  return (await r.json()).secure_url;
};

export const waLink = (num) => {
  const clean = (num || '').replace(/\D/g, '');
  const intl  = clean.startsWith('0') ? '265' + clean.slice(1) : clean;
  return `https://wa.me/${intl}`;
};

/* ─── Styles ─── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Nunito+Sans:wght@400;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:        #0f1923;
    --navy-mid:    #1a2e3d;
    --amber:       #f5a623;
    --amber-light: #fef3d8;
    --amber-dark:  #d4870a;
    --white:       #ffffff;
    --off-white:   #f7f8fa;
    --light-gray:  #f0f2f5;
    --border:      #e8eaed;
    --mid:         #6b7280;
    --dark:        #111827;
    --wa-green:    #25D366;
    --wa-dark:     #1da851;
    --success:     #059669;
    --success-pale:#ecfdf5;
    --danger:      #dc2626;
    --radius:      12px;
    --radius-lg:   16px;
    --font:        'Plus Jakarta Sans', 'Nunito Sans', sans-serif;
    --shadow-sm:   0 1px 6px rgba(0,0,0,0.06);
    --shadow-md:   0 4px 18px rgba(15,25,35,0.10);
    --transition:  all 0.2s ease;
  }

  html, body { font-family: var(--font); overflow-x: hidden; background: var(--off-white); color: var(--dark); }
  a { text-decoration: none; color: inherit; }
  button { font-family: var(--font); cursor: pointer; }

  /* ── TOPBAR ── */
  .cp-bar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 500;
    height: 60px; display: flex; align-items: center; justify-content: space-between;
    padding: 0 1.5rem; background: var(--navy);
    box-shadow: 0 2px 16px rgba(15,25,35,0.3);
  }
  .cp-logo { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; }
  .cp-logo-icon {
    width: 34px; height: 34px; border-radius: 8px; overflow: hidden;
    border: 2px solid var(--amber); background: white; flex-shrink: 0;
  }
  .cp-logo-icon img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .cp-logo-name { font-size: 1rem; font-weight: 800; color: white; letter-spacing: -0.3px; }
  .cp-back-btn {
    display: flex; align-items: center; gap: 0.45rem;
    background: rgba(255,255,255,0.09); border: 1.5px solid rgba(255,255,255,0.15);
    padding: 0.42rem 1rem; border-radius: 8px;
    font-weight: 700; color: rgba(255,255,255,0.82); font-size: 0.83rem;
    cursor: pointer; transition: var(--transition); text-decoration: none;
  }
  .cp-back-btn:hover { background: rgba(255,255,255,0.16); color: white; }

  /* ── PAGE ── */
  .cp-main { margin-top: 60px; min-height: calc(100vh - 60px); background: var(--off-white); padding: 2rem 1rem 5rem; }
  .cp-container { max-width: 780px; margin: 0 auto; }

  /* ── PAGE HEADER ── */
  .cp-page-hdr { text-align: center; margin-bottom: 2rem; }
  .cp-page-hdr-badge {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase;
    color: var(--amber-dark); background: var(--amber-light);
    padding: 4px 12px; border-radius: 6px; margin-bottom: 0.75rem;
  }
  .cp-page-hdr h1 { font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 900; color: var(--navy); letter-spacing: -0.5px; }
  .cp-page-hdr p  { color: var(--mid); font-size: 0.88rem; margin-top: 0.35rem; }

  /* ── PROGRESS ── */
  .cp-progress { display: flex; justify-content: space-between; margin-bottom: 2rem; position: relative; }
  .cp-prog-line { position: absolute; top: 17px; left: 0; right: 0; height: 3px; background: var(--border); z-index: 0; border-radius: 2px; }
  .cp-prog-fill { height: 100%; background: var(--amber); transition: width 0.35s ease; border-radius: 2px; }
  .cp-step { flex: 1; text-align: center; position: relative; z-index: 1; }
  .cp-step-circle {
    width: 34px; height: 34px; border-radius: 50%; background: var(--border);
    color: var(--mid); display: flex; align-items: center; justify-content: center;
    margin: 0 auto 0.4rem; font-weight: 800; font-size: 0.8rem; transition: all 0.25s;
    border: 2px solid var(--border);
  }
  .cp-step-circle.active    { background: var(--navy); color: white; border-color: var(--navy); box-shadow: 0 0 0 3px var(--amber-light); }
  .cp-step-circle.completed { background: var(--amber); color: var(--navy); border-color: var(--amber); }
  .cp-step-lbl { font-size: 0.68rem; color: var(--mid); font-weight: 600; transition: color 0.25s; }
  .cp-step-lbl.active    { color: var(--navy); font-weight: 800; }
  .cp-step-lbl.completed { color: var(--amber-dark); }

  /* ── CARD ── */
  .cp-card {
    background: white; border-radius: var(--radius-lg);
    border: 1.5px solid var(--border);
    box-shadow: var(--shadow-md); padding: 2rem; width: 100%;
  }
  .cp-card-title {
    font-size: 1.05rem; font-weight: 900; color: var(--navy);
    margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;
    padding-bottom: 1rem; border-bottom: 1.5px solid var(--border);
  }
  .cp-card-title-icon {
    width: 32px; height: 32px; border-radius: 8px; background: var(--amber-light);
    color: var(--amber-dark); display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem; flex-shrink: 0;
  }

  /* ── FORM FIELDS ── */
  .cp-grp { margin-bottom: 1.1rem; }
  .cp-lbl {
    display: block; font-size: 0.73rem; font-weight: 800; color: var(--navy);
    text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 0.4rem;
  }
  .cp-req { color: var(--danger); margin-left: 2px; }
  .cp-input, .cp-select, .cp-textarea {
    width: 100%; border: 1.5px solid var(--border); border-radius: var(--radius);
    padding: 0.68rem 0.9rem; font-size: 0.88rem; font-family: var(--font);
    color: var(--dark); background: var(--off-white); outline: none; transition: var(--transition);
    -webkit-appearance: none; appearance: none;
  }
  .cp-input:focus, .cp-select:focus, .cp-textarea:focus {
    border-color: var(--amber); background: white; box-shadow: 0 0 0 3px rgba(245,166,35,0.13);
  }
  .cp-input::placeholder, .cp-textarea::placeholder { font-size: 0.82rem; color: #c4cad4; }
  .cp-textarea { resize: vertical; min-height: 90px; }
  .cp-tip { font-size: 0.7rem; color: var(--mid); margin-top: 0.25rem; line-height: 1.5; }

  /* ── GRID ── */
  .cp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

  /* ── TYPE PILLS ── */
  .cp-type-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 0.6rem; margin-top: 0.4rem; }
  .cp-type-pill {
    padding: 0.7rem 0.6rem; border-radius: var(--radius); border: 1.5px solid var(--border);
    background: var(--off-white); color: var(--mid); cursor: pointer;
    font-size: 0.78rem; font-weight: 600;
    display: flex; align-items: center; justify-content: center; gap: 0.4rem;
    transition: var(--transition); text-align: center; line-height: 1.3;
  }
  .cp-type-pill:hover  { border-color: var(--amber); color: var(--amber-dark); background: var(--amber-light); }
  .cp-type-pill.active { border-color: var(--amber); background: var(--amber-light); color: var(--amber-dark); font-weight: 800; box-shadow: 0 0 0 3px rgba(245,166,35,0.12); }

  /* ── AMENITIES ── */
  .cp-amenities { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 0.55rem; margin-top: 0.5rem; }
  .cp-amenity {
    padding: 0.6rem 0.8rem; border-radius: 9px; border: 1.5px solid var(--border);
    background: var(--off-white); color: var(--dark); cursor: pointer;
    font-size: 0.78rem; font-weight: 500; display: flex; align-items: center; gap: 0.4rem;
    transition: var(--transition);
  }
  .cp-amenity:hover  { border-color: var(--amber); background: var(--amber-light); }
  .cp-amenity.active { border-color: var(--amber); background: var(--amber-light); color: var(--amber-dark); font-weight: 700; }
  .cp-amenity-count {
    margin-top: 0.75rem; padding: 0.6rem 0.9rem;
    background: var(--success-pale); color: var(--success);
    border: 1px solid #6ee7b7;
    border-radius: 9px; text-align: center; font-size: 0.8rem; font-weight: 700;
  }

  /* ── WhatsApp field ── */
  .cp-wa-wrap { position: relative; }
  .cp-wa-ico  { position: absolute; left: 0.8rem; top: 50%; transform: translateY(-50%); color: var(--wa-green); font-size: 1rem; pointer-events: none; }
  .cp-wa-input { padding-left: 2.3rem !important; }
  .cp-wa-input:focus { border-color: var(--wa-green) !important; box-shadow: 0 0 0 3px rgba(37,211,102,0.12) !important; }
  .cp-wa-note { font-size: 0.68rem; color: var(--mid); margin-top: 0.25rem; display: flex; align-items: center; gap: 4px; }
  .cp-wa-note svg { color: var(--wa-green); flex-shrink: 0; }

  /* ── PRICE SYMBOL ── */
  .cp-price-wrap { position: relative; }
  .cp-price-sym { position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); font-weight: 800; color: var(--mid); pointer-events: none; font-size: 0.85rem; }
  .cp-price-wrap .cp-input { padding-left: 2.8rem; }

  /* ── NAV BUTTONS ── */
  .cp-nav {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: 1.75rem; padding-top: 1.25rem; border-top: 1.5px solid var(--border);
    gap: 0.75rem;
  }
  .cp-btn-back {
    background: white; border: 1.5px solid var(--border); color: var(--navy);
    padding: 0.65rem 1.4rem; border-radius: var(--radius);
    font-weight: 700; font-size: 0.86rem; cursor: pointer; transition: var(--transition);
    display: flex; align-items: center; gap: 0.45rem;
  }
  .cp-btn-back:hover { border-color: var(--navy); background: var(--light-gray); }
  .cp-btn-next {
    background: var(--amber); border: none; color: var(--navy);
    padding: 0.68rem 1.6rem; border-radius: var(--radius);
    font-weight: 800; font-size: 0.88rem; cursor: pointer; transition: var(--transition);
    display: flex; align-items: center; gap: 0.5rem; margin-left: auto;
    box-shadow: 0 4px 14px rgba(245,166,35,0.35);
  }
  .cp-btn-next:hover:not(:disabled) { background: var(--amber-dark); color: white; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(245,166,35,0.4); }
  .cp-btn-next:disabled { opacity: 0.55; cursor: not-allowed; transform: none; box-shadow: none; }
  .cp-spinner {
    width: 14px; height: 14px; border: 2px solid rgba(15,25,35,0.2);
    border-top-color: var(--navy); border-radius: 50%; animation: cpspin 0.7s linear infinite; flex-shrink: 0;
  }
  @keyframes cpspin { to { transform: rotate(360deg); } }

  /* ── RESPONSIVE ── */
  @media (max-width: 640px) {
    .cp-grid-2 { grid-template-columns: 1fr; }
    .cp-bar { padding: 0 1rem; }
    .cp-main { padding: 1.25rem 0.75rem 4rem; }
    .cp-card { padding: 1.25rem; }
    .cp-step-lbl { font-size: 0.6rem; }
    .cp-logo-name { display: none; }
    .cp-type-grid { grid-template-columns: repeat(2, 1fr); }
    .cp-amenities { grid-template-columns: 1fr 1fr; }
  }
`;

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const CreateProperty = () => {
  const navigate = useNavigate();
  const { createHostel, loading } = useHostel();
  const { user } = useAuth();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    /* Step 1 — basics */
    name:         '',
    description:  '',
    propertyType: '',
    listingType:  'For Rent',
    district:     '',
    address:      '',
    /* Step 2 — pricing & contact */
    price:         '',
    contactPhone:  user?.phone || '',
    whatsapp:      user?.whatsapp || user?.phone || '',
    sameAsContact: true,
    /* Step 3 — amenities & photos */
    amenities: [],
    images:    [],
  });

  /* Keep whatsapp in sync when sameAsContact is on */
  useEffect(() => {
    if (form.sameAsContact) setForm(p => ({ ...p, whatsapp: p.contactPhone }));
  }, [form.contactPhone, form.sameAsContact]);

  const set = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'sameAsContact') {
      setForm(p => ({ ...p, sameAsContact: checked, whatsapp: checked ? p.contactPhone : '' }));
      return;
    }
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleAmenity = (a) => {
    setForm(p => ({
      ...p,
      amenities: p.amenities.includes(a)
        ? p.amenities.filter(x => x !== a)
        : [...p.amenities, a],
    }));
  };

  /* ── Validation ── */
  const v1 = () => {
    if (!form.name || !form.description || !form.propertyType || !form.district || !form.address) {
      toast.error('Please fill in all required fields'); return false;
    }
    if (form.name.length < 5)         { toast.error('Property name must be at least 5 characters'); return false; }
    if (form.description.length < 20) { toast.error('Description must be at least 20 characters'); return false; }
    return true;
  };

  const v2 = () => {
    if (!form.price || !form.contactPhone) { toast.error('Please enter price and contact phone'); return false; }
    if (Number(form.price) <= 0)           { toast.error('Price must be greater than 0'); return false; }
    const phoneRgx = /^(?:\+265|0)(?:88|99|98|66)\d{7}$/;
    if (!phoneRgx.test(form.contactPhone)) { toast.error('Enter a valid Malawian phone number'); return false; }
    return true;
  };

  const v3 = () => {
    if (form.amenities.length === 0) { toast.error('Please select at least one amenity'); return false; }
    return true;
  };

  const next = (e) => {
    e.preventDefault();
    if (step === 1 && v1()) setStep(2);
    else if (step === 2 && v2()) setStep(3);
  };

  const back = (e) => { e.preventDefault(); setStep(s => s - 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!v3()) return;
    try {
      const payload = {
        ...form,
        price:    Number(form.price),
        whatsapp: form.sameAsContact ? form.contactPhone : form.whatsapp,
        location: { formattedAddress: `${form.address}, ${form.district}` },
      };
      await createHostel(payload);
      toast.success('🎉 Property listed successfully!');
      navigate('/landlord-dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Failed to publish property');
    }
  };

  const STEPS    = ['Property Info', 'Price & Contact', 'Amenities & Photos'];
  const progress = `${((step - 1) / (STEPS.length - 1)) * 100}%`;

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      {/* ── TOPBAR ── */}
      <nav className="cp-bar">
        <Link to="/" className="cp-logo">
          <div className="cp-logo-icon"><img src="/PEZ.png" alt="PezaNyumba" /></div>
          <span className="cp-logo-name">PezaNyumba</span>
        </Link>
        <Link to="/landlord-dashboard" className="cp-back-btn">
          <FaArrowLeft /> Dashboard
        </Link>
      </nav>

      <div className="cp-main">
        <div className="cp-container">

          {/* ── PAGE HEADER ── */}
          <div className="cp-page-hdr">
            <div className="cp-page-hdr-badge">🏠 New Listing</div>
            <h1>List Your Property</h1>
            <p>Your listing goes live instantly — tenants across Malawi will see it right away</p>
          </div>

          {/* ── PROGRESS ── */}
          <div className="cp-progress">
            <div className="cp-prog-line"><div className="cp-prog-fill" style={{ width: progress }} /></div>
            {STEPS.map((lbl, i) => (
              <div key={i} className="cp-step">
                <div className={`cp-step-circle ${step > i + 1 ? 'completed' : step === i + 1 ? 'active' : ''}`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <p className={`cp-step-lbl ${step > i + 1 ? 'completed' : step === i + 1 ? 'active' : ''}`}>{lbl}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="cp-card">

              {/* ════ STEP 1 — Property Info ════ */}
              {step === 1 && (
                <>
                  <div className="cp-card-title">
                    <div className="cp-card-title-icon">📋</div>
                    Property Information
                  </div>

                  <div className="cp-grp">
                    <label className="cp-lbl">Property Name / Title <span className="cp-req">*</span></label>
                    <input className="cp-input" name="name" value={form.name} onChange={handleChange}
                      placeholder="e.g., Spacious 3-bedroom house in Area 25" />
                  </div>

                  <div className="cp-grp">
                    <label className="cp-lbl">Description <span className="cp-req">*</span></label>
                    <textarea className="cp-textarea" name="description" value={form.description} onChange={handleChange}
                      placeholder="Describe the property — size, condition, surroundings, what makes it special…" />
                  </div>

                  {/* Property Type */}
                  <div className="cp-grp">
                    <label className="cp-lbl">Property Type <span className="cp-req">*</span></label>
                    <div className="cp-type-grid">
                      {PROPERTY_TYPES.map(({ value, icon }) => (
                        <button key={value} type="button"
                          className={`cp-type-pill${form.propertyType === value ? ' active' : ''}`}
                          onClick={() => set('propertyType', value)}>
                          <i className={icon} /> {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Listing type */}
                  <div className="cp-grp">
                    <label className="cp-lbl">Listing Type <span className="cp-req">*</span></label>
                    <div className="cp-type-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                      {['For Rent', 'For Sale'].map(t => (
                        <button key={t} type="button"
                          className={`cp-type-pill${form.listingType === t ? ' active' : ''}`}
                          onClick={() => set('listingType', t)}>
                          <i className={t === 'For Rent' ? 'fa fa-key' : 'fa fa-tag'} /> {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* District + Address */}
                  <div className="cp-grid-2">
                    <div className="cp-grp">
                      <label className="cp-lbl">District <span className="cp-req">*</span></label>
                      <select className="cp-select" name="district" value={form.district} onChange={handleChange}>
                        <option value="">Select district…</option>
                        {Object.entries(MALAWI_DISTRICTS).map(([region, districts]) => (
                          <optgroup key={region} label={region}>
                            {districts.map(d => <option key={d} value={d}>{d}</option>)}
                          </optgroup>
                        ))}
                      </select>
                      <p className="cp-tip">Your listing will appear under this district</p>
                    </div>
                    <div className="cp-grp">
                      <label className="cp-lbl">Specific Address / Area <span className="cp-req">*</span></label>
                      <input className="cp-input" name="address" value={form.address} onChange={handleChange}
                        placeholder="e.g., Area 25, Chinsapo" />
                    </div>
                  </div>
                </>
              )}

              {/* ════ STEP 2 — Price & Contact ════ */}
              {step === 2 && (
                <>
                  <div className="cp-card-title">
                    <div className="cp-card-title-icon">💰</div>
                    Price &amp; Contact
                  </div>

                  <div className="cp-grp">
                    <label className="cp-lbl">
                      {form.listingType === 'For Rent' ? 'Monthly Rent (MWK)' : 'Sale Price (MWK)'}
                      <span className="cp-req">*</span>
                    </label>
                    <div className="cp-price-wrap">
                      <span className="cp-price-sym">MK</span>
                      <input className="cp-input" type="number" name="price" value={form.price}
                        onChange={handleChange} placeholder="e.g., 120000" min="1" />
                    </div>
                    <p className="cp-tip">Price in Malawian Kwacha</p>
                  </div>

                  {/* Contact Phone */}
                  <div className="cp-grp">
                    <label className="cp-lbl">Contact Phone Number <span className="cp-req">*</span></label>
                    <input className="cp-input" type="tel" name="contactPhone" value={form.contactPhone}
                      onChange={handleChange} placeholder="0888123456 or +265888123456" />
                    <p className="cp-tip">Tenants will call this number to inquire</p>
                  </div>

                  {/* WhatsApp */}
                  <div className="cp-grp">
                    <label className="cp-lbl" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>WhatsApp Number <span className="cp-req">*</span></span>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.7rem', fontWeight: 700, textTransform: 'none', letterSpacing: 0, cursor: 'pointer', color: 'var(--mid)' }}>
                        <input type="checkbox" name="sameAsContact" checked={form.sameAsContact} onChange={handleChange}
                          style={{ width: 13, height: 13, accentColor: '#25D366', cursor: 'pointer' }} />
                        Same as phone
                      </label>
                    </label>
                    <div className="cp-wa-wrap">
                      <FaWhatsapp style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#25D366', fontSize: '1rem', pointerEvents: 'none' }} />
                      <input className="cp-input cp-wa-input" type="tel" name="whatsapp"
                        value={form.sameAsContact ? form.contactPhone : form.whatsapp}
                        onChange={handleChange}
                        placeholder="0888123456"
                        disabled={form.sameAsContact}
                        style={{ paddingLeft: '2.3rem', opacity: form.sameAsContact ? 0.65 : 1 }} />
                    </div>
                    <div className="cp-wa-note">
                      <FaWhatsapp /> Tenants tap a button to WhatsApp you directly — make sure this number is active
                    </div>
                  </div>
                </>
              )}

              {/* ════ STEP 3 — Amenities & Photos ════ */}
              {step === 3 && (
                <>
                  <div className="cp-card-title">
                    <div className="cp-card-title-icon">✨</div>
                    Amenities &amp; Photos
                  </div>

                  <div className="cp-grp">
                    <label className="cp-lbl">Amenities <span className="cp-req">*</span></label>
                    <div className="cp-amenities">
                      {AMENITIES.map(a => (
                        <button key={a} type="button"
                          className={`cp-amenity${form.amenities.includes(a) ? ' active' : ''}`}
                          onClick={() => toggleAmenity(a)}>
                          {form.amenities.includes(a) && <FaCheckCircle style={{ fontSize: '0.7rem', flexShrink: 0 }} />}
                          {a}
                        </button>
                      ))}
                    </div>
                    {form.amenities.length > 0 && (
                      <div className="cp-amenity-count">
                        ✅ {form.amenities.length} amenit{form.amenities.length === 1 ? 'y' : 'ies'} selected
                      </div>
                    )}
                  </div>

                  <div className="cp-grp" style={{ marginTop: '1.5rem' }}>
                    <label className="cp-lbl">Property Photos</label>
                    <p className="cp-tip" style={{ marginBottom: '0.6rem' }}>Upload clear photos — listings with photos get 3× more inquiries</p>
                    <ImageUpload
                      images={form.images}
                      onImagesChange={imgs => set('images', imgs)}
                      maxImages={12}
                    />
                  </div>
                </>
              )}

              {/* ── Nav buttons ── */}
              <div className="cp-nav">
                {step > 1 && (
                  <button type="button" className="cp-btn-back" onClick={back}>
                    <FaArrowLeft /> Back
                  </button>
                )}
                {step < 3 ? (
                  <button type="button" className="cp-btn-next" onClick={next}>
                    Next <FaArrowRight />
                  </button>
                ) : (
                  <button type="submit" className="cp-btn-next" disabled={loading}>
                    {loading
                      ? <><div className="cp-spinner" /> Publishing…</>
                      : <><FaRocket /> Publish Property</>
                    }
                  </button>
                )}
              </div>

            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateProperty;