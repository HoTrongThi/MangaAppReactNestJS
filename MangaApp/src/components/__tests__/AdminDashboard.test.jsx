import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../AdminDashboard';

describe('AdminDashboard', () => {
  const mockStats = {
    totalManga: 100,
    totalUsers: 50,
    totalComments: 200,
    recentUploads: [
      {
        id: 1,
        title: 'Test Manga 1',
        uploadDate: '2024-03-20T10:00:00Z'
      },
      {
        id: 2,
        title: 'Test Manga 2',
        uploadDate: '2024-03-19T10:00:00Z'
      }
    ]
  };

  beforeEach(() => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/admin/stats')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockStats)
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  const renderAdminDashboard = () => {
    return render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
  };

  it('renders admin dashboard stats correctly', async () => {
    renderAdminDashboard();

    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument(); // Total Manga
      expect(screen.getByText('50')).toBeInTheDocument(); // Total Users
      expect(screen.getByText('200')).toBeInTheDocument(); // Total Comments
    });
  });

  it('displays recent uploads correctly', async () => {
    renderAdminDashboard();

    await waitFor(() => {
      expect(screen.getByText('Test Manga 1')).toBeInTheDocument();
      expect(screen.getByText('Test Manga 2')).toBeInTheDocument();
      expect(screen.getByText(/march 20, 2024/i)).toBeInTheDocument();
      expect(screen.getByText(/march 19, 2024/i)).toBeInTheDocument();
    });
  });

  it('handles loading state', () => {
    renderAdminDashboard();

    expect(screen.getByTestId('admin-dashboard-skeleton')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    renderAdminDashboard();

    await waitFor(() => {
      expect(screen.getByText(/error loading dashboard/i)).toBeInTheDocument();
    });
  });

  it('displays admin navigation links', () => {
    renderAdminDashboard();

    expect(screen.getByRole('link', { name: /add manga/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /manage users/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /manage comments/i })).toBeInTheDocument();
  });

  it('navigates to add manga page', () => {
    renderAdminDashboard();

    const addMangaLink = screen.getByRole('link', { name: /add manga/i });
    expect(addMangaLink).toHaveAttribute('href', '/admin/add-manga');
  });

  it('navigates to manage users page', () => {
    renderAdminDashboard();

    const manageUsersLink = screen.getByRole('link', { name: /manage users/i });
    expect(manageUsersLink).toHaveAttribute('href', '/admin/users');
  });

  it('navigates to manage comments page', () => {
    renderAdminDashboard();

    const manageCommentsLink = screen.getByRole('link', { name: /manage comments/i });
    expect(manageCommentsLink).toHaveAttribute('href', '/admin/comments');
  });
}); 