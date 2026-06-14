// frontend/src/pages/PropertiesListing.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ════════════════════════════════════════════════════════════════
// STYLES — Navy / Amber theme (matches Home.jsx, PropertyDetailPage,
// CreateProperty.jsx, RegisterForm.jsx)
// ════════════════════════════════════════════════════════════════

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Nunito+Sans:wght@400;600;700;800;900&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --navy:        #0f1923;
    --navy-mid:    #1a2e3d;
    --amber:       #f5a623;
    --amber-light: #fef3d8;
    --amber-dark:  #d4870a;
    --white:       #ffffff;
    --off-white:   #f7f8fa;
    --light-gray:  #f0f2f5;
    --border:      #e8eaed;
    --mid:         #6b7280;
    --dark:        #111827;
    --wa-green:    #25D366;
    --wa-green-dark:#1da851;
    --success:     #10b981;
    --radius:      14px;
    --radius-lg:   16px;
    --font:        'Plus Jakarta Sans', 'Nunito Sans', sans-serif;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    font-family: var(--font);
    color: var(--dark);
  }
  a { text-decoration: none; color: inherit; }
  button { font-family: inherit; cursor: pointer; }
  img { max-width: 100%; }

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
    padding: 0 1.5rem;
    background: #fff;
    border-bottom: 1px solid #eaeaea;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
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
    border-radius: 9px;
    overflow: hidden;
    flex-shrink: 0;
    border: 2px solid var(--amber);
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--navy);
    font-weight: 800;
    font-size: 15px;
  }

  .pz-navbar-brand strong {
    display: block;
    color: var(--navy);
    font-size: 0.95rem;
    font-weight: 800;
    letter-spacing: -.2px;
  }

  .pz-navbar-brand span {
    color: var(--mid);
    font-size: 0.65rem;
    font-weight: 500;
  }

  .pz-navbar-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .pz-navbar-link {
    color: var(--mid);
    font-size: 0.82rem;
    font-weight: 700;
    background: transparent;
    border: 1.5px solid var(--border);
    padding: 0.42rem 0.9rem;
    border-radius: 8px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.18s;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .pz-navbar-link:hover {
    border-color: var(--navy);
    color: var(--navy);
  }

  .pz-navbar-login {
    color: var(--navy);
    font-size: 0.82rem;
    font-weight: 700;
    background: transparent;
    border: 1.5px solid var(--border);
    padding: 0.42rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.18s;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .pz-navbar-login:hover {
    border-color: var(--navy);
    background: var(--off-white);
  }

  .pz-navbar-signup {
    color: #fff;
    font-size: 0.82rem;
    font-weight: 800;
    background: var(--navy);
    border: none;
    padding: 0.42rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.18s;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .pz-navbar-signup:hover {
    background: var(--navy-mid);
  }

  /* ══════════════════════════════════════
     MAIN CONTENT
  ══════════════════════════════════════ */
  .pz-main-content {
    position: relative;
    min-height: calc(100vh - 60px);
    background: var(--off-white);
    padding: 1.75rem 1rem 4rem;
  }

  .pz-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .pz-header {
    margin-bottom: 1.5rem;
  }

  .pz-header-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--amber-light); border-radius: 6px;
    padding: .35rem .9rem;
    font-size: .7rem; font-weight: 800; color: var(--amber-dark);
    text-transform: uppercase; letter-spacing: 1.5px;
    margin-bottom: .65rem;
  }

  .pz-header h1 {
    font-size: clamp(1.6rem, 4vw, 2.3rem);
    font-weight: 900;
    margin-bottom: 0.3rem;
    color: var(--navy);
    letter-spacing: -.5px;
    line-height: 1.2;
  }

  .pz-header h1 em { font-style: normal; color: var(--amber); }

  .pz-header p {
    color: var(--mid);
    font-size: 0.92rem;
    font-weight: 500;
  }

  /* ══════════════════════════════════════
     FILTERS & SEARCH
  ══════════════════════════════════════ */
  .pz-filters-card {
    padding: 1.4rem;
    background: var(--white);
    border-radius: var(--radius);
    margin-bottom: 1.25rem;
    box-shadow: 0 4px 18px rgba(15,25,35,0.06);
    border: 1.5px solid var(--border);
  }

  .pz-filters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
  }

  .pz-filter-group label {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.68rem;
    font-weight: 800;
    color: var(--mid);
    margin-bottom: 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  .pz-filter-group label i { color: var(--amber-dark); font-size: .7rem; }

  .pz-filter-group input,
  .pz-filter-group select {
    width: 100%;
    padding: 0.65rem 0.9rem;
    border: 1.5px solid var(--border);
    border-radius: 9px;
    font-size: 0.86rem;
    background: var(--off-white);
    color: var(--dark);
    outline: none;
    font-family: inherit;
    transition: all 0.18s;
  }

  .pz-filter-group input::placeholder { color: #c4ccd4; }

  .pz-filter-group input:focus,
  .pz-filter-group select:focus {
    border-color: var(--amber);
    background: #fff;
    box-shadow: 0 0 0 3px rgba(245,166,35,.12);
  }

  .pz-filter-group select { appearance: none; cursor: pointer; }

  /* Price range — paired inputs */
  .pz-price-range {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 0.4rem;
    align-items: center;
  }
  .pz-price-range span { color: var(--mid); font-size: .8rem; font-weight: 700; text-align: center; }

  /* Bedrooms — pill selector */
  .pz-bed-pills {
    display: flex; gap: .4rem; flex-wrap: wrap;
  }
  .pz-bed-pill {
    flex: 1; min-width: 42px;
    padding: 0.6rem 0.5rem;
    border: 1.5px solid var(--border);
    border-radius: 9px;
    background: var(--off-white);
    color: var(--mid);
    font-size: 0.85rem; font-weight: 800;
    cursor: pointer; transition: all .18s;
    font-family: inherit;
    text-align: center;
  }
  .pz-bed-pill:hover { border-color: var(--amber); color: var(--navy); }
  .pz-bed-pill.active {
    background: var(--navy); border-color: var(--navy); color: #fff;
  }

  .pz-filter-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.1rem;
    flex-wrap: wrap;
  }

  .pz-btn-search {
    background: var(--navy);
    color: white;
    border: none;
    padding: 0.7rem 1.5rem;
    border-radius: 9px;
    font-size: 0.88rem;
    font-weight: 800;
    cursor: pointer;
    transition: background 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: inherit;
  }

  .pz-btn-search:hover {
    background: var(--navy-mid);
  }

  .pz-btn-reset {
    background: var(--off-white);
    color: var(--mid);
    border: 1.5px solid var(--border);
    padding: 0.7rem 1.5rem;
    border-radius: 9px;
    font-size: 0.88rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
  }

  .pz-btn-reset:hover {
    border-color: var(--navy);
    color: var(--navy);
  }

  .pz-active-filters {
    display: flex; gap: .5rem; flex-wrap: wrap;
    margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);
  }
  .pz-filter-chip {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--amber-light); color: var(--amber-dark);
    font-size: .76rem; font-weight: 700;
    padding: .35rem .75rem; border-radius: 20px;
    border: 1px solid #f0d89a;
  }
  .pz-filter-chip button {
    background: none; border: none; color: var(--amber-dark);
    cursor: pointer; font-size: .7rem; display: flex; align-items: center;
    padding: 0; line-height: 1;
  }

  /* ══════════════════════════════════════
     RESULTS & PAGINATION
  ══════════════════════════════════════ */
  .pz-results-card {
    padding: 0.85rem 1.25rem;
    background: var(--white);
    border-radius: var(--radius);
    margin-bottom: 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 10px rgba(15,25,35,0.05);
    border: 1.5px solid var(--border);
    flex-wrap: wrap;
    gap: .5rem;
  }

  .pz-results-count {
    margin: 0;
    color: var(--navy);
    font-weight: 700;
    font-size: 0.88rem;
    display: flex; align-items: center; gap: .5rem;
  }

  .pz-results-page {
    margin: 0;
    color: var(--mid);
    font-size: 0.8rem;
    font-weight: 600;
    display: flex; align-items: center; gap: .5rem;
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
    box-shadow: 0 4px 20px rgba(15,25,35,0.06);
    border: 1.5px solid var(--border);
  }

  .pz-spinner {
    width: 38px;
    height: 38px;
    border: 3px solid var(--amber-light);
    border-top-color: var(--amber);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 1rem;
  }

  .pz-loading p {
    color: var(--mid);
    font-size: 0.9rem;
    font-weight: 600;
  }

  .pz-empty {
    text-align: center;
    padding: 4rem 2rem;
    background: var(--white);
    border-radius: var(--radius);
    box-shadow: 0 4px 20px rgba(15,25,35,0.06);
    border: 1.5px solid var(--border);
  }

  .pz-empty-icon {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    opacity: 0.4;
  }

  .pz-empty h3 {
    color: var(--navy);
    font-size: 1.2rem;
    font-weight: 900;
    margin-bottom: 0.4rem;
  }

  .pz-empty p {
    color: var(--mid);
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    font-weight: 500;
  }

  .pz-empty-btn {
    background: var(--navy);
    color: white;
    border: none;
    padding: 0.7rem 1.8rem;
    border-radius: 9px;
    font-weight: 800;
    font-size: 0.88rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .pz-empty-btn:hover {
    background: var(--navy-mid);
    transform: translateY(-1px);
  }

  /* ══════════════════════════════════════
     PROPERTY GRID & CARDS
  ══════════════════════════════════════ */
  .pz-property-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.1rem;
    margin-bottom: 2rem;
  }

  .pz-property-card {
    border: 1.5px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: var(--white);
    transition: all 0.25s;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    cursor: pointer;
  }

  .pz-property-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 32px rgba(15,25,35,0.12);
    border-color: var(--amber);
  }

  .pz-property-img-wrap {
    position: relative;
    height: 170px;
    overflow: hidden;
    background: var(--light-gray);
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
    color: var(--mid);
    opacity: 0.3;
  }

  .pz-property-badges {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    z-index: 1;
  }

  .pz-property-badge {
    font-size: 0.62rem;
    font-weight: 800;
    padding: 3px 9px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .pz-property-badge.rent {
    background: var(--navy);
    color: white;
  }

  .pz-property-badge.sale {
    background: var(--amber);
    color: var(--navy);
  }

  .pz-property-badge.type {
    background: rgba(255, 255, 255, 0.92);
    color: #374151;
  }

  /* Verified badge — matches Home.jsx / PropertyDetailPage */
  .pz-property-verified {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(5,150,105,.9);
    color: white;
    font-size: .62rem;
    font-weight: 800;
    padding: 3px 9px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 4px;
    backdrop-filter: blur(4px);
    z-index: 1;
    letter-spacing: .2px;
  }
  .pz-property-verified i { font-size: .58rem; }

  .pz-property-body {
    padding: 1rem;
    flex: 1;
  }

  .pz-property-name {
    font-size: 0.94rem;
    font-weight: 800;
    color: var(--navy);
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
    font-weight: 500;
  }

  .pz-property-location i {
    color: var(--amber-dark);
    font-size: 0.72rem;
  }

  .pz-property-price {
    font-size: 1.02rem;
    font-weight: 800;
    color: var(--navy);
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
    font-weight: 600;
  }

  .pz-property-meta-item i {
    color: var(--amber-dark);
  }

  .pz-property-actions {
    padding: 0.7rem 1rem;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 0.5rem;
  }

  .pz-btn-whatsapp {
    flex: 1;
    background: var(--wa-green);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.55rem 0.5rem;
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
    background: var(--wa-green-dark);
  }

  .pz-btn-call {
    background: var(--wa-green);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.55rem 0.75rem;
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
    background: var(--wa-green-dark);
  }

  .pz-no-contact {
    flex: 1;
    font-size: .75rem; color: #9ca3af; padding: .5rem; text-align: center; font-weight: 600;
  }

  /* ══════════════════════════════════════
     PAGINATION
  ══════════════════════════════════════ */
  .pz-pagination {
    display: flex;
    justify-content: center;
    gap: 0.4rem;
    align-items: center;
    margin: 2rem 0;
    flex-wrap: wrap;
  }

  .pz-pagination button {
    background: var(--white);
    color: var(--navy);
    border: 1.5px solid var(--border);
    padding: 0.5rem 0.8rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 700;
    font-size: 0.85rem;
    transition: all 0.2s;
    font-family: inherit;
    min-width: 38px;
  }

  .pz-pagination button:hover:not(:disabled) {
    border-color: var(--amber);
    color: var(--amber-dark);
  }

  .pz-pagination button.active {
    background: var(--navy);
    color: white;
    border-color: var(--navy);
  }

  .pz-pagination button:disabled {
    opacity: 0.4;
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
      font-size: 1.7rem;
    }

    .pz-filters-grid {
      grid-template-columns: 1fr 1fr;
    }

    .pz-results-card {
      flex-direction: column;
      gap: 0.4rem;
      align-items: flex-start;
    }

    .pz-property-grid {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    }
  }

  @media (max-width: 480px) {
    .pz-navbar {
      padding: 0 0.85rem;
    }

    .pz-main-content {
      padding: 1rem 0.65rem 2rem;
    }

    .pz-header h1 {
      font-size: 1.4rem;
    }

    .pz-filters-grid {
      grid-template-columns: 1fr 1fr;
    }

    .pz-bed-pills { gap: .3rem; }

    .pz-property-grid {
      grid-template-columns: 1fr 1fr;
      gap: .7rem;
    }
  }
`;

// ════════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════════

const MALAWI_DISTRICTS = [
  'Lilongwe','Blantyre','Zomba','Mzuzu','Kasungu','Mangochi',
  'Dedza','Salima','Ntcheu','Balaka','Machinga','Chiradzulu',
  'Thyolo','Mulanje','Phalombe','Chikwawa','Nsanje','Neno',
  'Mwanza','Nkhata Bay','Rumphi','Karonga','Chitipa','Mzimba',
  'Dowa','Ntchisi','Mchinji','Likoma',
];

const PROPERTY_TYPES = [
  'House','Flat/Apartment','Single Room','Self-Contained',
  'Plot of Land','Commercial Space','Office Space','Warehouse',
];

const BEDROOM_OPTIONS = ['Any', '1', '2', '3', '4', '5+'];

const EMPTY_FILTERS = {
  search: '',
  type: '',
  minPrice: '',
  maxPrice: '',
  district: '',
  bedrooms: '',
  listingType: '',
};

function waLink(num) {
  if (!num) return null;
  const clean = num.toString().replace(/\D/g, '');
  const intl = clean.startsWith('0') ? '265' + clean.slice(1) : clean;
  return `https://wa.me/${intl}`;
}

// ════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════

export default function PropertiesListing() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(() => ({
    ...EMPTY_FILTERS,
    // Pick up ?district= or ?type= from links coming out of Home.jsx
    district: searchParams.get('district') || '',
    type: searchParams.get('type') || '',
  }));
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
        ...(filters.bedrooms && filters.bedrooms !== 'Any' && {
          bedrooms: filters.bedrooms === '5+' ? 5 : filters.bedrooms,
          ...(filters.bedrooms === '5+' && { bedroomsMode: 'min' }),
        }),
        ...(filters.listingType && { listingType: filters.listingType }),
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

  const handleBedroomSelect = (val) => {
    setFilters(prev => ({
      ...prev,
      bedrooms: prev.bedrooms === val ? '' : val,
    }));
  };

  const handleReset = () => {
    setFilters({ ...EMPTY_FILTERS });
  };

  const removeFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: '' }));
  };

  const handlePageChange = (page) => {
    fetchProperties(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build a friendly list of active filter chips
  const activeChips = [];
  if (filters.search)   activeChips.push({ key: 'search',   label: `"${filters.search}"` });
  if (filters.district) activeChips.push({ key: 'district', label: filters.district });
  if (filters.type)     activeChips.push({ key: 'type',     label: filters.type });
  if (filters.listingType) activeChips.push({ key: 'listingType', label: filters.listingType });
  if (filters.bedrooms && filters.bedrooms !== 'Any') {
    activeChips.push({ key: 'bedrooms', label: filters.bedrooms === '5+' ? '5+ bedrooms' : `${filters.bedrooms} bed${filters.bedrooms === '1' ? '' : 's'}` });
  }
  if (filters.minPrice || filters.maxPrice) {
    const lo = filters.minPrice ? `MWK ${Number(filters.minPrice).toLocaleString()}` : 'MWK 0';
    const hi = filters.maxPrice ? `MWK ${Number(filters.maxPrice).toLocaleString()}` : 'any';
    activeChips.push({ key: 'price', label: `${lo} – ${hi}` });
  }

  const removeChip = (key) => {
    if (key === 'price') {
      setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }));
    } else {
      removeFilter(key);
    }
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
            <div className="pz-header-eyebrow"><i className="fa fa-search"></i> Property Search</div>
            <h1>Find Your <em>Perfect Home</em></h1>
            <p>Browse verified properties across all 28 districts in Malawi</p>
          </div>

          {/* FILTERS */}
          <div className="pz-filters-card">
            <div className="pz-filters-grid">
              <div className="pz-filter-group">
                <label htmlFor="search"><i className="fa fa-search"></i> Search</label>
                <input
                  id="search"
                  type="text"
                  name="search"
                  placeholder="Property name or area..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="pz-filter-group">
                <label htmlFor="district"><i className="fa fa-map-marker-alt"></i> District</label>
                <select
                  id="district"
                  name="district"
                  value={filters.district}
                  onChange={handleFilterChange}
                >
                  <option value="">All Districts</option>
                  {MALAWI_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="pz-filter-group">
                <label htmlFor="type"><i className="fa fa-home"></i> Property Type</label>
                <select
                  id="type"
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  <option value="">All Types</option>
                  {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="pz-filter-group">
                <label htmlFor="listingType"><i className="fa fa-tag"></i> For Rent / Sale</label>
                <select
                  id="listingType"
                  name="listingType"
                  value={filters.listingType}
                  onChange={handleFilterChange}
                >
                  <option value="">Rent or Sale</option>
                  <option value="For Rent">For Rent</option>
                  <option value="For Sale">For Sale</option>
                </select>
              </div>

              <div className="pz-filter-group" style={{ gridColumn: 'span 2' }}>
                <label><i className="fa fa-money-bill-wave"></i> Price Range (MWK)</label>
                <div className="pz-price-range">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    min="0"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    min="0"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>

              <div className="pz-filter-group" style={{ gridColumn: 'span 2' }}>
                <label><i className="fa fa-bed"></i> Bedrooms</label>
                <div className="pz-bed-pills">
                  {BEDROOM_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      className={`pz-bed-pill${filters.bedrooms === opt ? ' active' : ''}`}
                      onClick={() => handleBedroomSelect(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
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

            {activeChips.length > 0 && (
              <div className="pz-active-filters">
                {activeChips.map(chip => (
                  <span key={chip.key} className="pz-filter-chip">
                    {chip.label}
                    <button onClick={() => removeChip(chip.key)} aria-label={`Remove ${chip.label} filter`}>
                      <i className="fa fa-times"></i>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* RESULTS INFO */}
          {!loading && properties.length > 0 && (
            <div className="pz-results-card">
              <p className="pz-results-count">
                <i className="fa fa-home" style={{ color: 'var(--amber-dark)' }}></i>
                Showing {properties.length} of {pagination.total} properties
              </p>
              <p className="pz-results-page">
                <i className="fa fa-file" style={{ color: 'var(--mid)' }}></i>
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
              {properties.map((property) => {
                const isVerified = property.verified || property.isVerified;
                const isForSale  = (property.listingType || '').toLowerCase().includes('sale');
                const wa         = waLink(property.whatsapp || property.phone);
                const call       = property.phone ? `tel:${property.phone}` : null;
                return (
                  <div
                    key={property._id}
                    className="pz-property-card"
                    onClick={() => navigate(`/properties/${property._id}`)}
                  >
                    <div className="pz-property-img-wrap">
                      {property.images && property.images.length > 0 ? (
                        <img src={property.images[0]} alt={property.title || property.name} />
                      ) : (
                        <div className="pz-property-no-img">
                          <i className="fa fa-home"></i>
                        </div>
                      )}
                      <div className="pz-property-badges">
                        <span className={`pz-property-badge ${isForSale ? 'sale' : 'rent'}`}>
                          {isForSale ? 'For Sale' : 'For Rent'}
                        </span>
                        {property.type && <span className="pz-property-badge type">{property.type}</span>}
                      </div>
                      {isVerified && (
                        <div className="pz-property-verified">
                          <i className="fa fa-check-circle"></i> ID Verified
                        </div>
                      )}
                    </div>

                    <div className="pz-property-body">
                      <div className="pz-property-name">{property.title || property.name}</div>
                      <div className="pz-property-location">
                        <i className="fa fa-map-marker-alt"></i>
                        {[property.address, property.district].filter(Boolean).join(', ') || 'Malawi'}
                      </div>
                      <div className="pz-property-price">
                        MWK {Number(property.price || 0).toLocaleString()}
                        {!isForSale && '/month'}
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

                    <div className="pz-property-actions" onClick={e => e.stopPropagation()}>
                      {wa && (
                        <a
                          className="pz-btn-whatsapp"
                          href={wa}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fab fa-whatsapp"></i> WhatsApp
                        </a>
                      )}
                      {call && (
                        <a className="pz-btn-call" href={call}>
                          <i className="fa fa-phone"></i> Call
                        </a>
                      )}
                      {!wa && !call && <span className="pz-no-contact">No contact info</span>}
                    </div>
                  </div>
                );
              })}
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