import type { Character } from "../types/characters";

function downloadCSV(characters: Character[]): void {
  const headers = ['Name', 'Actor', 'Occupation', 'Episodes Count', 'ID'];

  const rows = characters.map(character => [
    formatFields(character.name),
    formatFields(character.actor.join(', ')),
    formatFields(character.occupation.join(', ')),
    character.episodes.length.toString(),
    character.id
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8'});

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = `${characters.length}_items.csv`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatFields(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }

  return field;
}

export default downloadCSV;