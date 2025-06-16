import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseMarkdownToSlides } from '../utils/slideParser';
import { SlideRenderer } from './SlideRenderer';
import type { Slide } from '../types';

interface SlidePresenterProps {
  markdown: string;
  className?: string;
  currentSlideIndex?: number;
  onSlideChange?: (index: number) => void;
  onExit?: () => void;
}

export const SlidePresenter: React.FC<SlidePresenterProps> = ({ 
  markdown, 
  className = '',
  currentSlideIndex: externalSlideIndex,
  onSlideChange,
  onExit
}) => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(externalSlideIndex || 0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isFullscreen, setIsFullscreen] = useState(true); // Start in fullscreen when used for direct presentation

  // Sync with external slide index
  useEffect(() => {
    if (externalSlideIndex !== undefined && externalSlideIndex !== currentSlideIndex) {
      setCurrentSlideIndex(externalSlideIndex);
    }
  }, [externalSlideIndex]);

  // Parse markdown into slides whenever markdown changes
  useEffect(() => {
    if (markdown.trim()) {
      const parsedSlides = parseMarkdownToSlides(markdown);
      setSlides(parsedSlides);
      if (currentSlideIndex >= parsedSlides.length) {
        setCurrentSlideIndex(Math.max(0, parsedSlides.length - 1));
      }
    }
  }, [markdown, currentSlideIndex]);

  // Navigation functions
  const nextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      setDirection('forward');
      const newIndex = currentSlideIndex + 1;
      setCurrentSlideIndex(newIndex);
      onSlideChange?.(newIndex);
    }
  }, [currentSlideIndex, slides.length, onSlideChange]);

  const previousSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setDirection('backward');
      const newIndex = currentSlideIndex - 1;
      setCurrentSlideIndex(newIndex);
      onSlideChange?.(newIndex);
    }
  }, [currentSlideIndex, onSlideChange]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setDirection(index > currentSlideIndex ? 'forward' : 'backward');
      setCurrentSlideIndex(index);
      onSlideChange?.(index);
    }
  }, [currentSlideIndex, slides.length, onSlideChange]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          previousSlide();
          break;
        case 'Escape':
          e.preventDefault();
          if (onExit) {
            onExit();
          } else {
            setIsFullscreen(false);
          }
          break;
        case 'f':
        case 'F11':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFullscreen, nextSlide, previousSlide]);

  // Fullscreen functionality
  const toggleFullscreen = useCallback(() => {
    if (onExit && isFullscreen) {
      onExit();
    } else {
      if (!isFullscreen) {
        setIsFullscreen(true);
        document.body.style.overflow = 'hidden';
      } else {
        setIsFullscreen(false);
        document.body.style.overflow = '';
      }
    }
  }, [isFullscreen, onExit]);

  if (slides.length === 0) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">No slides to display</p>
          <p className="text-sm">Add some content and separate slides with "---"</p>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentSlideIndex];

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        {/* Slide content */}
        <div className="relative w-full h-full">
          <SlideRenderer 
            slide={currentSlide} 
            isActive={true}
            direction={direction}
          />
        </div>
        
        {/* Navigation controls */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black bg-opacity-50 rounded-lg px-6 py-3">
          <button
            onClick={previousSlide}
            disabled={currentSlideIndex === 0}
            className="text-white hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed p-2"
            title="Previous slide (←)"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <span className="text-white text-sm font-medium">
            {currentSlideIndex + 1} / {slides.length}
          </span>
          
          <button
            onClick={nextSlide}
            disabled={currentSlideIndex === slides.length - 1}
            className="text-white hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed p-2"
            title="Next slide (→ or Space)"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Exit fullscreen */}
        <button
          onClick={onExit ? onExit : () => setIsFullscreen(false)}
          className="absolute top-6 right-6 text-white hover:text-gray-300 p-2"
          title="Exit fullscreen (Esc)"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Slide Preview</h3>
          <span className="text-sm text-gray-500">
            {currentSlideIndex + 1} of {slides.length}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Fullscreen button */}
          <button
            onClick={toggleFullscreen}
            className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            title="Fullscreen presentation (F)"
          >
            Present
          </button>
        </div>
      </div>
      
      {/* Slide preview */}
      <div className="relative bg-gray-100" style={{ aspectRatio: '16/9', minHeight: '400px' }}>
        <div className="absolute inset-0">
          <SlideRenderer 
            slide={currentSlide} 
            isActive={true}
            direction={direction}
          />
        </div>
      </div>
      
      {/* Navigation */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={previousSlide}
          disabled={currentSlideIndex === 0}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>
        
        {/* Slide thumbnails/dots */}
        <div className="flex items-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlideIndex ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              title={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          disabled={currentSlideIndex === slides.length - 1}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Next</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
