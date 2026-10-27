"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Helper function to generate avatar colors based on name
const avatarColors = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F",
  "#BB8FCE", "#85C1E2", "#F8B88B", "#A9DFBF", "#F5B7B1", "#D7BDE2",
  "#A3E4D7", "#F9E79F", "#F5CBA7", "#D2B4DE", "#ABEBC6", "#FAD7A0"
];

const getAvatarInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (name) => {
  if (!name) return avatarColors[0];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarColors[hash % avatarColors.length];
};

export const Testimonial = ({ testimonials }) => {
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  if (!testimonials || testimonials.length === 0) {
    return <p>Loading testimonials...</p>;
  }

  return (
    <section>
      <div className="testimonialSection">
        {/* Header */}
        <div className="header-content">
          <div className="title">
            Real Stories. Real Journeys.<span>&#43; testimonial</span>
          </div>
          <div className="description">
            - Voices from the peaks. What our climbers say..
          </div>

          {/* Google Rating Overview */}
          <div className="google-rating">
            <div className="rating-left">
              <div className="rating-score">5.0</div>
              <div className="stars">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <div className="total-reviews">
                <i>👤</i> 30 total
              </div>
            </div>
            <div className="rate-us">
              <a
                href="https://share.google/mvpgqkajLRvLU9oy9"
                target="_blank"
                rel="noopener noreferrer"
                className="rate-button"
              >
                ⭐ Rate us on Google
              </a>
            </div>
          </div>
        </div>

        {/* Testimonials Swiper Slider */}
        <div className="testimonial-marquee">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            spaceBetween={20}
            loop={true}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="testimonial-swiper"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div className="review-card">
                  <div className="card-header">
                    {t.image ? (
                      <Image
                        src={t.image}
                        alt={t.name || "User"}
                        width={80}
                        height={80}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          backgroundColor: getAvatarColor(t.name),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "28px",
                          flexShrink: 0
                        }}
                      >
                        {getAvatarInitials(t.name)}
                      </div>
                    )}

                    <div className="customer-info">
                      <h4 className="customer-name">{t.name || "Anonymous"}</h4>
                      {/* <div className="rating">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="star">
                            ★
                          </span>
                        ))}
                      </div> */}
                      {/* {t.designation && (
                        <p className="designation">{t.designation}</p>
                      )} */}
                    </div>
                  </div>

                  <p className="review-text">
                    {t.description.length > 180
                      ? `${t.description.slice(0, 180)}...`
                      : t.description}
                  </p>

                  {t.description.length > 180 && (
                    <button
                      className="read-more-btn"
                      onClick={() => setSelectedTestimonial(t)}
                    >
                      Read More
                    </button>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Modal */}
{selectedTestimonial && (
  <div
    className="testimonial-modal-overlay"
    onClick={() => setSelectedTestimonial(null)}
  >
    <div
      className="testimonial-modal"
      onClick={(e) => e.stopPropagation()}
      style={{
        maxHeight: "90vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <button
        className="close-btn"
        onClick={() => setSelectedTestimonial(null)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "transparent",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
        }}
      >
        ✕
      </button>

      <div
        className="modal-header"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "20px",
          borderBottom: "1px solid #ddd",
          flexShrink: 0,
        }}
      >
        {selectedTestimonial.image ? (
          <Image
            src={selectedTestimonial.image}
            alt={selectedTestimonial.name || "User"}
            width={100}
            height={100}
            className="rounded-full object-cover"
          />
        ) : (
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              backgroundColor: getAvatarColor(selectedTestimonial.name),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "44px",
              flexShrink: 0
            }}
          >
            {getAvatarInitials(selectedTestimonial.name)}
          </div>
        )}
        <div>
          <h3 className="modal-name" style={{ fontSize: "20px", fontWeight: "600" }}>
            {selectedTestimonial.name || "Anonymous"}
          </h3>
          {selectedTestimonial.designation && (
            <p className="modal-designation" style={{ color: "#666" }}>
              {selectedTestimonial.designation}
            </p>
          )}
        </div>
      </div>

      <div
        className="modal-body"
        style={{
          padding: "20px",
          overflowY: "auto",
          flexGrow: 1,
          scrollbarWidth: "thin",
          scrollbarColor: "#999 transparent",
        }}
      >
        <p style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
          {selectedTestimonial.description}
        </p>
      </div>
    </div>
  </div>
)}


      </div>
    </section>
  );
};
