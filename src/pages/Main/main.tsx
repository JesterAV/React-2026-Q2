import './main.scss';

import Button from '../../components/Button/Button';
import ModalForm from '../../components/ModalForm/ModalForm';
import { useModal } from '../../hooks/useModal';

export default function MainPage() {
  const { openModal, closeModal, isOpen } = useModal();

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeModal();
  };

  return (
    <div className="main-page">
      {isOpen && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <ModalForm closeHandler={closeModal} />
        </div>
      )}

      <Button type="button" text="Open Modal" onClick={openModal} />
    </div>
  );
}
