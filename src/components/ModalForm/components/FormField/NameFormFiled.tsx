import './FormFields.scss';

import { forwardRef, useId, useState } from 'react';
import ValidationError from '../../../ValidationError/ValidationError';
import { formSchema } from '../Form/validationsSchemas';

interface NameFormFieldProps {
  placeholder?: string;
  required?: boolean;
  setIsValidForm: (value: boolean) => void;
}

const NameFormField = forwardRef<HTMLInputElement, NameFormFieldProps>(
  (props, ref) => {
    const [error, setError] = useState<string | null>(null);

    const { placeholder, required, setIsValidForm, ...rest } = props;
    const fieldId = useId();

    const checkIsValid = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const result = formSchema.shape.name.safeParse(e.target.value);

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
          name
        </label>
        <input
          ref={ref}
          className="form-field__input"
          id={fieldId}
          type="text"
          placeholder={placeholder}
          required={required}
          onChange={checkIsValid}
          {...rest}
        />
        {error && <ValidationError errorText={error} />}
      </div>
    );
  }
);

NameFormField.displayName = 'NameFormField';
export default NameFormField;
