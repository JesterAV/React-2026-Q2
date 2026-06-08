import './main.scss';

import Button from '../../components/Button/Button';
import ModalForm from '../../components/ModalForm/ModalForm';
import { useModal } from '../../hooks/useModal';
import UncontrolledForm from '../../components/ModalForm/components/Form/UncontrolledForm';
import ReactHookForm from '../../components/ModalForm/components/Form/ReactHookForm';
import AnswersList from '../../components/AnswersList/AnswersList';

export default function MainPage() {
  const {
    openModal,
    closeModal,
    isOpen,
    openReactHookForm,
    setOpenReactHookForm,
  } = useModal();

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeModal();
  };

  return (
    <div className="main-page">
      {isOpen && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          {openReactHookForm ? (
            <ModalForm closeHandler={closeModal}>
              <ReactHookForm />
            </ModalForm>
          ) : (
            <ModalForm closeHandler={closeModal}>
              <UncontrolledForm />
            </ModalForm>
          )}
        </div>
      )}

      <Button type="button" text="Open uncontrolled form" onClick={openModal} />
      <Button
        type="button"
        text="Open React Hook Form"
        onClick={() => {
          openModal();
          setOpenReactHookForm(true);
        }}
      />

      <AnswersList />
    </div>
  );
}
