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
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
  };

  const getTransitionConfig = () => {
    
    const baseConfig = {
      duration: (500) / 1000, // Convert to seconds
      ease: [0.2, 0.0, 0.2, 1], // Custom easing
    };
    return baseConfig;
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
