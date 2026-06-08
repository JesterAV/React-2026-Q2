import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import ImageUploadField from './ImageUploadField';
import userEvent from '@testing-library/user-event';
import { formSchema } from '../Form/validationsSchemas';
import { ZodError } from 'zod';

vi.mock('../Form/validationsSchemas', () => ({
  formSchema: {
    shape: {
      img: {
        safeParse: vi.fn(),
      },
    },
  },
}));

vi.mock('../../../ValidationError/ValidationError', () => ({
  default: ({ errorText }: { errorText: string }) => <div>{errorText}</div>,
}));

describe('ImageUploadField component', () => {
  const mockSetImage = vi.fn();
  const labelText = 'Upload Image';

  beforeEach(() => {
    vi.clearAllMocks();
    const mockSafeParse = vi.mocked(formSchema.shape.img.safeParse);
    const mockSuccessResult = {
      success: true as const,
      data: new File([], 'test.png'),
    };
    mockSafeParse.mockReturnValue(mockSuccessResult);
  });

  describe('Correctly render', () => {
    test('Label and file input', () => {
      const { container } = render(
        <ImageUploadField labelText={labelText} setImage={mockSetImage} />
      );

      expect(screen.getByText(labelText)).toBeInTheDocument();

      const input = container.querySelector('input[type="file"]');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'file');
      expect(input).toBeRequired();
    });
  });

  describe('User interactions', () => {
    test('Success image upload and conversion', async () => {
      const user = userEvent.setup();

      const fileData = 'data:image/png;base64,test';
      const readAsDataURLSpy = vi
        .spyOn(FileReader.prototype, 'readAsDataURL')
        .mockImplementation(function (this: FileReader) {
          Object.defineProperty(this, 'result', {
            value: fileData,
            writable: false,
          });
          if (this.onload) {
            const event = new ProgressEvent('load');
            Object.defineProperty(event, 'target', {
              value: this,
              writable: false,
            });
            this.onload(event as ProgressEvent<FileReader>);
          }
        });

      const { container } = render(
        <ImageUploadField labelText={labelText} setImage={mockSetImage} />
      );

      const file = new File(['hello'], 'hello.png', { type: 'image/png' });
      const input = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      await user.upload(input, file);

      expect(formSchema.shape.img.safeParse).toHaveBeenCalledWith(file);
      expect(mockSetImage).toHaveBeenCalledWith(fileData);
      expect(
        screen.queryByText('Failed to convert image')
      ).not.toBeInTheDocument();

      readAsDataURLSpy.mockRestore();
    });

    test('Validation error on wrong file type', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Invalid file type';
      const mockSafeParse = vi.mocked(formSchema.shape.img.safeParse);

      const mockZodError = new ZodError([
        { message: errorMessage, code: 'custom', path: [] },
      ]);

      const mockErrorResult = {
        success: false as const,
        error: mockZodError as unknown as ZodError<File | null>,
      };
      mockSafeParse.mockReturnValue(mockErrorResult);

      const { container } = render(
        <ImageUploadField labelText={labelText} setImage={mockSetImage} />
      );

      const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
      const input = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      await user.upload(input, file);

      expect(formSchema.shape.img.safeParse).toHaveBeenCalledWith(file);
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(mockSetImage).not.toHaveBeenCalled();
      expect(input).toHaveValue('');
    });

    test('FileReader rejection error', async () => {
      const user = userEvent.setup();
      const readAsDataURLSpy = vi
        .spyOn(FileReader.prototype, 'readAsDataURL')
        .mockImplementation(function (this: FileReader) {
          if (this.onerror) {
            const event = new ProgressEvent('error');
            Object.defineProperty(event, 'target', {
              value: this,
              writable: false,
            });
            this.onerror(event as ProgressEvent<FileReader>);
          }
        });

      const { container } = render(
        <ImageUploadField labelText={labelText} setImage={mockSetImage} />
      );

      const file = new File(['hello'], 'hello.png', { type: 'image/png' });
      const input = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      await user.upload(input, file);

      expect(screen.getByText('Failed to convert image')).toBeInTheDocument();
      expect(mockSetImage).not.toHaveBeenCalled();

      readAsDataURLSpy.mockRestore();
    });
  });
});
