# Project Structure

## Overview

The frontend follows a modular React application structure with clear separation of concerns.

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── constants/         # Application constants and configuration
│   ├── contexts/          # React contexts for state management
│   ├── hooks/             # Custom React hooks
│   ├── interfaces/        # TypeScript interface definitions
│   ├── services/          # API services and external integrations
│   ├── store/             # Redux store configuration
│   ├── styles/            # Global styles
│   ├── translations/      # Internationalization files
│   ├── utils/             # Utility functions and helpers
│   ├── views/             # Main application views/pages
│   ├── main.tsx          # Application entry point
│   ├── Router.tsx        # Route configuration
│   ├── Provider.tsx      # Global providers wrapper
│   └── Container.tsx     # Main layout container
├── docs/                  # Documentation
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite build configuration
└── README.md             # Project overview
```

## Directory Details

### `/src/components/`
Contains reusable UI components organized by functionality:

- **`Dropzone/`** - File upload and drag-drop functionality
- **`Icons/`** - SVG icon components (80+ icons)
- **`Loading/`** - Loading states and spinners
- **`ManimExport/`** - Manim export functionality
- **`Resizable/`** - Resizable component wrappers
- **`Scrollable/`** - Custom scrollbar components

### `/src/constants/`
Application-wide constants and configuration:

- **`app-options.ts`** - Panel and menu item configurations
- **`design-editor.ts`** - Design editor specific constants
- **`editor.ts`** - General editor configurations
- **`fonts.ts`** - Font definitions and presets
- **`format-sizes.ts`** - Canvas and export size presets
- **`templates/`** - Template definitions and metadata

### `/src/contexts/`
React Context providers for global state:

- **`AppContext.tsx`** - Global application state
- **`DesignEditor.tsx`** - Design editor specific context

### `/src/hooks/`
Custom React hooks for common functionality:

- **`useAppContext.tsx`** - App context consumer hook
- **`useDesignEditorContext.ts`** - Design editor context hook
- **`useDesignEditorScenes.tsx`** - Scene management
- **`useEditorType.tsx`** - Current editor type detection
- **`useIsMobile.ts`** - Mobile device detection
- **`useOnClickOutside.tsx`** - Outside click detection

### `/src/interfaces/`
TypeScript type definitions:

- **`common.ts`** - Shared interfaces and types
- **`DesignEditor.ts`** - Design editor specific types
- **`editor.ts`** - Editor interface definitions

### `/src/services/`
External API integrations and services:

- **`api.ts`** - Core API client configuration
- **`pexels.ts`** - Pexels image API integration
- **`pixabay.ts`** - Pixabay image API integration

### `/src/store/`
Redux store configuration:

- **`store.ts`** - Store configuration and middleware
- **`rootReducer.ts`** - Root reducer combining all slices
- **`slices/`** - Individual Redux slices for different features

### `/src/styles/`
Global CSS styles and theme definitions:

- **`styles.css`** - Global styles and CSS variables

### `/src/translations/`
Internationalization files:

- **`index.ts`** - i18n configuration and setup
- **`en/`** - English translations
- **`es/`** - Spanish translations

### `/src/utils/`
Utility functions and helpers:

- **`fonts.ts`** - Font loading and management utilities
- **`get-selection-type.ts`** - Selection type detection
- **`object-options.ts`** - Object manipulation utilities
- **`unique.ts`** - Unique ID generation
- **`video.ts`** - Video processing utilities

### `/src/views/`
Main application views and pages:

- **`Dashboard/`** - Dashboard view for managing projects
- **`DesignEditor/`** - Main design editor interface
  - `DesignEditor.tsx` - Main editor container
  - `SelectEditor.tsx` - Editor type selection
  - `GraphicEditor.tsx` - Graphics editing interface
  - `PresentationEditor.tsx` - Presentation editing interface  
  - `VideoEditor.tsx` - Video editing interface
  - `components/` - Editor-specific components
  - `utils/` - Editor utility functions

## File Naming Conventions

- **Components**: PascalCase (e.g., `DesignEditor.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAppContext.tsx`)
- **Utilities**: camelCase (e.g., `get-selection-type.ts`)
- **Constants**: kebab-case (e.g., `app-options.ts`)
- **Interfaces**: PascalCase (e.g., `DesignEditor.ts`)

## Import Structure

The project uses path aliases configured in `tsconfig.json`:

```typescript
import Component from "~/components/Component"
import { useHook } from "~/hooks/useHook"
import { API_ENDPOINT } from "~/constants/api"
```

## Key Architectural Decisions

1. **Separation by Feature**: Components are organized by functionality rather than type
2. **Context over Props Drilling**: Uses React Context for state that needs to be shared across components
3. **Custom Hooks**: Extracts complex logic into reusable hooks
4. **Type Safety**: Comprehensive TypeScript interfaces for all data structures
5. **Modular Services**: External API calls are isolated in service modules
