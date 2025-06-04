import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MangaSearchResult from '../MangaSearchResult';

describe('MangaSearchResult', () => {
  const mockSearchResults = [
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
      if (url.includes('/manga/search')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSearchResults)
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  const renderSearchResult = () => {
    return render(
      <BrowserRouter>
        <MangaSearchResult searchQuery="test" />
      </BrowserRouter>
    );
  };

  it('renders search results correctly', async () => {
    renderSearchResult();

    await waitFor(() => {
      expect(screen.getByText('Test Manga 1')).toBeInTheDocument();
      expect(screen.getByText('Test Manga 2')).toBeInTheDocument();
      expect(screen.getByText('Test Author 1')).toBeInTheDocument();
      expect(screen.getByText('Test Author 2')).toBeInTheDocument();
    });
  });

  it('displays search query', () => {
    renderSearchResult();

    expect(screen.getByText(/search results for "test"/i)).toBeInTheDocument();
  });

  it('handles loading state', () => {
    renderSearchResult();

    expect(screen.getAllByTestId('manga-card-skeleton')).toHaveLength(2);
  });

  it('handles error state', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    renderSearchResult();

    await waitFor(() => {
      expect(screen.getByText(/error loading search results/i)).toBeInTheDocument();
    });
  });

  it('displays no results message when search returns empty', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([])
    });

    renderSearchResult();

    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
  });

  it('displays manga status correctly', async () => {
    renderSearchResult();

    await waitFor(() => {
      expect(screen.getByText('ongoing')).toBeInTheDocument();
      expect(screen.getByText('completed')).toBeInTheDocument();
    });
  });
}); 