import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { Slide } from '../../types';

interface SlideTemplateProps {
  slide: Slide;
  isActive?: boolean;
}

export const DefaultTemplate: React.FC<SlideTemplateProps> = ({ slide }) => {
  return (
    <div className="h-full w-full bg-white flex flex-col justify-center items-center p-12">
      <div className="max-w-4xl w-full">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-5xl font-bold mb-8 text-gray-900 text-center" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-4xl font-semibold mb-6 text-gray-900" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-3xl font-medium mb-4 text-gray-900" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="text-xl mb-6 leading-relaxed text-gray-700" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside space-y-3 mb-6 text-xl text-gray-700" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal list-inside space-y-3 mb-6 text-xl text-gray-700" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="text-xl text-gray-700" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-blue-500 pl-6 italic text-gray-600 my-6 text-xl" {...props} />
            ),
            code: ({ node, ...props }) => (
              <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-lg font-mono" {...props} />
            ),
            pre: ({ node, ...props }) => (
              <pre className="bg-gray-100 text-gray-800 p-6 rounded-lg overflow-x-auto mb-6 text-lg" {...props} />
            ),
          }}
        >
          {slide.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};
