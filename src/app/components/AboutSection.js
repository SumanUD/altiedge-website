'use client'
import React from 'react'
import { useInView } from 'react-intersection-observer';
import Image from 'next/image'
import Link from 'next/link'
import img1 from '../../assets/new-home/lhotse summit.webp';
import img2 from '../../assets/10.webp';
import img3 from '../../assets/08.webp';


export const AboutSection = ({ aboutText, artText  }) => {

    const { ref: containerRef, inView: isVisible } = useInView({
        threshold: .4,
        triggerOnce: true
    })

    return (
        <section>
            <div className="aboutSection" ref={containerRef}>
                <div className="aboutSectionImages">
                    <div className="image1 image-container" >
                        {/* <Image src="assets/11.webp" alt=""> */}
                        <Image src={img1} className= "reveal" alt="about-image" placeholder='blur' />

                        <div className="image2">
                            <Image src={img2} alt="about-image" placeholder='blur' />
                        </div>
                        <div className="image3">
                            <Image src={img3} alt="about-image" placeholder='blur' />
                        </div>
                    </div>
                </div>
                <div className={`text-wrapper ${isVisible ? 'text-animate' : ''}`}>
                    <div className="aboutSectionParagraph1">
                        <div>
                            <h2 className='fade-slide-right fade-delay-1'>&#43; <span></span> About us</h2>
                            <p className='fade-slide-right fade-delay-2'>Built by Mountaineers, For Mountaineers</p>
                        </div>
                    </div>
                    <div className="aboutSectionParagraph2">
                        <div>
                            <p className='fade-slide-right fade-delay-3'>
                                {aboutText}</p>
                            <Link href="/about-us">
                                <div className="btn-primary fade-slide-right fade-delay-4">
                                    know more
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <section className="redinessTestBanner">
                <Image
                    src={img2}
                    alt="Readiness Test Banner"
                    className="banner-bg"
                    placeholder="blur"
                    priority
                />
                <div className="banner-content">
                    <h2>AltiEdge Readiness Test</h2>
                    <p>{artText}</p>
                    <Link href="/readiness-test">
                        <button className="btn-primary">Start Test</button>
                    </Link>
                </div>
            </section>

        </section>
    )
}
