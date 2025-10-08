import { renderHook, act } from '@testing-library/react'
import { useProfileImage } from '@/lib/custom-hooks/useProfileImage'

// Mock fetch
global.fetch = jest.fn()

describe('useProfileImage Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return default image initially', () => {
    const { result } = renderHook(() => useProfileImage())
    
    expect(result.current.imageUrl).toBe(
      'https://crs-data-storage-bucket.s3.ap-southeast-2.amazonaws.com/ProfilePictures/defaultImage.JPG'
    )
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should handle successful image upload', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ imageUrl: 'https://example.com/new-image.jpg' }),
    }
    
    ;(fetch as jest.Mock).mockResolvedValueOnce(mockResponse)
    
    const { result } = renderHook(() => useProfileImage())
    
    await act(async () => {
      await result.current.uploadImage(new File(['test'], 'test.jpg', { type: 'image/jpeg' }))
    })
    
    expect(result.current.imageUrl).toBe('https://example.com/new-image.jpg')
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should handle upload error', async () => {
    const mockResponse = {
      ok: false,
      status: 400,
      statusText: 'Bad Request',
    }
    
    ;(fetch as jest.Mock).mockResolvedValueOnce(mockResponse)
    
    const { result } = renderHook(() => useProfileImage())
    
    await act(async () => {
      await result.current.uploadImage(new File(['test'], 'test.jpg', { type: 'image/jpeg' }))
    })
    
    expect(result.current.error).toBe('Failed to upload image: 400 Bad Request')
    expect(result.current.isLoading).toBe(false)
  })

  it('should validate file type', async () => {
    const { result } = renderHook(() => useProfileImage())
    
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' })
    
    await act(async () => {
      await result.current.uploadImage(invalidFile)
    })
    
    expect(result.current.error).toBe('Please select a valid image file (JPEG, PNG, GIF)')
  })

  it('should validate file size', async () => {
    const { result } = renderHook(() => useProfileImage())
    
    // Create a large file (5MB)
    const largeFile = new File(['x'.repeat(5 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
    
    await act(async () => {
      await result.current.uploadImage(largeFile)
    })
    
    expect(result.current.error).toBe('File size must be less than 2MB')
  })

  it('should reset error when uploading again', async () => {
    const { result } = renderHook(() => useProfileImage())
    
    // First upload fails
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))
    
    await act(async () => {
      await result.current.uploadImage(new File(['test'], 'test.jpg', { type: 'image/jpeg' }))
    })
    
    expect(result.current.error).toBe('Network error')
    
    // Second upload succeeds
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ imageUrl: 'https://example.com/success.jpg' }),
    }
    
    ;(fetch as jest.Mock).mockResolvedValueOnce(mockResponse)
    
    await act(async () => {
      await result.current.uploadImage(new File(['test'], 'test2.jpg', { type: 'image/jpeg' }))
    })
    
    expect(result.current.error).toBe(null)
    expect(result.current.imageUrl).toBe('https://example.com/success.jpg')
  })
})
