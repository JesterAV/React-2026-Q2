import './Button.scss';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type: 'button' | 'submit';
  disabled?: boolean
}

function Button(props: ButtonProps) {
  const {text, onClick, type, disabled} = props;

  return <button
    className='button' 
    onClick={onClick}
    type={type}
    disabled={disabled}
    >{text}</button>
}

export default Button;