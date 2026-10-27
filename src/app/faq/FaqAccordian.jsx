'use client';

import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function FaqAccordion() {
  const [faqs, setFaqs] = useState([]);
  const [openAccordion, setOpenAccordion] = useState("1faq");
  const { ref, inView } = useInView({ threshold: 0.4, triggerOnce: true });

  // Fetch FAQs from API
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch("https://admin.altiedge.com/api/faqs");
        const payload = await response.json();
        const data = payload?.data ?? payload;
        // Optional: sort by id or created_at
        const activeFaqs = (Array.isArray(data) ? data : []).filter(f => f.is_active === 1);
        setFaqs(activeFaqs);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    fetchFaqs();
  }, []);

  const handleOpenAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? "" : index);
  };

  return (
    <div className={`faq-content ${inView ? "text-animate" : ""}`} ref={ref}>
      <div className="accordion">
        {faqs.map((item, index) => (
          <div
            key={item.id}
            className={`accordion-item fade-slide-right fade-long-delay-${index + 1} ${
              openAccordion === `${index + 1}faq` ? "open" : "close"
            }`}
          >
            <button
              className="question"
              id={`${index + 1}faq`}
              onClick={() => handleOpenAccordion(`${index + 1}faq`)}
              style={{ border: "none" }}
            >
              {index + 1 < 10 ? `0${index + 1}` : index + 1}. {item.question}
            </button>
            <div className="answer">
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

