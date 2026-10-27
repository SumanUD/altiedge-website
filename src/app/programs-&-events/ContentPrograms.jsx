'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import img2 from '../../assets/10.webp';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const ContentPrograms = () => {
  const [events, setEvents] = useState([]);
  const [active, setActive] = useState(0);
  const [enquireModalOpen, setEnquireModalOpen] = useState(false);
  const [enquireData, setEnquireData] = useState({
    type: 'event', // or 'program' depending on data source
    reference_id: null,
    name: '',
    email: '',
    mobile_no: '',
    address: ''
  });
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null);

  const handleActive = (index) => {
    if (index !== active) setActive(index);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("https://admin.altiedge.com/api/events");
        const payload = await res.json();
        const data = payload?.data ?? payload;
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const openEnquiry = (id) => {
    setEnquireData(prev => ({
      ...prev,
      reference_id: id,
      type: 'event' // set dynamically if mixing programs and events
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

  return (
    <>
      <div className="program-contents">
        <div className="header-content">
          <div className="title">OUR EVENTS & PROGRAMS</div>
          <div className="description">
            — Discover our exclusive events and workshops across the Himalayas.
          </div>
        </div>

        <div className="program-container">
          {events.length === 0 ? (
            <div>Loading events...</div>
          ) : (
            events.map((item, index) => (
              <div
                className={`program-item ${active === index ? 'bg-dark' : 'bg-light'}`}
                key={item.id}
              >
                <button
                  className={`program-question ${active === index ? 'active' : ''}`}
                  onClick={() => handleActive(index)}
                >
                  <h2>
                    {"0" + (index + 1)}. {item.title}
                  </h2>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div className="program-answer">
                <div className="left">
                    <Swiper
                      modules={[Navigation, Pagination, Autoplay]}
                      spaceBetween={20}
                      slidesPerView={1}
                      loop={true}
                      autoplay={{ delay: 3000 }}
                      pagination={{ clickable: true }}
                      navigation={{
                        nextEl: ".custom-next",
                        prevEl: ".custom-prev",
                      }}
                      className="image-slider"
                    >
                      {item.gallery_images && item.gallery_images.map((image, i) => (
                        <SwiperSlide key={i}>
                          <Image
                            src={`https://admin.altiedge.com/storage/${image}`}
                            alt={`event-${i}`}
                            width={400}
                            height={300}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    <div className="custom-prev">‹</div>
                    <div className="custom-next">›</div>
                </div>

                <div className="right" >
                  <div className="title" >{item.sub_heading}</div>
                  <div
                    className="description"
                    style={{marginLeft: 30, textAlign: 'left', width: '86%'}}
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                  <div
                    className="btn-primary"
                  
                    style={{ cursor: 'pointer', marginTop: '1rem', marginRight: 20 }}
                    onClick={() => openEnquiry(item.id)}
                  >
                    Enquire
                  </div>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </div>

      {/* Enquiry Modal */}
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
    </>
  );
};
