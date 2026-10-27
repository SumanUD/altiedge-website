'use client';

import React, { useState } from "react";
import { useInView } from "react-intersection-observer";

const faqs = [
  { question: "Who is AltiEdge for?", answer: "AltiEdge is for anyone who loves the mountains, whether you’re a beginner planning your first trek or an experienced climber aiming for 8,000-meter peaks. Our programs are tailored to your level, goals, and aspirations." },
  { question: "Do I need prior mountaineering experience?", answer: "Not at all. Beginners can start with our readiness test and mentorship programs to build fitness, technical skills, and confidence. Experienced climbers can refine their performance, acclimatization, and expedition planning." },
  { question: "What makes AltiEdge different from regular fitness or trekking programs?", answer: "We combine real mountaineering experience with personalized, science-based training. From biometric tracking to mental conditioning, nutrition, acclimatization, and technical skills, our approach prepares you for the unique demands of high-altitude climbing." },
  { question: "How personalized are the training programs?", answer: "Very. Every climber gets a tailored plan based on their fitness, experience, altitude goals, and biometric data. Programs evolve as you progress, ensuring you’re always climbing smarter, safer, and stronger." },
  { question: "Can I take AltiEdge programs if I live in a city far from the mountains?", answer: "Yes! Our mentorship and online coaching programs are designed to work wherever you are. You’ll get guidance, workouts, and technical training you can do at home or in local terrain — with optional on-mountain workshops when ready." },
  { question: "What kind of support do I get during expeditions or technical workshops?", answer: "You train with seasoned mountaineers and certified guides who provide hands-on guidance in rock, snow, and ice craft, gear management, emergency response, and real-world expedition planning." },
  { question: "How do I know if I’m ready for a high-altitude summit?", answer: "Start with the AltiEdge Readiness Test (ART). It measures your fitness, biometrics, mental preparedness, and mountaineering experience. You’ll get a clear report highlighting strengths, improvement areas, and overall readiness." },
  { question: "Do AltiEdge programs cover nutrition and recovery?", answer: "Absolutely. We create personalized nutrition plans to fuel training, enhance recovery, and optimize endurance at high altitude. Nutrition is a key part of preparing your body for extreme conditions." },
  { question: "Can AltiEdge help me plan an expedition?", answer: "Yes. Our mentorship programs guide you through every step — from fitness and acclimatization to gear selection, route planning, and emergency preparedness — so you’re fully prepared for your summit goals." },
  { question: "I’m aiming for 8,000-meter peaks. How can AltiEdge help?", answer: "We work with high-altitude aspirants to build strength, endurance, and technical expertise specific to extreme elevations. With data-driven training, mental conditioning, and on-mountain experience, you’ll approach your summit with confidence." },
  { question: "How can I prevent altitude sickness on higher peaks?", answer: "We provide science-backed acclimatization strategies, monitor your cardiovascular readiness, and give guidance on nutrition, hydration, and pacing to minimize the risk of AMS, HAPE, or HACE." },
  { question: "Can AltiEdge help me recover and train between expeditions?", answer: "Yes. We create off-season and pre-expedition training cycles focusing on strength maintenance, endurance, flexibility, and injury prevention to keep you summit-ready year-round." },
];

export default function FaqAccordion() {
  const [openAccordion, setOpenAccordion] = useState("1faq");
  const { ref, inView } = useInView({ threshold: 0.4, triggerOnce: true });

  const handleOpenAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? "" : index);
  };

  return (
    <div className={`faq-content ${inView ? "text-animate" : ""}`} ref={ref}>
      <div className="accordion">
        {faqs.map((item, index) => (
          <div
            key={index + 1}
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
