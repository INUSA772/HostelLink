import React, { useState } from 'react';
import { FaCloudUploadAlt, FaTimes, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from './Loader';

const ImageUpload = ({ images, onImagesChange, maxImages = 10 }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    console.log('🔍 Cloud Name:', cloudName);
    console.log('🔍 Upload Preset:', uploadPreset);

    if (!cloudName || !uploadPreset) {
      toast.error('Cloudinary not configured. Please check .env file');
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'hostels');

    try {
      console.log('📤 Uploading to Cloudinary...');
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Cloudinary Error Response:', data);
        console.error('❌ Status:', response.status);
        
        if (response.status === 401) {
          toast.error('Upload preset is not set to "Unsigned". Please check Cloudinary settings.');
        } else if (response.status === 400) {
          toast.error(data.error?.message || 'Invalid upload request');
        } else {
          toast.error('Upload failed: ' + (data.error?.message || 'Unknown error'));
        }
        
        throw new Error(data.error?.message || 'Upload failed');
      }

      console.log('✅ Upload successful:', data.secure_url);
      return data.secure_url;
      
    } catch (error) {
      console.error('❌ Full Upload Error:', error);
      throw error;
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = files.map(async (file, index) => {
        // Validate file
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
      console.error('Upload failed:', error);
      toast.error('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(newImages);
    toast.info('Image removed');
  };

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <label className="form-label">
        Hostel Images {images.length > 0 && `(${images.length}/${maxImages})`}
      </label>

      {/* Upload Button */}
      {images.length < maxImages && (
        <label style={{
          display: 'block',
          padding: '2rem',
          border: '2px dashed var(--gray-light)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          backgroundColor: 'var(--gray-lighter)',
          transition: 'all 0.3s ease',
          marginBottom: '1rem'
        }}
        onMouseEnter={(e) => {
          if (!uploading) {
            e.currentTarget.style.borderColor = 'var(--primary-color)';
            e.currentTarget.style.backgroundColor = 'var(--white)';
          }
        }}
        onMouseLeave={(e) => {
          if (!uploading) {
            e.currentTarget.style.borderColor = 'var(--gray-light)';
            e.currentTarget.style.backgroundColor = 'var(--gray-lighter)';
          }
        }}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: 'none' }}
          />
          
          {uploading ? (
            <div>
              <Loader size="md" />
              <p style={{ color: 'var(--gray)', marginTop: '1rem' }}>
                Uploading... {Math.round(uploadProgress)}%
              </p>
            </div>
          ) : (
            <div>
              <FaCloudUploadAlt size={48} style={{ color: 'var(--primary-color)', marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>Click to upload images</h4>
              <p style={{ color: 'var(--gray)', fontSize: 'var(--font-size-sm)' }}>
                PNG, JPG, WEBP up to 5MB each
              </p>
              <p style={{ color: 'var(--gray)', fontSize: 'var(--font-size-sm)' }}>
                Maximum {maxImages} images
              </p>
            </div>
          )}
        </label>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          {images.map((imageUrl, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                aspectRatio: '1',
                backgroundColor: 'var(--gray-lighter)'
              }}
            >
              <img
                src={imageUrl}
                alt={`Hostel ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  backgroundColor: 'var(--error)',
                  color: 'var(--white)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <FaTimes />
              </button>

              {/* First Image Badge */}
              {index === 0 && (
                <div style={{
                  position: 'absolute',
                  bottom: '0.5rem',
                  left: '0.5rem',
                  backgroundColor: 'var(--primary-color)',
                  color: 'var(--white)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'bold'
                }}>
                  Main Image
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: 'var(--gray)',
          backgroundColor: 'var(--gray-lighter)',
          borderRadius: 'var(--radius-md)'
        }}>
          <FaImage size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>No images uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;