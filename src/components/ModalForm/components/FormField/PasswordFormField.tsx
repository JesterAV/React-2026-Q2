import { forwardRef, useState } from 'react';
import ValidationError from '../../../ValidationError/ValidationError';
import { formSchema } from '../Form/validationsSchemas';

interface PasswordFormFieldProps {
  firstLabelText: string;
  secondLabelText: string;
  setIsValidForm: (value: boolean) => void;
}

const PasswordFormField = forwardRef<HTMLInputElement, PasswordFormFieldProps>(
  (props, ref) => {
    const [currentPassword, setCurrentPassword] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [matchError, setMatchError] = useState<string | null>(null);
    const { firstLabelText, secondLabelText, setIsValidForm } = props;

    const checkValidation = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value;

      const result = formSchema.shape.password.safeParse(value);

      setCurrentPassword(value);

      if (result.success) {
        setError(null);
      } else {
        setError(result.error.issues[0].message);
      }
    };

    const checkPasswordsMatch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value !== currentPassword && value !== '') {
        setIsValidForm(false);
        setMatchError("The passwords don't match");
      } else {
        setIsValidForm(true);
        setMatchError(null);
      }
    };

    return (
      <div className="form-field">
        <label className="form-field__label">{firstLabelText}</label>
        <input
          className="form-field__input"
          ref={ref}
          type="password"
          onChange={checkValidation}
        />
        {error && <ValidationError errorText={error} />}

        <label className="form-field__label">{secondLabelText}</label>
        <input
          className="form-field__input"
          type="password"
          onChange={checkPasswordsMatch}
          required
        />
        {matchError && <ValidationError errorText={matchError} />}
      </div>
    );
  }
);

PasswordFormField.displayName = 'PasswordFormField';
export default PasswordFormField;
