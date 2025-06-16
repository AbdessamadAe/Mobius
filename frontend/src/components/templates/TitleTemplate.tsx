import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { Slide } from '../../types';

interface SlideTemplateProps {
  slide: Slide;
  isActive?: boolean;
}

export const TitleTemplate: React.FC<SlideTemplateProps> = ({ slide }) => {
  // Extract title and subtitle from content
  const lines = slide.content.split('\n').filter(line => line.trim());
  const titleLine = lines.find(line => line.startsWith('# '));
  const subtitleLine = lines.find(line => line.startsWith('## '));
  const remainingContent = lines
    .filter(line => !line.startsWith('# ') && !line.startsWith('## '))
    .join('\n');

  const title = titleLine?.replace('# ', '') || slide.title || '';
  const subtitle = subtitleLine?.replace('## ', '') || '';

  return (
    <div 
      className="h-full w-full flex flex-col justify-center items-center text-center p-12"
      style={{ 
        background: slide.metadata.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      }}
    >
      <div className="max-w-4xl w-full text-white">
        {title && (
          <h1 className="text-7xl font-bold mb-8 leading-tight">
            {title}
          </h1>
        )}
        {subtitle && (
          <h2 className="text-3xl font-light mb-12 opacity-90">
            {subtitle}
          </h2>
        )}
        {remainingContent && (
          <div className="text-xl opacity-80">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                p: ({ node, ...props }) => (
                  <p className="mb-4" {...props} />
                ),
              }}
            >
              {remainingContent}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};
