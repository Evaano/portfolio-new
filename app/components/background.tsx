'use client';

import './background.css';

export const Background = () => {
  return (
    <div className="fixed inset-0 -z-50">
      <div id="stars" className="absolute inset-0" />
      <div id="stars2" className="absolute inset-0" />
    </div>
  );
};
