'use client';

import { useDispatch, useSelector } from 'react-redux';
import { toggleSelectCard } from '../../store/slices/selectCards';
import './CharacterCard.scss';
import type { RootState } from '../../types/state';
import { useGetCharacterByIdQuery } from '../../store/api/supernaturalApi';
import { toggleSelectCharacter } from '../../store/slices/characters';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface CharacterCardProps {
  name: string;
  img: string;
  actor: string[];
  id: string;
  setId: (data: string) => void;
}

function CharacterCard(props: CharacterCardProps) {
  const { name, img, actor, id, setId } = props;

  const dispatch = useDispatch();
  const selectedCards = useSelector((state: RootState) => state.selectedCards.selectCards);
  const isSelected = selectedCards.includes(id);

  const t = useTranslations('characterCard');

  const { data } = useGetCharacterByIdQuery(id);

  const handleClick = () => {
    setId(id);
  };

  const handleCheckboxChange = (e: React.ChangeEvent) => {
    e.stopPropagation();
    dispatch(toggleSelectCard(id));
    dispatch(toggleSelectCharacter(data));
  };

  return (
    <div className="character-card" onClick={() => handleClick()}>
      <Image className='character-card__img' src={img} alt={name}
        width={200}
        height={111}
      />
      <input
        type='checkbox'
        onChange={handleCheckboxChange}
        checked={isSelected}
        onClick={(e) => e.stopPropagation()}
      />
      <div className='character-card__separator'></div>
      <div className='character-card__container'>
        <span className='character-card__text'>{name}</span>
      </div>
      <div className='character-card__separator'></div>
      <div className='character-card__container'>
        <span className='character-card__text'>{t('actor')} {`${actor.join(', ')}`}</span>
      </div>
    </div>
  );
}

export default CharacterCard;