import React from 'react';
import '../../styles/global.css';

const Card = ({ 
  children, 
  header, 
  footer,
  hoverable = false,
  className = '',
  onClick,
  style = {}
}) => {
  const cardClasses = `card ${hoverable ? 'card-hoverable' : ''} ${className}`;

  return (
    <div 
      className={cardClasses} 
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

export default Card;