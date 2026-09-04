import React from 'react';
import '../styles/pages.css';

function About() {
  return (
    <div className="about-page">
      <section className="page-header">
        <h1>About Web Studio Australia</h1>
        <p>Your trusted partner in digital excellence</p>
      </section>

      <section className="about-content">
        <div className="about-section">
          <h2>Our Story</h2>
          <p>
            Web Studio Australia was founded with a mission to empower Australian businesses
            with world-class web solutions. With years of experience in web design and development,
            we've helped hundreds of businesses grow online.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            To deliver innovative web solutions that drive business growth, enhance user experience,
            and help Australian companies thrive in the digital landscape.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Values</h2>
          <ul>
            <li><strong>Innovation:</strong> Always exploring new technologies and approaches</li>
            <li><strong>Excellence:</strong> Delivering the highest quality in everything we do</li>
            <li><strong>Collaboration:</strong> Working closely with clients as true partners</li>
            <li><strong>Reliability:</strong> Consistent delivery and trustworthy service</li>
            <li><strong>Local Focus:</strong> Deep understanding of Australian market needs</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>Our Team</h2>
          <p>
            Our team consists of experienced designers, developers, and digital strategists
            passionate about creating exceptional web experiences. We collaborate closely with
            each client to ensure their vision becomes reality.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;
