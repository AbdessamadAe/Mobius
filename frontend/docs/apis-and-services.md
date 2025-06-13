# APIs and Services

## Overview

The Mobius frontend integrates with multiple external APIs and services to provide rich functionality including image search, asset management, and export capabilities. All API interactions are abstracted through service modules for maintainability and testability.

## Service Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Component Layer                      │
│              (Consumes API responses)                   │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                    Service Layer                        │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────────┐  │
│  │   API Client │ │External APIs │ │   Utilities     │  │
│  │   (Axios)    │ │(Pixabay,etc) │ │  (Transform)    │  │
│  └──────────────┘ └──────────────┘ └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                 External Services                       │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────────┐  │
│  │   Pixabay    │ │    Pexels    │ │   File Storage  │  │
│  │     API      │ │     API      │ │     Service     │  │
│  └──────────────┘ └──────────────┘ └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Core API Client

### Base API Configuration
**Location**: `src/services/api.ts`

```typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

class ApiClient {
  private client: AxiosInstance

  constructor(baseURL: string = '') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          this.handleUnauthorized()
        }
        return Promise.reject(error)
      }
    )
  }

  private handleUnauthorized() {
    localStorage.removeItem('auth_token')
    window.location.href = '/login'
  }

  // HTTP Methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }
}

export const apiClient = new ApiClient(process.env.VITE_API_BASE_URL)
```

## External API Services

### Pixabay Service
**Location**: `src/services/pixabay.ts`

Provides access to Pixabay's image and video database.

```typescript
export interface PixabayImage {
  id: number
  webformatURL: string
  largeImageURL: string
  fullHDURL?: string
  vectorURL?: string
  tags: string
  user: string
  views: number
  downloads: number
}

export interface PixabaySearchParams {
  q: string
  image_type?: 'all' | 'photo' | 'illustration' | 'vector'
  orientation?: 'all' | 'horizontal' | 'vertical'
  category?: string
  min_width?: number
  min_height?: number
  colors?: string
  per_page?: number
  page?: number
}

export interface PixabayResponse {
  total: number
  totalHits: number
  hits: PixabayImage[]
}

export class PixabayService {
  private static readonly API_KEY = process.env.VITE_PIXABAY_API_KEY
  private static readonly BASE_URL = 'https://pixabay.com/api/'

  static async searchImages(params: PixabaySearchParams): Promise<PixabayResponse> {
    if (!this.API_KEY) {
      throw new Error('Pixabay API key not configured')
    }

    const searchParams = new URLSearchParams({
      key: this.API_KEY,
      safesearch: 'true',
      per_page: '20',
      ...params,
    })

    try {
      const response = await fetch(`${this.BASE_URL}?${searchParams}`)
      
      if (!response.ok) {
        throw new Error(`Pixabay API error: ${response.status}`)
      }

      const data: PixabayResponse = await response.json()
      return data
    } catch (error) {
      console.error('Pixabay search error:', error)
      throw new Error('Failed to search Pixabay images')
    }
  }

  static async searchVideos(params: PixabaySearchParams): Promise<PixabayResponse> {
    // Similar implementation for videos
    const videoParams = {
      ...params,
      // Video-specific parameters
    }
    
    // Implementation details...
  }

  static async getImageDetails(id: number): Promise<PixabayImage> {
    const params = new URLSearchParams({
      key: this.API_KEY!,
      id: id.toString(),
    })

    const response = await fetch(`${this.BASE_URL}?${params}`)
    const data = await response.json()
    
    return data.hits[0]
  }
}
```

### Pexels Service
**Location**: `src/services/pexels.ts`

Provides access to Pexels' stock photography API.

```typescript
export interface PexelsPhoto {
  id: number
  width: number
  height: number
  url: string
  photographer: string
  photographer_url: string
  photographer_id: number
  avg_color: string
  src: {
    original: string
    large2x: string
    large: string
    medium: string
    small: string
    portrait: string
    landscape: string
    tiny: string
  }
  alt: string
}

export interface PexelsSearchResponse {
  page: number
  per_page: number
  photos: PexelsPhoto[]
  total_results: number
  next_page?: string
}

export class PexelsService {
  private static readonly API_KEY = process.env.VITE_PEXELS_API_KEY
  private static readonly BASE_URL = 'https://api.pexels.com/v1'

  private static readonly headers = {
    'Authorization': this.API_KEY!,
    'Content-Type': 'application/json',
  }

  static async searchPhotos(
    query: string,
    page: number = 1,
    perPage: number = 20
  ): Promise<PexelsSearchResponse> {
    if (!this.API_KEY) {
      throw new Error('Pexels API key not configured')
    }

    const url = `${this.BASE_URL}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`

    try {
      const response = await fetch(url, {
        headers: this.headers,
      })

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Pexels search error:', error)
      throw new Error('Failed to search Pexels photos')
    }
  }

  static async getCuratedPhotos(page: number = 1, perPage: number = 20): Promise<PexelsSearchResponse> {
    const url = `${this.BASE_URL}/curated?page=${page}&per_page=${perPage}`

    const response = await fetch(url, {
      headers: this.headers,
    })

    return await response.json()
  }

  static async getPhoto(id: number): Promise<PexelsPhoto> {
    const url = `${this.BASE_URL}/photos/${id}`

    const response = await fetch(url, {
      headers: this.headers,
    })

    return await response.json()
  }
}
```

## File Upload Service

### Upload Configuration
```typescript
export interface UploadOptions {
  maxSize?: number
  allowedTypes?: string[]
  multiple?: boolean
  onProgress?: (progress: number) => void
}

export interface UploadResult {
  id: string
  url: string
  filename: string
  size: number
  type: string
  thumbnailUrl?: string
}

export class UploadService {
  static async uploadFile(
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/*', 'video/*'],
      onProgress
    } = options

    // Validate file
    this.validateFile(file, maxSize, allowedTypes)

    // Create form data
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', process.env.VITE_UPLOAD_PRESET!)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100
            onProgress(Math.round(progress))
          }
        },
      } as any)

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`)
      }

      const result = await response.json()
      return this.transformUploadResult(result)
    } catch (error) {
      console.error('Upload error:', error)
      throw new Error('File upload failed')
    }
  }

  static async uploadMultiple(
    files: FileList,
    options: UploadOptions = {}
  ): Promise<UploadResult[]> {
    const uploads = Array.from(files).map(file => 
      this.uploadFile(file, options)
    )

    return Promise.all(uploads)
  }

  private static validateFile(
    file: File,
    maxSize: number,
    allowedTypes: string[]
  ): void {
    // Size validation
    if (file.size > maxSize) {
      throw new Error(`File size exceeds ${maxSize / 1024 / 1024}MB limit`)
    }

    // Type validation
    const isAllowed = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1))
      }
      return file.type === type
    })

    if (!isAllowed) {
      throw new Error(`File type ${file.type} not allowed`)
    }
  }

  private static transformUploadResult(result: any): UploadResult {
    return {
      id: result.public_id,
      url: result.secure_url,
      filename: result.original_filename,
      size: result.bytes,
      type: result.resource_type,
      thumbnailUrl: result.eager?.[0]?.secure_url,
    }
  }
}
```

## Export Services

### Manim Export Service
```typescript
export interface ManimExportOptions {
  quality: 'low' | 'medium' | 'high' | 'ultra'
  format: 'mp4' | 'gif' | 'png'
  fps: number
  duration: number
}

export interface ExportJob {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  downloadUrl?: string
  error?: string
}

export class ManimExportService {
  static async exportScene(
    sceneData: any,
    options: ManimExportOptions
  ): Promise<ExportJob> {
    try {
      const response = await apiClient.post<ExportJob>('/api/export/manim', {
        scene: sceneData,
        options,
      })

      return response
    } catch (error) {
      console.error('Export failed:', error)
      throw new Error('Failed to start export job')
    }
  }

  static async getExportStatus(jobId: string): Promise<ExportJob> {
    try {
      return await apiClient.get<ExportJob>(`/api/export/status/${jobId}`)
    } catch (error) {
      console.error('Failed to get export status:', error)
      throw new Error('Failed to get export status')
    }
  }

  static async downloadExport(jobId: string): Promise<Blob> {
    try {
      const response = await fetch(`/api/export/download/${jobId}`)
      
      if (!response.ok) {
        throw new Error('Download failed')
      }

      return await response.blob()
    } catch (error) {
      console.error('Download failed:', error)
      throw new Error('Failed to download export')
    }
  }
}
```

## API Integration Patterns

### 1. Service Hooks
Custom hooks for API integration:

```typescript
export const usePixabaySearch = () => {
  const [results, setResults] = useState<PixabayImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await PixabayService.searchImages({ q: query })
      setResults(response.hits)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }, [])

  return { results, loading, error, search }
}
```

### 2. Cache Management
Implement caching for API responses:

```typescript
class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number }>()
  private ttl = 5 * 60 * 1000 // 5 minutes

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  get(key: string): any | null {
    const entry = this.cache.get(key)
    
    if (!entry) return null
    
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }

  clear(): void {
    this.cache.clear()
  }
}

export const apiCache = new ApiCache()
```

### 3. Error Handling
Consistent error handling across services:

```typescript
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // Server responded with error status
    return new ApiError(
      error.response.data?.message || 'Server error',
      error.response.status,
      error.response.data?.code
    )
  } else if (error.request) {
    // Network error
    return new ApiError('Network error - please check your connection')
  } else {
    // Other error
    return new ApiError(error.message || 'Unknown error occurred')
  }
}
```

## Rate Limiting and Throttling

### Request Throttling
```typescript
class RequestThrottler {
  private requests = new Map<string, number[]>()
  private limits = {
    pixabay: { requests: 100, window: 60000 }, // 100 requests per minute
    pexels: { requests: 200, window: 3600000 }, // 200 requests per hour
  }

  canMakeRequest(service: string): boolean {
    const limit = this.limits[service]
    if (!limit) return true

    const now = Date.now()
    const requests = this.requests.get(service) || []
    
    // Remove old requests outside the window
    const validRequests = requests.filter(
      timestamp => now - timestamp < limit.window
    )
    
    this.requests.set(service, validRequests)
    
    return validRequests.length < limit.requests
  }

  recordRequest(service: string): void {
    const requests = this.requests.get(service) || []
    requests.push(Date.now())
    this.requests.set(service, requests)
  }
}

export const requestThrottler = new RequestThrottler()
```

## Testing API Services

### Service Testing
```typescript
import { PixabayService } from '../pixabay'

// Mock fetch
global.fetch = jest.fn()

describe('PixabayService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('searches images successfully', async () => {
    const mockResponse = {
      total: 100,
      totalHits: 20,
      hits: [
        { id: 1, webformatURL: 'test-url', tags: 'test' }
      ]
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await PixabayService.searchImages({ q: 'test' })
    
    expect(result).toEqual(mockResponse)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('pixabay.com/api')
    )
  })

  it('handles API errors', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
    })

    await expect(
      PixabayService.searchImages({ q: 'test' })
    ).rejects.toThrow('Pixabay API error: 400')
  })
})
```

## Best Practices

1. **Environment Variables**: Store API keys securely in environment variables
2. **Error Handling**: Implement consistent error handling across all services
3. **Rate Limiting**: Respect API rate limits and implement throttling
4. **Caching**: Cache frequently requested data to improve performance
5. **Type Safety**: Use TypeScript interfaces for all API responses
6. **Loading States**: Always provide loading feedback for async operations
7. **Retry Logic**: Implement retry mechanisms for transient failures
8. **Security**: Never expose API keys in client-side code
9. **Testing**: Mock external APIs in tests for reliability
10. **Documentation**: Document all API integrations and their usage
