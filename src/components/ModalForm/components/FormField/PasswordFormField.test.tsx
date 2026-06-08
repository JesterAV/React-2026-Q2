import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import PasswordFormField from './PasswordFormField';
import userEvent from '@testing-library/user-event';
import { formSchema } from '../Form/validationsSchemas';
import { ZodError } from 'zod';
import { createRef } from 'react';

vi.mock('../Form/validationsSchemas', () => ({
  formSchema: {
    shape: {
      password: {
        safeParse: vi.fn(),
      },
    },
  },
}));

vi.mock('../../../ValidationError/ValidationError', () => ({
  default: ({ errorText }: { errorText: string }) => <div>{errorText}</div>,
}));

describe('PasswordFormField component', () => {
  const mockSetIsValidForm = vi.fn();
  const firstLabel = 'Password';
  const secondLabel = 'Confirm Password';

  beforeEach(() => {
    vi.clearAllMocks();
    const mockSafeParse = vi.mocked(formSchema.shape.password.safeParse);
    const mockSuccessResult = {
      success: true as const,
      data: 'ValidPass123',
    };
    mockSafeParse.mockReturnValue(mockSuccessResult);
  });

  describe('Correctly render', () => {
    test('Labels and input fields with traits', () => {
      const { container } = render(
        <PasswordFormField
          firstLabelText={firstLabel}
          secondLabelText={secondLabel}
          setIsValidForm={mockSetIsValidForm}
        />
      );

      expect(screen.getByText(firstLabel)).toBeInTheDocument();
      expect(screen.getByText(secondLabel)).toBeInTheDocument();

      const inputs = container.querySelectorAll('input[type="password"]');
      expect(inputs).toHaveLength(2);
      expect(inputs[1]).toBeRequired();
    });

    test('Forwarded ref attaches to first password input', () => {
      const ref = createRef<HTMLInputElement>();
      const { container } = render(
        <PasswordFormField
          firstLabelText={firstLabel}
          secondLabelText={secondLabel}
          setIsValidForm={mockSetIsValidForm}
          ref={ref}
        />
      );

      const inputs = container.querySelectorAll('input[type="password"]');
      expect(ref.current).toBe(inputs[0]);
    });
  });

  describe('User interactions', () => {
    test('Successful password entry and matching validation', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PasswordFormField
          firstLabelText={firstLabel}
          secondLabelText={secondLabel}
          setIsValidForm={mockSetIsValidForm}
        />
      );

      const inputs = container.querySelectorAll('input[type="password"]');
      const firstInput = inputs[0] as HTMLInputElement;
      const secondInput = inputs[1] as HTMLInputElement;

      await user.type(firstInput, 'P');
      expect(formSchema.shape.password.safeParse).toHaveBeenCalledWith('P');

      await user.type(secondInput, 'P');
      expect(mockSetIsValidForm).toHaveBeenCalledWith(true);
      expect(
        screen.queryByText("The passwords don't match")
      ).not.toBeInTheDocument();
    });

    test('Shows schema validation errors for main password field', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Password is weak';
      const mockSafeParse = vi.mocked(formSchema.shape.password.safeParse);

      const mockZodError = new ZodError([
        { message: errorMessage, code: 'custom', path: [] },
      ]);

      const mockErrorResult = {
        success: false as const,
        error: mockZodError as unknown as ZodError<string>,
      };
      mockSafeParse.mockReturnValue(mockErrorResult);

      const { container } = render(
        <PasswordFormField
          firstLabelText={firstLabel}
          secondLabelText={secondLabel}
          setIsValidForm={mockSetIsValidForm}
        />
      );

      const inputs = container.querySelectorAll('input[type="password"]');
      await user.type(inputs[0] as HTMLInputElement, '1');

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    test('Triggers discrepancy message on mismatched repeat entry', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PasswordFormField
          firstLabelText={firstLabel}
          secondLabelText={secondLabel}
          setIsValidForm={mockSetIsValidForm}
        />
      );

      const inputs = container.querySelectorAll('input[type="password"]');
      const firstInput = inputs[0] as HTMLInputElement;
      const secondInput = inputs[1] as HTMLInputElement;

      await user.type(firstInput, 'A');
      await user.type(secondInput, 'B');

      expect(mockSetIsValidForm).toHaveBeenCalledWith(false);
      expect(screen.getByText("The passwords don't match")).toBeInTheDocument();
    });

    test('Clears divergence alert on empty string entry', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PasswordFormField
          firstLabelText={firstLabel}
          secondLabelText={secondLabel}
          setIsValidForm={mockSetIsValidForm}
        />
      );

      const inputs = container.querySelectorAll('input[type="password"]');
      const firstInput = inputs[0] as HTMLInputElement;
      const secondInput = inputs[1] as HTMLInputElement;

      await user.type(firstInput, 'A');
      await user.type(secondInput, 'B');
      expect(screen.getByText("The passwords don't match")).toBeInTheDocument();

      await user.clear(secondInput);
      expect(mockSetIsValidForm).toHaveBeenCalledWith(true);
      expect(
        screen.queryByText("The passwords don't match")
      ).not.toBeInTheDocument();
    });
  });
});
