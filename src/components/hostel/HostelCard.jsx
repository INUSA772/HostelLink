import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBed, FaStar, FaCheckCircle, FaUsers } from 'react-icons/fa';
import { formatCurrency } from '../../utils/helpers';
import Badge from '../common/Badge';
import '../../styles/global.css';

const HostelCard = ({ hostel }) => {
  const mainImage = hostel.images && hostel.images.length > 0 
    ? hostel.images[0] 
    : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800';

  return (
    <Link to={`/hostels/${hostel._id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s ease'
      }}>
        {/* Image Section */}
        <div style={{
          position: 'relative',
          height: '200px',
          overflow: 'hidden',
          backgroundColor: 'var(--gray-lighter)'
        }}>
          <img 
            src={mainImage}
            alt={hostel.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          />
          
          {/* Verified Badge */}
          {hostel.verified && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'var(--success)',
              color: 'var(--white)',
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              boxShadow: 'var(--shadow-md)'
            }}>
              <FaCheckCircle size={12} /> Verified
            </div>
          )}

          {/* Available Rooms Badge */}
          {hostel.availableRooms > 0 ? (
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: 'var(--primary-color)',
              color: 'var(--white)',
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'bold',
              boxShadow: 'var(--shadow-md)'
            }}>
              {hostel.availableRooms} rooms available
            </div>
          ) : (
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: 'var(--error)',
              color: 'var(--white)',
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'bold',
              boxShadow: 'var(--shadow-md)'
            }}>
              Fully Booked
            </div>
          )}
        </div>

        {/* Content Section */}
        <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Hostel Name */}
          <h3 style={{
            margin: '0 0 0.5rem 0',
            fontSize: 'var(--font-size-lg)',
            color: 'var(--dark)',
            fontWeight: '600',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {hostel.name}
          </h3>

          {/* Location */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--gray)',
            fontSize: 'var(--font-size-sm)',
            marginBottom: '0.75rem'
          }}>
            <FaMapMarkerAlt size={14} />
            <span style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {hostel.address}
            </span>
          </div>

          {/* Type and Gender */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '0.75rem',
            flexWrap: 'wrap'
          }}>
            <Badge variant="info">
              <FaBed size={12} style={{ marginRight: '0.25rem' }} />
              {hostel.type}
            </Badge>
            <Badge variant={
              hostel.gender === 'male' ? 'info' : 
              hostel.gender === 'female' ? 'warning' : 
              'success'
            }>
              <FaUsers size={12} style={{ marginRight: '0.25rem' }} />
              {hostel.gender === 'male' ? 'Male Only' : 
               hostel.gender === 'female' ? 'Female Only' : 
               'Mixed'}
            </Badge>
          </div>

          {/* Amenities Preview */}
          {hostel.amenities && hostel.amenities.length > 0 && (
            <div style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--gray)',
              marginBottom: '0.75rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {hostel.amenities.slice(0, 3).join(' • ')}
              {hostel.amenities.length > 3 && ` • +${hostel.amenities.length - 3} more`}
            </div>
          )}

          {/* Rating */}
          {hostel.averageRating > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: 'var(--warning)'
              }}>
                <FaStar size={16} />
                <span style={{ fontWeight: '600', color: 'var(--dark)' }}>
                  {hostel.averageRating.toFixed(1)}
                </span>
              </div>
              <span style={{ color: 'var(--gray)', fontSize: 'var(--font-size-sm)' }}>
                ({hostel.reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Price Section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--gray-light)'
          }}>
            <div>
              <div style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 'bold',
                color: 'var(--primary-color)'
              }}>
                {formatCurrency(hostel.price)}
              </div>
              <div style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--gray)'
              }}>
                per month
              </div>
            </div>
            
            <button className="btn btn-primary btn-sm">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HostelCard;