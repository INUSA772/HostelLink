import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHostel } from '../context/HostelContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaHome, FaMapMarkerAlt, FaDollarSign, FaBed, FaCheckCircle, FaPlus, FaTrash, FaCamera, FaTimes, FaWhatsapp } from 'react-icons/fa';
import ImageUpload from '../components/common/ImageUpload';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/* ─── Constants ─── */
const MALAWI_DISTRICTS = [
  'Lilongwe','Blantyre','Zomba','Mzuzu','Kasungu','Mangochi',
  'Dedza','Salima','Ntcheu','Balaka','Machinga','Chiradzulu',
  'Thyolo','Mulanje','Phalombe','Chikwawa','Nsanje','Neno',
  'Mwanza','Nkhata Bay','Rumphi','Karonga','Chitipa','Mzimba',
  'Dowa','Ntchisi','Mchinji','Likoma',
];

const PROPERTY_TYPES = [
  'House','Flat/Apartment','Single Room','Self-Contained',
  'Plot of Land','Commercial Space','Office Space','Warehouse',
];

const LISTING_TYPES = ['For Rent','For Sale'];

const AMENITIES = [
  'Water 24/7','WiFi','Electricity (ESCOM)','Solar Power',
  'CCTV Security','Security Guard','Parking','Garden',
  'Borehole Water','Flush Toilet','Bathroom','Kitchen',
  'Living Room','Dining Room','Store Room','Servant Quarters',
  'Fence/Wall','Gate','Tiled Floors','Ceiling',
];

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const uploadImg = async (file) => {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_PRESET);
  const r = await fetch(CLOUDINARY_URL, { method: 'POST', body: fd });
  return (await r.json()).secure_url;
};

/* ─── Styles ─── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --teal:        #1a5c52;
    --teal-dark:   #0d4a40;
    --teal-mid:    #2d8a72;
    --teal-light:  #e8f5f2;
    --teal-pale:   #f0faf7;
    --text-dark:   #111827;
    --text-mid:    #4b5563;
    --border:      #e2ede9;
    --gray-bg:     #f4f6f4;
    --radius:      12px;
    --success:     #10b981;
    --error:       #ef4444;
    --wa:          #25D366;
  }
  html, body, #root { height:100%; font-family:'Manrope',sans-serif; overflow-x:hidden; }

  /* NAV */
  .cp-bar {
    position:fixed; top:0; left:0; right:0; z-index:500;
    height:58px; display:flex; align-items:center; justify-content:space-between;
    padding:0 1.5rem; background:#fff;
    border-bottom:1px solid var(--border);
    box-shadow:0 1px 6px rgba(13,74,64,0.07);
  }
  .cp-bar-logo { display:flex; align-items:center; gap:9px; text-decoration:none; }
  .cp-bar-logo-img { width:32px; height:32px; border-radius:50%; overflow:hidden; background:var(--teal-light); }
  .cp-bar-logo-img img { width:100%; height:100%; object-fit:cover; }
  .cp-bar-brand strong { display:block; font-size:0.88rem; font-weight:800; color:#0d4a40; }
  .cp-bar-brand span { font-size:0.56rem; color:#6b7280; }
  .cp-bar-back {
    color:#374151; font-size:0.8rem; font-weight:600;
    border:1.5px solid #d1d5db; padding:0.28rem 0.85rem;
    border-radius:7px; cursor:pointer; text-decoration:none; transition:all 0.18s;
    display:flex; align-items:center; gap:5px;
  }
  .cp-bar-back:hover { border-color:var(--teal); color:var(--teal); }

  /* MAIN SCROLL AREA */
  .cp-main { margin-top:58px; min-height:calc(100vh - 58px); background:var(--gray-bg); padding:2rem 1rem 4rem; }
  .cp-container { max-width:860px; margin:0 auto; }

  /* PAGE HEADER */
  .cp-page-hdr { text-align:center; margin-bottom:1.8rem; }
  .cp-page-hdr h1 { font-size:1.7rem; font-weight:800; color:var(--teal-dark); display:flex; align-items:center; justify-content:center; gap:0.5rem; }
  .cp-page-hdr p  { color:var(--text-mid); font-size:0.88rem; margin-top:0.3rem; }

  /* PROGRESS */
  .cp-progress { display:flex; justify-content:space-between; margin-bottom:1.8rem; position:relative; }
  .cp-prog-line { position:absolute; top:18px; left:0; right:0; height:3px; background:var(--border); z-index:0; }
  .cp-prog-fill { height:100%; background:var(--teal-mid); transition:width 0.35s ease; }
  .cp-step { flex:1; text-align:center; position:relative; z-index:1; }
  .cp-step-circle {
    width:36px; height:36px; border-radius:50%; background:var(--border);
    color:#9ca3af; display:flex; align-items:center; justify-content:center;
    margin:0 auto 0.4rem; font-weight:700; font-size:0.82rem; transition:all 0.3s;
  }
  .cp-step-circle.active    { background:var(--teal); color:#fff; }
  .cp-step-circle.completed { background:var(--success); color:#fff; }
  .cp-step-lbl { font-size:0.72rem; color:#9ca3af; transition:color 0.3s; }
  .cp-step-lbl.active { color:var(--teal); font-weight:700; }

  /* CARD */
  .cp-card { background:#fff; border-radius:14px; box-shadow:0 6px 30px rgba(13,74,64,0.09); padding:1.8rem; width:100%; }
  .cp-card-title { font-size:1.1rem; font-weight:800; color:var(--teal-dark); margin-bottom:1.4rem; display:flex; align-items:center; gap:0.5rem; }
  .cp-card-title svg { color:var(--teal); }

  /* FORM FIELDS */
  .cp-grp { margin-bottom:1rem; }
  .cp-lbl { display:block; font-size:0.62rem; font-weight:700; color:var(--text-mid); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.25rem; }
  .cp-req { color:var(--error); margin-left:2px; }
  .cp-input, .cp-select, .cp-textarea {
    width:100%; border:1.5px solid var(--border); border-radius:9px;
    padding:0.55rem 0.8rem; font-size:0.82rem; font-family:'Manrope',sans-serif;
    color:var(--text-dark); background:#fafafa; outline:none; transition:all 0.18s;
  }
  .cp-input:focus, .cp-select:focus, .cp-textarea:focus {
    border-color:var(--teal); background:#fff; box-shadow:0 0 0 3px rgba(26,92,82,0.09);
  }
  .cp-input::placeholder, .cp-textarea::placeholder { font-size:0.75rem; color:#cbd5e1; }
  .cp-textarea { resize:vertical; min-height:90px; }
  .cp-select { appearance:none; cursor:pointer; }

  /* WhatsApp field */
  .cp-wa-wrap { position:relative; }
  .cp-wa-ico { position:absolute; left:0.75rem; top:50%; transform:translateY(-50%); color:var(--wa); font-size:1rem; pointer-events:none; }
  .cp-wa-input { padding-left:2.2rem !important; }
  .cp-wa-input:focus { border-color:var(--wa) !important; box-shadow:0 0 0 3px rgba(37,211,102,0.10) !important; }
  .cp-wa-note { font-size:0.65rem; color:var(--text-mid); margin-top:0.2rem; display:flex; align-items:center; gap:4px; }
  .cp-wa-note svg { color:var(--wa); flex-shrink:0; }

  /* Grid helpers */
  .cp-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:0.9rem; }
  .cp-grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.9rem; }

  /* Tip text */
  .cp-tip { font-size:0.68rem; color:var(--text-mid); margin-top:0.15rem; }

  /* Type pills */
  .cp-type-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:0.6rem; margin-top:0.4rem; }
  .cp-type-pill {
    padding:0.65rem 0.6rem; border-radius:9px; border:1.5px solid var(--border);
    background:#fff; color:var(--text-mid); cursor:pointer;
    font-size:0.78rem; font-weight:600; font-family:'Manrope',sans-serif;
    display:flex; align-items:center; justify-content:center; gap:0.4rem;
    transition:all 0.18s;
  }
  .cp-type-pill:hover { border-color:var(--teal); color:var(--teal); }
  .cp-type-pill.active { border-color:var(--teal); background:var(--teal-light); color:var(--teal); font-weight:700; }

  /* Amenities */
  .cp-amenities { display:grid; grid-template-columns:repeat(auto-fill,minmax(165px,1fr)); gap:0.6rem; margin-top:0.4rem; }
  .cp-amenity {
    padding:0.6rem 0.75rem; border-radius:8px; border:1.5px solid var(--border);
    background:#fff; color:var(--text-dark); cursor:pointer;
    font-size:0.78rem; font-weight:500; font-family:'Manrope',sans-serif;
    display:flex; align-items:center; gap:0.4rem; transition:all 0.18s;
  }
  .cp-amenity:hover { border-color:var(--teal-mid); }
  .cp-amenity.active { border-color:var(--teal); background:var(--teal-light); color:var(--teal); font-weight:700; }
  .cp-amenity-count {
    margin-top:0.75rem; padding:0.6rem 0.9rem; background:var(--success);
    color:#fff; border-radius:8px; text-align:center; font-size:0.8rem; font-weight:600;
  }

  /* Unit cards */
  .cp-room-card { background:#fafafa; border:1.5px solid var(--border); border-radius:12px; padding:1.1rem; margin-bottom:0.9rem; }
  .cp-room-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.85rem; }
  .cp-room-title { font-size:0.9rem; font-weight:800; color:var(--teal-dark); }
  .cp-room-del { background:#fef2f2; border:1px solid #fecaca; color:#dc2626; border-radius:7px; padding:0.28rem 0.6rem; cursor:pointer; font-size:0.75rem; display:flex; align-items:center; gap:0.3rem; font-family:'Manrope',sans-serif; transition:all 0.18s; }
  .cp-room-del:hover { background:#dc2626; color:#fff; }
  .cp-room-imgs { display:flex; flex-wrap:wrap; gap:0.45rem; margin-top:0.65rem; }
  .cp-room-thumb { width:65px; height:65px; border-radius:8px; object-fit:cover; border:2px solid var(--border); }
  .cp-room-add-img {
    width:65px; height:65px; border-radius:8px; border:2px dashed var(--border);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    cursor:pointer; font-size:0.62rem; color:#9ca3af; gap:0.2rem; transition:all 0.18s; background:#fff;
  }
  .cp-room-add-img:hover { border-color:var(--teal); color:var(--teal); }
  .cp-room-img-wrap { position:relative; }
  .cp-room-rm-img { position:absolute; top:-5px; right:-5px; width:17px; height:17px; background:var(--error); border:none; border-radius:50%; color:#fff; font-size:0.55rem; cursor:pointer; display:flex; align-items:center; justify-content:center; }
  .cp-rooms-summary { background:#eff6ff; border:1.5px solid #bfdbfe; border-radius:8px; padding:0.65rem 0.9rem; margin-bottom:0.85rem; font-size:0.78rem; color:#1d4ed8; font-weight:600; display:flex; align-items:center; gap:0.5rem; }
  .cp-add-room { width:100%; padding:0.8rem; border:2px dashed var(--teal-mid); border-radius:10px; background:var(--teal-pale); color:var(--teal); font-weight:700; font-size:0.85rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.5rem; transition:all 0.2s; font-family:'Manrope',sans-serif; margin-top:0.5rem; }
  .cp-add-room:hover { background:var(--teal); color:#fff; }

  /* Nav buttons */
  .cp-nav { display:flex; justify-content:space-between; margin-top:1.6rem; padding-top:1.2rem; border-top:1px solid var(--border); }
  .cp-btn-back { background:transparent; border:2px solid var(--teal); color:var(--teal); padding:0.58rem 1.4rem; border-radius:8px; font-weight:700; font-size:0.86rem; cursor:pointer; transition:all 0.2s; font-family:'Manrope',sans-serif; }
  .cp-btn-back:hover { background:var(--teal-light); }
  .cp-btn-next { background:var(--teal); border:none; color:#fff; padding:0.58rem 1.6rem; border-radius:8px; font-weight:700; font-size:0.86rem; cursor:pointer; transition:all 0.2s; font-family:'Manrope',sans-serif; display:flex; align-items:center; gap:0.5rem; margin-left:auto; box-shadow:0 3px 12px rgba(26,92,82,0.25); }
  .cp-btn-next:hover:not(:disabled) { background:var(--teal-dark); }
  .cp-btn-next:disabled { opacity:0.6; cursor:not-allowed; }
  .cp-spinner { width:13px; height:13px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:cpspin 0.7s linear infinite; }
  @keyframes cpspin { to { transform:rotate(360deg); } }

  @media(max-width:640px) {
    .cp-grid-2, .cp-grid-3 { grid-template-columns:1fr; }
    .cp-bar { padding:0 1rem; }
    .cp-main { padding:1.2rem 0.7rem 3rem; }
    .cp-card { padding:1.3rem; }
    .cp-step-lbl { font-size:0.6rem; }
  }
`;

/* ─── Helper: WhatsApp link ─── */
export const waLink = (num) => {
  const clean = (num || '').replace(/\D/g, '');
  // Malawi numbers: convert 0888... → 265888...
  const intl = clean.startsWith('0') ? '265' + clean.slice(1) : clean;
  return `https://wa.me/${intl}`;
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const CreateProperty = () => {
  const navigate = useNavigate();
  const { createHostel, loading } = useHostel();
  const { user } = useAuth();
  const unitImgRefs = useRef({});

  const [step, setStep] = useState(1);
  const [uploadingUnit, setUploadingUnit] = useState({});

  const [form, setForm] = useState({
    // Step 1 — basics
    name: '',
    description: '',
    propertyType: '',
    listingType: 'For Rent',
    district: '',
    address: '',
    // Step 2 — pricing & contact
    price: '',
    contactPhone: user?.phone || '',
    whatsapp:     user?.whatsapp || user?.phone || '',
    sameAsContact: true,
    // Step 3 — details
    bedrooms: '',
    bathrooms: '',
    totalRooms: '',
    availableRooms: '',
    gender: '',
    amenities: [],
    images: [],
    // Step 4 — units (optional)
    units: [],
  });

  // Keep whatsapp in sync when sameAsContact is on
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
      amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a],
    }));
  };

  /* ── Unit helpers ── */
  const addUnit = () => setForm(p => ({
    ...p,
    units: [...p.units, { id: Date.now(), unitNumber: `Unit ${p.units.length + 1}`, totalSpaces: '', availableSpaces: '', price: '', description: '', images: [] }],
  }));

  const updateUnit = (id, field, val) => setForm(p => ({ ...p, units: p.units.map(u => u.id === id ? { ...u, [field]: val } : u) }));
  const removeUnit = (id) => setForm(p => ({ ...p, units: p.units.filter(u => u.id !== id) }));

  const handleUnitImgUpload = async (unitId, files) => {
    if (!files?.length) return;
    setUploadingUnit(p => ({ ...p, [unitId]: true }));
    try {
      const urls = await Promise.all(Array.from(files).map(uploadImg));
      setForm(p => ({ ...p, units: p.units.map(u => u.id === unitId ? { ...u, images: [...u.images, ...urls] } : u) }));
    } catch { toast.error('Failed to upload unit images'); }
    finally { setUploadingUnit(p => ({ ...p, [unitId]: false })); }
  };

  const removeUnitImg = (unitId, url) => setForm(p => ({ ...p, units: p.units.map(u => u.id === unitId ? { ...u, images: u.images.filter(i => i !== url) } : u) }));

  /* ── Validation ── */
  const v1 = () => {
    if (!form.name || !form.description || !form.propertyType || !form.district || !form.address) {
      toast.error('Please fill in all fields in this step'); return false;
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

  const v4 = () => {
    for (const u of form.units) {
      if (!u.unitNumber?.trim())                { toast.error('All units need a unit number'); return false; }
      if (!u.totalSpaces || u.totalSpaces < 1)  { toast.error(`${u.unitNumber}: enter total spaces`); return false; }
      if (u.availableSpaces === '')             { toast.error(`${u.unitNumber}: enter available spaces`); return false; }
    }
    return true;
  };

  const next = (e) => {
    e.preventDefault();
    if (step === 1 && v1()) setStep(2);
    else if (step === 2 && v2()) setStep(3);
    else if (step === 3 && v3()) setStep(4);
  };

  const back = (e) => { e.preventDefault(); setStep(s => s - 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!v4()) return;
    try {
      const payload = {
        ...form,
        price:          Number(form.price),
        bedrooms:       Number(form.bedrooms) || 0,
        bathrooms:      Number(form.bathrooms) || 0,
        totalRooms:     Number(form.totalRooms) || 0,
        availableRooms: Number(form.availableRooms) || 0,
        whatsapp:       form.sameAsContact ? form.contactPhone : form.whatsapp,
        location:       { formattedAddress: `${form.address}, ${form.district}` },
        units: form.units.map(u => ({
          unitNumber:      u.unitNumber,
          totalSpaces:     Number(u.totalSpaces),
          availableSpaces: Number(u.availableSpaces),
          price:           Number(u.price) || 0,
          description:     u.description || '',
          images:          u.images || [],
        })),
      };
      await createHostel(payload);
      toast.success('🎉 Property listed successfully!');
      navigate('/landlord-dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Failed to publish property');
    }
  };

  const STEPS = ['Property Info', 'Price & Contact', 'Details', 'Units'];
  const progress = `${((step - 1) / (STEPS.length - 1)) * 100}%`;

  const isLand = form.propertyType === 'Plot of Land';

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      {/* NAV */}
      <nav className="cp-bar">
        <Link to="/" className="cp-bar-logo">
          <div className="cp-bar-logo-img"><img src="/PezaNyumbaLogo.png" alt="PezaNyumba" /></div>
          <div className="cp-bar-brand">
            <strong>PezaNyumba</strong>
            <span>MALAWI'S RENTAL PLATFORM</span>
          </div>
        </Link>
        <Link to="/landlord-dashboard" className="cp-bar-back">
          <i className="fa fa-arrow-left" /> Dashboard
        </Link>
      </nav>

      <div className="cp-main">
        <div className="cp-container">

          {/* Header */}
          <div className="cp-page-hdr">
            <h1><FaHome /> List Your Property</h1>
            <p>Fill in the details — your listing goes live instantly in your district</p>
          </div>

          {/* Progress */}
          <div className="cp-progress">
            <div className="cp-prog-line"><div className="cp-prog-fill" style={{ width: progress }} /></div>
            {STEPS.map((lbl, i) => (
              <div key={i} className="cp-step">
                <div className={`cp-step-circle ${step > i + 1 ? 'completed' : step === i + 1 ? 'active' : ''}`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <p className={`cp-step-lbl ${step >= i + 1 ? 'active' : ''}`}>{lbl}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="cp-card">

              {/* ════ STEP 1 — Property Info ════ */}
              {step === 1 && (
                <>
                  <div className="cp-card-title"><FaHome /> Property Information</div>

                  <div className="cp-grp">
                    <label className="cp-lbl">Property Name / Title <span className="cp-req">*</span></label>
                    <input className="cp-input" name="name" value={form.name} onChange={handleChange}
                      placeholder="e.g., Spacious 3-bedroom house in Area 25" />
                  </div>

                  <div className="cp-grp">
                    <label className="cp-lbl">Description <span className="cp-req">*</span></label>
                    <textarea className="cp-textarea" name="description" value={form.description} onChange={handleChange}
                      placeholder="Describe the property — size, condition, surroundings, what makes it special..." />
                  </div>

                  {/* Property Type pills */}
                  <div className="cp-grp">
                    <label className="cp-lbl">Property Type <span className="cp-req">*</span></label>
                    <div className="cp-type-grid">
                      {PROPERTY_TYPES.map(t => (
                        <button key={t} type="button"
                          className={`cp-type-pill${form.propertyType === t ? ' active' : ''}`}
                          onClick={() => set('propertyType', t)}>
                          <i className={
                            t === 'Plot of Land' ? 'fa fa-seedling' :
                            t === 'House'        ? 'fa fa-home' :
                            t === 'Single Room'  ? 'fa fa-bed' :
                            t === 'Commercial Space' || t === 'Office Space' || t === 'Warehouse' ? 'fa fa-store' :
                            'fa fa-building'
                          } />
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Listing type */}
                  <div className="cp-grp">
                    <label className="cp-lbl">Listing Type <span className="cp-req">*</span></label>
                    <div className="cp-type-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                      {LISTING_TYPES.map(t => (
                        <button key={t} type="button"
                          className={`cp-type-pill${form.listingType === t ? ' active' : ''}`}
                          onClick={() => set('listingType', t)}>
                          <i className={t === 'For Rent' ? 'fa fa-key' : 'fa fa-tag'} /> {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* District */}
                  <div className="cp-grid-2">
                    <div className="cp-grp">
                      <label className="cp-lbl">District <span className="cp-req">*</span></label>
                      <select className="cp-select" name="district" value={form.district} onChange={handleChange}>
                        <option value="">Select district…</option>
                        {MALAWI_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
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
                  <div className="cp-card-title"><FaDollarSign /> Price &amp; Contact</div>

                  <div className="cp-grid-2">
                    <div className="cp-grp">
                      <label className="cp-lbl">
                        {form.listingType === 'For Rent' ? 'Monthly Rent (MWK)' : 'Sale Price (MWK)'}
                        <span className="cp-req">*</span>
                      </label>
                      <input className="cp-input" type="number" name="price" value={form.price} onChange={handleChange}
                        placeholder="e.g., 120000" min="1" />
                    </div>
                    {!isLand && (
                      <div className="cp-grp">
                        <label className="cp-lbl">Bedrooms</label>
                        <input className="cp-input" type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange}
                          placeholder="e.g., 3" min="0" />
                      </div>
                    )}
                  </div>

                  {!isLand && (
                    <div className="cp-grid-2">
                      <div className="cp-grp">
                        <label className="cp-lbl">Bathrooms</label>
                        <input className="cp-input" type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange}
                          placeholder="e.g., 2" min="0" />
                      </div>
                      <div className="cp-grp">
                        <label className="cp-lbl">Gender Preference</label>
                        <select className="cp-select" name="gender" value={form.gender} onChange={handleChange}>
                          <option value="">Any (mixed)</option>
                          <option value="male">Male only</option>
                          <option value="female">Female only</option>
                          <option value="family">Families only</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Contact Phone */}
                  <div className="cp-grp">
                    <label className="cp-lbl">Contact Phone Number <span className="cp-req">*</span></label>
                    <input className="cp-input" type="tel" name="contactPhone" value={form.contactPhone} onChange={handleChange}
                      placeholder="0888123456 or +265888123456" />
                    <p className="cp-tip">Tenants will call this number to inquire</p>
                  </div>

                  {/* WhatsApp */}
                  <div className="cp-grp">
                    <label className="cp-lbl" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>WhatsApp Number <span className="cp-req">*</span></span>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.62rem', fontWeight: 600, textTransform: 'none', cursor: 'pointer', letterSpacing: 0 }}>
                        <input type="checkbox" name="sameAsContact" checked={form.sameAsContact} onChange={handleChange} style={{ width: 12, height: 12, accentColor: '#25D366' }} />
                        Same as phone
                      </label>
                    </label>
                    <div className="cp-wa-wrap">
                      <FaWhatsapp className="cp-wa-ico" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#25D366', fontSize: '1rem' }} />
                      <input className="cp-input cp-wa-input" type="tel" name="whatsapp"
                        value={form.sameAsContact ? form.contactPhone : form.whatsapp}
                        onChange={handleChange}
                        placeholder="0888123456"
                        disabled={form.sameAsContact}
                        style={{ paddingLeft: '2.2rem', opacity: form.sameAsContact ? 0.7 : 1 }} />
                    </div>
                    <div className="cp-wa-note">
                      <FaWhatsapp /> Tenants tap a button to WhatsApp you directly — make sure this is active
                    </div>
                  </div>
                </>
              )}

              {/* ════ STEP 3 — Details & Amenities ════ */}
              {step === 3 && (
                <>
                  <div className="cp-card-title"><FaBed /> Details &amp; Amenities</div>

                  {!isLand && (
                    <div className="cp-grid-2" style={{ marginBottom: '1rem' }}>
                      <div className="cp-grp">
                        <label className="cp-lbl">Total Units</label>
                        <input className="cp-input" type="number" name="totalRooms" value={form.totalRooms} onChange={handleChange} placeholder="e.g., 6" min="0" />
                      </div>
                      <div className="cp-grp">
                        <label className="cp-lbl">Available Now</label>
                        <input className="cp-input" type="number" name="availableRooms" value={form.availableRooms} onChange={handleChange} placeholder="e.g., 3" min="0" />
                      </div>
                    </div>
                  )}

                  <div className="cp-grp">
                    <label className="cp-lbl">Amenities <span className="cp-req">*</span></label>
                    <div className="cp-amenities">
                      {AMENITIES.map(a => (
                        <button key={a} type="button"
                          className={`cp-amenity${form.amenities.includes(a) ? ' active' : ''}`}
                          onClick={() => toggleAmenity(a)}>
                          {form.amenities.includes(a) && <FaCheckCircle style={{ fontSize: '0.7rem' }} />}
                          {a}
                        </button>
                      ))}
                    </div>
                    {form.amenities.length > 0 && (
                      <div className="cp-amenity-count">✅ {form.amenities.length} amenity(ies) selected</div>
                    )}
                  </div>

                  {/* Property Images */}
                  <div className="cp-grp">
                    <label className="cp-lbl">Property Photos</label>
                    <ImageUpload
                      images={form.images}
                      onImagesChange={imgs => set('images', imgs)}
                      maxImages={12}
                    />
                  </div>
                </>
              )}

              {/* ════ STEP 4 — Units (optional) ════ */}
              {step === 4 && (
                <>
                  <div className="cp-card-title"><FaBed /> Individual Units <span style={{ fontWeight: 400, fontSize: '0.82rem', color: '#9ca3af', marginLeft: '0.5rem' }}>(optional)</span></div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-mid)', marginBottom: '1rem', lineHeight: 1.6 }}>
                    Add individual units with their details and photos. This helps tenants find the right space.
                  </p>

                  {form.units.length > 0 && (
                    <div className="cp-rooms-summary">
                      <i className="fa fa-info-circle" />
                      {form.units.length} unit(s) ·{' '}
                      {form.units.reduce((a, u) => a + (Number(u.totalSpaces) || 0), 0)} total spaces ·{' '}
                      {form.units.reduce((a, u) => a + (Number(u.availableSpaces) || 0), 0)} available
                    </div>
                  )}

                  {form.units.map((unit, idx) => (
                    <div key={unit.id} className="cp-room-card">
                      <div className="cp-room-hdr">
                        <span className="cp-room-title">🏠 Unit {idx + 1}</span>
                        <button type="button" className="cp-room-del" onClick={() => removeUnit(unit.id)}>
                          <FaTrash /> Remove
                        </button>
                      </div>
                      <div className="cp-grid-3">
                        <div className="cp-grp" style={{ marginBottom: 0 }}>
                          <label className="cp-lbl">Unit No. <span className="cp-req">*</span></label>
                          <input className="cp-input" value={unit.unitNumber}
                            onChange={e => updateUnit(unit.id, 'unitNumber', e.target.value)} placeholder="e.g., A1" />
                        </div>
                        <div className="cp-grp" style={{ marginBottom: 0 }}>
                          <label className="cp-lbl">Total Spaces <span className="cp-req">*</span></label>
                          <input className="cp-input" type="number" min="1" value={unit.totalSpaces}
                            onChange={e => updateUnit(unit.id, 'totalSpaces', e.target.value)} placeholder="e.g., 4" />
                        </div>
                        <div className="cp-grp" style={{ marginBottom: 0 }}>
                          <label className="cp-lbl">Available <span className="cp-req">*</span></label>
                          <input className="cp-input" type="number" min="0" value={unit.availableSpaces}
                            onChange={e => updateUnit(unit.id, 'availableSpaces', e.target.value)} placeholder="e.g., 2" />
                        </div>
                      </div>
                      <div style={{ marginTop: '0.65rem' }}>
                        <label className="cp-lbl">Price (optional)</label>
                        <input className="cp-input" type="number" min="0" value={unit.price}
                          onChange={e => updateUnit(unit.id, 'price', e.target.value)}
                          placeholder={`Default: MWK ${Number(form.price || 0).toLocaleString()}`} />
                      </div>
                      <div style={{ marginTop: '0.65rem' }}>
                        <label className="cp-lbl">Unit Notes (optional)</label>
                        <textarea className="cp-textarea" rows={2} value={unit.description}
                          onChange={e => updateUnit(unit.id, 'description', e.target.value)}
                          placeholder="e.g., Corner unit with natural light..." style={{ minHeight: 60 }} />
                      </div>
                      {/* Unit images */}
                      <div style={{ marginTop: '0.65rem' }}>
                        <label className="cp-lbl">Unit Photos</label>
                        <div className="cp-room-imgs">
                          {unit.images.map((img, i) => (
                            <div key={i} className="cp-room-img-wrap">
                              <img src={img} alt="" className="cp-room-thumb" />
                              <button type="button" className="cp-room-rm-img" onClick={() => removeUnitImg(unit.id, img)}>
                                <FaTimes />
                              </button>
                            </div>
                          ))}
                          <div className="cp-room-add-img" onClick={() => unitImgRefs.current[unit.id]?.click()}>
                            {uploadingUnit[unit.id]
                              ? <><div className="cp-spinner" style={{ borderTopColor: 'var(--teal)', borderColor: 'var(--border)' }} /><span>Uploading…</span></>
                              : <><FaCamera /><span>Add Photo</span></>
                            }
                          </div>
                          <input type="file" accept="image/*" multiple style={{ display: 'none' }}
                            ref={el => unitImgRefs.current[unit.id] = el}
                            onChange={e => handleUnitImgUpload(unit.id, e.target.files)} />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button type="button" className="cp-add-room" onClick={addUnit}>
                    <FaPlus /> Add Unit
                  </button>
                  {form.units.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.76rem', marginTop: '0.6rem' }}>
                      You can publish without adding units — they're optional.
                    </p>
                  )}
                </>
              )}

              {/* ── Nav buttons ── */}
              <div className="cp-nav">
                {step > 1 && (
                  <button type="button" className="cp-btn-back" onClick={back}>← Back</button>
                )}
                {step < 4 ? (
                  <button type="button" className="cp-btn-next" onClick={next}>Next →</button>
                ) : (
                  <button type="submit" className="cp-btn-next" disabled={loading}>
                    {loading
                      ? <><div className="cp-spinner" /> Publishing…</>
                      : <>🎉 Publish Property</>
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