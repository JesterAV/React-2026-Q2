export default function CheckboxFormFiled({
  labelText,
}: {
  labelText: string;
}) {
  return (
    <div className="form-field__checkbox-section">
      <input className="form-field__checkbox" type="checkbox" required />
      <label className="form-field__label">{labelText}</label>
    </div>
  );
}
