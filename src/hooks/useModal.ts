import { useState } from 'react';

interface useModalReturns {
  openModal: () => void;
  closeModal: () => void;
  isOpen: boolean;
}

export const useModal = (): useModalReturns => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    if (isOpen) setIsOpen(false);
  };

  return {
    openModal,
    closeModal,
    isOpen,
  };
};
