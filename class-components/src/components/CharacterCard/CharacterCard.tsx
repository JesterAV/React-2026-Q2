import './CharacterCard.scss';

import { Component } from "react";

interface CharacterCardProps {
  name: string;
  img: string;
  actor: string[];
}

class CharacterCard extends Component<CharacterCardProps> {
  render() {
    const {name, img, actor} = this.props;

    return (
      <div className="character-card">
        <img className='character-card__img' src={img} />

        <div className='character-card__separator'></div>

        <div className='character-card__container'>
          <span className='character-card__text'>{name}</span>
        </div>

        <div className='character-card__separator'></div>

        <div className='character-card__container'>
          <span className='character-card__text'>{`Actor: ${actor.join(', ')}`}</span>
        </div>
      </div>
    )
  }
}

export default CharacterCard;