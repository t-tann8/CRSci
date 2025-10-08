import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Let's trace through exactly what happens in a test
describe('How Testing Works - Step by Step', () => {
  
  it('Step 1: Component Rendering Process', () => {
    // 1. Jest creates a virtual DOM using JSDOM
    // 2. React Testing Library renders the component
    // 3. Component gets mounted to virtual DOM
    // 4. All lifecycle methods run (useEffect, useState, etc.)
    
    const TestComponent = () => (
      <div>
        <h1>Hello World</h1>
        <button>Click me</button>
      </div>
    )
    
    // This line does A LOT behind the scenes:
    render(<TestComponent />)
    
    // What happens:
    // 1. Creates virtual DOM container
    // 2. Mounts React component
    // 3. Runs all hooks and effects
    // 4. Renders JSX to HTML
    // 5. Makes DOM queryable via screen object
    
    // Now we can query the rendered component
    expect(screen.getByText('Hello World')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
  
  it('Step 2: DOM Querying Process', () => {
    const FormComponent = () => (
      <form>
        <label htmlFor="email">Email:</label>
        <input id="email" type="email" placeholder="Enter email" />
        <button type="submit">Submit</button>
      </form>
    )
    
    render(<FormComponent />)
    
    // Different ways to query elements:
    
    // By text content
    const emailLabel = screen.getByText('Email:')
    
    // By role (semantic meaning)
    const submitButton = screen.getByRole('button', { name: 'Submit' })
    
    // By label text
    const emailInput = screen.getByLabelText('Email:')
    
    // By placeholder
    const emailInput2 = screen.getByPlaceholderText('Enter email')
    
    // All these queries work because React Testing Library
    // provides a virtual DOM that behaves like a real browser
    
    expect(emailLabel).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
    expect(emailInput).toBeInTheDocument()
  })
  
  it('Step 3: User Interaction Simulation', async () => {
    const InteractiveComponent = () => {
      const [count, setCount] = React.useState(0)
      const [text, setText] = React.useState('')
      
      return (
        <div>
          <p>Count: {count}</p>
          <button onClick={() => setCount(count + 1)}>
            Increment
          </button>
          <input 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type something"
          />
        </div>
      )
    }
    
    render(<InteractiveComponent />)
    
    // Step 3a: User event simulation
    const user = userEvent.setup()
    
    // Step 3b: Simulate clicking
    const incrementButton = screen.getByRole('button', { name: 'Increment' })
    await user.click(incrementButton)
    
    // Step 3c: Check state change
    expect(screen.getByText('Count: 1')).toBeInTheDocument()
    
    // Step 3d: Simulate typing
    const input = screen.getByPlaceholderText('Type something')
    await user.type(input, 'Hello')
    
    // Step 3e: Check input value
    expect(input).toHaveValue('Hello')
  })
  
  it('Step 4: Assertion Process', () => {
    const ConditionalComponent = ({ isVisible }) => (
      <div>
        {isVisible && <p>I am visible!</p>}
        <button>Always here</button>
      </div>
    )
    
    // Test visible state
    const { rerender } = render(<ConditionalComponent isVisible={true} />)
    expect(screen.getByText('I am visible!')).toBeInTheDocument()
    
    // Test hidden state
    rerender(<ConditionalComponent isVisible={false} />)
    expect(screen.queryByText('I am visible!')).not.toBeInTheDocument()
    
    // Button should always be there
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
