import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import '../../styles/global.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: 'var(--dark)',
      color: 'var(--white)',
      marginTop: 'auto'
    }}>
      <div className="container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '3rem 1rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* About Section */}
          <div>
            <h3 style={{ color: 'var(--primary-light)', marginBottom: '1rem' }}>
              HostelLink
            </h3>
            <p style={{ color: 'var(--gray-light)', lineHeight: '1.6' }}>
              Making it easy for MUBAS students to find quality accommodation near campus. 
              Connect directly with hostel owners and find your perfect home away from home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/hostels" style={{ color: 'var(--gray-light)', textDecoration: 'none' }}>
                  Browse Hostels
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/about" style={{ color: 'var(--gray-light)', textDecoration: 'none' }}>
                  About Us
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/contact" style={{ color: 'var(--gray-light)', textDecoration: 'none' }}>
                  Contact
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/faq" style={{ color: 'var(--gray-light)', textDecoration: 'none' }}>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h4 style={{ marginBottom: '1rem' }}>For Hostel Owners</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/register?role=owner" style={{ color: 'var(--gray-light)', textDecoration: 'none' }}>
                  List Your Hostel
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/owner-dashboard" style={{ color: 'var(--gray-light)', textDecoration: 'none' }}>
                  Owner Dashboard
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/terms" style={{ color: 'var(--gray-light)', textDecoration: 'none' }}>
                  Terms & Conditions
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/privacy" style={{ color: 'var(--gray-light)', textDecoration: 'none' }}>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Contact Us</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                marginBottom: '0.5rem',
                color: 'var(--gray-light)'
              }}>
                <FaMapMarkerAlt /> Blantyre, Malawi
              </li>
              <li style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                marginBottom: '0.5rem',
                color: 'var(--gray-light)'
              }}>
                <FaPhone /> +265 986584136
              </li>
              <li style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                marginBottom: '0.5rem',
                color: 'var(--gray-light)'
              }}>
                <FaEnvelope /> majiduinusa@gmail.com
              </li>
            </ul>

            {/* Social Media */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginTop: '1rem' 
            }}>
              <a href="#" style={{ color: 'var(--gray-light)', fontSize: '1.5rem' }}>
                <FaFacebook />
              </a>
              <a href="#" style={{ color: 'var(--gray-light)', fontSize: '1.5rem' }}>
                <FaTwitter />
              </a>
              <a href="#" style={{ color: 'var(--gray-light)', fontSize: '1.5rem' }}>
                <FaInstagram />
              </a>
              <a href="#" style={{ color: 'var(--gray-light)', fontSize: '1.5rem' }}>
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--gray-dark)',
          paddingTop: '1.5rem',
          textAlign: 'center',
          color: 'var(--gray-light)'
        }}>
          <p>&copy; {currentYear} HostelLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;