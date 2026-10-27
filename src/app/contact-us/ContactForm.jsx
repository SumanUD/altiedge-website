'use client';
import React, { useState } from 'react';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_no: '',
    message: '',
  });

  const [sending, setSending] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSending(true);
    setResponseMessage(null);

    try {
      const res = await fetch('https://admin.altiedge.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setResponseMessage('Thank you for contacting us! We will get back to you shortly.');
        setFormData({ name: '', email: '', mobile_no: '', message: '' });
      } else {
        const errorData = await res.json();
        setResponseMessage(errorData.message || 'Failed to submit form.');
      }
    } catch (error) {
      setResponseMessage('Error submitting the form. Please try again later.');
    }

    setSending(false);
  };

  return (
    <div className="contact-form">
      <div className="page-contacts">
        <div className="left">
          <span>+</span>
          <p className="left-title">
            Tell us a bit about yourself and we'll help you find the perfect MTB or E-MTB adventure for you!
          </p>
        </div>
        <div className="right">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="mobile_no">Mobile No.</label>
              <input
                type="text"
                id="mobile_no"
                value={formData.mobile_no}
                onChange={handleChange}
                required
                maxLength={15}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">How can we help you?</label>
              <textarea
                id="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={sending}>
              {sending ? 'Sending...' : 'Submit'}
            </button>

            {responseMessage && <p className="form-message">{responseMessage}</p>}
          </form>
        </div>
      </div>

      <style jsx>{`
        .form-group {
          margin-bottom: 1rem;
        }
        label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        input, textarea {
          width: 100%;
          padding: 8px;
          font-size: 1rem;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
        button.btn-primary {
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 10px 25px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1.1rem;
        }
        button.btn-primary:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
        .form-message {
            margin-top: 1rem;
            color: #16343c;
            font-weight: 600;
            font-size: 1.3rem;
        }
      `}</style>
    </div>
  );
};

