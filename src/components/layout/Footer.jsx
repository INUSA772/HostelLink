import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
    
    :root {
      --navy: #0d1b3e;
      --blue: #1a3fa4;
      --orange: #e8501a;
      --white: #ffffff;
      --gray-bg: #f4f6fa;
      --text-dark: #111827;
      --text-mid: #4b5563;
      --gray-light: #d1d5db;
      --gray-dark: #374151;
    }

    footer {
      font-family: 'Manrope', sans-serif;
      background: linear-gradient(135deg, #070f24 0%, var(--navy) 100%);
      color: var(--white);
      margin-top: auto;
      padding: 4rem 2rem 2rem;
      border-top: 3px solid var(--orange);
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 3rem;
      margin-bottom: 3rem;
    }

    .footer-section h3 {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--orange);
      margin-bottom: 1.2rem;
      letter-spacing: 0.5px;
    }

    .footer-section h4 {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--white);
      margin-bottom: 1rem;
      letter-spacing: 0.3px;
    }

    .footer-section p {
      color: var(--gray-light);
      line-height: 1.7;
      font-size: 0.95rem;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-links li {
      margin-bottom: 0.75rem;
    }

    .footer-links a {
      color: var(--gray-light);
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 500;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .footer-links a:hover {
      color: var(--orange);
      transform: translateX(4px);
    }

    .contact-info {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .contact-info li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      color: var(--gray-light);
      font-size: 0.95rem;
      font-weight: 500;
    }

    .contact-info i {
      color: var(--orange);
      width: 20px;
      text-align: center;
      font-size: 1.1rem;
    }

    .social-links {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .social-links a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      color: var(--orange);
      font-size: 1.2rem;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .social-links a:hover {
      background: var(--orange);
      color: var(--white);
      transform: translateY(-4px);
      box-shadow: 0 6px 20px rgba(232, 80, 26, 0.3);
    }

    .footer-divider {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 2rem;
      margin-top: 2rem;
    }

    .footer-bottom {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 2rem;
      text-align: left;
    }

    .footer-credit {
      color: var(--gray-light);
      font-size: 0.9rem;
      font-weight: 500;
    }

    .footer-credit strong {
      color: var(--orange);
      font-weight: 700;
    }

    .footer-copyright {
      color: var(--gray-light);
      font-size: 0.9rem;
      font-weight: 500;
      text-align: right;
    }

    @media (max-width: 768px) {
      footer {
        padding: 3rem 1rem 1.5rem;
      }

      .footer-content {
        gap: 2rem;
      }

      .footer-bottom {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .footer-copyright {
        text-align: center;
      }

      .contact-info li {
        justify-content: center;
      }

      .social-links {
        justify-content: center;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      
      <footer>
        <div className="footer-container">
          <div className="footer-content">
            {/* About Section */}
            <div className="footer-section">
              <h3>🏠 HostelLink</h3>
              <p>
                Making it easy for MUBAS students to find quality accommodation near campus. 
                Connect directly with hostel owners and find your perfect home away from home.
              </p>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/hostels">
                    <i className="fa fa-arrow-right" style={{ fontSize: '0.8rem' }}></i>
                    Browse Hostels
                  </Link>
                </li>
                <li>
                  <Link to="/about">
                    <i className="fa fa-arrow-right" style={{ fontSize: '0.8rem' }}></i>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact">
                    <i className="fa fa-arrow-right" style={{ fontSize: '0.8rem' }}></i>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/faq">
                    <i className="fa fa-arrow-right" style={{ fontSize: '0.8rem' }}></i>
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Owners */}
            <div className="footer-section">
              <h4>For Hostel Owners</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/register?role=owner">
                    <i className="fa fa-arrow-right" style={{ fontSize: '0.8rem' }}></i>
                    List Your Hostel
                  </Link>
                </li>
                <li>
                  <Link to="/owner-dashboard">
                    <i className="fa fa-arrow-right" style={{ fontSize: '0.8rem' }}></i>
                    Owner Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/terms">
                    <i className="fa fa-arrow-right" style={{ fontSize: '0.8rem' }}></i>
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/privacy">
                    <i className="fa fa-arrow-right" style={{ fontSize: '0.8rem' }}></i>
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h4>Contact Us</h4>
              <ul className="contact-info">
                <li>
                  <FaMapMarkerAlt />
                  Blantyre, Malawi
                </li>
                <li>
                  <FaPhone />
                  +265 986584136
                </li>
                <li>
                  <FaEnvelope />
                  forjiteckco@gmail.com
                </li>
              </ul>

              {/* Social Media */}
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">
                  <FaFacebook />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter">
                  <FaTwitter />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">
                  <FaInstagram />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-divider">
            <div className="footer-bottom">
              <p className="footer-credit">
                Powered by <strong>ForjiTech</strong> • Connecting Students to Quality Accommodation
              </p>
              <p className="footer-copyright">
                &copy; {currentYear} HostelLink. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;