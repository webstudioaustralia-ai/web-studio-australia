import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import '../styles/pages.css';

function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: 'contact_form'
        })
      });

      if (response.ok) {
        setSubmitted(true);
        reset();
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  return (
    <div className="contact-page">
      <section className="page-header">
        <h1>Get In Touch</h1>
        <p>Let's discuss how we can help your business</p>
      </section>

      <section className="contact-content">
        <div className="contact-info">
          <h2>Contact Information</h2>
          <div className="info-item">
            <h4>📞 Phone</h4>
            <p>+61 2 1234 5678</p>
          </div>
          <div className="info-item">
            <h4>📧 Email</h4>
            <p>hello@webstudioaustralia.com</p>
          </div>
          <div className="info-item">
            <h4>📍 Location</h4>
            <p>Sydney, Australia</p>
          </div>
          <div className="info-item">
            <h4>🕒 Business Hours</h4>
            <p>Monday - Friday: 9:00 AM - 6:00 PM AEST</p>
          </div>
        </div>

        <div className="contact-form-wrapper">
          {submitted && (
            <div className="success-message">
              ✓ Thank you! We've received your inquiry. We'll get back to you soon.
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Name *</label>
              <input
                {...register('name', { required: 'Name is required' })}
                type="text"
                placeholder="Your name"
              />
              {errors.name && <span className="error">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                placeholder="your@email.com"
              />
              {errors.email && <span className="error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                {...register('phone')}
                type="tel"
                placeholder="+61 2 1234 5678"
              />
            </div>

            <div className="form-group">
              <label>Company</label>
              <input
                {...register('company')}
                type="text"
                placeholder="Your company"
              />
            </div>

            <div className="form-group">
              <label>Budget</label>
              <select {...register('budget')}>
                <option value="">Select a budget range</option>
                <option value="$5K-$10K">$5,000 - $10,000</option>
                <option value="$10K-$25K">$10,000 - $25,000</option>
                <option value="$25K-$50K">$25,000 - $50,000</option>
                <option value="$50K+">$50,000+</option>
              </select>
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea
                {...register('message', { required: 'Message is required' })}
                placeholder="Tell us about your project..."
                rows="5"
              />
              {errors.message && <span className="error">{errors.message.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-large">
              Send Inquiry
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Contact;
