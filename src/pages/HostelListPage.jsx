import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHostel } from '../context/HostelContext';
import HostelList from '../components/hostel/HostelList';
import HostelFilters from '../components/hostel/HostelFilters';
import Pagination from '../components/common/Pagination';
import '../styles/global.css';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0d1b3e;
    --navy2: #112255;
    --blue: #1a3fa4;
    --orange: #e8501a;
    --text-dark: #111827;
    --text-mid: #4b5563;
    --card-radius: 14px;
    --success: #10b981;
    --white: #ffffff;
    --gray: #6b7280;
    --light-gray: #e5e7eb;
    --gray-lighter: #f4f6fb;
    --primary-color: #e8501a;
    --primary-dark: #c43f12;
  }

  /* Lock entire page — zero scroll */
  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
    font-family: 'Manrope', sans-serif;
  }

  /* TOPBAR - EXACT same as Register/Login Page */
  .rp-bar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 500;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    background: rgba(8, 18, 48, 0.97);
    backdrop-filter: blur(8px);
    box-shadow: 0 2px 18px rgba(0,0,0,0.4);
  }
  .rp-bar-logo {
    display: flex; align-items: center; gap: 9px; text-decoration: none;
  }
  .rp-bar-logo-img {
    width: 36px; height: 36px; border-radius: 50%; overflow: hidden; flex-shrink: 0;
  }
  .rp-bar-logo-img img { width: 100%; height: 100%; object-fit: cover; }
  .rp-bar-brand strong {
    display: block; color: #fff; font-size: 0.9rem; font-weight: 800;
    letter-spacing: 1px; font-family: 'Manrope', sans-serif;
  }
  .rp-bar-brand span {
    color: rgba(255,255,255,0.42); font-size: 0.56rem;
    letter-spacing: 0.4px; font-family: 'Manrope', sans-serif;
  }
  .rp-bar-actions { display: flex; align-items: center; gap: 0.6rem; }
  .rp-bar-login {
    color: rgba(255,255,255,0.78); font-size: 0.82rem; font-weight: 600;
    font-family: 'Manrope', sans-serif; background: transparent;
    border: 1.5px solid rgba(255,255,255,0.2); padding: 0.36rem 0.95rem;
    border-radius: 6px; cursor: pointer; text-decoration: none;
    transition: all 0.18s; display: flex; align-items: center; gap: 5px;
  }
  .rp-bar-login:hover { border-color: rgba(255,255,255,0.55); color: #fff; }
  .rp-bar-signup {
    color: #fff; font-size: 0.82rem; font-weight: 700;
    font-family: 'Manrope', sans-serif; background: var(--orange);
    border: none; padding: 0.36rem 0.95rem; border-radius: 6px;
    cursor: pointer; text-decoration: none; transition: opacity 0.18s;
    display: flex; align-items: center; gap: 5px;
  }
  .rp-bar-signup:hover { opacity: 0.88; }

  /* MAIN CONTENT - Scrollable area below topbar */
  .rp-main-content {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    background: var(--gray-lighter);
    padding: 2rem 1rem 4rem;
  }

  /* Container */
  .rp-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Header */
  .rp-header {
    margin-bottom: 2rem;
  }
  .rp-header h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, var(--orange) 0%, #c43f12 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
  }
  .rp-header p {
    color: var(--gray);
    font-size: 1.1rem;
  }

  /* Results Count Card */
  .rp-results-card {
    padding: 1rem 1.5rem;
    background: var(--white);
    border-radius: var(--card-radius);
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 12px rgba(13,27,62,0.08);
    border: 1px solid rgba(0,0,0,0.03);
  }
  .rp-results-count {
    margin: 0;
    color: var(--navy);
    font-weight: 600;
    font-size: 0.95rem;
  }
  .rp-results-page {
    margin: 0;
    color: var(--gray);
    font-size: 0.85rem;
    font-weight: 500;
  }

  /* Loading State */
  .rp-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem;
    background: var(--white);
    border-radius: var(--card-radius);
    box-shadow: 0 4px 20px rgba(13,27,62,0.08);
  }
  .rp-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--light-gray);
    border-top-color: var(--orange);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 1rem;
  }
  .rp-loading p {
    color: var(--text-mid);
    font-size: 0.95rem;
  }

  /* Empty State */
  .rp-empty {
    text-align: center;
    padding: 4rem 2rem;
    background: var(--white);
    border-radius: var(--card-radius);
    box-shadow: 0 4px 20px rgba(13,27,62,0.08);
  }
  .rp-empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  .rp-empty h3 {
    color: var(--navy);
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  .rp-empty p {
    color: var(--gray);
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }
  .rp-empty-btn {
    background: var(--orange);
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .rp-empty-btn:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .rp-bar { padding: 0 1rem; }
    .rp-bar-brand { display: none; }
    .rp-header h1 { font-size: 2rem; }
    .rp-results-card { flex-direction: column; gap: 0.5rem; align-items: flex-start; }
  }
`;

const HostelListPage = () => {
  const {
    hostels,
    loading,
    filters,
    pagination,
    fetchHostels,
    updateFilters,
    resetFilters,
    changePage
  } = useHostel();

  // Fetch hostels on mount and when filters change
  useEffect(() => {
    fetchHostels();
  }, [filters.search, filters.type, filters.gender, filters.minPrice, filters.maxPrice, filters.amenities, filters.sort, filters.page]);

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  const handleReset = () => {
    resetFilters();
  };

  const handlePageChange = (page) => {
    changePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      {/* TOPBAR - EXACT same as Register/Login Page */}
      <nav className="rp-bar">
        <Link to="/" className="rp-bar-logo">
          <div className="rp-bar-logo-img"><img src="/logo2.png" alt="HostelLink" /></div>
          <div className="rp-bar-brand">
            <strong>HOSTELLINK</strong>
            <span>OFF-CAMPUS ACCOMODATION</span>
          </div>
        </Link>
        <div className="rp-bar-actions">
          <Link to="/login" className="rp-bar-login"><i className="fa fa-sign-in-alt"></i> Login</Link>
          <Link to="/register" className="rp-bar-signup"><i className="fa fa-user-plus"></i> Sign Up</Link>
        </div>
      </nav>

      {/* MAIN CONTENT - Scrollable area */}
      <div className="rp-main-content">
        <div className="rp-container">
          {/* Header */}
          <div className="rp-header">
            <h1>Find Your Perfect Hostel</h1>
            <p>Browse {pagination.total} available hostels near MUBAS</p>
          </div>

          {/* Filters */}
          <HostelFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />

          {/* Results Count */}
          {!loading && hostels.length > 0 && (
            <div className="rp-results-card">
              <p className="rp-results-count">
                <i className="fa fa-building" style={{ marginRight: '0.5rem', color: 'var(--orange)' }}></i>
                Showing {hostels.length} of {pagination.total} hostels
              </p>
              <p className="rp-results-page">
                <i className="fa fa-file" style={{ marginRight: '0.5rem', color: 'var(--gray)' }}></i>
                Page {pagination.page} of {pagination.totalPages}
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="rp-loading">
              <div className="rp-spinner"></div>
              <p>Loading available hostels...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && hostels.length === 0 && (
            <div className="rp-empty">
              <div className="rp-empty-icon">🏠</div>
              <h3>No hostels found</h3>
              <p>Try adjusting your filters or search criteria</p>
              <button className="rp-empty-btn" onClick={handleReset}>
                <i className="fa fa-refresh" style={{ marginRight: '0.5rem' }}></i>
                Clear All Filters
              </button>
            </div>
          )}

          {/* Hostel List */}
          {!loading && hostels.length > 0 && (
            <HostelList hostels={hostels} loading={loading} />
          )}

          {/* Pagination */}
          {!loading && hostels.length > 0 && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default HostelListPage;