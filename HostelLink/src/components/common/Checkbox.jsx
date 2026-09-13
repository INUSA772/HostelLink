import React from 'react';
import '../../styles/global.css';

const Checkbox = ({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="form-group">
      <label 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: disabled ? 'not-allowed' : 'pointer',
          gap: '8px'
        }}
      >
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={className}
          style={{ 
            width: '18px', 
            height: '18px',
            cursor: disabled ? 'not-allowed' : 'pointer'
          }}
          {...props}
        />
        <span style={{ fontSize: 'var(--font-size-sm)' }}>{label}</span>
      </label>
      
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default Checkbox;