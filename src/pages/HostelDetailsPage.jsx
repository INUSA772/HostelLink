import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHostel } from '../context/HostelContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import PaymentModal from '../components/payment/PaymentModal';
import bookingService from '../services/bookingService';
import paymentService from '../services/paymentService';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0d1b3e; --blue: #1a3fa4; --orange: #e8501a;
    --white: #fff; --gray-bg: #f0f2f5; --gray-light: #e4e6eb;
    --text-dark: #050505; --text-mid: #65676b; --success: #10b981;
    --radius: 12px;
  }

  body { font-family: 'Manrope', sans-serif; background: var(--gray-bg); color: var(--text-dark); }

  /* TOPBAR */
  .hd-bar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 999;
    background: var(--white); box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    height: 56px; display: flex; align-items: center;
    justify-content: space-between; padding: 0 1.5rem;
  }
  .hd-bar-back {
    display: flex; align-items: center; gap: 0.5rem;
    background: none; border: none; cursor: pointer;
    color: var(--navy); font-weight: 700; font-size: 0.95rem;
    font-family: 'Manrope', sans-serif; padding: 0.4rem 0.8rem;
    border-radius: 6px; transition: background 0.2s;
  }
  .hd-bar-back:hover { background: var(--gray-light); }
  .hd-bar-logo { font-size: 1.1rem; font-weight: 800; color: var(--orange); text-decoration: none; }
  .hd-bar-right { display: flex; gap: 0.75rem; }
  .hd-bar-btn {
    padding: 0.4rem 1rem; border-radius: 6px; border: none;
    cursor: pointer; font-weight: 600; font-size: 0.85rem;
    font-family: 'Manrope', sans-serif; transition: all 0.2s; text-decoration: none;
    display: inline-flex; align-items: center; gap: 0.4rem;
  }
  .hd-bar-btn-solid { background: var(--orange); color: var(--white); }
  .hd-bar-btn-solid:hover { opacity: 0.9; }
  .hd-bar-btn-ghost { background: var(--gray-light); color: var(--text-dark); }
  .hd-bar-btn-ghost:hover { background: #dddfe1; }

  /* PAGE BODY */
  .hd-page { padding-top: 72px; max-width: 1180px; margin: 0 auto; padding-bottom: 4rem; display: grid; grid-template-columns: 1fr 380px; gap: 1.5rem; padding-left: 1rem; padding-right: 1rem; }

  /* CAROUSEL */
  .carousel-wrap { background: var(--white); border-radius: var(--radius); overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
  .carousel-stage { position: relative; width: 100%; background: #111; aspect-ratio: 16/10; overflow: hidden; }
  .carousel-img { width: 100%; height: 100%; object-fit: contain; display: block; transition: opacity 0.3s; }
  .carousel-no-image { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #e5e7eb; color: var(--text-mid); font-size: 1rem; flex-direction: column; gap: 0.5rem; }
  .carousel-no-image i { font-size: 3rem; opacity: 0.4; }
  .car-btn {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: rgba(0,0,0,0.55); color: var(--white); border: none;
    width: 46px; height: 46px; border-radius: 50%; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; transition: background 0.2s; z-index: 10;
  }
  .car-btn:hover { background: rgba(0,0,0,0.85); }
  .car-prev { left: 12px; }
  .car-next { right: 12px; }
  .car-counter {
    position: absolute; bottom: 12px; right: 14px;
    background: rgba(0,0,0,0.65); color: var(--white);
    padding: 4px 10px; border-radius: 20px; font-size: 0.82rem; font-weight: 600;
  }
  .car-actions { position: absolute; top: 12px; right: 12px; display: flex; gap: 0.6rem; }
  .car-action-btn {
    background: rgba(255,255,255,0.92); border: none; width: 38px; height: 38px;
    border-radius: 50%; cursor: pointer; display: flex; align-items: center;
    justify-content: center; font-size: 1rem; transition: all 0.2s; box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }
  .car-action-btn:hover { transform: scale(1.1); background: var(--white); }
  .car-action-btn.liked { color: #ef4444; }

  /* THUMBNAILS */
  .thumb-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(72px, 1fr)); gap: 6px; padding: 10px; background: #fafafa; border-top: 1px solid var(--gray-light); }
  .thumb {
    aspect-ratio: 1; border-radius: 6px; overflow: hidden; cursor: pointer;
    border: 2.5px solid transparent; transition: all 0.2s;
  }
  .thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .thumb:hover { border-color: var(--text-mid); }
  .thumb.active { border-color: var(--orange); }

  /* DETAIL CARD */
  .detail-card { background: var(--white); border-radius: var(--radius); padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.1); margin-top: 1rem; }
  .detail-price { font-size: 2.2rem; font-weight: 800; color: var(--orange); line-height: 1; margin-bottom: 0.75rem; }
  .detail-price span { font-size: 1rem; font-weight: 500; color: var(--text-mid); }
  .detail-name { font-size: 1.6rem; font-weight: 800; color: var(--text-dark); margin-bottom: 0.5rem; }
  .detail-location { display: flex; align-items: center; gap: 0.5rem; color: var(--text-mid); font-size: 0.9rem; margin-bottom: 0.75rem; }
  .detail-location i { color: var(--orange); }
  .detail-rating { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.25rem; }
  .stars-gold { color: #f59e0b; letter-spacing: 2px; }
  .rating-count { color: var(--text-mid); font-size: 0.85rem; }

  .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; border-top: 1px solid var(--gray-light); border-bottom: 1px solid var(--gray-light); padding: 1.25rem 0; margin-bottom: 1.25rem; }
  .dg-item { display: flex; align-items: center; gap: 0.65rem; }
  .dg-icon { width: 36px; height: 36px; border-radius: 8px; background: rgba(232,80,26,0.1); display: flex; align-items: center; justify-content: center; font-size: 1rem; color: var(--orange); flex-shrink: 0; }
  .dg-text small { display: block; font-size: 0.72rem; color: var(--text-mid); font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }
  .dg-text strong { display: block; font-size: 0.92rem; font-weight: 700; color: var(--text-dark); text-transform: capitalize; }

  .section-heading { font-size: 1rem; font-weight: 800; color: var(--text-dark); margin-bottom: 0.75rem; }
  .detail-desc { color: var(--text-mid); line-height: 1.7; font-size: 0.92rem; margin-bottom: 1.25rem; }

  /* AMENITIES */
  .amenities-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.65rem; margin-bottom: 1.5rem; }
  .amenity-chip { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 0.8rem; background: var(--gray-bg); border-radius: 8px; font-size: 0.85rem; color: var(--text-dark); font-weight: 500; }
  .amenity-chip i { color: var(--orange); width: 16px; text-align: center; }

  /* SIDEBAR */
  .sidebar { position: sticky; top: 72px; height: fit-content; display: flex; flex-direction: column; gap: 1rem; }

  /* OWNER CARD */
  .owner-card { background: var(--white); border-radius: var(--radius); padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
  .owner-top { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--gray-light); }
  .owner-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--navy), var(--blue)); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: var(--white); flex-shrink: 0; }
  .owner-info-name { font-size: 1rem; font-weight: 800; color: var(--text-dark); }
  .owner-info-role { font-size: 0.8rem; color: var(--text-mid); margin-bottom: 0.2rem; }
  .owner-online { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.78rem; color: var(--success); font-weight: 600; }
  .owner-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--success); }
  .owner-btns { display: flex; flex-direction: column; gap: 0.7rem; }
  .owner-btn {
    width: 100%; padding: 0.75rem; border: none; border-radius: 8px;
    font-size: 0.9rem; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    transition: all 0.2s; font-family: 'Manrope', sans-serif;
  }
  .owner-btn-blue { background: var(--blue); color: var(--white); }
  .owner-btn-blue:hover { background: var(--navy); }
  .owner-btn-green { background: #10b981; color: var(--white); }
  .owner-btn-green:hover { background: #059669; }
  .owner-btn-ghost { background: var(--gray-light); color: var(--text-dark); }
  .owner-btn-ghost:hover { background: #dddfe1; }

  /* BOOK CARD */
  .book-card { background: var(--white); border-radius: var(--radius); padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
  .book-price-display { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .book-price-big { font-size: 1.5rem; font-weight: 800; color: var(--orange); }
  .book-rooms-badge { background: rgba(16,185,129,0.12); color: var(--success); font-size: 0.8rem; font-weight: 700; padding: 0.3rem 0.75rem; border-radius: 20px; }
  .book-btn { width: 100%; padding: 0.85rem; background: var(--orange); color: var(--white); border: none; border-radius: 8px; font-size: 1rem; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; }
  .book-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .book-divider { border: none; border-top: 1px solid var(--gray-light); margin: 1rem 0; }
  .book-info-row { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem; }
  .book-info-row span { color: var(--text-mid); }
  .book-info-row strong { color: var(--text-dark); text-transform: capitalize; }

  /* MAP */
  .map-card { background: var(--white); border-radius: var(--radius); padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.1); margin-top: 1rem; }
  .map-card h3 { font-size: 1rem; font-weight: 800; margin-bottom: 1rem; }
  .map-box { 
    width: 100%; height: 250px; border-radius: 10px; overflow: hidden;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 0.9rem; text-align: center; flex-direction: column; gap: 0.5rem;
  }
  .map-address { margin-top: 0.75rem; color: var(--text-mid); font-size: 0.87rem; display: flex; gap: 0.4rem; align-items: flex-start; }
  .map-address i { color: var(--orange); margin-top: 2px; }

  /* REVIEWS */
  .reviews-card { background: var(--white); border-radius: var(--radius); padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.1); margin-top: 1rem; }
  .reviews-card h3 { font-size: 1rem; font-weight: 800; margin-bottom: 0.3rem; }
  .reviews-overall { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--gray-light); }
  .reviews-score { font-size: 3rem; font-weight: 800; color: var(--orange); }
  .reviews-out-of { font-size: 0.8rem; color: var(--text-mid); }
  .review-item { padding: 1rem 0; border-bottom: 1px solid var(--gray-light); }
  .review-item:last-child { border-bottom: none; padding-bottom: 0; }
  .review-header { display: flex; justify-content: space-between; margin-bottom: 0.4rem; }
  .review-name { font-weight: 700; font-size: 0.9rem; }
  .review-date { color: var(--text-mid); font-size: 0.8rem; }
  .review-stars { color: #f59e0b; font-size: 0.85rem; margin-bottom: 0.35rem; }
  .review-text { color: var(--text-mid); font-size: 0.87rem; line-height: 1.6; }

  /* LOADING & ERROR */
  .hd-center { max-width: 1180px; margin: 0 auto; padding: 6rem 1rem 2rem; text-align: center; }
  .hd-spinner { width: 48px; height: 48px; border: 4px solid var(--gray-light); border-top-color: var(--orange); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1.5rem; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .hd-error { font-size: 1.1rem; color: var(--text-mid); margin-bottom: 1rem; }

  /* BOOKING FORM MODAL */
  .booking-form-container {
    background: var(--white);
    border-radius: var(--radius);
    padding: 1.5rem;
    margin-top: 1rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    display: none;
  }
  .booking-form-container.open {
    display: block;
  }
  .booking-form-container h3 {
    font-size: 1.1rem;
    font-weight: 800;
    margin-bottom: 1rem;
    color: var(--text-dark);
  }
  .form-group {
    margin-bottom: 1rem;
  }
  .form-group label {
    display: block;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  .form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--gray-light);
    border-radius: 8px;
    font-size: 0.95rem;
    font-family: 'Manrope', sans-serif;
  }
  .form-group input:focus {
    outline: none;
    border-color: var(--orange);
    box-shadow: 0 0 0 3px rgba(232,80,26,0.1);
  }
  .price-breakdown {
    background: var(--gray-bg);
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
  }
  .price-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
  .price-row span {
    color: var(--text-mid);
  }
  .price-row strong {
    color: var(--text-dark);
  }
  .price-row.total {
    border-top: 1px solid var(--gray-light);
    padding-top: 0.75rem;
    margin-top: 0.75rem;
    font-weight: 800;
    font-size: 1rem;
  }
  .price-row.total strong {
    color: var(--orange);
  }

  @media (max-width: 960px) {
    .hd-page { grid-template-columns: 1fr; }
    .sidebar { position: static; }
  }
  @media (max-width: 600px) {
    .hd-page { padding-left: 0.5rem; padding-right: 0.5rem; gap: 1rem; }
    .detail-price { font-size: 1.7rem; }
    .detail-name { font-size: 1.2rem; }
    .detail-grid { grid-template-columns: 1fr; }
    .amenities-grid { grid-template-columns: 1fr; }
    .thumb-row { grid-template-columns: repeat(auto-fill, minmax(56px, 1fr)); }
  }
`;

const AMENITY_ICONS = {
  'WiFi': 'fa-wifi',
  'Water 24/7': 'fa-tint',
  'Electricity Backup': 'fa-bolt',
  'Security Guard': 'fa-shield-alt',
  'CCTV': 'fa-video',
  'Parking': 'fa-car',
  'Kitchen': 'fa-utensils',
  'Laundry': 'fa-tshirt',
  'Study Room': 'fa-book',
  'Common Area': 'fa-users',
  'Furniture Included': 'fa-couch',
  'Air Conditioning': 'fa-wind',
  'Hot Shower': 'fa-shower',
};

const MOCK_REVIEWS = [
  { name: 'Chisomo Banda', date: '2 weeks ago', stars: 5, text: 'Amazing hostel! Very clean, owner is super responsive. I have been here for 3 months and love it.' },
  { name: 'Takondwa Phiri', date: '1 month ago', stars: 4, text: 'Good accommodation, reliable water and electricity. Would recommend to other MUBAS students.' },
  { name: 'Mercy Tembo', date: '2 months ago', stars: 5, text: 'Best hostel I have stayed in near campus. Security is excellent and the rooms are spacious.' },
];

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
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    duration: 1,
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchHostelById(id);
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <nav className="hd-bar">
          <button className="hd-bar-back" onClick={() => navigate(-1)}><i className="fa fa-arrow-left" /> Back</button>
          <a href="/" className="hd-bar-logo">🏠 HostelLink</a>
          <div />
        </nav>
        <div className="hd-center">
          <div className="hd-spinner" />
          <p style={{color:'#65676b'}}>Loading hostel details...</p>
        </div>
      </>
    );
  }

  if (!currentHostel) {
    return (
      <>
        <style>{styles}</style>
        <nav className="hd-bar">
          <button className="hd-bar-back" onClick={() => navigate(-1)}><i className="fa fa-arrow-left" /> Back</button>
          <a href="/" className="hd-bar-logo">🏠 HostelLink</a>
          <div />
        </nav>
        <div className="hd-center">
          <div style={{fontSize:'3rem', marginBottom:'1rem'}}>🏠</div>
          <p className="hd-error">Hostel not found.</p>
          <button className="hd-bar-btn hd-bar-btn-solid" style={{margin:'0 auto', display:'inline-flex'}} onClick={() => navigate('/hostels')}>
            Browse All Hostels
          </button>
        </div>
      </>
    );
  }

  const images = currentHostel.images && currentHostel.images.length > 0
    ? currentHostel.images
    : [];

  const prevImg = () => setImgIndex(p => (p - 1 + images.length) % images.length);
  const nextImg = () => setImgIndex(p => (p + 1) % images.length);

  const rating = currentHostel.averageRating || 4.5;
  const reviewCount = currentHostel.reviewCount || MOCK_REVIEWS.length;
  const starsStr = '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '') ;

  const handleMessage = () => {
    if (!isAuthenticated) { toast.error('Please login to message the owner'); navigate('/login'); return; }
    navigate(`/messages?to=${currentHostel.owner?._id}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: currentHostel.name, text: currentHostel.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // ✅ NEW: Handle booking creation with payment
  const handleCreateBooking = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }

    if (!bookingData.checkInDate) {
      toast.error('Please select a check-in date');
      return;
    }

    if (bookingData.duration < 1) {
      toast.error('Duration must be at least 1 month');
      return;
    }

    setBookingLoading(true);

    try {
      const response = await bookingService.createBooking({
        hostelId: id,
        checkInDate: new Date(bookingData.checkInDate),
        duration: parseInt(bookingData.duration),
      });

      setBooking(response.booking);
      setShowBookingForm(false);
      setShowPaymentModal(true);
      toast.success('Booking created! Proceed to payment');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  // ✅ NEW: Calculate total price with payment fee
  const calculatePrice = () => {
    return paymentService.calculateTotal(currentHostel.price * bookingData.duration);
  };

  const priceBreakdown = bookingData.duration > 0 ? calculatePrice() : null;

  // ✅ NEW: Handle payment success
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setShowBookingForm(false);
    setBookingData({ checkInDate: '', duration: 1 });
    toast.success('Payment successful! Booking confirmed.');
    setTimeout(() => navigate('/bookings'), 1500);
  };

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      {/* TOP NAV BAR */}
      <nav className="hd-bar">
        <button className="hd-bar-back" onClick={() => navigate(-1)}>
          <i className="fa fa-arrow-left" /> Back
        </button>
        <a href="/" className="hd-bar-logo">🏠 HostelLink</a>
        <div className="hd-bar-right">
          {isAuthenticated
            ? <a href="/dashboard" className="hd-bar-btn hd-bar-btn-ghost"><i className="fa fa-th-large" /> Dashboard</a>
            : <>
                <a href="/login" className="hd-bar-btn hd-bar-btn-ghost">Login</a>
                <a href="/register" className="hd-bar-btn hd-bar-btn-solid">Sign Up</a>
              </>
          }
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="hd-page">

        {/* ===== LEFT COLUMN ===== */}
        <div>

          {/* IMAGE CAROUSEL */}
          <div className="carousel-wrap">
            <div className="carousel-stage">
              {images.length > 0 ? (
                <img className="carousel-img" src={images[imgIndex]} alt={`${currentHostel.name} photo ${imgIndex + 1}`} />
              ) : (
                <div className="carousel-no-image">
                  <i className="fa fa-image" />
                  <span>No photos uploaded yet</span>
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button className="car-btn car-prev" onClick={prevImg}><i className="fa fa-chevron-left" /></button>
                  <button className="car-btn car-next" onClick={nextImg}><i className="fa fa-chevron-right" /></button>
                  <div className="car-counter">{imgIndex + 1} / {images.length}</div>
                </>
              )}

              <div className="car-actions">
                <button className={`car-action-btn${liked ? ' liked' : ''}`} onClick={() => setLiked(l => !l)} title="Save">
                  <i className={liked ? 'fa fa-heart' : 'far fa-heart'} />
                </button>
                <button className="car-action-btn" onClick={handleShare} title="Share">
                  <i className="fa fa-share-alt" />
                </button>
              </div>
            </div>

            {/* THUMBNAIL ROW */}
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

          {/* HOSTEL INFO */}
          <div className="detail-card">
            <div className="detail-price">
              MK {currentHostel.price.toLocaleString()} <span>/ month</span>
            </div>
            <div className="detail-name">{currentHostel.name}</div>
            <div className="detail-location">
              <i className="fa fa-map-marker-alt" /> {currentHostel.address}
            </div>
            <div className="detail-rating">
              <span className="stars-gold">{starsStr}</span>
              <span className="rating-count">{rating.toFixed(1)} · {reviewCount} reviews</span>
              {currentHostel.verified && (
                <span style={{marginLeft:'0.5rem', background:'rgba(16,185,129,0.12)', color:'#10b981', fontSize:'0.78rem', fontWeight:700, padding:'2px 8px', borderRadius:'20px'}}>
                  <i className="fa fa-check-circle" /> Verified
                </span>
              )}
            </div>

            {/* KEY DETAILS GRID */}
            <div className="detail-grid">
              <div className="dg-item">
                <div className="dg-icon"><i className="fa fa-door-open" /></div>
                <div className="dg-text">
                  <small>Total Rooms</small>
                  <strong>{currentHostel.totalRooms}</strong>
                </div>
              </div>
              <div className="dg-item">
                <div className="dg-icon" style={{background:'rgba(16,185,129,0.1)'}}><i className="fa fa-check-circle" style={{color:'#10b981'}} /></div>
                <div className="dg-text">
                  <small>Available Now</small>
                  <strong style={{color:'#10b981'}}>{currentHostel.availableRooms} rooms</strong>
                </div>
              </div>
              <div className="dg-item">
                <div className="dg-icon"><i className="fa fa-home" /></div>
                <div className="dg-text">
                  <small>Room Type</small>
                  <strong>{currentHostel.type}</strong>
                </div>
              </div>
              <div className="dg-item">
                <div className="dg-icon"><i className="fa fa-venus-mars" /></div>
                <div className="dg-text">
                  <small>Gender</small>
                  <strong>{currentHostel.gender}</strong>
                </div>
              </div>
              <div className="dg-item">
                <div className="dg-icon"><i className="fa fa-phone" /></div>
                <div className="dg-text">
                  <small>Contact Phone</small>
                  <strong>{currentHostel.contactPhone}</strong>
                </div>
              </div>
              <div className="dg-item">
                <div className="dg-icon"><i className="fa fa-eye" /></div>
                <div className="dg-text">
                  <small>Total Views</small>
                  <strong>{currentHostel.viewCount || 0}</strong>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="section-heading">About this Hostel</p>
            <p className="detail-desc">{currentHostel.description}</p>

            {/* AMENITIES */}
            {currentHostel.amenities && currentHostel.amenities.length > 0 && (
              <>
                <p className="section-heading">Amenities & Features</p>
                <div className="amenities-grid">
                  {currentHostel.amenities.map(a => (
                    <div key={a} className="amenity-chip">
                      <i className={`fa ${AMENITY_ICONS[a] || 'fa-check'}`} />
                      {a}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* MAP */}
          <div className="map-card">
            <h3><i className="fa fa-map-marked-alt" style={{color:'var(--orange)', marginRight:'0.4rem'}} /> Location</h3>
            <div className="map-box">
              <i className="fa fa-map-marker-alt" style={{fontSize:'2.5rem', opacity:0.7}} />
              <div>
                <div style={{fontWeight:700, fontSize:'1rem'}}>{currentHostel.address}</div>
                {currentHostel.location?.coordinates && (
                  <div style={{fontSize:'0.78rem', opacity:0.7, marginTop:'0.3rem'}}>
                    {currentHostel.location.coordinates[1].toFixed(4)}, {currentHostel.location.coordinates[0].toFixed(4)}
                  </div>
                )}
                <div style={{fontSize:'0.75rem', opacity:0.55, marginTop:'0.25rem'}}>Map integration coming soon</div>
              </div>
            </div>
            <div className="map-address">
              <i className="fa fa-map-marker-alt" />
              <span>{currentHostel.address}</span>
            </div>
          </div>

          {/* REVIEWS */}
          <div className="reviews-card">
            <h3><i className="fa fa-star" style={{color:'#f59e0b', marginRight:'0.4rem'}} /> Student Reviews</h3>
            <div className="reviews-overall">
              <div className="reviews-score">{rating.toFixed(1)}</div>
              <div>
                <div className="stars-gold" style={{fontSize:'1.1rem'}}>{starsStr}</div>
                <div className="reviews-out-of">{reviewCount} reviews</div>
              </div>
            </div>
            {MOCK_REVIEWS.map((r, i) => (
              <div key={i} className="review-item">
                <div className="review-header">
                  <span className="review-name">{r.name}</span>
                  <span className="review-date">{r.date}</span>
                </div>
                <div className="review-stars">{'★'.repeat(r.stars)}</div>
                <div className="review-text">{r.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== RIGHT SIDEBAR ===== */}
        <div className="sidebar">

          {/* BOOK CARD */}
          <div className="book-card">
            <div className="book-price-display">
              <div className="book-price-big">MK {currentHostel.price.toLocaleString()}<span style={{fontSize:'0.85rem',fontWeight:500,color:'#65676b'}}>/mo</span></div>
              <div className="book-rooms-badge">{currentHostel.availableRooms} rooms free</div>
            </div>
            <button className="book-btn" onClick={() => setShowBookingForm(!showBookingForm)}>
              <i className="fa fa-calendar-check" /> {showBookingForm ? 'Hide Form' : 'Book Now'}
            </button>
            <hr className="book-divider" />
            <div className="book-info-row"><span>Room Type</span><strong>{currentHostel.type}</strong></div>
            <div className="book-info-row"><span>Gender</span><strong>{currentHostel.gender}</strong></div>
            <div className="book-info-row"><span>Available</span><strong>{currentHostel.availableRooms} of {currentHostel.totalRooms}</strong></div>
            <div className="book-info-row"><span>Status</span><strong style={{color: currentHostel.verified ? '#10b981' : '#6b7280'}}>{currentHostel.verified ? '✓ Verified' : 'Unverified'}</strong></div>
          </div>

          {/* ✅ NEW: BOOKING FORM */}
          <form className={`booking-form-container${showBookingForm ? ' open' : ''}`} onSubmit={handleCreateBooking}>
            <h3>📅 Book This Hostel</h3>
            
            <div className="form-group">
              <label>Check-in Date *</label>
              <input
                type="date"
                value={bookingData.checkInDate}
                onChange={(e) => setBookingData({...bookingData, checkInDate: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>Duration (months) *</label>
              <input
                type="number"
                min="1"
                value={bookingData.duration}
                onChange={(e) => setBookingData({...bookingData, duration: parseInt(e.target.value) || 1})}
                required
              />
            </div>

            {/* ✅ NEW: PRICE BREAKDOWN */}
            {priceBreakdown && (
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Room Rent ({bookingData.duration}m):</span>
                  <strong>{paymentService.formatCurrency(currentHostel.price * bookingData.duration)}</strong>
                </div>
                <div className="price-row">
                  <span>Platform Fee:</span>
                  <strong>{paymentService.formatCurrency(2000)}</strong>
                </div>
                <div className="price-row total">
                  <span>Total to Pay:</span>
                  <strong>{paymentService.formatCurrency(priceBreakdown.totalAmount)}</strong>
                </div>
              </div>
            )}

            <button type="submit" className="book-btn" disabled={bookingLoading} style={{marginTop: '0.5rem'}}>
              {bookingLoading ? (
                <>
                  <i className="fa fa-spinner fa-spin" /> Creating Booking...
                </>
              ) : (
                <>
                  <i className="fa fa-arrow-right" /> Continue to Payment
                </>
              )}
            </button>
          </form>

          {/* ✅ NEW: PAYMENT MODAL */}
          {booking && (
            <PaymentModal
              booking={booking}
              hostel={currentHostel}
              isOpen={showPaymentModal}
              onClose={() => {
                setShowPaymentModal(false);
                setShowBookingForm(false);
                setBookingData({ checkInDate: '', duration: 1 });
              }}
              onSuccess={handlePaymentSuccess}
            />
          )}

          {/* OWNER CARD */}
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
                <div className="owner-online">
                  <div className="owner-dot" /> Active on HostelLink
                </div>
              </div>
            </div>
            <div className="owner-btns">
              <button className="owner-btn owner-btn-blue" onClick={handleMessage}>
                <i className="fa fa-comment-dots" /> Message Owner
              </button>
              <a href={`tel:${currentHostel.contactPhone}`} className="owner-btn owner-btn-green" style={{textDecoration:'none', justifyContent:'center', display:'flex'}}>
                <i className="fa fa-phone" /> Call: {currentHostel.contactPhone}
              </a>
              {currentHostel.owner?.email && (
                <a href={`mailto:${currentHostel.owner.email}`} className="owner-btn owner-btn-ghost" style={{textDecoration:'none', justifyContent:'center', display:'flex'}}>
                  <i className="fa fa-envelope" /> Email Owner
                </a>
              )}
            </div>
          </div>

          {/* REPORT */}
          <button
            onClick={() => toast.info('Thank you for helping keep HostelLink safe.')}
            style={{
              width:'100%', padding:'0.65rem', background:'transparent', border:'1px solid var(--gray-light)',
              borderRadius:'8px', cursor:'pointer', color:'var(--text-mid)', fontSize:'0.85rem',
              fontWeight:600, transition:'all 0.2s', fontFamily:'Manrope, sans-serif'
            }}
          >
            <i className="fa fa-flag" /> Report this listing
          </button>
        </div>
      </div>
    </>
  );
}