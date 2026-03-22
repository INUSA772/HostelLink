import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { handleApiError } from '../../utils/helpers';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaIdCard } from 'react-icons/fa';
import '../../styles/global.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    studentId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      toast.error('Please enter your full name');
      return false;
    }

    if (!formData.email) {
      toast.error('Please enter your email');
      return false;
    }

    if (!formData.phone) {
      toast.error('Please enter your phone number');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (formData.role === 'student' && !formData.studentId) {
      toast.error('Please enter your student ID');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = formData;
      
      await register(dataToSend);
      
      logout();
      
      toast.success('Registration successful! Please login to continue.');
      navigate('/login');
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: 'var(--gray-lighter)'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '500px',
        padding: '2rem'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Create Account
        </h2>
        
        <p style={{
          textAlign: 'center',
          color: 'var(--gray)',
          fontSize: 'var(--font-size-sm)',
          marginBottom: '2rem'
        }}>
          Join MUBAS Hostel Finder today
        </p>

        <form onSubmit={handleSubmit}>
          {/* Name Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="First Name"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              icon={<FaUser />}
              required
            />

            <Input
              label="Last Name"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              icon={<FaUser />}
              required
            />
          </div>

          {/* Email & Phone */}
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            icon={<FaEnvelope />}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="0888123456"
            icon={<FaPhone />}
            required
          />

          {/* Role Selection */}
          <Select
            label="I am a"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={[
              { value: 'student', label: 'Student' },
              { value: 'owner', label: 'Hostel Owner' }
            ]}
            required
          />

          {/* Student ID (only for students) */}
          {formData.role === 'student' && (
            <Input
              label="Student ID"
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="e.g., MUBAS/2024/001"
              icon={<FaIdCard />}
              required
            />
          )}

          {/* Password Fields */}
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            icon={<FaLock />}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            icon={<FaLock />}
            required
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            style={{ marginTop: '1.5rem' }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          {/* Login Link */}
          <p style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            color: 'var(--gray)',
            fontSize: 'var(--font-size-sm)'
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{
              color: 'var(--primary-color)',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;