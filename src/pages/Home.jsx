import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0d1b3e;
    --navy2: #112255;
    --blue: #1a3fa4;
    --orange: #e8501a;
    --white: #ffffff;
    --gray-bg: #f4f6fa;
    --text-dark: #111827;
    --text-mid: #4b5563;
    --card-radius: 14px;
  }

  body { font-family: 'Manrope', sans-serif; color: var(--text-dark); background: #fff; }
  a { text-decoration: none; color: inherit; }

  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2.5rem; height: 68px;
    background: rgba(13,27,62,0.96); backdrop-filter: blur(8px);
  }
  .logo { display: flex; align-items: center; gap: 10px; color: white; cursor: pointer; }
  .logo-icon { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .logo-icon img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
  .logo-text strong { display: block; font-size: 1rem; font-weight: 800; letter-spacing: 1px; color: white; }
  .logo-text span { font-size: 0.65rem; opacity: 0.7; letter-spacing: 0.5px; color: white; }
  
  .nav-actions { display: flex; align-items: center; gap: 1rem; }
  .nav-actions a { color: rgba(255,255,255,0.8); font-size: 0.9rem; text-decoration: none; }
  .btn-add {
    background: var(--orange); color: white; border: none; cursor: pointer;
    padding: 0.5rem 1.1rem; border-radius: 6px; font-size: 0.85rem; font-weight: 600;
    display: flex; align-items: center; gap: 6px; transition: opacity 0.2s; text-decoration: none;
  }
  .btn-add:hover { opacity: 0.9; }

  .hero {
    position: relative; min-height: 100vh; overflow: hidden;
    display: flex; flex-direction: column; justify-content: flex-end;
    padding-bottom: 3rem;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #0d1b3e 0%, #1a3fa4 60%, #0d2b6e 100%);
  }
  .hero-bg::after {
    content: '';
    position: absolute; inset: 0;
    background: url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1400&auto=format&fit=crop') center/cover no-repeat;
    opacity: 0.22;
  }
  .hero-content {
    position: relative; z-index: 2;
    max-width: 700px; padding: 0 3rem; margin-top: 6rem;
  }
  .hero-content h1 {
    color: white; font-size: clamp(2.4rem, 5vw, 3.8rem); font-weight: 800;
    line-height: 1.15; margin-bottom: 1rem;
  }
  .hero-content h1 span { color: #facc15; }
  .hero-content p { color: rgba(255,255,255,0.8); font-size: 1.05rem; max-width: 520px; margin-bottom: 2rem; }

  .search-bar {
    display: flex; align-items: flex-end; gap: 0.75rem; flex-wrap: wrap;
    background: white; border-radius: 12px; padding: 1.2rem;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3); margin-bottom: 1.5rem;
  }
  .search-field { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 120px; }
  .search-field label { font-size: 0.7rem; color: #9ca3af; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
  .search-field input, .search-field select {
    border: none; outline: none; font-size: 0.9rem; font-family: inherit;
    color: var(--text-dark); font-weight: 500; background: transparent;
    border-bottom: 1.5px solid #e5e7eb; padding-bottom: 4px;
  }
  .search-divider { width: 1px; height: 40px; background: #e5e7eb; align-self: flex-end; }
  .btn-search {
    background: var(--orange); color: white; border: none; cursor: pointer;
    padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 0.9rem; font-weight: 700;
    display: flex; align-items: center; gap: 7px; white-space: nowrap; transition: opacity 0.2s;
  }
  .btn-search:hover { opacity: 0.9; }

  .quick-links { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  .quick-link {
    background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.9);
    padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.82rem; font-weight: 500;
    display: flex; align-items: center; gap: 6px; cursor: pointer; transition: background 0.2s;
    border: none;
  }
  .quick-link:hover { background: rgba(255,255,255,0.22); }

  .section-label { font-size: 0.8rem; font-weight: 700; color: var(--orange); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem; text-align: center; }
  .section-title { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; text-align: center; color: var(--navy); }
  .section-title em { font-style: normal; color: var(--orange); }

  .explore-section { background: var(--navy); padding: 4rem 2rem; }
  .explore-section .section-label, .explore-section .section-title { color: white; }
  .explore-section .section-title em { color: var(--orange); }
  .types-grid { display: flex; gap: 1.2rem; justify-content: center; flex-wrap: wrap; margin-top: 3rem; max-width: 1100px; margin-left: auto; margin-right: auto; }
  .type-card {
    background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.1);
    border-radius: var(--card-radius); padding: 1.8rem 2rem; text-align: center;
    flex: 1; min-width: 150px; max-width: 200px; cursor: pointer; transition: all 0.25s; color: white;
    border: none;
  }
  .type-card:hover { background: rgba(255,255,255,0.13); border-color: var(--orange); transform: translateY(-4px); }
  .type-card i { font-size: 2rem; margin-bottom: 0.8rem; display: block; }
  .type-card h4 { font-size: 0.95rem; font-weight: 700; margin-bottom: 0.3rem; }
  .type-card span { font-size: 0.78rem; opacity: 0.6; }

  .type-card-skeleton {
    background: rgba(255,255,255,0.06);
    border-radius: var(--card-radius); padding: 1.8rem 2rem; text-align: center;
    flex: 1; min-width: 150px; max-width: 200px;
    animation: pulse 1.4s ease-in-out infinite;
  }
  .skeleton-circle { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.1); margin: 0 auto 0.8rem; }
  .skeleton-line { height: 12px; border-radius: 6px; background: rgba(255,255,255,0.1); margin: 0 auto 0.5rem; }
  .skeleton-line.short { width: 60%; }
  .skeleton-line.shorter { width: 40%; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

  .locations-section { background: var(--navy); padding: 5rem 2rem; }
  .locations-section .section-title { color: white; }
  .locations-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; grid-template-rows: 220px 220px; gap: 1rem; max-width: 1100px; margin: 2.5rem auto 0; }
  .loc-card { border-radius: var(--card-radius); overflow: hidden; position: relative; cursor: pointer; border: none; background: transparent; padding: 0; }
  .loc-card img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s; }
  .loc-card:hover img { transform: scale(1.05); }
  .loc-card.big { grid-row: 1 / 3; }
  .loc-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(13,27,62,0.85) 0%, transparent 60%); display: flex; flex-direction: column; justify-content: flex-end; padding: 1.2rem; }
  .loc-overlay small { color: rgba(255,255,255,0.7); font-size: 0.75rem; }
  .loc-overlay h4 { color: white; font-size: 1rem; font-weight: 700; }
  .loc-overlay p { color: rgba(255,255,255,0.6); font-size: 0.8rem; }

  .dual-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; padding: 5rem 2rem; max-width: 1100px; margin: 0 auto; }
  .dual-card { background: white; padding: 2.5rem; border-radius: var(--card-radius); text-align: center; box-shadow: 0 8px 30px rgba(0,0,0,0.07); transition: 0.3s ease; }
  .dual-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,0.12); }
  .dual-icon { font-size: 2.5rem; margin-bottom: 1rem; }
  .dual-icon.student { color: #2563eb; }
  .dual-icon.owner { color: #16a34a; }
  .dual-card h3 { font-size: 1.2rem; font-weight: 800; color: var(--navy); margin-bottom: 0.75rem; }
  .dual-card p { color: var(--text-mid); font-size: 0.9rem; line-height: 1.7; margin-bottom: 1.5rem; }
  .btn-outline { border: 2px solid var(--navy); color: var(--navy); background: transparent; padding: 0.55rem 1.4rem; border-radius: 8px; font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; }
  .btn-outline:hover { background: var(--navy); color: white; }

  .features-section { padding: 5rem 2rem; background: var(--gray-bg); text-align: center; }
  .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; max-width: 1100px; margin: 3rem auto 0; }
  .feature-card { background: white; padding: 2rem; border-radius: var(--card-radius); box-shadow: 0 6px 20px rgba(0,0,0,0.06); transition: 0.3s; }
  .feature-card:hover { transform: translateY(-6px); }
  .feature-icon { font-size: 2rem; color: var(--blue); margin-bottom: 1rem; }
  .feature-card h4 { font-size: 1rem; font-weight: 700; color: var(--navy); margin-bottom: 0.5rem; }
  .feature-card p { font-size: 0.85rem; color: var(--text-mid); line-height: 1.6; }

  .cta-section { background: linear-gradient(135deg, #0d1b3e 0%, #1a3fa4 100%); color: white; text-align: center; padding: 5rem 2rem; }
  .cta-section h2 { font-size: 2rem; font-weight: 800; margin-bottom: 0.75rem; color: white; }
  .cta-section p { opacity: 0.85; margin-bottom: 2rem; font-size: 1rem; color: white; }
  .btn-primary {
    background: var(--orange); color: white; border: none; cursor: pointer;
    padding: 0.85rem 2.2rem; border-radius: 10px; font-size: 1rem; font-weight: 700;
    display: inline-flex; align-items: center; gap: 8px; transition: opacity 0.2s; text-decoration: none;
  }
  .btn-primary:hover { opacity: 0.9; }

  @media (max-width: 768px) {
    nav { padding: 0 1rem; }
    .hero-content { padding: 0 1.5rem; }
    .search-bar { flex-direction: column; }
    .search-divider { display: none; }
    .locations-grid { grid-template-columns: 1fr 1fr; grid-template-rows: auto; }
    .loc-card.big { grid-row: auto; }
  }
`;

const AREA_DEFINITIONS = [
  { icon: "fa fa-bed",      label: "Chitawira" },
  { icon: "fa fa-home",     label: "Nkolokosa" },
  { icon: "fa fa-building", label: "Chichiri"  },
  { icon: "fa fa-users",    label: "Mandala"   },
  { icon: "fa fa-star",     label: "Queens"    },
  { icon: "fa fa-star",     label: "Manja"    },
  { icon: "fa fa-star",     label: "Mjamba"    },
  { icon: "fa fa-star",     label: "Kamba"    },
  { icon: "fa fa-star",     label: "Chinyonga"    },
];

function Navbar({ isAuthenticated, user }) {
  const navigate = useNavigate();
  return (
    <nav>
      <button onClick={() => navigate('/')} className="logo" style={{ background: 'none', border: 'none', padding: 0 }}>
        <div className="logo-icon"><img src="/logo2.png" alt="HostelLink" /></div>
        <div className="logo-text">
          <strong>HOSTELLINK</strong>
          <span>OFF-CAMPUS ACCOMMODATION</span>
        </div>
      </button>
      <div className="nav-actions">
        {isAuthenticated ? (
          <>
            <a href="/profile"><i className="fa fa-user" /> {user?.firstName}</a>
            <a href="/dashboard" className="btn-add"><i className="fa fa-th-large" /> Dashboard</a>
          </>
        ) : (
          <>
            <a href="/login"><i className="fa fa-sign-in-alt" /> Login</a>
            <a href="/register" className="btn-add"><i className="fa fa-user-plus" /> Sign Up</a>
          </>
        )}
      </div>
    </nav>
  );
}

function Hero({ isAuthenticated }) {
  const navigate = useNavigate();
  const handleSearch = () => navigate(isAuthenticated ? '/hostels' : '/login');
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-content">
        <h1>Find Safe & Affordable <span>Hostels Near MUBAS.</span></h1>
        <p>The smartest way for students to find accommodation and for hostel owners to connect with verified tenants.</p>
        <div className="search-bar">
          <div className="search-field">
            <label>Keyword</label>
            <input type="text" placeholder="Looking For?" />
          </div>
          <div className="search-divider" />
          <div className="search-field">
            <label>Category</label>
            <select>
              <option>All Categories</option>
              <option>General</option>
              <option>Girls Hostels</option>
              <option>Boys Hostels</option>
            </select>
          </div>
          <div className="search-divider" />
          <div className="search-field">
            <label>Location</label>
            <select>
              <option>All Locations</option>
              {AREA_DEFINITIONS.map(a => <option key={a.label}>{a.label}</option>)}
            </select>
          </div>
          <button className="btn-search" onClick={handleSearch}>
            <i className="fa fa-search" /> Search
          </button>
        </div>
        <div className="quick-links">
          <button className="quick-link" onClick={handleSearch}><i className="fa fa-arrow-right" /> Shared Rooms</button>
          <button className="quick-link" onClick={handleSearch}><i className="fa fa-arrow-right" /> Self-Contain</button>
          <button className="quick-link" onClick={handleSearch}><i className="fa fa-arrow-right" /> Near Campus</button>
        </div>
      </div>
    </section>
  );
}

function ExploreSection({ isAuthenticated }) {
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAreaCounts = async () => {
      try {
        const res = await fetch(`${API_URL}/hostels?limit=500`);
        const data = await res.json();
        if (data.success && Array.isArray(data.hostels)) {
          const counts = {};
          data.hostels.forEach(hostel => {
            const addr = (hostel.address || "").toLowerCase();
            AREA_DEFINITIONS.forEach(area => {
              if (addr.includes(area.label.toLowerCase())) {
                counts[area.label] = (counts[area.label] || 0) + 1;
              }
            });
          });
          setAreas(AREA_DEFINITIONS.map(area => ({
            ...area,
            count: counts[area.label]
              ? `${counts[area.label]} Hostel${counts[area.label] !== 1 ? "s" : ""}`
              : "View Hostels",
          })));
        } else {
          setAreas(AREA_DEFINITIONS.map(a => ({ ...a, count: "View Hostels" })));
        }
      } catch (err) {
        setAreas(AREA_DEFINITIONS.map(a => ({ ...a, count: "View Hostels" })));
      } finally {
        setLoading(false);
      }
    };
    fetchAreaCounts();
  }, []);

  const handleClick = (areaLabel) => {
    navigate(isAuthenticated
      ? `/hostels?search=${encodeURIComponent(areaLabel)}`
      : '/login'
    );
  };

  return (
    <section className="explore-section">
      <p className="section-label">Hostel By Location</p>
      <h2 className="section-title">Explore Hostel <em>Areas</em></h2>
      <div className="types-grid">
        {loading ? (
          AREA_DEFINITIONS.map((_, i) => (
            <div key={i} className="type-card-skeleton">
              <div className="skeleton-circle" />
              <div className="skeleton-line short" />
              <div className="skeleton-line shorter" />
            </div>
          ))
        ) : (
          areas.map(t => (
            <button key={t.label} className="type-card" onClick={() => handleClick(t.label)}>
              <i className={t.icon} />
              <h4>{t.label}</h4>
              <span>{t.count}</span>
            </button>
          ))
        )}
      </div>
    </section>
  );
}

function LocationsSection({ isAuthenticated }) {
  const navigate = useNavigate();
  const handleClick = () => navigate(isAuthenticated ? '/hostels' : '/login');
  const locations = [
    { img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop", big: true, count: "7 Hostels Available", name: "Chitawira", desc: "Close Campus Accommodation" },
    { img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&auto=format&fit=crop", count: "5 Hostels Available", name: "Ndirande", desc: "Affordable Options" },
    { img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop", count: "4 Hostels Available", name: "Mandala", desc: "Premium Listings" },
    { img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop", count: "3 Hostels Available", name: "Near Queens", desc: "Budget Friendly" },
    { img: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&auto=format&fit=crop", count: "6 Hostels Available", name: "Zingwangwa", desc: "Popular Student Area" },
  ];
  return (
    <section className="locations-section">
      <p className="section-label">Our Property Areas</p>
      <h2 className="section-title" style={{color:"white"}}>Top Locations Near <em>MUBAS</em></h2>
      <div className="locations-grid">
        {locations.map(loc => (
          <button key={loc.name} className={`loc-card${loc.big ? " big" : ""}`} onClick={handleClick}>
            <img src={loc.img} alt={loc.name} />
            <div className="loc-overlay">
              <small>{loc.count}</small>
              <h4>{loc.name}</h4>
              <p>{loc.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function DualSection() {
  return (
    <div className="dual-section">
      <div className="dual-card">
        <div className="dual-icon student"><i className="fa fa-user-graduate" /></div>
        <h3>For Students</h3>
        <p>Search verified hostels, compare prices, view photos, and contact owners directly — all in one place.</p>
        <a href="/Register" className="btn-outline">Find a Hostel</a>
      </div>
      <div className="dual-card">
        <div className="dual-icon owner"><i className="fa fa-building" /></div>
        <h3>For Hostel Owners</h3>
        <p>List your property, receive booking requests, and manage payments securely from one dashboard.</p>
        <a href="/Register" className="btn-outline">Start Listing</a>
      </div>
    </div>
  );
}

function FeaturesSection() {
  const features = [
    { icon: "fa fa-search", title: "Smart Search", desc: "Filter by price, location, amenities and availability." },
    { icon: "fa fa-home", title: "Direct Communication", desc: "Students connect directly with hostel owners for faster responses." },
    { icon: "fa fa-shield-alt", title: "Verified Listings", desc: "We verify owners to ensure trust and safety for all students." },
    { icon: "fa fa-money-bill-wave", title: "Secure Payments", desc: "Safe deposit system with Airtel Money & TNM Mpamba." },
  ];
  return (
    <section className="features-section">
      <p className="section-label">Why Us</p>
      <h2 className="section-title">Why Choose <em>Our Platform?</em></h2>
      <div className="features-grid">
        {features.map(f => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon"><i className={f.icon} /></div>
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/Dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <Navbar isAuthenticated={isAuthenticated} user={user} />
      <Hero isAuthenticated={isAuthenticated} />
      <ExploreSection isAuthenticated={isAuthenticated} />
      <LocationsSection isAuthenticated={isAuthenticated} />
      <DualSection />
      <FeaturesSection />
      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join the growing MUBAS accommodation network today.</p>
        <a href="/Register" className="btn-primary"><i className="fa fa-user-plus" /> Create Free Account</a>
      </section>
    </>
  );
}