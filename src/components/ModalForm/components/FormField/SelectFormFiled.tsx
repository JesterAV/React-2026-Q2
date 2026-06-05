import { useId, useState } from 'react';

interface SelectFormFieldProps {
  labelText: string;
  placeholder: string;
  options: string[];
}

export default function SelectFormField(props: SelectFormFieldProps) {
  const { labelText, options, placeholder } = props;

  const [selectValue, setSelectValue] = useState<string>('');
  const fieldId = useId();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value);
  };

  return (
    <div className="form-field">
      <label htmlFor={fieldId}>{labelText}</label>
      <select
        className="form-field__select"
        id={fieldId}
        value={selectValue}
        onChange={handleChange}
        required
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
