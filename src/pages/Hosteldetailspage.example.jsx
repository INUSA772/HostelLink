import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import paymentService from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';
import PaymentModal from '../components/payment/PaymentModal';

/**
 * HostelDetailsPage Component
 * Displays hostel details and allows students to book and pay
 */
const HostelDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State Management
  const [hostel, setHostel] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [checkInDate, setCheckInDate] = useState('');
  const [duration, setDuration] = useState(1);

  // ============================================
  // LOAD HOSTEL DETAILS
  // ============================================
  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const response = await api.get(`/hostels/${id}`);
        setHostel(response.data.hostel);
      } catch (error) {
        console.error('Error fetching hostel:', error);
        toast.error('Failed to load hostel details');
        navigate('/hostels');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHostel();
    }
  }, [id, navigate]);

  // ============================================
  // CREATE BOOKING
  // ============================================
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!user) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      toast.error('Only students can book hostels');
      return;
    }

    if (!checkInDate) {
      toast.error('Please select a check-in date');
      return;
    }

    if (duration < 1) {
      toast.error('Duration must be at least 1 month');
      return;
    }

    setBookingLoading(true);

    try {
      // Create booking
      const bookingResponse = await api.post('/bookings', {
        hostelId: id,
        checkInDate: new Date(checkInDate),
        duration: parseInt(duration)
      });

      const newBooking = bookingResponse.data.booking;
      setBooking(newBooking);

      toast.success('Booking created! Proceed to payment');
      
      // Open payment modal
      setShowPaymentModal(true);
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMsg = error.response?.data?.message || 'Failed to create booking';
      toast.error(errorMsg);
    } finally {
      setBookingLoading(false);
    }
  };

  // ============================================
  // HANDLE PAYMENT SUCCESS
  // ============================================
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    toast.success('Payment successful! Booking confirmed.');
    // Refresh booking data or redirect to bookings page
    setTimeout(() => {
      navigate('/bookings');
    }, 1500);
  };

  // ============================================
  // RENDER LOADING STATE
  // ============================================
  if (loading) {
    return (
      <div className="hostel-details-page loading">
        <div className="spinner"></div>
        <p>Loading hostel details...</p>
      </div>
    );
  }

  // ============================================
  // RENDER HOSTEL NOT FOUND
  // ============================================
  if (!hostel) {
    return (
      <div className="hostel-details-page">
        <div className="alert alert-error">
          <h2>Hostel Not Found</h2>
          <p>The hostel you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/hostels')} className="btn btn-primary">
            Back to Hostels
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // CALCULATE PAYMENT DETAILS
  // ============================================
  const paymentDetails = duration > 0 
    ? paymentService.calculateTotal(hostel.price * duration)
    : { roomRent: 0, platformFee: 2000, totalAmount: 2000 };

  // ============================================
  // RENDER HOSTEL DETAILS PAGE
  // ============================================
  return (
    <div className="hostel-details-page">
      <div className="container">
        {/* ============== HOSTEL INFO ============== */}
        <div className="hostel-header">
          {/* Hostel Images */}
          {hostel.images && hostel.images.length > 0 && (
            <div className="hostel-images">
              <img 
                src={hostel.images[0]} 
                alt={hostel.name}
                className="main-image"
              />
              {hostel.images.length > 1 && (
                <div className="thumbnail-images">
                  {hostel.images.slice(1, 4).map((img, idx) => (
                    <img key={idx} src={img} alt={`${hostel.name} ${idx}`} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Hostel Details */}
          <div className="hostel-info">
            <h1>{hostel.name}</h1>
            
            <div className="hostel-meta">
              <span className="type-badge">{hostel.type}</span>
              <span className="gender-badge">{hostel.gender}</span>
              {hostel.verified && <span className="verified-badge">✓ Verified</span>}
            </div>

            <p className="description">{hostel.description}</p>

            {/* Amenities */}
            {hostel.amenities && hostel.amenities.length > 0 && (
              <div className="amenities">
                <h3>Amenities</h3>
                <ul>
                  {hostel.amenities.map((amenity, idx) => (
                    <li key={idx}>✓ {amenity}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Address */}
            <div className="address">
              <h3>📍 Location</h3>
              <p>{hostel.address}</p>
              {hostel.location?.formattedAddress && (
                <p className="formatted-address">{hostel.location.formattedAddress}</p>
              )}
            </div>

            {/* Room Availability */}
            <div className="availability">
              <h3>🏠 Availability</h3>
              <p>
                <strong>{hostel.availableRooms}</strong> out of{' '}
                <strong>{hostel.totalRooms}</strong> rooms available
              </p>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{
                    width: `${(hostel.availableRooms / hostel.totalRooms) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============== BOOKING FORM ============== */}
        {user?.role === 'student' && (
          <div className="booking-section">
            <h2>Book This Hostel</h2>
            
            <form onSubmit={handleCreateBooking} className="booking-form">
              {/* Check-in Date */}
              <div className="form-group">
                <label htmlFor="checkInDate">
                  Check-in Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="checkInDate"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  disabled={bookingLoading}
                />
              </div>

              {/* Duration */}
              <div className="form-group">
                <label htmlFor="duration">
                  Duration (months) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="duration"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  disabled={bookingLoading}
                />
              </div>

              {/* Price Summary */}
              {duration > 0 && (
                <div className="price-summary">
                  <h3>Price Breakdown</h3>
                  <div className="price-row">
                    <span>Room Rent ({duration} month{duration > 1 ? 's' : ''}):</span>
                    <strong>{paymentService.formatCurrency(hostel.price * duration)}</strong>
                  </div>
                  <div className="price-row platform-fee">
                    <span>Platform Fee:</span>
                    <strong>{paymentService.formatCurrency(2000)}</strong>
                  </div>
                  <div className="price-row total">
                    <span>Total to Pay:</span>
                    <strong className="total-amount">
                      {paymentService.formatCurrency(paymentDetails.totalAmount)}
                    </strong>
                  </div>
                  <p className="fee-info">
                    💡 The 2000 MWK platform fee ensures secure, in-system payments
                    and protects both students and hostel owners from fraud.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={bookingLoading || hostel.availableRooms === 0}
              >
                {bookingLoading ? (
                  <>
                    <span className="spinner-small"></span>
                    Creating Booking...
                  </>
                ) : hostel.availableRooms === 0 ? (
                  'No Available Rooms'
                ) : (
                  'Book & Proceed to Payment'
                )}
              </button>
            </form>
          </div>
        )}

        {/* ============== NOT STUDENT ============== */}
        {user && user.role !== 'student' && (
          <div className="alert alert-info">
            <p>Only students can book hostels. Please <a href="/login">login as a student</a>.</p>
          </div>
        )}

        {/* ============== NOT LOGGED IN ============== */}
        {!user && (
          <div className="alert alert-warning">
            <p>Please <a href="/login">login</a> to book a hostel.</p>
          </div>
        )}
      </div>

      {/* ============================================
          PAYCHANGE PAYMENT MODAL
          ============================================ */}
      {booking && hostel && (
        <PaymentModal
          booking={booking}
          hostel={hostel}
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            // Reset form
            setCheckInDate('');
            setDuration(1);
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default HostelDetailsPage;