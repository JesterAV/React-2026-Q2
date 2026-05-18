import './CharacterCard.scss';

interface CharacterCardProps {
  name: string;
  img: string;
  actor: string[];
  id: string;
  setId: (data: string) => void;
}

function CharacterCard(props: CharacterCardProps) {
  const {name, img, actor, id, setId} = props;

  const handleClick = () => {
    setId(id);
  }

  return (
    <div className="character-card" onClick={() => handleClick()}>

      <img className='character-card__img' src={img} alt={name} />

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

export default CharacterCard;