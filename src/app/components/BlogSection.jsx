'use client';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar } from 'swiper/modules';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

import pin from '../../assets/icons/pin.webp';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import Link from "next/link";

// Helper: remove HTML tags and truncate text
const stripHtml = (html, maxLength = 150) => {
  if (!html) return "";
  const text = html.replace(/<[^>]+>/g, ""); // Remove HTML tags
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};


export const BlogSection = () => {
    const { ref: containerRef, inView: isVisible } = useInView({
        threshold: 0.4,
        triggerOnce: true
    });

    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch('https://admin.altiedge.com/api/blogs');
                const payload = await res.json();
                const data = payload?.data ?? payload;
                setBlogs(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Failed to fetch blogs:', err);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <section ref={containerRef}>
            <div className={`blogsSection ${isVisible ? 'text-animate' : ''}`}>
                <div className="header-content">
                    <div className="title fade fade-delay-1">
                        Insights. Ideas. Inspiration.<span>&#43; blog</span>
                    </div>
                    <div className="description fade fade-delay-3">
                        - Read, learn and train smarter for every climb.
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
                        0: { slidesPerView: 1.1, spaceBetween: 16 },
                        576: { slidesPerView: 1.5, spaceBetween: 18 },
                        768: { slidesPerView: 2.3, spaceBetween: 20 },
                        1024: { slidesPerView: 3, spaceBetween: 25 },
                    }}
                    className="fade fade-delay-6"
                >
                    {blogs.map((item, index) => (
    <SwiperSlide key={index}>
        <Link href={`/blogs/${item.slug}`}>
            <div className="blog-card cursor-pointer">
                <Image
                    src={item.banner_image ? `https://admin.altiedge.com/storage/${item.banner_image}` : 'https://via.placeholder.com/400x250'}
                    className="background-img"
                    alt={item.title}
                    width={400}
                    height={250}
                    placeholder="blur"
                    blurDataURL="/placeholder.png"
                />
                <div className="bg-gradiant"></div>
                <div className="text-content">
                    <div className="card-tags">
                        {item.tags?.split(',').map((tag, i) => (
                            <span className="tag" key={i}>#{tag.trim()}</span>
                        ))}
                    </div>
                    <div className="card-title">{item.title}</div>
                    <div className="card-description">
                    {stripHtml(item.description)}
                    </div>

                    <div className="card-details">
                        <span>{item.author || 'Admin'}</span>
                        <span>|</span>
                        <span>{item.published_at ? new Date(item.published_at).toLocaleDateString() : new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="card-location">
                    <Image src={pin} alt="pin" />
                    {item.location || 'Unknown'}
                </div>
            </div>
        </Link>
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
    );
};

