import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VideoViewing } from '@/app/components/common/VideoViewing'

// Mock react-player
jest.mock('react-player', () => ({
  __esModule: true,
  default: ({ onProgress, onDuration, ...props }) => (
    <div data-testid="video-player" {...props}>
      <button 
        data-testid="progress-trigger" 
        onClick={() => onProgress({ playedSeconds: 5 })}
      >
        Trigger Progress
      </button>
      <button 
        data-testid="duration-trigger" 
        onClick={() => onDuration(120)}
      >
        Set Duration
      </button>
    </div>
  ),
}))

const mockQuestions = [
  {
    id: '1',
    statement: 'What is JavaScript?',
    options: ['Programming Language', 'Markup Language', 'Database', 'Framework'],
    correctOption: 'Programming Language',
    totalMarks: 10,
    popUpTime: '05:00',
  },
  {
    id: '2',
    statement: 'What is React?',
    options: ['Library', 'Framework', 'Language', 'Database'],
    correctOption: 'Library',
    totalMarks: 10,
    popUpTime: '10:00',
  },
]

const mockTopics = {
  'Introduction': '0:00',
  'Main Content': '5:00',
  'Conclusion': '10:00',
}

const defaultProps = {
  videoURL: 'https://example.com/video.mp4',
  thumbnailURL: 'https://via.placeholder.com/300x200',
  topics: mockTopics,
  questions: mockQuestions,
}

describe('VideoViewing Component', () => {
  it('renders video player with correct props', () => {
    render(<VideoViewing {...defaultProps} />)
    
    const videoPlayer = screen.getByTestId('video-player')
    expect(videoPlayer).toBeInTheDocument()
    expect(videoPlayer).toHaveAttribute('url', defaultProps.videoURL)
  })

  it('displays video topics navigation', () => {
    render(<VideoViewing {...defaultProps} />)
    
    expect(screen.getByText('Introduction')).toBeInTheDocument()
    expect(screen.getByText('Main Content')).toBeInTheDocument()
    expect(screen.getByText('Conclusion')).toBeInTheDocument()
  })

  it('handles topic navigation clicks', async () => {
    const user = userEvent.setup()
    render(<VideoViewing {...defaultProps} />)
    
    const mainContentButton = screen.getByText('Main Content')
    await user.click(mainContentButton)
    
    // Verify that the video seeks to the correct time
    // This would be tested through the onSeek callback
  })

  it('shows question popup at correct time', async () => {
    render(<VideoViewing {...defaultProps} />)
    
    const progressTrigger = screen.getByTestId('progress-trigger')
    fireEvent.click(progressTrigger)
    
    await waitFor(() => {
      expect(screen.getByText('What is JavaScript?')).toBeInTheDocument()
    })
  })

  it('handles question answer submission', async () => {
    const user = userEvent.setup()
    render(<VideoViewing {...defaultProps} />)
    
    // Trigger question popup
    const progressTrigger = screen.getByTestId('progress-trigger')
    fireEvent.click(progressTrigger)
    
    await waitFor(() => {
      expect(screen.getByText('What is JavaScript?')).toBeInTheDocument()
    })
    
    // Select an answer
    const answerOption = screen.getByText('Programming Language')
    await user.click(answerOption)
    
    // Submit answer
    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)
    
    // Verify answer was submitted
    await waitFor(() => {
      expect(screen.getByText(/answer submitted/i)).toBeInTheDocument()
    })
  })

  it('displays video progress correctly', () => {
    render(<VideoViewing {...defaultProps} />)
    
    const progressTrigger = screen.getByTestId('progress-trigger')
    fireEvent.click(progressTrigger)
    
    // Verify progress is tracked
    expect(screen.getByText(/5 seconds/i)).toBeInTheDocument()
  })

  it('handles video completion', async () => {
    render(<VideoViewing {...defaultProps} />)
    
    const durationTrigger = screen.getByTestId('duration-trigger')
    fireEvent.click(durationTrigger)
    
    // Simulate video completion
    const progressTrigger = screen.getByTestId('progress-trigger')
    fireEvent.click(progressTrigger)
    
    await waitFor(() => {
      expect(screen.getByText(/video completed/i)).toBeInTheDocument()
    })
  })
})
