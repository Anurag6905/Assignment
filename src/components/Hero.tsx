import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';
import '../App.css';

type CornerKey = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface CornerImage {
  src: string;
  className: CornerKey;
  key: CornerKey;
  width: number;
  height: number;
}

const cornerImages: CornerImage[] = [
  { src: '/P1.jpg', className: 'top-left', key: 'top-left', width: 300, height: 200 },
  { src: '/P2.jpg', className: 'top-right', key: 'top-right', width: 300, height: 200 },
  { src: '/P17.jpg', className: 'bottom-left', key: 'bottom-left', width: 300, height: 200 },
  { src: '/P46.jpg', className: 'bottom-right', key: 'bottom-right', width: 300, height: 200 },
];

const FLOATS = [
  { ampX: 30, ampY: 36, speedX: 0.7, speedY: 1.1, phase: 0 },
  { ampX: 32, ampY: 38, speedX: 0.5, speedY: 0.8, phase: Math.PI / 2 },
  { ampX: 39, ampY: 32, speedX: 0.9, speedY: 0.6, phase: Math.PI },
  { ampX: 35, ampY: 35, speedX: 0.6, speedY: 0.9, phase: Math.PI / 3 },
];

function cornerPosition(key: CornerKey) {
  switch (key) {
    case 'top-left': return { top: 0, left: 0 };
    case 'top-right': return { top: 0, right: 0 };
    case 'bottom-left': return { bottom: 0, left: 0 };
    case 'bottom-right': return { bottom: 0, right: 0 };
    default: return {};
  }
}

const Hero: React.FC = () => {
  const [hoveredCorner, setHoveredCorner] = useState<CornerKey | null>(null);
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const hoveredImgRef = useRef<HTMLImageElement | null>(null);

  const floatOffsets = cornerImages.map(() => ({
    x: useMotionValue(0),
    y: useMotionValue(0),
  }));

  useAnimationFrame((t) => {
    cornerImages.forEach((_, i) => {
      const { ampX, ampY, speedX, speedY, phase } = FLOATS[i];
      floatOffsets[i].x.set(Math.sin(t * 0.001 * speedX + phase) * ampX);
      floatOffsets[i].y.set(Math.cos(t * 0.001 * speedY + phase) * ampY);
    });
  });

  // Mouse move handler for hovered image
  const handleMouseMove = (e: React.MouseEvent) => {
    const img = hoveredImgRef.current;
    if (img) {
      const rect = img.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const maxShift = 200;
      setMouseOffset({
        x: Math.max(-maxShift, Math.min(maxShift, x)),
        y: Math.max(-maxShift, Math.min(maxShift, y)),
      });
    }
  };

  // Reset offset on mouse leave
  const handleMouseLeave = () => {
    setHoveredCorner(null);
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <div className="hero-section">
      <div className="image-wrapper">
        {/* Borders for non-hovered images */}
        {hoveredCorner &&
          cornerImages.map((img, i) =>
            img.key !== hoveredCorner ? (
              <motion.div
                key={img.key + '-border'}
                className="corner-border"
                style={{
                  ...cornerPosition(img.key),
                  width: img.width,
                  height: img.height,
                  x: floatOffsets[i].x,
                  y: floatOffsets[i].y,
                  zIndex: 1,
                }}
              />
            ) : null
          )}

        {/* All images when NOT hovering */}
        {!hoveredCorner &&
          cornerImages.map((img, i) => (
            <motion.img
              key={img.key}
              src={img.src}
              alt={img.key}
              className="corner-img"
              style={{
                ...cornerPosition(img.key),
                width: img.width,
                height: img.height,
                x: floatOffsets[i].x,
                y: floatOffsets[i].y,
                zIndex: 2,
              }}
              whileHover={{
                scale: 1.08,
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              }}
              onMouseEnter={() => setHoveredCorner(img.key)}
              onMouseLeave={handleMouseLeave}
            />
          ))}

        {/* Main text image (hide when hovering any corner image) */}
        <motion.img
          src="/text.png"
          alt="Main"
          className="main-image"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            zIndex: 5,
            pointerEvents: 'none',
          }}
          animate={{ opacity: hoveredCorner ? 0 : 1 }}
          transition={{ duration: 0.4, ease: [0.4, 0.2, 0.2, 1] }}
        />

        {/* Outline image (show only when hovering any corner image) */}
        <motion.img
          src="/outline.png"
          alt="Outline"
          className="outline-image"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            zIndex: 6,
            pointerEvents: 'none',
          }}
          animate={{ opacity: hoveredCorner ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0.2, 0.2, 1] }}
        />

        {/* Only hovered image, moves with mouse and resets smoothly */}
        {cornerImages.map((img, i) =>
          hoveredCorner === img.key ? (
            <motion.img
              key={img.key}
              ref={hoveredImgRef}
              src={img.src}
              alt={img.key}
              className="corner-img behind-main"
              style={{
                ...cornerPosition(img.key),
                width: img.width,
                height: img.height,
                x: floatOffsets[i].x.get() + mouseOffset.x,
                y: floatOffsets[i].y.get() + mouseOffset.y,
                zIndex: 3,
              }}
              animate={{
                x: floatOffsets[i].x.get() + mouseOffset.x,
                y: floatOffsets[i].y.get() + mouseOffset.y,
                transition: { type: 'spring', stiffness: 300, damping: 30 },
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={() => setHoveredCorner(img.key)}
              whileHover={{
                scale: 1,
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              }}
            />
          ) : null
        )}
      </div>
    </div>
  );
};

export default Hero;
