# State Management

## Overview

Mobius uses a hybrid approach to state management, combining React Context for local state and Redux Toolkit for complex global state. This approach provides flexibility while maintaining predictable state updates.

## State Management Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Component Layer                      │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────────┐  │
│  │   UI State   │ │ Form State   │ │  Local State    │  │
│  │ (useState)   │ │ (useForm)    │ │ (useReducer)    │  │
│  └──────────────┘ └──────────────┘ └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                    Context Layer                        │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────────┐  │
│  │ App Context  │ │Design Context│ │ Theme Context   │  │
│  │ (Global UI)  │ │ (Editor)     │ │ (Styling)       │  │
│  └──────────────┘ └──────────────┘ └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                     Redux Layer                         │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────────┐  │
│  │ Editor Slice │ │ Assets Slice │ │ History Slice   │  │
│  │ (Complex)    │ │ (Cache)      │ │ (Undo/Redo)     │  │
│  └──────────────┘ └──────────────┘ └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## React Context Implementation

### App Context
Global application state for UI preferences and user settings.

**Location**: `src/contexts/AppContext.tsx`

```typescript
interface AppContextType {
  theme: 'light' | 'dark'
  language: string
  user: User | null
  setTheme: (theme: 'light' | 'dark') => void
  setLanguage: (language: string) => void
  setUser: (user: User | null) => void
}

const AppContext = React.createContext<AppContextType | undefined>(undefined)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
```

### Design Editor Context
Editor-specific state management for canvas operations and selections.

**Location**: `src/contexts/DesignEditor.tsx`

```typescript
interface DesignEditorContextType {
  // Editor State
  editorType: EditorType
  setEditorType: (type: EditorType) => void
  
  // Canvas State
  selectedObject: any
  setSelectedObject: (object: any) => void
  
  // UI State
  displayPreview: boolean
  setDisplayPreview: (display: boolean) => void
  
  // Scenes Management
  scenes: Scene[]
  currentScene: Scene | null
  setCurrentScene: (scene: Scene) => void
  
  // Actions
  addScene: (scene: Scene) => void
  updateScene: (id: string, updates: Partial<Scene>) => void
  removeScene: (id: string) => void
}
```

**Key Features**:
- Scene management for multi-page designs
- Object selection and manipulation
- Canvas state synchronization
- Preview mode control

### Custom Hooks for Context

#### useDesignEditorContext
```typescript
export const useDesignEditorContext = () => {
  const context = useContext(DesignEditorContext)
  if (!context) {
    throw new Error('useDesignEditorContext must be used within DesignEditorProvider')
  }
  return context
}
```

#### useDesignEditorScenes
```typescript
export const useDesignEditorScenes = () => {
  const { scenes, currentScene, setCurrentScene, addScene, updateScene, removeScene } = useDesignEditorContext()
  
  const createScene = useCallback((template?: Template) => {
    const newScene = {
      id: nanoid(),
      name: `Scene ${scenes.length + 1}`,
      objects: template?.objects || [],
      ...template
    }
    addScene(newScene)
    setCurrentScene(newScene)
  }, [scenes, addScene, setCurrentScene])
  
  return {
    scenes,
    currentScene,
    setCurrentScene,
    createScene,
    updateScene,
    removeScene
  }
}
```

## Redux Store Configuration

### Store Setup
**Location**: `src/store/store.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './rootReducer'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### Root Reducer
**Location**: `src/store/rootReducer.ts`

```typescript
import { combineReducers } from '@reduxjs/toolkit'
import editorReducer from './slices/editorSlice'
import assetsReducer from './slices/assetsSlice'
import historyReducer from './slices/historySlice'

export const rootReducer = combineReducers({
  editor: editorReducer,
  assets: assetsReducer,
  history: historyReducer,
})
```

### Redux Slices

#### Editor Slice
Manages complex editor state that benefits from Redux's time-travel debugging.

```typescript
// src/store/slices/editorSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface EditorState {
  canvas: {
    width: number
    height: number
    backgroundColor: string
    zoom: number
  }
  selection: {
    objects: string[]
    active: string | null
  }
  clipboard: any[]
  settings: EditorSettings
}

const initialState: EditorState = {
  canvas: {
    width: 1920,
    height: 1080,
    backgroundColor: '#ffffff',
    zoom: 1
  },
  selection: {
    objects: [],
    active: null
  },
  clipboard: [],
  settings: defaultSettings
}

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setCanvasSize: (state, action: PayloadAction<{width: number, height: number}>) => {
      state.canvas.width = action.payload.width
      state.canvas.height = action.payload.height
    },
    setSelection: (state, action: PayloadAction<string[]>) => {
      state.selection.objects = action.payload
      state.selection.active = action.payload[0] || null
    },
    copyToClipboard: (state, action: PayloadAction<any[]>) => {
      state.clipboard = action.payload
    },
    // ... more reducers
  }
})

export const { setCanvasSize, setSelection, copyToClipboard } = editorSlice.actions
export default editorSlice.reducer
```

#### Assets Slice
Manages uploaded assets and external API cache.

```typescript
// src/store/slices/assetsSlice.ts
interface AssetsState {
  uploads: Asset[]
  pixabayCache: Record<string, PixabayResult>
  pexelsCache: Record<string, PexelsResult>
  loading: boolean
  error: string | null
}

const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    addUpload: (state, action: PayloadAction<Asset>) => {
      state.uploads.push(action.payload)
    },
    cachePixabayResults: (state, action: PayloadAction<{query: string, results: PixabayResult}>) => {
      state.pixabayCache[action.payload.query] = action.payload.results
    },
    // ... more reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadAsset.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(uploadAsset.fulfilled, (state, action) => {
        state.loading = false
        state.uploads.push(action.payload)
      })
      .addCase(uploadAsset.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Upload failed'
      })
  }
})
```

#### History Slice
Implements undo/redo functionality.

```typescript
// src/store/slices/historySlice.ts
interface HistoryState {
  past: EditorState[]
  present: EditorState
  future: EditorState[]
  canUndo: boolean
  canRedo: boolean
}

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    undo: (state) => {
      if (state.past.length > 0) {
        state.future.unshift(state.present)
        state.present = state.past.pop()!
        state.canUndo = state.past.length > 0
        state.canRedo = true
      }
    },
    redo: (state) => {
      if (state.future.length > 0) {
        state.past.push(state.present)
        state.present = state.future.shift()!
        state.canRedo = state.future.length > 0
        state.canUndo = true
      }
    },
    saveState: (state, action: PayloadAction<EditorState>) => {
      state.past.push(state.present)
      state.present = action.payload
      state.future = []
      state.canUndo = true
      state.canRedo = false
      
      // Limit history size
      if (state.past.length > 50) {
        state.past.shift()
      }
    }
  }
})
```

## State Management Patterns

### 1. Container/Presenter Pattern
Separate state logic from presentation:

```typescript
// Container Component
const EditorContainer = () => {
  const { selectedObject, updateObject } = useDesignEditorContext()
  const dispatch = useAppDispatch()
  
  const handleObjectUpdate = (updates: Partial<EditorObject>) => {
    updateObject(selectedObject.id, updates)
    dispatch(saveState(getCurrentState()))
  }
  
  return (
    <EditorPresenter
      selectedObject={selectedObject}
      onObjectUpdate={handleObjectUpdate}
    />
  )
}

// Presenter Component
const EditorPresenter = ({ selectedObject, onObjectUpdate }) => {
  return (
    <div>
      <ObjectProperties 
        object={selectedObject}
        onChange={onObjectUpdate}
      />
    </div>
  )
}
```

### 2. Optimistic Updates
Update UI immediately, handle errors gracefully:

```typescript
const useOptimisticUpdate = () => {
  const [optimisticState, setOptimisticState] = useState(null)
  const [error, setError] = useState(null)
  
  const updateOptimistically = async (newState, asyncAction) => {
    setOptimisticState(newState)
    setError(null)
    
    try {
      await asyncAction()
    } catch (err) {
      setOptimisticState(null)
      setError(err.message)
    }
  }
  
  return { optimisticState, error, updateOptimistically }
}
```

### 3. Derived State
Compute derived values efficiently:

```typescript
const useEditorSelectors = () => {
  const editor = useSelector(state => state.editor)
  
  const selectedObjects = useMemo(() => 
    editor.selection.objects.map(id => 
      editor.objects.find(obj => obj.id === id)
    ).filter(Boolean),
    [editor.selection.objects, editor.objects]
  )
  
  const selectionBounds = useMemo(() => 
    calculateBounds(selectedObjects),
    [selectedObjects]
  )
  
  return { selectedObjects, selectionBounds }
}
```

## Performance Optimization

### 1. Selector Optimization
Use reselect for memoized selectors:

```typescript
import { createSelector } from '@reduxjs/toolkit'

const selectEditor = (state: RootState) => state.editor
const selectSelection = (state: RootState) => state.editor.selection

const selectSelectedObjects = createSelector(
  [selectEditor, selectSelection],
  (editor, selection) => 
    selection.objects.map(id => editor.objects[id])
)
```

### 2. Context Splitting
Split contexts to prevent unnecessary re-renders:

```typescript
// Instead of one large context
const AppContext = createContext({ ui, editor, assets })

// Use multiple focused contexts
const UIContext = createContext(ui)
const EditorContext = createContext(editor)
const AssetsContext = createContext(assets)
```

### 3. State Normalization
Normalize nested data structures:

```typescript
interface NormalizedState {
  objects: {
    byId: Record<string, EditorObject>
    allIds: string[]
  }
  scenes: {
    byId: Record<string, Scene>
    allIds: string[]
  }
}
```

## Testing State Management

### Context Testing
```typescript
const renderWithContext = (component, contextValue) => {
  return render(
    <DesignEditorContext.Provider value={contextValue}>
      {component}
    </DesignEditorContext.Provider>
  )
}

test('updates selected object', () => {
  const mockContext = {
    selectedObject: mockObject,
    setSelectedObject: jest.fn()
  }
  
  renderWithContext(<ObjectPanel />, mockContext)
  // Test interactions
})
```

### Redux Testing
```typescript
import { store } from '../store'
import { setSelection } from '../slices/editorSlice'

test('sets selection correctly', () => {
  const objectIds = ['obj1', 'obj2']
  store.dispatch(setSelection(objectIds))
  
  const state = store.getState()
  expect(state.editor.selection.objects).toEqual(objectIds)
  expect(state.editor.selection.active).toBe('obj1')
})
```

## Best Practices

1. **Use Context for Local State**: Keep context close to where it's used
2. **Use Redux for Complex State**: Use Redux for state that needs time-travel debugging
3. **Normalize State Shape**: Keep nested data flat for easier updates
4. **Memoize Expensive Computations**: Use selectors and useMemo for performance
5. **Split Large Contexts**: Prevent unnecessary re-renders by splitting contexts
6. **Handle Loading States**: Always account for async operations
7. **Error Boundaries**: Wrap context providers with error boundaries
8. **Type Safety**: Use TypeScript for all state interfaces
