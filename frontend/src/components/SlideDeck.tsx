import React from 'react';
import ReactMarkdown from 'react-markdown';

interface SlideDeckProps {
  slides: string[];
  currentSlideIndex: number;
  onSlideSelect: (index: number) => void;
}

export const SlideDeck: React.FC<SlideDeckProps> = ({ 
  slides, 
  currentSlideIndex, 
  onSlideSelect 
}) => {
  const getSlideTitle = (slide: string, index: number) => {
    const titleMatch = slide.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      return titleMatch[1];
    }
    const subtitleMatch = slide.match(/^##\s+(.+)$/m);
    if (subtitleMatch) {
      return subtitleMatch[1];
    }
    return `Slide ${index + 1}`;
  };

  const getSlideGradient = (index: number) => {
    const gradients = [
      'from-blue-500 via-purple-500 to-pink-500',
      'from-gray-400 via-gray-500 to-gray-600',
      'from-purple-500 via-blue-500 to-indigo-500',
      'from-purple-600 via-purple-700 to-purple-800',
      'from-purple-500 via-pink-500 to-pink-600',
      'from-purple-600 via-purple-700 to-purple-800'
    ];
    return gradients[index % gradients.length];
  };

  const SlidePreview: React.FC<{ slide: string; isActive: boolean; index: number }> = ({ slide, isActive, index }) => {
    const title = getSlideTitle(slide, index);
    const gradient = getSlideGradient(index);
    
    return (
      <div className={`w-full h-24 rounded-lg overflow-hidden relative ${
        isActive 
          ? 'ring-2 ring-blue-400' 
          : ''
      }`}>
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
          {/* Content overlay */}
          <div className="absolute inset-0 bg-white bg-opacity-30">
            <div className="p-3 h-full flex flex-col justify-center">
              <div className="text-black text-sm font-bold leading-tight mb-1">
                {title.length > 25 ? title.substring(0, 25) + '...' : title}
              </div>
            </div>
          </div>  
        </div>
      </div>
    );
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Slides List */}
      <div className="flex-1 overflow-y-auto p-2">
        {slides.map((slide, index) => {
          const isActive = index === currentSlideIndex;
          
          return (
            <button
              key={index}
              onClick={() => onSlideSelect(index)}
              className={`w-full mb-3 p-3 rounded-lg text-left transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              {/* Slide number */}
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  isActive ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Slide preview with actual rendered content */}
                  <SlidePreview slide={slide} isActive={isActive} index={index} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};