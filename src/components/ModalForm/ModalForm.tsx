import { FormProvider } from '../../context/FormContext';
import './ModalForm.scss';

import { createPortal } from 'react-dom';

export default function ModalForm({
  closeHandler,
  children,
}: {
  closeHandler: () => void;
  children: React.ReactNode;
}) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return createPortal(
    <FormProvider value={{ onClose: closeHandler }}>
      <div className="modal-form" onClick={handleClick}>
        <button className="modal-form__close-button" onClick={closeHandler}>
          ×
        </button>
        {children}
      </div>
    </FormProvider>,
    document.body
  );
}
