import './AnswersList.scss';

import { useSelector } from 'react-redux';
import type { RootState } from '../../stores/store';
import Answer from '../Answer/Answer';

export default function AnswersList() {
  const answers = useSelector((state: RootState) => state.answers.answers);

  return (
    <div className="answers-list">
      {answers.map((answer) => (
        <Answer
          key={answer.id}
          country={answer.country}
          img={answer.img}
          name={answer.name}
          age={answer.age}
          email={answer.email}
          gender={answer.gender}
          acceptTerms={answer.acceptTerms}
          password={answer.password}
        />
      ))}
    </div>
  );
}
