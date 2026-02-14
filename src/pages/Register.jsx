import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';

const Register = () => {
  return (
    <div style={{ 
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'var(--gray-lighter)',
      padding: '2rem 0'
    }}>
      <RegisterForm />
    </div>
  );
};

export default Register;