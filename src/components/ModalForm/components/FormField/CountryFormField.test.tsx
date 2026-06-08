import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { useSelector } from 'react-redux';
import CountyFormField from './CountryFormField';

vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
}));

vi.mock('../../../ValidationError/ValidationError', () => ({
  default: ({ errorText }: { errorText: string }) => (
    <div data-testid="mock-error">{errorText}</div>
  ),
}));

describe('CountyFormField component', () => {
  const mockSetIsValidForm = vi.fn();
  const mockCountries = ['USA', 'Canada', 'United Kingdom'];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSelector).mockReturnValue(mockCountries);
  });

  describe('Correctly render', () => {
    test('renders label, input, and datalist options', () => {
      render(
        <CountyFormField
          labelText="country"
          setIsValidForm={mockSetIsValidForm}
        />
      );

      const label = screen.getByText('country');
      const input = screen.getByPlaceholderText('enter country');

      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(input).toBeRequired();
      expect(input).toHaveAttribute('type', 'text');
    });

    test('binds ref to the input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(
        <CountyFormField
          labelText="country"
          setIsValidForm={mockSetIsValidForm}
          ref={ref}
        />
      );

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('User interactions and validation', () => {
    test('validates successfully when entering an allowed country', async () => {
      const user = userEvent.setup();
      render(
        <CountyFormField
          labelText="country"
          setIsValidForm={mockSetIsValidForm}
        />
      );

      const input = screen.getByPlaceholderText('enter country');
      await user.type(input, 'Canada');

      expect(mockSetIsValidForm).toHaveBeenLastCalledWith(true);
      expect(screen.queryByTestId('mock-error')).not.toBeInTheDocument();
    });

    test('validates successfully when input is cleared or empty', async () => {
      const user = userEvent.setup();
      render(
        <CountyFormField
          labelText="country"
          setIsValidForm={mockSetIsValidForm}
        />
      );

      const input = screen.getByPlaceholderText('enter country');
      await user.type(input, 'C');
      await user.clear(input);

      expect(mockSetIsValidForm).toHaveBeenLastCalledWith(true);
      expect(screen.queryByTestId('mock-error')).not.toBeInTheDocument();
    });

    test('shows validation error when country is not in the allowed range', async () => {
      const user = userEvent.setup();
      render(
        <CountyFormField
          labelText="country"
          setIsValidForm={mockSetIsValidForm}
        />
      );

      const input = screen.getByPlaceholderText('enter country');
      await user.type(input, 'France');

      expect(mockSetIsValidForm).toHaveBeenLastCalledWith(false);
      expect(screen.getByTestId('mock-error')).toBeInTheDocument();
      expect(
        screen.getByText('The country is not in the allowed range')
      ).toBeInTheDocument();
    });
  });
});
