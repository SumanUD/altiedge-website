import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageBanner } from '../components/PageBanner';

import bannerImg from '../../assets/16.webp';
import image2 from '../../assets/15small.webp';
import img2 from '../../assets/10.webp';

export const dynamic = 'force-static';

// Helper: remove HTML tags and truncate text
const stripHtml = (html, maxLength = 150) => {
  if (!html) return "";
  const text = html.replace(/<[^>]+>/g, ""); // Remove HTML tags
  return text;
};


const AboutPage = async () => {
  // Fetch API at server-side (async page component)
  let sections = [];
  let repeats = [];

  try {
    const res = await fetch('https://admin.altiedge.com/api/pages/about', { cache: 'no-store' });
    const payload = await res.json();
    const data = payload?.data ?? payload;
    sections = data.sections || [];
    repeats = data.repeats || [];
  } catch (err) {
    console.error('Error fetching About page:', err);
  }

  const belowBannerText =
    sections.find((s) => s.section_key === 'below_banner_text')?.content ??
    'AltiEdge was born from real climbs, real struggles, and real victories — so we know exactly what it takes to get you summit-ready.';

  const banner = {
    bannerImg: bannerImg,
    title: 'Built by Mountaineers, For Mountaineers',
    subTitle: 'About AltiEdge',
    description: 'AltiEdge was born from real climbs, real struggles, and real victories — so we know exactly what it takes to get you summit-ready.',
  };

  return (
    <main>
      <section>
        <div className="about-page">
          <PageBanner banner={banner} />

          <div className="pageContents">
            <div className="about-left">
              <div className="bottom-text">
                "it is not the mountain we conquer, but ourselves." <br />
                <span> — Sir Edmund Hillary</span>
              </div>

              <Image src={image2} alt="image" placeholder="blur" />
            </div>

            <div className="about-right">
              <div className="about-text-content">
                <h2>About AltiEdge</h2>
                <p>{stripHtml(belowBannerText)}</p>
              </div>
            </div>
          </div>

          <div className="the-team">
            <div className="heading">Meet the Team</div>

            <div className="team-group">
              {repeats.length > 0 ? (
                repeats.map((member) => (
                  <div key={member.id} className="team-card">
                    <div className="team-image">
                      <Image
                        src={`https://admin.altiedge.com/storage/${member.image}`}
                        alt={member.name}
                        width={400}
                        height={400}
                      />
                    </div>
                    <div className="team-name">{member.name}</div>
                    <div className="team-title">— {member.designation}</div>
                    <div className="team-about">{member.description}</div>
                  </div>
                ))
              ) : (
                <p>No team members found.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="redinessTestBanner">
        <Image
          src={img2}
          alt="Readiness Test Banner"
          className="banner-bg"
          placeholder="blur"
          priority
        />
        <div className="banner-content">
          <h2>Test Your Edge</h2>
          <p>
            Take the AltiEdge Readiness Test and find out your fitness, biomarkers, and
            mountaineering experience score before your next climb.
          </p>
          <Link href="/readiness-test">
            <button className="btn-primary">Start Test</button>
          </Link>
        </div>
      </section>
    </main>
  );
};

// This is a test

export default AboutPage;

