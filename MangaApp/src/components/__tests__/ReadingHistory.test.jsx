import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ReadingHistory from '../ReadingHistory';

describe('ReadingHistory', () => {
  const mockHistory = [
    {
      id: 1,
      manga: {
        id: 1,
        title: 'Test Manga 1',
        coverFileName: 'test1.jpg'
      },
      chapter: {
        id: 1,
        chapterNumber: 1,
        title: 'Chapter 1'
      },
      readAt: '2024-03-20T10:00:00Z'
    },
    {
      id: 2,
      manga: {
        id: 2,
        title: 'Test Manga 2',
        coverFileName: 'test2.jpg'
      },
      chapter: {
        id: 2,
        chapterNumber: 2,
        title: 'Chapter 2'
      },
      readAt: '2024-03-19T10:00:00Z'
    }
  ];

  beforeEach(() => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/history')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockHistory)
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  const renderReadingHistory = () => {
    return render(
      <BrowserRouter>
        <ReadingHistory />
      </BrowserRouter>
    );
  };

  it('renders reading history items correctly', async () => {
    renderReadingHistory();

    await waitFor(() => {
      expect(screen.getByText('Test Manga 1')).toBeInTheDocument();
      expect(screen.getByText('Test Manga 2')).toBeInTheDocument();
      expect(screen.getByText('Chapter 1')).toBeInTheDocument();
      expect(screen.getByText('Chapter 2')).toBeInTheDocument();
    });
  });

  it('displays read dates correctly', async () => {
    renderReadingHistory();

    await waitFor(() => {
      expect(screen.getByText(/march 20, 2024/i)).toBeInTheDocument();
      expect(screen.getByText(/march 19, 2024/i)).toBeInTheDocument();
    });
  });

  it('handles loading state', () => {
    renderReadingHistory();

    expect(screen.getAllByTestId('history-item-skeleton')).toHaveLength(2);
  });

  it('handles error state', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    renderReadingHistory();

    await waitFor(() => {
      expect(screen.getByText(/error loading history/i)).toBeInTheDocument();
    });
  });

  it('displays no history message when empty', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([])
    });

    renderReadingHistory();

    await waitFor(() => {
      expect(screen.getByText(/no reading history/i)).toBeInTheDocument();
    });
  });

  it('navigates to manga page when clicked', async () => {
    renderReadingHistory();

    await waitFor(() => {
      const mangaLinks = screen.getAllByRole('link', { name: /test manga/i });
      expect(mangaLinks[0]).toHaveAttribute('href', '/manga/1');
      expect(mangaLinks[1]).toHaveAttribute('href', '/manga/2');
    });
  });

  it('navigates to chapter page when clicked', async () => {
    renderReadingHistory();

    await waitFor(() => {
      const chapterLinks = screen.getAllByRole('link', { name: /chapter/i });
      expect(chapterLinks[0]).toHaveAttribute('href', '/read/1');
      expect(chapterLinks[1]).toHaveAttribute('href', '/read/2');
    });
  });
}); 