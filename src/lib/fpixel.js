'use client';

export const FB_PIXEL_ID = '2165064820912037';

export const event = (name, options = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', name, options);
  }
};
