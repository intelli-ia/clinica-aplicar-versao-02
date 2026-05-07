'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const ScrollExpandMedia = ({
  id,
  mediaSrc,
  posterSrc,
  bgImageSrc,
  titleLeft,
  titleRight,
  scrollToExpand,
  children,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const getContainerTop = () => containerRef.current?.offsetTop ?? 0;

    const handleWheel = (e) => {
      const containerTop = getContainerTop();
      const atSection = window.scrollY >= containerTop - 5;

      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= containerTop + 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded && atSection) {
        e.preventDefault();
        const newProgress = Math.min(Math.max(scrollProgress + e.deltaY * 0.0009, 0), 1);
        setScrollProgress(newProgress);
        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e) => {
      if (!touchStartY) return;
      const containerTop = getContainerTop();
      const atSection = window.scrollY >= containerTop - 5;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= containerTop + 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded && atSection) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const newProgress = Math.min(Math.max(scrollProgress + deltaY * scrollFactor, 0), 1);
        setScrollProgress(newProgress);
        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = () => setTouchStartY(0);

    const handleScroll = () => {
      if (!mediaFullyExpanded && containerRef.current) {
        const containerTop = containerRef.current.offsetTop;
        if (window.scrollY > containerTop) {
          window.scrollTo({ top: containerTop, behavior: 'instant' });
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  const mediaWidth = 300 + scrollProgress * (isMobile ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobile ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobile ? 180 : 150);
  const borderRadius = 16 * (1 - scrollProgress);
  const bgOpacity = 1 - scrollProgress;
  const overlayOpacity = 0.7 - scrollProgress * 0.52;
  const hintOpacity = Math.max(0, 1 - scrollProgress * 5);

  return (
    <div id={id} ref={containerRef} className="scroll-expand-container">
      <section className="scroll-expand-section">
        <div className="scroll-expand-frame">
          {/* Background */}
          <motion.div
            className="scroll-expand-bg"
            animate={{ opacity: bgOpacity }}
            transition={{ duration: 0.1 }}
          >
            <Image
              src={bgImageSrc}
              alt="Manifesto background"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div className="scroll-expand-bg-overlay" />
          </motion.div>

          {/* Expanding media */}
          <div
            className="scroll-expand-media-wrapper"
            style={{
              width: `${mediaWidth}px`,
              height: `${mediaHeight}px`,
              maxWidth: '95vw',
              maxHeight: '85vh',
              borderRadius: `${borderRadius}px`,
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'none' }}>
              <video
                src={mediaSrc}
                poster={posterSrc}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <motion.div
                className="scroll-expand-video-overlay"
                animate={{ opacity: overlayOpacity }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>

          {/* Titles */}
          <div className="scroll-expand-titles">
            <h2
              className="scroll-expand-title"
              style={{ transform: `translateX(-${textTranslateX}vw)` }}
            >
              {titleLeft}
            </h2>
            <h2
              className="scroll-expand-title"
              style={{ transform: `translateX(${textTranslateX}vw)` }}
            >
              {titleRight}
            </h2>
            {scrollToExpand && (
              <p
                className="scroll-expand-hint"
                style={{
                  opacity: hintOpacity,
                  transform: `translateY(${scrollProgress * 20}px)`,
                }}
              >
                {scrollToExpand}
              </p>
            )}
          </div>
        </div>

        {/* Conteúdo aparece após expansão total */}
        <motion.div
          className="scroll-expand-body-wrapper"
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="scroll-expand-body">
            {children}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
