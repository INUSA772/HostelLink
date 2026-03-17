import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaAward, FaUsers, FaShieldAlt, FaChartLine, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

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

  body { font-family: 'Manrope', sans-serif; background: var(--gray-bg); color: var(--text-dark); }
  a { text-decoration: none; color: inherit; }

  .about-page {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--gray-bg) 0%, #ffffff 100%);
    padding-top: 68px;
  }

  /* ── TOP NAV ── */
  .about-topnav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: white;
    border-bottom: 1px solid #e5e7eb;
    padding: 0.75rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }

  .about-back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--gray-bg);
    border: 1px solid #e5e7eb;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 700;
    color: var(--navy);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
    font-family: 'Manrope', sans-serif;
  }

  .about-back-btn:hover {
    background: var(--navy);
    color: white;
    border-color: var(--navy);
  }

  /* ── HERO SECTION — solid navy, white text ── */
  .about-hero {
    background: var(--navy);
    color: #ffffff;
    padding: 4rem 1.5rem;
    text-align: center;
  }

  .about-hero h1 {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: 800;
    margin-bottom: 1rem;
    font-family: 'Poppins', sans-serif;
    color: #ffffff;
  }

  .about-hero p {
    font-size: 1.1rem;
    color: #ffffff;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  /* ── CONTENT SECTION ── */
  .about-content {
    max-width: 1100px;
    margin: 4rem auto;
    padding: 0 1.5rem;
  }

  /* ── SECTION TITLE ── */
  .about-section-title {
    font-size: 2rem;
    font-weight: 800;
    color: var(--navy);
    margin-bottom: 1rem;
    font-family: 'Poppins', sans-serif;
  }

  .about-section-title em {
    color: var(--orange);
    font-style: normal;
  }

  .about-section-desc {
    font-size: 1rem;
    color: var(--text-mid);
    line-height: 1.8;
    margin-bottom: 3rem;
    max-width: 700px;
  }

  /* ── MISSION/VISION GRID ── */
  .about-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
  }

  .about-card {
    background: white;
    padding: 2.5rem 2rem;
    border-radius: var(--card-radius);
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    transition: all 0.3s ease;
    border: 1px solid #e5e7eb;
  }

  .about-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.12);
    border-color: var(--orange);
  }

  .about-card-icon {
    font-size: 3rem;
    color: var(--orange);
    margin-bottom: 1rem;
  }

  .about-card h3 {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--navy);
    margin-bottom: 0.75rem;
    font-family: 'Poppins', sans-serif;
  }

  .about-card p {
    font-size: 0.95rem;
    color: var(--text-mid);
    line-height: 1.7;
  }

  /* ── VALUES SECTION ── */
  .about-values {
    background: white;
    padding: 3rem 2rem;
    border-radius: var(--card-radius);
    border: 1px solid #e5e7eb;
    margin-bottom: 4rem;
  }

  .about-values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .value-item {
    display: flex;
    gap: 1rem;
  }

  .value-icon {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, var(--orange), #ff6b35);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .value-content h4 {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--navy);
    margin-bottom: 0.3rem;
  }

  .value-content p {
    font-size: 0.9rem;
    color: var(--text-mid);
    line-height: 1.6;
  }

  /* ── TEAM SECTION ── */
  .about-team {
    background: linear-gradient(135deg, rgba(13,27,62,0.05) 0%, rgba(26,63,164,0.05) 100%);
    padding: 3rem 2rem;
    border-radius: var(--card-radius);
    margin-bottom: 4rem;
  }

  .about-team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .team-member {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    transition: all 0.3s;
    border: 1px solid #e5e7eb;
  }

  .team-member:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }

  .team-avatar {
    width: 100%;
    height: 200px;
    overflow: hidden;
    position: relative;
  }

  .team-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    transition: transform 0.4s ease;
    display: block;
  }

  .team-member:hover .team-avatar img {
    transform: scale(1.06);
  }

  .team-info {
    padding: 1.2rem 1.5rem 1.5rem;
  }

  .team-name {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--navy);
    margin-bottom: 0.3rem;
  }

  .team-role {
    font-size: 0.85rem;
    color: var(--orange);
    font-weight: 600;
  }

  /* ── STATS SECTION ── */
  .about-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin: 4rem 0;
  }

  .stat-box {
    background: white;
    padding: 2rem;
    border-radius: var(--card-radius);
    text-align: center;
    border: 2px solid var(--orange);
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--orange);
    margin-bottom: 0.5rem;
    font-family: 'Poppins', sans-serif;
  }

  .stat-label {
    font-size: 1rem;
    font-weight: 600;
    color: var(--navy);
  }

  /* ── CTA SECTION ── */
  .about-cta {
    background: linear-gradient(135deg, var(--navy) 0%, var(--blue) 100%);
    color: white;
    padding: 3rem 2rem;
    border-radius: var(--card-radius);
    text-align: center;
    margin-top: 4rem;
    margin-bottom: 4rem;
  }

  .about-cta h2 {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 1rem;
    font-family: 'Poppins', sans-serif;
  }

  .about-cta p {
    font-size: 1.05rem;
    opacity: 0.9;
    margin-bottom: 1.5rem;
  }

  .about-cta-btn {
    background: var(--orange);
    color: white;
    border: none;
    padding: 0.85rem 2rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
  }

  .about-cta-btn:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .about-hero { padding: 2.5rem 1rem; }
    .about-hero h1 { font-size: 2rem; }
    .about-section-title { font-size: 1.5rem; }
    .about-card { padding: 1.5rem; }
    .about-team-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 520px) {
    .about-topnav { padding: 0.5rem 1rem; }
    .about-back-btn { padding: 0.4rem 0.8rem; font-size: 0.8rem; }
    .about-hero h1 { font-size: 1.5rem; }
    .about-section-title { font-size: 1.2rem; }
    .about-grid { grid-template-columns: 1fr; }
    .about-team-grid { grid-template-columns: 1fr; }
    .stat-box { padding: 1.5rem 1rem; }
  }
`;

const TEAM = [
  {
    name: "Majidu Inusa",
    role: "Co-Founder",
    img: "/We5.jpeg",
  },
  {
    name: "Thandazani Kalua",
    role: "Co-Founder",
    img: "/We9.jpg",
  },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{styles}</style>
      <div className="about-page">
        {/* Top Nav */}
        <div className="about-topnav">
          <button className="about-back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
        </div>

        {/* Hero Section — navy bg, white text */}
        <section className="about-hero">
          <h1>About PezaHostel</h1>
          <p>
            Revolutionizing student accommodation by connecting MUBAS students with safe,
            affordable, and verified hostel homes near campus.
          </p>
        </section>

        {/* Main Content */}
        <div className="about-content">
          {/* Our Story */}
          <section style={{ marginBottom: '4rem' }}>
            <h2 className="about-section-title">Our <em>Story</em></h2>
            <p className="about-section-desc">
              PezaHostel was born from a simple observation: MUBAS students struggle to find safe,
              affordable accommodation near campus. Traditional housing searches are complicated,
              time-consuming, and filled with uncertainty about property quality and owner reliability.
            </p>
            <p className="about-section-desc">
              We decided to change that. By building a platform that bridges the gap between students
              and verified hostel owners, we're making student housing simple, secure, and transparent.
            </p>
          </section>

          {/* Mission & Vision */}
          <div className="about-grid">
            <div className="about-card">
              <div className="about-card-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>To simplify student accommodation by providing a trusted platform where MUBAS students can find safe, verified hostels with confidence and ease.</p>
            </div>
            <div className="about-card">
              <div className="about-card-icon">🌟</div>
              <h3>Our Vision</h3>
              <p>To become the leading student housing platform in Malawi, trusted by thousands of students and hostel owners for quality, safety, and transparency.</p>
            </div>
            <div className="about-card">
              <div className="about-card-icon">💡</div>
              <h3>Our Values</h3>
              <p>We believe in transparency, safety, affordability, and community. Every decision we make is guided by what's best for our students and hostel owners.</p>
            </div>
          </div>

          {/* Core Values */}
          <section className="about-values">
            <h2 className="about-section-title">Core <em>Values</em></h2>
            <div className="about-values-grid">
              <div className="value-item">
                <div className="value-icon">✓</div>
                <div className="value-content">
                  <h4>Trust & Transparency</h4>
                  <p>Every listing is verified. Every transaction is secure.</p>
                </div>
              </div>
              <div className="value-item">
                <div className="value-icon">🛡️</div>
                <div className="value-content">
                  <h4>Student Safety</h4>
                  <p>Safety is our top priority. We verify all properties and owners.</p>
                </div>
              </div>
              <div className="value-item">
                <div className="value-icon">💰</div>
                <div className="value-content">
                  <h4>Affordability</h4>
                  <p>Quality housing shouldn't break the bank.</p>
                </div>
              </div>
              <div className="value-item">
                <div className="value-icon">🤝</div>
                <div className="value-content">
                  <h4>Community</h4>
                  <p>We're building a community of trust between students and owners.</p>
                </div>
              </div>
              <div className="value-item">
                <div className="value-icon">⚡</div>
                <div className="value-content">
                  <h4>Speed & Efficiency</h4>
                  <p>Find your perfect room in minutes, not weeks.</p>
                </div>
              </div>
              <div className="value-item">
                <div className="value-icon">📱</div>
                <div className="value-content">
                  <h4>Innovation</h4>
                  <p>Using technology to solve real housing problems.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section>
            <h2 className="about-section-title">By The <em>Numbers</em></h2>
            <div className="about-stats">
              <div className="stat-box">
                <div className="stat-number">200+</div>
                <div className="stat-label">Students Housed</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">50+</div>
                <div className="stat-label">Verified Hostels</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">9</div>
                <div className="stat-label">Campus Areas</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">100%</div>
                <div className="stat-label">Student Satisfaction</div>
              </div>
            </div>
          </section>

          {/* Team */}
          <section className="about-team">
            <h2 className="about-section-title">Meet Our <em>Team</em></h2>
            <div className="about-team-grid">
              {TEAM.map((member) => (
                <div className="team-member" key={member.name}>
                  <div className="team-avatar">
                    <img src={member.img} alt={member.name} />
                  </div>
                  <div className="team-info">
                    <div className="team-name">{member.name}</div>
                    <div className="team-role">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
         <section className="about-cta">
  <h2 style={{ color: '#ffffff' }}>Ready to Find Your Perfect Room?</h2>
  <p style={{ color: '#ffffff', opacity: 0.9 }}>Join hundreds of MUBAS students who have already found their ideal hostel on PezaHostel.</p>
  <button className="about-cta-btn" onClick={() => navigate('/register')}>
    Get Started Today
  </button>
</section>
        </div>
      </div>
    </>
  );
};

export default About;