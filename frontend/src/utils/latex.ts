// mathjax-svg.ts
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';

// 1. Initialize Adaptor and Register Handler
const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

// 2. Configure TeX Input
const tex = new TeX({
  packages: AllPackages.concat(['ams', 'color', 'mathtools']),
  inlineMath: [['$', '$'], ['\\(', '\\)']],
  displayMath: [['$$', '$$'], ['\\[', '\\]']],
  processEscapes: true
});

// 3. Configure SVG Output
const svg = new SVG({
  fontCache: 'none', // Important for morphing - prevents global defs
  internalSpeechTitles: true // Accessibility
});

// 4. Create Document
const html = mathjax.document('', {
  InputJax: tex,
  OutputJax: svg
});

/**
 * Renders LaTeX to SVG DOM Element
 * @param latex - LaTeX string to render
 * @param displayMode - Whether to render in display mode
 * @returns SVGElement ready for manipulation
 */
export function renderLatexToSVG(latex: string, displayMode = true): SVGSVGElement {
  try {
    // Convert LaTeX to SVG node
    const node = html.convert(latex, {
      display: displayMode,
      em: 16,
      ex: 8,
      containerWidth: 800
    });

    // Get SVG string and parse to DOM
    const svgString = adaptor.innerHTML(node);
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');

    if (!svgElement) throw new Error('SVG rendering failed');

    // Clean up for morphing
    svgElement.removeAttribute('style');
    svgElement.setAttribute('aria-hidden', 'true');
    console.log('LaTeX rendered successfully:', svgElement);
    // Clone to ensure proper DOM ownership
    return document.importNode(svgElement, true) as SVGSVGElement;
  } catch (error) {
    console.error('LaTeX rendering error:', error);
    return createFallbackSVG(latex);
  }
}

function createFallbackSVG(latex: string): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '300');
  svg.setAttribute('height', '60');
  svg.setAttribute('viewBox', '0 0 300 60');
  
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', '10');
  text.setAttribute('y', '30');
  text.setAttribute('font-family', 'Arial');
  text.setAttribute('font-size', '16');
  text.textContent = latex;
  
  svg.appendChild(text);
  return svg;
}


/**
 * Converts SVG element to data URL for use as image src
 * @param svgElement - SVG element to convert
 * @returns Data URL string
 */
export function svgToDataURL(svgElement: SVGSVGElement): string {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const base64 = btoa(unescape(encodeURIComponent(svgData)));
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Renders LaTeX to SVG data URL for use as image src
 * @param latex - LaTeX string to render
 * @param displayMode - Whether to render in display mode
 * @returns Data URL string ready for use as image src
 */
export function renderLatexToDataURL(latex: string, displayMode = true): string {
  const svgElement = renderLatexToSVG(latex, displayMode);
  return svgToDataURL(svgElement);
}

/**
 * Validates LaTeX syntax
 * @param latex - LaTeX string to validate
 * @returns Promise that resolves to true if valid, false otherwise
 */
export async function validateLatex(latex: string): Promise<boolean> {
  try {
    renderLatexToSVG(latex);
    return true;
  } catch (error) {
    console.error("LaTeX validation error:", error);
    return false;
  }
}

/**
 * Common mathematical symbols and their LaTeX representations
 */
export const MATH_SYMBOLS = {
  // Greek letters
  alpha: "\\alpha",
  beta: "\\beta",
  gamma: "\\gamma",
  delta: "\\delta",
  epsilon: "\\epsilon",
  pi: "\\pi",
  sigma: "\\sigma",
  theta: "\\theta",
  omega: "\\omega",
  
  // Operators
  sum: "\\sum",
  integral: "\\int",
  limit: "\\lim",
  derivative: "\\frac{d}{dx}",
  partial: "\\partial",
  
  // Relations
  equals: "=",
  notEquals: "\\neq",
  lessThan: "<",
  greaterThan: ">",
  lessEqual: "\\leq",
  greaterEqual: "\\geq",
  approximately: "\\approx",
  
  // Set theory
  element: "\\in",
  notElement: "\\notin",
  subset: "\\subset",
  union: "\\cup",
  intersection: "\\cap",
  
  // Logic
  and: "\\land",
  or: "\\lor",
  not: "\\neg",
  implies: "\\implies",
  iff: "\\iff",
  
  // Arrows
  rightArrow: "\\rightarrow",
  leftArrow: "\\leftarrow",
  biArrow: "\\leftrightarrow",
  
  // Other
  infinity: "\\infty",
  emptySet: "\\emptyset",
  nabla: "\\nabla",
  squareRoot: "\\sqrt{}",
  fraction: "\\frac{}{}",
  binomial: "\\binom{}{}"
};