import { useState } from 'react';
import useContactSettings from '../../hooks/useContactSettings';
import ContactAccessModal from './ContactAccessModal';

const waLink = (number) => {
  if (!number) return '';
  const digits = number.replace(/\D/g, '');
  const intl = digits.startsWith('265') ? digits : `265${digits.replace(/^0/, '')}`;
  return `https://wa.me/${intl}`;
};

const cacheKey = (hostelId) => `pn_contact_access:${hostelId}`;

function readCache(hostelId) {
  try {
    const raw = sessionStorage.getItem(cacheKey(hostelId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(hostelId, data) {
  try {
    sessionStorage.setItem(cacheKey(hostelId), JSON.stringify(data));
  } catch {
    // sessionStorage unavailable — just skip caching, user pays again next click
  }
}

/**
 * Shared WhatsApp/Call gating logic. Each call site supplies its own markup via
 * renderWhatsapp/renderCall render-props so every page keeps its existing visual style;
 * this component only decides whether a click should go straight to wa.me/tel: or open
 * the paywall modal first.
 */
export default function ContactButtons({ hostel, renderWhatsapp, renderCall, renderEmpty, onWhatsappClick }) {
  const { enabled, fee } = useContactSettings();
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // 'whatsapp' | 'call'
  const [revealed, setRevealed] = useState(() => readCache(hostel._id));

  const contactPhone = revealed?.contactPhone || hostel.contactPhone;
  const whatsapp = revealed?.whatsapp || hostel.whatsapp;
  const isLocked = enabled && !revealed;

  const hasWhatsapp = isLocked ? true : !!whatsapp;
  const hasCall = isLocked ? true : !!contactPhone;

  const openGate = (action) => {
    setPendingAction(action);
    setModalOpen(true);
  };

  const handleRevealed = (data, transactionId) => {
    const next = { ...data, transactionId };
    writeCache(hostel._id, next);
    setRevealed(next);
    setModalOpen(false);

    if (pendingAction === 'whatsapp' && data.whatsapp) {
      onWhatsappClick?.();
      window.open(waLink(data.whatsapp), '_blank', 'noopener,noreferrer');
    } else if (pendingAction === 'call' && data.contactPhone) {
      window.location.href = `tel:${data.contactPhone}`;
    }
    setPendingAction(null);
  };

  const whatsappProps = hasWhatsapp
    ? isLocked
      ? { href: '#', locked: true, onClick: (e) => { e.preventDefault(); openGate('whatsapp'); } }
      : { href: waLink(whatsapp), locked: false, onClick: () => onWhatsappClick?.() }
    : null;

  const callProps = hasCall
    ? isLocked
      ? { href: '#', locked: true, onClick: (e) => { e.preventDefault(); openGate('call'); } }
      : { href: `tel:${contactPhone}`, locked: false, onClick: undefined }
    : null;

  return (
    <>
      {whatsappProps && renderWhatsapp?.(whatsappProps)}
      {callProps && renderCall?.(callProps)}
      {!whatsappProps && !callProps && renderEmpty?.()}
      <ContactAccessModal
        hostel={hostel}
        fee={fee}
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setPendingAction(null); }}
        onRevealed={handleRevealed}
      />
    </>
  );
}
