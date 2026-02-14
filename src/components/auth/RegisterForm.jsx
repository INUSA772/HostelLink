import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaIdCard } from 'react-icons/fa';
import { handleApiError } from '../../utils/helpers';
import '../../styles/global.css';

const RegisterForm = () => {
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
  const [loading, setLoading] = useState(false);
  const { register, logout } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    // Validate student ID if role is student
    if (formData.role === 'student' && !formData.studentId) {
      toast.error('Student ID is required for students!');
      return;
    }

    setLoading(true);

    try {
  const { confirmPassword, ...dataToSend } = formData;
  await register(dataToSend);
  
  // Logout the user (clear token)
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
      maxWidth: '550px',
      margin: '0 auto',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        padding: '2rem'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}>
            <Input
              label="First Name"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
              icon={<FaUser />}
              required
            />

            <Input
              label="Last Name"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
              icon={<FaUser />}
              required
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            icon={<FaEnvelope />}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            icon={<FaPhone />}
            required
          />

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

          {formData.role === 'student' && (
            <Input
              label="Student ID"
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="Enter your student ID"
              icon={<FaIdCard />}
              required
            />
          )}

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            icon={<FaLock />}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            icon={<FaLock />}
            required
          />

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              fontSize: 'var(--font-size-sm)',
              cursor: 'pointer'
            }}>
              <input type="checkbox" required style={{ marginTop: '3px' }} />
              <span>
                I agree to the{' '}
                <Link to="/terms" style={{ color: 'var(--primary-color)' }}>
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" style={{ color: 'var(--primary-color)' }}>
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
          >
            Create Account
          </Button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          color: 'var(--gray)'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-color)' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;