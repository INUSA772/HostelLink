import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--gray-lighter)',
      padding: '2rem 0'
    }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: 'var(--font-size-4xl)',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            <FaHome style={{ marginRight: '0.5rem' }} />
            List Your Hostel
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: 'var(--font-size-lg)' }}>
            Connect with MUBAS students looking for accommodation
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          position: 'relative'
        }}>
          {/* Progress Line */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '0',
            right: '0',
            height: '4px',
            backgroundColor: 'var(--gray-light)',
            zIndex: 0
          }}>
            <div style={{
              height: '100%',
              backgroundColor: 'var(--primary-color)',
              width: `${((currentStep - 1) / 2) * 100}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>

          {/* Step 1 */}
          <div style={{
            flex: 1,
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: currentStep >= 1 ? 'var(--primary-color)' : 'var(--gray-light)',
              color: 'var(--white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.5rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}>
              1
            </div>
            <p style={{ fontSize: 'var(--font-size-sm)', color: currentStep >= 1 ? 'var(--primary-color)' : 'var(--gray)' }}>
              Basic Info
            </p>
          </div>

          {/* Step 2 */}
          <div style={{
            flex: 1,
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: currentStep >= 2 ? 'var(--primary-color)' : 'var(--gray-light)',
              color: 'var(--white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.5rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}>
              2
            </div>
            <p style={{ fontSize: 'var(--font-size-sm)', color: currentStep >= 2 ? 'var(--primary-color)' : 'var(--gray)' }}>
              Location & Price
            </p>
          </div>

          {/* Step 3 */}
          <div style={{
            flex: 1,
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: currentStep >= 3 ? 'var(--primary-color)' : 'var(--gray-light)',
              color: 'var(--white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.5rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}>
              3
            </div>
            <p style={{ fontSize: 'var(--font-size-sm)', color: currentStep >= 3 ? 'var(--primary-color)' : 'var(--gray)' }}>
              Details
            </p>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit}>
          <div className="card" style={{ padding: '2rem' }}>
            
            {/* STEP 1: Basic Information */}
            {currentStep === 1 && (
              <div>
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaHome /> Basic Information
                </h2>

                <Input
                  label="Hostel Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Green Valley Hostel"
                  required
                />

                <Textarea
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your hostel, its features, and what makes it special..."
                  rows={5}
                  required
                />

                <Select
                  label="Room Type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  options={HOSTEL_TYPES.map(type => ({ value: type, label: type }))}
                  required
                />
              </div>
            )}

            {/* STEP 2: Location & Pricing */}
            {currentStep === 2 && (
              <div>
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaMapMarkerAlt /> Location & Pricing
                </h2>

                <Input
                  label="Address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g., Chirimba Road, Blantyre"
                  required
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <Input
                    label="Latitude"
                    type="number"
                    step="any"
                    value={formData.location.lat}
                    onChange={(e) => handleLocationChange('lat', e.target.value)}
                    placeholder="-15.8020"
                  />
                  <Input
                    label="Longitude"
                    type="number"
                    step="any"
                    value={formData.location.lng}
                    onChange={(e) => handleLocationChange('lng', e.target.value)}
                    placeholder="35.0259"
                  />
                </div>

                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray)', marginTop: '-0.5rem', marginBottom: '1rem' }}>
                  💡 Tip: Use Google Maps to find exact coordinates
                </p>

                <Input
                  label="Monthly Price (MWK)"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g., 45000"
                  icon={<FaDollarSign />}
                  required
                />

                <Input
                  label="Contact Phone Number"
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="e.g., 0888123456"
                  required
                />
              </div>
            )}

            {/* STEP 3: Room Details & Amenities */}
            {currentStep === 3 && (
              <div>
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaBed /> Room Details & Amenities
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <Input
                    label="Total Rooms"
                    type="number"
                    name="totalRooms"
                    value={formData.totalRooms}
                    onChange={handleChange}
                    placeholder="e.g., 20"
                    required
                  />
                  <Input
                    label="Available Rooms"
                    type="number"
                    name="availableRooms"
                    value={formData.availableRooms}
                    onChange={handleChange}
                    placeholder="e.g., 15"
                    required
                  />
                </div>

                <Select
                  label="Gender Preference"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={GENDER_OPTIONS}
                  required
                />

                <div style={{ marginTop: '1.5rem' }}>
                  <label className="form-label">
                    Amenities <span style={{ color: 'var(--error)' }}>*</span>
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '0.75rem',
                    marginTop: '0.5rem'
                  }}>
                    {AMENITIES.map((amenity) => {
                      const isSelected = formData.amenities.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => handleAmenityToggle(amenity)}
                          style={{
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            border: isSelected ? '2px solid var(--primary-color)' : '2px solid var(--gray-light)',
                            backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--white)',
                            color: isSelected ? 'var(--white)' : 'var(--dark)',
                            cursor: 'pointer',
                            fontSize: 'var(--font-size-sm)',
                            transition: 'all 0.2s ease',
                            fontWeight: isSelected ? '600' : '400',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          {isSelected && <FaCheckCircle />}
                          {amenity}
                        </button>
                      );
                    })}
                  </div>
                  {formData.amenities.length > 0 && (
                    <p style={{
                      marginTop: '1rem',
                      padding: '0.75rem',
                      backgroundColor: 'var(--success)',
                      color: 'var(--white)',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                      fontSize: 'var(--font-size-sm)'
                    }}>
                      ✅ {formData.amenities.length} amenity(ies) selected
                    </p>
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
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--gray-light)'
            }}>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                >
                  ← Previous
                </Button>
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={nextStep}
                  style={{ marginLeft: 'auto' }}
                >
                  Next →
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  style={{ marginLeft: 'auto' }}
                >
                  🎉 Publish Hostel
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHostel;