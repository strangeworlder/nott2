import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextField } from './TextField';

describe('TextField', () => {
  it('renders an input element', () => {
    render(<TextField value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it('displays the current value', () => {
    render(<TextField value="hello" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('hello');
  });

  it('calls onChange with the new value', () => {
    const handler = vi.fn();
    render(<TextField value="" onChange={handler} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'world' } });
    expect(handler).toHaveBeenCalledWith('world');
  });

  it('renders a label when provided', () => {
    render(<TextField value="" onChange={() => {}} label="Username" />);
    expect(screen.getByLabelText('Username')).toBeTruthy();
  });

  it('renders a required indicator when required', () => {
    render(<TextField value="" onChange={() => {}} label="Email" required />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  it('renders placeholder text', () => {
    render(<TextField value="" onChange={() => {}} placeholder="Type here..." />);
    expect(screen.getByPlaceholderText('Type here...')).toBeTruthy();
  });

  it('renders helper text', () => {
    render(<TextField value="" onChange={() => {}} helperText="Enter your name" />);
    expect(screen.getByText('Enter your name')).toBeTruthy();
  });

  it('renders error text and sets aria-invalid', () => {
    render(<TextField value="" onChange={() => {}} error="This field is required" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('This field is required')).toBeTruthy();
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('prioritises error over helper text', () => {
    render(
      <TextField
        value=""
        onChange={() => {}}
        helperText="Helpful hint"
        error="Something broke"
      />,
    );
    expect(screen.getByText('Something broke')).toBeTruthy();
    expect(screen.queryByText('Helpful hint')).toBeNull();
  });

  it('renders character count when maxLength is set', () => {
    render(<TextField value="abc" onChange={() => {}} maxLength={10} />);
    expect(screen.getByText('3/10')).toBeTruthy();
  });

  it('disables the input when disabled is true', () => {
    render(<TextField value="" onChange={() => {}} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('sets the html type attribute', () => {
    render(<TextField value="" onChange={() => {}} type="email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('forwards an explicit id', () => {
    const { container } = render(<TextField value="" onChange={() => {}} id="my-field" />);
    expect(container.querySelector('#my-field')).toBeTruthy();
  });

  it('calls onBlur when the input loses focus', () => {
    const handler = vi.fn();
    render(<TextField value="" onChange={() => {}} onBlur={handler} />);
    fireEvent.blur(screen.getByRole('textbox'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('calls onFocus when the input gains focus', () => {
    const handler = vi.fn();
    render(<TextField value="" onChange={() => {}} onFocus={handler} />);
    fireEvent.focus(screen.getByRole('textbox'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('calls onKeyDown on key events', () => {
    const handler = vi.fn();
    render(<TextField value="" onChange={() => {}} onKeyDown={handler} />);
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    expect(handler).toHaveBeenCalledOnce();
  });
});
