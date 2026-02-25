import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHostel } from '../context/HostelContext';
import { toast } from 'react-toastify';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import { HOSTEL_TYPES, GENDER_OPTIONS, AMENITIES, CAMPUS_LOCATION } from '../utils/constants';
import { FaHome, FaMapMarkerAlt, FaDollarSign, FaBed, FaCheckCircle } from 'react-icons/fa';
import ImageUpload from '../components/common/ImageUpload';
import '../styles/global.css';

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
    --success: #10b981;
    --white: #ffffff;
    --gray: #6b7280;
    --light-gray: #e5e7eb;
    --gray-lighter: #f4f6fb;
    --primary-color: #e8501a;
    --primary-dark: #c43f12;
    --primary-light: rgba(232, 80, 26, 0.1);
    --error: #ef4444;
  }

  /* Lock entire page — zero scroll */
  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
    font-family: 'Manrope', sans-serif;
  }

  /* TOPBAR - EXACT same as Register/Login Page */
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

  /* MAIN CONTENT - Scrollable area below topbar */
  .rp-main-content {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    background: var(--gray-lighter);
    padding: 2rem 1rem;
  }

  /* Container */
  .rp-container {
    max-width: 900px;
    margin: 0 auto;
  }

  /* Header */
  .rp-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  .rp-header h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, var(--orange) 0%, var(--primary-dark) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  .rp-header h1 svg {
    -webkit-text-fill-color: var(--orange);
    color: var(--orange);
  }
  .rp-header p {
    color: var(--gray);
    font-size: 1.1rem;
  }

  /* Progress Steps */
  .rp-progress {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
    position: relative;
  }
  .rp-progress-line {
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    height: 4px;
    background-color: var(--light-gray);
    z-index: 0;
  }
  .rp-progress-fill {
    height: 100%;
    background-color: var(--orange);
    width: 0%;
    transition: width 0.3s ease;
  }
  .rp-step {
    flex: 1;
    text-align: center;
    position: relative;
    z-index: 1;
  }
  .rp-step-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--light-gray);
    color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 0.5rem;
    font-weight: 700;
    transition: all 0.3s ease;
  }
  .rp-step-circle.active {
    background-color: var(--orange);
  }
  .rp-step-circle.completed {
    background-color: var(--success);
  }
  .rp-step-label {
    font-size: 0.85rem;
    color: var(--gray);
    transition: color 0.3s ease;
  }
  .rp-step-label.active {
    color: var(--orange);
    font-weight: 600;
  }

  /* Form Card */
  .rp-card {
    background: var(--white);
    border-radius: var(--card-radius);
    box-shadow: 0 8px 40px rgba(13,27,62,0.12);
    padding: 2rem;
    width: 100%;
  }
  .rp-card h2 {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--navy);
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .rp-card h2 svg {
    color: var(--orange);
  }

  /* Form Elements */
  .rp-form-group {
    margin-bottom: 1.2rem;
  }
  .rp-label {
    display: block;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--text-mid);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.3rem;
  }
  .rp-required {
    color: var(--error);
    margin-left: 2px;
  }
  .rp-tip {
    font-size: 0.75rem;
    color: var(--gray);
    margin-top: 0.2rem;
    margin-bottom: 1rem;
  }

  /* Coordinates Grid */
  .rp-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  /* Amenities Grid */
  .rp-amenities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
  }
  .rp-amenity-btn {
    padding: 0.75rem;
    border-radius: 8px;
    border: 2px solid var(--light-gray);
    background: var(--white);
    color: var(--text-dark);
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-family: 'Manrope', sans-serif;
    font-weight: 500;
  }
  .rp-amenity-btn:hover {
    border-color: var(--blue);
  }
  .rp-amenity-btn.selected {
    border-color: var(--orange);
    background: var(--primary-light);
    color: var(--orange);
    font-weight: 600;
  }
  .rp-amenity-btn.selected svg {
    color: var(--orange);
  }
  .rp-selected-count {
    margin-top: 1rem;
    padding: 0.75rem;
    background: var(--success);
    color: var(--white);
    border-radius: 8px;
    text-align: center;
    font-size: 0.85rem;
    font-weight: 600;
  }

  /* Navigation Buttons */
  .rp-nav-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--light-gray);
  }
  .rp-btn-outline {
    background: transparent;
    border: 2px solid var(--orange);
    color: var(--orange);
    padding: 0.6rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Manrope', sans-serif;
  }
  .rp-btn-outline:hover {
    background: var(--primary-light);
    transform: translateY(-2px);
  }
  .rp-btn-primary {
    background: var(--orange);
    border: none;
    color: var(--white);
    padding: 0.6rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Manrope', sans-serif;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;
  }
  .rp-btn-primary:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-2px);
  }
  .rp-btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .rp-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .rp-bar { padding: 0 1rem; }
    .rp-bar-brand { display: none; }
    .rp-header h1 { font-size: 2rem; }
    .rp-grid-2 { grid-template-columns: 1fr; }
  }
`;

const CreateHostel = () => {
  const navigate = useNavigate();
  const { createHostel, loading } = useHostel();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    price: '',
    address: '',
    location: {
      lat: CAMPUS_LOCATION.lat,
      lng: CAMPUS_LOCATION.lng
    },
    totalRooms: '',
    availableRooms: '',
    amenities: [],
    gender: '',
    contactPhone: '',
    images: []
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAmenityToggle = (amenity) => {
    const newAmenities = formData.amenities.includes(amenity)
      ? formData.amenities.filter(a => a !== amenity)
      : [...formData.amenities, amenity];
    
    setFormData({
      ...formData,
      amenities: newAmenities
    });
  };

  const handleLocationChange = (field, value) => {
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        [field]: value
      }
    });
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.description || !formData.type) {
      toast.error('Please fill in all basic information');
      return false;
    }
    if (formData.name.length < 5) {
      toast.error('Hostel name must be at least 5 characters');
      return false;
    }
    if (formData.description.length < 20) {
      toast.error('Description must be at least 20 characters');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.price || !formData.address || !formData.contactPhone) {
      toast.error('Please fill in all location and pricing details');
      return false;
    }
    if (formData.price <= 0) {
      toast.error('Price must be greater than 0');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.totalRooms || !formData.availableRooms || !formData.gender) {
      toast.error('Please fill in room details and gender preference');
      return false;
    }
    if (Number(formData.availableRooms) > Number(formData.totalRooms)) {
      toast.error('Available rooms cannot exceed total rooms');
      return false;
    }
    if (formData.amenities.length === 0) {
      toast.error('Please select at least one amenity');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep3()) return;

    try {
      const hostelData = {
        ...formData,
        price: Number(formData.price),
        totalRooms: Number(formData.totalRooms),
        availableRooms: Number(formData.availableRooms),
        location: {
          lat: Number(formData.location.lat),
          lng: Number(formData.location.lng)
        }
      };

      await createHostel(hostelData);
      toast.success('🎉 Hostel created successfully!');
      navigate('/my-hostels');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      {/* TOPBAR - EXACT same as other pages */}
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

      {/* MAIN CONTENT - Scrollable area */}
      <div className="rp-main-content">
        <div className="rp-container">
          {/* Header */}
          <div className="rp-header">
            <h1>
              <FaHome />
              List Your Hostel
            </h1>
            <p>Connect with MUBAS students looking for accommodation</p>
          </div>

          {/* Progress Steps */}
          <div className="rp-progress">
            <div className="rp-progress-line">
              <div 
                className="rp-progress-fill" 
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              />
            </div>

            {/* Step 1 */}
            <div className="rp-step">
              <div className={`rp-step-circle ${currentStep >= 1 ? 'active' : ''}`}>
                1
              </div>
              <p className={`rp-step-label ${currentStep >= 1 ? 'active' : ''}`}>
                Basic Info
              </p>
            </div>

            {/* Step 2 */}
            <div className="rp-step">
              <div className={`rp-step-circle ${currentStep >= 2 ? 'active' : ''}`}>
                2
              </div>
              <p className={`rp-step-label ${currentStep >= 2 ? 'active' : ''}`}>
                Location & Price
              </p>
            </div>

            {/* Step 3 */}
            <div className="rp-step">
              <div className={`rp-step-circle ${currentStep >= 3 ? 'active' : ''}`}>
                3
              </div>
              <p className={`rp-step-label ${currentStep >= 3 ? 'active' : ''}`}>
                Details
              </p>
            </div>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit}>
            <div className="rp-card">
              
              {/* STEP 1: Basic Information */}
              {currentStep === 1 && (
                <div>
                  <h2>
                    <FaHome /> Basic Information
                  </h2>

                  <div className="rp-form-group">
                    <label className="rp-label">Hostel Name <span className="rp-required">*</span></label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Green Valley Hostel"
                      required
                    />
                  </div>

                  <div className="rp-form-group">
                    <label className="rp-label">Description <span className="rp-required">*</span></label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your hostel, its features, and what makes it special..."
                      rows={5}
                      required
                    />
                  </div>

                  <div className="rp-form-group">
                    <label className="rp-label">Room Type <span className="rp-required">*</span></label>
                    <Select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      options={HOSTEL_TYPES.map(type => ({ value: type, label: type }))}
                      required
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Location & Pricing */}
              {currentStep === 2 && (
                <div>
                  <h2>
                    <FaMapMarkerAlt /> Location & Pricing
                  </h2>

                  <div className="rp-form-group">
                    <label className="rp-label">Address <span className="rp-required">*</span></label>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="e.g., Chirimba Road, Blantyre"
                      required
                    />
                  </div>

                  <div className="rp-grid-2">
                    <div className="rp-form-group">
                      <label className="rp-label">Latitude</label>
                      <Input
                        type="number"
                        step="any"
                        value={formData.location.lat}
                        onChange={(e) => handleLocationChange('lat', e.target.value)}
                        placeholder="-15.8020"
                      />
                    </div>
                    <div className="rp-form-group">
                      <label className="rp-label">Longitude</label>
                      <Input
                        type="number"
                        step="any"
                        value={formData.location.lng}
                        onChange={(e) => handleLocationChange('lng', e.target.value)}
                        placeholder="35.0259"
                      />
                    </div>
                  </div>

                  <div className="rp-tip">
                    💡 Tip: Use Google Maps to find exact coordinates
                  </div>

                  <div className="rp-form-group">
                    <label className="rp-label">Monthly Price (MWK) <span className="rp-required">*</span></label>
                    <Input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="e.g., 45000"
                      icon={<FaDollarSign />}
                      required
                    />
                  </div>

                  <div className="rp-form-group">
                    <label className="rp-label">Contact Phone Number <span className="rp-required">*</span></label>
                    <Input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      placeholder="e.g., 0888123456"
                      required
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Room Details & Amenities */}
              {currentStep === 3 && (
                <div>
                  <h2>
                    <FaBed /> Room Details & Amenities
                  </h2>

                  <div className="rp-grid-2">
                    <div className="rp-form-group">
                      <label className="rp-label">Total Rooms <span className="rp-required">*</span></label>
                      <Input
                        type="number"
                        name="totalRooms"
                        value={formData.totalRooms}
                        onChange={handleChange}
                        placeholder="e.g., 20"
                        required
                      />
                    </div>
                    <div className="rp-form-group">
                      <label className="rp-label">Available Rooms <span className="rp-required">*</span></label>
                      <Input
                        type="number"
                        name="availableRooms"
                        value={formData.availableRooms}
                        onChange={handleChange}
                        placeholder="e.g., 15"
                        required
                      />
                    </div>
                  </div>

                  <div className="rp-form-group">
                    <label className="rp-label">Gender Preference <span className="rp-required">*</span></label>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      options={GENDER_OPTIONS}
                      required
                    />
                  </div>

                  <div className="rp-form-group">
                    <label className="rp-label">Amenities <span className="rp-required">*</span></label>
                    <div className="rp-amenities-grid">
                      {AMENITIES.map((amenity) => {
                        const isSelected = formData.amenities.includes(amenity);
                        return (
                          <button
                            key={amenity}
                            type="button"
                            onClick={() => handleAmenityToggle(amenity)}
                            className={`rp-amenity-btn ${isSelected ? 'selected' : ''}`}
                          >
                            {isSelected && <FaCheckCircle />}
                            {amenity}
                          </button>
                        );
                      })}
                    </div>
                    {formData.amenities.length > 0 && (
                      <div className="rp-selected-count">
                        ✅ {formData.amenities.length} amenity(ies) selected
                      </div>
                    )}
                  </div>

                  {/* Image Upload */}
                  <ImageUpload
                    images={formData.images}
                    onImagesChange={(newImages) => setFormData({ ...formData, images: newImages })}
                    maxImages={10}
                  />
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="rp-nav-buttons">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="rp-btn-outline"
                    onClick={prevStep}
                  >
                    ← Previous
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    className="rp-btn-primary"
                    onClick={nextStep}
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="rp-btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <><div className="rp-spinner"></div> Publishing...</>
                    ) : (
                      <>🎉 Publish Hostel</>
                    )}
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