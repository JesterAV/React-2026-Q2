import { useState } from 'react';
import ValidationError from '../../../ValidationError/ValidationError';
import { formSchema } from '../Form/validationsSchemas';

interface ImageUploadFieldProps {
  labelText: string;
  setImage: (image: string) => void;
}

const ImageUploadField = (props: ImageUploadFieldProps) => {
  const [error, setError] = useState<string | null>(null);

  const { labelText, setImage } = props;

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));

      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];

    if (!file) return;

    const result = formSchema.shape.img.safeParse(file);

    if (!result.success) {
      setError(result.error.issues[0].message);
      e.target.value = '';
      return;
    }

    setError(null);

    try {
      const base64 = await convertToBase64(file);
      setImage(base64);
    } catch {
      setError('Failed to convert image');
    }
  };

  return (
    <div className="form-field">
      <label className="form-field__label">{labelText}</label>
      <input
        className="form-field__image-upload"
        type="file"
        onChange={handleFileChange}
        required
      />
      {error && <ValidationError errorText={error} />}
    </div>
  );
};

export default ImageUploadField;
