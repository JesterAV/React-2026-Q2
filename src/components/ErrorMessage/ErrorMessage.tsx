import { useEffect } from 'react';
import './ErrorMessage.scss';

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

function ErrorMessage({ message, onClose, duration = 3000 }: ErrorMessageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="error-message">
      <span className="error-message__icon">⚠️</span>
      <span className="error-message__text">{message}</span>
      <button className="error-message__close" onClick={onClose}>×</button>
    </div>
  );
}

export default ErrorMessage;