import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Retry from '../Retry';

describe('Retry', () => {
  const defaultProps = {
    onRetry: jest.fn(),
    message: 'Test error message'
  };

  const renderRetry = (props = {}) => {
    return render(<Retry {...defaultProps} {...props} />);
  };

  it('renders error message', () => {
    renderRetry();

    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('renders retry button', () => {
    renderRetry();

    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const onRetry = jest.fn();
    renderRetry({ onRetry });

    const retryButton = screen.getByRole('button', { name: /retry/i });
    await userEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('handles custom button text', () => {
    renderRetry({ buttonText: 'Try Again' });

    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('handles custom className', () => {
    renderRetry({ className: 'test-class' });

    expect(screen.getByTestId('retry-container')).toHaveClass('test-class');
  });

  it('handles custom error icon', () => {
    renderRetry({ errorIcon: 'custom-icon' });

    expect(screen.getByTestId('error-icon')).toHaveClass('custom-icon');
  });

  it('handles custom button className', () => {
    renderRetry({ buttonClassName: 'test-button-class' });

    expect(screen.getByRole('button')).toHaveClass('test-button-class');
  });
}); 