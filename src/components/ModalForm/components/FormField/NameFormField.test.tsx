import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import NameFormField from './NameFormFiled';
import userEvent from '@testing-library/user-event';
import { formSchema } from '../Form/validationsSchemas';
import { ZodError } from 'zod';
import { createRef } from 'react';

vi.mock('../Form/validationsSchemas', () => ({
  formSchema: {
    shape: {
      name: {
        safeParse: vi.fn(),
      },
    },
  },
}));

vi.mock('../../../ValidationError/ValidationError', () => ({
  default: ({ errorText }: { errorText: string }) => <div>{errorText}</div>,
}));

describe('NameFormField component', () => {
  const mockSetIsValidForm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    const mockSafeParse = vi.mocked(formSchema.shape.name.safeParse);
    const mockSuccessResult = {
      success: true as const,
      data: 'Valid Name',
    };
    mockSafeParse.mockReturnValue(mockSuccessResult);
  });

  describe('Correctly render', () => {
    test('Label, input with attributes and placeholder', () => {
      const placeholderText = 'Enter your name';
      render(
        <NameFormField
          placeholder={placeholderText}
          required={true}
          setIsValidForm={mockSetIsValidForm}
        />
      );

      expect(screen.getByText('name')).toBeInTheDocument();

      const input = screen.getByPlaceholderText(placeholderText);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toBeRequired();
    });

    test('Forwarded ref attaches correctly to input', () => {
      const ref = createRef<HTMLInputElement>();
      render(<NameFormField setIsValidForm={mockSetIsValidForm} ref={ref} />);

      const input = screen.getByRole('textbox');
      expect(ref.current).toBe(input);
    });
  });

  describe('User interactions', () => {
    test('Calls setIsValidForm with true on successful validation', async () => {
      const user = userEvent.setup();
      render(<NameFormField setIsValidForm={mockSetIsValidForm} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'John');

      expect(formSchema.shape.name.safeParse).toHaveBeenCalledWith('J');
      expect(mockSetIsValidForm).toHaveBeenCalledWith(true);
      expect(screen.queryByText('Invalid name')).not.toBeInTheDocument();
    });

    test('Calls setIsValidForm with false and shows error on validation failure', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Name is too short';
      const mockSafeParse = vi.mocked(formSchema.shape.name.safeParse);

      const mockZodError = new ZodError([
        { message: errorMessage, code: 'custom', path: [] },
      ]);

      const mockErrorResult = {
        success: false as const,
        error: mockZodError as unknown as ZodError<string>,
      };
      mockSafeParse.mockReturnValue(mockErrorResult);

      render(<NameFormField setIsValidForm={mockSetIsValidForm} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'J');

      expect(formSchema.shape.name.safeParse).toHaveBeenCalledWith('J');
      expect(mockSetIsValidForm).toHaveBeenCalledWith(false);
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
