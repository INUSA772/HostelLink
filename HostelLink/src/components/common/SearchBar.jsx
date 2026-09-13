import React from 'react';
import { FaSearch } from 'react-icons/fa';
import '../../styles/global.css';

const SearchBar = ({ 
  value, 
  onChange, 
  onSubmit,
  placeholder = 'Search...', 
  className = '' 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
      <FaSearch 
        style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--gray)',
          pointerEvents: 'none'
        }}
      />
      
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-control ${className}`}
        style={{
          paddingLeft: '3rem',
          width: '100%'
        }}
      />
    </form>
  );
};

export default SearchBar;