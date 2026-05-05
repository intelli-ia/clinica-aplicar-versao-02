'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

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
  const sectionRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const getSectionTop = () => sectionRef.current?.offsetTop ?? 0;

    const handleWheel = (e) => {
      const sectionTop = getSectionTop();
      if (window.scrollY < sectionTop - 10) return;

      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= sectionTop + 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        // Libera scroll para cima quando já está completamente contraído
        if (e.deltaY < 0 && scrollProgress <= 0) return;
        e.preventDefault();
        // 0.0006 = expansão mais lenta e suave
        const newProgress = Math.min(Math.max(scrollProgress + e.deltaY * 0.0006, 0), 1);
        setScrollProgress(newProgress);
        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const sectionTop = getSectionTop();

      // Trava o scroll apenas dentro da zona de expansão (máx. 1 viewport abaixo da seção)
      // — evita travar o scroll quando o browser restaura posição após reload
      if (
        !mediaFullyExpanded &&
        window.scrollY > sectionTop &&
        window.scrollY < sectionTop + window.innerHeight
      ) {
        window.scrollTo(0, sectionTop);
        return;
      }

      // Reseta o efeito quando o usuário volta acima da seção
      if (window.scrollY < sectionTop && (mediaFullyExpanded || scrollProgress > 0)) {
        setScrollProgress(0);
        setMediaFullyExpanded(false);
        setShowContent(false);
      }
    };

    const handleTouchStart = (e) => setTouchStartY(e.touches[0].clientY);

    const handleTouchMove = (e) => {
      if (!touchStartY) return;
      const sectionTop = getSectionTop();
      if (window.scrollY < sectionTop - 10) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= sectionTop + 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        // Libera swipe para cima quando já está completamente contraído
        if (deltaY < 0 && scrollProgress <= 0) return;
        e.preventDefault();
        const factor = deltaY < 0 ? 0.006 : 0.004;
        const newProgress = Math.min(Math.max(scrollProgress + deltaY * factor, 0), 1);
        setScrollProgress(newProgress);
        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
        setTouchStartY(e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => setTouchStartY(0);

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
  const textShift = scrollProgress * (isMobile ? 180 : 150);
  // overlay escurece mais no início e clareia conforme o vídeo expande
  const overlayOpacity = Math.max(0.18, 0.72 - scrollProgress * 0.54);

  return (
    <div id={id} ref={sectionRef} style={{ overflowX: 'hidden' }}>
      <section className="scroll-expand-section">
        {/* Background image */}
        <motion.div
          className="scroll-expand-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 - scrollProgress }}
          transition={{ duration: 0.1 }}
        >
          <Image
            src={bgImageSrc}
            alt="Manifesto background"
            width={1920}
            height={1080}
            style={{ width: '100vw', height: '100vh', objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
          <div className="scroll-expand-bg-overlay" />
        </motion.div>

        {/* Content */}
        <div className="scroll-expand-content">
          {/* Viewport-height frame */}
          <div className="scroll-expand-frame">
            {/* Expanding video */}
            <div
              className="scroll-expand-media-wrapper"
              style={{
                width: `${mediaWidth}px`,
                height: `${mediaHeight}px`,
                maxWidth: '95vw',
                maxHeight: '85vh',
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
                {/* Overlay escurecido para contraste — clareia à medida que expande */}
                <motion.div
                  className="scroll-expand-video-overlay"
                  animate={{ opacity: overlayOpacity }}
                  transition={{ duration: 0.15 }}
                />
              </div>
            </div>

            {/* Título */}
            <div className="scroll-expand-titles">
              <h2
                className="scroll-expand-title"
                style={{ transform: `translateX(-${textShift}vw)` }}
              >
                {titleLeft}
              </h2>
              <h2
                className="scroll-expand-title"
                style={{ transform: `translateX(${textShift}vw)` }}
              >
                {titleRight}
              </h2>
              {scrollToExpand && (
                <p
                  className="scroll-expand-hint"
                  style={{ transform: `translateX(${textShift}vw)` }}
                >
                  {scrollToExpand}
                </p>
              )}
            </div>
          </div>

          {/* Manifesto body — só entra no DOM após expansão total (evita espaço em branco) */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                key="manifesto-body"
                className="scroll-expand-body"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
