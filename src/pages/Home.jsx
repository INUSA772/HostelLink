import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ═══════════════════════════════════════
   LANGUAGE SYSTEM  (unchanged)
═══════════════════════════════════════ */
const LANGS = {
  en: {
    code: "en", label: "English", flag: "🇬🇧",
    switchLang: "Language",
    heroBadge:   "Finding homes across Malawi — No sign-up required",
    heroH1a:     "Find Your",
    heroH1em:    "Perfect Home",
    heroH1b:     "Anywhere in Malawi",
    heroSub:     "No account needed. Browse verified houses, flats, and plots for rent or sale across all 28 districts — just pick your district and start exploring.",
    heroBrowse:  "Browse Properties",
    heroList:    "List Your Property",
    heroTrust1:  "No account to browse",
    heroTrust2:  "WhatsApp landlords directly",
    heroTrust3:  "List your property for free. No commission",
    heroStat1:   "Properties Listed",
    heroStat2:   "Districts Covered",
    heroStat3:   "Dispute Protection",
    heroLocation: "Location",
    heroPropType: "Property Type",
    heroPriceRange:"Price Range",
    heroSearch:  "Search",
    trust1: "Registered Malawian platform",
    trust2: "No account needed to browse",
    trust3: "WhatsApp landlords directly",
    trust4: "All 28 districts covered",
    trust5: "Dispute protection built in",
    distLabel:   "Browse by location",
    distTitle1:  "Find Properties by",
    distTitle2:  "District",
    distSub:     "Search by location or type — swipe or use arrows to explore all listings.",
    distSearch:  "Search district or property name…",
    distAllTypes:"All types",
    distBtn:     "Search",
    distLoading: "Loading properties…",
    distEmpty:   "No properties found. Try a different search.",
    typesLabel:  "What are you looking for?",
    typesTitle1: "Browse by",
    typesTitle2: "Property Type",
    typesSub:    "Tap any type to instantly see live listings — no sign-up needed.",
    locsLabel:   "Our property areas",
    locsTitle1:  "Top Locations Across",
    locsTitle2:  "Malawi",
    tenantTitle: "For Tenants & Buyers",
    tenantNote:  "✓ No account required",
    tenantDesc:  "Browse all verified properties, view photos, see prices, and get landlord contact info directly — completely free, no sign-up needed.",
    tenantBtn:   "Start Browsing",
    landlordTitle:"For Landlords & Owners",
    landlordNote: "✓ Register to list properties",
    landlordDesc: "Create a landlord account to list your house, flat, room, or plot. Tenants WhatsApp you directly from your listing.",
    landlordBtn:  "Register as Landlord",
    featLabel:   "Why choose us",
    featTitle1:  "Why Choose",
    featTitle2:  "PezaNyumba?",
    feat1Title:  "Browse Freely",
    feat1Desc:   "No account needed. Filter by district, price, and type to find your home instantly.",
    feat2Title:  "WhatsApp Direct",
    feat2Desc:   "Tap WhatsApp on any listing to message the landlord instantly — no middlemen.",
    feat3Title:  "Verified Listings",
    feat3Desc:   "Every landlord is verified before listing to protect tenants from fraud.",
    feat4Title:  "Dispute Resolution",
    feat4Desc:   "If a problem arises, our team mediates and resolves it fairly and quickly.",
    faqQ1: "How do I find a house on PezaNyumba?",
    faqA1: "No account needed! Browse by district or type, view full details, then WhatsApp or call the landlord directly.",
    faqQ2: "Do I need an account to search?",
    faqA2: "No. Tenants and buyers browse all listings, see prices and photos, and contact landlords completely free.",
    faqQ3: "Who can create an account on PezaNyumba?",
    faqA3: "Only landlords and land owners. Tenants just browse freely — no sign-up needed.",
    faqQ4: "How does PezaNyumba verify landlords?",
    faqA4: "Every landlord goes through identity and property verification before their listing goes live.",
    faqQ5: "Can I list my property?",
    faqA5: "Yes — if you're a landlord or land owner. Register, fill in details, upload photos, and your listing goes live within 24 hours.",
    ctaTitle: "Are you a Landlord or Land Owner?",
    ctaSub:   "Register once and start listing your properties to thousands of tenants across Malawi.",
    ctaBtn:   "Register as Landlord",
    ctaNote:  "Already have an account?",
    ctaLogin: "Sign in here",
    drawerLoading: "Searching listings…",
    drawerEmpty1:  "No listings found for",
    drawerEmpty2:  "Check back soon — landlords are adding new properties every day.",
    drawerShowing: "Showing",
    drawerPropsIn: "properties in",
    drawerListings:"listings",
    drawerViewAll: "View All",
    ptHouse:  "House",          ptHouseDesc:  "Family homes",
    ptFlat:   "Flat/Apartment", ptFlatDesc:   "Modern apartments",
    ptRoom:   "Single Room",    ptRoomDesc:   "Affordable rooms",
    ptSelf:   "Self-Contained", ptSelfDesc:   "Own entrance & bath",
    ptPlot:   "Plot of Land",   ptPlotDesc:   "Build your dream",
    ptComm:   "Commercial Space",ptCommDesc:  "Shops & offices",
    cardVerified: "Verified Properties", cardVerifiedSub: "All listings checked & approved",
    cardPrices:   "Best Prices",         cardPricesSub:   "Affordable for every budget",
    cardTrusted:  "Trusted Landlords",   cardTrustedSub:  "Identity-verified owners",
    cardDistricts:"All Districts",       cardDistrictsSub:"28 districts covered",
    cardQuick:    "Quick Inquiry",       cardQuickSub:    "Contact landlords in seconds",
    cardDispute:  "Dispute Support",     cardDisputeSub:  "We resolve problems fairly",
    cardDirect:   "Direct Messaging",    cardDirectSub:   "Chat with landlords safely",
    cardRated:    "Top Rated",           cardRatedSub:    "Reviews from real tenants",
    forSale: "For Sale", forRent: "For Rent",
    noContact: "No contact info",
    waBtn: "WhatsApp", callBtn: "Call",
    bed: "bed", bath: "bath", avail: "avail.",
    priceOnRequest: "Price on request",
  },
  ny: {
    code: "ny", label: "Chichewa", flag: "🇲🇼",
    switchLang: "Chilankhulo",
    heroBadge:   "Kupeza nyumba ku Malawi konse — Palibe akaunti yofunikira",
    heroH1a:     "Pezani",
    heroH1em:    "Nyumba Yabwino",
    heroH1b:     "Kulikonse ku Malawi",
    heroSub:     "Palibe akaunti yofunikira. Sakani nyumba zazikulu, nyumba zazing'ono, ndi malo ogulitsa ku maboma onse 28.",
    heroBrowse:  "Sakani Nyumba",
    heroList:    "Ikani Nyumba Yanu",
    heroTrust1:  "Simukuyenera akaunti",
    heroTrust2:  "WhatsApp mwini nyumba",
    heroTrust3:  "Kuyika nyumba ndiulele",
    heroStat1:   "Nyumba zomwe zilipo",
    heroStat2:   "Maboma Alipo",
    heroStat3:   "Chitetezo",
    heroLocation: "Malo",
    heroPropType: "Mtundu wa Nyumba",
    heroPriceRange:"Mtengo",
    heroSearch:  "Sakani",
    trust1: "Nsanja yolembetsedwa ku Malawi",
    trust2: "Palibe akaunti yosaka",
    trust3: "WhatsApp mwini nyumba mwachindunji",
    trust4: "Madisitikiti onse 28 alipo",
    trust5: "Chitetezo cha mikangano chili",
    distLabel: "Saka malalo", distTitle1: "Pezani Nyumba pa", distTitle2: "Boma",
    distSub: "Sakani malalo kapena mtundu.", distSearch: "Sakani boma kapena dzina…",
    distAllTypes: "Mitundu yonse", distBtn: "Sakani",
    distLoading: "Kutsitsa nyumba…", distEmpty: "Palibe nyumba. Yesani kusaka kwina.",
    typesLabel: "Mukufuna chiyani?", typesTitle1: "Sakani pa", typesTitle2: "Mtundu wa Nyumba",
    typesSub: "Dinani mtundu kuona nyumba.", locsLabel: "Malalo athu",
    locsTitle1: "Malalo Okwaniritsa ku", locsTitle2: "Malawi",
    tenantTitle: "Okangomanga & Ogula", tenantNote: "✓ Palibe akaunti",
    tenantDesc: "Sakani nyumba, onani zithunzi, ndikupeza nomboro mwachindunji.", tenantBtn: "Yambani Kusaka",
    landlordTitle: "Eni Nyumba ndi Malo", landlordNote: "✓ Lembelani ndi kuika",
    landlordDesc: "Pangani akaunti kuika nyumba yanu. Anthu akuzimbani WhatsApp.", landlordBtn: "Lembeleni ngati Mwini Nyumba",
    featLabel: "Chifukwa chosankha ife", featTitle1: "Chifukwa Kusankha", featTitle2: "PezaNyumba?",
    feat1Title: "Sakani Mwaulere", feat1Desc: "Palibe akaunti. Sakani pa boma, mtengo, ndi mtundu.",
    feat2Title: "WhatsApp Mwachindunji", feat2Desc: "Dinani WhatsApp pa nyumba iliyonse.",
    feat3Title: "Nyumba Zazikulu", feat3Desc: "Mwini nyumba aliyense amayezetsa kaye.",
    feat4Title: "Kutha Mikangano", feat4Desc: "Timagwira ntchito ngati pakati kutha vutolo.",
    faqQ1: "Ndingapeze bwanji nyumba?", faqA1: "Palibe akaunti! Saka, onani, kenako imbani WhatsApp.",
    faqQ2: "Ndikufunika akaunti?", faqA2: "Ayi. Ayang'ana mauthenga onse mwaulere.",
    faqQ3: "Ndani amatha kupanga akaunti?", faqA3: "Eni nyumba ndi eni malo okha.",
    faqQ4: "PezaNyumba imayeza bwanji?", faqA4: "Mwini nyumba aliyense amayeza asanapange.",
    faqQ5: "Nditha kuika nyumba?", faqA5: "Inde. Lembeleni, uzuzeni zambiri, ikani zithunzi.",
    ctaTitle: "Kodi ndinu Mwini Nyumba?", ctaSub: "Lembeleni ndiyamba kuika nyumba zanu.",
    ctaBtn: "Lembelani ngati Mwini Nyumba", ctaNote: "Muli ndi akaunti kale?", ctaLogin: "Lowani apa",
    drawerLoading: "Kusaka…", drawerEmpty1: "Palibe nyumba pa", drawerEmpty2: "Bwererani posachedwa.",
    drawerShowing: "Kuwonetsa", drawerPropsIn: "nyumba ku", drawerListings: "mauthenga", drawerViewAll: "Ona Zonse",
    ptHouse: "Nyumba", ptHouseDesc: "Nyumba za mabanja", ptFlat: "Flat/Apartment", ptFlatDesc: "Ma apartment",
    ptRoom: "Chipinda Chimodzi", ptRoomDesc: "Zipinda zotsika", ptSelf: "Self-Contained", ptSelfDesc: "Khomo lake",
    ptPlot: "Gawo la Malo", ptPlotDesc: "Mangani lofunira", ptComm: "Malo a Bizinesi", ptCommDesc: "Masitolo",
    cardVerified: "Nyumba Zazikulu", cardVerifiedSub: "Mauthenga onse ayezedwa",
    cardPrices: "Mitengo Yabwino", cardPricesSub: "Yoyenera bajeti",
    cardTrusted: "Eni Nyumba Oyesedwa", cardTrustedSub: "Eni onyezedwa",
    cardDistricts: "Madisitikiti Onse", cardDistrictsSub: "Madisitikiti 28",
    cardQuick: "Funsani Msanga", cardQuickSub: "Lumikizani msanga",
    cardDispute: "Thandizo la Mikangano", cardDisputeSub: "Timaitha mavuto",
    cardDirect: "Uthenga Wachindunji", cardDirectSub: "Lankhulani motetezeka",
    cardRated: "Woyezetsa Kwambiri", cardRatedSub: "Maganizo a weniweni",
    forSale: "Kugulitsa", forRent: "Kugwiritsa", noContact: "Palibe nomboro",
    waBtn: "WhatsApp", callBtn: "Imbani", bed: "chipinda", bath: "bafa", avail: "palibe.", priceOnRequest: "Funsani mtengo",
  },
  tu: {
    code: "tu", label: "Tumbuka", flag: "🇲🇼",
    switchLang: "Chilankhulo",
    heroBadge: "Kupeza nyumba ku Malawi yose — Palije akaunti yofunikira",
    heroH1a: "Peza", heroH1em: "Nyumba Yabwino", heroH1b: "Kulikonse ku Malawi",
    heroSub: "Palije akaunti. Saka nyumba, ma flat, na malo mu madisitiriki yose 28.",
    heroBrowse: "Saka Nyumba", heroList: "Lemba Nyumba Yako",
    heroTrust1: "Palije akaunti yosaka", heroTrust2: "WhatsApp mwenye nyumba", heroTrust3: "Ndalama 2.5% yokha",
    heroStat1: "Nyumba Zalembiwa", heroStat2: "Madisitiriki Yalipo", heroStat3: "Chitetezo",
    heroLocation: "Malo", heroPropType: "Mtundu wa Nyumba", heroPriceRange: "Mtengo", heroSearch: "Saka",
    trust1: "Nsanja yolembiwa ku Malawi", trust2: "Palije akaunti yosaka",
    trust3: "WhatsApp mwenye nyumba", trust4: "Madisitiriki yose 28", trust5: "Chitetezo chili",
    distLabel: "Saka malo", distTitle1: "Peza Nyumba mu", distTitle2: "Disitiriki",
    distSub: "Saka malo panji mtundu.", distSearch: "Saka disitiriki panji zina…",
    distAllTypes: "Mitundu yose", distBtn: "Saka",
    distLoading: "Kutsitsa nyumba…", distEmpty: "Palije nyumba. Yesani kusaka kina.",
    typesLabel: "Mukufuna chiyani?", typesTitle1: "Saka pa", typesTitle2: "Mtundu wa Nyumba",
    typesSub: "Dinani mtundu kuona nyumba.", locsLabel: "Malo yithu",
    locsTitle1: "Malo Yakwaniritsa ku", locsTitle2: "Malawi",
    tenantTitle: "Okusunga & Ogula", tenantNote: "✓ Palije akaunti",
    tenantDesc: "Saka nyumba, ona zithunzi, na kupeza nambala mwachindunji.", tenantBtn: "Yambani Kusaka",
    landlordTitle: "Anenye Nyumba & Malo", landlordNote: "✓ Lemba kuika nyumba",
    landlordDesc: "Pangani akaunti kuika nyumba yinu. Anthu akuzimbani WhatsApp.", landlordBtn: "Lembani nga Mwenye Nyumba",
    featLabel: "Chifukwa chosankha ife", featTitle1: "Chifukwa Kusankha", featTitle2: "PezaNyumba?",
    feat1Title: "Saka Mwaulere", feat1Desc: "Palije akaunti. Saka pa disitiriki, mtengo, na mtundu.",
    feat2Title: "WhatsApp Mwachindunji", feat2Desc: "Dinani WhatsApp pa nyumba iliyonse.",
    feat3Title: "Nyumba Zayezedwa", feat3Desc: "Mwenye nyumba uliwonse wayezedwa.",
    feat4Title: "Kutha Mikangano", feat4Desc: "Tigwira ntchito nga pakati kutha vutolo.",
    faqQ1: "Ndingapeze wuli nyumba?", faqA1: "Palije akaunti! Saka, ona, kenako zimba WhatsApp.",
    faqQ2: "Ndikufunika akaunti?", faqA2: "Yayi. Yayang'ana mauthenga yose mwaulere.",
    faqQ3: "Ndani angapange akaunti?", faqA3: "Anenye nyumba na anenye malo yokha.",
    faqQ4: "PezaNyumba iyeza wuli?", faqA4: "Mwenye nyumba uliwonse wayezedwa asanapange.",
    faqQ5: "Ningaike nyumba yane?", faqA5: "Inde. Lembani, uzuzani, ikani zithunzi.",
    ctaTitle: "Kodi ndimwenye Nyumba?", ctaSub: "Lembani ndiyamba kuika nyumba zinu.",
    ctaBtn: "Lembani nga Mwenye Nyumba", ctaNote: "Muli na akaunti kale?", ctaLogin: "Injilani apha",
    drawerLoading: "Kusaka…", drawerEmpty1: "Palije nyumba pa", drawerEmpty2: "Bwelerani posachedwa.",
    drawerShowing: "Kuwonetsa", drawerPropsIn: "nyumba mu", drawerListings: "mauthenga", drawerViewAll: "Ona Yose",
    ptHouse: "Nyumba", ptHouseDesc: "Nyumba za mabanja", ptFlat: "Flat/Apartment", ptFlatDesc: "Ma apartment",
    ptRoom: "Chipinda Chimoza", ptRoomDesc: "Zipinda zotauka", ptSelf: "Self-Contained", ptSelfDesc: "Khomo lake",
    ptPlot: "Gawo la Malo", ptPlotDesc: "Manga lofunira", ptComm: "Malo ya Bizinesi", ptCommDesc: "Masitolo",
    cardVerified: "Nyumba Zayezedwa", cardVerifiedSub: "Mauthenga yose yayezedwa",
    cardPrices: "Mitengo Yabwino", cardPricesSub: "Yoyenera bajeti",
    cardTrusted: "Anenye Nyumba Oyezedwa", cardTrustedSub: "Anenye oyezedwa",
    cardDistricts: "Madisitiriki Yose", cardDistrictsSub: "Madisitiriki 28",
    cardQuick: "Funsani Msanga", cardQuickSub: "Lumikizani msanga",
    cardDispute: "Thandizo la Mikangano", cardDisputeSub: "Yiitha mavuto",
    cardDirect: "Uthenga Wachindunji", cardDirectSub: "Lankhulani motetezeka",
    cardRated: "Woyezedwa Kwambiri", cardRatedSub: "Maganizo ya weniweni",
    forSale: "Kugulitsa", forRent: "Kukodisha", noContact: "Palije nambala",
    waBtn: "WhatsApp", callBtn: "Zimba", bed: "chipinda", bath: "bafa", avail: "palipo.", priceOnRequest: "Funsani mtengo",
  },
};

const LangContext = createContext(null);
const useLang = () => useContext(LangContext);

function useLangState() {
  const [lang, setLangRaw] = useState(() => {
    try { return localStorage.getItem("peza_lang") || "en"; } catch { return "en"; }
  });
  const setLang = (code) => {
    setLangRaw(code);
    try { localStorage.setItem("peza_lang", code); } catch {}
  };
  const t = LANGS[lang] || LANGS.en;
  return { lang, setLang, t, langs: Object.values(LANGS) };
}

/* ═══════════════════════════════════════
   LANGUAGE SWITCHER
═══════════════════════════════════════ */
const langSwitcherStyles = `
  .ph-lang-switcher { position: fixed; top: 14px; right: 14px; z-index: 9999; }
  .ph-lang-btn { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.35); border-radius: 999px; padding: 7px 14px 7px 10px; color: white; font-size: .82rem; font-weight: 700; cursor: pointer; backdrop-filter: blur(10px); box-shadow: 0 4px 20px rgba(0,0,0,.2); transition: all .2s; font-family: 'Manrope', sans-serif; white-space: nowrap; }
  .ph-lang-btn:hover { background: rgba(255,255,255,0.25); }
  .ph-lang-btn .ph-lang-flag { font-size: 1rem; line-height: 1; }
  .ph-lang-btn .ph-lang-chevron { font-size: .6rem; opacity: .7; transition: transform .2s; }
  .ph-lang-btn.open .ph-lang-chevron { transform: rotate(180deg); }
  .ph-lang-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: white; border: 1.5px solid #e2ede9; border-radius: 14px; box-shadow: 0 16px 48px rgba(0,0,0,.16); overflow: hidden; min-width: 170px; animation: langDrop .18s cubic-bezier(.34,1.56,.64,1); }
  @keyframes langDrop { from { opacity:0; transform:translateY(-8px) scale(.96); } to { opacity:1; transform:translateY(0) scale(1); } }
  .ph-lang-option { display: flex; align-items: center; gap: 10px; width: 100%; padding: 11px 16px; font-size: .85rem; font-weight: 600; color: #111; background: white; border: none; cursor: pointer; text-align: left; transition: background .15s; font-family: 'Manrope', sans-serif; }
  .ph-lang-option:hover { background: #f0faf7; }
  .ph-lang-option.active { background: #e8f5f2; color: #0d4a40; }
  .ph-lang-option .ph-lang-opt-flag { font-size: 1.1rem; }
  .ph-lang-option .ph-lang-opt-label { flex: 1; }
  .ph-lang-option .ph-lang-opt-check { color: #1a5c52; font-size: .8rem; }
  .ph-lang-divider { height: 1px; background: #e2ede9; margin: 0; }
  @media(max-width:480px) { .ph-lang-switcher { top: 10px; right: 10px; } .ph-lang-btn { padding: 6px 11px 6px 9px; font-size: .78rem; } }
`;

function LanguageSwitcher() {
  const { lang, setLang, t, langs } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const current = LANGS[lang] || LANGS.en;
  return (
    <div className="ph-lang-switcher" ref={ref}>
      <button className={`ph-lang-btn${open ? " open" : ""}`} onClick={() => setOpen(o => !o)} aria-label="Switch language">
        <span className="ph-lang-flag">{current.flag}</span>
        <span>{current.label}</span>
        <span className="ph-lang-chevron">▼</span>
      </button>
      {open && (
        <div className="ph-lang-dropdown">
          {langs.map((l, i) => (
            <div key={l.code}>
              {i > 0 && <div className="ph-lang-divider" />}
              <button className={`ph-lang-option${lang === l.code ? " active" : ""}`} onClick={() => { setLang(l.code); setOpen(false); }}>
                <span className="ph-lang-opt-flag">{l.flag}</span>
                <span className="ph-lang-opt-label">{l.label}</span>
                {lang === l.code && <span className="ph-lang-opt-check">✓</span>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   HELPERS  (unchanged)
═══════════════════════════════════════ */
function waLink(num) {
  if (!num) return null;
  const clean = num.toString().replace(/\D/g, "");
  const intl  = clean.startsWith("0") ? "265" + clean.slice(1) : clean;
  return `https://wa.me/${intl}`;
}
function trackWhatsappClick(hostelId) {
  if (!hostelId) return;
  fetch(`${API_URL}/admin/hostels/${hostelId}/whatsapp-click`, { method: "POST" }).catch(() => {});
}
function normalise(p) {
  return {
    _id: p._id || p.id,
    name: p.name || p.title || "Unnamed Property",
    description: p.description || "",
    type: p.type || p.propertyType || p.property_type || "",
    listingType: p.listingType || p.listing_type || "For Rent",
    price: p.price || 0,
    district: p.district || p.location?.formattedAddress?.split(",").pop()?.trim() || "",
    address: p.address || p.location?.formattedAddress || "",
    bedrooms: p.bedrooms || p.beds || 0,
    bathrooms: p.bathrooms || p.baths || 0,
    availableRooms: p.availableRooms || p.available_rooms || 0,
    gender: p.gender || "",
    amenities: p.amenities || [],
    images: p.images || p.photos || [],
    contactPhone: p.contactPhone || p.owner?.phone || p.phone || "",
    whatsapp: p.whatsapp || p.contactPhone || p.owner?.phone || p.phone || "",
    ownerName: p.owner ? `${p.owner.firstName || ""} ${p.owner.lastName || ""}`.trim() : "",
  };
}
function formatPrice(p, listingType, t) {
  if (!p) return t.priceOnRequest;
  const suffix = (listingType || "").toLowerCase().includes("sale") ? "" : "/mo";
  return "MWK " + Number(p).toLocaleString() + suffix;
}

/* ═══════════════════════════════════════
   STYLES
═══════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --teal-dark:#0d4a40; --teal:#1a5c52; --teal-mid:#2d8a72;
    --teal-light:#e8f5f2; --teal-pale:#f0faf7;
    --cream:#f8f9f7; --white:#fff; --gray-bg:#f4f6f4;
    --dark:#0a0a0a; --mid:#4b5563; --light-border:#e2ede9;
    --radius:14px; --green-check:#22c55e; --wa:#25D366;
  }
  html { scroll-behavior: smooth; }
  body { font-family:'Manrope',sans-serif; color:var(--dark); background:#fff; overflow-x:hidden; }
  a { text-decoration:none; color:inherit; }
  button { font-family:inherit; cursor:pointer; border:none; background:none; padding:0; }

  /* ══════════════════════════════════════
     NAVBAR  — white, clean, like the image
  ══════════════════════════════════════ */
  .ph-navbar {
    position: absolute; top: 0; left: 0; right: 0; z-index: 100;
    height: 70px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 3rem;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 2px 20px rgba(0,0,0,0.08);
  }
  .ph-navbar-logo { display:flex; align-items:center; gap:10px; text-decoration:none; }
  .ph-navbar-logo-icon {
    width: 38px; height: 38px; border-radius: 10px; overflow: hidden;
    border: 2px solid var(--teal-light); flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: var(--teal-light); font-weight: 800; color: var(--teal); font-size: 15px;
  }
  .ph-navbar-logo-icon img { width: 100%; height: 100%; object-fit: cover; }
  .ph-navbar-logo-name { font-size: 1.1rem; font-weight: 800; color: var(--teal-dark); letter-spacing: -0.3px; }
  .ph-navbar-links { display: flex; align-items: center; gap: 0.25rem; }
  .ph-navbar-link {
    padding: 0.45rem 1rem; color: #374151; font-size: 0.88rem; font-weight: 600;
    border-radius: 8px; transition: all 0.18s; text-decoration: none;
  }
  .ph-navbar-link:hover { background: var(--teal-pale); color: var(--teal-dark); }
  .ph-navbar-actions { display: flex; align-items: center; gap: 0.6rem; }
  .ph-navbar-login {
    color: var(--teal-dark); font-size: 0.88rem; font-weight: 600;
    padding: 0.45rem 1rem; border-radius: 8px; transition: all 0.18s; text-decoration: none;
  }
  .ph-navbar-login:hover { background: var(--teal-pale); }
  .ph-navbar-cta {
    background: var(--teal-dark); color: white; font-size: 0.88rem; font-weight: 700;
    padding: 0.6rem 1.4rem; border-radius: 8px; text-decoration: none;
    transition: all 0.18s; display: inline-flex; align-items: center; gap: 6px;
    box-shadow: 0 4px 14px rgba(13,74,64,0.3);
  }
  .ph-navbar-cta:hover { background: var(--teal); transform: translateY(-1px); }
  @media(max-width:768px) {
    .ph-navbar { padding: 0 1.2rem; }
    .ph-navbar-links { display: none; }
    .ph-navbar-login { display: none; }
  }

  /* ══════════════════════════════════════
     HERO  — full-bleed photo, inspired by image
  ══════════════════════════════════════ */
  .ph-hero {
    position: relative; width: 100%; min-height: 100vh;
    background-image: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80');
    background-size: cover; background-position: center;
    display: flex; flex-direction: column; justify-content: flex-end;
    padding-bottom: 0;
    overflow: hidden;
  }
  /* Dark overlay — warm neutral like in the image (not green tint) */
  .ph-hero::before {
    content: ''; position: absolute; inset: 0; z-index: 1;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.15) 0%,
      rgba(0,0,0,0.35) 40%,
      rgba(0,0,0,0.65) 75%,
      rgba(0,0,0,0.78) 100%
    );
  }
  .ph-hero-content {
    position: relative; z-index: 2;
    max-width: 1200px; margin: 0 auto; width: 100%;
    padding: 0 3rem;
    display: flex; flex-direction: column;
    padding-top: 140px;
    padding-bottom: 60px;
  }
  /* Headline — bold, large, white, left-aligned like in the image */
  .ph-hero-headline {
    font-family: 'Poppins', sans-serif;
    font-size: clamp(2.6rem, 6vw, 4.5rem);
    font-weight: 800;
    color: white;
    line-height: 1.1;
    letter-spacing: -1px;
    margin-bottom: 1rem;
    max-width: 680px;
    text-transform: uppercase;
  }
  .ph-hero-headline em { color: #4dd9b8; font-style: normal; }
  .ph-hero-sub {
    font-size: clamp(0.9rem, 1.8vw, 1.05rem);
    color: rgba(255,255,255,0.78);
    max-width: 520px;
    line-height: 1.75;
    margin-bottom: 2rem;
    font-weight: 500;
  }
  /* Trust row */
  .ph-hero-trust { display: flex; gap: 2rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
  .ph-hero-trust-item { display: flex; align-items: center; gap: 6px; font-size: .83rem; font-weight: 600; color: rgba(255,255,255,0.85); }
  .ph-hero-trust-item i { color: #4dd9b8; font-size: 0.95rem; }

  /* Stats row */
  .ph-hero-stats { display: flex; gap: 2.5rem; flex-wrap: wrap; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.18); margin-bottom: 2.5rem; }
  .ph-hero-stat strong { display: block; font-family: 'Poppins', sans-serif; font-size: 1.5rem; font-weight: 800; color: #4dd9b8; }
  .ph-hero-stat span { font-size: .76rem; color: rgba(255,255,255,0.5); }

  /* ══════════════════════════════════════
     SEARCH BAR  — floating bottom of hero, like in the image
  ══════════════════════════════════════ */
  .ph-hero-search-wrap {
    position: relative; z-index: 2;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(16px);
    border-radius: 14px;
    padding: 1.5rem 1.75rem;
    max-width: 900px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.25);
    display: flex; align-items: flex-end; gap: 1rem; flex-wrap: wrap;
    margin-bottom: 0;
  }
  .ph-search-field { flex: 1; min-width: 160px; }
  .ph-search-field label {
    display: block; font-size: 0.7rem; font-weight: 700; color: #374151;
    text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 0.4rem;
  }
  .ph-search-select {
    width: 100%; padding: 0.65rem 1rem; border: 1.5px solid #e2ede9;
    border-radius: 8px; font-size: 0.88rem; color: #374151;
    background: white; outline: none; font-family: 'Manrope', sans-serif;
    cursor: pointer; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%236b7280' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 0.75rem center;
    transition: border 0.2s;
  }
  .ph-search-select:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(26,92,82,0.12); }
  .ph-search-input {
    width: 100%; padding: 0.65rem 1rem; border: 1.5px solid #e2ede9;
    border-radius: 8px; font-size: 0.88rem; color: #374151;
    background: white; outline: none; font-family: 'Manrope', sans-serif; transition: border 0.2s;
  }
  .ph-search-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(26,92,82,0.12); }
  .ph-search-input::placeholder { color: #9ca3af; }
  .ph-search-btn {
    background: var(--teal-dark); color: white; border: none;
    padding: 0.7rem 1.8rem; border-radius: 8px; font-size: 0.9rem; font-weight: 700;
    cursor: pointer; display: inline-flex; align-items: center; gap: 7px;
    font-family: 'Manrope', sans-serif; transition: all 0.2s; white-space: nowrap;
    box-shadow: 0 4px 14px rgba(13,74,64,0.3); height: 42px;
  }
  .ph-search-btn:hover { background: var(--teal); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(13,74,64,0.4); }

  /* Section below hero — where search bar overlaps */
  .ph-hero-bottom-strip {
    background: var(--white);
    padding: 0 3rem;
    display: flex; justify-content: center;
    padding-top: 0; position: relative; z-index: 3;
  }

  @media(max-width:768px) {
    .ph-hero-content { padding: 0 1.2rem; padding-top: 120px; padding-bottom: 40px; }
    .ph-hero-headline { font-size: clamp(2rem, 8vw, 2.8rem); }
    .ph-hero-search-wrap { padding: 1.2rem; flex-direction: column; }
    .ph-search-field { min-width: 100%; }
    .ph-search-btn { width: 100%; justify-content: center; }
    .ph-hero-trust { gap: 1rem; }
    .ph-hero-stats { gap: 1.5rem; }
    .ph-hero-bottom-strip { padding: 0 1.2rem; }
  }
  @media(max-width:480px) {
    .ph-navbar { padding: 0 1rem; }
    .ph-hero-headline { font-size: 2rem; letter-spacing: -0.5px; }
    .ph-hero-content { padding-top: 100px; padding-bottom: 30px; }
  }

  /* ══════════════════════════════════════
     REST OF STYLES  (unchanged from original)
  ══════════════════════════════════════ */
  .ph-trust-bar { background:var(--cream); border-top:1px solid var(--light-border); border-bottom:1px solid var(--light-border); padding:1.2rem; }
  .ph-trust-bar-inner { max-width:1100px; margin:0 auto; display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:2rem; }
  .ph-trust-item { display:flex; align-items:center; gap:8px; font-size:.84rem; font-weight:600; color:var(--mid); }
  .ph-trust-item i { font-size:1.1rem; color:var(--teal); }
  .ph-trust-divider { width:1px; height:28px; background:var(--light-border); }
  @media(max-width:640px){.ph-trust-divider{display:none}}
  .ph-sec-label { font-size:.73rem; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:var(--teal-mid); text-align:center; margin-bottom:.5rem; }
  .ph-sec-title { font-family:'Poppins',sans-serif; font-size:clamp(1.6rem,3.5vw,2.3rem); font-weight:800; text-align:center; line-height:1.15; margin-bottom:.6rem; }
  .ph-sec-title em { font-style:normal; color:var(--teal-mid); }
  .ph-sec-sub { text-align:center; font-size:.93rem; line-height:1.8; color:var(--mid); max-width:520px; margin:0 auto 2.5rem; }
  .ph-dist-sec { background:var(--gray-bg); padding:clamp(3rem,6vw,5.5rem) 1.2rem; }
  .ph-dist-search { display:flex; gap:.6rem; max-width:640px; margin:0 auto 2.5rem; flex-wrap:wrap; }
  .ph-dist-search input,.ph-dist-search select { flex:1; min-width:160px; padding:.65rem 1rem; border:1.5px solid #d1d5db; border-radius:10px; font-size:.88rem; background:white; color:#111; outline:none; font-family:inherit; transition:border .2s; }
  .ph-dist-search input:focus,.ph-dist-search select:focus{border-color:var(--teal)}
  .ph-dist-search-btn { background:var(--teal); color:white; border:none; border-radius:10px; padding:.65rem 1.4rem; font-size:.88rem; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition:background .2s; font-family:inherit; }
  .ph-dist-search-btn:hover{background:var(--teal-dark)}
  .ph-slider-viewport { overflow:hidden; max-width:1100px; margin:0 auto; position:relative; cursor:grab; user-select:none; -webkit-user-select:none; }
  .ph-slider-viewport:active { cursor:grabbing; }
  .ph-slider-track { display:flex; gap:1.2rem; transition:transform .55s cubic-bezier(.4,0,.2,1); will-change:transform; }
  .ph-slider-track.no-transition { transition:none !important; }
  .ph-slide-card { flex-shrink:0; width:240px; border-radius:16px; overflow:hidden; background:white; border:1.5px solid var(--light-border); cursor:pointer; text-align:left; padding:0; transition:transform .25s,box-shadow .25s; box-shadow:0 2px 12px rgba(0,0,0,.06); }
  .ph-slide-card:hover { transform:translateY(-6px); box-shadow:0 18px 40px rgba(13,74,64,.18); border-color:var(--teal-mid); }
  .ph-slide-img { width:100%; height:155px; object-fit:cover; display:block; pointer-events:none; }
  .ph-slide-body { padding:.95rem 1rem; }
  .ph-slide-district { font-size:.66rem; font-weight:700; text-transform:uppercase; letter-spacing:1.8px; color:var(--teal-mid); margin-bottom:.3rem; }
  .ph-slide-name { font-size:.93rem; font-weight:800; color:#111; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:.25rem; }
  .ph-slide-meta { font-size:.74rem; color:#6b7280; display:flex; gap:.7rem; margin-top:.35rem; flex-wrap:wrap; }
  .ph-slide-badge { display:inline-block; font-size:.64rem; font-weight:700; padding:2px 9px; border-radius:20px; background:var(--teal-light); color:var(--teal-dark); margin-top:.45rem; }
  .ph-slide-price { font-size:.92rem; font-weight:800; color:var(--teal); margin-top:.45rem; }
  .ph-prop-nav { display:flex; align-items:center; justify-content:space-between; max-width:1100px; margin:1.4rem auto 0; }
  .ph-prop-dots { display:flex; gap:6px; }
  .ph-prop-dot { width:8px; height:8px; border-radius:50%; background:#d1d5db; border:none; cursor:pointer; padding:0; transition:all .3s; }
  .ph-prop-dot.active { background:var(--teal); width:24px; border-radius:4px; }
  .ph-prop-nav-btns { display:flex; gap:.5rem; }
  .ph-prop-nav-btn { width:38px; height:38px; border-radius:50%; border:1.5px solid var(--teal); background:white; color:var(--teal); font-size:1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .2s; }
  .ph-prop-nav-btn:hover { background:var(--teal); color:white; }
  .ph-prop-empty { text-align:center; padding:2.5rem; color:var(--mid); font-size:.9rem; background:white; border-radius:var(--radius); border:1.5px dashed var(--light-border); }
  @media(max-width:1100px){ .ph-slide-card{ width: calc((100vw - 3.6rem) / 3) } }
  @media(max-width:768px)  { .ph-slide-card{ width: calc((100vw - 3rem) / 2) } }
  @media(max-width:520px)  { .ph-slide-card{ width: calc(100vw - 2.4rem) } }
  .ph-types-sec { background:white; padding:clamp(3rem,6vw,5.5rem) 1.2rem; }
  .ph-types-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(155px,1fr)); gap:1rem; max-width:1100px; margin:0 auto; }
  .ph-type-card { background:var(--teal-pale); border:1.5px solid var(--light-border); border-radius:var(--radius); padding:1.8rem 1rem; text-align:center; color:var(--dark); transition:all .25s; }
  .ph-type-card:hover { background:var(--teal); border-color:var(--teal); color:white; transform:translateY(-5px); box-shadow:0 12px 28px rgba(26,92,82,.20); }
  .ph-type-card i { font-size:1.7rem; color:var(--teal); display:block; margin-bottom:.75rem; transition:color .25s; }
  .ph-type-card:hover i { color:white; }
  .ph-type-card h4 { font-size:.95rem; font-weight:800; margin-bottom:.4rem; }
  .ph-type-card span { font-size:.72rem; color:var(--mid); transition:color .25s; }
  .ph-type-card:hover span { color:rgba(255,255,255,.80); }
  @media(max-width:520px){.ph-types-grid{grid-template-columns:repeat(2,1fr)}}
  .ph-browse-overlay { position:fixed; inset:0; background:rgba(5,22,10,.65); z-index:1000; display:flex; align-items:flex-end; justify-content:center; backdrop-filter:blur(4px); animation:fadeIn .25s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .ph-browse-drawer { background:white; width:100%; max-width:1100px; max-height:90vh; border-radius:20px 20px 0 0; display:flex; flex-direction:column; animation:slideUp .3s cubic-bezier(.34,1.56,.64,1); overflow:hidden; }
  @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
  .ph-browse-header { display:flex; align-items:center; justify-content:space-between; padding:1.4rem 1.6rem; border-bottom:1px solid var(--light-border); flex-shrink:0; }
  .ph-browse-header-left { display:flex; align-items:center; gap:.75rem; }
  .ph-browse-header-icon { width:40px; height:40px; border-radius:12px; background:var(--teal-light); display:flex; align-items:center; justify-content:center; font-size:1.1rem; color:var(--teal); }
  .ph-browse-header h3 { font-size:1.1rem; font-weight:800; color:var(--dark); }
  .ph-browse-header p  { font-size:.78rem; color:var(--mid); margin-top:1px; }
  .ph-browse-close { width:36px; height:36px; border-radius:10px; background:var(--gray-bg); border:1px solid var(--light-border); font-size:1.2rem; color:var(--mid); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .2s; }
  .ph-browse-close:hover { background:#fee2e2; color:#dc2626; border-color:#fca5a5; }
  .ph-browse-body { flex:1; overflow-y:auto; padding:1.4rem 1.6rem; }
  .ph-browse-loading { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:3rem; gap:1rem; color:var(--mid); font-size:.9rem; }
  .ph-spinner { width:36px; height:36px; border:3px solid var(--teal-light); border-top-color:var(--teal); border-radius:50%; animation:spin .7s linear infinite; }
  @keyframes spin { to{transform:rotate(360deg)} }
  .ph-browse-empty { text-align:center; padding:3rem 1rem; }
  .ph-browse-empty-icon { font-size:3rem; margin-bottom:1rem; opacity:.3; }
  .ph-browse-empty h4 { font-size:1rem; font-weight:700; color:var(--dark); margin-bottom:.5rem; }
  .ph-browse-empty p { font-size:.85rem; color:var(--mid); }
  .ph-prop-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:1.2rem; }
  .ph-browse-footer { padding:1rem 1.6rem; border-top:1px solid var(--light-border); display:flex; align-items:center; justify-content:space-between; flex-shrink:0; background:var(--teal-pale); }
  .ph-browse-footer p { font-size:.82rem; color:var(--mid); }
  .ph-browse-footer strong { color:var(--teal-dark); }
  .ph-browse-see-all { background:var(--teal); color:white; padding:.55rem 1.4rem; border-radius:8px; font-size:.85rem; font-weight:700; display:inline-flex; align-items:center; gap:6px; transition:background .2s; text-decoration:none; border:none; cursor:pointer; font-family:inherit; }
  .ph-browse-see-all:hover{background:var(--teal-dark)}
  .ph-prop-card { border:1.5px solid var(--light-border); border-radius:var(--radius); overflow:hidden; background:white; transition:all .25s; box-shadow:0 2px 8px rgba(0,0,0,.05); display:flex; flex-direction:column; }
  .ph-prop-card:hover { transform:translateY(-4px); box-shadow:0 12px 30px rgba(13,74,64,.12); border-color:var(--teal-mid); }
  .ph-prop-img-wrap { position:relative; height:170px; overflow:hidden; background:var(--teal-light); flex-shrink:0; }
  .ph-prop-img-wrap img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .4s; }
  .ph-prop-card:hover .ph-prop-img-wrap img { transform:scale(1.05); }
  .ph-prop-no-img { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:2.5rem; color:var(--teal-mid); opacity:.4; }
  .ph-prop-badges { position:absolute; top:10px; left:10px; display:flex; gap:5px; flex-wrap:wrap; }
  .ph-prop-badge { font-size:.66rem; font-weight:700; padding:3px 9px; border-radius:20px; text-transform:uppercase; letter-spacing:.5px; }
  .ph-prop-badge.rent { background:var(--teal); color:white; }
  .ph-prop-badge.sale { background:#0891b2; color:white; }
  .ph-prop-badge.type { background:rgba(255,255,255,.92); color:#374151; }
  .ph-prop-body { padding:1rem; flex:1; }
  .ph-prop-name { font-size:.95rem; font-weight:800; color:var(--dark); margin-bottom:.3rem; line-height:1.3; }
  .ph-prop-loc  { font-size:.76rem; color:var(--mid); display:flex; align-items:center; gap:4px; margin-bottom:.6rem; }
  .ph-prop-loc i { color:var(--teal); font-size:.72rem; }
  .ph-prop-price { font-size:1.05rem; font-weight:800; color:var(--teal-dark); }
  .ph-prop-meta { display:flex; gap:.8rem; margin-top:.5rem; flex-wrap:wrap; }
  .ph-prop-meta-item { font-size:.72rem; color:var(--mid); display:flex; align-items:center; gap:3px; }
  .ph-prop-meta-item i { color:var(--teal); }
  .ph-prop-actions { padding:.75rem 1rem; border-top:1px solid var(--light-border); display:flex; gap:.5rem; }
  .ph-prop-wa { flex:1; background:var(--wa); color:white; border:none; border-radius:8px; padding:.5rem .5rem; font-size:.78rem; font-weight:700; display:flex; align-items:center; justify-content:center; gap:5px; text-decoration:none; transition:background .18s; cursor:pointer; }
  .ph-prop-wa:hover { background:#128c4e; }
  .ph-prop-call { background:var(--teal-light); color:var(--teal); border:1.5px solid var(--light-border); border-radius:8px; padding:.5rem .75rem; font-size:.78rem; font-weight:700; display:flex; align-items:center; gap:5px; text-decoration:none; transition:all .18s; }
  .ph-prop-call:hover { background:var(--teal); color:white; }
  .ph-locs-sec { background:var(--teal-pale); padding:clamp(3rem,6vw,5.5rem) 1.2rem; }
  .ph-locs-grid { display:grid; grid-template-columns:2fr 1fr 1fr; grid-template-rows:220px 220px; gap:1rem; max-width:1100px; margin:2rem auto 0; }
  .ph-loc-card { border-radius:var(--radius); overflow:hidden; position:relative; border:none; background:transparent; padding:0; cursor:pointer; }
  .ph-loc-card img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .4s; }
  .ph-loc-card:hover img { transform:scale(1.06); }
  .ph-loc-card.big { grid-row:1/3; }
  .ph-loc-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(13,74,64,.80) 0%,transparent 55%); display:flex; flex-direction:column; justify-content:flex-end; padding:1.2rem; }
  .ph-loc-overlay small { color:rgba(255,255,255,.7); font-size:.74rem; }
  .ph-loc-overlay h4    { color:white; font-size:1rem; font-weight:700; }
  .ph-loc-overlay p     { color:rgba(255,255,255,.65); font-size:.8rem; }
  @media(max-width:768px){ .ph-locs-grid{grid-template-columns:1fr 1fr;grid-template-rows:auto} .ph-loc-card.big{grid-row:auto} .ph-loc-card{height:200px} }
  @media(max-width:520px){ .ph-locs-grid{grid-template-columns:1fr} .ph-loc-card{height:180px} }
  .ph-dual-sec { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:2rem; padding:clamp(3rem,6vw,5.5rem) 1.2rem; max-width:1100px; margin:0 auto; }
  .ph-dual-card { background:white; padding:2.5rem 2rem; border-radius:var(--radius); text-align:center; box-shadow:0 8px 28px rgba(13,74,64,.08); border:1px solid var(--light-border); transition:all .3s; display:flex; flex-direction:column; align-items:center; }
  .ph-dual-card:hover { transform:translateY(-8px); box-shadow:0 20px 50px rgba(13,74,64,.14); }
  .ph-dual-icon { font-size:2.5rem; margin-bottom:1rem; }
  .ph-dual-icon.tenant   { color:var(--teal); }
  .ph-dual-icon.landlord { color:var(--teal-mid); }
  .ph-dual-card h3 { font-size:1.2rem; font-weight:800; color:var(--dark); margin-bottom:.75rem; }
  .ph-dual-card p  { color:var(--mid); font-size:.88rem; line-height:1.75; margin-bottom:1.5rem; }
  .ph-dual-note { font-size:.75rem; color:var(--teal-mid); font-weight:700; background:var(--teal-light); padding:.35rem .9rem; border-radius:20px; margin-bottom:1.2rem; }
  .ph-btn-outline { border:2px solid var(--teal); color:var(--teal); background:transparent; padding:.55rem 1.4rem; border-radius:8px; font-size:.88rem; font-weight:700; transition:all .2s; display:inline-block; text-decoration:none; }
  .ph-btn-outline:hover { background:var(--teal); color:white; }
  .ph-btn-primary { background:var(--teal); color:white; padding:.85rem 2rem; border-radius:10px; font-size:.95rem; font-weight:700; display:inline-flex; align-items:center; gap:8px; transition:background .2s; text-decoration:none; box-shadow:0 4px 16px rgba(13,74,64,.25); }
  .ph-btn-primary:hover { background:var(--teal-dark); }
  .ph-features-sec { background:var(--gray-bg); padding:clamp(3rem,6vw,5.5rem) 1.2rem; text-align:center; }
  .ph-features-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1.5rem; max-width:1100px; margin:2.5rem auto 0; }
  .ph-feature-card { background:white; padding:2rem; border-radius:var(--radius); box-shadow:0 6px 20px rgba(13,74,64,.07); transition:transform .3s; border:1px solid var(--light-border); }
  .ph-feature-card:hover { transform:translateY(-6px); }
  .ph-feature-card i { font-size:2rem; color:var(--teal); display:block; margin-bottom:1rem; }
  .ph-feature-card h4 { font-size:1rem; font-weight:700; color:var(--dark); margin-bottom:.5rem; }
  .ph-feature-card p  { font-size:.85rem; color:var(--mid); line-height:1.6; }
  .ph-faq { position:relative; padding:clamp(3rem,6vw,5.5rem) 1.2rem clamp(4rem,8vw,6rem); background:var(--teal-pale); text-align:center; overflow:hidden; }
  .ph-faq-qmark { position:absolute; right:4%; top:50%; transform:translateY(-50%); font-size:clamp(8rem,20vw,22rem); font-weight:900; color:rgba(26,92,82,.05); pointer-events:none; z-index:1; font-family:'Poppins',sans-serif; line-height:1; }
  .ph-faq-inner { position:relative; z-index:2; }
  .ph-faq-heading { display:inline-block; font-size:clamp(2.2rem,5vw,3.5rem); color:var(--teal); position:relative; letter-spacing:.2rem; font-family:'Poppins',sans-serif; font-weight:600; margin-bottom:3rem; padding:.5rem 1.5rem; }
  .ph-faq-heading::before { content:''; position:absolute; top:0; left:0; width:1.8rem; height:1.8rem; border-top:.32rem solid var(--teal); border-left:.32rem solid var(--teal); }
  .ph-faq-heading::after  { content:''; position:absolute; bottom:0; right:0; width:1.8rem; height:1.8rem; border-bottom:.32rem solid var(--teal); border-right:.32rem solid var(--teal); }
  .ph-faq-list { max-width:860px; margin:0 auto; }
  .ph-acc { margin-bottom:.6rem; cursor:pointer; }
  .ph-acc-header { display:flex; align-items:stretch; }
  .ph-acc-plus { width:52px; flex-shrink:0; background:white; border:2px solid var(--teal); display:flex; align-items:center; justify-content:center; transition:all .3s; }
  .ph-acc-plus span { font-size:1.8rem; color:var(--teal); font-weight:300; line-height:1; transition:transform .3s,color .3s; display:block; }
  .ph-acc-label { flex:1; background:var(--teal); min-height:54px; display:flex; align-items:center; padding:0 1.6rem; transition:background .3s; }
  .ph-acc-label h3 { font-size:clamp(.82rem,2vw,1rem); font-weight:600; color:white; margin:0; text-align:left; font-family:'Poppins',sans-serif; }
  .ph-acc:hover .ph-acc-label { background:var(--teal-dark); }
  .ph-acc:hover .ph-acc-plus,.ph-acc.open .ph-acc-plus { background:var(--teal-light); }
  .ph-acc.open .ph-acc-plus span { transform:rotate(45deg); color:var(--teal); }
  .ph-acc-body { max-height:0; overflow:hidden; transition:max-height .4s ease,padding .3s; background:white; border:1px solid var(--light-border); border-top:none; border-left:3px solid var(--teal); text-align:left; }
  .ph-acc.open .ph-acc-body { max-height:400px; padding:1.2rem 1.8rem; }
  .ph-acc-body p { font-size:.95rem; line-height:1.8; color:var(--mid); font-family:'Poppins',sans-serif; }
  @media(max-width:520px){ .ph-acc-plus{width:44px} .ph-acc-label{padding:0 1rem;min-height:48px} }
  .ph-cta-sec { background:linear-gradient(135deg,var(--teal-dark) 0%,var(--teal) 100%); color:white; text-align:center; padding:clamp(3rem,6vw,5.5rem) 1.2rem; }
  .ph-cta-sec h2 { font-size:clamp(1.5rem,3vw,2rem); font-weight:800; margin-bottom:.75rem; color:white; }
  .ph-cta-sec p  { color:rgba(255,255,255,.80); margin-bottom:2rem; font-size:1rem; }
  .ph-cta-note { font-size:.8rem; color:rgba(255,255,255,.55); margin-top:1rem; }
  .ph-cta-sec .ph-btn-primary { background:white; color:var(--teal-dark); box-shadow:0 4px 20px rgba(0,0,0,.2); }
  .ph-cta-sec .ph-btn-primary:hover { background:var(--teal-pale); }
  .ph-footer { background:#0f1a17; color:rgba(255,255,255,.5); padding:clamp(2rem,5vw,3.5rem) 1.2rem 1.5rem; }
  .ph-footer-grid { display:grid; grid-template-columns:2fr 1fr 1fr; gap:2rem; max-width:1100px; margin:0 auto 2rem; }
  .ph-footer-brand strong { display:block; color:white; font-size:1rem; font-weight:800; margin-bottom:.5rem; }
  .ph-footer-brand p { font-size:.82rem; line-height:1.7; color:rgba(255,255,255,.42); max-width:260px; }
  .ph-footer-col h5 { color:rgba(255,255,255,.85); font-size:.8rem; font-weight:700; text-transform:uppercase; letter-spacing:.5px; margin-bottom:1rem; }
  .ph-footer-col a { display:block; color:rgba(255,255,255,.45); font-size:.82rem; margin-bottom:.5rem; transition:color .2s; }
  .ph-footer-col a:hover { color:#4dd9b8; }
  .ph-footer-bottom { border-top:1px solid rgba(255,255,255,.08); padding-top:1.2rem; text-align:center; font-size:.76rem; color:rgba(255,255,255,.28); max-width:1100px; margin:0 auto; }
  @media(max-width:768px){ .ph-footer-grid{grid-template-columns:1fr 1fr} .ph-footer-brand{grid-column:1/-1} }
  @media(max-width:480px){ .ph-footer-grid{grid-template-columns:1fr} }
`;

/* ═══════════════════════════════════════
   PROPERTY CARD  (unchanged)
═══════════════════════════════════════ */
function PropertyCard({ property }) {
  const { t } = useLang();
  const p         = normalise(property);
  const imgSrc    = p.images[0] || null;
  const isForSale = p.listingType.toLowerCase().includes("sale");
  const wa        = waLink(p.whatsapp);
  const call      = p.contactPhone ? `tel:${p.contactPhone}` : null;
  return (
    <div className="ph-prop-card">
      <div className="ph-prop-img-wrap">
        {imgSrc ? <img src={imgSrc} alt={p.name} loading="lazy" /> : <div className="ph-prop-no-img"><i className="fa fa-home" /></div>}
        <div className="ph-prop-badges">
          <span className={`ph-prop-badge ${isForSale ? "sale" : "rent"}`}>{isForSale ? t.forSale : t.forRent}</span>
          {p.type && <span className="ph-prop-badge type">{p.type}</span>}
        </div>
      </div>
      <div className="ph-prop-body">
        <div className="ph-prop-name">{p.name}</div>
        <div className="ph-prop-loc"><i className="fa fa-map-marker-alt" />{[p.address, p.district].filter(Boolean).join(", ") || "Malawi"}</div>
        <div className="ph-prop-price">{formatPrice(p.price, p.listingType, t)}</div>
        <div className="ph-prop-meta">
          {p.bedrooms       > 0 && <span className="ph-prop-meta-item"><i className="fa fa-bed"       /> {p.bedrooms} {t.bed}</span>}
          {p.bathrooms      > 0 && <span className="ph-prop-meta-item"><i className="fa fa-bath"      /> {p.bathrooms} {t.bath}</span>}
          {p.availableRooms > 0 && <span className="ph-prop-meta-item"><i className="fa fa-door-open" /> {p.availableRooms} {t.avail}</span>}
          {p.gender              && <span className="ph-prop-meta-item"><i className="fa fa-user"     /> {p.gender}</span>}
        </div>
      </div>
      <div className="ph-prop-actions">
        {wa   && <a className="ph-prop-wa"   href={wa}   target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsappClick(p._id)}><i className="fab fa-whatsapp" /> {t.waBtn}</a>}
        {call && <a className="ph-prop-call" href={call}><i className="fa fa-phone" /> {t.callBtn}</a>}
        {!wa && !call && <span style={{fontSize:".75rem",color:"#9ca3af",padding:".5rem"}}>{t.noContact}</span>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   BROWSE DRAWER  (unchanged)
═══════════════════════════════════════ */
function BrowseDrawer({ filter, filterValue, filterIcon, onClose, allProperties }) {
  const { t } = useLang();
  const [loading, setLoading]       = useState(true);
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    setLoading(true);
    if (allProperties && allProperties.length > 0) {
      const filtered = allProperties.filter(p => {
        const norm = normalise(p);
        if (filter === "district") return norm.district.toLowerCase() === filterValue.toLowerCase();
        if (filter === "type")     return norm.type.toLowerCase().includes(filterValue.toLowerCase()) || filterValue.toLowerCase().includes(norm.type.toLowerCase());
        return true;
      });
      setProperties(filtered);
      setLoading(false);
      return;
    }
    const param = filter === "district" ? `district=${encodeURIComponent(filterValue)}` : `type=${encodeURIComponent(filterValue)}`;
    fetch(`${API_URL}/hostels?${param}&limit=50`)
      .then(r => r.json())
      .then(data => setProperties(data.hostels || data.properties || data.data || []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, [filter, filterValue, allProperties]);
  return (
    <div className="ph-browse-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ph-browse-drawer">
        <div className="ph-browse-header">
          <div className="ph-browse-header-left">
            <div className="ph-browse-header-icon"><i className={filterIcon} /></div>
            <div>
              <h3>{filter === "district" ? `Properties in ${filterValue}` : `${filterValue} Listings`}</h3>
              <p>{loading ? t.drawerLoading : `${properties.length} listing${properties.length !== 1 ? "s" : ""} found`}</p>
            </div>
          </div>
          <button className="ph-browse-close" onClick={onClose}>✕</button>
        </div>
        <div className="ph-browse-body">
          {loading ? (
            <div className="ph-browse-loading"><div className="ph-spinner" /><span>{t.drawerLoading}</span></div>
          ) : properties.length === 0 ? (
            <div className="ph-browse-empty">
              <div className="ph-browse-empty-icon"><i className="fa fa-search" /></div>
              <h4>{t.drawerEmpty1} "{filterValue}"</h4>
              <p>{t.drawerEmpty2}</p>
            </div>
          ) : (
            <div className="ph-prop-grid">{properties.map((p, i) => <PropertyCard key={p._id || p.id || i} property={p} />)}</div>
          )}
        </div>
        {!loading && properties.length > 0 && (
          <div className="ph-browse-footer">
            <p>{t.drawerShowing} <strong>{properties.length}</strong> {filter === "district" ? `${t.drawerPropsIn} ${filterValue}` : `${filterValue} ${t.drawerListings}`}</p>
            <a href="/properties" className="ph-browse-see-all"><i className="fa fa-th" /> {t.drawerViewAll}</a>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   HERO  — redesigned to match Pinterest image
═══════════════════════════════════════ */
function Hero({ allProperties, onSearch }) {
  const { t } = useLang();
  const PROPERTY_TYPES_T = [
    t.ptHouse, t.ptFlat, t.ptRoom, t.ptSelf, t.ptPlot, t.ptComm,
  ];
  const MALAWI_DISTRICTS = [
    "Lilongwe","Blantyre","Zomba","Mzuzu","Kasungu","Mangochi",
    "Dedza","Salima","Ntcheu","Balaka","Machinga","Chiradzulu",
    "Thyolo","Mulanje","Mwanza","Nkhata Bay","Rumphi","Karonga",
    "Chitipa","Mzimba","Dowa","Ntchisi","Mchinji","Likoma",
  ];

  const [location, setLocation]   = useState("");
  const [propType, setPropType]   = useState("");

  const handleSearch = () => {
    onSearch({ district: location, type: propType });
    document.getElementById("browse-districts")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* WHITE NAVBAR — like in the image */}
      <nav className="ph-navbar">
        <a href="/" className="ph-navbar-logo">
          <div className="ph-navbar-logo-icon">
            <img src="/PezaNyumbaLogo.png" alt="PezaNyumba" onError={e => { e.target.style.display='none'; }} />
          </div>
          <span className="ph-navbar-logo-name">PezaNyumba</span>
        </a>
        <div className="ph-navbar-links">
          <a href="/" className="ph-navbar-link">Home</a>
          <a href="/properties" className="ph-navbar-link">Listings</a>
          <a href="/about" className="ph-navbar-link">About</a>
          <a href="/contact" className="ph-navbar-link">Contact</a>
        </div>
        <div className="ph-navbar-actions">
          <a href="/login"    className="ph-navbar-login">Login</a>
          <a href="/register" className="ph-navbar-cta"><i className="fa fa-building" /> List Property</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="ph-hero">
        <div className="ph-hero-content">
          {/* BIG HEADLINE like in image */}
          <h1 className="ph-hero-headline">
            {t.heroH1a}<br />
            <em>{t.heroH1em}</em><br />
            {t.heroH1b}
          </h1>

          <p className="ph-hero-sub">{t.heroSub}</p>

          <div className="ph-hero-trust">
            <div className="ph-hero-trust-item"><i className="fa fa-check-circle" /> {t.heroTrust1}</div>
            <div className="ph-hero-trust-item"><i className="fa fa-check-circle" /> {t.heroTrust2}</div>
            <div className="ph-hero-trust-item"><i className="fa fa-check-circle" /> {t.heroTrust3}</div>
          </div>

          <div className="ph-hero-stats">
            <div className="ph-hero-stat"><strong>340+</strong><span>{t.heroStat1}</span></div>
            <div className="ph-hero-stat"><strong>28</strong><span>{t.heroStat2}</span></div>
            <div className="ph-hero-stat"><strong>🛡️</strong><span>{t.heroStat3}</span></div>
          </div>

          {/* FLOATING SEARCH BAR — exactly like in the image */}
          <div className="ph-hero-search-wrap">
            {/* Location */}
            <div className="ph-search-field">
              <label><i className="fa fa-map-marker-alt" style={{marginRight:4,color:'var(--teal)'}} /> {t.heroLocation}</label>
              <select className="ph-search-select" value={location} onChange={e => setLocation(e.target.value)}>
                <option value="">{t.heroLocation}</option>
                {MALAWI_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Property Type */}
            <div className="ph-search-field">
              <label><i className="fa fa-home" style={{marginRight:4,color:'var(--teal)'}} /> {t.heroPropType}</label>
              <select className="ph-search-select" value={propType} onChange={e => setPropType(e.target.value)}>
                <option value="">{t.heroPropType}</option>
                {PROPERTY_TYPES_T.map(pt => <option key={pt} value={pt}>{pt}</option>)}
              </select>
            </div>

            {/* Price Range — visual only like in image */}
            <div className="ph-search-field">
              <label><i className="fa fa-tag" style={{marginRight:4,color:'var(--teal)'}} /> {t.heroPriceRange}</label>
              <input className="ph-search-input" type="text" placeholder="Any price" />
            </div>

            {/* Search Button */}
            <button className="ph-search-btn" onClick={handleSearch}>
              <i className="fa fa-search" /> {t.heroSearch}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════
   TRUST BAR  (unchanged)
═══════════════════════════════════════ */
function TrustBar() {
  const { t } = useLang();
  return (
    <div className="ph-trust-bar">
      <div className="ph-trust-bar-inner">
        <div className="ph-trust-item"><i className="fa fa-shield-alt" /> {t.trust1}</div>
        <div className="ph-trust-divider" />
        <div className="ph-trust-item"><i className="fa fa-user-slash" /> {t.trust2}</div>
        <div className="ph-trust-divider" />
        <div className="ph-trust-item"><i className="fab fa-whatsapp" /> {t.trust3}</div>
        <div className="ph-trust-divider" />
        <div className="ph-trust-item"><i className="fa fa-map-marker-alt" /> {t.trust4}</div>
        <div className="ph-trust-divider" />
        <div className="ph-trust-item"><i className="fa fa-lock" /> {t.trust5}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   FALLBACK IMGS + DISTRICTS SLIDER  (unchanged)
═══════════════════════════════════════ */
const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&auto=format&fit=crop",
];

function DistrictsSection({ allProperties, initialFilters }) {
  const { t } = useLang();
  const PROPERTY_TYPES_T = [
    { icon:"fa fa-home",        label:t.ptHouse, desc:t.ptHouseDesc },
    { icon:"fa fa-building",    label:t.ptFlat,  desc:t.ptFlatDesc  },
    { icon:"fa fa-bed",         label:t.ptRoom,  desc:t.ptRoomDesc  },
    { icon:"fa fa-door-closed", label:t.ptSelf,  desc:t.ptSelfDesc  },
    { icon:"fa fa-seedling",    label:t.ptPlot,  desc:t.ptPlotDesc  },
    { icon:"fa fa-store",       label:t.ptComm,  desc:t.ptCommDesc  },
  ];
  const [filtered, setFiltered]     = useState([]);
  const [locSearch, setLocSearch]   = useState(initialFilters?.district || "");
  const [typeFilter, setTypeFilter] = useState(initialFilters?.type || "");
  const [current, setCurrent]       = useState(0);
  const [drawer, setDrawer]         = useState(null);
  const [visCount, setVisCount]     = useState(4);
  const timerRef    = useRef(null);
  const trackRef    = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const dragStartX  = useRef(null);
  const isDragging  = useRef(false);

  useEffect(() => {
    function calc() { const w = window.innerWidth; setVisCount(w <= 520 ? 1 : w <= 768 ? 2 : w <= 1100 ? 3 : 4); }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  function applyFilter(source, loc, type) {
    const result = source.filter(raw => {
      const p = normalise(raw);
      const matchLoc  = !loc  || p.district.toLowerCase().includes(loc.toLowerCase()) || p.name.toLowerCase().includes(loc.toLowerCase());
      const matchType = !type || p.type.toLowerCase().includes(type.toLowerCase());
      return matchLoc && matchType;
    });
    setFiltered(result);
    setCurrent(0);
  }

  useEffect(() => {
    if (allProperties && allProperties.length > 0) applyFilter(allProperties, locSearch, typeFilter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProperties]);

  // Apply hero search filters when they change
  useEffect(() => {
    if (initialFilters) {
      setLocSearch(initialFilters.district || "");
      setTypeFilter(initialFilters.type || "");
      applyFilter(allProperties || [], initialFilters.district || "", initialFilters.type || "");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilters]);

  const handleSearch = () => applyFilter(allProperties || [], locSearch, typeFilter);
  const maxIdx = Math.max(0, filtered.length - visCount);
  const slideTo = useCallback((idx) => setCurrent(Math.max(0, Math.min(idx, maxIdx))), [maxIdx]);
  const next = useCallback(() => setCurrent(c => (c >= maxIdx ? 0 : c + 1)), [maxIdx]);
  const resetAuto = useCallback(() => { clearInterval(timerRef.current); timerRef.current = setInterval(next, 3500); }, [next]);

  useEffect(() => {
    if (filtered.length > visCount) resetAuto();
    return () => clearInterval(timerRef.current);
  }, [filtered, visCount, resetAuto]);

  function getCardW() {
    const track = trackRef.current;
    if (!track || !track.children[0]) return 252;
    const gap = parseFloat(getComputedStyle(track).gap) || 19.2;
    return track.children[0].getBoundingClientRect().width + gap;
  }
  function onTouchStart(e) { touchStartX.current = e.touches[0].clientX; touchStartY.current = e.touches[0].clientY; }
  function onTouchEnd(e) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) { slideTo(dx < 0 ? current + 1 : current - 1); resetAuto(); }
    touchStartX.current = null;
  }
  function onMouseDown(e) { dragStartX.current = e.clientX; isDragging.current = false; }
  function onMouseMove(e) { if (dragStartX.current !== null && Math.abs(e.clientX - dragStartX.current) > 6) isDragging.current = true; }
  function onMouseUp(e) {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    if (isDragging.current && Math.abs(dx) > 40) { slideTo(dx < 0 ? current + 1 : current - 1); resetAuto(); }
    dragStartX.current = null; isDragging.current = false;
  }

  const translateX = current * getCardW();
  const DOT_COUNT  = Math.min(maxIdx + 1, 8);

  return (
    <>
      <section className="ph-dist-sec" id="browse-districts">
        <p className="ph-sec-label">{t.distLabel}</p>
        <h2 className="ph-sec-title">{t.distTitle1} <em style={{color:"#2d8a72"}}>{t.distTitle2}</em></h2>
        <p className="ph-sec-sub">{t.distSub}</p>
        <div className="ph-dist-search">
          <input type="text" placeholder={t.distSearch} value={locSearch}
            onChange={e => setLocSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">{t.distAllTypes}</option>
            {PROPERTY_TYPES_T.map(pt => <option key={pt.label} value={pt.label}>{pt.label}</option>)}
          </select>
          <button className="ph-dist-search-btn" onClick={handleSearch}><i className="fa fa-search" /> {t.distBtn}</button>
        </div>
        <div className="ph-slider-viewport"
          onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}
          onMouseLeave={() => { dragStartX.current = null; isDragging.current = false; }}>
          {filtered.length === 0 ? (
            <div className="ph-prop-empty">
              <i className="fa fa-search" style={{fontSize:"2rem",opacity:.3,display:"block",marginBottom:".75rem"}} />
              {allProperties && allProperties.length === 0 ? t.distLoading : t.distEmpty}
            </div>
          ) : (
            <div ref={trackRef} className="ph-slider-track" style={{transform:`translateX(-${translateX}px)`}}>
              {filtered.map((raw, i) => {
                const p = normalise(raw);
                const imgSrc = p.images[0] || FALLBACK_IMGS[i % FALLBACK_IMGS.length];
                return (
                  <button key={p._id || i} className="ph-slide-card"
                    onClick={() => { if (!isDragging.current) setDrawer({ label: p.district || "All", icon: "fa fa-map-marker-alt" }); }}
                    onDragStart={e => e.preventDefault()}>
                    <img src={imgSrc} alt={p.name} className="ph-slide-img" draggable="false"
                      onError={e => { e.target.src = FALLBACK_IMGS[i % FALLBACK_IMGS.length]; }} />
                    <div className="ph-slide-body">
                      <div className="ph-slide-district">{p.district || "Malawi"}</div>
                      <div className="ph-slide-name">{p.name}</div>
                      <div className="ph-slide-meta">
                        {p.bedrooms > 0 && <span><i className="fa fa-bed" /> {p.bedrooms} {t.bed}</span>}
                        {p.bathrooms > 0 && <span><i className="fa fa-bath" /> {p.bathrooms}</span>}
                        {p.availableRooms > 0 && <span><i className="fa fa-door-open" /> {p.availableRooms} {t.avail}</span>}
                      </div>
                      {p.type && <span className="ph-slide-badge">{p.type}</span>}
                      <div className="ph-slide-price">{formatPrice(p.price, p.listingType, t)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {filtered.length > visCount && (
          <div className="ph-prop-nav">
            <div className="ph-prop-dots">
              {Array.from({ length: DOT_COUNT }).map((_, i) => (
                <button key={i} className={`ph-prop-dot${current === i ? " active" : ""}`} onClick={() => { slideTo(i); resetAuto(); }} />
              ))}
            </div>
            <div className="ph-prop-nav-btns">
              <button className="ph-prop-nav-btn" onClick={() => { slideTo(current - 1); resetAuto(); }}>&#8592;</button>
              <button className="ph-prop-nav-btn" onClick={() => { slideTo(current + 1); resetAuto(); }}>&#8594;</button>
            </div>
          </div>
        )}
      </section>
      {drawer && (
        <BrowseDrawer filter="district" filterValue={drawer.label} filterIcon={drawer.icon}
          onClose={() => setDrawer(null)} allProperties={allProperties} />
      )}
    </>
  );
}

/* ═══════════════════════════════════════
   PROPERTY TYPES  (unchanged)
═══════════════════════════════════════ */
function TypesSection({ allProperties }) {
  const { t } = useLang();
  const PROPERTY_TYPES_T = [
    { icon:"fa fa-home",        label:t.ptHouse, desc:t.ptHouseDesc },
    { icon:"fa fa-building",    label:t.ptFlat,  desc:t.ptFlatDesc  },
    { icon:"fa fa-bed",         label:t.ptRoom,  desc:t.ptRoomDesc  },
    { icon:"fa fa-door-closed", label:t.ptSelf,  desc:t.ptSelfDesc  },
    { icon:"fa fa-seedling",    label:t.ptPlot,  desc:t.ptPlotDesc  },
    { icon:"fa fa-store",       label:t.ptComm,  desc:t.ptCommDesc  },
  ];
  const [drawer, setDrawer] = useState(null);
  return (
    <>
      <section className="ph-types-sec">
        <p className="ph-sec-label">{t.typesLabel}</p>
        <h2 className="ph-sec-title">{t.typesTitle1} <em>{t.typesTitle2}</em></h2>
        <p className="ph-sec-sub">{t.typesSub}</p>
        <div className="ph-types-grid">
          {PROPERTY_TYPES_T.map(pt => (
            <button key={pt.label} className="ph-type-card" onClick={() => setDrawer(pt)}>
              <i className={pt.icon} /><h4>{pt.label}</h4><span>{pt.desc}</span>
            </button>
          ))}
        </div>
      </section>
      {drawer && (
        <BrowseDrawer filter="type" filterValue={drawer.label} filterIcon={drawer.icon}
          onClose={() => setDrawer(null)} allProperties={allProperties} />
      )}
    </>
  );
}

/* ═══════════════════════════════════════
   LOCATIONS  (unchanged)
═══════════════════════════════════════ */
function LocationsSection({ onDistrictClick }) {
  const { t } = useLang();
  const locs = [
    { img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop", big:true, count:"12+ Properties", name:"Lilongwe", desc:"Capital City — All Types", icon:"fa fa-city" },
    { img:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&auto=format&fit=crop", count:"9 Properties", name:"Blantyre", desc:"Commercial Hub", icon:"fa fa-building" },
    { img:"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop", count:"5 Properties", name:"Zomba", desc:"University Town", icon:"fa fa-university" },
    { img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop", count:"4 Properties", name:"Mzuzu", desc:"Northern Region Hub", icon:"fa fa-mountain" },
    { img:"https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop", count:"6 Properties", name:"Mangochi", desc:"Lakeshore Living", icon:"fa fa-water" },
  ];
  return (
    <section className="ph-locs-sec">
      <p className="ph-sec-label">{t.locsLabel}</p>
      <h2 className="ph-sec-title">{t.locsTitle1} <em>{t.locsTitle2}</em></h2>
      <div className="ph-locs-grid">
        {locs.map(l => (
          <button key={l.name} className={`ph-loc-card${l.big ? " big" : ""}`} onClick={() => onDistrictClick(l)}>
            <img src={l.img} alt={l.name} />
            <div className="ph-loc-overlay"><small>{l.count}</small><h4>{l.name}</h4><p>{l.desc}</p></div>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   DUAL / FEATURES / FAQ  (unchanged)
═══════════════════════════════════════ */
function DualSection() {
  const { t } = useLang();
  return (
    <div className="ph-dual-sec">
      <div className="ph-dual-card">
        <div className="ph-dual-icon tenant"><i className="fa fa-user" /></div>
        <h3>{t.tenantTitle}</h3>
        <div className="ph-dual-note">{t.tenantNote}</div>
        <p>{t.tenantDesc}</p>
        <a href="#browse-districts" className="ph-btn-outline">{t.tenantBtn}</a>
      </div>
      <div className="ph-dual-card">
        <div className="ph-dual-icon landlord"><i className="fa fa-building" /></div>
        <h3>{t.landlordTitle}</h3>
        <div className="ph-dual-note">{t.landlordNote}</div>
        <p>{t.landlordDesc}</p>
        <a href="/register" className="ph-btn-outline">{t.landlordBtn}</a>
      </div>
    </div>
  );
}

function FeaturesSection() {
  const { t } = useLang();
  const features = [
    { icon:"fa fa-search",        title:t.feat1Title, desc:t.feat1Desc },
    { icon:"fab fa-whatsapp",     title:t.feat2Title, desc:t.feat2Desc },
    { icon:"fa fa-shield-alt",    title:t.feat3Title, desc:t.feat3Desc },
    { icon:"fa fa-balance-scale", title:t.feat4Title, desc:t.feat4Desc },
  ];
  return (
    <section className="ph-features-sec">
      <p className="ph-sec-label">{t.featLabel}</p>
      <h2 className="ph-sec-title">{t.featTitle1} <em>{t.featTitle2}</em></h2>
      <div className="ph-features-grid">
        {features.map(f => (
          <div className="ph-feature-card" key={f.title}>
            <i className={f.icon} /><h4>{f.title}</h4><p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQSection() {
  const { t } = useLang();
  const [open, setOpen] = useState(null);
  const faqItems = [
    { question:t.faqQ1, answer:t.faqA1 },
    { question:t.faqQ2, answer:t.faqA2 },
    { question:t.faqQ3, answer:t.faqA3 },
    { question:t.faqQ4, answer:t.faqA4 },
    { question:t.faqQ5, answer:t.faqA5 },
  ];
  return (
    <section className="ph-faq">
      <div className="ph-faq-qmark" aria-hidden="true">?</div>
      <div className="ph-faq-inner">
        <h2 className="ph-faq-heading">FAQ</h2>
        <div className="ph-faq-list">
          {faqItems.map((item, i) => (
            <div key={i} className={`ph-acc${open === i ? " open" : ""}`} onClick={() => setOpen(open === i ? null : i)}>
              <div className="ph-acc-header">
                <div className="ph-acc-plus"><span>+</span></div>
                <div className="ph-acc-label"><h3>{item.question}</h3></div>
              </div>
              <div className="ph-acc-body"><p>{item.answer}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   ROOT
═══════════════════════════════════════ */
export default function Home() {
  const langState = useLangState();
  const [allProperties, setAllProperties] = useState([]);
  const [locDrawer,     setLocDrawer]     = useState(null);
  const [heroFilters,   setHeroFilters]   = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/hostels?limit=500`)
      .then(r => r.json())
      .then(data => setAllProperties(data.hostels || data.properties || data.data || []))
      .catch(() => {});
  }, []);

  return (
    <LangContext.Provider value={langState}>
      <style>{styles}</style>
      <style>{langSwitcherStyles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      <LanguageSwitcher />

      {/* HERO — new design matching the Pinterest image */}
      <Hero allProperties={allProperties} onSearch={filters => setHeroFilters(filters)} />

      <TrustBar />

      {/* Districts section — receives hero search filters */}
      <DistrictsSection allProperties={allProperties} initialFilters={heroFilters} />

      <TypesSection allProperties={allProperties} />
      <LocationsSection onDistrictClick={l => setLocDrawer(l)} />
      <DualSection />
      <FeaturesSection />
      <FAQSection />

      <section className="ph-cta-sec">
        <h2>{langState.t.ctaTitle}</h2>
        <p>{langState.t.ctaSub}</p>
        <a href="/register" className="ph-btn-primary">
          <i className="fa fa-user-plus" /> {langState.t.ctaBtn}
        </a>
        <p className="ph-cta-note">{langState.t.ctaNote}{" "}
          <a href="/login" style={{color:"#4dd9b8",fontWeight:700}}>{langState.t.ctaLogin}</a>
        </p>
      </section>

      {locDrawer && (
        <BrowseDrawer filter="district" filterValue={locDrawer.name} filterIcon={locDrawer.icon}
          onClose={() => setLocDrawer(null)} allProperties={allProperties} />
      )}
    </LangContext.Provider>
  );
}