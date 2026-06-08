import SelectFormField from '../FormField/SelectFormFiled';
import CheckboxFormFiled from '../FormField/CheckboxFormField';
import Button from '../../../Button/Button';
import { Controller, useForm } from 'react-hook-form';
import type { FormAnswer } from '../../../../types/form';
import { useDispatch } from 'react-redux';
import { saveAnswer } from '../../../../stores/slices/formAnswersSlice';
import { useFormContext } from '../../../../context/FormContext';
import ImageUploadField from '../FormField/ImageUploadField';
import { useState } from 'react';
import CountyFormField from '../FormField/CountryFormField';
import PasswordFormField from '../FormField/PasswordFormField';
import NameFormField from '../FormField/NameFormFiled';
import AgeFormField from '../FormField/AgeFormField';
import EmailFormField from '../FormField/EmailFormField';

export default function ReactHookForm() {
  const [uploadImage, setUploadImage] = useState<string>('');
  const [isValidForm, setIsValidForm] = useState<boolean>(true);

  const dispatch = useDispatch();
  const { onClose } = useFormContext();

  const { control, handleSubmit, reset } = useForm<FormAnswer>({
    defaultValues: {
      name: '',
      age: '',
      email: '',
      gender: '',
      country: '',
      password: '',
      acceptTerms: false,
    },
  });

  const onSubmit = (answer: FormAnswer) => {
    if (isValidForm) {
      const answerId = crypto.randomUUID();
      dispatch(
        saveAnswer({
          ...answer,
          id: answerId,
          img: uploadImage,
        })
      );
      reset();
      onClose();
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <NameFormField
            placeholder="enter name"
            required={true}
            setIsValidForm={setIsValidForm}
            {...field}
          />
        )}
      />
      <Controller
        name="age"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <AgeFormField
            placeholder="enter your age"
            required={true}
            {...field}
            setIsValidForm={setIsValidForm}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <EmailFormField
            placeholder="enter email"
            required={true}
            {...field}
            setIsValidForm={setIsValidForm}
          />
        )}
      />
      <Controller
        name="gender"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <SelectFormField
            labelText="gender"
            placeholder="Select gender"
            options={['Male', 'Female']}
            {...field}
          />
        )}
      />
      <Controller
        name="country"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <CountyFormField
            labelText="country"
            setIsValidForm={setIsValidForm}
            {...field}
          />
        )}
      />
      <ImageUploadField labelText="upload image" setImage={setUploadImage} />
      <Controller
        name="password"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <PasswordFormField
            firstLabelText="password"
            secondLabelText="confirm password"
            setIsValidForm={setIsValidForm}
            {...field}
          />
        )}
      />
      <Controller
        name="acceptTerms"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <CheckboxFormFiled labelText="Accept terms of use" {...field} />
        )}
      />
      <Button text="Send" type="submit" />
    </form>
  );
}
