'use client'

import './DetailCard.scss';
import Loader from '../Loader/Loader';
import { useGetCharacterByIdQuery } from '../../store/api/supernaturalApi';
import { useEffect, useState } from 'react';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Image from 'next/image';

function DetailCard({id, handleSetCard}: {id: string, handleSetCard: (data: string | null) => void}) {
  const [error, setError] = useState<string | null>(null);
  const { data: character, isLoading, error: apiError } = useGetCharacterByIdQuery(id);

  useEffect(() => {
    if (character) {
      handleSetCard(id);
    }
  }, [id])

  useEffect(() => {
    if (apiError) setError('Failed to load character data');
  })

  if (isLoading) return <Loader />
  if (!character) return null;

  return (
    <div className='detail-card'>
      {
        isLoading ? <Loader /> : 
        (
          <>
            <h1 className='detail-card__title'>{character?.name}</h1>
            <Image width={350} height={197} src={character?.img} alt={character?.name} className='detail-card__image' />
            <p className='detail-card__text'>{`Actor: ${character?.actor.join(', ')}`}</p>
            <p className='detail-card__text'>{`Episodes: ${character?.episodes.map((episode: {title: string}) => episode.title)}`}</p>
            <p className='detail-card__text'>{`Occupation: ${character?.occupation}`}</p>

            <div className='detail-card__close-button' onClick={() => handleSetCard(null)}>
              <span className='detail-card__close-button_line-one'></span>
              <span className='detail-card__close-button_line-two'></span>
            </div>
            {
              error && (
                <ErrorMessage
                  message={error}
                  onClose={() => setError(null)}
                />
              )
            }
          </>
        )
      }
    </div>
  )
}

export default DetailCard;