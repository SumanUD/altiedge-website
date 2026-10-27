export const dynamic = "force-static";

import React from 'react'
import { PageBanner } from '../components/PageBanner'
import { ContentSwitch } from './ContentSwitch';
import bannerImg from '../../assets/17.webp';
import { ContentPrograms } from './ContentPrograms';
import { Mentorship } from './Mentorship';

const page = () => {
  const banner = {
    bannerImg: bannerImg,
    title: 'Climb Smarter. Train Harder. Go Higher.',
    subTitle: 'Join, Learn, and Connect',
    description:"From expert-led workshops to real Himalayan expeditions, our programs are designed to build skills, strength, and spirit for every aspiring mountaineer.",
  }

  return (
    <main>
      <section>
        <div className='programs-events'>
          <PageBanner banner={banner}/>
          <div className="pageContents">
            <Mentorship/>
            <ContentPrograms/>                   
            <ContentSwitch/>
          </div>
        </div>
      </section>
    </main>
  )
}

export default page