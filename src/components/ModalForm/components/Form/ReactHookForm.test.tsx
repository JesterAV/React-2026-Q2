import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useDispatch } from 'react-redux';
import { useFormContext } from '../../../../context/FormContext';
import { saveAnswer } from '../../../../stores/slices/formAnswersSlice';
import ReactHookForm from './ReactHookForm';

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
}));

vi.mock('../../../../context/FormContext', () => ({
  useFormContext: vi.fn(),
}));

vi.mock('../../../../stores/slices/formAnswersSlice', () => ({
  saveAnswer: vi.fn((data: unknown) => ({
    type: 'SAVE_ANSWER',
    payload: data,
  })),
}));

vi.mock('../FormField/NameFormFiled', () => ({
  default: ({
    value,
    onChange,
    placeholder,
    setIsValidForm,
  }: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    setIsValidForm: (v: boolean) => void;
  }) => (
    <div>
      <input
        data-testid="name-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="button" onClick={() => setIsValidForm(false)}>
        Invalidate Form
      </button>
    </div>
  ),
}));

vi.mock('../FormField/AgeFormField', () => ({
  default: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
  }) => (
    <input
      data-testid="age-input"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock('../FormField/EmailFormField', () => ({
  default: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
  }) => (
    <input
      data-testid="email-input"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock('../FormField/SelectFormFiled', () => ({
  default: ({
    value,
    onChange,
    labelText,
  }: {
    value: string;
    onChange: (v: string) => void;
    labelText: string;
  }) => (
    <select
      data-testid="gender-select"
      aria-label={labelText}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
    </select>
  ),
}));

vi.mock('../FormField/CountryFormField', () => ({
  default: ({
    value,
    onChange,
    labelText,
  }: {
    value: string;
    onChange: (v: string) => void;
    labelText: string;
  }) => (
    <input
      data-testid="country-input"
      aria-label={labelText}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
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
    <button
      type="button"
      data-testid="upload-button"
      onClick={() => setImage('test-image.jpg')}
    >
      {labelText}
    </button>
  ),
}));

vi.mock('../FormField/PasswordFormField', () => ({
  default: ({
    value,
    onChange,
    firstLabelText,
  }: {
    value: string;
    onChange: (v: string) => void;
    firstLabelText: string;
  }) => (
    <input
      data-testid="password-input"
      aria-label={firstLabelText}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock('../FormField/CheckboxFormField', () => ({
  default: ({
    value,
    onChange,
    labelText,
  }: {
    value: boolean;
    onChange: (v: boolean) => void;
    labelText: string;
  }) => (
    <input
      type="checkbox"
      data-testid="terms-checkbox"
      aria-label={labelText}
      checked={value}
      onChange={(e) => onChange(e.target.checked)}
    />
  ),
}));

vi.mock('../../../Button/Button', () => ({
  default: ({ text, type }: { text: string; type: 'submit' | 'button' }) => (
    <button type={type}>{text}</button>
  ),
}));

describe('ReactHookForm component', () => {
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
    test('renders all form fields and submit button', () => {
      render(<ReactHookForm />);

      expect(screen.getByTestId('name-input')).toBeInTheDocument();
      expect(screen.getByTestId('age-input')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('gender-select')).toBeInTheDocument();
      expect(screen.getByTestId('country-input')).toBeInTheDocument();
      expect(screen.getByTestId('upload-button')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('terms-checkbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
    });
  });

  describe('User interactions', () => {
    test('submits form with valid data', async () => {
      const user = userEvent.setup();
      render(<ReactHookForm />);

      await user.type(screen.getByTestId('name-input'), 'Sam');
      await user.type(screen.getByTestId('age-input'), '25');
      await user.type(screen.getByTestId('email-input'), 'sam@winchester.com');
      await user.type(screen.getByTestId('country-input'), 'USA');
      await user.selectOptions(screen.getByTestId('gender-select'), 'Male');
      await user.click(screen.getByTestId('upload-button'));
      await user.type(screen.getByTestId('password-input'), 'hunter123');
      await user.click(screen.getByTestId('terms-checkbox'));

      await user.click(screen.getByRole('button', { name: 'Send' }));

      await waitFor(() => {
        expect(saveAnswer).toHaveBeenCalledWith({
          name: 'Sam',
          age: '25',
          email: 'sam@winchester.com',
          gender: 'Male',
          country: 'USA',
          img: 'test-image.jpg',
          password: 'hunter123',
          acceptTerms: true,
          id: mockUuid,
        });
      });
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('does not submit form if validation state is invalid', async () => {
      const user = userEvent.setup();
      render(<ReactHookForm />);

      await user.type(screen.getByTestId('name-input'), 'Dean');
      await user.type(screen.getByTestId('age-input'), '30');
      await user.type(screen.getByTestId('email-input'), 'dean@winchester.com');
      await user.type(screen.getByTestId('country-input'), 'USA');
      await user.selectOptions(screen.getByTestId('gender-select'), 'Male');
      await user.type(screen.getByTestId('password-input'), 'hunter123');
      await user.click(screen.getByTestId('terms-checkbox'));

      await user.click(screen.getByRole('button', { name: 'Invalidate Form' }));
      await user.click(screen.getByRole('button', { name: 'Send' }));

      await waitFor(() => {
        expect(saveAnswer).not.toHaveBeenCalled();
      });
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
