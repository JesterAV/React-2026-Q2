import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ModalForm from './ModalForm';

vi.mock('../../context/FormContext', () => {
  return {
    FormProvider: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value: { onClose: () => void };
    }) => (
      <div data-testid="mock-form-provider" onClick={value.onClose}>
        {children}
      </div>
    ),
  };
});

describe('ModalForm component', () => {
  const mockCloseHandler = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Correctly render', () => {
    test('renders close button and children content inside portal', () => {
      render(
        <ModalForm closeHandler={mockCloseHandler}>
          <div data-testid="child-element">Modal Content</div>
        </ModalForm>
      );

      expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument();
      expect(screen.getByTestId('child-element')).toBeInTheDocument();
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });
  });

  describe('User interactions', () => {
    test('calls closeHandler when close button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ModalForm closeHandler={mockCloseHandler}>
          <div>Content</div>
        </ModalForm>
      );

      const closeButton = screen.getByRole('button', { name: '×' });
      await user.click(closeButton);

      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });

    test('stops propagation when modal wrapper is clicked', async () => {
      const user = userEvent.setup();
      const parentClickMock = vi.fn();

      render(
        <div onClick={parentClickMock}>
          <ModalForm closeHandler={mockCloseHandler}>
            <div data-testid="inside-click">Inside</div>
          </ModalForm>
        </div>
      );

      const insideElement = screen.getByTestId('inside-click');
      await user.click(insideElement);

      expect(parentClickMock).not.toHaveBeenCalled();
    });
  });

  describe('Context integration', () => {
    test('provides closeHandler through FormProvider value', async () => {
      const user = userEvent.setup();
      render(
        <ModalForm closeHandler={mockCloseHandler}>
          <div data-testid="trigger-context">Trigger</div>
        </ModalForm>
      );

      const provider = screen.getByTestId('mock-form-provider');
      await user.click(provider);

      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });
  });
});
