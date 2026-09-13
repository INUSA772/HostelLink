import { useState, useEffect } from 'react';
import contactAccessService from '../services/contactAccessService';

// Small in-memory cache so every card/detail page doesn't re-fetch this on its own.
let cached = null;
let inFlight = null;

function fetchSettings() {
  if (cached) return Promise.resolve(cached);
  if (inFlight) return inFlight;

  inFlight = contactAccessService
    .getSettings()
    .then((res) => {
      cached = res.data;
      return cached;
    })
    .catch(() => ({ enabled: false, fee: 0 }))
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

export default function useContactSettings() {
  const [settings, setSettings] = useState(cached || { enabled: false, fee: 0 });
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let mounted = true;
    if (!cached) {
      fetchSettings().then((data) => {
        if (mounted) {
          setSettings(data);
          setLoading(false);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, []);

  return { enabled: !!settings.enabled, fee: settings.fee || 0, loading };
}
