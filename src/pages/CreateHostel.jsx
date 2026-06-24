import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHostel } from '../context/HostelContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaWhatsapp, FaCamera, FaTimes, FaCheckCircle, FaMapMarkerAlt, FaTag, FaHome } from 'react-icons/fa';
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
  { value: 'House',              label: 'House' },
  { value: 'Flat/Apartment',   label: 'bedsitter' },
  { value: 'Single Room',      label: 'Single Room' },
  { value: 'Self-Contained',   label: 'Self-Contained' },
  { value: 'Plot of Land',      label: 'Plot of Land' },
  { value: 'Commercial Space',  label: 'Commercial Space' },
];

const HOUSE_AMENITIES = [
  'Water 24/7','Electricity (ESCOM)','WiFi','Solar Power',
  'Security Guard','CCTV Security','Borehole Water',
  'Flush Toilet','Kitchen','Parking','Garden','Fence/Wall',
  'Tiled Floors','Ceiling','Generator',
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
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0f1923;
    --navy-mid: #1a2e3d;
    --amber: #f5a623;
    --amber-light: #fef3d8;
    --amber-dark: #d4870a;
    --border: #e4e6ea;
    --border-focus: #f5a623;
    --bg: #f0f2f5;
    --card: #fff;
    --mid: #65676b;
    --dark: #1c1e21;
    --wa: #25D366;
    --success: #10b981;
    --error: #ef4444;
    --radius: 8px;
    --radius-lg: 12px;
    --font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  html, body, #root { height: 100%; font-family: var(--font); background: var(--bg); color: var(--dark); overflow-x: hidden; }
  a { text-decoration: none; color: inherit; }
  button { font-family: var(--font); cursor: pointer; border: none; background: none; padding: 0; }
  img { max-width: 100%; }

  /* ══ TOPBAR ══ */
  .cp-bar {
    position: sticky; top: 0; z-index: 900;
    height: 56px;
    background: var(--navy);
    display: flex; align-items: center;
    padding: 0 1.25rem;
    gap: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,.3);
  }
  .cp-bar-logo {
    display: flex; align-items: center; gap: 8px;
    text-decoration: none; margin-right: auto;
  }
  .cp-bar-logo-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: white; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
  }
  .cp-bar-logo-icon img { width: 100%; height: 100%; object-fit: contain; }
  .cp-bar-logo-text { font-size: .95rem; font-weight: 800; color: white; letter-spacing: -.2px; }
  .cp-bar-title {
    font-size: .88rem; font-weight: 700; color: rgba(255,255,255,.7);
    padding: .3rem .8rem; background: rgba(255,255,255,.08);
    border-radius: 20px; white-space: nowrap;
  }
  .cp-bar-back {
    display: flex; align-items: center; gap: 5px;
    font-size: .82rem; font-weight: 600; color: rgba(255,255,255,.7);
    border: 1.5px solid rgba(255,255,255,.15); border-radius: 6px;
    padding: .3rem .75rem; text-decoration: none; transition: all .18s;
    white-space: nowrap;
  }
  .cp-bar-back:hover { border-color: rgba(255,255,255,.4); color: white; }

  /* ══ PAGE LAYOUT ══ */
  .cp-page {
    max-width: 680px; margin: 0 auto;
    padding: 1.5rem 1rem 4rem;
  }

  /* ══ COMPOSER CARD ══ */
  .cp-composer {
    background: var(--card);
    border-radius: var(--radius-lg);
    box-shadow: 0 1px 2px rgba(0,0,0,.08), 0 0 0 1px rgba(0,0,0,.05);
    overflow: hidden;
  }

  /* ══ COMPOSER HEADER ══ */
  .cp-composer-header {
    padding: 1.1rem 1.25rem .75rem;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: .75rem;
  }
  .cp-composer-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--navy); display: flex; align-items: center;
    justify-content: center; color: var(--amber); font-size: 1.1rem;
    flex-shrink: 0;
  }
  .cp-composer-header-text {}
  .cp-composer-header-text h2 {
    font-size: .97rem; font-weight: 700; color: var(--dark);
    margin-bottom: 1px;
  }
  .cp-composer-header-text p {
    font-size: .75rem; color: var(--mid); font-weight: 500;
  }

  /* ══ SECTION ══ */
  .cp-section {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border);
  }
  .cp-section:last-of-type { border-bottom: none; }

  .cp-section-label {
    font-size: .7rem; font-weight: 700; color: var(--mid);
    text-transform: uppercase; letter-spacing: .8px;
    margin-bottom: .6rem; display: flex; align-items: center; gap: 6px;
  }
  .cp-section-label svg, .cp-section-label i { color: var(--amber-dark); }

  /* ══ FORM ELEMENTS ══ */
  .cp-field { margin-bottom: .85rem; }
  .cp-field:last-child { margin-bottom: 0; }

  .cp-label {
    display: block; font-size: .75rem; font-weight: 600;
    color: var(--mid); margin-bottom: .28rem;
  }
  .cp-req { color: var(--error); margin-left: 2px; }

  .cp-input, .cp-select, .cp-textarea {
    width: 100%;
    border: 1.5px solid var(--border); border-radius: var(--radius);
    padding: .62rem .85rem; font-size: .88rem;
    font-family: var(--font); color: var(--dark);
    background: #f8f9fb; outline: none;
    transition: border-color .15s, background .15s;
  }
  .cp-input:focus, .cp-select:focus, .cp-textarea:focus {
    border-color: var(--border-focus); background: #fff;
    box-shadow: 0 0 0 3px rgba(245,166,35,.1);
  }
  .cp-input::placeholder, .cp-textarea::placeholder { color: #bec3cc; font-size: .84rem; }
  .cp-select { appearance: none; cursor: pointer; }
  .cp-textarea { resize: vertical; min-height: 90px; line-height: 1.55; }
  .cp-hint { font-size: .68rem; color: #9ca3af; margin-top: .2rem; font-weight: 500; }

  .cp-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
  .cp-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: .75rem; }

  /* ══ PROPERTY TYPE PILLS ══ */
  .cp-type-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: .5rem;
  }
  .cp-type-pill {
    padding: .65rem .5rem; border-radius: 8px;
    border: 1.5px solid var(--border); background: #f8f9fb;
    color: var(--dark); cursor: pointer;
    font-size: .78rem; font-weight: 600;
    font-family: var(--font);
    display: flex; flex-direction: column; align-items: center;
    gap: .25rem; transition: all .15s; text-align: center;
    line-height: 1.2;
  }
  .cp-type-pill-icon { font-size: 1.3rem; }
  .cp-type-pill:hover { border-color: var(--amber); background: var(--amber-light); }
  .cp-type-pill.active {
    border-color: var(--navy); background: var(--navy);
    color: white; font-weight: 700;
  }

  /* ══ LISTING TYPE TOGGLE ══ */
  .cp-listing-toggle { display: flex; gap: .5rem; }
  .cp-listing-btn {
    flex: 1; padding: .6rem .5rem; border-radius: 8px;
    border: 1.5px solid var(--border); background: #f8f9fb;
    color: var(--mid); cursor: pointer; font-size: .84rem;
    font-weight: 600; font-family: var(--font);
    display: flex; align-items: center; justify-content: center;
    gap: .4rem; transition: all .15s;
  }
  .cp-listing-btn:hover { border-color: var(--amber); color: var(--amber-dark); }
  .cp-listing-btn.active {
    border-color: var(--navy); background: var(--navy); color: white;
  }

  /* ══ AMENITIES ══ */
  .cp-amenity-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
    gap: .45rem;
  }
  .cp-amenity {
    padding: .5rem .75rem; border-radius: 7px;
    border: 1.5px solid var(--border); background: #f8f9fb;
    color: var(--dark); cursor: pointer; font-size: .78rem;
    font-weight: 500; font-family: var(--font);
    display: flex; align-items: center; gap: .4rem;
    transition: all .15s; white-space: nowrap; overflow: hidden;
    text-overflow: ellipsis;
  }
  .cp-amenity:hover { border-color: var(--amber-dark); background: var(--amber-light); }
  .cp-amenity.active {
    border-color: var(--navy); background: var(--navy); color: white;
  }
  .cp-amenity-check { font-size: .7rem; flex-shrink: 0; color: var(--amber); }
  .cp-amenity-count {
    margin-top: .6rem; padding: .5rem .85rem;
    background: #f0fdf4; color: #15803d;
    border-radius: 7px; font-size: .78rem; font-weight: 700;
    border: 1px solid #bbf7d0;
  }

  /* ══ WhatsApp field ══ */
  .cp-wa-wrap { position: relative; }
  .cp-wa-ico {
    position: absolute; left: .75rem; top: 50%;
    transform: translateY(-50%); color: var(--wa); font-size: .95rem;
    pointer-events: none;
  }
  .cp-wa-inp { padding-left: 2.2rem !important; }
  .cp-wa-inp:focus { border-color: var(--wa) !important; box-shadow: 0 0 0 3px rgba(37,211,102,.12) !important; }
  .cp-wa-same {
    display: flex; align-items: center; gap: 6px;
    font-size: .73rem; font-weight: 600; color: var(--mid);
    cursor: pointer; margin-top: .35rem;
  }
  .cp-wa-same input[type=checkbox] {
    width: 14px; height: 14px; accent-color: var(--wa);
    cursor: pointer;
  }

  /* ══ PHOTO ZONE ══ */
  .cp-photo-zone {
    border: 2px dashed var(--border); border-radius: var(--radius-lg);
    background: #f8f9fb; padding: 1.5rem 1rem;
    text-align: center; cursor: pointer;
    transition: all .2s;
  }
  .cp-photo-zone:hover { border-color: var(--amber); background: var(--amber-light); }
  .cp-photo-zone-icon { font-size: 2rem; color: var(--mid); margin-bottom: .5rem; }
  .cp-photo-zone-text { font-size: .85rem; font-weight: 600; color: var(--mid); }
  .cp-photo-zone-sub { font-size: .72rem; color: #9ca3af; margin-top: .2rem; }

  /* ══ PRICE PILL ══ */
  .cp-price-preview {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--amber-light); border: 1px solid #f0d89a;
    border-radius: 20px; padding: .3rem .9rem;
    font-size: .8rem; font-weight: 700; color: var(--amber-dark);
    margin-top: .5rem;
  }

  /* ══ SUBMIT ZONE ══ */
  .cp-submit-zone {
    padding: 1rem 1.25rem;
    border-top: 1px solid var(--border);
    background: #fafbfc;
  }
  .cp-submit-row {
    display: flex; gap: .75rem; align-items: center;
  }
  .cp-publish-btn {
    flex: 1; background: var(--navy); color: white;
    border: none; border-radius: var(--radius);
    padding: .85rem 1rem; font-size: .95rem; font-weight: 700;
    font-family: var(--font); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    gap: 7px; transition: all .2s;
    box-shadow: 0 2px 8px rgba(15,25,35,.2);
  }
  .cp-publish-btn:hover:not(:disabled) { background: var(--navy-mid); transform: translateY(-1px); }
  .cp-publish-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }
  .cp-draft-btn {
    background: transparent; border: 1.5px solid var(--border);
    color: var(--mid); border-radius: var(--radius);
    padding: .85rem 1.2rem; font-size: .88rem; font-weight: 600;
    font-family: var(--font); cursor: pointer; transition: all .2s;
    white-space: nowrap;
  }
  .cp-draft-btn:hover { border-color: var(--navy); color: var(--navy); }

  .cp-submit-note {
    text-align: center; margin-top: .65rem;
    font-size: .72rem; color: #9ca3af; font-weight: 500;
  }
  .cp-spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2.5px solid rgba(255,255,255,.3);
    border-top-color: white; animation: cpspin .6s linear infinite;
    display: inline-block; flex-shrink: 0;
  }
  @keyframes cpspin { to { transform: rotate(360deg); } }

  /* ══ MOBILE ══ */
  @media(max-width: 540px) {
    .cp-row-2 { grid-template-columns: 1fr; }
    .cp-row-3 { grid-template-columns: 1fr 1fr; }
    .cp-type-row { grid-template-columns: repeat(2, 1fr); }
    .cp-page { padding: 1rem .5rem 3rem; }
  }
`;

/* ─── Main Component ─── */
const CreateProperty = () => {
  const navigate = useNavigate();
  const { createHostel, loading } = useHostel();
  const { user } = useAuth();
  const imgInputRef = useRef(null);

  const [form, setForm] = useState({
    propertyType: '',
    listingType: 'For Rent',
    name: '',
    description: '',
    district: '',
    address: '',
    price: '',
    contactPhone: user?.phone || '',
    whatsapp: user?.whatsapp || user?.phone || '',
    sameAsContact: true,
    amenities: [],
    images: [],
    totalRooms: '',
    availableRooms: '',
  });

  useEffect(() => {
    if (form.sameAsContact) setForm(p => ({ ...p, whatsapp: p.contactPhone }));
  }, [form.contactPhone, form.sameAsContact]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (name === 'sameAsContact') {
      setForm(p => ({ ...p, sameAsContact: checked, whatsapp: checked ? p.contactPhone : '' }));
      return;
    }
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleAmenity = a => {
    setForm(p => ({
      ...p,
      amenities: p.amenities.includes(a)
        ? p.amenities.filter(x => x !== a)
        : [...p.amenities, a],
    }));
  };

  const isLand = form.propertyType === 'Plot of Land';
  const isCommercial = form.propertyType === 'Commercial Space';
  const showRooms = !isLand && !isCommercial;

  const priceLabel = form.listingType === 'For Rent'
    ? 'Monthly Rent (MWK)'
    : 'Sale Price (MWK)';

  const handleSubmit = async () => {
    /* ─── Validation ─── */
    if (!form.propertyType) { toast.error('Please select a property type'); return; }
    if (!form.name || form.name.length < 4) { toast.error('Add a property title (at least 4 characters)'); return; }
    if (!form.district) { toast.error('Please select a district'); return; }
    if (!form.address) { toast.error('Please enter the specific address / area'); return; }
    if (!form.price || Number(form.price) <= 0) { toast.error('Please enter a valid price'); return; }
    if (!form.contactPhone) { toast.error('Please add a contact phone number'); return; }

    try {
      const payload = {
        ...form,
        price:          Number(form.price),
        totalRooms:     Number(form.totalRooms) || 0,
        availableRooms: Number(form.availableRooms) || 0,
        whatsapp:       form.sameAsContact ? form.contactPhone : form.whatsapp,
        location:       { formattedAddress: `${form.address}, ${form.district}` },
        units: [],
      };
      await createHostel(payload);
      toast.success('🎉 Property listed successfully!');
      navigate('/landlord-dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Failed to publish property. Please try again.');
    }
  };

  const formattedPrice = form.price
    ? `MWK ${Number(form.price).toLocaleString()}${form.listingType === 'For Rent' ? '/mo' : ''}`
    : null;

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      {/* ══ TOP BAR ══ */}
      <nav className="cp-bar">
        <Link to="/" className="cp-bar-logo">
          <div className="cp-bar-logo-icon"><img src="/PEZ.png" alt="PezaNyumba" /></div>
          <span className="cp-bar-logo-text">PezaNyumba Mw</span>
        </Link>
        <span className="cp-bar-title">List a Property</span>
        <Link to="/landlord-dashboard" className="cp-bar-back">
          <i className="fa fa-arrow-left" /> Dashboard
        </Link>
      </nav>

      {/* ══ COMPOSER ══ */}
      <div className="cp-page">
        <div className="cp-composer">

          {/* Header */}
          <div className="cp-composer-header">
            <div className="cp-composer-avatar"></div>
            <div className="cp-composer-header-text">
              <h2>{user?.firstName ? `${user.firstName}, list your property` : 'List your property'}</h2>
              <p>Fill in the details. Goes live in your district instantly</p>
            </div>
          </div>

          {/* ── 1. What are you listing? ── */}
          <div className="cp-section">
            <div className="cp-section-label">
              <i className="fa fa-th-large" /> What are you listing?
            </div>
            <div className="cp-type-row">
              {PROPERTY_TYPES.map(pt => (
                <button
                  key={pt.value}
                  type="button"
                  className={`cp-type-pill${form.propertyType === pt.value ? ' active' : ''}`}
                  onClick={() => set('propertyType', pt.value)}
                >
                  <span className="cp-type-pill-icon">{pt.icon}</span>
                  <span>{pt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── 2. For Rent / For Sale ── */}
          <div className="cp-section">
            <div className="cp-section-label">
              <i className="fa fa-tag" /> Listing purpose
            </div>
            <div className="cp-listing-toggle">
              <button
                type="button"
                className={`cp-listing-btn${form.listingType === 'For Rent' ? ' active' : ''}`}
                onClick={() => set('listingType', 'For Rent')}
              >
                <i className="fa fa-key" /> For Rent
              </button>
              <button
                type="button"
                className={`cp-listing-btn${form.listingType === 'For Sale' ? ' active' : ''}`}
                onClick={() => set('listingType', 'For Sale')}
              >
                <i className="fa fa-tag" /> For Sale
              </button>
            </div>
          </div>

          {/* ── 3. Basic Info ── */}
          <div className="cp-section">
            <div className="cp-section-label">
              <i className="fa fa-pen" /> Property details
            </div>

            <div className="cp-field">
              <label className="cp-label">Title <span className="cp-req">*</span></label>
              <input
                className="cp-input"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Spacious 3-bedroom house near Area 25 Mall"
                maxLength={100}
              />
            </div>

            <div className="cp-field">
              <label className="cp-label">Description</label>
              <textarea
                className="cp-textarea"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the property — condition, surroundings, what makes it stand out…"
                rows={3}
              />
            </div>

            <div className="cp-row-2">
              <div className="cp-field">
                <label className="cp-label">District <span className="cp-req">*</span></label>
                <select className="cp-select" name="district" value={form.district} onChange={handleChange}>
                  <option value="">Select district…</option>
                  {MALAWI_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="cp-field">
                <label className="cp-label">Area / Street <span className="cp-req">*</span></label>
                <input
                  className="cp-input"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="e.g. Area 25, Chinsapo"
                />
              </div>
            </div>
          </div>

          {/* ── 4. Price & Availability ── */}
          <div className="cp-section">
            <div className="cp-section-label">
              <i className="fa fa-wallet" /> Price 
            </div>

            <div className={showRooms ? 'cp-row-3' : 'cp-row-2'}>
              <div className="cp-field" style={{ gridColumn: showRooms ? '1 / 2' : '1' }}>
                <label className="cp-label">{priceLabel} <span className="cp-req">*</span></label>
                <input
                  className="cp-input"
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 120000"
                  min="1"
                />
                {formattedPrice && (
                  <div className="cp-price-preview">
                    <i className="fa fa-check-circle" /> {formattedPrice}
                  </div>
                )}
              </div>
             
            </div>
          </div>

          {/* ── 5. Contact ── */}
          <div className="cp-section">
            <div className="cp-section-label">
              <i className="fa fa-phone" /> Contact info
            </div>

            <div className="cp-row-2">
              <div className="cp-field">
                <label className="cp-label">Phone number <span className="cp-req">*</span></label>
                <input
                  className="cp-input"
                  type="tel"
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                  placeholder="0888 123 456"
                />
              </div>
              <div className="cp-field">
                <label className="cp-label">WhatsApp <span className="cp-req">*</span></label>
                <div className="cp-wa-wrap">
                  <FaWhatsapp className="cp-wa-ico" />
                  <input
                    className="cp-input cp-wa-inp"
                    type="tel"
                    name="whatsapp"
                    value={form.sameAsContact ? form.contactPhone : form.whatsapp}
                    onChange={handleChange}
                    placeholder="0888 123 456"
                    disabled={form.sameAsContact}
                    style={{ opacity: form.sameAsContact ? .65 : 1 }}
                  />
                </div>
                <label className="cp-wa-same">
                  <input
                    type="checkbox"
                    name="sameAsContact"
                    checked={form.sameAsContact}
                    onChange={handleChange}
                  />
                  Same as phone number
                </label>
              </div>
            </div>
          </div>

          {/* ── 6. Amenities ── */}
          {!isLand && (
            <div className="cp-section">
              <div className="cp-section-label">
                <i className="fa fa-list-check" /> Amenities & features
              </div>
              <div className="cp-amenity-grid">
                {HOUSE_AMENITIES.map(a => (
                  <button
                    key={a}
                    type="button"
                    className={`cp-amenity${form.amenities.includes(a) ? ' active' : ''}`}
                    onClick={() => toggleAmenity(a)}
                  >
                    {form.amenities.includes(a) && (
                      <i className="fa fa-check cp-amenity-check" />
                    )}
                    {a}
                  </button>
                ))}
              </div>
              {form.amenities.length > 0 && (
                <div className="cp-amenity-count">
                  ✅ {form.amenities.length} feature{form.amenities.length !== 1 ? 's' : ''} selected
                </div>
              )}
            </div>
          )}

          {/* ── 7. Photos ── */}
          <div className="cp-section">
            <div className="cp-section-label">
              <i className="fa fa-camera" /> Photos
              <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: 4 }}>(recommended)</span>
            </div>
            <ImageUpload
              images={form.images}
              onImagesChange={imgs => set('images', imgs)}
              maxImages={12}
            />
            <p className="cp-hint" style={{ marginTop: '.5rem' }}>
              Good photos get 3× more inquiries. Add up to 12 photos.
            </p>
          </div>

          {/* ── Submit ── */}
          <div className="cp-submit-zone">
            <div className="cp-submit-row">
              <button type="button" className="cp-draft-btn" onClick={() => navigate('/landlord-dashboard')}>
                Cancel
              </button>
              <button
                type="button"
                className="cp-publish-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading
                  ? <><span className="cp-spinner" /> Publishing…</>
                  : <><i className="fa fa-paper-plane" /> Publish listing</>
                }
              </button>
            </div>
            <p className="cp-submit-note">
              Your listing appears in your district immediately after publishing.
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default CreateProperty;