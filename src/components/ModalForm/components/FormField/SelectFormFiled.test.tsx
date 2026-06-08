import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import SelectFormField from './SelectFormFiled';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';

describe('SelectFormField component', () => {
  const labelText = 'Country';
  const placeholder = 'Choose country';
  const options = ['USA', 'Canada', 'Germany'];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Correctly render', () => {
    test('Label, placeholder option and list options', () => {
      render(
        <SelectFormField
          labelText={labelText}
          placeholder={placeholder}
          options={options}
        />
      );

      expect(screen.getByText(labelText)).toBeInTheDocument();

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(select).toBeRequired();
      expect(select).toHaveValue('');

      const defaultOption = screen.getByRole('option', {
        name: placeholder,
      }) as HTMLOptionElement;
      expect(defaultOption).toBeDisabled();

      options.forEach((optionText) => {
        expect(
          screen.getByRole('option', { name: optionText })
        ).toBeInTheDocument();
      });
    });

    test('Forwarded ref attaches correctly to select element', () => {
      const ref = createRef<HTMLSelectElement>();
      render(
        <SelectFormField
          labelText={labelText}
          placeholder={placeholder}
          options={options}
          ref={ref}
        />
      );

      const select = screen.getByRole('combobox');
      expect(ref.current).toBe(select);
    });

    test('Uses defaultValue on uncontrolled behavior', () => {
      render(
        <SelectFormField
          labelText={labelText}
          placeholder={placeholder}
          options={options}
        />
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('');
    });

    test('Uses value on controlled behavior', () => {
      const mockOnChange = vi.fn();
      render(
        <SelectFormField
          labelText={labelText}
          placeholder={placeholder}
          options={options}
          value="Canada"
          onChange={mockOnChange}
        />
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('Canada');
    });
  });

  describe('User interactions', () => {
    test('Triggers onChange callback when option is selected', async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      render(
        <SelectFormField
          labelText={labelText}
          placeholder={placeholder}
          options={options}
          onChange={mockOnChange}
        />
      );

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'Germany');

      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });
  });
});
