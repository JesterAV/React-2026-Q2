import './ResultContainer.scss';

import CharacterCard from '../CharacterCard/CharacterCard';
import type { Character } from '../../types/characters';
import ResultContainerError from './ResultContainerError';

interface ResultContainerProps {
  characters: Character[];
  setId: (data: string) => void;
}

function ResultContainer({ characters, setId }: ResultContainerProps) {
  return (
    <div className='result-container'>
      {characters.length === 0 
        ? <ResultContainerError /> 
        : characters.map((character, index) => {
        return <CharacterCard 
          key={character.id || index} 
          name={character.name} 
          img={character.img} 
          actor={character.actor}
          id={character.id}
          setId={setId}
        />
      })}
    </div>
  )
}

export default ResultContainer;