import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import CheckboxFormFiled from './CheckboxFormField';

describe('CheckboxFormFiled component', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Correctly render', () => {
    test('renders checkbox with correct label text and required attribute', () => {
      render(
        <CheckboxFormFiled
          labelText="Accept terms of use"
          onChange={mockOnChange}
        />
      );

      const checkbox = screen.getByRole('checkbox', {
        name: 'Accept terms of use',
      });

      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toBeRequired();
      expect(checkbox).not.toBeChecked();
      expect(checkbox).toHaveClass('form-field__checkbox');
    });

    test('binds ref to the input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<CheckboxFormFiled labelText="Accept terms of use" ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current).toHaveAttribute('type', 'checkbox');
    });
  });

  describe('User interactions', () => {
    test('toggles state and calls onChange handler when clicked', async () => {
      const user = userEvent.setup();
      render(
        <CheckboxFormFiled
          labelText="Accept terms of use"
          onChange={mockOnChange}
        />
      );

      const checkbox = screen.getByRole('checkbox', {
        name: 'Accept terms of use',
      });

      await user.click(checkbox);

      expect(checkbox).toBeChecked();
      expect(mockOnChange).toHaveBeenCalledTimes(1);

      await user.click(checkbox);

      expect(checkbox).not.toBeChecked();
      expect(mockOnChange).toHaveBeenCalledTimes(2);
    });
  });
});
