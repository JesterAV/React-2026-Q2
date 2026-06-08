import { useEffect, useState } from 'react';

interface useModalReturns {
  openModal: () => void;
  closeModal: () => void;
  isOpen: boolean;
  openReactHookForm: boolean;
  setOpenReactHookForm: (data: boolean) => void;
}

export const useModal = (): useModalReturns => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openReactHookForm, setOpenReactHookForm] = useState<boolean>(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    if (openReactHookForm) setOpenReactHookForm(false);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  return {
    openModal,
    closeModal,
    isOpen,
    openReactHookForm,
    setOpenReactHookForm,
  };
};
