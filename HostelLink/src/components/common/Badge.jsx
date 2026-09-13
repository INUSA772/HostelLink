import React from 'react';
import '../../styles/global.css';

const Badge = ({ 
  children, 
  variant = 'info', // success, error, warning, info
  className = '' 
}) => {
  const variantClasses = {
    success: 'badge-success',
    error: 'badge-error',
    warning: 'badge-warning',
    info: 'badge-info'
  };

  return (
    <span className={`badge ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;