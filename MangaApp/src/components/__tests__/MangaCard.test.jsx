import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MangaCard from '../MangaCard';

describe('MangaCard', () => {
  const mockManga = {
    id: 1,
    title: 'Test Manga',
    coverFileName: 'test-cover.jpg',
    description: 'Test Description',
    author: 'Test Author',
    status: 'ongoing'
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders manga information correctly', () => {
    render(<MangaCard manga={mockManga} onClick={mockOnClick} />);

    // Check if manga title is displayed
    expect(screen.getByText(mockManga.title)).toBeInTheDocument();

    // Check if author is displayed
    expect(screen.getByText(mockManga.author)).toBeInTheDocument();

    // Check if status is displayed
    expect(screen.getByText(mockManga.status)).toBeInTheDocument();

    // Check if cover image is rendered with correct src
    const coverImage = screen.getByRole('img');
    expect(coverImage).toHaveAttribute('src', expect.stringContaining(mockManga.coverFileName));
  });

  it('calls onClick handler when clicked', async () => {
    render(<MangaCard manga={mockManga} onClick={mockOnClick} />);

    // Click on the card
    await userEvent.click(screen.getByRole('article'));

    // Check if onClick was called with correct manga
    expect(mockOnClick).toHaveBeenCalledWith(mockManga);
  });

  it('displays loading state when manga data is not available', () => {
    render(<MangaCard manga={null} onClick={mockOnClick} />);

    // Check if loading skeleton is displayed
    expect(screen.getByTestId('manga-card-skeleton')).toBeInTheDocument();
  });
}); 