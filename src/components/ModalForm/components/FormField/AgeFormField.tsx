import { forwardRef, useId, useState } from 'react';
import ValidationError from '../../../ValidationError/ValidationError';
import { formSchema } from '../Form/validationsSchemas';

interface AgeFormFieldProps {
  placeholder?: string;
  required?: boolean;
  setIsValidForm: (value: boolean) => void;
}

const AgeFormField = forwardRef<HTMLInputElement, AgeFormFieldProps>(
  (props, ref) => {
    const [error, setError] = useState<string | null>(null);

    const { placeholder, required, setIsValidForm, ...rest } = props;
    const fieldId = useId();

    const checkValidation = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const result = formSchema.shape.age.safeParse(e.target.value);

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
          age
        </label>
        <input
          ref={ref}
          className="form-field__input"
          id={fieldId}
          type="number"
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

AgeFormField.displayName = 'AgeFormField';

export default AgeFormField;
