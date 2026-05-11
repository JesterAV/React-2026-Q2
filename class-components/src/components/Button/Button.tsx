import './Button.scss';

import { Component } from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type: 'button' | 'submit';
}

class Button extends Component<ButtonProps> {
  render() {
    const {text, type, onClick} = this.props;

    return <button
      className='button' 
      onClick={onClick}
      type={type}
      >{text}</button>
  }
}

export default Button;