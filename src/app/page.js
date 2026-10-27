export const dynamic = "force-static";

import Image from "next/image";

import { AboutSection } from "./components/AboutSection";
import { Testimonial } from "./components/Testimonial";
import { SwiperSlide1 } from "./components/SwiperSlide1";
import { BlogSection } from "./components/BlogSection";
import { Faq } from "./components/Faq";

import ParallaxEffect from "@/hooks/ParallaxEffect";
// images
import herobanner from '../assets/new-home/Home Page Pic Option 4 - elbrus scene 3.webp';
import logo from '../assets/icons/logo.webp';

export default async function Home() {
  // Fetch the home page content from API
  const res = await fetch('https://admin.altiedge.com/api/pages/home', { cache: 'no-store' });
  const payload = await res.json();
  const data = payload?.data ?? payload;

  // Convert sections array to an object for easy access
  const sections = {};
  (data.sections || []).forEach(item => {
    sections[item.section_key] = item.content;
  });

  // Hardcoded testimonials only - no dynamic fetching from backend
  const testimonials = [
    {
      "id": 1,
      "page_name": "home",
      "section_key": "testimonials",
      "image": null,
      "name": "Nimish Srivastava",
      "designation": null,
      "description": "This was my first winter trek and it was such a wonderful experience. Before the trek we were given extensive training about the gears and equipments that are being used in snow and ice. It was a perfect training for a beginner. Thanks.",},
    {
      "id": 2,
      "page_name": "home",
      "section_key": "testimonials",
      "image": "/abhisekh.png",
      "name": "Abhishek Duttagupta",
      "designation": null,
      "description": "I am into running, treks and high altitude climbing for many years. During this period I explored various training approach from various sources for my running and climbing. Altiedge gave me a structured plan that was science-backed and practical. It helped me improve my endurance and climbing ability.",},
    {
      "id": 3,
      "page_name": "home",
      "section_key": "testimonials",
      "image": null,
      "name": "Sanchayita Roy Kaur",
      "designation": "Local Guide",
      "description": "I trained with Altiedge for my Mt. Elbrus climb and successfully completed on 15th August 2025. It was a proud moment to fly the flag of India on our Independence Day, from the highest soil of Europe :)",},
    {
      "id": 4,
      "page_name": "home",
      "section_key": "testimonials",
      "image": "/anita.png",
      "name": "Anita Menon",
      "designation": null,
      "description": "10 months. 2 hours every day. And always with a clear goal in focus. That's what Altiedge has been preparing me right through. The discipline and structure have been transformative.",},
    {
      "id": 5,
      "page_name": "home",
      "section_key": "testimonials",
      "image": null,
      "name": ".restlessnomad.",
      "designation": "Local Guide",
      "description": "I came on board with my own experience in high-altitude mountaineering, but Altiedge took things to an entirely different level. Their structured training helped me refine my skills and improve my performance.",},
    {
      "id": 6,
      "page_name": "home",
      "section_key": "testimonials",
      "image": null,
      "name": "Ankush Koundal",
      "designation": "Local Guide",
      "description": "A perfect platform that gives tailored guidance. Been training with them for last 6 months, having left mountaineering about 9 years ago and body fitness far from satisfactory, I was hesitant but results have been nothing short of amazing.",},
    {
      "id": 7,
      "page_name": "home",
      "section_key": "testimonials",
      "image": null,
      "name": "Capt Raksha_W",
      "designation": null,
      "description": "I have been training with Altiedge since October and the journey has been truly transformative. The genuine involvement of the team comprising of the best mountaineers is what makes it special.",},
    {
      "id": 8,
      "page_name": "home",
      "section_key": "testimonials",
      "image": null,
      "name": "Nagaraju Siruvuri",
      "designation": null,
      "description": "Training with AltiEdge was a game-changer for my high-altitude expedition. When I signed up for KangYatse 2, I wasn't sure what it would take to push beyond 6000m, but their structured approach and continuous guidance made it possible.",},
    {
      "id": 9,
      "page_name": "home",
      "section_key": "testimonials",
      "image": null,
      "name": "Sneha Baid",
      "designation": null,
      "description": "Training for mountains requires much more than just fitness — it demands preparation for altitude, extreme conditions, and mental resilience. Altiedge has built a truly remarkable program that addresses all these aspects in a structured and effective way.",},
    {
      "id": 10,
      "page_name": "home",
      "section_key": "testimonials",
      "image": null,
      "name": "Aarav Thandassery",
      "designation": null,
      "description": "I have been training with Altiedge for the last couple of months, and have noticed a drastic change in my fitness and performance in the mountains. I found it a lot easier to breathe and didn't get tired that easily because of Altiedge's training.",},
    {
      "id": 11,
      "page_name": "home",
      "section_key": "testimonials",
      "image": null,
      "name": "Chirag Chatterjee",
      "designation": null,
      "description": "Science-based training for mountaineering has always been missing amongst the Indian climbing community at large. Much needed to cultivate a new, empowered generation of Indian climbers. Kudos to AltiEdge.",},
    {
      "id": 12,
      "page_name": "home",
      "section_key": "testimonials",
      "image": "/atik.png",
      "name": "Atik Sheikh",
      "designation": null,
      "description": "I trained with Altiedge for four months ahead of my Elbrus climb, and their structured approach made all the difference. The journey began with an initial assessment through a detailed survey, based on which they designed a customised plan. It worked brilliantly.",},
    {
      "id": 13,
      "page_name": "home",
      "section_key": "testimonials",
      "image": "/pooja.png",
      "name": "Pooja Nautiyal",
      "designation": null,
      "description": "I would like to thank Altiedge for providing me structured training for successful Mt Everest summit. The training program was excellent in terms of strengthening my physical and mental fitness. Their personal indulgence helped me pursue training program religiously. Thanks Altiedge for helping me realise my dream.",},
    {
      "id": 14,
      "page_name": "home",
      "section_key": "testimonials",
      "image": null,
      "name": "Manasa Prakash",
      "designation": null,
      "description": "I am happy with the training given by Altiedge. Trainers are professionals and guide patiently.",},
    {
      "id": 15,
      "page_name": "home",
      "section_key": "testimonials",
      "image": null,
      "name": "Prakriti Varshney",
      "designation": "Local Guide",
      "description": "Science-backed training is finally happening in India!!!! Glad to be a part!",},
    {
      "id": 16,
      "page_name": "home",
      "section_key": "testimonials",
      "image": null,
      "name": "Romil Barthwal",
      "designation": "Local Guide",
      "description": "If it's about high altitude climbs then there is nothing better in India.",},
    {
      "id": 17,
      "page_name": "home",
      "section_key": "testimonials",
      "image": null,
      "name": "Saurabh Khanna",
      "designation": "Local Guide",
      "description": "Satyadeep's approach to mountain training is apt, specific, and backed by deep expertise. Preparing for Ama Dablam requires a very particular kind of readiness, and the AltiEdge program delivers exactly that.",},
    {
      "id": 18,
      "page_name": "home",
      "section_key": "testimonials",
      "image": null,
      "name": "Gurmeet Mehta",
      "designation": null,
      "description": "Sincere gratitude, for filling the crucial missing bricks in my foundation building, of aspired progressive journey, preparations to train for next ascends 🏔 to come!",},
    {
      "id": 19,
      "page_name": "home",
      "section_key": "testimonials",
      "image": null,
      "name": "Namrata Ganwani",
      "designation": null,
      "description": "I am truly grateful for having such incredible mentors on my side. They focus on physical training but also take the time to explain the technical aspects. Learning from them has been a true privilege.",},
    {
      "id": 20,
      "page_name": "home",
      "section_key": "testimonials",
      "image": null,
      "name": "Pavan Kumar Karidi",
      "designation": null,
      "description": "I have been training with Altiedge for a while now and it has been wonderful. Their approach to goal-based training is meticulous and backed by decades of mountaineering experience.",},
    {
      "id": 21,
      "page_name": "home",
      "section_key": "testimonials",
      "image": null,
      "name": "Dr. Azmi Naz",
      "designation": null,
      "description": "",},
    {
      "id": 22,
      "page_name": "home",
      "section_key": "testimonials",
      "image": "/nimesh.png",
      "name": "Tanya Agarwal",
      "designation": null,
      "description": "",}
  ];

  return (
    <main className="homePage">
      <section id="hero-banner text-animate" className="bgDark">
        <ParallaxEffect />
        <div className="heroBanner">
          <div className="bgLayer"></div>
          <Image src={herobanner} alt="hero-banner-image" className="parallax-image" priority />
          <div className="heroBannerContent-center text-animate">
            <Image src={logo} alt="logo" className="logo delay-it fade" />
            <p className="hero-logo-title sectionTitle colorLight">
              <span className="fade fade-delay-1">A</span>
              <span className="fade fade-delay-2">l</span>
              <span className="fade fade-delay-3">t</span>
              <span className="fade fade-delay-4">i</span>
              <span className="fade fade-delay-5">E</span>
              <span className="fade fade-delay-6">d</span>
              <span className="fade fade-delay-7">g</span>
              <span className="fade fade-delay-8">e</span>
            </p>
            <h2 className="fade-slide-right delay-it sectionDescription colorLight">TRAINING FOR THIN AIR</h2>
          </div>
          <div className="heroBannerContent text-animate">
            <div className="underline"></div>
            <p className="fade-slide-right delay-it sectionDescription colorLight">
              {sections['below_banner_text']}
            </p>
          </div>
        </div>
      </section>

      <AboutSection 
        aboutText={sections['about_us_text']} 
        artText={sections['art_text']}
      />
      <SwiperSlide1 />
      <Testimonial testimonials={testimonials} />
      <BlogSection />
      <Faq />
    </main>
  );
}


