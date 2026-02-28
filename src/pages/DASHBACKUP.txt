// pages/Dashboard.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaHome, 
  FaBookmark, 
  FaEnvelope,
  FaBuilding,
  FaHeart,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaArrowRight,
  FaChartLine,
  FaCheckCircle
} from 'react-icons/fa';

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const stats = [
    { label: 'Total Views', value: '1,234', change: '+12%', icon: <FaChartLine /> },
    { label: 'Messages', value: '28', change: '+5', icon: <FaEnvelope /> },
    { label: 'Bookings', value: '15', change: '+3', icon: <FaHome /> },
    { label: 'Favorites', value: '47', change: '+8', icon: <FaHeart /> },
  ];

  const quickActions = [
    {
      icon: user?.role === 'owner' ? <FaBuilding /> : <FaBookmark />,
      title: user?.role === 'owner' ? 'My Hostels' : 'My Bookings',
      description: user?.role === 'owner' 
        ? 'Manage your hostel listings'
        : 'View your hostel bookings',
      link: user?.role === 'owner' ? '/my-hostels' : '/bookings',
      color: '#e8501a',
      bgColor: 'rgba(232, 80, 26, 0.1)'
    },
    {
      icon: <FaHeart />,
      title: 'Favorites',
      description: 'Saved properties',
      link: '/favorites',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    },
    {
      icon: <FaEnvelope />,
      title: 'Messages',
      description: 'Chat with connections',
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

  const recentActivities = [
    {
      icon: <FaHome />,
      title: 'New booking received',
      description: 'Someone booked your property',
      time: '2 hours ago',
      color: '#e8501a',
      bgColor: 'rgba(232, 80, 26, 0.15)'
    },
    {
      icon: <FaEnvelope />,
      title: 'New message from student',
      description: 'Question about availability',
      time: '5 hours ago',
      color: '#1a3fa4',
      bgColor: 'rgba(26, 63, 164, 0.15)'
    },
    {
      icon: <FaCheckCircle />,
      title: 'Property added to favorites',
      description: 'Someone saved your listing',
      time: '1 day ago',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.15)'
    }
  ];

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

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

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .dashboard {
      min-height: 100vh;
      background: var(--gray-bg);
      padding: 20px;
      font-family: 'Manrope', sans-serif;
      color: var(--text-dark);
    }

    .dashboard-welcome {
      background: linear-gradient(135deg, var(--navy) 0%, var(--blue) 100%);
      padding: 3rem 2rem;
      margin: -20px -20px 2rem -20px;
      color: var(--white);
      box-shadow: 0 10px 40px rgba(13, 27, 62, 0.2);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 2rem;
    }

    .welcome-content h1 {
      font-size: 2rem;
      font-weight: 800;
      color: var(--white);
      margin-bottom: 0.5rem;
      letter-spacing: 0.5px;
    }

    .welcome-content > div:first-child p {
      color: rgba(255, 255, 255, 0.85);
      font-size: 1rem;
      font-weight: 500;
      margin: 0;
    }

    .welcome-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .welcome-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      transition: var(--transition);
      text-decoration: none;
      font-family: 'Manrope', sans-serif;
    }

    .welcome-btn-outline {
      background: rgba(255, 255, 255, 0.15);
      color: var(--white);
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .welcome-btn-outline:hover {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
    }

    .welcome-btn-primary {
      background: var(--orange);
      color: var(--white);
    }

    .welcome-btn-primary:hover {
      opacity: 0.9;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(232, 80, 26, 0.3);
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-dark);
      margin: 2.5rem 0 1.5rem;
      letter-spacing: 0.3px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: var(--white);
      padding: 1.75rem;
      border-radius: 12px;
      border: 1px solid var(--gray-light);
      transition: var(--transition);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--orange), var(--blue));
      transform: scaleX(0);
      transition: var(--transition);
      transform-origin: left;
    }

    .stat-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
      border-color: var(--orange);
    }

    .stat-card:hover::before {
      transform: scaleX(1);
    }

    .stat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .stat-icon {
      font-size: 1.5rem;
      color: var(--orange);
      opacity: 0.8;
    }

    .stat-label {
      color: var(--text-mid);
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-value {
      font-size: 2.2rem;
      font-weight: 800;
      color: var(--navy);
      margin-bottom: 0.75rem;
    }

    .stat-change {
      color: var(--success);
      font-size: 0.9rem;
      font-weight: 600;
      display: inline-block;
      padding: 0.3rem 0.75rem;
      background: rgba(16, 185, 129, 0.1);
      border-radius: 6px;
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .action-card {
      background: var(--white);
      padding: 1.75rem;
      border-radius: 12px;
      border: 1px solid var(--gray-light);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      transition: var(--transition);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      color: inherit;
    }

    .action-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
      border-color: var(--orange);
    }

    .action-icon-box {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      flex-shrink: 0;
    }

    .action-content h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 0.3rem;
    }

    .action-content p {
      color: var(--text-mid);
      font-size: 0.9rem;
      margin: 0;
    }

    .action-content {
      flex: 1;
    }

    .activity-card {
      background: var(--white);
      border-radius: 12px;
      border: 1px solid var(--gray-light);
      padding: 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.5rem;
      border-bottom: 1px solid var(--gray-light);
      transition: var(--transition);
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-item:hover {
      background: rgba(13, 27, 62, 0.02);
    }

    .activity-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      flex-shrink: 0;
    }

    .activity-details {
      flex: 1;
    }

    .activity-details h4 {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 0.3rem;
    }

    .activity-details p {
      color: var(--text-mid);
      font-size: 0.85rem;
      margin: 0;
    }

    .activity-time {
      color: var(--text-mid);
      font-size: 0.85rem;
      font-weight: 500;
      white-space: nowrap;
    }

    @media (max-width: 768px) {
      .dashboard {
        padding: 15px;
      }

      .dashboard-welcome {
        margin: -15px -15px 1.5rem -15px;
        padding: 2rem 1.5rem;
      }

      .welcome-content {
        flex-direction: column;
        text-align: center;
      }

      .welcome-content h1 {
        font-size: 1.5rem;
      }

      .welcome-actions {
        width: 100%;
        justify-content: center;
      }

      .welcome-btn {
        flex: 1;
        min-width: 140px;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .quick-actions-grid {
        grid-template-columns: 1fr;
      }

      .section-title {
        font-size: 1.25rem;
        margin-top: 2rem;
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .welcome-btn {
        width: 100%;
      }

      .welcome-actions {
        flex-direction: column;
      }

      .stat-card {
        padding: 1.5rem;
      }

      .action-card {
        flex-direction: column;
        text-align: center;
      }

      .action-icon-box {
        width: 50px;
        height: 50px;
      }

      .activity-item {
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .activity-time {
        width: 100%;
        text-align: left;
        margin-left: 3.5rem;
      }
    }
  `;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      
      <div className="dashboard">
        {/* Welcome Banner */}
        <div className="dashboard-welcome">
          <div className="container">
            <div className="welcome-content">
              <div>
                <h1>Welcome back, {user?.firstName}! 👋</h1>
                <p>{user?.role === 'student' ? '👨‍🎓 Student' : '🏢 Hostel Owner'} • {user?.email}</p>
              </div>
              <div className="welcome-actions">
                <button className="welcome-btn welcome-btn-outline" onClick={() => navigate('/profile')}>
                  <FaCog /> Profile Settings
                </button>
                <button className="welcome-btn welcome-btn-primary" onClick={() => {
                  logout();
                  navigate('/login');
                }}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          {/* Stats Grid */}
          <h2 className="section-title">Overview</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-label">{stat.label}</span>
                  <div className="stat-icon">{stat.icon}</div>
                </div>
                <div className="stat-value">{stat.value}</div>
                <span className="stat-change">{stat.change}</span>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="action-card"
                onClick={() => navigate(action.link)}
                style={{ cursor: 'pointer' }}
              >
                <div 
                  className="action-icon-box"
                  style={{ 
                    color: action.color,
                    backgroundColor: action.bgColor
                  }}
                >
                  {action.icon}
                </div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
                <FaArrowRight style={{ color: 'var(--text-mid)', opacity: 0.5 }} />
              </button>
            ))}
          </div>

          {/* Recent Activity */}
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-card">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div 
                  className="activity-icon-box"
                  style={{ 
                    color: activity.color,
                    backgroundColor: activity.bgColor
                  }}
                >
                  {activity.icon}
                </div>
                <div className="activity-details">
                  <h4>{activity.title}</h4>
                  <p>{activity.description}</p>
                </div>
                <span className="activity-time">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;