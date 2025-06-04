import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input';

describe('Input', () => {
  const defaultProps = {
    label: 'Test Label',
    name: 'test',
    type: 'text',
    placeholder: 'Test Placeholder'
  };

  const renderInput = (props = {}) => {
    return render(<Input {...defaultProps} {...props} />);
  };

  it('renders input with label', () => {
    renderInput();

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument();
  });

  it('handles text input correctly', async () => {
    const onChange = jest.fn();
    renderInput({ onChange });

    const input = screen.getByLabelText('Test Label');
    await userEvent.type(input, 'test value');

    expect(onChange).toHaveBeenCalled();
    expect(input).toHaveValue('test value');
  });

  it('displays error message when provided', () => {
    renderInput({ error: 'Test error' });

    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('applies disabled state correctly', () => {
    renderInput({ disabled: true });

    const input = screen.getByLabelText('Test Label');
    expect(input).toBeDisabled();
  });

  it('handles different input types', () => {
    renderInput({ type: 'password' });

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('handles required state', () => {
    renderInput({ required: true });

    const input = screen.getByLabelText('Test Label');
    expect(input).toBeRequired();
  });

  it('handles value prop', () => {
    renderInput({ value: 'test value' });

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveValue('test value');
  });

  it('handles className prop', () => {
    renderInput({ className: 'test-class' });

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('test-class');
  });
}); 