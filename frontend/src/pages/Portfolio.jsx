import React from 'react';
import '../styles/pages.css';

function Portfolio() {
  const projects = [
    {
      id: 1,
      title: 'Modern E-Commerce Platform',
      description: 'Complete e-commerce solution for fashion boutique',
      category: 'e-commerce',
      client: 'Fashion Boutique Sydney',
      image: '🛍️'
    },
    {
      id: 2,
      title: 'Corporate Website Redesign',
      description: 'Modern corporate website with CMS and lead generation',
      category: 'corporate',
      client: 'Tech Consulting Group',
      image: '💼'
    },
    {
      id: 3,
      title: 'Service Provider Directory',
      description: 'Directory platform connecting clients with service providers',
      category: 'directory',
      client: 'Local Services Network',
      image: '📋'
    },
    {
      id: 4,
      title: 'Healthcare Portal',
      description: 'Patient management and appointment booking system',
      category: 'healthcare',
      client: 'Medical Clinic',
      image: '⚕️'
    },
    {
      id: 5,
      title: 'Restaurant Website',
      description: 'Restaurant site with online ordering and reservations',
      category: 'hospitality',
      client: 'Fine Dining Restaurant',
      image: '🍽️'
    },
    {
      id: 6,
      title: 'Real Estate Platform',
      description: 'Property listing and management system',
      category: 'real-estate',
      client: 'Real Estate Agency',
      image: '🏠'
    }
  ];

  return (
    <div className="portfolio-page">
      <section className="page-header">
        <h1>Our Portfolio</h1>
        <p>Showcase of our successful projects</p>
      </section>

      <section className="portfolio-grid">
        {projects.map(project => (
          <div key={project.id} className="portfolio-card">
            <div className="project-image">{project.image}</div>
            <div className="project-info">
              <span className="project-category">{project.category}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p className="project-client">Client: {project.client}</p>
              <button className="btn btn-outline">View Case Study</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Portfolio;
