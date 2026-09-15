import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import userService from '../../services/userService';
import {
  FaIdCard,
  FaFileInvoice,
  FaCircleCheck,
  FaHourglassHalf,
  FaCircleXmark,
  FaShieldHalved,
  FaTriangleExclamation,
  FaCheck,
  FaSpinner,
  FaPaperPlane,
} from 'react-icons/fa6';

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_PRESET);
  fd.append('folder', 'verification-documents');
  const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Upload failed');
  return data.secure_url;
}

const styles = `
  @keyframes ovc-spin { to { transform: rotate(360deg); } }
  .ovc-spin { animation: ovc-spin 0.8s linear infinite; }
  .ovc-card { background: white; border-radius: 14px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 1.5rem; }
  .ovc-head { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.4rem; }
  .ovc-head h3 { font-size: 1.05rem; font-weight: 800; color: #0f1923; }
  .ovc-sub { font-size: 0.85rem; color: #6b7280; margin-bottom: 1.25rem; }
  .ovc-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
  .ovc-badge.verified { background: #ecfdf5; color: #059669; }
  .ovc-badge.pending { background: #fef3d8; color: #d4870a; }
  .ovc-badge.rejected { background: #fef2f2; color: #dc2626; }
  .ovc-badge.unverified { background: #f4f6fa; color: #6b7280; }
  .ovc-slots { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin: 1rem 0; }
  .ovc-slot { border: 2px dashed #e4e6ea; border-radius: 10px; padding: 1rem; text-align: center; cursor: pointer; transition: all .2s; position: relative; min-height: 120px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .ovc-slot:hover { border-color: #f5a623; background: #fef3d8; }
  .ovc-slot.filled { border-style: solid; border-color: #22c55e; padding: 0; overflow: hidden; }
  .ovc-slot img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
  .ovc-slot-label { font-size: 0.78rem; font-weight: 700; color: #4b5563; margin-top: 0.5rem; }
  .ovc-slot-check { position: absolute; top: 6px; right: 6px; background: #22c55e; color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; z-index: 2; }
  .ovc-slot-overlay { position: absolute; inset: 0; background: rgba(0,0,0,.45); color: white; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity .2s; font-size: 0.75rem; font-weight: 700; z-index: 1; }
  .ovc-slot.filled:hover .ovc-slot-overlay { opacity: 1; }
  .ovc-submit { background: #0f1923; color: white; border: none; border-radius: 10px; padding: 0.85rem 1.5rem; font-weight: 800; font-size: 0.92rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: background .2s; }
  .ovc-submit:hover:not(:disabled) { background: #1a2e3d; }
  .ovc-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .ovc-note { font-size: 0.78rem; color: #9ca3af; margin-top: 0.75rem; }
  .ovc-rejection { background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 0.85rem 1rem; font-size: 0.85rem; color: #991b1b; margin-bottom: 1rem; }
`;

const SLOTS = [
  { key: 'idFrontUrl', label: 'National ID — Front', icon: FaIdCard },
  { key: 'idBackUrl', label: 'National ID — Back', icon: FaIdCard },
  { key: 'waterBillUrl', label: 'Water Bill', icon: FaFileInvoice },
];

export default function OwnerVerificationCard() {
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState('unverified');
  const [rejectionReason, setRejectionReason] = useState('');
  const [docs, setDocs] = useState({ idFrontUrl: '', idBackUrl: '', waterBillUrl: '' });
  const [uploadingKey, setUploadingKey] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    userService.getVerificationStatus()
      .then((res) => {
        if (!mounted) return;
        setEnabled(res.data.enabled);
        setStatus(res.data.status);
        setRejectionReason(res.data.rejectionReason || '');
        setDocs({
          idFrontUrl: res.data.documents?.idFrontUrl || '',
          idBackUrl: res.data.documents?.idBackUrl || '',
          waterBillUrl: res.data.documents?.waterBillUrl || '',
        });
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading || !enabled) return null;

  const canEdit = status === 'unverified' || status === 'rejected';
  const allUploaded = SLOTS.every((s) => docs[s.key]);

  const handleFile = async (key, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setUploadingKey(key);
    try {
      const url = await uploadToCloudinary(file);
      setDocs((prev) => ({ ...prev, [key]: url }));
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await userService.submitVerification(docs);
      setStatus(res.user.verificationStatus);
      toast.success('Documents submitted — an admin will review them shortly');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit documents');
    } finally {
      setSubmitting(false);
    }
  };

  const badge = {
    verified: { cls: 'verified', icon: FaCircleCheck, text: 'Verified' },
    pending: { cls: 'pending', icon: FaHourglassHalf, text: 'Under Review' },
    rejected: { cls: 'rejected', icon: FaCircleXmark, text: 'Rejected — resubmit below' },
    unverified: { cls: 'unverified', icon: FaShieldHalved, text: 'Not Verified Yet' },
  }[status] || { cls: 'unverified', icon: FaShieldHalved, text: 'Not Verified Yet' };

  return (
    <div className="ovc-card">
      <style>{styles}</style>
      <div className="ovc-head">
        <h3><FaShieldHalved style={{ color: '#f5a623', marginRight: 6 }} /> Identity Verification</h3>
        <span className={`ovc-badge ${badge.cls}`}><badge.icon /> {badge.text}</span>
      </div>
      <p className="ovc-sub">
        Verified owners get a trust badge on their listings. Upload a clear photo of both sides of your
        national ID and a recent water bill in your name.
      </p>

      {status === 'rejected' && rejectionReason && (
        <div className="ovc-rejection">
          <FaTriangleExclamation /> <strong>Rejected:</strong> {rejectionReason}
        </div>
      )}

      {status === 'verified' ? (
        <p style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>
          <FaCircleCheck /> Your identity has been verified.
        </p>
      ) : status === 'pending' ? (
        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          Your documents are with our team for review. This usually takes a short while.
        </p>
      ) : (
        <>
          <div className="ovc-slots">
            {SLOTS.map((slot) => (
              <label key={slot.key} className={`ovc-slot${docs[slot.key] ? ' filled' : ''}`}>
                {docs[slot.key] ? (
                  <>
                    <img src={docs[slot.key]} alt={slot.label} />
                    <div className="ovc-slot-overlay">Click to replace</div>
                    <div className="ovc-slot-check"><FaCheck /></div>
                  </>
                ) : uploadingKey === slot.key ? (
                  <FaSpinner className="ovc-spin" style={{ fontSize: '1.4rem', color: '#f5a623' }} />
                ) : (
                  <>
                    <slot.icon style={{ fontSize: '1.4rem', color: '#9ca3af' }} />
                    <div className="ovc-slot-label">{slot.label}</div>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  disabled={!canEdit || uploadingKey !== null}
                  onChange={(e) => handleFile(slot.key, e.target.files?.[0])}
                />
              </label>
            ))}
          </div>
          <button className="ovc-submit" disabled={!allUploaded || submitting} onClick={handleSubmit}>
            {submitting ? <><FaSpinner className="ovc-spin" /> Submitting…</> : <><FaPaperPlane /> Submit for Verification</>}
          </button>
          <p className="ovc-note">Your documents are only visible to PezaNyumba admins reviewing your account.</p>
        </>
      )}
    </div>
  );
}
