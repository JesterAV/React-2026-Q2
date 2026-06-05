import './ModalForm.scss';

import { createPortal } from 'react-dom';
import Form from './components/Form/Form';

export default function ModalForm({
  closeHandler,
}: {
  closeHandler: () => void;
}) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return createPortal(
    <div className="modal-form" onClick={handleClick}>
      <button className="modal-form__close-button" onClick={closeHandler}>
        ×
      </button>
      <Form />
    </div>,
    document.body
  );
}
