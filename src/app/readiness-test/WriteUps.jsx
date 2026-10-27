'use client'
import React, { Fragment, useEffect, useState } from 'react'
import Image from 'next/image';
import img from '../../assets/11.webp';
import { useInView } from 'react-intersection-observer';

export const WriteUps = () => {
    const { ref: container1Ref, inView: is1Visible } = useInView({
        threshold: 0.3,
        triggerOnce: true
    });

    const [bannerText, setBannerText] = useState('');
    const [howToTakeTestText, setHowToTakeTestText] = useState('');

    useEffect(() => {
        const fetchART = async () => {
            try {
                const res = await fetch('https://admin.altiedge.com/api/pages/art');
                const payload = await res.json();
                const data = payload?.data ?? payload;

                // Get below_banner_text
                const belowBanner = data.sections?.find(
                    s => s.section_key === 'below_banner_text'
                )?.content || '';
                setBannerText(belowBanner);

                // Get how_to_take_test_text
                const howToText = data.sections?.find(
                    s => s.section_key === 'how_to_take_test_text'
                )?.content || '';
                setHowToTakeTestText(howToText);

            } catch (error) {
                console.error('Error fetching ART page:', error);
            }
        };
        fetchART();
    }, []);

    return (
        <Fragment>
            <div className="header-content">
                <div className="title">Step Up Your Climb</div>                        
            </div>

            <div className="detailedSteps">                        
                <div className="step" ref={container1Ref}>
                    <div className="image-container">
                        <Image 
                            src={img} 
                            alt="step1_image" 
                            className={is1Visible ? "reveal" : ""} 
                            width={800} 
                            height={800}
                        />
                    </div>
                    
                    <div className={`step-contents ${is1Visible ? 'text-animate':''}`}>
                        <div className="stepTitle fade-slide-right fade-delay-2">
                            Discover Your Climbing Readiness
                        </div>

                        {bannerText && <div dangerouslySetInnerHTML={{ __html: bannerText }} />}

                    </div>
                </div>                    
            </div> 

            <div className="readinessStepTitle">How to take the test</div>
            <div className="stepDesc" style={{ marginBottom: "60px" }}>
               <div
                dangerouslySetInnerHTML={{
                    __html:
                    howToTakeTestText ||
                    "For best experience, we suggest you go through all the questions once and read the explanations associated with them...",
                }}
                />

            </div>
        </Fragment>
    );
}

