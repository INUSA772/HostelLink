import React, { useEffect } from 'react';
import { useHostel } from '../context/HostelContext';
import HostelList from '../components/hostel/HostelList';
import HostelFilters from '../components/hostel/HostelFilters';
import Pagination from '../components/common/Pagination';
import '../styles/global.css';

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
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--gray-lighter)',
      paddingTop: '2rem',
      paddingBottom: '4rem'
    }}>
      <div className="container" style={{ maxWidth: '1400px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: 'var(--font-size-4xl)',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Find Your Perfect Hostel
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: 'var(--font-size-lg)' }}>
            Browse {pagination.total} available hostels near MUBAS
          </p>
        </div>

        {/* Filters */}
        <HostelFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* Results Count */}
        {!loading && hostels.length > 0 && (
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--white)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <p style={{ margin: 0, color: 'var(--dark)', fontWeight: '500' }}>
              Showing {hostels.length} of {pagination.total} hostels
            </p>
            <p style={{ margin: 0, color: 'var(--gray)', fontSize: 'var(--font-size-sm)' }}>
              Page {pagination.page} of {pagination.totalPages}
            </p>
          </div>
        )}

        {/* Hostel List */}
        <HostelList hostels={hostels} loading={loading} />

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
  );
};

export default HostelListPage;