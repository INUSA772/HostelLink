import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import contactAccessService from '../../services/contactAccessService';
import { FaXmark, FaLock } from 'react-icons/fa6';

const styles = `
  .cam-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.65);
    display: flex; align-items: center; justify-content: center;
    padding: 1rem; font-family: 'Plus Jakarta Sans', 'Nunito Sans', sans-serif;
  }
  .cam-modal {
    background: white; border-radius: 18px; width: 100%; max-width: 420px;
    max-height: 92vh; overflow-y: auto; box-shadow: 0 25px 60px rgba(0,0,0,0.3);
  }
  .cam-head {
    background: #0f1923; padding: 1.25rem 1.5rem; border-radius: 18px 18px 0 0;
    display: flex; align-items: center; justify-content: space-between;
  }
  .cam-head h2 { font-size: 1rem; font-weight: 800; color: white; }
  .cam-head p { font-size: 0.75rem; color: rgba(255,255,255,0.6); margin-top: 2px; }
  .cam-close {
    width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.15); color: white; cursor: pointer; font-size: 0.95rem;
    display: flex; align-items: center; justify-content: center;
  }
  .cam-body { padding: 1.5rem; }
  .cam-fee-card {
    background: #fef3d8; border: 1px solid #f5a623; border-radius: 12px;
    padding: 1rem; text-align: center; margin-bottom: 1.25rem;
  }
  .cam-fee-card .amount { font-size: 1.5rem; font-weight: 900; color: #0f1923; }
  .cam-fee-card p { font-size: 0.78rem; color: #6b7280; margin-top: 4px; }
  .cam-label { font-size: 0.72rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 0.4rem; display: block; }
  .cam-input {
    width: 100%; padding: 0.75rem 1rem; border: 1.5px solid #e8eaed; border-radius: 10px;
    font-size: 0.9rem; outline: none; font-family: inherit;
  }
  .cam-input:focus { border-color: #f5a623; }
  .cam-actions { display: flex; gap: 0.75rem; margin-top: 1.25rem; }
  .cam-btn-cancel { flex: 1; padding: 0.85rem; background: #f4f6fa; border: 1px solid #e4e6eb; border-radius: 12px; font-weight: 700; color: #65676b; cursor: pointer; }
  .cam-btn-pay { flex: 2; padding: 0.85rem; background: #f5a623; border: none; border-radius: 12px; font-weight: 800; color: #0f1923; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
  .cam-btn-pay:disabled { opacity: 0.6; cursor: not-allowed; }
  .cam-waiting { text-align: center; padding: 1.5rem 0.5rem; }
  .cam-spinner { width: 32px; height: 32px; margin: 0 auto 1rem; border-radius: 50%; border: 3px solid #fef3d8; border-top-color: #f5a623; animation: cam-spin 0.8s linear infinite; }
  @keyframes cam-spin { to { transform: rotate(360deg); } }
  .cam-security { display: flex; align-items: center; gap: 0.6rem; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 0.75rem 1rem; font-size: 0.76rem; color: #065f46; font-weight: 600; margin-top: 1rem; }
`;

const ContactAccessModal = ({ hostel, fee, isOpen, onClose, onRevealed }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const pollRef = useRef(null);
  const txRef = useRef(null);

  useEffect(() => () => clearInterval(pollRef.current), []);

  if (!isOpen) return null;

  const startPolling = (transactionId) => {
    let attempts = 0;
    pollRef.current = setInterval(async () => {
      attempts += 1;
      try {
        const res = await contactAccessService.verify(transactionId);
        if (res.data?.status === 'completed') {
          clearInterval(pollRef.current);
          const revealRes = await contactAccessService.reveal(hostel._id, transactionId);
          onRevealed(revealRes.data, transactionId);
          setWaiting(false);
        } else if (attempts >= 40) {
          clearInterval(pollRef.current);
          setWaiting(false);
          toast.error('Payment not confirmed yet. Please try again.');
        }
      } catch {
        // keep polling — a transient error shouldn't abort the wait
      }
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }
    setLoading(true);
    try {
      const res = await contactAccessService.initiate(hostel._id, phone.trim());
      if (!res.success) {
        toast.error(res.message || 'Failed to start payment');
        setLoading(false);
        return;
      }
      txRef.current = res.data.transactionId;
      window.open(res.data.paymentUrl, '_blank', 'noopener,noreferrer');
      setLoading(false);
      setWaiting(true);
      startPolling(res.data.transactionId);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start payment');
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="cam-overlay" onClick={(e) => e.target === e.currentTarget && !waiting && onClose()}>
        <div className="cam-modal">
          <div className="cam-head">
            <div>
              <h2>Unlock Owner Contact</h2>
              <p>Pay a small fee to see WhatsApp &amp; call details</p>
            </div>
            {!waiting && <button className="cam-close" onClick={onClose}><FaXmark /></button>}
          </div>
          <div className="cam-body">
            {waiting ? (
              <div className="cam-waiting">
                <div className="cam-spinner" />
                <p style={{ fontWeight: 800, color: '#0f1923', marginBottom: 6 }}>Waiting for payment…</p>
                <p style={{ fontSize: '0.82rem', color: '#6b7280' }}>
                  Complete the payment in the tab that just opened. This will update automatically.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="cam-fee-card">
                  <div className="amount">MK {Number(fee).toLocaleString()}</div>
                  <p>One-time fee to view this owner's contact details</p>
                </div>
                <label className="cam-label">Your Phone Number</label>
                <input
                  className="cam-input"
                  type="tel"
                  placeholder="e.g. 0888123456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                />
                <div className="cam-security">
                  <FaLock />
                  Secured by PayChangu, Malawi's trusted payment gateway.
                </div>
                <div className="cam-actions">
                  <button type="button" className="cam-btn-cancel" onClick={onClose} disabled={loading}>Cancel</button>
                  <button type="submit" className="cam-btn-pay" disabled={loading}>
                    {loading ? 'Processing…' : `Pay MK ${Number(fee).toLocaleString()}`}
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

export default ContactAccessModal;
