import { Component } from 'react';
import './ResultContainer.scss';
import CharacterCard from '../CharacterCard/CharacterCard';
import type { Character } from '../../types/characters';
import ResultContainerError from './ResultContainerError';

interface ResultContainerProps {
  characters: Character[];
}

class ResultContainer extends Component<ResultContainerProps> {
  render() {
    const characters = this.props.characters;
    return (
      <div className='result-container'>
        {characters.length === 0 
          ? <ResultContainerError /> 
          : characters.map((character) => {
          return <CharacterCard name={character.name} img={character.img} actor={character.actor} />
        })}
      </div>
    )
  }
}

export default ResultContainer;