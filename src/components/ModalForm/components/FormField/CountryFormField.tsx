import { forwardRef, useId, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../stores/store';
import ValidationError from '../../../ValidationError/ValidationError';

interface CountyFormFieldProps {
  labelText: string;
  setIsValidForm: (value: boolean) => void;
}

const CountyFormField = forwardRef<HTMLInputElement, CountyFormFieldProps>(
  (props, ref) => {
    const [error, setError] = useState<string | null>(null);

    const { labelText, setIsValidForm, ...rest } = props;

    const countries = useSelector(
      (state: RootState) => state.countries.countries
    );

    const fieldId = useId();
    const datalist = useId();

    const checkValidation = (e: React.ChangeEvent<HTMLInputElement>): void => {
      if (!countries.includes(e.target.value) && e.target.value !== '') {
        setError('The country is not in the allowed range');
        setIsValidForm(false);
      } else {
        setError(null);
        setIsValidForm(true);
      }
    };

    return (
      <div className="form-field">
        <label className="form-field__label" htmlFor={fieldId}>
          {labelText}
        </label>
        <input
          ref={ref}
          id={fieldId}
          type="text"
          className="form-field__input"
          placeholder="enter country"
          list={datalist}
          required
          onChange={checkValidation}
          {...rest}
        />
        <datalist id={datalist}>
          {countries.map((country) => (
            <option key={country} value={country} />
          ))}
        </datalist>
        {error && <ValidationError errorText={error} />}
      </div>
    );
  }
);

CountyFormField.displayName = 'CountyFormField';
export default CountyFormField;
