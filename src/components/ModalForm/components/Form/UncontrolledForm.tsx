import './Form.scss';

import SelectFormField from '../FormField/SelectFormFiled';
import CheckboxFormFiled from '../FormField/CheckboxFormField';
import Button from '../../../Button/Button';
import { useRef, useState } from 'react';
import type { FormAnswerToStore } from '../../../../types/form';
import { useDispatch } from 'react-redux';
import { saveAnswer } from '../../../../stores/slices/formAnswersSlice';
import { useFormContext } from '../../../../context/FormContext';
import ImageUploadField from '../FormField/ImageUploadField';
import CountyFormField from '../FormField/CountryFormField';
import PasswordFormField from '../FormField/PasswordFormField';
import NameFormField from '../FormField/NameFormFiled';
import AgeFormField from '../FormField/AgeFormField';
import EmailFormField from '../FormField/EmailFormField';

export default function UncontrolledForm() {
  const { onClose } = useFormContext();

  const dispatch = useDispatch();

  const [uploadImage, setUploadImage] = useState<string>('');
  const [isValidForm, setIsValidForm] = useState<boolean>(true);

  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const answerId = crypto.randomUUID();

    const answer: FormAnswerToStore = {
      name: nameRef.current?.value || '',
      age: ageRef.current?.value || '',
      email: emailRef.current?.value || '',
      gender: genderRef.current?.value || '',
      acceptTerms: termsRef.current?.checked || false,
      country: countryRef.current?.value || '',
      password: passwordRef.current?.value || '',
      img: uploadImage,
      id: answerId,
    };

    if (isValidForm) {
      dispatch(saveAnswer(answer));

      setUploadImage('');
      formRef.current?.reset();

      onClose();
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} ref={formRef}>
      <NameFormField
        placeholder="enter name"
        required={true}
        ref={nameRef}
        setIsValidForm={setIsValidForm}
      />
      <AgeFormField
        placeholder="enter your age"
        required={true}
        ref={ageRef}
        setIsValidForm={setIsValidForm}
      />
      <EmailFormField
        placeholder="enter email"
        required={true}
        ref={emailRef}
        setIsValidForm={setIsValidForm}
      />
      <CountyFormField
        labelText="country"
        ref={countryRef}
        setIsValidForm={setIsValidForm}
      />
      <SelectFormField
        labelText="gender"
        placeholder="Select gender"
        options={['Male', 'Female']}
        ref={genderRef}
      />
      <ImageUploadField labelText="upload image" setImage={setUploadImage} />
      <PasswordFormField
        firstLabelText="password"
        secondLabelText="confirm password"
        setIsValidForm={setIsValidForm}
      />

      <CheckboxFormFiled labelText="Accept terms of use" ref={termsRef} />
      <Button text="Send" type="submit" />
    </form>
  );
}
