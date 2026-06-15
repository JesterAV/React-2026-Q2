interface SelectedITemProps {
  img: string,
  name: string
}

function SelectedItem(props: SelectedITemProps) {
  const { img, name } = props;

  return (
    <div className="selected-item">
      <img src={img} alt={name} className="selected-item__img" />
      <p className="selected-item__text">{name}</p>
    </div>
  )
}

export default SelectedItem;