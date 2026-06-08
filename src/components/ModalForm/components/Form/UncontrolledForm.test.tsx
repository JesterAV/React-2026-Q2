import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import UncontrolledForm from './UncontrolledForm';
import userEvent from '@testing-library/user-event';
import { useDispatch } from 'react-redux';
import { useFormContext } from '../../../../context/FormContext';
import { saveAnswer } from '../../../../stores/slices/formAnswersSlice';

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
}));

vi.mock('../../../../context/FormContext', () => ({
  useFormContext: vi.fn(),
}));

vi.mock('../../../../stores/slices/formAnswersSlice', () => ({
  saveAnswer: vi.fn(),
}));

vi.mock('../FormField/SelectFormFiled', () => ({
  default: ({
    labelText,
    ref,
  }: {
    labelText: string;
    ref?: React.Ref<HTMLSelectElement>;
  }) => (
    <div>
      {labelText}
      <select ref={ref} data-testid="gender-select">
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    </div>
  ),
}));

vi.mock('../FormField/CheckboxFormField', () => ({
  default: ({
    labelText,
    ref,
  }: {
    labelText: string;
    ref?: React.Ref<HTMLInputElement>;
  }) => (
    <div>
      <label>
        {labelText}
        <input ref={ref} type="checkbox" data-testid="terms-checkbox" />
      </label>
    </div>
  ),
}));

vi.mock('../../../Button/Button', () => ({
  default: ({ text, type }: { text: string; type: 'submit' | 'button' }) => (
    <button type={type}>{text}</button>
  ),
}));

vi.mock('../FormField/ImageUploadField', () => ({
  default: ({
    labelText,
    setImage,
  }: {
    labelText: string;
    setImage: (v: string) => void;
  }) => (
    <div>
      {labelText}
      <button
        type="button"
        onClick={() => setImage('data:image/png;base64,test')}
      >
        Upload
      </button>
    </div>
  ),
}));

vi.mock('../FormField/CountryFormField', () => ({
  default: ({
    labelText,
    ref,
  }: {
    labelText: string;
    ref?: React.Ref<HTMLInputElement>;
  }) => (
    <div>
      {labelText} <input ref={ref} type="text" data-testid="country-input" />
    </div>
  ),
}));

vi.mock('../FormField/PasswordFormField', () => ({
  default: ({ firstLabelText }: { firstLabelText: string }) => (
    <div>
      {firstLabelText} <input type="password" data-testid="password-input" />
    </div>
  ),
}));

vi.mock('../FormField/NameFormFiled', () => ({
  default: ({
    placeholder,
    setIsValidForm,
    ref,
  }: {
    placeholder: string;
    setIsValidForm: (v: boolean) => void;
    ref?: React.Ref<HTMLInputElement>;
  }) => (
    <div>
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        data-testid="name-input"
      />
      <button type="button" onClick={() => setIsValidForm(false)}>
        Trigger Invalid
      </button>
    </div>
  ),
}));

vi.mock('../FormField/AgeFormField', () => ({
  default: ({
    placeholder,
    ref,
  }: {
    placeholder: string;
    ref?: React.Ref<HTMLInputElement>;
  }) => (
    <div>
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        data-testid="age-input"
      />
    </div>
  ),
}));

vi.mock('../FormField/EmailFormField', () => ({
  default: ({
    placeholder,
    ref,
  }: {
    placeholder: string;
    ref?: React.Ref<HTMLInputElement>;
  }) => (
    <div>
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        data-testid="email-input"
      />
    </div>
  ),
}));

describe('UncontrolledForm component', () => {
  const mockDispatch = vi.fn();
  const mockOnClose = vi.fn();
  const mockUuid = '12345678-1234-1234-1234-123456789012' as const;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDispatch).mockReturnValue(mockDispatch);
    vi.mocked(useFormContext).mockReturnValue({ onClose: mockOnClose });

    vi.spyOn(crypto, 'randomUUID').mockReturnValue(mockUuid);
  });

  describe('Correctly render', () => {
    test('All nested form fields and action button', () => {
      render(<UncontrolledForm />);

      expect(screen.getByTestId('name-input')).toBeInTheDocument();
      expect(screen.getByTestId('age-input')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('country-input')).toBeInTheDocument();
      expect(screen.getByTestId('gender-select')).toBeInTheDocument();
      expect(screen.getByText('upload image')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByLabelText('Accept terms of use')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
    });
  });

  describe('User interactions', () => {
    test('Submits form dataset and invokes store dispatch on success state', async () => {
      const user = userEvent.setup();
      render(<UncontrolledForm />);

      const nameInput = screen.getByTestId('name-input');
      const ageInput = screen.getByTestId('age-input');
      const emailInput = screen.getByTestId('email-input');
      const countryInput = screen.getByTestId('country-input');
      const genderInput = screen.getByTestId('gender-select');
      const termsCheckbox = screen.getByTestId('terms-checkbox');
      const passwordInput = screen.getByTestId('password-input');
      const uploadButton = screen.getByRole('button', { name: 'Upload' });
      const submitButton = screen.getByRole('button', { name: 'Send' });

      await user.type(nameInput, 'Dean');
      await user.type(ageInput, '30');
      await user.type(emailInput, 'dean@hunter.com');
      await user.type(countryInput, 'USA');
      await user.selectOptions(genderInput, 'Male');
      await user.type(passwordInput, 'pie123');
      await user.click(uploadButton);
      await user.click(termsCheckbox);

      await user.click(submitButton);

      expect(saveAnswer).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Dean',
          age: '30',
          email: 'dean@hunter.com',
          gender: 'Male',
          acceptTerms: true,
          country: 'USA',
          img: 'data:image/png;base64,test',
          id: mockUuid,
        })
      );
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('Prevents store updates and closure operations during validation blocks', async () => {
      const user = userEvent.setup();
      render(<UncontrolledForm />);

      const invalidateButton = screen.getByRole('button', {
        name: 'Trigger Invalid',
      });
      const submitButton = screen.getByRole('button', { name: 'Send' });

      await user.click(invalidateButton);
      await user.click(submitButton);

      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
