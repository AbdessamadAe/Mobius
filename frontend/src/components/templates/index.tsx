import React from 'react';
import type { Slide } from '../../types';
import { DefaultTemplate } from './DefaultTemplate';
import { TitleTemplate } from './TitleTemplate';
import { ImageLeftTemplate } from './ImageLeftTemplate';
import { ImageRightTemplate } from './ImageRightTemplate';

interface SlideTemplateProps {
  slide: Slide;
  isActive?: boolean;
}

export const TemplateRenderer: React.FC<SlideTemplateProps> = ({ slide, isActive }) => {
  const template = slide.metadata.template || 'default';

  switch (template) {
    case 'title':
      return <TitleTemplate slide={slide} isActive={isActive} />;
    case 'imageLeft':
      return <ImageLeftTemplate slide={slide} isActive={isActive} />;
    case 'imageRight':
      return <ImageRightTemplate slide={slide} isActive={isActive} />;
    case 'imageFull':
      return <ImageFullTemplate slide={slide} isActive={isActive} />;
    case 'quote':
      return <QuoteTemplate slide={slide} isActive={isActive} />;
    case 'center':
      return <CenterTemplate slide={slide} isActive={isActive} />;
    case 'split':
      return <SplitTemplate slide={slide} isActive={isActive} />;
    default:
      return <DefaultTemplate slide={slide} isActive={isActive} />;
  }
};

// Additional template components
const ImageFullTemplate: React.FC<SlideTemplateProps> = ({ slide }) => {
  const { image } = slide.metadata;

  return (
    <div 
      className="h-full w-full relative"
      style={{
        backgroundImage: image ? `url(${image})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: slide.metadata.background || '#f3f4f6'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="text-center text-white p-12 max-w-4xl">
          <h1 className="text-6xl font-bold mb-6">
            {slide.title || 'Slide Title'}
          </h1>
          {slide.content && (
            <p className="text-2xl font-light">
              {slide.content.replace(/^#.*$/gm, '').trim()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const QuoteTemplate: React.FC<SlideTemplateProps> = ({ slide }) => {
  return (
    <div className="h-full w-full bg-gray-900 flex items-center justify-center text-white">
      <div className="max-w-4xl text-center p-12">
        <blockquote className="text-4xl font-light italic leading-relaxed mb-8">
          "{slide.content.replace(/^[#>]\s*/gm, '').trim()}"
        </blockquote>
        {slide.title && (
          <cite className="text-xl text-gray-300">— {slide.title}</cite>
        )}
      </div>
    </div>
  );
};

const CenterTemplate: React.FC<SlideTemplateProps> = ({ slide }) => {
  return (
    <div className="h-full w-full bg-white flex items-center justify-center">
      <div className="max-w-3xl text-center p-12">
        <h1 className="text-6xl font-bold mb-8 text-gray-900">
          {slide.title || slide.content.split('\n')[0].replace(/^#\s*/, '')}
        </h1>
        <p className="text-2xl text-gray-600 leading-relaxed">
          {slide.content.split('\n').slice(1).join(' ').trim()}
        </p>
      </div>
    </div>
  );
};

const SplitTemplate: React.FC<SlideTemplateProps> = ({ slide }) => {
  const contentLines = slide.content.split('\n').filter(line => line.trim());
  const midPoint = Math.ceil(contentLines.length / 2);
  const leftContent = contentLines.slice(0, midPoint).join('\n');
  const rightContent = contentLines.slice(midPoint).join('\n');

  return (
    <div className="h-full w-full bg-white flex">
      <div className="w-1/2 h-full flex flex-col justify-center p-12 border-r border-gray-200">
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: leftContent }} />
        </div>
      </div>
      <div className="w-1/2 h-full flex flex-col justify-center p-12">
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: rightContent }} />
        </div>
      </div>
    </div>
  );
};

export { DefaultTemplate, TitleTemplate, ImageLeftTemplate, ImageRightTemplate };
