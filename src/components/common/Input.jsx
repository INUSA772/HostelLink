import React from 'react';
import '../../styles/global.css';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  disabled = false,
  required = false,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span style={{ color: 'var(--error)' }}>*</span>}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--gray)'
          }}>
            {icon}
          </span>
        )}
        
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`form-control ${icon ? 'pl-10' : ''} ${error ? 'error' : ''} ${className}`}
          style={icon ? { paddingLeft: '40px' } : {}}
          {...props}
        />
      </div>
      
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default Input;