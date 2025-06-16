import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Slide } from '../types';
import { TemplateRenderer } from './templates';

interface SlideRendererProps {
  slide: Slide;
  isActive: boolean;
  direction?: 'forward' | 'backward';
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({ 
  slide, 
  isActive, 
  direction = 'forward' 
}) => {
  const getAnimationVariants = () => {
    const { animation, transition } = slide.metadata;
    
    switch (animation) {
      case 'slideIn':
        return {
          initial: { x: direction === 'forward' ? '100%' : '-100%', opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: direction === 'forward' ? '-100%' : '100%', opacity: 0 }
        };
      
      case 'slideUp':
        return {
          initial: { y: '100%', opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: '-100%', opacity: 0 }
        };
      
      case 'slideDown':
        return {
          initial: { y: '-100%', opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: '100%', opacity: 0 }
        };
      
      case 'slideLeft':
        return {
          initial: { x: '100%', opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '-100%', opacity: 0 }
        };
      
      case 'slideRight':
        return {
          initial: { x: '-100%', opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '100%', opacity: 0 }
        };
      
      case 'zoom':
      case 'zoomIn':
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 1.2, opacity: 0 }
        };
      
      case 'zoomOut':
        return {
          initial: { scale: 1.2, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 }
        };
      
      case 'fadeIn':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
    }
  };

  const getTransitionConfig = () => {
    const { duration, transition } = slide.metadata;
    
    const baseConfig = {
      duration: (duration || 1000) / 1000, // Convert to seconds
      ease: [0.4, 0.0, 0.2, 1], // Custom easing
    };

    switch (transition) {
      case 'slide':
        return { ...baseConfig, type: 'spring', stiffness: 100, damping: 20 };
      case 'zoom':
        return { ...baseConfig, type: 'spring', stiffness: 200, damping: 25 };
      case 'none':
        return { duration: 0 };
      case 'fade':
      default:
        return baseConfig;
    }
  };

  if (!isActive) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slide.id}
        className="absolute inset-0 w-full h-full"
        variants={getAnimationVariants()}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={getTransitionConfig()}
      >
        <TemplateRenderer slide={slide} isActive={isActive} />
      </motion.div>
    </AnimatePresence>
  );
};
