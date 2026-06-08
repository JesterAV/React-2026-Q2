import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import AgeFormField from './AgeFormField';
import { formSchema } from '../Form/validationsSchemas';
import { ZodError } from 'zod';

vi.mock('../../../ValidationError/ValidationError', () => ({
  default: ({ errorText }: { errorText: string }) => (
    <div data-testid="mock-error">{errorText}</div>
  ),
}));

vi.mock('../Form/validationsSchemas', () => ({
  formSchema: {
    shape: {
      age: {
        safeParse: vi.fn(),
      },
    },
  },
}));

describe('AgeFormField component', () => {
  const mockSetIsValidForm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Correctly render', () => {
    test('renders label, input with placeholder and required attribute', () => {
      render(
        <AgeFormField
          placeholder="enter age"
          required={true}
          setIsValidForm={mockSetIsValidForm}
        />
      );

      const label = screen.getByText('age');
      const input = screen.getByPlaceholderText('enter age');

      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'number');
      expect(input).toBeRequired();
    });

    test('binds ref to the input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<AgeFormField setIsValidForm={mockSetIsValidForm} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('User interactions and validation', () => {
    test('validates successfully when safeParse returns success true', async () => {
      const mockSafeParse = vi.mocked(formSchema.shape.age.safeParse);
      mockSafeParse.mockReturnValue({ success: true, data: '25' });

      const user = userEvent.setup();
      render(<AgeFormField setIsValidForm={mockSetIsValidForm} />);

      const input = screen.getByRole('spinbutton');
      await user.type(input, '25');

      expect(mockSafeParse).toHaveBeenCalledWith('2');
      expect(mockSetIsValidForm).toHaveBeenCalledWith(true);
      expect(screen.queryByTestId('mock-error')).not.toBeInTheDocument();
    });

    test('shows error and sets form invalid when safeParse returns success false', async () => {
      const errorMessage = 'Age must be a number';

      const zodError = new ZodError([
        {
          code: 'custom',
          path: [],
          message: errorMessage,
        },
      ]);

      const mockSafeParse = vi.mocked(formSchema.shape.age.safeParse);

      mockSafeParse.mockReturnValue({
        success: false,
        error: zodError,
      } as ReturnType<typeof formSchema.shape.age.safeParse>);

      const user = userEvent.setup();
      render(<AgeFormField setIsValidForm={mockSetIsValidForm} />);

      const input = screen.getByRole('spinbutton');
      await user.type(input, '-5');

      expect(mockSetIsValidForm).toHaveBeenCalledWith(false);
      expect(screen.getByTestId('mock-error')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
