import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../../styles/global.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      margin: '2rem 0'
    }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '0.5rem 0.75rem',
          border: '1px solid var(--gray-light)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--white)',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.5 : 1
        }}
      >
        <FaChevronLeft />
      </button>

      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={index} style={{ padding: '0.5rem' }}>...</span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid var(--gray-light)',
              borderRadius: 'var(--radius-md)',
              background: page === currentPage ? 'var(--primary-color)' : 'var(--white)',
              color: page === currentPage ? 'var(--white)' : 'var(--dark)',
              cursor: 'pointer',
              minWidth: '40px'
            }}
          >
            {page}
          </button>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: '0.5rem 0.75rem',
          border: '1px solid var(--gray-light)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--white)',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.5 : 1
        }}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;