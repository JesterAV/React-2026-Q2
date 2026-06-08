import { forwardRef, useId } from 'react';

interface CheckboxFormFiledProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value'
> {
  labelText: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxFormFiled = forwardRef<HTMLInputElement, CheckboxFormFiledProps>(
  (props, ref) => {
    const { labelText, ...rest } = props;

    const inputId = useId();

    return (
      <div className="form-field__checkbox-section">
        <input
          ref={ref}
          id={inputId}
          className="form-field__checkbox"
          type="checkbox"
          required
          {...rest}
        />
        <label className="form-field__label" htmlFor={inputId}>
          {labelText}
        </label>
      </div>
    );
  }
);

CheckboxFormFiled.displayName = 'CheckboxFormFiled';
export default CheckboxFormFiled;
