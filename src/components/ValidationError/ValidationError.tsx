import './ValidationError.scss';

export default function ValidationError({ errorText }: { errorText: string }) {
  return <p className="validation-error">{errorText}</p>;
}
