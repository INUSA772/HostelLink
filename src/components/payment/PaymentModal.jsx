import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import paymentService from '../../services/paymentService';
import { handleApiError } from '../../utils/helpers';
import './PaymentStyles.css';

/**
 * PaymentModal Component
 * Handles payment initiation and displays payment breakdown
 */
const PaymentModal = ({ booking, hostel, isOpen, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentBreakdown, setPaymentBreakdown] = useState(null);

  useEffect(() => {
    if (hostel?.price) {
      const breakdown = paymentService.calculateTotal(hostel.price);
      setPaymentBreakdown(breakdown);
    }
  }, [hostel]);

  if (!isOpen || !booking || !hostel || !paymentBreakdown) return null;

  const handlePaymentInitiation = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate phone number for mobile money
      if (paymentMethod === 'mobile_money' && !phoneNumber) {
        toast.error('Phone number is required for mobile money payment');
        setLoading(false);
        return;
      }

      // Initiate payment
      const response = await paymentService.initiatePayment(
        booking._id,
        paymentMethod,
        phoneNumber
      );

      if (!response.success) {
        toast.error(response.message || 'Failed to initiate payment');
        setLoading(false);
        return;
      }

      // Store transaction ID for later verification
      sessionStorage.setItem('transactionId', response.data.transactionId);
      
      toast.success('Redirecting to Paychange...');
      
      // Redirect to Paychange payment URL
      setTimeout(() => {
        window.location.href = response.data.paymentUrl;
      }, 1500);

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(handleApiError(error) || 'Failed to process payment');
      setLoading(false);
    }
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        {/* Header */}
        <div className="payment-header">
          <h2>Complete Your Booking</h2>
          <button 
            className="close-btn" 
            onClick={onClose}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {/* Booking Summary */}
        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <div className="summary-item">
            <span>Hostel:</span>
            <strong>{hostel.name}</strong>
          </div>
          <div className="summary-item">
            <span>Room Type:</span>
            <strong>{hostel.type}</strong>
          </div>
          <div className="summary-item">
            <span>Check-in Date:</span>
            <strong>{new Date(booking.checkInDate).toLocaleDateString()}</strong>
          </div>
          <div className="summary-item">
            <span>Duration:</span>
            <strong>{booking.duration} months</strong>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="payment-breakdown">
          <h3>Payment Breakdown</h3>
          <div className="breakdown-item">
            <span>Room Rent:</span>
            <strong>{paymentBreakdown.breakdown.roomRent}</strong>
          </div>
          <div className="breakdown-item alert-info">
            <span>Platform Fee:</span>
            <strong>{paymentBreakdown.breakdown.platformFee}</strong>
          </div>
          <div className="breakdown-divider"></div>
          <div className="breakdown-total">
            <span>Total Amount:</span>
            <strong>{paymentBreakdown.breakdown.total}</strong>
          </div>
          <p className="fee-note">
            ℹ️ The 2000 MWK platform fee ensures secure, in-system transactions and protects both students and hostel owners from fraud.
          </p>
        </div>

        {/* Payment Method Selection */}
        <form onSubmit={handlePaymentInitiation}>
          <div className="payment-method">
            <h3>Select Payment Method</h3>
            
            {/* Mobile Money */}
            <label className="method-option">
              <input
                type="radio"
                name="paymentMethod"
                value="mobile_money"
                checked={paymentMethod === 'mobile_money'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                disabled={loading}
              />
              <div className="method-content">
                <span className="method-name">📱 Mobile Money</span>
                <span className="method-description">
                  TNM Mpamba, Airtel Money, Zamtel Zap
                </span>
              </div>
            </label>

            {/* Mobile Money - Phone Input */}
            {paymentMethod === 'mobile_money' && (
              <div className="phone-input-container">
                <input
                  type="tel"
                  placeholder="Enter mobile money number (e.g., 0888123456)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={loading}
                  pattern="[0-9]{10}"
                  required
                />
              </div>
            )}

            {/* Bank Transfer */}
            <label className="method-option">
              <input
                type="radio"
                name="paymentMethod"
                value="bank_transfer"
                checked={paymentMethod === 'bank_transfer'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                disabled={loading}
              />
              <div className="method-content">
                <span className="method-name">🏦 Bank Transfer</span>
                <span className="method-description">
                  Direct bank transfer via Paychange
                </span>
              </div>
            </label>

            {/* Card Payment */}
            <label className="method-option">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                disabled={loading}
              />
              <div className="method-content">
                <span className="method-name">💳 Card Payment</span>
                <span className="method-description">
                  Visa, Mastercard, Local cards
                </span>
              </div>
            </label>
          </div>

          {/* Security Notice */}
          <div className="security-notice">
            <span>🔒</span>
            <p>
              Your payment is secured by <strong>Paychange</strong>, 
              a trusted payment gateway in Malawi. All transactions are encrypted and verified.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Processing...
                </>
              ) : (
                `Pay ${paymentBreakdown.breakdown.total}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;