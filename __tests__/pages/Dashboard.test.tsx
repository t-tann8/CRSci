import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dashboard } from '@/app/modules/dashboard/Dashboard'

// Mock the dashboard data
const mockDashboardData = {
  name: 'Test User',
  isTeacher: false,
  AdminSummaries: {
    usersCount: 150,
    videosCount: 45,
    resourcesCount: 120,
    usersJoining: [
      { name: 'John Doe', email: 'john@example.com', createdAt: '2024-01-15' },
      { name: 'Jane Smith', email: 'jane@example.com', createdAt: '2024-01-14' },
    ],
  },
  UserAPIData: {
    users: [
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'student' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'teacher' },
    ],
    totalUsers: 2,
    totalPages: 1,
  },
  ResourceAPIData: {
    resources: [
      { id: '1', name: 'JavaScript Basics', type: 'video', status: 'active' },
      { id: '2', name: 'React Fundamentals', type: 'video', status: 'active' },
    ],
    totalResources: 2,
    totalPages: 1,
  },
  StandardOverview: [
    {
      id: '1',
      name: 'JavaScript Fundamentals',
      courseLength: '2 weeks',
      totalResources: 5,
      completedResources: 3,
      progress: 60,
    },
  ],
}

describe('Dashboard Integration Tests', () => {
  it('renders admin dashboard with correct data', () => {
    render(<Dashboard {...mockDashboardData} />)
    
    // Check greeting
    expect(screen.getByText(/hello, test user!/i)).toBeInTheDocument()
    
    // Check summary cards
    expect(screen.getByText('150')).toBeInTheDocument() // Total Users
    expect(screen.getByText('45')).toBeInTheDocument()  // Video Uploads
    expect(screen.getByText('120')).toBeInTheDocument() // Total Resources
    
    // Check navigation links
    expect(screen.getByRole('link', { name: /total users/i })).toHaveAttribute('href', '/admin/users')
    expect(screen.getByRole('link', { name: /video uploads/i })).toHaveAttribute('href', '/admin/video')
    expect(screen.getByRole('link', { name: /total resources/i })).toHaveAttribute('href', '/admin/resources')
  })

  it('displays recent users joining', () => {
    render(<Dashboard {...mockDashboardData} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
  })

  it('shows learning progress for standards', () => {
    render(<Dashboard {...mockDashboardData} />)
    
    expect(screen.getByText('JavaScript Fundamentals')).toBeInTheDocument()
    expect(screen.getByText('2 weeks')).toBeInTheDocument()
    expect(screen.getByText('60%')).toBeInTheDocument()
  })

  it('handles empty data gracefully', () => {
    const emptyData = {
      ...mockDashboardData,
      AdminSummaries: {
        usersCount: 0,
        videosCount: 0,
        resourcesCount: 0,
        usersJoining: [],
      },
      StandardOverview: [],
    }
    
    render(<Dashboard {...emptyData} />)
    
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText(/no learning assigned/i)).toBeInTheDocument()
  })

  it('navigates to different sections when cards are clicked', async () => {
    const user = userEvent.setup()
    render(<Dashboard {...mockDashboardData} />)
    
    const usersCard = screen.getByRole('link', { name: /total users/i })
    await user.click(usersCard)
    
    // In a real test, you'd verify navigation occurred
    // This would typically be tested with a router mock
  })
})
