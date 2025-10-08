import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock external dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}))

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: { id: '1', name: 'Test User', email: 'test@example.com' }
    },
    status: 'authenticated',
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

describe('Mocking External Dependencies', () => {
  
  it('How mocks work in tests', () => {
    // Mock a simple function
    const mockApiCall = jest.fn()
    mockApiCall.mockReturnValue('Mocked response')
    
    console.log('🔍 Mock function called:', mockApiCall())
    console.log('🔍 Mock was called:', mockApiCall.mock.calls.length, 'times')
    
    expect(mockApiCall).toHaveBeenCalledTimes(1)
    expect(mockApiCall()).toBe('Mocked response')
  })
  
  it('How component mocks work', () => {
    // Mock a component
    const MockedComponent = jest.fn(() => <div>Mocked Component</div>)
    
    const TestComponent = () => (
      <div>
        <h1>Real Component</h1>
        <MockedComponent />
      </div>
    )
    
    render(<TestComponent />)
    
    console.log('🔍 Mocked component rendered:', MockedComponent.mock.calls.length, 'times')
    
    expect(screen.getByText('Real Component')).toBeInTheDocument()
    expect(screen.getByText('Mocked Component')).toBeInTheDocument()
    expect(MockedComponent).toHaveBeenCalledTimes(1)
  })
  
  it('How API mocks work', async () => {
    // Mock fetch globally
    global.fetch = jest.fn()
    
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ message: 'Success!' }),
    }
    
    global.fetch.mockResolvedValueOnce(mockResponse)
    
    const ApiComponent = () => {
      const [data, setData] = React.useState(null)
      const [loading, setLoading] = React.useState(false)
      
      const fetchData = async () => {
        setLoading(true)
        console.log('🔍 Making API call...')
        
        const response = await fetch('/api/test')
        const result = await response.json()
        
        console.log('🔍 API response:', result)
        setData(result.message)
        setLoading(false)
      }
      
      return (
        <div>
          <button onClick={fetchData}>Fetch Data</button>
          {loading && <p>Loading...</p>}
          {data && <p>{data}</p>}
        </div>
      )
    }
    
    render(<ApiComponent />)
    
    const user = userEvent.setup()
    const fetchButton = screen.getByRole('button', { name: 'Fetch Data' })
    
    await user.click(fetchButton)
    
    // Wait for API call to complete
    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument()
    })
    
    console.log('🔍 API mock was called:', global.fetch.mock.calls.length, 'times')
    console.log('🔍 API mock was called with:', global.fetch.mock.calls[0])
    
    expect(global.fetch).toHaveBeenCalledWith('/api/test')
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })
  
  it('How error handling mocks work', async () => {
    // Mock fetch to return error
    global.fetch = jest.fn()
    global.fetch.mockRejectedValueOnce(new Error('Network error'))
    
    const ErrorComponent = () => {
      const [error, setError] = React.useState(null)
      
      const fetchData = async () => {
        try {
          console.log('🔍 Making API call that will fail...')
          await fetch('/api/error')
        } catch (err) {
          console.log('🔍 Caught error:', err.message)
          setError(err.message)
        }
      }
      
      return (
        <div>
          <button onClick={fetchData}>Fetch Data</button>
          {error && <p>Error: {error}</p>}
        </div>
      )
    }
    
    render(<ErrorComponent />)
    
    const user = userEvent.setup()
    const fetchButton = screen.getByRole('button', { name: 'Fetch Data' })
    
    await user.click(fetchButton)
    
    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument()
    })
    
    console.log('🔍 Error handling test completed!')
  })
})
