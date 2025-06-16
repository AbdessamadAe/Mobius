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
        template: parsedContent.data.template || 'default',
        animation: parsedContent.data.animation || 'fadeIn',
        duration: parsedContent.data.duration || 1000,
        background: parsedContent.data.background,
        image: parsedContent.data.image,
        layout: parsedContent.data.layout || 'default',
        transition: parsedContent.data.transition || 'fade',
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
    template: frontmatter.template || 'default',
    animation: frontmatter.animation || 'fadeIn',
    duration: frontmatter.duration || 1000,
    background: frontmatter.background,
    image: frontmatter.image,
    layout: frontmatter.layout || 'default',
    transition: frontmatter.transition || 'fade',
  };
}

export function validateSlideTemplate(template: string): boolean {
  const validTemplates = ['default', 'title', 'imageLeft', 'imageRight', 'imageFull', 'split', 'quote', 'center'];
  return validTemplates.includes(template);
}

export function validateAnimation(animation: string): boolean {
  const validAnimations = ['fadeIn', 'slideIn', 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'zoom', 'zoomIn', 'zoomOut', 'none'];
  return validAnimations.includes(animation);
}
