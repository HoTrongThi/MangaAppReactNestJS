import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Volume from '../Volume';

describe('Volume', () => {
  const defaultProps = {
    volumeNumber: 1,
    chapters: [
      { id: 1, chapterNumber: 1, title: 'Chapter 1' },
      { id: 2, chapterNumber: 2, title: 'Chapter 2' }
    ]
  };

  const renderVolume = (props = {}) => {
    return render(
      <BrowserRouter>
        <Volume {...defaultProps} {...props} />
      </BrowserRouter>
    );
  };

  it('renders volume number', () => {
    renderVolume();

    expect(screen.getByText('Volume 1')).toBeInTheDocument();
  });

  it('renders chapter list', () => {
    renderVolume();

    expect(screen.getByText('Chapter 1')).toBeInTheDocument();
    expect(screen.getByText('Chapter 2')).toBeInTheDocument();
  });

  it('renders chapter links correctly', () => {
    renderVolume();

    const chapterLinks = screen.getAllByRole('link');
    expect(chapterLinks[0]).toHaveAttribute('href', '/read/1');
    expect(chapterLinks[1]).toHaveAttribute('href', '/read/2');
  });

  it('handles empty chapters', () => {
    renderVolume({ chapters: [] });

    expect(screen.getByText(/no chapters available/i)).toBeInTheDocument();
  });

  it('handles custom className', () => {
    renderVolume({ className: 'test-class' });

    expect(screen.getByTestId('volume-container')).toHaveClass('test-class');
  });

  it('handles chapter click', async () => {
    const onChapterClick = jest.fn();
    renderVolume({ onChapterClick });

    const chapterLink = screen.getByText('Chapter 1');
    await userEvent.click(chapterLink);

    expect(onChapterClick).toHaveBeenCalledWith(1);
  });

  it('displays chapter numbers correctly', () => {
    renderVolume();

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('handles custom volume title', () => {
    renderVolume({ volumeTitle: 'Special Volume' });

    expect(screen.getByText('Special Volume')).toBeInTheDocument();
  });
}); 