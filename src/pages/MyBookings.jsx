import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUser, FaPhone, FaCheckCircle, FaClock as FaClock2, FaTimesCircle, FaEye, FaTrash, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';

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
    --warning: #d97706;
    --danger: #dc2626;
  }

  body { font-family: 'Manrope', sans-serif; background: var(--gray-bg); color: var(--text-dark); }
  a { text-decoration: none; color: inherit; }

  .bookings-page {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--gray-bg) 0%, #ffffff 100%);
    padding-top: 68px;
  }

  /* ── TOP NAV ── */
  .bookings-topnav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: white;
    border-bottom: 1px solid #e5e7eb;
    padding: 0.75rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }

  .bookings-back-btn {
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

  .bookings-back-btn:hover {
    background: var(--navy);
    color: white;
    border-color: var(--navy);
  }

  /* ── PAGE HEADER ── */
  .bookings-header {
    background: linear-gradient(135deg, var(--navy) 0%, var(--blue) 100%);
    color: white;
    padding: 2.5rem 1.5rem;
  }

  .bookings-header h1 {
    font-size: clamp(1.8rem, 4vw, 2.5rem);
    font-weight: 800;
    margin-bottom: 0.5rem;
    font-family: 'Poppins', sans-serif;
  }

  .bookings-header p {
    font-size: 0.95rem;
    opacity: 0.9;
  }

  /* ── MAIN CONTENT ── */
  .bookings-content {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  /* ── FILTER TABS ── */
  .booking-filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .filter-btn {
    padding: 0.6rem 1.2rem;
    border: 2px solid #e5e7eb;
    background: white;
    border-radius: 8px;
    font-weight: 700;
    color: var(--text-mid);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
    font-family: 'Manrope', sans-serif;
  }

  .filter-btn:hover,
  .filter-btn.active {
    border-color: var(--orange);
    background: var(--orange);
    color: white;
  }

  /* ── EMPTY STATE ── */
  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: var(--card-radius);
    border: 1px dashed #e5e7eb;
  }

  .empty-state-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .empty-state h3 {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--navy);
    margin-bottom: 0.5rem;
    font-family: 'Poppins', sans-serif;
  }

  .empty-state p {
    font-size: 0.95rem;
    color: var(--text-mid);
    margin-bottom: 1.5rem;
  }

  .empty-state-btn {
    background: var(--orange);
    color: white;
    border: none;
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }

  .empty-state-btn:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  /* ── BOOKING CARD ── */
  .booking-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: var(--card-radius);
    overflow: hidden;
    margin-bottom: 1.5rem;
    transition: all 0.3s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }

  .booking-card:hover {
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    border-color: var(--orange);
  }

  .booking-card-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    background: var(--gray-bg);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .booking-status {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.9rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .booking-status.confirmed {
    background: rgba(5,150,105,0.1);
    color: var(--success);
  }

  .booking-status.pending {
    background: rgba(217,119,6,0.1);
    color: var(--warning);
  }

  .booking-status.cancelled {
    background: rgba(220,38,38,0.1);
    color: var(--danger);
  }

  .booking-id {
    font-size: 0.9rem;
    color: var(--text-mid);
    font-weight: 600;
  }

  .booking-card-body {
    padding: 1.5rem;
  }

  .booking-main-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 1.5rem;
  }

  .booking-hostel-info h3 {
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--navy);
    margin-bottom: 0.75rem;
    font-family: 'Poppins', sans-serif;
  }

  .booking-detail {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    font-size: 0.95rem;
    color: var(--text-mid);
  }

  .booking-detail-icon {
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--orange);
    flex-shrink: 0;
    font-size: 1.1rem;
  }

  .booking-owner-info {
    background: var(--gray-bg);
    padding: 1rem;
    border-radius: 10px;
  }

  .booking-owner-name {
    font-weight: 700;
    color: var(--navy);
    margin-bottom: 0.5rem;
  }

  .booking-owner-contact {
    font-size: 0.85rem;
    color: var(--text-mid);
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
  }

  .booking-owner-link {
    color: var(--orange);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .booking-owner-link:hover {
    opacity: 0.8;
  }

  /* ── BOOKING STATS ── */
  .booking-stats {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    flex-wrap: wrap;
  }

  .stat {
    flex: 1;
    min-width: 150px;
  }

  .stat-label {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text-mid);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.4rem;
  }

  .stat-value {
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--navy);
    font-family: 'Poppins', sans-serif;
  }

  .stat-value.price {
    color: var(--orange);
  }

  /* ── ACTIONS ── */
  .booking-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .action-btn {
    padding: 0.6rem 1.2rem;
    border: 1.5px solid #e5e7eb;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 700;
    font-size: 0.85rem;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Manrope', sans-serif;
    color: var(--navy);
  }

  .action-btn:hover {
    border-color: var(--navy);
    background: var(--navy);
    color: white;
  }

  .action-btn.download {
    color: var(--orange);
    border-color: var(--orange);
  }

  .action-btn.download:hover {
    background: var(--orange);
    color: white;
  }

  .action-btn.delete {
    color: var(--danger);
    border-color: var(--danger);
  }

  .action-btn.delete:hover {
    background: var(--danger);
    color: white;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .bookings-header {
      padding: 1.5rem;
    }

    .bookings-header h1 {
      font-size: 1.5rem;
    }

    .booking-main-info {
      grid-template-columns: 1fr;
    }

    .booking-card-header {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  @media (max-width: 520px) {
    .bookings-topnav {
      padding: 0.5rem 1rem;
    }

    .bookings-back-btn {
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
    }

    .bookings-content {
      padding: 1rem;
    }

    .booking-card-header {
      padding: 1rem;
    }

    .booking-card-body {
      padding: 1rem;
    }

    .booking-stats {
      gap: 0.75rem;
    }

    .action-btn {
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
    }
  }
`;

const MyBookings = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [bookings, setBookings] = useState([
    {
      id: 'BK001',
      hostelName: 'Chitawira Student Lodge',
      address: 'Chitawira, Near MUBAS',
      checkInDate: '2025-04-01',
      checkOutDate: '2025-08-30',
      duration: 5,
      roomType: 'Single Room',
      price: 45000,
      ownerName: 'Mr. James Banda',
      ownerPhone: '+265 999 123 456',
      status: 'confirmed',
    },
    {
      id: 'BK002',
      hostelName: 'Queens Campus Hostel',
      address: 'Queens, Walking Distance',
      checkInDate: '2025-05-15',
      checkOutDate: '2025-09-15',
      duration: 4,
      roomType: 'Double Room',
      price: 55000,
      ownerName: 'Mrs. Grace Mwale',
      ownerPhone: '+265 888 456 789',
      status: 'pending',
    },
  ]);

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter((b) => b.status === filter);

  const handleCancel = (id) => {
    toast.success('Booking cancelled successfully');
    setBookings(bookings.filter((b) => b.id !== id));
  };

  const handleDownload = (id) => {
    toast.success('Booking receipt downloaded');
  };

  const handleContact = () => {
    toast.info('Redirecting to messages...');
  };

  return (
    <>
      <style>{styles}</style>
      <div className="bookings-page">
        {/* Top Nav */}
        <div className="bookings-topnav">
          <button className="bookings-back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
        </div>

        {/* Header */}
        <section className="bookings-header">
          <h1>My Bookings</h1>
          <p>Manage your hostel reservations and bookings</p>
        </section>

        {/* Content */}
        <div className="bookings-content">
          {/* Filters */}
          <div className="booking-filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Bookings ({bookings.length})
            </button>
            <button
              className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
              onClick={() => setFilter('confirmed')}
            >
              Confirmed
            </button>
            <button
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button
              className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              Cancelled
            </button>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <h3>No {filter !== 'all' ? filter : ''} bookings</h3>
              <p>You don't have any {filter !== 'all' ? filter : ''} bookings yet. Start exploring hostels today!</p>
              <button
                className="empty-state-btn"
                onClick={() => navigate('/hostels')}
              >
                Browse Hostels
              </button>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                {/* Header */}
                <div className="booking-card-header">
                  <div>
                    <div className="booking-id">Booking ID: {booking.id}</div>
                  </div>
                  <div className={`booking-status ${booking.status}`}>
                    {booking.status === 'confirmed' && <FaCheckCircle />}
                    {booking.status === 'pending' && <FaClock2 />}
                    {booking.status === 'cancelled' && <FaTimesCircle />}
                    {booking.status}
                  </div>
                </div>

                {/* Body */}
                <div className="booking-card-body">
                  {/* Stats */}
                  <div className="booking-stats">
                    <div className="stat">
                      <div className="stat-label">Duration</div>
                      <div className="stat-value">{booking.duration} months</div>
                    </div>
                    <div className="stat">
                      <div className="stat-label">Room Type</div>
                      <div className="stat-value" style={{ fontSize: '1.05rem' }}>{booking.roomType}</div>
                    </div>
                    <div className="stat">
                      <div className="stat-label">Total Cost</div>
                      <div className="stat-value price">MK {booking.price.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Main Info */}
                  <div className="booking-main-info">
                    {/* Hostel Info */}
                    <div className="booking-hostel-info">
                      <h3>{booking.hostelName}</h3>

                      <div className="booking-detail">
                        <div className="booking-detail-icon">
                          <FaMapMarkerAlt />
                        </div>
                        <div>{booking.address}</div>
                      </div>

                      <div className="booking-detail">
                        <div className="booking-detail-icon">
                          <FaCalendarAlt />
                        </div>
                        <div>
                          {new Date(booking.checkInDate).toLocaleDateString()} -{' '}
                          {new Date(booking.checkOutDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="booking-detail">
                        <div className="booking-detail-icon">
                          <FaClock />
                        </div>
                        <div>Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</div>
                      </div>
                    </div>

                    {/* Owner Info */}
                    <div>
                      <div className="booking-owner-info">
                        <div className="booking-owner-name">
                          <FaUser style={{ marginRight: '0.5rem' }} />
                          {booking.ownerName}
                        </div>
                        <div className="booking-owner-contact">
                          <a href={`tel:${booking.ownerPhone}`} className="booking-owner-link">
                            <FaPhone /> {booking.ownerPhone}
                          </a>
                          <div
                            className="booking-owner-link"
                            onClick={handleContact}
                            style={{ cursor: 'pointer' }}
                          >
                            💬 Send Message
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="booking-actions">
                    <button
                      className="action-btn"
                      onClick={() => navigate(`/hostels/${booking.id}`)}
                    >
                      <FaEye /> View Details
                    </button>
                    <button
                      className="action-btn download"
                      onClick={() => handleDownload(booking.id)}
                    >
                      <FaDownload /> Receipt
                    </button>
                    {booking.status !== 'cancelled' && (
                      <button
                        className="action-btn delete"
                        onClick={() => handleCancel(booking.id)}
                      >
                        <FaTrash /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MyBookings;