import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHostel } from '../context/HostelContext';
import { toast } from 'react-toastify';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Select from '../components/common/Select';
import { HOSTEL_TYPES, GENDER_OPTIONS, AMENITIES, CAMPUS_LOCATION } from '../utils/constants';
import { FaHome, FaMapMarkerAlt, FaDollarSign, FaBed, FaCheckCircle, FaPlus, FaTrash, FaCamera, FaTimes } from 'react-icons/fa';
import ImageUpload from '../components/common/ImageUpload';
import '../styles/global.css';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy:#0d1b3e; --navy2:#112255; --blue:#1a3fa4; --orange:#e8501a;
    --text-dark:#111827; --text-mid:#4b5563; --card-radius:14px;
    --success:#10b981; --white:#ffffff; --gray:#6b7280;
    --light-gray:#e5e7eb; --gray-lighter:#f4f6fb;
    --primary-color:#e8501a; --primary-dark:#c43f12;
    --primary-light:rgba(232,80,26,0.1); --error:#ef4444;
  }
  html,body,#root{height:100%;width:100%;overflow:hidden;font-family:'Manrope',sans-serif;}

  .rp-bar{position:fixed;top:0;left:0;right:0;z-index:500;height:60px;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;background:rgba(8,18,48,0.97);backdrop-filter:blur(8px);box-shadow:0 2px 18px rgba(0,0,0,0.4);}
  .rp-bar-logo{display:flex;align-items:center;gap:9px;text-decoration:none;}
  .rp-bar-logo-img{width:36px;height:36px;border-radius:50%;overflow:hidden;flex-shrink:0;}
  .rp-bar-logo-img img{width:100%;height:100%;object-fit:cover;}
  .rp-bar-brand strong{display:block;color:#fff;font-size:0.9rem;font-weight:800;letter-spacing:1px;}
  .rp-bar-brand span{color:rgba(255,255,255,0.42);font-size:0.56rem;}
  .rp-bar-actions{display:flex;align-items:center;gap:0.6rem;}
  .rp-bar-login{color:rgba(255,255,255,0.78);font-size:0.82rem;font-weight:600;background:transparent;border:1.5px solid rgba(255,255,255,0.2);padding:0.36rem 0.95rem;border-radius:6px;cursor:pointer;text-decoration:none;transition:all 0.18s;display:flex;align-items:center;gap:5px;}
  .rp-bar-login:hover{border-color:rgba(255,255,255,0.55);color:#fff;}

  .rp-main-content{position:fixed;top:60px;left:0;right:0;bottom:0;overflow-y:auto;background:var(--gray-lighter);padding:2rem 1rem;}
  .rp-container{max-width:900px;margin:0 auto;}

  .rp-header{text-align:center;margin-bottom:2rem;}
  .rp-header h1{font-size:2rem;font-weight:800;margin-bottom:0.5rem;color:var(--orange);display:flex;align-items:center;justify-content:center;gap:0.5rem;}
  .rp-header p{color:var(--gray);font-size:1rem;}

  .rp-progress{display:flex;justify-content:space-between;margin-bottom:2rem;position:relative;}
  .rp-progress-line{position:absolute;top:20px;left:0;right:0;height:4px;background-color:var(--light-gray);z-index:0;}
  .rp-progress-fill{height:100%;background-color:var(--orange);transition:width 0.3s ease;}
  .rp-step{flex:1;text-align:center;position:relative;z-index:1;}
  .rp-step-circle{width:40px;height:40px;border-radius:50%;background-color:var(--light-gray);color:var(--white);display:flex;align-items:center;justify-content:center;margin:0 auto 0.5rem;font-weight:700;transition:all 0.3s ease;}
  .rp-step-circle.active{background-color:var(--orange);}
  .rp-step-circle.completed{background-color:var(--success);}
  .rp-step-label{font-size:0.8rem;color:var(--gray);transition:color 0.3s ease;}
  .rp-step-label.active{color:var(--orange);font-weight:600;}

  .rp-card{background:var(--white);border-radius:var(--card-radius);box-shadow:0 8px 40px rgba(13,27,62,0.12);padding:2rem;width:100%;}
  .rp-card h2{font-size:1.3rem;font-weight:700;color:var(--navy);margin-bottom:1.5rem;display:flex;align-items:center;gap:0.5rem;}
  .rp-card h2 svg{color:var(--orange);}

  .rp-form-group{margin-bottom:1.2rem;}
  .rp-label{display:block;font-size:0.7rem;font-weight:700;color:var(--text-mid);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.3rem;}
  .rp-required{color:var(--error);margin-left:2px;}
  .rp-tip{font-size:0.75rem;color:var(--gray);margin-top:0.2rem;margin-bottom:1rem;}
  .rp-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:0.5rem;}
  .rp-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;}

  .rp-amenities-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:0.75rem;margin-top:0.5rem;margin-bottom:1rem;}
  .rp-amenity-btn{padding:0.75rem;border-radius:8px;border:2px solid var(--light-gray);background:var(--white);color:var(--text-dark);cursor:pointer;font-size:0.85rem;transition:all 0.2s ease;display:flex;align-items:center;justify-content:center;gap:0.5rem;font-family:'Manrope',sans-serif;font-weight:500;}
  .rp-amenity-btn:hover{border-color:var(--blue);}
  .rp-amenity-btn.selected{border-color:var(--orange);background:var(--primary-light);color:var(--orange);font-weight:600;}
  .rp-selected-count{margin-top:1rem;padding:0.75rem;background:var(--success);color:var(--white);border-radius:8px;text-align:center;font-size:0.85rem;font-weight:600;}

  .rp-nav-buttons{display:flex;justify-content:space-between;margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--light-gray);}
  .rp-btn-outline{background:transparent;border:2px solid var(--orange);color:var(--orange);padding:0.6rem 1.5rem;border-radius:8px;font-weight:600;font-size:0.9rem;cursor:pointer;transition:all 0.2s;font-family:'Manrope',sans-serif;}
  .rp-btn-outline:hover{background:var(--primary-light);transform:translateY(-2px);}
  .rp-btn-primary{background:var(--orange);border:none;color:var(--white);padding:0.6rem 1.5rem;border-radius:8px;font-weight:600;font-size:0.9rem;cursor:pointer;transition:all 0.2s;font-family:'Manrope',sans-serif;display:flex;align-items:center;gap:0.5rem;margin-left:auto;}
  .rp-btn-primary:hover:not(:disabled){opacity:0.9;transform:translateY(-2px);}
  .rp-btn-primary:disabled{opacity:0.6;cursor:not-allowed;}
  .rp-spinner{width:14px;height:14px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg);}}

  .room-card{background:#f9fafb;border:1.5px solid var(--light-gray);border-radius:12px;padding:1.25rem;margin-bottom:1rem;position:relative;}
  .room-card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;}
  .room-card-title{font-size:0.95rem;font-weight:800;color:var(--navy);}
  .room-delete-btn{background:#fef2f2;border:1px solid #fecaca;color:#dc2626;border-radius:7px;padding:0.3rem 0.6rem;cursor:pointer;font-size:0.8rem;display:flex;align-items:center;gap:0.3rem;transition:all 0.2s;font-family:'Manrope',sans-serif;}
  .room-delete-btn:hover{background:#dc2626;color:white;}
  .room-images-row{display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.75rem;}
  .room-img-thumb{width:70px;height:70px;border-radius:8px;object-fit:cover;border:2px solid var(--light-gray);}
  .room-img-add{width:70px;height:70px;border-radius:8px;border:2px dashed var(--light-gray);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;font-size:0.65rem;color:var(--gray);gap:0.2rem;transition:all 0.2s;background:white;}
  .room-img-add:hover{border-color:var(--orange);color:var(--orange);}
  .room-img-wrap{position:relative;}
  .room-img-remove{position:absolute;top:-5px;right:-5px;width:18px;height:18px;background:var(--error);border:none;border-radius:50%;color:white;font-size:0.6rem;cursor:pointer;display:flex;align-items:center;justify-content:center;}
  .add-room-btn{width:100%;padding:0.85rem;border:2px dashed var(--orange);border-radius:10px;background:var(--primary-light);color:var(--orange);font-weight:700;font-size:0.9rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.5rem;transition:all 0.2s;font-family:'Manrope',sans-serif;margin-top:0.5rem;}
  .add-room-btn:hover{background:var(--orange);color:white;}
  .rooms-summary{background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:8px;padding:0.75rem 1rem;margin-bottom:1rem;font-size:0.82rem;color:#1d4ed8;font-weight:600;display:flex;align-items:center;gap:0.5rem;}
  .room-input{width:100%;padding:0.6rem 0.75rem;border:1.5px solid var(--light-gray);border-radius:8px;font-size:0.875rem;font-family:'Manrope',sans-serif;outline:none;transition:border-color 0.2s;}
  .room-input:focus{border-color:var(--orange);}

  @media(max-width:768px){
    .rp-bar{padding:0 1rem;}
    .rp-bar-brand{display:none;}
    .rp-grid-2,.rp-grid-3{grid-template-columns:1fr;}
  }
`;

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_PRESET);
  const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
  const data = await res.json();
  return data.secure_url;
};

const CreateHostel = () => {
  const navigate = useNavigate();
  const { createHostel, loading } = useHostel();
  const roomImgRefs = useRef({});

  const [formData, setFormData] = useState({
    name: '', description: '', type: '', price: '',
    address: '',
    location: { lat: CAMPUS_LOCATION.lat, lng: CAMPUS_LOCATION.lng },
    totalRooms: '', availableRooms: '',
    amenities: [], gender: '', contactPhone: '', images: [],
    rooms: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [uploadingRoom, setUploadingRoom] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({ ...prev, location: { ...prev.location, [field]: value } }));
  };

  const addRoom = () => {
    setFormData(prev => ({
      ...prev,
      rooms: [...prev.rooms, {
        id: Date.now(),
        roomNumber: `Room ${prev.rooms.length + 1}`,
        totalBedspaces: '',
        availableBedspaces: '',
        price: '',
        description: '',
        images: []
      }]
    }));
  };

  const updateRoom = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => r.id === id ? { ...r, [field]: value } : r)
    }));
  };

  const removeRoom = (id) => {
    setFormData(prev => ({ ...prev, rooms: prev.rooms.filter(r => r.id !== id) }));
  };

  const handleRoomImageUpload = async (roomId, files) => {
    if (!files || files.length === 0) return;
    setUploadingRoom(prev => ({ ...prev, [roomId]: true }));
    try {
      const urls = await Promise.all(
        Array.from(files).map(f => uploadImageToCloudinary(f))
      );
      setFormData(prev => ({
        ...prev,
        rooms: prev.rooms.map(r =>
          r.id === roomId ? { ...r, images: [...r.images, ...urls] } : r
        )
      }));
    } catch {
      toast.error('Failed to upload room images');
    } finally {
      setUploadingRoom(prev => ({ ...prev, [roomId]: false }));
    }
  };

  const removeRoomImage = (roomId, imgUrl) => {
    setFormData(prev => ({
      ...prev,
      rooms: prev.rooms.map(r =>
        r.id === roomId ? { ...r, images: r.images.filter(i => i !== imgUrl) } : r
      )
    }));
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.description || !formData.type) {
      toast.error('Please fill in all basic information'); return false;
    }
    if (formData.name.length < 5) { toast.error('Hostel name must be at least 5 characters'); return false; }
    if (formData.description.length < 20) { toast.error('Description must be at least 20 characters'); return false; }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.price || !formData.address || !formData.contactPhone) {
      toast.error('Please fill in all location and pricing details'); return false;
    }
    if (formData.price <= 0) { toast.error('Price must be greater than 0'); return false; }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.totalRooms || !formData.availableRooms || !formData.gender) {
      toast.error('Please fill in room details and gender preference'); return false;
    }
    if (Number(formData.availableRooms) > Number(formData.totalRooms)) {
      toast.error('Available rooms cannot exceed total rooms'); return false;
    }
    if (formData.amenities.length === 0) {
      toast.error('Please select at least one amenity'); return false;
    }
    return true;
  };

  const validateStep4 = () => {
    for (const room of formData.rooms) {
      if (!room.roomNumber?.trim()) { toast.error('All rooms must have a room number'); return false; }
      if (!room.totalBedspaces || room.totalBedspaces < 1) { toast.error(`Room ${room.roomNumber}: total bedspaces must be at least 1`); return false; }
      if (room.availableBedspaces === '' || room.availableBedspaces === undefined) { toast.error(`Room ${room.roomNumber}: please enter available bedspaces`); return false; }
      if (Number(room.availableBedspaces) > Number(room.totalBedspaces)) { toast.error(`Room ${room.roomNumber}: available bedspaces cannot exceed total`); return false; }
    }
    return true;
  };

  // ✅ FIX: always prevent default, only advance if validation passes
  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
    else if (currentStep === 3 && validateStep3()) setCurrentStep(4);
  };

  const prevStep = (e) => {
    e.preventDefault();
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep4()) return;
    try {
      const hostelData = {
        ...formData,
        price: Number(formData.price),
        totalRooms: Number(formData.totalRooms),
        availableRooms: Number(formData.availableRooms),
        location: {
          lat: Number(formData.location.lat),
          lng: Number(formData.location.lng)
        },
        rooms: formData.rooms.map(r => ({
          roomNumber: r.roomNumber,
          totalBedspaces: Number(r.totalBedspaces),
          availableBedspaces: Number(r.availableBedspaces),
          price: Number(r.price) || 0,
          description: r.description || '',
          images: r.images || []
        }))
      };
      await createHostel(hostelData);
      toast.success('🎉 Hostel created successfully!');
      navigate('/landlord-dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  const steps = ['Basic Info', 'Location & Price', 'Details', 'Rooms'];
  const progressWidth = `${((currentStep - 1) / (steps.length - 1)) * 100}%`;

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      <nav className="rp-bar">
        <Link to="/" className="rp-bar-logo">
          <div className="rp-bar-logo-img"><img src="/PezaHostelLogo.png" alt="PezaHostel" /></div>
          <div className="rp-bar-brand">
            <strong>PEZAHOSTEL</strong>
            <span>OFF-CAMPUS ACCOMMODATION</span>
          </div>
        </Link>
        <div className="rp-bar-actions">
          <Link to="/landlord-dashboard" className="rp-bar-login">
            <i className="fa fa-arrow-left"></i> Dashboard
          </Link>
        </div>
      </nav>

      <div className="rp-main-content">
        <div className="rp-container">

          <div className="rp-header">
            <h1><FaHome /> List Your Hostel</h1>
            <p>Connect with MUBAS students looking for accommodation</p>
          </div>

          {/* Progress */}
          <div className="rp-progress">
            <div className="rp-progress-line">
              <div className="rp-progress-fill" style={{ width: progressWidth }} />
            </div>
            {steps.map((label, i) => (
              <div key={i} className="rp-step">
                <div className={`rp-step-circle ${currentStep > i + 1 ? 'completed' : currentStep === i + 1 ? 'active' : ''}`}>
                  {currentStep > i + 1 ? '✓' : i + 1}
                </div>
                <p className={`rp-step-label ${currentStep >= i + 1 ? 'active' : ''}`}>{label}</p>
              </div>
            ))}
          </div>

          {/* ✅ FIX: form only submits on step 4 publish button */}
          <form onSubmit={handleSubmit}>
            <div className="rp-card">

              {/* STEP 1 */}
              {currentStep === 1 && (
                <div>
                  <h2><FaHome /> Basic Information</h2>
                  <div className="rp-form-group">
                    <label className="rp-label">Hostel Name <span className="rp-required">*</span></label>
                    <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Green Valley Hostel" />
                  </div>
                  <div className="rp-form-group">
                    <label className="rp-label">Description <span className="rp-required">*</span></label>
                    <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe your hostel..." rows={5} />
                  </div>
                  <div className="rp-form-group">
                    <label className="rp-label">Room Type <span className="rp-required">*</span></label>
                    <Select name="type" value={formData.type} onChange={handleChange} options={HOSTEL_TYPES.map(t => ({ value: t, label: t }))} />
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {currentStep === 2 && (
                <div>
                  <h2><FaMapMarkerAlt /> Location & Pricing</h2>
                  <div className="rp-form-group">
                    <label className="rp-label">Address <span className="rp-required">*</span></label>
                    <Input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="e.g., Chirimba Road, Blantyre" />
                  </div>
                  <div className="rp-grid-2">
                    <div className="rp-form-group">
                      <label className="rp-label">Latitude</label>
                      <Input type="number" step="any" value={formData.location.lat} onChange={e => handleLocationChange('lat', e.target.value)} placeholder="-15.8020" />
                    </div>
                    <div className="rp-form-group">
                      <label className="rp-label">Longitude</label>
                      <Input type="number" step="any" value={formData.location.lng} onChange={e => handleLocationChange('lng', e.target.value)} placeholder="35.0259" />
                    </div>
                  </div>
                  <p className="rp-tip">💡 Use Google Maps to find exact coordinates</p>
                  <div className="rp-form-group">
                    <label className="rp-label">Monthly Price (MWK) <span className="rp-required">*</span></label>
                    <Input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="e.g., 45000" icon={<FaDollarSign />} />
                  </div>
                  <div className="rp-form-group">
                    <label className="rp-label">Contact Phone Number <span className="rp-required">*</span></label>
                    <Input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} placeholder="e.g., 0986584136" />
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {currentStep === 3 && (
                <div>
                  <h2><FaBed /> Room Details & Amenities</h2>
                  <div className="rp-grid-2">
                    <div className="rp-form-group">
                      <label className="rp-label">Total Rooms <span className="rp-required">*</span></label>
                      <Input type="number" name="totalRooms" value={formData.totalRooms} onChange={handleChange} placeholder="e.g., 20" />
                    </div>
                    <div className="rp-form-group">
                      <label className="rp-label">Available Rooms <span className="rp-required">*</span></label>
                      <Input type="number" name="availableRooms" value={formData.availableRooms} onChange={handleChange} placeholder="e.g., 15" />
                    </div>
                  </div>
                  <div className="rp-form-group">
                    <label className="rp-label">Gender Preference <span className="rp-required">*</span></label>
                    <Select name="gender" value={formData.gender} onChange={handleChange} options={GENDER_OPTIONS} />
                  </div>
                  <div className="rp-form-group">
                    <label className="rp-label">Amenities <span className="rp-required">*</span></label>
                    <div className="rp-amenities-grid">
                      {AMENITIES.map(amenity => {
                        const isSelected = formData.amenities.includes(amenity);
                        return (
                          <button key={amenity} type="button" onClick={() => handleAmenityToggle(amenity)} className={`rp-amenity-btn${isSelected ? ' selected' : ''}`}>
                            {isSelected && <FaCheckCircle />} {amenity}
                          </button>
                        );
                      })}
                    </div>
                    {formData.amenities.length > 0 && (
                      <div className="rp-selected-count">✅ {formData.amenities.length} amenity(ies) selected</div>
                    )}
                  </div>
                  <ImageUpload
                    images={formData.images}
                    onImagesChange={newImages => setFormData(prev => ({ ...prev, images: newImages }))}
                    maxImages={10}
                  />
                </div>
              )}

              {/* STEP 4 — ROOMS */}
              {currentStep === 4 && (
                <div>
                  <h2><FaBed /> Room Details & Bedspaces</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-mid)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                    Add each room individually with its bedspace count and photos. This helps students see exactly what is available.
                  </p>

                  {formData.rooms.length > 0 && (
                    <div className="rooms-summary">
                      <i className="fa fa-info-circle" />
                      {formData.rooms.length} room(s) added ·{' '}
                      {formData.rooms.reduce((a, r) => a + (Number(r.totalBedspaces) || 0), 0)} total bedspaces ·{' '}
                      {formData.rooms.reduce((a, r) => a + (Number(r.availableBedspaces) || 0), 0)} available
                    </div>
                  )}

                  {formData.rooms.map((room, index) => (
                    <div key={room.id} className="room-card">
                      <div className="room-card-header">
                        <span className="room-card-title">🚪 Room {index + 1}</span>
                        <button type="button" className="room-delete-btn" onClick={() => removeRoom(room.id)}>
                          <FaTrash /> Remove
                        </button>
                      </div>

                      <div className="rp-grid-3">
                        <div className="rp-form-group" style={{ marginBottom: 0 }}>
                          <label className="rp-label">Room Number/Name <span className="rp-required">*</span></label>
                          <input
                            type="text"
                            className="room-input"
                            value={room.roomNumber}
                            onChange={e => updateRoom(room.id, 'roomNumber', e.target.value)}
                            placeholder="e.g., A1 or Room 1"
                          />
                        </div>
                        <div className="rp-form-group" style={{ marginBottom: 0 }}>
                          <label className="rp-label">Total Bedspaces <span className="rp-required">*</span></label>
                          <input
                            type="number"
                            min="1"
                            className="room-input"
                            value={room.totalBedspaces}
                            onChange={e => updateRoom(room.id, 'totalBedspaces', e.target.value)}
                            placeholder="e.g., 4"
                          />
                        </div>
                        <div className="rp-form-group" style={{ marginBottom: 0 }}>
                          <label className="rp-label">Available Bedspaces <span className="rp-required">*</span></label>
                          <input
                            type="number"
                            min="0"
                            className="room-input"
                            value={room.availableBedspaces}
                            onChange={e => updateRoom(room.id, 'availableBedspaces', e.target.value)}
                            placeholder="e.g., 2"
                          />
                        </div>
                      </div>

                      <div style={{ marginTop: '0.75rem' }}>
                        <label className="rp-label">Price per bedspace/month (MWK) — optional</label>
                        <input
                          type="number"
                          min="0"
                          className="room-input"
                          value={room.price}
                          onChange={e => updateRoom(room.id, 'price', e.target.value)}
                          placeholder={`Default: MK ${Number(formData.price).toLocaleString()}`}
                        />
                      </div>

                      <div style={{ marginTop: '0.75rem' }}>
                        <label className="rp-label">Room Description — optional</label>
                        <textarea
                          value={room.description}
                          onChange={e => updateRoom(room.id, 'description', e.target.value)}
                          placeholder="e.g., Corner room with window, very spacious..."
                          rows={2}
                          className="room-input"
                          style={{ resize: 'vertical' }}
                        />
                      </div>

                      {/* Room Images */}
                      <div style={{ marginTop: '0.75rem' }}>
                        <label className="rp-label">Room Photos</label>
                        <div className="room-images-row">
                          {room.images.map((img, i) => (
                            <div key={i} className="room-img-wrap">
                              <img src={img} alt={`Room ${index + 1}`} className="room-img-thumb" />
                              <button type="button" className="room-img-remove" onClick={() => removeRoomImage(room.id, img)}>
                                <FaTimes />
                              </button>
                            </div>
                          ))}
                          <div className="room-img-add" onClick={() => roomImgRefs.current[room.id]?.click()}>
                            {uploadingRoom[room.id]
                              ? <><div className="rp-spinner" style={{ borderTopColor: 'var(--orange)', borderColor: 'var(--light-gray)' }} /><span>Uploading...</span></>
                              : <><FaCamera /><span>Add Photo</span></>
                            }
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: 'none' }}
                            ref={el => roomImgRefs.current[room.id] = el}
                            onChange={e => handleRoomImageUpload(room.id, e.target.files)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button type="button" className="add-room-btn" onClick={addRoom}>
                    <FaPlus /> Add Room
                  </button>

                  {formData.rooms.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--gray)', fontSize: '0.82rem', marginTop: '0.75rem' }}>
                      Rooms are optional but recommended — they help students choose the right bedspace.
                    </p>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="rp-nav-buttons">
                {currentStep > 1 && (
                  <button type="button" className="rp-btn-outline" onClick={prevStep}>
                    ← Previous
                  </button>
                )}
                {currentStep < 4 ? (
                  <button type="button" className="rp-btn-primary" onClick={handleNext}>
                    Next →
                  </button>
                ) : (
                  <button type="submit" className="rp-btn-primary" disabled={loading}>
                    {loading
                      ? <><div className="rp-spinner"></div> Publishing...</>
                      : <>🎉 Publish Hostel</>
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

export default CreateHostel;