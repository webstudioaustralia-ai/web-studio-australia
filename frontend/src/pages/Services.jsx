import React, { useState, useEffect } from 'react';
import '../styles/pages.css';

function Services() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Web Design',
      description: 'Custom website design tailored to your brand and target audience.',
      features: ['Responsive Design', 'User Experience Focused', 'Modern Aesthetics', 'Brand Consistency'],
      price: '$5,000+'
    },
    {
      id: 2,
      name: 'Web Development',
      description: 'Full-stack web applications built with the latest technologies.',
      features: ['Scalable Architecture', 'Performance Optimized', 'Security Best Practices', 'Future-Proof'],
      price: '$10,000+'
    },
    {
      id: 3,
      name: 'E-Commerce Solutions',
      description: 'Complete e-commerce platforms to sell products online.',
      features: ['Product Management', 'Payment Integration', 'Inventory System', 'Analytics Dashboard'],
      price: '$15,000+'
    },
    {
      id: 4,
      name: 'Digital Marketing',
      description: 'SEO, content, and social media marketing to drive growth.',
      features: ['SEO Optimization', 'Content Strategy', 'Social Media', 'Analytics & Reporting'],
      price: '$2,000+/month'
    },
    {
      id: 5,
      name: 'Brand Strategy',
      description: 'Comprehensive branding and identity design.',
      features: ['Brand Guidelines', 'Logo Design', 'Visual Identity', 'Messaging Framework'],
      price: '$5,000+'
    },
    {
      id: 6,
      name: 'Maintenance & Support',
      description: 'Ongoing support and website maintenance.',
      features: ['24/7 Monitoring', 'Regular Updates', 'Security Patches', 'Performance Optimization'],
      price: '$500+/month'
    }
  ]);

  return (
    <div className="services-page">
      <section className="page-header">
        <h1>Our Services</h1>
        <p>Comprehensive web solutions for your business</p>
      </section>

      <section className="services-full-grid">
        {services.map(service => (
          <div key={service.id} className="service-full-card">
            <h3>{service.name}</h3>
            <p className="service-description">{service.description}</p>
            <h4>Features:</h4>
            <ul className="features-list">
              {service.features.map((feature, idx) => (
                <li key={idx}>✓ {feature}</li>
              ))}
            </ul>
            <p className="service-price">{service.price}</p>
            <button className="btn btn-primary">Learn More</button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Services;
