import matter from 'gray-matter';
import type { Slide, SlideMetadata } from '../types';

export function parseMarkdownToSlides(markdown: string): Slide[] {
  // Split by slide separator (---)
  const slideContents = markdown.split(/^---\s*$/gm).filter(content => content.trim().length > 0);
  
  return slideContents.map((slideContent, index) => {
    const trimmedContent = slideContent.trim();
    
    // Parse frontmatter if it exists
    let parsedContent;
    let metadata: SlideMetadata = {};
    
    try {
      parsedContent = matter(trimmedContent);
      metadata = {
        background: parsedContent.data.background,
        image: parsedContent.data.image,
        layout: parsedContent.data.layout || 'default',
      };
    } catch (error) {
      // If no frontmatter, use the content as-is
      parsedContent = { content: trimmedContent, data: {} };
    }

    // Extract title from content (first heading)
    const titleMatch = parsedContent.content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : undefined;

    return {
      id: `slide-${index + 1}`,
      title,
      content: parsedContent.content,
      metadata,
      rawContent: trimmedContent,
    };
  });
}

export function extractSlideMetadata(frontmatter: Record<string, any>): SlideMetadata {
  return {
    background: frontmatter.background,
    image: frontmatter.image,
    layout: frontmatter.layout || 'default',
  };
}

export function validateSlideTemplate(template: string): boolean {
  const validTemplates = ['default'];
  return validTemplates.includes(template);
}