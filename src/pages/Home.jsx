import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ═══════════════════════════════════════
   LANGUAGE SYSTEM
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
    ptHouse:  "House",         ptHouseDesc:  "Family homes",
    ptFlat:   "Flat/Apartment",ptFlatDesc:   "Modern apartments",
    ptRoom:   "Single Room",   ptRoomDesc:   "Affordable rooms",
    ptSelf:   "Self-Contained",ptSelfDesc:   "Own entrance & bath",
    ptPlot:   "Plot of Land",  ptPlotDesc:   "Build your dream",
    ptComm:   "Commercial Space",ptCommDesc: "Shops & offices",
    cardVerified: "Verified Properties", cardVerifiedSub: "All listings checked & approved",
    cardPrices:   "Best Prices",         cardPricesSub:   "Affordable for every budget",
    cardTrusted:  "Trusted Landlords",   cardTrustedSub:  "Identity-verified owners",
    cardDistricts:"All Districts",       cardDistrictsSub:"28 districts covered",
    cardQuick:    "Quick Inquiry",       cardQuickSub:    "Contact landlords in seconds",
    cardDispute:  "Dispute Support",     cardDisputeSub:  "We resolve problems fairly",
    cardDirect:   "Direct Messaging",   cardDirectSub:   "Chat with landlords safely",
    cardRated:    "Top Rated",           cardRatedSub:    "Reviews from real tenants",
    forSale: "For Sale", forRent: "For Rent",
    noContact: "No contact info",
    waBtn: "WhatsApp", callBtn: "Call",
    bed: "bed", bath: "bath", avail: "avail.",
    priceOnRequest: "Price on request",
    navProperties: "Properties",
    navAbout: "About",
    navContact: "Contact",
    navLogin: "Login",
    navRegister: "List Property",
  },

  ny: {
    code: "ny", label: "Chichewa", flag: "🇲🇼",
    switchLang: "Chilankhulo",
    heroBadge:   "Kupeza nyumba ku Malawi konse — Palibe akaunti yofunikira",
    heroH1a:     "Pezani",
    heroH1em:    "Nyumba Yabwino",
    heroH1b:     "Kulikonse ku Malawi",
    heroSub:     "Palibe akaunti yofunikira. Sakani nyumba zazikulu, nyumba zazing'ono, ndi malo ogulitsa ku maboma onse 28 Muno Malawi — sankhani boma lanu ndikuyamba kufufuza malo kapena nyumba m'dera lililonse.",
    heroBrowse:  "Sakani Nyumba",
    heroList:    "Ikani Nyumba Yanu",
    heroTrust1:  "Simukuyenera kukhara ndi account kuti mupeze nyumba",
    heroTrust2:  "Lumikizanani pa whatsapp kapena kumuyimbila mwini nyumba",
    heroTrust3:  "Kuyika kapena kupeza nyumba ndiulele",
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
    distSub:     "Sakani malalo kapena mtundu — swipe kapena gwiritsa ntchito mivi kuti mufufuza.",
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
    tenantDesc:  "Sakani nyumba zonse zazikulu, onani zithunzi, onani mitengo, ndikupeza nomboro ya mwini nyumba mwachindunji — mwaulere, palibe kulemba.",
    tenantBtn:   "Yambani Kusaka",
    landlordTitle:"Eni Nyumba ndi Malo",
    landlordNote: "✓ Lembelani ndi kuika nyumba",
    landlordDesc: "Pangani akaunti ya mwini nyumba kuika nyumba yanu. Anthu ofuna nyumba muzalumikizana pa WhatsApp pompopompo!.",
    landlordBtn:  "Lembeleni ngati Mwini Nyumba",
    featLabel:   "Chifukwa chosankha ife",
    featTitle1:  "Chifukwa Kusankha",
    featTitle2:  "PezaNyumba?",
    feat1Title:  "Sakani Mwaulere",
    feat1Desc:   "Palibe akaunti. Sakani pa boma, mtengo, ndi mtundu kupeza nyumba yanu msanga.",
    feat2Title:  "WhatsApp Mwachindunji",
    feat2Desc:   "Dinani WhatsApp pa nyumba iliyonse kutumiza uthenga kwa mwini nyumba — palibe pakati.",
    feat3Title:  "Nyumba Zazikulu",
    feat3Desc:   "Mwini nyumba aliyense amayezetsa kaye iye ndi nyumbayo kuti alinde anthu ofuna nyumba.",
    feat4Title:  "Kutha Mikangano",
    feat4Desc:   "Ngati vuto likubwera, timagwira ntchito ngati pakati ndikutha vutolo mwachilungamo.",
    faqQ1: "Ndingapeze bwanji nyumba pa PezaNyumba?",
    faqA1: "Palibe akaunti! Saka pa disitikiti kapena mtundu, onani zambiri, kenako imbani WhatsApp kapena foni kwa mwini nyumba.",
    faqQ2: "Ndikufunika akaunti kusaka?",
    faqA2: "Ayi. Anthu ofuna nyumba amayang'ana mauthenga onse, mitengo ndi zithunzi, ndikupeza nomboro mwaulere.",
    faqQ3: "Ndani amatha kupanga akaunti pa PezaNyumba?",
    faqA3: "Eni nyumba ndi eni malo okha. Anthu ofuna nyumba amasakabe — palibe kulemba.",
    faqQ4: "PezaNyumba imayeza bwanji eni nyumba?",
    faqA4: "Mwini nyumba aliyense amayeza iye ndi malo ake asanapange nyumba yake kuti alinde anthu.",
    faqQ5: "Nditha kuika nyumba yanga?",
    faqA5: "Inde — ngati ndinu mwini nyumba kapena mwini malo. Lembeleni, uzuzeni zambiri, ikani zithunzi, ndipo nyumba imakwera pa maola 24.",
    ctaTitle: "Kodi ndinu Mwini Nyumba kapena Mwini Malo?",
    ctaSub:   "Lembeleni kamodzi ndiyamba kuika nyumba zanu kwa anthu ambiri afuna nyumba ku Malawi.",
    ctaBtn:   "Lembelani ngati Mwini Nyumba",
    ctaNote:  "Muli ndi akaunti kale?",
    ctaLogin: "Lowani apa",
    drawerLoading: "Kusaka mauthenga…",
    drawerEmpty1:  "Palibe nyumba zapezeka pa",
    drawerEmpty2:  "Bwererani posachedwa — eni nyumba akuwonjezera nyumba tsiku lililonse.",
    drawerShowing: "Kuwonetsa",
    drawerPropsIn: "nyumba ku",
    drawerListings:"mauthenga",
    drawerViewAll: "Ona Zonse",
    ptHouse:  "Nyumba",          ptHouseDesc:  "Nyumba za mabanja",
    ptFlat:   "Flat/Apartment",  ptFlatDesc:   "Ma apartment achisanu",
    ptRoom:   "Chipinda Chimodzi",ptRoomDesc:  "Zipinda zotsika mtengo",
    ptSelf:   "Self-Contained",  ptSelfDesc:   "Khomo lake & bafa",
    ptPlot:   "Gawo la Malo",    ptPlotDesc:   "Mangani lofunira lanu",
    ptComm:   "Malo a Bizinesi", ptCommDesc:   "Masitolo & maofesi",
    cardVerified: "Nyumba Zazikulu", cardVerifiedSub: "Mauthenga onse ayezedwa",
    cardPrices:   "Mitengo Yabwino", cardPricesSub:   "Yoyenera bajeti iliyonse",
    cardTrusted:  "Eni Nyumba Oyesedwa", cardTrustedSub: "Eni onyezedwa",
    cardDistricts:"Madisitikiti Onse", cardDistrictsSub:"Madisitikiti 28",
    cardQuick:    "Funsani Msanga",  cardQuickSub:    "Lumikizani eni nyumba mwamsanga",
    cardDispute:  "Thandizo la Mikangano", cardDisputeSub: "Timaitha mavuto mwachilungamo",
    cardDirect:   "Uthenga Wachindunji", cardDirectSub: "Lankhulani ndi eni nyumba motetezeka",
    cardRated:    "Woyezetsa Kwambiri", cardRatedSub:  "Maganizo a okangomanga weniweni",
    forSale: "Kugulitsa", forRent: "Kugwiritsa",
    noContact: "Palibe nomboro",
    waBtn: "WhatsApp", callBtn: "Imbani",
    bed: "chipinda", bath: "bafa", avail: "palibe.",
    priceOnRequest: "Funsani mtengo",
    navProperties: "Nyumba",
    navAbout: "Za Ife",
    navContact: "Lumikizani",
    navLogin: "Lowani",
    navRegister: "Ikani Nyumba",
  },

  tu: {
    code: "tu", label: "Tumbuka", flag: "🇲🇼",
    switchLang: "Chilankhulo",
    heroBadge:   "Kupeza nyumba ku Malawi yose — Palije akaunti yofunikira",
    heroH1a:     "Peza",
    heroH1em:    "Nyumba Yabwino",
    heroH1b:     "Kulikonse ku Malawi",
    heroSub:     "Palije akaunti yofunikira. Saka nyumba, ma flat, na malo mu madisitiriki yose 28 — sankha disitiriki lako unyamuke.",
    heroBrowse:  "Saka Nyumba",
    heroList:    "Lemba Nyumba Yako",
    heroTrust1:  "Palije akaunti yosaka",
    heroTrust2:  "WhatsApp mwenye nyumba mwachindunji",
    heroTrust3:  "Ndalama 2.5% yokha",
    heroStat1:   "Nyumba Zalembiwa",
    heroStat2:   "Madisitiriki Yalipo",
    heroStat3:   "Chitetezo cha Mikangano",
    trust1: "Nsanja yolembiwa ku Malawi",
    trust2: "Palije akaunti yosaka",
    trust3: "WhatsApp mwenye nyumba mwachindunji",
    trust4: "Madisitiriki yose 28 yalipo",
    trust5: "Chitetezo cha mikangano chili",
    distLabel:   "Saka malo",
    distTitle1:  "Peza Nyumba mu",
    distTitle2:  "Disitiriki",
    distSub:     "Saka malo panji mtundu — swipe panji gwirisa ntchito mivi kufufuza.",
    distSearch:  "Saka disitiriki panji zina la nyumba…",
    distAllTypes:"Mitundu yose",
    distBtn:     "Saka",
    distLoading: "Kutsitsa nyumba…",
    distEmpty:   "Palije nyumba zapezeka. Yesani kusaka kina.",
    typesLabel:  "Mukufuna chiyani?",
    typesTitle1: "Saka pa",
    typesTitle2: "Mtundu wa Nyumba",
    typesSub:    "Dinani mtundu uliwonse kuona nyumba zamoyo — palije kulemba.",
    locsLabel:   "Malo yithu ya nyumba",
    locsTitle1:  "Malo Yakwaniritsa ku",
    locsTitle2:  "Malawi",
    tenantTitle: "Okusunga & Ogula",
    tenantNote:  "✓ Palije akaunti yofunikira",
    tenantDesc:  "Saka nyumba zose, ona zithunzi, ona mitengo, na kupeza nambala ya mwenye nyumba mwachindunji — mwaulere, palije kulemba.",
    tenantBtn:   "Yambani Kusaka",
    landlordTitle:"Anenye Nyumba & Malo",
    landlordNote: "✓ Lemba kuika nyumba",
    landlordDesc: "Pangani akaunti ya mwenye nyumba kuika nyumba yinu. Anthu ofuna nyumba akuzimbani WhatsApp mwachindunji.",
    landlordBtn:  "Lembani nga Mwenye Nyumba",
    featLabel:   "Chifukwa chosankha ife",
    featTitle1:  "Chifukwa Kusankha",
    featTitle2:  "PezaNyumba?",
    feat1Title:  "Saka Mwaulere",
    feat1Desc:   "Palije akaunti. Saka pa disitiriki, mtengo, na mtundu kupeza nyumba yako msanga.",
    feat2Title:  "WhatsApp Mwachindunji",
    feat2Desc:   "Dinani WhatsApp pa nyumba iliyonse kutuma uthenga kwa mwenye nyumba — palije pakati.",
    feat3Title:  "Nyumba Zayezedwa",
    feat3Desc:   "Mwenye nyumba uliwonse wayezedwa kaye iye na nyumba yake kuti alinde anthu.",
    feat4Title:  "Kutha Mikangano",
    feat4Desc:   "Ngati vuto likubwera, tigwira ntchito nga pakati na kutha vutolo mwachilungamo.",
    faqQ1: "Ndingapeze wuli nyumba pa PezaNyumba?",
    faqA1: "Palije akaunti! Saka pa disitiriki panji mtundu, ona zambiri, kenako zimba WhatsApp panji foni kwa mwenye nyumba.",
    faqQ2: "Ndikufunika akaunti kusaka?",
    faqA2: "Yayi. Anthu ofuna nyumba yayang'ana mauthenga yose, mitengo na zithunzi, na kupeza nambala mwaulere.",
    faqQ3: "Ndani angapange akaunti pa PezaNyumba?",
    faqA3: "Anenye nyumba na anenye malo yokha. Anthu ofuna nyumba yasakabe — palije kulemba.",
    faqQ4: "PezaNyumba iyeza wuli anenye nyumba?",
    faqA4: "Mwenye nyumba uliwonse wayezedwa iye na malo ake asanapange nyumba yake kuti alinde anthu.",
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
    ptHouse:  "Nyumba",          ptHouseDesc:  "Nyumba za mabanja",
    ptFlat:   "Flat/Apartment",  ptFlatDesc:   "Ma apartment yamachisanu",
    ptRoom:   "Chipinda Chimoza",ptRoomDesc:   "Zipinda zotauka mtengo",
    ptSelf:   "Self-Contained",  ptSelfDesc:   "Khomo lake & bafa",
    ptPlot:   "Gawo la Malo",    ptPlotDesc:   "Manga lofunira lako",
    ptComm:   "Malo ya Bizinesi",ptCommDesc:   "Masitolo & maofesi",
    cardVerified: "Nyumba Zayezedwa",    cardVerifiedSub: "Mauthenga yose yayezedwa",
    cardPrices:   "Mitengo Yabwino",     cardPricesSub:   "Yoyenera bajeti iliyonse",
    cardTrusted:  "Anenye Nyumba Oyezedwa", cardTrustedSub: "Anenye oyezedwa",
    cardDistricts:"Madisitiriki Yose",   cardDistrictsSub:"Madisitiriki 28",
    cardQuick:    "Funsani Msanga",      cardQuickSub:    "Lumikizani anenye nyumba msanga",
    cardDispute:  "Thandizo la Mikangano",cardDisputeSub: "Yiitha mavuto mwachilungamo",
    cardDirect:   "Uthenga Wachindunji",  cardDirectSub:  "Lankhulani na anenye nyumba motetezeka",
    cardRated:    "Woyezedwa Kwambiri",   cardRatedSub:   "Maganizo ya okusunga weniweni",
    forSale: "Kugulitsa", forRent: "Kukodisha",
    noContact: "Palije nambala",
    waBtn: "WhatsApp", callBtn: "Zimba",
    bed: "chipinda", bath: "bafa", avail: "palipo.",
    priceOnRequest: "Funsani mtengo",
    navProperties: "Nyumba",
    navAbout: "Za Ife",
    navContact: "Lumikizani",
    navLogin: "Injilani",
    navRegister: "Lemba Nyumba",
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
   NAVBAR — top nav with lang switcher
   (moved away from fixed top-right to
    avoid clashing with profile menus)
═══════════════════════════════════════ */
const navStyles = `
  .ph-navbar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 9000;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    background: rgba(10, 35, 25, 0.96);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(77,217,184,0.12);
    box-shadow: 0 2px 20px rgba(0,0,0,0.35);
  }
  .ph-navbar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }
  .ph-navbar-logo-mark {
    width: 34px; height: 34px;
    border-radius: 9px;
    background: white;
    display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 900; font-size: 16px;
    letter-spacing: -1px;
    border: 1.5px solid rgba(77,217,184,0.3);
    flex-shrink: 0;
  }
  .ph-navbar-brand-text {
    font-size: 0.98rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: 0.3px;
    font-family: 'Poppins', sans-serif;
  }
  .ph-navbar-brand-text em {
    color: #4dd9b8;
    font-style: normal;
  }
  .ph-navbar-center {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  .ph-nav-link {
    color: rgba(255,255,255,0.72);
    font-size: 0.83rem;
    font-weight: 600;
    padding: 0.38rem 0.9rem;
    border-radius: 7px;
    text-decoration: none;
    border: 1.5px solid transparent;
    transition: all 0.18s;
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: 'Manrope', sans-serif;
    white-space: nowrap;
  }
  .ph-nav-link:hover {
    color: #fff;
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.14);
  }
  .ph-nav-link.active {
    color: #4dd9b8;
    background: rgba(77,217,184,0.08);
    border-color: rgba(77,217,184,0.2);
  }
  .ph-navbar-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .ph-navbar-login {
    color: rgba(255,255,255,0.8);
    font-size: 0.83rem;
    font-weight: 700;
    padding: 0.38rem 0.9rem;
    border: 1.5px solid rgba(255,255,255,0.2);
    border-radius: 7px;
    background: transparent;
    text-decoration: none;
    transition: all 0.18s;
    font-family: 'Manrope', sans-serif;
    display: flex; align-items: center; gap: 5px;
  }
  .ph-navbar-login:hover {
    border-color: rgba(255,255,255,0.5);
    color: #fff;
  }
  .ph-navbar-signup {
    color: #fff;
    font-size: 0.83rem;
    font-weight: 700;
    padding: 0.38rem 1rem;
    border: none;
    border-radius: 7px;
    background: #1a5c52;
    text-decoration: none;
    transition: background 0.18s;
    font-family: 'Manrope', sans-serif;
    display: flex; align-items: center; gap: 5px;
  }
  .ph-navbar-signup:hover { background: #0d4a40; }

  /* ── LANG SWITCHER — in navbar, left of login ── */
  .ph-lang-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.07);
    border: 1.5px solid rgba(77,217,184,0.25);
    border-radius: 999px;
    padding: 5px 12px 5px 9px;
    color: rgba(255,255,255,0.85);
    font-size: 0.79rem;
    font-weight: 700;
    cursor: pointer;
    transition: all .2s;
    font-family: 'Manrope', sans-serif;
    white-space: nowrap;
  }
  .ph-lang-pill:hover {
    background: rgba(77,217,184,0.12);
    border-color: rgba(77,217,184,.5);
    color: #fff;
  }
  .ph-lang-pill .ph-lp-flag { font-size: 0.95rem; line-height: 1; }
  .ph-lang-pill .ph-lp-chevron { font-size: .6rem; opacity: .7; transition: transform .2s; }
  .ph-lang-pill.open .ph-lp-chevron { transform: rotate(180deg); }

  .ph-lang-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: white;
    border: 1.5px solid #e2ede9;
    border-radius: 14px;
    box-shadow: 0 16px 48px rgba(0,0,0,.2);
    overflow: hidden;
    min-width: 170px;
    animation: langDrop .18s cubic-bezier(.34,1.56,.64,1);
    z-index: 9999;
  }
  @keyframes langDrop {
    from { opacity:0; transform:translateY(-8px) scale(.96); }
    to   { opacity:1; transform:translateY(0)    scale(1);   }
  }
  .ph-lang-option {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 11px 16px;
    font-size: .85rem;
    font-weight: 600;
    color: #111;
    background: white;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background .15s;
    font-family: 'Manrope', sans-serif;
  }
  .ph-lang-option:hover  { background: #f0faf7; }
  .ph-lang-option.active { background: #e8f5f2; color: #0d4a40; }
  .ph-lang-option .ph-lo-flag  { font-size: 1.1rem; }
  .ph-lang-option .ph-lo-label { flex: 1; }
  .ph-lang-option .ph-lo-check { color: #1a5c52; font-size: .8rem; }
  .ph-lang-divider { height: 1px; background: #e2ede9; }
  .ph-lang-wrap { position: relative; }

  /* Mobile hamburger */
  .ph-navbar-hamburger {
    display: none;
    flex-direction: column;
    gap: 4px;
    padding: 6px;
    cursor: pointer;
    background: none;
    border: none;
  }
  .ph-navbar-hamburger span {
    display: block;
    width: 22px; height: 2px;
    background: rgba(255,255,255,0.8);
    border-radius: 2px;
    transition: all 0.2s;
  }

  @media(max-width: 900px) {
    .ph-navbar-center { display: none; }
    .ph-navbar { padding: 0 1rem; }
  }
  @media(max-width: 640px) {
    .ph-navbar-login { display: none; }
    .ph-navbar-brand-text { display: none; }
  }
  @media(max-width: 400px) {
    .ph-navbar-signup { display: none; }
  }
`;

function Navbar() {
  const { lang, setLang, t, langs } = useLang();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = LANGS[lang] || LANGS.en;

  return (
   <nav className="ph-navbar">
  {/* Logo */}
  <a href="/" className="ph-navbar-logo">
    
    <img 
      src="/PEZ.png" 
      alt="PezaNyumba Logo" 
      className="ph-navbar-logo-mark" 
    />

    <span className="ph-navbar-brand-text">PezaNyumba</span>
  </a>


      {/* Centre nav links */}
      <div className="ph-navbar-center">
        <a href="/" className="ph-nav-link active"><i className="fa fa-home" /> Home</a>
        <a href="/hostels" className="ph-nav-link"><i className="fa fa-building" /> {t.navProperties}</a>
        <a href="/about"      className="ph-nav-link"><i className="fa fa-info-circle" /> {t.navAbout}</a>
        <a href="/contact"    className="ph-nav-link"><i className="fa fa-phone" /> {t.navContact}</a>
      </div>

      {/* Right side: lang + auth */}
      <div className="ph-navbar-right">
        {/* Language switcher pill — lives here, NOT fixed top-right */}
        <div className="ph-lang-wrap" ref={langRef}>
          <button
            className={`ph-lang-pill${langOpen ? " open" : ""}`}
            onClick={() => setLangOpen(o => !o)}
            aria-label="Switch language"
          >
            <span className="ph-lp-flag">{current.flag}</span>
            <span>{current.label}</span>
            <span className="ph-lp-chevron">▼</span>
          </button>
          {langOpen && (
            <div className="ph-lang-dropdown">
              {langs.map((l, i) => (
                <div key={l.code}>
                  {i > 0 && <div className="ph-lang-divider" />}
                  <button
                    className={`ph-lang-option${lang === l.code ? " active" : ""}`}
                    onClick={() => { setLang(l.code); setLangOpen(false); }}
                  >
                    <span className="ph-lo-flag">{l.flag}</span>
                    <span className="ph-lo-label">{l.label}</span>
                    {lang === l.code && <span className="ph-lo-check">✓</span>}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <a href="/login"    className="ph-navbar-login"><i className="fa fa-sign-in-alt" /> {t.navLogin}</a>
        <a href="/register" className="ph-navbar-signup"><i className="fa fa-plus" /> {t.navRegister}</a>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════
   HELPERS
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
    _id:          p._id || p.id,
    name:         p.name || p.title || "Unnamed Property",
    description:  p.description || "",
    type:         p.type || p.propertyType || p.property_type || "",
    listingType:  p.listingType || p.listing_type || "For Rent",
    price:        p.price || 0,
    district:     p.district || p.location?.formattedAddress?.split(",").pop()?.trim() || "",
    address:      p.address || p.location?.formattedAddress || "",
    bedrooms:     p.bedrooms || p.beds || 0,
    bathrooms:    p.bathrooms || p.baths || 0,
    availableRooms: p.availableRooms || p.available_rooms || 0,
    gender:       p.gender || "",
    amenities:    p.amenities || [],
    images:       p.images || p.photos || [],
    contactPhone: p.contactPhone || p.owner?.phone || p.phone || "",
    whatsapp:     p.whatsapp || p.contactPhone || p.owner?.phone || p.phone || "",
    ownerName:    p.owner ? `${p.owner.firstName || ""} ${p.owner.lastName || ""}`.trim() : "",
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
  body { font-family:'Manrope',sans-serif; color:var(--dark); background:#fff; overflow-x:hidden; padding-top:60px; }
  a { text-decoration:none; color:inherit; }
  button { font-family:inherit; cursor:pointer; border:none; background:none; padding:0; }

  .ph-hero {
    min-height:100vh; width:100%;
    background-image:url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80');
    background-size:cover; background-position:center; background-attachment:fixed;
    display:flex; align-items:center; justify-content:center; flex-direction:column;
    text-align:center; padding:6rem 1.2rem 4rem; position:relative; overflow:hidden;
  }
  .ph-hero::before {
    content:''; position:absolute; inset:0; pointer-events:none; z-index:1;
    background:linear-gradient(160deg,rgba(5,22,10,.78) 0%,rgba(10,40,25,.72) 50%,rgba(5,30,18,.80) 100%);
  }
  .ph-hero-wrapper { display:flex; align-items:center; justify-content:center; gap:3rem; width:100%; max-width:1200px; position:relative; z-index:2; }
  .ph-hero > * { position:relative; z-index:2; }
  .ph-hero-left { flex:1; min-width:0; text-align:left; }
  .ph-hero-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.25); border-radius:999px; padding:.4rem 1rem; font-size:.82rem; font-weight:600; color:rgba(255,255,255,.90); margin-bottom:1.5rem; backdrop-filter:blur(6px); }
  .ph-hero-badge-dot { width:8px; height:8px; border-radius:50%; background:var(--green-check); flex-shrink:0; }
  .ph-hero-left h1 { font-family:'Poppins',sans-serif; font-size:clamp(2rem,5vw,3.5rem); font-weight:800; color:white; line-height:1.15; margin-bottom:1rem; }
  .ph-hero-left h1 em { color:#4dd9b8; font-style:normal; }
  .ph-hero-sub { font-size:clamp(.9rem,2vw,1.05rem); color:rgba(255,255,255,.75); max-width:480px; line-height:1.8; margin-bottom:2rem; }
  .ph-hero-btns { display:flex; gap:1rem; flex-wrap:wrap; }
  .ph-btn-primary { background:var(--teal); color:white; padding:.85rem 2rem; border-radius:10px; font-size:.95rem; font-weight:700; display:inline-flex; align-items:center; gap:8px; transition:background .2s; text-decoration:none; box-shadow:0 4px 16px rgba(13,74,64,.25); }
  .ph-btn-primary:hover { background:var(--teal-dark); }
  .ph-btn-ghost { background:rgba(255,255,255,.12); color:white; border:1.5px solid rgba(255,255,255,.4); padding:.85rem 2rem; border-radius:10px; font-size:.95rem; font-weight:700; display:inline-flex; align-items:center; gap:8px; transition:all .2s; text-decoration:none; backdrop-filter:blur(4px); }
  .ph-btn-ghost:hover { background:rgba(255,255,255,.22); }
  .ph-hero-trust { display:flex; gap:2rem; flex-wrap:wrap; margin-top:1.8rem; }
  .ph-hero-trust-item { display:flex; align-items:center; gap:6px; font-size:.84rem; font-weight:600; color:rgba(255,255,255,.80); }
  .ph-hero-trust-item i { color:var(--green-check); font-size:1rem; }
  .ph-hero-stats { display:flex; gap:2.5rem; flex-wrap:wrap; margin-top:2rem; padding-top:2rem; border-top:1px solid rgba(255,255,255,.15); }
  .ph-hero-stat strong { display:block; font-family:'Poppins',sans-serif; font-size:1.6rem; font-weight:800; color:#4dd9b8; }
  .ph-hero-stat span { font-size:.78rem; color:rgba(255,255,255,.55); }
  .ph-hero-right { flex:1; display:flex; align-items:center; justify-content:center; }
  .ph-cards-mask { position:relative; height:420px; overflow:hidden; display:flex; gap:1.2rem; align-items:flex-start; }
  .ph-cards-mask::before,.ph-cards-mask::after { content:''; position:absolute; left:0; right:0; height:80px; z-index:3; pointer-events:none; }
  .ph-cards-mask::before { top:0; background:linear-gradient(to bottom,rgba(5,22,10,.7),transparent); }
  .ph-cards-mask::after  { bottom:0; background:linear-gradient(to top,rgba(5,22,10,.7),transparent); }
  .ph-cards-col { display:flex; flex-direction:column; gap:1.2rem; }
  .ph-cards-up   { animation:scrollUp   20s linear infinite; }
  .ph-cards-down { animation:scrollDown 25s linear infinite; margin-top:60px; }
  @keyframes scrollUp   { 0%{transform:translateY(0)}    100%{transform:translateY(-50%)} }
  @keyframes scrollDown { 0%{transform:translateY(-50%)} 100%{transform:translateY(0)} }
  .ph-anim-card { width:170px; border-radius:16px; padding:1.2rem 1rem; display:flex; flex-direction:column; align-items:flex-start; gap:.5rem; box-shadow:0 8px 28px rgba(0,0,0,.08); border:1px solid rgba(0,0,0,.07); background:white; flex-shrink:0; transition:transform .2s; }
  .ph-anim-card:hover { transform:scale(1.04); }
  .ph-anim-card.with-image { padding:0; }
  .ph-anim-img { width:100%; height:110px; object-fit:cover; border-radius:16px 16px 0 0; display:block; }
  .ph-anim-body { padding:.9rem; display:flex; flex-direction:column; gap:.4rem; }
  .ph-anim-icon { width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:1rem; color:white; flex-shrink:0; }
  .ph-anim-title { font-size:.8rem; font-weight:800; color:#111; line-height:1.2; }
  .ph-anim-sub   { font-size:.7rem; color:#6b7280; line-height:1.4; }
  .ph-anim-card.blue   .ph-anim-icon{background:var(--teal)}
  .ph-anim-card.orange .ph-anim-icon{background:var(--teal-mid)}
  .ph-anim-card.green  .ph-anim-icon{background:#059669}
  .ph-anim-card.purple .ph-anim-icon{background:var(--teal-dark)}
  .ph-anim-card.cyan   .ph-anim-icon{background:#0891b2}
  .ph-anim-card.yellow .ph-anim-icon{background:var(--teal-mid)}
  .ph-anim-card.red    .ph-anim-icon{background:var(--teal)}
  .ph-anim-card.pink   .ph-anim-icon{background:#0d6e5e}
  .ph-wave { position:absolute; bottom:-.5rem; left:0; width:100%; height:11rem; z-index:3; background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='0.04' d='M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,176C672,181,768,139,864,128C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L0,320Z'/%3E%3C/svg%3E") repeat-x; background-size:1440px 11rem; animation:waves 8s linear infinite; }
  .ph-wave2 { animation-direction:reverse; animation-duration:6s; opacity:.3; }
  .ph-wave3 { animation-duration:4s; opacity:.5; }
  @keyframes waves { 0%{background-position-x:0} 100%{background-position-x:1440px} }
  @media(max-width:1024px){
    .ph-hero-wrapper{flex-direction:column;text-align:center;gap:2rem}
    .ph-hero-left{text-align:center} .ph-hero-sub{margin:0 auto 2rem}
    .ph-hero-btns{justify-content:center} .ph-hero-stats{justify-content:center}
    .ph-hero-trust{justify-content:center} .ph-cards-mask{height:280px}
    .ph-anim-card{width:148px}
  }
  @media(max-width:768px){
    .ph-hero-right{display:none}
    .ph-hero-btns{flex-direction:column;align-items:center}
    .ph-btn-primary,.ph-btn-ghost{width:100%;max-width:300px;justify-content:center}
    .ph-hero-stats{gap:1.5rem}
  }
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
   PROPERTY CARD
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
        {imgSrc
          ? <img src={imgSrc} alt={p.name} loading="lazy" />
          : <div className="ph-prop-no-img"><i className="fa fa-home" /></div>
        }
        <div className="ph-prop-badges">
          <span className={`ph-prop-badge ${isForSale ? "sale" : "rent"}`}>
            {isForSale ? t.forSale : t.forRent}
          </span>
          {p.type && <span className="ph-prop-badge type">{p.type}</span>}
        </div>
      </div>
      <div className="ph-prop-body">
        <div className="ph-prop-name">{p.name}</div>
        <div className="ph-prop-loc">
          <i className="fa fa-map-marker-alt" />
          {[p.address, p.district].filter(Boolean).join(", ") || "Malawi"}
        </div>
        <div className="ph-prop-price">{formatPrice(p.price, p.listingType, t)}</div>
        <div className="ph-prop-meta">
          {p.bedrooms      > 0 && <span className="ph-prop-meta-item"><i className="fa fa-bed"       /> {p.bedrooms} {t.bed}</span>}
          {p.bathrooms     > 0 && <span className="ph-prop-meta-item"><i className="fa fa-bath"      /> {p.bathrooms} {t.bath}</span>}
          {p.availableRooms> 0 && <span className="ph-prop-meta-item"><i className="fa fa-door-open" /> {p.availableRooms} {t.avail}</span>}
          {p.gender              && <span className="ph-prop-meta-item"><i className="fa fa-user"    /> {p.gender}</span>}
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
   BROWSE DRAWER
   FIX: "View All" now links to
   /properties?district=X or ?type=X
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
    const param = filter === "district"
      ? `district=${encodeURIComponent(filterValue)}`
      : `type=${encodeURIComponent(filterValue)}`;
    fetch(`${API_URL}/hostels?${param}&limit=50`)
      .then(r => r.json())
      .then(data => setProperties(data.hostels || data.properties || data.data || []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, [filter, filterValue, allProperties]);

  // ✅ Build the correct "View All" URL that goes to /properties
  const viewAllUrl = filter === "district"
    ? `/properties?district=${encodeURIComponent(filterValue)}`
    : `/properties?type=${encodeURIComponent(filterValue)}`;

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
            <div className="ph-prop-grid">
              {properties.map((p, i) => <PropertyCard key={p._id || p.id || i} property={p} />)}
            </div>
          )}
        </div>
        {!loading && properties.length > 0 && (
          <div className="ph-browse-footer">
            <p>
              {t.drawerShowing} <strong>{properties.length}</strong>{" "}
              {filter === "district"
                ? `${t.drawerPropsIn} ${filterValue}`
                : `${filterValue} ${t.drawerListings}`}
            </p>
            {/* ✅ Fixed: points to /properties with correct filter param */}
            <a href={viewAllUrl} className="ph-browse-see-all">
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
    { theme:"blue",   icon:"fa fa-shield-alt",    title:t.cardVerified,  sub:t.cardVerifiedSub },
    { theme:"orange", icon:"fa fa-tag",            title:t.cardPrices,    sub:t.cardPricesSub,   image:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop" },
    { theme:"green",  icon:"fa fa-check-circle",  title:t.cardTrusted,   sub:t.cardTrustedSub  },
    { theme:"purple", icon:"fa fa-map-marker-alt",title:t.cardDistricts, sub:t.cardDistrictsSub,image:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&auto=format&fit=crop" },
    { theme:"blue",   icon:"fa fa-shield-alt",    title:t.cardVerified,  sub:t.cardVerifiedSub },
    { theme:"orange", icon:"fa fa-tag",            title:t.cardPrices,    sub:t.cardPricesSub,   image:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop" },
    { theme:"green",  icon:"fa fa-check-circle",  title:t.cardTrusted,   sub:t.cardTrustedSub  },
    { theme:"purple", icon:"fa fa-map-marker-alt",title:t.cardDistricts, sub:t.cardDistrictsSub,image:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&auto=format&fit=crop" },
  ];
  const CARDS_COL2 = [
    { theme:"cyan",   icon:"fa fa-bolt",     title:t.cardQuick,   sub:t.cardQuickSub,   image:"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&auto=format&fit=crop" },
    { theme:"yellow", icon:"fa fa-headset",  title:t.cardDispute, sub:t.cardDisputeSub },
    { theme:"red",    icon:"fa fa-comments", title:t.cardDirect,  sub:t.cardDirectSub,  image:"https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&auto=format&fit=crop" },
    { theme:"pink",   icon:"fa fa-star",     title:t.cardRated,   sub:t.cardRatedSub   },
    { theme:"cyan",   icon:"fa fa-bolt",     title:t.cardQuick,   sub:t.cardQuickSub,   image:"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&auto=format&fit=crop" },
    { theme:"yellow", icon:"fa fa-headset",  title:t.cardDispute, sub:t.cardDisputeSub },
    { theme:"red",    icon:"fa fa-comments", title:t.cardDirect,  sub:t.cardDirectSub,  image:"https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&auto=format&fit=crop" },
    { theme:"pink",   icon:"fa fa-star",     title:t.cardRated,   sub:t.cardRatedSub   },
  ];
  return (
    <section className="ph-hero">
      <div className="ph-hero-wrapper">
        <div className="ph-hero-left">
          <div className="ph-hero-badge">
            <span className="ph-hero-badge-dot" />
            {t.heroBadge}
          </div>
          <h1>{t.heroH1a} <em>{t.heroH1em}</em><br />{t.heroH1b}</h1>
          <p className="ph-hero-sub">{t.heroSub}</p>
          <div className="ph-hero-btns">
            {/* ✅ Browse button links to properties page */}
            <a className="ph-btn-primary" href="/properties"><i className="fa fa-search" /> {t.heroBrowse}</a>
            <a className="ph-btn-ghost"   href="/register"><i className="fa fa-building" /> {t.heroList}</a>
          </div>
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
        </div>
        <div className="ph-hero-right">
          <div className="ph-cards-mask">
            <div className="ph-cards-col ph-cards-up">
              {CARDS_COL1.map((c, i) => (
                <div key={i} className={`ph-anim-card ${c.theme}${c.image ? " with-image" : ""}`}>
                  {c.image && <img src={c.image} alt={c.title} className="ph-anim-img" />}
                  <div className={c.image ? "ph-anim-body" : ""}>
                    <div className="ph-anim-icon"><i className={c.icon} /></div>
                    <div className="ph-anim-title">{c.title}</div>
                    <div className="ph-anim-sub">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="ph-cards-col ph-cards-down">
              {CARDS_COL2.map((c, i) => (
                <div key={i} className={`ph-anim-card ${c.theme}${c.image ? " with-image" : ""}`}>
                  {c.image && <img src={c.image} alt={c.title} className="ph-anim-img" />}
                  <div className={c.image ? "ph-anim-body" : ""}>
                    <div className="ph-anim-icon"><i className={c.icon} /></div>
                    <div className="ph-anim-title">{c.title}</div>
                    <div className="ph-anim-sub">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="ph-wave" />
      <div className="ph-wave ph-wave2" />
      <div className="ph-wave ph-wave3" />
    </section>
  );
}

/* ═══════════════════════════════════════
   TRUST BAR
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
   DISTRICTS SLIDER
═══════════════════════════════════════ */
const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&auto=format&fit=crop",
];

function DistrictsSection({ allProperties }) {
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
  const [locSearch, setLocSearch]   = useState("");
  const [typeFilter, setTypeFilter] = useState("");
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
    function calc() {
      const w = window.innerWidth;
      setVisCount(w <= 520 ? 1 : w <= 768 ? 2 : w <= 1100 ? 3 : 4);
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
    if (allProperties && allProperties.length > 0) applyFilter(allProperties, locSearch, typeFilter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProperties]);

  const handleSearch = () => applyFilter(allProperties || [], locSearch, typeFilter);
  const maxIdx = Math.max(0, filtered.length - visCount);

  const slideTo = useCallback((idx) => {
    setCurrent(Math.max(0, Math.min(idx, maxIdx)));
  }, [maxIdx]);

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
              {allProperties && allProperties.length === 0 ? t.distLoading : t.distEmpty}
            </div>
          ) : (
            <div ref={trackRef} className="ph-slider-track" style={{transform:`translateX(-${translateX}px)`}}>
              {filtered.map((raw, i) => {
                const p      = normalise(raw);
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
                        {p.bedrooms      > 0 && <span><i className="fa fa-bed"       /> {p.bedrooms} {t.bed}</span>}
                        {p.bathrooms     > 0 && <span><i className="fa fa-bath"      /> {p.bathrooms}</span>}
                        {p.availableRooms> 0 && <span><i className="fa fa-door-open" /> {p.availableRooms} {t.avail}</span>}
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
          onClose={() => setDrawer(null)} allProperties={allProperties} />
      )}
    </>
  );
}

/* ═══════════════════════════════════════
   PROPERTY TYPES
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
   LOCATIONS PHOTO GRID
═══════════════════════════════════════ */
function LocationsSection({ onDistrictClick }) {
  const { t } = useLang();
  const locs = [
    { img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop", big:true, count:"12+ Properties", name:"Lilongwe", desc:"Capital City — All Types",  icon:"fa fa-city"       },
    { img:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&auto=format&fit=crop",          count:"9 Properties",   name:"Blantyre", desc:"Commercial Hub",           icon:"fa fa-building"   },
    { img:"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop",          count:"5 Properties",   name:"Zomba",    desc:"University Town",          icon:"fa fa-university" },
    { img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop",          count:"4 Properties",   name:"Mzuzu",    desc:"Northern Region Hub",      icon:"fa fa-mountain"   },
    { img:"https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop",          count:"6 Properties",   name:"Mangochi", desc:"Lakeshore Living",         icon:"fa fa-water"      },
  ];
  return (
    <section className="ph-locs-sec">
      <p className="ph-sec-label">{t.locsLabel}</p>
      <h2 className="ph-sec-title">{t.locsTitle1} <em>{t.locsTitle2}</em></h2>
      <div className="ph-locs-grid">
        {locs.map(l => (
          <button key={l.name} className={`ph-loc-card${l.big ? " big" : ""}`} onClick={() => onDistrictClick(l)}>
            <img src={l.img} alt={l.name} />
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
   DUAL / FEATURES / FAQ
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
        {/* ✅ Tenant browse links to /properties */}
        <a href="/properties" className="ph-btn-outline">{t.tenantBtn}</a>
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
  const [locDrawer, setLocDrawer]         = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/hostels?limit=500`)
      .then(r => r.json())
      .then(data => setAllProperties(data.hostels || data.properties || data.data || []))
      .catch(() => {});
  }, []);

  return (
    <LangContext.Provider value={langState}>
      <style>{styles}</style>
      <style>{navStyles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      {/* ── Navbar (includes lang switcher — no longer fixed top-right) ── */}
      <Navbar />

      <Hero />
      <TrustBar />
      <DistrictsSection allProperties={allProperties} />
      <TypesSection     allProperties={allProperties} />
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