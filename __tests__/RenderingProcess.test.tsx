import React from 'react'
import { render, screen } from '@testing-library/react'

// Let's trace exactly what happens during rendering
describe('Exact Rendering Process', () => {
  
  it('What happens when render() is called', () => {
    console.log('🔍 BEFORE render() - No DOM exists yet')
    
    const TestComponent = () => {
      console.log('🔍 Component function called')
      return (
        <div>
          <h1>Hello World</h1>
          <button onClick={() => console.log('Button clicked!')}>
            Click me
          </button>
        </div>
      )
    }
    
    // This single line does A LOT:
    const { container } = render(<TestComponent />)
    
    console.log('🔍 AFTER render() - Virtual DOM created')
    console.log('🔍 Container HTML:', container.innerHTML)
    
    // What happened behind the scenes:
    // 1. Jest created a virtual DOM container
    // 2. React mounted the component
    // 3. All hooks ran (useState, useEffect, etc.)
    // 4. JSX was converted to HTML
    // 5. Component was attached to virtual DOM
    
    // Now we can query the rendered HTML
    expect(screen.getByText('Hello World')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
  
  it('How DOM queries work', () => {
    const FormComponent = () => (
      <form>
        <label htmlFor="email">Email Address</label>
        <input 
          id="email" 
          type="email" 
          placeholder="Enter your email"
          data-testid="email-input"
        />
        <button type="submit">Submit Form</button>
      </form>
    )
    
    render(<FormComponent />)
    
    // Different query methods and how they work:
    
    // 1. By text content (searches all text nodes)
    const emailLabel = screen.getByText('Email Address')
    console.log('Found by text:', emailLabel.textContent)
    
    // 2. By role (uses accessibility tree)
    const submitButton = screen.getByRole('button', { name: 'Submit Form' })
    console.log('Found by role:', submitButton.textContent)
    
    // 3. By label (follows label associations)
    const emailInput = screen.getByLabelText('Email Address')
    console.log('Found by label:', emailInput.id)
    
    // 4. By placeholder (searches placeholder attribute)
    const emailInput2 = screen.getByPlaceholderText('Enter your email')
    console.log('Found by placeholder:', emailInput2.placeholder)
    
    // 5. By test ID (most reliable for testing)
    const emailInput3 = screen.getByTestId('email-input')
    console.log('Found by test ID:', emailInput3.id)
    
    // All these methods work because React Testing Library
    // provides a virtual DOM that behaves like a real browser
    
    expect(emailLabel).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
    expect(emailInput).toBeInTheDocument()
  })
})
