import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import paymentService from '../services/paymentService';
import api from '../services/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { font-family: 'Manrope', sans-serif; background: #f0f2f5; }

  .pr-page {
    min-height: 100vh; display: flex; align-items: center;
    justify-content: center; padding: 2rem;
    background: #f0f2f5; font-family: 'Manrope', sans-serif;
  }

  .pr-card {
    background: white; border-radius: 20px;
    padding: 3rem 2.5rem; max-width: 480px; width: 100%;
    text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  }

  /* Checking state */
  .pr-spinner-wrap { margin-bottom: 1.5rem; }
  .pr-spinner {
    width: 60px; height: 60px; border-radius: 50%;
    border: 4px solid #e4e6eb; border-top-color: #e8501a;
    animation: spin 0.8s linear infinite; margin: 0 auto;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Success */
  .pr-icon-success {
    width: 80px; height: 80px; border-radius: 50%;
    background: #ecfdf5; display: flex; align-items: center;
    justify-content: center; font-size: 2.5rem; margin: 0 auto 1.5rem;
    animation: pr-pop 0.4s ease;
  }
  @keyframes pr-pop {
    0%   { transform: scale(0); opacity: 0; }
    70%  { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
  }

  /* Failed */
  .pr-icon-failed {
    width: 80px; height: 80px; border-radius: 50%;
    background: #fef2f2; display: flex; align-items: center;
    justify-content: center; font-size: 2.5rem; margin: 0 auto 1.5rem;
  }

  .pr-title {
    font-size: 1.4rem; font-weight: 900;
    margin-bottom: 0.5rem;
  }
  .pr-title.success { color: #065f46; }
  .pr-title.failed  { color: #dc2626; }
  .pr-title.pending { color: #0d1b3e; }

  .pr-subtitle {
    font-size: 0.9rem; color: #65676b;
    font-weight: 500; margin-bottom: 1.5rem; line-height: 1.6;
  }

  /* Details */
  .pr-details {
    background: #f4f6fa; border-radius: 12px;
    padding: 1rem 1.25rem; margin-bottom: 1.5rem;
    text-align: left;
  }
  .pr-detail-row {
    display: flex; justify-content: space-between;
    align-items: center; padding: 0.4rem 0;
    font-size: 0.875rem; border-bottom: 1px solid rgba(0,0,0,0.05);
  }
  .pr-detail-row:last-child { border-bottom: none; }
  .pr-detail-row span { color: #65676b; font-weight: 600; }
  .pr-detail-row strong { color: #050505; font-weight: 700; }

  /* Status badge */
  .pr-badge {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 4px 12px; border-radius: 20px;
    font-size: 0.75rem; font-weight: 700; margin-bottom: 1rem;
  }
  .pr-badge.success { background: #ecfdf5; color: #059669; }
  .pr-badge.failed  { background: #fef2f2; color: #dc2626; }
  .pr-badge.pending { background: #fffbeb; color: #d97706; }

  /* Buttons */
  .pr-btn-primary {
    width: 100%; padding: 0.9rem;
    background: linear-gradient(135deg, #e8501a, #ff6b3d);
    border: none; border-radius: 12px; color: white;
    font-family: 'Manrope', sans-serif; font-size: 0.95rem; font-weight: 800;
    cursor: pointer; transition: all 0.2s; margin-bottom: 0.6rem;
    box-shadow: 0 4px 14px rgba(232,80,26,0.3);
  }
  .pr-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(232,80,26,0.4); }

  .pr-btn-secondary {
    width: 100%; padding: 0.85rem;
    background: #f4f6fa; border: 1px solid #e4e6eb;
    border-radius: 12px; color: #65676b;
    font-family: 'Manrope', sans-serif; font-size: 0.9rem; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
  }
  .pr-btn-secondary:hover { background: #e4e6eb; }
`;

const PaymentReturn = () => {
  const { transactionRef } = useParams();
  const navigate = useNavigate();

  const [status,      setStatus]      = useState('checking'); // checking | success | failed | pending
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        // Get transaction ID from session storage
        const storedTransactionId = sessionStorage.getItem('transactionId');

        if (!storedTransactionId && !transactionRef) {
          setStatus('failed');
          return;
        }

        // Verify payment
        const res = await api.get(
          `/payments/verify/${storedTransactionId || transactionRef}`
        );

        if (res.data.success) {
          const data = res.data.data;
          setTransaction(data);

          if (data.status === 'completed' || data.paymentStatus === 'paid') {
            setStatus('success');
            sessionStorage.removeItem('transactionId');
            sessionStorage.removeItem('bookingId');
          } else if (data.status === 'failed') {
            setStatus('failed');
          } else {
            setStatus('pending');
          }
        } else {
          setStatus('failed');
        }
      } catch (err) {
        console.error('Verification error:', err);
        // If unauthorized, might not be logged in — redirect to login
        if (err.response?.status === 401) {
          navigate('/login');
          return;
        }
        setStatus('failed');
      }
    };

    verify();
  }, [transactionRef]);

  return (
    <>
      <style>{styles}</style>
      <div className="pr-page">
        <div className="pr-card">

          {/* CHECKING */}
          {status === 'checking' && (
            <>
              <div className="pr-spinner-wrap">
                <div className="pr-spinner" />
              </div>
              <div className="pr-title pending">Verifying Payment...</div>
              <p className="pr-subtitle">
                Please wait while we confirm your payment with Paychangu
              </p>
            </>
          )}

          {/* SUCCESS */}
          {status === 'success' && (
            <>
              <div className="pr-icon-success">✅</div>
              <span className="pr-badge success">● Payment Confirmed</span>
              <div className="pr-title success">Booking Confirmed! 🎉</div>
              <p className="pr-subtitle">
                Your payment was successful and your hostel booking is now confirmed.
                The owner has been notified.
              </p>

              {transaction && (
                <div className="pr-details">
                  {[
                    { label: 'Hostel',        value: transaction.hostel?.name },
                    { label: 'Amount Paid',   value: `MK ${transaction.amount?.toLocaleString()}` },
                    { label: 'Booking Status', value: '✅ Confirmed' },
                    { label: 'Transaction',   value: transaction.transactionId?.slice(-12) },
                  ].filter(r => r.value).map((row, i) => (
                    <div key={i} className="pr-detail-row">
                      <span>{row.label}</span>
                      <strong>{row.value}</strong>
                    </div>
                  ))}
                </div>
              )}

              <button className="pr-btn-primary" onClick={() => navigate('/bookings')}>
                View My Bookings
              </button>
              <button className="pr-btn-secondary" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </button>
            </>
          )}

          {/* FAILED */}
          {status === 'failed' && (
            <>
              <div className="pr-icon-failed">❌</div>
              <span className="pr-badge failed">● Payment Failed</span>
              <div className="pr-title failed">Payment Failed</div>
              <p className="pr-subtitle">
                Your payment could not be processed. No money has been deducted.
                Please try again or use a different payment method.
              </p>

              <button
                className="pr-btn-primary"
                onClick={() => {
                  const bookingId = sessionStorage.getItem('bookingId');
                  if (bookingId) {
                    navigate('/bookings');
                  } else {
                    navigate('/hostels');
                  }
                }}
              >
                Try Again
              </button>
              <button className="pr-btn-secondary" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </button>
            </>
          )}

          {/* PENDING */}
          {status === 'pending' && (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
              <span className="pr-badge pending">● Payment Pending</span>
              <div className="pr-title pending">Payment Processing</div>
              <p className="pr-subtitle">
                Your payment is still being processed. This can take a few minutes.
                We'll notify you once it's confirmed.
              </p>

              <button className="pr-btn-primary" onClick={() => navigate('/bookings')}>
                View My Bookings
              </button>
              <button className="pr-btn-secondary" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </button>
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default PaymentReturn;