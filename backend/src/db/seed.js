const { query } = require('./connection');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

const seed = async () => {
  try {
    logger.info('Seeding database...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await query(`
      INSERT INTO users (name, email, password_hash, company, role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
    `, ['Admin User', 'admin@webstudioaustralia.com', hashedPassword, 'Web Studio Australia', 'admin']);

    // Insert services
    const services = [
      { name: 'Web Design', description: 'Custom website design tailored to your brand', price: '$5,000+' },
      { name: 'Web Development', description: 'Full-stack web application development', price: '$10,000+' },
      { name: 'E-Commerce Solutions', description: 'Complete e-commerce platform setup', price: '$15,000+' },
      { name: 'Digital Marketing', description: 'SEO, content, and social media marketing', price: '$2,000+' },
      { name: 'Brand Strategy', description: 'Comprehensive branding and identity design', price: '$5,000+' },
      { name: 'Maintenance & Support', description: 'Ongoing support and website maintenance', price: '$500+/month' }
    ];

    for (let i = 0; i < services.length; i++) {
      await query(`
        INSERT INTO services (name, description, price, order_index, is_active)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
      `, [services[i].name, services[i].description, services[i].price, i, true]);
    }

    // Insert sample portfolio projects
    const projects = [
      {
        title: 'Modern E-Commerce Platform',
        description: 'Complete e-commerce solution with product catalog, shopping cart, and payment integration',
        client_name: 'Fashion Boutique Sydney',
        category: 'e-commerce',
        is_featured: true
      },
      {
        title: 'Corporate Website Redesign',
        description: 'Modern corporate website with CMS and lead generation',
        client_name: 'Tech Consulting Group',
        category: 'corporate',
        is_featured: true
      },
      {
        title: 'Service Provider Directory',
        description: 'Directory platform for local service providers',
        client_name: 'Local Services Network',
        category: 'directory',
        is_featured: false
      }
    ];

    for (const project of projects) {
      await query(`
        INSERT INTO portfolio_projects (title, description, client_name, category, is_featured)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
      `, [project.title, project.description, project.client_name, project.category, project.is_featured]);
    }

    // Insert AI intents
    const intents = [
      {
        name: 'Service Inquiry',
        description: 'User asking about services',
        keywords: ['service', 'offer', 'do you', 'what do you'],
        responses: [
          'We offer web design, development, e-commerce, and digital marketing services.',
          'Our main services include web design, development, and digital solutions.',
          'We specialize in creating amazing web experiences for Australian businesses.'
        ]
      },
      {
        name: 'Pricing Question',
        description: 'User asking about pricing',
        keywords: ['price', 'cost', 'how much', 'pricing'],
        responses: [
          'Our pricing varies based on project scope. Would you like a free quote?',
          'We offer flexible pricing packages. Let\'s discuss your specific needs.',
          'Pricing depends on your requirements. Can you tell me more about your project?'
        ]
      },
      {
        name: 'Timeline Question',
        description: 'User asking about project timeline',
        keywords: ['timeline', 'how long', 'duration', 'when', 'deadline'],
        responses: [
          'Project timelines depend on scope and complexity. Most projects take 4-12 weeks.',
          'We can discuss timeline based on your specific requirements.',
          'Timeline varies. Can you share more details about your project?'
        ]
      }
    ];

    for (const intent of intents) {
      await query(`
        INSERT INTO ai_intents (name, description, keywords, responses)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `, [intent.name, intent.description, intent.keywords, intent.responses]);
    }

    logger.info('Seeding completed successfully');
  } catch (error) {
    logger.error('Seed error:', error);
    throw error;
  }
};

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { seed };
