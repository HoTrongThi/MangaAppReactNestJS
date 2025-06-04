import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Comments from '../Comments';

describe('Comments', () => {
  const mockComments = [
    {
      id: 1,
      content: 'Test comment 1',
      user: {
        id: 1,
        username: 'user1'
      },
      createdAt: '2024-03-20T10:00:00Z'
    },
    {
      id: 2,
      content: 'Test comment 2',
      user: {
        id: 2,
        username: 'user2'
      },
      createdAt: '2024-03-19T10:00:00Z'
    }
  ];

  beforeEach(() => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/comments')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockComments)
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  const renderComments = () => {
    return render(
      <BrowserRouter>
        <Comments mangaId={1} />
      </BrowserRouter>
    );
  };

  it('renders comments correctly', async () => {
    renderComments();

    await waitFor(() => {
      expect(screen.getByText('Test comment 1')).toBeInTheDocument();
      expect(screen.getByText('Test comment 2')).toBeInTheDocument();
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('user2')).toBeInTheDocument();
    });
  });

  it('displays comment dates correctly', async () => {
    renderComments();

    await waitFor(() => {
      expect(screen.getByText(/march 20, 2024/i)).toBeInTheDocument();
      expect(screen.getByText(/march 19, 2024/i)).toBeInTheDocument();
    });
  });

  it('handles loading state', () => {
    renderComments();

    expect(screen.getAllByTestId('comment-skeleton')).toHaveLength(2);
  });

  it('handles error state', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    renderComments();

    await waitFor(() => {
      expect(screen.getByText(/error loading comments/i)).toBeInTheDocument();
    });
  });

  it('displays no comments message when empty', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([])
    });

    renderComments();

    await waitFor(() => {
      expect(screen.getByText(/no comments yet/i)).toBeInTheDocument();
    });
  });

  it('allows adding new comment when authenticated', async () => {
    localStorage.setItem('token', 'test-token');
    renderComments();

    const commentInput = screen.getByPlaceholderText(/write a comment/i);
    const submitButton = screen.getByRole('button', { name: /post/i });

    await userEvent.type(commentInput, 'New test comment');
    await userEvent.click(submitButton);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/comments'),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('New test comment')
      })
    );
  });

  it('shows login prompt when trying to comment while not authenticated', async () => {
    renderComments();

    const commentInput = screen.getByPlaceholderText(/write a comment/i);
    await userEvent.click(commentInput);

    expect(screen.getByText(/please log in to comment/i)).toBeInTheDocument();
  });
}); 