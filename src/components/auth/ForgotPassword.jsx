import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Input from '../common/Input';
import Button from '../common/Button';
import { FaEnvelope } from 'react-icons/fa';
import authService from '../../services/authService';
import { handleApiError } from '../../utils/helpers';
import '../../styles/global.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setEmailSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div style={{
        maxWidth: '450px',
        margin: '4rem auto',
        padding: '2rem'
      }}>
        <div style={{
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--success)',
            color: 'var(--white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '2rem'
          }}>
            ✓
          </div>
          
          <h2 style={{ marginBottom: '1rem' }}>Check Your Email</h2>
          
          <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>
            We've sent a password reset link to <strong>{email}</strong>
          </p>

          <Link to="/login">
            <Button variant="primary" fullWidth>
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '450px',
      margin: '4rem auto',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        padding: '2rem'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Forgot Password?
        </h2>
        
        <p style={{
          textAlign: 'center',
          color: 'var(--gray)',
          marginBottom: '2rem'
        }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            icon={<FaEnvelope />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
          >
            Send Reset Link
          </Button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          color: 'var(--gray)'
        }}>
          Remember your password?{' '}
          <Link to="/login" style={{ color: 'var(--primary-color)' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;