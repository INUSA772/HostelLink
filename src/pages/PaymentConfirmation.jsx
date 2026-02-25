// src/pages/PaymentConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import paymentService from '../services/paymentService';  
import { handleApiError } from '../utils/helpers';         
                        

/**
 * PaymentConfirmation Component
 * Verifies payment status after Paychange callback
 */
const PaymentConfirmation = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!transactionId) {
          setError('Transaction ID not found');
          setLoading(false);
          return;
        }

        // Verify payment status
        const response = await paymentService.verifyPayment(transactionId);

        if (!response.success) {
          setError(response.message || 'Payment verification failed');
          setLoading(false);
          return;
        }

        setTransaction(response.transaction);
        
        if (response.transaction.status === 'completed') {
          toast.success('Payment successful! Your booking is confirmed.');
        } else if (response.transaction.status === 'failed') {
          setError('Payment failed. Please try again.');
          toast.error('Payment failed');
        } else {
          setError('Payment status unknown. Please contact support.');
          toast.warning('Payment status pending');
        }

        setLoading(false);
      } catch (error) {
        console.error('Verification error:', error);
        setError(handleApiError(error) || 'Error verifying payment');
        setLoading(false);
        toast.error('Error verifying payment');
      }
    };

    verifyPayment();
  }, [transactionId]);

  if (loading) {
    return (
      <div className="confirmation-container">
        <div className="confirmation-card loading">
          <div className="spinner-large"></div>
          <h2>Verifying Your Payment</h2>
          <p>Please wait while we confirm your transaction...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="confirmation-container">
        <div className="confirmation-card error">
          <div className="icon error-icon">❌</div>
          <h2>Payment Failed</h2>
          <p className="error-message">{error}</p>
          <div className="transaction-details">
            {transaction && (
              <>
                <div className="detail-row">
                  <span>Transaction ID:</span>
                  <strong>{transaction.transactionId}</strong>
                </div>
                <div className="detail-row">
                  <span>Amount:</span>
                  <strong>{paymentService.formatCurrency(transaction.totalAmount)}</strong>
                </div>
              </>
            )}
          </div>
          <div className="actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/bookings')}
            >
              Back to Bookings
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => window.location.reload()}
            >
              Retry Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (transaction?.status === 'completed') {
    return (
      <div className="confirmation-container">
        <div className="confirmation-card success">
          <div className="icon success-icon">✅</div>
          <h2>Payment Successful!</h2>
          <p>Your booking has been confirmed. Get ready for your new home!</p>

          <div className="transaction-details">
            <div className="detail-row">
              <span>Hostel:</span>
              <strong>{transaction.hostel}</strong>
            </div>
            <div className="detail-row">
              <span>Transaction ID:</span>
              <strong>{transaction.transactionId}</strong>
            </div>
            <div className="detail-row">
              <span>Room Rent:</span>
              <strong>{paymentService.formatCurrency(transaction.roomRent)}</strong>
            </div>
            <div className="detail-row">
              <span>Platform Fee:</span>
              <strong>{paymentService.formatCurrency(transaction.platformFee)}</strong>
            </div>
            <div className="detail-divider"></div>
            <div className="detail-row total">
              <span>Total Paid:</span>
              <strong>{paymentService.formatCurrency(transaction.totalAmount)}</strong>
            </div>
            <div className="detail-row">
              <span>Payment Date:</span>
              <strong>{new Date(transaction.completedAt).toLocaleString()}</strong>
            </div>
            <div className="detail-row">
              <span>Status:</span>
              <span className="status-badge success">{transaction.status.toUpperCase()}</span>
            </div>
          </div>

          <div className="next-steps">
            <h3>Next Steps:</h3>
            <ol>
              <li>Check your email for booking confirmation details</li>
              <li>The hostel owner will contact you to arrange move-in</li>
              <li>You can view all your bookings in your dashboard</li>
            </ol>
          </div>

          <div className="actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/bookings')}
            >
              View My Bookings
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
          </div>

          {/* Download Receipt Option */}
          <div className="receipt-section">
            <button className="btn-receipt">
              📄 Download Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-card pending">
        <div className="icon pending-icon">⏳</div>
        <h2>Payment Pending</h2>
        <p>Your payment is being processed. This may take a few moments.</p>
        <div className="transaction-details">
          <div className="detail-row">
            <span>Transaction ID:</span>
            <strong>{transaction?.transactionId}</strong>
          </div>
          <div className="detail-row">
            <span>Status:</span>
            <span className="status-badge pending">{transaction?.status}</span>
          </div>
        </div>
        <div className="actions">
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;