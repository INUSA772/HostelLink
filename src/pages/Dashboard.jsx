// pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { 
  FaUser, 
  FaHome, 
  FaBookmark, 
  FaEnvelope,
  FaBuilding,
  FaHeart,
  FaBell,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';
import Button from '../components/common/Button';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const stats = [
    { label: 'Total Views', value: '1,234', change: '+12%' },
    { label: 'Messages', value: '28', change: '+5' },
    { label: 'Bookings', value: '15', change: '+3' },
    { label: 'Favorites', value: '47', change: '+8' },
  ];

  const quickActions = [
    {
      icon: user?.role === 'student' ? <FaBookmark /> : <FaBuilding />,
      title: user?.role === 'student' ? 'My Bookings' : 'My Hostels',
      description: user?.role === 'student' 
        ? 'View your hostel bookings'
        : 'Manage your hostel listings',
      link: user?.role === 'student' ? '/bookings' : '/my-hostels',
      color: '#c9a96e'
    },
    {
      icon: <FaHeart />,
      title: 'Favorites',
      description: 'Saved properties',
      link: '/favorites',
      color: '#1a3b5d'
    },
    {
      icon: <FaEnvelope />,
      title: 'Messages',
      description: 'Chat with connections',
      link: '/messages',
      color: '#2e7d67'
    },
    {
      icon: <FaBell />,
      title: 'Notifications',
      description: 'Stay updated',
      link: '/notifications',
      color: '#c44545'
    }
  ];

  return (
    <div className="dashboard">
      {/* Welcome Banner */}
      <div className="dashboard-welcome">
        <div className="container">
          <div className="welcome-content">
            <div>
              <h1>Welcome back, {user?.firstName}!</h1>
              <p>{user?.role === 'student' ? 'Student' : 'Hostel Owner'} • {user?.email}</p>
            </div>
            <div className="welcome-actions">
              <Link to="/profile">
                <Button variant="outline">
                  <FaCog /> Profile Settings
                </Button>
              </Link>
              <Button variant="primary" onClick={logout}>
                <FaSignOutAlt /> Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-change">{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <Link to={action.link} key={index} className="action-card">
              <div className="action-icon" style={{ color: action.color }}>
                {action.icon}
              </div>
              <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <h2 className="section-title">Recent Activity</h2>
        <div className="activity-card">
          <div className="activity-item">
            <div className="activity-icon" style={{ background: '#c9a96e20' }}>
              <FaHome style={{ color: '#c9a96e' }} />
            </div>
            <div className="activity-details">
              <h4>New booking received</h4>
              <p>Someone booked your property • 2 hours ago</p>
            </div>
            <span className="activity-time">2h</span>
          </div>

          <div className="activity-item">
            <div className="activity-icon" style={{ background: '#1a3b5d20' }}>
              <FaEnvelope style={{ color: '#1a3b5d' }} />
            </div>
            <div className="activity-details">
              <h4>New message from student</h4>
              <p>Question about availability • 5 hours ago</p>
            </div>
            <span className="activity-time">5h</span>
          </div>

          <div className="activity-item">
            <div className="activity-icon" style={{ background: '#2e7d6720' }}>
              <FaHeart style={{ color: '#2e7d67' }} />
            </div>
            <div className="activity-details">
              <h4>Property added to favorites</h4>
              <p>Someone saved your listing • 1 day ago</p>
            </div>
            <span className="activity-time">1d</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: var(--gray-lighter);
          padding-bottom: 3rem;
        }

        .dashboard-welcome {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
          padding: 3rem 0;
          margin-bottom: 2rem;
          color: var(--white);
        }

        .welcome-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .welcome-content h1 {
          color: var(--white);
          margin-bottom: 0.5rem;
        }

        .welcome-content p {
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
        }

        .welcome-actions {
          display: flex;
          gap: 1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: var(--white);
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--gray-light);
          transition: all var(--transition-base);
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          border-color: var(--secondary-color);
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 600;
          color: var(--primary-color);
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: var(--gray);
          font-size: var(--font-size-sm);
          margin-bottom: 0.5rem;
        }

        .stat-change {
          color: var(--success);
          font-size: var(--font-size-sm);
          font-weight: 500;
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .action-card {
          background: var(--white);
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--gray-light);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all var(--transition-base);
        }

        .action-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          border-color: var(--secondary-color);
        }

        .action-icon {
          font-size: 2rem;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-content {
          flex: 1;
        }

        .action-content h3 {
          font-size: var(--font-size-lg);
          margin-bottom: 0.25rem;
          color: var(--dark);
        }

        .action-content p {
          color: var(--gray);
          font-size: var(--font-size-sm);
          margin: 0;
        }

        .activity-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          border: 1px solid var(--gray-light);
          padding: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-bottom: 1px solid var(--gray-light);
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }

        .activity-details {
          flex: 1;
        }

        .activity-details h4 {
          font-size: var(--font-size-base);
          margin-bottom: 0.25rem;
          color: var(--dark);
        }

        .activity-details p {
          color: var(--gray);
          font-size: var(--font-size-sm);
          margin: 0;
        }

        .activity-time {
          color: var(--gray);
          font-size: var(--font-size-xs);
        }

        @media (max-width: 768px) {
          .welcome-content {
            flex-direction: column;
            text-align: center;
          }

          .welcome-actions {
            width: 100%;
            justify-content: center;
          }

          .quick-actions-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .welcome-actions {
            flex-direction: column;
          }

          .welcome-actions button,
          .welcome-actions a {
            width: 100%;
          }

          .activity-item {
            flex-wrap: wrap;
          }

          .activity-time {
            width: 100%;
            text-align: left;
            margin-left: 3.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;