import './SelectedItems.scss';

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../types/state";
import { useEffect, useState } from "react";
import { supernaturalApi } from "../../services/supernaturalApi";
import type { Character } from "../../types/characters";
import SelectedItem from "./SelectedItem";
import Button from '../Button/Button';
import { clearSelected } from '../../store/slices/selectCards';
import downloadCSV from '../../utils/downloadCSV';

function SelectedItems() {
  const selectedItemsIds = useSelector((state: RootState) => state.selectedCards.selectCards);
  const [selectedItems, setSelectedItems] = useState<Character[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const item = await Promise.all(selectedItemsIds.map(itemId => supernaturalApi.getCharacterById(itemId)))
      setSelectedItems(item);
    })();
  }, [selectedItemsIds]);

  if (selectedItems.length === 0) return null;
  
  return (
    <div className="selected-items">
      <div className='selected-items__header'>
        <p className='selected-items__counter'>Selected: {selectedItems.length}</p>
        <Button text='Deselect all' type='button' onClick={() => dispatch(clearSelected())} />
        <Button text='Download' type='button' onClick={() => downloadCSV(selectedItems)} />
      </div>
      <div className='selected-items__main'>
        {selectedItems.map(item => <SelectedItem img={item.img} name={item.name} key={item.id} />)}
      </div>
    </div>
  )
}

export default SelectedItems;