import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { Slide } from '../../types';

interface SlideTemplateProps {
  slide: Slide;
  isActive?: boolean;
}

export const ImageRightTemplate: React.FC<SlideTemplateProps> = ({ slide }) => {
  const { image } = slide.metadata;

  return (
    <div className="h-full w-full bg-white flex">
      {/* Content section */}
      <div className="w-1/2 h-full flex flex-col justify-center p-12">
        <div className="max-w-2xl">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-4xl font-bold mb-6 text-gray-900" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-3xl font-semibold mb-4 text-gray-900" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-2xl font-medium mb-3 text-gray-900" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-lg mb-4 leading-relaxed text-gray-700" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside space-y-2 mb-4 text-lg text-gray-700" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal list-inside space-y-2 mb-4 text-lg text-gray-700" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="text-lg text-gray-700" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4 text-lg" {...props} />
              ),
              code: ({ node, ...props }) => (
                <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-base font-mono" {...props} />
              ),
              pre: ({ node, ...props }) => (
                <pre className="bg-gray-100 text-gray-800 p-4 rounded-lg overflow-x-auto mb-4 text-base" {...props} />
              ),
            }}
          >
            {slide.content}
          </ReactMarkdown>
        </div>
      </div>
      
      {/* Image section */}
      <div className="w-1/2 h-full flex items-center justify-center bg-gray-50">
        {image ? (
          <img 
            src={image} 
            alt="" 
            className="max-w-full max-h-full object-contain p-8"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-lg">No image provided</span>
          </div>
        )}
      </div>
    </div>
  );
};
