import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import paymentService from '../services/paymentService';
import { useAuth } from '../context/AuthContext';
import messageService from '../services/messageService';
import PaymentModal from '../components/payment/PaymentModal';
import {
  FaMapMarkerAlt, FaBed, FaCheckCircle, FaStar,
  FaWhatsapp, FaEnvelope, FaPhone, FaArrowLeft,
  FaHeart, FaRegHeart, FaShare, FaShieldAlt,
  FaWifi, FaCar, FaUtensils, FaSpinner,
  FaComments, FaUser, FaHome, FaDoorOpen,
} from 'react-icons/fa';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0d1b3e;
    --navy2: #112255;
    --blue: #1a3fa4;
    --orange: #e8501a;
    --orange-light: #ff6b3d;
    --orange-pale: #fff3ef;
    --white: #ffffff;
    --gray-bg: #f4f6fa;
    --gray-light: #e4e6eb;
    --text-dark: #111827;
    --text-mid: #4b5563;
    --text-light: #9ca3af;
    --success: #059669;
    --success-pale: #ecfdf5;
    --danger: #dc2626;
    --card-radius: 16px;
    --transition: all 0.22s ease;
  }

  .hdp-page { font-family: 'Manrope', sans-serif; background: var(--gray-bg); min-height: 100vh; color: var(--text-dark); }

  /* ── LOADING ── */
  .hdp-loading {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1rem;
    background: var(--gray-bg);
  }
  .hdp-spinner { animation: spin 0.8s linear infinite; font-size: 2rem; color: var(--orange); }
  @keyframes spin { to { transform: rotate(360deg); } }
  .hdp-loading p { color: var(--text-mid); font-weight: 600; font-family: 'Manrope', sans-serif; }

  /* ── TOP NAV ── */
  .hdp-topnav {
    position: sticky; top: 0; z-index: 100;
    background: white; border-bottom: 1px solid var(--gray-light);
    padding: 0.85rem 1.5rem;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  }
  .hdp-back-btn {
    display: flex; align-items: center; gap: 0.5rem;
    background: var(--gray-bg); border: 1px solid var(--gray-light);
    border-radius: 10px; padding: 0.5rem 1rem;
    font-size: 0.85rem; font-weight: 700; color: var(--navy);
    cursor: pointer; transition: var(--transition);
    font-family: 'Manrope', sans-serif;
  }
  .hdp-back-btn:hover { background: var(--navy); color: white; border-color: var(--navy); }
  .hdp-topnav-actions { display: flex; gap: 0.5rem; }
  .hdp-icon-btn {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--gray-bg); border: 1px solid var(--gray-light);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: var(--text-mid); font-size: 0.9rem; transition: var(--transition);
  }
  .hdp-icon-btn:hover { background: var(--orange-pale); color: var(--orange); border-color: var(--orange); }
  .hdp-icon-btn.fav { color: var(--danger); }

  /* ── HERO IMAGES ── */
  .hdp-images { position: relative; background: #1a1a2e; }
  .hdp-main-img {
    width: 100%; height: 480px; object-fit: cover;
    display: block; opacity: 0.92;
  }
  .hdp-img-placeholder {
    width: 100%; height: 480px; background: linear-gradient(135deg, var(--navy), #1a3fa4);
    display: flex; align-items: center; justify-content: center;
    font-size: 4rem; color: rgba(255,255,255,0.3);
  }
  .hdp-thumbnails {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 3px;
    margin-top: 3px;
  }
  .hdp-thumb { width: 100%; height: 100px; object-fit: cover; cursor: pointer; transition: opacity 0.2s; }
  .hdp-thumb:hover { opacity: 0.8; }
  .hdp-img-count {
    position: absolute; bottom: 1rem; right: 1rem;
    background: rgba(0,0,0,0.65); color: white;
    border-radius: 8px; padding: 5px 12px;
    font-size: 0.8rem; font-weight: 700; backdrop-filter: blur(4px);
  }
  .hdp-verified-stamp {
    position: absolute; top: 1rem; left: 1rem;
    background: rgba(5,150,105,0.9); color: white;
    border-radius: 8px; padding: 5px 12px;
    font-size: 0.78rem; font-weight: 700;
    display: flex; align-items: center; gap: 0.35rem;
    backdrop-filter: blur(4px);
  }

  /* ── LAYOUT ── */
  .hdp-body {
    max-width: 1100px; margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
    display: grid; grid-template-columns: 1fr 380px; gap: 2rem;
    align-items: start;
  }

  .hdp-left {}

  .hdp-title-row {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 1rem; margin-bottom: 0.75rem; flex-wrap: wrap;
  }
  .hdp-title { font-size: 1.8rem; font-weight: 900; color: var(--navy); line-height: 1.2; }
  .hdp-price-tag { font-size: 1.5rem; font-weight: 900; color: var(--orange); white-space: nowrap; }
  .hdp-price-tag span { font-size: 0.82rem; font-weight: 600; color: var(--text-light); }

  .hdp-badges { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
  .hdp-badge {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.3rem 0.85rem; border-radius: 20px;
    font-size: 0.75rem; font-weight: 700;
  }
  .hdp-badge-type   { background: #eef1fb; color: var(--blue); }
  .hdp-badge-gender { background: var(--orange-pale); color: var(--orange); }
  .hdp-badge-verified { background: var(--success-pale); color: #065f46; }
  .hdp-badge-unverified { background: #fffbeb; color: #92400e; }

  .hdp-address {
    display: flex; align-items: center; gap: 0.5rem;
    color: var(--text-mid); font-size: 0.9rem; margin-bottom: 1.5rem;
    font-weight: 500;
  }
  .hdp-address svg { color: var(--orange); flex-shrink: 0; }

  .hdp-section { margin-bottom: 2rem; }
  .hdp-section-title {
    font-size: 1rem; font-weight: 800; color: var(--navy);
    margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;
    padding-bottom: 0.5rem; border-bottom: 2px solid var(--gray-light);
  }
  .hdp-section-title svg { color: var(--orange); }

  .hdp-description { color: var(--text-mid); font-size: 0.9rem; line-height: 1.8; }

  .hdp-amenities-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.6rem; }
  .hdp-amenity {
    display: flex; align-items: center; gap: 0.5rem;
    background: var(--gray-bg); border: 1px solid var(--gray-light);
    border-radius: 9px; padding: 0.6rem 0.85rem;
    font-size: 0.82rem; font-weight: 600; color: var(--text-dark);
    transition: var(--transition);
  }
  .hdp-amenity:hover { background: var(--orange-pale); border-color: var(--orange); color: var(--orange); }
  .hdp-amenity svg { color: var(--success); font-size: 0.8rem; flex-shrink: 0; }

  .hdp-avail { background: var(--gray-bg); border-radius: var(--card-radius); padding: 1.25rem; }
  .hdp-avail-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
  .hdp-avail-label { font-size: 0.85rem; font-weight: 700; color: var(--text-mid); }
  .hdp-avail-val { font-size: 1rem; font-weight: 800; color: var(--navy); }
  .hdp-avail-bar { height: 8px; background: var(--gray-light); border-radius: 4px; overflow: hidden; }
  .hdp-avail-fill { height: 100%; background: linear-gradient(90deg, var(--orange), var(--orange-light)); border-radius: 4px; transition: width 0.6s ease; }

  .hdp-owner-card {
    background: var(--gray-bg); border-radius: var(--card-radius);
    padding: 1.25rem; display: flex; align-items: center; gap: 1rem;
  }
  .hdp-owner-avatar {
    width: 54px; height: 54px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--navy), #1a3fa4);
    color: white; display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; font-weight: 800; overflow: hidden;
    box-shadow: 0 3px 10px rgba(0,0,0,0.15);
  }
  .hdp-owner-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .hdp-owner-name { font-size: 0.95rem; font-weight: 800; color: var(--navy); }
  .hdp-owner-role { font-size: 0.75rem; color: var(--text-mid); font-weight: 600; margin-top: 2px; }
  .hdp-owner-verified { font-size: 0.72rem; color: var(--success); font-weight: 700; display: flex; align-items: center; gap: 0.25rem; margin-top: 3px; }

  /* ── RIGHT COLUMN ── */
  .hdp-booking-card {
    background: white; border-radius: var(--card-radius);
    border: 1px solid var(--gray-light);
    box-shadow: 0 8px 30px rgba(0,0,0,0.1);
    overflow: hidden; position: sticky; top: 80px;
  }
  .hdp-card-head {
    background: linear-gradient(135deg, var(--navy), var(--navy2));
    padding: 1.25rem 1.5rem;
  }
  .hdp-card-price { font-size: 1.6rem; font-weight: 900; color: white; }
  .hdp-card-price span { font-size: 0.82rem; font-weight: 600; color: rgba(255,255,255,0.6); }
  .hdp-card-subtitle { font-size: 0.78rem; color: rgba(255,255,255,0.5); margin-top: 2px; }

  .hdp-card-body { padding: 1.5rem; }

  .hdp-contact-btn {
    width: 100%; padding: 0.9rem 1.5rem;
    background: linear-gradient(135deg, var(--orange), var(--orange-light));
    color: white; border: none; border-radius: 12px;
    font-size: 0.95rem; font-weight: 700; font-family: 'Manrope', sans-serif;
    cursor: pointer; transition: var(--transition);
    display: flex; align-items: center; justify-content: center; gap: 0.6rem;
    box-shadow: 0 4px 16px rgba(232,80,26,0.35);
    margin-bottom: 0.75rem;
  }
  .hdp-contact-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(232,80,26,0.45); }
  .hdp-contact-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .hdp-divider {
    display: flex; align-items: center; gap: 0.75rem;
    margin: 1rem 0; color: var(--text-light); font-size: 0.78rem; font-weight: 600;
  }
  .hdp-divider::before, .hdp-divider::after { content: ''; flex: 1; height: 1px; background: var(--gray-light); }

  .hdp-form-group { margin-bottom: 1rem; }
  .hdp-label { display: block; font-size: 0.72rem; font-weight: 700; color: var(--text-mid); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.4rem; }
  .hdp-input {
    width: 100%; padding: 0.65rem 0.9rem;
    border: 1.5px solid var(--gray-light); border-radius: 10px;
    font-family: 'Manrope', sans-serif; font-size: 0.875rem;
    color: var(--text-dark); background: white; outline: none;
    transition: var(--transition);
  }
  .hdp-input:focus { border-color: var(--orange); box-shadow: 0 0 0 3px rgba(232,80,26,0.08); }

  .hdp-price-breakdown { background: var(--gray-bg); border-radius: 10px; padding: 1rem; margin-bottom: 1rem; }
  .hdp-price-row { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem; color: var(--text-mid); }
  .hdp-price-row.total { border-top: 1px solid var(--gray-light); padding-top: 0.5rem; margin-top: 0.25rem; font-weight: 800; color: var(--navy); font-size: 0.95rem; }
  .hdp-fee-note { font-size: 0.72rem; color: var(--text-light); line-height: 1.5; margin-top: 0.5rem; }

  .hdp-book-btn {
    width: 100%; padding: 0.9rem;
    background: var(--navy); color: white; border: none; border-radius: 12px;
    font-size: 0.95rem; font-weight: 700; font-family: 'Manrope', sans-serif;
    cursor: pointer; transition: var(--transition);
    display: flex; align-items: center; justify-content: center; gap: 0.6rem;
  }
  .hdp-book-btn:hover:not(:disabled) { background: #1a3fa4; transform: translateY(-1px); }
  .hdp-book-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .hdp-trust-badges {
    display: flex; justify-content: center; gap: 1.5rem;
    margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--gray-light);
  }
  .hdp-trust-item { display: flex; align-items: center; gap: 0.35rem; font-size: 0.72rem; color: var(--text-mid); font-weight: 600; }
  .hdp-trust-item svg { color: var(--success); }

  .hdp-login-prompt {
    background: var(--orange-pale); border: 1.5px solid rgba(232,80,26,0.2);
    border-radius: 12px; padding: 1.25rem; text-align: center;
  }
  .hdp-login-prompt p { font-size: 0.88rem; color: var(--text-mid); margin-bottom: 0.75rem; line-height: 1.6; }
  .hdp-login-prompt a { color: var(--orange); font-weight: 700; text-decoration: none; }
  .hdp-login-prompt a:hover { text-decoration: underline; }

  .hdp-notice { background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 1rem; font-size: 0.85rem; color: #92400e; font-weight: 600; text-align: center; }

  @media (max-width: 900px) {
    .hdp-body { grid-template-columns: 1fr; }
    .hdp-booking-card { position: static; }
    .hdp-main-img { height: 300px; }
  }
  @media (max-width: 600px) {
    .hdp-body { padding: 1rem 0.85rem 3rem; gap: 1.25rem; }
    .hdp-title { font-size: 1.4rem; }
    .hdp-main-img { height: 240px; }
    .hdp-thumbnails { grid-template-columns: repeat(3, 1fr); }
  }
`;

const HostelDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [hostel,           setHostel]           = useState(null);
  const [booking,          setBooking]          = useState(null);
  const [loading,          setLoading]          = useState(true);
  const [bookingLoading,   setBookingLoading]   = useState(false);
  const [contactingOwner,  setContactingOwner]  = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [checkInDate,      setCheckInDate]      = useState('');
  const [duration,         setDuration]         = useState(1);
  const [isFav,            setIsFav]            = useState(false);
  const [activeImg,        setActiveImg]        = useState(0);

  // Load hostel
  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const response = await api.get(`/hostels/${id}`);
        setHostel(response.data.hostel || response.data.data);
      } catch (error) {
        toast.error('Failed to load hostel details');
        navigate('/hostels');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchHostel();
  }, [id, navigate]);

  // ✅ FIXED: Contact Owner — creates conversation and redirects correctly
  const handleContactOwner = async () => {
    if (!user) {
      toast.error('Please login to contact the owner');
      navigate('/login');
      return;
    }
    if (user.role === 'owner') {
      toast.error("You can't contact yourself as an owner");
      return;
    }
    if (!hostel?.owner?._id) {
      toast.error('Owner information not available');
      return;
    }

    setContactingOwner(true);
    try {
      const data = await messageService.getOrCreateConversation(
        hostel._id,
        hostel.owner._id
      );
      toast.success(`Chat with ${hostel.owner.firstName} started!`);
      // ✅ FIXED: correct param name is ?conversation= not ?to=
      navigate(`/messages?conversation=${data.data._id}`);
    } catch (err) {
      toast.error('Failed to start conversation. Please try again.');
    } finally {
      setContactingOwner(false);
    }
  };

  // Create booking
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to book'); navigate('/login'); return; }
    if (user.role !== 'student') { toast.error('Only students can book hostels'); return; }
    if (!checkInDate) { toast.error('Please select a check-in date'); return; }
    if (duration < 1) { toast.error('Duration must be at least 1 month'); return; }

    setBookingLoading(true);
    try {
      const bookingResponse = await api.post('/bookings', {
        hostelId: id,
        checkInDate: new Date(checkInDate),
        duration: parseInt(duration),
      });
      setBooking(bookingResponse.data.booking);
      toast.success('Booking created! Proceed to payment');
      setShowPaymentModal(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    toast.success('Payment successful! Booking confirmed.');
    setTimeout(() => navigate('/bookings'), 1500);
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="hdp-loading">
          <FaSpinner className="hdp-spinner" />
          <p>Loading hostel details...</p>
        </div>
      </>
    );
  }

  if (!hostel) {
    return (
      <>
        <style>{styles}</style>
        <div className="hdp-loading">
          <p>Hostel not found.</p>
          <button
            onClick={() => navigate('/hostels')}
            style={{ marginTop: 12, padding: '0.5rem 1.5rem', background: 'var(--orange)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'Manrope', fontWeight: 700 }}
          >
            Back to Hostels
          </button>
        </div>
      </>
    );
  }

  const images = hostel.images || [];
  const mainImg = images[activeImg]?.url || images[activeImg] || null;
  const paymentDetails = duration > 0
    ? paymentService.calculateTotal(hostel.price * duration)
    : { roomRent: 0, platformFee: 2000, totalAmount: 2000 };

  const availPct = hostel.totalRooms > 0
    ? Math.round((hostel.availableRooms / hostel.totalRooms) * 100)
    : 0;

  return (
    <>
      <style>{styles}</style>

      <div className="hdp-page">

        {/* TOP NAV */}
        <div className="hdp-topnav">
          <button className="hdp-back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
          <div className="hdp-topnav-actions">
            <button
              className={`hdp-icon-btn${isFav ? ' fav' : ''}`}
              onClick={() => setIsFav(!isFav)}
              title="Save"
            >
              {isFav ? <FaHeart /> : <FaRegHeart />}
            </button>
            <button
              className="hdp-icon-btn"
              title="Share"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied!');
              }}
            >
              <FaShare />
            </button>
          </div>
        </div>

        {/* IMAGES */}
        <div className="hdp-images">
          {mainImg
            ? <img src={mainImg} alt={hostel.name} className="hdp-main-img" />
            : <div className="hdp-img-placeholder"><FaHome /></div>
          }
          {images.length > 1 && (
            <div className="hdp-thumbnails">
              {images.slice(0, 4).map((img, idx) => (
                <img
                  key={idx}
                  src={img?.url || img}
                  alt={`${hostel.name} ${idx + 1}`}
                  className="hdp-thumb"
                  onClick={() => setActiveImg(idx)}
                  style={{
                    opacity: activeImg === idx ? 1 : 0.65,
                    outline: activeImg === idx ? '2px solid #e8501a' : 'none'
                  }}
                />
              ))}
            </div>
          )}
          {images.length > 4 && (
            <div className="hdp-img-count">+{images.length - 4} more photos</div>
          )}
          {hostel.verified && (
            <div className="hdp-verified-stamp">
              <FaCheckCircle /> Verified Hostel
            </div>
          )}
        </div>

        {/* BODY */}
        <div className="hdp-body">

          {/* ── LEFT COLUMN ── */}
          <div className="hdp-left">

            {/* Title & Price */}
            <div className="hdp-title-row">
              <h1 className="hdp-title">{hostel.name}</h1>
              <div className="hdp-price-tag">
                MK {hostel.price?.toLocaleString()}
                <span> /mo</span>
              </div>
            </div>

            {/* Badges */}
            <div className="hdp-badges">
              <span className="hdp-badge hdp-badge-type">{hostel.type}</span>
              <span className="hdp-badge hdp-badge-gender">{hostel.gender}</span>
              <span className={`hdp-badge ${hostel.verified ? 'hdp-badge-verified' : 'hdp-badge-unverified'}`}>
                {hostel.verified
                  ? <><FaCheckCircle /> Verified</>
                  : '⏳ Pending Verification'
                }
              </span>
            </div>

            {/* Address */}
            <div className="hdp-address">
              <FaMapMarkerAlt />
              {hostel.address}
            </div>

            {/* Description */}
            <div className="hdp-section">
              <div className="hdp-section-title"><FaHome /> About This Hostel</div>
              <p className="hdp-description">{hostel.description}</p>
            </div>

            {/* Amenities */}
            {hostel.amenities?.length > 0 && (
              <div className="hdp-section">
                <div className="hdp-section-title"><FaCheckCircle /> Amenities</div>
                <div className="hdp-amenities-grid">
                  {hostel.amenities.map((a, i) => (
                    <div key={i} className="hdp-amenity">
                      <FaCheckCircle /> {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            <div className="hdp-section">
              <div className="hdp-section-title"><FaDoorOpen /> Room Availability</div>
              <div className="hdp-avail">
                <div className="hdp-avail-row">
                  <span className="hdp-avail-label">Available Rooms</span>
                  <span className="hdp-avail-val">
                    {hostel.availableRooms} / {hostel.totalRooms}
                  </span>
                </div>
                <div className="hdp-avail-bar">
                  <div className="hdp-avail-fill" style={{ width: `${availPct}%` }} />
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '0.5rem', fontWeight: 600 }}>
                  {hostel.availableRooms === 0
                    ? '❌ No rooms available'
                    : `✅ ${availPct}% availability`}
                </p>
              </div>
            </div>

            {/* Owner Info */}
            {hostel.owner && (
              <div className="hdp-section">
                <div className="hdp-section-title"><FaUser /> Hostel Owner</div>
                <div className="hdp-owner-card">
                  <div className="hdp-owner-avatar">
                    {hostel.owner.profilePicture
                      ? <img src={hostel.owner.profilePicture} alt={hostel.owner.firstName} />
                      : (hostel.owner.firstName?.[0] || 'O').toUpperCase()
                    }
                  </div>
                  <div>
                    <div className="hdp-owner-name">
                      {hostel.owner.firstName} {hostel.owner.lastName}
                    </div>
                    <div className="hdp-owner-role">Hostel Owner</div>
                    {hostel.owner.verified && (
                      <div className="hdp-owner-verified">
                        <FaCheckCircle /> Verified Owner
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="hdp-right">
            <div className="hdp-booking-card">
              <div className="hdp-card-head">
                <div className="hdp-card-price">
                  MK {hostel.price?.toLocaleString()}<span> /month</span>
                </div>
                <div className="hdp-card-subtitle">
                  {hostel.availableRooms > 0
                    ? `${hostel.availableRooms} room${hostel.availableRooms !== 1 ? 's' : ''} available`
                    : 'No rooms available'}
                </div>
              </div>

              <div className="hdp-card-body">

                {/* CONTACT OWNER BUTTON */}
                {user && user.role !== 'owner' && hostel.owner && (
                  <button
                    className="hdp-contact-btn"
                    onClick={handleContactOwner}
                    disabled={contactingOwner}
                  >
                    {contactingOwner
                      ? <><FaSpinner style={{ animation: 'spin 0.8s linear infinite' }} /> Connecting...</>
                      : <><FaComments /> Chat with Owner</>
                    }
                  </button>
                )}

                {/* Not logged in */}
                {!user && (
                  <button
                    className="hdp-contact-btn"
                    onClick={() => navigate('/login')}
                  >
                    <FaComments /> Login to Contact Owner
                  </button>
                )}

                {/* Divider */}
                {user?.role === 'student' && hostel.availableRooms > 0 && (
                  <div className="hdp-divider">or book directly</div>
                )}

                {/* BOOKING FORM */}
                {user?.role === 'student' && (
                  <form onSubmit={handleCreateBooking}>
                    <div className="hdp-form-group">
                      <label className="hdp-label">Check-in Date *</label>
                      <input
                        type="date"
                        className="hdp-input"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        disabled={bookingLoading}
                      />
                    </div>
                    <div className="hdp-form-group">
                      <label className="hdp-label">Duration (months) *</label>
                      <input
                        type="number"
                        className="hdp-input"
                        min="1"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                        disabled={bookingLoading}
                      />
                    </div>

                    {duration > 0 && (
                      <div className="hdp-price-breakdown">
                        <div className="hdp-price-row">
                          <span>Room rent ({duration} month{duration > 1 ? 's' : ''})</span>
                          <span>MK {(hostel.price * duration).toLocaleString()}</span>
                        </div>
                        <div className="hdp-price-row">
                          <span>Platform fee</span>
                          <span>MK 2,000</span>
                        </div>
                        <div className="hdp-price-row total">
                          <span>Total</span>
                          <span>MK {paymentDetails.totalAmount?.toLocaleString()}</span>
                        </div>
                        <p className="hdp-fee-note">
                          💡 Platform fee protects both students and owners
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="hdp-book-btn"
                      disabled={bookingLoading || hostel.availableRooms === 0}
                    >
                      {bookingLoading
                        ? <><FaSpinner style={{ animation: 'spin 0.8s linear infinite' }} /> Creating Booking...</>
                        : hostel.availableRooms === 0
                          ? '❌ No Rooms Available'
                          : <><FaBed /> Book & Pay Now</>
                      }
                    </button>
                  </form>
                )}

                {/* Owner notice */}
                {user?.role === 'owner' && (
                  <div className="hdp-notice">
                    🏠 This is a hostel listing. Only students can book or contact owners.
                  </div>
                )}

                {/* Not logged in booking prompt */}
                {!user && (
                  <>
                    <div className="hdp-divider">want to book?</div>
                    <div className="hdp-login-prompt">
                      <p>
                        Please <a href="/login">login as a student</a> to book this hostel
                        or <a href="/register">create an account</a> for free.
                      </p>
                    </div>
                  </>
                )}

                {/* Trust badges */}
                <div className="hdp-trust-badges">
                  <div className="hdp-trust-item"><FaShieldAlt /> Secure</div>
                  <div className="hdp-trust-item"><FaCheckCircle /> Verified</div>
                  <div className="hdp-trust-item"><FaStar style={{ color: '#f59e0b' }} /> Trusted</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {booking && hostel && (
        <PaymentModal
          booking={booking}
          hostel={hostel}
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setCheckInDate('');
            setDuration(1);
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};

export default HostelDetailsPage;