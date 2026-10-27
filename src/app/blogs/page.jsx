export const dynamic = "force-static";
import React from 'react'
import { PageBanner } from '../components/PageBanner';

import bannerImg from '../../assets/13.webp';
import { ContentBlog } from './ContentBlog';
const page = () => {

  const banner = {
    bannerImg: bannerImg,
    title: 'Our Blogs',
    subTitle: 'Insights, Stories & Tips from the Mountains',
    description: "Explore inspiring stories, expert tips, and the latest updates from the world of mountaineering. Stay informed and motivated with articles crafted to fuel your climbing journey."
  }

  return (
    <main>
      <section>
        <div className="blog-page">
          <PageBanner banner={banner}/>
          <div className="pageContents">
            <ContentBlog/>
          </div>
        </div>
      </section>
    </main>
  )
}

export default page