import React, { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaTimes, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ImageUpload = ({ images, onImagesChange, maxImages = 10 }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast.error('Cloudinary not configured. Please check .env file');
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'hostels');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        toast.error('Upload preset must be set to Unsigned in Cloudinary.');
      } else {
        toast.error(data.error?.message || 'Upload failed');
      }
      throw new Error(data.error?.message || 'Upload failed');
    }

    return data.secure_url;
  };

  const handleFileSelect = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.target.files);

    if (images.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = files.map(async (file, index) => {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file`);
          return null;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Max size is 5MB`);
          return null;
        }
        const url = await uploadToCloudinary(file);
        setUploadProgress(((index + 1) / files.length) * 100);
        return url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(url => url !== null);

      if (validUrls.length > 0) {
        onImagesChange([...images, ...validUrls]);
        toast.success(`${validUrls.length} image(s) uploaded successfully!`);
      }
    } catch (error) {
      toast.error('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (e, indexToRemove) => {
    e.preventDefault();
    e.stopPropagation();
    onImagesChange(images.filter((_, i) => i !== indexToRemove));
    toast.info('Image removed');
  };

  const handleUploadClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
        Hostel Images {images.length > 0 && `(${images.length}/${maxImages})`}
      </label>

      {/* ✅ FIX: use div + button instead of label to avoid form submit */}
      {images.length < maxImages && (
        <div
          style={{
            display: 'block', padding: '2rem',
            border: '2px dashed #e5e7eb', borderRadius: '12px',
            textAlign: 'center', cursor: uploading ? 'not-allowed' : 'pointer',
            backgroundColor: '#f4f6fb', transition: 'all 0.3s ease', marginBottom: '1rem'
          }}
          onClick={handleUploadClick}
          onMouseEnter={e => { if (!uploading) { e.currentTarget.style.borderColor = '#e8501a'; e.currentTarget.style.backgroundColor = '#fff'; } }}
          onMouseLeave={e => { if (!uploading) { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.backgroundColor = '#f4f6fb'; } }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: 'none' }}
          />

          {uploading ? (
            <div>
              <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTopColor: '#e8501a', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 1rem' }} />
              <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                Uploading... {Math.round(uploadProgress)}%
              </p>
            </div>
          ) : (
            <div>
              <FaCloudUploadAlt size={48} style={{ color: '#e8501a', marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.5rem', color: '#111827' }}>Click to upload images</h4>
              <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>PNG, JPG, WEBP up to 5MB each</p>
              <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Maximum {maxImages} images</p>
            </div>
          )}
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
          {images.map((imageUrl, index) => (
            <div key={index} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', aspectRatio: '1', backgroundColor: '#f4f6fb' }}>
              <img src={imageUrl} alt={`Hostel ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                type="button"
                onClick={e => handleRemoveImage(e, index)}
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
              >
                <FaTimes />
              </button>
              {index === 0 && (
                <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', backgroundColor: '#e8501a', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                  Main Image
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: '#6b7280', backgroundColor: '#f4f6fb', borderRadius: '10px' }}>
          <FaImage size={36} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
          <p style={{ fontSize: '0.85rem' }}>No images uploaded yet</p>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ImageUpload;