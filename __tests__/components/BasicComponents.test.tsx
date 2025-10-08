import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Simple test component for demonstration
const TestButton = ({ onClick, children }) => (
  <button onClick={onClick} data-testid="test-button">
    {children}
  </button>
)

const TestForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Form submission logic
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        placeholder="Enter email" 
        data-testid="email-input"
        required 
      />
      <input 
        type="password" 
        placeholder="Enter password" 
        data-testid="password-input"
        required 
      />
      <button type="submit" data-testid="submit-button">
        Submit
      </button>
    </form>
  )
}

describe('Basic Component Tests', () => {
  it('renders button with correct text', () => {
    const handleClick = jest.fn()
    render(<TestButton onClick={handleClick}>Click me</TestButton>)
    
    const button = screen.getByTestId('test-button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Click me')
  })

  it('calls onClick handler when button is clicked', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    
    render(<TestButton onClick={handleClick}>Click me</TestButton>)
    
    const button = screen.getByTestId('test-button')
    await user.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders form with all required fields', () => {
    render(<TestForm />)
    
    expect(screen.getByTestId('email-input')).toBeInTheDocument()
    expect(screen.getByTestId('password-input')).toBeInTheDocument()
    expect(screen.getByTestId('submit-button')).toBeInTheDocument()
  })

  it('allows user to type in form fields', async () => {
    const user = userEvent.setup()
    render(<TestForm />)
    
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    
    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })
})
