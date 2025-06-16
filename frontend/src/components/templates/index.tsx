import React from 'react';
import type { Slide } from '../../types';
import { DefaultTemplate } from './DefaultTemplate';

interface SlideTemplateProps {
  slide: Slide;
  isActive?: boolean;
}

export const TemplateRenderer: React.FC<SlideTemplateProps> = ({ slide, isActive }) => {
  return <DefaultTemplate slide={slide} isActive={isActive} />;
};

export { DefaultTemplate };
