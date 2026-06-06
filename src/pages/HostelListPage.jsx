// frontend/src/pages/PropertiesListing.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ════════════════════════════════════════════════════════════════
// STYLES - Unified with Home.jsx (Teal/Green Theme)
// ════════════════════════════════════════════════════════════════

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  
  *, *::before, *::after { 
    box-sizing: border-box; 
    margin: 0; 
    padding: 0; 
  }

  :root {
    --teal-dark: #0d4a40;
    --teal: #1a5c52;
    --teal-mid: #2d8a72;
    --teal-light: #e8f5f2;
    --teal-pale: #f0faf7;
    --cream: #f8f9f7;
    --white: #ffffff;
    --gray-bg: #f4f6f4;
    --dark: #0a0a0a;
    --mid: #4b5563;
    --light-border: #e2ede9;
    --radius: 14px;
    --green-check: #22c55e;
    --wa: #25D366;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    font-family: 'Manrope', sans-serif;
  }

  /* ══════════════════════════════════════
     TOPBAR / NAVBAR
  ══════════════════════════════════════ */
  .pz-navbar {
    position: sticky;
    top: 0;
    z-index: 500;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    background: rgba(13, 27, 62, 0.97);
    backdrop-filter: blur(8px);
    box-shadow: 0 2px 18px rgba(0, 0, 0, 0.4);
  }

  .pz-navbar-logo {
    display: flex;
    align-items: center;
    gap: 9px;
    text-decoration: none;
  }

  .pz-navbar-logo-img {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    overflow: hidden;
    flex-shrink: 0;
    border: 2px solid rgba(255, 255, 255, 0.15);
    background: var(--teal);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 800;
    font-size: 18px;
  }

  .pz-navbar-brand strong {
    display: block;
    color: #fff;
    font-size: 0.9rem;
    font-weight: 800;
    letter-spacing: 1px;
  }

  .pz-navbar-brand span {
    color: rgba(255, 255, 255, 0.42);
    font-size: 0.56rem;
    letter-spacing: 0.4px;
  }

  .pz-navbar-actions {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .pz-navbar-link {
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.82rem;
    font-weight: 600;
    background: transparent;
    border: 1.5px solid rgba(255, 255, 255, 0.15);
    padding: 0.36rem 0.85rem;
    border-radius: 6px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.18s;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .pz-navbar-link:hover {
    border-color: rgba(255, 255, 255, 0.45);
    color: #fff;
  }

  .pz-navbar-login {
    color: rgba(255, 255, 255, 0.78);
    font-size: 0.82rem;
    font-weight: 600;
    background: transparent;
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    padding: 0.36rem 0.95rem;
    border-radius: 6px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.18s;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .pz-navbar-login:hover {
    border-color: rgba(255, 255, 255, 0.55);
    color: #fff;
  }

  .pz-navbar-signup {
    color: #fff;
    font-size: 0.82rem;
    font-weight: 700;
    background: var(--teal);
    border: none;
    padding: 0.36rem 0.95rem;
    border-radius: 6px;
    cursor: pointer;
    text-decoration: none;
    transition: opacity 0.18s;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .pz-navbar-signup:hover {
    opacity: 0.88;
  }

  /* ══════════════════════════════════════
     MAIN CONTENT
  ══════════════════════════════════════ */
  .pz-main-content {
    position: relative;
    margin-top: 60px;
    min-height: calc(100vh - 60px);
    background: var(--gray-bg);
    padding: 2rem 1rem 4rem;
    overflow-y: auto;
  }

  .pz-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .pz-header {
    margin-bottom: 2rem;
  }

  .pz-header h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, var(--teal) 0%, var(--teal-mid) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
  }

  .pz-header p {
    color: var(--mid);
    font-size: 1.1rem;
  }

  /* ══════════════════════════════════════
     FILTERS & SEARCH
  ══════════════════════════════════════ */
  .pz-filters-card {
    padding: 1.5rem;
    background: var(--white);
    border-radius: var(--radius);
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 12px rgba(13, 27, 62, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.03);
  }

  .pz-filters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }

  .pz-filter-group label {
    display: block;
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--teal-dark);
    margin-bottom: 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .pz-filter-group input,
  .pz-filter-group select {
    width: 100%;
    padding: 0.65rem 1rem;
    border: 1.5px solid var(--light-border);
    border-radius: 8px;
    font-size: 0.88rem;
    background: var(--white);
    color: var(--dark);
    outline: none;
    font-family: inherit;
    transition: border 0.2s;
  }

  .pz-filter-group input:focus,
  .pz-filter-group select:focus {
    border-color: var(--teal);
    box-shadow: 0 0 0 3px rgba(26, 92, 82, 0.1);
  }

  .pz-filter-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .pz-btn-search {
    background: var(--teal);
    color: white;
    border: none;
    padding: 0.65rem 1.4rem;
    border-radius: 8px;
    font-size: 0.88rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: inherit;
  }

  .pz-btn-search:hover {
    background: var(--teal-dark);
  }

  .pz-btn-reset {
    background: var(--teal-light);
    color: var(--teal-dark);
    border: 1.5px solid var(--light-border);
    padding: 0.65rem 1.4rem;
    border-radius: 8px;
    font-size: 0.88rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
  }

  .pz-btn-reset:hover {
    background: var(--teal);
    color: white;
    border-color: var(--teal);
  }

  /* ══════════════════════════════════════
     RESULTS & PAGINATION
  ══════════════════════════════════════ */
  .pz-results-card {
    padding: 1rem 1.5rem;
    background: var(--white);
    border-radius: var(--radius);
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 12px rgba(13, 27, 62, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.03);
  }

  .pz-results-count {
    margin: 0;
    color: var(--dark);
    font-weight: 600;
    font-size: 0.95rem;
  }

  .pz-results-page {
    margin: 0;
    color: var(--mid);
    font-size: 0.85rem;
    font-weight: 500;
  }

  /* ══════════════════════════════════════
     LOADING & EMPTY STATES
  ══════════════════════════════════════ */
  .pz-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem;
    background: var(--white);
    border-radius: var(--radius);
    box-shadow: 0 4px 20px rgba(13, 27, 62, 0.08);
  }

  .pz-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--teal-light);
    border-top-color: var(--teal);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 1rem;
  }

  .pz-loading p {
    color: var(--mid);
    font-size: 0.95rem;
  }

  .pz-empty {
    text-align: center;
    padding: 4rem 2rem;
    background: var(--white);
    border-radius: var(--radius);
    box-shadow: 0 4px 20px rgba(13, 27, 62, 0.08);
  }

  .pz-empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .pz-empty h3 {
    color: var(--dark);
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .pz-empty p {
    color: var(--mid);
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }

  .pz-empty-btn {
    background: var(--teal);
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .pz-empty-btn:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  /* ══════════════════════════════════════
     PROPERTY GRID & CARDS
  ══════════════════════════════════════ */
  .pz-property-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.2rem;
    margin-bottom: 2rem;
  }

  .pz-property-card {
    border: 1.5px solid var(--light-border);
    border-radius: var(--radius);
    overflow: hidden;
    background: var(--white);
    transition: all 0.25s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
  }

  .pz-property-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(13, 74, 64, 0.12);
    border-color: var(--teal-mid);
  }

  .pz-property-img-wrap {
    position: relative;
    height: 170px;
    overflow: hidden;
    background: var(--teal-light);
    flex-shrink: 0;
  }

  .pz-property-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s;
  }

  .pz-property-card:hover .pz-property-img-wrap img {
    transform: scale(1.05);
  }

  .pz-property-no-img {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    color: var(--teal-mid);
    opacity: 0.4;
  }

  .pz-property-badges {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
  }

  .pz-property-badge {
    font-size: 0.66rem;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .pz-property-badge.rent {
    background: var(--teal);
    color: white;
  }

  .pz-property-badge.sale {
    background: #0891b2;
    color: white;
  }

  .pz-property-badge.type {
    background: rgba(255, 255, 255, 0.92);
    color: #374151;
  }

  .pz-property-body {
    padding: 1rem;
    flex: 1;
  }

  .pz-property-name {
    font-size: 0.95rem;
    font-weight: 800;
    color: var(--dark);
    margin-bottom: 0.3rem;
    line-height: 1.3;
  }

  .pz-property-location {
    font-size: 0.76rem;
    color: var(--mid);
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 0.6rem;
  }

  .pz-property-location i {
    color: var(--teal);
    font-size: 0.72rem;
  }

  .pz-property-price {
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--teal-dark);
  }

  .pz-property-meta {
    display: flex;
    gap: 0.8rem;
    margin-top: 0.5rem;
    flex-wrap: wrap;
  }

  .pz-property-meta-item {
    font-size: 0.72rem;
    color: var(--mid);
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .pz-property-meta-item i {
    color: var(--teal);
  }

  .pz-property-actions {
    padding: 0.75rem 1rem;
    border-top: 1px solid var(--light-border);
    display: flex;
    gap: 0.5rem;
  }

  .pz-btn-whatsapp {
    flex: 1;
    background: var(--wa);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.5rem 0.5rem;
    font-size: 0.78rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    text-decoration: none;
    transition: background 0.18s;
    cursor: pointer;
  }

  .pz-btn-whatsapp:hover {
    background: #128c4e;
  }

  .pz-btn-call {
    background: var(--teal-light);
    color: var(--teal);
    border: 1.5px solid var(--light-border);
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    font-size: 0.78rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 5px;
    text-decoration: none;
    transition: all 0.18s;
    cursor: pointer;
  }

  .pz-btn-call:hover {
    background: var(--teal);
    color: white;
  }

  /* ══════════════════════════════════════
     PAGINATION
  ══════════════════════════════════════ */
  .pz-pagination {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    align-items: center;
    margin: 2rem 0;
  }

  .pz-pagination button {
    background: var(--white);
    color: var(--teal);
    border: 1.5px solid var(--light-border);
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.85rem;
    transition: all 0.2s;
  }

  .pz-pagination button:hover:not(:disabled) {
    background: var(--teal);
    color: white;
  }

  .pz-pagination button.active {
    background: var(--teal);
    color: white;
  }

  .pz-pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* ══════════════════════════════════════
     ANIMATIONS
  ══════════════════════════════════════ */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* ══════════════════════════════════════
     RESPONSIVE
  ══════════════════════════════════════ */
  @media (max-width: 1024px) {
    .pz-filters-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .pz-navbar {
      padding: 0 1rem;
    }

    .pz-navbar-brand {
      display: none;
    }

    .pz-navbar-link {
      display: none;
    }

    .pz-header h1 {
      font-size: 2rem;
    }

    .pz-filters-grid {
      grid-template-columns: 1fr;
    }

    .pz-results-card {
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-start;
    }

    .pz-property-grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }
  }

  @media (max-width: 480px) {
    .pz-navbar {
      padding: 0 0.5rem;
    }

    .pz-main-content {
      padding: 1rem 0.5rem 2rem;
    }

    .pz-header h1 {
      font-size: 1.5rem;
    }

    .pz-property-grid {
      grid-template-columns: 1fr;
    }
  }
`;

// ════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════

export default function PropertiesListing() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    district: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const fetchProperties = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...(filters.search && { search: filters.search }),
        ...(filters.type && { type: filters.type }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.district && { district: filters.district }),
      });

      const response = await fetch(`${API_URL}/properties?${params}`);
      const data = await response.json();

      if (data.success) {
        setProperties(data.properties || []);
        setPagination({
          page: data.pagination?.page || 1,
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.totalPages || 1,
        });
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      district: '',
    });
  };

  const handlePageChange = (page) => {
    fetchProperties(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      {/* NAVBAR */}
      <nav className="pz-navbar">
        <Link to="/" className="pz-navbar-logo">
          <div className="pz-navbar-logo-img">PN</div>
          <div className="pz-navbar-brand">
            <strong>PEZANYUMBA</strong>
            <span>Find Your Perfect Home in Malawi</span>
          </div>
        </Link>
        <div className="pz-navbar-actions">
          <Link to="/about" className="pz-navbar-link">
            <i className="fa fa-info-circle"></i> About
          </Link>
          <Link to="/contact" className="pz-navbar-link">
            <i className="fa fa-phone"></i> Contact
          </Link>
          <Link to="/login" className="pz-navbar-login">
            <i className="fa fa-sign-in-alt"></i> Login
          </Link>
          <Link to="/register" className="pz-navbar-signup">
            <i className="fa fa-user-plus"></i> List Property
          </Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="pz-main-content">
        <div className="pz-container">
          <div className="pz-header">
            <h1>Find Your Perfect Home</h1>
            <p>Browse verified properties across all districts in Malawi</p>
          </div>

          {/* FILTERS */}
          <div className="pz-filters-card">
            <div className="pz-filters-grid">
              <div className="pz-filter-group">
                <label htmlFor="search">Search</label>
                <input
                  id="search"
                  type="text"
                  name="search"
                  placeholder="Property name or location..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="pz-filter-group">
                <label htmlFor="district">District</label>
                <select
                  id="district"
                  name="district"
                  value={filters.district}
                  onChange={handleFilterChange}
                >
                  <option value="">All Districts</option>
                  <option value="Lilongwe">Lilongwe</option>
                  <option value="Blantyre">Blantyre</option>
                  <option value="Zomba">Zomba</option>
                  <option value="Mzuzu">Mzuzu</option>
                  <option value="Kasungu">Kasungu</option>
                  <option value="Mangochi">Mangochi</option>
                  <option value="Salima">Salima</option>
                  <option value="Mulanje">Mulanje</option>
                </select>
              </div>

              <div className="pz-filter-group">
                <label htmlFor="type">Property Type</label>
                <select
                  id="type"
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  <option value="">All Types</option>
                  <option value="House">House</option>
                  <option value="Flat/Apartment">Flat/Apartment</option>
                  <option value="Single Room">Single Room</option>
                  <option value="Self-Contained">Self-Contained</option>
                  <option value="Plot of Land">Plot of Land</option>
                  <option value="Commercial Space">Commercial Space</option>
                </select>
              </div>

              <div className="pz-filter-group">
                <label htmlFor="minPrice">Min Price (MWK)</label>
                <input
                  id="minPrice"
                  type="number"
                  name="minPrice"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="pz-filter-group">
                <label htmlFor="maxPrice">Max Price (MWK)</label>
                <input
                  id="maxPrice"
                  type="number"
                  name="maxPrice"
                  placeholder="10000000"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="pz-filter-actions">
              <button className="pz-btn-search" onClick={() => fetchProperties(1)}>
                <i className="fa fa-search"></i> Search
              </button>
              <button className="pz-btn-reset" onClick={handleReset}>
                <i className="fa fa-refresh"></i> Clear All
              </button>
            </div>
          </div>

          {/* RESULTS INFO */}
          {!loading && properties.length > 0 && (
            <div className="pz-results-card">
              <p className="pz-results-count">
                <i className="fa fa-home" style={{ marginRight: '0.5rem', color: 'var(--teal)' }}></i>
                Showing {properties.length} of {pagination.total} properties
              </p>
              <p className="pz-results-page">
                <i className="fa fa-file" style={{ marginRight: '0.5rem', color: 'var(--mid)' }}></i>
                Page {pagination.page} of {pagination.totalPages}
              </p>
            </div>
          )}

          {/* LOADING STATE */}
          {loading && (
            <div className="pz-loading">
              <div className="pz-spinner"></div>
              <p>Loading properties...</p>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && properties.length === 0 && (
            <div className="pz-empty">
              <div className="pz-empty-icon">🏠</div>
              <h3>No properties found</h3>
              <p>Try adjusting your filters or search criteria</p>
              <button className="pz-empty-btn" onClick={handleReset}>
                <i className="fa fa-refresh" style={{ marginRight: '0.5rem' }}></i>
                Clear All Filters
              </button>
            </div>
          )}

          {/* PROPERTY GRID */}
          {!loading && properties.length > 0 && (
            <div className="pz-property-grid">
              {properties.map((property) => (
                <div key={property._id} className="pz-property-card">
                  <div className="pz-property-img-wrap">
                    {property.images && property.images.length > 0 ? (
                      <img src={property.images[0]} alt={property.title} />
                    ) : (
                      <div className="pz-property-no-img">
                        <i className="fa fa-home"></i>
                      </div>
                    )}
                    <div className="pz-property-badges">
                      <span className={`pz-property-badge ${(property.listingType || '').toLowerCase().includes('sale') ? 'sale' : 'rent'}`}>
                        {(property.listingType || '').toLowerCase().includes('sale') ? 'For Sale' : 'For Rent'}
                      </span>
                      {property.type && <span className="pz-property-badge type">{property.type}</span>}
                    </div>
                  </div>

                  <div className="pz-property-body">
                    <div className="pz-property-name">{property.title || property.name}</div>
                    <div className="pz-property-location">
                      <i className="fa fa-map-marker-alt"></i>
                      {property.district || 'Malawi'}
                    </div>
                    <div className="pz-property-price">
                      MWK {Number(property.price || 0).toLocaleString()}
                      {!(property.listingType || '').toLowerCase().includes('sale') && '/month'}
                    </div>
                    <div className="pz-property-meta">
                      {property.bedrooms > 0 && (
                        <span className="pz-property-meta-item">
                          <i className="fa fa-bed"></i> {property.bedrooms}
                        </span>
                      )}
                      {property.bathrooms > 0 && (
                        <span className="pz-property-meta-item">
                          <i className="fa fa-bath"></i> {property.bathrooms}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pz-property-actions">
                    {property.whatsapp && (
                      <a
                        className="pz-btn-whatsapp"
                        href={`https://wa.me/${property.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-whatsapp"></i> WhatsApp
                      </a>
                    )}
                    {property.phone && (
                      <a className="pz-btn-call" href={`tel:${property.phone}`}>
                        <i className="fa fa-phone"></i> Call
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {!loading && pagination.totalPages > 1 && (
            <div className="pz-pagination">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <i className="fa fa-chevron-left"></i>
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={pagination.page === page ? 'active' : ''}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                <i className="fa fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}