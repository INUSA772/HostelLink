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

/* ─── Styles — Home.jsx design system ─── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Nunito+Sans:wght@400;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:        #0f1923;
    --navy-mid:    #1a2e3d;
    --amber:       #f5a623;
    --amber-light: #fef3d8;
    --amber-dark:  #d4870a;
    --white:       #fff;
    --off-white:   #f7f8fa;
    --light-gray:  #f0f2f5;
    --border:      #e8eaed;
    --mid:         #6b7280;
    --dark:        #111827;
    --wa-green:    #25D366;
    --success:     #10b981;
    --error:       #ef4444;
    --radius:      12px;
    --radius-lg:   16px;
    --font:        'Plus Jakarta Sans', 'Nunito Sans', sans-serif;
  }

  html, body, #root {
    height: 100%; font-family: var(--font);
    overflow-x: hidden; color: var(--dark);
  }

  a { text-decoration: none; color: inherit; }
  button { font-family: var(--font); cursor: pointer; border: none; background: none; padding: 0; }
  img { max-width: 100%; }

  /* ══ NAVBAR ══ */
  .cp-nav {
    position: sticky; top: 0; z-index: 900;
    background: #fff;
    border-bottom: 1px solid #eaeaea;
    box-shadow: 0 2px 12px rgba(0,0,0,.06);
    font-family: var(--font);
  }
  .cp-nav-inner {
    max-width: 1100px; margin: 0 auto;
    display: flex; align-items: center;
    padding: 0 1.25rem; height: 60px; gap: 0;
  }
  .cp-logo {
    display: flex; align-items: center; gap: 8px;
    text-decoration: none; flex-shrink: 0; margin-right: auto;
  }
  .cp-logo-icon {
    width: 36px; height: 36px;
    background: white; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid var(--amber); overflow: hidden;
  }
  .cp-logo-icon img { width: 100%; height: 100%; object-fit: contain; }
  .cp-logo-text { font-size: 1.1rem; font-weight: 800; color: var(--navy); letter-spacing: -.3px; }
  .cp-nav-back {
    display: inline-flex; align-items: center; gap: 6px;
    padding: .45rem 1rem;
    border: 1.5px solid var(--border); border-radius: 8px;
    font-size: .82rem; font-weight: 700; color: var(--mid);
    text-decoration: none; transition: all .18s;
    white-space: nowrap;
  }
  .cp-nav-back:hover { border-color: var(--navy); color: var(--navy); }
  @media(min-width: 900px) {
    .cp-nav-inner { height: 68px; padding: 0 2rem; }
    .cp-logo-icon { width: 40px; height: 40px; }
    .cp-logo-text { font-size: 1.2rem; }
  }

  /* ══ PAGE BODY ══ */
  .cp-main {
    min-height: calc(100vh - 60px);
    background: var(--off-white);
    padding: 2rem 1.25rem 5rem;
  }
  .cp-container { max-width: 860px; margin: 0 auto; }

  /* ══ PAGE HEADER ══ */
  .cp-page-hdr {
    text-align: center; margin-bottom: 2rem;
  }
  .cp-page-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--amber-light); border-radius: 6px;
    padding: .35rem .9rem;
    font-size: .72rem; font-weight: 700; color: var(--amber-dark);
    margin-bottom: .9rem; letter-spacing: .3px;
  }
  .cp-page-hdr h1 {
    font-size: clamp(1.6rem, 5vw, 2.2rem);
    font-weight: 900; color: var(--navy);
    letter-spacing: -.5px; line-height: 1.15;
    margin-bottom: .35rem;
  }
  .cp-page-hdr h1 em { font-style: normal; color: var(--amber); }
  .cp-page-hdr p { color: var(--mid); font-size: .88rem; font-weight: 500; }

  /* ══ PROGRESS ══ */
  .cp-progress {
    display: flex; justify-content: space-between;
    margin-bottom: 2rem; position: relative;
  }
  .cp-prog-line {
    position: absolute; top: 18px; left: 0; right: 0;
    height: 3px; background: var(--border); z-index: 0;
  }
  .cp-prog-fill {
    height: 100%; background: var(--amber);
    transition: width .35s ease; border-radius: 2px;
  }
  .cp-step { flex: 1; text-align: center; position: relative; z-index: 1; }
  .cp-step-circle {
    width: 36px; height: 36px; border-radius: 50%;
    background: var(--border); color: var(--mid);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto .4rem;
    font-weight: 800; font-size: .82rem;
    transition: all .3s;
  }
  .cp-step-circle.active    { background: var(--navy); color: #fff; box-shadow: 0 4px 14px rgba(15,25,35,.3); }
  .cp-step-circle.completed { background: var(--success); color: #fff; }
  .cp-step-lbl { font-size: .7rem; color: var(--mid); transition: color .3s; font-weight: 600; }
  .cp-step-lbl.active { color: var(--navy); font-weight: 800; }

  /* ══ CARD ══ */
  .cp-card {
    background: #fff;
    border-radius: var(--radius-lg);
    box-shadow: 0 6px 30px rgba(15,25,35,.08);
    border: 1.5px solid var(--border);
    padding: 2rem 1.75rem;
    width: 100%;
  }
  .cp-card-title {
    font-size: 1.05rem; font-weight: 900; color: var(--navy);
    margin-bottom: 1.5rem;
    display: flex; align-items: center; gap: .5rem;
    letter-spacing: -.2px;
  }
  .cp-card-title i, .cp-card-title svg { color: var(--amber); }

  /* ══ FORM FIELDS ══ */
  .cp-grp { margin-bottom: 1rem; }
  .cp-lbl {
    display: block; font-size: .68rem; font-weight: 800;
    color: var(--mid); text-transform: uppercase;
    letter-spacing: .8px; margin-bottom: .3rem;
  }
  .cp-req { color: var(--error); margin-left: 2px; }
  .cp-input, .cp-select, .cp-textarea {
    width: 100%;
    border: 1.5px solid var(--border); border-radius: 9px;
    padding: .65rem .9rem; font-size: .88rem;
    font-family: var(--font);
    color: var(--dark); background: var(--off-white);
    outline: none; transition: all .18s;
  }
  .cp-input:focus, .cp-select:focus, .cp-textarea:focus {
    border-color: var(--amber); background: #fff;
    box-shadow: 0 0 0 3px rgba(245,166,35,.12);
  }
  .cp-input::placeholder, .cp-textarea::placeholder {
    font-size: .82rem; color: #c4ccd4;
  }
  .cp-textarea { resize: vertical; min-height: 100px; }
  .cp-select { appearance: none; cursor: pointer; }
  .cp-tip { font-size: .7rem; color: var(--mid); margin-top: .2rem; font-weight: 500; }

  /* Grid helpers */
  .cp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .cp-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }

  /* ══ WhatsApp field ══ */
  .cp-wa-wrap { position: relative; }
  .cp-wa-ico {
    position: absolute; left: .85rem; top: 50%;
    transform: translateY(-50%); color: var(--wa-green);
    font-size: 1rem; pointer-events: none;
  }
  .cp-wa-input { padding-left: 2.4rem !important; }
  .cp-wa-input:focus { border-color: var(--wa-green) !important; box-shadow: 0 0 0 3px rgba(37,211,102,.12) !important; }
  .cp-wa-note {
    font-size: .68rem; color: var(--mid); margin-top: .25rem;
    display: flex; align-items: center; gap: 5px; font-weight: 500;
  }
  .cp-wa-note svg { color: var(--wa-green); flex-shrink: 0; }

  /* ══ PROPERTY TYPE PILLS ══ */
  .cp-type-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: .6rem; margin-top: .4rem;
  }
  .cp-type-pill {
    padding: .75rem .65rem; border-radius: 9px;
    border: 1.5px solid var(--border);
    background: var(--off-white); color: var(--mid);
    cursor: pointer; font-size: .82rem; font-weight: 700;
    font-family: var(--font);
    display: flex; align-items: center; justify-content: center;
    gap: .45rem; transition: all .18s;
  }
  .cp-type-pill:hover { border-color: var(--amber); color: var(--navy); background: var(--amber-light); }
  .cp-type-pill.active {
    border-color: var(--navy); background: var(--navy);
    color: #fff; font-weight: 800;
    box-shadow: 0 4px 14px rgba(15,25,35,.2);
  }
  .cp-type-pill.active i { color: var(--amber); }

  /* ══ AMENITIES ══ */
  .cp-amenities {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: .6rem; margin-top: .4rem;
  }
  .cp-amenity {
    padding: .65rem .85rem; border-radius: 9px;
    border: 1.5px solid var(--border);
    background: var(--off-white); color: var(--dark);
    cursor: pointer; font-size: .8rem; font-weight: 600;
    font-family: var(--font);
    display: flex; align-items: center; gap: .45rem;
    transition: all .18s;
  }
  .cp-amenity:hover { border-color: var(--amber); }
  .cp-amenity.active {
    border-color: var(--navy); background: var(--navy);
    color: #fff; font-weight: 700;
  }
  .cp-amenity.active svg { color: var(--amber); }
  .cp-amenity-count {
    margin-top: .85rem; padding: .65rem 1rem;
    background: var(--success); color: #fff;
    border-radius: 9px; text-align: center;
    font-size: .82rem; font-weight: 700;
  }

  /* ══ UNIT CARDS ══ */
  .cp-room-card {
    background: var(--off-white); border: 1.5px solid var(--border);
    border-radius: var(--radius); padding: 1.25rem;
    margin-bottom: 1rem;
  }
  .cp-room-hdr {
    display: flex; align-items: center;
    justify-content: space-between; margin-bottom: 1rem;
  }
  .cp-room-title { font-size: .9rem; font-weight: 800; color: var(--navy); }
  .cp-room-del {
    background: #fef2f2; border: 1.5px solid #fecaca;
    color: #dc2626; border-radius: 7px;
    padding: .3rem .7rem; cursor: pointer;
    font-size: .75rem; font-weight: 700;
    display: flex; align-items: center; gap: .3rem;
    font-family: var(--font); transition: all .18s;
  }
  .cp-room-del:hover { background: #dc2626; color: #fff; border-color: #dc2626; }
  .cp-room-imgs { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: .75rem; }
  .cp-room-thumb {
    width: 68px; height: 68px; border-radius: 9px;
    object-fit: cover; border: 2px solid var(--border);
  }
  .cp-room-add-img {
    width: 68px; height: 68px; border-radius: 9px;
    border: 2px dashed var(--border); background: #fff;
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; cursor: pointer;
    font-size: .62rem; color: var(--mid); gap: .25rem;
    transition: all .18s;
  }
  .cp-room-add-img:hover { border-color: var(--amber); color: var(--amber-dark); }
  .cp-room-img-wrap { position: relative; }
  .cp-room-rm-img {
    position: absolute; top: -5px; right: -5px;
    width: 18px; height: 18px;
    background: var(--error); border: none; border-radius: 50%;
    color: #fff; font-size: .55rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  .cp-rooms-summary {
    background: #eff6ff; border: 1.5px solid #bfdbfe;
    border-radius: 9px; padding: .65rem 1rem;
    margin-bottom: 1rem;
    font-size: .8rem; color: #1d4ed8; font-weight: 700;
    display: flex; align-items: center; gap: .5rem;
  }
  .cp-add-unit {
    width: 100%; padding: .9rem;
    border: 2px dashed var(--amber); border-radius: var(--radius);
    background: var(--amber-light); color: var(--amber-dark);
    font-weight: 800; font-size: .88rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    gap: .5rem; transition: all .2s;
    font-family: var(--font); margin-top: .5rem;
  }
  .cp-add-unit:hover { background: var(--amber); color: var(--navy); border-color: var(--amber); }

  /* ══ SPINNER ══ */
  .cp-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff; border-radius: 50%;
    animation: cpspin .7s linear infinite; display: inline-block;
  }
  @keyframes cpspin { to { transform: rotate(360deg); } }

  /* ══ NAV BUTTONS ══ */
  .cp-nav-row {
    display: flex; justify-content: space-between;
    margin-top: 1.75rem; padding-top: 1.25rem;
    border-top: 1px solid var(--border);
  }
  .cp-btn-back {
    background: transparent; border: 2px solid var(--border);
    color: var(--mid); padding: .65rem 1.5rem;
    border-radius: 9px; font-weight: 700;
    font-size: .88rem; cursor: pointer;
    transition: all .18s; font-family: var(--font);
  }
  .cp-btn-back:hover { border-color: var(--navy); color: var(--navy); }
  .cp-btn-next {
    background: var(--navy); border: none; color: #fff;
    padding: .65rem 1.75rem; border-radius: 9px;
    font-weight: 800; font-size: .9rem; cursor: pointer;
    transition: all .2s; font-family: var(--font);
    display: flex; align-items: center; gap: .5rem;
    margin-left: auto;
    box-shadow: 0 4px 16px rgba(15,25,35,.25);
  }
  .cp-btn-next:hover:not(:disabled) { background: var(--navy-mid); transform: translateY(-1px); }
  .cp-btn-next:disabled { opacity: .6; cursor: not-allowed; transform: none; }

  /* ══ MOBILE ══ */
  @media(max-width: 640px) {
    .cp-grid-2, .cp-grid-3 { grid-template-columns: 1fr; }
    .cp-main { padding: 1.25rem .85rem 4rem; }
    .cp-card { padding: 1.4rem 1.1rem; }
    .cp-step-lbl { font-size: .62rem; }
    .cp-nav-inner { padding: 0 1rem; }
  }
`;

/* ─── WhatsApp link helper ─── */
export const waLink = (num) => {
  const clean = (num || '').replace(/\D/g, '');
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
    name: '',
    description: '',
    propertyType: '',
    listingType: 'For Rent',
    district: '',
    address: '',
    price: '',
    contactPhone: user?.phone || '',
    whatsapp:     user?.whatsapp || user?.phone || '',
    sameAsContact: true,
    bedrooms: '',
    bathrooms: '',
    totalRooms: '',
    availableRooms: '',
    gender: '',
    amenities: [],
    images: [],
    units: [],
  });

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

  /* ── Unit helpers ── */
  const addUnit = () => setForm(p => ({
    ...p,
    units: [...p.units, {
      id: Date.now(),
      unitNumber: `Unit ${p.units.length + 1}`,
      totalSpaces: '', availableSpaces: '',
      price: '', description: '', images: [],
    }],
  }));

  const updateUnit = (id, field, val) =>
    setForm(p => ({ ...p, units: p.units.map(u => u.id === id ? { ...u, [field]: val } : u) }));
  const removeUnit = (id) =>
    setForm(p => ({ ...p, units: p.units.filter(u => u.id !== id) }));

  const handleUnitImgUpload = async (unitId, files) => {
    if (!files?.length) return;
    setUploadingUnit(p => ({ ...p, [unitId]: true }));
    try {
      const urls = await Promise.all(Array.from(files).map(uploadImg));
      setForm(p => ({ ...p, units: p.units.map(u => u.id === unitId ? { ...u, images: [...u.images, ...urls] } : u) }));
    } catch { toast.error('Failed to upload unit images'); }
    finally { setUploadingUnit(p => ({ ...p, [unitId]: false })); }
  };

  const removeUnitImg = (unitId, url) =>
    setForm(p => ({ ...p, units: p.units.map(u => u.id === unitId ? { ...u, images: u.images.filter(i => i !== url) } : u) }));

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
      if (!u.unitNumber?.trim())               { toast.error('All units need a unit number'); return false; }
      if (!u.totalSpaces || u.totalSpaces < 1) { toast.error(`${u.unitNumber}: enter total spaces`); return false; }
      if (u.availableSpaces === '')            { toast.error(`${u.unitNumber}: enter available spaces`); return false; }
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

      {/* ══ NAVBAR ══ */}
      <nav className="cp-nav">
        <div className="cp-nav-inner">
          <Link to="/" className="cp-logo">
            <div className="cp-logo-icon">
              <img src="/PEZ.png" alt="PezaNyumba Logo" />
            </div>
            <span className="cp-logo-text">PezaNyumba</span>
          </Link>
          <Link to="/landlord-dashboard" className="cp-nav-back">
            <i className="fa fa-arrow-left" /> Dashboard
          </Link>
        </div>
      </nav>

      <div className="cp-main">
        <div className="cp-container">

          {/* ══ PAGE HEADER ══ */}
          <div className="cp-page-hdr">
            <div className="cp-page-eyebrow">
              <i className="fa fa-home" /> List Your Property
            </div>
            <h1>Add a <em>New Listing</em></h1>
            <p>Fill in the details — your listing goes live instantly in your district</p>
          </div>

          {/* ══ PROGRESS ══ */}
          <div className="cp-progress">
            <div className="cp-prog-line">
              <div className="cp-prog-fill" style={{ width: progress }} />
            </div>
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
                  <div className="cp-card-title">
                    <i className="fa fa-home" /> Property Information
                  </div>

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

                  {/* Property Type */}
                  <div className="cp-grp">
                    <label className="cp-lbl">Property Type <span className="cp-req">*</span></label>
                    <div className="cp-type-grid">
                      {PROPERTY_TYPES.map(t => (
                        <button key={t} type="button"
                          className={`cp-type-pill${form.propertyType === t ? ' active' : ''}`}
                          onClick={() => set('propertyType', t)}>
                          <i className={
                            t === 'Plot of Land'     ? 'fa fa-seedling' :
                            t === 'House'            ? 'fa fa-home' :
                            t === 'Single Room'      ? 'fa fa-bed' :
                            t === 'Commercial Space' || t === 'Office Space' || t === 'Warehouse'
                                                     ? 'fa fa-store' :
                            'fa fa-building'
                          } />
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Listing Type */}
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

                  {/* District + Address */}
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
                  <div className="cp-card-title">
                    <i className="fa fa-tag" /> Price &amp; Contact
                  </div>

                  <div className="cp-grid-2">
                    <div className="cp-grp">
                      <label className="cp-lbl">
                        {form.listingType === 'For Rent' ? 'Monthly Rent (MWK)' : 'Sale Price (MWK)'}
                        <span className="cp-req">*</span>
                      </label>
                      <input className="cp-input" type="number" name="price" value={form.price}
                        onChange={handleChange} placeholder="e.g., 120000" min="1" />
                    </div>
                    {!isLand && (
                      <div className="cp-grp">
                        <label className="cp-lbl">Bedrooms</label>
                        <input className="cp-input" type="number" name="bedrooms" value={form.bedrooms}
                          onChange={handleChange} placeholder="e.g., 3" min="0" />
                      </div>
                    )}
                  </div>

                  {!isLand && (
                    <div className="cp-grid-2">
                      <div className="cp-grp">
                        <label className="cp-lbl">Bathrooms</label>
                        <input className="cp-input" type="number" name="bathrooms" value={form.bathrooms}
                          onChange={handleChange} placeholder="e.g., 2" min="0" />
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

                  <div className="cp-grp">
                    <label className="cp-lbl">Contact Phone Number <span className="cp-req">*</span></label>
                    <input className="cp-input" type="tel" name="contactPhone" value={form.contactPhone}
                      onChange={handleChange} placeholder="0888123456 or +265888123456" />
                    <p className="cp-tip">Tenants will call this number to inquire</p>
                  </div>

                  <div className="cp-grp">
                    <label className="cp-lbl" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>WhatsApp Number <span className="cp-req">*</span></span>
                      <label style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        fontSize: '.68rem', fontWeight: 700,
                        textTransform: 'none', cursor: 'pointer', letterSpacing: 0,
                      }}>
                        <input type="checkbox" name="sameAsContact" checked={form.sameAsContact}
                          onChange={handleChange}
                          style={{ width: 13, height: 13, accentColor: '#25D366' }} />
                        Same as phone
                      </label>
                    </label>
                    <div className="cp-wa-wrap">
                      <FaWhatsapp className="cp-wa-ico" />
                      <input
                        className="cp-input cp-wa-input"
                        type="tel" name="whatsapp"
                        value={form.sameAsContact ? form.contactPhone : form.whatsapp}
                        onChange={handleChange}
                        placeholder="0888123456"
                        disabled={form.sameAsContact}
                        style={{ opacity: form.sameAsContact ? 0.65 : 1 }}
                      />
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
                  <div className="cp-card-title">
                    <i className="fa fa-bed" /> Details &amp; Amenities
                  </div>

                  {!isLand && (
                    <div className="cp-grid-2" style={{ marginBottom: '1rem' }}>
                      <div className="cp-grp">
                        <label className="cp-lbl">Total Units</label>
                        <input className="cp-input" type="number" name="totalRooms"
                          value={form.totalRooms} onChange={handleChange} placeholder="e.g., 6" min="0" />
                      </div>
                      <div className="cp-grp">
                        <label className="cp-lbl">Available Now</label>
                        <input className="cp-input" type="number" name="availableRooms"
                          value={form.availableRooms} onChange={handleChange} placeholder="e.g., 3" min="0" />
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
                          {form.amenities.includes(a) && <FaCheckCircle style={{ fontSize: '.75rem', flexShrink: 0 }} />}
                          {a}
                        </button>
                      ))}
                    </div>
                    {form.amenities.length > 0 && (
                      <div className="cp-amenity-count">
                        ✅ {form.amenities.length} amenity(ies) selected
                      </div>
                    )}
                  </div>

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
                  <div className="cp-card-title">
                    <i className="fa fa-th-large" /> Individual Units
                    <span style={{ fontWeight: 500, fontSize: '.8rem', color: '#9ca3af', marginLeft: '.5rem' }}>
                      (optional)
                    </span>
                  </div>
                  <p style={{ fontSize: '.83rem', color: 'var(--mid)', marginBottom: '1.25rem', lineHeight: 1.7, fontWeight: 500 }}>
                    Add individual units with their own details and photos. This helps tenants find the right space.
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
                      <div style={{ marginTop: '.75rem' }}>
                        <label className="cp-lbl">Price (optional)</label>
                        <input className="cp-input" type="number" min="0" value={unit.price}
                          onChange={e => updateUnit(unit.id, 'price', e.target.value)}
                          placeholder={`Default: MWK ${Number(form.price || 0).toLocaleString()}`} />
                      </div>
                      <div style={{ marginTop: '.75rem' }}>
                        <label className="cp-lbl">Unit Notes (optional)</label>
                        <textarea className="cp-textarea" rows={2} value={unit.description}
                          onChange={e => updateUnit(unit.id, 'description', e.target.value)}
                          placeholder="e.g., Corner unit with natural light…"
                          style={{ minHeight: 64 }} />
                      </div>
                      <div style={{ marginTop: '.75rem' }}>
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
                              ? <><span className="cp-spinner" /><span style={{ fontSize: '.62rem' }}>Uploading…</span></>
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

                 {/* <button type="button" className="cp-add-unit" onClick={addUnit}>
                    <FaPlus /> Add Unit
                  </button>

                  {form.units.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '.78rem', marginTop: '.65rem', fontWeight: 500 }}>
                      You can publish without units — they're optional.
                    </p>
                  )}*/}
                </>
              )}

              {/* ── Navigation buttons ── */}
              <div className="cp-nav-row">
                {step > 1 && (
                  <button type="button" className="cp-btn-back" onClick={back}>
                    ← Back
                  </button>
                )}
                {step < 4 ? (
                  <button type="button" className="cp-btn-next" onClick={next}>
                    Next →
                  </button>
                ) : (
                  <button type="submit" className="cp-btn-next" disabled={loading}>
                    {loading
                      ? <><span className="cp-spinner" /> Publishing…</>
                      : <><i className="fa fa-check" /> Publish Property</>
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