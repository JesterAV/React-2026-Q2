import { forwardRef, useId } from 'react';

interface SelectFormFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  labelText: string;
  placeholder: string;
  options: string[];
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectFormField = forwardRef<HTMLSelectElement, SelectFormFieldProps>(
  (props, ref) => {
    const { labelText, options, placeholder, value, onChange, ...rest } = props;

    const fieldId = useId();

    const isControlled = onChange !== undefined;

    return (
      <div className="form-field">
        <label htmlFor={fieldId}>{labelText}</label>
        <select
          ref={ref}
          className="form-field__select"
          id={fieldId}
          {...(isControlled ? { value: value ?? '' } : { defaultValue: '' })}
          required
          {...rest}
          onChange={onChange}
        >
          <option className="form-field__select_option" value="" disabled>
            {placeholder}
          </option>
          {options.map((value) => (
            <option
              className="form-field__select_option"
              key={value}
              value={value}
            >
              {value}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

SelectFormField.displayName = 'SelectFormField';
export default SelectFormField;
