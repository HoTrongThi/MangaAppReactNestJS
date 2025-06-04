import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MangaByTag from '../MangaByTag';

describe('MangaByTag', () => {
  const mockMangas = [
    {
      id: 1,
      title: 'Test Manga 1',
      coverFileName: 'test1.jpg',
      description: 'Test Description 1',
      author: 'Test Author 1',
      status: 'ongoing'
    },
    {
      id: 2,
      title: 'Test Manga 2',
      coverFileName: 'test2.jpg',
      description: 'Test Description 2',
      author: 'Test Author 2',
      status: 'completed'
    }
  ];

  beforeEach(() => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/manga/tag/action')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMangas)
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  const renderMangaByTag = () => {
    return render(
      <BrowserRouter>
        <MangaByTag tagName="action" />
      </BrowserRouter>
    );
  };

  it('renders manga by tag correctly', async () => {
    renderMangaByTag();

    await waitFor(() => {
      expect(screen.getByText('Test Manga 1')).toBeInTheDocument();
      expect(screen.getByText('Test Manga 2')).toBeInTheDocument();
      expect(screen.getByText('Test Author 1')).toBeInTheDocument();
      expect(screen.getByText('Test Author 2')).toBeInTheDocument();
    });
  });

  it('displays tag name', () => {
    renderMangaByTag();

    expect(screen.getByText(/manga tagged with "action"/i)).toBeInTheDocument();
  });

  it('handles loading state', () => {
    renderMangaByTag();

    expect(screen.getAllByTestId('manga-card-skeleton')).toHaveLength(2);
  });

  it('handles error state', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    renderMangaByTag();

    await waitFor(() => {
      expect(screen.getByText(/error loading manga/i)).toBeInTheDocument();
    });
  });

  it('displays no results message when tag has no manga', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([])
    });

    renderMangaByTag();

    await waitFor(() => {
      expect(screen.getByText(/no manga found/i)).toBeInTheDocument();
    });
  });

  it('displays manga status correctly', async () => {
    renderMangaByTag();

    await waitFor(() => {
      expect(screen.getByText('ongoing')).toBeInTheDocument();
      expect(screen.getByText('completed')).toBeInTheDocument();
    });
  });
}); 