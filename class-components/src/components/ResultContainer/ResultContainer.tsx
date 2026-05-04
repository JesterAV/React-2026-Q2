import { Component } from 'react';
import './ResultContainer.scss';
import CharacterCard from '../CharacterCard/CharacterCard';
import type { Character } from '../../types/characters';

interface ResultContainerProps {
  characters: Character[];
}

class ResultContainer extends Component<ResultContainerProps> {
  render() {
    return (
      <div className='result-container'>
        {this.props.characters.map((character) => {
          return <CharacterCard name={character.name} img={character.img} actor={character.actor} />
        })}
      </div>
    )
  }
}

export default ResultContainer;