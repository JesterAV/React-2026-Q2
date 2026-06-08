import { renderHook, act } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { useModal } from './useModal';

describe('useModal hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Correctly render', () => {
    test('Initial state values', () => {
      const { result } = renderHook(() => useModal());

      expect(result.current.isOpen).toBe(false);
      expect(result.current.openReactHookForm).toBe(false);
      expect(typeof result.current.openModal).toBe('function');
      expect(typeof result.current.closeModal).toBe('function');
      expect(typeof result.current.setOpenReactHookForm).toBe('function');
    });
  });

  describe('User interactions', () => {
    test('Opens modal dialog', () => {
      const { result } = renderHook(() => useModal());

      act(() => {
        result.current.openModal();
      });

      expect(result.current.isOpen).toBe(true);
    });

    test('Closes modal dialog and resets sub-form state', () => {
      const { result } = renderHook(() => useModal());

      act(() => {
        result.current.openModal();
        result.current.setOpenReactHookForm(true);
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.openReactHookForm).toBe(true);

      act(() => {
        result.current.closeModal();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.openReactHookForm).toBe(false);
    });

    test('Closes modal dialog via escape keyboard layout press', () => {
      const { result } = renderHook(() => useModal());

      act(() => {
        result.current.openModal();
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      });

      expect(result.current.isOpen).toBe(false);
    });

    test('Ignores other key variants on keyboard down triggers', () => {
      const { result } = renderHook(() => useModal());

      act(() => {
        result.current.openModal();
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      });

      expect(result.current.isOpen).toBe(true);
    });
  });
});
