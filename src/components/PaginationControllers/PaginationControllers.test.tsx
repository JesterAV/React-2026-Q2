import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import PaginationControllers from './PaginationControllers';

describe('PaginationControllers component', () => {
  const mockOnChangePage = vi.fn();

  describe('Correctly render', () => {
    test('Current page and buttons', () => {
      render(
        <PaginationControllers
          currentPage={3}
          totalPages={10}
          onChangePage={mockOnChangePage}
          hasNext={true}
        />
      );

      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Prev')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
  });

  describe('Button states', () => {
    test('Prev button disabled on first page', () => {
      render(
        <PaginationControllers
          currentPage={1}
          totalPages={10}
          onChangePage={mockOnChangePage}
          hasNext={true}
        />
      );

      expect(screen.getByText('Prev')).toBeDisabled();
      expect(screen.getByText('Next')).not.toBeDisabled();
    });

    test('Next button disabled when no next page', () => {
      render(
        <PaginationControllers
          currentPage={10}
          totalPages={10}
          onChangePage={mockOnChangePage}
          hasNext={false}
        />
      );

      expect(screen.getByText('Next')).toBeDisabled();
      expect(screen.getByText('Prev')).not.toBeDisabled();
    });
  });

  describe('User interactions', () => {
    test('Clicking Prev calls onChangePage with currentPage - 1', async () => {
      const user = userEvent.setup();
      
      render(
        <PaginationControllers
          currentPage={5}
          totalPages={10}
          onChangePage={mockOnChangePage}
          hasNext={true}
        />
      );

      await user.click(screen.getByText('Prev'));
      expect(mockOnChangePage).toHaveBeenCalledWith(4);
    });

    test('Clicking Next calls onChangePage with currentPage + 1', async () => {
      const user = userEvent.setup();
      
      render(
        <PaginationControllers
          currentPage={5}
          totalPages={10}
          onChangePage={mockOnChangePage}
          hasNext={true}
        />
      );

      await user.click(screen.getByText('Next'));
      expect(mockOnChangePage).toHaveBeenCalledWith(6);
    });

    test('Clicking disabled Prev button does not call onChangePage', async () => {
      const user = userEvent.setup();
      
      render(
        <PaginationControllers
          currentPage={1}
          totalPages={10}
          onChangePage={mockOnChangePage}
          hasNext={true}
        />
      );

      await user.click(screen.getByText('Prev'));
      expect(mockOnChangePage).not.toHaveBeenCalled();
    });

    test('Clicking disabled Next button does not call onChangePage', async () => {
      const user = userEvent.setup();
      
      render(
        <PaginationControllers
          currentPage={10}
          totalPages={10}
          onChangePage={mockOnChangePage}
          hasNext={false}
        />
      );

      await user.click(screen.getByText('Next'));
      expect(mockOnChangePage).not.toHaveBeenCalled();
    });
  });
});