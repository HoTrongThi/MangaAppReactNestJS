import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Tag from '../Tag';

describe('Tag', () => {
  const defaultProps = {
    name: 'Action',
    id: 1
  };

  const renderTag = (props = {}) => {
    return render(
      <BrowserRouter>
        <Tag {...defaultProps} {...props} />
      </BrowserRouter>
    );
  };

  it('renders tag name', () => {
    renderTag();

    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('renders as link when clickable is true', () => {
    renderTag({ clickable: true });

    const tagLink = screen.getByRole('link', { name: 'Action' });
    expect(tagLink).toHaveAttribute('href', '/tag/1');
  });

  it('renders as span when clickable is false', () => {
    renderTag({ clickable: false });

    expect(screen.getByText('Action')).toHaveAttribute('role', 'tag');
  });

  it('handles onClick when provided', async () => {
    const onClick = jest.fn();
    renderTag({ onClick });

    const tag = screen.getByText('Action');
    await userEvent.click(tag);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('handles custom className', () => {
    renderTag({ className: 'test-class' });

    const tag = screen.getByText('Action');
    expect(tag).toHaveClass('test-class');
  });

  it('handles active state', () => {
    renderTag({ active: true });

    const tag = screen.getByText('Action');
    expect(tag).toHaveClass('active');
  });

  it('handles disabled state', () => {
    renderTag({ disabled: true });

    const tag = screen.getByText('Action');
    expect(tag).toHaveClass('disabled');
  });

  it('handles custom color', () => {
    renderTag({ color: 'blue' });

    const tag = screen.getByText('Action');
    expect(tag).toHaveStyle({ backgroundColor: 'blue' });
  });
}); 