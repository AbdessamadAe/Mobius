# Getting Started

## Prerequisites

Before you begin, ensure you have the following installed on your development machine:

- **Node.js** (version 16 or higher)
- **pnpm** (preferred package manager)
- **Git**

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Mobius/frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application running.

## Available Scripts

### Development
- `pnpm dev` - Starts the development server with hot reload
- `pnpm build` - Builds the application for production
- `pnpm preview` - Preview the production build locally

## Environment Setup

The application doesn't require additional environment variables for basic functionality, but you may need to configure:

- **API endpoints** for external services (Pixabay, Pexels)
- **Upload service** configurations
- **Export service** endpoints

## First Steps

1. **Choose an Editor Type**: When you first open the application, you'll see a selection screen with three options:
   - Graphic Editor
   - Presentation Editor  
   - Video Editor

2. **Explore the Interface**: Each editor provides:
   - Left sidebar with tools and assets
   - Main canvas area for editing
   - Timeline (for video editor)
   - Property panels for customization

3. **Try Basic Operations**:
   - Add text elements
   - Upload and insert images
   - Use templates
   - Export your work

## Troubleshooting

### Common Issues

**Development server won't start**
- Ensure Node.js version is 16+
- Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`
- Check if port 5173 is available

**Build failures**
- Check TypeScript errors: The project uses strict TypeScript
- Ensure all dependencies are properly installed
- Review console output for specific error messages

**Performance issues**
- The application uses PIXI.js for graphics rendering
- Ensure your browser supports WebGL
- Consider reducing canvas size for older devices

## Development Tools

### Recommended VS Code Extensions
- TypeScript Importer
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- Auto Rename Tag
- Bracket Pair Colorizer

### Browser Developer Tools
- React Developer Tools
- Redux DevTools Extension

## Next Steps

Once you have the application running:
1. Read the [Architecture](./architecture.md) documentation
2. Explore the [Components](./components/README.md) structure
3. Review the [Development Guide](./development-guide.md) for best practices
