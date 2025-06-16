import html2pdf from 'html2pdf.js';
import type { Slide } from '../types';

export interface ExportOptions {
  format: 'pdf' | 'html';
  filename?: string;
  slideSize?: 'A4' | '16:9' | '4:3';
  quality?: number;
}

export class SlideExporter {
  private slides: Slide[];

  constructor(slides: Slide[]) {
    this.slides = slides;
  }

  async exportToPDF(options: ExportOptions = { format: 'pdf' }): Promise<void> {
    const { filename = 'slides', slideSize = '16:9', quality = 1 } = options;

    // Create a container for all slides
    const container = document.createElement('div');
    container.style.cssText = `
      width: 100%;
      font-family: system-ui, -apple-system, sans-serif;
    `;

    // Generate HTML for each slide
    for (let i = 0; i < this.slides.length; i++) {
      const slide = this.slides[i];
      const slideElement = await this.createSlideElement(slide, slideSize);
      
      if (i > 0) {
        slideElement.style.pageBreakBefore = 'always';
      }
      
      container.appendChild(slideElement);
    }

    // Add container to document temporarily
    document.body.appendChild(container);

    // Configure PDF options
    const pdfOptions = {
      margin: 0,
      filename: `${filename}.pdf`,
      image: { type: 'jpeg', quality: quality },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: this.getPageFormat(slideSize), 
        orientation: slideSize === '4:3' ? 'landscape' : 'landscape'
      }
    };

    try {
      await html2pdf().set(pdfOptions).from(container).save();
    } finally {
      // Clean up
      document.body.removeChild(container);
    }
  }

  async exportToHTML(options: ExportOptions = { format: 'html' }): Promise<void> {
    const { filename = 'slides' } = options;

    const htmlContent = await this.generateHTMLContent();
    
    // Create and download the HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  private async createSlideElement(slide: Slide, slideSize: string): Promise<HTMLElement> {
    const slideElement = document.createElement('div');
    const dimensions = this.getSlideDimensions(slideSize);
    
    slideElement.style.cssText = `
      width: ${dimensions.width}px;
      height: ${dimensions.height}px;
      background: white;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    `;

    // Render slide content based on template
    slideElement.innerHTML = this.renderSlideHTML(slide);
    
    return slideElement;
  }

  private renderSlideHTML(slide: Slide): string {
    const { template } = slide.metadata;
    const content = this.markdownToHTML(slide.content);
    
    const styles = `
      <style>
        .slide-content { padding: 48px; height: 100%; display: flex; flex-direction: column; justify-content: center; }
        .slide-title { font-size: 48px; font-weight: bold; margin-bottom: 32px; color: #1f2937; }
        .slide-text { font-size: 24px; line-height: 1.6; color: #374151; }
        .slide-image { max-width: 100%; max-height: 100%; object-fit: contain; }
        .two-column { display: flex; height: 100%; }
        .column { flex: 1; padding: 48px; display: flex; flex-direction: column; justify-content: center; }
        .title-slide { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; }
        .title-slide h1 { font-size: 72px; margin-bottom: 32px; }
        .title-slide h2 { font-size: 36px; font-weight: 300; opacity: 0.9; }
      </style>
    `;

    switch (template) {
      case 'title':
        return `
          ${styles}
          <div class="slide-content title-slide">
            ${content}
          </div>
        `;
      
      case 'imageLeft':
        return `
          ${styles}
          <div class="two-column">
            <div class="column" style="background: #f9fafb; align-items: center;">
              ${slide.metadata.image ? `<img src="${slide.metadata.image}" class="slide-image" alt="" />` : '<div style="background: #e5e7eb; width: 100%; height: 300px; display: flex; align-items: center; justify-content: center; color: #6b7280;">No image</div>'}
            </div>
            <div class="column">
              ${content}
            </div>
          </div>
        `;
      
      case 'imageRight':
        return `
          ${styles}
          <div class="two-column">
            <div class="column">
              ${content}
            </div>
            <div class="column" style="background: #f9fafb; align-items: center;">
              ${slide.metadata.image ? `<img src="${slide.metadata.image}" class="slide-image" alt="" />` : '<div style="background: #e5e7eb; width: 100%; height: 300px; display: flex; align-items: center; justify-content: center; color: #6b7280;">No image</div>'}
            </div>
          </div>
        `;
      
      default:
        return `
          ${styles}
          <div class="slide-content">
            ${content}
          </div>
        `;
    }
  }

  private markdownToHTML(markdown: string): string {
    // Simple markdown to HTML conversion
    return markdown
      .replace(/^# (.+)$/gm, '<h1 class="slide-title">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 style="font-size: 36px; margin-bottom: 24px; color: #1f2937;">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 style="font-size: 28px; margin-bottom: 16px; color: #1f2937;">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li style="font-size: 24px; margin-bottom: 8px; color: #374151;">$1</li>')
      .replace(/(<li.*<\/li>)/gs, '<ul style="list-style: disc; margin-left: 24px; margin-bottom: 24px;">$1</ul>')
      .replace(/\n\n/g, '</p><p class="slide-text">')
      .replace(/^(?!<[h|u|l])/gm, '<p class="slide-text">')
      .replace(/(?<!>)$/gm, '</p>');
  }

  private getSlideDimensions(slideSize: string): { width: number; height: number } {
    switch (slideSize) {
      case '16:9':
        return { width: 1920, height: 1080 };
      case '4:3':
        return { width: 1024, height: 768 };
      case 'A4':
        return { width: 794, height: 1123 }; // A4 in pixels at 96 DPI
      default:
        return { width: 1920, height: 1080 };
    }
  }

  private getPageFormat(slideSize: string): [number, number] {
    switch (slideSize) {
      case '16:9':
        return [297, 167]; // 16:9 aspect ratio in mm
      case '4:3':
        return [297, 223]; // 4:3 aspect ratio in mm
      case 'A4':
        return [210, 297]; // A4 in mm
      default:
        return [297, 167];
    }
  }

  private async generateHTMLContent(): Promise<string> {
    const slidesHTML = await Promise.all(
      this.slides.map((slide, index) => 
        `<div class="slide" id="slide-${index + 1}" style="width: 100vw; height: 100vh; display: none; ${index === 0 ? 'display: flex;' : ''}">
          ${this.renderSlideHTML(slide)}
        </div>`
      )
    );

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Slides</title>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            font-family: system-ui, -apple-system, sans-serif; 
            overflow: hidden;
        }
        .slide-container { 
            position: relative; 
            width: 100vw; 
            height: 100vh; 
        }
        .navigation {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            display: flex;
            gap: 10px;
        }
        .nav-btn {
            padding: 10px 20px;
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        .nav-btn:hover { background: rgba(0,0,0,0.9); }
        .nav-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .slide-counter {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 1000;
        }
    </style>
</head>
<body>
    <div class="slide-container">
        ${slidesHTML.join('')}
    </div>
    
    <div class="slide-counter">
        <span id="current-slide">1</span> / <span id="total-slides">${this.slides.length}</span>
    </div>
    
    <div class="navigation">
        <button class="nav-btn" onclick="previousSlide()">← Previous</button>
        <button class="nav-btn" onclick="nextSlide()">Next →</button>
    </div>

    <script>
        let currentSlide = 1;
        const totalSlides = ${this.slides.length};

        function showSlide(n) {
            const slides = document.querySelectorAll('.slide');
            slides.forEach(slide => slide.style.display = 'none');
            
            if (n > totalSlides) currentSlide = 1;
            if (n < 1) currentSlide = totalSlides;
            
            slides[currentSlide - 1].style.display = 'flex';
            document.getElementById('current-slide').textContent = currentSlide;
        }

        function nextSlide() {
            currentSlide++;
            showSlide(currentSlide);
        }

        function previousSlide() {
            currentSlide--;
            showSlide(currentSlide);
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
            if (e.key === 'ArrowLeft') previousSlide();
        });
    </script>
</body>
</html>`;
  }
}
