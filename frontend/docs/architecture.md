# Architecture

## Overview

Mobius follows a modular, component-based architecture built on React with TypeScript. The application uses a combination of React Context, Redux Toolkit, and custom hooks to manage state and provide a scalable, maintainable codebase.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                   │
│  ┌─────────────────┐ ┌─────────────────┐ ┌────────────┐ │
│  │ Graphic Editor  │ │Presentation Ed. │ │Video Editor│ │
│  └─────────────────┘ └─────────────────┘ └────────────┘ │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                    Component Layer                      │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────────┐  │
│  │  UI Components │ │  Editor Comp.│ │  Shared Comp.  │  │
│  └──────────────┘ └──────────────┘ └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                     Logic Layer                         │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────────┐  │
│  │Custom Hooks  │ │   Contexts   │ │   Redux Store   │  │
│  └──────────────┘ └──────────────┘ └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                     Service Layer                       │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────────┐  │
│  │   API Client │ │External APIs │ │   Utilities     │  │
│  └──────────────┘ └──────────────┘ └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                     Data Layer                          │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────────┐  │
│  │   Constants  │ │  Interfaces  │ │  Translations   │  │
│  └──────────────┘ └──────────────┘ └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Core Architectural Patterns

### 1. Provider Pattern
The application uses React Context providers to manage global state and provide dependencies to components:

```typescript
// Provider.tsx
<Provider>
  <AppContextProvider>
    <DesignEditorProvider>
      <Container>
        <Router />
      </Container>
    </DesignEditorProvider>
  </AppContextProvider>
</Provider>
```

### 2. Hook-Based Logic Separation
Business logic is extracted into custom hooks for reusability and testability:

- `useDesignEditorContext()` - Design editor state management
- `useEditorType()` - Current editor type logic
- `useIsMobile()` - Responsive behavior
- `useOnClickOutside()` - UI interaction patterns

### 3. Component Composition
Components are built using composition patterns with clear separation of concerns:

```typescript
// DesignEditor.tsx
function DesignEditor() {
  const editorType = useEditorType()
  
  return (
    <>
      {displayPreview && <Preview />}
      {
        {
          NONE: <SelectEditor />,
          PRESENTATION: <PresentationEditor />,
          VIDEO: <VideoEditor />,
          GRAPHIC: <GraphicEditor />,
        }[editorType]
      }
    </>
  )
}
```

### 4. Service Layer Abstraction
External API calls and business logic are abstracted into service modules:

```typescript
// services/pixabay.ts
export class PixabayService {
  static async searchImages(query: string) {
    // API implementation
  }
}
```

## State Management Strategy

### React Context
Used for:
- Global application state (theme, user preferences)
- Design editor state (current selection, canvas state)
- UI state (sidebar open/closed, modal visibility)

### Redux Toolkit
Used for:
- Complex state that needs time-travel debugging
- State that needs to be shared across many components
- Cache management for API responses

### Local Component State
Used for:
- UI-specific state (form inputs, loading states)
- Temporary state that doesn't need to be shared

## Editor Architecture

### Multi-Modal Design
The application supports three editor types with shared and specific functionality:

```typescript
interface EditorConfig {
  type: 'GRAPHIC' | 'PRESENTATION' | 'VIDEO'
  panels: PanelItem[]
  tools: ToolItem[]
  exportOptions: ExportOption[]
}
```

### Canvas Management
Each editor uses a canvas-based approach:
- **PIXI.js** for graphics rendering
- **Layered object system** for element management
- **Transform controls** for object manipulation

### Timeline System (Video Editor)
The video editor includes a timeline-based editing system:
- Frame-based editing
- Multiple track support
- Audio/video synchronization

## Rendering Strategy

### Graphics Rendering
- Uses **PIXI.js** for hardware-accelerated 2D graphics
- WebGL fallback for better performance
- Optimized for real-time editing

### UI Rendering
- **BaseUI** components for consistent design system
- **Styletron** for runtime CSS-in-JS
- Responsive design with mobile-first approach

## Performance Considerations

### Code Splitting
```typescript
// Lazy loading for editor components
const GraphicEditor = lazy(() => import('./GraphicEditor'))
const VideoEditor = lazy(() => import('./VideoEditor'))
```

### Memoization
- React.memo for component optimization
- useMemo/useCallback for expensive computations
- Virtual scrolling for large lists

### Asset Management
- Lazy loading for images and media
- Progressive image loading
- Efficient caching strategies

## Security Architecture

### Input Validation
- TypeScript interfaces for compile-time type checking
- Runtime validation for user inputs
- Sanitization of file uploads

### API Security
- CORS configuration for external API calls
- Rate limiting considerations
- Secure token management

## Extensibility

### Plugin Architecture
The system is designed to support plugins:

```typescript
interface EditorPlugin {
  name: string
  type: 'panel' | 'tool' | 'export'
  component: React.ComponentType
  config: PluginConfig
}
```

### Theme System
Customizable theming through CSS variables and Styletron:

```typescript
const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    // ...
  },
  fonts: {
    // ...
  }
}
```

## Error Handling Strategy

### Error Boundaries
React Error Boundaries for graceful error handling:

```typescript
class EditorErrorBoundary extends Component {
  // Error boundary implementation
}
```

### API Error Handling
Consistent error handling across API calls:

```typescript
try {
  const result = await apiCall()
  return result
} catch (error) {
  handleError(error)
}
```

## Testing Strategy

### Unit Testing
- Component testing with React Testing Library
- Hook testing with testing utilities
- Service layer testing

### Integration Testing
- Editor workflow testing
- API integration testing
- Cross-browser compatibility testing

## Deployment Architecture

### Build Process
- Vite for fast development and optimized production builds
- TypeScript compilation
- Asset optimization and minification

### Environment Configuration
- Environment-specific configurations
- Feature flags for gradual rollouts
- Performance monitoring integration
