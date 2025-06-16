export interface Slide {
  id: string;
  title?: string;
  content: string; // Markdown content
  metadata: SlideMetadata;
  rawContent: string; // Original markdown with frontmatter
}

export interface SlideMetadata {
  template?: SlideTemplate;
  animation?: AnimationType;
  duration?: number;
  background?: string;
  image?: string;
  layout?: 'default' | 'imageLeft' | 'imageRight' | 'imageFull' | 'split';
  transition?: 'fade' | 'slide' | 'zoom' | 'none';
}

export interface Animation {
  id: string;
  type: AnimationType;
  target: string; // CSS selector or element reference
  duration: number;
  delay?: number;
  easing?: string;
  properties: AnimationProperties;
}

export type AnimationType = 
  | 'fadeIn' 
  | 'slideIn' 
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'zoom' 
  | 'zoomIn'
  | 'zoomOut'
  | 'none';

export interface AnimationProperties {
  from?: any;
  to?: any;
  path?: string; // SVG path for drawing animations
  steps?: number; // For step-by-step equation reveals
  [key: string]: any;
}

export type SlideTemplate = 
  | 'default' 
  | 'title' 
  | 'imageLeft' 
  | 'imageRight'
  | 'imageFull'
  | 'split' 
  | 'quote'
  | 'center';

export interface Presentation {
  id: string;
  title: string;
  author: string;
  slides: Slide[];
  theme: string;
  createdAt: Date;
  updatedAt: Date;
}
