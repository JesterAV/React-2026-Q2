import './Button.scss';

type ButtonType = 'button' | 'submit';

interface ButtonProps {
  text: string;
  type: ButtonType;
  onClick: () => void;
}

export default function Button(props: ButtonProps) {
  const { text, type, onClick } = props;

  return (
    <button className="button" type={type} onClick={onClick}>
      {text}
    </button>
  );
}
