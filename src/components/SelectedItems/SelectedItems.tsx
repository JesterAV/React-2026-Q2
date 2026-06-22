'use client';

import './SelectedItems.scss';

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../types/state";
import Button from '../Button/Button';
import { clearSelected } from '../../store/slices/selectCards';
import downloadCSV from '../../utils/downloadCSV';
import SelectedCharacter from './SelectedCharacter';
import { clearSelectedCharacters } from '../../store/slices/characters';
import { useTranslations } from 'next-intl';

function SelectedItems() {
  const selectedItemsIds = useSelector((state: RootState) => state.selectedCards.selectCards);
  const selectedCharacters = useSelector((state: RootState) => state.selectedCharacters.selectedCharacters);
  const t = useTranslations('selectedItem');

  const dispatch = useDispatch();

  const handleDeselect = () => {
    dispatch(clearSelected());
    dispatch(clearSelectedCharacters());
  }

  if (selectedItemsIds.length === 0) return null;
  
  return (
    <div className="selected-items">
      <div className='selected-items__header'>
        <p className='selected-items__counter'>{t('selectedItemCounter')} {selectedItemsIds.length}</p>
        <Button text={t('selectedItemDeselectButton')} type='button' onClick={handleDeselect} />
        <Button text={t('Download')} type='button' onClick={() => downloadCSV(selectedCharacters)} />
      </div>
      <div className='selected-items__main'>
        {selectedItemsIds.map(id => (<SelectedCharacter key={id} id={id} />))}
      </div>
    </div>
  )
}

export default SelectedItems;