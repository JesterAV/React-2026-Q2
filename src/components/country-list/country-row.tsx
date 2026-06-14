import type { Country } from "../../types"
import type { RowComponentProps } from 'react-window';
import { CountryCard } from "../country-card/country-card";

interface CountryRowProps {
  countries: Country[];
  selectedYear: number;
  selectedColumns: string[];
}

export const CountryRow = (props: RowComponentProps<CountryRowProps>) => {
  const { style, countries, index, selectedColumns, selectedYear } = props;
  const country = countries[index];

  if (!country) return null;

  return (
    <div style={style}>
      <CountryCard
        key={country.id}
        country={country}
        selectedColumns={selectedColumns}
        selectedYear={selectedYear}
      />
    </div>
  )
}