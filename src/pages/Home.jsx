import React from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaHome,
  FaShieldAlt,
  FaMoneyBillWave,
  FaUserGraduate,
  FaBuilding,
} from "react-icons/fa";
import Button from "../components/common/Button";
import "../styles/home.css";

const Home = () => {
  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Find Safe & Affordable Hostels Near <span>MUBAS</span>
          </h1>

          <p>
            The smartest way for students to find accommodation and
            for hostel owners to connect with verified tenants.
          </p>

          <div className="hero-buttons">
            <Link to="/hostels">
              <Button size="lg" variant="primary">
                <FaSearch /> Explore Hostels
              </Button>
            </Link>

            <Link to="/register?role=owner">
              <Button size="lg" variant="secondary">
                List Your Hostel
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* STUDENT / OWNER SECTION */}
      <section className="dual-section">
        <div className="dual-card">
          <FaUserGraduate className="dual-icon student" />
          <h3>For Students</h3>
          <p>
            Search verified hostels, compare prices, view photos,
            and contact owners directly — all in one place.
          </p>
          <Link to="/hostels">
            <Button variant="outline">Find a Hostel</Button>
          </Link>
        </div>

        <div className="dual-card">
          <FaBuilding className="dual-icon owner" />
          <h3>For Hostel Owners</h3>
          <p>
            List your property, receive booking requests,
            and manage payments securely from one dashboard.
          </p>
          <Link to="/register?role=owner">
            <Button variant="outline">Start Listing</Button>
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>Why Choose Our Platform?</h2>

        <div className="features-grid">

          <div className="feature-card">
            <FaSearch className="feature-icon" />
            <h4>Smart Search</h4>
            <p>Filter by price, location, amenities and availability.</p>
          </div>

          <div className="feature-card">
            <FaHome className="feature-icon" />
            <h4>Direct Communication</h4>
            <p>No agents. Students connect directly with owners.</p>
          </div>

          <div className="feature-card">
            <FaShieldAlt className="feature-icon" />
            <h4>Verified Listings</h4>
            <p>We verify owners to ensure trust and safety.</p>
          </div>

          <div className="feature-card">
            <FaMoneyBillWave className="feature-icon" />
            <h4>Secure Payments</h4>
            <p>Safe deposit system with Airtel Money & TNM Mpamba.</p>
          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta">
        <h2>Ready to Get Started?</h2>
        <p>Join the growing MUBAS accommodation network today.</p>

        <Link to="/register">
          <Button size="lg" variant="primary">
            Create Free Account
          </Button>
        </Link>
      </section>

    </div>
  );
};

export default Home;
