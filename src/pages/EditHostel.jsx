import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHostel } from '../context/HostelContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave, FaSpinner, FaCheckCircle, FaTrash, FaUpload } from 'react-icons/fa';

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

  body { font-family: var(--font); background: var(--off-white); color: var(--dark); }
  a { text-decoration: none; color: inherit; }
  button { font-family: var(--font); cursor: pointer; }

  /* ── PAGE ── */
  .eh-page {
    min-height: 100vh;
    background: var(--off-white);
    padding-top: 64px;
  }

  /* ── TOP NAV ── */
  .eh-topnav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: var(--navy);
    padding: 0 1.5rem; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 2px 16px rgba(15,25,35,0.3);
  }
  .eh-topnav-left { display: flex; align-items: center; gap: 1rem; }
  .eh-logo { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; }
  .eh-logo-icon {
    width: 34px; height: 34px; border-radius: 8px; overflow: hidden;
    border: 2px solid var(--amber); background: white; flex-shrink: 0;
  }
  .eh-logo-icon img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .eh-logo-name { font-size: 1.05rem; font-weight: 800; color: white; letter-spacing: -0.3px; }

  .eh-back-btn {
    display: flex; align-items: center; gap: 0.45rem;
    background: rgba(255,255,255,0.09); border: 1.5px solid rgba(255,255,255,0.15);
    padding: 0.45rem 1rem; border-radius: 8px;
    font-weight: 700; color: rgba(255,255,255,0.82); cursor: pointer;
    transition: var(--transition); font-size: 0.85rem; font-family: var(--font);
  }
  .eh-back-btn:hover { background: rgba(255,255,255,0.16); color: white; }

  .eh-save-btn {
    display: flex; align-items: center; gap: 0.5rem;
    background: var(--amber); border: none;
    padding: 0.55rem 1.3rem; border-radius: 9px;
    font-weight: 800; color: var(--navy); cursor: pointer;
    transition: var(--transition); font-size: 0.88rem; font-family: var(--font);
    box-shadow: 0 4px 14px rgba(245,166,35,0.35);
  }
  .eh-save-btn:hover:not(:disabled) { background: var(--amber-dark); color: white; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(245,166,35,0.4); }
  .eh-save-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; box-shadow: none; }

  /* ── BANNER ── */
  .eh-banner {
    background: var(--navy);
    padding: 2.5rem 1.5rem 3rem;
    position: relative; overflow: hidden;
  }
  .eh-banner::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 70% 50%, rgba(245,166,35,0.08) 0%, transparent 60%);
    pointer-events: none;
  }
  .eh-banner::after {
    content: ''; position: absolute; right: -60px; top: -60px;
    width: 260px; height: 260px; border-radius: 50%;
    background: rgba(245,166,35,0.04); border: 1px solid rgba(245,166,35,0.1);
    pointer-events: none;
  }
  .eh-banner-inner { max-width: 800px; margin: 0 auto; position: relative; z-index: 1; }
  .eh-banner-eyebrow {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase;
    color: var(--amber); margin-bottom: 0.6rem;
    background: rgba(245,166,35,0.12); padding: 4px 10px; border-radius: 6px;
    border: 1px solid rgba(245,166,35,0.25);
  }
  .eh-banner h1 {
    font-size: clamp(1.5rem, 4vw, 2.2rem); font-weight: 900; color: white;
    line-height: 1.2; margin-bottom: 0.4rem; letter-spacing: -0.5px;
  }
  .eh-banner h1 em { font-style: normal; color: var(--amber); }
  .eh-banner p { font-size: 0.88rem; color: rgba(255,255,255,0.5); font-weight: 500; }

  /* ── CONTENT ── */
  .eh-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1.5rem 5rem;
  }

  /* ── FORM SECTION ── */
  .eh-section {
    background: white; border-radius: var(--radius-lg);
    border: 1.5px solid var(--border); margin-bottom: 1.5rem; overflow: hidden;
    box-shadow: var(--shadow-sm);
  }
  .eh-section-head {
    padding: 1.2rem 1.5rem; border-bottom: 1.5px solid var(--border);
    background: var(--off-white); display: flex; align-items: center; gap: 0.5rem;
  }
  .eh-section-head h2 {
    font-size: 0.95rem; font-weight: 900; color: var(--navy); letter-spacing: -0.2px;
  }
  .eh-section-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--amber-light); color: var(--amber-dark);
    display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0;
  }
  .eh-section-body { padding: 1.75rem 1.5rem; }

  /* ── FORM ELEMENTS ── */
  .eh-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; }
  .eh-grid.full { grid-template-columns: 1fr; }
  .eh-grid.two  { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }

  .eh-group { display: flex; flex-direction: column; }
  .eh-label {
    font-size: 0.75rem; font-weight: 800; color: var(--navy);
    margin-bottom: 0.45rem; text-transform: uppercase; letter-spacing: 0.6px;
  }
  .eh-label.req::after { content: ' *'; color: var(--danger); }

  .eh-input, .eh-textarea, .eh-select {
    padding: 0.72rem 1rem; border: 1.5px solid var(--border); border-radius: var(--radius);
    font-family: var(--font); font-size: 0.92rem; color: var(--dark);
    transition: var(--transition); background: white; outline: none;
    -webkit-appearance: none; appearance: none;
  }
  .eh-input:focus, .eh-textarea:focus, .eh-select:focus {
    border-color: var(--amber); box-shadow: 0 0 0 3px rgba(245,166,35,0.14);
  }
  .eh-textarea { resize: vertical; min-height: 100px; }
  .eh-help { font-size: 0.72rem; color: var(--mid); margin-top: 0.3rem; line-height: 1.5; }

  /* ── PRICE INPUT ── */
  .eh-price-wrap { position: relative; }
  .eh-price-symbol {
    position: absolute; left: 1rem; top: 50%; transform: translateY(-50%);
    font-weight: 800; color: var(--mid); pointer-events: none; font-size: 0.88rem;
  }
  .eh-price-wrap .eh-input { padding-left: 2.8rem; }

  /* ── AMENITIES ── */
  .eh-amenities-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.75rem;
  }
  .eh-amenity {
    display: flex; align-items: center; gap: 0.65rem;
    padding: 0.85rem 1rem; background: var(--off-white);
    border: 1.5px solid var(--border); border-radius: var(--radius);
    cursor: pointer; transition: var(--transition);
  }
  .eh-amenity:hover { border-color: var(--amber); background: var(--amber-light); }
  .eh-amenity.checked { border-color: var(--amber); background: var(--amber-light); }
  .eh-amenity input {
    width: 16px; height: 16px; cursor: pointer;
    accent-color: var(--amber); flex-shrink: 0;
  }
  .eh-amenity label { cursor: pointer; font-size: 0.84rem; font-weight: 600; color: var(--dark); line-height: 1.3; }
  .eh-amenity.checked label { color: var(--amber-dark); }

  /* ── IMAGE UPLOAD ── */
  .eh-upload-area {
    border: 2px dashed var(--border); border-radius: var(--radius-lg);
    padding: 2rem; text-align: center; cursor: pointer; transition: var(--transition);
    background: var(--off-white); display: block;
  }
  .eh-upload-area:hover { border-color: var(--amber); background: var(--amber-light); }
  .eh-upload-icon { font-size: 2rem; color: var(--amber); margin-bottom: 0.5rem; }
  .eh-upload-text { font-size: 0.9rem; font-weight: 700; color: var(--navy); margin-bottom: 0.2rem; }
  .eh-upload-sub { font-size: 0.75rem; color: var(--mid); }

  .eh-images-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 0.75rem; margin-top: 1.25rem;
  }
  .eh-img-item {
    position: relative; border-radius: var(--radius); overflow: hidden;
    background: var(--light-gray); aspect-ratio: 1; border: 1.5px solid var(--border);
  }
  .eh-img-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .eh-img-remove {
    position: absolute; top: 0.4rem; right: 0.4rem;
    background: var(--danger); color: white; border: none;
    width: 26px; height: 26px; border-radius: 50%; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.2s; font-size: 0.7rem;
  }
  .eh-img-item:hover .eh-img-remove { opacity: 1; }

  /* ── SUCCESS BANNER ── */
  .eh-success {
    background: var(--success-pale); border: 1.5px solid #6ee7b7; border-radius: var(--radius);
    padding: 1rem 1.25rem; margin-bottom: 1.5rem;
    display: flex; align-items: center; gap: 0.75rem;
    color: #065f46; font-weight: 700; font-size: 0.88rem;
  }
  .eh-success svg { font-size: 1.1rem; flex-shrink: 0; color: var(--success); }

  /* ── SUBMIT BTN ── */
  .eh-submit {
    width: 100%; padding: 1rem; margin-top: 0.5rem;
    background: var(--amber); color: var(--navy);
    border: none; border-radius: var(--radius); font-size: 1rem; font-weight: 800;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    cursor: pointer; transition: var(--transition);
    box-shadow: 0 4px 16px rgba(245,166,35,0.35);
  }
  .eh-submit:hover:not(:disabled) { background: var(--amber-dark); color: white; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(245,166,35,0.4); }
  .eh-submit:disabled { opacity: 0.55; cursor: not-allowed; transform: none; box-shadow: none; }

  /* ── NOT FOUND ── */
  .eh-notfound {
    max-width: 400px; margin: 6rem auto; text-align: center; padding: 0 1.5rem;
  }
  .eh-notfound h2 { font-size: 1.3rem; font-weight: 900; color: var(--navy); margin-bottom: 0.75rem; }
  .eh-notfound p  { color: var(--mid); font-size: 0.88rem; margin-bottom: 1.5rem; }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .eh-section-body { padding: 1.25rem 1rem; }
    .eh-grid { grid-template-columns: 1fr; }
    .eh-amenities-grid { grid-template-columns: repeat(2, 1fr); }
    .eh-images-grid { grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); }
  }
  @media (max-width: 520px) {
    .eh-topnav { padding: 0 1rem; }
    .eh-banner { padding: 1.5rem 1rem 2.5rem; }
    .eh-content { padding: 1.25rem 1rem 4rem; }
    .eh-amenities-grid { grid-template-columns: 1fr; }
    .eh-logo-name { display: none; }
  }
`;

const AMENITIES = [
  'WiFi',
  'Water 24/7',
  'Electricity',
  'Parking',
  'Kitchen',
  'Laundry',
  'Security Guard',
  'CCTV',
  'Air Conditioning',
  'Hot Shower',
  'Furniture Included',
  'Common Room',
  'Shops',
];

const PROPERTY_TYPES = [
  { value: 'house',      label: 'House'           },
  { value: 'apartment',  label: 'Flat / Apartment' },
  { value: 'room',       label: 'Single Room'      },
  { value: 'self',       label: 'Self-Contained'   },
  { value: 'land',       label: 'Plot of Land'     },
  { value: 'commercial', label: 'Commercial Space' },
];

const EditHostel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentHostel, loading, fetchHostelById, updateHostel } = useHostel();
  const { isAuthenticated } = useAuth();

  const [saving, setSaving]   = useState(false);
  const [saved,  setSaved]    = useState(false);
  const [formData, setFormData] = useState({
    name:        '',
    description: '',
    address:     '',
    district:    '',
    type:        '',
    price:       '',
    contractType:'rent',
    amenities:   [],
    images:      [],
  });

  useEffect(() => {
    if (id) fetchHostelById(id);
  }, [id]);

  useEffect(() => {
    if (currentHostel) {
      setFormData({
        name:         currentHostel.name        || '',
        description:  currentHostel.description || '',
        address:      currentHostel.address     || '',
        district:     currentHostel.district    || '',
        type:         currentHostel.type        || '',
        price:        currentHostel.price       || '',
        contractType: currentHostel.contractType || currentHostel.listingType || 'rent',
        amenities:    currentHostel.amenities   || [],
        images:       currentHostel.images      || [],
      });
    }
  }, [currentHostel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? (parseInt(value) || 0) : value,
    }));
  };

  const toggleAmenity = (a) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter(x => x !== a)
        : [...prev.amenities, a],
    }));
  };

  const handleImageUpload = (e) => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ev.target.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (i) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateHostel(id, formData);
      toast.success('Property updated successfully!');
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  /* ── LOADING ── */
  if (loading && !currentHostel) {
    return (
      <>
        <style>{styles}</style>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--off-white)' }}>
          <FaSpinner style={{ animation: 'spin 0.8s linear infinite', fontSize: '2.2rem', color: '#f5a623' }} />
        </div>
      </>
    );
  }

  /* ── NOT FOUND ── */
  if (!currentHostel && !loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="eh-page">
          <nav className="eh-topnav">
            <div className="eh-topnav-left">
              <button className="eh-back-btn" onClick={() => navigate(-1)}><FaArrowLeft /> Back</button>
            </div>
          </nav>
          <div className="eh-notfound">
            <h2>Property not found</h2>
            <p>This property may have been removed or you may not have access.</p>
            <button className="eh-save-btn" onClick={() => navigate('/landlord-dashboard')}>Go to Dashboard</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="eh-page">

        {/* ── TOP NAV ── */}
        <nav className="eh-topnav">
          <div className="eh-topnav-left">
            <a href="/" className="eh-logo">
              <div className="eh-logo-icon"><img src="/PEZ.png" alt="PezaNyumba" /></div>
              <span className="eh-logo-name">PezaNyumba</span>
            </a>
            <button className="eh-back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft /> Back
            </button>
          </div>
          <button className="eh-save-btn" onClick={handleSubmit} disabled={saving}>
            {saving
              ? <><FaSpinner style={{ animation: 'spin 0.8s linear infinite' }} /> Saving…</>
              : <><FaSave /> Save Changes</>}
          </button>
        </nav>

        {/* ── BANNER ── */}
        <section className="eh-banner">
          <div className="eh-banner-inner">
            <div className="eh-banner-eyebrow">✏️ Edit Property</div>
            <h1>Update <em>Your Listing</em></h1>
            <p>Edit your property details, pricing, amenities, and photos</p>
          </div>
        </section>

        <div className="eh-content">
          {saved && (
            <div className="eh-success">
              <FaCheckCircle />
              Property updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* ── BASIC INFORMATION ── */}
            <div className="eh-section">
              <div className="eh-section-head">
                <div className="eh-section-icon">📋</div>
                <h2>Basic Information</h2>
              </div>
              <div className="eh-section-body">
                <div className="eh-grid">
                  <div className="eh-group">
                    <label className="eh-label req">Property Name</label>
                    <input className="eh-input" type="text" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="eh-group">
                    <label className="eh-label req">Property Type</label>
                    <select className="eh-select" name="type" value={formData.type} onChange={handleChange}>
                      <option value="">Select type…</option>
                      {PROPERTY_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="eh-grid" style={{ marginTop: '1.25rem' }}>
                  <div className="eh-group">
                    <label className="eh-label req">Address</label>
                    <input className="eh-input" type="text" name="address" value={formData.address} onChange={handleChange} required />
                    <p className="eh-help">Include street, area name, and nearby landmarks</p>
                  </div>
                  <div className="eh-group">
                    <label className="eh-label req">District</label>
                    <select className="eh-select" name="district" value={formData.district} onChange={handleChange}>
                      <option value="">Select district…</option>
                      <optgroup label="Northern Region">
                        {['Chitipa','Karonga','Likoma','Mzimba','Nkhata Bay','Rumphi'].map(d => <option key={d}>{d}</option>)}
                      </optgroup>
                      <optgroup label="Central Region">
                        {['Dedza','Dowa','Kasungu','Lilongwe','Mchinji','Nkhotakota','Ntcheu','Ntchisi','Salima'].map(d => <option key={d}>{d}</option>)}
                      </optgroup>
                      <optgroup label="Southern Region">
                        {['Balaka','Blantyre','Chikwawa','Chiradzulu','Machinga','Mangochi','Mulanje','Mwanza','Neno','Nsanje','Thyolo','Phalombe','Zomba','Chiradzulu'].map(d => <option key={d}>{d}</option>)}
                      </optgroup>
                    </select>
                  </div>
                </div>
                <div className="eh-grid full" style={{ marginTop: '1.25rem' }}>
                  <div className="eh-group">
                    <label className="eh-label req">Description</label>
                    <textarea className="eh-textarea" name="description" value={formData.description} onChange={handleChange} required placeholder="Describe the property — location advantages, nearby services, condition…" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── PRICING & CONTRACT ── */}
            <div className="eh-section">
              <div className="eh-section-head">
                <div className="eh-section-icon">💰</div>
                <h2>Pricing &amp; Contract</h2>
              </div>
              <div className="eh-section-body">
                <div className="eh-grid two">
                  <div className="eh-group">
                    <label className="eh-label req">Price (MWK)</label>
                    <div className="eh-price-wrap">
                      <span className="eh-price-symbol">MK</span>
                      <input className="eh-input" type="number" name="price" value={formData.price} onChange={handleChange} required min="0" placeholder="e.g. 50000" />
                    </div>
                    <p className="eh-help">Monthly rent or sale price in Malawian Kwacha</p>
                  </div>
                  <div className="eh-group">
                    <label className="eh-label req">Listing Type</label>
                    <select className="eh-select" name="contractType" value={formData.contractType} onChange={handleChange}>
                      <option value="rent">For Rent</option>
                      <option value="sale">For Sale</option>
                    </select>
                    <p className="eh-help">Is this property for rent or for sale?</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── AMENITIES ── */}
            <div className="eh-section">
              <div className="eh-section-head">
                <div className="eh-section-icon">✨</div>
                <h2>Amenities</h2>
              </div>
              <div className="eh-section-body">
                <label className="eh-label">Select Available Amenities</label>
                <div className="eh-amenities-grid" style={{ marginTop: '0.75rem' }}>
                  {AMENITIES.map(a => (
                    <div key={a} className={`eh-amenity${formData.amenities.includes(a) ? ' checked' : ''}`}>
                      <input
                        type="checkbox"
                        id={`am-${a}`}
                        checked={formData.amenities.includes(a)}
                        onChange={() => toggleAmenity(a)}
                      />
                      <label htmlFor={`am-${a}`}>{a}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── PHOTOS ── */}
            <div className="eh-section">
              <div className="eh-section-head">
                <div className="eh-section-icon">📸</div>
                <h2>Photos</h2>
              </div>
              <div className="eh-section-body">
                <label htmlFor="eh-img-upload" className="eh-upload-area">
                  <div className="eh-upload-icon"><FaUpload /></div>
                  <div className="eh-upload-text">Click to upload photos</div>
                  <div className="eh-upload-sub">JPG, PNG — up to 5 MB each</div>
                </label>
                <input id="eh-img-upload" type="file" style={{ display: 'none' }} multiple accept="image/*" onChange={handleImageUpload} />

                {formData.images.length > 0 && (
                  <div>
                    <label className="eh-label" style={{ marginTop: '1.25rem', display: 'block' }}>
                      Uploaded Photos ({formData.images.length})
                    </label>
                    <div className="eh-images-grid">
                      {formData.images.map((src, i) => (
                        <div key={i} className="eh-img-item">
                          <img src={src} alt={`Property photo ${i + 1}`} />
                          <button type="button" className="eh-img-remove" onClick={() => removeImage(i)}>
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="eh-submit" disabled={saving}>
              {saving
                ? <><FaSpinner style={{ animation: 'spin 0.8s linear infinite' }} /> Saving Changes…</>
                : <><FaSave /> Update Property</>}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditHostel;