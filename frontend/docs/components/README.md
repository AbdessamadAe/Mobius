# Components Documentation

## Overview

The components directory contains all reusable UI components organized by functionality. Each component is designed to be modular, reusable, and follows React best practices.

## Component Categories

### Core UI Components

#### Dropzone
File upload component with drag-and-drop functionality.

**Location**: `src/components/Dropzone/`

**Usage**:
```tsx
import { DropZone } from "~/components/Dropzone"

<DropZone
  onDrop={handleFileDrop}
  accept={["image/*", "video/*"]}
  multiple={true}
/>
```

**Features**:
- Drag and drop file upload
- File type validation
- Multiple file selection
- Progress indication
- Error handling

#### Icons
Comprehensive set of SVG icons used throughout the application.

**Location**: `src/components/Icons/`

**Available Icons** (80+ icons):
- Navigation: `ArrowBackOutline`, `ArrowDownOutline`, `AngleDoubleLeft`
- Editing: `Bold`, `Italic`, `Underline`, `AlignLeft`, `AlignCenter`, `AlignRight`
- Actions: `Add`, `Delete`, `Duplicate`, `Download`, `Refresh`, `Undo`, `Redo`
- Media: `Images`, `Video`, `Play`, `Pause`, `PlaySolid`
- Layout: `BringToFront`, `SendToBack`, `FlipHorizontal`, `FlipVertical`
- UI: `Eye`, `EyeCrossed`, `Locked`, `Unlocked`, `Expand`, `Compress`

**Usage**:
```tsx
import { Bold, Italic, AlignLeft } from "~/components/Icons"

<Button>
  <Bold />
  Bold Text
</Button>
```

#### Loading
Loading states and spinner components.

**Location**: `src/components/Loading/`

**Components**:
- `LoadingSpinner` - Animated loading spinner
- `LoadingOverlay` - Full-screen loading overlay
- `SkeletonLoader` - Skeleton loading placeholders

#### Resizable
Resizable container components for editor panels.

**Location**: `src/components/Resizable/`

**Features**:
- Drag-to-resize functionality
- Minimum/maximum size constraints
- Responsive behavior
- Smooth animations

#### Scrollable
Custom scrollbar components with consistent styling.

**Location**: `src/components/Scrollable/`

**Features**:
- Custom scrollbar design
- Cross-browser compatibility
- Touch-friendly scrolling
- Auto-hide scrollbars

### Editor-Specific Components

#### ManimExport
Components for exporting designs to Manim (Mathematical Animation Engine).

**Location**: `src/components/ManimExport/`

**Features**:
- Export configuration UI
- Progress tracking
- Error handling
- Preview functionality

## Component Patterns

### 1. Compound Components
Many components use the compound component pattern for flexibility:

```tsx
<Modal>
  <Modal.Header>
    <Modal.Title>Edit Properties</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {/* Content */}
  </Modal.Body>
  <Modal.Footer>
    <Button>Save</Button>
  </Modal.Footer>
</Modal>
```

### 2. Render Props
Components that need to share stateful logic use render props:

```tsx
<DataFetcher url="/api/templates">
  {({ data, loading, error }) => (
    <TemplateList 
      templates={data} 
      loading={loading} 
      error={error} 
    />
  )}
</DataFetcher>
```

### 3. Higher-Order Components (HOCs)
Used for cross-cutting concerns like authentication and theming:

```tsx
const withAuth = (Component) => {
  return (props) => {
    const { isAuthenticated } = useAuth()
    return isAuthenticated ? <Component {...props} /> : <Login />
  }
}
```

### 4. Custom Hooks Integration
Components leverage custom hooks for state management:

```tsx
function EditorPanel() {
  const { selectedObject, updateObject } = useDesignEditorContext()
  const isMobile = useIsMobile()
  
  // Component logic
}
```

## Component Structure

### Standard Component Structure
```
ComponentName/
├── index.ts           # Export file
├── ComponentName.tsx  # Main component
├── types.ts          # TypeScript interfaces
├── hooks.ts          # Component-specific hooks
├── utils.ts          # Utility functions
└── styles.ts         # Styled components
```

### Component Template
```tsx
import React from 'react'
import { ComponentProps } from './types'

interface Props extends ComponentProps {
  // Additional props
}

const ComponentName: React.FC<Props> = ({
  children,
  className,
  ...props
}) => {
  // Component logic
  
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

export default ComponentName
```

## Styling Approach

### BaseUI Integration
Components use BaseUI primitives for consistent styling:

```tsx
import { Block } from 'baseui/block'
import { Button } from 'baseui/button'

const CustomComponent = () => (
  <Block 
    $style={{
      padding: '1rem',
      backgroundColor: '#ffffff'
    }}
  >
    <Button size="compact">Action</Button>
  </Block>
)
```

### Responsive Design
Components include responsive behavior:

```tsx
const ResponsiveComponent = () => {
  const isMobile = useIsMobile()
  
  return (
    <Block
      $style={{
        flexDirection: isMobile ? 'column' : 'row',
        padding: isMobile ? '0.5rem' : '1rem'
      }}
    >
      {/* Content */}
    </Block>
  )
}
```

## Component Testing

### Testing Strategy
- **Unit Tests**: Individual component behavior
- **Integration Tests**: Component interaction
- **Visual Tests**: Component appearance
- **Accessibility Tests**: ARIA compliance

### Testing Example
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import Button from './Button'

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})

test('calls onClick when clicked', () => {
  const handleClick = jest.fn()
  render(<Button onClick={handleClick}>Click me</Button>)
  
  fireEvent.click(screen.getByText('Click me'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

## Performance Optimization

### Memoization
```tsx
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return processData(data)
  }, [data])
  
  return <div>{processedData}</div>
})
```

### Lazy Loading
```tsx
const LazyComponent = React.lazy(() => import('./LazyComponent'))

const ParentComponent = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyComponent />
  </Suspense>
)
```

## Accessibility

### ARIA Labels
```tsx
<Button
  aria-label="Delete item"
  aria-describedby="delete-help-text"
>
  <Delete />
</Button>
```

### Keyboard Navigation
```tsx
const NavigableList = () => {
  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        // Navigate to next item
        break
      case 'ArrowUp':
        // Navigate to previous item
        break
      case 'Enter':
        // Select item
        break
    }
  }
  
  return (
    <ul onKeyDown={handleKeyDown}>
      {/* List items */}
    </ul>
  )
}
```

## Best Practices

1. **Single Responsibility**: Each component should have one clear purpose
2. **Prop Validation**: Use TypeScript interfaces for prop validation
3. **Default Props**: Provide sensible defaults for optional props
4. **Error Boundaries**: Wrap components that might fail
5. **Accessibility**: Always consider keyboard navigation and screen readers
6. **Performance**: Use React.memo and useMemo when appropriate
7. **Testing**: Write tests for component behavior and edge cases
