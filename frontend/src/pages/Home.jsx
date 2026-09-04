import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaUsers, FaAward } from 'react-icons/fa';
import '../styles/pages.css';

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Crafting Digital Excellence</h1>
          <p>For Australian Businesses That Want to Grow Online</p>
          <div className="hero-buttons">
            <Link to="/contact" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/portfolio" className="btn btn-secondary">
              View Our Work
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="services-preview">
        <h2>Our Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <FaRocket className="service-icon" />
            <h3>Web Design</h3>
            <p>Beautiful, modern websites that engage your audience and drive results.</p>
          </div>
          <div className="service-card">
            <FaUsers className="service-icon" />
            <h3>Web Development</h3>
            <p>Robust, scalable web applications built with the latest technology.</p>
          </div>
          <div className="service-card">
            <FaAward className="service-icon" />
            <h3>E-Commerce</h3>
            <p>Complete e-commerce solutions to sell online and grow your business.</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-us">
        <h2>Why Choose Web Studio Australia?</h2>
        <div className="features">
          <div className="feature">
            <h4>Local Expertise</h4>
            <p>Deep understanding of Australian market and business needs.</p>
          </div>
          <div className="feature">
            <h4>Proven Results</h4>
            <p>Portfolio of successful projects with measurable outcomes.</p>
          </div>
          <div className="feature">
            <h4>Professional Team</h4>
            <p>Experienced designers and developers passionate about quality.</p>
          </div>
          <div className="feature">
            <h4>24/7 Support</h4>
            <p>Always available to support your online success.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Let's discuss how we can help your business grow online.</p>
        <Link to="/contact" className="btn btn-primary btn-large">
          Schedule a Free Consultation
        </Link>
      </section>
    </div>
  );
}

export default Home;
