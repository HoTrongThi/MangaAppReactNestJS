import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AddLibrary from '../AddLibrary';

describe('AddLibrary', () => {
  const mockGenres = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Adventure' }
  ];

  beforeEach(() => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/genres')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockGenres)
        });
      }
      if (url.includes('/manga')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 1 })
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  const renderAddLibrary = () => {
    return render(
      <BrowserRouter>
        <AddLibrary />
      </BrowserRouter>
    );
  };

  it('renders add manga form correctly', async () => {
    renderAddLibrary();

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/artist/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cover image/i)).toBeInTheDocument();
  });

  it('loads and displays genres', async () => {
    renderAddLibrary();

    await waitFor(() => {
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Adventure')).toBeInTheDocument();
    });
  });

  it('handles form submission correctly', async () => {
    renderAddLibrary();

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const authorInput = screen.getByLabelText(/author/i);
    const artistInput = screen.getByLabelText(/artist/i);
    const statusSelect = screen.getByLabelText(/status/i);
    const typeSelect = screen.getByLabelText(/type/i);
    const submitButton = screen.getByRole('button', { name: /add manga/i });

    await userEvent.type(titleInput, 'Test Manga');
    await userEvent.type(descriptionInput, 'Test Description');
    await userEvent.type(authorInput, 'Test Author');
    await userEvent.type(artistInput, 'Test Artist');
    await userEvent.selectOptions(statusSelect, 'ongoing');
    await userEvent.selectOptions(typeSelect, 'manga');

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const coverInput = screen.getByLabelText(/cover image/i);
    await userEvent.upload(coverInput, file);

    await userEvent.click(submitButton);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/manga'),
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData)
      })
    );
  });

  it('handles loading state', () => {
    renderAddLibrary();

    expect(screen.getByTestId('add-library-skeleton')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    renderAddLibrary();

    await waitFor(() => {
      expect(screen.getByText(/error loading genres/i)).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    renderAddLibrary();

    const submitButton = screen.getByRole('button', { name: /add manga/i });
    await userEvent.click(submitButton);

    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    expect(screen.getByText(/author is required/i)).toBeInTheDocument();
    expect(screen.getByText(/artist is required/i)).toBeInTheDocument();
    expect(screen.getByText(/cover image is required/i)).toBeInTheDocument();
  });

  it('allows selecting multiple genres', async () => {
    renderAddLibrary();

    await waitFor(() => {
      const genreCheckboxes = screen.getAllByRole('checkbox');
      expect(genreCheckboxes).toHaveLength(2);
    });

    const actionCheckbox = screen.getByLabelText('Action');
    const adventureCheckbox = screen.getByLabelText('Adventure');

    await userEvent.click(actionCheckbox);
    await userEvent.click(adventureCheckbox);

    expect(actionCheckbox).toBeChecked();
    expect(adventureCheckbox).toBeChecked();
  });
}); 