import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { FaUser, FaHome, FaBookmark, FaEnvelope } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();

  const cardStyle = {
    textAlign: 'center',
    padding: '2rem',
    borderRadius: '1rem',
    background: 'white',
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  const cardHover = {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
  };

  const iconStyle = (color) => ({ color, marginBottom: '1rem', transition: 'all 0.3s ease' });

  return (
    <div style={{ padding: '2rem', fontFamily: "'Inter', sans-serif", maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Welcome Banner */}
      <div style={{
        padding: '2rem',
        borderRadius: '1rem',
        background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
        color: 'white',
        textAlign: 'center',
        marginBottom: '2rem',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Welcome, {user?.firstName} {user?.lastName}
        </h1>
        <p style={{ fontSize: '1rem', opacity: 0.9 }}>
          {user?.role === 'student' 
            ? 'Discover your ideal hostel easily.' 
            : 'Manage your hostels and connect with students.'}
        </p>
      </div>

      {/* Quick Action Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <Link to="/profile" style={{ textDecoration: 'none' }}>
          <div 
            className="card"
            style={cardStyle}
            onMouseEnter={e => Object.assign(e.currentTarget.style, cardHover)}
            onMouseLeave={e => Object.assign(e.currentTarget.style, cardStyle)}
          >
            <FaUser size={40} style={iconStyle('#4f46e5')} />
            <h3>My Profile</h3>
            <p style={{ color: '#6b7280' }}>View and edit your profile</p>
          </div>
        </Link>

        {user?.role === 'student' && (
          <>
            <Link to="/hostels" style={{ textDecoration: 'none' }}>
              <div 
                className="card"
                style={cardStyle}
                onMouseEnter={e => Object.assign(e.currentTarget.style, cardHover)}
                onMouseLeave={e => Object.assign(e.currentTarget.style, cardStyle)}
              >
                <FaHome size={40} style={iconStyle('#10b981')} />
                <h3>Browse Hostels</h3>
                <p style={{ color: '#6b7280' }}>Find your perfect accommodation</p>
              </div>
            </Link>

            <Link to="/bookings" style={{ textDecoration: 'none' }}>
              <div 
                className="card"
                style={cardStyle}
                onMouseEnter={e => Object.assign(e.currentTarget.style, cardHover)}
                onMouseLeave={e => Object.assign(e.currentTarget.style, cardStyle)}
              >
                <FaBookmark size={40} style={iconStyle('#f59e0b')} />
                <h3>My Bookings</h3>
                <p style={{ color: '#6b7280' }}>View your hostel bookings</p>
              </div>
            </Link>
          </>
        )}

        {user?.role === 'owner' && (
          <>
            <Link to="/my-hostels" style={{ textDecoration: 'none' }}>
              <div 
                className="card"
                style={cardStyle}
                onMouseEnter={e => Object.assign(e.currentTarget.style, cardHover)}
                onMouseLeave={e => Object.assign(e.currentTarget.style, cardStyle)}
              >
                <FaHome size={40} style={iconStyle('#10b981')} />
                <h3>My Hostels</h3>
                <p style={{ color: '#6b7280' }}>Manage your hostel listings</p>
              </div>
            </Link>

            <Link to="/hostels/create" style={{ textDecoration: 'none' }}>
              <div 
                className="card"
                style={{ ...cardStyle, border: '2px dashed #4f46e5', color: '#4f46e5' }}
                onMouseEnter={e => Object.assign(e.currentTarget.style, {...cardHover, border: '2px solid #4f46e5'})}
                onMouseLeave={e => Object.assign(e.currentTarget.style, {...cardStyle, border: '2px dashed #4f46e5'})}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>+</div>
                <h3>Add New Hostel</h3>
                <p style={{ color: '#6b7280' }}>List a new hostel</p>
              </div>
            </Link>
          </>
        )}

        <Link to="/messages" style={{ textDecoration: 'none' }}>
          <div 
            className="card"
            style={cardStyle}
            onMouseEnter={e => Object.assign(e.currentTarget.style, cardHover)}
            onMouseLeave={e => Object.assign(e.currentTarget.style, cardStyle)}
          >
            <FaEnvelope size={40} style={iconStyle('#3b82f6')} />
            <h3>Messages</h3>
            <p style={{ color: '#6b7280' }}>Chat with {user?.role === 'student' ? 'owners' : 'students'}</p>
          </div>
        </Link>
      </div>

      {/* Account Info */}
      <div style={{ ...cardStyle, padding: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Account Information</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Phone:</strong> {user?.phone}</p>
          {user?.role === 'student' && <p><strong>Student ID:</strong> {user?.studentId}</p>}
          <p>
            <strong>Status:</strong> 
            <span style={{ marginLeft: '0.5rem', color: user?.verified ? '#10b981' : '#f59e0b' }}>
              {user?.verified ? '✅ Verified' : '⏳ Pending Verification'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
