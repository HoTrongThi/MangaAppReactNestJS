import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LibraryItem from '../LibraryItem';

describe('LibraryItem', () => {
  const mockManga = {
    id: 1,
    title: 'Test Manga',
    coverFileName: 'test.jpg',
    description: 'Test Description',
    author: 'Test Author',
    status: 'ongoing',
    lastReadChapter: {
      id: 1,
      chapterNumber: 1,
      title: 'Chapter 1'
    }
  };

  beforeEach(() => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/library/1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockManga)
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  const renderLibraryItem = () => {
    return render(
      <BrowserRouter>
        <LibraryItem mangaId={1} />
      </BrowserRouter>
    );
  };

  it('renders manga details correctly', async () => {
    renderLibraryItem();

    await waitFor(() => {
      expect(screen.getByText(mockManga.title)).toBeInTheDocument();
      expect(screen.getByText(mockManga.author)).toBeInTheDocument();
      expect(screen.getByText(mockManga.status)).toBeInTheDocument();
    });
  });

  it('displays last read chapter information', async () => {
    renderLibraryItem();

    await waitFor(() => {
      expect(screen.getByText(/last read/i)).toBeInTheDocument();
      expect(screen.getByText(`Chapter ${mockManga.lastReadChapter.chapterNumber}`)).toBeInTheDocument();
    });
  });

  it('handles loading state', () => {
    renderLibraryItem();

    expect(screen.getByTestId('library-item-skeleton')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    renderLibraryItem();

    await waitFor(() => {
      expect(screen.getByText(/error loading manga/i)).toBeInTheDocument();
    });
  });

  it('navigates to manga page when clicked', async () => {
    renderLibraryItem();

    await waitFor(() => {
      const mangaLink = screen.getByRole('link', { name: mockManga.title });
      expect(mangaLink).toHaveAttribute('href', `/manga/${mockManga.id}`);
    });
  });

  it('navigates to last read chapter when clicked', async () => {
    renderLibraryItem();

    await waitFor(() => {
      const chapterLink = screen.getByRole('link', { name: /continue reading/i });
      expect(chapterLink).toHaveAttribute('href', `/read/${mockManga.lastReadChapter.id}`);
    });
  });
}); 