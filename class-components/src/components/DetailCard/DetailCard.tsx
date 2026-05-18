import { useEffect, useState } from 'react';
import { supernaturalApi } from '../../services/supernaturalApi';
import './DetailCard.scss';
import Loader from '../Loader/Loader';
import type { Character } from '../../types/characters';

function DetailCard({id, handleSetCard}: {id: string, handleSetCard: (data: string | null) => void}) {
  const [isLoading, setIsLoading] = useState(false);
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      try {
        const character = await supernaturalApi.getCharacterById(id);
        setCharacter(character);
        handleSetCard(id);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className='detail-card'>
      {
        isLoading ? <Loader /> : 
        (
          <>
            <h1 className='detail-card__title'>{character?.name}</h1>
            <img src={character?.img} alt={character?.name} className='detail-card__image' />
            <p className='detail-card__text'>{`Actor: ${character?.actor.join(', ')}`}</p>
            <p className='detail-card__text'>{`Episodes: ${character?.episodes.map(episode => episode.title)}`}</p>
            <p className='detail-card__text'>{`Occupation: ${character?.occupation}`}</p>

            <div className='detail-card__close-button' onClick={() => handleSetCard(null)}>
              <span className='detail-card__close-button_line-one'></span>
              <span className='detail-card__close-button_line-two'></span>
            </div>
          </>
        )
      }
    </div>
  )
}

export default DetailCard;