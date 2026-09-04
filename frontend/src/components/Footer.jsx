import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Web Studio Australia</h3>
          <p>Crafting Digital Excellence for Australian Businesses</p>
          <div className="social-links">
            <a href="#facebook">Facebook</a>
            <a href="#linkedin">LinkedIn</a>
            <a href="#instagram">Instagram</a>
            <a href="#twitter">Twitter</a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Services</h4>
          <ul>
            <li><Link to="/services#web-design">Web Design</Link></li>
            <li><Link to="/services#development">Development</Link></li>
            <li><Link to="/services#ecommerce">E-Commerce</Link></li>
            <li><Link to="/services#marketing">Digital Marketing</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/portfolio">Portfolio</Link></li>
            <li><Link to="#blog">Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <div className="contact-info">
            <p><FaPhone /> +61 2 1234 5678</p>
            <p><FaEnvelope /> hello@webstudioaustralia.com</p>
            <p><FaMapMarkerAlt /> Sydney, Australia</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Web Studio Australia. All rights reserved.</p>
        <div className="footer-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
