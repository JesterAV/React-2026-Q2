import { describe, expect, test } from 'vitest';
import { formSchema } from './validationsSchemas';

describe('formSchema validation rules', () => {
  describe('name validation', () => {
    test('success on empty string or uppercase starting letter', () => {
      expect(formSchema.shape.name.safeParse('').success).toBe(true);
      expect(formSchema.shape.name.safeParse('Dean').success).toBe(true);
      expect(formSchema.shape.name.safeParse('Sam').success).toBe(true);
    });

    test('failure on lowercase starting letter', () => {
      const result = formSchema.shape.name.safeParse('sam');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'First letter must be uppercase'
        );
      }
    });
  });

  describe('age validation', () => {
    test('success on empty string or positive numeric values', () => {
      expect(formSchema.shape.age.safeParse('').success).toBe(true);
      expect(formSchema.shape.age.safeParse('25').success).toBe(true);
      expect(formSchema.shape.age.safeParse('1').success).toBe(true);
    });

    test('failure on text, negative numbers or zero', () => {
      const textResult = formSchema.shape.age.safeParse('abc');
      const negativeResult = formSchema.shape.age.safeParse('-5');
      const zeroResult = formSchema.shape.age.safeParse('0');

      expect(textResult.success).toBe(false);
      expect(negativeResult.success).toBe(false);
      expect(zeroResult.success).toBe(false);

      if (!textResult.success) {
        expect(textResult.error.issues[0].message).toBe(
          'Age must be a positive number'
        );
      }
    });
  });

  describe('email validation', () => {
    test('success on empty string or proper layout credentials', () => {
      expect(formSchema.shape.email.safeParse('').success).toBe(true);
      expect(formSchema.shape.email.safeParse('test@example.com').success).toBe(
        true
      );
      expect(
        formSchema.shape.email.safeParse('user.name@sub.domain.org').success
      ).toBe(true);
    });

    test('failure on missing parts, excess symbols or empty tokens', () => {
      expect(formSchema.shape.email.safeParse('testexample.com').success).toBe(
        false
      );
      expect(
        formSchema.shape.email.safeParse('test@ex@ample.com').success
      ).toBe(false);
      expect(formSchema.shape.email.safeParse('@example.com').success).toBe(
        false
      );
      expect(formSchema.shape.email.safeParse('test@com').success).toBe(false);

      const result = formSchema.shape.email.safeParse('test@domain.');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Invalid email format (must contain one @, non-empty local part, and a valid domain with a dot)'
        );
      }
    });
  });

  describe('password validation', () => {
    test('success on empty string or composite symbols matrix', () => {
      expect(formSchema.shape.password.safeParse('').success).toBe(true);
      expect(formSchema.shape.password.safeParse('Pass123!').success).toBe(
        true
      );
      expect(formSchema.shape.password.safeParse('Vild_P4ss').success).toBe(
        true
      );
    });

    test('failure on missing digits, characters or special indicators', () => {
      expect(formSchema.shape.password.safeParse('password').success).toBe(
        false
      );
      expect(formSchema.shape.password.safeParse('PASSWORD123').success).toBe(
        false
      );
      expect(formSchema.shape.password.safeParse('Pass1234').success).toBe(
        false
      );

      const result = formSchema.shape.password.safeParse('pass123!');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Password must contain: 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character'
        );
      }
    });
  });

  describe('img validation', () => {
    test('success on null or appropriate dimension formats', () => {
      expect(formSchema.shape.img.safeParse(null).success).toBe(true);

      const validFile = new File([''], 'test.png', { type: 'image/png' });
      Object.defineProperty(validFile, 'size', { value: 1024 });
      expect(formSchema.shape.img.safeParse(validFile).success).toBe(true);
    });

    test('failure on oversize boundary markers', () => {
      const hugeFile = new File([''], 'big.png', { type: 'image/png' });
      Object.defineProperty(hugeFile, 'size', { value: 3 * 1024 * 1024 });

      const result = formSchema.shape.img.safeParse(hugeFile);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'File size is more than 2MB'
        );
      }
    });

    test('failure on unmatched mimetype streams', () => {
      const badFile = new File([''], 'doc.txt', { type: 'text/plain' });
      Object.defineProperty(badFile, 'size', { value: 1024 });

      const result = formSchema.shape.img.safeParse(badFile);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Only jpeg, jpg and png formats are supported'
        );
      }
    });
  });

  describe('other properties validation', () => {
    test('passes basic data type schemas', () => {
      const fullDataset = {
        name: 'John',
        age: '30',
        email: 'john@example.com',
        password: 'Secure1_',
        img: null,
        gender: 'Male',
        country: 'USA',
        acceptTerms: true,
      };

      expect(formSchema.safeParse(fullDataset).success).toBe(true);
    });
  });
});
