import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHostel } from '../context/HostelContext';
import { useAuth } from '../context/AuthContext';
import { 
  FaUser, 
  FaHome, 
  FaBookmark, 
  FaEnvelope,
  FaHeart,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaArrowRight,
  FaChartLine,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaStar,
  FaPhone,
  FaFilter,
  FaSearch
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import HostelFilters from '../components/hostel/HostelFilters';
import Pagination from '../components/common/Pagination';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0d1b3e;
    --blue: #1a3fa4;
    --orange: #e8501a;
    --white: #ffffff;
    --gray-bg: #f4f6fa;
    --gray-light: #e4e6eb;
    --text-dark: #111827;
    --text-mid: #4b5563;
    --success: #10b981;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  body { font-family: 'Manrope', sans-serif; background: var(--gray-bg); color: var(--text-dark); }

  .student-dashboard {
    min-height: 100vh;
    background: var(--gray-bg);
    padding: 20px;
  }

  /* TOPBAR */
  .sd-bar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 999;
    background: var(--white); box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    height: 56px; display: flex; align-items: center;
    justify-content: space-between; padding: 0 1.5rem;
  }

  .sd-bar-left { display: flex; align-items: center; gap: 1rem; }

  .sd-bar-logo {
    font-size: 1.1rem; font-weight: 800; color: var(--orange);
    text-decoration: none; display: flex; align-items: center; gap: 0.5rem;
  }

  .sd-bar-search {
    display: flex; align-items: center; gap: 0.5rem;
    background: var(--gray-bg); padding: 0.5rem 1rem;
    border-radius: 8px; flex: 1; max-width: 300px;
  }

  .sd-bar-search input {
    border: none; background: transparent; outline: none;
    font-family: 'Manrope', sans-serif; font-size: 0.9rem;
    color: var(--text-dark);
  }

  .sd-bar-search input::placeholder { color: var(--text-mid); }

  .sd-bar-right { display: flex; align-items: center; gap: 1rem; }

  .sd-bar-btn {
    padding: 0.4rem 1rem; border-radius: 6px; border: none;
    cursor: pointer; font-weight: 600; font-size: 0.85rem;
    font-family: 'Manrope', sans-serif; transition: all 0.2s;
    text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;
  }

  .sd-bar-btn-ghost { background: var(--gray-light); color: var(--text-dark); }
  .sd-bar-btn-ghost:hover { background: #dddfe1; }

  .sd-bar-btn-solid { background: var(--orange); color: var(--white); }
  .sd-bar-btn-solid:hover { opacity: 0.9; }

  /* WELCOME BANNER */
  .sd-welcome {
    background: linear-gradient(135deg, var(--navy) 0%, var(--blue) 100%);
    padding: 2.5rem 2rem;
    margin: -20px -20px 2rem -20px;
    color: var(--white);
    box-shadow: 0 8px 30px rgba(13, 27, 62, 0.2);
  }

  .sd-welcome-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .sd-welcome h1 {
    font-size: 1.8rem;
    font-weight: 800;
    margin-bottom: 0.3rem;
  }

  .sd-welcome p {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.95rem;
  }

  /* CONTAINER */
  .sd-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* STATS GRID */
  .sd-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.2rem;
    margin-bottom: 2.5rem;
  }

  .sd-stat-card {
    background: var(--white);
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid var(--gray-light);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: var(--transition);
  }

  .sd-stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  .sd-stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8rem;
  }

  .sd-stat-label {
    font-size: 0.8rem;
    color: var(--text-mid);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .sd-stat-icon {
    font-size: 1.3rem;
    color: var(--orange);
  }

  .sd-stat-value {
    font-size: 2rem;
    font-weight: 800;
    color: var(--navy);
    margin-bottom: 0.5rem;
  }

  .sd-stat-change {
    font-size: 0.85rem;
    color: var(--success);
    font-weight: 600;
  }

  /* QUICK ACTIONS */
  .sd-actions-title {
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--text-dark);
    margin: 2rem 0 1.2rem;
  }

  .sd-actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.2rem;
    margin-bottom: 3rem;
  }

  .sd-action-card {
    background: var(--white);
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid var(--gray-light);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: var(--transition);
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }

  .sd-action-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    border-color: var(--orange);
  }

  .sd-action-icon {
    font-size: 2.5rem;
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sd-action-title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-dark);
  }

  .sd-action-desc {
    font-size: 0.85rem;
    color: var(--text-mid);
  }

  /* FILTERS SECTION */
  .sd-filters-section {
    background: var(--white);
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .sd-filters-title {
    font-size: 1.1rem;
    font-weight: 800;
    margin-bottom: 1rem;
    color: var(--text-dark);
  }

  /* HOSTEL GRID */
  .sd-listings-title {
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--text-dark);
    margin: 2rem 0 1.5rem;
  }

  .sd-results-card {
    background: var(--white);
    padding: 1rem 1.5rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .sd-results-count {
    font-weight: 600;
    color: var(--navy);
  }

  .sd-hostel-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }

  .sd-hostel-card {
    background: var(--white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition: var(--transition);
    cursor: pointer;
  }

  .sd-hostel-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }

  .sd-hostel-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
    background: linear-gradient(135deg, var(--navy), var(--blue));
  }

  .sd-hostel-body {
    padding: 1.2rem;
  }

  .sd-hostel-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 0.8rem;
  }

  .sd-hostel-name {
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--text-dark);
  }

  .sd-hostel-badge {
    background: rgba(16, 185, 129, 0.1);
    color: var(--success);
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.3rem 0.6rem;
    border-radius: 20px;
  }

  .sd-hostel-location {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    color: var(--text-mid);
    margin-bottom: 0.8rem;
  }

  .sd-hostel-location i { color: var(--orange); }

  .sd-hostel-price {
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--orange);
    margin-bottom: 0.8rem;
  }

  .sd-hostel-price span {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-mid);
  }

  .sd-hostel-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
    padding: 0.8rem 0;
    border-top: 1px solid var(--gray-light);
    border-bottom: 1px solid var(--gray-light);
    margin-bottom: 0.8rem;
    font-size: 0.85rem;
  }

  .sd-hostel-stat {
    color: var(--text-mid);
  }

  .sd-hostel-stat strong {
    display: block;
    color: var(--text-dark);
    font-weight: 700;
  }

  .sd-hostel-rating {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .sd-hostel-stars { color: #f59e0b; }

  .sd-hostel-btn {
    width: 100%;
    padding: 0.75rem;
    background: var(--blue);
    color: var(--white);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 700;
    font-size: 0.9rem;
    font-family: 'Manrope', sans-serif;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .sd-hostel-btn:hover {
    background: var(--navy);
  }

  /* LOADING & EMPTY */
  .sd-loading {
    text-align: center;
    padding: 4rem 2rem;
    background: var(--white);
    border-radius: 12px;
  }

  .sd-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--gray-light);
    border-top-color: var(--orange);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .sd-empty {
    text-align: center;
    padding: 4rem 2rem;
    background: var(--white);
    border-radius: 12px;
  }

  .sd-empty-icon { font-size: 3.5rem; margin-bottom: 1rem; opacity: 0.5; }

  .sd-empty h3 {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--navy);
    margin-bottom: 0.5rem;
  }

  .sd-empty p {
    color: var(--text-mid);
    margin-bottom: 1.5rem;
  }

  .sd-empty-btn {
    background: var(--orange);
    color: var(--white);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 700;
    font-size: 0.9rem;
    transition: var(--transition);
  }

  .sd-empty-btn:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    .student-dashboard { padding: 15px; }
    .sd-bar-search { display: none; }
    .sd-hostel-grid { grid-template-columns: 1fr; }
    .sd-stats-grid { grid-template-columns: repeat(2, 1fr); }
    .sd-actions-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 480px) {
    .sd-stats-grid { grid-template-columns: 1fr; }
  }
`;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const {
    hostels,
    loading,
    filters,
    pagination,
    fetchHostels,
    updateFilters,
    resetFilters,
    changePage
  } = useHostel();

  const [searchInput, setSearchInput] = React.useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'student') {
      navigate('/landlord-dashboard');
      return;
    }
    fetchHostels();
  }, [isAuthenticated, user, filters]);

  const stats = [
    { label: 'My Bookings', value: '3', change: '+1', icon: <FaHome /> },
    { label: 'Messages', value: '12', change: '+3', icon: <FaEnvelope /> },
    { label: 'Favorites', value: '8', change: '+2', icon: <FaHeart /> },
    { label: 'Available', value: '156', change: '156 hostels', icon: <FaChartLine /> },
  ];

  const quickActions = [
    {
      icon: <FaBookmark />,
      title: 'My Bookings',
      description: 'View confirmed bookings',
      link: '/bookings',
      color: '#e8501a',
      bgColor: 'rgba(232, 80, 26, 0.1)'
    },
    {
      icon: <FaHeart />,
      title: 'Favorites',
      description: 'Saved hostels',
      link: '/favorites',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    },
    {
      icon: <FaEnvelope />,
      title: 'Messages',
      description: 'Chat with owners',
      link: '/messages',
      color: '#1a3fa4',
      bgColor: 'rgba(26, 63, 164, 0.1)'
    },
    {
      icon: <FaBell />,
      title: 'Notifications',
      description: 'Stay updated',
      link: '/notifications',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({ ...filters, search: searchInput, page: 1 });
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      {/* TOPBAR */}
      <nav className="sd-bar">
        <div className="sd-bar-left">
          <a href="/" className="sd-bar-logo">🏠 HostelLink</a>
          <form onSubmit={handleSearch} className="sd-bar-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Search hostels..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
        </div>
        <div className="sd-bar-right">
          <a href="/profile" className="sd-bar-btn sd-bar-btn-ghost">
            <FaCog /> Profile
          </a>
          <button
            className="sd-bar-btn sd-bar-btn-solid"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>

      <div className="student-dashboard">
        {/* WELCOME BANNER */}
        <div className="sd-welcome">
          <div className="sd-welcome-content">
            <div>
              <h1>Welcome back, {user?.firstName}! 👋</h1>
              <p>Find your perfect hostel near MUBAS campus</p>
            </div>
          </div>
        </div>

        <div className="sd-container">
          {/* STATS */}
          <div className="sd-stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="sd-stat-card">
                <div className="sd-stat-header">
                  <span className="sd-stat-label">{stat.label}</span>
                  <div className="sd-stat-icon">{stat.icon}</div>
                </div>
                <div className="sd-stat-value">{stat.value}</div>
                <div className="sd-stat-change">{stat.change}</div>
              </div>
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <h2 className="sd-actions-title">Quick Actions</h2>
          <div className="sd-actions-grid">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                to={action.link}
                className="sd-action-card"
              >
                <div
                  className="sd-action-icon"
                  style={{ color: action.color, backgroundColor: action.bgColor }}
                >
                  {action.icon}
                </div>
                <div>
                  <div className="sd-action-title">{action.title}</div>
                  <div className="sd-action-desc">{action.description}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* FILTERS */}
          <div className="sd-filters-section">
            <div className="sd-filters-title"><FaFilter /> Filter Hostels</div>
            <HostelFilters
              filters={filters}
              onFilterChange={updateFilters}
              onReset={resetFilters}
            />
          </div>

          {/* LISTINGS */}
          <h2 className="sd-listings-title">Available Hostels</h2>

          {!loading && hostels.length > 0 && (
            <div className="sd-results-card">
              <span className="sd-results-count">
                <FaHome style={{ marginRight: '0.5rem', color: 'var(--orange)' }} />
                {hostels.length} of {pagination.total} hostels
              </span>
              <span>Page {pagination.page} of {pagination.totalPages}</span>
            </div>
          )}

          {loading ? (
            <div className="sd-loading">
              <div className="sd-spinner"></div>
              <p>Loading hostels...</p>
            </div>
          ) : hostels.length === 0 ? (
            <div className="sd-empty">
              <div className="sd-empty-icon">🏠</div>
              <h3>No hostels found</h3>
              <p>Try adjusting your filters</p>
              <button className="sd-empty-btn" onClick={resetFilters}>
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="sd-hostel-grid">
                {hostels.map(hostel => (
                  <div key={hostel._id} className="sd-hostel-card">
                    {hostel.images?.[0] ? (
                      <img src={hostel.images[0]} alt={hostel.name} className="sd-hostel-image" />
                    ) : (
                      <div className="sd-hostel-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        📷 No image
                      </div>
                    )}

                    <div className="sd-hostel-body">
                      <div className="sd-hostel-header">
                        <div className="sd-hostel-name">{hostel.name}</div>
                        {hostel.verified && <div className="sd-hostel-badge">✓ Verified</div>}
                      </div>

                      <div className="sd-hostel-location">
                        <FaMapMarkerAlt /> {hostel.address}
                      </div>

                      <div className="sd-hostel-price">
                        MK {hostel.price.toLocaleString()}
                        <span> /month</span>
                      </div>

                      <div className="sd-hostel-stats">
                        <div className="sd-hostel-stat">
                          <FaHome style={{ marginRight: '0.3rem' }} />
                          <strong>{hostel.totalRooms} Rooms</strong>
                        </div>
                        <div className="sd-hostel-stat">
                          <FaCheckCircle style={{ marginRight: '0.3rem', color: 'var(--success)' }} />
                          <strong>{hostel.availableRooms} Free</strong>
                        </div>
                      </div>

                      <div className="sd-hostel-rating">
                        <span className="sd-hostel-stars">★★★★★</span>
                        <span>{(hostel.averageRating || 4.5).toFixed(1)}</span>
                      </div>

                      <button
                        className="sd-hostel-btn"
                        onClick={() => navigate(`/hostels/${hostel._id}`)}
                      >
                        View Details <FaArrowRight />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => {
                    changePage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;