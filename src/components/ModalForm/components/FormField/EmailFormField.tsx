import { forwardRef, useId, useState } from 'react';
import { formSchema } from '../Form/validationsSchemas';
import ValidationError from '../../../ValidationError/ValidationError';

interface EmailFormFieldProps {
  placeholder?: string;
  required?: boolean;
  setIsValidForm: (value: boolean) => void;
}

const EmailFormField = forwardRef<HTMLInputElement, EmailFormFieldProps>(
  (props, ref) => {
    const [error, setError] = useState<string | null>(null);

    const { placeholder, required, setIsValidForm, ...rest } = props;
    const fieldId = useId();

    const checkValidation = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const result = formSchema.shape.email.safeParse(e.target.value);
      if (result.success) {
        setError(null);
        setIsValidForm(true);
      } else {
        setError(result.error.issues[0].message);
        setIsValidForm(false);
      }
    };

    return (
      <div className="form-field">
        <label className="form-field__label" htmlFor={fieldId}>
          email
        </label>
        <input
          ref={ref}
          className="form-field__input"
          id={fieldId}
          type="email"
          placeholder={placeholder}
          required={required}
          onChange={checkValidation}
          {...rest}
        />
        {error && <ValidationError errorText={error} />}
      </div>
    );
  }
);

EmailFormField.displayName = 'EmailFormField';
export default EmailFormField;
