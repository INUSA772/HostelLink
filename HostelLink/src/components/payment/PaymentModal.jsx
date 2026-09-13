import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import paymentService from '../../services/paymentService';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pm-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.65); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 1rem; font-family: 'Manrope', sans-serif;
  }

  .pm-modal {
    background: white; border-radius: 18px;
    width: 100%; max-width: 520px; max-height: 92vh;
    overflow-y: auto; box-shadow: 0 25px 60px rgba(0,0,0,0.3);
    animation: pm-slide-up 0.3s ease;
  }
  .pm-modal::-webkit-scrollbar { width: 4px; }
  .pm-modal::-webkit-scrollbar-thumb { background: #e4e6eb; border-radius: 4px; }

  @keyframes pm-slide-up {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Header */
  .pm-head {
    background: linear-gradient(135deg, #0d1b3e, #1a3fa4);
    padding: 1.5rem; border-radius: 18px 18px 0 0;
    display: flex; align-items: center; justify-content: space-between;
  }
  .pm-head-left { display: flex; align-items: center; gap: 0.75rem; }
  .pm-head-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: rgba(232,80,26,0.25); color: #ffb49a;
    display: flex; align-items: center; justify-content: center; font-size: 1.3rem;
  }
  .pm-head h2 { font-size: 1.05rem; font-weight: 800; color: white; }
  .pm-head p  { font-size: 0.75rem; color: rgba(255,255,255,0.6); margin-top: 2px; }
  .pm-close {
    width: 34px; height: 34px; border-radius: 8px;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
    color: white; cursor: pointer; font-size: 1rem;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .pm-close:hover { background: rgba(255,255,255,0.2); }

  /* Body */
  .pm-body { padding: 1.5rem; }

  /* Summary */
  .pm-section { margin-bottom: 1.25rem; }
  .pm-section-title {
    font-size: 0.72rem; font-weight: 800; color: #9ca3af;
    text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.75rem;
  }
  .pm-summary-card {
    background: #f4f6fa; border-radius: 12px; padding: 1rem;
    border: 1px solid #e4e6eb;
  }
  .pm-summary-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.35rem 0; font-size: 0.875rem;
  }
  .pm-summary-row span { color: #65676b; font-weight: 600; }
  .pm-summary-row strong { color: #050505; font-weight: 700; }

  /* Breakdown */
  .pm-breakdown {
    background: #f4f6fa; border-radius: 12px; padding: 1rem;
    border: 1px solid #e4e6eb;
  }
  .pm-breakdown-row {
    display: flex; justify-content: space-between;
    font-size: 0.875rem; padding: 0.3rem 0;
    color: #65676b; font-weight: 600;
  }
  .pm-breakdown-row strong { color: #050505; }
  .pm-breakdown-divider { border: none; border-top: 1.5px solid #e4e6eb; margin: 0.6rem 0; }
  .pm-breakdown-total {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 1rem; font-weight: 900;
  }
  .pm-breakdown-total .amount { color: #e8501a; font-size: 1.15rem; }
  .pm-fee-note {
    font-size: 0.75rem; color: #9ca3af; margin-top: 0.6rem;
    line-height: 1.5; font-weight: 500;
  }

  /* Payment methods */
  .pm-methods { display: flex; flex-direction: column; gap: 0.6rem; }
  .pm-method {
    display: flex; align-items: center; gap: 0.85rem;
    padding: 0.9rem 1rem; border-radius: 12px;
    border: 2px solid #e4e6eb; cursor: pointer;
    transition: all 0.2s; background: white;
  }
  .pm-method:hover { border-color: #e8501a; background: #fff3ef; }
  .pm-method.selected { border-color: #e8501a; background: #fff3ef; }
  .pm-method input[type="radio"] { display: none; }
  .pm-method-icon {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; background: #f4f6fa; flex-shrink: 0;
  }
  .pm-method-name { font-size: 0.9rem; font-weight: 800; color: #050505; }
  .pm-method-desc { font-size: 0.75rem; color: #65676b; font-weight: 500; margin-top: 1px; }
  .pm-method-check {
    margin-left: auto; width: 22px; height: 22px; border-radius: 50%;
    border: 2px solid #e4e6eb; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .pm-method.selected .pm-method-check {
    background: #e8501a; border-color: #e8501a; color: white;
    font-size: 0.7rem;
  }

  /* Phone input */
  .pm-phone-wrap { margin-top: 0.75rem; }
  .pm-phone-label {
    font-size: 0.72rem; font-weight: 700; color: #65676b;
    text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 0.35rem; display: block;
  }
  .pm-phone-input {
    width: 100%; padding: 0.75rem 1rem;
    border: 1.5px solid #e4e6eb; border-radius: 10px;
    font-family: 'Manrope', sans-serif; font-size: 0.9rem;
    color: #050505; outline: none; transition: all 0.2s;
  }
  .pm-phone-input:focus { border-color: #e8501a; box-shadow: 0 0 0 3px rgba(232,80,26,0.08); }

  /* Security */
  .pm-security {
    display: flex; align-items: center; gap: 0.75rem;
    background: #ecfdf5; border: 1px solid #a7f3d0;
    border-radius: 10px; padding: 0.85rem 1rem;
    font-size: 0.8rem; color: #065f46; font-weight: 600;
  }
  .pm-security-icon { font-size: 1.2rem; flex-shrink: 0; }

  /* Actions */
  .pm-actions {
    display: flex; gap: 0.75rem; margin-top: 1.25rem;
  }
  .pm-btn-cancel {
    flex: 1; padding: 0.85rem;
    background: #f4f6fa; border: 1px solid #e4e6eb;
    border-radius: 12px; font-family: 'Manrope', sans-serif;
    font-size: 0.9rem; font-weight: 700; color: #65676b;
    cursor: pointer; transition: all 0.2s;
  }
  .pm-btn-cancel:hover { background: #e4e6eb; }
  .pm-btn-pay {
    flex: 2; padding: 0.85rem;
    background: linear-gradient(135deg, #e8501a, #ff6b3d);
    border: none; border-radius: 12px;
    font-family: 'Manrope', sans-serif;
    font-size: 0.95rem; font-weight: 800; color: white;
    cursor: pointer; transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(232,80,26,0.35);
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  }
  .pm-btn-pay:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(232,80,26,0.45); }
  .pm-btn-pay:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* Spinner */
  .pm-spinner {
    width: 18px; height: 18px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    animation: pm-spin 0.7s linear infinite;
  }
  @keyframes pm-spin { to { transform: rotate(360deg); } }

  /* Redirecting state */
  .pm-redirecting {
    text-align: center; padding: 2rem 1.5rem;
  }
  .pm-redirecting-icon { font-size: 3rem; margin-bottom: 1rem; }
  .pm-redirecting h3 { font-size: 1.1rem; font-weight: 800; color: #0d1b3e; margin-bottom: 0.5rem; }
  .pm-redirecting p { font-size: 0.88rem; color: #65676b; font-weight: 500; }
  .pm-progress {
    width: 100%; height: 4px; background: #e4e6eb;
    border-radius: 4px; margin-top: 1.5rem; overflow: hidden;
  }
  .pm-progress-bar {
    height: 100%; background: linear-gradient(90deg, #e8501a, #ff6b3d);
    border-radius: 4px; animation: pm-progress 1.5s ease-in-out forwards;
  }
  @keyframes pm-progress { from { width: 0; } to { width: 100%; } }
`;

const PaymentModal = ({ booking, hostel, isOpen, onClose, onSuccess }) => {
  const [loading,         setLoading]         = useState(false);
  const [redirecting,     setRedirecting]      = useState(false);
  const [paymentMethod,   setPaymentMethod]    = useState('mobile_money');
  const [phoneNumber,     setPhoneNumber]      = useState('');
  const [breakdown,       setBreakdown]        = useState(null);

  useEffect(() => {
    if (hostel?.price && booking?.duration) {
      const total = paymentService.calculateTotal(hostel.price * booking.duration);
      setBreakdown(total);
    }
  }, [hostel, booking]);

  if (!isOpen || !booking || !hostel) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'mobile_money' && !phoneNumber.trim()) {
      toast.error('Please enter your mobile money number');
      return;
    }

    if (paymentMethod === 'mobile_money' && !/^[0-9]{10}$/.test(phoneNumber.trim())) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      // ✅ FIXED: send mobileNumber not phoneNumber to match backend
      const response = await paymentService.initiatePayment(
        booking._id,
        paymentMethod,
        phoneNumber.trim() || null
      );

      if (!response.success) {
        toast.error(response.message || 'Failed to initiate payment');
        setLoading(false);
        return;
      }

      // Store transaction ID
      sessionStorage.setItem('transactionId', response.data.transactionId);
      sessionStorage.setItem('bookingId',     booking._id);

      setLoading(false);
      setRedirecting(true);

      toast.success('Redirecting to Paychangu payment...');

      // Redirect after short delay so user sees the message
      setTimeout(() => {
        window.location.href = response.data.paymentUrl;
      }, 1800);

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Failed to process payment');
      setLoading(false);
    }
  };

  const methods = [
    {
      value: 'mobile_money',
      icon: '📱',
      name: 'Mobile Money',
      desc: 'TNM Mpamba · Airtel Money',
    },
    {
      value: 'bank_transfer',
      icon: '🏦',
      name: 'Bank Transfer',
      desc: 'Direct bank transfer via Paychangu',
    },
    {
      value: 'card',
      icon: '💳',
      name: 'Card Payment',
      desc: 'Visa · Mastercard · Local cards',
    },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="pm-overlay" onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
        <div className="pm-modal">

          {/* Header */}
          <div className="pm-head">
            <div className="pm-head-left">
              <div className="pm-head-icon">💳</div>
              <div>
                <h2>Complete Payment</h2>
                <p>Secure payment via Paychangu</p>
              </div>
            </div>
            {!redirecting && (
              <button className="pm-close" onClick={onClose} disabled={loading}>✕</button>
            )}
          </div>

          <div className="pm-body">

            {redirecting ? (
              /* Redirecting state */
              <div className="pm-redirecting">
                <div className="pm-redirecting-icon">🔄</div>
                <h3>Redirecting to Paychangu...</h3>
                <p>Please wait while we redirect you to the secure payment page</p>
                <div className="pm-progress">
                  <div className="pm-progress-bar" />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>

                {/* Booking Summary */}
                <div className="pm-section">
                  <div className="pm-section-title">Booking Summary</div>
                  <div className="pm-summary-card">
                    {[
                      { label: 'Hostel',     value: hostel.name },
                      { label: 'Room Type',  value: hostel.type },
                      { label: 'Check-in',   value: new Date(booking.checkInDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
                      { label: 'Duration',   value: `${booking.duration} month${booking.duration !== 1 ? 's' : ''}` },
                    ].map((row, i) => (
                      <div key={i} className="pm-summary-row">
                        <span>{row.label}</span>
                        <strong>{row.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Breakdown */}
                {breakdown && (
                  <div className="pm-section">
                    <div className="pm-section-title">Payment Breakdown</div>
                    <div className="pm-breakdown">
                      <div className="pm-breakdown-row">
                        <span>Room Rent ({booking.duration} month{booking.duration !== 1 ? 's' : ''})</span>
                        <strong>MK {(hostel.price * booking.duration).toLocaleString()}</strong>
                      </div>
                      <div className="pm-breakdown-row">
                        <span>Platform Fee</span>
                        <strong>MK 2,000</strong>
                      </div>
                      <div className="pm-breakdown-divider" />
                      <div className="pm-breakdown-total">
                        <span>Total</span>
                        <span className="amount">MK {breakdown.totalAmount.toLocaleString()}</span>
                      </div>
                      <p className="pm-fee-note">
                        💡 The MK 2,000 platform fee protects both students and hostel owners from fraud.
                      </p>
                    </div>
                  </div>
                )}

                {/* Payment Methods */}
                <div className="pm-section">
                  <div className="pm-section-title">Payment Method</div>
                  <div className="pm-methods">
                    {methods.map((m) => (
                      <label
                        key={m.value}
                        className={`pm-method${paymentMethod === m.value ? ' selected' : ''}`}
                        onClick={() => setPaymentMethod(m.value)}
                      >
                        <input type="radio" name="method" value={m.value} readOnly checked={paymentMethod === m.value} />
                        <div className="pm-method-icon">{m.icon}</div>
                        <div>
                          <div className="pm-method-name">{m.name}</div>
                          <div className="pm-method-desc">{m.desc}</div>
                        </div>
                        <div className="pm-method-check">
                          {paymentMethod === m.value && '✓'}
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Phone input for mobile money */}
                  {paymentMethod === 'mobile_money' && (
                    <div className="pm-phone-wrap">
                      <label className="pm-phone-label">Mobile Money Number *</label>
                      <input
                        className="pm-phone-input"
                        type="tel"
                        placeholder="e.g. 0888123456"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        maxLength={10}
                        disabled={loading}
                      />
                    </div>
                  )}
                </div>

                {/* Security notice */}
                <div className="pm-security">
                  <span className="pm-security-icon">🔒</span>
                  <span>
                    Your payment is secured by <strong>Paychangu</strong>, Malawi's trusted payment gateway.
                    All transactions are encrypted and verified.
                  </span>
                </div>

                {/* Actions */}
                <div className="pm-actions">
                  <button type="button" className="pm-btn-cancel" onClick={onClose} disabled={loading}>
                    Cancel
                  </button>
                  <button type="submit" className="pm-btn-pay" disabled={loading}>
                    {loading
                      ? <><div className="pm-spinner" /> Processing...</>
                      : `Pay MK ${breakdown?.totalAmount?.toLocaleString() || '...'}`
                    }
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentModal;