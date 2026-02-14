import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import '../../styles/global.css';

const EmptyState = ({ 
  icon, 
  title, 
  message, 
  actionText, 
  actionLink,
  onAction 
}) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '4rem 2rem',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      {icon && (
        <div style={{
          fontSize: '4rem',
          marginBottom: '1.5rem',
          color: 'var(--gray-light)'
        }}>
          {icon}
        </div>
      )}
      
      <h3 style={{ 
        marginBottom: '1rem',
        color: 'var(--dark)'
      }}>
        {title}
      </h3>
      
      <p style={{ 
        color: 'var(--gray)',
        marginBottom: '2rem',
        lineHeight: '1.6'
      }}>
        {message}
      </p>
      
      {actionText && (actionLink || onAction) && (
        actionLink ? (
          <Link to={actionLink}>
            <Button variant="primary">
              {actionText}
            </Button>
          </Link>
        ) : (
          <Button variant="primary" onClick={onAction}>
            {actionText}
          </Button>
        )
      )}
    </div>
  );
};

export default EmptyState;