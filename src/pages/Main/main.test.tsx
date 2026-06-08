import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import MainPage from './main';
import userEvent from '@testing-library/user-event';
import { useModal } from '../../hooks/useModal';

vi.mock('../../hooks/useModal', () => ({
  useModal: vi.fn(),
}));

vi.mock('../../components/Button/Button', () => ({
  default: ({ text, onClick }: { text: string; onClick?: () => void }) => (
    <button type="button" onClick={onClick}>
      {text}
    </button>
  ),
}));

vi.mock('../../components/ModalForm/ModalForm', () => ({
  default: ({
    children,
    closeHandler,
  }: {
    children: React.ReactNode;
    closeHandler: () => void;
  }) => (
    <div data-testid="modal-form">
      <button type="button" onClick={closeHandler}>
        Close Modal Button
      </button>
      {children}
    </div>
  ),
}));

vi.mock('../../components/ModalForm/components/Form/UncontrolledForm', () => ({
  default: () => (
    <div data-testid="uncontrolled-form">Uncontrolled Form Component</div>
  ),
}));

vi.mock('../../components/ModalForm/components/Form/ReactHookForm', () => ({
  default: () => (
    <div data-testid="react-hook-form">React Hook Form Component</div>
  ),
}));

vi.mock('../../components/AnswersList/AnswersList', () => ({
  default: () => <div data-testid="answers-list">Answers List Component</div>,
}));

describe('MainPage component', () => {
  const mockOpenModal = vi.fn();
  const mockCloseModal = vi.fn();
  const mockSetOpenReactHookForm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useModal).mockReturnValue({
      openModal: mockOpenModal,
      closeModal: mockCloseModal,
      isOpen: false,
      openReactHookForm: false,
      setOpenReactHookForm: mockSetOpenReactHookForm,
    });
  });

  describe('Correctly render', () => {
    test('Action buttons and answers list container', () => {
      render(<MainPage />);

      expect(
        screen.getByRole('button', { name: 'Open uncontrolled form' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Open React Hook Form' })
      ).toBeInTheDocument();
      expect(screen.getByTestId('answers-list')).toBeInTheDocument();
      expect(screen.queryByTestId('modal-form')).not.toBeInTheDocument();
    });

    test('Uncontrolled Form within modal dialog', () => {
      vi.mocked(useModal).mockReturnValue({
        openModal: mockOpenModal,
        closeModal: mockCloseModal,
        isOpen: true,
        openReactHookForm: false,
        setOpenReactHookForm: mockSetOpenReactHookForm,
      });

      render(<MainPage />);

      expect(screen.getByTestId('modal-form')).toBeInTheDocument();
      expect(screen.getByTestId('uncontrolled-form')).toBeInTheDocument();
      expect(screen.queryByTestId('react-hook-form')).not.toBeInTheDocument();
    });

    test('React Hook Form within modal dialog', () => {
      vi.mocked(useModal).mockReturnValue({
        openModal: mockOpenModal,
        closeModal: mockCloseModal,
        isOpen: true,
        openReactHookForm: true,
        setOpenReactHookForm: mockSetOpenReactHookForm,
      });

      render(<MainPage />);

      expect(screen.getByTestId('modal-form')).toBeInTheDocument();
      expect(screen.getByTestId('react-hook-form')).toBeInTheDocument();
      expect(screen.queryByTestId('uncontrolled-form')).not.toBeInTheDocument();
    });
  });

  describe('User interactions', () => {
    test('Triggers opening routine for uncontrolled wizard variant', async () => {
      const user = userEvent.setup();
      render(<MainPage />);

      const button = screen.getByRole('button', {
        name: 'Open uncontrolled form',
      });
      await user.click(button);

      expect(mockOpenModal).toHaveBeenCalledTimes(1);
    });

    test('Triggers state adjustment steps for react hook wrapper toggle', async () => {
      const user = userEvent.setup();
      render(<MainPage />);

      const button = screen.getByRole('button', {
        name: 'Open React Hook Form',
      });
      await user.click(button);

      expect(mockOpenModal).toHaveBeenCalledTimes(1);
      expect(mockSetOpenReactHookForm).toHaveBeenCalledWith(true);
    });

    test('Executes closure callback on backdrop background hit', async () => {
      vi.mocked(useModal).mockReturnValue({
        openModal: mockOpenModal,
        closeModal: mockCloseModal,
        isOpen: true,
        openReactHookForm: false,
        setOpenReactHookForm: mockSetOpenReactHookForm,
      });

      const user = userEvent.setup();
      const { container } = render(<MainPage />);

      const overlay = container.querySelector('.modal-overlay');
      expect(overlay).toBeInTheDocument();

      if (overlay) {
        await user.click(overlay);
      }

      expect(mockCloseModal).toHaveBeenCalledTimes(1);
    });

    test('Ignores closure commands when content box internals are clicked', async () => {
      vi.mocked(useModal).mockReturnValue({
        openModal: mockOpenModal,
        closeModal: mockCloseModal,
        isOpen: true,
        openReactHookForm: false,
        setOpenReactHookForm: mockSetOpenReactHookForm,
      });

      const user = userEvent.setup();
      render(<MainPage />);

      const modalContent = screen.getByTestId('uncontrolled-form');
      await user.click(modalContent);

      expect(mockCloseModal).not.toHaveBeenCalled();
    });
  });
});
