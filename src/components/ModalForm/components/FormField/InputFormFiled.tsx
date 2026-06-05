import './FormFields.scss';

import { useId } from 'react';

type ImportType = 'text' | 'email' | 'number' | 'select' | 'checkbox';

interface FormFieldProps {
  type: ImportType;
  placeholder?: string;
  labelText?: string;
  required?: boolean;
}

export default function InputFormFiled(props: FormFieldProps) {
  const { type, placeholder, labelText, required } = props;
  const fieldId = useId();

  if (type === 'checkbox') {
    return <div className="">CheckboxInput</div>;
  }

  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={fieldId}>
        {labelText}
      </label>
      <input
        className="form-field__input"
        id={fieldId}
        type={type}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
