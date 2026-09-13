import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes, FaTimesCircle } from 'react-icons/fa';
import '../../styles/global.css';

const Alert = ({ 
  type = 'info', // success, error, warning, info
  message, 
  onClose,
  dismissible = false 
}) => {
  const icons = {
    success: <FaCheckCircle size={20} />,
    error: <FaTimesCircle size={20} />,
    warning: <FaExclamationTriangle size={20} />,
    info: <FaInfoCircle size={20} />
  };

  const alertClasses = {
    success: 'alert-success',
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'alert-info'
  };

  return (
    <div className={`alert ${alertClasses[type]}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {icons[type]}
        <span style={{ flex: 1 }}>{message}</span>
        {dismissible && onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FaTimes size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;