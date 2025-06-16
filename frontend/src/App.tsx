import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { SlideDeck } from './components/SlideDeck'
import { SlidePresenter } from './components/SlidePresenter'
import { MainEditor } from './components/MainEditor'
import { parseMarkdownToSlides } from './utils/slideParser'
import type { Slide } from './types'
import { initialContent } from './assets/init'

function App() {
  const [content, setContent] = useState(initialContent)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isPresentationMode, setIsPresentationMode] = useState(false)

  // Parse markdown into slides
  const slides = parseMarkdownToSlides(content);
  const rawSlides = content.split(/^---\s*$/gm).filter(slide => slide.trim().length > 0);

  // Handle direct presentation mode
  const startPresentation = useCallback(() => {
    setIsPresentationMode(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const exitPresentation = useCallback(() => {
    setIsPresentationMode(false);
    document.body.style.overflow = '';
  }, []);

  // Keyboard navigation for presentation mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPresentationMode) return;
      
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
          }
          break;
        case 'Escape':
          e.preventDefault();
          exitPresentation();
          break;
      }
    };

    if (isPresentationMode) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }    }, [isPresentationMode, currentSlideIndex, rawSlides.length, exitPresentation]);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      // Here you would typically save to localStorage or send to server
      console.log('Auto-saving presentation...');
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [content]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  // Fullscreen presentation mode
  if (isPresentationMode) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <SlidePresenter 
          markdown={content}
          currentSlideIndex={currentSlideIndex}
          onSlideChange={setCurrentSlideIndex}
          onExit={exitPresentation}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50 text-gray-900">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-40 h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-gray-900">Slide Editor</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={startPresentation}
            className="px-3 py-1.5 text-sm rounded bg-green-600 text-white hover:bg-green-700"
            title="Start fullscreen presentation"
          >
            Present
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex w-full pt-12">
        {/* Slide Navigation Sidebar */}
        <aside className="flex-shrink-0">
          <SlideDeck 
            slides={rawSlides}
            currentSlideIndex={currentSlideIndex}
            onSlideSelect={setCurrentSlideIndex}
          />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <MainEditor 
            content={content}
            onChange={setContent}
            currentSlide={slides[currentSlideIndex]?.content || rawSlides[currentSlideIndex] || ''}
            currentSlideIndex={currentSlideIndex}
            totalSlides={slides.length}
            onSlideChange={setCurrentSlideIndex}
          />
        </main>
      </div>
    </div>
  )
}

export default App
