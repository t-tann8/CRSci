import { validationError } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('validationError', () => {
    it('should return error message for required field', () => {
      const result = validationError('email', 'required')
      expect(result).toBe('Email is required')
    })

    it('should return error message for invalid email', () => {
      const result = validationError('email', 'invalid')
      expect(result).toBe('Please enter a valid email address')
    })

    it('should return error message for password too short', () => {
      const result = validationError('password', 'minLength')
      expect(result).toBe('Password must be at least 8 characters long')
    })

    it('should return error message for password mismatch', () => {
      const result = validationError('password', 'mismatch')
      expect(result).toBe('Passwords do not match')
    })

    it('should return generic error for unknown field', () => {
      const result = validationError('unknownField', 'required')
      expect(result).toBe('This field is required')
    })

    it('should return generic error for unknown error type', () => {
      const result = validationError('email', 'unknownError')
      expect(result).toBe('Invalid email')
    })
  })
})
