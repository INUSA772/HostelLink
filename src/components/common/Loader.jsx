import React from 'react';
import '../../styles/global.css';

const Loader = ({ size = 'md', fullScreen = false, text = '' }) => {
  const sizes = {
    sm: '20px',
    md: '40px',
    lg: '60px'
  };

  const loaderStyle = {
    display: 'inline-block',
    width: sizes[size],
    height: sizes[size],
    border: '4px solid var(--gray-light)',
    borderTopColor: 'var(--primary-color)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  if (fullScreen) {
    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 9999
        }}
      >
        <div style={loaderStyle}></div>
        {text && <p style={{ marginTop: 'var(--spacing-md)', color: 'var(--gray)' }}>{text}</p>}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--spacing-lg)' }}>
      <div style={loaderStyle}></div>
      {text && <p style={{ marginTop: 'var(--spacing-md)', color: 'var(--gray)' }}>{text}</p>}
    </div>
  );
};

export default Loader;