import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('User Interaction Simulation', () => {
  
  it('How user events are simulated', async () => {
    const InteractiveComponent = () => {
      const [count, setCount] = React.useState(0)
      const [text, setText] = React.useState('')
      
      console.log('🔍 Component rendered with count:', count, 'text:', text)
      
      return (
        <div>
          <p>Count: {count}</p>
          <button 
            onClick={() => {
              console.log('🔍 Button clicked! Current count:', count)
              setCount(count + 1)
            }}
          >
            Increment
          </button>
          <input 
            value={text}
            onChange={(e) => {
              console.log('🔍 Input changed! New value:', e.target.value)
              setText(e.target.value)
            }}
            placeholder="Type something"
          />
        </div>
      )
    }
    
    render(<InteractiveComponent />)
    
    // Step 1: Setup user event simulation
    const user = userEvent.setup()
    console.log('🔍 User event setup complete')
    
    // Step 2: Find the button
    const incrementButton = screen.getByRole('button', { name: 'Increment' })
    console.log('🔍 Found button:', incrementButton.textContent)
    
    // Step 3: Simulate click
    console.log('🔍 About to click button...')
    await user.click(incrementButton)
    console.log('🔍 Click completed!')
    
    // Step 4: Check state change
    expect(screen.getByText('Count: 1')).toBeInTheDocument()
    console.log('🔍 State updated successfully!')
    
    // Step 5: Simulate typing
    const input = screen.getByPlaceholderText('Type something')
    console.log('🔍 Found input, current value:', input.value)
    
    console.log('🔍 About to type "Hello"...')
    await user.type(input, 'Hello')
    console.log('🔍 Typing completed!')
    
    // Step 6: Check input value
    expect(input).toHaveValue('Hello')
    console.log('🔍 Input value updated successfully!')
  })
  
  it('How async operations work in tests', async () => {
    const AsyncComponent = () => {
      const [data, setData] = React.useState(null)
      const [loading, setLoading] = React.useState(false)
      
      const fetchData = async () => {
        setLoading(true)
        console.log('🔍 Starting async operation...')
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 100))
        
        console.log('🔍 Async operation completed!')
        setData('Fetched data!')
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
    
    render(<AsyncComponent />)
    
    const user = userEvent.setup()
    const fetchButton = screen.getByRole('button', { name: 'Fetch Data' })
    
    // Click button to start async operation
    await user.click(fetchButton)
    
    // Check loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    console.log('🔍 Loading state detected!')
    
    // Wait for async operation to complete
    await screen.findByText('Fetched data!')
    console.log('🔍 Data fetched successfully!')
    
    // Verify final state
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    expect(screen.getByText('Fetched data!')).toBeInTheDocument()
  })
})
