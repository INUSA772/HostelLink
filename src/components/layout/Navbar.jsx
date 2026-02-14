import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaHeart, FaEnvelope, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/global.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: 'var(--white)',
      boxShadow: 'var(--shadow-md)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontSize: 'var(--font-size-2xl)',
          fontWeight: 'bold',
          color: 'var(--primary-color)',
          textDecoration: 'none'
        }}>
          HostelLink
        </Link>

        {/* Desktop Menu */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }} className="desktop-menu">
          <Link to="/hostels" style={{ color: 'var(--dark)', textDecoration: 'none' }}>
            Browse Hostels
          </Link>
          
          {isAuthenticated ? (
            <>
              {user?.role === 'owner' && (
                <Link to="/my-hostels" style={{ color: 'var(--dark)', textDecoration: 'none' }}>
                  My Hostels
                </Link>
              )}
              
              {user?.role === 'student' && (
                <>
                  <Link to="/favorites" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--dark)', textDecoration: 'none' }}>
                    <FaHeart /> Favorites
                  </Link>
                  <Link to="/bookings" style={{ color: 'var(--dark)', textDecoration: 'none' }}>
                    My Bookings
                  </Link>
                </>
              )}

              <Link to="/messages" style={{ display: 'flex', alignItems: 'center', color: 'var(--dark)', textDecoration: 'none' }}>
                <FaEnvelope size={20} />
              </Link>

              <Link to="/notifications" style={{ display: 'flex', alignItems: 'center', color: 'var(--dark)', textDecoration: 'none' }}>
                <FaBell size={20} />
              </Link>

              {/* Profile Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={toggleProfileMenu}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--dark)'
                  }}
                >
                  <FaUser />
                  <span>{user?.firstName}</span>
                </button>

                {isProfileMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    backgroundColor: 'var(--white)',
                    boxShadow: 'var(--shadow-lg)',
                    borderRadius: 'var(--radius-md)',
                    minWidth: '200px',
                    overflow: 'hidden'
                  }}>
                    <Link 
                      to="/profile" 
                      style={{
                        display: 'block',
                        padding: '0.75rem 1rem',
                        color: 'var(--dark)',
                        textDecoration: 'none'
                      }}
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/dashboard" 
                      style={{
                        display: 'block',
                        padding: '0.75rem 1rem',
                        color: 'var(--dark)',
                        textDecoration: 'none'
                      }}
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--error)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
            color: 'var(--dark)'
          }}
          className="mobile-menu-btn"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{
          padding: '1rem',
          backgroundColor: 'var(--gray-lighter)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }} className="mobile-menu">
          <Link to="/hostels" onClick={toggleMobileMenu}>
            Browse Hostels
          </Link>
          
          {isAuthenticated ? (
            <>
              {user?.role === 'owner' && (
                <Link to="/my-hostels" onClick={toggleMobileMenu}>
                  My Hostels
                </Link>
              )}
              
              {user?.role === 'student' && (
                <>
                  <Link to="/favorites" onClick={toggleMobileMenu}>
                    Favorites
                  </Link>
                  <Link to="/bookings" onClick={toggleMobileMenu}>
                    My Bookings
                  </Link>
                </>
              )}

              <Link to="/messages" onClick={toggleMobileMenu}>
                Messages
              </Link>
              <Link to="/notifications" onClick={toggleMobileMenu}>
                Notifications
              </Link>
              <Link to="/profile" onClick={toggleMobileMenu}>
                Profile
              </Link>
              <Link to="/dashboard" onClick={toggleMobileMenu}>
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMobileMenu();
                }}
                style={{
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--error)',
                  fontSize: '1rem'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={toggleMobileMenu}>
                Login
              </Link>
              <Link to="/register" onClick={toggleMobileMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;