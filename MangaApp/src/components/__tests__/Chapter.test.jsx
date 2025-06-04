import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Chapter from '../Chapter';

describe('Chapter', () => {
  const defaultProps = {
    id: 1,
    chapterNumber: 1,
    title: 'Chapter 1',
    uploadDate: '2024-03-20T10:00:00Z'
  };

  const renderChapter = (props = {}) => {
    return render(
      <BrowserRouter>
        <Chapter {...defaultProps} {...props} />
      </BrowserRouter>
    );
  };

  it('renders chapter information correctly', () => {
    renderChapter();

    expect(screen.getByText('Chapter 1')).toBeInTheDocument();
    expect(screen.getByText('Chapter 1')).toBeInTheDocument();
    expect(screen.getByText(/march 20, 2024/i)).toBeInTheDocument();
  });

  it('renders as link when clickable is true', () => {
    renderChapter({ clickable: true });

    const chapterLink = screen.getByRole('link', { name: /chapter 1/i });
    expect(chapterLink).toHaveAttribute('href', '/read/1');
  });

  it('renders as div when clickable is false', () => {
    renderChapter({ clickable: false });

    expect(screen.getByText('Chapter 1')).toHaveAttribute('role', 'chapter');
  });

  it('handles onClick when provided', async () => {
    const onClick = jest.fn();
    renderChapter({ onClick });

    const chapter = screen.getByText('Chapter 1');
    await userEvent.click(chapter);

    expect(onClick).toHaveBeenCalledWith(1);
  });

  it('handles custom className', () => {
    renderChapter({ className: 'test-class' });

    const chapter = screen.getByText('Chapter 1');
    expect(chapter).toHaveClass('test-class');
  });

  it('handles active state', () => {
    renderChapter({ active: true });

    const chapter = screen.getByText('Chapter 1');
    expect(chapter).toHaveClass('active');
  });

  it('handles disabled state', () => {
    renderChapter({ disabled: true });

    const chapter = screen.getByText('Chapter 1');
    expect(chapter).toHaveClass('disabled');
  });

  it('handles custom chapter title', () => {
    renderChapter({ title: 'Special Chapter' });

    expect(screen.getByText('Special Chapter')).toBeInTheDocument();
  });

  it('handles custom date format', () => {
    renderChapter({ dateFormat: 'DD/MM/YYYY' });

    expect(screen.getByText('20/03/2024')).toBeInTheDocument();
  });
}); 