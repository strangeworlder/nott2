import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextArea } from './TextArea';

describe('TextArea', () => {
  it('renders a textarea element', () => {
    render(<TextArea value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toBeTruthy();
    expect(screen.getByRole('textbox').tagName.toLowerCase()).toBe('textarea');
  });

  it('displays the current value', () => {
    render(<TextArea value="hello world" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('hello world');
  });

  it('calls onChange with the new value', () => {
    const handler = vi.fn();
    render(<TextArea value="" onChange={handler} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'new text' } });
    expect(handler).toHaveBeenCalledWith('new text');
  });

  it('renders a label when provided', () => {
    render(<TextArea value="" onChange={() => {}} label="Description" />);
    expect(screen.getByLabelText('Description')).toBeTruthy();
  });

  it('renders a required indicator when required', () => {
    render(<TextArea value="" onChange={() => {}} label="Bio" required />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('required');
    expect(textarea).toHaveAttribute('aria-required', 'true');
  });

  it('renders placeholder text', () => {
    render(<TextArea value="" onChange={() => {}} placeholder="Write your story..." />);
    expect(screen.getByPlaceholderText('Write your story...')).toBeTruthy();
  });

  it('renders helper text', () => {
    render(<TextArea value="" onChange={() => {}} helperText="Markdown supported" />);
    expect(screen.getByText('Markdown supported')).toBeTruthy();
  });

  it('renders error text and sets aria-invalid', () => {
    render(<TextArea value="" onChange={() => {}} error="Too short" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Too short')).toBeTruthy();
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('prioritises error over helper text', () => {
    render(
      <TextArea
        value=""
        onChange={() => {}}
        helperText="Write something"
        error="Field cannot be empty"
      />,
    );
    expect(screen.getByText('Field cannot be empty')).toBeTruthy();
    expect(screen.queryByText('Write something')).toBeNull();
  });

  it('renders character count when maxLength is set', () => {
    render(<TextArea value="abcdef" onChange={() => {}} maxLength={100} />);
    expect(screen.getByText('6/100')).toBeTruthy();
  });

  it('applies the rows attribute', () => {
    render(<TextArea value="" onChange={() => {}} rows={8} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '8');
  });

  it('defaults to 4 rows', () => {
    render(<TextArea value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '4');
  });

  it('disables the textarea when disabled is true', () => {
    render(<TextArea value="" onChange={() => {}} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('forwards an explicit id', () => {
    const { container } = render(<TextArea value="" onChange={() => {}} id="my-textarea" />);
    expect(container.querySelector('#my-textarea')).toBeTruthy();
  });

  it('calls onBlur when the textarea loses focus', () => {
    const handler = vi.fn();
    render(<TextArea value="" onChange={() => {}} onBlur={handler} />);
    fireEvent.blur(screen.getByRole('textbox'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('calls onFocus when the textarea gains focus', () => {
    const handler = vi.fn();
    render(<TextArea value="" onChange={() => {}} onFocus={handler} />);
    fireEvent.focus(screen.getByRole('textbox'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('calls onKeyDown on key events', () => {
    const handler = vi.fn();
    render(<TextArea value="" onChange={() => {}} onKeyDown={handler} />);
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    expect(handler).toHaveBeenCalledOnce();
  });
});
