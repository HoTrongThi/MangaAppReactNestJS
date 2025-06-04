import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';

describe('Home', () => {
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
      if (url.includes('/manga/latest')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMangas)
        });
      }
      if (url.includes('/manga/popular')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMangas)
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  const renderHome = () => {
    return render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  };

  it('renders home page sections correctly', () => {
    renderHome();

    expect(screen.getByText(/latest manga/i)).toBeInTheDocument();
    expect(screen.getByText(/popular manga/i)).toBeInTheDocument();
  });

  it('loads and displays latest manga', async () => {
    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Test Manga 1')).toBeInTheDocument();
      expect(screen.getByText('Test Manga 2')).toBeInTheDocument();
    });
  });

  it('loads and displays popular manga', async () => {
    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Test Manga 1')).toBeInTheDocument();
      expect(screen.getByText('Test Manga 2')).toBeInTheDocument();
    });
  });

  it('handles loading state', () => {
    renderHome();

    expect(screen.getAllByTestId('manga-card-skeleton')).toHaveLength(4); // 2 sections * 2 items
  });

  it('handles error state', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    renderHome();

    await waitFor(() => {
      expect(screen.getByText(/error loading manga/i)).toBeInTheDocument();
    });
  });

  it('displays manga details correctly', async () => {
    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Test Author 1')).toBeInTheDocument();
      expect(screen.getByText('ongoing')).toBeInTheDocument();
      expect(screen.getByText('Test Author 2')).toBeInTheDocument();
      expect(screen.getByText('completed')).toBeInTheDocument();
    });
  });
}); 