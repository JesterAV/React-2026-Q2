import './Answer.scss';
import type { FormAnswer } from '../../types/form';

export default function Answer(props: FormAnswer) {
  const { name, age, email, gender, acceptTerms, img, country } = props;

  return (
    <div className="answer">
      <p className="answer__text">name: {name}</p>
      <p className="answer__text">age: {age}</p>
      <p className="answer__text">email: {email}</p>
      <p className="answer__text">gender: {gender}</p>
      <p className="answer__text">country: {country}</p>
      <p className="answer__text">{`Accept terms: ${acceptTerms}`}</p>
      <img className="answer__image" src={img!} alt={name} />
    </div>
  );
}
