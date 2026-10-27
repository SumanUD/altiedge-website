export const dynamic = "force-static";

import React from 'react';
import { PageBanner } from '../components/PageBanner';
import { Test } from './Test';

import bannerImg from '../../assets/12.webp';
import { WriteUps } from './WriteUps';

const page = () => {

  const banner = {
    bannerImg: bannerImg,
    title:'Are You Ready for High Altitude Climbing?',
    subTitle: 'Start Your journey',
    description: "Take our expert-designed readiness test to evaluate your fitness, know your essential biomarkers and see where you stand when compared to world’s best mountaineers."
  }

  return (
    <main>
      <section>
        <div className="readinessPage">
          <PageBanner banner={banner}/>
          <div className="pageContents art-pc">            
          <WriteUps/>                                 
          </div>
          <div className='pageContents'>
            <Test/>
          </div>
        </div>
      </section>
    </main>
  )
}

export default page