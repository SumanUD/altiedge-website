'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import location from '../../assets/icons/pin.webp';
import date from '../../assets/icons/calendar.webp';

export const ContentEvents = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [enquireModalOpen, setEnquireModalOpen] = useState(false);
  const [enquireData, setEnquireData] = useState({
    type: 'program',
    reference_id: null,
    name: '',
    email: '',
    mobile_no: '',
    address: ''
  });
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch('https://admin.altiedge.com/api/programs');
        const payload = await res.json();
        const data = payload?.data ?? payload;
        setEvents(Array.isArray(data) ? data : []);

      } catch (error) {
        console.error('Failed to load programs', error);
      }
    };
    fetchPrograms();
  }, []);



  const openEnquiry = (id) => {
    setEnquireData(prev => ({
      ...prev,
      reference_id: id,
      type: 'program'
    }));
    setMessage(null);
    setEnquireModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEnquireData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setMessage(null);

    try {
      const res = await fetch('https://admin.altiedge.com/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquireData),
      });
      if (res.ok) {
        setMessage("Enquiry submitted successfully!");
        // Keep modal open briefly to show message
        setTimeout(() => {
          setEnquireModalOpen(false);
          setEnquireData({
            type: 'event',
            reference_id: null,
            name: '',
            email: '',
            mobile_no: '',
            address: ''
          });
          setMessage(null);
        }, 3000); // 3 seconds delay
      } else {
        const errorData = await res.json();
        setMessage(errorData.message || "Failed to submit enquiry.");
      }

    } catch (error) {
      setMessage("Error submitting enquiry.");
    }
    setSending(false);
  };

  const formatProgramDate = (dateValue) => {
    if (!dateValue) return '';
    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) return dateValue;
    return parsedDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="event-contents">
      <div className="header-content">
        <div className="title">Upcoming Programs</div>
      </div>

      {events.slice(0, 3).map((item, index) => (
        <div key={item.id}>
          <div className="event-card">
            <div className="content-left">
              <div className="event-info">
                <span>
                  <Image src={location} alt="location-icon" /> {item.location},
                </span>
                <span>
                  <Image src={date} alt="date-icon" /> {formatProgramDate(item.program_date)}
                </span>
              </div>
              <div className="event-title">{item.title}</div>
              <div className="event-price">
                <span>Price:</span> On Request
              </div>
              <div
                className="event-description"
                dangerouslySetInnerHTML={{ __html: item.description }}
                
              />
            </div>
            <div className="content-right">
              <div className="action-group">
                <div
                  className="btn-primary-dark"
                  style={{ cursor: 'pointer' }}
                  onClick={() => openEnquiry(item.id)}
                >
                  Enquire
                </div>
                <div
                  className="btn-primary-dark"
                  onClick={() => setSelectedEvent(item)}
                >
                  Know More
                </div>
              </div>
            </div>
          </div>
          <div className="underline"></div>
        </div>
      ))}

      {/* Know More Modal */}
      {selectedEvent && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedEvent(null)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedEvent.title}</h2>
              <span className="close-btn" onClick={() => setSelectedEvent(null)}>
                ×
              </span>
            </div>
            <div className="modal-body">
              <p>
                <strong>Date:</strong> {formatProgramDate(selectedEvent.program_date)}
              </p>
              <p>
                <strong>Location:</strong> {selectedEvent.location}
              </p>
              <p>
                <strong>Price:</strong> On Request
              </p>
              <p
                dangerouslySetInnerHTML={{ __html: selectedEvent.description }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Enquiry Form Modal */}
      {enquireModalOpen && (
        <div className="modal-backdrop" onClick={() => setEnquireModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Enquiry Form</h2>
             {message && <p className="form-message">{message}</p>}
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">Name*</label>
                <input
                  id="name"
                  name="name"
                  value={enquireData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="email">Email*</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={enquireData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="mobile_no">Mobile Number*</label>
                <input
                  id="mobile_no"
                  name="mobile_no"
                  type="tel"
                  value={enquireData.mobile_no}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={enquireData.address}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" disabled={sending}>
                {sending ? 'Sending...' : 'Submit'}
              </button>
            </form>
            <span
              className="close-btn"
              onClick={() => setEnquireModalOpen(false)}
              style={{ cursor: "pointer", position: "absolute", top: 10, right: 15, fontSize: 24 }}
            >
              ×
            </span>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top:0; left:0;
          width:100%; height:100%;
          background: rgba(0,0,0,0.5);
          display:flex;
          justify-content:center;
          align-items:center;
          z-index:1000;
        }
        .modal-content {
          background:#fff;
          padding:2rem;
          border-radius:8px;
          max-width:600px;
          width:90%;
          position:relative;
        }
        .modal-content form div {
          margin-bottom:1rem;
        }
        .modal-content label {
          display:block;
          margin-bottom:0.5rem;
          font-weight:bold;
        }
        .modal-content input,
        .modal-content textarea {
          width:100%;
          padding:8px;
          font-size:1rem;
          border:1px solid #ccc;
          border-radius:4px;
        }
        button[type="submit"] {
          background-color:#0070f3;
          color:#fff;
          border:none;
          padding:10px 20px;
          border-radius:5px;
          cursor:pointer;
          font-size:1rem;
        }
        button[type="submit"]:disabled {
          opacity:0.6;
          cursor: not-allowed;
        }
          .form-message {
                margin: 1rem 0 0 0;
                padding: 10px 15px;
                background-color: #f0f4f8; /* light background */
                border-left: 5px solid #0070f3; /* accent color */
                color: #333;
                font-weight: 600;
                border-radius: 4px;
            }
      `}</style>
    </div>
  );
};

