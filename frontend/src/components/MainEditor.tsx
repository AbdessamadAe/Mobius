import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { MDXEditor, headingsPlugin, quotePlugin, listsPlugin, linkPlugin, imagePlugin, tablePlugin, thematicBreakPlugin, frontmatterPlugin, codeBlockPlugin, codeMirrorPlugin, diffSourcePlugin, toolbarPlugin, UndoRedo, BoldItalicUnderlineToggles, CodeToggle, CreateLink, InsertImage, InsertTable, InsertThematicBreak, ListsToggle, BlockTypeSelect } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import './mdx-editor-theme.css';
import 'katex/dist/katex.min.css';

interface MainEditorProps {
  content: string;
  onChange: (content: string) => void;
  currentSlide: string;
  currentSlideIndex: number;
  totalSlides: number;
  onSlideChange: (index: number) => void;
}

export const MainEditor: React.FC<MainEditorProps> = ({ 
  content, 
  onChange, 
  currentSlide,
  currentSlideIndex,
  totalSlides,
  onSlideChange
}) => {
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('preview');

  // Split content into slides for editing
  const slides = content.split(/^---\s*$/gm).filter(slide => slide.trim().length > 0);

  // Handle slide content change in edit mode
  const handleSlideChange = (newSlideContent: string) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex] = newSlideContent;
    const newContent = updatedSlides.join('\n\n---\n\n');
    onChange(newContent);
  };

  const nextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      onSlideChange(currentSlideIndex + 1);
    }
  };

  const previousSlide = () => {
    if (currentSlideIndex > 0) {
      onSlideChange(currentSlideIndex - 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50">
      {/* Top toolbar with macOS-style window controls */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
        </div>
        
        {/* Center title */}
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-900 font-medium">slides</div>
          <div className="text-sm text-gray-500">— Edited</div>
        </div>
        
        {/* Right controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
            className="px-3 py-1 text-sm rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            {viewMode === 'edit' ? 'Preview' : 'Edit'}
          </button>
        </div>
      </div>
      <div className="flex-1 flex">
        {viewMode === 'edit' ? (
          <div className="flex-1 bg-white mdx-editor-container" data-color-mode="light">
            {/* Slide indicator in edit mode */}
            <div className="h-10 border-b border-gray-200 bg-gray-50 flex items-center justify-between px-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Editing slide {currentSlideIndex + 1} of {totalSlides}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={previousSlide}
                  disabled={currentSlideIndex === 0}
                  className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                <button
                  onClick={nextSlide}
                  disabled={currentSlideIndex === totalSlides - 1}
                  className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
            </div>
            <MDXEditor
              key={currentSlideIndex} // Force re-render when slide changes
              markdown={currentSlide.trim()}
              onChange={(value) => handleSlideChange(value || '')}
              plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                linkPlugin(),
                imagePlugin(),
                tablePlugin(),
                codeBlockPlugin(),
                codeMirrorPlugin(),
                diffSourcePlugin(),
                frontmatterPlugin(),
                toolbarPlugin({
                  toolbarContents: () => (
                    <>
                      <UndoRedo />
                      <BoldItalicUnderlineToggles />
                      <CodeToggle />
                      <CreateLink />
                      <InsertImage />
                      <InsertTable />
                      <InsertThematicBreak />
                      <ListsToggle />
                      <BlockTypeSelect />
                    </>
                  )
                })
              ]}
              contentEditableClassName="prose max-w-none mdx-editor-content"
              className="mdx-editor light-theme"
              style={{
                height: 'calc(100% - 40px)', // Account for slide indicator
              }}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Content area with slide navigation */}
            <div className="flex-1 bg-white overflow-auto">
              {/* Slide indicator */}
              <div className=" border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={previousSlide}
                      disabled={currentSlideIndex === 0}
                      className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextSlide}
                      disabled={currentSlideIndex === totalSlides - 1}
                      className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Main content */}
              <div className="p-8 max-w-4xl mx-auto">
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      h1: ({node, ...props}) => (
                        <h1 className="text-4xl font-bold mb-6 text-gray-900 leading-tight" {...props} />
                      ),
                      h2: ({node, ...props}) => (
                        <h2 className="text-3xl font-semibold mb-4 text-gray-900 leading-tight" {...props} />
                      ),
                      h3: ({node, ...props}) => (
                        <h3 className="text-2xl font-medium mb-3 text-gray-900 leading-tight" {...props} />
                      ),
                      p: ({node, ...props}) => (
                        <p className="text-lg mb-4 leading-relaxed text-gray-700" {...props} />
                      ),
                      em: ({node, ...props}) => (
                        <em className="text-gray-600 italic" {...props} />
                      ),
                      strong: ({node, ...props}) => (
                        <strong className="font-bold text-gray-900" {...props} />
                      ),
                      ul: ({node, ...props}) => (
                        <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700" {...props} />
                      ),
                      ol: ({node, ...props}) => (
                        <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700" {...props} />
                      ),
                      li: ({node, ...props}) => (
                        <li className="text-lg text-gray-700" {...props} />
                      ),
                      blockquote: ({node, ...props}) => (
                        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4" {...props} />
                      ),
                      code: ({node, ...props}) => (
                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono" {...props} />
                      ),
                      pre: ({node, ...props}) => (
                        <pre className="bg-gray-100 text-gray-800 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
                      ),
                    }}
                  >
                    {currentSlide}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
