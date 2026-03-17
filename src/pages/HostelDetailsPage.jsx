import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHostel } from '../context/HostelContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import PaymentModal from '../components/payment/PaymentModal';
import bookingService from '../services/bookingService';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy: #0d1b3e; --blue: #1a3fa4; --orange: #e8501a;
    --white: #fff; --gray-bg: #f0f2f5; --gray-light: #e4e6eb;
    --text-dark: #050505; --text-mid: #65676b; --success: #10b981;
    --radius: 12px;
  }
  html, body { font-family: "Manrope", sans-serif; background: var(--gray-bg); color: var(--text-dark); }
  .hd-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 999; background: var(--white); box-shadow: 0 2px 8px rgba(0,0,0,0.1); height: 56px; display: flex; align-items: center; justify-content: space-between; padding: 0 1.5rem; }
  .hd-bar-back { display: flex; align-items: center; gap: 0.5rem; background: none; border: none; cursor: pointer; color: var(--navy); font-weight: 700; font-size: 0.95rem; font-family: "Manrope", sans-serif; padding: 0.4rem 0.8rem; border-radius: 6px; transition: background 0.2s; }
  .hd-bar-back:hover { background: var(--gray-light); }
  .hd-bar-logo { font-size: 1.1rem; font-weight: 800; color: var(--orange); text-decoration: none; }
  .hd-bar-right { display: flex; gap: 0.75rem; }
  .hd-bar-btn { padding: 0.4rem 1rem; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; font-size: 0.85rem; font-family: "Manrope", sans-serif; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem; }
  .hd-bar-btn-solid { background: var(--orange); color: var(--white); }
  .hd-bar-btn-solid:hover { opacity: 0.9; }
  .hd-bar-btn-ghost { background: var(--gray-light); color: var(--text-dark); }
  .hd-bar-btn-ghost:hover { background: #dddfe1; }
  .hd-page { padding-top: 72px; max-width: 1180px; margin: 0 auto; padding-bottom: 4rem; display: grid; grid-template-columns: 1fr 380px; gap: 1.5rem; padding-left: 1rem; padding-right: 1rem; }
  .carousel-wrap { background: var(--white); border-radius: var(--radius); overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
  .carousel-stage { position: relative; width: 100%; background: #111; aspect-ratio: 16/10; overflow: hidden; }
  .carousel-img { width: 100%; height: 100%; object-fit: contain; display: block; transition: opacity 0.3s; }
  .carousel-no-image { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #e5e7eb; color: var(--text-mid); font-size: 1rem; flex-direction: column; gap: 0.5rem; }
  .carousel-no-image i { font-size: 3rem; opacity: 0.4; }
  .car-btn { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.55); color: var(--white); border: none; width: 46px; height: 46px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; transition: background 0.2s; z-index: 10; }
  .car-btn:hover { background: rgba(0,0,0,0.85); }
  .car-prev { left: 12px; } .car-next { right: 12px; }
  .car-counter { position: absolute; bottom: 12px; right: 14px; background: rgba(0,0,0,0.65); color: var(--white); padding: 4px 10px; border-radius: 20px; font-size: 0.82rem; font-weight: 600; }
  .car-actions { position: absolute; top: 12px; right: 12px; display: flex; gap: 0.6rem; }
  .car-action-btn { background: rgba(255,255,255,0.92); border: none; width: 38px; height: 38px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1rem; transition: all 0.2s; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
  .car-action-btn:hover { transform: scale(1.1); background: var(--white); }
  .car-action-btn.liked { color: #ef4444; }
  .thumb-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(72px, 1fr)); gap: 6px; padding: 10px; background: #fafafa; border-top: 1px solid var(--gray-light); }
  .thumb { aspect-ratio: 1; border-radius: 6px; overflow: hidden; cursor: pointer; border: 2.5px solid transparent; transition: all 0.2s; }
  .thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .thumb:hover { border-color: var(--text-mid); } .thumb.active { border-color: var(--orange); }
  .detail-card { background: var(--white); border-radius: var(--radius); padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.1); margin-top: 1rem; }
  .detail-price { font-size: 2.2rem; font-weight: 800; color: var(--orange); line-height: 1; margin-bottom: 0.75rem; }
  .detail-price span { font-size: 1rem; font-weight: 500; color: var(--text-mid); }
  .detail-name { font-size: 1.6rem; font-weight: 800; color: var(--text-dark); margin-bottom: 0.5rem; }
  .detail-location { display: flex; align-items: center; gap: 0.5rem; color: var(--text-mid); font-size: 0.9rem; margin-bottom: 0.75rem; }
  .detail-location i { color: var(--orange); }
  .detail-rating { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.25rem; }
  .stars-gold { color: #f59e0b; letter-spacing: 2px; } .rating-count { color: var(--text-mid); font-size: 0.85rem; }
  .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; border-top: 1px solid var(--gray-light); border-bottom: 1px solid var(--gray-light); padding: 1.25rem 0; margin-bottom: 1.25rem; }
  .dg-item { display: flex; align-items: center; gap: 0.65rem; }
  .dg-icon { width: 36px; height: 36px; border-radius: 8px; background: rgba(232,80,26,0.1); display: flex; align-items: center; justify-content: center; font-size: 1rem; color: var(--orange); flex-shrink: 0; }
  .dg-text small { display: block; font-size: 0.72rem; color: var(--text-mid); font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }
  .dg-text strong { display: block; font-size: 0.92rem; font-weight: 700; color: var(--text-dark); text-transform: capitalize; }
  .section-heading { font-size: 1rem; font-weight: 800; color: var(--text-dark); margin-bottom: 0.75rem; }
  .detail-desc { color: var(--text-mid); line-height: 1.7; font-size: 0.92rem; margin-bottom: 1.25rem; }
  .amenities-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.65rem; margin-bottom: 1.5rem; }
  .amenity-chip { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 0.8rem; background: var(--gray-bg); border-radius: 8px; font-size: 0.85rem; color: var(--text-dark); font-weight: 500; }
  .amenity-chip i { color: var(--orange); width: 16px; text-align: center; }
  .map-card { background: var(--white); border-radius: var(--radius); padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.1); margin-top: 1rem; }
  .map-card h3 { font-size: 1rem; font-weight: 800; margin-bottom: 1rem; color: var(--text-dark); }
  .map-embed { width: 100%; height: 300px; border-radius: 10px; overflow: hidden; border: none; }
  .map-address { margin-top: 0.75rem; color: var(--text-mid); font-size: 0.87rem; display: flex; gap: 0.4rem; align-items: flex-start; }
  .map-address i { color: var(--orange); margin-top: 2px; }
  .sidebar { position: sticky; top: 72px; height: fit-content; display: flex; flex-direction: column; gap: 1rem; }
  .owner-card { background: var(--white); border-radius: var(--radius); padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
  .owner-top { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--gray-light); }
  .owner-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--navy), var(--blue)); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: var(--white); flex-shrink: 0; }
  .owner-info-name { font-size: 1rem; font-weight: 800; color: var(--text-dark); }
  .owner-info-role { font-size: 0.8rem; color: var(--text-mid); margin-bottom: 0.2rem; }
  .owner-online { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.78rem; color: var(--success); font-weight: 600; }
  .owner-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--success); }
  .owner-btns { display: flex; flex-direction: column; gap: 0.7rem; }
  .owner-btn { width: 100%; padding: 0.75rem; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s; font-family: "Manrope", sans-serif; }
  .owner-btn-blue { background: var(--blue); color: var(--white); } .owner-btn-blue:hover { background: var(--navy); }
  .owner-btn-green { background: #10b981; color: var(--white); } .owner-btn-green:hover { background: #059669; }
  .owner-btn-ghost { background: var(--gray-light); color: var(--text-dark); } .owner-btn-ghost:hover { background: #dddfe1; }
  .book-card { background: var(--white); border-radius: var(--radius); padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
  .book-price-display { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .book-price-big { font-size: 1.5rem; font-weight: 800; color: var(--orange); }
  .book-rooms-badge { background: rgba(16,185,129,0.12); color: var(--success); font-size: 0.8rem; font-weight: 700; padding: 0.3rem 0.75rem; border-radius: 20px; }
  .book-btn { width: 100%; padding: 0.85rem; background: var(--orange); color: var(--white); border: none; border-radius: 8px; font-size: 1rem; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: "Manrope", sans-serif; }
  .book-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .book-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .book-divider { border: none; border-top: 1px solid var(--gray-light); margin: 1rem 0; }
  .book-info-row { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem; }
  .book-info-row span { color: var(--text-mid); } .book-info-row strong { color: var(--text-dark); text-transform: capitalize; }
  .booking-form-container { background: var(--white); border-radius: var(--radius); padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.1); display: none; animation: slideDown 0.3s ease-out; }
  @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  .booking-form-container.open { display: block; }
  .booking-form-container h3 { font-size: 1.1rem; font-weight: 800; margin-bottom: 1rem; color: var(--text-dark); }
  .form-group { margin-bottom: 1rem; }
  .form-group label { display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-dark); margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.3px; }
  .form-group input { width: 100%; padding: 0.75rem; border: 1.5px solid var(--gray-light); border-radius: 8px; font-size: 0.95rem; font-family: "Manrope", sans-serif; transition: border-color 0.2s; background: white; color: var(--text-dark); }
  .form-group input:focus { outline: none; border-color: var(--orange); box-shadow: 0 0 0 3px rgba(232,80,26,0.1); }
  .price-breakdown { background: var(--gray-bg); padding: 1rem; border-radius: 8px; margin: 1rem 0; border-left: 4px solid var(--orange); }
  .price-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem; }
  .price-row span { color: var(--text-mid); } .price-row strong { color: var(--text-dark); }
  .price-row.total { border-top: 1px solid var(--gray-light); padding-top: 0.75rem; margin-top: 0.75rem; font-weight: 800; font-size: 1rem; }
  .price-row.total strong { color: var(--orange); }
  .form-error { background: #fee2e2; color: #991b1b; padding: 0.75rem; border-radius: 6px; font-size: 0.85rem; margin-bottom: 1rem; border-left: 3px solid #dc2626; }
  .form-success { background: #dcfce7; color: #15803d; padding: 0.75rem; border-radius: 6px; font-size: 0.85rem; margin-bottom: 1rem; border-left: 3px solid #16a34a; }
  .hd-center { max-width: 1180px; margin: 0 auto; padding: 6rem 1rem 2rem; text-align: center; }
  .hd-spinner { width: 48px; height: 48px; border: 4px solid var(--gray-light); border-top-color: var(--orange); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1.5rem; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .hd-error { font-size: 1.1rem; color: var(--text-mid); margin-bottom: 1rem; }
  @media (max-width: 960px) { .hd-page { grid-template-columns: 1fr; } .sidebar { position: static; } }
  @media (max-width: 600px) {
    .hd-page { padding-left: 0.5rem; padding-right: 0.5rem; gap: 1rem; }
    .detail-price { font-size: 1.7rem; } .detail-name { font-size: 1.2rem; }
    .detail-grid { grid-template-columns: 1fr; } .amenities-grid { grid-template-columns: 1fr; }
    .thumb-row { grid-template-columns: repeat(auto-fill, minmax(56px, 1fr)); }
    .map-embed { height: 220px; }
  }
`;

const AMENITY_ICONS = {
  'WiFi': 'fa-wifi', 'Water 24/7': 'fa-tint', 'Electricity Backup': 'fa-bolt',
  'Security Guard': 'fa-shield-alt', 'CCTV': 'fa-video', 'Parking': 'fa-car',
  'Kitchen': 'fa-utensils', 'Laundry': 'fa-tshirt', 'Study Room': 'fa-book',
  'Common Area': 'fa-users', 'Furniture Included': 'fa-couch',
  'Air Conditioning': 'fa-wind', 'Hot Shower': 'fa-shower',
};

const getTodayStr = () => new Date().toISOString().split('T')[0];
const getTomorrowStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const parseDate = (str) => {
  if (!str) return null;
  const s = str.trim();
  if (!s) return null;
  if (s.includes('/')) {
    const parts = s.split('/');
    if (parts.length === 3) {
      const [month, day, year] = parts;
      return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
    }
  }
  return new Date(s);
};

export default function HostelDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentHostel, loading, fetchHostelById } = useHostel();
  const { user, isAuthenticated } = useAuth();

  const [imgIndex, setImgIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [booking, setBooking] = useState(null);
  const [bookingData, setBookingData] = useState({ checkInDate: getTomorrowStr(), duration: 1 });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => { fetchHostelById(id); window.scrollTo(0, 0); }, [id]);

  if (loading) return (
    <>
      <style>{styles}</style>
      <nav className="hd-bar">
        <button className="hd-bar-back" onClick={() => navigate(-1)}><i className="fa fa-arrow-left" /> Back</button>
        <a href="/" className="hd-bar-logo">🏠 HostelLink</a>
        <div />
      </nav>
      <div className="hd-center"><div className="hd-spinner" /><p style={{ color: '#65676b' }}>Loading...</p></div>
    </>
  );

  if (!currentHostel) return (
    <>
      <style>{styles}</style>
      <nav className="hd-bar">
        <button className="hd-bar-back" onClick={() => navigate(-1)}><i className="fa fa-arrow-left" /> Back</button>
        <a href="/" className="hd-bar-logo">🏠 HostelLink</a>
        <div />
      </nav>
      <div className="hd-center">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏠</div>
        <p className="hd-error">Hostel not found.</p>
        <button className="hd-bar-btn hd-bar-btn-solid" style={{ margin: '0 auto', display: 'inline-flex' }} onClick={() => navigate('/hostels')}>Browse All Hostels</button>
      </div>
    </>
  );

  const images = currentHostel.images?.length > 0 ? currentHostel.images : [];
  const prevImg = () => setImgIndex(p => (p - 1 + images.length) % images.length);
  const nextImg = () => setImgIndex(p => (p + 1) % images.length);
  const rating = currentHostel.averageRating || 4.5;
  const starsStr = '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '');
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(currentHostel.address || currentHostel.name)}&output=embed`;

  const handleMessage = () => {
    if (!isAuthenticated) { toast.error('Please login to message the owner'); navigate('/login'); return; }
    navigate(`/messages?to=${currentHostel.owner?._id}`);
  };

  const handleShare = () => {
    if (navigator.share) { navigator.share({ title: currentHostel.name, url: window.location.href }); }
    else { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }
  };

  const calculatePrice = () => {
    const dur = parseInt(bookingData.duration) || 1;
    if (dur > 0) {
      const roomCost = currentHostel.price * dur;
      return { roomCost, platformFee: 2000, totalAmount: roomCost + 2000 };
    }
    return null;
  };
  const priceBreakdown = calculatePrice();

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');

    if (!isAuthenticated) {
      setBookingError('Please login to book');
      setTimeout(() => navigate('/login'), 500);
      return;
    }

    const rawDate = bookingData.checkInDate;
    if (!rawDate || rawDate.trim() === '') {
      setBookingError('Please select a check-in date');
      return;
    }

    const selectedDate = parseDate(rawDate);
    if (!selectedDate || isNaN(selectedDate.getTime())) {
      setBookingError('Please enter a valid check-in date');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setBookingError('Check-in date cannot be in the past');
      return;
    }

    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day   = String(selectedDate.getDate()).padStart(2, '0');
    const year  = selectedDate.getFullYear();
    const normalizedDate = `${year}-${month}-${day}`;

    const dur = parseInt(bookingData.duration);
    if (!dur || dur < 1) {
      setBookingError('Duration must be at least 1 month');
      return;
    }

    if (user?.role !== 'student') {
      setBookingError('Only students can make bookings');
      return;
    }

    setBookingLoading(true);
    try {
      const response = await bookingService.createBooking({
        hostelId: id,
        checkInDate: normalizedDate,
        duration: dur,
        studentId: user._id,
      });

      if (response?.booking) {
        setBooking(response.booking);
        setBookingSuccess('✓ Booking created! Proceeding to payment...');
        setShowBookingForm(false);
        setTimeout(() => setShowPaymentModal(true), 800);
      } else {
        setBookingError('Failed to create booking. Please try again.');
      }
    } catch (error) {
      setBookingError(error.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setShowBookingForm(false);
    setBookingData({ checkInDate: getTomorrowStr(), duration: 1 });
    setBooking(null);
    toast.success('🎉 Payment successful! Booking confirmed.');
    setTimeout(() => navigate('/bookings'), 1500);
  };

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      <nav className="hd-bar">
        <button className="hd-bar-back" onClick={() => navigate(-1)}><i className="fa fa-arrow-left" /> Back</button>
        <a href="/" className="hd-bar-logo">🏠 HostelLink</a>
        <div className="hd-bar-right">
          {isAuthenticated
            ? <a href="/dashboard" className="hd-bar-btn hd-bar-btn-ghost"><i className="fa fa-th-large" /> Dashboard</a>
            : <><a href="/login" className="hd-bar-btn hd-bar-btn-ghost">Login</a><a href="/register" className="hd-bar-btn hd-bar-btn-solid">Sign Up</a></>
          }
        </div>
      </nav>

      <div className="hd-page">
        <div>
          <div className="carousel-wrap">
            <div className="carousel-stage">
              {images.length > 0
                ? <img className="carousel-img" src={images[imgIndex]} alt={`${currentHostel.name} photo ${imgIndex + 1}`} />
                : <div className="carousel-no-image"><i className="fa fa-image" /><span>No photos uploaded yet</span></div>
              }
              {images.length > 1 && (
                <>
                  <button className="car-btn car-prev" onClick={prevImg}><i className="fa fa-chevron-left" /></button>
                  <button className="car-btn car-next" onClick={nextImg}><i className="fa fa-chevron-right" /></button>
                  <div className="car-counter">{imgIndex + 1} / {images.length}</div>
                </>
              )}
              <div className="car-actions">
                <button className={`car-action-btn${liked ? ' liked' : ''}`} onClick={() => setLiked(l => !l)}>
                  <i className={liked ? 'fa fa-heart' : 'far fa-heart'} />
                </button>
                <button className="car-action-btn" onClick={handleShare}><i className="fa fa-share-alt" /></button>
              </div>
            </div>
            {images.length > 1 && (
              <div className="thumb-row">
                {images.map((img, idx) => (
                  <div key={idx} className={`thumb${idx === imgIndex ? ' active' : ''}`} onClick={() => setImgIndex(idx)}>
                    <img src={img} alt={`Thumb ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="detail-card">
            <div className="detail-price">MK {currentHostel.price.toLocaleString()} <span>/ month</span></div>
            <div className="detail-name">{currentHostel.name}</div>
            <div className="detail-location"><i className="fa fa-map-marker-alt" /> {currentHostel.address}</div>
            <div className="detail-rating">
              <span className="stars-gold">{starsStr}</span>
              <span className="rating-count">{rating.toFixed(1)} · {currentHostel.reviewCount || 0} reviews</span>
              {currentHostel.verified && (
                <span style={{ marginLeft: '0.5rem', background: 'rgba(16,185,129,0.12)', color: '#10b981', fontSize: '0.78rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>
                  <i className="fa fa-check-circle" /> Verified
                </span>
              )}
            </div>
            <div className="detail-grid">
              {[
                { icon: 'fa-door-open',  label: 'Total Rooms',    value: currentHostel.totalRooms },
                { icon: 'fa-check-circle', label: 'Available Now', value: `${currentHostel.availableRooms} rooms`, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
                { icon: 'fa-home',       label: 'Room Type',      value: currentHostel.type },
                { icon: 'fa-venus-mars', label: 'Gender',         value: currentHostel.gender },
                { icon: 'fa-phone',      label: 'Contact Phone',  value: currentHostel.contactPhone },
                { icon: 'fa-eye',        label: 'Total Views',    value: currentHostel.viewCount || 0 },
              ].map((item, i) => (
                <div key={i} className="dg-item">
                  <div className="dg-icon" style={item.bg ? { background: item.bg } : {}}>
                    <i className={`fa ${item.icon}`} style={item.color ? { color: item.color } : {}} />
                  </div>
                  <div className="dg-text">
                    <small>{item.label}</small>
                    <strong style={item.color ? { color: item.color } : {}}>{item.value}</strong>
                  </div>
                </div>
              ))}
            </div>
            <p className="section-heading">About this Hostel</p>
            <p className="detail-desc">{currentHostel.description}</p>
            {currentHostel.amenities?.length > 0 && (
              <>
                <p className="section-heading">Amenities & Features</p>
                <div className="amenities-grid">
                  {currentHostel.amenities.map(a => (
                    <div key={a} className="amenity-chip"><i className={`fa ${AMENITY_ICONS[a] || 'fa-check'}`} /> {a}</div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="map-card">
            <h3><i className="fa fa-map-marked-alt" style={{ color: 'var(--orange)', marginRight: '0.4rem' }} /> Location on Map</h3>
            <iframe className="map-embed" title="Hostel Location" src={mapEmbedUrl} allowFullScreen loading="lazy" />
            <div className="map-address"><i className="fa fa-map-marker-alt" /><span>{currentHostel.address}</span></div>
          </div>
        </div>

        <div className="sidebar">
          <div className="book-card">
            <div className="book-price-display">
              <div className="book-price-big">
                MK {currentHostel.price.toLocaleString()}
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#65676b' }}>/mo</span>
              </div>
              <div className="book-rooms-badge">{currentHostel.availableRooms} rooms free</div>
            </div>
            {!isAuthenticated && (
              <button className="book-btn" onClick={() => navigate('/login')}>
                <i className="fa fa-sign-in-alt" /> Login to Book
              </button>
            )}
            {isAuthenticated && user?.role === 'owner' && (
              <div style={{ background: '#f4f6fa', borderRadius: 8, padding: '0.75rem', textAlign: 'center', fontSize: '0.85rem', color: '#65676b', fontWeight: 600 }}>
                Only students can book hostels
              </div>
            )}
            {isAuthenticated && user?.role === 'student' && (
              <button
                className="book-btn"
                onClick={() => { setShowBookingForm(!showBookingForm); setBookingError(''); setBookingSuccess(''); }}
                disabled={currentHostel.availableRooms === 0}
              >
                <i className="fa fa-calendar-check" />
                {currentHostel.availableRooms === 0 ? ' No Rooms Available' : showBookingForm ? ' Hide Form' : ' Book Now'}
              </button>
            )}
            <hr className="book-divider" />
            <div className="book-info-row"><span>Room Type</span><strong>{currentHostel.type}</strong></div>
            <div className="book-info-row"><span>Gender</span><strong>{currentHostel.gender}</strong></div>
            <div className="book-info-row"><span>Available</span><strong>{currentHostel.availableRooms} of {currentHostel.totalRooms}</strong></div>
            <div className="book-info-row">
              <span>Status</span>
              <strong style={{ color: currentHostel.verified ? '#10b981' : '#6b7280' }}>
                {currentHostel.verified ? '✓ Verified' : 'Unverified'}
              </strong>
            </div>
          </div>

          <form className={`booking-form-container${showBookingForm ? ' open' : ''}`} onSubmit={handleCreateBooking}>
            <h3>📅 Book This Hostel</h3>
            {bookingError && (
              <div className="form-error"><i className="fa fa-exclamation-circle" /> {bookingError}</div>
            )}
            {bookingSuccess && (
              <div className="form-success"><i className="fa fa-check-circle" /> {bookingSuccess}</div>
            )}
            <div className="form-group">
              <label>Check-in Date *</label>
              <input
                type="date"
                value={bookingData.checkInDate}
                min={getTodayStr()}
                onChange={e => {
                  setBookingData(prev => ({ ...prev, checkInDate: e.target.value }));
                  setBookingError('');
                }}
              />
            </div>
            <div className="form-group">
              <label>Duration (months) *</label>
              <input
                type="number"
                min="1"
                max="12"
                value={bookingData.duration}
                onChange={e => {
                  setBookingData(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }));
                  setBookingError('');
                }}
              />
            </div>
            {priceBreakdown && (
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Room Rent ({bookingData.duration}m):</span>
                  <strong>MK {priceBreakdown.roomCost.toLocaleString()}</strong>
                </div>
                <div className="price-row">
                  <span>Platform Fee:</span>
                  <strong>MK 2,000</strong>
                </div>
                <div className="price-row total">
                  <span>Total to Pay:</span>
                  <strong>MK {priceBreakdown.totalAmount.toLocaleString()}</strong>
                </div>
              </div>
            )}
            <button type="submit" className="book-btn" disabled={bookingLoading} style={{ marginTop: '0.5rem' }}>
              {bookingLoading
                ? <><i className="fa fa-spinner fa-spin" /> Creating Booking...</>
                : <><i className="fa fa-arrow-right" /> Continue to Payment</>
              }
            </button>
          </form>

          {booking && (
            <PaymentModal
              booking={booking}
              hostel={currentHostel}
              isOpen={showPaymentModal}
              onClose={() => {
                setShowPaymentModal(false);
                setShowBookingForm(false);
                setBookingData({ checkInDate: getTomorrowStr(), duration: 1 });
              }}
              onSuccess={handlePaymentSuccess}
            />
          )}

          <div className="owner-card">
            <div className="owner-top">
              <div className="owner-avatar">
                {currentHostel.owner?.firstName?.[0]?.toUpperCase() || '👤'}
              </div>
              <div>
                <div className="owner-info-role">Listed by</div>
                <div className="owner-info-name">
                  {currentHostel.owner?.firstName} {currentHostel.owner?.lastName}
                </div>
                <div className="owner-online"><div className="owner-dot" /> Active on HostelLink</div>
              </div>
            </div>
            <div className="owner-btns">
              <button className="owner-btn owner-btn-blue" onClick={handleMessage}>
                <i className="fa fa-comment-dots" /> Message Owner
              </button>
              <a href={`tel:${currentHostel.contactPhone}`} className="owner-btn owner-btn-green" style={{ textDecoration: 'none' }}>
                <i className="fa fa-phone" /> Call: {currentHostel.contactPhone}
              </a>
              {currentHostel.owner?.email && (
                <a href={`mailto:${currentHostel.owner.email}`} className="owner-btn owner-btn-ghost" style={{ textDecoration: 'none' }}>
                  <i className="fa fa-envelope" /> Email Owner
                </a>
              )}
            </div>
          </div>

          <button
            onClick={() => toast.info('Thank you for helping keep HostelLink safe.')}
            style={{ width: '100%', padding: '0.65rem', background: 'transparent', border: '1px solid var(--gray-light)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-mid)', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s', fontFamily: 'Manrope, sans-serif' }}
          >
            <i className="fa fa-flag" /> Report this listing
          </button>
        </div>
      </div>
    </>
  );
}