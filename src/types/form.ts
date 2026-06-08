export interface FormAnswer {
  name: string;
  age: string;
  email: string;
  gender: string;
  country: string;
  acceptTerms: boolean;
  password: string;
  img: string;
}

export interface FormAnswerToStore extends FormAnswer {
  id: string;
}
