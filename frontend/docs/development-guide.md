# Development Guide

## Overview

This guide provides comprehensive information for developers working on the Mobius frontend, including coding standards, development workflows, debugging techniques, and contribution guidelines.

## Development Environment Setup

### Prerequisites
- Node.js 16+ (recommended: 18+)
- pnpm (preferred package manager)
- Git
- VS Code (recommended editor)

### IDE Configuration

#### VS Code Extensions
Essential extensions for Mobius development:

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "ms-vscode.vscode-react-native"
  ]
}
```

#### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### Git Configuration

#### Git Hooks
Set up pre-commit hooks to ensure code quality:

```bash
# Install husky
pnpm add -D husky

# Set up pre-commit hook
npx husky install
npx husky add .husky/pre-commit "pnpm lint-staged"
```

#### Git Workflow
```bash
# Feature branch workflow
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
# Create pull request
```

## Coding Standards

### TypeScript Guidelines

#### Interface Naming
```typescript
// ✅ Good
interface UserProfile {
  id: string
  name: string
  email: string
}

interface ComponentProps {
  title: string
  onClose: () => void
}

// ❌ Avoid
interface IUser { } // Don't use I prefix
interface userProfile { } // Use PascalCase
```

#### Type Definitions
```typescript
// ✅ Prefer specific types
type EditorType = 'GRAPHIC' | 'PRESENTATION' | 'VIDEO'
type Status = 'loading' | 'success' | 'error'

// ✅ Use utility types
interface UpdateUserRequest extends Omit<User, 'id' | 'createdAt'> {
  // Additional fields
}

// ✅ Generic constraints
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T>
  save(entity: T): Promise<T>
}
```

#### Function Types
```typescript
// ✅ Prefer function declarations for named functions
function calculateArea(width: number, height: number): number {
  return width * height
}

// ✅ Use arrow functions for callbacks and short functions
const handleClick = (event: MouseEvent) => {
  event.preventDefault()
}

// ✅ Async/await over promises
async function fetchUserData(id: string): Promise<User> {
  try {
    const response = await apiClient.get(`/users/${id}`)
    return response.data
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error.message}`)
  }
}
```

### React Guidelines

#### Component Structure
```typescript
// ✅ Recommended component structure
import React, { useState, useEffect, useCallback } from 'react'
import { ComponentProps } from './types'
import { useCustomHook } from './hooks'

interface Props extends ComponentProps {
  title: string
  onAction: (value: string) => void
}

const MyComponent: React.FC<Props> = ({
  title,
  onAction,
  children,
  ...props
}) => {
  // 1. Hooks
  const [state, setState] = useState<string>('')
  const customData = useCustomHook()

  // 2. Callbacks
  const handleSubmit = useCallback((value: string) => {
    onAction(value)
  }, [onAction])

  // 3. Effects
  useEffect(() => {
    // Side effects
  }, [])

  // 4. Render
  return (
    <div {...props}>
      <h1>{title}</h1>
      {children}
    </div>
  )
}

export default MyComponent
```

#### Custom Hooks
```typescript
// ✅ Custom hook naming and structure
const useFeatureLogic = (initialValue: string) => {
  const [value, setValue] = useState(initialValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const performAction = useCallback(async (newValue: string) => {
    setLoading(true)
    setError(null)
    
    try {
      await someAsyncOperation(newValue)
      setValue(newValue)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    value,
    loading,
    error,
    performAction,
  }
}
```

#### Event Handlers
```typescript
// ✅ Consistent event handler naming
const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value)
}

const handleFormSubmit = (event: React.FormEvent) => {
  event.preventDefault()
  // Handle submit
}

const handleButtonClick = () => {
  // Handle click
}
```

### Styling Guidelines

#### BaseUI Integration
```typescript
// ✅ Consistent BaseUI usage
import { Block } from 'baseui/block'
import { Button } from 'baseui/button'

const StyledComponent = () => (
  <Block
    $style={{
      padding: '1rem',
      backgroundColor: '#ffffff',
      borderRadius: '0.5rem',
    }}
  >
    <Button size="compact" kind="secondary">
      Action
    </Button>
  </Block>
)
```

#### Responsive Design
```typescript
// ✅ Mobile-first approach
const ResponsiveComponent = () => {
  const isMobile = useIsMobile()
  
  return (
    <Block
      $style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '0.5rem' : '1rem',
        padding: isMobile ? '0.5rem' : '1rem',
      }}
    >
      {/* Content */}
    </Block>
  )
}
```

## Development Workflows

### Feature Development

#### 1. Planning Phase
- Review requirements and acceptance criteria
- Break down features into smaller tasks
- Identify dependencies and potential blockers
- Create technical design document if needed

#### 2. Implementation Phase
```bash
# Create feature branch
git checkout -b feature/editor-improvements

# Implement changes incrementally
git add .
git commit -m "feat: add new editor tool"

# Push regularly
git push origin feature/editor-improvements
```

#### 3. Code Review Checklist
- [ ] Code follows TypeScript and React guidelines
- [ ] Components are properly typed
- [ ] Error handling is implemented
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] Performance considerations are addressed
- [ ] Accessibility requirements are met

### Testing Strategy

#### Unit Testing
```typescript
// Component testing
import { render, screen, fireEvent } from '@testing-library/react'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" onAction={jest.fn()} />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('handles user interaction', () => {
    const handleAction = jest.fn()
    render(<MyComponent title="Test" onAction={handleAction} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleAction).toHaveBeenCalled()
  })
})
```

#### Integration Testing
```typescript
// Hook testing
import { renderHook, act } from '@testing-library/react'
import { useFeatureLogic } from './useFeatureLogic'

describe('useFeatureLogic', () => {
  it('handles async operations', async () => {
    const { result } = renderHook(() => useFeatureLogic('initial'))
    
    await act(async () => {
      await result.current.performAction('new value')
    })
    
    expect(result.current.value).toBe('new value')
    expect(result.current.loading).toBe(false)
  })
})
```

### Debugging Techniques

#### React Developer Tools
```typescript
// Add display names for better debugging
const withDisplayName = <P extends object>(
  Component: React.ComponentType<P>,
  name: string
) => {
  const WrappedComponent = (props: P) => <Component {...props} />
  WrappedComponent.displayName = name
  return WrappedComponent
}

export default withDisplayName(MyComponent, 'MyComponent')
```

#### Console Debugging
```typescript
// ✅ Structured logging
const debugLog = (component: string, action: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${component}] ${action}`, data)
  }
}

// Usage
debugLog('EditorPanel', 'Object selected', selectedObject)
```

#### Performance Debugging
```typescript
// Performance monitoring
const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    const start = performance.now()
    
    return () => {
      const end = performance.now()
      console.log(`${componentName} render time: ${end - start}ms`)
    }
  })
}
```

## Performance Optimization

### Code Splitting
```typescript
// Lazy loading components
const LazyComponent = React.lazy(() => import('./LazyComponent'))

const ParentComponent = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <LazyComponent />
  </Suspense>
)
```

### Memoization
```typescript
// Memoize expensive calculations
const ExpensiveComponent = React.memo(({ data, config }) => {
  const processedData = useMemo(() => {
    return expensiveCalculation(data, config)
  }, [data, config])

  return <div>{processedData}</div>
})

// Memoize callbacks
const OptimizedComponent = ({ onAction }) => {
  const handleClick = useCallback(() => {
    onAction('clicked')
  }, [onAction])

  return <button onClick={handleClick}>Click me</button>
}
```

### Bundle Analysis
```bash
# Analyze bundle size
pnpm build
pnpm analyze

# Check bundle composition
npx webpack-bundle-analyzer dist/assets/*.js
```

## Error Handling

### Error Boundaries
```typescript
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

### Async Error Handling
```typescript
const useAsyncOperation = () => {
  const [state, setState] = useState<{
    data: any
    loading: boolean
    error: string | null
  }>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async (operation: () => Promise<any>) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const data = await operation()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'An error occurred',
      }))
    }
  }, [])

  return { ...state, execute }
}
```

## Accessibility

### ARIA Labels
```typescript
const AccessibleComponent = () => (
  <div>
    <button
      aria-label="Close dialog"
      aria-describedby="close-help"
      onClick={handleClose}
    >
      ×
    </button>
    <div id="close-help" className="sr-only">
      Closes the current dialog
    </div>
  </div>
)
```

### Keyboard Navigation
```typescript
const KeyboardNavigable = () => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        handleActivate()
        break
      case 'Escape':
        handleClose()
        break
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleActivate}
    >
      Interactive Element
    </div>
  )
}
```

## Build and Deployment

### Environment Configuration
```bash
# Development
VITE_API_BASE_URL=http://localhost:3000
VITE_PIXABAY_API_KEY=your_pixabay_key
VITE_PEXELS_API_KEY=your_pexels_key

# Production
VITE_API_BASE_URL=https://api.Mobius.com
VITE_PIXABAY_API_KEY=production_pixabay_key
VITE_PEXELS_API_KEY=production_pexels_key
```

### Build Optimization
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['baseui', 'styletron-react'],
          editor: ['pixi.js', '@layerhub-io/react'],
        },
      },
    },
  },
})
```

## Troubleshooting

### Common Issues

#### TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache/typescript
pnpm install

# Check TypeScript configuration
npx tsc --noEmit
```

#### Build Errors
```bash
# Clear build cache
rm -rf dist
rm -rf node_modules/.vite
pnpm build
```

#### Performance Issues
```typescript
// Identify performance bottlenecks
const ProfiledComponent = () => {
  React.useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(entry.name, entry.duration)
      }
    })
    observer.observe({ entryTypes: ['measure'] })
  }, [])

  return <div>Component content</div>
}
```

## Best Practices Summary

1. **Code Quality**
   - Use TypeScript strictly
   - Follow consistent naming conventions
   - Write self-documenting code
   - Add comments for complex logic

2. **Performance**
   - Lazy load components when appropriate
   - Memoize expensive calculations
   - Optimize re-renders with React.memo
   - Monitor bundle size

3. **Testing**
   - Write tests for critical functionality
   - Test user interactions
   - Mock external dependencies
   - Maintain good test coverage

4. **Accessibility**
   - Use semantic HTML
   - Provide ARIA labels
   - Support keyboard navigation
   - Test with screen readers

5. **Maintainability**
   - Keep components small and focused
   - Extract reusable logic into hooks
   - Use proper error handling
   - Document complex features

6. **Collaboration**
   - Write clear commit messages
   - Review code thoroughly
   - Update documentation
   - Share knowledge with team
