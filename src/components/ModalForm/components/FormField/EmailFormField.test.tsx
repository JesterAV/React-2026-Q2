import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import EmailFormField from './EmailFormField';
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
      email: {
        safeParse: vi.fn(),
      },
    },
  },
}));

describe('EmailFormField component', () => {
  const mockSetIsValidForm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Correctly render', () => {
    test('renders label, input with placeholder and required attribute', () => {
      render(
        <EmailFormField
          placeholder="enter email"
          required={true}
          setIsValidForm={mockSetIsValidForm}
        />
      );

      const label = screen.getByText('email');
      const input = screen.getByPlaceholderText('enter email');

      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toBeRequired();
    });

    test('binds ref to the input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<EmailFormField setIsValidForm={mockSetIsValidForm} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('User interactions and validation', () => {
    test('validates successfully when safeParse returns success true', async () => {
      const mockSafeParse = vi.mocked(formSchema.shape.email.safeParse);
      mockSafeParse.mockReturnValue({
        success: true,
        data: 'test@example.com',
      });

      const user = userEvent.setup();
      render(<EmailFormField setIsValidForm={mockSetIsValidForm} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'a');

      expect(mockSafeParse).toHaveBeenCalledWith('a');
      expect(mockSetIsValidForm).toHaveBeenCalledWith(true);
      expect(screen.queryByTestId('mock-error')).not.toBeInTheDocument();
    });

    test('shows error and sets form invalid when safeParse returns success false', async () => {
      const errorMessage = 'Invalid email address';
      const mockSafeParse = vi.mocked(formSchema.shape.email.safeParse);

      const zodError = new ZodError([
        {
          code: 'custom',
          path: [],
          message: errorMessage,
        },
      ]);

      mockSafeParse.mockReturnValue({
        success: false,
        error: zodError,
      } as ReturnType<typeof formSchema.shape.email.safeParse>);

      const user = userEvent.setup();
      render(<EmailFormField setIsValidForm={mockSetIsValidForm} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'b');

      expect(mockSetIsValidForm).toHaveBeenCalledWith(false);
      expect(screen.getByTestId('mock-error')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
