import { renderHook } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { useFormContext, FormProvider } from './FormContext';
import React from 'react';

describe('FormContext wrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Correctly render', () => {
    test('Returns context dataset when wrapped inside provider scope', () => {
      const mockOnClose = vi.fn();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <FormProvider value={{ onClose: mockOnClose }}>{children}</FormProvider>
      );

      const { result } = renderHook(() => useFormContext(), { wrapper });

      expect(result.current.onClose).toBe(mockOnClose);
    });

    test('Throws structural error message outside initialization block', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => renderHook(() => useFormContext())).toThrowError(
        'useFormContext must be used with FormProvider'
      );

      consoleSpy.mockRestore();
    });
  });
});
