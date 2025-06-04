import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MangaPage from '../MangaPage';

describe('MangaPage', () => {
  const mockManga = {
    id: 1,
    title: 'Test Manga',
    coverFileName: 'test.jpg',
    description: 'Test Description',
    author: 'Test Author',
    artist: 'Test Artist',
    status: 'ongoing',
    type: 'manga',
    genres: [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Adventure' }
    ],
    chapters: [
      { id: 1, chapterNumber: 1, title: 'Chapter 1' },
      { id: 2, chapterNumber: 2, title: 'Chapter 2' }
    ]
  };

  beforeEach(() => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/manga/1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockManga)
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  const renderMangaPage = () => {
    return render(
      <BrowserRouter>
        <MangaPage />
      </BrowserRouter>
    );
  };

  it('renders manga details correctly', async () => {
    renderMangaPage();

    await waitFor(() => {
      expect(screen.getByText(mockManga.title)).toBeInTheDocument();
      expect(screen.getByText(mockManga.description)).toBeInTheDocument();
      expect(screen.getByText(mockManga.author)).toBeInTheDocument();
      expect(screen.getByText(mockManga.artist)).toBeInTheDocument();
      expect(screen.getByText(mockManga.status)).toBeInTheDocument();
    });
  });

  it('displays manga genres', async () => {
    renderMangaPage();

    await waitFor(() => {
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Adventure')).toBeInTheDocument();
    });
  });

  it('displays manga chapters', async () => {
    renderMangaPage();

    await waitFor(() => {
      expect(screen.getByText('Chapter 1')).toBeInTheDocument();
      expect(screen.getByText('Chapter 2')).toBeInTheDocument();
    });
  });

  it('handles loading state', () => {
    renderMangaPage();

    expect(screen.getByTestId('manga-page-skeleton')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    renderMangaPage();

    await waitFor(() => {
      expect(screen.getByText(/error loading manga/i)).toBeInTheDocument();
    });
  });
}); 