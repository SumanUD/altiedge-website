export const dynamic = "force-static";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ContactForm } from './ContactForm';

import facebook from '../../assets/icons/facebook.webp';
import instagram from '../../assets/icons/instagram.webp';
import linkedIn from '../../assets/icons/linkedin.webp';
import whatsApp from '../../assets/icons/whatsapp.webp';
import youtube from '../../assets/icons/youtube.webp';
import phone from '../../assets/icons/iphone.webp';
import mail from '../../assets/icons/email.webp';
import { PageBanner } from '../components/PageBanner';

import bannerImg from '../../assets/13.webp';


  const banner = {
    bannerImg: bannerImg,
    title: 'Contact Us',
    subTitle: 'Let us help you!',
    description: "We’d love to hear from you, so please use the form or contact details below to get in touch with one of our tour specialists."
  }

const page = () => {
  return (
    <main>
                <PageBanner banner={banner}/>
      
      <section className='bgDark'>
        <div className="contact-page">          
          <div className="pageContents">            

            <div className="contact-page-top">
              {/* <div className="page-title">Contact</div> */}
              <div className="contact-contents">
                {/* <div className="left">
                  <p className="description"></p>
                </div> */}
                <div className="right">
                  <div className="info">
                    <div className="info-title">Contact Info.</div>
                    <ul>
                      <li>
                        <Link href={'mailto:infoaltiedge@gmail.com'}><Image src={mail} alt='mail-icon'/>infoaltiedge@gmail.com</Link>
                      </li>
                      <li>
                        <Link href={'tel:8171459499'}><Image src={phone} alt='phone-icon'/> +91 81714-59499</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="info">
                    <div className="info-title">Social Info.</div>
                    <div className="socials">
                     
                      <Link href={'https://www.instagram.com/altiedge/?hl=en'} target='_blank'>
                        <Image src={instagram} alt='instagram-icon'/>
                      </Link>
                      <Link href={'https://in.linkedin.com/company/altiedge'} target='_blank'>
                        <Image src={linkedIn} alt='linked-in-icon'/>
                      </Link>
                      <Link href={'https://wa.me/8171459499'} target='_blank' >
                        <Image src={whatsApp} alt='whatapp-icon'/>
                      </Link>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>   

            <ContactForm/>                    
            
          </div>
        </div>
      </section>
    </main>
  )
}

export default page