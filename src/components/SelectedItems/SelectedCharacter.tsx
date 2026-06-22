'use client';

import { useGetCharacterByIdQuery } from "../../store/api/supernaturalApi";
import SelectedItem from "./SelectedItem";

export default function SelectedCharacter({id}: {id: string}) {
  const {data} = useGetCharacterByIdQuery(id);
  
  if (!data) return null;

  return (
    <SelectedItem img={data.img} name={data.name} />
  )
}