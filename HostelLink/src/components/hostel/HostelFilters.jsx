import React, { useState } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { HOSTEL_TYPES, GENDER_OPTIONS, AMENITIES, SORT_OPTIONS } from '../../utils/constants';
import '../../styles/global.css';

const HostelFilters = ({ filters, onFilterChange, onReset }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const handleAmenityToggle = (amenity) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    
    onFilterChange({ amenities: newAmenities });
  };

  const handleReset = () => {
    onReset();
    setShowAdvanced(false);
  };

  return (
    <div style={{
      backgroundColor: 'var(--white)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-md)',
      marginBottom: '2rem'
    }}>
      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <FaSearch style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--gray)',
          zIndex: 1
        }} />
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search by name, location, or description..."
          className="form-control"
          style={{
            paddingLeft: '3rem',
            fontSize: 'var(--font-size-base)',
            height: '50px'
          }}
        />
      </div>

      {/* Quick Filters Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <Select
          name="type"
          value={filters.type}
          onChange={handleChange}
          placeholder="Room Type"
          options={HOSTEL_TYPES.map(type => ({ value: type, label: type }))}
        />

        <Select
          name="gender"
          value={filters.gender}
          onChange={handleChange}
          placeholder="Gender Preference"
          options={GENDER_OPTIONS}
        />

        <Select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          options={SORT_OPTIONS}
        />
      </div>

      {/* Advanced Filters Toggle */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{ flex: 1 }}
        >
          <FaFilter style={{ marginRight: '0.5rem' }} />
          {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
        </Button>

        <Button
          variant="secondary"
          onClick={handleReset}
        >
          <FaTimes style={{ marginRight: '0.5rem' }} />
          Reset
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div style={{
          backgroundColor: 'var(--gray-lighter)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          marginTop: '1rem'
        }}>
          {/* Price Range */}
          <h4 style={{ marginBottom: '1rem', fontSize: 'var(--font-size-base)' }}>
            Price Range (MWK)
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <Input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="Min Price"
            />
            <Input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="Max Price"
            />
          </div>

          {/* Amenities */}
          <h4 style={{ marginBottom: '1rem', fontSize: 'var(--font-size-base)' }}>
            Amenities
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '0.75rem'
          }}>
            {AMENITIES.map((amenity) => {
              const isSelected = (filters.amenities || []).includes(amenity);
              return (
                <button
                  key={amenity}
                  onClick={() => handleAmenityToggle(amenity)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--primary-color)' : '2px solid var(--gray-light)',
                    backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--white)',
                    color: isSelected ? 'var(--white)' : 'var(--dark)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-sm)',
                    transition: 'all 0.2s ease',
                    fontWeight: isSelected ? '600' : '400'
                  }}
                >
                  {amenity}
                </button>
              );
            })}
          </div>

          {/* Selected Amenities Count */}
          {filters.amenities && filters.amenities.length > 0 && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: 'var(--primary-color)',
              color: 'var(--white)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              fontSize: 'var(--font-size-sm)'
            }}>
              {filters.amenities.length} amenity(ies) selected
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HostelFilters;