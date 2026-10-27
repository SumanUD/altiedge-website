import React from 'react';
import Image from 'next/image';

import whatsApp from '../assets/icons/whatsapp.webp'
import Link from 'next/link';

export const WhatsApp = () => {
  return (
    <Link href={'https://wa.me/8171459499'}  target='_blank'>
      <div className="whatsAppIcon">
        <Image src={whatsApp} alt="what-app-icon" loading="lazy"/>
        <p>Connect with us in<br/> WhatsApp</p>
      </div>
    </Link>
    
  )
}
