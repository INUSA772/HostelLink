import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ═══════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════ */
const DISTRICTS = [
  "Balaka","Blantyre","Chikwawa","Chiradzulu","Chitipa","Dedza","Dowa",
  "Karonga","Kasungu","Likoma","Lilongwe","Machinga","Mangochi","Mchinji",
  "Mulanje","Mwanza","Mzimba","Neno","Nkhata Bay","Nkhotakota","Nsanje",
  "Ntcheu","Ntchisi","Phalombe","Rumphi","Salima","Thyolo","Zomba",
];

const PROPERTY_TYPES = [
  "House","Flat/Apartment","Single Room","Self-Contained","Plot of Land","Commercial Space",
];

/* ═══════════════════════════════════════
   HELPERS
═══════════════════════════════════════ */
function waLink(num) {
  if (!num) return null;
  const clean = num.toString().replace(/\D/g, "");
  const intl  = clean.startsWith("0") ? "265" + clean.slice(1) : clean;
  return `https://wa.me/${intl}`;
}
function normalise(p) {
  return {
    _id:           p._id || p.id,
    name:          p.name || p.title || "Unnamed Property",
    type:          p.type || p.propertyType || p.property_type || "",
    listingType:   p.listingType || p.listing_type || "For Rent",
    price:         p.price || 0,
    district:      p.district || p.location?.formattedAddress?.split(",").pop()?.trim() || "",
    address:       p.address || p.location?.formattedAddress || "",
    bedrooms:      p.bedrooms || p.beds || 0,
    bathrooms:     p.bathrooms || p.baths || 0,
    availableRooms:p.availableRooms || p.available_rooms || 0,
    images:        p.images || p.photos || [],
    contactPhone:  p.contactPhone || p.owner?.phone || p.phone || "",
    whatsapp:      p.whatsapp || p.contactPhone || p.owner?.phone || p.phone || "",
  };
}
function formatPrice(price, listingType) {
  if (!price) return "Price on request";
  const suffix = (listingType || "").toLowerCase().includes("sale") ? "" : "/mo";
  return "MWK " + Number(price).toLocaleString() + suffix;
}

/* ═══════════════════════════════════════
   IMAGE LIGHTBOX
═══════════════════════════════════════ */
function ImageLightbox({ images, startIndex = 0, propertyName, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const touchStartX = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx(i => (i + 1) % images.length);
      if (e.key === "ArrowLeft")  setIdx(i => (i - 1 + images.length) % images.length);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [images.length, onClose]);

  function onTouchStart(e) { touchStartX.current = e.touches[0].clientX; }
  function onTouchEnd(e) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) setIdx(i => dx < 0 ? (i + 1) % images.length : (i - 1 + images.length) % images.length);
    touchStartX.current = null;
  }

  return (
    <div className="pp-lb-overlay" onClick={e => e.target === e.currentTarget && onClose()}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="pp-lb-box">
        <div className="pp-lb-header">
          <div className="pp-lb-title"><i className="fa fa-images" style={{color:"#f5a623",marginRight:8}}/>{propertyName}</div>
          <div className="pp-lb-counter">{idx + 1} of {images.length}</div>
          <button className="pp-lb-close" onClick={onClose}><i className="fa fa-times"/></button>
        </div>
        <div className="pp-lb-main">
          {images.length > 1 && <button className="pp-lb-nav pp-lb-prev" onClick={() => setIdx(i => (i-1+images.length)%images.length)}><i className="fa fa-chevron-left"/></button>}
          <img src={images[idx]} alt={`${propertyName} ${idx+1}`} className="pp-lb-img"/>
          {images.length > 1 && <button className="pp-lb-nav pp-lb-next" onClick={() => setIdx(i => (i+1)%images.length)}><i className="fa fa-chevron-right"/></button>}
        </div>
        {images.length > 1 && (
          <div className="pp-lb-thumbs">
            {images.map((src,i) => (
              <button key={i} className={`pp-lb-thumb${idx===i?" active":""}`} onClick={() => setIdx(i)}>
                <img src={src} alt={`thumb ${i+1}`}/>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   PROPERTY CARD
═══════════════════════════════════════ */
function PropertyCard({ property }) {
  const p = normalise(property);
  const [lightbox, setLightbox] = useState(false);
  const isForSale = p.listingType.toLowerCase().includes("sale");
  const wa   = waLink(p.whatsapp);
  const call = p.contactPhone ? `tel:${p.contactPhone}` : null;

  return (
    <div className="pp-card">
      <div
        className="pp-card-img"
        onClick={() => p.images.length > 0 && setLightbox(true)}
        style={{ cursor: p.images.length > 0 ? "pointer" : "default" }}
      >
        {p.images[0]
          ? <img src={p.images[0]} alt={p.name} loading="lazy"/>
          : <div className="pp-card-no-img"><i className="fa fa-home"/></div>
        }
        <div className="pp-card-badges">
          <span className={`pp-badge ${isForSale ? "sale" : "rent"}`}>{isForSale ? "For Sale" : "For Rent"}</span>
          {p.type && <span className="pp-badge type">{p.type}</span>}
        </div>
        {p.images.length > 1 && (
          <div className="pp-img-count"><i className="fa fa-images"/> {p.images.length}</div>
        )}
        {p.images.length > 0 && (
          <div className="pp-img-hint"><span><i className="fa fa-images"/> View photos</span></div>
        )}
      </div>

      <div className="pp-card-body">
        <div className="pp-card-name">{p.name}</div>
        <div className="pp-card-loc"><i className="fa fa-map-marker-alt"/> {[p.address, p.district].filter(Boolean).join(", ") || "Malawi"}</div>
        <div className="pp-card-price">{formatPrice(p.price, p.listingType)}</div>
        <div className="pp-card-meta">
          {p.bedrooms  > 0 && <span><i className="fa fa-bed"/>  {p.bedrooms} bed</span>}
          {p.bathrooms > 0 && <span><i className="fa fa-bath"/> {p.bathrooms} bath</span>}
          {p.availableRooms > 0 && <span><i className="fa fa-door-open"/> {p.availableRooms} avail.</span>}
        </div>
      </div>

      <div className="pp-card-actions">
  {wa && (
    <a className="pp-wa" href={wa} target="_blank" rel="noopener noreferrer"
      onClick={() => fetch(`${API_URL}/hostels/${p._id}/track-click`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'whatsapp' }) })}>
      <i className="fab fa-whatsapp"/> WhatsApp
    </a>
  )}
  {call && (
    <a className="pp-call" href={call}
      onClick={() => fetch(`${API_URL}/hostels/${p._id}/track-click`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'call' }) })}>
      <i className="fa fa-phone"/> Call
    </a>
  )}
  {!wa && !call && <span style={{fontSize:".75rem",color:"#9ca3af",padding:".5rem"}}>No contact info</span>}
</div>

      {lightbox && p.images.length > 0 && (
        <ImageLightbox images={p.images} startIndex={0} propertyName={p.name} onClose={() => setLightbox(false)}/>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   STYLES  — Home.jsx theme
═══════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  :root {
    --navy:        #0f1923;
    --navy-mid:    #1a2e3d;
    --amber:       #f5a623;
    --amber-light: #fef3d8;
    --amber-dark:  #d4870a;
    --white:       #fff;
    --off-white:   #f7f8fa;
    --light-gray:  #f0f2f5;
    --border:      #e8eaed;
    --mid:         #6b7280;
    --dark:        #111827;
    --wa:          #25D366;
    --radius:      12px;
    --radius-lg:   16px;
    --font:        'Plus Jakarta Sans', sans-serif;
  }

  body { font-family: var(--font); background: var(--off-white); color: var(--dark); }

  /* ── PAGE SHELL ── */
  .pp-page { min-height:100vh; display:flex; flex-direction:column; }

  /* ── HEADER ── */
  .pp-header {
    background: var(--navy);
    color: white;
    padding: 1.2rem 1.5rem;
    position: sticky; top: 0; z-index: 100;
    box-shadow: 0 2px 16px rgba(0,0,0,.25);
  }
  .pp-header-inner {
    max-width: 1300px; margin: 0 auto;
    display: flex; align-items: center; gap: 1rem;
  }
  .pp-back {
    display: flex; align-items: center; gap: 6px;
    color: rgba(255,255,255,.75); font-size: .84rem; font-weight: 600;
    background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.15);
    border-radius: 8px; padding: 6px 14px; cursor: pointer;
    transition: all .2s; text-decoration: none; font-family: inherit;
  }
  .pp-back:hover { background: rgba(255,255,255,.18); color: white; }
  .pp-header-title { flex: 1; }
  .pp-header-title h1 {
    font-family: var(--font); font-size: 1.15rem; font-weight: 800;
    color: white; line-height: 1.2;
  }
  .pp-header-title p { font-size: .75rem; color: rgba(255,255,255,.5); margin-top: 2px; }
  .pp-header-count {
    background: rgba(245,166,35,.15); border: 1px solid rgba(245,166,35,.35);
    border-radius: 8px; padding: 6px 14px;
    font-size: .82rem; font-weight: 700; color: var(--amber);
    white-space: nowrap;
  }

  /* ── FILTERS BAR ── */
  .pp-filters {
    background: white;
    border-bottom: 1px solid var(--border);
    padding: 1rem 1.5rem;
    position: sticky; top: 60px; z-index: 90;
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
  }
  .pp-filters-inner {
    max-width: 1300px; margin: 0 auto;
    display: flex; gap: .75rem; flex-wrap: wrap; align-items: center;
  }
  .pp-filter-group {
    display: flex; align-items: center; gap: 6px;
    background: var(--amber-light); border: 1.5px solid #f0d89a;
    border-radius: 9px; padding: 6px 12px;
  }
  .pp-filter-group label {
    font-size: .73rem; font-weight: 700;
    color: var(--amber-dark); white-space: nowrap;
  }
  .pp-filter-group select,
  .pp-filter-group input {
    border: none; background: transparent; font-size: .83rem;
    color: var(--dark); font-family: inherit; font-weight: 600;
    outline: none; min-width: 120px;
  }
  .pp-filter-search {
    flex: 1; min-width: 220px;
    display: flex; align-items: center; gap: 6px;
    background: var(--off-white); border: 1.5px solid var(--border);
    border-radius: 9px; padding: 6px 14px;
    transition: border-color .2s;
  }
  .pp-filter-search:focus-within { border-color: var(--amber); }
  .pp-filter-search i { color: var(--amber-dark); font-size: .85rem; }
  .pp-filter-search input {
    border: none; background: transparent; font-size: .85rem;
    color: var(--dark); font-family: inherit; font-weight: 500;
    outline: none; flex: 1; width: 100%;
  }
  .pp-filter-search input::placeholder { color: #9ca3af; }
  .pp-filter-clear {
    background: none; border: 1.5px solid var(--border);
    border-radius: 8px; padding: 6px 14px; font-size: .8rem; font-weight: 700;
    color: var(--mid); cursor: pointer; transition: all .2s;
    font-family: inherit; white-space: nowrap;
  }
  .pp-filter-clear:hover { border-color: var(--amber); color: var(--amber-dark); background: var(--amber-light); }
  .pp-filter-tabs { display: flex; gap: 6px; }
  .pp-filter-tab {
    padding: 6px 14px; border-radius: 8px; font-size: .78rem; font-weight: 700;
    border: 1.5px solid var(--border); background: white; color: var(--mid);
    cursor: pointer; transition: all .2s; font-family: inherit;
  }
  .pp-filter-tab:hover { border-color: var(--amber); color: var(--amber-dark); }
  .pp-filter-tab.active { background: var(--navy); color: white; border-color: var(--navy); }

  /* ── CONTENT ── */
  .pp-content { flex: 1; max-width: 1300px; margin: 0 auto; width: 100%; padding: 1.5rem; }

  /* ── RESULT INFO ── */
  .pp-result-info {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.2rem; flex-wrap: wrap; gap: .5rem;
  }
  .pp-result-info p { font-size: .85rem; color: var(--mid); font-weight: 500; }
  .pp-result-info strong { color: var(--navy); }
  .pp-sort { display: flex; align-items: center; gap: 6px; font-size: .8rem; font-weight: 600; color: var(--mid); }
  .pp-sort select {
    border: 1.5px solid var(--border); border-radius: 8px; padding: 5px 10px;
    font-size: .8rem; background: white; color: var(--dark);
    font-family: inherit; outline: none; cursor: pointer;
    transition: border-color .2s;
  }
  .pp-sort select:focus { border-color: var(--amber); }

  /* ── GRID ── */
  .pp-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(280px,1fr)); gap: 1.2rem; }

  /* ── EMPTY ── */
  .pp-empty { text-align: center; padding: 4rem 1rem; }
  .pp-empty-icon { font-size: 4rem; color: var(--amber); opacity: .25; margin-bottom: 1rem; }
  .pp-empty h3 { font-size: 1.1rem; font-weight: 800; color: var(--navy); margin-bottom: .5rem; }
  .pp-empty p  { font-size: .88rem; color: var(--mid); margin-bottom: 1.5rem; }
  .pp-empty-btn {
    background: var(--navy); color: white; border: none;
    border-radius: 10px; padding: .65rem 1.6rem;
    font-size: .88rem; font-weight: 700; cursor: pointer;
    font-family: inherit; transition: background .2s;
  }
  .pp-empty-btn:hover { background: var(--navy-mid); }

  /* ── LOADING ── */
  .pp-loading {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 5rem; gap: 1rem;
    color: var(--mid); font-size: .9rem;
  }
  .pp-spinner {
    width: 40px; height: 40px;
    border: 3px solid var(--amber-light); border-top-color: var(--amber);
    border-radius: 50%; animation: spin .7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── CARD ── */
  .pp-card {
    border: 1.5px solid var(--border); border-radius: var(--radius-lg);
    overflow: hidden; background: white; transition: all .25s;
    box-shadow: 0 2px 10px rgba(0,0,0,.05); display: flex; flex-direction: column;
  }
  .pp-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 32px rgba(15,25,35,.12);
    border-color: var(--amber);
  }
  .pp-card-img {
    position: relative; height: 185px; overflow: hidden;
    background: var(--light-gray); flex-shrink: 0;
  }
  .pp-card-img img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform .4s;
  }
  .pp-card:hover .pp-card-img img { transform: scale(1.05); }
  .pp-card-no-img {
    width: 100%; height: 100%; display: flex; align-items: center;
    justify-content: center; font-size: 3rem; color: var(--mid); opacity: .3;
  }
  .pp-card-badges {
    position: absolute; top: 10px; left: 10px;
    display: flex; gap: 5px; flex-wrap: wrap; z-index: 1;
  }
  .pp-badge {
    font-size: .64rem; font-weight: 700; padding: 3px 9px;
    border-radius: 20px; text-transform: uppercase; letter-spacing: .5px;
  }
  .pp-badge.rent { background: var(--navy); color: white; }
  .pp-badge.sale { background: var(--amber); color: var(--navy); }
  .pp-badge.type { background: rgba(255,255,255,.92); color: #374151; }
  .pp-img-count {
    position: absolute; bottom: 8px; right: 8px;
    background: rgba(0,0,0,.55); border-radius: 8px; color: white;
    font-size: .7rem; font-weight: 700; padding: 4px 9px;
    display: flex; align-items: center; gap: 4px; z-index: 1;
    backdrop-filter: blur(4px);
  }
  .pp-img-hint {
    position: absolute; inset: 0; display: flex; align-items: center;
    justify-content: center; opacity: 0; transition: opacity .25s;
    background: rgba(0,0,0,.3); z-index: 1;
  }
  .pp-card-img:hover .pp-img-hint { opacity: 1; }
  .pp-img-hint span {
    background: white; color: var(--navy); font-size: .78rem; font-weight: 800;
    padding: 7px 14px; border-radius: 8px;
    display: flex; align-items: center; gap: 6px;
  }
  .pp-card-body { padding: 1rem; flex: 1; }
  .pp-card-name  { font-size: .95rem; font-weight: 800; color: var(--navy); margin-bottom: .3rem; line-height: 1.3; }
  .pp-card-loc   { font-size: .76rem; color: var(--mid); display: flex; align-items: center; gap: 4px; margin-bottom: .6rem; }
  .pp-card-loc i { color: var(--amber-dark); font-size: .72rem; }
  .pp-card-price { font-size: 1.05rem; font-weight: 800; color: var(--navy); }
  .pp-card-meta  { display: flex; gap: .8rem; margin-top: .5rem; flex-wrap: wrap; }
  .pp-card-meta span { font-size: .72rem; color: var(--mid); display: flex; align-items: center; gap: 3px; }
  .pp-card-meta i { color: var(--amber-dark); }
  .pp-card-actions {
    padding: .75rem 1rem; border-top: 1px solid var(--border); display: flex; gap: .5rem;
  }
  .pp-wa {
    flex: 1; background: var(--wa); color: white; border: none;
    border-radius: 8px; padding: .5rem; font-size: .78rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center; gap: 5px;
    text-decoration: none; transition: background .18s;
  }
  .pp-wa:hover { background: #128c4e; }
  .pp-call {
    background: var(--light-gray); color: var(--navy);
    border: 1.5px solid var(--border); border-radius: 8px; padding: .5rem .75rem;
    font-size: .78rem; font-weight: 700; display: flex; align-items: center; gap: 5px;
    text-decoration: none; transition: all .18s;
  }
  .pp-call:hover { background: var(--navy); color: white; }

  /* ── LIGHTBOX ── */
  .pp-lb-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.92); z-index: 10000;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn .2s ease;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .pp-lb-box {
    background: #111; border-radius: 16px; overflow: hidden;
    max-width: 900px; width: calc(100vw - 2rem); max-height: calc(100vh - 2rem);
    display: flex; flex-direction: column; box-shadow: 0 32px 80px rgba(0,0,0,.6);
  }
  .pp-lb-header {
    display: flex; align-items: center; gap: .75rem;
    padding: .9rem 1.2rem; background: #1a1a1a;
    border-bottom: 1px solid #2a2a2a; flex-shrink: 0;
  }
  .pp-lb-title {
    flex: 1; font-size: .88rem; font-weight: 700; color: white;
    display: flex; align-items: center;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .pp-lb-counter {
    font-size: .78rem; color: rgba(255,255,255,.45);
    background: rgba(255,255,255,.08); padding: 3px 10px;
    border-radius: 20px; white-space: nowrap;
  }
  .pp-lb-close {
    width: 34px; height: 34px; border-radius: 8px;
    background: rgba(255,255,255,.1); color: rgba(255,255,255,.7);
    font-size: .9rem; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .2s; border: none; flex-shrink: 0;
  }
  .pp-lb-close:hover { background: #dc2626; color: white; }
  .pp-lb-main {
    position: relative; flex: 1; display: flex; align-items: center;
    justify-content: center; background: #000; min-height: 0; overflow: hidden;
  }
  .pp-lb-img { max-width: 100%; max-height: 60vh; object-fit: contain; display: block; }
  .pp-lb-nav {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 44px; height: 44px; border-radius: 50%;
    background: rgba(255,255,255,.15); color: white; font-size: 1rem;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .2s; z-index: 2; border: none;
    backdrop-filter: blur(4px);
  }
  .pp-lb-nav:hover { background: rgba(255,255,255,.3); }
  .pp-lb-prev { left: 12px; }
  .pp-lb-next { right: 12px; }
  .pp-lb-thumbs {
    display: flex; gap: 6px; padding: .75rem 1rem;
    background: #1a1a1a; overflow-x: auto; flex-shrink: 0;
  }
  .pp-lb-thumbs::-webkit-scrollbar { height: 4px; }
  .pp-lb-thumbs::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
  .pp-lb-thumb {
    flex-shrink: 0; width: 60px; height: 44px; border-radius: 6px;
    overflow: hidden; border: 2px solid transparent; cursor: pointer;
    transition: border-color .2s; background: none; padding: 0;
  }
  .pp-lb-thumb.active { border-color: var(--amber); }
  .pp-lb-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

  /* ── PAGINATION ── */
  .pp-pagination {
    display: flex; align-items: center; justify-content: center;
    gap: .5rem; padding: 2rem 0; flex-wrap: wrap;
  }
  .pp-page-btn {
    width: 38px; height: 38px; border-radius: 9px;
    border: 1.5px solid var(--border); background: white;
    color: var(--mid); font-size: .85rem; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all .2s; font-family: inherit;
  }
  .pp-page-btn:hover { border-color: var(--amber); color: var(--amber-dark); }
  .pp-page-btn.active { background: var(--navy); color: white; border-color: var(--navy); }
  .pp-page-btn:disabled { opacity: .35; cursor: not-allowed; }

  @media(max-width:768px) {
    .pp-filters-inner { gap: .5rem; }
    .pp-filter-search { min-width: 100%; }
    .pp-grid { grid-template-columns: 1fr 1fr; gap: .75rem; }
    .pp-content { padding: 1rem; }
  }
  @media(max-width:480px) {
    .pp-grid { grid-template-columns: 1fr; }
    .pp-header-inner { flex-wrap: wrap; }
  }
`;

const PAGE_SIZE = 12;

/* ═══════════════════════════════════════
   PROPERTIES PAGE
═══════════════════════════════════════ */
export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [search,   setSearch]   = useState(searchParams.get("search")   || "");
  const [district, setDistrict] = useState(searchParams.get("district") || "");
  const [type,     setType]     = useState(searchParams.get("type")     || "");
  const [listing,  setListing]  = useState(searchParams.get("listing")  || "");
  const [sort,     setSort]     = useState("newest");
  const [page,     setPage]     = useState(1);

  const [all,      setAll]      = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/hostels?limit=500`)
      .then(r => r.json())
      .then(data => setAll(data.hostels || data.properties || data.data || []))
      .catch(() => setAll([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setDistrict(searchParams.get("district") || "");
    setType(searchParams.get("type")         || "");
    setSearch(searchParams.get("search")     || "");
    setPage(1);
  }, [searchParams.toString()]);

  const filtered = all
    .map(normalise)
    .filter(p => {
      if (search   && !p.name.toLowerCase().includes(search.toLowerCase())
                   && !p.district.toLowerCase().includes(search.toLowerCase())
                   && !p.address.toLowerCase().includes(search.toLowerCase())) return false;
      if (district && p.district.toLowerCase() !== district.toLowerCase()) return false;
      if (type     && !p.type.toLowerCase().includes(type.toLowerCase())) return false;
      if (listing  && !p.listingType.toLowerCase().includes(listing.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "price-asc")  return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function clearFilters() {
    setSearch(""); setDistrict(""); setType(""); setListing(""); setPage(1);
    setSearchParams({});
  }

  function applyFilter(key, val) {
    const params = {};
    if (key !== "search"   && search)   params.search   = search;
    if (key !== "district" && district) params.district = district;
    if (key !== "type"     && type)     params.type     = type;
    if (key !== "listing"  && listing)  params.listing  = listing;
    if (val) params[key] = val;
    setSearchParams(params);
    setPage(1);
  }

  const hasFilters = search || district || type || listing;
  const contextLabel = district ? `in ${district}` : type ? `— ${type}` : "";

  return (
    <div className="pp-page">
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>

      {/* ── HEADER ── */}
      <div className="pp-header">
        <div className="pp-header-inner">
          <button className="pp-back" onClick={() => navigate("/")}>
            <i className="fa fa-arrow-left"/> Back to Home
          </button>
          <div className="pp-header-title">
            <h1>Properties {contextLabel}</h1>
            <p>PezaNyumba — All listings across Malawi</p>
          </div>
          {!loading && (
            <div className="pp-header-count">
              <i className="fa fa-building" style={{marginRight:6}}/>{filtered.length} listings
            </div>
          )}
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="pp-filters">
        <div className="pp-filters-inner">
          <div className="pp-filter-search">
            <i className="fa fa-search"/>
            <input
              type="text"
              placeholder="Search name, district, address…"
              value={search}
              onChange={e => { setSearch(e.target.value); applyFilter("search", e.target.value); }}
            />
          </div>

          <div className="pp-filter-group">
            <label><i className="fa fa-map-marker-alt"/> District</label>
            <select value={district} onChange={e => { setDistrict(e.target.value); applyFilter("district", e.target.value); }}>
              <option value="">All Districts</option>
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="pp-filter-group">
            <label><i className="fa fa-home"/> Type</label>
            <select value={type} onChange={e => { setType(e.target.value); applyFilter("type", e.target.value); }}>
              <option value="">All Types</option>
              {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="pp-filter-tabs">
            {[["", "All"], ["rent", "For Rent"], ["sale", "For Sale"]].map(([val, label]) => (
              <button
                key={val}
                className={`pp-filter-tab${listing === val ? " active" : ""}`}
                onClick={() => { setListing(val); applyFilter("listing", val); }}
              >{label}</button>
            ))}
          </div>

          {hasFilters && (
            <button className="pp-filter-clear" onClick={clearFilters}>
              <i className="fa fa-times"/> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="pp-content">
        {loading ? (
          <div className="pp-loading">
            <div className="pp-spinner"/>
            <span>Loading properties…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="pp-empty">
            <div className="pp-empty-icon"><i className="fa fa-search"/></div>
            <h3>No properties found</h3>
            <p>{hasFilters ? "Try adjusting your filters or search terms." : "No listings available yet. Check back soon!"}</p>
            {hasFilters && <button className="pp-empty-btn" onClick={clearFilters}>Clear all filters</button>}
          </div>
        ) : (
          <>
            <div className="pp-result-info">
              <p>Showing <strong>{paged.length}</strong> of <strong>{filtered.length}</strong> properties</p>
              <div className="pp-sort">
                <i className="fa fa-sort"/> Sort:
                <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
                  <option value="newest">Newest first</option>
                  <option value="price-asc">Price: Low to high</option>
                  <option value="price-desc">Price: High to low</option>
                </select>
              </div>
            </div>

            <div className="pp-grid">
              {paged.map((p, i) => (
                <PropertyCard key={p._id || i} property={p}/>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pp-pagination">
                <button className="pp-page-btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>
                  <i className="fa fa-chevron-left"/>
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
                  return (
                    <button key={p} className={`pp-page-btn${page === p ? " active" : ""}`}
                      onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                      {p}
                    </button>
                  );
                })}
                <button className="pp-page-btn" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>
                  <i className="fa fa-chevron-right"/>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}