import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ReadChapter from '../ReadChapter';

describe('ReadChapter', () => {
  const mockChapter = {
    id: 1,
    chapterNumber: 1,
    title: 'Chapter 1',
    pages: [
      { id: 1, pageNumber: 1, imageUrl: 'page1.jpg' },
      { id: 2, pageNumber: 2, imageUrl: 'page2.jpg' }
    ],
    manga: {
      id: 1,
      title: 'Test Manga'
    }
  };

  beforeEach(() => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/chapters/1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockChapter)
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  const renderReadChapter = () => {
    return render(
      <BrowserRouter>
        <ReadChapter />
      </BrowserRouter>
    );
  };

  it('renders chapter information correctly', async () => {
    renderReadChapter();

    await waitFor(() => {
      expect(screen.getByText(`Chapter ${mockChapter.chapterNumber}`)).toBeInTheDocument();
      expect(screen.getByText(mockChapter.title)).toBeInTheDocument();
      expect(screen.getByText(mockChapter.manga.title)).toBeInTheDocument();
    });
  });

  it('displays chapter pages', async () => {
    renderReadChapter();

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('src', 'page1.jpg');
      expect(images[1]).toHaveAttribute('src', 'page2.jpg');
    });
  });

  it('handles loading state', () => {
    renderReadChapter();

    expect(screen.getByTestId('chapter-loading')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    renderReadChapter();

    await waitFor(() => {
      expect(screen.getByText(/error loading chapter/i)).toBeInTheDocument();
    });
  });

  it('handles navigation between pages', async () => {
    renderReadChapter();

    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();

    const prevButton = screen.getByRole('button', { name: /previous/i });
    await userEvent.click(prevButton);

    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });

  it('saves reading progress', async () => {
    localStorage.setItem('token', 'test-token');
    renderReadChapter();

    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/history'),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"pageNumber":2')
      })
    );
  });
}); 