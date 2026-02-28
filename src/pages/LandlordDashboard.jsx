import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaPlus,
  FaHome,
  FaChartLine,
  FaCalendarCheck,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaEdit,
  FaTrash,
  FaEye,
  FaStar,
  FaMapMarkerAlt,
  FaDoorOpen,
  FaCheckCircle,
  FaBell,
  FaUser,
  FaPhone,
  FaArrowRight,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import { toast } from 'react-toastify';

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
    --danger: #ef4444;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  body { font-family: 'Manrope', sans-serif; background: var(--gray-bg); color: var(--text-dark); }

  .landlord-dashboard {
    min-height: 100vh;
    background: var(--gray-bg);
    padding: 20px;
  }

  /* TOPBAR */
  .ld-bar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 999;
    background: var(--white); box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    height: 56px; display: flex; align-items: center;
    justify-content: space-between; padding: 0 1.5rem;
  }

  .ld-bar-left { display: flex; align-items: center; gap: 1rem; }

  .ld-bar-logo {
    font-size: 1.1rem; font-weight: 800; color: var(--orange);
    text-decoration: none; display: flex; align-items: center; gap: 0.5rem;
  }

  .ld-bar-right { display: flex; align-items: center; gap: 1rem; }

  .ld-bar-btn {
    padding: 0.4rem 1rem; border-radius: 6px; border: none;
    cursor: pointer; font-weight: 600; font-size: 0.85rem;
    font-family: 'Manrope', sans-serif; transition: all 0.2s;
    text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;
  }

  .ld-bar-btn-primary {
    background: var(--orange); color: var(--white);
  }

  .ld-bar-btn-primary:hover {
    opacity: 0.9;
    box-shadow: 0 4px 12px rgba(232, 80, 26, 0.3);
  }

  .ld-bar-btn-ghost {
    background: var(--gray-light); color: var(--text-dark);
  }

  .ld-bar-btn-ghost:hover {
    background: #dddfe1;
  }

  /* WELCOME BANNER */
  .ld-welcome {
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    padding: 2.5rem 2rem;
    margin: -20px -20px 2rem -20px;
    color: var(--white);
    box-shadow: 0 8px 30px rgba(5, 150, 105, 0.2);
  }

  .ld-welcome-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 2rem;
  }

  .ld-welcome h1 {
    font-size: 1.8rem;
    font-weight: 800;
    margin-bottom: 0.3rem;
  }

  .ld-welcome p {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.95rem;
  }

  .ld-welcome-actions {
    display: flex;
    gap: 1rem;
  }

  .ld-welcome-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: 700;
    font-size: 0.95rem;
    font-family: 'Manrope', sans-serif;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    transition: var(--transition);
  }

  .ld-welcome-btn-solid {
    background: var(--white);
    color: #059669;
  }

  .ld-welcome-btn-solid:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  .ld-welcome-btn-outline {
    background: rgba(255, 255, 255, 0.15);
    color: var(--white);
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .ld-welcome-btn-outline:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
  }

  /* CONTAINER */
  .ld-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* STATS GRID */
  .ld-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }

  .ld-stat-card {
    background: var(--white);
    padding: 2rem;
    border-radius: 12px;
    border: 1px solid var(--gray-light);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: var(--transition);
    position: relative;
    overflow: hidden;
  }

  .ld-stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--orange), #059669);
    transform: scaleX(0);
    transition: var(--transition);
    transform-origin: left;
  }

  .ld-stat-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  }

  .ld-stat-card:hover::before {
    transform: scaleX(1);
  }

  .ld-stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .ld-stat-label {
    font-size: 0.85rem;
    color: var(--text-mid);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .ld-stat-icon {
    font-size: 1.8rem;
    background: rgba(5, 150, 105, 0.1);
    color: #059669;
    width: 50px;
    height: 50px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ld-stat-value {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--navy);
    margin-bottom: 0.5rem;
  }

  .ld-stat-change {
    font-size: 0.9rem;
    color: var(--success);
    font-weight: 600;
  }

  /* SECTION TITLE */
  .ld-section-title {
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--text-dark);
    margin: 2.5rem 0 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .ld-section-title i {
    color: var(--orange);
  }

  /* ACTION BUTTONS */
  .ld-actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.2rem;
    margin-bottom: 3rem;
  }

  .ld-action-btn {
    background: var(--white);
    border: 2px solid var(--gray-light);
    padding: 1.5rem;
    border-radius: 12px;
    cursor: pointer;
    transition: var(--transition);
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
    font-family: 'Manrope', sans-serif;
  }

  .ld-action-btn:hover {
    border-color: var(--orange);
    box-shadow: 0 8px 20px rgba(232, 80, 26, 0.15);
    transform: translateY(-4px);
  }

  .ld-action-icon {
    font-size: 2.5rem;
    color: var(--orange);
  }

  .ld-action-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-dark);
  }

  .ld-action-desc {
    font-size: 0.85rem;
    color: var(--text-mid);
  }

  /* HOSTELS LIST */
  .ld-hostels-card {
    background: var(--white);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
  }

  .ld-hostels-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .ld-hostels-count {
    font-weight: 600;
    color: var(--navy);
  }

  .ld-hostels-search {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--gray-bg);
    padding: 0.6rem 1rem;
    border-radius: 8px;
    flex: 1;
    max-width: 300px;
  }

  .ld-hostels-search input {
    border: none;
    background: transparent;
    outline: none;
    font-family: 'Manrope', sans-serif;
    font-size: 0.9rem;
    width: 100%;
  }

  .ld-hostels-table {
    width: 100%;
    border-collapse: collapse;
  }

  .ld-hostels-table th {
    background: var(--gray-bg);
    padding: 1rem;
    text-align: left;
    font-weight: 700;
    color: var(--text-dark);
    font-size: 0.9rem;
    border-bottom: 2px solid var(--gray-light);
  }

  .ld-hostels-table td {
    padding: 1.2rem 1rem;
    border-bottom: 1px solid var(--gray-light);
    font-size: 0.9rem;
  }

  .ld-hostels-table tbody tr:hover {
    background: rgba(5, 150, 105, 0.02);
  }

  .ld-hostel-name {
    font-weight: 700;
    color: var(--navy);
  }

  .ld-hostel-status {
    display: inline-block;
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .ld-status-active {
    background: rgba(16, 185, 129, 0.1);
    color: var(--success);
  }

  .ld-status-inactive {
    background: rgba(209, 213, 219, 0.3);
    color: var(--text-mid);
  }

  .ld-hostel-actions {
    display: flex;
    gap: 0.6rem;
  }

  .ld-action-icon-btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid var(--gray-light);
    background: var(--white);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-mid);
    transition: var(--transition);
    font-size: 0.95rem;
  }

  .ld-action-icon-btn:hover {
    background: var(--orange);
    color: var(--white);
    border-color: var(--orange);
  }

  .ld-action-icon-btn.danger:hover {
    background: var(--danger);
    border-color: var(--danger);
  }

  /* EMPTY STATE */
  .ld-empty {
    text-align: center;
    padding: 4rem 2rem;
    background: var(--white);
    border-radius: 12px;
  }

  .ld-empty-icon {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .ld-empty h3 {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--navy);
    margin-bottom: 0.5rem;
  }

  .ld-empty p {
    color: var(--text-mid);
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }

  .ld-empty-btn {
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

  .ld-empty-btn:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  @media (max-width: 1024px) {
    .ld-hostels-table {
      font-size: 0.85rem;
    }

    .ld-hostels-table th,
    .ld-hostels-table td {
      padding: 0.8rem;
    }
  }

  @media (max-width: 768px) {
    .landlord-dashboard { padding: 15px; }
    .ld-welcome-actions { width: 100%; }
    .ld-welcome-btn { flex: 1; }
    .ld-stats-grid { grid-template-columns: repeat(2, 1fr); }
    .ld-actions-grid { grid-template-columns: 1fr; }
    
    .ld-hostels-table {
      font-size: 0.8rem;
      display: block;
      overflow-x: auto;
    }
  }

  @media (max-width: 480px) {
    .ld-stats-grid { grid-template-columns: 1fr; }
    .ld-welcome h1 { font-size: 1.4rem; }
    .ld-stat-value { font-size: 1.8rem; }
  }
`;

const LandlordDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [hostels, setHostels] = React.useState([
    {
      _id: 1,
      name: 'Campus View Hostel',
      address: 'Chitawira, Blantyre',
      price: 150000,
      totalRooms: 12,
      availableRooms: 3,
      totalViews: 245,
      verified: true,
      bookings: 9,
      rating: 4.8
    },
    {
      _id: 2,
      name: 'Budget Stay Inn',
      address: 'Nkolokosa, Blantyre',
      price: 120000,
      totalRooms: 8,
      availableRooms: 2,
      totalViews: 189,
      verified: true,
      bookings: 6,
      rating: 4.5
    },
  ]);

  const stats = [
    { label: 'Active Hostels', value: hostels.length, icon: <FaHome />, change: `${hostels.length} listings` },
    { label: 'Total Bookings', value: hostels.reduce((a, h) => a + h.bookings, 0), icon: <FaCalendarCheck />, change: 'This month' },
    { label: 'Total Views', value: hostels.reduce((a, h) => a + h.totalViews, 0), icon: <FaEye />, change: 'All time' },
    { label: 'Avg Rating', value: (hostels.reduce((a, h) => a + h.rating, 0) / hostels.length).toFixed(1), icon: <FaStar />, change: 'From students' },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'owner') {
      navigate('/');
      return;
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) return null;

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      {/* TOPBAR */}
      <nav className="ld-bar">
        <div className="ld-bar-left">
          <a href="/" className="ld-bar-logo">🏠 HostelLink</a>
        </div>
        <div className="ld-bar-right">
          <a href="/profile" className="ld-bar-btn ld-bar-btn-ghost">
            <FaCog /> Profile
          </a>
          <button
            className="ld-bar-btn ld-bar-btn-ghost"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>

      <div className="landlord-dashboard">
        {/* WELCOME BANNER */}
        <div className="ld-welcome">
          <div className="ld-welcome-content">
            <div>
              <h1>Welcome back, {user?.firstName}! 🏢</h1>
              <p>Manage your hostels and grow your business</p>
            </div>
            <div className="ld-welcome-actions">
              <button className="ld-welcome-btn ld-welcome-btn-solid" onClick={() => navigate('/hostels/create')}>
                <FaPlus /> List New Hostel
              </button>
              <button className="ld-welcome-btn ld-welcome-btn-outline" onClick={() => navigate('/messages')}>
                <FaBell /> Messages
              </button>
            </div>
          </div>
        </div>

        <div className="ld-container">
          {/* STATISTICS */}
          <div className="ld-stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="ld-stat-card">
                <div className="ld-stat-header">
                  <span className="ld-stat-label">{stat.label}</span>
                  <div className="ld-stat-icon">{stat.icon}</div>
                </div>
                <div className="ld-stat-value">{stat.value}</div>
                <div className="ld-stat-change">{stat.change}</div>
              </div>
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <h2 className="ld-section-title">
            <FaPlus /> Quick Actions
          </h2>
          <div className="ld-actions-grid">
            <button
              className="ld-action-btn"
              onClick={() => navigate('/hostels/create')}
            >
              <div className="ld-action-icon"><FaPlus /></div>
              <div className="ld-action-title">List New Hostel</div>
              <div className="ld-action-desc">Add another property</div>
            </button>

            <button
              className="ld-action-btn"
              onClick={() => navigate('/messages')}
            >
              <div className="ld-action-icon"><FaEnvelope /></div>
              <div className="ld-action-title">Messages</div>
              <div className="ld-action-desc">Chat with students</div>
            </button>

            <button
              className="ld-action-btn"
              onClick={() => navigate('/notifications')}
            >
              <div className="ld-action-icon"><FaBell /></div>
              <div className="ld-action-title">Notifications</div>
              <div className="ld-action-desc">New bookings & inquiries</div>
            </button>

            <button
              className="ld-action-btn"
              onClick={() => navigate('/profile')}
            >
              <div className="ld-action-icon"><FaUser /></div>
              <div className="ld-action-title">Profile Settings</div>
              <div className="ld-action-desc">Update your info</div>
            </button>
          </div>

          {/* MY HOSTELS */}
          <h2 className="ld-section-title">
            <FaHome /> My Hostels
          </h2>

          {hostels.length === 0 ? (
            <div className="ld-empty">
              <div className="ld-empty-icon">🏠</div>
              <h3>No hostels yet</h3>
              <p>Start by listing your first hostel to attract students</p>
              <button
                className="ld-empty-btn"
                onClick={() => navigate('/hostels/create')}
              >
                <FaPlus /> List Your First Hostel
              </button>
            </div>
          ) : (
            <div className="ld-hostels-card">
              <div className="ld-hostels-header">
                <span className="ld-hostels-count">
                  <FaHome style={{ marginRight: '0.5rem', color: 'var(--orange)' }} />
                  {hostels.length} active hostels
                </span>
                <div className="ld-hostels-search">
                  <FaSearch />
                  <input type="text" placeholder="Search your hostels..." />
                </div>
              </div>

              <table className="ld-hostels-table">
                <thead>
                  <tr>
                    <th>Hostel Name</th>
                    <th>Location</th>
                    <th>Rooms</th>
                    <th>Price</th>
                    <th>Views</th>
                    <th>Bookings</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hostels.map(hostel => (
                    <tr key={hostel._id}>
                      <td className="ld-hostel-name">{hostel.name}</td>
                      <td>
                        <FaMapMarkerAlt style={{ marginRight: '0.3rem', color: 'var(--orange)' }} />
                        {hostel.address}
                      </td>
                      <td>
                        <FaDoorOpen style={{ marginRight: '0.3rem' }} />
                        {hostel.availableRooms}/{hostel.totalRooms}
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--orange)' }}>
                        MK {hostel.price.toLocaleString()}
                      </td>
                      <td>
                        <FaEye style={{ marginRight: '0.3rem' }} />
                        {hostel.totalViews}
                      </td>
                      <td style={{ fontWeight: 700 }}>{hostel.bookings}</td>
                      <td>
                        <FaStar style={{ marginRight: '0.3rem', color: '#f59e0b' }} />
                        {hostel.rating}
                      </td>
                      <td>
                        <span className={`ld-hostel-status ${hostel.verified ? 'ld-status-active' : 'ld-status-inactive'}`}>
                          {hostel.verified ? (
                            <>
                              <FaCheckCircle style={{ marginRight: '0.3rem' }} />
                              Verified
                            </>
                          ) : (
                            'Pending'
                          )}
                        </span>
                      </td>
                      <td>
                        <div className="ld-hostel-actions">
                          <button
                            className="ld-action-icon-btn"
                            onClick={() => navigate(`/hostels/${hostel._id}`)}
                            title="View"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="ld-action-icon-btn"
                            onClick={() => navigate(`/hostels/edit/${hostel._id}`)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="ld-action-icon-btn danger"
                            onClick={() => toast.info('Delete feature coming soon')}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LandlordDashboard;