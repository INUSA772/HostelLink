import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHostel } from '../context/HostelContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave, FaSpinner, FaCheckCircle, FaTrash, FaUpload } from 'react-icons/fa';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0d1b3e;
    --navy2: #112255;
    --blue: #1a3fa4;
    --orange: #e8501a;
    --white: #ffffff;
    --gray-bg: #f4f6fa;
    --text-dark: #111827;
    --text-mid: #4b5563;
    --card-radius: 14px;
    --success: #059669;
    --danger: #dc2626;
  }

  body { font-family: 'Manrope', sans-serif; background: var(--gray-bg); color: var(--text-dark); }
  a { text-decoration: none; color: inherit; }

  .edit-hostel-page {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--gray-bg) 0%, #ffffff 100%);
    padding-top: 68px;
  }

  .edit-topnav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: white;
    border-bottom: 1px solid #e5e7eb;
    padding: 0.75rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }

  .edit-back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--gray-bg);
    border: 1px solid #e5e7eb;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 700;
    color: var(--navy);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
    font-family: 'Manrope', sans-serif;
  }

  .edit-back-btn:hover {
    background: var(--navy);
    color: white;
    border-color: var(--navy);
  }

  .edit-save-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--success);
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    font-weight: 700;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
    font-family: 'Manrope', sans-serif;
  }

  .edit-save-btn:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  .edit-save-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .edit-header {
    background: linear-gradient(135deg, var(--navy) 0%, var(--blue) 100%);
    color: white;
    padding: 2.5rem 1.5rem;
  }

  .edit-header h1 {
    font-size: clamp(1.8rem, 4vw, 2.5rem);
    font-weight: 800;
    margin-bottom: 0.5rem;
    font-family: 'Poppins', sans-serif;
  }

  .edit-header p {
    font-size: 0.95rem;
    opacity: 0.9;
  }

  .edit-content {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  .form-section {
    background: white;
    border-radius: var(--card-radius);
    border: 1px solid #e5e7eb;
    margin-bottom: 2rem;
    overflow: hidden;
  }

  .form-section-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    background: var(--gray-bg);
  }

  .form-section-header h2 {
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--navy);
    font-family: 'Poppins', sans-serif;
  }

  .form-section-body {
    padding: 2rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .form-grid.full {
    grid-template-columns: 1fr;
  }

  .form-grid.two {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-label {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .form-label.required::after {
    content: ' *';
    color: var(--danger);
  }

  .form-input,
  .form-textarea,
  .form-select {
    padding: 0.75rem 1rem;
    border: 1.5px solid #e5e7eb;
    border-radius: 8px;
    font-family: 'Manrope', sans-serif;
    font-size: 0.95rem;
    color: var(--text-dark);
    transition: all 0.2s;
    background: white;
    outline: none;
  }

  .form-input:focus,
  .form-textarea:focus,
  .form-select:focus {
    border-color: var(--orange);
    box-shadow: 0 0 0 3px rgba(232,80,26,0.1);
  }

  .form-textarea {
    resize: vertical;
    min-height: 100px;
  }

  .form-help {
    font-size: 0.75rem;
    color: var(--text-mid);
    margin-top: 0.3rem;
  }

  .amenities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .amenity-checkbox {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: var(--gray-bg);
    border: 1.5px solid #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .amenity-checkbox:hover {
    border-color: var(--orange);
  }

  .amenity-checkbox input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: var(--orange);
  }

  .amenity-checkbox label {
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .image-upload-section {
    margin-bottom: 2rem;
  }

  .image-upload-area {
    border: 2px dashed #e5e7eb;
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: var(--gray-bg);
  }

  .image-upload-area:hover {
    border-color: var(--orange);
    background: rgba(232,80,26,0.05);
  }

  .image-upload-area.active {
    border-color: var(--orange);
    background: rgba(232,80,26,0.1);
  }

  .upload-icon {
    font-size: 2.5rem;
    color: var(--orange);
    margin-bottom: 0.5rem;
  }

  .upload-text {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--navy);
    margin-bottom: 0.25rem;
  }

  .upload-subtext {
    font-size: 0.8rem;
    color: var(--text-mid);
  }

  .form-input[type="file"] {
    display: none;
  }

  .image-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .image-item {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    background: var(--gray-bg);
    aspect-ratio: 1;
  }

  .image-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-remove {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: var(--danger);
    color: white;
    border: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .image-item:hover .image-remove {
    opacity: 1;
  }

  .pricing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .price-input-group {
    position: relative;
  }

  .price-symbol {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-weight: 700;
    color: var(--text-mid);
    pointer-events: none;
  }

  .price-input-group .form-input {
    padding-left: 2.5rem;
  }

  .success-message {
    background: rgba(5,150,105,0.1);
    border: 1.5px solid var(--success);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--success);
    font-weight: 600;
  }

  .success-message svg {
    font-size: 1.3rem;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .edit-header {
      padding: 1.5rem;
    }

    .edit-header h1 {
      font-size: 1.5rem;
    }

    .form-grid {
      grid-template-columns: 1fr;
    }

    .form-grid.two {
      grid-template-columns: 1fr;
    }

    .amenities-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .image-gallery {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
  }

  @media (max-width: 520px) {
    .edit-topnav {
      padding: 0.5rem 1rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .edit-back-btn,
    .edit-save-btn {
      padding: 0.5rem 0.8rem;
      font-size: 0.8rem;
    }

    .edit-header h1 {
      font-size: 1.3rem;
    }

    .edit-content {
      padding: 1rem;
    }

    .form-section-body {
      padding: 1rem;
    }

    .image-upload-area {
      padding: 1.5rem;
    }

    .amenities-grid {
      grid-template-columns: 1fr;
    }
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
];

const EditHostel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentHostel, loading, fetchHostelById, updateHostel } = useHostel();
  const { user, isAuthenticated } = useAuth();

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    type: '',
    gender: 'mixed',
    price: '',
    totalRooms: '',
    availableRooms: '',
    amenities: [],
    images: [],
  });

  useEffect(() => {
    if (id) {
      fetchHostelById(id);
    }
  }, [id]);

  useEffect(() => {
    if (currentHostel) {
      setFormData({
        name: currentHostel.name || '',
        description: currentHostel.description || '',
        address: currentHostel.address || '',
        type: currentHostel.type || 'hostel',
        gender: currentHostel.gender || 'mixed',
        price: currentHostel.price || '',
        totalRooms: currentHostel.totalRooms || '',
        availableRooms: currentHostel.availableRooms || '',
        amenities: currentHostel.amenities || [],
        images: currentHostel.images || [],
      });
    }
  }, [currentHostel]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'totalRooms' || name === 'availableRooms'
        ? parseInt(value) || 0
        : value,
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you would upload to Cloudinary and get URLs
    // For now, we'll use local URLs (base64) as placeholder
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, event.target.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateHostel(id, formData);
      toast.success('Property updated successfully!');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !currentHostel) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <FaSpinner style={{ animation: 'spin 0.8s linear infinite', fontSize: '2rem', color: 'var(--orange)' }} />
      </div>
    );
  }

  if (!currentHostel && !loading) {
    return (
      <div className="edit-hostel-page">
        <div className="edit-topnav">
          <button className="edit-back-btn" onClick={() => navigate(-1)}><FaArrowLeft /> Back</button>
        </div>
        <div className="edit-content" style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Property not found</h2>
          <button className="edit-back-btn" onClick={() => navigate('/landlord-dashboard')}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="edit-hostel-page">
        <div className="edit-topnav">
          <button className="edit-back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
          <button className="edit-save-btn" onClick={handleSubmit} disabled={saving}>
            {saving ? <><FaSpinner style={{ animation: 'spin 0.8s linear infinite' }} /> Saving...</> : <><FaSave /> Save Changes</>}
          </button>
        </div>

        <section className="edit-header">
          <h1>Edit Property</h1>
          <p>Update your property details, pricing, amenities, and photos</p>
        </section>

        <div className="edit-content">
          {saved && (
            <div className="success-message">
              <FaCheckCircle />
              Your property has been updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="form-section">
              <div className="form-section-header">
                <h2>📋 Basic Information</h2>
              </div>
              <div className="form-section-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label required">Property Name</label>
                    <input type="text" className="form-input" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Property Type</label>
                    <select className="form-select" name="type" value={formData.type} onChange={handleInputChange}>
                      <option value="hostel">Hostel</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="land">Land</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Gender Preference</label>
                    <select className="form-select" name="gender" value={formData.gender} onChange={handleInputChange}>
                      <option value="mixed">Mixed</option>
                      <option value="male">Male Only</option>
                      <option value="female">Female Only</option>
                    </select>
                  </div>
                </div>
                <div className="form-grid full" style={{ marginTop: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label required">Address</label>
                    <input type="text" className="form-input" name="address" value={formData.address} onChange={handleInputChange} required />
                    <p className="form-help">Include area name and nearby landmarks</p>
                  </div>
                </div>
                <div className="form-grid full" style={{ marginTop: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label required">Description</label>
                    <textarea className="form-textarea" name="description" value={formData.description} onChange={handleInputChange} required />
                    <p className="form-help">Describe your property (amenities, location advantages, etc.)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Availability */}
            <div className="form-section">
              <div className="form-section-header">
                <h2>💰 Pricing & Availability</h2>
              </div>
              <div className="form-section-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label required">Price per Month (MWK)</label>
                    <div className="price-input-group">
                      <span className="price-symbol">MK</span>
                      <input type="number" className="form-input" name="price" value={formData.price} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Total Rooms</label>
                    <input type="number" className="form-input" name="totalRooms" value={formData.totalRooms} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Available Rooms</label>
                    <input type="number" className="form-input" name="availableRooms" value={formData.availableRooms} onChange={handleInputChange} required />
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="form-section">
              <div className="form-section-header">
                <h2>✨ Amenities</h2>
              </div>
              <div className="form-section-body">
                <label className="form-label">Select Available Amenities</label>
                <div className="amenities-grid">
                  {AMENITIES.map((amenity) => (
                    <div key={amenity} className="amenity-checkbox">
                      <input type="checkbox" id={amenity} checked={formData.amenities.includes(amenity)} onChange={() => handleAmenityChange(amenity)} />
                      <label htmlFor={amenity}>{amenity}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="form-section">
              <div className="form-section-header">
                <h2>📸 Photos</h2>
              </div>
              <div className="form-section-body">
                <div className="image-upload-section">
                  <label htmlFor="image-upload" className="image-upload-area">
                    <div className="upload-icon"><FaUpload /></div>
                    <div className="upload-text">Click to upload photos</div>
                    <div className="upload-subtext">or drag and drop (JPG, PNG up to 5MB)</div>
                  </label>
                  <input id="image-upload" type="file" multiple accept="image/*" onChange={handleImageUpload} />
                </div>
                {formData.images.length > 0 && (
                  <div>
                    <label className="form-label" style={{ marginTop: '1.5rem', display: 'block' }}>Uploaded Images ({formData.images.length})</label>
                    <div className="image-gallery">
                      {formData.images.map((image, index) => (
                        <div key={index} className="image-item">
                          <img src={image} alt={`Property ${index + 1}`} />
                          <button type="button" className="image-remove" onClick={() => handleRemoveImage(index)}><FaTrash /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="edit-save-btn" style={{ width: '100%', padding: '1rem', marginTop: '2rem', fontSize: '1rem' }} disabled={saving}>
              {saving ? <><FaSpinner style={{ animation: 'spin 0.8s linear infinite' }} /> Saving Changes...</> : <><FaSave /> Update Property</>}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditHostel;