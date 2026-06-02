import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/global.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');

        .pn-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2.5rem;
          height: 68px;
          background: #ffffff;
          border-bottom: 1px solid #e8f0ee;
          box-shadow: 0 1px 8px rgba(13,110,94,0.07);
          font-family: 'Manrope', sans-serif;
        }

        .pn-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #111827;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          text-decoration: none;
        }

        .pn-logo-icon {
          width: 38px; height: 38px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          background: #e8f5f2;
        }

        .pn-logo-icon img {
          width: 100%; height: 100%;
          object-fit: cover;
        }

        .pn-logo-text strong {
          display: block;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: 1px;
          color: #0d4a40;
        }

        .pn-logo-text span {
          font-size: 0.62rem;
          opacity: 0.65;
          letter-spacing: 0.5px;
          color: #4b5563;
        }

        /* ── CENTER FANCY TEXT ── */
        .pn-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 1.8rem;
        }

        .pn-center-brand {
          font-family: 'Righteous', cursive;
          font-size: 1.05rem;
          letter-spacing: 3px;
          background: linear-gradient(90deg, #0d6e5e 0%, #1a5c52 40%, #2d8a72 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% auto;
          animation: navShine 4s linear infinite;
          cursor: default;
        }

        .pn-center-brand::before {
          content: '⬡';
          font-size: 0.6rem;
          margin-right: 5px;
          -webkit-text-fill-color: #0d6e5e;
          animation: navHex 6s linear infinite;
          display: inline-block;
        }

        @keyframes navShine {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        @keyframes navHex {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .pn-center-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: #d1d5db;
        }

        .pn-center-link {
          color: #374151;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: all 0.3s ease;
          text-decoration: none;
          position: relative;
          font-family: 'Manrope', sans-serif;
        }

        .pn-center-link::after {
          content: '';
          position: absolute;
          bottom: -3px; left: 0;
          width: 0%;
          height: 1.5px;
          background: #0d6e5e;
          transition: width 0.3s ease;
        }

        .pn-center-link:hover { color: #0d6e5e; }
        .pn-center-link:hover::after { width: 100%; }

        /* ── RIGHT ACTIONS ── */
        .pn-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          position: relative;
        }

        .pn-btn-login {
          color: #374151;
          font-size: 0.88rem;
          font-weight: 600;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0.4rem 0.9rem;
          border-radius: 6px;
          border: 1.5px solid #d1d5db;
          transition: all 0.2s;
          white-space: nowrap;
          background: none;
          cursor: pointer;
          font-family: 'Manrope', sans-serif;
        }

        .pn-btn-login:hover {
          border-color: #0d6e5e;
          color: #0d6e5e;
        }

        .pn-btn-signup {
          background: #0d6e5e;
          color: white;
          border: none;
          cursor: pointer;
          padding: 0.5rem 1.2rem;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: background 0.2s, box-shadow 0.2s;
          text-decoration: none;
          white-space: nowrap;
          font-family: 'Manrope', sans-serif;
          box-shadow: 0 2px 8px rgba(13,110,94,0.25);
        }

        .pn-btn-signup:hover {
          background: #0a5a4c;
          box-shadow: 0 4px 14px rgba(13,110,94,0.35);
        }

        /* ── PROFILE DROPDOWN ── */
        .pn-profile-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f0faf7;
          border: 1.5px solid #b2d8d0;
          border-radius: 8px;
          padding: 0.4rem 0.9rem;
          color: #0d4a40;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Manrope', sans-serif;
          transition: all 0.2s;
        }

        .pn-profile-btn:hover {
          background: #e8f5f2;
          border-color: #0d6e5e;
          color: #0d6e5e;
        }

        .pn-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: white;
          border-radius: 10px;
          box-shadow: 0 10px 40px rgba(13,110,94,0.14);
          border: 1px solid #e8f0ee;
          min-width: 200px;
          overflow: hidden;
          z-index: 1000;
        }

        .pn-dropdown a,
        .pn-dropdown button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.75rem 1rem;
          font-size: 0.88rem;
          font-weight: 600;
          color: #374151;
          text-decoration: none;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-family: 'Manrope', sans-serif;
          transition: background 0.15s, color 0.15s;
        }

        .pn-dropdown a:hover { background: #f0faf7; color: #0d6e5e; }
        .pn-dropdown button:hover { background: #fff5f5; color: #dc2626; }

        .pn-dropdown-divider {
          height: 1px;
          background: #e8f0ee;
          margin: 0;
        }

        /* ── MOBILE ── */
        .pn-mobile-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.4rem;
          color: #374151;
        }

        .pn-mobile-menu {
          background: #ffffff;
          padding: 1.2rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border-top: 1px solid #e8f0ee;
          box-shadow: 0 8px 20px rgba(13,110,94,0.08);
          position: fixed;
          top: 68px;
          left: 0; right: 0;
          z-index: 998;
        }

        .pn-mobile-menu a,
        .pn-mobile-menu button {
          color: #374151;
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          text-align: left;
          font-family: 'Manrope', sans-serif;
          transition: color 0.2s;
        }

        .pn-mobile-menu a:hover,
        .pn-mobile-menu button:hover { color: #0d6e5e; }

        .pn-mobile-logout { color: #dc2626 !important; }

        @media (max-width: 1024px) {
          .pn-center { display: none; }
        }

        @media (max-width: 768px) {
          .pn-actions { display: none; }
          .pn-mobile-btn { display: block; }
        }

        @media (max-width: 600px) {
          .pn-nav { padding: 0 1rem; }
          .pn-logo-text span { display: none; }
        }

        @media (max-width: 400px) {
          .pn-logo-text { display: none; }
        }
      `}</style>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      <nav className="pn-nav">

        {/* LOGO */}
        <Link to="/" className="pn-logo">
          <div className="pn-logo-icon">

            <img src="/PEZ.png" alt="PezaNyumba" />

          </div>
          <div className="pn-logo-text">
            <strong>PezaNyumba</strong>
            <span>Find Your Perfect Home In Malawi</span>
          </div>
        </Link>

        {/* CENTER */}
        <div className="pn-center">
          <span className="pn-center-brand">PezaNyumba</span>
          <div className="pn-center-dot" />
          <Link to="/properties" className="pn-center-link">Properties</Link>
          <div className="pn-center-dot" />
          <Link to="/about" className="pn-center-link">About</Link>
          <div className="pn-center-dot" />
        </div>

        {/* RIGHT ACTIONS */}
        <div className="pn-actions">
          {isAuthenticated ? (
            <>
              <div style={{ position: 'relative' }}>
                <button
                  className="pn-profile-btn"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <i className="fa fa-user-circle" />
                  {user?.firstName || 'Account'}
                  <i className="fa fa-chevron-down" style={{ fontSize: '0.65rem', opacity: 0.7 }} />
                </button>

                {isProfileMenuOpen && (
                  <div className="pn-dropdown">
                    <Link to="/profile" onClick={() => setIsProfileMenuOpen(false)}>
                      <i className="fa fa-user" /> Profile
                    </Link>
                    <Link
                      to={user?.role === 'landlord' ? '/landlord-dashboard' : '/dashboard'}
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <i className="fa fa-th-large" /> Dashboard
                    </Link>
                    {user?.role === 'landlord' && (
                      <Link to="/my-properties" onClick={() => setIsProfileMenuOpen(false)}>
                        <i className="fa fa-building" /> My Properties
                      </Link>
                    )}
                    {user?.role === 'tenant' && (
                      <>
                        <Link to="/favorites" onClick={() => setIsProfileMenuOpen(false)}>
                          <i className="fa fa-heart" /> Saved
                        </Link>
                        <Link to="/inquiries" onClick={() => setIsProfileMenuOpen(false)}>
                          <i className="fa fa-list" /> My Inquiries
                        </Link>
                      </>
                    )}
                    <Link to="/messages" onClick={() => setIsProfileMenuOpen(false)}>
                      <i className="fa fa-envelope" /> Messages
                    </Link>
                    <div className="pn-dropdown-divider" />
                    <button onClick={handleLogout}>
                      <i className="fa fa-sign-out-alt" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/*<Link to="/login" className="pn-btn-login">
                <i className="fa fa-sign-in-alt" /> Login
              </Link>
              <Link to="/register" className="pn-btn-signup">
                <i className="fa fa-user-plus" /> Sign Up
              </Link>*/}
            </>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="pn-mobile-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className={isMobileMenuOpen ? 'fa fa-times' : 'fa fa-bars'} />
        </button>
      </nav>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="pn-mobile-menu">
          <Link to="/properties" onClick={() => setIsMobileMenuOpen(false)}>Browse Properties</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link>

          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
              <Link
                to={user?.role === 'landlord' ? '/landlord-dashboard' : '/dashboard'}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              {user?.role === 'landlord' && (
                <Link to="/my-properties" onClick={() => setIsMobileMenuOpen(false)}>My Properties</Link>
              )}
              {user?.role === 'tenant' && (
                <>
                  <Link to="/favorites" onClick={() => setIsMobileMenuOpen(false)}>Saved</Link>
                  <Link to="/inquiries" onClick={() => setIsMobileMenuOpen(false)}>My Inquiries</Link>
                </>
              )}
              <Link to="/messages" onClick={() => setIsMobileMenuOpen(false)}>Messages</Link>
              <Link to="/notifications" onClick={() => setIsMobileMenuOpen(false)}>Notifications</Link>
              <button
                className="pn-mobile-logout"
                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;