import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

    .pf-footer {
      font-family: 'Manrope', sans-serif;
      background: #1a1f2e;
      color: #ffffff;
      padding: 4rem 2rem 0;
      margin-top: auto;
    }

    .pf-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* ── MAIN GRID ── */
    .pf-content {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 3rem;
      padding-bottom: 3rem;
    }

    /* ── BRAND COL ── */
    .pf-brand-name {
      font-size: 1.4rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 1rem;
      letter-spacing: 0.3px;
    }

    .pf-brand-desc {
      color: #8b92a5;
      line-height: 1.75;
      font-size: 0.92rem;
      max-width: 280px;
      margin-bottom: 1.5rem;
    }

    /* ── SOCIAL ICONS — TandPay square style ── */
    .pf-socials {
      display: flex;
      gap: 0.6rem;
    }

    .pf-social-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: #2a2f3e;
      color: #8b92a5;
      font-size: 1rem;
      text-decoration: none;
      transition: background 0.2s, color 0.2s, transform 0.2s;
      border: 1px solid #343a4d;
    }

    .pf-social-btn:hover {
      background: #0d6e5e;
      color: #ffffff;
      transform: translateY(-3px);
      border-color: #0d6e5e;
    }

    /* ── LINK COLUMNS ── */
    .pf-col h4 {
      font-size: 0.88rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 1.4rem;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .pf-col ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .pf-col ul li a,
    .pf-col ul li span {
      color: #8b92a5;
      text-decoration: none;
      font-size: 0.92rem;
      font-weight: 500;
      transition: color 0.2s;
      display: block;
    }

    .pf-col ul li a:hover { color: #ffffff; }

    /* ── BOTTOM BAR ── */
    .pf-bottom {
      border-top: 1px solid #2a2f3e;
      padding: 1.5rem 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .pf-copyright {
      color: #555e72;
      font-size: 0.82rem;
      font-weight: 500;
    }

    .pf-credit {
      color: #555e72;
      font-size: 0.82rem;
      font-weight: 500;
    }

    .pf-credit strong {
      color: #8b92a5;
      font-weight: 600;
    }

    /* ── RESPONSIVE ── */
    @media (max-width: 1024px) {
      .pf-content {
        grid-template-columns: 1fr 1fr;
        gap: 2.5rem;
      }
    }

    @media (max-width: 640px) {
      .pf-footer { padding: 3rem 1.2rem 0; }
      .pf-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      .pf-bottom {
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>

      <footer className="pf-footer">
        <div className="pf-container">

          <div className="pf-content">

            {/* ── BRAND ── */}
            <div className="pf-brand-col">
              <div className="pf-brand-name">PezaNyumba 🇲🇼</div>
              <p className="pf-brand-desc">
                Malawi's platform for finding and listing houses, flats, rooms and plots.
                Your money is protected. No middlemen. No walking door to door.
              </p>
              <div className="pf-socials">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="pf-social-btn" title="Facebook">
                  <FaFacebook />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="pf-social-btn" title="Twitter">
                  <FaTwitter />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="pf-social-btn" title="Instagram">
                  <FaInstagram />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="pf-social-btn" title="LinkedIn">
                  <FaLinkedin />
                </a>
              </div>
            </div>

            {/* ── PRODUCT ── */}
            <div className="pf-col">
              <h4>Platform</h4>
              <ul>
                <li><Link to="/properties">Browse Properties</Link></li>
                <li><Link to="/register">List a Property</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
              </ul>
            </div>

            {/* ── COMPANY ── */}
            <div className="pf-col">
              <h4>Company</h4>
              <ul>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/contact">Report a Dispute</Link></li>
              </ul>
            </div>

            {/* ── CONTACT ── */}
            <div className="pf-col">
              <h4>Contact</h4>
              <ul>
                <li><span>forjiteckco@gmail.com</span></li>
                <li><span>0982094391/0986584136</span></li>
                <li><Link to="/contact">WhatsApp</Link></li>
                <li><span>Blantyre, Malawi</span></li>
              </ul>
            </div>

          </div>

          {/* ── BOTTOM BAR ── */}
          <div className="pf-bottom">
            <p className="pf-copyright">
              © {currentYear} PezaNyumba. All rights reserved.
            </p>
            <p className="pf-credit">
              Made with ❤️ in Malawi by <strong>ForjiTech</strong>
            </p>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;