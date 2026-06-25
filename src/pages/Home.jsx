import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ═══════════════════════════════════════
   LANGUAGE SYSTEM
═══════════════════════════════════════ */
const LANGS = {
  en: {
    code: "en", label: "English",
    switchLang: "Language",
    heroBadge:   "Finding homes across Malawi. No sign-up required",
    heroH1a:     "Find Your",
    heroH1em:    "Perfect Home",
    heroH1b:     "Anywhere in Malawi",
    heroBrowse:  "Browse Properties",
    heroList:    "List Your Property",
    heroTrust1:  "No account to browse",
    heroTrust2:  "WhatsApp landlords directly",
    heroTrust3:  "List your property for free. No commission",
    heroStat1:   "Properties Listed",
    heroStat2:   "Districts Covered",
    heroStat3:   "Dispute Protection",
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
    saveBtn: "Save", savedBtn: "Saved",
    shareBtn: "Share",
    bed: "bed", bath: "bath", avail: "avail.",
    priceOnRequest: "Price on request",
    lightboxClose: "Close",
    lightboxOf: "of",
    navHome: "Home", navProperties: "Properties", navFavorites: "Favorites", navAbout: "About Us", navContact: "Contact",
    navProfile: "My Profile", navMenu: "Menu",
    verifiedBadge: "ID Verified",
    shareCopied: "Link copied!",
    favAdded: "Saved to favorites",
    favRemoved: "Removed from favorites",
  },

  ny: {
    code: "ny", label: "Chichewa",
    switchLang: "Chilankhulo",
    heroBadge:   "Kupeza nyumba ku Malawi konse. Simukuyenera kukhala ndi account kuti mupeze nyumba",
    heroH1a:     "Pezani",
    heroH1em:    "Nyumba Yabwino",
    heroH1b:     "Kulikonse ku Malawi",
    heroBrowse:  "Sakani Nyumba",
    heroList:    "Ikani Nyumba Yanu",
    heroTrust1:  "Simukuyenera akaunti",
    heroTrust2:  "Lumikizanani pa WhatsApp",
    heroTrust3:  "Kuyika nyumba ndiulele",
    heroStat1:   "Nyumba zomwe zilipo",
    heroStat2:   "Maboma Alipo",
    heroStat3:   "Chitetezo cha Mikangano",
    trust1: "Nsanja yolembetsedwa ku Malawi",
    trust2: "Palibe akaunti yosaka",
    trust3: "WhatsApp mwini nyumba mwachindunji",
    trust4: "Madisitikiti onse 28 alipo",
    trust5: "Chitetezo cha mikangano chili",
    distLabel:   "Saka malalo",
    distTitle1:  "Pezani Nyumba pa",
    distTitle2:  "Boma",
    distSub:     "Sakani malalo kapena mtundu — swipe kapena gwiritsa ntchito mivi kuti mufufuze.",
    distSearch:  "Sakani boma kapena dzina la nyumba…",
    distAllTypes:"Mitundu yonse",
    distBtn:     "Sakani",
    distLoading: "Kutsitsa nyumba…",
    distEmpty:   "Palibe nyumba zapezeka. Yesani kusaka kwina.",
    typesLabel:  "Mukufuna chiyani?",
    typesTitle1: "Sakani pa",
    typesTitle2: "Mtundu wa Nyumba",
    typesSub:    "Dinani mtundu uliwonse ndi kuona nyumba zomwe zilipo — palibe kulemba.",
    locsLabel:   "Malalo athu a nyumba",
    locsTitle1:  "Malalo Okwaniritsa ku",
    locsTitle2:  "Malawi",
    tenantTitle: "Okangomanga & Ogula",
    tenantNote:  "✓ Palibe akaunti yofunikira",
    tenantDesc:  "Sakani nyumba zonse, onani zithunzi, onani mitengo, ndikupeza nomboro ya mwini nyumba mwachindunji.",
    tenantBtn:   "Yambani Kusaka",
    landlordTitle:"Eni Nyumba ndi Malo",
    landlordNote: "✓ Lembelani ndi kuika nyumba",
    landlordDesc: "Pangani akaunti ya mwini nyumba kuika nyumba yanu. Anthu ofuna nyumba muzalumikizana pa WhatsApp.",
    landlordBtn:  "Lembeleni ngati Mwini Nyumba",
    featLabel:   "Chifukwa chosankha ife",
    featTitle1:  "Chifukwa Kusankha",
    featTitle2:  "PezaNyumba?",
    feat1Title:  "Sakani Mwaulere",
    feat1Desc:   "Palibe akaunti. Sakani pa boma, mtengo, ndi mtundu kupeza nyumba yanu msanga.",
    feat2Title:  "WhatsApp Mwachindunji",
    feat2Desc:   "Dinani WhatsApp pa nyumba iliyonse kutumiza uthenga kwa mwini nyumba — palibe pakati.",
    feat3Title:  "Nyumba Zazikulu",
    feat3Desc:   "Mwini nyumba aliyense amayezetsa kaye iye ndi nyumbayo.",
    feat4Title:  "Kutha Mikangano",
    feat4Desc:   "Ngati vuto likubwera, timagwira ntchito ngati pakati ndikutha vutolo mwachilungamo.",
    faqQ1: "Ndingapeze bwanji nyumba pa PezaNyumba?",
    faqA1: "Palibe akaunti! Saka pa disitikiti kapena mtundu, onani zambiri, kenako imbani WhatsApp kapena foni kwa mwini nyumba.",
    faqQ2: "Ndikufunika akaunti kusaka?",
    faqA2: "Ayi. Anthu ofuna nyumba amayang'ana mauthenga onse, mitengo ndi zithunzi, ndikupeza nomboro mwaulere.",
    faqQ3: "Ndani amatha kupanga akaunti pa PezaNyumba?",
    faqA3: "Eni nyumba ndi eni malo okha. Anthu ofuna nyumba amasakabe — palibe kulemba.",
    faqQ4: "PezaNyumba imayeza bwanji eni nyumba?",
    faqA4: "Mwini nyumba aliyense amafufuzidwa kaye asanayambe kuyika nyumba zake pofuna kuteteza anthu ku anthu akuba.",
    faqQ5: "Nditha kuika nyumba yanga?",
    faqA5: "Inde — ngati ndinu mwini nyumba kapena mwini malo. Lembeleni, uzuzeni zambiri, ikani zithunzi, ndipo nyumba imakwera pa maola 24.",
    ctaTitle: "Kodi ndinu Mwini Nyumba kapena Mwini Malo?",
    ctaSub:   "Lembeleni kamodzi ndiyamba kuika nyumba zanu kwa anthu ambiri afuna nyumba ku Malawi.",
    ctaBtn:   "Lembeleni ngati Mwini Nyumba",
    ctaNote:  "Muli ndi akaunti kale?",
    ctaLogin: "Lowani apa",
    drawerLoading: "Kusaka mauthenga…",
    drawerEmpty1:  "Palibe nyumba zapezeka pa",
    drawerEmpty2:  "Bwererani posachedwa — eni nyumba akuwonjezera nyumba tsiku lililonse.",
    drawerShowing: "Kuwonetsa",
    drawerPropsIn: "nyumba ku",
    drawerListings:"mauthenga",
    drawerViewAll: "Ona Zonse",
    ptHouse:  "Nyumba",           ptHouseDesc:  "Nyumba za mabanja",
    ptFlat:   "Flat/Apartment",   ptFlatDesc:   "Ma apartment achisanu",
    ptRoom:   "Chipinda Chimodzi", ptRoomDesc:  "Zipinda zotsika mtengo",
    ptSelf:   "Self-Contained",   ptSelfDesc:   "Khomo lake & bafa",
    ptPlot:   "Gawo la Malo",     ptPlotDesc:   "Mangani lofunira lanu",
    ptComm:   "Malo a Bizinesi",  ptCommDesc:   "Masitolo & maofesi",
    cardVerified: "Nyumba Zazikulu",      cardVerifiedSub: "Mauthenga onse ayezedwa",
    cardPrices:   "Mitengo Yabwino",      cardPricesSub:   "Yoyenera bajeti iliyonse",
    cardTrusted:  "Eni Nyumba Oyesedwa",  cardTrustedSub:  "Eni onyezedwa",
    cardDistricts:"Madisitikiti Onse",    cardDistrictsSub:"Madisitikiti 28",
    cardQuick:    "Funsani Msanga",       cardQuickSub:    "Lumikizani eni nyumba mwamsanga",
    cardDispute:  "Thandizo la Mikangano",cardDisputeSub:  "Timaitha mavuto mwachilungamo",
    cardDirect:   "Uthenga Wachindunji", cardDirectSub:   "Lankhulani ndi eni nyumba motetezeka",
    cardRated:    "Woyezetsa Kwambiri",   cardRatedSub:    "Maganizo a okangomanga weniweni",
    forSale: "Kugulitsa", forRent: "Kugwiritsa",
    noContact: "Palibe nomboro",
    waBtn: "WhatsApp", callBtn: "Imbani",
    saveBtn: "Sungani", savedBtn: "Yasungidwa",
    shareBtn: "Gawani",
    bed: "chipinda", bath: "bafa", avail: "palibe.",
    priceOnRequest: "Funsani mtengo",
    lightboxClose: "Tseka",
    lightboxOf: "pa",
    navHome: "Kwathu", navProperties: "Nyumba", navFavorites: "Zosankha", navAbout: "Za Ife", navContact: "Lumikizani",
    navProfile: "Akaunti Yanga", navMenu: "Menyu",
    verifiedBadge: "Wayezedwa",
    shareCopied: "Kopiyedwa!",
    favAdded: "Yasungidwa",
    favRemoved: "Yachotsedwa",
  },

  tu: {
    code: "tu", label: "Tumbuka",
    switchLang: "Chilankhulo",
    heroBadge:   "Sangani manyumba mu Malawi. Kwambura kujura akaunti",
    heroH1a:     "Penjani",
    heroH1em:    "Nyumba yiweme",
    heroH1b:     "Kulikose ku Malawi",
    heroBrowse:  "Penjani",
    heroList:    "Yikani manyumba yinu",
    heroTrust1:  "Palije kujura akaunti ",
    heroTrust2:  "WhatsApp mwene nyumba",
    heroTrust3:  "Kulemba nyumba mwaulere",
    heroStat1:   "Nyumba Zalembiwa",
    heroStat2:   "Madisitirikiti Yalipo",
    heroStat3:   "Chitetezo cha Mikangano",
    trust1: "Nsanja yolembiwa ku Malawi",
    trust2: "Palije akaunti yosaka",
    trust3: "WhatsApp mwene nyumba",
    trust4: "Madisitiriki yose 28 yalipo",
    trust5: "Chitetezo cha mikangano ",
    distLabel:   "Penjani malo",
    distTitle1:  "PezaNyumba Mw",
    distTitle2:  "Disitirikiti",
    distSub:     "Penjani malo panji mtundu — swipe panji gwirisa ntchito mivi kufufuza.",
    distSearch:  "Penjani disitirikiti panji zina la nyumba…",
    distAllTypes:"Mitundu yose",
    distBtn:     "Penjani",
    distLoading: "Kuloda nyumba…",
    distEmpty:   "Palije nyumba zasangika. Yezgani kupenjaka kunyake.",
    typesLabel:  "Mukukhumbachi?",
    typesTitle1: "Penjani",
    typesTitle2: "Mtundu wa Nyumba",
    typesSub:    "Dinani mtundu uliwonse kuona nyumba zamoyo — palije kulemba.",
    locsLabel:   "Malo yithu ya nyumba",
    locsTitle1:  "Malo Yakwaniritsa ku",
    locsTitle2:  "Malawi",
    tenantTitle: "Okusunga & Ogula",
    tenantNote:  "✓ Palije akaunti yakukhumbikwa",
    tenantDesc:  "Penjani nyumba zose, ona vithuzi, onani mitengo, nakusanga nambala ya mwene nyumba mwaulere.",
    tenantBtn:   "Yambani Kupenja",
    landlordTitle:"Mwene Nyumba & Malo",
    landlordNote: "✓ Yambani kuika nyumba",
    landlordDesc: "Pangani akaunti ya mwene nyumba nakuika nyumba yinu. Wanthu wakukhumba nyumba wazam'kulumikizaninamwe pa WhatsApp.",
    landlordBtn:  "Lembani ngati wene nyumba ",
    featLabel:   "Chifukwa chakusankha ise",
    featTitle1:  "Chifukwa chake",
    featTitle2:  "PezaNyumba?",
    feat1Title:  "Penjani Mwaulere",
    feat1Desc:   "Kwambura akaunti. Penjani pa disitirikiti, mtengo, na mtundu nakusanga nyumba yako mwaluwiro.",
    feat2Title:  "Lumikizanani pa WhatsApp ",
    feat2Desc:   "Dofyani WhatsApp batani pa nyumba iliyose kutuma uthenga kwa mwene nyumba — palije pakati.",
    feat3Title:  "Nyumba Zapimika ",
    feat3Desc:   "Mwene nyumba waliyose wakupimika dankha nanyumba yake kopa unkhungu.",
    feat4Title:  "Kutha Mikangano",
    feat4Desc:   "Ngati vuto likubwera, tigwira ntchito nga pakati na kutha vutolo mwachilungamo.",
    faqQ1: "Ndingapeze wuli nyumba pa PezaNyumba?",
    faqA1: "Palije akaunti! Saka pa disitiriki panji mtundu, ona zambiri, kenako zimba WhatsApp panji foni kwa mwenye nyumba.",
    faqQ2: "Ndikufunika akaunti kusaka?",
    faqA2: "Yayi. Anthu ofuna nyumba yayang'ana mauthenga yose, mitengo na zithunzi, na kupeza nambala mwaulere.",
    faqQ3: "Ndani angapange akaunti pa PezaNyumba?",
    faqA3: "Anenye nyumba na anenye malo yokha. Anthu ofuna nyumba yasakabe — palije kulemba.",
    faqQ4: "PezaNyumba iyeza wuli anenye nyumba?",
    faqA4: "Mwenye nyumba uliwonse wayezedwa iye na malo ake asanapange nyumba yake.",
    faqQ5: "Ningaike nyumba yane?",
    faqA5: "Inde — ngati ndimwenye nyumba panji mwenye malo. Lembani, uzuzani zambiri, ikani zithunzi, ndipo nyumba imakwera mu maola 24.",
    ctaTitle: "Kodi ndimwenye Nyumba panji Mwenye Malo?",
    ctaSub:   "Lembani kamoza ndiyamba kuika nyumba zinu kwa anthu azinji ofuna nyumba ku Malawi.",
    ctaBtn:   "Lembani nga Mwenye Nyumba",
    ctaNote:  "Muli na akaunti kale?",
    ctaLogin: "Injilani apha",
    drawerLoading: "Kusaka mauthenga…",
    drawerEmpty1:  "Palije nyumba zapezeka pa",
    drawerEmpty2:  "Bwelerani posachedwa — anenye nyumba yakuwonjezerera nyumba zuŵa lililonse.",
    drawerShowing: "Kuwonetsa",
    drawerPropsIn: "nyumba mu",
    drawerListings:"mauthenga",
    drawerViewAll: "Ona Yose",
    ptHouse:  "Nyumba",           ptHouseDesc:  "Nyumba za mabanja",
    ptFlat:   "Flat/Apartment",   ptFlatDesc:   "Ma apartment yamachisanu",
    ptRoom:   "Chipinda Chimoza", ptRoomDesc:   "Zipinda zotauka mtengo",
    ptSelf:   "Self-Contained",   ptSelfDesc:   "Khomo lake & bafa",
    ptPlot:   "Gawo la Malo",     ptPlotDesc:   "Manga lofunira lako",
    ptComm:   "Malo ya Bizinesi", ptCommDesc:   "Masitolo & maofesi",
    cardVerified: "Nyumba Zayezedwa",       cardVerifiedSub: "Mauthenga yose yayezedwa",
    cardPrices:   "Mitengo Yabwino",        cardPricesSub:   "Yoyenera bajeti iliyonse",
    cardTrusted:  "Anenye Nyumba Oyezedwa", cardTrustedSub:  "Anenye oyezedwa",
    cardDistricts:"Madisitiriki Yose",      cardDistrictsSub:"Madisitiriki 28",
    cardQuick:    "Funsani Msanga",         cardQuickSub:    "Lumikizani anenye nyumba msanga",
    cardDispute:  "Thandizo la Mikangano",  cardDisputeSub:  "Yiitha mavuto mwachilungamo",
    cardDirect:   "Uthenga Wachindunji",    cardDirectSub:   "Lankhulani na anenye nyumba motetezeka",
    cardRated:    "Woyezedwa Kwambiri",     cardRatedSub:    "Maganizo ya okusunga weniweni",
    forSale: "Kugulitsa", forRent: "Kukodisha",
    noContact: "Palije nambala",
    waBtn: "WhatsApp", callBtn: "Zimba",
    saveBtn: "Sungani", savedBtn: "Yasungidwa",
    shareBtn: "Gawani",
    bed: "chipinda", bath: "bafa", avail: "palipo.",
    priceOnRequest: "Funsani mtengo",
    lightboxClose: "Tseka",
    lightboxOf: "pa",
    navHome: "Ku Nyumba", navProperties: "Nyumba", navFavorites: "Zosankhika", navAbout: "Za Ife", navContact: "Lumikizani",
    navProfile: "Akaunti Yane", navMenu: "Menyu",
    verifiedBadge: "Wayezedwa",
    shareCopied: "Kopiyedwa!",
    favAdded: "Yasungidwa",
    favRemoved: "Yachotsedwa",
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

function useFavorites() {
  const [favIds, setFavIds] = useState(() => {
    try {
      const raw = localStorage.getItem("peza_favorites");
      return new Set(raw ? JSON.parse(raw) : []);
    } catch { return new Set(); }
  });

  const toggle = useCallback((id) => {
    setFavIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try { localStorage.setItem("peza_favorites", JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);

  const isSaved = useCallback((id) => favIds.has(id), [favIds]);
  return { favIds, toggle, isSaved };
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 2800);
  }, []);
  return { toasts, show };
}

function ToastContainer({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div style={{
      position: "fixed", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)",
      zIndex: 99999, display: "flex", flexDirection: "column", gap: ".5rem",
      alignItems: "center", pointerEvents: "none",
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === "error" ? "#dc2626" : "#0f1923",
          color: "white", padding: ".65rem 1.4rem",
          borderRadius: "999px", fontSize: ".83rem", fontWeight: 700,
          boxShadow: "0 8px 24px rgba(0,0,0,.25)",
          animation: "toastIn .25s cubic-bezier(.34,1.56,.64,1)",
          display: "flex", alignItems: "center", gap: ".5rem",
          whiteSpace: "nowrap",
        }}>
          {t.type === "error" ? "✕" : "✓"} {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   STYLES
═══════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Nunito+Sans:wght@400;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy: #0f1923;
    --navy-mid: #1a2e3d;
    --amber: #f5a623;
    --amber-light: #fef3d8;
    --amber-dark: #d4870a;
    --white: #fff;
    --off-white: #f7f8fa;
    --light-gray: #f0f2f5;
    --border: #e8eaed;
    --mid: #6b7280;
    --dark: #111827;
    --wa-green:  #111827;
    --wa-green-dark:  #111827;
    --radius: 12px;
    --radius-lg: 16px;
    --font: 'Plus Jakarta Sans', 'Nunito Sans', sans-serif;
  }
  html { scroll-behavior: smooth; }
  body { font-family: var(--font); color: var(--dark); background: #fff; overflow-x: hidden; -webkit-text-size-adjust: 100%; }
  a { text-decoration: none; color: inherit; }
  button { font-family: inherit; cursor: pointer; border: none; background: none; padding: 0; }
  img { max-width: 100%; }

  @keyframes toastIn { from{opacity:0;transform:translateY(10px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }

  /* ══════════════════════════════
     NAVBAR
  ══════════════════════════════ */
  .pn-nav {
    position: sticky; top: 0; z-index: 900;
    background: #fff;
    border-bottom: 1px solid #eaeaea;
    box-shadow: 0 2px 12px rgba(0,0,0,.06);
    font-family: var(--font);
  }
  .pn-nav-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center;
    padding: 0 1rem; height: 60px; gap: 0;
  }
  .pn-logo {
    display: flex; align-items: center; gap: 8px;
    text-decoration: none; flex-shrink: 0; margin-right: auto;
  }
  .pn-logo-icon {
    width: 36px; height: 36px;
    background: white; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
 
  }
  .pn-logo-icon img { width: 100%; height: 100%; object-fit: contain; }
  .pn-logo-text { font-size: 1.1rem; font-weight: 800; color: #0f1923; letter-spacing: -.3px; }
  .pn-nav-links { display: none; align-items: center; gap: .15rem; }
  .pn-nav-link {
    padding: .5rem .85rem; font-size: .88rem; font-weight: 600;
    color: #444; text-decoration: none; border-radius: 6px;
    transition: color .2s; position: relative; white-space: nowrap;
  }
  .pn-nav-link:hover { color: #0f1923; }
  .pn-nav-link.active { color: #0f1923; }
  .pn-nav-link.active::after {
    content: ''; position: absolute; bottom: -2px;
    left: 50%; transform: translateX(-50%);
    width: 22px; height: 2.5px;
    background: var(--amber); border-radius: 2px;
  }
  .pn-nav-right { display: flex; align-items: center; gap: .5rem; flex-shrink: 0; }
  .pn-lang-pill {
    display: flex; align-items: center; gap: 5px;
    padding: .38rem .7rem;
    border: 1.5px solid #e0e0e0; border-radius: 999px;
    font-size: .78rem; font-weight: 700; color: #444;
    background: #fff; cursor: pointer;
    transition: border-color .2s; font-family: var(--font);
    white-space: nowrap;
  }
  .pn-lang-pill:hover { border-color: #bbb; }
  .pn-lang-pill .chevron { font-size: .55rem; opacity: .6; }

  .pn-fav-btn {
    display: none;
    align-items: center; gap: 6px;
    padding: .42rem .9rem;
    background: var(--amber-light); color: var(--amber-dark);
    border-radius: 999px; font-size: .82rem; font-weight: 700;
    cursor: pointer; border: 1.5px solid #f0d89a;
    transition: all .2s; font-family: var(--font);
    text-decoration: none;
  }
  .pn-fav-btn:hover { background: var(--amber); color: var(--navy); }
  .pn-fav-count {
    background: var(--navy); color: white;
    font-size: .64rem; font-weight: 800;
    border-radius: 999px; padding: 0 5px; min-width: 16px;
    height: 16px; display: flex; align-items: center; justify-content: center;
  }

  /* ═══ FIX 2 — Profile button now navigates to /profile ═══ */
  .pn-profile-btn {
    display: none;
    align-items: center; gap: 7px;
    padding: .42rem 1rem .42rem .6rem;
    background: #0f1923; color: #fff;
    border-radius: 999px; font-size: .82rem; font-weight: 700;
    cursor: pointer; border: none; transition: background .2s;
    font-family: var(--font); text-decoration: none;
  }
  .pn-profile-btn:hover { background: #1a2e3d; }
  .pn-profile-avatar {
    width: 26px; height: 26px; border-radius: 50%;
    background: rgba(255,255,255,.15);
    display: flex; align-items: center; justify-content: center;
    font-size: .8rem;
  }
  .pn-hamburger {
    display: flex; flex-direction: column; gap: 5px;
    background: none; border: none; cursor: pointer;
    padding: 8px; border-radius: 8px; transition: background .2s;
    -webkit-tap-highlight-color: transparent;
  }
  .pn-hamburger:active { background: var(--light-gray); }
  .pn-hamburger span {
    width: 22px; height: 2px; background: #0f1923;
    border-radius: 2px; display: block; transition: all .3s;
  }
  .pn-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .pn-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .pn-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  .pn-mobile-menu {
    position: fixed; top: 60px; left: 0; right: 0;
    background: #fff; border-bottom: 1px solid var(--border);
    box-shadow: 0 8px 32px rgba(0,0,0,.12);
    z-index: 899; overflow: hidden;
    max-height: 0; transition: max-height .35s cubic-bezier(.4,0,.2,1);
  }
  .pn-mobile-menu.open { max-height: 600px; }
  .pn-mobile-menu-inner { padding: .75rem 1rem 1.25rem; }
  .pn-mobile-nav-links { display: flex; flex-direction: column; gap: .2rem; margin-bottom: .75rem; }
  .pn-mobile-nav-link {
    display: flex; align-items: center; gap: 12px;
    padding: .85rem 1rem; border-radius: 10px;
    font-size: .95rem; font-weight: 600; color: #333;
    text-decoration: none; transition: background .15s;
    -webkit-tap-highlight-color: transparent;
  }
  .pn-mobile-nav-link:active, .pn-mobile-nav-link:hover { background: var(--off-white); }
  .pn-mobile-nav-link.active { background: var(--amber-light); color: var(--amber-dark); }
  .pn-mobile-nav-link i { width: 20px; text-align: center; font-size: .95rem; color: var(--mid); }
  .pn-mobile-nav-link.active i { color: var(--amber-dark); }
  .pn-mobile-nav-link.fav-link { position: relative; }
  .pn-mobile-nav-link.fav-link .mob-fav-count {
    margin-left: auto;
    background: var(--amber); color: var(--navy);
    font-size: .65rem; font-weight: 800;
    border-radius: 999px; padding: 1px 7px;
    min-width: 18px; text-align: center;
  }
  .pn-mobile-divider { height: 1px; background: var(--border); margin: .5rem 0; }
  .pn-mobile-profile {
    display: flex; align-items: center; gap: 12px;
    padding: .85rem 1rem; border-radius: 10px;
    background: #0f1923; color: white;
    font-size: .92rem; font-weight: 700;
    text-decoration: none; transition: background .2s;
    -webkit-tap-highlight-color: transparent;
    margin-top: .25rem;
  }
  .pn-mobile-profile:active { background: #1a2e3d; }
  .pn-mobile-profile-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(255,255,255,.15);
    display: flex; align-items: center; justify-content: center;
    font-size: .9rem; flex-shrink: 0;
  }
  @media(min-width: 900px) {
    .pn-nav-inner { height: 68px; padding: 0 1.5rem; gap: 2rem; }
    .pn-logo { margin-right: 0; }
    .pn-logo-icon { width: 40px; height: 40px; }
    .pn-logo-text { font-size: 1.2rem; }
    .pn-nav-links { display: flex; flex: 1; justify-content: center; }
    .pn-profile-btn { display: flex; }
    .pn-fav-btn { display: flex; }
    .pn-hamburger { display: none; }
    .pn-mobile-menu { display: none; }
  }
  .ph-lang-switcher { position: relative; }
  .ph-lang-dropdown {
    position: absolute; top: calc(100% + 8px); right: 0;
    background: white; border: 1.5px solid #e8e8e8;
    border-radius: 14px; box-shadow: 0 16px 48px rgba(0,0,0,.13);
    overflow: hidden; min-width: 170px;
    animation: langDrop .18s cubic-bezier(.34,1.56,.64,1);
    z-index: 9999;
  }
  @keyframes langDrop { from{opacity:0;transform:translateY(-8px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }
  .ph-lang-option {
    display: flex; align-items: center; gap: 10px;
    width: 100%; padding: 11px 16px; font-size: .85rem; font-weight: 600;
    color: #111; background: white; border: none; cursor: pointer;
    text-align: left; transition: background .15s; font-family: var(--font);
  }
  .ph-lang-option:hover { background: #fdf8ee; }
  .ph-lang-option.active { background: #fdf3d8; color: #7a4f00; }
  .ph-lang-option .ph-lang-opt-label { flex: 1; }
  .ph-lang-option .ph-lang-opt-check { color: var(--amber); font-size: .85rem; }
  .ph-lang-divider { height: 1px; background: #f0f0f0; }

  /* ══════════════════════════════
     LIGHTBOX
  ══════════════════════════════ */
  .ph-lightbox-overlay { position:fixed; inset:0; background:rgba(0,0,0,.92); z-index:10000; display:flex; align-items:center; justify-content:center; animation:fadeIn .2s ease; padding: .75rem; }
  .ph-lightbox-box { background:#111; border-radius:16px; overflow:hidden; max-width:900px; width:100%; max-height:calc(100vh - 1.5rem); display:flex; flex-direction:column; box-shadow:0 32px 80px rgba(0,0,0,.6); }
  .ph-lightbox-header { display:flex; align-items:center; gap:.75rem; padding:.9rem 1.2rem; background:#1a1a1a; border-bottom:1px solid #2a2a2a; flex-shrink:0; }
  .ph-lightbox-title { flex:1; font-size:.88rem; font-weight:700; color:white; display:flex; align-items:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .ph-lightbox-counter { font-size:.78rem; font-weight:600; color:rgba(255,255,255,.45); background:rgba(255,255,255,.08); padding:3px 10px; border-radius:20px; white-space:nowrap; }
  .ph-lightbox-close { width:34px; height:34px; min-width:34px; border-radius:8px; background:rgba(255,255,255,.1); border:none; color:rgba(255,255,255,.7); font-size:.9rem; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .2s; }
  .ph-lightbox-close:hover { background:#dc2626; color:white; }
  .ph-lightbox-main { position:relative; flex:1; display:flex; align-items:center; justify-content:center; background:#000; min-height:0; overflow:hidden; }
  .ph-lightbox-img { max-width:100%; max-height:55vh; object-fit:contain; display:block; }
  .ph-lightbox-nav { position:absolute; top:50%; transform:translateY(-50%); width:44px; height:44px; border-radius:50%; background:rgba(255,255,255,.15); border:none; color:white; font-size:1rem; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .2s; z-index:2; backdrop-filter:blur(4px); }
  .ph-lightbox-nav:hover { background:rgba(255,255,255,.3); }
  .ph-lightbox-prev { left:8px; } .ph-lightbox-next { right:8px; }
  .ph-lightbox-thumbs { display:flex; gap:6px; padding:.75rem 1rem; background:#1a1a1a; overflow-x:auto; flex-shrink:0; }
  .ph-lightbox-thumbs::-webkit-scrollbar { height:4px; }
  .ph-lightbox-thumbs::-webkit-scrollbar-thumb { background:#333; border-radius:2px; }
  .ph-lightbox-thumb { flex-shrink:0; width:56px; height:42px; border-radius:6px; overflow:hidden; border:2px solid transparent; cursor:pointer; transition:border-color .2s; }
  .ph-lightbox-thumb.active { border-color: var(--amber); }
  .ph-lightbox-thumb img { width:100%; height:100%; object-fit:cover; display:block; }

  /* ══════════════════════════════
     HERO
     FIX 3 — Mobile background image:
     The hero right panel (image) was
     display:none on mobile. Now we use
     a pseudo-element on .ph-hero itself
     to show the BG image on all screen
     sizes, with a dark overlay so text
     stays readable on mobile.
  ══════════════════════════════ */
  .ph-hero {
    width: 100%; background: #fff;
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
    padding: 2.5rem 1.25rem 2.5rem; min-height: auto;
  }

  /* ═══ FIX 3 — Mobile BG image via pseudo-element ═══ */
 .ph-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url('https://i.pinimg.com/736x/6a/a1/13/6aa11354cc09a664abe1ecccd5a94020.jpg');
    background-size: cover;
    background-position: center;
    z-index: 0;
  }
  /* On desktop the right panel image takes over — hide the pseudo BG */
  @media(min-width: 1024px) {
    .ph-hero::before { display: none; }
    .ph-hero { background: #fff; }
  }

  .ph-hero-wrapper {
    display: flex; flex-direction: column;
    align-items: stretch; width: 100%; max-width: 1200px; gap: 0;
    position: relative; z-index: 1;
  }
  .ph-hero-left {
    display: flex; flex-direction: column;
    justify-content: center; align-items: flex-start;
    padding: 0; position: relative; z-index: 2; width: 100%;
  }

  /* ═══ FIX 3 — On mobile, text turns white to be readable over the dark BG ═══ */
  @media(max-width: 1023px) {
    .ph-hero-left h1 { color: #fff !important; }
    .ph-hero-badge { background: rgba(245,166,35,.2) !important; color: #ffd580 !important; border: 1px solid rgba(245,166,35,.4); }
    .ph-hero-sub { color: rgba(255,255,255,.8) !important; }
    .ph-hero-trust-item { color: rgba(255,255,255,.85) !important; }
    .ph-hero-trust-item i { color: #4ade80 !important; }
    .ph-btn-ghost { background: rgba(255,255,255,.12) !important; border-color: rgba(255,255,255,.35) !important; color: white !important; }
    .ph-btn-ghost:hover { background: rgba(255,255,255,.22) !important; }
    .ph-hero-stats { border-top-color: rgba(255,255,255,.18) !important; }
    .ph-hero-stat span { color: rgba(255,255,255,.65) !important; }
  }

  .ph-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;

    background: rgba(255, 243, 205, 0.25); /* transparent amber */
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);

    border: 1px solid rgba(255, 193, 7, 0.25);

    border-radius: 16px;
    padding: .4rem .85rem;
    font-size: .73rem;
    font-weight: 700;
    color: var(--amber-dark);

    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}
  .ph-hero-left h1 {
    font-family: var(--font);
    font-size: clamp(1.9rem, 8vw, 3.6rem);
    font-weight: 900; color: var(--navy);
    line-height: 1.1; margin-bottom: 1rem; letter-spacing: -1px;
  }
  .ph-hero-left h1 em { color: var(--amber); font-style: normal; }
  .ph-hero-sub { font-size: .9rem; color: var(--mid); max-width: 420px; line-height: 1.75; margin-bottom: 1.75rem; font-weight: 500; }
  .ph-hero-btns { display: flex; gap: .75rem; flex-direction: column; margin-bottom: 2rem; width: 100%; }
  .ph-btn-primary {
    background: var(--navy); color: white; padding: .9rem 1.5rem; border-radius: var(--radius);
    font-size: .95rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: center;
    gap: 8px; transition: background .2s, transform .15s; text-decoration: none;
    box-shadow: 0 4px 18px rgba(15,25,35,.22); width: 100%; -webkit-tap-highlight-color: transparent;
  }
  .ph-btn-primary:hover { background: var(--navy-mid); transform: translateY(-1px); }
  .ph-btn-ghost {
    background: #fff; color: var(--navy); border: 2px solid var(--border);
    padding: .9rem 1.5rem; border-radius: var(--radius); font-size: .95rem; font-weight: 700;
    display: inline-flex; align-items: center; justify-content: center;
    gap: 10px; transition: all .2s; text-decoration: none; width: 100%;
    -webkit-tap-highlight-color: transparent;
  }
  .ph-btn-ghost:hover { border-color: var(--navy); background: var(--off-white); }
  .ph-hero-trust { display: flex; flex-direction: column; gap: .55rem; margin-bottom: 1.75rem; }
  .ph-hero-trust-item { display: flex; align-items: center; gap: 7px; font-size: .82rem; font-weight: 600; color: var(--mid); }
  .ph-hero-trust-item i { color: var(--wa-green); font-size: .9rem; flex-shrink: 0; }
  .ph-hero-stats {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1rem; width: 100%; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border);
  }
  .ph-hero-stat { text-align: center; }
  .ph-hero-stat strong { display: block; font-family: var(--font); font-size: 1.5rem; font-weight: 900; color: var(--amber); letter-spacing: -1px; }
  .ph-hero-stat span { font-size: .68rem; color: var(--mid); font-weight: 500; line-height: 1.3; display: block; }
  .ph-hero-right { display: none; }
  @media(min-width: 600px) {
    .ph-hero { padding: 3.5rem 2rem; }
    .ph-hero-btns { flex-direction: row; }
    .ph-btn-primary, .ph-btn-ghost { width: auto; flex: 1; }
    .ph-hero-trust { flex-direction: row; flex-wrap: wrap; gap: 1rem; }
    .ph-hero-stat strong { font-size: 1.7rem; }
    .ph-hero-stat span { font-size: .74rem; }
  }
  @media(min-width: 1024px) {
    .ph-hero { padding: 0; min-height: 88vh; }
    .ph-hero-wrapper { flex-direction: row; min-height: 88vh; }
    .ph-hero-left { flex: 1; padding: 5rem 4rem 5rem 8%; align-items: flex-start; }
    .ph-hero-btns { flex-direction: row; width: auto; }
    .ph-btn-primary, .ph-btn-ghost { width: auto; flex: none; }
    .ph-hero-stats { grid-template-columns: repeat(3, auto); width: auto; }
    .ph-hero-right {
      display: block; flex: 1.05; position: relative; overflow: hidden; min-height: 88vh;
    }
    .ph-hero-right img.ph-hero-bg { width: 100%; height: 100%; object-fit: cover; display: block; }
    .ph-hero-right::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(to right, #fff 0%, transparent 15%); pointer-events: none;
    }
  }
  .ph-cards-mask { display: none; }
  @media(min-width: 1024px) {
    .ph-cards-mask {
      display: flex; position: absolute; top: 50%; right: 2.5rem; transform: translateY(-50%);
      height: 420px; overflow: hidden; gap: 1rem; align-items: flex-start;
      z-index: 5; pointer-events: none;
    }
    .ph-cards-col { display: flex; flex-direction: column; gap: 1rem; }
    .ph-cards-up   { animation: scrollUp   20s linear infinite; }
    .ph-cards-down { animation: scrollDown 25s linear infinite; margin-top: 50px; }
    @keyframes scrollUp   { 0%{transform:translateY(0)}    100%{transform:translateY(-50%)} }
    @keyframes scrollDown { 0%{transform:translateY(-50%)} 100%{transform:translateY(0)} }
    .ph-anim-card {
      width: 158px; border-radius: 14px; padding: 1rem .9rem;
      display: flex; flex-direction: column; align-items: flex-start;
      gap: .45rem; box-shadow: 0 8px 28px rgba(0,0,0,.12);
      border: 1px solid rgba(255,255,255,.8);
      background: rgba(255,255,255,.95); backdrop-filter: blur(10px);
      flex-shrink: 0;
    }
    .ph-anim-card.with-image { padding: 0; }
    .ph-anim-img { width:100%; height:100px; object-fit:cover; border-radius:14px 14px 0 0; display:block; }
    .ph-anim-body { padding: .8rem; display:flex; flex-direction:column; gap:.35rem; }
    .ph-anim-title { font-size: .75rem; font-weight: 800; color: var(--navy); line-height: 1.2; }
    .ph-anim-sub   { font-size: .65rem; color: var(--mid); line-height: 1.35; }
  }

  /* ══════════════════════════════
     TRUST BAR
  ══════════════════════════════ */
  .ph-trust-bar { background: var(--navy); padding: 1.5rem 1.25rem; }
  .ph-trust-bar-inner {
    max-width: 1100px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
  }
  .ph-trust-item { display: flex; align-items: flex-start; gap: 12px; }
  .ph-trust-icon { width: 40px; height: 40px; min-width: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem; }
  .ph-trust-icon.navy  { background: var(--navy-mid); color: var(--amber); border: 1.5px solid rgba(255,255,255,.1); }
  .ph-trust-icon.amber { background: var(--amber); color: var(--navy); }
  .ph-trust-text strong { display: block; color: #fff; font-size: .85rem; font-weight: 700; margin-bottom: 2px; }
  .ph-trust-text span { color: rgba(255,255,255,.5); font-size: .74rem; line-height: 1.4; }
  @media(min-width: 640px) {
    .ph-trust-bar-inner { grid-template-columns: repeat(4, 1fr); }
    .ph-trust-bar { padding: 1.75rem 1.5rem; }
  }

  /* ══════════════════════════════
     SECTION HEADER
  ══════════════════════════════ */
  .ph-sec-label { font-size: .7rem; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--amber-dark); text-align: center; margin-bottom: .5rem; }
  .ph-sec-title { font-family: var(--font); font-size: clamp(1.5rem, 5vw, 2.2rem); font-weight: 900; text-align: center; line-height: 1.15; margin-bottom: .6rem; color: var(--navy); letter-spacing: -.5px; }
  .ph-sec-title em { font-style: normal; color: var(--amber); }
  .ph-sec-sub { text-align: center; font-size: .88rem; line-height: 1.8; color: var(--mid); max-width: 480px; margin: 0 auto 2rem; font-weight: 500; }

  /* ══════════════════════════════
     DISTRICTS SECTION
  ══════════════════════════════ */
  .ph-dist-sec { background: var(--off-white); padding: clamp(2.5rem, 6vw, 5rem) 1.25rem; }
  .ph-dist-search {
    display: flex; flex-direction: column; gap: .5rem;
    max-width: 660px; margin: 0 auto 2rem;
    background: #fff; padding: .75rem; border-radius: 14px;
    box-shadow: 0 4px 20px rgba(0,0,0,.08); border: 1px solid var(--border);
  }
  .ph-dist-search input, .ph-dist-search select {
    width: 100%; padding: .75rem 1rem; border: 1.5px solid var(--border); border-radius: 9px;
    font-size: .9rem; background: var(--off-white); color: var(--dark); outline: none;
    font-family: inherit; transition: border .2s; font-weight: 500;
    -webkit-appearance: none; appearance: none;
  }
  .ph-dist-search input:focus, .ph-dist-search select:focus { border-color: var(--amber); }
  .ph-dist-search-btn {
    background: var(--navy); color: white; border: none; border-radius: 9px;
    padding: .75rem 1.4rem; font-size: .9rem; font-weight: 700; cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    transition: background .2s; font-family: inherit; width: 100%;
    -webkit-tap-highlight-color: transparent;
  }
  .ph-dist-search-btn:hover { background: var(--navy-mid); }
  @media(min-width: 520px) {
    .ph-dist-search { flex-direction: row; flex-wrap: wrap; }
    .ph-dist-search input { flex: 2; min-width: 0; width: auto; }
    .ph-dist-search select { flex: 1; min-width: 120px; width: auto; }
    .ph-dist-search-btn { width: auto; }
  }
  .ph-slider-viewport {
    overflow: hidden; max-width: 1100px; margin: 0 auto;
    position: relative; cursor: grab; user-select: none; -webkit-user-select: none;
  }
  .ph-slider-viewport:active { cursor: grabbing; }
  .ph-slider-track { display: flex; gap: 1rem; transition: transform .55s cubic-bezier(.4,0,.2,1); will-change: transform; }
  .ph-slide-card {
    flex-shrink: 0; width: calc(100vw - 2.5rem); border-radius: var(--radius-lg); overflow: hidden;
    background: white; border: 1.5px solid var(--border); cursor: pointer; text-align: left; padding: 0;
    transition: transform .25s, box-shadow .25s; box-shadow: 0 2px 12px rgba(0,0,0,.06);
  }
  .ph-slide-card:hover { transform: translateY(-6px); box-shadow: 0 16px 36px rgba(15,25,35,.13); border-color: var(--amber); }
  .ph-slide-img-wrap { position: relative; width: 100%; height: 170px; overflow: hidden; }
  .ph-slide-img { width: 100%; height: 170px; object-fit: cover; display: block; pointer-events: none; transition: transform .35s; }
  .ph-slide-card:hover .ph-slide-img { transform: scale(1.05); }
  .ph-slide-body { padding: 1rem; }
  .ph-slide-district { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.8px; color: var(--amber-dark); margin-bottom: .3rem; }
  .ph-slide-name { font-size: .92rem; font-weight: 800; color: var(--navy); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: .25rem; }
  /* FIX 1 — description snippet on slider card */
  .ph-slide-desc {
    font-size: .73rem; color: var(--mid); line-height: 1.5;
    margin-top: .3rem; margin-bottom: .3rem;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .ph-slide-meta { font-size: .73rem; color: var(--mid); display: flex; gap: .7rem; margin-top: .35rem; flex-wrap: wrap; }
  .ph-slide-badge { display: inline-block; font-size: .63rem; font-weight: 700; padding: 2px 9px; border-radius: 20px; background: var(--amber-light); color: var(--amber-dark); margin-top: .4rem; }
  .ph-slide-price { font-size: .92rem; font-weight: 800; color: var(--navy); margin-top: .4rem; }
  .ph-slide-verified {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: .6rem; font-weight: 800; color: #065f46;
    background: #dcfce7; padding: 2px 8px; border-radius: 20px;
    margin-top: .35rem; width: fit-content;
  }
  .ph-slide-verified i { font-size: .58rem; }

  @media(min-width: 520px) { .ph-slide-card { width: calc((100vw - 3rem) / 2); } }
  @media(min-width: 768px) { .ph-slide-card { width: calc((100vw - 3.6rem) / 3); } }
  @media(min-width: 1100px) { .ph-slide-card { width: 248px; } .ph-slider-track { gap: 1.2rem; } }

  .ph-prop-nav { display: flex; align-items: center; justify-content: space-between; max-width: 1100px; margin: 1.25rem auto 0; }
  .ph-prop-dots { display: flex; gap: 6px; }
  .ph-prop-dot { width: 8px; height: 8px; border-radius: 50%; background: #d1d5db; border: none; cursor: pointer; padding: 0; transition: all .3s; min-width: 8px; }
  .ph-prop-dot.active { background: var(--amber); width: 24px; border-radius: 4px; }
  .ph-prop-nav-btns { display: flex; gap: .5rem; }
  .ph-prop-nav-btn { width: 42px; height: 42px; border-radius: 50%; border: 1.5px solid var(--navy); background: white; color: var(--navy); font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .2s; -webkit-tap-highlight-color: transparent; }
  .ph-prop-nav-btn:hover { background: var(--navy); color: white; }
  .ph-prop-empty { text-align: center; padding: 2.5rem; color: var(--mid); font-size: .9rem; background: white; border-radius: var(--radius); border: 1.5px dashed var(--border); }

  /* ══════════════════════════════
     TYPES SECTION
  ══════════════════════════════ */
  .ph-types-sec { background: #fff; padding: clamp(2.5rem, 6vw, 5rem) 1.25rem; }
  .ph-types-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: .75rem; max-width: 1100px; margin: 0 auto; }
  .ph-type-card { background: var(--off-white); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 1.5rem 1rem; text-align: center; color: var(--dark); transition: all .25s; display: flex; flex-direction: column; align-items: center; -webkit-tap-highlight-color: transparent; }
  .ph-type-card:active { background: var(--navy); border-color: var(--navy); color: white; }
  .ph-type-card:hover { background: var(--navy); border-color: var(--navy); color: white; transform: translateY(-5px); box-shadow: 0 12px 28px rgba(15,25,35,.18); }
  .ph-type-card i { font-size: 1.5rem; color: var(--amber); display: block; margin-bottom: .6rem; transition: color .25s; }
  .ph-type-card:hover i, .ph-type-card:active i { color: var(--amber); }
  .ph-type-card h4 { font-size: .88rem; font-weight: 800; margin-bottom: .3rem; }
  .ph-type-card span { font-size: .7rem; color: var(--mid); transition: color .25s; line-height: 1.3; }
  .ph-type-card:hover span, .ph-type-card:active span { color: rgba(255,255,255,.65); }
  @media(min-width: 480px) { .ph-types-grid { grid-template-columns: repeat(3, 1fr); } }
  @media(min-width: 768px) { .ph-types-grid { grid-template-columns: repeat(6, 1fr); gap: 1rem; } .ph-type-card { padding: 1.75rem 1rem; } }

  /* ══════════════════════════════
     BROWSE DRAWER
  ══════════════════════════════ */
  .ph-browse-overlay { position: fixed; inset: 0; background: rgba(15,25,35,.65); z-index: 1000; display: flex; align-items: flex-end; justify-content: center; backdrop-filter: blur(4px); animation: fadeIn .25s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .ph-browse-drawer { background: white; width: 100%; max-width: 1100px; max-height: 92vh; border-radius: 20px 20px 0 0; display: flex; flex-direction: column; animation: slideUp .3s cubic-bezier(.34,1.56,.64,1); overflow: hidden; }
  @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
  .ph-browse-handle { width: 40px; height: 4px; background: #ddd; border-radius: 2px; margin: .75rem auto .25rem; flex-shrink: 0; }
  .ph-browse-header { display: flex; align-items: center; justify-content: space-between; padding: .75rem 1.25rem 1rem; border-bottom: 1px solid var(--border); flex-shrink: 0; }
  .ph-browse-header-left { display: flex; align-items: center; gap: .6rem; }
  .ph-browse-header-icon { width: 38px; height: 38px; min-width: 38px; border-radius: 10px; background: var(--amber-light); display: flex; align-items: center; justify-content: center; font-size: 1rem; color: var(--amber-dark); }
  .ph-browse-header h3 { font-size: 1rem; font-weight: 800; color: var(--navy); }
  .ph-browse-header p  { font-size: .75rem; color: var(--mid); margin-top: 1px; }
  .ph-browse-close { width: 36px; height: 36px; min-width: 36px; border-radius: 10px; background: var(--light-gray); border: 1px solid var(--border); font-size: 1.2rem; color: var(--mid); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .2s; -webkit-tap-highlight-color: transparent; }
  .ph-browse-close:hover, .ph-browse-close:active { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }
  .ph-browse-body { flex: 1; overflow-y: auto; padding: 1.25rem; -webkit-overflow-scrolling: touch; }
  .ph-browse-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; gap: 1rem; color: var(--mid); font-size: .9rem; }
  .ph-spinner { width: 36px; height: 36px; border: 3px solid var(--amber-light); border-top-color: var(--amber); border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to{transform:rotate(360deg)} }
  .ph-browse-empty { text-align: center; padding: 3rem 1rem; }
  .ph-browse-empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: .3; }
  .ph-browse-empty h4 { font-size: 1rem; font-weight: 700; color: var(--navy); margin-bottom: .5rem; }
  .ph-browse-empty p { font-size: .85rem; color: var(--mid); }
  .ph-prop-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
  @media(min-width: 480px) { .ph-prop-grid { grid-template-columns: repeat(2, 1fr); } }
  @media(min-width: 768px) { .ph-prop-grid { grid-template-columns: repeat(3, 1fr); } }
  .ph-browse-footer { padding: .9rem 1.25rem; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; background: var(--off-white); gap: .75rem; flex-wrap: wrap; }
  .ph-browse-footer p { font-size: .82rem; color: var(--mid); }
  .ph-browse-footer strong { color: var(--navy); }
  .ph-browse-see-all { background: var(--navy); color: white; padding: .55rem 1.25rem; border-radius: 8px; font-size: .85rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; transition: background .2s; text-decoration: none; border: none; cursor: pointer; font-family: inherit; -webkit-tap-highlight-color: transparent; white-space: nowrap; }
  .ph-browse-see-all:hover, .ph-browse-see-all:active { background: var(--navy-mid); }

  /* ══════════════════════════════
     PROPERTY CARD
     FIX 1 — description added below price
  ══════════════════════════════ */
  .ph-prop-card { border: 1.5px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; background: white; transition: all .25s; box-shadow: 0 2px 10px rgba(0,0,0,.06); display: flex; flex-direction: column; }
  .ph-prop-card:hover { transform: translateY(-4px); box-shadow: 0 14px 32px rgba(15,25,35,.12); border-color: var(--amber); }
  .ph-prop-img-wrap { position: relative; height: 175px; overflow: hidden; background: var(--light-gray); flex-shrink: 0; cursor: pointer; }
  .ph-prop-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .4s; }
  .ph-prop-card:hover .ph-prop-img-wrap img { transform: scale(1.05); }
  .ph-prop-no-img { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: var(--mid); opacity: .3; }
  .ph-prop-badges { position: absolute; top: 10px; left: 10px; display: flex; gap: 5px; flex-wrap: wrap; z-index: 1; }
  .ph-prop-badge { font-size: .63rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: .5px; }
  .ph-prop-badge.rent { background: var(--navy); color: white; }
  .ph-prop-badge.sale { background: var(--amber); color: var(--navy); }
  .ph-prop-badge.type { background: rgba(255,255,255,.92); color: #374151; }
  .ph-prop-verified-badge {
    position: absolute; top: 10px; right: 10px;
    background: rgba(5,150,105,.9); color: white;
    font-size: .62rem; font-weight: 800;
    padding: 3px 9px; border-radius: 20px;
    display: flex; align-items: center; gap: 4px;
    backdrop-filter: blur(4px); z-index: 2;
    letter-spacing: .2px;
  }
  .ph-prop-verified-badge i { font-size: .58rem; }
  .ph-prop-img-count { position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,.55); border-radius: 8px; color: white; font-size: .7rem; font-weight: 700; padding: 4px 9px; display: flex; align-items: center; gap: 4px; z-index: 1; backdrop-filter: blur(4px); }
  .ph-prop-body { padding: 1rem; flex: 1; }
  .ph-prop-name { font-size: .95rem; font-weight: 800; color: var(--navy); margin-bottom: .3rem; line-height: 1.3; }
  .ph-prop-loc { font-size: .76rem; color: var(--mid); display: flex; align-items: center; gap: 4px; margin-bottom: .6rem; }
  .ph-prop-loc i { color: var(--amber-dark); font-size: .72rem; }
  .ph-prop-price { font-size: 1.05rem; font-weight: 800; color: var(--navy); }
  /* FIX 1 — property description snippet */
  .ph-prop-desc {
    font-size: .75rem; color: var(--mid); line-height: 1.55; margin-top: .5rem;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .ph-prop-meta { display: flex; gap: .8rem; margin-top: .5rem; flex-wrap: wrap; }
  .ph-prop-meta-item { font-size: .72rem; color: var(--mid); display: flex; align-items: center; gap: 3px; }
  .ph-prop-meta-item i { color: var(--amber-dark); }
  .ph-prop-actions { padding: .75rem 1rem; border-top: 1px solid var(--border); display: flex; gap: .5rem; flex-wrap: wrap; }
  .ph-prop-wa {
    flex: 1; background: var(--wa-green); color: white; border: none;
    border-radius: 8px; padding: .6rem .5rem; font-size: .78rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center; gap: 5px;
    text-decoration: none; transition: background .18s; cursor: pointer;
    -webkit-tap-highlight-color: transparent; min-width: 80px;
  }
  .ph-prop-wa:hover, .ph-prop-wa:active { background: var(--wa-green-dark); }
  .ph-prop-call {
    background: var(--wa-green); color: white; border: none;
    border-radius: 8px; padding: .6rem .75rem; font-size: .78rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center; gap: 5px;
    text-decoration: none; transition: background .18s; -webkit-tap-highlight-color: transparent;
  }
  .ph-prop-call:hover, .ph-prop-call:active { background: var(--wa-green-dark); }
  .ph-prop-save {
    background: var(--off-white); color: var(--mid);
    border: 1.5px solid var(--border); border-radius: 8px;
    padding: .6rem .7rem; font-size: .78rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center; gap: 4px;
    cursor: pointer; transition: all .2s; -webkit-tap-highlight-color: transparent;
  }
  .ph-prop-save:hover { border-color: var(--amber); color: var(--amber-dark); background: var(--amber-light); }
  .ph-prop-save.saved { background: var(--amber-light); border-color: var(--amber); color: var(--amber-dark); }
  .ph-prop-save.saved i { color: var(--amber); }
  .ph-prop-save i { font-size: .85rem; }
  .ph-prop-share {
    background: var(--off-white); color: var(--mid);
    border: 1.5px solid var(--border); border-radius: 8px;
    padding: .6rem .7rem; font-size: .78rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center; gap: 4px;
    cursor: pointer; transition: all .2s; -webkit-tap-highlight-color: transparent;
  }
  .ph-prop-share:hover { border-color: var(--wa-green); color: var(--wa-green); background: #f0fdf4; }
  .ph-prop-share i { font-size: .85rem; }

  /* ══════════════════════════════
     LOCATIONS GRID
  ══════════════════════════════ */
  .ph-locs-sec { background: var(--off-white); padding: clamp(2.5rem, 6vw, 5rem) 1.25rem; }
  .ph-locs-grid { display: grid; grid-template-columns: 1fr 1fr; grid-auto-rows: 160px; gap: .75rem; max-width: 1100px; margin: 1.5rem auto 0; }
  .ph-loc-card { border-radius: var(--radius-lg); overflow: hidden; position: relative; border: none; background: transparent; padding: 0; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  .ph-loc-card img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .4s; }
  .ph-loc-card:hover img { transform: scale(1.06); }
  .ph-loc-card.big { grid-column: 1 / -1; height: 200px; }
  .ph-loc-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,25,35,.82) 0%, transparent 55%); display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem; }
  .ph-loc-overlay small { color: rgba(255,255,255,.65); font-size: .7rem; font-weight: 600; }
  .ph-loc-overlay h4 { color: white; font-size: .95rem; font-weight: 800; }
  .ph-loc-overlay p  { color: rgba(255,255,255,.6); font-size: .75rem; }
  @media(min-width: 640px) {
    .ph-locs-grid { grid-template-columns: 2fr 1fr 1fr; grid-template-rows: 220px 220px; grid-auto-rows: auto; }
    .ph-loc-card.big { grid-column: 1; grid-row: 1 / 3; height: auto; }
  }

  /* ══════════════════════════════
     DUAL
  ══════════════════════════════ */
  .ph-dual-sec { display: grid; grid-template-columns: 1fr; gap: 1.25rem; padding: clamp(2.5rem, 6vw, 5rem) 1.25rem; max-width: 1100px; margin: 0 auto; }
  .ph-dual-card { background: white; padding: 2rem 1.5rem; border-radius: var(--radius-lg); text-align: center; box-shadow: 0 8px 28px rgba(15,25,35,.07); border: 1.5px solid var(--border); transition: all .3s; display: flex; flex-direction: column; align-items: center; }
  .ph-dual-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(15,25,35,.12); border-color: var(--amber); }
  .ph-dual-icon { font-size: 2.2rem; margin-bottom: .9rem; }
  .ph-dual-icon.tenant   { color: var(--navy); }
  .ph-dual-icon.landlord { color: var(--amber); }
  .ph-dual-card h3 { font-size: 1.1rem; font-weight: 800; color: var(--navy); margin-bottom: .65rem; }
  .ph-dual-card p  { color: var(--mid); font-size: .88rem; line-height: 1.75; margin-bottom: 1.25rem; font-weight: 500; }
  .ph-dual-note { font-size: .74rem; color: var(--amber-dark); font-weight: 700; background: var(--amber-light); padding: .35rem .9rem; border-radius: 20px; margin-bottom: 1rem; }
  .ph-btn-outline { border: 2px solid var(--navy); color: var(--navy); background: transparent; padding: .7rem 1.6rem; border-radius: 9px; font-size: .88rem; font-weight: 700; transition: all .2s; display: inline-block; text-decoration: none; -webkit-tap-highlight-color: transparent; }
  .ph-btn-outline:hover, .ph-btn-outline:active { background: var(--navy); color: white; }
  @media(min-width: 640px) { .ph-dual-sec { grid-template-columns: repeat(2, 1fr); } }

  /* ══════════════════════════════
     FEATURES
  ══════════════════════════════ */
  .ph-features-sec { background: #fff; padding: clamp(2.5rem, 6vw, 5rem) 1.25rem; text-align: center; }
  .ph-features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .9rem; max-width: 1100px; margin: 2rem auto 0; }
  .ph-feature-card { background: var(--off-white); padding: 1.5rem 1.25rem; border-radius: var(--radius-lg); box-shadow: 0 4px 16px rgba(15,25,35,.06); transition: transform .3s, box-shadow .3s; border: 1.5px solid var(--border); text-align: left; }
  .ph-feature-card:hover { transform: translateY(-6px); box-shadow: 0 14px 32px rgba(15,25,35,.1); border-color: var(--amber); }
  .ph-feature-card i { font-size: 1.6rem; color: var(--amber); display: block; margin-bottom: .8rem; }
  .ph-feature-card h4 { font-size: .93rem; font-weight: 800; color: var(--navy); margin-bottom: .4rem; }
  .ph-feature-card p  { font-size: .82rem; color: var(--mid); line-height: 1.65; font-weight: 500; }
  @media(min-width: 640px) { .ph-features-grid { grid-template-columns: repeat(4, 1fr); gap: 1.25rem; } .ph-feature-card { text-align: center; } .ph-feature-card i { font-size: 1.9rem; } }

  /* ══════════════════════════════
     FAQ
  ══════════════════════════════ */
  .ph-faq { position: relative; padding: clamp(2.5rem, 6vw, 5rem) 1.25rem clamp(3rem, 8vw, 6rem); background: var(--navy); text-align: center; overflow: hidden; }
  .ph-faq-qmark { position: absolute; right: 2%; top: 50%; transform: translateY(-50%); font-size: clamp(6rem, 20vw, 22rem); font-weight: 900; color: rgba(255,255,255,.03); pointer-events: none; z-index: 1; font-family: var(--font); line-height: 1; }
  .ph-faq-inner { position: relative; z-index: 2; }
  .ph-faq-heading { display: inline-block; font-size: clamp(1.8rem, 5vw, 3rem); color: #fff; position: relative; letter-spacing: .15rem; font-family: var(--font); font-weight: 900; margin-bottom: 2rem; padding: .5rem 1.5rem; }
  .ph-faq-heading::before { content: ''; position: absolute; top: 0; left: 0; width: 1.5rem; height: 1.5rem; border-top: .3rem solid var(--amber); border-left: .3rem solid var(--amber); }
  .ph-faq-heading::after  { content: ''; position: absolute; bottom: 0; right: 0; width: 1.5rem; height: 1.5rem; border-bottom: .3rem solid var(--amber); border-right: .3rem solid var(--amber); }
  .ph-faq-list { max-width: 860px; margin: 0 auto; }
  .ph-acc { margin-bottom: .6rem; cursor: pointer; }
  .ph-acc-header { display: flex; align-items: stretch; }
  .ph-acc-plus { width: 48px; min-width: 48px; flex-shrink: 0; background: rgba(255,255,255,.08); border: 2px solid var(--amber); display: flex; align-items: center; justify-content: center; transition: all .3s; }
  .ph-acc-plus span { font-size: 1.6rem; color: var(--amber); font-weight: 300; line-height: 1; transition: transform .3s, color .3s; display: block; }
  .ph-acc-label { flex: 1; background: rgba(255,255,255,.07); min-height: 52px; display: flex; align-items: center; padding: .5rem 1.2rem; transition: background .3s; }
  .ph-acc-label h3 { font-size: clamp(.8rem, 2vw, .95rem); font-weight: 700; color: white; margin: 0; text-align: left; font-family: var(--font); line-height: 1.4; }
  .ph-acc:hover .ph-acc-label, .ph-acc:active .ph-acc-label { background: rgba(255,255,255,.12); }
  .ph-acc:hover .ph-acc-plus, .ph-acc.open .ph-acc-plus { background: var(--amber-light); }
  .ph-acc.open .ph-acc-plus span { transform: rotate(45deg); color: var(--amber-dark); }
  .ph-acc-body { max-height: 0; overflow: hidden; transition: max-height .4s ease, padding .3s; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-top: none; border-left: 3px solid var(--amber); text-align: left; }
  .ph-acc.open .ph-acc-body { max-height: 400px; padding: 1.1rem 1.4rem; }
  .ph-acc-body p { font-size: .88rem; line-height: 1.8; color: rgba(255,255,255,.7); font-family: var(--font); font-weight: 500; }

  /* ══════════════════════════════
     CTA SECTION
  ══════════════════════════════ */
  .ph-cta-sec { background: var(--navy); color: white; text-align: center; padding: clamp(2.5rem, 6vw, 5rem) 1.25rem; border-top: 1px solid rgba(255,255,255,.06); }
  .ph-cta-inner { max-width: 1100px; margin: 0 auto; background: rgba(255,255,255,.05); border: 1.5px solid rgba(255,255,255,.1); border-radius: 20px; padding: 2rem 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 2rem; text-align: center; }
  .ph-cta-left { width: 100%; text-align: center; }
  .ph-cta-icon { width: 56px; height: 56px; border-radius: 14px; background: var(--amber); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: var(--navy); margin: 0 auto 1rem; }
  .ph-cta-left h2 { font-size: clamp(1.2rem, 4vw, 1.9rem); font-weight: 900; color: white; margin-bottom: .6rem; }
  .ph-cta-left p  { color: rgba(255,255,255,.65); font-size: .9rem; font-weight: 500; }
  .ph-cta-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; width: 100%; }
  .ph-cta-stat strong { display: block; font-size: 1.75rem; font-weight: 900; color: var(--amber); letter-spacing: -1px; }
  .ph-cta-stat span { font-size: .72rem; color: rgba(255,255,255,.5); font-weight: 500; }
  .ph-cta-actions { display: flex; flex-direction: column; align-items: center; gap: .9rem; width: 100%; }
  .ph-cta-btn-main { background: var(--amber); color: var(--navy); padding: .9rem 2rem; border-radius: var(--radius); font-size: .95rem; font-weight: 800; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; transition: all .2s; border: none; box-shadow: 0 6px 20px rgba(245,166,35,.35); white-space: nowrap; font-family: var(--font); width: 100%; justify-content: center; -webkit-tap-highlight-color: transparent; }
  .ph-cta-btn-main:hover, .ph-cta-btn-main:active { background: #e09516; }
  .ph-cta-note { font-size: .8rem; color: rgba(255,255,255,.45); }
  .ph-cta-note a { color: var(--amber); font-weight: 700; }
  @media(min-width: 640px) { .ph-cta-stats { grid-template-columns: repeat(4, 1fr); } .ph-cta-btn-main { width: auto; } }
  @media(min-width: 900px) { .ph-cta-inner { flex-direction: row; text-align: left; padding: 3rem 2.5rem; } .ph-cta-left { text-align: left; } .ph-cta-icon { margin: 0 0 1rem; } .ph-cta-actions { align-items: flex-start; } }

  /* ══════════════════════════════
     FOOTER
  ══════════════════════════════ */
  .ph-footer { background: #0a1118; color: rgba(255,255,255,.45); padding: clamp(2rem, 5vw, 4rem) 1.25rem 1.5rem; }
  .ph-footer-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; max-width: 1100px; margin: 0 auto 2rem; }
  .ph-footer-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; }
  .ph-footer-logo-icon { width: 34px; height: 34px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1.5px solid var(--amber); }
  .ph-footer-logo-icon img { width: 100%; height: 100%; object-fit: contain; }
  .ph-footer-logo-text { font-size: 1.05rem; font-weight: 800; color: white; }
  .ph-footer-brand p { font-size: .82rem; line-height: 1.75; color: rgba(255,255,255,.38); max-width: 240px; margin-bottom: 1.2rem; font-weight: 500; }
  .ph-footer-socials { display: flex; gap: .6rem; }
  .ph-footer-social { width: 34px; height: 34px; border-radius: 8px; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.5); display: flex; align-items: center; justify-content: center; font-size: .85rem; transition: all .2s; cursor: pointer; }
  .ph-footer-social:hover { background: var(--amber); color: var(--navy); border-color: var(--amber); }
  .ph-footer-links-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  .ph-footer-col h5 { color: rgba(255,255,255,.85); font-size: .8rem; font-weight: 800; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 1rem; }
  .ph-footer-col a { display: block; color: rgba(255,255,255,.4); font-size: .82rem; margin-bottom: .5rem; transition: color .2s; font-weight: 500; }
  .ph-footer-col a:hover { color: var(--amber); }
  .ph-footer-newsletter h5 { color: rgba(255,255,255,.85); font-size: .8rem; font-weight: 800; text-transform: uppercase; letter-spacing: .5px; margin-bottom: .5rem; }
  .ph-footer-newsletter p { font-size: .8rem; color: rgba(255,255,255,.38); margin-bottom: 1rem; line-height: 1.6; }
  .ph-footer-email-row { display: flex; }
  .ph-footer-email-row input { flex: 1; padding: .65rem 1rem; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); border-right: none; border-radius: 8px 0 0 8px; color: white; font-size: .82rem; outline: none; font-family: var(--font); }
  .ph-footer-email-row input::placeholder { color: rgba(255,255,255,.25); }
  .ph-footer-email-row button { background: var(--amber); border: none; border-radius: 0 8px 8px 0; padding: .65rem 1rem; cursor: pointer; color: var(--navy); font-size: 1rem; transition: background .2s; flex-shrink: 0; }
  .ph-footer-email-row button:hover { background: var(--amber-dark); }
  .ph-footer-bottom { border-top: 1px solid rgba(255,255,255,.06); padding-top: 1.2rem; display: flex; flex-direction: column; align-items: center; gap: .4rem; font-size: .74rem; color: rgba(255,255,255,.25); max-width: 1100px; margin: 0 auto; text-align: center; }
  @media(min-width: 640px) { .ph-footer-grid { grid-template-columns: 1.5fr 1.5fr 1fr; } .ph-footer-links-row { display: contents; } .ph-footer-newsletter { grid-column: 1 / -1; } .ph-footer-bottom { flex-direction: row; justify-content: space-between; } }
  @media(min-width: 900px) { .ph-footer-grid { grid-template-columns: 2fr 1fr 1fr 1.5fr; } .ph-footer-newsletter { grid-column: auto; } }

  /* ══════════════════════════════
     FAVORITES PAGE
  ══════════════════════════════ */
  .ph-favpage { padding: clamp(2rem, 5vw, 4rem) 1.25rem; max-width: 1100px; margin: 0 auto; }
  .ph-favpage-head { margin-bottom: 2rem; }
  .ph-favpage-head h2 { font-size: clamp(1.4rem, 4vw, 2rem); font-weight: 900; color: var(--navy); }
  .ph-favpage-head p { font-size: .88rem; color: var(--mid); margin-top: .4rem; }
  .ph-favpage-empty { text-align: center; padding: 4rem 1rem; }
  .ph-favpage-empty-icon { font-size: 4rem; color: var(--amber); opacity: .25; margin-bottom: 1rem; }
  .ph-favpage-empty h3 { font-size: 1.1rem; font-weight: 800; color: var(--navy); margin-bottom: .5rem; }
  .ph-favpage-empty p { color: var(--mid); font-size: .88rem; margin-bottom: 1.5rem; }
  .ph-favpage-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.2rem; }
`;

/* ═══════════════════════════════════════
   HELPERS
═══════════════════════════════════════ */
function waLink(num) {
  if (!num) return null;
  const clean = num.toString().replace(/\D/g, "");
  const intl  = clean.startsWith("0") ? "265" + clean.slice(1) : clean;
  return `https://wa.me/${intl}`;
}
function trackWhatsappClick(propertyId) {
  if (!propertyId) return;
  fetch(`${API_URL}/admin/properties/${propertyId}/whatsapp-click`, { method: "POST" }).catch(() => {});
}
function normalise(p) {
  return {
    _id:           p._id || p.id,
    name:          p.name || p.title || "Unnamed Property",
    description:   p.description || "",
    type:          p.type || p.propertyType || p.property_type || "",
    listingType:   p.listingType || p.listing_type || "For Rent",
    price:         p.price || 0,
    district:      p.district || p.location?.formattedAddress?.split(",").pop()?.trim() || "",
    address:       p.address || p.location?.formattedAddress || "",
    bedrooms:      p.bedrooms || p.beds || 0,
    bathrooms:     p.bathrooms || p.baths || 0,
    availableRooms:p.availableRooms || p.available_rooms || 0,
    gender:        p.gender || "",
    amenities:     p.amenities || [],
    images:        p.images || p.photos || [],
    contactPhone:  p.contactPhone || p.owner?.phone || p.phone || "",
    whatsapp:      p.whatsapp || p.contactPhone || p.owner?.phone || p.phone || "",
    ownerName:     p.owner ? `${p.owner.firstName || ""} ${p.owner.lastName || ""}`.trim() : "",
    verified:      p.verified || p.isVerified || false,
  };
}
function formatPrice(p, listingType, t) {
  if (!p) return t.priceOnRequest;
  const suffix = (listingType || "").toLowerCase().includes("sale") ? "" : "/mo";
  return "MWK " + Number(p).toLocaleString() + suffix;
}

function buildShareMessage(p, t) {
  const price = formatPrice(p.price, p.listingType, t);
  const url   = `${window.location.origin}/properties/${p._id}`;
  return encodeURIComponent(
    `Found this on PezaNyumba 🏡 ${p.name} in ${p.district || "Malawi"} — ${price}. View: ${url}`
  );
}

/* ═══════════════════════════════════════
   IMAGE LIGHTBOX
═══════════════════════════════════════ */
function ImageLightbox({ images, startIndex = 0, propertyName, onClose }) {
  const { t } = useLang();
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
    <div className="ph-lightbox-overlay" onClick={e => e.target === e.currentTarget && onClose()} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="ph-lightbox-box">
        <div className="ph-lightbox-header">
          <div className="ph-lightbox-title"><i className="fa fa-images" style={{color:"var(--amber)",marginRight:"8px"}} /><span>{propertyName}</span></div>
          <div className="ph-lightbox-counter">{idx + 1} {t.lightboxOf} {images.length}</div>
          <button className="ph-lightbox-close" onClick={onClose}><i className="fa fa-times" /></button>
        </div>
        <div className="ph-lightbox-main">
          {images.length > 1 && <button className="ph-lightbox-nav ph-lightbox-prev" onClick={() => setIdx(i => (i - 1 + images.length) % images.length)}><i className="fa fa-chevron-left" /></button>}
          <img src={images[idx]} alt={`${propertyName} — photo ${idx + 1}`} className="ph-lightbox-img" />
          {images.length > 1 && <button className="ph-lightbox-nav ph-lightbox-next" onClick={() => setIdx(i => (i + 1) % images.length)}><i className="fa fa-chevron-right" /></button>}
        </div>
        {images.length > 1 && (
          <div className="ph-lightbox-thumbs">
            {images.map((src, i) => (
              <button key={i} className={`ph-lightbox-thumb${idx === i ? " active" : ""}`} onClick={() => setIdx(i)}>
                <img src={src} alt={`thumb ${i + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   NAVBAR
   FIX 2 — Profile button is now an <a>
   that navigates to /profile
═══════════════════════════════════════ */
function Navbar({ favCount }) {
  const { lang, setLang, t, langs } = useLang();
  const [menuOpen, setMenuOpen]     = useState(false);
  const [langOpen, setLangOpen]     = useState(false);
  const langRef = useRef(null);
  const current = LANGS[lang] || LANGS.en;

  useEffect(() => {
    function h(e) { if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = [
    { href: "/",           label: t.navHome,       icon: "fa fa-home"        },
    { href: "/properties", label: t.navProperties, icon: "fa fa-building"    },
    {/*{ href: "/favorites",  label: t.navFavorites,  icon: "fa fa-heart"       },*/},
    { href: "/about",      label: t.navAbout,      icon: "fa fa-info-circle" },
    { href: "/contact",    label: t.navContact,    icon: "fa fa-envelope"    },
  ];

  return (
    <>
      <nav className="pn-nav">
        <div className="pn-nav-inner">
          <a href="/" className="pn-logo">
            <div className="pn-logo-icon"><img src="/PEZ.png" alt="PezaNyumba Logo" /></div>
            <span className="pn-logo-text">PezaNyumba Mw</span>
          </a>

          <div className="pn-nav-links">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className={`pn-nav-link${l.href === "/" ? " active" : ""}`}>{l.label}</a>
            ))}
          </div>

          <div className="pn-nav-right">
            <a href="/favorites" className="pn-fav-btn" aria-label="Saved properties">
              <i className="fa fa-heart" />
              {t.navFavorites}
              {favCount > 0 && <span className="pn-fav-count">{favCount}</span>}
            </a>

            <div className="ph-lang-switcher" ref={langRef}>
              <button className="pn-lang-pill" onClick={() => setLangOpen(o => !o)} aria-label="Switch language">
                <img src="/web.png" alt="Language" style={{width:"18px",height:"18px",objectFit:"cover",borderRadius:"50%",verticalAlign:"middle"}} />
                <span>{current.code.toUpperCase()}</span>
                <span className="chevron">▼</span>
              </button>
              {langOpen && (
                <div className="ph-lang-dropdown">
                  {langs.map((l, i) => (
                    <div key={l.code}>
                      {i > 0 && <div className="ph-lang-divider" />}
                      <button className={`ph-lang-option${lang === l.code ? " active" : ""}`}
                        onClick={() => { setLang(l.code); setLangOpen(false); }}>
                        <span className="ph-lang-opt-label">{l.label}</span>
                        {lang === l.code && <span className="ph-lang-opt-check">✓</span>}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ═══ FIX 2 — Profile button is now a proper link to /profile ═══ */}
            <a href="/profile" className="pn-profile-btn">
              <div className="pn-profile-avatar"><i className="fa fa-user" /></div>
              <span>{t.navProfile}</span>
              <span style={{fontSize:".6rem",opacity:.7}}>▼</span>
            </a>

            <button
              className={`pn-hamburger${menuOpen ? " open" : ""}`}
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`pn-mobile-menu${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        <div className="pn-mobile-menu-inner">
          <div className="pn-mobile-nav-links">
            {navLinks.map(l => (
              <a key={l.href} href={l.href}
                className={`pn-mobile-nav-link${l.href === "/" ? " active" : ""}${l.href === "/favorites" ? " fav-link" : ""}`}
                onClick={() => setMenuOpen(false)}>
                <i className={l.icon} />
                {l.label}
                {l.href === "/favorites" && favCount > 0 && (
                  <span className="mob-fav-count">{favCount}</span>
                )}
              </a>
            ))}
          </div>
          <div className="pn-mobile-divider" />
          <a href="/profile" className="pn-mobile-profile" onClick={() => setMenuOpen(false)}>
            <div className="pn-mobile-profile-avatar"><i className="fa fa-user" /></div>
            <span>{t.navProfile}</span>
            <i className="fa fa-chevron-right" style={{marginLeft:"auto",fontSize:".75rem",opacity:.5}} />
          </a>
        </div>
      </div>

      {menuOpen && (
        <div
          style={{position:"fixed",inset:0,zIndex:898,background:"transparent"}}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}

/* ═══════════════════════════════════════
   PROPERTY CARD
   FIX 1 — description snippet added
═══════════════════════════════════════ */
function PropertyCard({ property, onFavToggle, isSaved, onToast }) {
  const { t } = useLang();
  const p         = normalise(property);
  const imgSrc    = p.images[0] || null;
  const isForSale = p.listingType.toLowerCase().includes("sale");
  const wa        = waLink(p.whatsapp);
  const call      = p.contactPhone ? `tel:${p.contactPhone}` : null;
  const [lightbox, setLightbox] = useState(false);

  function handleShare(e) {
    e.stopPropagation();
    const msg  = buildShareMessage(p, t);
    const waUrl = `https://wa.me/?text=${msg}`;
    if (navigator.share) {
      navigator.share({
        title: p.name,
        text: `Found this on PezaNyumba Mw ${p.name} in ${p.district || "Malawi"}`,
        url: `${window.location.origin}/properties/${p._id}`,
      }).catch(() => {});
    } else {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }
    onToast(t.shareCopied);
  }

  function handleSave(e) {
    e.stopPropagation();
    onFavToggle(p._id, p);
    onToast(isSaved ? t.favRemoved : t.favAdded);
  }

  return (
    <div className="ph-prop-card">
      <div className="ph-prop-img-wrap" onClick={() => p.images.length > 0 && setLightbox(true)}>
        {imgSrc
          ? <img src={imgSrc} alt={p.name} loading="lazy" />
          : <div className="ph-prop-no-img"><i className="fa fa-home" /></div>
        }
        <div className="ph-prop-badges">
          <span className={`ph-prop-badge ${isForSale ? "sale" : "rent"}`}>{isForSale ? t.forSale : t.forRent}</span>
          {p.type && <span className="ph-prop-badge type">{p.type}</span>}
        </div>
        {p.verified && (
          <div className="ph-prop-verified-badge">
            <i className="fa fa-check-circle" /> {t.verifiedBadge}
          </div>
        )}
        {p.images.length > 1 && <div className="ph-prop-img-count"><i className="fa fa-images" /> {p.images.length}</div>}
      </div>

      <div className="ph-prop-body">
        <div className="ph-prop-name">{p.name}</div>
        <div className="ph-prop-loc"><i className="fa fa-map-marker-alt" />{[p.address, p.district].filter(Boolean).join(", ") || "Malawi"}</div>
        <div className="ph-prop-price">{formatPrice(p.price, p.listingType, t)}</div>
        {/* ═══ FIX 1 — description snippet ═══ */}
        {p.description && (
          <div className="ph-prop-desc">{p.description}</div>
        )}
        <div className="ph-prop-meta">
          {p.bedrooms       > 0 && <span className="ph-prop-meta-item"><i className="fa fa-bed"       /> {p.bedrooms} {t.bed}</span>}
          {p.bathrooms      > 0 && <span className="ph-prop-meta-item"><i className="fa fa-bath"      /> {p.bathrooms} {t.bath}</span>}
          {p.availableRooms > 0 && <span className="ph-prop-meta-item"><i className="fa fa-door-open" /> {p.availableRooms} {t.avail}</span>}
          {p.gender              && <span className="ph-prop-meta-item"><i className="fa fa-user"     /> {p.gender}</span>}
        </div>
      </div>

      <div className="ph-prop-actions">
        {wa && (
          <a className="ph-prop-wa" href={wa} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsappClick(p._id)}>
            <i className="fab fa-whatsapp" /> {t.waBtn}
          </a>
        )}
        {call && (
          <a className="ph-prop-call" href={call}>
            <i className="fa fa-phone" /> {t.callBtn}
          </a>
        )}
        {!wa && !call && <span style={{fontSize:".75rem",color:"#9ca3af",padding:".5rem"}}>{t.noContact}</span>}

        <button
          className={`ph-prop-save${isSaved ? " saved" : ""}`}
          onClick={handleSave}
          title={isSaved ? t.savedBtn : t.saveBtn}
          aria-label={isSaved ? t.savedBtn : t.saveBtn}
        >
          <i className={isSaved ? "fa fa-heart" : "far fa-heart"} />
        </button>

        <button
          className="ph-prop-share"
          onClick={handleShare}
          title={t.shareBtn}
          aria-label={t.shareBtn}
        >
          <i className="fab fa-whatsapp" />
        </button>
      </div>

      {lightbox && p.images.length > 0 && (
        <ImageLightbox images={p.images} startIndex={0} propertyName={p.name} onClose={() => setLightbox(false)} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   BROWSE DRAWER
═══════════════════════════════════════ */
function BrowseDrawer({ filter, filterValue, filterIcon, onClose, allProperties, favIds, onFavToggle, onToast }) {
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
    const param = filter === "district"
      ? `district=${encodeURIComponent(filterValue)}`
      : `type=${encodeURIComponent(filterValue)}`;
    fetch(`${API_URL}/properties?${param}&limit=50`)
      .then(r => r.json())
      .then(data => setProperties(data.properties || data.data || []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, [filter, filterValue, allProperties]);

  const viewAllHref = filter === "district"
    ? `/properties?district=${encodeURIComponent(filterValue)}`
    : `/properties?type=${encodeURIComponent(filterValue)}`;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="ph-browse-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ph-browse-drawer">
        <div className="ph-browse-handle" />
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
            <div className="ph-prop-grid">
              {properties.map((p, i) => (
                <PropertyCard
                  key={p._id || p.id || i}
                  property={p}
                  isSaved={favIds.has(p._id || p.id)}
                  onFavToggle={onFavToggle}
                  onToast={onToast}
                />
              ))}
            </div>
          )}
        </div>
        {!loading && properties.length > 0 && (
          <div className="ph-browse-footer">
            <p>
              {t.drawerShowing} <strong>{properties.length}</strong>{" "}
              {filter === "district" ? `${t.drawerPropsIn} ${filterValue}` : `${filterValue} ${t.drawerListings}`}
            </p>
            <a href={viewAllHref} className="ph-browse-see-all">
              <i className="fa fa-th" /> {t.drawerViewAll}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   HERO
═══════════════════════════════════════ */
function Hero() {
  const { t } = useLang();
  const CARDS_COL1 = [
    { title:t.cardVerified,  sub:t.cardVerifiedSub },
    { title:t.cardPrices,    sub:t.cardPricesSub,   image:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop" },
    { title:t.cardTrusted,   sub:t.cardTrustedSub  },
    { title:t.cardDistricts, sub:t.cardDistrictsSub,image:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&auto=format&fit=crop" },
    { title:t.cardVerified,  sub:t.cardVerifiedSub },
    { title:t.cardPrices,    sub:t.cardPricesSub,   image:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop" },
    { title:t.cardTrusted,   sub:t.cardTrustedSub  },
    { title:t.cardDistricts, sub:t.cardDistrictsSub,image:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&auto=format&fit=crop" },
  ];
  const CARDS_COL2 = [
    { title:t.cardQuick,   sub:t.cardQuickSub,   image:"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&auto=format&fit=crop" },
    { title:t.cardDispute, sub:t.cardDisputeSub },
    { title:t.cardDirect,  sub:t.cardDirectSub,  image:"https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&auto=format&fit=crop" },
    { title:t.cardRated,   sub:t.cardRatedSub   },
    { title:t.cardQuick,   sub:t.cardQuickSub,   image:"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&auto=format&fit=crop" },
    { title:t.cardDispute, sub:t.cardDisputeSub },
    { title:t.cardDirect,  sub:t.cardDirectSub,  image:"https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&auto=format&fit=crop" },
    { title:t.cardRated,   sub:t.cardRatedSub   },
  ];

  return (
    <section className="ph-hero">
      <div className="ph-hero-wrapper">
        <div className="ph-hero-left">
          <div className="ph-hero-badge">
             {t.heroBadge}
          </div>
          <h1>
            {t.heroH1a} <em>{t.heroH1em}</em><br />
            {t.heroH1b}
          </h1>
          <div className="ph-hero-trust">
            <div className="ph-hero-trust-item"><i className="fa fa-check-circle" /> {t.heroTrust1}</div>
            <div className="ph-hero-trust-item"><i className="fa fa-check-circle" /> {t.heroTrust2}</div>
            <div className="ph-hero-trust-item"><i className="fa fa-check-circle" /> {t.heroTrust3}</div>
          </div>
          <div className="ph-hero-btns">
            <a className="ph-btn-primary" href="#browse-districts">
              <i className="fa fa-search" /> {t.heroBrowse}
            </a>
            <a className="ph-btn-ghost" href="/register">
              <span>{t.heroList}</span>
            </a>
          </div>
          <div className="ph-hero-stats">
            <div className="ph-hero-stat"><strong>500+</strong><span>{t.heroStat1}</span></div>
            <div className="ph-hero-stat"><strong>28</strong><span>{t.heroStat2}</span></div>
            <div className="ph-hero-stat"><strong>🛡️</strong><span>{t.heroStat3}</span></div>
          </div>
        </div>

        {/* Desktop-only right panel with image + animated cards */}
        <div className="ph-hero-right">
          <img className="ph-hero-bg"
            src="https://i.pinimg.com/736x/6a/a1/13/6aa11354cc09a664abe1ecccd5a94020.jpg"
            alt="Property" />
          <div className="ph-cards-mask">
            <div className="ph-cards-col ph-cards-up">
              {CARDS_COL1.map((c, i) => (
                <div key={i} className={`ph-anim-card${c.image ? " with-image" : ""}`}>
                  {c.image && <img src={c.image} alt={c.title} className="ph-anim-img" />}
                  <div className={c.image ? "ph-anim-body" : ""} style={!c.image ? {padding:"1rem .9rem"} : {}}>
                    <div className="ph-anim-title">{c.title}</div>
                    <div className="ph-anim-sub">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="ph-cards-col ph-cards-down">
              {CARDS_COL2.map((c, i) => (
                <div key={i} className={`ph-anim-card${c.image ? " with-image" : ""}`}>
                  {c.image && <img src={c.image} alt={c.title} className="ph-anim-img" />}
                  <div className={c.image ? "ph-anim-body" : ""} style={!c.image ? {padding:"1rem .9rem"} : {}}>
                    <div className="ph-anim-title">{c.title}</div>
                    <div className="ph-anim-sub">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   TRUST BAR
═══════════════════════════════════════ */
function TrustBar() {
  const items = [
    { icon:"fa fa-shield-alt", label:"Verified Properties",  sub:"All properties are verified and trusted",  style:"navy"  },
    { icon:"fa fa-tag",        label:"Best Prices",          sub:"Affordable prices guaranteed",             style:"amber" },
    { icon:"fa fa-headset",    label:"24/7 Support",         sub:"We're here to help you anytime",           style:"navy"  },
    { icon:"fa fa-lock",       label:"Safe & Secure",        sub:"Your safety is our top priority",          style:"amber" },
  ];
  return (
    <div className="ph-trust-bar">
      <div className="ph-trust-bar-inner">
        {items.map((item, i) => (
          <div key={i} className="ph-trust-item">
            <div className={`ph-trust-icon ${item.style}`}><i className={item.icon} /></div>
            <div className="ph-trust-text">
              <strong>{item.label}</strong>
              <span>{item.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   DISTRICTS SLIDER
   FIX 1 — description shown on slider cards
═══════════════════════════════════════ */
const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&auto=format&fit=crop",
];

function DistrictsSection({ allProperties, favIds, onFavToggle, onToast }) {
  const { t } = useLang();
  const PROPERTY_TYPES_T = [
    { icon:"fa fa-home",        label:t.ptHouse },
    { icon:"fa fa-building",    label:t.ptFlat  },
    { icon:"fa fa-bed",         label:t.ptRoom  },
    { icon:"fa fa-door-closed", label:t.ptSelf  },
    { icon:"fa fa-seedling",    label:t.ptPlot  },
    { icon:"fa fa-store",       label:t.ptComm  },
  ];
  const [filtered, setFiltered]         = useState([]);
  const [locSearch, setLocSearch]       = useState("");
  const [typeFilter, setTypeFilter]     = useState("");
  const [current, setCurrent]           = useState(0);
  const [drawer, setDrawer]             = useState(null);
  const [lightboxData, setLightboxData] = useState(null);
  const [visCount, setVisCount]         = useState(1);
  const timerRef    = useRef(null);
  const trackRef    = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const dragStartX  = useRef(null);
  const isDragging  = useRef(false);

  useEffect(() => {
    function calc() {
      const w = window.innerWidth;
      setVisCount(w < 520 ? 1 : w < 768 ? 2 : w < 1100 ? 3 : 4);
    }
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
    applyFilter(allProperties || [], locSearch, typeFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProperties]);

  const handleSearch = () => applyFilter(allProperties || [], locSearch, typeFilter);
  const maxIdx = Math.max(0, filtered.length - visCount);

  const slideTo = useCallback((idx) => { setCurrent(Math.max(0, Math.min(idx, maxIdx))); }, [maxIdx]);
  const next = useCallback(() => setCurrent(c => (c >= maxIdx ? 0 : c + 1)), [maxIdx]);

  const resetAuto = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 3500);
  }, [next]);

  useEffect(() => {
    if (filtered.length > visCount) resetAuto();
    return () => clearInterval(timerRef.current);
  }, [filtered, visCount, resetAuto]);

  function getCardW() {
    const track = trackRef.current;
    if (!track || !track.children[0]) return 260;
    const gap = parseFloat(getComputedStyle(track).gap) || 16;
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
        <h2 className="ph-sec-title">{t.distTitle1} <em>{t.distTitle2}</em></h2>
        <p className="ph-sec-sub">{t.distSub}</p>
        <div className="ph-dist-search">
          <input type="text" placeholder={t.distSearch} value={locSearch}
            onChange={e => setLocSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()} />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">{t.distAllTypes}</option>
            {PROPERTY_TYPES_T.map(pt => <option key={pt.label} value={pt.label}>{pt.label}</option>)}
          </select>
          <button className="ph-dist-search-btn" onClick={handleSearch}>
            <i className="fa fa-search" /> {t.distBtn}
          </button>
        </div>

        <div className="ph-slider-viewport"
          onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}
          onMouseLeave={() => { dragStartX.current = null; isDragging.current = false; }}>
          {filtered.length === 0 ? (
            <div className="ph-prop-empty">
              <i className="fa fa-search" style={{fontSize:"2rem",opacity:.3,display:"block",marginBottom:".75rem"}} />
              {(!allProperties || allProperties.length === 0) ? t.distLoading : t.distEmpty}
            </div>
          ) : (
            <div ref={trackRef} className="ph-slider-track" style={{transform:`translateX(-${translateX}px)`}}>
              {filtered.map((raw, i) => {
                const p = normalise(raw);
                const imgSrc = p.images[0] || FALLBACK_IMGS[i % FALLBACK_IMGS.length];
                const hasRealImages = p.images.length > 0;
                return (
                  <button key={p._id || i} className="ph-slide-card"
                    onClick={() => { if (!isDragging.current) setDrawer({ label: p.district || "All", icon: "fa fa-map-marker-alt" }); }}
                    onDragStart={e => e.preventDefault()}>
                    <div className="ph-slide-img-wrap">
                      <img src={imgSrc} alt={p.name} className="ph-slide-img" draggable="false"
                        onError={e => { e.target.src = FALLBACK_IMGS[i % FALLBACK_IMGS.length]; }} />
                      {hasRealImages && (
                        <button className="ph-slide-img-btn"
                          style={{position:"absolute",bottom:8,right:8,background:"rgba(0,0,0,.55)",border:"none",borderRadius:"8px",color:"white",fontSize:".7rem",fontWeight:700,padding:"5px 10px",display:"flex",alignItems:"center",gap:4,cursor:"pointer",backdropFilter:"blur(4px)",fontFamily:"inherit",zIndex:2}}
                          onClick={e => { e.stopPropagation(); setLightboxData({ images: p.images, name: p.name }); }}>
                          <i className="fa fa-images" />
                          {p.images.length > 1 ? `${p.images.length} photos` : "View photo"}
                        </button>
                      )}
                    </div>
                    <div className="ph-slide-body">
                      <div className="ph-slide-district">{p.district || "Malawi"}</div>
                      <div className="ph-slide-name">{p.name}</div>
                      {/* ═══ FIX 1 — description on slider card ═══ */}
                      {p.description && (
                        <div className="ph-slide-desc">{p.description}</div>
                      )}
                      <div className="ph-slide-meta">
                        {p.bedrooms       > 0 && <span><i className="fa fa-bed"       /> {p.bedrooms} {t.bed}</span>}
                        {p.bathrooms      > 0 && <span><i className="fa fa-bath"      /> {p.bathrooms}</span>}
                        {p.availableRooms > 0 && <span><i className="fa fa-door-open" /> {p.availableRooms} {t.avail}</span>}
                      </div>
                      {p.type && <span className="ph-slide-badge">{p.type}</span>}
                      <div className="ph-slide-price">{formatPrice(p.price, p.listingType, t)}</div>
                      {p.verified && (
                        <div className="ph-slide-verified">
                          <i className="fa fa-check-circle" /> {t.verifiedBadge}
                        </div>
                      )}
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
                <button key={i} className={`ph-prop-dot${current === i ? " active" : ""}`}
                  onClick={() => { slideTo(i); resetAuto(); }} />
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
          onClose={() => setDrawer(null)} allProperties={allProperties}
          favIds={favIds} onFavToggle={onFavToggle} onToast={onToast} />
      )}
      {lightboxData && (
        <ImageLightbox images={lightboxData.images} startIndex={0} propertyName={lightboxData.name}
          onClose={() => setLightboxData(null)} />
      )}
    </>
  );
}

/* ═══════════════════════════════════════
   PROPERTY TYPES
═══════════════════════════════════════ */
function TypesSection({ allProperties, favIds, onFavToggle, onToast }) {
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
          onClose={() => setDrawer(null)} allProperties={allProperties}
          favIds={favIds} onFavToggle={onFavToggle} onToast={onToast} />
      )}
    </>
  );
}

/* ═══════════════════════════════════════
   LOCATIONS GRID
═══════════════════════════════════════ */
function LocationsSection({ onDistrictClick }) {
  const { t } = useLang();
  const locs = [
    { img:"https://images.openai.com/static-rsc-4/7GSO5MGOD68caHQdI44Y3hLe4MyxyuQMTUiZUgWmK4NBa7fI2vaAGp7RK3U3lO8e1hLwTx4w7LM5cMn4clIDUd9KH3B9-mOb6jCIZ_Q5LlL5OAv7uUCScacYuWrz7BPiQXmxlBp0STdOhl7a4896qivZSTXavn9Z-6NFCX7tTYQs8Ky-hP98DQ7-uE-w9dS0?purpose=fullsize", big:true, count:"12+ Properties", name:"Lilongwe", desc:"Capital City — All Types",  icon:"fa fa-city"       },
    { img:"https://images.openai.com/static-rsc-4/CMD9954ds4_6BOPsvHM844Clq9dykeax-l3-cXWhTJ6ckL7cOflCUZza4w_f7KFSrJi08eoopWewEVWfPPkSvGODEcOPu2LG_CJcbxfN-J1NS9sVi4HS6ulnvDAqXG3FCIR_K0dhPSOBSF36Ev51ksmzT7V21WQN2szPdOyieQ5KkNKJP3fmauDceVJ6TQxi?purpose=fullsize",          count:"9 Properties",   name:"Blantyre", desc:"Commercial ",           icon:"fa fa-building"   },
    { img:"https://images.openai.com/static-rsc-4/_Lh70gzg7xEH5YOvg0AnAhSlPO581JjkelrC0vorj6ALz9B9GPXEfji49zdNynL48g2njFKHACKFqXnMLudLlr2ycoe2Dbo2wiyjw5bLkJvVuXZRCWrRFb7MJg8Ntr6qLZJ_t7D2xPs6MVc3bbTinSEtoXTOvVYoWfWABh_U5BHZI5Yh8cY48GliPd66ID0x?purpose=fullsize",          count:"5 Properties",   name:"Zomba",    desc:"land for sale",          icon:"fa fa-university" },
    { img:"https://images.openai.com/static-rsc-4/nv_QlhwWZCv955PL3xGwEgfwJDi5j8U1Gi-986mweT31XYLRQ09DqHXzPZUSft9WY0nnOAvUPfDbLOl-brmg3wsNRcjVEDYsm89QSMf_00rp0Xddt5Jo8zGB81BMgvDkwkU-ppX590f8P4vdj4HNIeYTVJ-PlLotWGjgcpxhZvlw5q03MJRl0NqKRJGZkaDP?purpose=fullsize",          count:"4 Properties",   name:"Mzuzu",    desc:"Northern Region",      icon:"fa fa-mountain"   },
    { img:"https://images.openai.com/static-rsc-4/Vh-2gQ3WSgCRZ0kspbOnsOpa9fSnFlQvKawKL5fpyloVLCZxufa0na82xBX8m6DSELpxmtFnkygdtlmlbiydqEtSv5XBPrVInCYczRaF5rWTJDSVgb2rlXbNN8N9ckZtEr73GaMJtz8Sa0weJ4_-b7G8OMlnI_AvQ-__jnIhuzZGrVM_ENseGJ2MKiprwCON?purpose=fullsize",          count:"6 Properties",   name:"Mangochi", desc:"Mangochi",         icon:"fa fa-water"      },
  ];
  return (
    <section className="ph-locs-sec">
      <p className="ph-sec-label">{t.locsLabel}</p>
      <h2 className="ph-sec-title">{t.locsTitle1} <em>{t.locsTitle2}</em></h2>
      <div className="ph-locs-grid">
        {locs.map(l => (
          <button key={l.name} className={`ph-loc-card${l.big ? " big" : ""}`} onClick={() => onDistrictClick(l)}>
            <img src={l.img} alt={l.name} loading="lazy" />
            <div className="ph-loc-overlay">
              <small>{l.count}</small><h4>{l.name}</h4><p>{l.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   DUAL
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

/* ═══════════════════════════════════════
   FEATURES
═══════════════════════════════════════ */
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

/* ═══════════════════════════════════════
   FAQ
═══════════════════════════════════════ */
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
   FAVORITES PAGE
═══════════════════════════════════════ */
function FavoritesPage({ favIds, allProperties, onFavToggle, onToast }) {
  const { t } = useLang();

  const saved = allProperties
    .map(normalise)
    .filter(p => favIds.has(p._id));

  return (
    <div className="ph-favpage">
      <div className="ph-favpage-head">
        <h2><i className="fa fa-heart" style={{color:"var(--amber)",marginRight:".5rem"}} /> {t.navFavorites}</h2>
        <p>{saved.length > 0 ? `${saved.length} saved propert${saved.length === 1 ? "y" : "ies"}` : ""}</p>
      </div>
      {saved.length === 0 ? (
        <div className="ph-favpage-empty">
          <div className="ph-favpage-empty-icon"><i className="fa fa-heart" /></div>
          <h3>No saved properties yet</h3>
          <p>Tap the heart icon on any listing to save it here. No account needed.</p>
          <a href="#browse-districts" className="ph-btn-primary" style={{display:"inline-flex",width:"auto",padding:".75rem 1.8rem",borderRadius:"var(--radius)",textDecoration:"none"}}>
            <i className="fa fa-search" /> Browse Properties
          </a>
        </div>
      ) : (
        <div className="ph-favpage-grid">
          {saved.map(p => (
            <PropertyCard
              key={p._id}
              property={p}
              isSaved={true}
              onFavToggle={onFavToggle}
              onToast={onToast}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   FOOTER
═══════════════════════════════════════ */
function Footer() {
  return (
    <footer className="ph-footer">
      <div className="ph-footer-grid">
        <div className="ph-footer-brand">
          <div className="ph-footer-logo">
            <div className="ph-footer-logo-icon"><img src="/PEZ.png" alt="PezaNyumba Logo" /></div>
            <span className="ph-footer-logo-text">PezaNyumba Mw</span>
          </div>
          <p>Your trusted platform for finding the best properties in Malawi.</p>
          <div className="ph-footer-socials">
            {["fa-facebook-f","fa-instagram","fa-twitter","fa-linkedin-in"].map(ic => (
              <div key={ic} className="ph-footer-social"><i className={`fab ${ic}`} /></div>
            ))}
          </div>
        </div>
        <div className="ph-footer-links-row">
          <div className="ph-footer-col">
            <h5>Company</h5>
            <a href="/about">About Us</a>
            <a href="/how-it-works">How it Works</a>
            <a href="/careers">Careers</a>
            <a href="/blog">Blog</a>
          </div>
          <div className="ph-footer-col">
            <h5>Support</h5>
            <a href="/help">Help Center</a>
            <a href="/terms">Terms &amp; Conditions</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/contact">Contact Us</a>
          </div>
        </div>
        <div className="ph-footer-newsletter">
          <h5>Subscribe to our newsletter</h5>
          <p>Get the latest updates and offers straight to your inbox.</p>
          <div className="ph-footer-email-row">
            <input type="email" placeholder="Enter your email" />
            <button aria-label="Subscribe"><i className="fa fa-arrow-right" /></button>
          </div>
        </div>
      </div>
      <div className="ph-footer-bottom">
        <span>© 2026 PezaNyumbaMw. All rights reserved.</span>
        <span>Made with love in Malawi </span>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════
   ROOT
═══════════════════════════════════════ */
export default function Home() {
  const langState             = useLangState();
  const { favIds, toggle, isSaved } = useFavorites();
  const { toasts, show }      = useToast();
  const [allProperties, setAllProperties] = useState([]);
  const [locDrawer, setLocDrawer]         = useState(null);

  const isFavoritesPage = typeof window !== "undefined" && window.location.pathname === "/favorites";

fetch(`${API_URL}/hostels?limit=20`)
  .then(r => r.json())
  .then(data => setAllProperties(data.properties || data.hostels || data.data || []))
  .catch(() => {});

  function handleFavToggle(id, propertyData) {
    toggle(id);
    if (propertyData) {
      setAllProperties(prev => {
        if (prev.some(p => (p._id || p.id) === id)) return prev;
        return [...prev, propertyData];
      });
    }
  }

  const sharedProps = {
    allProperties,
    favIds,
    onFavToggle: handleFavToggle,
    onToast:     show,
  };

  return (
    <LangContext.Provider value={langState}>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      <ToastContainer toasts={toasts} />

      <Navbar favCount={favIds.size} />

      {isFavoritesPage ? (
        <FavoritesPage
          favIds={favIds}
          allProperties={allProperties}
          onFavToggle={handleFavToggle}
          onToast={show}
        />
      ) : (
        <>
          <Hero />
          <TrustBar />
          <DistrictsSection {...sharedProps} />
          <TypesSection {...sharedProps} />
          <LocationsSection onDistrictClick={l => setLocDrawer(l)} />
          <DualSection />
          <FeaturesSection />
          <FAQSection />

          <section className="ph-cta-sec">
            <div className="ph-cta-inner">
              <div className="ph-cta-left">
                <div className="ph-cta-icon"><i className="fa fa-home" /></div>
                <h2>{langState.t.ctaTitle}</h2>
                <p>{langState.t.ctaSub}</p>
              </div>
              <div className="ph-cta-stats">
                <div className="ph-cta-stat"><strong>500+</strong><span>Listed Properties</span></div>
                <div className="ph-cta-stat"><strong>10K+</strong><span>Happy Users</span></div>
                <div className="ph-cta-stat"><strong>28</strong><span>Districts Covered</span></div>
                <div className="ph-cta-stat"><strong>4.6★</strong><span>Average Rating</span></div>
              </div>
              <div className="ph-cta-actions">
                <a href="/register" className="ph-cta-btn-main">
                  {langState.t.ctaBtn} <i className="fa fa-arrow-right" />
                </a>
                <p className="ph-cta-note">
                  {langState.t.ctaNote}{" "}
                  <a href="/login">{langState.t.ctaLogin}</a>
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />

      {locDrawer && (
        <BrowseDrawer
          filter="district"
          filterValue={locDrawer.name}
          filterIcon={locDrawer.icon}
          onClose={() => setLocDrawer(null)}
          {...sharedProps}
        />
      )}
    </LangContext.Provider>
  );
}