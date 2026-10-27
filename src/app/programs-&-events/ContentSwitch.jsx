'use client';
import React, { useState } from 'react';
import { ContentEvents } from './ContentEvents';

export const ContentSwitch = () => {  
  const [activeContent, setActiveContent] = useState('events')
  const [fadeKey, setFadeKey] = useState(0); // for triggering animation

  const handleActive = (content) => {
    if (content !== activeContent) {
      setActiveContent(content);
      setFadeKey(prev => prev + 1); // change key to restart animation
    }
  };

  return (
    <div className="contentSwitch">
      <div className="switch-buttons">        
        <div className={`btn-primary ${activeContent == 'events' ? 'active' : ''}`} onClick={()=>handleActive('events')}>Upcoming Programs</div>
        <div className={`btn-primary ${activeContent == 'blogs' ? 'active' : ''}`} onClick={()=>handleActive('blogs')}>All Programs</div>
      </div>
      
      <div className="main-contents fade" key={fadeKey}>
        {/* {activeContent === 'events' ? <ContentEvents /> :  ''} */}
        <ContentEvents />
      </div>
      
    </div>
  )
}
