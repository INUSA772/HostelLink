import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { FaHome } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div>
        <h1 style={{ 
          fontSize: '6rem',
          color: 'var(--primary-color)',
          marginBottom: '1rem'
        }}>
          404
        </h1>
        
        <h2 style={{ marginBottom: '1rem' }}>
          Page Not Found
        </h2>
        
        <p style={{ 
          color: 'var(--gray)',
          marginBottom: '2rem',
          maxWidth: '400px'
        }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/">
          <Button variant="primary">
            <FaHome style={{ marginRight: '0.5rem' }} />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;