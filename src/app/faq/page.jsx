export const dynamic = "force-static";


import React from "react";
import { PageBanner } from "../components/PageBanner";
import bannerImg from "../../assets/16.webp";
import FaqAccordion from "./FaqAccordian";

export default function FaqPage() {
  const banner = {
    bannerImg: bannerImg,
    title: "Frequently Asked Questions",
    subTitle: "Your Queries, Answered Clearly",
    description:
      "From training methods and biometric tracking to mountaineering skills and expedition readiness — find answers to the most common questions about AltiEdge. Our goal is to make your journey to the mountains clear, safe, and inspiring.",
  };

  return (
    <section>
      <PageBanner banner={banner} />

      <div className="faqSection">
        <div className="header-content">
          <div className="title">Curious? We've Got You Covered.</div>
          <div className="description">
            - Find quick answers to the most common questions and clear your doubts in no time.
          </div>
        </div>

        {/* Client-side interactive accordion */}
        <FaqAccordion />
      </div>
    </section>
  );
}
