import type { Country } from '../../types';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';
import { CountryRow } from './country-row';

import styles from './country-list.module.css';
import { useMemo } from 'react';
import { List, useDynamicRowHeight } from 'react-window';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

export const CountryList = ({
  countries,
  searchQuery,
  selectedColumns,
  selectedRegion,
  selectedYear,
  sortField,
  sortOrder,
}: CountryListProps) => {
  const filteredCountries = useMemo(() => {
    const filtered = countries
      .filter((c) => {
      const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);
      return matchesSearch && matchesRegion;
    })

    const populationCache = new Map(filtered.map(c => [c.id, getPopulationForYear(createYearDataMap(c.data), selectedYear) ?? 0]));

    return filtered.sort((a, b) => {
      if (sortField === 'name') return (sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id));
      const populationA = populationCache.get(a.id)!;
      const populationB = populationCache.get(b.id)!;
      return sortOrder === 'asc' ? populationA - populationB : populationB - populationA;
    });
  }, [countries, searchQuery, selectedYear, selectedRegion, sortField, sortOrder]);

  const rowProps = useMemo(() => ({
    countries: filteredCountries,
    selectedColumns: selectedColumns,
    selectedYear: selectedYear
  }), [filteredCountries, selectedColumns, selectedYear]);

  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 200
  })

  return (
    <div className={styles.countryList} style={{height: '600px'}}>
      <List 
        rowComponent={CountryRow}
        rowProps={rowProps}
        rowCount={filteredCountries.length}
        overscanCount={1}
        rowHeight={rowHeight}
      />
    </div>
  );
};
