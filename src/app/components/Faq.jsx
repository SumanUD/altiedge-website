'use client';
import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export const Faq = () => {
    const [faqs, setFaqs] = useState([]);
    const [openAccordion, setOpenAccordion] = useState('1faq');

    const { ref: containerRef, inView: isVisible } = useInView({
        threshold: 0.4,
        triggerOnce: true
    });

    const handleOpenAccordion = (index) => {
        setOpenAccordion(openAccordion === index ? '' : index);
    };

    // Fetch FAQs from API
    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await fetch('https://admin.altiedge.com/api/faqs');
                const payload = await response.json();
                const data = payload?.data ?? payload;
                // Filter active FAQs and take top 10
                const activeFaqs = (Array.isArray(data) ? data : []).filter(f => f.is_active === 1).slice(0, 10);
                setFaqs(activeFaqs);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            }
        };

        fetchFaqs();
    }, []);

    return (
        <section>
            <div className="faqSection" ref={containerRef}>
                <div className="header-content">
                    <div className="title">
                        Curious? We've Got You Covered.<span>&#43; FAQ</span>
                    </div>
                    <div className="description">
                        - Find quick answers to the most common questions and clear your doubts in no time.
                    </div>
                </div>
                <div className={`faq-content ${isVisible ? 'text-animate' : ''}`}>
                    <div className="accordion">
                        {faqs.map((item, index) => (
                            <div
                                className={`accordion-item fade-slide-right fade-long-delay-${index + 1} ${openAccordion === `${index + 1}faq` ? 'open' : 'close'}`}
                                key={item.id}
                            >
                                <a href={`/#${index + 1}faq`}>
                                    <div
                                        className="question"
                                        id={`${index + 1}faq`}
                                        onClick={() => handleOpenAccordion(`${index + 1}faq`)}
                                    >
                                        {index + 1 < 10 ? `0${index + 1}` : index + 1}. {item.question}
                                    </div>
                                </a>
                                <div className="answer">
                                    <p>{item.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

