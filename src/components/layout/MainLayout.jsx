import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import '../../styles/global.css';

// Pages where footer should NOT appear
const NO_FOOTER_PAGES = [
  '/messages',
  '/dashboard',
  '/landlord-dashboard',
  '/profile',
  '/bookings',
  '/favorites',
  '/notifications',
  '/my-hostels',
  '/hostels/create',
  '/analytics',
  '/settings',
];

// Pages where navbar should NOT appear
const NO_NAVBAR_PAGES = [
  '/messages',
];

const MainLayout = ({ children }) => {
  const location = useLocation();

  const hideFooter = NO_FOOTER_PAGES.some(path =>
    location.pathname.startsWith(path)
  );

  const hideNavbar = NO_NAVBAR_PAGES.some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {!hideNavbar && <Navbar />}
      <main style={{ flex: 1 }}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default MainLayout;