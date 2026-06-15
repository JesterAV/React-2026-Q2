export interface Character {
  name: string 
  img: string 
  actor: string[]
  episodes: {title: string, id: string}[]
  occupation: string[]
  id: string
}