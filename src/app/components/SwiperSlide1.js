'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import Image from 'next/image';

import { useInView } from 'react-intersection-observer';

import img1 from '../../assets/01.webp';
import img2 from '../../assets/02.webp';
import img3 from '../../assets/03.webp';
import img4 from '../../assets/04.webp';
import img5 from '../../assets/05.webp';
import img6 from '../../assets/06.webp';
import img7 from '../../assets/new-home/ae.webp';


import img8 from '../../assets/new-home/elbrus.webp';
import img9 from '../../assets/new-home/satyaeverest.webp';
import img10 from '../../assets/new-home/ae.webp';
import img11 from '../../assets/new-home/Home3.webp';
import img13 from '../../assets/new-home/Home2.webp';
import img14 from '../../assets/new-home/Home1.webp';


import img12 from '../../assets/new-home/everest c3.webp';

const slides = [
  {
    title: 'Built for Climbers',
    subtitle: 'The only platform made just for mountaineers',
    img1: img1,
    img2: img2,
    desc: "It prepares you for the real challenges of high altitude."
  },
  {
    title: 'Science That Works',
    subtitle: 'Track biometrics, study your body and train smarter with science-backed methods that improve performance where it counts in the mountains.',
    img1: img3,
    img2: img4,
    desc: "Train smarter with science-backed methods that improve performance where it counts in the mountains."
  },
  {
    title: 'Your Plan Your Edge',
    subtitle: 'Get a program built around you. One-on-one mentorship ensures your training is personal, practical and always aligned to your climbing goals.',
    img1: img5,
    img2: img6,
    desc: "One-on-one mentorship ensures your training is personal, practical and always aligned to your climbing goals."
  },
  {
    title: 'Train on Real Peaks',
    subtitle: 'Learning happens best in the mountains. Our practical sessions on actual summits give you hands-on experience before the big climbs.',
    img1: img7,
    img2: img8,
    desc: "Learning happens best in the mountains. Our sessions on actual summits give you hands-on experience before the big climbs."
  },
  {
    title: 'Complete Preparation',
    subtitle: 'Fitness, nutrition, gear, acclimatization and emergency skills. We cover it all so you are fully ready from basecamp to summit.',
    img1: img13,
    img2: img14,
    desc: "Fitness, nutrition, gear, acclimatization and emergency skills. We cover it all so you are fully ready."
  },
  {
    title: 'Mentors Who Have Been There',
    subtitle: 'Learn from renowned mountaineers and seasoned experts who have faced the same climbs and know what it really takes to succeed.',
    img1: img11,
    img2: img12,
    desc: "Learn from renowned mountaineers and seasoned experts who have faced the same climbs and know what it really takes to succeed."
  },
];

export const SwiperSlide1 = () => {

  const {ref: containerRef, inView: isVisible} = useInView({
    threshold: .4,
    triggerOnce: true
  })

  return (
    <section ref={containerRef}>
      <div className={`usp ${isVisible ? 'text-animate' :''}`}>
        <div className="header-content" >
          <div className="title fade fade-delay-1">
            Train. Prepare. Summit
          </div>
          <div className="description fade fade-delay-3">
            - Six reasons why AltiEdge gives you the true edge in climbing
          </div>


        </div>

          <Swiper
            modules={[Navigation, Scrollbar]}
            spaceBetween={20}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            scrollbar={{
              el: '.swiper-scrollbar',
              draggable: true,
              snapOnRelease: false,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1.1, // Mobile view: 1 full slide + next hint
                spaceBetween: 16,
              },
              576: {
                slidesPerView: 1.5, // Small tablets
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2.3, // Tablets
                spaceBetween: 25,
              },
              1024: {
                slidesPerView: 3.3, // Desktop
                spaceBetween: 30,
              },
            }}
            className="fade fade-delay-6"
          >

          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <Image
                src={slide.img1}
                alt="usp-image"
                className="img-1"
                loading="lazy"
                width={400}
                height={250}
              />
              <Image
                src={slide.img2}
                alt="usp-image"
                className="img-2"
                loading="lazy"
                width={400}
                height={250}
              />
              <div className="slide-heading">
                {slide.title} <br />
                {/* {slide.title.split(' ')} */}
                {/* <p>+ {slide.subtitle}</p> */}
              </div>
              <div className="slide-desc">
                <p>
                  {slide.subtitle}
                </p>
                {/* <div className="btn-primary">Know More</div> */}
              </div>
            </SwiperSlide>
          ))}

          <div className="swiper-controller-wrapper">
            <div className="swiper-navigation">
              <div className="swiper-button-prev" />
              <div className="swiper-button-next" />
            </div>
            <div className="swiper-scrollbar" />
          </div>
        </Swiper>
      </div>
    </section>
  )
}
